import React, { useState } from "react";
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
  Modal,
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
  CreditCard,
  CheckCircle,
  X,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

// ── Ressources partagées par les tuteurs ──
const TUTOR_RESOURCES = [
  {
    id: 101,
    title: "Exercices fractions CE2",
    subject: "Maths",
    type: "PDF" as const,
    level: "CE2",
    tutorName: "M. Karim",
    tutorAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    childName: "Adam",
    date: "Il y a 2 jours",
    size: "2.4 MB",
    isPaid: false,
    price: null,
    color: "#3B82F6",
    url: "https://www.w3.org/WAI/WCAG21/wcag-2.1.pdf",
  },
  {
    id: 102,
    title: "Conjugaison – Passé composé",
    subject: "Français",
    type: "Quiz" as const,
    level: "CE2",
    tutorName: "Mme Sofia",
    tutorAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
    childName: "Sofia",
    date: "Il y a 3 jours",
    size: "1.8 MB",
    isPaid: true,
    price: "3,99 €",
    color: "#EF4444",
    url: "https://www.w3.org/WAI/WCAG21/wcag-2.1.pdf",
  },
  {
    id: 103,
    title: "Le système solaire (CM1)",
    subject: "Sciences",
    type: "PDF" as const,
    level: "CM1",
    tutorName: "M. Karim",
    tutorAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    childName: "Adam",
    date: "Il y a 5 jours",
    size: "3.2 MB",
    isPaid: false,
    price: null,
    color: "#8B5CF6",
    url: "https://www.itu.int/dms_pub/itu-s/opb/gen/S-GEN-SG-2019-PDF-E.pdf",
  },
  {
    id: 104,
    title: "Méthode de lecture rapide",
    subject: "Français",
    type: "PDF" as const,
    level: "CM2",
    tutorName: "Mme Sofia",
    tutorAvatar: "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
    childName: "Sofia",
    date: "Il y a 1 semaine",
    size: "5.1 MB",
    isPaid: true,
    price: "5,99 €",
    color: "#EF4444",
    url: "https://www.w3.org/WAI/WCAG21/wcag-2.1.pdf",
  },
];

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
  { id: 1, title: "Les fractions - Niveau CE2", subject: "Mathématiques", type: "PDF", level: "CE2", pages: 8, downloads: 1250, rating: 4.8, color: "#3B82F6" },
  { id: 2, title: "Conjugaison du passé composé", subject: "Français", type: "Exercice", level: "CE2", pages: 5, downloads: 980, rating: 4.6, color: "#EF4444" },
  { id: 3, title: "Le cycle de l'eau", subject: "Sciences", type: "PDF", level: "CM1", pages: 12, downloads: 1520, rating: 4.9, color: "#10B981" },
  { id: 4, title: "Vocabulaire: Les couleurs", subject: "Anglais", type: "Quiz", level: "CP", pages: 3, downloads: 750, rating: 4.5, color: "#6366F1" },
];

const SubjectChip: React.FC<{ subject: Subject; isSelected: boolean; onPress: () => void }> = ({ subject, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.subjectChip, isSelected && { backgroundColor: subject.color + "15", borderColor: subject.color }]}
    onPress={onPress} activeOpacity={0.7}
  >
    <subject.Icon size={16} color={isSelected ? subject.color : "#64748B"} />
    <Text style={[styles.subjectChipText, isSelected && { color: subject.color, fontWeight: "600" }]}>{subject.name}</Text>
  </TouchableOpacity>
);

const ResourceCard: React.FC<{ resource: Resource; delay: number }> = ({ resource, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <Pressable style={({ pressed }) => [styles.resourceCard, pressed && { opacity: 0.7 }]}>
      <View style={styles.resourceHeader}>
        <View style={styles.resourceBadges}>
          <View style={[styles.typeBadge, { backgroundColor: resource.color + "15" }]}>
            <Text style={[styles.typeBadgeText, { color: resource.color }]}>{resource.type}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{resource.level}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.resourceTitle} numberOfLines={2}>{resource.title}</Text>
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
          <TouchableOpacity style={styles.actionButton}><Eye size={16} color="#6366F1" /></TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.downloadButton]}><Download size={16} color="white" /></TouchableOpacity>
        </View>
      </View>
    </Pressable>
  </Animated.View>
);

