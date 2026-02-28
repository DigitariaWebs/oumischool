import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Modal,
  TextInput,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronRight,
  BookOpen,
  Calendar,
  Plus,
  X,
  Share2,
  Check,
  FileText,
  Clock,
  Users,
  Download,
  Upload,
  Lock,
  Unlock,
} from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";

import {
  resolveResourceUrl,
  useResources,
  useTrackResourceDownload,
  useUploadResource,
} from "@/hooks/api/resources";
import {
  useMySessions,
  useMyStudents,
  useMyTutorProfile,
} from "@/hooks/api/tutors";
import { useAppSelector } from "@/store/hooks";
import { resolveSubjectDisplayName } from "@/utils/sessionDisplay";

const STUDENT_IMAGES = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
];

const SUBJECT_NORMALIZATION: Record<string, string> = {
  Maths: "Mathématiques",
  Math: "Mathématiques",
  Français: "Français",
  Sciences: "Sciences",
  Anglais: "Anglais",
};

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asDisplayString(value: unknown): string | null {
  if (typeof value === "string") return asNonEmptyString(value);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function looksLikeStudentIdentifier(value: string, studentId?: string | null) {
  const normalized = value.trim();
  if (!normalized) return true;
  if (studentId && normalized === studentId) return true;
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      normalized,
    )
  ) {
    return true;
  }
  if (/^[a-f0-9]{24}$/i.test(normalized)) return true;
  if (/^(child|student|user)[_-]?[0-9a-z-]+$/i.test(normalized)) return true;
  if (normalized.length > 20 && !/\s/.test(normalized)) return true;
  return false;
}

function resolveStudentDisplayName(item: any, studentId: string): string {
  const userFirstName = asNonEmptyString(item?.child?.user?.firstName);
  const userLastName = asNonEmptyString(item?.child?.user?.lastName);
  const composedUserName = [userFirstName ?? "", userLastName ?? ""]
    .join(" ")
    .trim();
  const emailPrefix = asNonEmptyString(item?.child?.user?.email)?.split("@")[0];
  const candidates = [
    asNonEmptyString(composedUserName),
    asNonEmptyString(item?.child?.fullName),
    asNonEmptyString(item?.child?.name),
    asNonEmptyString(item?.childName),
    asNonEmptyString(item?.studentName),
    asNonEmptyString(emailPrefix),
    asNonEmptyString(item?.name),
  ].filter((value): value is string => Boolean(value));

  const valid = candidates.find(
    (candidate) =>
      !looksLikeStudentIdentifier(candidate, studentId) &&
      !candidate.includes("@"),
  );
  return valid ?? "Élève";
}

function resolveStudentGrade(item: any, studentId: string): string {
  const candidates = [
    asDisplayString(item?.child?.grade),
    asDisplayString(item?.child?.level),
    asDisplayString(item?.grade),
    asDisplayString(item?.gradeLevel),
    asDisplayString(item?.classLevel),
    asDisplayString(item?.className),
  ].filter((value): value is string => Boolean(value));

  const valid = candidates.find(
    (candidate) => !looksLikeStudentIdentifier(candidate, studentId),
  );
  return valid ?? "—";
}

function subjectColor(subject: string): string {
  const key = subject.toLowerCase();
  if (key.includes("math")) return "#3B82F6";
  if (key.includes("fr")) return "#EF4444";
  if (key.includes("science")) return "#10B981";
  if (key.includes("english")) return "#06B6D4";
  return "#6366F1";
}

function formatSessionTimeLabel(start: Date): string {
  return `${String(start.getHours()).padStart(2, "0")}:${String(
    start.getMinutes(),
  ).padStart(2, "0")}`;
}

