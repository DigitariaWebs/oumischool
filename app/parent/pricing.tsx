import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  X,
  ShieldCheck,
  RefreshCw,
  CreditCard,
  Clock,
  Check,
  Sparkles,
  Users,
  Baby,
  Heart,
  AlertCircle,
  CheckCircle,
  Headphones,
  BarChart3,
  Info,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Minus,
  Plus,
} from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING, RADIUS, SHADOWS } from "@/constants/tokens";
import { Card } from "@/components/ui";
import { usePayment } from "@/hooks/usePayment";
import {
  useSubscriptionPlans,
  useCurrentSubscription,
  useSubscriptionChangePreview,
} from "@/hooks/api/subscriptions";
import type { SubscriptionPlan } from "@/hooks/api/subscriptions";

interface PricingPlan {
  id: string;
  serverPlanId: string;
  name: string;
  price: number;
  billingPeriod: "month" | "year";
  description: string;
  features: string[];
  isPopular?: boolean;
  targetAudience?: string;
  maxChildren: number | null;
  includesFreeResources: boolean;
  includesPaidResources: boolean;
  maxResourceDownloads: number;
  hasPrioritySupport: boolean;
  hasAdvancedAnalytics: boolean;
}

function buildDisplayPlans(serverPlans: SubscriptionPlan[]): PricingPlan[] {
  return serverPlans.map((plan, index) => {
    const planFeatures: string[] = [];

    if (plan.maxChildren === null) {
      planFeatures.push("Enfants illimités");
    } else if (plan.maxChildren === 1) {
      planFeatures.push("1 enfant");
    } else {
      planFeatures.push(`Jusqu'à ${plan.maxChildren} enfants`);
    }

    if (plan.includesFreeResources) {
      planFeatures.push("Ressources gratuites");
    }
    if (plan.includesPaidResources) {
      planFeatures.push("Ressources payantes incluses");
    }
    if (plan.maxResourceDownloads > 0) {
      planFeatures.push(`${plan.maxResourceDownloads} téléchargements/mois`);
    }
    if (plan.hasPrioritySupport) {
      planFeatures.push("Support prioritaire");
    }
    if (plan.hasAdvancedAnalytics) {
      planFeatures.push("Analytics avancés");
    }

    let targetAudience: string | undefined;
    if (plan.maxChildren === 1) {
      targetAudience = "Idéal pour 1 enfant";
    } else if (plan.maxChildren === 3) {
      targetAudience = "Pour les familles";
    } else if (plan.maxChildren === null) {
      targetAudience = "Pour les grandes familles";
    }

    return {
      id: `${plan.id}-monthly`,
      serverPlanId: plan.id,
      name: plan.name,
      price: plan.price,
      billingPeriod: "month" as const,
      description: plan.description || "",
      features: planFeatures,
      isPopular: serverPlans.length >= 3 && index === 1,
      targetAudience,
      maxChildren: plan.maxChildren,
      includesFreeResources: plan.includesFreeResources,
      includesPaidResources: plan.includesPaidResources,
      maxResourceDownloads: plan.maxResourceDownloads,
      hasPrioritySupport: plan.hasPrioritySupport,
      hasAdvancedAnalytics: plan.hasAdvancedAnalytics,
    };
  });
}

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
  isProcessing?: boolean;
  targetAudience?: string;
  hasPrioritySupport?: boolean;
  hasAdvancedAnalytics?: boolean;
  onSelect: (planId: string) => void;
  delay?: number;
  changeType?: "upgrade" | "downgrade" | null;
  amountDueCents?: number;
  creditDays?: number;
}

