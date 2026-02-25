import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Search,
  Plus,
  BookOpen,
  Calendar,
  MessageSquare,
  ChevronRight,
  Clock,
} from "lucide-react-native";
import { useMySessions, useMyStudents } from "@/hooks/api/tutors";
import { resolveSubjectDisplayName } from "@/utils/sessionDisplay";
import type { TutorStudentRow } from "@/hooks/api/tutors/api";

const STUDENT_IMAGES = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
];

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

function formatNextSession(dateInput: string | null): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "—";
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  return `${days[date.getDay()]} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function calculateAge(dateOfBirth?: string | null): number | null {
  if (!dateOfBirth) return null;
  const date = new Date(dateOfBirth);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return age;
}

export default function TutorStudentsScreen() {
  const router = useRouter();
  const { data: myStudentsData = [] } = useMyStudents();
  const { data: mySessionsData = [] } = useMySessions();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const students = useMemo(() => {
    const sessions = Array.isArray(mySessionsData) ? mySessionsData : [];
    return (Array.isArray(myStudentsData) ? myStudentsData : []).map(
      (item: TutorStudentRow, index: number) => {
        const id = asNonEmptyString(item?.child?.id) ?? `student-${index}`;
        const fullName = resolveStudentDisplayName(item, id);
        const subject = item?.primarySubject?.name
          ? item.primarySubject.name
          : resolveSubjectDisplayName(
              item as unknown as Record<string, unknown>,
              "Matière",
            );
        const studentSessions = sessions.filter((session: any) => {
          const sessionChildId =
            asNonEmptyString(session?.child?.id) ??
            asNonEmptyString(session?.childId);
          return sessionChildId === id;
        });
        const nextSession =
          studentSessions
            .map((session: any) => asNonEmptyString(session?.startTime))
            .filter((value): value is string => Boolean(value))
            .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0] ??
          null;

        return {
          id,
          name: fullName,
          fullName,
          grade: resolveStudentGrade(item, id),
          age: calculateAge(item?.child?.dateOfBirth) ?? 0,
          subject,
          subjectColor: item?.primarySubject?.color ?? subjectColor(subject),
          image:
            item?.child?.avatar ??
            STUDENT_IMAGES[index % STUDENT_IMAGES.length],
          sessionsTotal: item?.sessionsTotal ?? studentSessions.length,
          nextSession: formatNextSession(item?.nextSessionAt ?? nextSession),
          progress: Math.round(
            item?.progressScore ?? item?.child?.avgScore ?? 0,
          ),
          parentName:
            [item?.parent?.firstName ?? "", item?.parent?.lastName ?? ""]
              .join(" ")
              .trim() ||
            asNonEmptyString(item?.parent?.user?.email)?.split("@")[0] ||
            "Parent",
          notes: null,
        };
      },
    );
  }, [mySessionsData, myStudentsData]);

  const filtered = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes élèves</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            Alert.alert("Bientôt", "Ajout d'élève disponible prochainement.")
          }
        >
          <Plus size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* ── SEARCH ── */}
      <View style={styles.searchBar}>
        <Search size={16} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un élève ou matière..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── STATS RAPIDES ── */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{students.length}</Text>
            <Text style={styles.statPillLabel}>Élèves</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>
              {students.reduce((a, s) => a + s.sessionsTotal, 0)}
            </Text>
            <Text style={styles.statPillLabel}>Sessions total</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>
              {students.length
                ? Math.round(
                    students.reduce((a, s) => a + s.progress, 0) /
                      students.length,
                  )
                : 0}
            </Text>
            <Text style={styles.statPillLabel}>Progression moy.</Text>
          </View>
        </View>

        {/* ── LISTE ÉLÈVES ── */}
        <Text style={styles.sectionLabel}>Tous les élèves</Text>

        {filtered.map((student) => {
          const isOpen = selectedId === student.id;
          return (
            <View key={student.id}>
              {/* Carte principale */}
              <TouchableOpacity
                style={[styles.studentCard, isOpen && styles.studentCardOpen]}
                onPress={() => setSelectedId(isOpen ? null : student.id)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: student.image }} style={styles.avatar} />

                <View style={styles.studentInfo}>
                  <View style={styles.studentTopRow}>
                    <Text style={styles.studentName}>{student.fullName}</Text>
                    <View
                      style={[
                        styles.subjectBadge,
                        { backgroundColor: student.subjectColor + "18" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subjectText,
                          { color: student.subjectColor },
                        ]}
                      >
                        {student.subject}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.studentMeta}>
                    <Text style={styles.metaText}>
                      {student.grade} · {student.age} ans
                    </Text>
                    <View style={styles.metaDot} />
                    <Clock size={11} color="#94A3B8" />
                    <Text style={styles.metaText}>{student.nextSession}</Text>
                  </View>

                  {/* Barre de progression */}
                  <View style={styles.progressRow}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${student.progress}%` as any,
                            backgroundColor: student.subjectColor,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.progressLabel,
                        { color: student.subjectColor },
                      ]}
                    >
                      {student.progress}%
                    </Text>
                  </View>
                </View>

                <ChevronRight
                  size={16}
                  color="#CBD5E1"
                  style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
                />
              </TouchableOpacity>

              {/* ── DÉTAIL DÉROULANT ── */}
              {isOpen && (
                <View style={styles.detailPanel}>
                  {/* Infos parent */}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Parent</Text>
                    <Text style={styles.detailValue}>{student.parentName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailKey}>Sessions</Text>
                    <Text style={styles.detailValue}>
                      {student.sessionsTotal} cours effectués
                    </Text>
                  </View>

                  {/* Notes */}
                  {student.notes ? (
                    <View style={styles.notesBox}>
                      <Text style={styles.notesLabel}>📝 Notes</Text>
                      <Text style={styles.notesText}>{student.notes}</Text>
                    </View>
                  ) : null}

                  {/* Actions */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#EEF2FF" }]}
                      onPress={() => {
                        router.push({
                          pathname: "/(tabs-tutor)/sessions",
                          params: {
                            studentId: String(student.id),
                            studentName: student.fullName,
                          },
                        });
                      }}
                    >
                      <Calendar size={15} color="#6366F1" />
                      <Text
                        style={[styles.actionBtnText, { color: "#6366F1" }]}
                      >
                        Planifier
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#F0FDF4" }]}
                      onPress={() =>
                        Alert.alert(
                          "Ressource",
                          "Ouvre le partage de ressource",
                        )
                      }
                    >
                      <BookOpen size={15} color="#10B981" />
                      <Text
                        style={[styles.actionBtnText, { color: "#10B981" }]}
                      >
                        Ressource
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#FFF7ED" }]}
                      onPress={() =>
                        Alert.alert(
                          "Message",
                          `Contacter ${student.parentName}`,
                        )
                      }
                    >
                      <MessageSquare size={15} color="#F59E0B" />
                      <Text
                        style={[styles.actionBtnText, { color: "#F59E0B" }]}
                      >
                        Message
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Aucun élève trouvé</Text>
          </View>
        )}

        {/* Bouton ajouter élève */}
        <TouchableOpacity
          style={styles.addStudentBtn}
          onPress={() =>
            Alert.alert("Bientôt", "Ajout d'élève disponible prochainement.")
          }
        >
          <Plus size={18} color="#6366F1" />
          <Text style={styles.addStudentText}>Ajouter un élève</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { paddingBottom: 120 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B" },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginVertical: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1E293B", paddingVertical: 12 },

  // Stats rapides
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statPill: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statPillValue: { fontSize: 20, fontWeight: "800", color: "#1E293B" },
  statPillLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
    fontWeight: "600",
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1,
    marginHorizontal: 20,
    marginBottom: 12,
  },

  // Carte élève
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 2,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    gap: 12,
  },
  studentCardOpen: {
    borderColor: "#C7D2FE",
    backgroundColor: "#F5F7FF",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  studentInfo: { flex: 1 },
  studentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  studentName: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  subjectBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  subjectText: { fontSize: 10, fontWeight: "700" },
  studentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  metaText: { fontSize: 11, color: "#64748B" },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#CBD5E1" },

  // Progression
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  progressBar: {
    flex: 1,
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 10 },
  progressLabel: {
    fontSize: 11,
    fontWeight: "700",
    minWidth: 32,
    textAlign: "right",
  },

  // Détail déroulant
  detailPanel: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: "#F5F7FF",
    borderRadius: 18,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 16,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: "#C7D2FE",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
  },
  detailKey: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  detailValue: { fontSize: 13, color: "#1E293B", fontWeight: "600" },

  notesBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 4,
  },
  notesText: { fontSize: 13, color: "#475569", lineHeight: 18 },

  // Actions
  actionRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionBtnText: { fontSize: 12, fontWeight: "600" },

  // Empty + add
  emptyBox: { alignItems: "center", padding: 40 },
  emptyText: { fontSize: 14, color: "#94A3B8" },

  addStudentBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E0E7FF",
    borderStyle: "dashed",
    backgroundColor: "#F5F7FF",
  },
  addStudentText: { fontSize: 15, fontWeight: "600", color: "#6366F1" },
});
