import React, { useState } from "react";
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
import { useRouter } from "expo-router";
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
  ChevronRight,
  X,
  Calendar,
  Check,
  MessageSquare,
} from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

// Mock data - will be replaced with actual data from API
const mockTutor = {
  id: "1",
  name: "Marie Dupont",
  avatar: "https://via.placeholder.com/120",
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
      "J'adopte une approche personnalisée pour chaque élève, en identifiant d'abord leurs points forts et leurs difficultés. Je crois en l'apprentissage actif et encourage les élèves à poser des questions.",
    techniques: [
      "Exercices pratiques adaptés au niveau",
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
        { id: "3", title: "Les tables de multiplication", order: 3 },
        { id: "4", title: "La division simple", order: 4 },
      ],
    },
    {
      id: "curriculum-2",
      title: "Grammaire Française - Niveau CM1",
      subject: "Français",
      subjectColor: "#EF4444",
      description: "Maîtrise complète des règles de grammaire",
      lessonsCount: 10,
      duration: "2.5 mois",
      level: "CM1",
      lessons: [
        { id: "1", title: "Les temps de conjugaison", order: 1 },
        { id: "2", title: "Les accords du participe passé", order: 2 },
        { id: "3", title: "Les pronoms", order: 3 },
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
      comment:
        "Excellente tutrice! Ma fille a fait d'énormes progrès en maths. Marie est patiente et sait expliquer les concepts difficiles de manière simple.",
    },
    {
      id: "2",
      parentName: "Ahmed M.",
      childName: "Omar",
      rating: 5,
      date: "Il y a 1 mois",
      comment:
        "Très professionnelle et à l'écoute. Mon fils attend avec impatience ses cours avec Marie.",
    },
    {
      id: "3",
      parentName: "Sophia L.",
      childName: "Léa",
      rating: 4,
      date: "Il y a 2 mois",
      comment:
        "Bonne tutrice, très compétente. Le seul point d'amélioration serait la ponctualité.",
    },
  ],
};

const mockChildren = [
  { id: "child1", name: "Emma", age: 8, grade: "CE2" },
  { id: "child2", name: "Lucas", age: 10, grade: "CM1" },
];

