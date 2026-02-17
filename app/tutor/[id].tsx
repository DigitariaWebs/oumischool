import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
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
  ChevronDown,
  X,
  Calendar,
  Check,
  MessageSquare,
  ArrowLeft,
  Heart,
  Zap,
} from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  const { colors, isDark } = useTheme();
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

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const tutor = mockTutor;

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
      pathname: "/parent/profile/checkout",
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Organic Header with Blob Shape */}
        <View style={styles.headerWrapper}>
          <View style={styles.blobBackground} />
          <View style={styles.blobAccent} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.favoriteButton}>
            <Heart size={20} color={COLORS.error} />
          </TouchableOpacity>

          {/* Stacked Avatar with Decorative Elements */}
          <View style={styles.avatarStack}>
            <View style={styles.avatarGlow} />
            <Image source={{ uri: tutor.avatar }} style={styles.avatar} />
            <View style={styles.onlineIndicator} />
          </View>

          {/* Name and Quick Info */}
          <Text style={styles.tutorName}>{tutor.name}</Text>

          {/* Rating Bubble */}
          <View style={styles.ratingBubble}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingValue}>{tutor.rating}</Text>
            <Text style={styles.ratingDivider}>•</Text>
            <Text style={styles.reviewCount}>{tutor.reviewsCount} avis</Text>
          </View>

          {/* Location Chip */}
          <View style={styles.locationChip}>
            <MapPin size={14} color={COLORS.primary.DEFAULT} />
            <Text style={styles.locationText}>{tutor.region}</Text>
          </View>
        </View>

        {/* Horizontal Scrolling Stats */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScroll}
        >
          <View style={[styles.statBubble, styles.statBubbleFirst]}>
            <View
              style={[
                styles.statIconWrap,
                { backgroundColor: COLORS.primary[100] },
              ]}
            >
              <GraduationCap size={20} color={COLORS.primary.DEFAULT} />
            </View>
            <View>
              <Text style={styles.statNumber}>{tutor.experience}</Text>
              <Text style={styles.statUnit}>ans d&apos;exp.</Text>
            </View>
          </View>

          <View style={styles.statBubble}>
            <View style={[styles.statIconWrap, { backgroundColor: "#FEF3C7" }]}>
              <Award size={20} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.statNumber}>{tutor.rating}</Text>
              <Text style={styles.statUnit}>note /5</Text>
            </View>
          </View>

          <View style={styles.statBubble}>
            <View style={[styles.statIconWrap, { backgroundColor: "#DBEAFE" }]}>
              <Users size={20} color={COLORS.info} />
            </View>
            <View>
              <Text style={styles.statNumber}>{tutor.reviewsCount}</Text>
              <Text style={styles.statUnit}>élèves</Text>
            </View>
          </View>

          <View style={styles.statBubble}>
            <View style={[styles.statIconWrap, { backgroundColor: "#FCE7F3" }]}>
              <Zap size={20} color="#EC4899" />
            </View>
            <View>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statUnit}>satisfaction</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bio Section with Wavy Top */}
        <View style={styles.bioSection}>
          <View style={styles.sectionLabelWrap}>
            <Text style={styles.sectionEmoji}>👋</Text>
            <Text style={styles.sectionLabel}>À propos de moi</Text>
          </View>
          <Text style={styles.bioText}>{tutor.bio}</Text>
        </View>

        {/* Languages as Floating Pills */}
        <View style={styles.pillSection}>
          <View style={styles.sectionLabelWrap}>
            <Text style={styles.sectionEmoji}>🗣️</Text>
            <Text style={styles.sectionLabel}>Langues parlées</Text>
          </View>
          <View style={styles.pillContainer}>
            {tutor.languages.map((language, index) => (
              <View
                key={index}
                style={[
                  styles.languagePill,
                  index === 0 && styles.languagePillPrimary,
                ]}
              >
                <Text
                  style={[
                    styles.languagePillText,
                    index === 0 && styles.languagePillTextPrimary,
                  ]}
                >
                  {language}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subjects as Playful Cards */}
        <View style={styles.subjectsSection}>
          <View style={styles.sectionLabelWrap}>
            <Text style={styles.sectionEmoji}>📚</Text>
            <Text style={styles.sectionLabel}>Matières</Text>
          </View>
          <View style={styles.subjectCards}>
            {tutor.subjects.map((subject, index) => (
              <View
                key={subject.id}
                style={[
                  styles.subjectCard,
                  {
                    transform: [{ rotate: index % 2 === 0 ? "-2deg" : "2deg" }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.subjectIconCircle,
                    { backgroundColor: subject.color },
                  ]}
                >
                  <BookOpen size={24} color={COLORS.neutral.white} />
                </View>
                <Text style={styles.subjectCardName}>{subject.name}</Text>
                <View style={styles.subjectExpertTag}>
                  <Text style={styles.subjectExpertText}>Expert</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Curriculum Section - Accordion Style */}
        <View style={styles.curriculumSection}>
          <View style={styles.sectionLabelWrap}>
            <Text style={styles.sectionEmoji}>🎯</Text>
            <Text style={styles.sectionLabel}>Programmes disponibles</Text>
          </View>
          <Text style={styles.sectionSubtext}>
            Parcours structurés avec ressources pédagogiques
          </Text>

          {tutor.lessonPortfolio.map((curriculum) => (
            <View key={curriculum.id} style={styles.curriculumItem}>
              <TouchableOpacity
                style={styles.curriculumHeader}
                onPress={() =>
                  setExpandedCurriculum(
                    expandedCurriculum === curriculum.id ? null : curriculum.id,
                  )
                }
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.curriculumColorDot,
                    { backgroundColor: curriculum.subjectColor },
                  ]}
                />
                <View style={styles.curriculumHeaderContent}>
                  <Text style={styles.curriculumTitle}>{curriculum.title}</Text>
                  <View style={styles.curriculumMeta}>
                    <Text style={styles.curriculumMetaText}>
                      {curriculum.lessonsCount} leçons
                    </Text>
                    <Text style={styles.curriculumMetaDot}>•</Text>
                    <Text style={styles.curriculumMetaText}>
                      {curriculum.duration}
                    </Text>
                    <Text style={styles.curriculumMetaDot}>•</Text>
                    <Text style={styles.curriculumMetaText}>
                      {curriculum.level}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.expandButton,
                    expandedCurriculum === curriculum.id &&
                      styles.expandButtonActive,
                  ]}
                >
                  <ChevronDown
                    size={18}
                    color={
                      expandedCurriculum === curriculum.id
                        ? COLORS.neutral.white
                        : colors.textSecondary
                    }
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
                </View>
              </TouchableOpacity>

              {expandedCurriculum === curriculum.id && (
                <View style={styles.curriculumExpanded}>
                  <Text style={styles.curriculumDescription}>
                    {curriculum.description}
                  </Text>
                  <View style={styles.lessonTimeline}>
                    {curriculum.lessons.map((lesson, index) => (
                      <View key={lesson.id} style={styles.lessonTimelineItem}>
                        <View style={styles.timelineLeft}>
                          <View
                            style={[
                              styles.timelineDot,
                              { backgroundColor: curriculum.subjectColor },
                            ]}
                          />
                          {index < curriculum.lessons.length - 1 && (
                            <View
                              style={[
                                styles.timelineLine,
                                {
                                  backgroundColor:
                                    curriculum.subjectColor + "40",
                                },
                              ]}
                            />
                          )}
                        </View>
                        <Text style={styles.lessonTimelineText}>
                          {lesson.title}
                        </Text>
                      </View>
                    ))}
                    {curriculum.lessonsCount > curriculum.lessons.length && (
                      <View style={styles.moreIndicator}>
                        <Text style={styles.moreIndicatorText}>
                          +{curriculum.lessonsCount - curriculum.lessons.length}{" "}
                          autres leçons
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Methodology - Quote Style */}
        <View style={styles.methodologySection}>
          <View style={styles.sectionLabelWrap}>
            <Text style={styles.sectionEmoji}>💡</Text>
            <Text style={styles.sectionLabel}>Ma méthodologie</Text>
          </View>
          <View style={styles.methodologyQuote}>
            <Text style={styles.methodologyQuoteText}>
              &quot;{tutor.methodology.approach}&quot;
            </Text>
          </View>
          <View style={styles.techniqueGrid}>
            {tutor.methodology.techniques.map((technique, index) => (
              <View key={index} style={styles.techniqueChip}>
                <Check size={14} color={COLORS.success} />
                <Text style={styles.techniqueChipText}>{technique}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews - Card Stack */}
        <View style={styles.reviewsSection}>
          <View style={styles.sectionLabelWrap}>
            <Text style={styles.sectionEmoji}>⭐</Text>
            <Text style={styles.sectionLabel}>
              Avis parents ({tutor.reviewsCount})
            </Text>
          </View>

          {tutor.reviews.map((review, index) => (
            <View
              key={review.id}
              style={[styles.reviewCard, index === 0 && styles.reviewCardFirst]}
            >
              <View style={styles.reviewTop}>
                <View style={styles.reviewStars}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      color="#F59E0B"
                      fill={i < review.rating ? "#F59E0B" : "transparent"}
                    />
                  ))}
                </View>
                <Text style={styles.reviewDateText}>{review.date}</Text>
              </View>
              <Text style={styles.reviewCommentText}>{review.comment}</Text>
              <View style={styles.reviewAuthor}>
                <View style={styles.reviewAuthorAvatar}>
                  <Text style={styles.reviewAuthorInitial}>
                    {review.parentName.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.reviewAuthorName}>
                    {review.parentName}
                  </Text>
                  <Text style={styles.reviewAuthorChild}>
                    Parent de {review.childName}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomFloating}>
        <View style={styles.priceTag}>
          <Text style={styles.priceFrom}>À partir de</Text>
          <Text style={styles.priceAmount}>{tutor.hourlyRate}€</Text>
          <Text style={styles.priceUnit}>/h</Text>
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.messageBtn}
            onPress={() => router.push("/messaging")}
            activeOpacity={0.8}
          >
            <MessageSquare size={22} color={COLORS.primary.DEFAULT} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => setBookingModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.bookBtnText}>Réserver</Text>
            <Calendar size={18} color={COLORS.neutral.white} />
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
          <View style={styles.modalSheet}>
            {/* Modal Handle */}
            <View style={styles.modalHandle} />

            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Réservation</Text>
                <Text style={styles.modalWith}>avec {tutor.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setBookingModalVisible(false)}
              >
                <X size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Children Selection */}
              <View style={styles.modalBlock}>
                <Text style={styles.modalBlockTitle}>
                  👶 Sélectionnez vos enfants
                </Text>
                {mockChildren.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childRow,
                      selectedChildren.includes(child.id) &&
                        styles.childRowSelected,
                    ]}
                    onPress={() => toggleChildSelection(child.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.childInitial,
                        selectedChildren.includes(child.id) &&
                          styles.childInitialSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.childInitialText,
                          selectedChildren.includes(child.id) &&
                            styles.childInitialTextSelected,
                        ]}
                      >
                        {child.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childDetails}>
                        {child.age} ans • {child.grade}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.checkCircle,
                        selectedChildren.includes(child.id) &&
                          styles.checkCircleChecked,
                      ]}
                    >
                      {selectedChildren.includes(child.id) && (
                        <Check size={14} color={COLORS.neutral.white} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Mode Selection */}
              <View style={styles.modalBlock}>
                <Text style={styles.modalBlockTitle}>📍 Mode de cours</Text>
                <View style={styles.modeRow}>
                  <TouchableOpacity
                    style={[
                      styles.modeCard,
                      selectedMode === "online" && styles.modeCardSelected,
                    ]}
                    onPress={() => setSelectedMode("online")}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.modeIconBg,
                        selectedMode === "online" && styles.modeIconBgSelected,
                      ]}
                    >
                      <Video
                        size={24}
                        color={
                          selectedMode === "online"
                            ? COLORS.neutral.white
                            : colors.textSecondary
                        }
                      />
                    </View>
                    <Text
                      style={[
                        styles.modeLabel,
                        selectedMode === "online" && styles.modeLabelSelected,
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
                      {tutor.hourlyRate}€/h
                    </Text>
                  </TouchableOpacity>

                  {tutor.inPersonAvailable && (
                    <TouchableOpacity
                      style={[
                        styles.modeCard,
                        selectedMode === "inPerson" && styles.modeCardSelected,
                      ]}
                      onPress={() => setSelectedMode("inPerson")}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.modeIconBg,
                          selectedMode === "inPerson" &&
                            styles.modeIconBgSelected,
                        ]}
                      >
                        <Users
                          size={24}
                          color={
                            selectedMode === "inPerson"
                              ? COLORS.neutral.white
                              : colors.textSecondary
                          }
                        />
                      </View>
                      <Text
                        style={[
                          styles.modeLabel,
                          selectedMode === "inPerson" &&
                            styles.modeLabelSelected,
                        ]}
                      >
                        Présentiel
                      </Text>
                      <Text
                        style={[
                          styles.modePrice,
                          selectedMode === "inPerson" &&
                            styles.modePriceSelected,
                        ]}
                      >
                        {tutor.inPersonRate}€/h
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Day Selection */}
              <View style={styles.modalBlock}>
                <Text style={styles.modalBlockTitle}>📅 Jour</Text>
                <View style={styles.dayPills}>
                  {daysOfWeek.map((day) => {
                    const hasSlots = getAvailableTimeSlots(day.key).length > 0;
                    return (
                      <TouchableOpacity
                        key={day.key}
                        style={[
                          styles.dayPill,
                          selectedDay === day.key && styles.dayPillSelected,
                          !hasSlots && styles.dayPillDisabled,
                        ]}
                        onPress={() => hasSlots && setSelectedDay(day.key)}
                        disabled={!hasSlots}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dayPillText,
                            selectedDay === day.key &&
                              styles.dayPillTextSelected,
                            !hasSlots && styles.dayPillTextDisabled,
                          ]}
                        >
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Time Slots */}
              {selectedDay && (
                <View style={styles.modalBlock}>
                  <Text style={styles.modalBlockTitle}>⏰ Horaire</Text>
                  <View style={styles.timeSlotRow}>
                    {getAvailableTimeSlots(selectedDay).map((slot, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.timeSlotPill,
                          selectedTimeSlot === slot &&
                            styles.timeSlotPillSelected,
                        ]}
                        onPress={() => setSelectedTimeSlot(slot)}
                        activeOpacity={0.7}
                      >
                        <Clock
                          size={14}
                          color={
                            selectedTimeSlot === slot
                              ? COLORS.neutral.white
                              : colors.textSecondary
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

              {/* Summary */}
              {selectedChildren.length > 0 && (
                <View style={styles.summaryBox}>
                  <View style={styles.summaryLine}>
                    <Text style={styles.summaryLabel}>
                      {selectedChildren.length} enfant
                      {selectedChildren.length > 1 ? "s" : ""}
                    </Text>
                    <Text style={styles.summaryVal}>
                      {selectedChildren.length} ×{" "}
                      {selectedMode === "online"
                        ? tutor.hourlyRate
                        : tutor.inPersonRate}
                      €
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryLine}>
                    <Text style={styles.summaryTotalLabel}>Total / séance</Text>
                    <Text style={styles.summaryTotalVal}>
                      {calculateTotalPrice()}€
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.confirmBtn, !canBook && styles.confirmBtnDisabled]}
              onPress={handleBooking}
              disabled={!canBook}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmBtnText}>
                Confirmer la réservation
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (
  colors: import("@/constants/theme").ThemeColors,
  isDark: boolean,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 20,
    },

    // Header with Organic Blob
    headerWrapper: {
      paddingTop: 16,
      paddingBottom: 28,
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    },
    blobBackground: {
      position: "absolute",
      top: -80,
      left: -40,
      width: SCREEN_WIDTH + 80,
      height: 320,
      backgroundColor: COLORS.primary[100],
      borderBottomLeftRadius: 999,
      borderBottomRightRadius: 999,
      transform: [{ scaleX: 1.2 }],
    },
    blobAccent: {
      position: "absolute",
      top: -100,
      right: -60,
      width: 180,
      height: 180,
      backgroundColor: COLORS.primary[200],
      borderRadius: 999,
      opacity: 0.6,
    },
    backButton: {
      position: "absolute",
      top: 12,
      left: 16,
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: COLORS.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      zIndex: 10,
    },
    favoriteButton: {
      position: "absolute",
      top: 12,
      right: 16,
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: COLORS.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      zIndex: 10,
    },

    // Avatar Stack
    avatarStack: {
      marginTop: 40,
      marginBottom: 16,
      position: "relative",
    },
    avatarGlow: {
      position: "absolute",
      top: -8,
      left: -8,
      width: 126,
      height: 126,
      borderRadius: 63,
      backgroundColor: COLORS.primary.DEFAULT,
      opacity: 0.15,
    },
    avatar: {
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 4,
      borderColor: colors.card,
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 6,
      right: 6,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: COLORS.success,
      borderWidth: 3,
      borderColor: colors.card,
    },

    tutorName: {
      fontFamily: FONTS.fredoka,
      fontSize: 28,
      color: colors.textPrimary,
      fontWeight: "700",
      marginBottom: 10,
      letterSpacing: -0.5,
    },

    ratingBubble: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      gap: 6,
      marginBottom: 10,
      shadowColor: COLORS.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    ratingValue: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    ratingDivider: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    reviewCount: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },

    locationChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: COLORS.primary[50],
      borderRadius: 14,
    },
    locationText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: COLORS.primary.DEFAULT,
      fontWeight: "600",
    },

    // Stats Scroll
    statsScroll: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    statBubble: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 20,
      gap: 12,
      shadowColor: COLORS.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    statBubbleFirst: {
      marginLeft: 0,
    },
    statIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    statNumber: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    statUnit: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },

    // Bio Section
    bioSection: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 16,
    },
    sectionLabelWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 14,
    },
    sectionEmoji: {
      fontSize: 22,
    },
    sectionLabel: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    bioText: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 24,
      letterSpacing: 0.1,
    },

    // Pills Section
    pillSection: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    pillContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    languagePill: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: colors.input,
    },
    languagePillPrimary: {
      backgroundColor: COLORS.primary.DEFAULT,
    },
    languagePillText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "600",
    },
    languagePillTextPrimary: {
      color: COLORS.neutral.white,
    },

    // Subjects Section
    subjectsSection: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    subjectCards: {
      flexDirection: "row",
      gap: 16,
    },
    subjectCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 20,
      alignItems: "center",
      shadowColor: COLORS.neutral.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    subjectIconCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    subjectCardName: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      color: colors.textPrimary,
      fontWeight: "700",
      marginBottom: 8,
    },
    subjectExpertTag: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      backgroundColor: COLORS.success + "20",
      borderRadius: 10,
    },
    subjectExpertText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      color: COLORS.success,
      fontWeight: "700",
      textTransform: "uppercase",
    },

    // Curriculum Section
    curriculumSection: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    sectionSubtext: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
      marginTop: -6,
    },
    curriculumItem: {
      backgroundColor: colors.card,
      borderRadius: 20,
      marginBottom: 12,
      overflow: "hidden",
      shadowColor: COLORS.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    curriculumHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      gap: 12,
    },
    curriculumColorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    curriculumHeaderContent: {
      flex: 1,
    },
    curriculumTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "700",
      marginBottom: 4,
    },
    curriculumMeta: {
      flexDirection: "row",
      alignItems: "center",
    },
    curriculumMetaText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    curriculumMetaDot: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
      marginHorizontal: 6,
    },
    expandButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.input,
      justifyContent: "center",
      alignItems: "center",
    },
    expandButtonActive: {
      backgroundColor: COLORS.primary.DEFAULT,
    },
    curriculumExpanded: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    curriculumDescription: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 16,
    },

    // Timeline
    lessonTimeline: {
      paddingLeft: 4,
    },
    lessonTimelineItem: {
      flexDirection: "row",
      minHeight: 36,
    },
    timelineLeft: {
      width: 24,
      alignItems: "center",
    },
    timelineDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginTop: 4,
    },
    timelineLine: {
      width: 2,
      flex: 1,
      marginTop: 4,
    },
    lessonTimelineText: {
      flex: 1,
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textPrimary,
      marginLeft: 12,
      paddingBottom: 12,
    },
    moreIndicator: {
      marginLeft: 36,
      paddingVertical: 8,
    },
    moreIndicatorText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: COLORS.primary.DEFAULT,
      fontWeight: "600",
    },

    // Methodology
    methodologySection: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    methodologyQuote: {
      backgroundColor: COLORS.primary[50],
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
    },
    methodologyQuoteText: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 24,
      fontStyle: "italic",
    },
    techniqueGrid: {
      gap: 10,
    },
    techniqueChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 14,
    },
    techniqueChipText: {
      flex: 1,
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "500",
    },

    // Reviews
    reviewsSection: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    reviewCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 12,
      shadowColor: COLORS.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    reviewCardFirst: {
      marginTop: 0,
    },
    reviewTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    reviewStars: {
      flexDirection: "row",
      gap: 3,
    },
    reviewDateText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
    },
    reviewCommentText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 22,
      marginBottom: 16,
    },
    reviewAuthor: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    reviewAuthorAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.primary.DEFAULT,
      justifyContent: "center",
      alignItems: "center",
    },
    reviewAuthorInitial: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      color: COLORS.neutral.white,
      fontWeight: "700",
    },
    reviewAuthorName: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    reviewAuthorChild: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
    },

    // Bottom Floating Bar
    bottomFloating: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 32,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: COLORS.neutral.black,
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 16,
    },
    priceTag: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    priceFrom: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
      marginRight: 4,
    },
    priceAmount: {
      fontFamily: FONTS.fredoka,
      fontSize: 28,
      color: COLORS.primary.DEFAULT,
      fontWeight: "700",
    },
    priceUnit: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    bottomActions: {
      flexDirection: "row",
      gap: 10,
    },
    messageBtn: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: COLORS.primary[50],
      justifyContent: "center",
      alignItems: "center",
    },
    bookBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: COLORS.primary.DEFAULT,
      paddingHorizontal: 28,
      paddingVertical: 16,
      borderRadius: 26,
      shadowColor: COLORS.primary.DEFAULT,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    bookBtnText: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      color: COLORS.neutral.white,
      fontWeight: "700",
    },

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      maxHeight: "92%",
      paddingBottom: 32,
    },
    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      alignSelf: "center",
      marginTop: 12,
      marginBottom: 8,
    },
    modalHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    modalWith: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
    },
    modalCloseBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.input,
      justifyContent: "center",
      alignItems: "center",
    },
    modalBlock: {
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    modalBlockTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      color: colors.textPrimary,
      fontWeight: "700",
      marginBottom: 16,
    },

    // Child Selection
    childRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 18,
      padding: 14,
      marginBottom: 10,
      gap: 12,
    },
    childRowSelected: {
      backgroundColor: COLORS.primary[50],
    },
    childInitial: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
    },
    childInitialSelected: {
      backgroundColor: COLORS.primary.DEFAULT,
    },
    childInitialText: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    childInitialTextSelected: {
      color: COLORS.neutral.white,
    },
    childInfo: {
      flex: 1,
    },
    childName: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    childDetails: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    checkCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    checkCircleChecked: {
      backgroundColor: COLORS.primary.DEFAULT,
      borderColor: COLORS.primary.DEFAULT,
    },

    // Mode Cards
    modeRow: {
      flexDirection: "row",
      gap: 12,
    },
    modeCard: {
      flex: 1,
      backgroundColor: colors.input,
      borderRadius: 20,
      padding: 18,
      alignItems: "center",
      gap: 10,
    },
    modeCardSelected: {
      backgroundColor: COLORS.primary[50],
    },
    modeIconBg: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
    },
    modeIconBgSelected: {
      backgroundColor: COLORS.primary.DEFAULT,
    },
    modeLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    modeLabelSelected: {
      color: COLORS.primary.DEFAULT,
    },
    modePrice: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      color: colors.textSecondary,
      fontWeight: "700",
    },
    modePriceSelected: {
      color: COLORS.primary.DEFAULT,
    },

    // Day Pills
    dayPills: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    dayPill: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      backgroundColor: colors.input,
      borderRadius: 16,
    },
    dayPillSelected: {
      backgroundColor: COLORS.primary.DEFAULT,
    },
    dayPillDisabled: {
      opacity: 0.4,
    },
    dayPillText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    dayPillTextSelected: {
      color: COLORS.neutral.white,
    },
    dayPillTextDisabled: {
      color: colors.textMuted,
    },

    // Time Slots
    timeSlotRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    timeSlotPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.input,
      borderRadius: 14,
    },
    timeSlotPillSelected: {
      backgroundColor: COLORS.primary.DEFAULT,
    },
    timeSlotText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "600",
    },
    timeSlotTextSelected: {
      color: COLORS.neutral.white,
    },

    // Summary Box
    summaryBox: {
      marginHorizontal: 24,
      marginTop: 12,
      padding: 20,
      backgroundColor: COLORS.primary[50],
      borderRadius: 20,
    },
    summaryLine: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    summaryLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
    },
    summaryVal: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    summaryDivider: {
      height: 1,
      backgroundColor: COLORS.primary[200],
      marginVertical: 14,
    },
    summaryTotalLabel: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    summaryTotalVal: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      color: COLORS.primary.DEFAULT,
      fontWeight: "700",
    },

    // Confirm Button
    confirmBtn: {
      marginHorizontal: 24,
      marginTop: 20,
      backgroundColor: COLORS.primary.DEFAULT,
      borderRadius: 20,
      paddingVertical: 18,
      alignItems: "center",
      shadowColor: COLORS.primary.DEFAULT,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    confirmBtnDisabled: {
      backgroundColor: COLORS.secondary[300],
      shadowOpacity: 0,
      elevation: 0,
    },
    confirmBtnText: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      color: COLORS.neutral.white,
      fontWeight: "700",
    },
  });
