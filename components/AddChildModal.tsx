import React, { useState, useRef } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated";
import {
  X,
  User,
  Cake,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Palette,
  Crown,
  AlertCircle,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";

import { FONTS } from "@/config/fonts";
import { THEME } from "@/config/theme";

interface AddChildModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (child: {
    name: string;
    dateOfBirth: string;
    grade: string;
    color: string;
  }) => Promise<void> | void;
}

const AVATAR_COLORS = [
  { value: "#3B82F6", label: "Bleu" },
  { value: "#EC4899", label: "Rose" },
  { value: "#10B981", label: "Vert" },
  { value: "#F59E0B", label: "Ambre" },
  { value: "#8B5CF6", label: "Violet" },
  { value: "#EF4444", label: "Rouge" },
  { value: "#14B8A6", label: "Turquoise" },
  { value: "#F97316", label: "Orange" },
];

const GRADES = [
  { value: "Maternelle", emoji: "🌱" },
  { value: "CP", emoji: "📖" },
  { value: "CE1", emoji: "✏️" },
  { value: "CE2", emoji: "📝" },
  { value: "CM1", emoji: "📐" },
  { value: "CM2", emoji: "📏" },
  { value: "6ème", emoji: "🎒" },
  { value: "5ème", emoji: "🔬" },
  { value: "4ème", emoji: "⚗️" },
  { value: "3ème", emoji: "🎓" },
];

const STEPS = [
  { id: 0, label: "Prénom" },
  { id: 1, label: "Naissance" },
  { id: 2, label: "Niveau" },
  { id: 3, label: "Couleur" },
];

