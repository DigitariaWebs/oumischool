import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeBack } from "@/hooks/useSafeBack";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
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
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

const { width } = Dimensions.get("window");

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
}) => (
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
    <subject.Icon size={20} color={isSelected ? subject.color : COLORS.secondary[600]} />
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

interface ResourceCardProps {
  resource: Resource;
  delay: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <TouchableOpacity style={styles.resourceCard} activeOpacity={0.7}>
      <View style={[styles.resourceIconContainer, { backgroundColor: resource.color + "15" }]}>
        <View style={[styles.resourceIcon, { backgroundColor: resource.color + "30" }]}>
          <FileText size={24} color={resource.color} />
        </View>
      </View>

      <View style={styles.resourceContent}>
        <View style={styles.resourceHeader}>
          <View style={styles.resourceBadges}>
            <View style={[styles.typeBadge, { backgroundColor: resource.color + "15" }]}>
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
            <View style={styles.statItem}>
              <Download size={14} color={COLORS.secondary[500]} />
              <Text style={styles.statText}>{resource.downloads}</Text>
            </View>
            <Text style={styles.pagesText}>{resource.pages} pages</Text>
          </View>

          <View style={styles.resourceActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Eye size={18} color={COLORS.primary.DEFAULT} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.downloadButton]}>
              <Download size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </Animated.View>
);

export default function ResourcesScreen() {
  const router = useRouter();
  const handleBack = useSafeBack();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter((resource) => {
    const matchesSubject =
      selectedSubject === "all" ||
      resource.subject.toLowerCase().includes(selectedSubject);
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <ArrowLeft size={24} color={COLORS.secondary[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ressources</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color={COLORS.secondary[900]} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(600)}
        style={styles.searchContainer}
      >
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une ressource..."
            placeholderTextColor={COLORS.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Subject Filters */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
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
          <Text style={styles.sectionTitle}>
            {filteredResources.length} ressources disponibles
          </Text>
          {filteredResources.map((resource, index) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              delay={400 + index * 100}
            />
          ))}
        </View>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <Animated.View
            entering={FadeInDown.delay(500).duration(600)}
            style={styles.emptyState}
          >
            <View style={styles.emptyStateIcon}>
              <BookOpen size={48} color={COLORS.secondary[400]} />
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.secondary[900],
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  // Search
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[900],
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  // Subjects
  subjectsContainer: {
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 24,
  },
  subjectChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    gap: 6,
  },
  subjectChipText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[700],
    fontWeight: "500",
  },
  // Resources
  resourcesSection: {
    paddingHorizontal: 24,
  },
  resourceCard: {
    flexDirection: "row",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  resourceIconContainer: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  resourceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  resourceContent: {
    flex: 1,
    padding: 16,
  },
  resourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resourceBadges: {
    flexDirection: "row",
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    fontWeight: "700",
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.neutral[100],
  },
  levelBadgeText: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.secondary[700],
  },
  resourceTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  resourceSubject: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
    marginBottom: 12,
  },
  resourceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resourceStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[600],
    fontWeight: "600",
  },
  pagesText: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: COLORS.secondary[500],
  },
  resourceActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
  },
  downloadButton: {
    backgroundColor: COLORS.primary.DEFAULT,
  },
  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[500],
    textAlign: "center",
    lineHeight: 20,
  },
});
