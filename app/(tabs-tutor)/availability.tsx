import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock, Check, Calendar, TrendingUp, Sparkles } from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface TimeSlot {
  id: string;
  time: string;
  displayTime: string;
}

interface DayAvailability {
  day: string;
  dayFull: string;
  enabled: boolean;
  slots: string[];
}

const DAYS = [
  { short: "Lun", full: "Lundi" },
  { short: "Mar", full: "Mardi" },
  { short: "Mer", full: "Mercredi" },
  { short: "Jeu", full: "Jeudi" },
  { short: "Ven", full: "Vendredi" },
  { short: "Sam", full: "Samedi" },
  { short: "Dim", full: "Dimanche" },
];

const TIME_SLOTS: TimeSlot[] = [
  { id: "08:00", time: "08:00", displayTime: "08:00 - 09:00" },
  { id: "09:00", time: "09:00", displayTime: "09:00 - 10:00" },
  { id: "10:00", time: "10:00", displayTime: "10:00 - 11:00" },
  { id: "11:00", time: "11:00", displayTime: "11:00 - 12:00" },
  { id: "14:00", time: "14:00", displayTime: "14:00 - 15:00" },
  { id: "15:00", time: "15:00", displayTime: "15:00 - 16:00" },
  { id: "16:00", time: "16:00", displayTime: "16:00 - 17:00" },
  { id: "17:00", time: "17:00", displayTime: "17:00 - 18:00" },
  { id: "18:00", time: "18:00", displayTime: "18:00 - 19:00" },
];

