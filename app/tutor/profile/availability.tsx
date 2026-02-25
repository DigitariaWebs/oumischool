import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Pencil,
  Clock,
  Calendar,
  Eye,
  EyeOff,
  Copy,
  CheckSquare,
  X,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import {
  useMyAvailability,
  useAddAvailability,
  useUpdateAvailability,
  useDeleteAvailability,
  useToggleAvailability,
} from "@/hooks/api/tutors";
import type { AvailabilitySlot } from "@/hooks/api/tutors";

const DAYS = [
  { key: 1, label: "Lundi", short: "Lun" },
  { key: 2, label: "Mardi", short: "Mar" },
  { key: 3, label: "Mercredi", short: "Mer" },
  { key: 4, label: "Jeudi", short: "Jeu" },
  { key: 5, label: "Vendredi", short: "Ven" },
  { key: 6, label: "Samedi", short: "Sam" },
  { key: 0, label: "Dimanche", short: "Dim" },
] as const;

const DURATION_PRESETS = [
  { label: "30min", minutes: 30 },
  { label: "1h", minutes: 60 },
  { label: "1h30", minutes: 90 },
  { label: "2h", minutes: 120 },
] as const;

function timeToDate(time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function dateToTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function addMinutesToTime(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  if (nh >= 24) return "23:59";
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

function getDurationLabel(start: string, end: string): string {
  const totalMinutes = minutesBetween(start, end);
  if (totalMinutes <= 0) return "";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h${String(minutes).padStart(2, "0")}`;
}

interface SlotFormState {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

type DurationMode = "preset" | "custom";

export default function AvailabilityScreen() {
  const router = useRouter();
  const { data: slots = [], isLoading } = useMyAvailability();
  const addMutation = useAddAvailability();
  const updateMutation = useUpdateAvailability();
  const deleteMutation = useDeleteAvailability();
  const toggleMutation = useToggleAvailability();

  const [selectedDay, setSelectedDay] = useState<number>(DAYS[0].key);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [form, setForm] = useState<SlotFormState>({
    dayOfWeek: DAYS[0].key,
    startTime: "09:00",
    endTime: "10:00",
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [durationMode, setDurationMode] = useState<DurationMode>("preset");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(60);

  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [duplicateSlot, setDuplicateSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [duplicateDays, setDuplicateDays] = useState<Set<number>>(new Set());
  const [isDuplicating, setIsDuplicating] = useState(false);

  const slotsByDay = useMemo(() => {
    const grouped: Record<number, AvailabilitySlot[]> = {};
    DAYS.forEach((d) => (grouped[d.key] = []));
    slots.forEach((slot) => {
      if (grouped[slot.dayOfWeek]) {
        grouped[slot.dayOfWeek].push(slot);
      }
    });
    Object.values(grouped).forEach((arr) =>
      arr.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    );
    return grouped;
  }, [slots]);

  const activeSlots = slots.filter((s) => s.isActive);
  const totalSlots = activeSlots.length;
  const daysWithSlots = DAYS.filter(
    (d) => slotsByDay[d.key]?.some((s) => s.isActive),
  ).length;

  const openAddModal = () => {
    setEditingSlot(null);
    setForm({
      dayOfWeek: selectedDay,
      startTime: "09:00",
      endTime: "10:00",
    });
    setDurationMode("preset");
    setSelectedPreset(60);
    setShowStartPicker(Platform.OS === "ios");
    setShowEndPicker(false);
    setModalVisible(true);
  };

  const openEditModal = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    setForm({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });
    const mins = minutesBetween(slot.startTime, slot.endTime);
    const matchingPreset = DURATION_PRESETS.find((p) => p.minutes === mins);
    if (matchingPreset) {
      setDurationMode("preset");
      setSelectedPreset(matchingPreset.minutes);
    } else {
      setDurationMode("custom");
      setSelectedPreset(null);
    }
    setShowStartPicker(Platform.OS === "ios");
    setShowEndPicker(Platform.OS === "ios" && !matchingPreset);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingSlot(null);
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const handlePresetSelect = (mins: number) => {
    setSelectedPreset(mins);
    setDurationMode("preset");
    setShowEndPicker(false);
    setForm((prev) => ({
      ...prev,
      endTime: addMinutesToTime(prev.startTime, mins),
    }));
  };

  const handleCustomDuration = () => {
    setDurationMode("custom");
    setSelectedPreset(null);
    setShowEndPicker(Platform.OS === "ios");
  };

  const handleSave = async () => {
    if (form.startTime >= form.endTime) {
      Alert.alert(
        "Horaire invalide",
        "L'heure de fin doit être après l'heure de début.",
      );
      return;
    }

    try {
      if (editingSlot) {
        await updateMutation.mutateAsync({
          id: editingSlot.id,
          body: form,
        });
      } else {
        await addMutation.mutateAsync(form);
      }
      closeModal();
    } catch {
      Alert.alert(
        "Erreur",
        "Impossible de sauvegarder le créneau. Vérifiez qu'il ne chevauche pas un créneau existant.",
      );
    }
  };

  const handleDelete = (slot: AvailabilitySlot) => {
    Alert.alert(
      "Supprimer le créneau",
      `Supprimer ${slot.startTime} - ${slot.endTime} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteMutation.mutate(slot.id),
        },
      ],
    );
  };

  const handleToggle = (slot: AvailabilitySlot) => {
    toggleMutation.mutate(slot.id);
  };

  const openDuplicateModal = (slot: AvailabilitySlot) => {
    setDuplicateSlot(slot);
    setDuplicateDays(new Set());
    setDuplicateModalVisible(true);
  };

  const toggleDuplicateDay = (dayKey: number) => {
    setDuplicateDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayKey)) {
        next.delete(dayKey);
      } else {
        next.add(dayKey);
      }
      return next;
    });
  };

  const handleDuplicate = async () => {
    if (!duplicateSlot || duplicateDays.size === 0) return;
    setIsDuplicating(true);
    try {
      const promises = Array.from(duplicateDays).map((dayOfWeek) =>
        addMutation.mutateAsync({
          dayOfWeek,
          startTime: duplicateSlot.startTime,
          endTime: duplicateSlot.endTime,
        }),
      );
      const results = await Promise.allSettled(promises);
      const failures = results.filter((r) => r.status === "rejected").length;
      setDuplicateModalVisible(false);
      setDuplicateSlot(null);
      if (failures > 0) {
        Alert.alert(
          "Duplication partielle",
          `${duplicateDays.size - failures} créneau(x) dupliqué(s), ${failures} en erreur (chevauchement probable).`,
        );
      }
    } catch {
      Alert.alert("Erreur", "Impossible de dupliquer les créneaux.");
    } finally {
      setIsDuplicating(false);
    }
  };

  const toggleBulkSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const exitBulkMode = () => {
    setBulkMode(false);
    setSelectedIds(new Set());
  };

  const enterBulkMode = () => {
    setBulkMode(true);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    Alert.alert(
      "Supprimer les créneaux",
      `Supprimer ${selectedIds.size} créneau(x) ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const results = await Promise.allSettled(
              Array.from(selectedIds).map((id) =>
                deleteMutation.mutateAsync(id),
              ),
            );
            const failures = results.filter(
              (r) => r.status === "rejected",
            ).length;
            exitBulkMode();
            if (failures > 0) {
              Alert.alert(
                "Suppression partielle",
                `${selectedIds.size - failures} créneau(x) supprimé(s), ${failures} en erreur.`,
              );
            }
          },
        },
      ],
    );
  };

  const handleBulkToggle = async () => {
    if (selectedIds.size === 0) return;
    const selected = slots.filter((s) => selectedIds.has(s.id));
    const allActive = selected.every((s) => s.isActive);
    const label = allActive ? "Désactiver" : "Activer";
    Alert.alert(
      `${label} les créneaux`,
      `${label} ${selectedIds.size} créneau(x) ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: label,
          onPress: async () => {
            const results = await Promise.allSettled(
              selected.map((s) => toggleMutation.mutateAsync(s.id)),
            );
            const failures = results.filter(
              (r) => r.status === "rejected",
            ).length;
            exitBulkMode();
            if (failures > 0) {
              Alert.alert(
                "Opération partielle",
                `${selected.length - failures} créneau(x) modifié(s), ${failures} en erreur (chevauchement probable).`,
              );
            }
          },
        },
      ],
    );
  };

  const onStartTimeChange = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowStartPicker(false);
    if (date) {
      const newStart = dateToTime(date);
      setForm((prev) => {
        const newEnd =
          durationMode === "preset" && selectedPreset
            ? addMinutesToTime(newStart, selectedPreset)
            : prev.endTime;
        return { ...prev, startTime: newStart, endTime: newEnd };
      });
    }
  };

  const onEndTimeChange = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowEndPicker(false);
    if (date) setForm((prev) => ({ ...prev, endTime: dateToTime(date) }));
  };

  const isSaving = addMutation.isPending || updateMutation.isPending;
  const currentDaySlots = slotsByDay[selectedDay] ?? [];
  const selectedDayLabel = DAYS.find((d) => d.key === selectedDay)?.label ?? "";

  const selectedAllActive = useMemo(() => {
    if (selectedIds.size === 0) return true;
    return slots
      .filter((s) => selectedIds.has(s.id))
      .every((s) => s.isActive);
  }, [selectedIds, slots]);

  const bulkToggleLabel = selectedAllActive ? "Désactiver" : "Activer";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (bulkMode ? exitBulkMode() : router.back())}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          {bulkMode ? (
            <X size={24} color={COLORS.secondary[700]} />
          ) : (
            <ChevronLeft size={24} color={COLORS.secondary[700]} />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {bulkMode
            ? `${selectedIds.size} sélectionné(s)`
            : "Mes disponibilités"}
        </Text>
        {bulkMode ? (
          <View style={styles.headerRightPlaceholder} />
        ) : (
          <View style={styles.headerActions}>
            {slots.length > 0 && (
              <TouchableOpacity
                onPress={enterBulkMode}
                style={styles.headerIconButton}
                activeOpacity={0.7}
              >
                <CheckSquare size={20} color={COLORS.secondary[500]} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={openAddModal}
              style={styles.addHeaderButton}
              activeOpacity={0.7}
            >
              <Plus size={20} color={COLORS.neutral.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Calendar size={18} color={COLORS.primary.DEFAULT} />
              <Text style={styles.summaryValue}>{daysWithSlots}/7</Text>
              <Text style={styles.summaryLabel}>jours actifs</Text>
            </View>
            <View style={styles.summaryCard}>
              <Clock size={18} color={COLORS.info} />
              <Text style={styles.summaryValue}>{totalSlots}</Text>
              <Text style={styles.summaryLabel}>créneaux actifs</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayTabsContent}
            style={styles.dayTabs}
          >
            {DAYS.map((day) => {
              const isActive = selectedDay === day.key;
              const hasSlots = (slotsByDay[day.key]?.length ?? 0) > 0;
              return (
                <TouchableOpacity
                  key={day.key}
                  onPress={() => setSelectedDay(day.key)}
                  style={[
                    styles.dayTab,
                    isActive && styles.dayTabActive,
                    !isActive && hasSlots && styles.dayTabHasSlots,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayTabText,
                      isActive && styles.dayTabTextActive,
                    ]}
                  >
                    {day.short}
                  </Text>
                  {hasSlots && (
                    <View
                      style={[styles.dayDot, isActive && styles.dayDotActive]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{selectedDayLabel}</Text>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="small"
                  color={COLORS.primary.DEFAULT}
                />
              </View>
            ) : currentDaySlots.length === 0 ? (
              <View style={styles.emptyCard}>
                <Clock size={32} color={COLORS.neutral[300]} />
                <Text style={styles.emptyTitle}>Aucun créneau</Text>
                <Text style={styles.emptySubtitle}>
                  Ajoutez vos disponibilités pour ce jour
                </Text>
                <TouchableOpacity
                  onPress={openAddModal}
                  style={styles.emptyAddButton}
                  activeOpacity={0.7}
                >
                  <Plus size={16} color={COLORS.primary.DEFAULT} />
                  <Text style={styles.emptyAddText}>Ajouter un créneau</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.slotsContainer}>
                {currentDaySlots.map((slot) => {
                  const isInactive = !slot.isActive;
                  const isSelected = selectedIds.has(slot.id);
                  return (
                    <TouchableOpacity
                      key={slot.id}
                      onPress={
                        bulkMode ? () => toggleBulkSelect(slot.id) : undefined
                      }
                      onLongPress={
                        !bulkMode
                          ? () => {
                              enterBulkMode();
                              toggleBulkSelect(slot.id);
                            }
                          : undefined
                      }
                      activeOpacity={bulkMode ? 0.7 : 1}
                      style={[
                        styles.slotCard,
                        isInactive && styles.slotCardInactive,
                        bulkMode && isSelected && styles.slotCardSelected,
                      ]}
                    >
                      {bulkMode && (
                        <View
                          style={[
                            styles.checkbox,
                            isSelected && styles.checkboxChecked,
                          ]}
                        >
                          {isSelected && (
                            <Text style={styles.checkboxMark}>✓</Text>
                          )}
                        </View>
                      )}
                      <View style={styles.slotTimeContainer}>
                        <View
                          style={[
                            styles.slotTimeDot,
                            isInactive && styles.slotTimeDotInactive,
                          ]}
                        />
                        <View style={styles.slotTimeInfo}>
                          <Text
                            style={[
                              styles.slotTime,
                              isInactive && styles.slotTimeInactive,
                            ]}
                          >
                            {slot.startTime} - {slot.endTime}
                          </Text>
                          <View style={styles.slotMetaRow}>
                            <Text
                              style={[
                                styles.slotDuration,
                                isInactive && styles.slotDurationInactive,
                              ]}
                            >
                              {getDurationLabel(slot.startTime, slot.endTime)}
                            </Text>
                            {isInactive && (
                              <View style={styles.inactiveBadge}>
                                <Text style={styles.inactiveBadgeText}>
                                  Inactif
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                      {!bulkMode && (
                        <View style={styles.slotActions}>
                          <TouchableOpacity
                            onPress={() => handleToggle(slot)}
                            style={[
                              styles.slotActionButton,
                              isInactive && styles.slotToggleButtonInactive,
                            ]}
                            activeOpacity={0.7}
                          >
                            {isInactive ? (
                              <EyeOff
                                size={16}
                                color={COLORS.secondary[300]}
                              />
                            ) : (
                              <Eye size={16} color={COLORS.primary.DEFAULT} />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => openDuplicateModal(slot)}
                            style={styles.slotActionButton}
                            activeOpacity={0.7}
                          >
                            <Copy size={16} color={COLORS.secondary[400]} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => openEditModal(slot)}
                            style={styles.slotActionButton}
                            activeOpacity={0.7}
                          >
                            <Pencil size={16} color={COLORS.secondary[400]} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDelete(slot)}
                            style={[
                              styles.slotActionButton,
                              styles.slotDeleteButton,
                            ]}
                            activeOpacity={0.7}
                          >
                            <Trash2 size={16} color={COLORS.error} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}

                {!bulkMode && (
                  <TouchableOpacity
                    onPress={openAddModal}
                    style={styles.addSlotButton}
                    activeOpacity={0.7}
                  >
                    <Plus size={18} color={COLORS.primary.DEFAULT} />
                    <Text style={styles.addSlotText}>Ajouter un créneau</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {bulkMode && selectedIds.size > 0 && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.bulkBar}
        >
          <TouchableOpacity
            onPress={handleBulkToggle}
            style={styles.bulkBarButtonSecondary}
            activeOpacity={0.7}
          >
            {selectedAllActive ? (
              <EyeOff size={16} color={COLORS.secondary[700]} />
            ) : (
              <Eye size={16} color={COLORS.primary.DEFAULT} />
            )}
            <Text style={styles.bulkBarTextSecondary}>
              {bulkToggleLabel} ({selectedIds.size})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleBulkDelete}
            style={styles.bulkBarButtonDanger}
            activeOpacity={0.7}
          >
            <Trash2 size={16} color={COLORS.neutral.white} />
            <Text style={styles.bulkBarTextDanger}>
              Supprimer ({selectedIds.size})
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} activeOpacity={0.7}>
              <Text style={styles.modalCancel}>Annuler</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingSlot ? "Modifier le créneau" : "Nouveau créneau"}
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.modalSave, isSaving && styles.modalSaveDisabled]}
              >
                {isSaving ? "..." : "Enregistrer"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalSectionTitle}>Jour</Text>
            <View style={styles.modalDayGrid}>
              {DAYS.map((day) => {
                const isSelected = form.dayOfWeek === day.key;
                return (
                  <TouchableOpacity
                    key={day.key}
                    onPress={() =>
                      setForm((prev) => ({ ...prev, dayOfWeek: day.key }))
                    }
                    style={[
                      styles.modalDayChip,
                      isSelected && styles.modalDayChipActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalDayChipText,
                        isSelected && styles.modalDayChipTextActive,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.modalSectionTitle}>Heure de début</Text>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.timePickerButton}
              activeOpacity={0.7}
            >
              <Clock size={18} color={COLORS.primary.DEFAULT} />
              <Text style={styles.timePickerText}>{form.startTime}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={timeToDate(form.startTime)}
                mode="time"
                is24Hour
                minuteInterval={5}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onStartTimeChange}
                locale="fr-FR"
              />
            )}

            <Text style={styles.modalSectionTitle}>Durée</Text>
            <View style={styles.durationRow}>
              {DURATION_PRESETS.map((preset) => {
                const isSelected =
                  durationMode === "preset" &&
                  selectedPreset === preset.minutes;
                return (
                  <TouchableOpacity
                    key={preset.minutes}
                    onPress={() => handlePresetSelect(preset.minutes)}
                    style={[
                      styles.durationChip,
                      isSelected && styles.durationChipActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.durationChipText,
                        isSelected && styles.durationChipTextActive,
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                onPress={handleCustomDuration}
                style={[
                  styles.durationChip,
                  durationMode === "custom" && styles.durationChipActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.durationChipText,
                    durationMode === "custom" && styles.durationChipTextActive,
                  ]}
                >
                  Personnalisé
                </Text>
              </TouchableOpacity>
            </View>

            {durationMode === "custom" && (
              <>
                <Text style={styles.modalSectionTitle}>Heure de fin</Text>
                <TouchableOpacity
                  onPress={() => setShowEndPicker(true)}
                  style={styles.timePickerButton}
                  activeOpacity={0.7}
                >
                  <Clock size={18} color={COLORS.error} />
                  <Text style={styles.timePickerText}>{form.endTime}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={timeToDate(form.endTime)}
                    mode="time"
                    is24Hour
                    minuteInterval={5}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onEndTimeChange}
                    locale="fr-FR"
                  />
                )}
              </>
            )}

            {durationMode === "preset" && selectedPreset && (
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Créneau :</Text>
                <Text style={styles.previewValue}>
                  {form.startTime} - {form.endTime}
                </Text>
              </View>
            )}

            {form.startTime >= form.endTime && (
              <Text style={styles.validationError}>
                L&apos;heure de fin doit être après l&apos;heure de début
              </Text>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={duplicateModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDuplicateModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setDuplicateModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancel}>Annuler</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Dupliquer le créneau</Text>
            <TouchableOpacity
              onPress={handleDuplicate}
              disabled={isDuplicating || duplicateDays.size === 0}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modalSave,
                  (isDuplicating || duplicateDays.size === 0) &&
                    styles.modalSaveDisabled,
                ]}
              >
                {isDuplicating ? "..." : "Dupliquer"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {duplicateSlot && (
              <View style={styles.duplicatePreview}>
                <Clock size={18} color={COLORS.primary.DEFAULT} />
                <Text style={styles.duplicatePreviewText}>
                  {duplicateSlot.startTime} - {duplicateSlot.endTime}
                </Text>
                <Text style={styles.duplicatePreviewDuration}>
                  ({getDurationLabel(duplicateSlot.startTime, duplicateSlot.endTime)})
                </Text>
              </View>
            )}

            <Text style={styles.modalSectionTitle}>
              Dupliquer vers ces jours
            </Text>
            <View style={styles.modalDayGrid}>
              {DAYS.filter(
                (d) => d.key !== duplicateSlot?.dayOfWeek,
              ).map((day) => {
                const isSelected = duplicateDays.has(day.key);
                return (
                  <TouchableOpacity
                    key={day.key}
                    onPress={() => toggleDuplicateDay(day.key)}
                    style={[
                      styles.modalDayChip,
                      isSelected && styles.modalDayChipActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalDayChipText,
                        isSelected && styles.modalDayChipTextActive,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {duplicateDays.size > 0 && (
              <Text style={styles.duplicateCount}>
                {duplicateDays.size} jour(s) sélectionné(s)
              </Text>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  addHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 24,
    marginTop: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 6,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: COLORS.secondary[900],
  },
  summaryLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[400],
  },

  dayTabs: {
    marginTop: 24,
  },
  dayTabsContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  dayTab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.neutral.white,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  dayTabActive: {
    backgroundColor: COLORS.primary.DEFAULT,
    borderColor: COLORS.primary.DEFAULT,
  },
  dayTabHasSlots: {
    borderColor: COLORS.primary[200],
    backgroundColor: COLORS.primary[50],
  },
  dayTabText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary[600],
  },
  dayTabTextActive: {
    color: COLORS.neutral.white,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary.DEFAULT,
    marginTop: 4,
  },
  dayDotActive: {
    backgroundColor: COLORS.neutral.white,
  },

  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.secondary[500],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginHorizontal: 24,
  },

  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },

  emptyCard: {
    backgroundColor: COLORS.neutral.white,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 8,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[700],
    marginTop: 4,
  },
  emptySubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[400],
    textAlign: "center",
  },
  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primary[50],
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  emptyAddText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },

  slotsContainer: {
    marginHorizontal: 24,
    gap: 10,
  },
  slotCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  slotCardInactive: {
    backgroundColor: COLORS.neutral[100],
    opacity: 0.7,
    shadowOpacity: 0.02,
  },
  slotCardSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary[50],
  },
  slotTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  slotTimeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary.DEFAULT,
  },
  slotTimeDotInactive: {
    backgroundColor: COLORS.neutral[300],
  },
  slotTimeInfo: {
    gap: 2,
  },
  slotTime: {
    fontFamily: FONTS.fredoka,
    fontSize: 17,
    color: COLORS.secondary[900],
  },
  slotTimeInactive: {
    color: COLORS.secondary[400],
  },
  slotMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  slotDuration: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[400],
  },
  slotDurationInactive: {
    color: COLORS.secondary[300],
  },
  inactiveBadge: {
    backgroundColor: COLORS.neutral[200],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inactiveBadgeText: {
    fontFamily: FONTS.secondary,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.secondary[500],
  },
  slotActions: {
    flexDirection: "row",
    gap: 6,
  },
  slotActionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  slotToggleButtonInactive: {
    backgroundColor: COLORS.neutral[200],
    borderColor: COLORS.neutral[300],
  },
  slotDeleteButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.neutral[300],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary.DEFAULT,
    borderColor: COLORS.primary.DEFAULT,
  },
  checkboxMark: {
    color: COLORS.neutral.white,
    fontSize: 14,
    fontWeight: "700",
  },

  addSlotButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary[200],
    borderStyle: "dashed",
    backgroundColor: COLORS.primary[50],
  },
  addSlotText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },

  bulkBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: COLORS.neutral.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bulkBarButtonSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  bulkBarTextSecondary: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary[700],
  },
  bulkBarButtonDanger: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.error,
  },
  bulkBarTextDanger: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  modalCancel: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[500],
  },
  modalTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
  },
  modalSave: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },
  modalSaveDisabled: {
    opacity: 0.5,
  },
  modalContent: {
    padding: 24,
    paddingBottom: 40,
  },
  modalSectionTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.secondary[700],
    marginBottom: 12,
    marginTop: 24,
  },
  modalDayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalDayChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.neutral[50],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  modalDayChipActive: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary.DEFAULT,
  },
  modalDayChipText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.secondary[600],
  },
  modalDayChipTextActive: {
    color: COLORS.primary[700],
    fontWeight: "600",
  },
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  timePickerText: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
  },

  durationRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  durationChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.neutral[50],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  durationChipActive: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary.DEFAULT,
  },
  durationChipText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.secondary[600],
  },
  durationChipTextActive: {
    color: COLORS.primary[700],
  },

  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  previewLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
  },
  previewValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.primary[700],
  },

  validationError: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.error,
    marginTop: 16,
  },

  duplicatePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    backgroundColor: COLORS.primary[50],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  duplicatePreviewText: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
  },
  duplicatePreviewDuration: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[400],
  },
  duplicateCount: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.primary[700],
    marginTop: 16,
    textAlign: "center",
  },
});
