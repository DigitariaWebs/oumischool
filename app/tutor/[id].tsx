import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Star,
  MapPin,
  GraduationCap,
  Clock,
  Languages,
  Award,
  BookOpen,
  Video,
  Users,
  ChevronDown,
  X,
  Calendar,
  Check,
  MessageSquare,
  ArrowLeft,
  Heart,
} from "lucide-react-native";

import { FONTS } from "@/config/fonts";
import { useTutorAvailability, useTutorDetail } from "@/hooks/api/tutors";
import { useChildren } from "@/hooks/api/parent";

// Mock data
const fallbackTutor = {
  id: "1",
  name: "Marie Dupont",
  avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  rating: 4.8,
  reviewsCount: 45,
  bio: "Professeure passionnée avec plus de 8 ans d'expérience en enseignement. Je me spécialise dans l'aide aux élèves qui ont des difficultés en mathématiques et en français.",
  hourlyRate: 25,
  inPersonRate: 35,
  inPersonAvailable: true,
  experience: 8,
  languages: ["Français", "Anglais", "Arabe"],
  region: "Casablanca",
  subjects: [
    { id: "math", name: "Maths", icon: "calculator", color: "#3B82F6" },
    { id: "french", name: "Français", icon: "file-text", color: "#EF4444" },
  ],
  methodology: {
    approach:
      "J'adopte une approche personnalisée pour chaque élève, en identifiant d'abord leurs points forts et leurs difficultés.",
    techniques: [
      "Exercices pratiques adaptés",
      "Supports visuels et interactifs",
      "Suivi régulier des progrès",
      "Devoirs personnalisés",
    ],
  },
  availability: {
    monday: ["09:00-12:00", "14:00-18:00"],
    tuesday: ["14:00-18:00"],
    wednesday: ["09:00-12:00", "14:00-18:00"],
    thursday: [],
    friday: ["09:00-12:00", "14:00-17:00"],
    saturday: ["10:00-13:00"],
    sunday: [],
  },
  lessonPortfolio: [
    {
      id: "curriculum-1",
      title: "Programme Maths - Niveau CE2",
      subject: "Maths",
      subjectColor: "#3B82F6",
      description:
        "Programme complet pour maîtriser les bases des mathématiques",
      lessonsCount: 12,
      duration: "3 mois",
      level: "CE2",
      lessons: [
        { id: "1", title: "Les nombres jusqu'à 1000", order: 1 },
        { id: "2", title: "Addition et soustraction", order: 2 },
      ],
    },
  ],
  reviews: [
    {
      id: "1",
      parentName: "Fatima Z.",
      childName: "Yasmine",
      rating: 5,
      date: "Il y a 2 semaines",
      comment: "Excellente tutrice! Ma fille a fait d'énormes progrès.",
    },
  ],
};


/** Returns the ISO datetime string for the next occurrence of `dayName` at `time` ("HH:MM") in UTC. */
function getNextOccurrenceIso(dayName: string, time: string): string {
  const dayMap: Record<string, number> = {
    monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
    friday: 5, saturday: 6, sunday: 0,
  };
  const targetDay = dayMap[dayName.toLowerCase()] ?? 1;
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  let daysUntil = (targetDay - now.getUTCDay() + 7) % 7;
  if (daysUntil === 0) daysUntil = 7; // always the next occurrence, not today
  const target = new Date(now);
  target.setUTCDate(now.getUTCDate() + daysUntil);
  target.setUTCHours(hours, minutes, 0, 0);
  return target.toISOString();
}

const daysOfWeek = [
  { key: "monday", label: "Lun" },
  { key: "tuesday", label: "Mar" },
  { key: "wednesday", label: "Mer" },
  { key: "thursday", label: "Jeu" },
  { key: "friday", label: "Ven" },
  { key: "saturday", label: "Sam" },
  { key: "sunday", label: "Dim" },
];

