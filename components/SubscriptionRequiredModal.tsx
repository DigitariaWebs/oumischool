import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Shield, Crown } from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

interface SubscriptionRequiredModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function SubscriptionRequiredModal({
  visible,
  onClose,
  onUpgrade,
}: SubscriptionRequiredModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.iconContainer}>
            <Shield
              size={48}
              color={COLORS.primary.DEFAULT}
              strokeWidth={1.5}
            />
          </View>

          <Text style={styles.title}>Abonnement requis</Text>

          <Text style={styles.message}>
            Cette fonctionnalité nécessite un abonnement actif pour accéder à
            toutes les ressources.
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Crown size={16} color={COLORS.amber.DEFAULT} />
              <Text style={styles.featureText}>
                Ressources premium illimitées
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Crown size={16} color={COLORS.amber.DEFAULT} />
              <Text style={styles.featureText}>Fonctionnalités avancées</Text>
            </View>
            <View style={styles.featureItem}>
              <Crown size={16} color={COLORS.amber.DEFAULT} />
              <Text style={styles.featureText}>Support prioritaire</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={onUpgrade}>
              <Text style={styles.primaryButtonText}>Voir les plans</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Plus tard</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    padding: 28,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.secondary[900],
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: COLORS.secondary[500],
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  featureList: {
    width: "100%",
    backgroundColor: COLORS.neutral[50],
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.secondary[700],
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.primary.DEFAULT,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },
  secondaryButton: {
    backgroundColor: COLORS.neutral[100],
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.secondary[500],
  },
});
