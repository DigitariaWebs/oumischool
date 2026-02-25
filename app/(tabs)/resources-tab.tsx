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
  Lock,
} from "lucide-react-native";
import {
  resolveResourceUrl,
  useResources,
  useTrackResourceDownload,
} from "@/hooks/api/resources";
import { usePayment } from "@/hooks/usePayment";

// --- Configuration & Design ---
const COLORS = {
  primary: "#6366F1",
  secondary: "#F8FAFC",
  text: "#1E293B",
  subtext: "#64748B",
  accent: "#F59E0B",
  white: "#FFFFFF",
  success: "#10B981",
};

// --- Données Réelles ---
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
  price: number | null; // in cents
  hasEntitlement: boolean;
}

export default function LibraryScreen() {
  const { data: apiResources = [] } = useResources();
  const trackDownloadMutation = useTrackResourceDownload();
  const { payForResource } = usePayment();
  const [selectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [isViewerVisible, setIsViewerVisible] = useState(false);

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

    // Paywall gate: paid resource without entitlement
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
                  "La ressource est maintenant accessible."
                );
              }
            },
          },
        ]
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
        (selectedSubject === "all" || res.subject.includes(selectedSubject)) &&
        res.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [selectedSubject, searchQuery, serverResources]);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>DOCUMENTS</Text>
          <Text style={styles.headerTitle}>Bibliothèque</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* RECHERCHE */}
        <View style={styles.searchBox}>
          <Search size={20} color={COLORS.subtext} />
          <TextInput
            placeholder="Chercher une leçon, un quiz..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* LISTE DES CARTES */}
        <View style={styles.listContainer}>
          {filteredResources.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setSelectedResource(item);
                setIsViewerVisible(true);
              }}
              style={({ pressed }) => [
                styles.card,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
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
                <View style={styles.cardFooter}>
                  <View style={styles.row}>
                    <Star
                      size={14}
                      color={COLORS.accent}
                      fill={COLORS.accent}
                    />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                    <Text style={styles.downloadCount}>
                      • {item.downloads} téléchargements
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDownload(item)}>
                    <Download size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* MODAL LECTEUR INTERACTIF */}
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
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: COLORS.text },
  filterBtn: {
    padding: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
  },
  searchBox: {
    marginHorizontal: 24,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 16,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },

  listContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 2,
  },
  cardImage: { width: "100%", height: 140 },
  cardContent: { padding: 16 },
  cardBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  badgeText: { fontWeight: "bold", fontSize: 11, letterSpacing: 0.5 },
  levelText: { fontSize: 11, color: COLORS.subtext, fontWeight: "600" },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
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
    color: COLORS.text,
    fontSize: 13,
  },
  downloadCount: { marginLeft: 8, color: COLORS.subtext, fontSize: 12 },

  // Viewer
  viewer: { flex: 1, backgroundColor: "#F1F5F9" },
  viewerHeader: {
    padding: 20,
    backgroundColor: COLORS.white,
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
  viewerScroll: { padding: 16 },
  paperPage: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 24,
    minHeight: 600,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  viewerImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 20,
  },
  pageSubject: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
  separator: {
    height: 3,
    width: 40,
    backgroundColor: COLORS.primary,
    marginBottom: 20,
  },
  realWriting: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.text,
    marginBottom: 25,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  pointText: { fontSize: 15, color: COLORS.subtext },
  footerNote: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    alignItems: "center",
  },
  noteText: { fontSize: 11, color: "#CBD5E1" },
  viewerActions: { padding: 20, backgroundColor: COLORS.white },
  mainDownloadBtn: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  mainDownloadText: { color: COLORS.white, fontWeight: "bold", fontSize: 16 },
});