// ── Mapping matière id → mots-clés ──
const SUBJECT_MAP: Record<string, string[]> = {
  math:    ["maths", "mathématiques"],
  french:  ["français"],
  science: ["sciences"],
  english: ["anglais"],
};

// ── Modale de paiement (sans simulation) ──
const PaymentModal: React.FC<{
  resource: typeof TUTOR_RESOURCES[0] | null;
  onClose: () => void;
  onUnlock: (id: number) => void;
}> = ({ resource, onClose, onUnlock }) => {
  if (!resource) return null;

  return (
    <Modal transparent animationType="slide" visible={!!resource}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Fermer */}
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <X size={18} color="#64748B" />
          </TouchableOpacity>

          {/* Icône */}
          <View style={[styles.modalIconBox, { backgroundColor: resource.color + "18" }]}>
            <Lock size={26} color={resource.color} />
          </View>

          <Text style={styles.modalTitle}>Ressource payante</Text>
          <Text style={styles.modalSubtitle}>Pour accéder à cette ressource, un paiement est requis.</Text>

          {/* Infos ressource */}
          <View style={styles.modalResourceInfo}>
            <Text style={styles.modalResourceTitle}>{resource.title}</Text>
            <View style={styles.modalResourceMeta}>
              <Image source={{ uri: resource.tutorAvatar }} style={styles.modalAvatar} />
              <Text style={styles.modalResourceTutor}>{resource.tutorName} · {resource.level}</Text>
            </View>
          </View>

          {/* Prix */}
          <View style={styles.modalPriceRow}>
            <Text style={styles.modalPriceLabel}>Prix unique</Text>
            <Text style={[styles.modalPriceValue, { color: resource.color }]}>{resource.price}</Text>
          </View>

          <TouchableOpacity
            style={[styles.modalPayBtn, { backgroundColor: resource.color }]}
            onPress={() => Alert.alert("Paiement", "Le système de paiement sera disponible prochainement.")}
          >
            <CreditCard size={16} color="white" />
            <Text style={styles.modalPayBtnText}>Payer {resource.price}</Text>
          </TouchableOpacity>

          <Text style={styles.modalSecure}>🔒 Paiement sécurisé</Text>
        </View>
      </View>
    </Modal>
  );
};

