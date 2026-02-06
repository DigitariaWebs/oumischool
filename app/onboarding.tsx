import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Baby,
  User,
  GraduationCap,
  Users,
  BookOpen,
} from "lucide-react-native";
import Svg, { Path } from "react-native-svg";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

const { width } = Dimensions.get("window");

// Data for selections
const ROLES = [
  { id: "maman", label: "Maman", Icon: User },
  { id: "papa", label: "Papa", Icon: User },
  { id: "tuteur", label: "Tuteur / Prof", Icon: GraduationCap },
  { id: "autre", label: "Autre", Icon: Users },
];

const GRADES = [
  { id: "ps", label: "Petite Section (PS)", short: "PS" },
  { id: "ms", label: "Moyenne Section (MS)", short: "MS" },
  { id: "gs", label: "Grande Section (GS)", short: "GS" },
  { id: "cp", label: "CP", short: "CP" },
  { id: "ce1", label: "CE1", short: "CE1" },
  { id: "ce2", label: "CE2", short: "CE2" },
  { id: "cm1", label: "CM1", short: "CM1" },
  { id: "cm2", label: "CM2", short: "CM2" },
];

const GOALS = [
  {
    id: "ief_full",
    label: "Instruction en Famille (IEF)",
    desc: "École à la maison complète",
  },
  {
    id: "ief_partial",
    label: "IEF Partiel / Co-schooling",
    desc: "Complément à l'école",
  },
  {
    id: "support",
    label: "Soutien Scolaire",
    desc: "Aide aux devoirs et renforcement",
  },
];

