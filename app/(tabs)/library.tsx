import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Share,
  Linking,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Download,
  Star,
  Filter,
  ArrowLeft,
  Share2,
  CheckCircle2,
  BookOpen,
  ChevronDown,
  X,
  LayoutGrid,
  FolderHeart,
  Shield,
  CreditCard,
  Lock,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { THEME } from "@/config/theme";
import {
  resolveResourceUrl,
  useResources,
  useTrackResourceDownload,
} from "@/hooks/api/resources";
import { usePayment } from "@/hooks/usePayment";
import { HapticPressable } from "@/components/ui/haptic-pressable";
import { Avatar } from "@/components/ui/Avatar";

const COLORS = {
  primary: THEME.colors.primary,
  secondary: THEME.colors.secondaryLight,
  text: THEME.colors.text,
  subtext: THEME.colors.subtext,
  accent: THEME.colors.accent,
  white: THEME.colors.white,
  success: THEME.colors.success,
  warning: THEME.colors.warning,
  error: THEME.colors.error,
};

type ResourceType = "all" | "PDF" | "Quiz" | "Exercice";
type PriceFilter = "all" | "free" | "paid";
type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: "PDF" | "Quiz" | "Exercice";
  level: string;
  pages: number;
  downloads: string;
  rating: number;
  color: string;
  content: string;
  summary: string[];
  url?: string;
  isPaid: boolean;
  price: number | null;
  hasEntitlement: boolean;
  uploader?: { id: string; email: string; name?: string } | null;
  isSystemResource?: boolean;
}

