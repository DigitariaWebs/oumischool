import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
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
  Sparkles,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

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
  { id: "all", name: "Tout", Icon: BookOpen, color: "#64748B" },
  { id: "math", name: "Maths", Icon: Calculator, color: "#3B82F6" },
  { id: "french", name: "Français", Icon: FileText, color: "#EF4444" },
  { id: "science", name: "Sciences", Icon: FlaskConical, color: "#10B981" },
  { id: "english", name: "Anglais", Icon: Languages, color: "#6366F1" },
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
];

const SubjectChip: React.FC<{
  subject: Subject;
  isSelected: boolean;
  onPress: () => void;
}> = ({ subject, isSelected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.subjectChip,
      isSelected && {
        backgroundColor: subject.color + "15",
        borderColor: subject.color,
      },
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <subject.Icon
      size={16}
      color={isSelected ? subject.color : "#64748B"}
    />
    <Text
      style={[
        styles.subjectChipText,
        isSelected && { color: subject.color, fontWeight: "600" },
      ]}
    >
      {subject.name}
    </Text>
  </TouchableOpacity>
);

const ResourceCard: React.FC<{ resource: Resource; delay: number }> = ({ resource, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <Pressable style={styles.resourceCard} activeOpacity={0.7}>
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
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.statText}>{resource.rating}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Download size={12} color="#64748B" />
            <Text style={styles.statText}>{resource.downloads}</Text>
          </View>
          <View style={styles.statDivider} />
          <Text style={styles.pagesText}>{resource.pages}p</Text>
        </View>

        <View style={styles.resourceActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Eye size={16} color="#6366F1" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.downloadButton]}>
            <Download size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  </Animated.View>
);

export default function ResourcesScreen() {
  const router = useRouter();
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
      {/* Header simple */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ressources</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une ressource..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filtres matières */}
        <View style={styles.filtersSection}>
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
        </View>

        {/* Liste des ressources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>
            {filteredResources.length} ressource{filteredResources.length > 1 ? "s" : ""}
          </Text>
          {filteredResources.map((resource, index) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              delay={200 + index * 50}
            />
          ))}
        </View>

        {/* État vide */}
        {filteredResources.length === 0 && (
          <View style={styles.emptyState}>
            <BookOpen size={48} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>Aucune ressource</Text>
            <Text style={styles.emptyStateText}>
              Modifiez vos filtres ou votre recherche
            </Text>
          </View>
        )}

        {/* Bouton Add source */}
        <TouchableOpacity style={styles.sourceButton}>
          <Sparkles size={18} color="#64748B" />
          <Text style={styles.sourceButtonText}>Proposer une ressource</Text>
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 22,
    color: "#1E293B",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  // Search
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  // Filters
  filtersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  subjectsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  subjectChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 6,
  },
  subjectChipText: {
    fontSize: 13,
    color: "#64748B",
  },

  // Resources
  resourcesSection: {
    paddingHorizontal: 20,
  },
  resourceCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  resourceHeader: {
    marginBottom: 10,
  },
  resourceBadges: {
    flexDirection: "row",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  levelBadgeText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  resourceTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 4,
  },
  resourceSubject: {
    fontSize: 13,
    color: "#64748B",
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
    gap: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#F1F5F9",
  },
  pagesText: {
    fontSize: 12,
    color: "#64748B",
  },
  resourceActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  downloadButton: {
    backgroundColor: "#6366F1",
    borderWidth: 0,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },

  // Source Button
  sourceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
});