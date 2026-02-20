import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Star,
  BookOpen,
  Calculator,
  FlaskConical,
  Languages,
  TrendingUp,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { BlobBackground, HeroCard, AnimatedSection } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";

interface Subject {
  id: string;
  name: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
}

interface Resource {
  id: number;
  title: string;
  subject: string;
  type: "PDF" | "Quiz" | "Exercice";
  level: string;
  pages: number;
  downloads: number;
  rating: number;
  color: string;
}

const subjects: Subject[] = [
  { id: "all", name: "Tout", Icon: BookOpen, color: COLORS.secondary[600] },
  { id: "math", name: "Maths", Icon: Calculator, color: "#3B82F6" },
  { id: "french", name: "Français", Icon: FileText, color: "#EF4444" },
  { id: "science", name: "Sciences", Icon: FlaskConical, color: "#10B981" },
  { id: "english", name: "Anglais", Icon: Languages, color: "#6366F1" },
  { id: "history", name: "Histoire", Icon: BookOpen, color: "#F59E0B" },
];

const resources: Resource[] = [
  {
    id: 1,
    title: "Les fractions - Niveau CE2",
    subject: "Mathématiques",
    type: "PDF",
    level: "CE2",
    pages: 8,
    downloads: 1250,
    rating: 4.8,
    color: "#3B82F6",
  },
  {
    id: 2,
    title: "Conjugaison du passé composé",
    subject: "Français",
    type: "Exercice",
    level: "CE2",
    pages: 5,
    downloads: 980,
    rating: 4.6,
    color: "#EF4444",
  },
  {
    id: 3,
    title: "Le cycle de l'eau",
    subject: "Sciences",
    type: "PDF",
    level: "CM1",
    pages: 12,
    downloads: 1520,
    rating: 4.9,
    color: "#10B981",
  },
  {
    id: 4,
    title: "Vocabulaire: Les couleurs",
    subject: "Anglais",
    type: "Quiz",
    level: "CP",
    pages: 3,
    downloads: 750,
    rating: 4.5,
    color: "#6366F1",
  },
  {
    id: 5,
    title: "La Révolution française",
    subject: "Histoire",
    type: "PDF",
    level: "CM2",
    pages: 15,
    downloads: 890,
    rating: 4.7,
    color: "#F59E0B",
  },
];

interface SubjectChipProps {
  subject: Subject;
  isSelected: boolean;
  onPress: () => void;
}

const SubjectChip: React.FC<SubjectChipProps> = ({
  subject,
  isSelected,
  onPress,
}) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <TouchableOpacity
      style={[
        styles.subjectChip,
        isSelected && {
          backgroundColor: subject.color + "20",
          borderColor: subject.color,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.subjectChipIcon,
          { backgroundColor: isSelected ? subject.color : colors.input },
        ]}
      >
        <subject.Icon size={16} color={isSelected ? "#FFF" : colors.icon} />
      </View>
      <Text
        style={[
          styles.subjectChipText,
          isSelected && { color: subject.color, fontWeight: "700" },
        ]}
      >
        {subject.name}
      </Text>
    </TouchableOpacity>
  );
};

