import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Image,
  Linking,
  Alert,
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
  Lock,
  Unlock,
  User,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { FONTS } from "@/config/fonts";
import {
  resolveResourceUrl,
  useResources,
  useTrackResourceDownload,
} from "@/hooks/api/resources";

interface Subject {
  id: string;
  name: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
}

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: "PDF" | "Quiz" | "Exercice" | "Image" | "Vidéo" | "Audio";
  level: string;
  pages: number;
  downloads: number;
  rating: number;
  color: string;
  url: string;
}

const subjects: Subject[] = [
  { id: "all", name: "Tout", Icon: BookOpen, color: "#64748B" },
  { id: "math", name: "Maths", Icon: Calculator, color: "#3B82F6" },
  { id: "french", name: "Français", Icon: FileText, color: "#EF4444" },
  { id: "science", name: "Sciences", Icon: FlaskConical, color: "#10B981" },
  { id: "english", name: "Anglais", Icon: Languages, color: "#6366F1" },
];

function normalizeSubjectKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesSubjectFilter(
  subjectName: string,
  selectedSubject: string,
): boolean {
  if (selectedSubject === "all") return true;
  const normalizedName = normalizeSubjectKey(subjectName);
  const aliases: Record<string, string[]> = {
    math: ["math", "mathematique", "mathematiques", "maths"],
    french: ["francais", "francais", "fr"],
    science: ["science", "sciences"],
    english: ["anglais", "english"],
  };
  const candidates = aliases[selectedSubject] ?? [selectedSubject];
  return candidates.some((candidate) => normalizedName.includes(candidate));
}

// ── Composants inchangés ──
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
    <subject.Icon size={16} color={isSelected ? subject.color : "#64748B"} />
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

const ResourceCard: React.FC<{
  resource: Resource;
  delay: number;
  onOpen: (resource: Resource) => void;
  onDownload: (resource: Resource) => void;
}> = ({ resource, delay, onOpen, onDownload }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <Pressable style={styles.resourceCard} activeOpacity={0.7}>
      <View style={styles.resourceHeader}>
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
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onOpen(resource)}
          >
            <Eye size={16} color="#6366F1" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton]}
            onPress={() => onDownload(resource)}
          >
            <Download size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  </Animated.View>
);