export default function TutorDashboardScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const userName = user?.name || "Tuteur";
  const { data: apiResources = [] } = useResources();
  const { data: myStudentsData = [] } = useMyStudents();
  const { data: mySessionsData = [] } = useMySessions();
  const { data: tutorProfile } = useMyTutorProfile();
  const uploadResourceMutation = useUploadResource();
  const trackDownloadMutation = useTrackResourceDownload();

  const [isAvailable, setIsAvailable] = useState(true);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [newResource, setNewResource] = useState({
    title: "",
    type: "PDF",
    targetStudentId: "",
    subject: "",
    isPaid: false,
    price: "",
    uploadedFileName: "",
    uploadedFileUri: "", // URI locale réelle du fichier uploadé
    uploadedFileSize: "",
    uploadedFileMimeType: "",
  });

  const tutorSubjects = useMemo(() => {
    return tutorProfile?.subjects ?? [];
  }, [tutorProfile]);

  const students = useMemo(
    () =>
      (Array.isArray(myStudentsData) ? myStudentsData : []).map(
        (item: any, index: number) => {
          const childId =
            asNonEmptyString(item?.child?.id) ??
            asNonEmptyString(item?.childId) ??
            `student-${index}`;
          const subject = resolveSubjectDisplayName(item, "Matière");
          return {
            id: childId,
            name: resolveStudentDisplayName(item, childId),
            grade: resolveStudentGrade(item, childId),
            subject,
            subjectColor: subjectColor(subject),
            image:
              item?.child?.avatar ??
              STUDENT_IMAGES[index % STUDENT_IMAGES.length],
          };
        },
      ),
    [myStudentsData],
  );

  const sessions = useMemo(
    () =>
      (Array.isArray(mySessionsData) ? mySessionsData : [])
        .map((session: any) => {
          const start = new Date(session?.startTime ?? Date.now());
          const end = new Date(session?.endTime ?? Date.now());
          const durationMinutes = Math.max(
            30,
            Math.round((end.getTime() - start.getTime()) / 60000),
          );
          const studentId =
            asNonEmptyString(session?.child?.id) ??
            asNonEmptyString(session?.childId) ??
            "";
          const studentName =
            students.find((s) => s.id === studentId)?.name ??
            resolveStudentDisplayName(session, studentId);
          const subject = resolveSubjectDisplayName(session, "Cours");
          return {
            id: asNonEmptyString(session?.id) ?? `session-${Math.random()}`,
            studentId,
            student: studentName,
            time: formatSessionTimeLabel(start),
            duration: `${durationMinutes}min`,
            subject,
            color: subjectColor(subject),
          };
        })
        .slice(0, 5),
    [mySessionsData, students],
  );
  const todaySessionsCount = useMemo(() => {
    const rows = Array.isArray(mySessionsData) ? mySessionsData : [];
    const today = new Date();
    return rows.filter((session: any) => {
      const start = new Date(session?.startTime ?? "");
      if (Number.isNaN(start.getTime())) return false;
      return (
        start.getFullYear() === today.getFullYear() &&
        start.getMonth() === today.getMonth() &&
        start.getDate() === today.getDate()
      );
    }).length;
  }, [mySessionsData]);

  useEffect(() => {
    if (!newResource.targetStudentId && students[0]?.id) {
      setNewResource((prev) => ({ ...prev, targetStudentId: students[0].id }));
    }
  }, [newResource.targetStudentId, students]);

  const formatServerFileSize = (value: string | null) => {
    if (!value) return "—";
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return value;
    if (numeric >= 1024 * 1024) {
      return `${(numeric / (1024 * 1024)).toFixed(1)} MB`;
    }
    if (numeric >= 1024) {
      return `${Math.round(numeric / 1024)} KB`;
    }
    return `${numeric} B`;
  };

  const formatResourceType = (value: string) => {
    switch (value) {
      case "document":
        return "PDF";
      case "video":
        return "Vidéo";
      case "audio":
        return "Audio";
      case "image":
        return "Image";
      default:
        return "Fichier";
    }
  };

  const resources = apiResources.map((resource) => ({
    id: resource.id,
    title: resource.title,
    type: formatResourceType(resource.type),
    date: new Date(resource.createdAt).toLocaleDateString("fr-FR"),
    downloads: resource.downloads,
    url: resolveResourceUrl(resource.fileUrl),
    size: formatServerFileSize(resource.fileSize),
    isPaid: resource.tags.includes("paid"),
  }));

  // Ouvre le modal ressource pré-rempli depuis une session du planning
  const handleAddResourceFromSession = (session: (typeof sessions)[0]) => {
    const student = students.find((s) => s.id === session.studentId);
    const sessionSubject = session.subject || "";
    const defaultSubject = tutorSubjects.includes(sessionSubject)
      ? sessionSubject
      : tutorSubjects[0] || "";
    setNewResource({
      title: `Ressource - ${session.subject} (${session.student})`,
      type: "PDF",
      targetStudentId: student?.id ?? "",
      subject: defaultSubject,
      isPaid: false,
      price: "",
      uploadedFileName: "",
      uploadedFileUri: "",
      uploadedFileSize: "",
      uploadedFileMimeType: "",
    });
    setShowPlanningModal(false);
    setShowResourceModal(true);
  };

  // Simule un document picker (remplacer par expo-document-picker si dispo)
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "video/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const sizeInKB = asset.size ? Math.round(asset.size / 1024) : null;
        const sizeLabel = sizeInKB
          ? sizeInKB >= 1024
            ? `${(sizeInKB / 1024).toFixed(1)} MB`
            : `${sizeInKB} KB`
          : "—";

        setNewResource((prev) => ({
          ...prev,
          uploadedFileName: asset.name,
          uploadedFileUri: asset.uri,
          uploadedFileSize: sizeLabel,
          uploadedFileMimeType: asset.mimeType ?? "",
        }));
      }
    } catch {
      Alert.alert("Erreur", "Impossible d'ouvrir le sélecteur de fichiers.");
    }
  };

  const handleOpenPDF = (url: string, title: string) => {
    if (!url) {
      Alert.alert(
        "Fichier indisponible",
        "Aucun lien valide pour cette ressource.",
      );
      return;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert("Erreur", "Impossible d'ouvrir le fichier");
    });
  };

  const handleDownloadPDF = (
    url: string,
    title: string,
    resourceId?: string,
  ) => {
    if (!url) {
      Alert.alert(
        "Fichier indisponible",
        "Aucun lien valide pour cette ressource.",
      );
      return;
    }
    Alert.alert("Téléchargement", `Voulez-vous télécharger "${title}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Télécharger",
        onPress: async () => {
          if (resourceId) {
            try {
              await trackDownloadMutation.mutateAsync(resourceId);
            } catch {
              // Non-blocking analytics update
            }
          }
          Linking.openURL(url).catch(() => {
            Alert.alert(
              "Erreur",
              "Impossible d'ouvrir le lien de téléchargement.",
            );
          });
        },
      },
    ]);
  };

  const handleAddResource = async () => {
    if (!newResource.title) {
      Alert.alert("Erreur", "Veuillez donner un titre à la ressource.");
      return;
    }
    if (!newResource.uploadedFileUri) {
      Alert.alert("Erreur", "Veuillez uploader un fichier.");
      return;
    }
    if (!newResource.subject) {
      Alert.alert("Erreur", "Veuillez sélectionner une matière.");
      return;
    }
    if (newResource.isPaid && !newResource.price) {
      Alert.alert("Erreur", "Veuillez indiquer le prix de la ressource.");
      return;
    }

    const targetStudent = students.find(
      (student) => student.id === newResource.targetStudentId,
    );
    const normalizedSubject =
      SUBJECT_NORMALIZATION[newResource.subject] ?? newResource.subject;
    const normalizedType =
      newResource.type === "Vidéo"
        ? "video"
        : newResource.type === "Quiz"
          ? "other"
          : "document";

    const formData = new FormData();
    formData.append("title", newResource.title.trim());
    formData.append("subject", normalizedSubject);
    formData.append("type", normalizedType);
    formData.append("status", "PUBLISHED");
    formData.append(
      "tags",
      targetStudent?.name ? `student:${targetStudent.name}` : "student",
    );
    if (newResource.isPaid) {
      formData.append("tags", "paid");
      formData.append("tags", `price:${newResource.price}`);
      formData.append("isPaid", "true");
      formData.append(
        "price",
        String(Math.round(parseFloat(newResource.price) * 100)),
      );
    } else {
      formData.append("tags", "free");
      formData.append("isPaid", "false");
    }

    formData.append("file", {
      uri: newResource.uploadedFileUri,
      name: newResource.uploadedFileName || `resource-${Date.now()}.pdf`,
      type: newResource.uploadedFileMimeType || "application/pdf",
    } as any);

    try {
      setIsUploading(true);
      await uploadResourceMutation.mutateAsync(formData);
      Alert.alert(
        "🚀 Ressource Partagée",
        `"${newResource.title}" a été uploadée et publiée.`,
        [{ text: "Super !", onPress: () => setShowResourceModal(false) }],
      );
      setNewResource({
        title: "",
        type: "PDF",
        targetStudentId: students[0]?.id ?? "",
        subject: tutorSubjects[0] || "",
        isPaid: false,
        price: "",
        uploadedFileName: "",
        uploadedFileUri: "",
        uploadedFileSize: "",
        uploadedFileMimeType: "",
      });
    } catch (error) {
      Alert.alert(
        "Upload impossible",
        error instanceof Error
          ? error.message
          : "Le serveur a rejeté le fichier.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!newResource.title) {
      Alert.alert("Erreur", "Veuillez donner un titre à la ressource.");
      return;
    }
    if (!newResource.uploadedFileUri) {
      Alert.alert("Erreur", "Veuillez uploader un fichier.");
      return;
    }
    if (!newResource.subject) {
      Alert.alert("Erreur", "Veuillez sélectionner une matière.");
      return;
    }

    const targetStudent = students.find(
      (student) => student.id === newResource.targetStudentId,
    );
    const normalizedSubject =
      SUBJECT_NORMALIZATION[newResource.subject] ?? newResource.subject;
    const normalizedType =
      newResource.type === "Vidéo"
        ? "video"
        : newResource.type === "Quiz"
          ? "other"
          : "document";

    const formData = new FormData();
    formData.append("title", newResource.title.trim());
    formData.append("subject", normalizedSubject);
    formData.append("type", normalizedType);
    formData.append("status", "DRAFT");
    formData.append(
      "tags",
      targetStudent?.name ? `student:${targetStudent.name}` : "student",
    );
    if (newResource.isPaid) {
      formData.append("tags", "paid");
      formData.append("tags", `price:${newResource.price}`);
      formData.append("isPaid", "true");
      formData.append(
        "price",
        String(Math.round(parseFloat(newResource.price) * 100)),
      );
    } else {
      formData.append("tags", "free");
      formData.append("isPaid", "false");
    }

    formData.append("file", {
      uri: newResource.uploadedFileUri,
      name: newResource.uploadedFileName || `resource-${Date.now()}.pdf`,
      type: newResource.uploadedFileMimeType || "application/pdf",
    } as any);

    try {
      setIsUploading(true);
      await uploadResourceMutation.mutateAsync(formData);
      Alert.alert(
        "💾 Brouillon enregistré",
        `"${newResource.title}" a été enregistré en brouillon.`,
        [{ text: "OK", onPress: () => setShowResourceModal(false) }],
      );
      setNewResource({
        title: "",
        type: "PDF",
        targetStudentId: students[0]?.id ?? "",
        subject: tutorSubjects[0] || "",
        isPaid: false,
        price: "",
        uploadedFileName: "",
        uploadedFileUri: "",
        uploadedFileSize: "",
        uploadedFileMimeType: "",
      });
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer le brouillon.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLabel}>MON ESPACE</Text>
            <View style={styles.headerNameRow}>
              <Text style={styles.headerGreeting}>Bonjour, </Text>
              <Text style={styles.headerName}>{userName}</Text>
            </View>
            <Text style={styles.headerSub}>
              Prêt pour les cours d&apos;aujourd&apos;hui ?
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View
              style={[
                styles.availabilityPill,
                {
                  backgroundColor: isAvailable ? "#ECFDF5" : "#F8FAFC",
                  borderColor: isAvailable ? "#6EE7B7" : "#E2E8F0",
                },
              ]}
            >
              <View
                style={[
                  styles.availabilityDot,
                  { backgroundColor: isAvailable ? "#10B981" : "#94A3B8" },
                ]}
              />
              <Text
                style={[
                  styles.availabilityText,
                  { color: isAvailable ? "#10B981" : "#94A3B8" },
                ]}
              >
                {isAvailable ? "Dispo" : "Occupé"}
              </Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: "#CBD5E1", true: "#10B981" }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
            />
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{resources.length}</Text>
              <Text style={styles.statLabel}>Ressources</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{todaySessionsCount}</Text>
              <Text style={styles.statLabel}>Cours ajd</Text>
            </View>
          </View>
        </View>

        {/* BOUTON AJOUTER */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.mainAddButton}
            onPress={() => setShowResourceModal(true)}
          >
            <View style={styles.plusIconBg}>
              <Plus size={24} color="white" />
            </View>
            <View>
              <Text style={styles.addTitle}>Partager une ressource</Text>
              <Text style={styles.addSubTitle}>
                Visible par les parents et élèves
              </Text>
            </View>
            <Share2 size={20} color="#6366F1" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        </View>

        {/* ESPACE DE TRAVAIL — 3 boutons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Espace de travail</Text>
          <View style={styles.quickActions}>
            {/* Bibliothèque */}
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => setShowLibraryModal(true)}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#8B5CF6" }]}>
                <BookOpen color="white" size={20} />
              </View>
              <Text style={styles.quickActionLabel}>Bibliothèque</Text>
              <View
                style={[
                  styles.notificationBadge,
                  { backgroundColor: "#8B5CF6" },
                ]}
              >
                <Text style={styles.notificationText}>{resources.length}</Text>
              </View>
            </TouchableOpacity>

            {/* Planning → onglet sessions */}
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/(tabs-tutor)/sessions")}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#10B981" }]}>
                <Calendar color="white" size={20} />
              </View>
              <Text style={styles.quickActionLabel}>Planning</Text>
              <View
                style={[
                  styles.notificationBadge,
                  { backgroundColor: "#10B981" },
                ]}
              >
                <Text style={styles.notificationText}>2</Text>
              </View>
            </TouchableOpacity>

            {/* Élèves → onglet availability */}
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/(tabs-tutor)/availability")}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#F59E0B" }]}>
                <Users color="white" size={20} />
              </View>
              <Text style={styles.quickActionLabel}>Élèves</Text>
              <View
                style={[
                  styles.notificationBadge,
                  { backgroundColor: "#F59E0B" },
                ]}
              >
                <Text style={styles.notificationText}>{students.length}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showResourceModal}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentTall}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Partager une ressource</Text>
                <TouchableOpacity
                  onPress={() => {
                    setNewResource({
                      title: "",
                      type: "PDF",
                      targetStudentId: students[0]?.id ?? "",
                      subject: tutorSubjects[0] || "",
                      isPaid: false,
                      price: "",
                      uploadedFileName: "",
                      uploadedFileUri: "",
                      uploadedFileSize: "",
                      uploadedFileMimeType: "",
                    });
                    setShowResourceModal(false);
                  }}
                >
                  <X size={24} color="#1E293B" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 30 }}
              >
                {/* Titre */}
                <Text style={styles.inputLabel}>
                  Titre de la leçon ou exercice
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Le cycle de l'eau (Support PDF)"
                  value={newResource.title}
                  onChangeText={(t) =>
                    setNewResource((prev) => ({ ...prev, title: t }))
                  }
                />

                {/* ── UPLOAD FICHIER ── */}
                <Text style={styles.inputLabel}>Fichier à partager</Text>
                <TouchableOpacity
                  style={styles.uploadZone}
                  onPress={handlePickFile}
                >
                  {newResource.uploadedFileName ? (
                    <View style={styles.uploadedFile}>
                      <FileText size={18} color="#6366F1" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.uploadedFileName} numberOfLines={1}>
                          {newResource.uploadedFileName}
                        </Text>
                        {newResource.uploadedFileSize ? (
                          <Text style={styles.uploadedFileSize}>
                            {newResource.uploadedFileSize}
                          </Text>
                        ) : null}
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          setNewResource((prev) => ({
                            ...prev,
                            uploadedFileName: "",
                            uploadedFileUri: "",
                            uploadedFileSize: "",
                            uploadedFileMimeType: "",
                          }))
                        }
                      >
                        <X size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <Upload size={22} color="#6366F1" />
                      <Text style={styles.uploadLabel}>
                        Appuyez pour uploader
                      </Text>
                      <Text style={styles.uploadSub}>PDF, image, vidéo…</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Matière */}
                <Text style={styles.inputLabel}>Matière</Text>
                <View style={styles.studentPicker}>
                  {tutorSubjects.length === 0 ? (
                    <Text style={{ color: "#EF4444", fontSize: 12 }}>
                      {
                        "Aucune matière assignée. Veuillez contacter l'administration."
                      }
                    </Text>
                  ) : (
                    tutorSubjects.map((subject) => (
                      <TouchableOpacity
                        key={subject}
                        style={[
                          styles.studentOption,
                          newResource.subject === subject &&
                            styles.studentOptionActive,
                        ]}
                        onPress={() =>
                          setNewResource((prev) => ({
                            ...prev,
                            subject,
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.studentOptionText,
                            newResource.subject === subject &&
                              styles.studentOptionTextActive,
                          ]}
                        >
                          {SUBJECT_NORMALIZATION[subject] ?? subject}
                        </Text>
                        {newResource.subject === subject && (
                          <Check size={14} color="white" />
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </View>

                {/* Élève cible */}
                <Text style={styles.inputLabel}>Pour quel élève ?</Text>
                <View style={styles.studentPicker}>
                  {students.map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      style={[
                        styles.studentOption,
                        newResource.targetStudentId === s.id &&
                          styles.studentOptionActive,
                      ]}
                      onPress={() =>
                        setNewResource((prev) => ({
                          ...prev,
                          targetStudentId: s.id,
                        }))
                      }
                    >
                      <Image
                        source={{ uri: s.image }}
                        style={styles.miniAvatar}
                      />
                      <Text
                        style={[
                          styles.studentOptionText,
                          newResource.targetStudentId === s.id &&
                            styles.studentOptionTextActive,
                        ]}
                      >
                        {s.name}
                      </Text>
                      {newResource.targetStudentId === s.id && (
                        <Check size={14} color="white" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Format */}
                <Text style={styles.inputLabel}>Format</Text>
                <View style={styles.typeRow}>
                  {["PDF", "Quiz", "Vidéo"].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.typeChip,
                        newResource.type === t && styles.typeChipActive,
                      ]}
                      onPress={() =>
                        setNewResource((prev) => ({ ...prev, type: t }))
                      }
                    >
                      <Text
                        style={[
                          styles.typeChipText,
                          newResource.type === t && styles.typeChipTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* ── PAYANT / GRATUIT ── */}
                <Text style={styles.inputLabel}>Accès</Text>
                <View style={styles.paidRow}>
                  <TouchableOpacity
                    style={[
                      styles.paidChip,
                      !newResource.isPaid && styles.paidChipActiveGreen,
                    ]}
                    onPress={() =>
                      setNewResource((prev) => ({
                        ...prev,
                        isPaid: false,
                        price: "",
                      }))
                    }
                  >
                    <Unlock
                      size={14}
                      color={!newResource.isPaid ? "white" : "#64748B"}
                    />
                    <Text
                      style={[
                        styles.paidChipText,
                        !newResource.isPaid && styles.paidChipTextActive,
                      ]}
                    >
                      Gratuit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.paidChip,
                      newResource.isPaid && styles.paidChipActivePurple,
                    ]}
                    onPress={() =>
                      setNewResource((prev) => ({ ...prev, isPaid: true }))
                    }
                  >
                    <Lock
                      size={14}
                      color={newResource.isPaid ? "white" : "#64748B"}
                    />
                    <Text
                      style={[
                        styles.paidChipText,
                        newResource.isPaid && styles.paidChipTextActive,
                      ]}
                    >
                      Payant
                    </Text>
                  </TouchableOpacity>
                </View>

                {newResource.isPaid && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceSymbol}>€</Text>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="Prix (ex: 4.99)"
                      keyboardType="decimal-pad"
                      value={newResource.price}
                      onChangeText={(t) =>
                        setNewResource((prev) => ({ ...prev, price: t }))
                      }
                    />
                  </View>
                )}

                {isUploading && (
                  <View style={styles.uploadingOverlay}>
                    <Text style={styles.uploadingText}>Upload en cours...</Text>
                  </View>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.submitBtn, styles.draftBtn]}
                    onPress={handleSaveDraft}
                    disabled={isUploading}
                  >
                    <Text style={styles.draftBtnText}>Sauvegarder</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.submitBtn, styles.publishBtn]}
                    onPress={handleAddResource}
                    disabled={isUploading}
                  >
                    <Text style={styles.submitBtnText}>Publier</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ─────────────────────────────────────────────
          MODAL BIBLIOTHÈQUE
      ───────────────────────────────────────────── */}
      <Modal
        visible={showLibraryModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <BookOpen size={20} color="#6366F1" />
                <Text style={styles.modalTitle}>Ma Bibliothèque</Text>
              </View>
              <TouchableOpacity onPress={() => setShowLibraryModal(false)}>
                <X size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Vos dernières ressources partagées
            </Text>

            <ScrollView style={styles.modalList}>
              {resources.map((resource) => (
                <View key={resource.id} style={styles.resourceItem}>
                  <View style={styles.resourceIcon}>
                    <FileText size={16} color="#6366F1" />
                  </View>
                  <View style={styles.resourceInfo}>
                    <View style={styles.resourceTitleRow}>
                      <Text style={styles.resourceTitle}>{resource.title}</Text>
                      <View
                        style={[
                          styles.paidBadge,
                          {
                            backgroundColor: resource.isPaid
                              ? "#EEF2FF"
                              : "#F0FDF4",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.paidBadgeText,
                            { color: resource.isPaid ? "#6366F1" : "#10B981" },
                          ]}
                        >
                          {resource.isPaid ? "Payant" : "Gratuit"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.resourceMeta}>
                      <Text style={styles.resourceType}>{resource.type}</Text>
                      <Text style={styles.resourceDot}>•</Text>
                      <Text style={styles.resourceDate}>{resource.date}</Text>
                      <Text style={styles.resourceDot}>•</Text>
                      <Text style={styles.resourceSize}>{resource.size}</Text>
                    </View>
                  </View>
                  <View style={styles.resourceActions}>
                    <TouchableOpacity
                      style={styles.resourceAction}
                      onPress={() =>
                        handleOpenPDF(resource.url, resource.title)
                      }
                    >
                      <BookOpen size={16} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.resourceAction}
                      onPress={() =>
                        handleDownloadPDF(
                          resource.url,
                          resource.title,
                          typeof resource.id === "string"
                            ? resource.id
                            : undefined,
                        )
                      }
                    >
                      <Download size={16} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowLibraryModal(false);
                setShowResourceModal(true);
              }}
            >
              <Plus size={16} color="white" />
              <Text style={styles.modalButtonText}>Ajouter une ressource</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─────────────────────────────────────────────
          MODAL PLANNING — avec bouton "Ajouter ressource" par session
      ───────────────────────────────────────────── */}
      <Modal
        visible={showPlanningModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Calendar size={20} color="#6366F1" />
                <Text style={styles.modalTitle}>Planning des cours</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPlanningModal(false)}>
                <X size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Vos prochaines sessions</Text>

            <ScrollView style={styles.modalList}>
              {sessions.length === 0 ? (
                <Text style={styles.emptySessionsText}>
                  Aucune session planifiée.
                </Text>
              ) : (
                sessions.map((session) => (
                  <View
                    key={session.id}
                    style={[
                      styles.sessionItem,
                      { borderLeftColor: session.color },
                    ]}
                  >
                    {/* Infos session */}
                    <TouchableOpacity
                      style={styles.sessionLeft}
                      onPress={() =>
                        Alert.alert(
                          "Session",
                          `Cours de ${session.subject} avec ${session.student}`,
                        )
                      }
                    >
                      <View style={styles.sessionTime}>
                        <Text style={styles.sessionTimeText}>
                          {session.time}
                        </Text>
                        <Text style={styles.sessionDuration}>
                          {session.duration}
                        </Text>
                      </View>
                      <View style={styles.sessionInfo}>
                        <Text style={styles.sessionStudent}>
                          {session.student}
                        </Text>
                        <View
                          style={[
                            styles.sessionSubjectBadge,
                            { backgroundColor: session.color + "15" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.sessionSubjectText,
                              { color: session.color },
                            ]}
                          >
                            {session.subject}
                          </Text>
                        </View>
                      </View>
                      <Clock size={14} color="#94A3B8" />
                    </TouchableOpacity>

                    {/* ── Bouton ajouter ressource depuis cette session ── */}
                    <TouchableOpacity
                      style={styles.sessionAddBtn}
                      onPress={() => handleAddResourceFromSession(session)}
                    >
                      <Plus size={12} color="#6366F1" />
                      <Text style={styles.sessionAddBtnText}>Ressource</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowPlanningModal(false);
                router.push("/(tabs-tutor)/sessions");
              }}
            >
              <Calendar size={16} color="white" />
              <Text style={styles.modalButtonText}>Voir le planning</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingBottom: 140 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: { flex: 1 },
  headerLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6366F1",
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerNameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  headerGreeting: { fontSize: 26, fontWeight: "300", color: "#64748B" },
  headerName: { fontSize: 26, fontWeight: "800", color: "#1E293B" },
  headerSub: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 4,
    fontWeight: "400",
  },
  headerRight: { alignItems: "center", gap: 6, paddingTop: 4 },
  availabilityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  availabilityDot: { width: 6, height: 6, borderRadius: 3 },
  availabilityText: { fontSize: 11, fontWeight: "700" },

  statsCard: {
    marginHorizontal: 24,
    backgroundColor: "#F8FAFC",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#1E293B" },
  statLabel: { fontSize: 12, color: "#64748B" },
  statDivider: { width: 1, height: 30, backgroundColor: "#E2E8F0" },

  section: { paddingHorizontal: 24, marginTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  seeAllBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { fontSize: 13, color: "#6366F1", fontWeight: "600" },

  addStudentCard: {
    width: 80,
    padding: 12,
    backgroundColor: "#F5F7FF",
    borderRadius: 18,
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: "#E0E7FF",
    borderStyle: "dashed",
    justifyContent: "center",
    minHeight: 100,
  },
  addStudentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  addStudentText: { fontSize: 11, color: "#6366F1", fontWeight: "600" },

  mainAddButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FF",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    borderStyle: "dashed",
  },
  plusIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  addTitle: { fontSize: 16, fontWeight: "bold", color: "#1E293B" },
  addSubTitle: { fontSize: 12, color: "#64748B" },

  studentSmallCard: {
    width: 100,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  studentSmallAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  studentSmallName: { fontSize: 13, fontWeight: "600" },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  miniBadgeText: { color: "white", fontSize: 8, fontWeight: "bold" },

  quickActions: { flexDirection: "row", gap: 10 },
  quickAction: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 18,
    position: "relative",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: { fontSize: 12, color: "#475569", fontWeight: "600" },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#8B5CF6",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: { color: "white", fontSize: 10, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: "90%",
  },
  modalContentTall: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    flex: 1,
    marginTop: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  modalTitleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  modalSubtitle: { fontSize: 14, color: "#64748B", marginBottom: 20 },
  modalList: { maxHeight: 400 },
  emptySessionsText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    paddingVertical: 16,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },
  modalButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

  // ── Upload zone ──
  uploadZone: {
    borderWidth: 2,
    borderColor: "#E0E7FF",
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F5F7FF",
    marginBottom: 4,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
    marginTop: 6,
  },
  uploadSub: { fontSize: 11, color: "#94A3B8", marginTop: 2 },
  uploadedFile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  uploadedFileName: { fontSize: 13, color: "#1E293B", fontWeight: "600" },
  uploadedFileSize: { fontSize: 11, color: "#94A3B8", marginTop: 2 },

  // ── Payant/Gratuit ──
  paidRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  paidChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  paidChipActiveGreen: { backgroundColor: "#10B981", borderColor: "#10B981" },
  paidChipActivePurple: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  paidChipText: { fontSize: 14, fontWeight: "600", color: "#64748B" },
  paidChipTextActive: { color: "white" },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  priceSymbol: { fontSize: 18, color: "#64748B", marginRight: 8 },
  priceInput: { flex: 1, fontSize: 16, paddingVertical: 14, color: "#1E293B" },

  // ── Badge payant dans bibliothèque ──
  resourceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  paidBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  paidBadgeText: { fontSize: 9, fontWeight: "700" },

  // Resource item styles
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  resourceIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  resourceInfo: { flex: 1 },
  resourceTitle: { fontSize: 13, fontWeight: "600", color: "#1E293B" },
  resourceMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  resourceType: { fontSize: 11, color: "#6366F1", fontWeight: "600" },
  resourceDot: { fontSize: 11, color: "#CBD5E1" },
  resourceDate: { fontSize: 11, color: "#64748B" },
  resourceSize: { fontSize: 11, color: "#64748B" },
  resourceActions: { flexDirection: "row", gap: 8 },
  resourceAction: { padding: 8 },

  // Session item styles — layout modifié pour inclure le bouton ressource
  sessionItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  sessionLeft: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  sessionTime: { marginRight: 14 },
  sessionTimeText: { fontSize: 15, fontWeight: "600", color: "#1E293B" },
  sessionDuration: { fontSize: 11, color: "#64748B" },
  sessionInfo: { flex: 1 },
  sessionStudent: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  sessionSubjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  sessionSubjectText: { fontSize: 10, fontWeight: "600" },
  sessionAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#F0F4FF",
  },
  sessionAddBtnText: { fontSize: 12, color: "#6366F1", fontWeight: "600" },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 10,
    marginTop: 10,
  },
  inputLabelSmall: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    marginVertical: 6,
  },
  input: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 4,
  },
  studentPicker: { flexDirection: "row", gap: 10, marginBottom: 15 },
  studentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flex: 1,
    gap: 8,
  },
  studentOptionActive: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  miniAvatar: { width: 24, height: 24, borderRadius: 12 },
  studentOptionText: { fontSize: 12, fontWeight: "600", color: "#1E293B" },
  studentOptionTextActive: { color: "white" },
  typeRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  typeChipActive: { backgroundColor: "#1E293B", borderColor: "#1E293B" },
  typeChipText: { color: "#64748B", fontWeight: "600" },
  typeChipTextActive: { color: "white" },
  submitBtn: {
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 15,
    alignItems: "center",
    elevation: 4,
    flex: 1,
  },
  submitBtnText: { color: "white", fontSize: 15, fontWeight: "bold" },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  draftBtn: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  draftBtnText: { color: "#64748B", fontSize: 15, fontWeight: "600" },
  publishBtn: {
    backgroundColor: "#6366F1",
  },
  uploadingOverlay: {
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  uploadingText: { color: "#6366F1", fontWeight: "600" },
});