const calculateAge = (dob: string): number => {
  if (!dob) return 0;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function StepIndicator({
  currentStep,
  accentColor,
}: {
  currentStep: number;
  accentColor: string;
}) {
  return (
    <View style={stepStyles.container}>
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        return (
          <React.Fragment key={step.id}>
            <View style={stepStyles.stepWrapper}>
              <View
                style={[
                  stepStyles.dot,
                  isActive && {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                  },
                  isCompleted && {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                  },
                  !isActive && !isCompleted && stepStyles.dotInactive,
                ]}
              >
                {isCompleted ? (
                  <Check size={10} color="white" strokeWidth={3} />
                ) : (
                  <Text
                    style={[
                      stepStyles.dotText,
                      (isActive || isCompleted) && { color: "white" },
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  stepStyles.label,
                  isActive && { color: accentColor, fontWeight: "700" },
                  isCompleted && { color: accentColor },
                ]}
              >
                {step.label}
              </Text>
            </View>
            {index < STEPS.length - 1 && (
              <View
                style={[
                  stepStyles.connector,
                  isCompleted && { backgroundColor: accentColor },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  stepWrapper: {
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  dotInactive: {
    backgroundColor: THEME.colors.secondaryLight,
    borderColor: THEME.colors.border,
  },
  dotText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.colors.subtext,
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: THEME.colors.border,
    marginBottom: 20,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 10,
    color: THEME.colors.subtext,
    fontWeight: "500",
  },
});

function isMaxChildrenError(message: string): boolean {
  return (
    message.toLowerCase().includes("maximum") &&
    message.toLowerCase().includes("plan")
  );
}

export default function AddChildModal({
  visible,
  onClose,
  onAdd,
}: AddChildModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0].value);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ field?: string }>({});

  const nameInputRef = useRef<TextInput>(null);

  const age = calculateAge(dateOfBirth);

  const handleReset = () => {
    setStep(0);
    setName("");
    setDateOfBirth("");
    setSelectedGrade("");
    setSelectedColor(AVATAR_COLORS[0].value);
    setShowDatePicker(false);
    setIsSubmitting(false);
    setSubmitError(null);
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const validateCurrentStep = (): boolean => {
    if (step === 0) {
      if (!name.trim()) {
        setErrors({ field: "Le prénom est requis" });
        return false;
      }
      if (name.trim().length < 2) {
        setErrors({ field: "Le prénom doit contenir au moins 2 caractères" });
        return false;
      }
    }
    if (step === 1) {
      if (!dateOfBirth) {
        setErrors({ field: "La date de naissance est requise" });
        return false;
      }
      const calcAge = calculateAge(dateOfBirth);
      if (calcAge < 3 || calcAge > 18) {
        setErrors({ field: "L'âge doit être entre 3 et 18 ans" });
        return false;
      }
    }
    if (step === 2) {
      if (!selectedGrade) {
        setErrors({ field: "Le niveau scolaire est requis" });
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onAdd({
        name: name.trim(),
        dateOfBirth,
        grade: selectedGrade,
        color: selectedColor,
      });
      handleClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Impossible d'ajouter l'enfant pour le moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDefaultDate = (): Date => {
    if (dateOfBirth) return new Date(dateOfBirth);
    const d = new Date();
    d.setFullYear(d.getFullYear() - 8);
    return d;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate.toISOString());
      setErrors({});
    }
  };

  const isNextEnabled = () => {
    if (step === 0) return name.trim().length >= 2;
    if (step === 1) return !!dateOfBirth;
    if (step === 2) return !!selectedGrade;
    return true;
  };

  const nextLabel =
    step === STEPS.length - 1
      ? isSubmitting
        ? "Ajout..."
        : "Créer le profil"
      : "Continuer";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

          <Animated.View
            entering={SlideInUp.duration(250)}
            style={styles.sheet}
          >
            {/* Handle bar */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Nouveau profil</Text>
                <Text style={styles.headerSub}>
                  Étape {step + 1} sur {STEPS.length}
                </Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <X size={18} color={THEME.colors.subtext} />
              </TouchableOpacity>
            </View>

            {/* Step indicator */}
            <StepIndicator currentStep={step} accentColor={selectedColor} />

            {/* Preview pill — always visible once name is set */}
            {name.trim().length >= 2 && (
              <Animated.View
                entering={FadeIn.duration(200)}
                style={[
                  styles.previewPill,
                  {
                    borderColor: selectedColor + "40",
                    backgroundColor: selectedColor + "0D",
                  },
                ]}
              >
                <View
                  style={[
                    styles.previewAvatar,
                    { backgroundColor: selectedColor },
                  ]}
                >
                  <Text style={styles.previewAvatarText}>
                    {name.trim().charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.previewName, { color: selectedColor }]}>
                  {name.trim()}
                </Text>
                {age > 0 && <Text style={styles.previewMeta}>{age} ans</Text>}
                {selectedGrade && (
                  <>
                    <View style={styles.previewDot} />
                    <Text style={styles.previewMeta}>{selectedGrade}</Text>
                  </>
                )}
                <Sparkles
                  size={13}
                  color={selectedColor}
                  style={{ marginLeft: "auto" }}
                />
              </Animated.View>
            )}

            {/* Step content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* STEP 0 — Nom */}
              {step === 0 && (
                <Animated.View entering={FadeIn.duration(200)}>
                  <View style={styles.stepBlock}>
                    <View
                      style={[
                        styles.stepIconWrap,
                        { backgroundColor: selectedColor + "15" },
                      ]}
                    >
                      <User size={22} color={selectedColor} />
                    </View>
                    <Text style={styles.stepQuestion}>
                      Comment s&apos;appelle votre enfant ?
                    </Text>
                    <Text style={styles.stepHint}>
                      Entrez le prénom tel qu&apos;il apparaîtra sur le profil
                    </Text>
                    <TextInput
                      ref={nameInputRef}
                      style={[
                        styles.bigInput,
                        errors.field
                          ? styles.inputErr
                          : {
                              borderColor: name.trim()
                                ? selectedColor + "60"
                                : THEME.colors.border,
                            },
                      ]}
                      placeholder="Prénom de l'enfant"
                      placeholderTextColor={THEME.colors.subtext}
                      value={name}
                      onChangeText={(t) => {
                        setName(t);
                        setErrors({});
                      }}
                      autoCapitalize="words"
                      autoFocus
                      returnKeyType="next"
                      onSubmitEditing={handleNext}
                    />
                    {errors.field && (
                      <Animated.Text entering={FadeIn} style={styles.errorText}>
                        {errors.field}
                      </Animated.Text>
                    )}
                  </View>
                </Animated.View>
              )}

              {/* STEP 1 — Date de naissance */}
              {step === 1 && (
                <Animated.View entering={FadeIn.duration(200)}>
                  <View style={styles.stepBlock}>
                    <View
                      style={[
                        styles.stepIconWrap,
                        { backgroundColor: selectedColor + "15" },
                      ]}
                    >
                      <Cake size={22} color={selectedColor} />
                    </View>
                    <Text style={styles.stepQuestion}>
                      Quelle est sa date de naissance ?
                    </Text>
                    <Text style={styles.stepHint}>
                      L&apos;âge nous aide à personnaliser son expérience
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.dateTrigger,
                        errors.field
                          ? styles.inputErr
                          : {
                              borderColor: dateOfBirth
                                ? selectedColor + "60"
                                : THEME.colors.border,
                            },
                      ]}
                      onPress={() => setShowDatePicker(true)}
                      activeOpacity={0.7}
                    >
                      <Cake
                        size={18}
                        color={
                          dateOfBirth ? selectedColor : THEME.colors.subtext
                        }
                      />
                      <Text
                        style={[
                          styles.dateTriggerText,
                          !dateOfBirth && { color: THEME.colors.subtext },
                        ]}
                      >
                        {dateOfBirth
                          ? formatDateForDisplay(dateOfBirth)
                          : "Sélectionner une date"}
                      </Text>
                      {dateOfBirth && (
                        <View
                          style={[
                            styles.ageBadge,
                            { backgroundColor: selectedColor + "15" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.ageBadgeText,
                              { color: selectedColor },
                            ]}
                          >
                            {age} ans
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    {errors.field && (
                      <Animated.Text entering={FadeIn} style={styles.errorText}>
                        {errors.field}
                      </Animated.Text>
                    )}

                    {showDatePicker && (
                      <DateTimePicker
                        value={getDefaultDate()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={handleDateChange}
                        maximumDate={(() => {
                          const d = new Date();
                          d.setFullYear(d.getFullYear() - 3);
                          return d;
                        })()}
                        minimumDate={(() => {
                          const d = new Date();
                          d.setFullYear(d.getFullYear() - 18);
                          return d;
                        })()}
                        locale="fr-FR"
                      />
                    )}
                  </View>
                </Animated.View>
              )}

              {/* STEP 2 — Niveau scolaire */}
              {step === 2 && (
                <Animated.View entering={FadeIn.duration(200)}>
                  <View style={styles.stepBlock}>
                    <View
                      style={[
                        styles.stepIconWrap,
                        { backgroundColor: selectedColor + "15" },
                      ]}
                    >
                      <GraduationCap size={22} color={selectedColor} />
                    </View>
                    <Text style={styles.stepQuestion}>
                      Quel est son niveau scolaire ?
                    </Text>
                    <Text style={styles.stepHint}>
                      Cela nous aide à proposer du contenu adapté
                    </Text>

                    <View style={styles.gradeGrid}>
                      {GRADES.map((grade) => {
                        const isSelected = selectedGrade === grade.value;
                        return (
                          <TouchableOpacity
                            key={grade.value}
                            style={[
                              styles.gradeChip,
                              isSelected && {
                                backgroundColor: selectedColor,
                                borderColor: selectedColor,
                              },
                              !isSelected && {
                                borderColor: THEME.colors.border,
                                backgroundColor: THEME.colors.secondaryLight,
                              },
                            ]}
                            onPress={() => {
                              Haptics.selectionAsync();
                              setSelectedGrade(grade.value);
                              setErrors({});
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.gradeEmoji}>{grade.emoji}</Text>
                            <Text
                              style={[
                                styles.gradeLabel,
                                isSelected && {
                                  color: "white",
                                  fontWeight: "700",
                                },
                              ]}
                            >
                              {grade.value}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {errors.field && (
                      <Animated.Text entering={FadeIn} style={styles.errorText}>
                        {errors.field}
                      </Animated.Text>
                    )}
                  </View>
                </Animated.View>
              )}

              {/* STEP 3 — Couleur */}
              {step === 3 && (
                <Animated.View entering={FadeIn.duration(200)}>
                  <View style={styles.stepBlock}>
                    <View
                      style={[
                        styles.stepIconWrap,
                        { backgroundColor: selectedColor + "15" },
                      ]}
                    >
                      <Palette size={22} color={selectedColor} />
                    </View>
                    <Text style={styles.stepQuestion}>
                      Choisissez une couleur de profil
                    </Text>
                    <Text style={styles.stepHint}>
                      Personnalisez le profil de {name.trim()}
                    </Text>

                    <View style={styles.colorGrid}>
                      {AVATAR_COLORS.map((c) => {
                        const isSelected = selectedColor === c.value;
                        return (
                          <TouchableOpacity
                            key={c.value}
                            style={styles.colorItem}
                            onPress={() => {
                              Haptics.selectionAsync();
                              setSelectedColor(c.value);
                            }}
                            activeOpacity={0.8}
                          >
                            <View
                              style={[
                                styles.colorSwatch,
                                { backgroundColor: c.value },
                                isSelected && styles.colorSwatchSelected,
                              ]}
                            >
                              {isSelected && (
                                <Animated.View entering={FadeIn.duration(100)}>
                                  <Check
                                    size={16}
                                    color="white"
                                    strokeWidth={3}
                                  />
                                </Animated.View>
                              )}
                            </View>
                            <Text
                              style={[
                                styles.colorLabel,
                                isSelected && {
                                  color: c.value,
                                  fontWeight: "700",
                                },
                              ]}
                            >
                              {c.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </Animated.View>
              )}

              {submitError && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  style={[
                    styles.submitErrorBox,
                    isMaxChildrenError(submitError) &&
                      styles.submitErrorBoxUpgrade,
                  ]}
                >
                  <View style={styles.submitErrorRow}>
                    {isMaxChildrenError(submitError) ? (
                      <Crown size={16} color="#92400E" />
                    ) : (
                      <AlertCircle size={16} color={THEME.colors.error} />
                    )}
                    <Text
                      style={[
                        styles.submitErrorText,
                        isMaxChildrenError(submitError) &&
                          styles.submitErrorTextUpgrade,
                      ]}
                    >
                      {submitError}
                    </Text>
                  </View>
                  {isMaxChildrenError(submitError) && (
                    <TouchableOpacity
                      style={styles.upgradeButton}
                      onPress={() => {
                        handleClose();
                        router.push("/pricing");
                      }}
                      activeOpacity={0.8}
                    >
                      <Crown size={14} color="white" />
                      <Text style={styles.upgradeButtonText}>
                        Mettre à jour mon abonnement
                      </Text>
                    </TouchableOpacity>
                  )}
                </Animated.View>
              )}
            </ScrollView>

            {/* Footer nav */}
            <View style={styles.footer}>
              {step > 0 ? (
                <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                  <ChevronLeft size={18} color={THEME.colors.subtext} />
                  <Text style={styles.backBtnText}>Retour</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelBtnText}>Annuler</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.nextBtn,
                  { backgroundColor: selectedColor },
                  (!isNextEnabled() || isSubmitting) && styles.nextBtnDisabled,
                ]}
                onPress={handleNext}
                disabled={!isNextEnabled() || isSubmitting}
                activeOpacity={0.85}
              >
                <Text style={styles.nextBtnText}>{nextLabel}</Text>
                {step < STEPS.length - 1 && (
                  <ChevronRight size={18} color="white" />
                )}
                {step === STEPS.length - 1 && !isSubmitting && (
                  <Sparkles size={16} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.55)",
  },
  sheet: {
    backgroundColor: THEME.colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    paddingTop: 12,
    maxHeight: "92%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.border,
    alignSelf: "center",
    marginBottom: 16,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: THEME.colors.text,
  },
  headerSub: {
    fontSize: 12,
    color: THEME.colors.subtext,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.colors.secondaryLight,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  // Preview pill
  previewPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderRadius: THEME.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 20,
  },
  previewAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  previewAvatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: "white",
  },
  previewName: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
  },
  previewMeta: {
    fontSize: 12,
    color: THEME.colors.subtext,
  },
  previewDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: THEME.colors.subtext,
  },

  // Scroll
  scrollContent: {
    paddingBottom: 8,
  },

  // Step block
  stepBlock: {
    paddingTop: 4,
  },
  stepIconWrap: {
    width: 52,
    height: 52,
    borderRadius: THEME.radius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  stepQuestion: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: THEME.colors.text,
    marginBottom: 6,
  },
  stepHint: {
    fontSize: 13,
    color: THEME.colors.subtext,
    marginBottom: 20,
    lineHeight: 18,
  },

  // Big input (step 0)
  bigInput: {
    fontSize: 18,
    fontFamily: FONTS.fredoka,
    color: THEME.colors.text,
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: THEME.radius.lg,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 2,
  },
  inputErr: {
    borderColor: THEME.colors.error,
  },
  errorText: {
    fontSize: 12,
    color: THEME.colors.error,
    marginTop: 8,
  },

  // Date trigger
  dateTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: THEME.radius.lg,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 2,
  },
  dateTriggerText: {
    flex: 1,
    fontSize: 16,
    color: THEME.colors.text,
  },
  ageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
  },
  ageBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Grade grid
  gradeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gradeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: THEME.radius.full,
    borderWidth: 1.5,
  },
  gradeEmoji: {
    fontSize: 16,
  },
  gradeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.text,
  },

  // Color grid
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorItem: {
    alignItems: "center",
    gap: 6,
    width: "22%",
  },
  colorSwatch: {
    width: 52,
    height: 52,
    borderRadius: THEME.radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSwatchSelected: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  colorLabel: {
    fontSize: 11,
    color: THEME.colors.subtext,
    fontWeight: "500",
  },

  // Error box
  submitErrorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: THEME.radius.md,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    gap: 12,
  },
  submitErrorBoxUpgrade: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FCD34D",
  },
  submitErrorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  submitErrorText: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.error,
    lineHeight: 18,
  },
  submitErrorTextUpgrade: {
    color: "#92400E",
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F59E0B",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.full,
  },
  upgradeButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "white",
  },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    marginTop: 8,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.secondaryLight,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.subtext,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.secondaryLight,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.subtext,
  },
  nextBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: THEME.radius.full,
  },
  nextBtnDisabled: {
    opacity: 0.45,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
  },
});
