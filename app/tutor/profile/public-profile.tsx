import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  Save,
  Sparkles,
} from "lucide-react-native";

import { FONTS } from "@/config/fonts";
import { useMySessions } from "@/hooks/api/tutors";

function subjectMeta(subject: string) {
  const key = subject.toLowerCase();
  if (key.includes("math")) {
    return { color: "#3B82F6", icon: "📐", label: "Mathématiques" };
  }
  if (key.includes("fr")) {
    return { color: "#8B5CF6", icon: "📚", label: "Français" };
  }
  if (key.includes("phys")) {
    return { color: "#10B981", icon: "⚛️", label: "Physique" };
  }
  if (key.includes("chim")) {
    return { color: "#F59E0B", icon: "🧪", label: "Chimie" };
  }
  if (key.includes("english")) {
    return { color: "#06B6D4", icon: "🗣️", label: "Anglais" };
  }
  return { color: "#6366F1", icon: "📘", label: subject || "Matière" };
}

export default function PublicProfileSettings() {
  const router = useRouter();
  const { data: mySessionsData = [] } = useMySessions();
  const [profileActive, setProfileActive] = useState(true);
  const [showBio, setShowBio] = useState(true);
  const [showMethodology, setShowMethodology] = useState(true);
  const [showReviews, setShowReviews] = useState(true);
  const [showAvailability, setShowAvailability] = useState(true);
  const subjects = useMemo(() => {
    const grouped = new Map<string, number>();
    const rows = Array.isArray(mySessionsData) ? mySessionsData : [];
    rows.forEach((session: any) => {
      const subject = String(session?.subjectId ?? "").trim();
      if (!subject) return;
      grouped.set(subject, (grouped.get(subject) ?? 0) + 1);
    });
    if (!grouped.size) grouped.set("Mathématiques", 0);
    return Array.from(grouped.entries()).map(([name, count]) => {
      const meta = subjectMeta(name);
      return {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name: meta.label,
        color: meta.color,
        icon: meta.icon,
        count,
      };
    });
  }, [mySessionsData]);
  const curriculums = useMemo(
    () =>
      subjects.map((subject, index) => ({
        id: `curriculum-${subject.id}`,
        title: `Programme ${subject.name}`,
        subject: subject.name,
        subjectColor: subject.color,
        icon: subject.icon,
        lessonsCount: Math.max(1, subject.count),
        level: "Niveau personnalisé",
        order: index,
      })),
    [subjects],
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedCurriculums, setSelectedCurriculums] = useState<string[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "profile",
  );

  useEffect(() => {
    setSelectedSubjects((prev) => {
      const available = new Set(subjects.map((subject) => subject.id));
      const kept = prev.filter((id) => available.has(id));
      return kept.length
        ? kept
        : subjects.slice(0, 3).map((subject) => subject.id);
    });
  }, [subjects]);

  useEffect(() => {
    setSelectedCurriculums((prev) => {
      const available = new Set(curriculums.map((curriculum) => curriculum.id));
      const kept = prev.filter((id) => available.has(id));
      return kept.length
        ? kept
        : curriculums.slice(0, 2).map((curriculum) => curriculum.id);
    });
  }, [curriculums]);

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );
  };

  const toggleCurriculum = (curriculumId: string) => {
    setSelectedCurriculums((prev) =>
      prev.includes(curriculumId)
        ? prev.filter((id) => id !== curriculumId)
        : [...prev, curriculumId],
    );
  };

  const handleSave = () => {
    console.log("Saving profile settings:", {
      profileActive,
      showBio,
      showMethodology,
      showReviews,
      showAvailability,
      selectedSubjects,
      selectedCurriculums,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Boule violette décorative */}
      <View style={styles.purpleBlob} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil public</Text>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => router.push("/tutor/1")}
        >
          <Eye size={18} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Sparkles size={16} color="#6366F1" />
          <Text style={styles.infoText}>
            Personnalisez ce que les parents voient sur votre profil
          </Text>
        </View>

        {/* Activation du profil */}
        <View style={styles.section}>
          <View style={styles.activationCard}>
            <View style={styles.activationLeft}>
              {profileActive ? (
                <View
                  style={[styles.statusIcon, { backgroundColor: "#D1FAE5" }]}
                >
                  <Eye size={18} color="#10B981" />
                </View>
              ) : (
                <View
                  style={[styles.statusIcon, { backgroundColor: "#F1F5F9" }]}
                >
                  <EyeOff size={18} color="#64748B" />
                </View>
              )}
              <View>
                <Text style={styles.activationTitle}>
                  Profil {profileActive ? "actif" : "inactif"}
                </Text>
                <Text style={styles.activationSubtitle}>
                  {profileActive
                    ? "Visible par tous les parents"
                    : "Caché des recherches"}
                </Text>
              </View>
            </View>
            <Switch
              value={profileActive}
              onValueChange={setProfileActive}
              trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
              thumbColor="white"
            />
          </View>
        </View>

        {/* Sections du profil */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() =>
              setExpandedSection(
                expandedSection === "sections" ? null : "sections",
              )
            }
          >
            <View style={styles.sectionHeaderLeft}>
              <BookOpen size={16} color="#6366F1" />
              <Text style={styles.sectionTitle}>Sections à afficher</Text>
            </View>
            <ChevronDown
              size={16}
              color="#64748B"
              style={{
                transform: [
                  {
                    rotate: expandedSection === "sections" ? "180deg" : "0deg",
                  },
                ],
              }}
            />
          </TouchableOpacity>

          {expandedSection === "sections" && (
            <View style={styles.sectionContent}>
              {[
                { label: "Biographie", value: showBio, setter: setShowBio },
                {
                  label: "Méthodologie",
                  value: showMethodology,
                  setter: setShowMethodology,
                },
                {
                  label: "Avis et notes",
                  value: showReviews,
                  setter: setShowReviews,
                },
                {
                  label: "Disponibilités",
                  value: showAvailability,
                  setter: setShowAvailability,
                },
              ].map((item, index) => (
                <View key={index} style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>{item.label}</Text>
                  <Switch
                    value={item.value}
                    onValueChange={item.setter}
                    disabled={!profileActive}
                    trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                    thumbColor="white"
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Matières */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() =>
              setExpandedSection(
                expandedSection === "subjects" ? null : "subjects",
              )
            }
          >
            <View style={styles.sectionHeaderLeft}>
              <GraduationCap size={16} color="#6366F1" />
              <Text style={styles.sectionTitle}>Matières</Text>
            </View>
            <ChevronDown
              size={16}
              color="#64748B"
              style={{
                transform: [
                  {
                    rotate: expandedSection === "subjects" ? "180deg" : "0deg",
                  },
                ],
              }}
            />
          </TouchableOpacity>

          {expandedSection === "subjects" && (
            <View style={styles.sectionContent}>
              <View style={styles.subjectsGrid}>
                {subjects.map((subject) => {
                  const isSelected = selectedSubjects.includes(subject.id);
                  return (
                    <TouchableOpacity
                      key={subject.id}
                      style={[
                        styles.subjectCard,
                        isSelected && {
                          borderColor: subject.color,
                          backgroundColor: subject.color + "10",
                        },
                        !profileActive && styles.disabled,
                      ]}
                      onPress={() => toggleSubject(subject.id)}
                      disabled={!profileActive}
                    >
                      <View
                        style={[
                          styles.subjectIcon,
                          { backgroundColor: subject.color + "15" },
                        ]}
                      >
                        <Text style={styles.subjectEmoji}>{subject.icon}</Text>
                      </View>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      {isSelected && (
                        <CheckCircle2
                          size={14}
                          color={subject.color}
                          style={styles.subjectCheck}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Programmes */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() =>
              setExpandedSection(
                expandedSection === "curriculums" ? null : "curriculums",
              )
            }
          >
            <View style={styles.sectionHeaderLeft}>
              <BookOpen size={16} color="#6366F1" />
              <Text style={styles.sectionTitle}>Programmes</Text>
            </View>
            <ChevronDown
              size={16}
              color="#64748B"
              style={{
                transform: [
                  {
                    rotate:
                      expandedSection === "curriculums" ? "180deg" : "0deg",
                  },
                ],
              }}
            />
          </TouchableOpacity>

          {expandedSection === "curriculums" && (
            <View style={styles.sectionContent}>
              {curriculums.map((curriculum) => {
                const isSelected = selectedCurriculums.includes(curriculum.id);
                return (
                  <TouchableOpacity
                    key={curriculum.id}
                    style={[
                      styles.curriculumCard,
                      isSelected && { borderColor: curriculum.subjectColor },
                      !profileActive && styles.disabled,
                    ]}
                    onPress={() => toggleCurriculum(curriculum.id)}
                    disabled={!profileActive}
                  >
                    <View style={styles.curriculumLeft}>
                      <View
                        style={[
                          styles.curriculumIcon,
                          { backgroundColor: curriculum.subjectColor + "15" },
                        ]}
                      >
                        <Text style={styles.curriculumEmoji}>
                          {curriculum.icon}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.curriculumTitle}>
                          {curriculum.title}
                        </Text>
                        <Text style={styles.curriculumMeta}>
                          {curriculum.lessonsCount} leçons • {curriculum.level}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.curriculumCheck,
                        isSelected && {
                          backgroundColor: curriculum.subjectColor,
                        },
                      ]}
                    >
                      {isSelected && <CheckCircle2 size={12} color="white" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bouton de sauvegarde */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={18} color="white" />
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  purpleBlob: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#6366F1",
    top: -100,
    right: -100,
    opacity: 0.1,
    zIndex: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "#1E293B",
  },
  previewButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    zIndex: 1,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  section: {
    marginBottom: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  activationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  activationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  activationSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  toggleLabel: {
    fontSize: 14,
    color: "#1E293B",
  },
  subjectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  subjectCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    position: "relative",
  },
  subjectIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectEmoji: {
    fontSize: 20,
  },
  subjectName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
  },
  subjectCheck: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  curriculumCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  curriculumLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  curriculumIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  curriculumEmoji: {
    fontSize: 20,
  },
  curriculumTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  curriculumMeta: {
    fontSize: 11,
    color: "#64748B",
  },
  curriculumCheck: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex: 2,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#6366F1",
    borderRadius: 30,
    paddingVertical: 14,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
});