const PlanCard: React.FC<PlanCardProps> = ({
  id,
  name,
  price,
  currency = "€",
  billingPeriod,
  features,
  isPopular = false,
  isCurrent = false,
  isProcessing = false,
  targetAudience,
  hasPrioritySupport = false,
  hasAdvancedAnalytics = false,
  onSelect,
  delay = 0,
  changeType,
  amountDueCents,
  creditDays,
}) => {
  const getAudienceIcon = () => {
    if (!targetAudience) return null;
    if (
      targetAudience.includes("famille") ||
      targetAudience.includes("2 enfants")
    ) {
      return <Users size={14} color={COLORS.primary.DEFAULT} />;
    }
    if (
      targetAudience.includes("enfant") ||
      targetAudience.includes("1 enfant")
    ) {
      return <Baby size={14} color={COLORS.primary.DEFAULT} />;
    }
    return <Heart size={14} color={COLORS.primary.DEFAULT} />;
  };

  return (
    <View
      style={[
        styles.planCardContainer,
        isPopular && styles.planCardPopular,
        isCurrent && styles.planCardCurrent,
      ]}
    >
      {isPopular && (
        <View style={styles.popularBadgeContainer}>
          <View style={styles.popularBadge}>
            <Sparkles size={12} color={COLORS.neutral.white} />
            <Text style={styles.popularBadgeText}>Le plus populaire</Text>
          </View>
        </View>
      )}

      {isCurrent && (
        <View style={styles.currentBadgeContainer}>
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>Plan actuel</Text>
          </View>
        </View>
      )}

      <View style={styles.planCardContent}>
        <View style={styles.planHeader}>
          <Text style={[styles.planName, isPopular && styles.planNamePopular]}>
            {name}
          </Text>
          {targetAudience && (
            <View style={styles.targetAudienceContainer}>
              {getAudienceIcon()}
              <Text style={styles.targetAudienceText}>{targetAudience}</Text>
            </View>
          )}
        </View>

        <View style={styles.pricingSection}>
          <View style={styles.priceRow}>
            <Text style={styles.currency}>{currency}</Text>
            <Text style={[styles.price, isPopular && styles.pricePopular]}>
              {price}
            </Text>
            <Text style={styles.period}>/mois</Text>
          </View>
        </View>

        <View style={styles.featuresSection}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View
                style={[styles.checkIcon, isPopular && styles.checkIconPopular]}
              >
                <Check size={14} color={COLORS.neutral.white} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {(hasPrioritySupport || hasAdvancedAnalytics) && (
          <View style={styles.badgesSection}>
            {hasPrioritySupport && (
              <View style={styles.badge}>
                <Headphones size={12} color={COLORS.primary.DEFAULT} />
                <Text style={styles.badgeText}>Support prioritaire</Text>
              </View>
            )}
            {hasAdvancedAnalytics && (
              <View style={styles.badge}>
                <BarChart3 size={12} color={COLORS.primary.DEFAULT} />
                <Text style={styles.badgeText}>Analytics</Text>
              </View>
            )}
          </View>
        )}

        {changeType === "upgrade" && amountDueCents !== undefined && (
          <View style={styles.changePreviewBanner}>
            <TrendingUp size={14} color={COLORS.primary.DEFAULT} />
            <Text style={styles.changePreviewText}>
              {amountDueCents === 0
                ? "Passage gratuit (crédit appliqué)"
                : `Aujourd'hui : ${(amountDueCents / 100).toFixed(2)} € (crédit déduit)`}
            </Text>
          </View>
        )}
        {changeType === "downgrade" && creditDays !== undefined && (
          <View
            style={[styles.changePreviewBanner, styles.changePreviewDowngrade]}
          >
            <TrendingDown size={14} color={COLORS.warning} />
            <Text
              style={[
                styles.changePreviewText,
                styles.changePreviewDowngradeText,
              ]}
            >
              {`+${creditDays} jours offerts grâce à votre crédit`}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.selectButton,
            isPopular && styles.selectButtonPopular,
            isCurrent && styles.selectButtonCurrent,
            isProcessing && styles.selectButtonProcessing,
          ]}
          onPress={() => onSelect(id)}
          activeOpacity={0.8}
          disabled={isCurrent || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={COLORS.neutral.white} />
          ) : isCurrent ? (
            <Text style={styles.selectButtonTextCurrent}>Plan actuel</Text>
          ) : (
            <>
              {changeType === "upgrade" && (
                <TrendingUp
                  size={16}
                  color={
                    isPopular ? COLORS.neutral.white : COLORS.primary.DEFAULT
                  }
                />
              )}
              {changeType === "downgrade" && (
                <TrendingDown size={16} color={COLORS.secondary[500]} />
              )}
              {!changeType && isPopular && (
                <Sparkles size={18} color={COLORS.neutral.white} />
              )}
              <Text
                style={[
                  styles.selectButtonText,
                  isPopular && styles.selectButtonTextPopular,
                ]}
              >
                {changeType === "upgrade"
                  ? "Passer à cette offre"
                  : changeType === "downgrade"
                    ? "Rétrograder"
                    : isPopular
                      ? "Commencer maintenant"
                      : "Choisir cette offre"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function PricingScreen() {
  const router = useRouter();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [previewPlanId, setPreviewPlanId] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  // Custom modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: "success" | "error" | "info";
    title: string;
    message: string;
    buttons?: { text: string; onPress?: () => void; primary?: boolean }[];
  }>({ type: "info", title: "", message: "" });

  const { payForSubscription } = usePayment();

  const { data: serverPlans = [], isLoading } = useSubscriptionPlans();
  const { data: currentSubscription } = useCurrentSubscription();
  const { data: preview, isLoading: previewLoading } =
    useSubscriptionChangePreview(previewPlanId);

  const plans = buildDisplayPlans(serverPlans);

  const showModal = (
    type: "success" | "error" | "info",
    title: string,
    message: string,
    buttons?: { text: string; onPress?: () => void; primary?: boolean }[],
  ) => {
    setModalConfig({ type, title, message, buttons });
    setModalVisible(true);
  };

  const confirmAndPay = async (serverPlanId: string) => {
    setConfirmVisible(false);
    setProcessingPlanId(serverPlanId);
    try {
      const { success } = await payForSubscription(serverPlanId);
      if (success) {
        showModal(
          "success",
          "🎉 Abonnement mis à jour !",
          preview?.isDowngrade
            ? `Votre abonnement a été rétrogradé vers "${preview.targetPlanName}". Votre crédit a été converti en ${Math.round((preview.creditCents / Math.round(preview.targetPlanPrice * 100)) * 30)} jours supplémentaires.`
            : "Votre abonnement a été activé avec succès. Bienvenue !",
          [
            {
              text: "Super !",
              primary: true,
              onPress: () => {
                setModalVisible(false);
                router.back();
              },
            },
          ],
        );
      } else {
        showModal(
          "error",
          "❌ Échec du paiement",
          "Le paiement n'a pas pu être traité. Veuillez réessayer ou contacter le support.",
          [
            {
              text: "Réessayer",
              primary: true,
              onPress: () => {
                setModalVisible(false);
                confirmAndPay(serverPlanId);
              },
            },
            {
              text: "Contacter le support",
              onPress: () => setModalVisible(false),
            },
          ],
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      showModal(
        "error",
        "⚠️ Erreur",
        `Une erreur s'est produite : ${message}`,
        [{ text: "OK", primary: true, onPress: () => setModalVisible(false) }],
      );
    } finally {
      setProcessingPlanId(null);
      setPendingPlanId(null);
      setPreviewPlanId(null);
    }
  };

  const handleSelectPlan = (serverPlanId: string) => {
    if (!currentSubscription) {
      confirmAndPay(serverPlanId);
      return;
    }
    setPendingPlanId(serverPlanId);
    setPreviewPlanId(serverPlanId);
    setConfirmVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Floating Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <X size={24} color={COLORS.neutral.white} />
          </TouchableOpacity>

          <View style={styles.heroGradient}>
            <View style={styles.heroIconContainer}>
              <Sparkles size={40} color={COLORS.neutral.white} />
            </View>
            <Text style={styles.heroTitle}>
              Développez le potentiel de vos enfants
            </Text>
            <Text style={styles.heroSubtitle}>
              Accédez à des tuteurs certifiés, des ressources exclusives et un
              suivi personnalisé
            </Text>
            <View style={styles.heroBadge}>
              <RefreshCw size={16} color={COLORS.neutral.white} />
              <Text style={styles.heroBadgeText}>Sans engagement</Text>
            </View>
          </View>
        </View>

        <View style={styles.plansContainer}>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
              <Text style={styles.loaderText}>Chargement des offres...</Text>
            </View>
          ) : (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Choisissez votre formule
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Facile à annuler à tout moment
                </Text>
              </View>
              {plans.map((plan, index) => {
                const isCurrent =
                  currentSubscription?.planId === plan.serverPlanId &&
                  currentSubscription.status === "ACTIVE";
                let changeType: "upgrade" | "downgrade" | null = null;
                if (!isCurrent && currentSubscription?.status === "ACTIVE") {
                  changeType =
                    plan.price > (currentSubscription.plan.price ?? 0)
                      ? "upgrade"
                      : "downgrade";
                }
                const creditDays =
                  changeType === "downgrade" && currentSubscription
                    ? (() => {
                        const now = new Date();
                        const exp = new Date(currentSubscription.expiresAt);
                        const start = new Date(currentSubscription.startedAt);
                        const totalDays =
                          Math.round(
                            (exp.getTime() - start.getTime()) / 86_400_000,
                          ) || 30;
                        const daysLeft = Math.ceil(
                          Math.max(0, exp.getTime() - now.getTime()) /
                            86_400_000,
                        );
                        const creditCents = Math.round(
                          (daysLeft / totalDays) *
                            Math.round(
                              (currentSubscription.plan.price ?? 0) * 100,
                            ),
                        );
                        return Math.round(
                          (creditCents / Math.round(plan.price * 100)) * 30,
                        );
                      })()
                    : undefined;
                const amountDueCents =
                  changeType === "upgrade" && currentSubscription
                    ? (() => {
                        const now = new Date();
                        const exp = new Date(currentSubscription.expiresAt);
                        const start = new Date(currentSubscription.startedAt);
                        const totalDays =
                          Math.round(
                            (exp.getTime() - start.getTime()) / 86_400_000,
                          ) || 30;
                        const daysLeft = Math.ceil(
                          Math.max(0, exp.getTime() - now.getTime()) /
                            86_400_000,
                        );
                        const creditCents = Math.round(
                          (daysLeft / totalDays) *
                            Math.round(
                              (currentSubscription.plan.price ?? 0) * 100,
                            ),
                        );
                        return Math.max(
                          0,
                          Math.round(plan.price * 100) - creditCents,
                        );
                      })()
                    : undefined;
                return (
                  <PlanCard
                    key={plan.id}
                    id={plan.serverPlanId}
                    name={plan.name}
                    price={plan.price}
                    billingPeriod={plan.billingPeriod}
                    description={plan.description}
                    features={plan.features}
                    isPopular={plan.isPopular}
                    targetAudience={plan.targetAudience}
                    hasPrioritySupport={plan.hasPrioritySupport}
                    hasAdvancedAnalytics={plan.hasAdvancedAnalytics}
                    isCurrent={isCurrent}
                    isProcessing={processingPlanId === plan.serverPlanId}
                    onSelect={handleSelectPlan}
                    delay={index * 100}
                    changeType={changeType}
                    amountDueCents={amountDueCents}
                    creditDays={creditDays}
                  />
                );
              })}
            </>
          )}
        </View>

        <Card variant="default" padding="lg" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={20} color={COLORS.info} />
            <Text style={styles.infoTitle}>Garanties</Text>
          </View>
          <View style={styles.infoItemsContainer}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <ShieldCheck size={18} color={COLORS.success} />
              </View>
              <Text style={styles.infoText}>
                <Text style={styles.infoTextBold}>Annulation flexible</Text> -
                Vous pouvez annuler à tout moment
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Clock size={18} color={COLORS.success} />
              </View>
              <Text style={styles.infoText}>
                <Text style={styles.infoTextBold}>Sans engagement</Text> - Pas
                de durée minimale
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <RefreshCw size={18} color={COLORS.success} />
              </View>
              <Text style={styles.infoText}>
                <Text style={styles.infoTextBold}>Garantie 14 jours</Text> -
                Satisfait ou remboursé
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <CreditCard size={18} color={COLORS.success} />
              </View>
              <Text style={styles.infoText}>
                <Text style={styles.infoTextBold}>Paiement sécurisé</Text> - Via
                Stripe
              </Text>
            </View>
          </View>
        </Card>

        <TouchableOpacity
          style={styles.faqButton}
          onPress={() => Alert.alert("FAQ", "La FAQ sera bientôt disponible.")}
          activeOpacity={0.7}
        >
          <Text style={styles.faqButtonText}>
            Des questions ? Consultez notre FAQ
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Change Confirmation Modal */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setConfirmVisible(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {previewLoading || !preview ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary.DEFAULT}
                style={{ marginVertical: 32 }}
              />
            ) : (
              <>
                <View
                  style={[
                    styles.modalIconContainer,
                    preview.isUpgrade
                      ? styles.modalIconSuccess
                      : styles.modalIconInfo,
                  ]}
                >
                  {preview.isUpgrade ? (
                    <TrendingUp size={32} color={COLORS.success} />
                  ) : (
                    <TrendingDown size={32} color={COLORS.primary.DEFAULT} />
                  )}
                </View>

                <Text style={styles.modalTitle}>
                  {preview.isUpgrade
                    ? "Passer à une offre supérieure"
                    : "Rétrograder votre offre"}
                </Text>

                {/* Plan transition row */}
                <View style={styles.planTransitionRow}>
                  <Text style={styles.planTransitionName}>
                    {preview.currentPlanName}
                  </Text>
                  <ArrowRight size={16} color={COLORS.secondary[400]} />
                  <Text
                    style={[
                      styles.planTransitionName,
                      styles.planTransitionTarget,
                    ]}
                  >
                    {preview.targetPlanName}
                  </Text>
                </View>

                {/* Credit/amount summary */}
                <View style={styles.prorateBox}>
                  <View style={styles.prorateRow}>
                    <Calendar size={14} color={COLORS.secondary[500]} />
                    <Text style={styles.prorateLabel}>
                      Jours restants sur votre plan actuel
                    </Text>
                    <Text style={styles.prorateValue}>
                      {preview.daysRemaining} j
                    </Text>
                  </View>
                  <View style={styles.prorateRow}>
                    <CreditCard size={14} color={COLORS.secondary[500]} />
                    <Text style={styles.prorateLabel}>Crédit disponible</Text>
                    <Text style={styles.prorateValue}>
                      {(preview.creditCents / 100).toFixed(2)} €
                    </Text>
                  </View>
                  <View style={[styles.prorateRow, styles.prorateTotal]}>
                    {preview.isUpgrade ? (
                      <>
                        <TrendingUp size={14} color={COLORS.primary.DEFAULT} />
                        <Text
                          style={[
                            styles.prorateLabel,
                            styles.prorateTotalLabel,
                          ]}
                        >
                          À payer aujourd&apos;hui
                        </Text>
                        <Text
                          style={[
                            styles.prorateValue,
                            styles.prorateTotalValue,
                          ]}
                        >
                          {(preview.amountDueCents / 100).toFixed(2)} €
                        </Text>
                      </>
                    ) : (
                      <>
                        <Calendar size={14} color={COLORS.success} />
                        <Text
                          style={[
                            styles.prorateLabel,
                            styles.prorateTotalLabel,
                          ]}
                        >
                          Jours offerts sur la nouvelle offre
                        </Text>
                        <Text
                          style={[
                            styles.prorateValue,
                            { color: COLORS.success },
                          ]}
                        >
                          +
                          {Math.round(
                            (preview.creditCents /
                              Math.round(preview.targetPlanPrice * 100)) *
                              30,
                          )}{" "}
                          j
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                {/* Gained / lost features */}
                {preview.gainedFeatures.length > 0 && (
                  <View style={styles.featureDeltaSection}>
                    <Text style={styles.featureDeltaTitle}>
                      {preview.isUpgrade ? "Vous gagnez" : "Vous conservez"}
                    </Text>
                    {preview.gainedFeatures.map((f) => (
                      <View key={f} style={styles.featureDeltaRow}>
                        <Plus size={12} color={COLORS.success} />
                        <Text
                          style={[
                            styles.featureDeltaText,
                            { color: COLORS.success },
                          ]}
                        >
                          {f}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {preview.lostFeatures.length > 0 && (
                  <View style={styles.featureDeltaSection}>
                    <Text
                      style={[
                        styles.featureDeltaTitle,
                        { color: COLORS.error.DEFAULT },
                      ]}
                    >
                      Vous perdez
                    </Text>
                    {preview.lostFeatures.map((f) => (
                      <View key={f} style={styles.featureDeltaRow}>
                        <Minus size={12} color={COLORS.error.DEFAULT} />
                        <Text
                          style={[
                            styles.featureDeltaText,
                            { color: COLORS.error.DEFAULT },
                          ]}
                        >
                          {f}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={styles.resourceRetentionNote}>
                  Les ressources que vous avez achetées restent accessibles.
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={() =>
                      pendingPlanId && confirmAndPay(pendingPlanId)
                    }
                  >
                    <Text
                      style={[
                        styles.modalButtonText,
                        styles.modalButtonTextPrimary,
                      ]}
                    >
                      {preview.isDowngrade
                        ? "Confirmer la rétrogradation"
                        : preview.amountDueCents === 0
                          ? "Confirmer (gratuit)"
                          : `Payer ${(preview.amountDueCents / 100).toFixed(2)} €`}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setConfirmVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Custom Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={[
                styles.modalIconContainer,
                modalConfig.type === "success" && styles.modalIconSuccess,
                modalConfig.type === "error" && styles.modalIconError,
                modalConfig.type === "info" && styles.modalIconInfo,
              ]}
            >
              {modalConfig.type === "success" && (
                <CheckCircle size={32} color={COLORS.success} />
              )}
              {modalConfig.type === "error" && (
                <AlertCircle size={32} color={COLORS.error.DEFAULT} />
              )}
              {modalConfig.type === "info" && (
                <Info size={32} color={COLORS.primary.DEFAULT} />
              )}
            </View>

            <Text style={styles.modalTitle}>{modalConfig.title}</Text>
            <Text style={styles.modalMessage}>{modalConfig.message}</Text>

            <View style={styles.modalButtons}>
              {modalConfig.buttons?.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.modalButton,
                    button.primary && styles.modalButtonPrimary,
                  ]}
                  onPress={button.onPress}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      button.primary && styles.modalButtonTextPrimary,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  heroSection: {
    backgroundColor: COLORS.primary.DEFAULT,
    marginHorizontal: -SPACING.lg,
    marginTop: -SPACING.lg,
    marginBottom: SPACING.lg,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: SPACING.md + SPACING.xs,
    right: SPACING.md,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroGradient: {
    backgroundColor: COLORS.primary.DEFAULT,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl + SPACING.lg,
    paddingBottom: SPACING.xl,
    alignItems: "center",
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.neutral.white,
    marginBottom: SPACING.sm,
    textAlign: "center",
    lineHeight: 34,
  },
  heroSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.neutral.white,
    opacity: 0.9,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
  },
  heroBadgeText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.neutral.white,
    fontWeight: "600",
  },
  plansContainer: {
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[500],
    textAlign: "center",
  },
  loaderContainer: {
    paddingVertical: SPACING.xxl * 2,
    alignItems: "center",
  },
  loaderText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
    marginTop: SPACING.md,
  },
  planCardContainer: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.lg,
    overflow: "visible",
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    ...SHADOWS.md,
  },
  planCardPopular: {
    borderWidth: 0,
    backgroundColor: COLORS.neutral.white,
    ...SHADOWS.xl,
    borderColor: COLORS.primary.DEFAULT,
  },
  planCardCurrent: {
    borderWidth: 2,
    borderColor: COLORS.secondary[300],
  },
  popularBadgeContainer: {
    position: "absolute",
    top: -14,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary.DEFAULT,
    paddingHorizontal: SPACING.md + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
    ...SHADOWS.md,
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  popularBadgeText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.neutral.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  currentBadgeContainer: {
    position: "absolute",
    top: -14,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  currentBadge: {
    backgroundColor: COLORS.secondary[600],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
  },
  currentBadgeText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.neutral.white,
  },
  planCardContent: {
    padding: SPACING.lg,
  },
  planHeader: {
    marginBottom: SPACING.md,
  },
  planName: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: SPACING.xs,
  },
  planNamePopular: {
    color: COLORS.primary.DEFAULT,
  },
  targetAudienceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: "flex-start",
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  targetAudienceText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
  },
  pricingSection: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  currency: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.secondary[600],
    marginTop: 6,
  },
  price: {
    fontFamily: FONTS.fredoka,
    fontSize: 52,
    fontWeight: "700",
    color: COLORS.secondary[900],
    lineHeight: 56,
    marginHorizontal: 2,
  },
  pricePopular: {
    color: COLORS.primary.DEFAULT,
  },
  period: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.secondary[500],
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  featuresSection: {
    marginBottom: SPACING.md,
  },
  badgesSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  badgeText: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.sm + 2,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
    marginTop: 1,
  },
  checkIconPopular: {
    backgroundColor: COLORS.primary.DEFAULT,
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
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.secondary[100],
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  selectButtonPopular: {
    backgroundColor: COLORS.primary.DEFAULT,
    paddingVertical: SPACING.md + 4,
    borderRadius: RADIUS.lg,
    ...SHADOWS.md,
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  selectButtonCurrent: {
    backgroundColor: COLORS.neutral[100],
  },
  selectButtonProcessing: {
    backgroundColor: COLORS.primary[400],
  },
  selectButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.secondary[800],
  },
  selectButtonTextPopular: {
    color: COLORS.neutral.white,
  },
  selectButtonTextCurrent: {
    color: COLORS.secondary[400],
  },
  changePreviewBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary[50],
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  changePreviewDowngrade: {
    backgroundColor: COLORS.warning + "15",
  },
  changePreviewText: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.primary.DEFAULT,
    fontWeight: "500",
  },
  changePreviewDowngradeText: {
    color: COLORS.warning,
  },
  planTransitionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  planTransitionName: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
    fontWeight: "600",
  },
  planTransitionTarget: {
    color: COLORS.primary.DEFAULT,
  },
  prorateBox: {
    width: "100%",
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  prorateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  prorateLabel: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  prorateValue: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.secondary[700],
  },
  prorateTotal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
    paddingTop: 8,
    marginTop: 4,
  },
  prorateTotalLabel: {
    color: COLORS.secondary[800],
    fontWeight: "600",
  },
  prorateTotalValue: {
    color: COLORS.primary.DEFAULT,
    fontSize: 15,
    fontWeight: "700",
  },
  featureDeltaSection: {
    width: "100%",
    marginBottom: 10,
  },
  featureDeltaTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary[600],
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  featureDeltaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
  },
  featureDeltaText: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
  },
  resourceRetentionNote: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[400],
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 16,
  },
  infoCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    ...SHADOWS.md,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  infoTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.secondary[900],
  },
  infoItemsContainer: {
    gap: SPACING.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    lineHeight: 22,
    paddingTop: 4,
  },
  infoTextBold: {
    fontWeight: "700",
    color: COLORS.secondary[900],
  },
  faqButton: {
    paddingVertical: SPACING.lg,
    alignItems: "center",
  },
  faqButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  debugCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.secondary[950],
  },
  debugHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  debugTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.secondary[400],
    flex: 1,
  },
  debugClear: {
    padding: SPACING.xs,
  },
  debugClearText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.error.DEFAULT,
    fontWeight: "600",
  },
  debugLogs: {
    maxHeight: 200,
  },
  debugEmpty: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
    fontStyle: "italic",
  },
  debugLogText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: COLORS.success,
    marginBottom: 4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  modalIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: COLORS.neutral[100],
  },
  modalIconSuccess: {
    backgroundColor: COLORS.success + "20",
  },
  modalIconError: {
    backgroundColor: COLORS.error.DEFAULT + "20",
  },
  modalIconInfo: {
    backgroundColor: COLORS.primary[100],
  },
  modalTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.secondary[900],
    textAlign: "center",
    marginBottom: 8,
  },
  modalMessage: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    width: "100%",
    gap: 10,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.neutral[100],
    alignItems: "center",
  },
  modalButtonPrimary: {
    backgroundColor: COLORS.primary.DEFAULT,
  },
  modalButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[700],
  },
  modalButtonTextPrimary: {
    color: COLORS.neutral.white,
  },
  modalClose: {
    marginTop: 16,
    padding: 8,
  },
});
