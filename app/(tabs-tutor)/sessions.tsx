import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Check,
  Clock,
  Calendar,
  User,
  Plus,
  Trash2,
  BookOpen,
} from "lucide-react-native";

// ── Même données que le dashboard ──
const MY_STUDENTS = [
  {
    id: 1,
    name: "Adam B.",
    grade: "CE2",
    subject: "Maths",
    subjectColor: "#3B82F6",
    image: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  },
  {
    id: 2,
    name: "Sofia M.",
    grade: "CP",
    subject: "Français",
    subjectColor: "#EF4444",
    image: "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  },
];

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const HOURS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];
const DURATIONS = ["30 min", "45 min", "60 min", "90 min", "120 min"];

type Session = {
  id: number;
  studentId: number;
  day: string;
  hour: string;
  duration: string;
};

// Sessions déjà planifiées (mock)
const INITIAL_SESSIONS: Session[] = [
  { id: 1, studentId: 1, day: "Lun", hour: "14:00", duration: "60 min" },
  { id: 2, studentId: 2, day: "Mer", hour: "16:00", duration: "45 min" },
];

// ── Helper : couleur de l'élève ──
const studentColor = (id: number) =>
  MY_STUDENTS.find((s) => s.id === id)?.subjectColor ?? "#6366F1";
const studentName = (id: number) =>
  MY_STUDENTS.find((s) => s.id === id)?.name ?? "—";

