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
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  FileText,
  Download,
  Eye,
  Star,
  BookOpen,
  Calculator,
  FlaskConical,
  Languages,
  TrendingUp,
  Filter,
} from "lucide-react-native";

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

export default function ResourcesTab() {
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

  const totalDownloads = resources.reduce((acc, r) => acc + r.downloads, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>RESSOURCES</Text>
          <Text style={styles.headerTitle}>Bibliothèque</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Carte statistiques simple */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statsLabel}>Ressources</Text>
              <Text style={styles.statsValue}>{resources.length}</Text>
            </View>
            <View style={styles.statsDivider} />
            <View>
              <Text style={styles.statsLabel}>Téléchargements</Text>
              <Text style={styles.statsValue}>{totalDownloads}</Text>
            </View>
          </View>
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

        {/* Filtres par matière - scroll horizontal */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Matières</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectsContainer}
          >
            {subjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.subjectChip,
                  selectedSubject === subject.id && {
                    backgroundColor: subject.color + "15",
                    borderColor: subject.color,
                  },
                ]}
                onPress={() => setSelectedSubject(subject.id)}
              >
                <View style={[styles.subjectIcon, { backgroundColor: subject.color + "15" }]}>
                  <subject.Icon size={14} color={subject.color} />
                </View>
                <Text
                  style={[
                    styles.subjectText,
                    selectedSubject === subject.id && { color: subject.color, fontWeight: "600" },
                  ]}
                >
                  {subject.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Liste des ressources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>
            {filteredResources.length} ressource{filteredResources.length > 1 ? "s" : ""}
          </Text>

          {filteredResources.map((resource) => (
            <Pressable
              key={resource.id}
              style={({ pressed }) => [styles.resourceCard, pressed && { opacity: 0.9 }]}
            >
              {/* En-tête avec type et niveau */}
              <View style={styles.resourceHeader}>
                <View style={[styles.typeBadge, { backgroundColor: resource.color + "15" }]}>
                  <Text style={[styles.typeBadgeText, { color: resource.color }]}>
                    {resource.type}
                  </Text>
                </View>
                <Text style={styles.levelBadge}>{resource.level}</Text>
              </View>

              {/* Titre et matière */}
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceSubject}>{resource.subject}</Text>

              {/* Statistiques et actions */}
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
          <Text style={styles.sourceButtonText}>+ Ajouter une ressource</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 12,
    color: "#6366F1",
    letterSpacing: 1.2,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "#1E293B",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    paddingBottom: 100,
  },

  // Stats Card
  statsCard: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statsLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 4,
    textAlign: "center",
  },
  statsValue: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: "#1E293B",
    textAlign: "center",
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#F1F5F9",
  },

  // Search
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
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

  // Filters
  filtersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  subjectsContainer: {
    paddingHorizontal: 24,
    gap: 10,
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
    gap: 8,
  },
  subjectIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  subjectText: {
    fontSize: 14,
    color: "#64748B",
  },

  // Resources
  resourcesSection: {
    paddingHorizontal: 24,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  levelBadge: {
    fontSize: 11,
    color: "#64748B",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
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
    gap: 10,
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
    width: 36,
    height: 36,
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
    paddingVertical: 48,
    paddingHorizontal: 24,
    marginHorizontal: 24,
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
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
    backgroundColor: "#F1F5F9",
    marginHorizontal: 24,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
});