export default function LibraryScreen() {
  const { data: apiResources = [] } = useResources();
  const trackDownloadMutation = useTrackResourceDownload();
  const { payForResource } = usePayment();

  const [activeTab, setActiveTab] = useState<"browse" | "owned">("browse");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<ResourceType>("all");
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>("all");
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>("all");

  const subjects = useMemo(() => {
    const uniqueSubjects = new Set(
      apiResources.map((r) => r.subject).filter(Boolean),
    );
    return ["all", ...Array.from(uniqueSubjects)];
  }, [apiResources]);

  const serverResources = useMemo<Resource[]>(
    () =>
      apiResources
        .map((resource) => ({
          id: resource.id,
          title: resource.title,
          subject: resource.subject,
          type:
            resource.type === "video"
              ? ("Quiz" as const)
              : resource.type === "audio"
                ? ("Exercice" as const)
                : ("PDF" as const),
          level: "Tous niveaux",
          pages: 1,
          downloads: resource.downloads?.toString() ?? "0",
          rating: 5,
          color: "#6366F1",
          summary: resource.description
            ? [resource.description]
            : ["Ressource pédagogique disponible"],
          content:
            resource.description ??
            "Ouvrez ou téléchargez ce document pour consulter son contenu.",
          url: resolveResourceUrl(resource.fileUrl),
          isPaid: resource.isPaid ?? false,
          price: resource.price ?? null,
          hasEntitlement: resource.hasEntitlement ?? !resource.isPaid,
          uploader: resource.uploader,
          isSystemResource: !resource.uploader,
        }))
        .filter((resource) => Boolean(resource.url)),
    [apiResources],
  );

  const ownedResources = useMemo(
    () => serverResources.filter((res) => res.hasEntitlement),
    [serverResources],
  );

  const handleDownload = useCallback(
    async (resource: Resource) => {
      if (!resource.url) {
        Alert.alert("Indisponible", "Aucun fichier associé à cette ressource.");
        return;
      }

      if (resource.isPaid && !resource.hasEntitlement) {
        const priceLabel = resource.price
          ? `${(resource.price / 100).toFixed(2)} €`
          : "Payant";
        Alert.alert(
          "Ressource payante",
          `Cette ressource coûte ${priceLabel}. Souhaitez-vous l'acheter?`,
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Acheter",
              onPress: async () => {
                const { success } = await payForResource(resource.id);
                if (success) {
                  Alert.alert(
                    "Achat réussi!",
                    "La ressource est maintenant accessible.",
                  );
                  setIsViewerVisible(false);
                }
              },
            },
          ],
        );
        return;
      }

      try {
        await trackDownloadMutation.mutateAsync(resource.id);
      } catch {
        // non-blocking analytics
      }
      Linking.openURL(resource.url).catch(() => {
        Alert.alert("Erreur", "Impossible d'ouvrir le lien de téléchargement.");
      });
    },
    [payForResource, trackDownloadMutation],
  );

  const filteredResources = useMemo(() => {
    const source = activeTab === "owned" ? ownedResources : serverResources;
    return source.filter((res) => {
      const matchesSubject =
        selectedSubject === "all" || res.subject === selectedSubject;
      const matchesType =
        selectedType === "all" ||
        res.type.toLowerCase() === selectedType.toLowerCase();
      const matchesPrice =
        selectedPrice === "all" ||
        (selectedPrice === "free" && !res.isPaid) ||
        (selectedPrice === "paid" && res.isPaid);
      const matchesLevel =
        selectedLevel === "all" ||
        res.level.toLowerCase().includes(selectedLevel);

      return matchesSubject && matchesType && matchesPrice && matchesLevel;
    });
  }, [
    activeTab,
    selectedSubject,
    selectedType,
    selectedPrice,
    selectedLevel,
    serverResources,
    ownedResources,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedType !== "all") count++;
    if (selectedPrice !== "all") count++;
    if (selectedLevel !== "all") count++;
    if (selectedSubject !== "all") count++;
    return count;
  }, [selectedType, selectedPrice, selectedLevel, selectedSubject]);

  const clearFilters = useCallback(() => {
    setSelectedSubject("all");
    setSelectedType("all");
    setSelectedPrice("all");
    setSelectedLevel("all");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const renderFilterPanel = () => (
    <Modal visible={showFilters} animationType="slide" transparent>
      <View style={styles.filterOverlay}>
        <View style={styles.filterPanel}>
          <View style={styles.filterPanelHeader}>
            <Text style={styles.filterPanelTitle}>Filtres</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterPanelContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Type</Text>
              <View style={styles.filterChips}>
                {(["all", "PDF", "Quiz", "Exercice"] as ResourceType[]).map(
                  (type) => (
                    <HapticPressable
                      key={type}
                      style={[
                        styles.filterChip,
                        selectedType === type && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedType(type)}
                      hapticType="selection"
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedType === type && styles.filterChipTextActive,
                        ]}
                      >
                        {type === "all" ? "Tous" : type}
                      </Text>
                    </HapticPressable>
                  ),
                )}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Prix</Text>
              <View style={styles.filterChips}>
                {(["all", "free", "paid"] as PriceFilter[]).map((price) => (
                  <HapticPressable
                    key={price}
                    style={[
                      styles.filterChip,
                      selectedPrice === price && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedPrice(price)}
                    hapticType="selection"
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedPrice === price && styles.filterChipTextActive,
                      ]}
                    >
                      {price === "all"
                        ? "Tous"
                        : price === "free"
                          ? "Gratuit"
                          : "Payant"}
                    </Text>
                  </HapticPressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Niveau</Text>
              <View style={styles.filterChips}>
                {(
                  [
                    "all",
                    "beginner",
                    "intermediate",
                    "advanced",
                  ] as LevelFilter[]
                ).map((level) => (
                  <HapticPressable
                    key={level}
                    style={[
                      styles.filterChip,
                      selectedLevel === level && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedLevel(level)}
                    hapticType="selection"
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedLevel === level && styles.filterChipTextActive,
                      ]}
                    >
                      {level === "all"
                        ? "Tous"
                        : level === "beginner"
                          ? "Débutant"
                          : level === "intermediate"
                            ? "Intermédiaire"
                            : "Avancé"}
                    </Text>
                  </HapticPressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Matière</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.subjectScroll}
              >
                <View style={styles.filterChips}>
                  {subjects.map((subject) => (
                    <HapticPressable
                      key={subject}
                      style={[
                        styles.filterChip,
                        selectedSubject === subject && styles.filterChipActive,
                      ]}
                      onPress={() => setSelectedSubject(subject)}
                      hapticType="selection"
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedSubject === subject &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {subject === "all" ? "Toutes" : subject}
                      </Text>
                    </HapticPressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.filterPanelFooter}>
            <TouchableOpacity
              style={styles.clearFiltersBtn}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersText}>Réinitialiser</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyFiltersBtn}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyFiltersText}>
                Appliquer ({filteredResources.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderResourceCard = ({ item }: { item: Resource }) => {
    const tutorName = item.uploader?.name || item.uploader?.email || null;
    const isSystem = item.isSystemResource;

    return (
      <HapticPressable
        onPress={() => {
          setSelectedResource(item);
          setIsViewerVisible(true);
        }}
        hapticType="light"
        scale={0.98}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardBadges}>
            <View
              style={[styles.typeBadge, { backgroundColor: item.color + "20" }]}
            >
              <Text style={[styles.typeBadgeText, { color: item.color }]}>
                {item.type}
              </Text>
            </View>
            {isSystem && (
              <View style={styles.systemBadge}>
                <Shield size={10} color={COLORS.success} />
                <Text style={styles.systemBadgeText}>Système</Text>
              </View>
            )}
          </View>
          <View style={styles.cardPrice}>
            {item.isPaid ? (
              <View style={styles.paidBadge}>
                <CreditCard size={12} color={COLORS.primary} />
                <Text style={styles.paidBadgeText}>
                  {(item.price! / 100).toFixed(2)} €
                </Text>
              </View>
            ) : (
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>Gratuit</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.cardMeta}>
          <Text style={styles.cardSubject} numberOfLines={1}>
            {item.subject}
          </Text>
          <Text style={styles.cardDot}>•</Text>
          <Text style={styles.cardLevel}>{item.level}</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Star
                size={12}
                color={THEME.colors.accent}
                fill={THEME.colors.accent}
              />
              <Text style={styles.statText}>{item.rating}</Text>
            </View>
            <View style={styles.statItem}>
              <Download size={12} color={COLORS.subtext} />
              <Text style={styles.statText}>{item.downloads}</Text>
            </View>
          </View>

          <View style={styles.cardTutor}>
            {tutorName ? (
              <>
                <Avatar
                  name={tutorName}
                  size="sm"
                  source={
                    item.uploader?.email
                      ? `https://api.dicebear.com/7.x/initials/svg?seed=${item.uploader.email}`
                      : undefined
                  }
                />
                <Text style={styles.tutorName} numberOfLines={1}>
                  {tutorName}
                </Text>
              </>
            ) : (
              <View style={styles.systemIcon}>
                <Shield size={14} color={COLORS.success} />
              </View>
            )}
          </View>
        </View>

        {!item.hasEntitlement && item.isPaid && (
          <View style={styles.lockedOverlay}>
            <Lock size={20} color={COLORS.white} />
            <Text style={styles.lockedText}>Réservé aux abonnés</Text>
          </View>
        )}
      </HapticPressable>
    );
  };

  const renderViewerModal = () => (
    <Modal visible={isViewerVisible} animationType="slide">
      <SafeAreaView style={styles.viewer}>
        <View style={styles.viewerHeader}>
          <TouchableOpacity
            onPress={() => setIsViewerVisible(false)}
            style={styles.viewerBackBtn}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.viewerHeaderTitle} numberOfLines={1}>
            {selectedResource?.title}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Share.share({
                message: `Regarde ce cours : ${selectedResource?.title}`,
              })
            }
            style={styles.viewerShareBtn}
          >
            <Share2 size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.viewerScroll}>
          <View style={styles.paperPage}>
            <View style={styles.viewerBadges}>
              {selectedResource?.type && (
                <View
                  style={[
                    styles.viewerTypeBadge,
                    { backgroundColor: selectedResource.color + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.viewerTypeBadgeText,
                      { color: selectedResource.color },
                    ]}
                  >
                    {selectedResource.type}
                  </Text>
                </View>
              )}
              {selectedResource?.isSystemResource && (
                <View style={styles.viewerSystemBadge}>
                  <Shield size={12} color={COLORS.success} />
                  <Text style={styles.viewerSystemBadgeText}>
                    Ressource système
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.pageSubject}>{selectedResource?.subject}</Text>
            <Text style={styles.pageTitle}>{selectedResource?.title}</Text>

            <View style={styles.viewerTutorRow}>
              {selectedResource?.uploader?.name ||
              selectedResource?.uploader?.email ? (
                <>
                  <Avatar
                    name={
                      selectedResource?.uploader?.name ||
                      selectedResource?.uploader?.email ||
                      "Tuteur"
                    }
                    size="md"
                  />
                  <View style={styles.viewerTutorInfo}>
                    <Text style={styles.viewerTutorLabel}>
                      {selectedResource?.isSystemResource
                        ? "Ajouté par"
                        : "Par"}
                    </Text>
                    <Text style={styles.viewerTutorName}>
                      {selectedResource?.uploader?.name ||
                        selectedResource?.uploader?.email}
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.viewerSystemRow}>
                  <View style={styles.viewerSystemIcon}>
                    <Shield size={20} color={COLORS.success} />
                  </View>
                  <View>
                    <Text style={styles.viewerSystemLabel}>
                      Ressource officielle
                    </Text>
                    <Text style={styles.viewerSystemSublabel}>
                      Ajout&eacute;e par l&apos;administrateur
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.viewerStats}>
              <View style={styles.viewerStatItem}>
                <Star
                  size={14}
                  color={THEME.colors.accent}
                  fill={THEME.colors.accent}
                />
                <Text style={styles.viewerStatText}>
                  {selectedResource?.rating}/5
                </Text>
              </View>
              <View style={styles.viewerStatItem}>
                <Download size={14} color={COLORS.subtext} />
                <Text style={styles.viewerStatText}>
                  {selectedResource?.downloads} t&eacute;l&eacute;chargements
                </Text>
              </View>
              <View style={styles.viewerStatItem}>
                <BookOpen size={14} color={COLORS.subtext} />
                <Text style={styles.viewerStatText}>
                  {selectedResource?.pages} page
                  {selectedResource?.pages !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <Text style={styles.realWriting}>{selectedResource?.content}</Text>

            {selectedResource?.summary &&
              selectedResource.summary.length > 0 && (
                <>
                  <Text style={styles.subHeading}>Points cls retenir :</Text>
                  {selectedResource.summary.map((point, index) => (
                    <View key={index} style={styles.pointRow}>
                      <CheckCircle2 size={16} color={COLORS.success} />
                      <Text style={styles.pointText}>{point}</Text>
                    </View>
                  ))}
                </>
              )}

            <View style={styles.footerNote}>
              <Text style={styles.noteText}>
                Page 1 sur {selectedResource?.pages} • Support pédagogique
                certifié
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.viewerActions}>
          {selectedResource?.isPaid && !selectedResource.hasEntitlement ? (
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() =>
                selectedResource && handleDownload(selectedResource)
              }
            >
              <CreditCard size={20} color={COLORS.white} />
              <Text style={styles.buyButtonText}>
                Acheter pour{" "}
                {selectedResource?.price
                  ? `${(selectedResource.price / 100).toFixed(2)} €`
                  : "voir le prix"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.mainDownloadBtn}
              onPress={() =>
                selectedResource && handleDownload(selectedResource)
              }
            >
              <Download size={20} color={COLORS.white} />
              <Text style={styles.mainDownloadText}>
                {selectedResource?.hasEntitlement
                  ? "Ouvrir le fichier"
                  : "Télécharger le PDF"}
                {selectedResource?.pages
                  ? ` (${selectedResource.pages} pages)`
                  : ""}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>DOCUMENTS</Text>
          <Text style={styles.headerTitle}>Bibliothèque</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            activeFiltersCount > 0 && styles.filterBtnActive,
          ]}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={COLORS.text} />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "browse" && styles.tabActive]}
          onPress={() => setActiveTab("browse")}
        >
          <LayoutGrid
            size={16}
            color={activeTab === "browse" ? COLORS.primary : COLORS.subtext}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "browse" && styles.tabTextActive,
            ]}
          >
            Parcourir
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "owned" && styles.tabActive]}
          onPress={() => setActiveTab("owned")}
        >
          <FolderHeart
            size={16}
            color={activeTab === "owned" ? COLORS.primary : COLORS.subtext}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "owned" && styles.tabTextActive,
            ]}
          >
            Mes ressources
          </Text>
          {ownedResources.length > 0 && (
            <View
              style={[
                styles.tabBadge,
                activeTab === "owned" && styles.tabBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeTab === "owned" && styles.tabBadgeTextActive,
                ]}
              >
                {ownedResources.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.quickFilters}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {(["all", "PDF", "Quiz", "Exercice"] as ResourceType[]).map(
            (type) => (
              <HapticPressable
                key={type}
                style={[
                  styles.quickFilterChip,
                  selectedType === type && styles.quickFilterChipActive,
                ]}
                onPress={() => setSelectedType(type)}
                hapticType="selection"
                scale={0.95}
              >
                <Text
                  style={[
                    styles.quickFilterText,
                    selectedType === type && styles.quickFilterTextActive,
                  ]}
                >
                  {type === "all" ? "Tout" : type}
                </Text>
              </HapticPressable>
            ),
          )}
          <View style={styles.quickFilterDivider} />
          {(["all", "free", "paid"] as PriceFilter[]).map((price) => (
            <HapticPressable
              key={price}
              style={[
                styles.quickFilterChip,
                selectedPrice === price && styles.quickFilterChipActive,
              ]}
              onPress={() => setSelectedPrice(price)}
              hapticType="selection"
              scale={0.95}
            >
              <Text
                style={[
                  styles.quickFilterText,
                  selectedPrice === price && styles.quickFilterTextActive,
                ]}
              >
                {price === "all"
                  ? "Prix"
                  : price === "free"
                    ? "Gratuit"
                    : "Payant"}
              </Text>
              {price === "all" && (
                <ChevronDown size={14} color={COLORS.subtext} />
              )}
            </HapticPressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredResources}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={renderResourceCard}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BookOpen size={48} color={COLORS.subtext} />
            <Text style={styles.emptyText}>
              {activeTab === "owned"
                ? "Vous n'avez pas encore de ressources"
                : "Aucune ressource trouvée"}
            </Text>
            {activeFiltersCount > 0 && (
              <TouchableOpacity
                style={styles.clearFiltersEmpty}
                onPress={clearFilters}
              >
                <Text style={styles.clearFiltersEmptyText}>
                  Réinitialiser les filtres
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {renderFilterPanel()}
      {renderViewerModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.white },
  tabs: {
    flexDirection: "row",
    marginHorizontal: THEME.spacing.xxl,
    marginBottom: THEME.spacing.md,
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: THEME.radius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
  },
  tabActive: {
    backgroundColor: THEME.colors.white,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.subtext,
  },
  tabTextActive: {
    color: THEME.colors.primary,
    fontWeight: "600",
  },
  tabBadge: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  tabBadgeActive: {
    backgroundColor: THEME.colors.primary,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.subtext,
  },
  tabBadgeTextActive: {
    color: THEME.colors.white,
  },
  subscriptionBar: {
    marginHorizontal: THEME.spacing.xxl,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.xs,
  },
  subscriptionBarActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  subscriptionBarInactive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  subscriptionBarIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: THEME.spacing.md,
  },
  subscriptionBarContent: { flex: 1 },
  subscriptionBarTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: 2,
  },
  subscriptionBarSubtitle: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  subscriptionBarBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionBarBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
  },
  subscriptionBarUpgrade: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  subscriptionBarUpgradeText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.colors.white,
  },
  header: {
    paddingHorizontal: THEME.spacing.xxl,
    paddingVertical: THEME.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.primary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 28,
    color: THEME.colors.text,
  },
  filterBtn: {
    padding: 10,
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: THEME.radius.md,
    flexDirection: "row",
    alignItems: "center",
  },
  filterBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: THEME.colors.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: THEME.colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  searchBox: {
    marginHorizontal: THEME.spacing.xxl,
    marginBottom: THEME.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.secondaryLight,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  quickFilters: {
    marginBottom: THEME.spacing.md,
  },
  filterContainer: {
    paddingHorizontal: THEME.spacing.xxl,
    gap: THEME.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  quickFilterChip: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 7,
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  quickFilterChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  quickFilterText: {
    fontSize: 13,
    color: THEME.colors.subtext,
    fontWeight: "500",
  },
  quickFilterTextActive: {
    color: THEME.colors.white,
  },
  quickFilterDivider: {
    width: 1,
    height: 20,
    backgroundColor: THEME.colors.border,
    marginHorizontal: 4,
  },
  listContainer: {
    paddingHorizontal: THEME.spacing.xxl,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: THEME.colors.subtext,
    marginTop: 12,
  },
  clearFiltersEmpty: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: 16,
  },
  clearFiltersEmptyText: {
    fontSize: 14,
    color: THEME.colors.primary,
    fontWeight: "500",
  },

  // Card styles
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.xl,
    marginBottom: 16,
    padding: THEME.spacing.lg,
    boxShadow: THEME.shadows.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: THEME.spacing.sm,
  },
  cardBadges: {
    flexDirection: "row",
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  systemBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
  },
  systemBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#059669",
  },
  cardPrice: {},
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
  },
  paidBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.colors.primary,
  },
  freeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
  },
  freeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.spacing.md,
  },
  cardSubject: {
    fontSize: 13,
    color: COLORS.subtext,
    fontWeight: "500",
  },
  cardDot: {
    marginHorizontal: 6,
    color: COLORS.subtext,
  },
  cardLevel: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: "500",
  },
  cardTutor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tutorName: {
    fontSize: 12,
    color: COLORS.subtext,
    maxWidth: 80,
  },
  systemIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  lockedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: THEME.radius.xl,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  lockedText: {
    color: THEME.colors.white,
    fontSize: 14,
    fontWeight: "600",
  },

  // Filter panel
  filterOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  filterPanel: {
    backgroundColor: THEME.colors.white,
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    maxHeight: "80%",
  },
  filterPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: THEME.spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  filterPanelTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: THEME.colors.text,
  },
  filterPanelContent: {
    padding: THEME.spacing.xxl,
  },
  filterSection: {
    marginBottom: THEME.spacing.xl,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  filterChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: THEME.colors.secondaryLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  filterChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: THEME.colors.subtext,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: THEME.colors.white,
  },
  subjectScroll: {
    marginHorizontal: -THEME.spacing.xxl,
    paddingHorizontal: THEME.spacing.xxl,
  },
  filterPanelFooter: {
    flexDirection: "row",
    padding: THEME.spacing.xxl,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  clearFiltersBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: "center",
  },
  clearFiltersText: {
    fontSize: 15,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  applyFiltersBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
  },
  applyFiltersText: {
    fontSize: 15,
    fontWeight: "600",
    color: THEME.colors.white,
  },

  // Viewer
  viewer: { flex: 1, backgroundColor: THEME.colors.secondaryLight },
  viewerHeader: {
    padding: 16,
    backgroundColor: THEME.colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  viewerBackBtn: { padding: 4 },
  viewerHeaderTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    marginHorizontal: 15,
  },
  viewerShareBtn: { padding: 4 },
  viewerScroll: { padding: THEME.spacing.lg },
  paperPage: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.sm,
    padding: THEME.spacing.xxl,
    minHeight: 600,
    boxShadow: THEME.shadows.elevated,
  },
  viewerBadges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  viewerTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  viewerTypeBadgeText: {
    fontWeight: "700",
    fontSize: 12,
  },
  viewerSystemBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#D1FAE5",
    borderRadius: 14,
  },
  viewerSystemBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
  },
  pageSubject: {
    color: THEME.colors.primary,
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: 16,
    lineHeight: 30,
  },
  viewerTutorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  viewerTutorInfo: { marginLeft: 12 },
  viewerTutorLabel: {
    fontSize: 11,
    color: COLORS.subtext,
  },
  viewerTutorName: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  viewerSystemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  viewerSystemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  viewerSystemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  viewerSystemSublabel: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  viewerStats: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  viewerStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewerStatText: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  separator: {
    height: 3,
    width: 40,
    backgroundColor: THEME.colors.primary,
    marginBottom: 20,
  },
  realWriting: {
    fontSize: 16,
    lineHeight: 26,
    color: THEME.colors.text,
    marginBottom: 25,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: 15,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  pointText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.subtext,
    lineHeight: 22,
  },
  footerNote: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    alignItems: "center",
  },
  noteText: { fontSize: 11, color: THEME.colors.secondaryText },
  viewerActions: { padding: 20, backgroundColor: THEME.colors.white },
  mainDownloadBtn: {
    backgroundColor: THEME.colors.primary,
    padding: 18,
    borderRadius: THEME.radius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  mainDownloadText: {
    color: THEME.colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  buyButton: {
    backgroundColor: "#F59E0B",
    padding: 18,
    borderRadius: THEME.radius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  buyButtonText: {
    color: THEME.colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
});