export default function ResourcesScreen() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tuteurs" | "general">("tuteurs");
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);
  const [payingResource, setPayingResource] = useState<typeof TUTOR_RESOURCES[0] | null>(null);

  const matchesSubjectFilter = (subjectStr: string) => {
    if (selectedSubject === "all") return true;
    const keywords = SUBJECT_MAP[selectedSubject] ?? [];
    return keywords.some((k) => subjectStr.toLowerCase().includes(k));
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch = searchQuery === "" || r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubjectFilter(r.subject) && matchesSearch;
  });

  const filteredTutorResources = TUTOR_RESOURCES.filter((r) => {
    const matchesSearch = searchQuery === "" || r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubjectFilter(r.subject) && matchesSearch;
  });

  const handleOpen = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert("Erreur", "Impossible d'ouvrir le fichier."));
  };

  const handleResourcePress = (resource: typeof TUTOR_RESOURCES[0], action: "open" | "download") => {
    if (resource.isPaid && !unlockedIds.includes(resource.id)) {
      setPayingResource(resource);
    } else {
      handleOpen(resource.url);
    }
  };

  const isUnlocked = (resource: typeof TUTOR_RESOURCES[0]) =>
    !resource.isPaid || unlockedIds.includes(resource.id);

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ressources</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Search */}
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

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "tuteurs" && styles.tabActive]}
          onPress={() => setActiveTab("tuteurs")}
        >
          <User size={14} color={activeTab === "tuteurs" ? "#6366F1" : "#94A3B8"} />
          <Text style={[styles.tabText, activeTab === "tuteurs" && styles.tabTextActive]}>De mes tuteurs</Text>
          <View style={[styles.tabBadge, activeTab === "tuteurs" && styles.tabBadgeActive]}>
            <Text style={styles.tabBadgeText}>{TUTOR_RESOURCES.length}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "general" && styles.tabActive]}
          onPress={() => setActiveTab("general")}
        >
          <BookOpen size={14} color={activeTab === "general" ? "#6366F1" : "#94A3B8"} />
          <Text style={[styles.tabText, activeTab === "general" && styles.tabTextActive]}>Bibliothèque</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Filtres matières */}
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subjectsContainer}>
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

            {/* Légende */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
                <Text style={styles.legendText}>Gratuit</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#6366F1" }]} />
                <Text style={styles.legendText}>Payant</Text>
              </View>
              <View style={styles.legendItem}>
                <CheckCircle size={10} color="#10B981" />
                <Text style={styles.legendText}>Débloqué</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              {filteredTutorResources.length} ressource{filteredTutorResources.length > 1 ? "s" : ""} partagée{filteredTutorResources.length > 1 ? "s" : ""}
            </Text>

            {filteredTutorResources.length === 0 && (
              <View style={styles.emptyState}>
                <BookOpen size={48} color="#CBD5E1" />
                <Text style={styles.emptyStateTitle}>Aucune ressource</Text>
                <Text style={styles.emptyStateText}>Vos tuteurs n'ont pas encore partagé de ressources</Text>
              </View>
            )}

            {filteredTutorResources.map((resource, index) => {
              const unlocked = isUnlocked(resource);
              return (
                <Animated.View key={resource.id} entering={FadeInDown.delay(index * 60).duration(350)}>
                  <View style={[
                    styles.tutorCard,
                    { borderLeftColor: resource.color },
                    !unlocked && styles.tutorCardLocked,
                  ]}>

                    {/* Bandeau "Payant" sur les ressources verrouillées */}
                    {resource.isPaid && !unlocked && (
                      <View style={[styles.lockedBanner, { backgroundColor: resource.color }]}>
                        <Lock size={10} color="white" />
                        <Text style={styles.lockedBannerText}>Payant · {resource.price}</Text>
                      </View>
                    )}

                    {/* Débloqué */}
                    {resource.isPaid && unlocked && (
                      <View style={styles.unlockedBanner}>
                        <CheckCircle size={10} color="#10B981" />
                        <Text style={styles.unlockedBannerText}>Débloqué</Text>
                      </View>
                    )}

                    <View style={styles.tutorCardTop}>
                      <Image source={{ uri: resource.tutorAvatar }} style={[styles.tutorAvatar, !unlocked && styles.blurred]} />
                      <View style={styles.tutorCardMeta}>
                        <Text style={styles.tutorName}>{resource.tutorName}</Text>
                        <Text style={styles.tutorCardDate}>Pour {resource.childName} · {resource.date}</Text>
                      </View>
                      <View style={[styles.paidBadge, { backgroundColor: resource.isPaid ? "#EEF2FF" : "#F0FDF4" }]}>
                        {resource.isPaid
                          ? (unlocked
                            ? <Unlock size={10} color="#10B981" />
                            : <Lock size={10} color="#6366F1" />)
                          : <Unlock size={10} color="#10B981" />}
                        <Text style={[styles.paidBadgeText, { color: resource.isPaid && !unlocked ? "#6366F1" : "#10B981" }]}>
                          {resource.isPaid ? (unlocked ? "Débloqué" : "Payant") : "Gratuit"}
                        </Text>
                      </View>
                    </View>

                    {/* Titre flou si verrouillé */}
                    <Text style={[styles.tutorCardTitle, !unlocked && styles.blurredText]}>
                      {unlocked ? resource.title : "●●●●● ●●●●●●●●●"}
                    </Text>

                    <View style={styles.tutorCardBadges}>
                      <View style={[styles.typeBadge, { backgroundColor: resource.color + "15" }]}>
                        <Text style={[styles.typeBadgeText, { color: resource.color }]}>{resource.type}</Text>
                      </View>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>{resource.level}</Text>
                      </View>
                      <Text style={styles.sizeText}>{resource.size}</Text>
                    </View>

                    <View style={styles.tutorCardActions}>
                      {!unlocked ? (
                        /* Bouton débloquer */
                        <TouchableOpacity
                          style={[styles.unlockBtn, { backgroundColor: resource.color }]}
                          onPress={() => setPayingResource(resource)}
                        >
                          <Lock size={15} color="white" />
                          <Text style={styles.unlockBtnText}>Débloquer · {resource.price}</Text>
                        </TouchableOpacity>
                      ) : (
                        <>
                          <TouchableOpacity
                            style={styles.openBtn}
                            onPress={() => handleResourcePress(resource, "open")}
                          >
                            <Eye size={15} color="#6366F1" />
                            <Text style={styles.openBtnText}>Ouvrir</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.downloadBtn}
                            onPress={() => handleResourcePress(resource, "download")}
                          >
                            <Download size={15} color="white" />
                            <Text style={styles.downloadBtnText}>Télécharger</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        )}

        {/* ══ ONGLET BIBLIOTHÈQUE ══ */}
        {activeTab === "general" && (
          <View style={styles.resourcesSection}>
            <Text style={styles.sectionTitle}>
              {filteredResources.length} ressource{filteredResources.length > 1 ? "s" : ""}
            </Text>
            {filteredResources.map((resource, index) => (
              <ResourceCard key={resource.id} resource={resource} delay={200 + index * 50} />
            ))}
            {filteredResources.length === 0 && (
              <View style={styles.emptyState}>
                <BookOpen size={48} color="#CBD5E1" />
                <Text style={styles.emptyStateTitle}>Aucune ressource</Text>
                <Text style={styles.emptyStateText}>Modifiez vos filtres ou votre recherche</Text>
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

      {/* Modale paiement */}
      <PaymentModal
        resource={payingResource}
        onClose={() => setPayingResource(null)}
        onUnlock={(id) => setUnlockedIds((prev) => [...prev, id])}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: "#F8FAFC",
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#F1F5F9",
  },
  headerTitle: { fontFamily: FONTS.fredoka, fontSize: 22, color: "#1E293B" },
  filterButton: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: "#F8FAFC",
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#F1F5F9",
  },

  searchContainer: { paddingHorizontal: 20, marginBottom: 14 },
  searchBar: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC",
    borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, gap: 10,
    borderWidth: 1, borderColor: "#F1F5F9",
  },
  searchInput: { flex: 1, fontSize: 15, color: "#1E293B" },

  tabs: {
    flexDirection: "row", marginHorizontal: 20, marginBottom: 16,
    backgroundColor: "#F8FAFC", borderRadius: 14, padding: 4,
    borderWidth: 1, borderColor: "#F1F5F9",
  },
  tab: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 10,
  },
  tabActive: { backgroundColor: "white", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: "600", color: "#94A3B8" },
  tabTextActive: { color: "#6366F1" },
  tabBadge: {
    backgroundColor: "#E2E8F0", borderRadius: 8,
    minWidth: 16, height: 16, justifyContent: "center", alignItems: "center", paddingHorizontal: 4,
  },
  tabBadgeActive: { backgroundColor: "#6366F1" },
  tabBadgeText: { color: "white", fontSize: 9, fontWeight: "700" },

  scrollContent: { paddingBottom: 40 },
  filtersSection: { marginBottom: 16 },
  subjectsContainer: { paddingHorizontal: 20, gap: 8 },
  subjectChip: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC",
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 30,
    borderWidth: 1, borderColor: "#F1F5F9", gap: 6,
  },
  subjectChipText: { fontSize: 13, color: "#64748B" },

  resourcesSection: { paddingHorizontal: 20 },
  sectionTitle: { fontFamily: FONTS.fredoka, fontSize: 14, color: "#94A3B8", marginBottom: 14 },

  // Légende
  legend: {
    flexDirection: "row", gap: 16, marginBottom: 14,
    paddingHorizontal: 4, alignItems: "center",
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },

  // Tutor card
  tutorCard: {
    backgroundColor: "#F8FAFC", borderRadius: 18, padding: 16,
    marginBottom: 12, borderLeftWidth: 4, borderWidth: 1, borderColor: "#F1F5F9",
    overflow: "hidden",
  },
  tutorCardLocked: {
    backgroundColor: "#FAFAFA",
    borderColor: "#F1F5F9",
    opacity: 0.92,
  },

  // Bandeau verrouillé
  lockedBanner: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8, alignSelf: "flex-start", marginBottom: 10,
  },
  lockedBannerText: { fontSize: 10, fontWeight: "700", color: "white" },

  // Bandeau débloqué
  unlockedBanner: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8, alignSelf: "flex-start", marginBottom: 10,
    backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: "#6EE7B7",
  },
  unlockedBannerText: { fontSize: 10, fontWeight: "700", color: "#10B981" },

  tutorCardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 10 },
  tutorAvatar: { width: 34, height: 34, borderRadius: 17 },
  blurred: { opacity: 0.3 },
  tutorCardMeta: { flex: 1 },
  tutorName: { fontSize: 13, fontWeight: "700", color: "#1E293B" },
  tutorCardDate: { fontSize: 11, color: "#94A3B8", marginTop: 1 },
  paidBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  paidBadgeText: { fontSize: 10, fontWeight: "700" },

  tutorCardTitle: { fontFamily: FONTS.fredoka, fontSize: 16, color: "#1E293B", marginBottom: 10 },
  blurredText: { color: "#CBD5E1", letterSpacing: 2 },

  tutorCardBadges: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  sizeText: { fontSize: 11, color: "#94A3B8" },
  tutorCardActions: { flexDirection: "row", gap: 10 },

  // Bouton débloquer
  unlockBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 12, borderRadius: 14,
  },
  unlockBtnText: { fontSize: 14, fontWeight: "700", color: "white" },

  openBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "#EEF2FF", borderWidth: 1, borderColor: "#E0E7FF",
  },
  openBtnText: { fontSize: 13, fontWeight: "600", color: "#6366F1" },
  downloadBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 12, backgroundColor: "#6366F1",
  },
  downloadBtnText: { fontSize: 13, fontWeight: "600", color: "white" },

  // Resource card
  resourceCard: {
    backgroundColor: "#F8FAFC", borderRadius: 20, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: "#F1F5F9",
  },
  resourceHeader: { marginBottom: 10 },
  resourceBadges: { flexDirection: "row", gap: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  typeBadgeText: { fontSize: 11, fontWeight: "600" },
  levelBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#F1F5F9",
  },
  levelBadgeText: { fontSize: 11, color: "#64748B", fontWeight: "500" },
  resourceTitle: { fontFamily: FONTS.fredoka, fontSize: 16, color: "#1E293B", marginBottom: 4 },
  resourceSubject: { fontSize: 13, color: "#64748B", marginBottom: 14 },
  resourceFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  resourceStats: { flexDirection: "row", alignItems: "center", gap: 8 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 12, color: "#64748B", fontWeight: "500" },
  statDivider: { width: 1, height: 12, backgroundColor: "#F1F5F9" },
  pagesText: { fontSize: 12, color: "#64748B" },
  resourceActions: { flexDirection: "row", gap: 8 },
  actionButton: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: "#FFFFFF",
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#F1F5F9",
  },
  downloadButton: { backgroundColor: "#6366F1", borderWidth: 0 },

  emptyState: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 20 },
  emptyStateTitle: { fontFamily: FONTS.fredoka, fontSize: 18, color: "#1E293B", marginTop: 16, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: "#64748B", textAlign: "center" },

  sourceButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#F1F5F9", marginHorizontal: 20, marginTop: 20,
    paddingVertical: 14, borderRadius: 30, borderWidth: 1, borderColor: "#E2E8F0",
  },
  sourceButtonText: { fontSize: 15, color: "#64748B", fontWeight: "600" },

  // Modal paiement
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(15,23,42,0.55)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, paddingBottom: 40, alignItems: "center",
  },
  modalClose: {
    alignSelf: "flex-end", width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center",
    marginBottom: 12,
  },
  modalIconBox: {
    width: 64, height: 64, borderRadius: 18,
    justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  modalTitle: { fontFamily: FONTS.fredoka, fontSize: 22, color: "#1E293B", marginBottom: 6, textAlign: "center" },
  modalSubtitle: { fontSize: 14, color: "#64748B", textAlign: "center", marginBottom: 20, paddingHorizontal: 10 },
  modalResourceInfo: {
    width: "100%", backgroundColor: "#F8FAFC", borderRadius: 14,
    padding: 14, marginBottom: 16, borderWidth: 1, borderColor: "#F1F5F9",
  },
  modalResourceTitle: { fontSize: 15, fontWeight: "700", color: "#1E293B", marginBottom: 8 },
  modalResourceMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  modalAvatar: { width: 22, height: 22, borderRadius: 11 },
  modalResourceTutor: { fontSize: 12, color: "#64748B" },
  modalPriceRow: {
    width: "100%", flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 20, paddingHorizontal: 4,
  },
  modalPriceLabel: { fontSize: 14, color: "#64748B", fontWeight: "600" },
  modalPriceValue: { fontSize: 22, fontWeight: "800", fontFamily: FONTS.fredoka },
  modalPayBtn: {
    width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 15, borderRadius: 18, marginBottom: 12,
  },
  modalPayBtnText: { fontSize: 16, fontWeight: "700", color: "white" },
  modalSecure: { fontSize: 12, color: "#94A3B8" },
});