interface ResourceCardProps {
  resource: Resource;
  delay: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, delay }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()}>
      <TouchableOpacity style={styles.resourceCard} activeOpacity={0.7}>
        {/* Decorative gradient accent */}
        <View
          style={[styles.resourceAccent, { backgroundColor: resource.color }]}
        />

        <View style={styles.resourceInner}>
          <View style={styles.resourceHeader}>
            <View
              style={[
                styles.resourceIconContainer,
                { backgroundColor: resource.color + "15" },
              ]}
            >
              <FileText size={22} color={resource.color} />
            </View>
            <View style={styles.resourceBadges}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: resource.color + "15" },
                ]}
              >
                <Text style={[styles.typeBadgeText, { color: resource.color }]}>
                  {resource.type}
                </Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{resource.level}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.resourceTitle} numberOfLines={2}>
            {resource.title}
          </Text>
          <Text style={styles.resourceSubject}>{resource.subject}</Text>

          <View style={styles.resourceFooter}>
            <View style={styles.resourceStats}>
              <View style={styles.statItem}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.statText}>{resource.rating}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Download size={14} color={colors.icon} />
                <Text style={styles.statText}>{resource.downloads}</Text>
              </View>
              <View style={styles.statDivider} />
              <Text style={styles.pagesText}>{resource.pages} pages</Text>
            </View>

            <View style={styles.resourceActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Eye size={18} color={COLORS.primary.DEFAULT} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.downloadButton]}
              >
                <LinearGradient
                  colors={[resource.color, resource.color + "CC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.downloadButtonGradient}
                >
                  <Download size={16} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ResourcesTab() {
  const { colors, isDark } = useTheme();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const filteredResources = resources.filter((resource) => {
    const matchesSubject =
      selectedSubject === "all" ||
      resource.subject.toLowerCase().includes(selectedSubject);
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const totalDownloads = resources.reduce((acc, r) => acc + r.downloads, 0);

  return (
    <SafeAreaView style={styles.container}>
      <BlobBackground />

      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600).springify()}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={styles.headerIconContainer}>
            <BookOpen size={20} color={COLORS.neutral.white} />
          </View>
          <Text style={styles.headerTitle}>Ressources</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Stats Card */}
        <AnimatedSection delay={150} style={styles.heroCardWrapper}>
          <HeroCard
            title="Bibliothèque"
            value={`${resources.length} ressources`}
            badge={{
              icon: <TrendingUp size={14} color="#FCD34D" />,
              text: `${totalDownloads.toLocaleString()} téléchargements`,
            }}
          />
        </AnimatedSection>

        {/* Search Bar */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={styles.searchContainer}
        >
          <View style={styles.searchBar}>
            <Search size={20} color={colors.inputPlaceholder} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une ressource..."
              placeholderTextColor={colors.inputPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animated.View>

        {/* Subject Filters */}
        <Animated.View
          entering={FadeInDown.delay(250).duration(600).springify()}
        >
          <Text style={styles.sectionTitle}>Matières</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectsContainer}
          >
            {subjects.map((subject) => (
              <SubjectChip
                key={subject.id}
                subject={subject}
                isSelected={selectedSubject === subject.id}
                onPress={() => setSelectedSubject(subject.id)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Resources Grid */}
        <View style={styles.resourcesSection}>
          <View style={styles.resourcesHeader}>
            <Text style={styles.sectionTitle}>
              {filteredResources.length} ressources disponibles
            </Text>
          </View>
          {filteredResources.map((resource, index) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              delay={300 + index * 80}
            />
          ))}
        </View>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <Animated.View
            entering={FadeInUp.delay(400).duration(600).springify()}
            style={styles.emptyState}
          >
            <View style={styles.emptyStateIcon}>
              <BookOpen size={48} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyStateTitle}>Aucune ressource trouvée</Text>
            <Text style={styles.emptyStateText}>
              Essayez de modifier vos filtres ou votre recherche
            </Text>
          </Animated.View>
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
    heroCardWrapper: {
      marginHorizontal: 20,
      marginBottom: 20,
    },
    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
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
    filterButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    // Hero Card

    // Search
    searchContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    searchInput: {
      flex: 1,
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: colors.textPrimary,
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 12,
      paddingHorizontal: 20,
    },
    // Subjects
    subjectsContainer: {
      paddingHorizontal: 20,
      gap: 10,
      marginBottom: 24,
    },
    subjectChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 14,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.border,
      gap: 8,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    subjectChipIcon: {
      width: 28,
      height: 28,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    subjectChipText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    // Resources
    resourcesSection: {
      paddingHorizontal: 20,
    },
    resourcesHeader: {
      marginBottom: 4,
    },
    resourceCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      marginBottom: 16,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
      overflow: "hidden",
    },
    resourceAccent: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    },
    resourceInner: {
      padding: 16,
      paddingLeft: 20,
    },
    resourceIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    resourceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    resourceBadges: {
      flexDirection: "row",
      gap: 8,
    },
    typeBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
    },
    typeBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      fontWeight: "700",
    },
    levelBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
    },
    levelBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 11,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    resourceTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 17,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    resourceSubject: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 14,
    },
    resourceFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    resourceStats: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    statDivider: {
      width: 1,
      height: 12,
      backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
    },
    statText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    pagesText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textSecondary,
    },
    resourceActions: {
      flexDirection: "row",
      gap: 10,
    },
    actionButton: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: colors.input,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    downloadButton: {
      backgroundColor: "transparent",
      padding: 0,
    },
    downloadButtonGradient: {
      width: 38,
      height: 38,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    // Empty State
    emptyState: {
      alignItems: "center",
      paddingVertical: 48,
      paddingHorizontal: 32,
      backgroundColor: colors.card,
      marginHorizontal: 20,
      borderRadius: 24,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    emptyStateIcon: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: colors.input,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    emptyStateTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: colors.textPrimary,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyStateText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });
