import React, { useState } from "react";
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
import { X, User, Cake, GraduationCap, Sparkles } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

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

  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(dateOfBirth);

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
    const newErrors: { name?: string; dateOfBirth?: string; grade?: string } = {};

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

  const getDefaultDate = (): Date => {
    if (dateOfBirth) {
      return new Date(dateOfBirth);
    }
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 10);
    return defaultDate;
  };

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
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Nom */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <User size={14} color="#64748B" />
                <Text style={styles.label}>Prénom</Text>
              </View>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Entrez le prénom"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholderTextColor="#94A3B8"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Date de naissance */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Cake size={14} color="#64748B" />
                <Text style={styles.label}>Date de naissance</Text>
              </View>
              <TouchableOpacity
                style={[styles.dateInput, errors.dateOfBirth && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={[
                    styles.dateInputText,
                    !dateOfBirth && styles.dateInputPlaceholder,
                  ]}
                >
                  {dateOfBirth
                    ? formatDateForDisplay(dateOfBirth)
                    : "Sélectionner la date"}
                </Text>
              </TouchableOpacity>
              {errors.dateOfBirth && (
                <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
              )}

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

            {/* Niveau scolaire */}
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <GraduationCap size={14} color="#64748B" />
                <Text style={styles.label}>Niveau scolaire</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gradeScroll}>
                <View style={styles.gradeContainer}>
                  {GRADES.map((grade) => (
                    <TouchableOpacity
                      key={grade}
                      style={[
                        styles.gradeChip,
                        selectedGrade === grade && {
                          backgroundColor: selectedColor + "15",
                          borderColor: selectedColor,
                        },
                      ]}
                      onPress={() => {
                        setSelectedGrade(grade);
                        if (errors.grade) setErrors({ ...errors, grade: undefined });
                      }}
                    >
                      <Text
                        style={[
                          styles.gradeChipText,
                          selectedGrade === grade && { color: selectedColor },
                        ]}
                      >
                        {grade}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              {errors.grade && <Text style={styles.errorText}>{errors.grade}</Text>}
            </View>

            {/* Couleur */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Couleur du profil</Text>
              <View style={styles.colorGrid}>
                {AVATAR_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      selectedColor === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <View style={[styles.colorCircle, { backgroundColor: color }]} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Aperçu */}
            {name && (
              <Animated.View
                entering={FadeInDown.duration(400)}
                style={[styles.previewCard, { borderLeftColor: selectedColor }]}
              >
                <View style={[styles.previewAvatar, { backgroundColor: selectedColor + "15" }]}>
                  <Text style={[styles.previewAvatarText, { color: selectedColor }]}>
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
                <Sparkles size={16} color={selectedColor} />
              </Animated.View>
            )}
          </ScrollView>

          {/* Boutons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: selectedColor },
                (!name || !dateOfBirth || !selectedGrade) && styles.submitButtonDisabled,
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: "#1E293B",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  scrollView: {
    maxHeight: "70%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  input: {
    fontSize: 15,
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 11,
    color: "#EF4444",
    marginTop: 4,
  },
  dateInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dateInputText: {
    fontSize: 15,
    color: "#1E293B",
  },
  dateInputPlaceholder: {
    color: "#94A3B8",
  },
  gradeScroll: {
    flexGrow: 0,
  },
  gradeContainer: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  gradeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  gradeChipText: {
    fontSize: 13,
    color: "#64748B",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorOptionSelected: {
    borderColor: "#6366F1",
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  previewAvatarText: {
    fontSize: 22,
    fontFamily: FONTS.fredoka,
    fontWeight: "600",
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 2,
  },
  previewDetails: {
    fontSize: 13,
    color: "#64748B",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cancelButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
    backgroundColor: "#CBD5E1",
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
});