export default function ResourcesScreen() {
  const router = useRouter();
  const { data: resourcesData = [] } = useResources();
  const trackDownloadMutation = useTrackResourceDownload();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tuteurs" | "general">("tuteurs");

  const tutorResources = useMemo(() => {
    return resourcesData
      .map((resource) => {
        const url = resolveResourceUrl(resource.fileUrl);
        const email = resource.uploader?.email ?? "Tuteur";
        const fileSize = Number(resource.fileSize ?? "");
        const size =
          Number.isFinite(fileSize) && fileSize > 0
            ? fileSize >= 1024 * 1024
              ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
              : `${Math.max(1, Math.round(fileSize / 1024))} KB`
            : "—";
        return {
          id: resource.id,
          title: resource.title,
          subject: resource.subject,
          type:
            resource.type === "video"
              ? ("Vidéo" as const)
              : resource.type === "audio"
                ? ("Audio" as const)
                : resource.type === "image"
                  ? ("Image" as const)
                  : ("PDF" as const),
          level: "Tous niveaux",
          tutorName: email.split("@")[0] || "Tuteur",
          tutorAvatar:
            "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
          childName: "Élève",
          date: new Date(resource.createdAt).toLocaleDateString("fr-FR"),
          size,
          isPaid: resource.tags.includes("paid"),
          color: "#6366F1",
          url,
          downloads: resource.downloads,
        };
      })
      .filter((resource) => Boolean(resource.url));
  }, [resourcesData]);

  const filteredTutorResources = tutorResources.filter((r) => {
    const matchesSearch =
      searchQuery === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = matchesSubjectFilter(r.subject, selectedSubject);
    return matchesSearch && matchesSubject;
  });

  const libraryResources = useMemo<Resource[]>(
    () =>
      resourcesData
        .map((resource) => {
          const url = resolveResourceUrl(resource.fileUrl);
          if (!url) return null;
          const type =
            resource.type === "video"
              ? ("Vidéo" as const)
              : resource.type === "audio"
                ? ("Audio" as const)
                : resource.type === "image"
                  ? ("Image" as const)
                  : ("PDF" as const);
          return {
            id: resource.id,
            title: resource.title,
            subject: resource.subject,
            type,
            level: "Tous niveaux",
            pages: 1,
            downloads: resource.downloads,
            rating: 5,
            color:
              resource.type === "video"
                ? "#F59E0B"
                : resource.type === "image"
                  ? "#8B5CF6"
                  : resource.type === "audio"
                    ? "#10B981"
                    : "#6366F1",
            url,
          };
        })
        .filter((resource): resource is Resource => Boolean(resource)),
    [resourcesData],
  );

  const filteredResources = libraryResources.filter((r) => {
    const matchesSubject = matchesSubjectFilter(r.subject, selectedSubject);
    const matchesSearch =
      searchQuery === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  const handleOpen = (url: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert("Erreur", "Impossible d'ouvrir le fichier."),
    );
  };

  const handleDownload = async (id: string, url: string) => {
    try {
      await trackDownloadMutation.mutateAsync(id);
    } catch {
      // non-blocking analytics
    }
    handleOpen(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header — inchangé */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ressources</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Search — inchangé */}
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

      {/* ── TABS ── */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "tuteurs" && styles.tabActive]}
          onPress={() => setActiveTab("tuteurs")}
        >
          <User
            size={14}
            color={activeTab === "tuteurs" ? "#6366F1" : "#94A3B8"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "tuteurs" && styles.tabTextActive,
            ]}
          >
            De mes tuteurs
          </Text>
          <View
            style={[
              styles.tabBadge,
              activeTab === "tuteurs" && styles.tabBadgeActive,
            ]}
          >
            <Text style={styles.tabBadgeText}>{tutorResources.length}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "general" && styles.tabActive]}
          onPress={() => setActiveTab("general")}
        >
          <BookOpen
            size={14}
            color={activeTab === "general" ? "#6366F1" : "#94A3B8"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "general" && styles.tabTextActive,
            ]}
          >
            Bibliothèque
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filtres matières — inchangés */}
        <View style={styles.filtersSection}>
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

        {/* ══ ONGLET TUTEURS ══ */}
        {activeTab === "tuteurs" && (
          <View style={styles.resourcesSection}>
            <Text style={styles.sectionTitle}>
              {filteredTutorResources.length} ressource
              {filteredTutorResources.length > 1 ? "s" : ""} partagée
              {filteredTutorResources.length > 1 ? "s" : ""}
            </Text>

            {filteredTutorResources.length === 0 && (
              <View style={styles.emptyState}>
                <BookOpen size={48} color="#CBD5E1" />
                <Text style={styles.emptyStateTitle}>Aucune ressource</Text>
                <Text style={styles.emptyStateText}>
                  Vos tuteurs n&apos;ont pas encore partagé de ressources
                </Text>
              </View>
            )}

            {filteredTutorResources.map((resource, index) => (
              <Animated.View
                key={resource.id}
                entering={FadeInDown.delay(index * 60).duration(350)}
              >
                <View
                  style={[
                    styles.tutorCard,
                    { borderLeftColor: resource.color },
                  ]}
                >
                  <View style={styles.tutorCardTop}>
                    <Image
                      source={{ uri: resource.tutorAvatar }}
                      style={styles.tutorAvatar}
                    />
                    <View style={styles.tutorCardMeta}>
                      <Text style={styles.tutorName}>{resource.tutorName}</Text>
                      <Text style={styles.tutorCardDate}>
                        Pour {resource.childName} · {resource.date}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.paidBadge,
                        {
                          backgroundColor: resource.isPaid
                            ? "#EEF2FF"
                            : "#F0FDF4",
                        },
                      ]}
                    >
                      {resource.isPaid ? (
                        <Lock size={10} color="#6366F1" />
                      ) : (
                        <Unlock size={10} color="#10B981" />
                      )}
                      <Text
                        style={[
                          styles.paidBadgeText,
                          { color: resource.isPaid ? "#6366F1" : "#10B981" },
                        ]}
                      >
                        {resource.isPaid ? "Payant" : "Gratuit"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.tutorCardTitle}>{resource.title}</Text>

                  <View style={styles.tutorCardBadges}>
                    <View
                      style={[
                        styles.typeBadge,
                        { backgroundColor: resource.color + "15" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeBadgeText,
                          { color: resource.color },
                        ]}
                      >
                        {resource.type}
                      </Text>
                    </View>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelBadgeText}>
                        {resource.level}
                      </Text>
                    </View>
                    <Text style={styles.sizeText}>{resource.size}</Text>
                  </View>

                  <View style={styles.tutorCardActions}>
                    <TouchableOpacity
                      style={styles.openBtn}
                      onPress={() => handleOpen(resource.url)}
                    >
                      <Eye size={15} color="#6366F1" />
                      <Text style={styles.openBtnText}>Ouvrir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.downloadBtn}
                      onPress={() => handleDownload(resource.id, resource.url)}
                    >
                      <Download size={15} color="white" />
                      <Text style={styles.downloadBtnText}>Télécharger</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        {/* ══ ONGLET BIBLIOTHÈQUE — code original inchangé ══ */}
        {activeTab === "general" && (
          <View style={styles.resourcesSection}>
            <Text style={styles.sectionTitle}>
              {filteredResources.length} ressource
              {filteredResources.length > 1 ? "s" : ""}
            </Text>
            {filteredResources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                delay={200 + index * 50}
                onOpen={(item) => handleOpen(item.url)}
                onDownload={(item) => handleDownload(item.id, item.url)}
              />
            ))}
            {filteredResources.length === 0 && (
              <View style={styles.emptyState}>
                <BookOpen size={48} color="#CBD5E1" />
                <Text style={styles.emptyStateTitle}>Aucune ressource</Text>
                <Text style={styles.emptyStateText}>
                  Modifiez vos filtres ou votre recherche
                </Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.sourceButton}>
          <Sparkles size={18} color="#64748B" />
          <Text style={styles.sourceButtonText}>Proposer une ressource</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

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
  headerTitle: { fontFamily: FONTS.fredoka, fontSize: 22, color: "#1E293B" },
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

  searchContainer: { paddingHorizontal: 20, marginBottom: 14 },
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
  searchInput: { flex: 1, fontSize: 15, color: "#1E293B" },

  // Tabs
  tabs: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: "600", color: "#94A3B8" },
  tabTextActive: { color: "#6366F1" },
  tabBadge: {
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  tabBadgeActive: { backgroundColor: "#6366F1" },
  tabBadgeText: { color: "white", fontSize: 9, fontWeight: "700" },

  scrollContent: { paddingBottom: 40 },
  filtersSection: { marginBottom: 16 },
  subjectsContainer: { paddingHorizontal: 20, gap: 8 },
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
  subjectChipText: { fontSize: 13, color: "#64748B" },

  resourcesSection: { paddingHorizontal: 20 },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 14,
  },

  // Tutor card
  tutorCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  tutorCardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  tutorAvatar: { width: 34, height: 34, borderRadius: 17 },
  tutorCardMeta: { flex: 1 },
  tutorName: { fontSize: 13, fontWeight: "700", color: "#1E293B" },
  tutorCardDate: { fontSize: 11, color: "#94A3B8", marginTop: 1 },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paidBadgeText: { fontSize: 10, fontWeight: "700" },
  tutorCardTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 10,
  },
  tutorCardBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sizeText: { fontSize: 11, color: "#94A3B8" },
  tutorCardActions: { flexDirection: "row", gap: 10 },
  openBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  openBtnText: { fontSize: 13, fontWeight: "600", color: "#6366F1" },
  downloadBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#6366F1",
  },
  downloadBtnText: { fontSize: 13, fontWeight: "600", color: "white" },

  // Resource card inchangé
  resourceCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  resourceHeader: { marginBottom: 10 },
  resourceBadges: { flexDirection: "row", gap: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  typeBadgeText: { fontSize: 11, fontWeight: "600" },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  levelBadgeText: { fontSize: 11, color: "#64748B", fontWeight: "500" },
  resourceTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 4,
  },
  resourceSubject: { fontSize: 13, color: "#64748B", marginBottom: 14 },
  resourceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resourceStats: { flexDirection: "row", alignItems: "center", gap: 8 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 12, color: "#64748B", fontWeight: "500" },
  statDivider: { width: 1, height: 12, backgroundColor: "#F1F5F9" },
  pagesText: { fontSize: 12, color: "#64748B" },
  resourceActions: { flexDirection: "row", gap: 8 },
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
  downloadButton: { backgroundColor: "#6366F1", borderWidth: 0 },

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
  emptyStateText: { fontSize: 14, color: "#64748B", textAlign: "center" },

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
  sourceButtonText: { fontSize: 15, color: "#64748B", fontWeight: "600" },
});