export default function TutorProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const tutorId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: tutorData } = useTutorDetail(tutorId ?? "");
  const { data: availabilityData = [] } = useTutorAvailability(tutorId ?? "");
  const { data: childrenFromApi = [], isLoading: childrenLoading } = useChildren();
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<"online" | "inPerson">(
    "online",
  );
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [expandedCurriculum, setExpandedCurriculum] = useState<string | null>(
    null,
  );
  const [isFavorite, setIsFavorite] = useState(false);

  const bookingChildren = childrenFromApi.map((child) => ({
    id: child.id,
    name: child.name,
    age: 0,
    grade: child.grade,
  }));

  const tutor = useMemo(() => {
    if (!tutorData) return fallbackTutor;
    const availability = {
      monday: [] as string[],
      tuesday: [] as string[],
      wednesday: [] as string[],
      thursday: [] as string[],
      friday: [] as string[],
      saturday: [] as string[],
      sunday: [] as string[],
    };
    availabilityData.forEach((slot) => {
      const value = `${slot.startTime}-${slot.endTime}`;
      if (slot.dayOfWeek === 1) availability.monday.push(value);
      if (slot.dayOfWeek === 2) availability.tuesday.push(value);
      if (slot.dayOfWeek === 3) availability.wednesday.push(value);
      if (slot.dayOfWeek === 4) availability.thursday.push(value);
      if (slot.dayOfWeek === 5) availability.friday.push(value);
      if (slot.dayOfWeek === 6) availability.saturday.push(value);
      if (slot.dayOfWeek === 0) availability.sunday.push(value);
    });
    return {
      ...fallbackTutor,
      id: tutorData.id,
      name:
        `${tutorData.user.firstName ?? ""} ${tutorData.user.lastName ?? ""}`.trim() ||
        tutorData.user.email.split("@")[0],
      rating: tutorData.rating ?? 0,
      reviewsCount: tutorData.reviewsCount ?? 0,
      bio: tutorData.bio ?? fallbackTutor.bio,
      hourlyRate: tutorData.hourlyRate ?? fallbackTutor.hourlyRate,
      inPersonRate: tutorData.hourlyRate ?? fallbackTutor.inPersonRate,
      region: tutorData.location ?? fallbackTutor.region,
      subjects:
        tutorData.subjects.length > 0
          ? tutorData.subjects.map((subjectId, index) => ({
              id: subjectId,
              name: subjectId.charAt(0).toUpperCase() + subjectId.slice(1),
              icon: "book-open",
              color: ["#3B82F6", "#EF4444", "#10B981", "#6366F1"][index % 4],
            }))
          : fallbackTutor.subjects,
      availability,
    };
  }, [availabilityData, tutorData]);

  const toggleChildSelection = (childId: string) => {
    setSelectedChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId],
    );
  };

  const calculateTotalPrice = () => {
    const rate =
      selectedMode === "online" ? tutor.hourlyRate : tutor.inPersonRate!;
    return rate * selectedChildren.length;
  };

  const getAvailableTimeSlots = (day: string) => {
    const dayKey = day.toLowerCase() as keyof typeof tutor.availability;
    return tutor.availability[dayKey] || [];
  };

  const canBook =
    selectedChildren.length > 0 && selectedDay && selectedTimeSlot;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Heart size={20} color={isFavorite ? "#EF4444" : "#64748B"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: tutor.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.tutorName}>{tutor.name}</Text>
              <View style={styles.ratingRow}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.ratingText}>{tutor.rating}</Text>
                <Text style={styles.reviewCount}>
                  ({tutor.reviewsCount} avis)
                </Text>
              </View>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#64748B" />
                <Text style={styles.locationText}>{tutor.region}</Text>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <GraduationCap size={16} color="#6366F1" />
              <Text style={styles.statValue}>{tutor.experience} ans</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Award size={16} color="#10B981" />
              <Text style={styles.statValue}>{tutor.rating}/5</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Users size={16} color="#8B5CF6" />
              <Text style={styles.statValue}>{tutor.reviewsCount}+</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.bioText}>{tutor.bio}</Text>
        </View>

        {/* Langues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Langues</Text>
          <View style={styles.chipContainer}>
            {tutor.languages.map((lang, index) => (
              <View key={index} style={styles.chip}>
                <Languages size={12} color="#6366F1" />
                <Text style={styles.chipText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Matières */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Matières</Text>
          <View style={styles.subjectsContainer}>
            {tutor.subjects.map((subject) => (
              <View
                key={subject.id}
                style={[styles.subjectCard, { borderLeftColor: subject.color }]}
              >
                <BookOpen size={16} color={subject.color} />
                <Text style={styles.subjectName}>{subject.name}</Text>
                <View
                  style={[
                    styles.subjectBadge,
                    { backgroundColor: subject.color + "15" },
                  ]}
                >
                  <Text
                    style={[styles.subjectBadgeText, { color: subject.color }]}
                  >
                    Expert
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Programmes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programmes</Text>
          {tutor.lessonPortfolio.map((curriculum) => (
            <View key={curriculum.id} style={styles.curriculumCard}>
              <TouchableOpacity
                style={styles.curriculumHeader}
                onPress={() =>
                  setExpandedCurriculum(
                    expandedCurriculum === curriculum.id ? null : curriculum.id,
                  )
                }
              >
                <View style={styles.curriculumLeft}>
                  <View
                    style={[
                      styles.curriculumDot,
                      { backgroundColor: curriculum.subjectColor },
                    ]}
                  />
                  <View>
                    <Text style={styles.curriculumTitle}>
                      {curriculum.title}
                    </Text>
                    <Text style={styles.curriculumMeta}>
                      {curriculum.lessonsCount} leçons • {curriculum.level}
                    </Text>
                  </View>
                </View>
                <ChevronDown
                  size={16}
                  color="#64748B"
                  style={{
                    transform: [
                      {
                        rotate:
                          expandedCurriculum === curriculum.id
                            ? "180deg"
                            : "0deg",
                      },
                    ],
                  }}
                />
              </TouchableOpacity>

              {expandedCurriculum === curriculum.id && (
                <View style={styles.curriculumExpanded}>
                  <Text style={styles.curriculumDescription}>
                    {curriculum.description}
                  </Text>
                  {curriculum.lessons.map((lesson, index) => (
                    <View key={lesson.id} style={styles.lessonItem}>
                      <View
                        style={[
                          styles.lessonDot,
                          { backgroundColor: curriculum.subjectColor },
                        ]}
                      />
                      <Text style={styles.lessonText}>{lesson.title}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Méthodologie */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Méthodologie</Text>
          <View style={styles.methodologyCard}>
            <Text style={styles.methodologyQuote}>
              &quot;{tutor.methodology.approach}&quot;
            </Text>
            <View style={styles.techniquesContainer}>
              {tutor.methodology.techniques.map((tech, index) => (
                <View key={index} style={styles.techniqueItem}>
                  <Check size={12} color="#10B981" />
                  <Text style={styles.techniqueText}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Avis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avis récents</Text>
          {tutor.reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewStars}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      color="#F59E0B"
                      fill={i < review.rating ? "#F59E0B" : "none"}
                    />
                  ))}
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <View style={styles.reviewAuthor}>
                <View style={styles.reviewAuthorAvatar}>
                  <Text style={styles.reviewAuthorInitial}>
                    {review.parentName.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.reviewAuthorName}>{review.parentName}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>À partir de</Text>
          <Text style={styles.priceValue}>{tutor.hourlyRate}€</Text>
          <Text style={styles.priceUnit}>/h</Text>
        </View>
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => router.push("/messaging")}
          >
            <MessageSquare size={18} color="#6366F1" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => setBookingModalVisible(true)}
          >
            <Calendar size={18} color="white" />
            <Text style={styles.bookButtonText}>Réserver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Booking Modal */}
      <Modal visible={bookingModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Réserver</Text>
                <Text style={styles.modalSubtitle}>avec {tutor.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setBookingModalVisible(false)}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Enfants */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Enfants</Text>
                {childrenLoading ? (
                  <Text style={styles.childDetails}>Chargement…</Text>
                ) : bookingChildren.length === 0 ? (
                  <Text style={styles.childDetails}>
                    Aucun enfant enregistré. Ajoutez-en un dans votre profil.
                  </Text>
                ) : null}
                {bookingChildren.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childItem,
                      selectedChildren.includes(child.id) &&
                        styles.childItemSelected,
                    ]}
                    onPress={() => toggleChildSelection(child.id)}
                  >
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childDetails}>
                        {child.age} ans • {child.grade}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.childCheck,
                        selectedChildren.includes(child.id) &&
                          styles.childCheckSelected,
                      ]}
                    >
                      {selectedChildren.includes(child.id) && (
                        <Check size={12} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Mode */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Mode</Text>
                <View style={styles.modeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.modeCard,
                      selectedMode === "online" && styles.modeCardSelected,
                    ]}
                    onPress={() => setSelectedMode("online")}
                  >
                    <Video
                      size={20}
                      color={selectedMode === "online" ? "white" : "#64748B"}
                    />
                    <Text
                      style={[
                        styles.modeText,
                        selectedMode === "online" && styles.modeTextSelected,
                      ]}
                    >
                      En ligne
                    </Text>
                    <Text
                      style={[
                        styles.modePrice,
                        selectedMode === "online" && styles.modePriceSelected,
                      ]}
                    >
                      {tutor.hourlyRate}€
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modeCard,
                      selectedMode === "inPerson" && styles.modeCardSelected,
                    ]}
                    onPress={() => setSelectedMode("inPerson")}
                  >
                    <Users
                      size={20}
                      color={selectedMode === "inPerson" ? "white" : "#64748B"}
                    />
                    <Text
                      style={[
                        styles.modeText,
                        selectedMode === "inPerson" && styles.modeTextSelected,
                      ]}
                    >
                      Présentiel
                    </Text>
                    <Text
                      style={[
                        styles.modePrice,
                        selectedMode === "inPerson" && styles.modePriceSelected,
                      ]}
                    >
                      {tutor.inPersonRate}€
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Jours */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Jour</Text>
                <View style={styles.daysContainer}>
                  {daysOfWeek.map((day) => {
                    const hasSlots = getAvailableTimeSlots(day.key).length > 0;
                    return (
                      <TouchableOpacity
                        key={day.key}
                        style={[
                          styles.dayChip,
                          selectedDay === day.key && styles.dayChipSelected,
                          !hasSlots && styles.dayChipDisabled,
                        ]}
                        onPress={() => hasSlots && setSelectedDay(day.key)}
                        disabled={!hasSlots}
                      >
                        <Text
                          style={[
                            styles.dayChipText,
                            selectedDay === day.key &&
                              styles.dayChipTextSelected,
                            !hasSlots && styles.dayChipTextDisabled,
                          ]}
                        >
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Créneaux */}
              {selectedDay && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Horaire</Text>
                  <View style={styles.timeSlotsContainer}>
                    {getAvailableTimeSlots(selectedDay).map((slot, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.timeSlot,
                          selectedTimeSlot === slot && styles.timeSlotSelected,
                        ]}
                        onPress={() => setSelectedTimeSlot(slot)}
                      >
                        <Clock
                          size={12}
                          color={
                            selectedTimeSlot === slot ? "white" : "#64748B"
                          }
                        />
                        <Text
                          style={[
                            styles.timeSlotText,
                            selectedTimeSlot === slot &&
                              styles.timeSlotTextSelected,
                          ]}
                        >
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Résumé */}
              {selectedChildren.length > 0 && (
                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                      {selectedChildren.length} enfant
                      {selectedChildren.length > 1 ? "s" : ""}
                    </Text>
                    <Text style={styles.summaryValue}>
                      {selectedChildren.length} ×{" "}
                      {selectedMode === "online"
                        ? tutor.hourlyRate
                        : tutor.inPersonRate}
                      €
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalLabel}>Total</Text>
                    <Text style={styles.summaryTotalValue}>
                      {calculateTotalPrice()}€
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !canBook && styles.confirmButtonDisabled,
              ]}
              onPress={() => {
                const [startStr, endStr] = (selectedTimeSlot ?? "09:00-10:00").split("-");
                const startTime = getNextOccurrenceIso(selectedDay ?? "monday", startStr.trim());
                const endTime = getNextOccurrenceIso(selectedDay ?? "monday", endStr.trim());
                const children = bookingChildren.filter((c) =>
                  selectedChildren.includes(c.id)
                );
                setBookingModalVisible(false);
                router.push({
                  pathname: "/parent/profile/checkout",
                  params: {
                    tutorId: tutor.id,
                    tutorName: tutor.name,
                    children: JSON.stringify(children),
                    mode: selectedMode === "inPerson" ? "presential" : "online",
                    day: selectedDay ?? "",
                    timeSlot: selectedTimeSlot ?? "",
                    startTime,
                    endTime,
                    totalPrice: calculateTotalPrice().toString(),
                  },
                });
              }}
              disabled={!canBook}
            >
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
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
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  profileHeader: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  tutorName: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "#1E293B",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  reviewCount: {
    fontSize: 12,
    color: "#64748B",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#64748B",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#F1F5F9",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 10,
  },
  bioText: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  chipText: {
    fontSize: 12,
    color: "#1E293B",
  },
  subjectsContainer: {
    gap: 8,
  },
  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 10,
  },
  subjectName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  subjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  subjectBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  curriculumCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 8,
  },
  curriculumHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  curriculumLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  curriculumDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  curriculumExpanded: {
    padding: 14,
    paddingTop: 0,
  },
  curriculumDescription: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  lessonDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  lessonText: {
    fontSize: 13,
    color: "#1E293B",
  },
  methodologyCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  methodologyQuote: {
    fontSize: 14,
    color: "#1E293B",
    fontStyle: "italic",
    marginBottom: 12,
  },
  techniquesContainer: {
    gap: 6,
  },
  techniqueItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  techniqueText: {
    fontSize: 13,
    color: "#64748B",
  },
  reviewCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: 11,
    color: "#94A3B8",
  },
  reviewComment: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
    lineHeight: 18,
  },
  reviewAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reviewAuthorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewAuthorInitial: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
  },
  reviewAuthorName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  priceLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  priceValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: "#6366F1",
  },
  priceUnit: {
    fontSize: 12,
    color: "#64748B",
  },
  bottomActions: {
    flexDirection: "row",
    gap: 8,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#6366F1",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "#1E293B",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  modalSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  childItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  childItemSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#6366F1",
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  childDetails: {
    fontSize: 12,
    color: "#64748B",
  },
  childCheck: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  childCheckSelected: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  modeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  modeCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  modeCardSelected: {
    backgroundColor: "#6366F1",
  },
  modeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  modeTextSelected: {
    color: "white",
  },
  modePrice: {
    fontSize: 13,
    color: "#64748B",
  },
  modePriceSelected: {
    color: "white",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dayChipSelected: {
    backgroundColor: "#6366F1",
  },
  dayChipDisabled: {
    opacity: 0.4,
  },
  dayChipText: {
    fontSize: 13,
    color: "#1E293B",
  },
  dayChipTextSelected: {
    color: "white",
  },
  dayChipTextDisabled: {
    color: "#94A3B8",
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  timeSlotSelected: {
    backgroundColor: "#6366F1",
  },
  timeSlotText: {
    fontSize: 12,
    color: "#1E293B",
  },
  timeSlotTextSelected: {
    color: "white",
  },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 10,
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  summaryTotalValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: "#6366F1",
  },
  confirmButton: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: "#6366F1",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#CBD5E1",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