export default function TutorAvailabilityScreen() {
  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);

  // ── Formulaire ──
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>("60 min");

  // Étape courante du formulaire (1 = élève, 2 = jour, 3 = heure, 4 = durée)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const resetForm = () => {
    setSelectedStudentId(null);
    setSelectedDay(null);
    setSelectedHour(null);
    setSelectedDuration("60 min");
    setStep(1);
  };

  const handleAddSession = () => {
    if (!selectedStudentId || !selectedDay || !selectedHour) return;

    // Vérifie doublon
    const conflict = sessions.find(
      (s) => s.studentId === selectedStudentId && s.day === selectedDay && s.hour === selectedHour
    );
    if (conflict) {
      Alert.alert("Conflit", "Ce créneau est déjà réservé pour cet élève.");
      return;
    }

    const newSession: Session = {
      id: Date.now(),
      studentId: selectedStudentId,
      day: selectedDay,
      hour: selectedHour,
      duration: selectedDuration,
    };

    setSessions((prev) => [...prev, newSession]);
    Alert.alert(
      "✅ Créneau ajouté",
      `${selectedDay} à ${selectedHour} avec ${studentName(selectedStudentId)} (${selectedDuration})`,
      [{ text: "Super !", onPress: resetForm }]
    );
  };

  const handleDeleteSession = (id: number) => {
    Alert.alert("Supprimer", "Voulez-vous supprimer ce créneau ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => setSessions((prev) => prev.filter((s) => s.id !== id)),
      },
    ]);
  };

  // ── Récap des créneaux groupés par jour ──
  const sessionsByDay = DAYS.reduce<Record<string, Session[]>>((acc, day) => {
    const list = sessions.filter((s) => s.day === day);
    if (list.length) acc[day] = list;
    return acc;
  }, {});

  // Labels d'étapes
  const stepLabel = ["Élève", "Jour", "Heure", "Durée"];

  const canConfirm = selectedStudentId && selectedDay && selectedHour;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disponibilités</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── STEPPER ── */}
        <View style={styles.stepper}>
          {stepLabel.map((label, i) => {
            const num = i + 1;
            const isActive = step === num;
            const isDone = step > num;
            return (
              <React.Fragment key={label}>
                <TouchableOpacity
                  style={styles.stepItem}
                  onPress={() => {
                    if (isDone || isActive) setStep(num as 1 | 2 | 3 | 4);
                  }}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      isActive && styles.stepCircleActive,
                      isDone && styles.stepCircleDone,
                    ]}
                  >
                    {isDone ? (
                      <Check size={12} color="white" />
                    ) : (
                      <Text
                        style={[
                          styles.stepNum,
                          (isActive || isDone) && styles.stepNumActive,
                        ]}
                      >
                        {num}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      (isActive || isDone) && styles.stepLabelActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
                {i < stepLabel.length - 1 && (
                  <View
                    style={[styles.stepLine, isDone && styles.stepLineDone]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* ── ÉTAPE 1 : CHOISIR L'ÉLÈVE ── */}
        {step === 1 && (
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <User size={18} color="#6366F1" />
              <Text style={styles.cardTitle}>Choisir l'élève</Text>
            </View>
            {MY_STUDENTS.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.studentRow,
                  selectedStudentId === s.id && styles.studentRowActive,
                ]}
                onPress={() => {
                  setSelectedStudentId(s.id);
                  setTimeout(() => setStep(2), 200);
                }}
              >
                <Image source={{ uri: s.image }} style={styles.avatar} />
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{s.name}</Text>
                  <Text style={styles.studentGrade}>{s.grade}</Text>
                </View>
                <View style={[styles.subjectBadge, { backgroundColor: s.subjectColor + "20" }]}>
                  <Text style={[styles.subjectText, { color: s.subjectColor }]}>{s.subject}</Text>
                </View>
                {selectedStudentId === s.id && (
                  <View style={styles.checkCircle}>
                    <Check size={12} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── ÉTAPE 2 : CHOISIR LE JOUR ── */}
        {step === 2 && (
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Calendar size={18} color="#6366F1" />
              <Text style={styles.cardTitle}>Choisir le jour</Text>
            </View>
            <View style={styles.daysGrid}>
              {DAYS.map((day) => {
                const busy = sessions.some(
                  (s) => s.studentId === selectedStudentId && s.day === day
                );
                const isSelected = selectedDay === day;
                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayChip,
                      isSelected && styles.dayChipSelected,
                      busy && !isSelected && styles.dayChipBusy,
                    ]}
                    onPress={() => {
                      setSelectedDay(day);
                      setTimeout(() => setStep(3), 200);
                    }}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.dayTextSelected,
                        busy && !isSelected && styles.dayTextBusy,
                      ]}
                    >
                      {day}
                    </Text>
                    {busy && !isSelected && (
                      <View style={styles.busyDot} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.backStep} onPress={() => setStep(1)}>
              <ChevronLeft size={14} color="#6366F1" />
              <Text style={styles.backStepText}>Retour</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── ÉTAPE 3 : CHOISIR L'HEURE ── */}
        {step === 3 && (
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Clock size={18} color="#6366F1" />
              <Text style={styles.cardTitle}>Choisir l'heure</Text>
            </View>
            <View style={styles.hoursGrid}>
              {HOURS.map((hour) => {
                const busy = sessions.some(
                  (s) =>
                    s.studentId === selectedStudentId &&
                    s.day === selectedDay &&
                    s.hour === hour
                );
                const isSelected = selectedHour === hour;
                return (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.hourChip,
                      isSelected && styles.hourChipSelected,
                      busy && styles.hourChipBusy,
                    ]}
                    disabled={busy}
                    onPress={() => {
                      setSelectedHour(hour);
                      setTimeout(() => setStep(4), 200);
                    }}
                  >
                    <Text
                      style={[
                        styles.hourText,
                        isSelected && styles.hourTextSelected,
                        busy && styles.hourTextBusy,
                      ]}
                    >
                      {hour}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.backStep} onPress={() => setStep(2)}>
              <ChevronLeft size={14} color="#6366F1" />
              <Text style={styles.backStepText}>Retour</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── ÉTAPE 4 : DURÉE ── */}
        {step === 4 && (
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Clock size={18} color="#10B981" />
              <Text style={styles.cardTitle}>Durée du cours</Text>
            </View>
            <View style={styles.durationGrid}>
              {DURATIONS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.durationChip,
                    selectedDuration === d && styles.durationChipSelected,
                  ]}
                  onPress={() => setSelectedDuration(d)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      selectedDuration === d && styles.durationTextSelected,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Récap ── */}
            {canConfirm && (
              <View style={styles.recap}>
                <Text style={styles.recapTitle}>Récapitulatif</Text>
                <View style={styles.recapRow}>
                  <Image
                    source={{
                      uri: MY_STUDENTS.find((s) => s.id === selectedStudentId)?.image,
                    }}
                    style={styles.recapAvatar}
                  />
                  <View>
                    <Text style={styles.recapStudent}>
                      {studentName(selectedStudentId!)}
                    </Text>
                    <Text style={styles.recapDetail}>
                      {selectedDay} · {selectedHour} · {selectedDuration}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
              disabled={!canConfirm}
              onPress={handleAddSession}
            >
              <Check size={18} color="white" />
              <Text style={styles.confirmBtnText}>Confirmer le créneau</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backStep} onPress={() => setStep(3)}>
              <ChevronLeft size={14} color="#6366F1" />
              <Text style={styles.backStepText}>Retour</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── CRÉNEAUX EXISTANTS ── */}
        <View style={styles.existingSection}>
          <Text style={styles.existingTitle}>Créneaux planifiés</Text>

          {Object.keys(sessionsByDay).length === 0 ? (
            <View style={styles.emptyBox}>
              <Calendar size={32} color="#CBD5E1" />
              <Text style={styles.emptyText}>Aucun créneau pour l'instant</Text>
            </View>
          ) : (
            Object.entries(sessionsByDay).map(([day, list]) => (
              <View key={day} style={styles.dayGroup}>
                <Text style={styles.dayGroupLabel}>{day}</Text>
                {list.map((session) => {
                  const color = studentColor(session.studentId);
                  return (
                    <View
                      key={session.id}
                      style={[styles.sessionCard, { borderLeftColor: color }]}
                    >
                      <View style={styles.sessionCardLeft}>
                        <Image
                          source={{
                            uri: MY_STUDENTS.find((s) => s.id === session.studentId)?.image,
                          }}
                          style={styles.sessionAvatar}
                        />
                        <View>
                          <Text style={styles.sessionCardName}>
                            {studentName(session.studentId)}
                          </Text>
                          <Text style={styles.sessionCardDetail}>
                            {session.hour} · {session.duration}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteSession(session.id)}
                      >
                        <Trash2 size={15} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ))
          )}
        </View>

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
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B" },

  // Stepper
  stepper: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 24, paddingVertical: 20,
  },
  stepItem: { alignItems: "center", gap: 4 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#F1F5F9", borderWidth: 2, borderColor: "#E2E8F0",
    justifyContent: "center", alignItems: "center",
  },
  stepCircleActive: { borderColor: "#6366F1", backgroundColor: "#EEF2FF" },
  stepCircleDone: { borderColor: "#6366F1", backgroundColor: "#6366F1" },
  stepNum: { fontSize: 11, fontWeight: "700", color: "#94A3B8" },
  stepNumActive: { color: "#6366F1" },
  stepLabel: { fontSize: 10, color: "#94A3B8", fontWeight: "600" },
  stepLabelActive: { color: "#6366F1" },
  stepLine: { flex: 1, height: 2, backgroundColor: "#E2E8F0", marginBottom: 14 },
  stepLineDone: { backgroundColor: "#6366F1" },

  // Card
  card: {
    marginHorizontal: 20, backgroundColor: "#FAFBFF",
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: "#E0E7FF",
    marginBottom: 24,
  },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1E293B" },

  // Étape 1 – Élèves
  studentRow: {
    flexDirection: "row", alignItems: "center",
    padding: 14, borderRadius: 14, marginBottom: 10,
    backgroundColor: "white", borderWidth: 1.5, borderColor: "#E2E8F0",
    gap: 12,
  },
  studentRowActive: { borderColor: "#6366F1", backgroundColor: "#F0F4FF" },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: "600", color: "#1E293B" },
  studentGrade: { fontSize: 12, color: "#64748B", marginTop: 1 },
  subjectBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  subjectText: { fontSize: 11, fontWeight: "700" },
  checkCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#6366F1", justifyContent: "center", alignItems: "center",
  },

  // Étape 2 – Jours
  daysGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16,
  },
  dayChip: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: "white", borderWidth: 1.5, borderColor: "#E2E8F0",
    justifyContent: "center", alignItems: "center",
  },
  dayChipSelected: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  dayChipBusy: { backgroundColor: "#FFF7ED", borderColor: "#FED7AA" },
  dayText: { fontSize: 13, fontWeight: "700", color: "#475569" },
  dayTextSelected: { color: "white" },
  dayTextBusy: { color: "#F97316" },
  busyDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: "#F97316", position: "absolute", bottom: 8,
  },

  // Étape 3 – Heures
  hoursGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16,
  },
  hourChip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10,
    backgroundColor: "white", borderWidth: 1.5, borderColor: "#E2E8F0",
  },
  hourChipSelected: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  hourChipBusy: { backgroundColor: "#F8FAFC", borderColor: "#E2E8F0", opacity: 0.4 },
  hourText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  hourTextSelected: { color: "white" },
  hourTextBusy: { color: "#94A3B8" },

  // Étape 4 – Durée
  durationGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20,
  },
  durationChip: {
    paddingHorizontal: 16, paddingVertical: 11, borderRadius: 12,
    backgroundColor: "white", borderWidth: 1.5, borderColor: "#E2E8F0",
  },
  durationChipSelected: { backgroundColor: "#10B981", borderColor: "#10B981" },
  durationText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  durationTextSelected: { color: "white" },

  // Récap
  recap: {
    backgroundColor: "#F0FDF4", borderRadius: 14, padding: 14,
    marginBottom: 16, borderWidth: 1, borderColor: "#BBF7D0",
  },
  recapTitle: { fontSize: 11, fontWeight: "700", color: "#10B981", marginBottom: 10, letterSpacing: 0.8 },
  recapRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  recapAvatar: { width: 36, height: 36, borderRadius: 18 },
  recapStudent: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  recapDetail: { fontSize: 12, color: "#64748B", marginTop: 2 },

  // Bouton confirmer
  confirmBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#6366F1", padding: 16, borderRadius: 14, marginBottom: 12,
  },
  confirmBtnDisabled: { backgroundColor: "#C7D2FE" },
  confirmBtnText: { color: "white", fontSize: 15, fontWeight: "700" },

  // Retour
  backStep: {
    flexDirection: "row", alignItems: "center", gap: 4,
    justifyContent: "center", paddingVertical: 4,
  },
  backStepText: { fontSize: 13, color: "#6366F1", fontWeight: "600" },

  // Créneaux existants
  existingSection: { paddingHorizontal: 20 },
  existingTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B", marginBottom: 16 },
  emptyBox: {
    alignItems: "center", padding: 32,
    backgroundColor: "#F8FAFC", borderRadius: 16,
    borderWidth: 1, borderColor: "#F1F5F9",
  },
  emptyText: { fontSize: 14, color: "#94A3B8", marginTop: 10 },

  dayGroup: { marginBottom: 16 },
  dayGroupLabel: {
    fontSize: 12, fontWeight: "700", color: "#6366F1",
    letterSpacing: 1, marginBottom: 8,
  },
  sessionCard: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#F8FAFC", borderRadius: 14, padding: 12,
    borderLeftWidth: 4, borderWidth: 1, borderColor: "#F1F5F9",
    marginBottom: 8,
  },
  sessionCardLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  sessionAvatar: { width: 36, height: 36, borderRadius: 18 },
  sessionCardName: { fontSize: 14, fontWeight: "600", color: "#1E293B" },
  sessionCardDetail: { fontSize: 12, color: "#64748B", marginTop: 1 },
  deleteBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: "#FEF2F2", justifyContent: "center", alignItems: "center",
  },
});
