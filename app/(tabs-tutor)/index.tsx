import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
  Switch,
  Modal,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronRight,
  MessageSquare,
  BookOpen,
  Calendar,
  Plus,
  X,
  Share2,
  Check,
  FileText,
  Clock,
  Users,
  Sparkles,
  Download,
} from "lucide-react-native";

import { useAppSelector } from "@/store/hooks";

// --- Mock Data ---
const MY_STUDENTS = [
  { id: 1, name: "Adam B.", grade: "CE2", subject: "Maths", subjectColor: "#3B82F6", image: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png" },
  { id: 2, name: "Sofia M.", grade: "CP", subject: "Français", subjectColor: "#EF4444", image: "https://cdn-icons-png.flaticon.com/512/4140/4140049.png" },
];

// Ressources avec vrais PDFs éducatifs
const MOCK_RESOURCES = [
  { 
    id: 1, 
    title: "Exercices fractions CE2", 
    type: "PDF", 
    date: "Il y a 2 jours", 
    downloads: 12,
    url: "https://www.lelivrescolaire.fr/media/file/5c4d3f6f3b3d3c1f4c8b4567/5c4d3f6f3b3d3c1f4c8b4567.pdf",
    size: "2.4 MB"
  },
  { 
    id: 2, 
    title: "Conjugaison - Passé composé", 
    type: "Quiz", 
    date: "Il y a 3 jours", 
    downloads: 8,
    url: "https://www.pass-education.fr/wp-content/uploads/2020/04/conjugaison-passe-compose.pdf",
    size: "1.8 MB"
  },
  { 
    id: 3, 
    title: "Le système solaire (CM1)", 
    type: "PDF", 
    date: "Il y a 5 jours", 
    downloads: 15,
    url: "https://www.gommeetgribouillages.fr/CM1/systemesolaire.pdf",
    size: "3.2 MB"
  },
];

// Mock sessions planning
const MOCK_SESSIONS = [
  { id: 1, student: "Adam B.", time: "14:00", duration: "60min", subject: "Maths", color: "#3B82F6" },
  { id: 2, student: "Sofia M.", time: "16:00", duration: "45min", subject: "Français", color: "#EF4444" },
  { id: 3, student: "Adam B.", time: "Demain 10:00", duration: "60min", subject: "Maths", color: "#3B82F6" },
];

export default function TutorDashboardScreen() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const userName = user?.name || "Tuteur";

  const [isAvailable, setIsAvailable] = useState(true);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  
  const [newResource, setNewResource] = useState({ 
    title: "", 
    type: "PDF", 
    targetStudentId: 1,
    fileUrl: ""
  });

  const handleOpenPDF = (url: string, title: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Erreur", "Impossible d'ouvrir le fichier");
    });
  };

  const handleDownloadPDF = (url: string, title: string) => {
    Alert.alert(
      "Téléchargement",
      `Voulez-vous télécharger "${title}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Télécharger",
          onPress: () => {
            // Simulation de téléchargement
            Alert.alert("Succès", "Le fichier a été ajouté à vos téléchargements");
          }
        }
      ]
    );
  };

  const handleAddResource = () => {
    if (!newResource.title) {
      Alert.alert("Erreur", "Veuillez donner un titre à la ressource.");
      return;
    }

    const studentName = MY_STUDENTS.find(s => s.id === newResource.targetStudentId)?.name;

    Alert.alert(
      "🚀 Ressource Partagée",
      `Le document "${newResource.title}" a été ajouté à votre bibliothèque et envoyé sur l'application des parents de ${studentName}.`,
      [{ text: "Super !", onPress: () => setShowResourceModal(false) }]
    );

    setNewResource({ title: "", type: "PDF", targetStudentId: 1, fileUrl: "" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>TUTEUR</Text>
            <Text style={styles.headerTitle}>Bonjour, {userName}</Text>
          </View>
          <View style={styles.availabilityToggle}>
            <Text style={[styles.availabilityText, { color: isAvailable ? "#10B981" : "#94A3B8" }]}>
              {isAvailable ? "Disponible" : "Occupé"}
            </Text>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: "#CBD5E1", true: "#10B981" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Ressources</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Cours ajd</Text>
            </View>
          </View>
        </View>

        {/* BOUTON AJOUTER (ACTION PRINCIPALE) */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.mainAddButton}
            onPress={() => setShowResourceModal(true)}
          >
            <View style={styles.plusIconBg}>
              <Plus size={24} color="white" />
            </View>
            <View>
              <Text style={styles.addTitle}>Partager une ressource</Text>
              <Text style={styles.addSubTitle}>Visible par les parents et élèves</Text>
            </View>
            <Share2 size={20} color="#6366F1" style={{marginLeft: 'auto'}} />
          </TouchableOpacity>
        </View>

        {/* ÉLÈVES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes élèves</Text>
            <ChevronRight size={18} color="#64748B" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {MY_STUDENTS.map((student) => (
              <View key={student.id} style={styles.studentSmallCard}>
                <Image source={{ uri: student.image }} style={styles.studentSmallAvatar} />
                <Text style={styles.studentSmallName}>{student.name}</Text>
                <View style={[styles.miniBadge, { backgroundColor: student.subjectColor }]}>
                  <Text style={styles.miniBadgeText}>{student.subject}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ACCÈS RAPIDE - INTERACTIF */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Espace de travail</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction} 
              onPress={() => setShowLibraryModal(true)}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#8B5CF6" }]}>
                <BookOpen color="white" size={20}/>
              </View>
              <Text style={styles.quickActionLabel}>Ma Bibliothèque</Text>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction} 
              onPress={() => setShowPlanningModal(true)}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#10B981" }]}>
                <Calendar color="white" size={20}/>
              </View>
              <Text style={styles.quickActionLabel}>Planning</Text>
              <View style={[styles.notificationBadge, { backgroundColor: "#10B981" }]}>
                <Text style={styles.notificationText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* MODAL AJOUT & PARTAGE */}
      <Modal visible={showResourceModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Partager une ressource</Text>
              <TouchableOpacity onPress={() => setShowResourceModal(false)}>
                <X size={24} color="#1E293B"/>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.inputLabel}>Titre de la leçon ou exercice</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ex: Le cycle de l'eau (Support PDF)"
              value={newResource.title}
              onChangeText={(t) => setNewResource({...newResource, title: t})}
            />

            <Text style={styles.inputLabel}>Lien vers le fichier (PDF/URL)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="https://..."
              value={newResource.fileUrl}
              onChangeText={(t) => setNewResource({...newResource, fileUrl: t})}
            />

            <Text style={styles.inputLabel}>Pour quel élève ?</Text>
            <View style={styles.studentPicker}>
              {MY_STUDENTS.map((s) => (
                <TouchableOpacity 
                  key={s.id}
                  style={[
                    styles.studentOption, 
                    newResource.targetStudentId === s.id && styles.studentOptionActive
                  ]}
                  onPress={() => setNewResource({...newResource, targetStudentId: s.id})}
                >
                  <Image source={{ uri: s.image }} style={styles.miniAvatar} />
                  <Text style={[styles.studentOptionText, newResource.targetStudentId === s.id && styles.studentOptionTextActive]}>
                    {s.name}
                  </Text>
                  {newResource.targetStudentId === s.id && <Check size={14} color="white" />}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Format</Text>
            <View style={styles.typeRow}>
              {["PDF", "Quiz", "Vidéo"].map((t) => (
                <TouchableOpacity 
                  key={t}
                  style={[styles.typeChip, newResource.type === t && styles.typeChipActive]}
                  onPress={() => setNewResource({...newResource, type: t})}
                >
                  <Text style={[styles.typeChipText, newResource.type === t && styles.typeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddResource}>
              <Text style={styles.submitBtnText}>Publier sur l'espace Parent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL BIBLIOTHÈQUE AVEC VRAIS PDF */}
      <Modal visible={showLibraryModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <BookOpen size={20} color="#6366F1" />
                <Text style={styles.modalTitle}>Ma Bibliothèque</Text>
              </View>
              <TouchableOpacity onPress={() => setShowLibraryModal(false)}>
                <X size={24} color="#1E293B"/>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Vos dernières ressources partagées</Text>

            <ScrollView style={styles.modalList}>
              {MOCK_RESOURCES.map((resource) => (
                <View key={resource.id} style={styles.resourceItem}>
                  <View style={styles.resourceIcon}>
                    <FileText size={16} color="#6366F1" />
                  </View>
                  <View style={styles.resourceInfo}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <View style={styles.resourceMeta}>
                      <Text style={styles.resourceType}>{resource.type}</Text>
                      <Text style={styles.resourceDot}>•</Text>
                      <Text style={styles.resourceDate}>{resource.date}</Text>
                      <Text style={styles.resourceDot}>•</Text>
                      <Text style={styles.resourceSize}>{resource.size}</Text>
                    </View>
                  </View>
                  <View style={styles.resourceActions}>
                    <TouchableOpacity 
                      style={styles.resourceAction}
                      onPress={() => handleOpenPDF(resource.url, resource.title)}
                    >
                      <BookOpen size={16} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.resourceAction}
                      onPress={() => handleDownloadPDF(resource.url, resource.title)}
                    >
                      <Download size={16} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setShowLibraryModal(false);
                setShowResourceModal(true);
              }}
            >
              <Plus size={16} color="white" />
              <Text style={styles.modalButtonText}>Ajouter une ressource</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL PLANNING */}
      <Modal visible={showPlanningModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Calendar size={20} color="#6366F1" />
                <Text style={styles.modalTitle}>Planning des cours</Text>
              </View>
              <TouchableOpacity onPress={() => setShowPlanningModal(false)}>
                <X size={24} color="#1E293B"/>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Vos prochaines sessions</Text>

            <ScrollView style={styles.modalList}>
              {MOCK_SESSIONS.map((session) => (
                <TouchableOpacity 
                  key={session.id} 
                  style={[styles.sessionItem, { borderLeftColor: session.color }]}
                  onPress={() => Alert.alert("Session", `Cours de ${session.subject} avec ${session.student}`)}
                >
                  <View style={styles.sessionTime}>
                    <Text style={styles.sessionTimeText}>{session.time}</Text>
                    <Text style={styles.sessionDuration}>{session.duration}</Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionStudent}>{session.student}</Text>
                    <View style={[styles.sessionSubjectBadge, { backgroundColor: session.color + "15" }]}>
                      <Text style={[styles.sessionSubjectText, { color: session.color }]}>
                        {session.subject}
                      </Text>
                    </View>
                  </View>
                  <Clock size={14} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setShowPlanningModal(false);
                router.push("/tutor/availability");
              }}
            >
              <Calendar size={16} color="white" />
              <Text style={styles.modalButtonText}>Gérer mes disponibilités</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingBottom: 40 },
  header: { padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLabel: { fontSize: 12, fontWeight: "700", color: "#6366F1", letterSpacing: 1.2 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1E293B" },
  availabilityToggle: { alignItems: "center" },
  availabilityText: { fontSize: 10, fontWeight: "bold", marginBottom: 2 },

  statsCard: { marginHorizontal: 24, backgroundColor: "#F8FAFC", padding: 18, borderRadius: 20, borderWidth: 1, borderColor: "#F1F5F9" },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#1E293B" },
  statLabel: { fontSize: 12, color: "#64748B" },
  statDivider: { width: 1, height: 30, backgroundColor: "#E2E8F0" },

  section: { paddingHorizontal: 24, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B", marginBottom: 15 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },

  mainAddButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F7FF', 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E0E7FF',
    borderStyle: 'dashed'
  },
  plusIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  addTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  addSubTitle: { fontSize: 12, color: '#64748B' },

  studentSmallCard: { width: 100, padding: 12, backgroundColor: "#F8FAFC", borderRadius: 18, alignItems: "center", marginRight: 12, borderWidth: 1, borderColor: "#F1F5F9" },
  studentSmallAvatar: { width: 50, height: 50, borderRadius: 25, marginBottom: 8 },
  studentSmallName: { fontSize: 13, fontWeight: "600" },
  miniBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginTop: 4 },
  miniBadgeText: { color: "white", fontSize: 8, fontWeight: "bold" },

  quickActions: { flexDirection: "row", gap: 15, position: "relative" },
  quickAction: { flex: 1, alignItems: "center", backgroundColor: '#F8FAFC', padding: 15, borderRadius: 20, position: "relative" },
  iconCircle: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  quickActionLabel: { fontSize: 12, color: "#475569", fontWeight: "600" },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#8B5CF6",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "white", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, maxHeight: "80%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  modalTitleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  modalSubtitle: { fontSize: 14, color: "#64748B", marginBottom: 20 },
  modalList: { maxHeight: 400 },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },
  modalButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

  // Resource item styles
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  resourceIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  resourceInfo: { flex: 1 },
  resourceTitle: { fontSize: 14, fontWeight: "600", color: "#1E293B", marginBottom: 2 },
  resourceMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  resourceType: { fontSize: 11, color: "#6366F1", fontWeight: "600" },
  resourceDot: { fontSize: 11, color: "#CBD5E1" },
  resourceDate: { fontSize: 11, color: "#64748B" },
  resourceSize: { fontSize: 11, color: "#64748B" },
  resourceActions: { flexDirection: "row", gap: 8 },
  resourceAction: { padding: 8 },

  // Session item styles
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  sessionTime: { marginRight: 14 },
  sessionTimeText: { fontSize: 15, fontWeight: "600", color: "#1E293B" },
  sessionDuration: { fontSize: 11, color: "#64748B" },
  sessionInfo: { flex: 1 },
  sessionStudent: { fontSize: 14, fontWeight: "600", color: "#1E293B", marginBottom: 2 },
  sessionSubjectBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: "flex-start" },
  sessionSubjectText: { fontSize: 10, fontWeight: "600" },

  inputLabel: { fontSize: 14, fontWeight: "600", color: "#64748B", marginBottom: 10, marginTop: 10 },
  input: { backgroundColor: "#F8FAFC", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 15 },
  studentPicker: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  studentOption: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', flex: 1, gap: 8 },
  studentOptionActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  miniAvatar: { width: 24, height: 24, borderRadius: 12 },
  studentOptionText: { fontSize: 12, fontWeight: '600', color: '#1E293B' },
  studentOptionTextActive: { color: 'white' },
  typeRow: { flexDirection: "row", gap: 10, marginBottom: 25 },
  typeChip: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#E2E8F0", alignItems: "center" },
  typeChipActive: { backgroundColor: "#1E293B", borderColor: "#1E293B" },
  typeChipText: { color: "#64748B", fontWeight: "600" },
  typeChipTextActive: { color: "white" },
  submitBtn: { backgroundColor: "#6366F1", padding: 18, borderRadius: 15, alignItems: "center", elevation: 4 },
  submitBtnText: { color: "white", fontSize: 16, fontWeight: "bold" },
});