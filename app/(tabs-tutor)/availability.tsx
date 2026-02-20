import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock, Check, Calendar, TrendingUp } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";
import { BlobBackground, HeroCard, AnimatedSection } from "@/components/ui";

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
  const { colors, isDark } = useTheme();
  const [selectedDay, setSelectedDay] = useState(0);
  const [availability, setAvailability] = useState<DayAvailability[]>(
    DAYS.map((day) => ({
      day: day.short,
      dayFull: day.full,
      enabled: false,
      slots: [],
    })),
  );
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

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
      <BlobBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <AnimatedSection delay={100}>
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Clock size={20} color="white" />
            </View>
            <Text style={styles.headerTitle}>Disponibilités</Text>
          </View>
        </AnimatedSection>

        {/* Hero */}
        <AnimatedSection delay={150} style={styles.heroWrapper}>
          <HeroCard
            title="Créneaux configurés"
            value={`${totalSlots}`}
            subtitle={`créneau${totalSlots > 1 ? "x" : ""} disponible${totalSlots > 1 ? "s" : ""}`}
            badge={{
              icon: <TrendingUp size={14} color="#FCD34D" />,
              text: `${enabledDays} jour${enabledDays > 1 ? "s" : ""} actif${enabledDays > 1 ? "s" : ""}`,
            }}
          />
        </AnimatedSection>

        {/* Days Selection */}
        <AnimatedSection delay={250} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View
                style={[styles.sectionIcon, { backgroundColor: "#8B5CF620" }]}
              >
                <Calendar size={16} color="#8B5CF6" />
              </View>
              <Text style={styles.sectionTitle}>Jours actifs</Text>
            </View>
          </View>

          <View style={styles.daysGrid}>
            {DAYS.map((day, index) => {
              const dayData = availability[index];
              const isSelected = selectedDay === index;
              const isEnabled = dayData.enabled;

              return (
                <Animated.View
                  key={day.short}
                  entering={FadeInDown.delay(300 + index * 35)
                    .duration(500)
                    .springify()}
                >
                  <TouchableOpacity
                    style={[
                      styles.dayCard,
                      {
                        backgroundColor: isSelected
                          ? COLORS.primary.DEFAULT
                          : isEnabled
                            ? colors.card
                            : colors.card,
                        borderColor: isSelected
                          ? COLORS.primary.DEFAULT
                          : isEnabled
                            ? COLORS.primary.DEFAULT + "60"
                            : isDark
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.06)",
                      },
                    ]}
                    onPress={() => setSelectedDay(index)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.dayShort,
                        {
                          color: isSelected
                            ? "white"
                            : isEnabled
                              ? COLORS.primary.DEFAULT
                              : colors.textSecondary,
                        },
                      ]}
                    >
                      {day.short}
                    </Text>

                    {isEnabled && (
                      <View
                        style={[
                          styles.daySlotCount,
                          {
                            backgroundColor: isSelected
                              ? "rgba(255,255,255,0.25)"
                              : COLORS.primary.DEFAULT + "20",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.daySlotCountText,
                            {
                              color: isSelected
                                ? "white"
                                : COLORS.primary.DEFAULT,
                            },
                          ]}
                        >
                          {dayData.slots.length}
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.dayToggle,
                        {
                          backgroundColor: isEnabled
                            ? isSelected
                              ? "rgba(255,255,255,0.3)"
                              : COLORS.primary.DEFAULT
                            : isDark
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.08)",
                          borderColor: isEnabled
                            ? "transparent"
                            : isDark
                              ? "rgba(255,255,255,0.15)"
                              : "rgba(0,0,0,0.1)",
                        },
                      ]}
                      onPress={() => toggleDay(index)}
                      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                      activeOpacity={0.8}
                    >
                      {isEnabled && (
                        <Check size={10} color="white" strokeWidth={3} />
                      )}
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </AnimatedSection>

        {/* Time Slots */}
        {currentDay.enabled ? (
          <AnimatedSection delay={500} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#10B98120" }]}
                >
                  <Clock size={16} color="#10B981" />
                </View>
                <Text style={styles.sectionTitle}>{currentDay.dayFull}</Text>
              </View>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity
                  style={[
                    styles.quickBtn,
                    { backgroundColor: COLORS.primary.DEFAULT + "15" },
                  ]}
                  onPress={selectAllSlots}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.quickBtnText,
                      { color: COLORS.primary.DEFAULT },
                    ]}
                  >
                    Tout
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.quickBtn,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.05)",
                    },
                  ]}
                  onPress={clearAllSlots}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.quickBtnText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Rien
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.slotsGrid}>
              {TIME_SLOTS.map((slot, index) => {
                const isSelected = currentDay.slots.includes(slot.id);
                return (
                  <Animated.View
                    key={slot.id}
                    entering={FadeInDown.delay(550 + index * 40)
                      .duration(400)
                      .springify()}
                  >
                    <TouchableOpacity
                      style={[
                        styles.slotCard,
                        {
                          backgroundColor: isSelected
                            ? COLORS.primary.DEFAULT
                            : colors.card,
                          borderColor: isSelected
                            ? COLORS.primary.DEFAULT
                            : isDark
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.06)",
                          shadowColor: isSelected
                            ? COLORS.primary.DEFAULT
                            : isDark
                              ? "#000"
                              : COLORS.secondary.DEFAULT,
                        },
                      ]}
                      onPress={() => toggleSlot(slot.id)}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.slotIconWrapper,
                          {
                            backgroundColor: isSelected
                              ? "rgba(255,255,255,0.2)"
                              : COLORS.primary.DEFAULT + "15",
                          },
                        ]}
                      >
                        <Clock
                          size={16}
                          color={isSelected ? "white" : COLORS.primary.DEFAULT}
                        />
                      </View>
                      <Text
                        style={[
                          styles.slotText,
                          { color: isSelected ? "white" : colors.textPrimary },
                        ]}
                      >
                        {slot.displayTime}
                      </Text>
                      {isSelected && (
                        <View style={styles.slotCheck}>
                          <Check size={13} color="white" strokeWidth={3} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={500} style={styles.disabledWrapper}>
            <View
              style={[
                styles.disabledCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <View
                style={[
                  styles.disabledIconContainer,
                  { backgroundColor: colors.input },
                ]}
              >
                <Calendar size={36} color={colors.textMuted} />
              </View>
              <Text
                style={[styles.disabledTitle, { color: colors.textPrimary }]}
              >
                {currentDay.dayFull} désactivé
              </Text>
              <Text
                style={[styles.disabledText, { color: colors.textSecondary }]}
              >
                Activez ce jour pour définir vos créneaux disponibles
              </Text>
              <TouchableOpacity
                style={[
                  styles.enableButton,
                  { backgroundColor: COLORS.primary.DEFAULT },
                ]}
                onPress={() => toggleDay(selectedDay)}
                activeOpacity={0.8}
              >
                <Check size={16} color="white" />
                <Text style={styles.enableButtonText}>
                  Activer {currentDay.dayFull}
                </Text>
              </TouchableOpacity>
            </View>
          </AnimatedSection>
        )}

        {/* Tip Card */}
        <AnimatedSection delay={900} style={styles.tipWrapper}>
          <View
            style={[
              styles.tipCard,
              {
                backgroundColor: isDark ? "rgba(99,102,241,0.12)" : "#EEF2FF",
                borderLeftColor: COLORS.primary.DEFAULT,
              },
            ]}
          >
            <Text style={[styles.tipTitle, { color: colors.textPrimary }]}>
              💡 Conseil
            </Text>
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              Les parents pourront réserver des sessions pendant vos créneaux
              disponibles. Pensez à mettre à jour régulièrement vos
              disponibilités.
            </Text>
          </View>
        </AnimatedSection>

        {/* Weekly Summary */}
        {totalSlots > 0 && (
          <AnimatedSection delay={1000} style={styles.summaryWrapper}>
            <View
              style={[styles.summaryCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <View
                    style={[
                      styles.sectionIcon,
                      { backgroundColor: "#F59E0B20" },
                    ]}
                  >
                    <TrendingUp size={16} color="#F59E0B" />
                  </View>
                  <Text
                    style={[styles.sectionTitle, { color: colors.textPrimary }]}
                  >
                    Résumé hebdomadaire
                  </Text>
                </View>
              </View>
              <View style={styles.summaryGrid}>
                {availability.map(
                  (day, index) =>
                    day.enabled && (
                      <View
                        key={index}
                        style={[
                          styles.summaryItem,
                          { backgroundColor: COLORS.primary.DEFAULT + "15" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.summaryDay,
                            { color: COLORS.primary.DEFAULT },
                          ]}
                        >
                          {day.day}
                        </Text>
                        <Text
                          style={[
                            styles.summaryCount,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {day.slots.length} créneau
                          {day.slots.length > 1 ? "x" : ""}
                        </Text>
                      </View>
                    ),
                )}
              </View>
            </View>
          </AnimatedSection>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    headerIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: COLORS.primary.DEFAULT,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 24,
      color: colors.textPrimary,
    },
    heroWrapper: {
      marginHorizontal: 20,
      marginBottom: 24,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    sectionIcon: {
      width: 34,
      height: 34,
      borderRadius: 11,
      justifyContent: "center",
      alignItems: "center",
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    quickActionsRow: {
      flexDirection: "row",
      gap: 8,
    },
    quickBtn: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 10,
    },
    quickBtnText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      fontWeight: "600",
    },
    daysGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    dayCard: {
      width: 48,
      height: 68,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
      gap: 4,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    dayShort: {
      fontFamily: FONTS.fredoka,
      fontSize: 13,
      fontWeight: "600",
    },
    daySlotCount: {
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 6,
    },
    daySlotCountText: {
      fontFamily: FONTS.fredoka,
      fontSize: 10,
      fontWeight: "700",
    },
    dayToggle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
    },
    slotsGrid: {
      gap: 10,
    },
    slotCard: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 14,
      padding: 14,
      gap: 12,
      borderWidth: 1.5,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    slotIconWrapper: {
      width: 34,
      height: 34,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    slotText: {
      flex: 1,
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
    },
    slotCheck: {
      width: 24,
      height: 24,
      borderRadius: 8,
      backgroundColor: "rgba(255,255,255,0.25)",
      justifyContent: "center",
      alignItems: "center",
    },
    disabledWrapper: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    disabledCard: {
      borderRadius: 22,
      padding: 32,
      alignItems: "center",
      borderWidth: 1.5,
      borderStyle: "dashed",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    disabledIconContainer: {
      width: 72,
      height: 72,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    disabledTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      marginBottom: 8,
      textAlign: "center",
    },
    disabledText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 24,
    },
    enableButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 24,
      paddingVertical: 13,
      borderRadius: 14,
    },
    enableButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: "white",
    },
    tipWrapper: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    tipCard: {
      borderRadius: 16,
      padding: 16,
      borderLeftWidth: 4,
    },
    tipTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 15,
      marginBottom: 6,
    },
    tipText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      lineHeight: 20,
    },
    summaryWrapper: {
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    summaryCard: {
      borderRadius: 20,
      padding: 16,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    summaryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    summaryItem: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: "center",
    },
    summaryDay: {
      fontFamily: FONTS.fredoka,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 2,
    },
    summaryCount: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
    },
  });
