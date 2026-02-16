import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Check, Sparkles } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING, RADIUS } from "@/constants/tokens";
import { Card, Badge } from "@/components/ui";
import Animated, { FadeInUp } from "react-native-reanimated";

interface PlanCardProps {
  id: string;
  name: string;
  price: number;
  currency?: string;
  billingPeriod: "month" | "year";
  description: string;
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
  onSelect: (planId: string) => void;
  delay?: number;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  id,
  name,
  price,
  currency = "€",
  billingPeriod,
  description,
  features,
  isPopular = false,
  isCurrent = false,
  onSelect,
  delay = 0,
}) => {
  const isYearly = billingPeriod === "year";
  const monthlyPrice = isYearly ? Math.round(price / 12) : price;

  const cardStyle: ViewStyle = {
    ...styles.container,
    ...(isPopular && styles.popularContainer),
    ...(isCurrent && styles.currentContainer),
  };

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(500)}>
      <Card
        variant={isPopular ? "elevated" : "outlined"}
        padding="none"
        style={cardStyle}
      >
        {/* Popular Badge */}
        {isPopular && (
          <View style={styles.popularBadgeContainer}>
            <Badge
              label="Le plus populaire"
              variant="success"
              size="sm"
              style={styles.popularBadge}
              textStyle={styles.popularBadgeText}
            />
          </View>
        )}

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.planName}>{name}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          {/* Pricing */}
          <View style={styles.pricingSection}>
            <View style={styles.priceRow}>
              <Text style={styles.currency}>{currency}</Text>
              <Text style={styles.price}>{monthlyPrice}</Text>
              <Text style={styles.period}>
                /{billingPeriod === "month" ? "mois" : "mois"}
              </Text>
            </View>
            {isYearly && (
              <Text style={styles.billingNote}>
                Facturé {price}
                {currency} par an
              </Text>
            )}
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={styles.checkIcon}>
                  <Check
                    size={16}
                    color={COLORS.primary.DEFAULT}
                    strokeWidth={3}
                  />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            style={[
              styles.selectButton,
              isPopular && styles.selectButtonPopular,
              isCurrent && styles.selectButtonCurrent,
            ]}
            onPress={() => onSelect(id)}
            activeOpacity={0.8}
            disabled={isCurrent}
          >
            {isCurrent ? (
              <Text
                style={[
                  styles.selectButtonText,
                  styles.selectButtonTextCurrent,
                ]}
              >
                Offre actuelle
              </Text>
            ) : (
              <>
                {isPopular && (
                  <Sparkles size={18} color={COLORS.neutral.white} />
                )}
                <Text
                  style={[
                    styles.selectButtonText,
                    isPopular && styles.selectButtonTextPopular,
                  ]}
                >
                  Choisir cette offre
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    overflow: "visible",
  },
  popularContainer: {
    borderWidth: 2,
    borderColor: COLORS.primary.DEFAULT,
  },
  currentContainer: {
    borderWidth: 2,
    borderColor: COLORS.secondary[300],
  },
  popularBadgeContainer: {
    position: "absolute",
    top: -12,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  popularBadge: {
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  popularBadgeText: {
    fontWeight: "700",
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  planName: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: SPACING.xs,
  },
  description: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    lineHeight: 20,
  },
  pricingSection: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.xs,
  },
  currency: {
    fontFamily: FONTS.secondary,
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary.DEFAULT,
    marginTop: 4,
  },
  price: {
    fontFamily: FONTS.fredoka,
    fontSize: 48,
    fontWeight: "700",
    color: COLORS.secondary[900],
    lineHeight: 52,
    marginHorizontal: 4,
  },
  period: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[600],
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  billingNote: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
    fontStyle: "italic",
  },
  featuresSection: {
    marginBottom: SPACING.lg,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[700],
    lineHeight: 22,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.secondary[100],
    gap: SPACING.xs,
  },
  selectButtonPopular: {
    backgroundColor: COLORS.primary.DEFAULT,
  },
  selectButtonCurrent: {
    backgroundColor: COLORS.neutral[200],
  },
  selectButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary[700],
  },
  selectButtonTextPopular: {
    color: COLORS.neutral.white,
  },
  selectButtonTextCurrent: {
    color: COLORS.secondary[500],
  },
});
