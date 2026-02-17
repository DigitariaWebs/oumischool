import React, { useState, useMemo } from "react";
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
  Info,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";

// Mock data - in real app, this would come from user state/API
const mockCurriculums = [
  {
    id: "1",
    title: "Algèbre Fondamentale",
    subject: "Mathématiques",
    subjectColor: "#3B82F6",
    icon: "📐",
    lessonsCount: 8,
    level: "Niveau 3ème",
  },
  {
    id: "2",
    title: "Grammaire Française Avancée",
    subject: "Français",
    subjectColor: "#8B5CF6",
    icon: "📚",
    lessonsCount: 6,
    level: "Niveau Lycée",
  },
  {
    id: "3",
    title: "Physique - Mécanique",
    subject: "Physique",
    subjectColor: "#10B981",
    icon: "⚛️",
    lessonsCount: 10,
    level: "Niveau 2nde",
  },
];

const mockSubjects = [
  { id: "math", name: "Mathématiques", color: "#3B82F6", icon: "📐" },
  { id: "french", name: "Français", color: "#8B5CF6", icon: "📚" },
  { id: "physics", name: "Physique", color: "#10B981", icon: "⚛️" },
  { id: "chemistry", name: "Chimie", color: "#F59E0B", icon: "🧪" },
];

interface ExpandableSectionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  colors: import("@/constants/theme").ThemeColors;
  isDark: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  defaultExpanded = false,
  colors,
  isDark,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const rotation = useSharedValue(defaultExpanded ? 180 : 0);

  const animatedChevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleToggle = () => {
    setExpanded(!expanded);
    rotation.value = withTiming(expanded ? 0 : 180, { duration: 300 });
  };

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={styles.sectionCard}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderLeft}>
          <View style={styles.sectionIcon}>{icon}</View>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <Animated.View style={animatedChevronStyle}>
          <ChevronDown size={24} color={colors.textSecondary} />
        </Animated.View>
      </TouchableOpacity>
      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