const HeaderBackground = () => (
  <View style={styles.headerBackgroundContainer}>
    <Svg
      height="100%"
      width="100%"
      viewBox="0 0 375 200"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
    >
      <Path
        d="M0 0H375V140C375 140 280 180 187.5 180C95 180 0 140 0 140V0Z"
        fill={COLORS.primary.DEFAULT}
      />
    </Svg>
  </View>
);

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Form State
  const [role, setRole] = useState("");
  const [childName, setChildName] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [goal, setGoal] = useState("");

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Finish onboarding
      router.replace("/(tabs)");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const isStepValid = () => {
    if (step === 0) return !!role;
    if (step === 1) return !!childName && !!childGrade;
    if (step === 2) return !!goal;
    return false;
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Qui êtes-vous ?</Text>
            <Text style={styles.stepSubtitle}>
              Pour personnaliser votre expérience.
            </Text>

            <View style={styles.gridContainer}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.roleCard,
                    role === r.id && styles.selectedCard,
                  ]}
                  onPress={() => setRole(r.id)}
                >
                  <r.Icon
                    size={40}
                    color={
                      role === r.id
                        ? COLORS.primary.DEFAULT
                        : COLORS.secondary[300]
                    }
                    style={{ marginBottom: 12 }}
                  />
                  <Text
                    style={[
                      styles.cardLabel,
                      role === r.id && styles.selectedText,
                    ]}
                  >
                    {r.label}
                  </Text>
                  {role === r.id && (
                    <View style={styles.checkBadge}>
                      <Check size={12} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );
      case 1:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Votre enfant</Text>
            <Text style={styles.stepSubtitle}>
              Créons le profil de votre premier enfant.
            </Text>

            <View style={styles.formCard}>
              <Input
                label="Prénom de l'enfant"
                placeholder="Ex: Adam, Sofia..."
                value={childName}
                onChangeText={setChildName}
                icon={<Baby size={20} color={COLORS.neutral[400]} />}
                style={{ marginBottom: 24 }}
              />

              <Text style={styles.sectionLabel}>Niveau scolaire</Text>
              <Text style={styles.sectionHint}>
                Sélectionnez le niveau actuel de votre enfant
              </Text>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.gradesContainer}
              >
                {GRADES.map((g, index) => (
                  <Animated.View
                    key={g.id}
                    entering={FadeInRight.delay(index * 50).duration(400)}
                  >
                    <TouchableOpacity
                      style={[
                        styles.gradePill,
                        childGrade === g.id && styles.selectedPill,
                      ]}
                      onPress={() => setChildGrade(g.id)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.gradeText,
                          childGrade === g.id && styles.selectedGradeText,
                        ]}
                      >
                        {g.short}
                      </Text>
                      {childGrade === g.id && (
                        <Animated.View
                          entering={FadeInRight.duration(300)}
                          style={styles.selectedCheck}
                        >
                          <Check size={14} color="white" />
                        </Animated.View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </ScrollView>
              
              {childGrade && (
                <Animated.View
                  entering={FadeInRight.duration(400)}
                  style={styles.selectedGradeCard}
                >
                  <Text style={styles.selectedGradeLabel}>Sélectionné:</Text>
                  <Text style={styles.selectedGradeValue}>
                    {GRADES.find((g) => g.id === childGrade)?.label}
                  </Text>
                </Animated.View>
              )}

              {!childGrade && (
                <View style={styles.emptyGradeState}>
                  <BookOpen size={48} color={COLORS.secondary[400]} />
                  <Text style={styles.emptyGradeText}>
                    Choisissez un niveau ci-dessus
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Votre objectif</Text>
            <Text style={styles.stepSubtitle}>
              Comment Oumi&apos;School peut vous aider ?
            </Text>

            <View style={styles.listContainer}>
              {GOALS.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  style={[
                    styles.goalCard,
                    goal === g.id && styles.selectedCard,
                  ]}
                  onPress={() => setGoal(g.id)}
                >
                  <View style={styles.goalInfo}>
                    <Text
                      style={[
                        styles.goalLabel,
                        goal === g.id && styles.selectedText,
                      ]}
                    >
                      {g.label}
                    </Text>
                    <Text style={styles.goalDesc}>{g.desc}</Text>
                  </View>
                  {goal === g.id && (
                    <View style={styles.radioSelected}>
                      <View style={styles.radioInner} />
                    </View>
                  )}
                  {goal !== g.id && <View style={styles.radioUnselected} />}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.navButton} onPress={handleBack}>
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${((step + 1) / 3) * 100}%` },
                ]}
              />
            </View>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {renderStepContent()}
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <Button
              title={step === 2 ? "Commencer" : "Continuer"}
              onPress={handleNext}
              disabled={!isStepValid()}
              fullWidth
              style={{ height: 56 }}
              textStyle={{ fontSize: 18 }}
              icon={
                step !== 2 ? (
                  <ChevronRight size={20} color="white" />
                ) : (
                  <Check size={20} color="white" />
                )
              }
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  headerBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    zIndex: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  navButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    marginHorizontal: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 3,
  },
  scrollContent: {
    padding: 24,
  },
  stepContainer: {
    width: "100%",
  },
  stepTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: COLORS.neutral.white, // On green bg
    marginBottom: 8,
    textAlign: "center",
  },
  stepSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.neutral[100],
    marginBottom: 32,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  // Role Cards
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    marginTop: 20,
  },
  roleCard: {
    width: (width - 64) / 2,
    height: 140,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary[50],
  },
  cardLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary[700],
  },
  selectedText: {
    color: COLORS.primary[700],
    fontWeight: "700",
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },

  // Grade Pills
  sectionLabel: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 6,
  },
  sectionHint: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
    marginBottom: 16,
  },
  gradesContainer: {
    gap: 10,
    paddingBottom: 4,
    marginBottom: 16,
  },
  gradePill: {
    minWidth: 70,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  selectedPill: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary.DEFAULT,
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradeText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary[700],
  },
  selectedGradeText: {
    color: COLORS.neutral.white,
  },
  selectedCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary[700],
    justifyContent: "center",
    alignItems: "center",
  },
  selectedGradeCard: {
    backgroundColor: COLORS.primary[50],
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary.DEFAULT,
    padding: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  selectedGradeLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[600],
    marginBottom: 4,
    fontWeight: "600",
  },
  selectedGradeValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.primary[700],
    fontWeight: "700",
  },
  emptyGradeState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyGradeText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[400],
  },

  // Goal Cards
  listContainer: {
    gap: 16,
    marginTop: 20,
  },
  goalCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  goalInfo: {
    flex: 1,
  },
  goalLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary[800],
    marginBottom: 4,
  },
  goalDesc: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
  },
  radioUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.neutral[300],
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary.DEFAULT,
  },

  footer: {
    padding: 24,
    backgroundColor: COLORS.neutral[50],
  },
});
