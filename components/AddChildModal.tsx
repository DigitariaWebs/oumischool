import React, { useState, useMemo } from "react";
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
} from "react-native";
import Animated, { FadeInDown, SlideInUp } from "react-native-reanimated";
import { X } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";

interface AddChildModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (child: {
    name: string;
    dateOfBirth: string;
    grade: string;
    color: string;
  }) => void;
}

const AVATAR_COLORS = [
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#10B981", // Green
  "#F59E0B", // Orange
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#14B8A6", // Teal
  "#F97316", // Orange
];

const GRADES = [
  "Maternelle",
  "CP",
  "CE1",
  "CE2",
  "CM1",
  "CM2",
  "6ème",
  "5ème",
  "4ème",
  "3ème",
];

export default function AddChildModal({
  visible,
  onClose,
  onAdd,
}: AddChildModalProps) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    dateOfBirth?: string;
    grade?: string;
  }>({});

  const styles = useMemo(() => createStyles(colors), [colors]);

  // Calculate age from date of birth
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

  const age = calculateAge(dateOfBirth);

  // Format date for display
  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleReset = () => {
    setName("");
    setDateOfBirth("");
    setSelectedGrade("");
    setSelectedColor(AVATAR_COLORS[0]);
    setShowDatePicker(false);
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const validate = () => {
    const newErrors: { name?: string; dateOfBirth?: string; grade?: string } =
      {};

    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "La date de naissance est requise";
    } else {
      const age = calculateAge(dateOfBirth);
      if (age < 3 || age > 18) {
        newErrors.dateOfBirth = "L'âge doit être entre 3 et 18 ans";
      }
    }

    if (!selectedGrade) {
      newErrors.grade = "Le niveau est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onAdd({
        name: name.trim(),
        dateOfBirth: dateOfBirth,
        grade: selectedGrade,
        color: selectedColor,
      });
      handleClose();
    }
  };

  // Calculate default date for picker (10 years ago)
  const getDefaultDate = (): Date => {
    if (dateOfBirth) {
      return new Date(dateOfBirth);
    }
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 10);
    return defaultDate;
  };

  // Calculate min/max dates for age 3-18
  const getMaxDate = (): Date => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 3);
    return maxDate;
  };

  const getMinDate = (): Date => {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);
    return minDate;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      setDateOfBirth(dateStr);
      if (errors.dateOfBirth) setErrors({ ...errors, dateOfBirth: undefined });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <Animated.View
          entering={SlideInUp.duration(300)}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ajouter un enfant</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.icon} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Entrez le prénom"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholderTextColor={colors.inputPlaceholder}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Date of Birth Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date de naissance</Text>
              <TouchableOpacity
                style={[
                  styles.dateInput,
                  errors.dateOfBirth && styles.inputError,
                ]}
                onPress={() => setShowDatePicker(!showDatePicker)}
              >
                <Text
                  style={[
                    styles.dateInputText,
                    !dateOfBirth && styles.dateInputPlaceholder,
                  ]}
                >
                  {dateOfBirth
                    ? formatDateForDisplay(dateOfBirth)
                    : "Sélectionner la date de naissance"}
                </Text>
              </TouchableOpacity>
              {errors.dateOfBirth && (
                <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
              )}

              {/* Native Date Picker */}
              {showDatePicker && (
                <DateTimePicker
                  value={getDefaultDate()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={getMaxDate()}
                  minimumDate={getMinDate()}
                  locale="fr-FR"
                />
              )}
            </View>

            {/* Grade Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Niveau scolaire</Text>
              <View style={styles.gradeGrid}>
                {GRADES.map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    style={[
                      styles.gradeButton,
                      selectedGrade === grade && styles.gradeButtonSelected,
                    ]}
                    onPress={() => {
                      setSelectedGrade(grade);
                      if (errors.grade)
                        setErrors({ ...errors, grade: undefined });
                    }}
                  >
                    <Text
                      style={[
                        styles.gradeButtonText,
                        selectedGrade === grade &&
                          styles.gradeButtonTextSelected,
                      ]}
                    >
                      {grade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.grade && (
                <Text style={styles.errorText}>{errors.grade}</Text>
              )}
            </View>

            {/* Color Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Couleur du profil</Text>
              <View style={styles.colorGrid}>
                {AVATAR_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color + "30" },
                      selectedColor === color && styles.colorButtonSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <View
                      style={[styles.colorCircle, { backgroundColor: color }]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            {name && (
              <Animated.View
                entering={FadeInDown.duration(400)}
                style={styles.previewCard}
              >
                <View
                  style={[
                    styles.previewAvatar,
                    { backgroundColor: selectedColor + "40" },
                  ]}
                >
                  <Text
                    style={[styles.previewAvatarText, { color: selectedColor }]}
                  >
                    {name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewName}>{name}</Text>
                  <Text style={styles.previewDetails}>
                    {age > 0 && `${age} ans`}
                    {age > 0 && selectedGrade && " • "}
                    {selectedGrade}
                  </Text>
                </View>
              </Animated.View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!name || !dateOfBirth || !selectedGrade) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!name || !dateOfBirth || !selectedGrade}
            >
              <Text style={styles.submitButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: import("@/constants/theme").ThemeColors) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 24,
      paddingHorizontal: 24,
      paddingBottom: 40,
      maxHeight: "90%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    modalTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.buttonSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollView: {
      maxHeight: "70%",
    },
    inputGroup: {
      marginBottom: 24,
    },
    label: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    input: {
      fontFamily: FONTS.primary,
      fontSize: 16,
      color: colors.textPrimary,
      backgroundColor: colors.input,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.inputBorder,
    },
    dateInput: {
      fontFamily: FONTS.primary,
      fontSize: 16,
      backgroundColor: colors.input,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.inputBorder,
      justifyContent: "center",
    },
    dateInputText: {
      fontFamily: FONTS.primary,
      fontSize: 16,
      color: colors.textPrimary,
    },
    dateInputPlaceholder: {
      color: colors.inputPlaceholder,
    },

    inputError: {
      borderColor: COLORS.error,
    },
    errorText: {
      fontFamily: FONTS.primary,
      fontSize: 12,
      color: COLORS.error,
      marginTop: 4,
    },
    gradeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    gradeButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.buttonSecondary,
      borderWidth: 2,
      borderColor: colors.inputBorder,
    },
    gradeButtonSelected: {
      backgroundColor: COLORS.primary[50],
      borderColor: COLORS.primary.DEFAULT,
    },
    gradeButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    gradeButtonTextSelected: {
      color: COLORS.primary.DEFAULT,
    },
    colorGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    colorButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "transparent",
    },
    colorButtonSelected: {
      borderColor: colors.border,
    },
    colorCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    previewCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 16,
      padding: 16,
      marginBottom: 8,
    },
    previewAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    previewAvatarText: {
      fontSize: 28,
      fontFamily: FONTS.fredoka,
      fontWeight: "700",
    },
    previewInfo: {
      flex: 1,
    },
    previewName: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    previewDetails: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 12,
      marginTop: 24,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      backgroundColor: colors.buttonSecondary,
      alignItems: "center",
    },
    cancelButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.buttonSecondaryText,
    },
    submitButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      backgroundColor: COLORS.primary.DEFAULT,
      alignItems: "center",
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "700",
      color: COLORS.neutral.white,
    },
  });
