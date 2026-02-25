import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  RefreshControl,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BookOpen,
  FileText,
  Video,
  Music,
  Image as ImageIcon,
  File,
  Download,
  Eye,
  Trash2,
  Edit3,
  MoreVertical,
  ChevronDown,
  Plus,
  X,
  Search,
  Check,
  Lock,
  Unlock,
  ArrowUpDown,
} from "lucide-react-native";

import {
  useResources,
  useUploadResource,
  useUpdateResource,
  useDeleteResource,
  resolveResourceUrl,
} from "@/hooks/api/resources";
import { useMyTutorProfile, useMyStudents } from "@/hooks/api/tutors";
import * as DocumentPicker from "expo-document-picker";

const SUBJECT_NORMALIZATION: Record<string, string> = {
  Maths: "Mathématiques",
  Math: "Mathématiques",
  Français: "Français",
  Sciences: "Sciences",
  Anglais: "Anglais",
};

const STATUS_COLORS = {
  PUBLISHED: { bg: "#DCFCE7", text: "#166534", label: "Publié" },
  DRAFT: { bg: "#FEF3C7", text: "#92400E", label: "Brouillon" },
  ARCHIVED: { bg: "#FEE2E2", text: "#991B1B", label: "Archivé" },
};

const TYPE_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; color?: string }>
> = {
  document: FileText,
  video: Video,
  audio: Music,
  image: ImageIcon,
  other: File,
};

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  document: { bg: "#EEF2FF", color: "#6366F1" },
  video: { bg: "#F0FDF4", color: "#16A34A" },
  audio: { bg: "#FFF7ED", color: "#EA580C" },
  image: { bg: "#FDF2F8", color: "#DB2777" },
  other: { bg: "#F3F4F6", color: "#6B7280" },
};

interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: string;
  subject: string;
  fileUrl: string;
  fileSize: string | null;
  tags: string[];
  status: string;
  isPaid: boolean;
  price: number | null;
  downloads: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function TutorResourcesScreen() {
  const { data: apiResources = [], isLoading, refetch } = useResources();
  const { data: tutorProfile } = useMyTutorProfile();
  const { data: myStudentsData = [] } = useMyStudents();
  const updateMutation = useUpdateResource();
  const deleteMutation = useDeleteResource();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [subjectFilter, setSubjectFilter] = useState<string>("ALL");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const tutorSubjects = useMemo(
    () => tutorProfile?.subjects ?? [],
    [tutorProfile],
  );

  const myResources = useMemo(() => {
    return apiResources
      .filter(
        (r: Resource) => r.status !== "ARCHIVED" || statusFilter === "ARCHIVED",
      )
      .map((r: Resource) => ({
        ...r,
        studentName: r.tags
          .find((t) => t.startsWith("student:"))
          ?.replace("student:", ""),
      }));
  }, [apiResources, statusFilter]);

  const filteredResources = useMemo(() => {
    return myResources.filter((r: Resource) => {
      const matchesSearch =
        !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
      const matchesSubject =
        subjectFilter === "ALL" || r.subject === subjectFilter;
      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [myResources, searchQuery, statusFilter, subjectFilter]);

  const stats = useMemo(() => {
    const total = myResources.length;
    const published = myResources.filter(
      (r: Resource) => r.status === "PUBLISHED",
    ).length;
    const drafts = myResources.filter(
      (r: Resource) => r.status === "DRAFT",
    ).length;
    const totalDownloads = myResources.reduce(
      (acc: number, r: Resource) => acc + r.downloads,
      0,
    );
    const totalViews = myResources.reduce(
      (acc: number, r: Resource) => acc + r.views,
      0,
    );
    const paidResources = myResources.filter(
      (r: Resource) => r.isPaid && r.status === "PUBLISHED",
    );
    const estimatedRevenue = paidResources.reduce(
      (acc: number, r: Resource) => {
        const price = r.price ?? 0;
        return acc + price * r.downloads;
      },
      0,
    );

    return {
      total,
      published,
      drafts,
      totalDownloads,
      totalViews,
      estimatedRevenue,
    };
  }, [myResources]);

  const handleDelete = (resource: Resource) => {
    Alert.alert(
      "Supprimer la ressource",
      `Êtes-vous sûr de vouloir supprimer "${resource.title}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(resource.id);
              Alert.alert("Succès", "Ressource supprimée avec succès");
            } catch {
              Alert.alert("Erreur", "Impossible de supprimer la ressource");
            }
          },
        },
      ],
    );
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedResource) return;
    setIsUpdating(true);
    try {
      await updateMutation.mutateAsync({
        id: selectedResource.id,
        status: newStatus,
      });
      setShowStatusModal(false);
      refetch();
      Alert.alert("Succès", "Statut mis à jour");
    } catch {
      Alert.alert("Erreur", "Impossible de modifier le statut");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenResource = async (resource: Resource) => {
    const url = resolveResourceUrl(resource.fileUrl);
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Erreur", "Impossible d'ouvrir le fichier");
    }
  };

  const renderResourceCard = (resource: Resource) => {
    const TypeIcon = TYPE_ICONS[resource.type] || FileText;
    const typeStyle = TYPE_COLORS[resource.type] || TYPE_COLORS.other;
    const statusStyle = STATUS_COLORS[resource.status] || STATUS_COLORS.DRAFT;

    return (
      <View key={resource.id} style={styles.resourceCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.typeIcon, { backgroundColor: typeStyle.bg }]}>
            <TypeIcon size={20} color={typeStyle.color} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {resource.title}
            </Text>
            <View style={styles.cardMeta}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusStyle.bg },
                ]}
              >
                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                  {statusStyle.label}
                </Text>
              </View>
              <Text style={styles.cardDate}>
                {new Date(resource.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => {
              setSelectedResource(resource);
            }}
          >
            <MoreVertical size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectText}>
              {SUBJECT_NORMALIZATION[resource.subject] ?? resource.subject}
            </Text>
          </View>
          {resource.isPaid && (
            <View style={styles.priceBadge}>
              <Lock size={10} color="#6366F1" />
              <Text style={styles.priceText}>
                {(resource.price ?? 0) / 100}€
              </Text>
            </View>
          )}
          {!resource.isPaid && (
            <View style={[styles.priceBadge, styles.freeBadge]}>
              <Unlock size={10} color="#10B981" />
              <Text style={[styles.priceText, styles.freeText]}>Gratuit</Text>
            </View>
          )}
        </View>

        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <Eye size={14} color="#64748B" />
            <Text style={styles.statValue}>{resource.views}</Text>
            <Text style={styles.statLabel}>vues</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Download size={14} color="#64748B" />
            <Text style={styles.statValue}>{resource.downloads}</Text>
            <Text style={styles.statLabel}>téléch.</Text>
          </View>
          {resource.isPaid && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {(((resource.price ?? 0) * resource.downloads) / 100).toFixed(
                    2,
                  )}
                  €
                </Text>
                <Text style={styles.statLabel}>revenu</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleOpenResource(resource)}
          >
            <Eye size={16} color="#6366F1" />
            <Text style={styles.actionText}>Voir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              setSelectedResource(resource);
              setShowStatusModal(true);
            }}
          >
            <ArrowUpDown size={16} color="#F59E0B" />
            <Text style={[styles.actionText, { color: "#F59E0B" }]}>
              Statut
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDelete(resource)}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={[styles.actionText, { color: "#EF4444" }]}>
              Supprimer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>MES RESSOURCES</Text>
            <Text style={styles.headerTitle}>Gestionnaire</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <BookOpen size={24} color="#6366F1" />
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Check size={24} color="#10B981" />
            <Text style={[styles.statNumber, { color: "#10B981" }]}>
              {stats.published}
            </Text>
            <Text style={styles.statLabel}>Publiés</Text>
          </View>
          <View style={styles.statCard}>
            <FileText size={24} color="#F59E0B" />
            <Text style={[styles.statNumber, { color: "#F59E0B" }]}>
              {stats.drafts}
            </Text>
            <Text style={styles.statLabel}>Brouillons</Text>
          </View>
          <View style={styles.statCard}>
            <Download size={24} color="#6366F1" />
            <Text style={[styles.statNumber, { color: "#6366F1" }]}>
              {stats.totalDownloads}
            </Text>
            <Text style={styles.statLabel}>Télécharg.</Text>
          </View>
        </View>

        {stats.estimatedRevenue > 0 && (
          <View style={styles.revenueCard}>
            <View style={styles.revenueInfo}>
              <Text style={styles.revenueLabel}>Revenu estimé</Text>
              <Text style={styles.revenueValue}>
                {(stats.estimatedRevenue / 100).toFixed(2)}€
              </Text>
            </View>
            <Text style={styles.revenueSub}>
              Basé sur {stats.totalDownloads} téléchargements
            </Text>
          </View>
        )}

        <View style={styles.filterSection}>
          <View style={styles.searchBox}>
            <Search size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                statusFilter === "ALL" && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter("ALL")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === "ALL" && styles.filterChipTextActive,
                ]}
              >
                Tous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                statusFilter === "PUBLISHED" && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter("PUBLISHED")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === "PUBLISHED" && styles.filterChipTextActive,
                ]}
              >
                Publiés
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                statusFilter === "DRAFT" && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter("DRAFT")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === "DRAFT" && styles.filterChipTextActive,
                ]}
              >
                Brouillons
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                statusFilter === "ARCHIVED" && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter("ARCHIVED")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === "ARCHIVED" && styles.filterChipTextActive,
                ]}
              >
                Archivés
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {tutorSubjects.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterRow}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  styles.filterChipSmall,
                  subjectFilter === "ALL" && styles.filterChipActive,
                ]}
                onPress={() => setSubjectFilter("ALL")}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    styles.filterChipTextSmall,
                    subjectFilter === "ALL" && styles.filterChipTextActive,
                  ]}
                >
                  Toutes les matières
                </Text>
              </TouchableOpacity>
              {tutorSubjects.map((subject: string) => (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.filterChip,
                    styles.filterChipSmall,
                    subjectFilter === subject && styles.filterChipActive,
                  ]}
                  onPress={() => setSubjectFilter(subject)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      styles.filterChipTextSmall,
                      subjectFilter === subject && styles.filterChipTextActive,
                    ]}
                  >
                    {SUBJECT_NORMALIZATION[subject] ?? subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.resourcesList}>
          {filteredResources.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Aucune ressource</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ||
                statusFilter !== "ALL" ||
                subjectFilter !== "ALL"
                  ? "Essayez avec d'autres filtres"
                  : "Créez votre première ressource depuis l'accueil"}
              </Text>
            </View>
          ) : (
            filteredResources.map(renderResourceCard)
          )}
        </View>
      </ScrollView>

      <Modal visible={showStatusModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.statusModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Changer le statut</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <X size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>{selectedResource?.title}</Text>

            <View style={styles.statusOptions}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  selectedResource?.status === "PUBLISHED" &&
                    styles.statusOptionActive,
                ]}
                onPress={() => handleStatusChange("PUBLISHED")}
                disabled={isUpdating}
              >
                <Check
                  size={18}
                  color={
                    selectedResource?.status === "PUBLISHED"
                      ? "white"
                      : "#166534"
                  }
                />
                <Text
                  style={[
                    styles.statusOptionText,
                    selectedResource?.status === "PUBLISHED" && {
                      color: "white",
                    },
                  ]}
                >
                  Publié
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusOption,
                  selectedResource?.status === "DRAFT" &&
                    styles.statusOptionActive,
                ]}
                onPress={() => handleStatusChange("DRAFT")}
                disabled={isUpdating}
              >
                <FileText
                  size={18}
                  color={
                    selectedResource?.status === "DRAFT" ? "white" : "#92400E"
                  }
                />
                <Text
                  style={[
                    styles.statusOptionText,
                    selectedResource?.status === "DRAFT" && {
                      color: "white",
                    },
                  ]}
                >
                  Brouillon
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusOption,
                  styles.statusOptionDanger,
                  selectedResource?.status === "ARCHIVED" &&
                    styles.statusOptionActive,
                ]}
                onPress={() => handleStatusChange("ARCHIVED")}
                disabled={isUpdating}
              >
                <Trash2
                  size={18}
                  color={
                    selectedResource?.status === "ARCHIVED"
                      ? "white"
                      : "#991B1B"
                  }
                />
                <Text
                  style={[
                    styles.statusOptionText,
                    styles.statusOptionTextDanger,
                    selectedResource?.status === "ARCHIVED" && {
                      color: "white",
                    },
                  ]}
                >
                  Archivé
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6366F1",
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statCardPrimary: {
    backgroundColor: "#EEF2FF",
    borderColor: "#6366F1",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  revenueCard: {
    marginHorizontal: 20,
    backgroundColor: "#10B981",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  revenueInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  revenueLabel: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
  },
  revenueValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  revenueSub: {
    fontSize: 12,
    color: "white",
    opacity: 0.8,
    marginTop: 4,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#1E293B",
  },
  filterRow: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 8,
  },
  filterChipSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  filterChipTextSmall: {
    fontSize: 12,
  },
  filterChipTextActive: {
    color: "white",
  },
  resourcesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  resourceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  cardDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  moreBtn: {
    padding: 4,
  },
  cardDetails: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  subjectBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  priceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  freeBadge: {
    backgroundColor: "#DCFCE7",
  },
  priceText: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "600",
  },
  freeText: {
    color: "#10B981",
  },
  cardStats: {
    flexDirection: "row",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 12,
  },
  cardActions: {
    flexDirection: "row",
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  statusModal: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxWidth: 340,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 20,
  },
  statusOptions: {
    gap: 10,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statusOptionActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  statusOptionDanger: {
    borderColor: "#FEE2E2",
  },
  statusOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  statusOptionTextDanger: {
    color: "#991B1B",
  },
});
