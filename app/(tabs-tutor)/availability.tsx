import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Clock, Plus, Check } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

export default function TutorAvailabilityScreen() {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
              Indiquez vos créneaux disponibles
            </Text>
          </LinearGradient>
        </Animated.View>

        <View style={styles.section}>
          <Animated.Text
            entering={FadeInDown.delay(300).duration(600)}
            style={styles.sectionTitle}
          >
            Créneaux disponibles
          </Animated.Text>
          {SLOTS.map((slot, index) => (
            <Animated.View
              key={slot}
              entering={FadeInDown.delay(400 + index * 50).duration(600)}
              style={styles.slotRow}
            >
              <TouchableOpacity
                style={[
                  styles.slotCard,
                  selectedSlots.includes(slot) && styles.slotCardSelected,
                ]}
                onPress={() => toggleSlot(slot)}
                activeOpacity={0.7}
              >
                <Clock
                  size={20}
                  color={selectedSlots.includes(slot) ? "white" : "#8B5CF6"}
                />
                <Text
                  style={[
                    styles.slotText,
                    selectedSlots.includes(slot) && styles.slotTextSelected,
                  ]}
                >
                  {slot}
                </Text>
                {selectedSlots.includes(slot) && (
                  <Check size={18} color="white" />
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Animated.View
          entering={FadeInDown.delay(700).duration(600)}
          style={styles.infoCard}
        >
          <Text style={styles.infoText}>
            Les parents pourront réserver des sessions pendant vos créneaux
            disponibles.
          </Text>
        </Animated.View>
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
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    marginBottom: 16,
  },
  slotRow: {
    marginBottom: 12,
  },
  slotCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  slotCardSelected: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
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
  infoCard: {
    marginHorizontal: 24,
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#8B5CF6",
  },
  infoText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    lineHeight: 22,
  },
});
