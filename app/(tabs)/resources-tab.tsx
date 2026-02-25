import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Modal,
  Image,
  Alert,
  Share,
  Linking,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Download,
  Star,
  Filter,
  ArrowLeft,
  Share2,
  CheckCircle2,
  X,
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

const COLORS = {
  primary: THEME.colors.primary,
  secondary: THEME.colors.secondaryLight,
  text: THEME.colors.text,
  subtext: THEME.colors.subtext,
  accent: THEME.colors.accent,
  white: THEME.colors.white,
  success: THEME.colors.success,
};

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
  image: string;
  content: string;
  summary: string[];
  url?: string;
  isPaid: boolean;
  price: number | null;
  hasEntitlement: boolean;
}

export default function LibraryScreen() {
  const { data: apiResources = [] } = useResources();
  const trackDownloadMutation = useTrackResourceDownload();
  const { payForResource } = usePayment();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
          image:
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200",
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
        }))
        .filter((resource) => Boolean(resource.url)),
    [apiResources],
  );

  const handleDownload = async (resource: Resource) => {
    if (!resource.url) {
      Alert.alert("Indisponible", "Aucun fichier associé à cette ressource.");
      return;
    }

    if (resource.isPaid && !resource.hasEntitlement) {
      const priceLabel = resource.price
        ? `${(resource.price / 100).toFixed(2)} $`
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
  };

  const filteredResources = useMemo(() => {
    return serverResources.filter(
      (res) =>
        (selectedSubject === "all" || res.subject === selectedSubject) &&
        res.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [selectedSubject, searchQuery, serverResources]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>DOCUMENTS</Text>
          <Text style={styles.headerTitle}>Bibliothèque</Text>
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Search size={20} color={COLORS.subtext} />
        <TextInput
          placeholder="Chercher une leçon, un quiz..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {subjects.map((subject) => (
          <HapticPressable
            key={subject}
            style={[
              styles.filterChip,
              selectedSubject === subject && styles.filterChipActive,
            ]}
            onPress={() => {
              setSelectedSubject(subject);
              Haptics.selectionAsync();
            }}
            hapticType="selection"
            scale={0.95}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedSubject === subject && styles.filterChipTextActive,
              ]}
            >
              {subject === "all" ? "Tout" : subject}
            </Text>
          </HapticPressable>
        ))}
      </ScrollView>

      <FlatList
        data={filteredResources}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <HapticPressable
            onPress={() => {
              setSelectedResource(item);
              setIsViewerVisible(true);
            }}
            hapticType="light"
            scale={0.98}
            style={styles.card}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.cardBadge}>
                <Text style={[styles.badgeText, { color: item.color }]}>
                  {item.type}
                </Text>
                <Text style={styles.levelText}>{item.level}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubject} numberOfLines={1}>
                {item.subject}
              </Text>
              <View style={styles.cardFooter}>
                <View style={styles.row}>
                  <Star
                    size={14}
                    color={THEME.colors.accent}
                    fill={THEME.colors.accent}
                  />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.downloadCount}>
                    • {item.downloads} téléchargements
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDownload(item)}>
                  <Download size={20} color={THEME.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </HapticPressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune ressource trouvée</Text>
          </View>
        }
      />

      <Modal visible={isViewerVisible} animationType="slide">
        <SafeAreaView style={styles.viewer}>
          <View style={styles.viewerHeader}>
            <TouchableOpacity onPress={() => setIsViewerVisible(false)}>
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
            >
              <Share2 size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.viewerScroll}>
            <View style={styles.paperPage}>
              <Image
                source={{ uri: selectedResource?.image }}
                style={styles.viewerImage}
              />

              <Text style={styles.pageSubject}>
                {selectedResource?.subject}
              </Text>
              <Text style={styles.pageTitle}>{selectedResource?.title}</Text>

              <View style={styles.separator} />

              <Text style={styles.realWriting}>
                {selectedResource?.content}
              </Text>

              <Text style={styles.subHeading}>Points clés à retenir :</Text>
              {selectedResource?.summary.map((point, index) => (
                <View key={index} style={styles.pointRow}>
                  <CheckCircle2 size={16} color={COLORS.success} />
                  <Text style={styles.pointText}>{point}</Text>
                </View>
              ))}

              <View style={styles.footerNote}>
                <Text style={styles.noteText}>
                  Page 1 sur {selectedResource?.pages} • Support pédagogique
                  certifié
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.viewerActions}>
            <TouchableOpacity
              style={styles.mainDownloadBtn}
              onPress={() =>
                selectedResource && handleDownload(selectedResource)
              }
            >
              <Download size={20} color={COLORS.white} />
              <Text style={styles.mainDownloadText}>
                Télécharger le PDF ({selectedResource?.pages} pages)
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.white },
  header: {
    padding: THEME.spacing.xxl,
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
  filterScroll: {
    maxHeight: 56,
    marginBottom: THEME.spacing.md,
  },
  filterContainer: {
    paddingHorizontal: THEME.spacing.xxl,
    gap: THEME.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  filterChip: {
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: 7,
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
  listContainer: { paddingHorizontal: THEME.spacing.xxl, paddingBottom: 40 },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: THEME.colors.subtext,
  },
  card: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.xl,
    marginBottom: 20,
    overflow: "hidden",
    boxShadow: THEME.shadows.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cardImage: { width: "100%", height: 140 },
  cardContent: { padding: THEME.spacing.lg },
  cardBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: THEME.spacing.sm,
  },
  badgeText: { fontWeight: "bold", fontSize: 11, letterSpacing: 0.5 },
  levelText: { fontSize: 11, color: THEME.colors.subtext, fontWeight: "600" },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.colors.text,
    marginBottom: 4,
  },
  cardSubject: {
    fontSize: 13,
    color: THEME.colors.subtext,
    marginBottom: THEME.spacing.sm,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: { flexDirection: "row", alignItems: "center" },
  ratingText: {
    marginLeft: 4,
    fontWeight: "bold",
    color: THEME.colors.text,
    fontSize: 13,
  },
  downloadCount: { marginLeft: 8, color: THEME.colors.subtext, fontSize: 12 },

  // Viewer
  viewer: { flex: 1, backgroundColor: THEME.colors.secondaryLight },
  viewerHeader: {
    padding: 20,
    backgroundColor: THEME.colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewerHeaderTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    marginHorizontal: 15,
  },
  viewerScroll: { padding: THEME.spacing.lg },
  paperPage: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.sm,
    padding: THEME.spacing.xxl,
    minHeight: 600,
    boxShadow: THEME.shadows.elevated,
  },
  viewerImage: {
    width: "100%",
    height: 180,
    borderRadius: THEME.radius.sm,
    marginBottom: 20,
  },
  pageSubject: {
    color: THEME.colors.primary,
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.colors.text,
    marginBottom: 15,
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
    fontWeight: "bold",
    color: THEME.colors.text,
    marginBottom: 15,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  pointText: { fontSize: 15, color: THEME.colors.subtext },
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
    fontWeight: "bold",
    fontSize: 16,
  },
});