const daysOfWeek = [
  { key: "monday", label: "Lundi" },
  { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" },
  { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
  { key: "saturday", label: "Samedi" },
  { key: "sunday", label: "Dimanche" },
];

export default function TutorProfileScreen() {
  const router = useRouter();
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<"online" | "inPerson">(
    "online",
  );
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [expandedCurriculum, setExpandedCurriculum] = useState<string | null>(
    null,
  );

  const tutor = mockTutor; // In real app, fetch based on id

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
    const childCount = selectedChildren.length;
    return rate * childCount;
  };

  const getAvailableTimeSlots = (day: string) => {
    const dayKey = day.toLowerCase() as keyof typeof tutor.availability;
    return tutor.availability[dayKey] || [];
  };

  const handleBooking = () => {
    const bookingData = {
      tutorId: tutor.id,
      tutorName: tutor.name,
      children: JSON.stringify(selectedChildren),
      mode: selectedMode,
      day: selectedDay,
      timeSlot: selectedTimeSlot,
      totalPrice: calculateTotalPrice().toString(),
    };

    setBookingModalVisible(false);
    router.push({
      pathname: "/parent/profile/payment",
      params: bookingData,
    });
  };

  const canBook =
    selectedChildren.length > 0 &&
    selectedDay &&
    selectedTimeSlot &&
    (selectedMode === "online" || tutor.inPersonAvailable);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <X size={24} color={COLORS.secondary[700]} />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: tutor.avatar }} style={styles.avatar} />
            <View style={styles.verifiedBadge}>
              <Check size={16} color="white" />
            </View>
          </View>
          <Text style={styles.name}>{tutor.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={20} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{tutor.rating}</Text>
            <Text style={styles.reviewsText}>({tutor.reviewsCount} avis)</Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={COLORS.secondary[500]} />
            <Text style={styles.locationText}>{tutor.region}</Text>
          </View>
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfoSection}>
          <View style={styles.quickInfoCard}>
            <GraduationCap size={24} color={COLORS.primary.DEFAULT} />
            <Text style={styles.quickInfoValue}>{tutor.experience} ans</Text>
            <Text style={styles.quickInfoLabel}>d&apos;expérience</Text>
          </View>
          <View style={styles.quickInfoCard}>
            <Languages size={24} color={COLORS.primary.DEFAULT} />
            <Text style={styles.quickInfoValue}>{tutor.languages.length}</Text>
            <Text style={styles.quickInfoLabel}>langues</Text>
          </View>
          <View style={styles.quickInfoCard}>
            <BookOpen size={24} color={COLORS.primary.DEFAULT} />
            <Text style={styles.quickInfoValue}>{tutor.subjects.length}</Text>
            <Text style={styles.quickInfoLabel}>matières</Text>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.bioText}>{tutor.bio}</Text>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Languages size={20} color={COLORS.primary.DEFAULT} />
            <Text style={styles.sectionTitle}>Langues parlées</Text>
          </View>
          <View style={styles.languagesContainer}>
            {tutor.languages.map((language, index) => (
              <View key={index} style={styles.languageChip}>
                <Text style={styles.languageText}>{language}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subjects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={COLORS.primary.DEFAULT} />
            <Text style={styles.sectionTitle}>Matières enseignées</Text>
          </View>
          <View style={styles.subjectsContainer}>
            {tutor.subjects.map((subject) => (
              <View
                key={subject.id}
                style={[
                  styles.subjectCard,
                  { backgroundColor: subject.color + "15" },
                  { borderColor: subject.color + "40" },
                ]}
              >
                <View
                  style={[
                    styles.subjectIconContainer,
                    { backgroundColor: subject.color + "20" },
                  ]}
                >
                  <BookOpen size={20} color={subject.color} />
                </View>
                <Text style={[styles.subjectName, { color: subject.color }]}>
                  {subject.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Lesson Portfolio */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={COLORS.primary.DEFAULT} />
            <Text style={styles.sectionTitle}>Programmes et Cours</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Curriculums complets avec ressources pédagogiques
          </Text>
          {tutor.lessonPortfolio.map((curriculum) => (
            <View key={curriculum.id} style={styles.curriculumCard}>
              <TouchableOpacity
                style={styles.curriculumHeader}
                onPress={() =>
                  setExpandedCurriculum(
                    expandedCurriculum === curriculum.id ? null : curriculum.id,
                  )
                }
                activeOpacity={0.7}
              >
                <View style={styles.curriculumHeaderLeft}>
                  <View
                    style={[
                      styles.curriculumIcon,
                      { backgroundColor: curriculum.subjectColor + "20" },
                    ]}
                  >
                    <BookOpen size={20} color={curriculum.subjectColor} />
                  </View>
                  <View style={styles.curriculumInfo}>
                    <Text style={styles.curriculumTitle}>
                      {curriculum.title}
                    </Text>
                    <Text style={styles.curriculumMeta}>
                      {curriculum.lessonsCount} leçons • {curriculum.duration} •{" "}
                      {curriculum.level}
                    </Text>
                  </View>
                </View>
                <ChevronRight
                  size={20}
                  color={COLORS.secondary[400]}
                  style={{
                    transform: [
                      {
                        rotate:
                          expandedCurriculum === curriculum.id
                            ? "90deg"
                            : "0deg",
                      },
                    ],
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.curriculumDescription}>
                {curriculum.description}
              </Text>
              {expandedCurriculum === curriculum.id && (
                <View style={styles.lessonsList}>
                  {curriculum.lessons.map((lesson, index) => (
                    <View key={lesson.id} style={styles.lessonItem}>
                      <View style={styles.lessonNumber}>
                        <Text style={styles.lessonNumberText}>
                          {lesson.order}
                        </Text>
                      </View>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    </View>
                  ))}
                  {curriculum.lessonsCount > curriculum.lessons.length && (
                    <Text style={styles.moreLessonsText}>
                      +{curriculum.lessonsCount - curriculum.lessons.length}{" "}
                      autres leçons
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Methodology */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={COLORS.primary.DEFAULT} />
            <Text style={styles.sectionTitle}>Méthodologie</Text>
          </View>
          <Text style={styles.methodologyText}>
            {tutor.methodology.approach}
          </Text>
          <View style={styles.techniquesContainer}>
            {tutor.methodology.techniques.map((technique, index) => (
              <View key={index} style={styles.techniqueItem}>
                <View style={styles.techniqueBullet}>
                  <Check size={14} color={COLORS.primary.DEFAULT} />
                </View>
                <Text style={styles.techniqueText}>{technique}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={20} color={COLORS.primary.DEFAULT} />
            <Text style={styles.sectionTitle}>
              Avis des parents ({tutor.reviewsCount})
            </Text>
          </View>
          {tutor.reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={styles.reviewParentName}>
                    {review.parentName}
                  </Text>
                  <Text style={styles.reviewChildName}>
                    Parent de {review.childName}
                  </Text>
                </View>
                <View style={styles.reviewRatingContainer}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.reviewRating}>{review.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.pricingInfo}>
          <View style={styles.priceItem}>
            <Video size={18} color={COLORS.secondary[600]} />
            <Text style={styles.priceLabel}>En ligne</Text>
            <Text style={styles.priceValue}>{tutor.hourlyRate}€/h</Text>
          </View>
          {tutor.inPersonAvailable && (
            <>
              <View style={styles.priceDivider} />
              <View style={styles.priceItem}>
                <Users size={18} color={COLORS.secondary[600]} />
                <Text style={styles.priceLabel}>Présentiel</Text>
                <Text style={styles.priceValue}>{tutor.inPersonRate}€/h</Text>
              </View>
            </>
          )}
        </View>
        <View style={styles.ctaButtonsContainer}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => router.push("/messaging")}
            activeOpacity={0.8}
          >
            <MessageSquare size={20} color={COLORS.primary.DEFAULT} />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => setBookingModalVisible(true)}
            activeOpacity={0.8}
          >
            <Calendar size={20} color="white" />
            <Text style={styles.bookButtonText}>Réserver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Booking Modal */}
      <Modal
        visible={bookingModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Réserver avec {tutor.name}</Text>
              <TouchableOpacity
                onPress={() => setBookingModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={COLORS.secondary[700]} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Select Children */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  Sélectionnez vos enfants
                </Text>
                {mockChildren.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childOption,
                      selectedChildren.includes(child.id) &&
                        styles.childOptionSelected,
                    ]}
                    onPress={() => toggleChildSelection(child.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.childOptionInfo}>
                      <Text style={styles.childOptionName}>{child.name}</Text>
                      <Text style={styles.childOptionDetails}>
                        {child.age} ans • {child.grade}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        selectedChildren.includes(child.id) &&
                          styles.checkboxChecked,
                      ]}
                    >
                      {selectedChildren.includes(child.id) && (
                        <Check size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Select Mode */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Mode de cours</Text>
                <View style={styles.modeOptions}>
                  <TouchableOpacity
                    style={[
                      styles.modeOption,
                      selectedMode === "online" && styles.modeOptionSelected,
                    ]}
                    onPress={() => setSelectedMode("online")}
                    activeOpacity={0.7}
                  >
                    <Video
                      size={20}
                      color={
                        selectedMode === "online"
                          ? COLORS.primary.DEFAULT
                          : COLORS.secondary[600]
                      }
                    />
                    <Text
                      style={[
                        styles.modeOptionText,
                        selectedMode === "online" &&
                          styles.modeOptionTextSelected,
                      ]}
                    >
                      En ligne
                    </Text>
                    <Text
                      style={[
                        styles.modeOptionPrice,
                        selectedMode === "online" &&
                          styles.modeOptionPriceSelected,
                      ]}
                    >
                      {tutor.hourlyRate}€/h
                    </Text>
                  </TouchableOpacity>
                  {tutor.inPersonAvailable && (
                    <TouchableOpacity
                      style={[
                        styles.modeOption,
                        selectedMode === "inPerson" &&
                          styles.modeOptionSelected,
                      ]}
                      onPress={() => setSelectedMode("inPerson")}
                      activeOpacity={0.7}
                    >
                      <Users
                        size={20}
                        color={
                          selectedMode === "inPerson"
                            ? COLORS.primary.DEFAULT
                            : COLORS.secondary[600]
                        }
                      />
                      <Text
                        style={[
                          styles.modeOptionText,
                          selectedMode === "inPerson" &&
                            styles.modeOptionTextSelected,
                        ]}
                      >
                        Présentiel
                      </Text>
                      <Text
                        style={[
                          styles.modeOptionPrice,
                          selectedMode === "inPerson" &&
                            styles.modeOptionPriceSelected,
                        ]}
                      >
                        {tutor.inPersonRate}€/h
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Select Day */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  Jour de la semaine (cours hebdomadaire)
                </Text>
                <View style={styles.daysGrid}>
                  {daysOfWeek.map((day) => {
                    const hasSlots = getAvailableTimeSlots(day.key).length > 0;
                    return (
                      <TouchableOpacity
                        key={day.key}
                        style={[
                          styles.dayOption,
                          selectedDay === day.key && styles.dayOptionSelected,
                          !hasSlots && styles.dayOptionDisabled,
                        ]}
                        onPress={() => hasSlots && setSelectedDay(day.key)}
                        disabled={!hasSlots}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dayOptionText,
                            selectedDay === day.key &&
                              styles.dayOptionTextSelected,
                            !hasSlots && styles.dayOptionTextDisabled,
                          ]}
                        >
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Select Time Slot */}
              {selectedDay && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    Horaire disponible
                  </Text>
                  <View style={styles.timeSlotsContainer}>
                    {getAvailableTimeSlots(selectedDay).map((slot, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.timeSlot,
                          selectedTimeSlot === slot && styles.timeSlotSelected,
                        ]}
                        onPress={() => setSelectedTimeSlot(slot)}
                        activeOpacity={0.7}
                      >
                        <Clock
                          size={16}
                          color={
                            selectedTimeSlot === slot
                              ? "white"
                              : COLORS.secondary[600]
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

              {/* Price Summary */}
              {selectedChildren.length > 0 && (
                <View style={styles.priceSummary}>
                  <View style={styles.priceSummaryRow}>
                    <Text style={styles.priceSummaryLabel}>
                      {selectedChildren.length} enfant
                      {selectedChildren.length > 1 ? "s" : ""}
                    </Text>
                    <Text style={styles.priceSummaryValue}>
                      {selectedChildren.length} ×{" "}
                      {selectedMode === "online"
                        ? tutor.hourlyRate
                        : tutor.inPersonRate}
                      €
                    </Text>
                  </View>
                  <View style={styles.priceSummaryDivider} />
                  <View style={styles.priceSummaryRow}>
                    <Text style={styles.priceSummaryTotalLabel}>
                      Total par séance
                    </Text>
                    <Text style={styles.priceSummaryTotalValue}>
                      {calculateTotalPrice()}€
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Book Button */}
            <TouchableOpacity
              style={[
                styles.modalBookButton,
                !canBook && styles.modalBookButtonDisabled,
              ]}
              onPress={handleBooking}
              disabled={!canBook}
              activeOpacity={0.8}
            >
              <Text style={styles.modalBookButtonText}>
                Confirmer la réservation
              </Text>
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
    backgroundColor: COLORS.neutral.white,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: COLORS.neutral.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary[100],
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.primary.DEFAULT,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.neutral.white,
  },
  name: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: COLORS.secondary[900],
    fontWeight: "700",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  ratingText: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  reviewsText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[600],
    fontWeight: "500",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    fontWeight: "500",
  },
  quickInfoSection: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickInfoValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.secondary[900],
    fontWeight: "700",
    marginTop: 8,
  },
  quickInfoLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[600],
    fontWeight: "500",
    textAlign: "center",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    marginBottom: 16,
    lineHeight: 20,
  },
  bioText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[700],
    lineHeight: 24,
  },
  languagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  languageChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary[50],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  languageText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 10,
  },
  subjectIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  subjectName: {
    fontFamily: FONTS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  curriculumCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  curriculumHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  curriculumHeaderLeft: {
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
  curriculumInfo: {
    flex: 1,
  },
  curriculumTitle: {
    fontFamily: FONTS.primary,
    fontSize: 16,
    color: COLORS.secondary[900],
    fontWeight: "700",
    marginBottom: 4,
  },
  curriculumMeta: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
    fontWeight: "500",
  },
  curriculumDescription: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    lineHeight: 20,
    marginBottom: 8,
  },
  lessonsList: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary[200],
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  lessonNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
  },
  lessonNumberText: {
    fontFamily: FONTS.fredoka,
    fontSize: 14,
    color: COLORS.primary.DEFAULT,
    fontWeight: "700",
  },
  lessonTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    flex: 1,
  },
  moreLessonsText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
  },
  methodologyText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[700],
    lineHeight: 24,
    marginBottom: 16,
  },
  techniquesContainer: {
    gap: 12,
  },
  techniqueItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  techniqueBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  techniqueText: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    lineHeight: 22,
  },
  reviewCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reviewParentName: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    color: COLORS.secondary[900],
    fontWeight: "700",
    marginBottom: 4,
  },
  reviewChildName: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
    fontWeight: "500",
  },
  reviewRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reviewRating: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  reviewComment: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    lineHeight: 22,
    marginBottom: 8,
  },
  reviewDate: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
    fontWeight: "500",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  pricingInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    gap: 16,
  },
  priceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priceLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
    fontWeight: "500",
  },
  priceValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  priceDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.secondary[300],
  },
  ctaButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  messageButton: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: COLORS.primary.DEFAULT,
  },
  messageButtonText: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.primary.DEFAULT,
    fontWeight: "700",
  },
  bookButton: {
    flex: 1,
    backgroundColor: COLORS.primary.DEFAULT,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.neutral.white,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary[200],
  },
  modalTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary[100],
    justifyContent: "center",
    alignItems: "center",
  },
  modalSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  modalSectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    fontWeight: "700",
    marginBottom: 12,
  },
  childOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.secondary[200],
  },
  childOptionSelected: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary[50],
  },
  childOptionInfo: {
    flex: 1,
  },
  childOptionName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    fontWeight: "700",
    marginBottom: 4,
  },
  childOptionDetails: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[600],
    fontWeight: "500",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.secondary[300],
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary.DEFAULT,
    borderColor: COLORS.primary.DEFAULT,
  },
  modeOptions: {
    flexDirection: "row",
    gap: 12,
  },
  modeOption: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.secondary[200],
    alignItems: "center",
    gap: 8,
  },
  modeOptionSelected: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary[50],
  },
  modeOptionText: {
    fontFamily: FONTS.fredoka,
    fontSize: 14,
    color: COLORS.secondary[700],
    fontWeight: "600",
  },
  modeOptionTextSelected: {
    color: COLORS.primary.DEFAULT,
    fontWeight: "700",
  },
  modeOptionPrice: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  modeOptionPriceSelected: {
    color: COLORS.primary.DEFAULT,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.secondary[200],
    minWidth: "30%",
    alignItems: "center",
  },
  dayOptionSelected: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary[50],
  },
  dayOptionDisabled: {
    backgroundColor: COLORS.secondary[50],
    borderColor: COLORS.secondary[100],
  },
  dayOptionText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[700],
    fontWeight: "600",
  },
  dayOptionTextSelected: {
    color: COLORS.primary.DEFAULT,
    fontWeight: "700",
  },
  dayOptionTextDisabled: {
    color: COLORS.secondary[400],
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.secondary[200],
  },
  timeSlotSelected: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary.DEFAULT,
  },
  timeSlotText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    fontWeight: "600",
  },
  timeSlotTextSelected: {
    color: COLORS.neutral.white,
    fontWeight: "700",
  },
  priceSummary: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  priceSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceSummaryLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    fontWeight: "500",
  },
  priceSummaryValue: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    fontWeight: "600",
  },
  priceSummaryDivider: {
    height: 1,
    backgroundColor: COLORS.primary[200],
    marginVertical: 8,
  },
  priceSummaryTotalLabel: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  priceSummaryTotalValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.primary.DEFAULT,
    fontWeight: "700",
  },
  modalBookButton: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: COLORS.primary.DEFAULT,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalBookButtonDisabled: {
    backgroundColor: COLORS.secondary[300],
    shadowOpacity: 0,
    elevation: 0,
  },
  modalBookButtonText: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.neutral.white,
    fontWeight: "700",
  },
});
