import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BookOpen,
  FileText,
  BrainCircuit,
  Plus,
  Calendar,
  Sparkles,
  ChevronRight,
  Bell,
  Baby,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector } from "@/store/hooks";
import NotificationDrawer from "@/components/NotificationDrawer";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // 2 cards per row with proper spacing

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
  delay: number;
}

const QuickActionCard: React.FC<QuickActionProps> = ({
  icon,
  title,
  subtitle,
  color,
  onPress,
  delay,
}) => (
  <TouchableOpacity
    style={styles.quickActionCard}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
      {icon}
    </View>
    <View style={styles.quickActionTextContainer}>
      <Text style={styles.quickActionTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color,
  delay,
}) => (
  <Animated.View
    entering={FadeInDown.delay(delay).duration(600)}
    style={styles.featureCard}
  >
    <View style={[styles.featureIcon, { backgroundColor: color }]}>{icon}</View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </Animated.View>
);

interface ChildCardProps {
  id: string;
  name: string;
  grade: string;
  progress: number;
  color: string;
  delay: number;
  onPress: () => void;
}

const ChildCard: React.FC<ChildCardProps> = ({
  id,
  name,
  grade,
  progress,
  color,
  delay,
  onPress,
}) => (
  <Animated.View
    entering={FadeInRight.delay(delay).duration(600)}
    style={styles.childCard}
  >
    <TouchableOpacity
      style={styles.childCardContent}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.childAvatar, { backgroundColor: color + "40" }]}>
        <Text style={[styles.childAvatarText, { color: color }]}>
          {name.charAt(0)}
        </Text>
      </View>
      <View style={styles.childInfo}>
        <Text style={styles.childName}>{name}</Text>
        <Text style={styles.childGrade}>{grade}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: color },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>
      <ChevronRight size={20} color={COLORS.neutral[400]} />
    </TouchableOpacity>
  </Animated.View>
);

