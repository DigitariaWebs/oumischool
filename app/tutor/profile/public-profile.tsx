import React, { useState } from "react";
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
  Lightbulb,
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
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  defaultExpanded = false,
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
          <ChevronDown size={24} color={COLORS.secondary[400]} />
        </Animated.View>
      </TouchableOpacity>
      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

export default function PublicProfileSettings() {
  const router = useRouter();

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
          <Lightbulb size={20} color="#F59E0B" />
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
                <Eye size={24} color="#10B981" />
              ) : (
                <EyeOff size={24} color={COLORS.secondary[400]} />
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
                false: COLORS.neutral[300],
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
          >
            <View style={styles.toggleList}>
              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>Biographie</Text>
                <Switch
                  value={showBio}
                  onValueChange={setShowBio}
                  disabled={!profileActive}
                  trackColor={{
                    false: COLORS.neutral[300],
                    true: COLORS.secondary.DEFAULT,
                  }}
                  thumbColor={COLORS.neutral.white}
                />
              </View>
              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>Méthodologie</Text>
                <Switch
                  value={showMethodology}
                  onValueChange={setShowMethodology}
                  disabled={!profileActive}
                  trackColor={{
                    false: COLORS.neutral[300],
                    true: COLORS.secondary.DEFAULT,
                  }}
                  thumbColor={COLORS.neutral.white}
                />
              </View>
              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>Avis et Notes</Text>
                <Switch
                  value={showReviews}
                  onValueChange={setShowReviews}
                  disabled={!profileActive}
                  trackColor={{
                    false: COLORS.neutral[300],
                    true: COLORS.secondary.DEFAULT,
                  }}
                  thumbColor={COLORS.neutral.white}
                />
              </View>
              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>Disponibilités</Text>
                <Switch
                  value={showAvailability}
                  onValueChange={setShowAvailability}
                  disabled={!profileActive}
                  trackColor={{
                    false: COLORS.neutral[300],
                    true: COLORS.secondary.DEFAULT,
                  }}
                  thumbColor={COLORS.neutral.white}
                />
              </View>
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
          >
            <View style={styles.subjectsGrid}>
              {mockSubjects.map((subject) => {
                const isSelected = selectedSubjects.includes(subject.id);
                return (
                  <TouchableOpacity
                    key={subject.id}
                    style={[
                      styles.subjectCard,
                      isSelected && styles.subjectCardSelected,
                      { borderColor: subject.color },
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
                        <CheckCircle2 size={20} color={subject.color} />
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
          >
            <View style={styles.curriculumsList}>
              {mockCurriculums.map((curriculum) => {
                const isSelected = selectedCurriculums.includes(curriculum.id);
                return (
                  <TouchableOpacity
                    key={curriculum.id}
                    style={[
                      styles.curriculumCard,
                      isSelected && styles.curriculumCardSelected,
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
                          size={20}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.neutral.white,
    fontWeight: "600",
  },
  previewButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
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
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  infoBannerText: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
  },
  masterCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
  masterCardText: {
    flex: 1,
  },
  masterCardTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    fontWeight: "600",
    marginBottom: 4,
  },
  masterCardSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
  },
  sectionCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
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
    gap: 12,
    flex: 1,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[900],
    fontWeight: "600",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  toggleList: {
    gap: 12,
  },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
  },
  toggleLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[700],
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
    backgroundColor: COLORS.neutral[50],
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  subjectCardSelected: {
    backgroundColor: COLORS.neutral.white,
    borderWidth: 2,
  },
  subjectCardDisabled: {
    opacity: 0.5,
  },
  subjectCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectEmoji: {
    fontSize: 28,
  },
  subjectCardName: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    fontWeight: "600",
    textAlign: "center",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  curriculumsList: {
    gap: 12,
  },
  curriculumCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  curriculumCardSelected: {
    backgroundColor: COLORS.neutral.white,
    borderColor: COLORS.secondary[200],
  },
  curriculumCardDisabled: {
    opacity: 0.5,
  },
  curriculumCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  curriculumIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  curriculumEmoji: {
    fontSize: 24,
  },
  curriculumInfo: {
    flex: 1,
  },
  curriculumTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[900],
    fontWeight: "600",
    marginBottom: 4,
  },
  curriculumMeta: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.neutral[300],
    justifyContent: "center",
    alignItems: "center",
  },
  textDisabled: {
    color: COLORS.secondary[400],
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: COLORS.neutral.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  saveButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.neutral.white,
    fontWeight: "600",
  },
});
