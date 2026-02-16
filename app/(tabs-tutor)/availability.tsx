import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Clock, Check, Calendar } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

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
          ? {
              ...day,
              enabled: true,
              slots: TIME_SLOTS.map((slot) => slot.id),
            }
          : day,
      ),
    );
  };

  const clearAllSlots = () => {
    setAvailability((prev) =>
      prev.map((day, i) =>
        i === selectedDay
          ? {
              ...day,
              slots: [],
            }
          : day,
      ),
    );
  };

  const currentDay = availability[selectedDay];
  const totalSlots = availability.reduce(
    (acc, day) => acc + day.slots.length,
    0,
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.header}
        >
          <LinearGradient
            colors={["#8B5CF6", "#6366F1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Disponibilités</Text>
            <Text style={styles.headerSubtitle}>
              {totalSlots} créneau{totalSlots > 1 ? "x" : ""} configuré
              {totalSlots > 1 ? "s" : ""}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Days Selection */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Jours de la semaine</Text>
          <View style={styles.daysContainer}>
            {DAYS.map((day, index) => {
              const dayData = availability[index];
              const isSelected = selectedDay === index;
              return (
                <Animated.View
                  key={day.short}
                  entering={FadeInDown.delay(350 + index * 30).duration(600)}
                  style={styles.dayWrapper}
                >
                  <TouchableOpacity
                    style={[
                      styles.dayCard,
                      isSelected && styles.dayCardSelected,
                      dayData.enabled && styles.dayCardEnabled,
                    ]}
                    onPress={() => setSelectedDay(index)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.dayTextSelected,
                      ]}
                    >
                      {day.short}
                    </Text>
                    {dayData.enabled && (
                      <View style={styles.dayBadge}>
                        <Text style={styles.dayBadgeText}>
                          {dayData.slots.length}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.dayToggle,
                      dayData.enabled && styles.dayToggleEnabled,
                    ]}
                    onPress={() => toggleDay(index)}
                    activeOpacity={0.7}
                  >
                    {dayData.enabled && <Check size={12} color="white" />}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Time Slots */}
        {currentDay.enabled ? (
          <Animated.View
            entering={FadeInDown.delay(600).duration(600)}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{currentDay.dayFull}</Text>
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={styles.quickButton}
                  onPress={selectAllSlots}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickButtonText}>Tout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickButton}
                  onPress={clearAllSlots}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickButtonText}>Rien</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.slotsGrid}>
              {TIME_SLOTS.map((slot, index) => {
                const isSelected = currentDay.slots.includes(slot.id);
                return (
                  <Animated.View
                    key={slot.id}
                    entering={FadeInDown.delay(650 + index * 40).duration(600)}
                    style={styles.slotWrapper}
                  >
                    <TouchableOpacity
                      style={[
                        styles.slotCard,
                        isSelected && styles.slotCardSelected,
                      ]}
                      onPress={() => toggleSlot(slot.id)}
                      activeOpacity={0.7}
                    >
                      <Clock
                        size={18}
                        color={isSelected ? "white" : COLORS.primary.DEFAULT}
                      />
                      <Text
                        style={[
                          styles.slotText,
                          isSelected && styles.slotTextSelected,
                        ]}
                      >
                        {slot.displayTime}
                      </Text>
                      {isSelected && (
                        <View style={styles.slotCheck}>
                          <Check size={14} color="white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown.delay(600).duration(600)}
            style={styles.disabledDayContainer}
          >
            <Calendar size={48} color={COLORS.secondary[300]} />
            <Text style={styles.disabledDayTitle}>
              {currentDay.dayFull} désactivé
            </Text>
            <Text style={styles.disabledDayText}>
              Activez ce jour pour définir vos créneaux disponibles
            </Text>
            <TouchableOpacity
              style={styles.enableButton}
              onPress={() => toggleDay(selectedDay)}
              activeOpacity={0.7}
            >
              <Check size={18} color="white" />
              <Text style={styles.enableButtonText}>
                Activer {currentDay.dayFull}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Info Card */}
        <Animated.View
          entering={FadeInDown.delay(900).duration(600)}
          style={styles.infoCard}
        >
          <Text style={styles.infoTitle}>💡 Conseil</Text>
          <Text style={styles.infoText}>
            Les parents pourront réserver des sessions pendant vos créneaux
            disponibles. Pensez à mettre à jour régulièrement vos
            disponibilités.
          </Text>
        </Animated.View>

        {/* Summary */}
        {totalSlots > 0 && (
          <Animated.View
            entering={FadeInDown.delay(1000).duration(600)}
            style={styles.summaryCard}
          >
            <Text style={styles.summaryTitle}>Résumé hebdomadaire</Text>
            <View style={styles.summaryGrid}>
              {availability.map(
                (day, index) =>
                  day.enabled && (
                    <View key={index} style={styles.summaryItem}>
                      <Text style={styles.summaryDay}>{day.day}</Text>
                      <Text style={styles.summaryCount}>
                        {day.slots.length} créneau
                        {day.slots.length > 1 ? "x" : ""}
                      </Text>
                    </View>
                  ),
              )}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.neutral.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
  },
  quickActions: {
    flexDirection: "row",
    gap: 8,
  },
  quickButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary[50],
    borderRadius: 8,
  },
  quickButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  dayWrapper: {
    width: "13%",
    alignItems: "center",
    gap: 8,
  },
  dayCard: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayCardSelected: {
    borderColor: COLORS.primary.DEFAULT,
    backgroundColor: COLORS.primary[50],
  },
  dayCardEnabled: {
    backgroundColor: COLORS.neutral.white,
  },
  dayText: {
    fontFamily: FONTS.fredoka,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.secondary[600],
  },
  dayTextSelected: {
    color: COLORS.primary.DEFAULT,
  },
  dayBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: COLORS.primary.DEFAULT,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.neutral[50],
  },
  dayBadgeText: {
    fontFamily: FONTS.fredoka,
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },
  dayToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.neutral[200],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.neutral[300],
  },
  dayToggleEnabled: {
    backgroundColor: COLORS.primary.DEFAULT,
    borderColor: COLORS.primary.DEFAULT,
  },
  slotsGrid: {
    gap: 12,
  },
  slotWrapper: {
    width: "100%",
  },
  slotCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  slotCardSelected: {
    backgroundColor: COLORS.primary.DEFAULT,
    borderColor: COLORS.primary.DEFAULT,
  },
  slotText: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
  },
  slotTextSelected: {
    color: COLORS.neutral.white,
  },
  slotCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledDayContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 32,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    borderStyle: "dashed",
  },
  disabledDayTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginTop: 16,
    marginBottom: 8,
  },
  disabledDayText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    textAlign: "center",
    marginBottom: 20,
  },
  enableButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.primary.DEFAULT,
    borderRadius: 12,
  },
  enableButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },
  infoCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary.DEFAULT,
  },
  infoTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 8,
  },
  infoText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[700],
    lineHeight: 20,
  },
  summaryCard: {
    marginHorizontal: 24,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryItem: {
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  summaryDay: {
    fontFamily: FONTS.fredoka,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary.DEFAULT,
    marginBottom: 2,
  },
  summaryCount: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: COLORS.secondary[700],
  },
});