export default function HomeScreen() {
  const router = useRouter();
  const [notificationDrawerVisible, setNotificationDrawerVisible] =
    useState(false);

  // Get data from Redux store
  const user = useAppSelector((state) => state.auth.user);
  const children = useAppSelector((state) => state.children.children);

  const userName = user?.name || "Utilisateur";

  const quickActions = [
    {
      icon: <Plus size={24} color="white" />,
      title: "Ajouter un enfant",
      subtitle: "Nouveau profil",
      color: COLORS.primary.DEFAULT,
      onPress: () => router.push("/children-tab"),
    },
    {
      icon: <Calendar size={24} color="white" />,
      title: "Plan hebdo",
      subtitle: "Organiser",
      color: "#3B82F6",
      onPress: () => router.push("/weekly-plan"),
    },
    {
      icon: <Sparkles size={24} color="white" />,
      title: "Coach IA",
      subtitle: "Assistance",
      color: "#8B5CF6",
      onPress: () => router.push("/ai-coach"),
    },
    {
      icon: <FileText size={24} color="white" />,
      title: "Ressources",
      subtitle: "Explorer",
      color: "#EAB308",
      onPress: () => router.push("/resources"),
    },
  ];

  const features = [
    {
      icon: <BookOpen size={28} color={COLORS.primary.DEFAULT} />,
      title: "Programme structuré",
      description: "Curriculum clair avec plan hebdomadaire facile à suivre",
      color: COLORS.primary[50],
    },
    {
      icon: <FileText size={28} color="#3B82F6" />,
      title: "Ressources & PDF",
      description: "Leçons, quiz et exercices imprimables",
      color: "#DBEAFE",
    },
    {
      icon: <BrainCircuit size={28} color="#8B5CF6" />,
      title: "IA éducative",
      description: "Coach qui explique, adapte et recommande",
      color: "#EDE9FE",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary.DEFAULT}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Gradient */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.headerContainer}
        >
          <LinearGradient
            colors={[COLORS.primary.DEFAULT, COLORS.primary[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Bonjour,</Text>
                <Text style={styles.userName}>{userName}</Text>
              </View>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => setNotificationDrawerVisible(true)}
              >
                <View style={styles.notificationDot} />
                <Bell size={24} color={COLORS.neutral.white} />
              </TouchableOpacity>
            </View>

            {/* Stats Summary */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{children.length}</Text>
                <Text style={styles.statLabel}>Enfants</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Leçons</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>68%</Text>
                <Text style={styles.statLabel}>Progrès</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Children Section */}
        <View style={styles.section}>
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionTitle}>Mes enfants</Text>
            <TouchableOpacity onPress={() => router.push("/children-tab")}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </Animated.View>

          {children.length > 0 ? (
            children.map((child, index) => (
              <ChildCard
                key={child.id}
                id={child.id}
                name={child.name}
                grade={child.grade}
                progress={child.progress}
                color={child.color}
                delay={500 + index * 100}
                onPress={() => router.push(`/child-details?id=${child.id}`)}
              />
            ))
          ) : (
            <Animated.View
              entering={FadeInDown.delay(500).duration(600)}
              style={styles.emptyChildrenState}
            >
              <View style={styles.emptyStateIcon}>
                <Baby size={48} color={COLORS.primary.DEFAULT} />
              </View>
              <Text style={styles.emptyStateTitle}>Aucun enfant ajouté</Text>
              <Text style={styles.emptyStateText}>
                Commencez par ajouter le profil de votre premier enfant
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => router.push("/children-tab")}
              >
                <Plus size={20} color="white" />
                <Text style={styles.emptyStateButtonText}>
                  Ajouter un enfant
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Animated.Text
            entering={FadeInDown.delay(700).duration(600)}
            style={styles.sectionTitle}
          >
            Actions rapides
          </Animated.Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(800 + index * 100).duration(600)}
                style={styles.quickActionWrapper}
              >
                <QuickActionCard {...action} delay={0} />
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Animated.Text
            entering={FadeInDown.delay(1200).duration(600)}
            style={styles.sectionTitle}
          >
            Tout pour réussir
          </Animated.Text>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={1300 + index * 100} />
          ))}
        </View>

        {/* CTA Banner */}
        <Animated.View
          entering={FadeInDown.delay(1600).duration(600)}
          style={styles.ctaBanner}
        >
          <LinearGradient
            colors={["#8B5CF6", "#6366F1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Découvrez le Coach IA</Text>
              <Text style={styles.ctaDescription}>
                Obtenez des conseils personnalisés pour votre enfant
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push("/ai-coach")}
            >
              <Text style={styles.ctaButtonText}>Essayer</Text>
              <ChevronRight size={18} color="#8B5CF6" />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </ScrollView>

      <NotificationDrawer
        visible={notificationDrawerVisible}
        onClose={() => setNotificationDrawerVisible(false)}
      />
    </SafeAreaView>
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
  // Header
  headerContainer: {
    marginBottom: 24,
  },
  headerGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.neutral[100],
    opacity: 0.9,
  },
  userName: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    color: COLORS.neutral.white,
    marginTop: 4,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "white",
  },
  notificationIcon: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.neutral.white,
    fontWeight: "700",
  },
  statLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.neutral[100],
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  // Section
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
    fontSize: 22,
    color: COLORS.secondary[900],
    marginBottom: 16,
  },
  seeAllText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
  },
  // Child Card
  childCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  childCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  childAvatarText: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    fontWeight: "700",
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  childGrade: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[600],
    fontWeight: "600",
  },
  // Quick Actions
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  quickActionWrapper: {
    width: CARD_WIDTH,
  },
  quickActionCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 20,
    padding: 16,
    minHeight: 140,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  quickActionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.secondary[900],
    marginBottom: 4,
    lineHeight: 20,
  },
  quickActionSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
  },
  // Feature Card
  featureCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    marginBottom: 8,
  },
  featureDescription: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    lineHeight: 20,
  },
  // CTA Banner
  ctaBanner: {
    marginHorizontal: 24,
    marginBottom: 8,
  },
  ctaGradient: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaContent: {
    flex: 1,
    marginRight: 12,
  },
  ctaTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.neutral.white,
    marginBottom: 4,
  },
  ctaDescription: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.neutral[100],
    opacity: 0.9,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  ctaButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    fontWeight: "700",
    color: "#8B5CF6",
  },
  // Empty State
  emptyChildrenState: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary.DEFAULT,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  emptyStateButtonText: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.neutral.white,
  },
});