export default function PublicProfileSettings() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  // State for profile settings
  const [profileActive, setProfileActive] = useState(true);
  const [showBio, setShowBio] = useState(true);
  const [showMethodology, setShowMethodology] = useState(true);
  const [showReviews, setShowReviews] = useState(true);
  const [showAvailability, setShowAvailability] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "math",
    "french",
    "physics",
  ]);
  const [selectedCurriculums, setSelectedCurriculums] = useState<string[]>([
    "1",
    "2",
  ]);

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

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
    // In real app, save to backend/Redux
    console.log("Saving profile settings:", {
      profileActive,
      showBio,
      showMethodology,
      showReviews,
      showAvailability,
      selectedSubjects,
      selectedCurriculums,
    });
    // Show success feedback and navigate back
    router.back();
  };

  const handlePreview = () => {
    // Navigate to tutor profile view (using user's own ID)
    router.push("/tutor/1"); // Replace with actual user ID
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={["#8B5CF6", "#6366F1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={COLORS.neutral.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil Public</Text>
          <TouchableOpacity
            style={styles.previewButton}
            onPress={handlePreview}
          >
            <Eye size={20} color={COLORS.neutral.white} />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.infoBanner}
        >
          <Info size={20} color={isDark ? "#FCD34D" : "#F59E0B"} />
          <Text style={styles.infoBannerText}>
            Personnalisez ce que les parents et élèves voient sur votre profil
            public
          </Text>
        </Animated.View>

        {/* Master Toggle */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(400)}
          style={styles.masterCard}
        >
          <View style={styles.masterCardContent}>
            <View style={styles.masterCardLeft}>
              {profileActive ? (
                <View style={styles.statusIconActive}>
                  <Eye size={24} color="#10B981" />
                </View>
              ) : (
                <View style={styles.statusIconInactive}>
                  <EyeOff size={24} color={colors.textSecondary} />
                </View>
              )}
              <View style={styles.masterCardText}>
                <Text style={styles.masterCardTitle}>
                  Profil Public {profileActive ? "Actif" : "Désactivé"}
                </Text>
                <Text style={styles.masterCardSubtitle}>
                  {profileActive
                    ? "Votre profil est visible par tous"
                    : "Votre profil est caché"}
                </Text>
              </View>
            </View>
            <Switch
              value={profileActive}
              onValueChange={setProfileActive}
              trackColor={{
                false: isDark ? COLORS.neutral[700] : COLORS.neutral[300],
                true: "#10B981",
              }}
              thumbColor={COLORS.neutral.white}
            />
          </View>
        </Animated.View>

        {/* Profile Sections Visibility */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ExpandableSection
            title="Sections du Profil"
            subtitle="Choisir les sections à afficher"
            icon={<BookOpen size={20} color="#8B5CF6" />}
            defaultExpanded={true}
            colors={colors}
            isDark={isDark}
          >
            <View style={styles.toggleList}>
              {[
                { label: "Biographie", value: showBio, setter: setShowBio },
                {
                  label: "Méthodologie",
                  value: showMethodology,
                  setter: setShowMethodology,
                },
                {
                  label: "Avis et Notes",
                  value: showReviews,
                  setter: setShowReviews,
                },
                {
                  label: "Disponibilités",
                  value: showAvailability,
                  setter: setShowAvailability,
                },
              ].map((item, index) => (
                <View key={index} style={styles.toggleItem}>
                  <Text style={styles.toggleLabel}>{item.label}</Text>
                  <Switch
                    value={item.value}
                    onValueChange={item.setter}
                    disabled={!profileActive}
                    trackColor={{
                      false: isDark ? COLORS.neutral[700] : COLORS.neutral[300],
                      true: COLORS.secondary.DEFAULT,
                    }}
                    thumbColor={COLORS.neutral.white}
                  />
                </View>
              ))}
            </View>
          </ExpandableSection>
        </Animated.View>

        {/* Subjects Selection */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <ExpandableSection
            title="Matières à Mettre en Avant"
            subtitle={`${selectedSubjects.length} sur ${mockSubjects.length} sélectionnées`}
            icon={<GraduationCap size={20} color="#3B82F6" />}
            defaultExpanded={true}
            colors={colors}
            isDark={isDark}
          >
            <View style={styles.subjectsGrid}>
              {mockSubjects.map((subject) => {
                const isSelected = selectedSubjects.includes(subject.id);
                return (
                  <TouchableOpacity
                    key={subject.id}
                    style={[
                      styles.subjectCard,
                      isSelected && {
                        ...styles.subjectCardSelected,
                        borderColor: subject.color,
                      },
                      !profileActive && styles.subjectCardDisabled,
                    ]}
                    onPress={() => toggleSubject(subject.id)}
                    disabled={!profileActive}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.subjectCardIcon,
                        { backgroundColor: subject.color + "20" },
                      ]}
                    >
                      <Text style={styles.subjectEmoji}>{subject.icon}</Text>
                    </View>
                    <Text
                      style={[
                        styles.subjectCardName,
                        !profileActive && styles.textDisabled,
                      ]}
                    >
                      {subject.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <CheckCircle2
                          size={20}
                          color={subject.color}
                          fill={subject.color}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ExpandableSection>
        </Animated.View>

        {/* Lesson Portfolio */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <ExpandableSection
            title="Cours à Proposer"
            subtitle={`${selectedCurriculums.length} sur ${mockCurriculums.length} cours affichés`}
            icon={<BookOpen size={20} color="#10B981" />}
            defaultExpanded={true}
            colors={colors}
            isDark={isDark}
          >
            <View style={styles.curriculumsList}>
              {mockCurriculums.map((curriculum) => {
                const isSelected = selectedCurriculums.includes(curriculum.id);
                return (
                  <TouchableOpacity
                    key={curriculum.id}
                    style={[
                      styles.curriculumCard,
                      isSelected && {
                        ...styles.curriculumCardSelected,
                        borderColor: isDark
                          ? curriculum.subjectColor + "60"
                          : curriculum.subjectColor + "40",
                      },
                      !profileActive && styles.curriculumCardDisabled,
                    ]}
                    onPress={() => toggleCurriculum(curriculum.id)}
                    disabled={!profileActive}
                    activeOpacity={0.7}
                  >
                    <View style={styles.curriculumCardLeft}>
                      <View
                        style={[
                          styles.curriculumIcon,
                          {
                            backgroundColor: curriculum.subjectColor + "20",
                          },
                        ]}
                      >
                        <Text style={styles.curriculumEmoji}>
                          {curriculum.icon}
                        </Text>
                      </View>
                      <View style={styles.curriculumInfo}>
                        <Text
                          style={[
                            styles.curriculumTitle,
                            !profileActive && styles.textDisabled,
                          ]}
                        >
                          {curriculum.title}
                        </Text>
                        <Text
                          style={[
                            styles.curriculumMeta,
                            !profileActive && styles.textDisabled,
                          ]}
                        >
                          {curriculum.lessonsCount} leçons • {curriculum.level}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && {
                          backgroundColor: curriculum.subjectColor,
                          borderColor: curriculum.subjectColor,
                        },
                      ]}
                    >
                      {isSelected && (
                        <CheckCircle2
                          size={18}
                          color={COLORS.neutral.white}
                          fill={COLORS.neutral.white}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ExpandableSection>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#8B5CF6", "#6366F1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButtonGradient}
          >
            <Save size={20} color={COLORS.neutral.white} />
            <Text style={styles.saveButtonText}>
              Enregistrer les modifications
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    header: {
      shadowColor: isDark ? COLORS.neutral.black : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    headerGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.25)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 22,
      color: COLORS.neutral.white,
      fontWeight: "600",
    },
    previewButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.25)",
      justifyContent: "center",
      alignItems: "center",
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    infoBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.infoCardBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: colors.infoCardBorder,
    },
    infoBannerText: {
      flex: 1,
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.infoCardText,
      lineHeight: 20,
    },
    masterCard: {
      backgroundColor: colors.cardElevated,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      shadowColor: isDark ? COLORS.neutral.black : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 16,
      elevation: 6,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    masterCardContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    masterCardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      flex: 1,
    },
    statusIconActive: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#10B98120",
      justifyContent: "center",
      alignItems: "center",
    },
    statusIconInactive: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.input,
      justifyContent: "center",
      alignItems: "center",
    },
    masterCardText: {
      flex: 1,
    },
    masterCardTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      color: colors.textPrimary,
      fontWeight: "600",
      marginBottom: 4,
    },
    masterCardSubtitle: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
    },
    sectionCard: {
      backgroundColor: colors.cardElevated,
      borderRadius: 20,
      marginBottom: 16,
      shadowColor: isDark ? COLORS.neutral.black : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.06,
      shadowRadius: 12,
      elevation: 4,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
    },
    sectionHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flex: 1,
    },
    sectionIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? colors.input : colors.buttonSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
    sectionHeaderText: {
      flex: 1,
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 17,
      color: colors.textPrimary,
      fontWeight: "600",
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    sectionContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    toggleList: {
      gap: 10,
    },
    toggleItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: isDark ? colors.input : colors.buttonSecondary,
      borderRadius: 14,
    },
    toggleLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: colors.textPrimary,
      fontWeight: "500",
    },
    subjectsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    subjectCard: {
      flex: 1,
      minWidth: "45%",
      backgroundColor: isDark ? colors.input : colors.buttonSecondary,
      borderRadius: 18,
      padding: 18,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
      position: "relative",
    },
    subjectCardSelected: {
      backgroundColor: colors.card,
      borderWidth: 2,
    },
    subjectCardDisabled: {
      opacity: 0.5,
    },
    subjectCardIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    subjectEmoji: {
      fontSize: 32,
    },
    subjectCardName: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "600",
      textAlign: "center",
    },
    checkmark: {
      position: "absolute",
      top: 10,
      right: 10,
    },
    curriculumsList: {
      gap: 12,
    },
    curriculumCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: isDark ? colors.input : colors.buttonSecondary,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: "transparent",
    },
    curriculumCardSelected: {
      backgroundColor: colors.card,
    },
    curriculumCardDisabled: {
      opacity: 0.5,
    },
    curriculumCardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flex: 1,
    },
    curriculumIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      justifyContent: "center",
      alignItems: "center",
    },
    curriculumEmoji: {
      fontSize: 26,
    },
    curriculumInfo: {
      flex: 1,
    },
    curriculumTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "600",
      marginBottom: 4,
    },
    curriculumMeta: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    checkbox: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: isDark ? colors.border : colors.inputBorder,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.card,
    },
    textDisabled: {
      color: colors.textMuted,
    },
    bottomSpacer: {
      height: 100,
    },
    bottomBar: {
      padding: 16,
      paddingBottom: 24,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      shadowColor: isDark ? COLORS.neutral.black : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 16,
      elevation: 12,
    },
    saveButton: {
      borderRadius: 18,
      overflow: "hidden",
      shadowColor: "#8B5CF6",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    saveButtonGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingVertical: 18,
    },
    saveButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      color: COLORS.neutral.white,
      fontWeight: "600",
    },
  });