export default function TutorAvailabilityScreen() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [availability, setAvailability] = useState<DayAvailability[]>(
    DAYS.map((day) => ({
      day: day.short,
      dayFull: day.full,
      enabled: false,
      slots: [],
    })),
  );

  const toggleDay = (index: number) => {
    setAvailability((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, enabled: !day.enabled, slots: [] } : day,
      ),
    );
  };

  const toggleSlot = (slotId: string) => {
    setAvailability((prev) =>
      prev.map((day, i) =>
        i === selectedDay
          ? {
              ...day,
              slots: day.slots.includes(slotId)
                ? day.slots.filter((s) => s !== slotId)
                : [...day.slots, slotId],
            }
          : day,
      ),
    );
  };

  const selectAllSlots = () => {
    setAvailability((prev) =>
      prev.map((day, i) =>
        i === selectedDay
          ? { ...day, enabled: true, slots: TIME_SLOTS.map((s) => s.id) }
          : day,
      ),
    );
  };

  const clearAllSlots = () => {
    setAvailability((prev) =>
      prev.map((day, i) => (i === selectedDay ? { ...day, slots: [] } : day)),
    );
  };

  const currentDay = availability[selectedDay];
  const totalSlots = availability.reduce(
    (acc, day) => acc + day.slots.length,
    0,
  );
  const enabledDays = availability.filter((d) => d.enabled).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header simple */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>DISPONIBILITÉS</Text>
            <Text style={styles.headerTitle}>Mes créneaux</Text>
          </View>
          <View style={styles.headerBadge}>
            <Clock size={16} color="#6366F1" />
            <Text style={styles.headerBadgeText}>{totalSlots}</Text>
          </View>
        </View>

        {/* Carte statistiques */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalSlots}</Text>
              <Text style={styles.statLabel}>Créneaux</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{enabledDays}</Text>
              <Text style={styles.statLabel}>Jours actifs</Text>
            </View>
          </View>
        </View>

        {/* Section Jours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jours disponibles</Text>
          <View style={styles.daysGrid}>
            {DAYS.map((day, index) => {
              const dayData = availability[index];
              const isSelected = selectedDay === index;
              const isEnabled = dayData.enabled;

              return (
                <Pressable
                  key={day.short}
                  style={({ pressed }) => [
                    styles.dayCard,
                    isSelected && styles.dayCardSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => setSelectedDay(index)}
                >
                  <View style={styles.dayHeader}>
                    <Text style={[
                      styles.dayShort,
                      isSelected && styles.dayTextSelected
                    ]}>
                      {day.short}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.dayToggle,
                        isEnabled && styles.dayToggleActive,
                      ]}
                      onPress={() => toggleDay(index)}
                    >
                      {isEnabled && <Check size={10} color="white" />}
                    </TouchableOpacity>
                  </View>
                  {isEnabled && (
                    <View style={[
                      styles.daySlotBadge,
                      isSelected && styles.daySlotBadgeSelected
                    ]}>
                      <Text style={[
                        styles.daySlotCount,
                        isSelected && styles.dayTextSelected
                      ]}>
                        {dayData.slots.length}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Créneaux horaires */}
        {currentDay.enabled ? (
          <View style={styles.section}>
            <View style={styles.slotHeader}>
              <Text style={styles.sectionTitle}>{currentDay.dayFull}</Text>
              <View style={styles.slotActions}>
                <TouchableOpacity
                  style={styles.slotActionButton}
                  onPress={selectAllSlots}
                >
                  <Text style={styles.slotActionText}>Tout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.slotActionButton}
                  onPress={clearAllSlots}
                >
                  <Text style={styles.slotActionText}>Rien</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.slotsGrid}>
              {TIME_SLOTS.map((slot) => {
                const isSelected = currentDay.slots.includes(slot.id);
                return (
                  <Pressable
                    key={slot.id}
                    style={({ pressed }) => [
                      styles.slotCard,
                      isSelected && styles.slotCardSelected,
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => toggleSlot(slot.id)}
                  >
                    <View style={[
                      styles.slotIcon,
                      isSelected && styles.slotIconSelected
                    ]}>
                      <Clock
                        size={14}
                        color={isSelected ? "white" : "#6366F1"}
                      />
                    </View>
                    <Text style={[
                      styles.slotText,
                      isSelected && styles.slotTextSelected
                    ]}>
                      {slot.displayTime}
                    </Text>
                    {isSelected && (
                      <Check size={14} color="white" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.disabledSection}>
            <View style={styles.disabledCard}>
              <Calendar size={40} color="#CBD5E1" />
              <Text style={styles.disabledTitle}>
                {currentDay.dayFull} désactivé
              </Text>
              <Text style={styles.disabledText}>
                Activez ce jour pour définir vos créneaux
              </Text>
              <TouchableOpacity
                style={styles.enableButton}
                onPress={() => toggleDay(selectedDay)}
              >
                <Text style={styles.enableButtonText}>
                  Activer {currentDay.dayFull}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Conseil */}
        <View style={styles.tipCard}>
          <Sparkles size={16} color="#6366F1" />
          <Text style={styles.tipText}>
            Les parents pourront réserver des sessions pendant vos créneaux disponibles.
          </Text>
        </View>

        {/* Bouton Add source */}
        <TouchableOpacity style={styles.sourceButton}>
          <Text style={styles.sourceButtonText}>+ Ajouter des disponibilités</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: "#6366F1",
    letterSpacing: 1.2,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "#1E293B",
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#6366F1",
  },

  // Stats Card
  statsCard: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: "#1E293B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#F1F5F9",
  },

  // Section
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 12,
  },

  // Days Grid
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayCard: {
    width: 70,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dayCardSelected: {
    borderColor: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dayShort: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  dayTextSelected: {
    color: "#6366F1",
  },
  dayToggle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  dayToggleActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  daySlotBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  daySlotBadgeSelected: {
    backgroundColor: "#FFFFFF",
  },
  daySlotCount: {
    fontSize: 11,
    color: "#64748B",
  },

  // Slots
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  slotActions: {
    flexDirection: "row",
    gap: 8,
  },
  slotActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
  },
  slotActionText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  slotsGrid: {
    gap: 8,
  },
  slotCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 10,
  },
  slotCardSelected: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  slotIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  slotIconSelected: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  slotText: {
    flex: 1,
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
  slotTextSelected: {
    color: "white",
  },

  // Disabled Section
  disabledSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  disabledCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderStyle: "dashed",
  },
  disabledTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 8,
  },
  disabledText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20,
  },
  enableButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  enableButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  // Tip Card
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EEF2FF",
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#6366F1",
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#1E293B",
    lineHeight: 18,
  },

  // Source Button
  sourceButton: {
    backgroundColor: "#F1F5F9",
    marginHorizontal: 24,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
});