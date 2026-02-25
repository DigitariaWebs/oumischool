import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  User,
  Lock,
  Globe,
  Moon,
  Save,
  Bell,
  Shield,
  Users,
  CreditCard,
  HelpCircle,
  Clock,
  Ruler,
  Camera,
  Edit,
  Settings,
  Sparkles,
  ChevronRight,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import { useUpdateProfile, useChangePassword } from "@/hooks/api/auth";
import { useParentMe, useUploadAvatar, useUpdateParentProfile } from "@/hooks/api/parent";

export default function ParentSettingsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const children = useAppSelector((state) => state.children.children);

  const { data: parentProfile } = useParentMe();
  const updateProfile = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const uploadAvatar = useUploadAvatar();
  const updateParentProfile = useUpdateParentProfile();

  const [editMode, setEditMode] = useState(false);
  const [securityEditMode, setSecurityEditMode] = useState(false);
  const [avatarUri, setAvatarUri] = useState(user?.avatar || "");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState("Français");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [units, setUnits] = useState("Métrique");

  const notifPrefsInitialized = useRef(false);

  // Initialize notification/privacy toggles from API data once loaded
  useEffect(() => {
    if (parentProfile && !notifPrefsInitialized.current) {
      notifPrefsInitialized.current = true;
      const np = parentProfile.notificationPreferences as Record<string, boolean> | null;
      if (np) {
        if (np.push !== undefined) setPushNotifications(np.push);
        if (np.email !== undefined) setEmailNotifications(np.email);
        if (np.inApp !== undefined) setInAppNotifications(np.inApp);
      }
      const ps = parentProfile.privacySettings as Record<string, boolean> | null;
      if (ps) {
        if (ps.dataSharing !== undefined) setDataSharing(ps.dataSharing);
        if (ps.analytics !== undefined) setAnalytics(ps.analytics);
      }
    }
  }, [parentProfile]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "Nous avons besoin de l'accès à la galerie.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setAvatarUri(asset.uri);
      const fileName = asset.uri.split("/").pop() ?? "avatar.jpg";
      try {
        await uploadAvatar.mutateAsync({ uri: asset.uri, fileName });
      } catch {
        Alert.alert("Erreur", "Impossible de mettre à jour la photo de profil");
      }
    }
  };

  const handleSaveProfile = async () => {
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || firstName;
    try {
      await updateProfile.mutateAsync({ firstName, lastName, phone });
      dispatch(updateUser({ name, email, phoneNumber: phone, avatar: avatarUri }));
      setEditMode(false);
      Alert.alert("Succès", "Profil mis à jour");
    } catch (err) {
      Alert.alert("Erreur", err instanceof Error ? err.message : "Impossible de mettre à jour le profil");
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setPhone(user?.phoneNumber || "");
      setAvatarUri(user?.avatar || "");
    }
    setEditMode(!editMode);
  };

  const handleSecurityEditToggle = () => {
    if (securityEditMode) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSecurityEditMode(!securityEditMode);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      Alert.alert("Succès", "Mot de passe modifié");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSecurityEditMode(false);
    } catch (err) {
      Alert.alert("Erreur", err instanceof Error ? err.message : "Impossible de changer le mot de passe");
    }
  };

  const handleNotifToggle = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    const currentPrefs = (parentProfile?.notificationPreferences as Record<string, unknown>) ?? {};
    updateParentProfile.mutate({ notificationPreferences: { ...currentPrefs, [key]: value } });
  };

  const handlePrivacyToggle = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    const currentSettings = (parentProfile?.privacySettings as Record<string, unknown>) ?? {};
    updateParentProfile.mutate({ privacySettings: { ...currentSettings, [key]: value } });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={styles.headerRight}>
          <Settings size={20} color="#6366F1" />
        </View>
      </View>

      {/* Boule violette décorative */}
      <View style={styles.purpleBlob} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Carte utilisateur */}
        <View style={styles.userCard}>
          <View style={styles.userCardHeader}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: avatarUri || "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
                  }}
                  style={styles.avatar}
                />
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={pickImage}
                  disabled={uploadAvatar.isPending}
                >
                  {uploadAvatar.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Camera size={14} color="white" />
                  )}
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.userName}>{user?.name || "Utilisateur"}</Text>
                <Text style={styles.userEmail}>{user?.email || "email@example.com"}</Text>
              </View>
            </View>
            <View style={styles.userBadge}>
              <Sparkles size={12} color="#6366F1" />
              <Text style={styles.userBadgeText}>
                {children.length} enfant{children.length > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.sectionsContainer}>
          {/* Profil */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={handleEditToggle}>
              <View style={styles.sectionTitleContainer}>
                <User size={16} color="#6366F1" />
                <Text style={styles.sectionTitle}>Profil</Text>
              </View>
              <Edit size={16} color="#94A3B8" />
            </TouchableOpacity>

            {!editMode ? (
              <View style={styles.profileDisplay}>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.profileEmail}>{email}</Text>
                {phone ? <Text style={styles.profilePhone}>{phone}</Text> : null}
              </View>
            ) : (
              <View style={styles.editForm}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Nom"
                  placeholderTextColor="#94A3B8"
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  placeholderTextColor="#94A3B8"
                  editable={false}
                />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Téléphone"
                  keyboardType="phone-pad"
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity
                  style={[styles.saveButton, updateProfile.isPending && styles.buttonLoading]}
                  onPress={handleSaveProfile}
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Save size={16} color="white" />
                      <Text style={styles.saveButtonText}>Enregistrer</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Sécurité */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={handleSecurityEditToggle}>
              <View style={styles.sectionTitleContainer}>
                <Lock size={16} color="#6366F1" />
                <Text style={styles.sectionTitle}>Sécurité</Text>
              </View>
              <Edit size={16} color="#94A3B8" />
            </TouchableOpacity>

            {!securityEditMode ? (
              <View style={styles.securityDisplay}>
                <Text style={styles.securityLabel}>Mot de passe</Text>
                <Text style={styles.securityValue}>••••••••</Text>
              </View>
            ) : (
              <View style={styles.editForm}>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Mot de passe actuel"
                  secureTextEntry
                  placeholderTextColor="#94A3B8"
                />
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Nouveau mot de passe"
                  secureTextEntry
                  placeholderTextColor="#94A3B8"
                />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirmer"
                  secureTextEntry
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity
                  style={[styles.saveButton, changePasswordMutation.isPending && styles.buttonLoading]}
                  onPress={handleChangePassword}
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Lock size={16} color="white" />
                      <Text style={styles.saveButtonText}>Changer</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Préférences */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Globe size={16} color="#6366F1" />
                <Text style={styles.sectionTitle}>Préférences</Text>
              </View>
            </View>

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Moon size={16} color="#64748B" />
                <Text style={styles.preferenceLabel}>Mode sombre</Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
              />
            </View>

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Globe size={16} color="#64748B" />
                <Text style={styles.preferenceLabel}>Langue</Text>
              </View>
              <Text style={styles.preferenceValue}>{language}</Text>
            </View>

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Clock size={16} color="#64748B" />
                <Text style={styles.preferenceLabel}>Fuseau horaire</Text>
              </View>
              <Text style={styles.preferenceValue}>{timezone}</Text>
            </View>

            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Ruler size={16} color="#64748B" />
                <Text style={styles.preferenceLabel}>Unités</Text>
              </View>
              <Text style={styles.preferenceValue}>{units}</Text>
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Bell size={16} color="#6366F1" />
                <Text style={styles.sectionTitle}>Notifications</Text>
              </View>
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Push</Text>
              <Switch
                value={pushNotifications}
                onValueChange={(v) => handleNotifToggle("push", v, setPushNotifications)}
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
              />
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Email</Text>
              <Switch
                value={emailNotifications}
                onValueChange={(v) => handleNotifToggle("email", v, setEmailNotifications)}
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
              />
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>In-app</Text>
              <Switch
                value={inAppNotifications}
                onValueChange={(v) => handleNotifToggle("inApp", v, setInAppNotifications)}
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
              />
            </View>
          </View>

          {/* Confidentialité */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Shield size={16} color="#6366F1" />
                <Text style={styles.sectionTitle}>Confidentialité</Text>
              </View>
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Partage de données</Text>
              <Switch
                value={dataSharing}
                onValueChange={(v) => handlePrivacyToggle("dataSharing", v, setDataSharing)}
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
              />
            </View>

            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Suivi analytique</Text>
              <Switch
                value={analytics}
                onValueChange={(v) => handlePrivacyToggle("analytics", v, setAnalytics)}
                trackColor={{ false: "#E2E8F0", true: "#6366F1" }}
                thumbColor="white"
              />
            </View>
          </View>

          {/* Enfants */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => router.push("/(tabs)/children-tab")}>
              <View style={styles.sectionTitleContainer}>
                <Users size={16} color="#6366F1" />
                <Text style={styles.sectionTitle}>Enfants</Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>

            {children.length > 0 ? (
              children.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  style={styles.childRow}
                  onPress={() => router.push(`/parent/child/details?id=${child.id}`)}
                >
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childGrade}>{child.grade}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>Aucun enfant</Text>
            )}
          </View>

          {/* Abonnement */}
          <TouchableOpacity style={styles.section} onPress={() => router.push("/parent/profile/subscription")}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <CreditCard size={16} color="#6366F1" />
                <Text style={styles.sectionTitle}>Abonnement</Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
            <Text style={styles.subscriptionText}>Premium • 69€/mois</Text>
          </TouchableOpacity>

          {/* Aide */}
          <TouchableOpacity style={styles.section} onPress={() => router.push("/parent/profile/help")}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <HelpCircle size={16} color="#6366F1" />
                <Text style={styles.sectionTitle}>Aide & support</Text>
              </View>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  purpleBlob: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#6366F1",
    top: -100,
    right: -100,
    opacity: 0.1,
    zIndex: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    zIndex: 1,
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
    fontSize: 20,
    color: "#1E293B",
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 1,
  },
  userCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  userCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F8FAFC",
  },
  userName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: "#64748B",
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userBadgeText: {
    fontSize: 10,
    color: "#6366F1",
    fontWeight: "600",
  },
  sectionsContainer: {
    gap: 12,
  },
  section: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  profileDisplay: {
    paddingVertical: 4,
  },
  profileName: {
    fontSize: 15,
    color: "#1E293B",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 13,
    color: "#64748B",
  },
  editForm: {
    gap: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#6366F1",
    borderRadius: 30,
    padding: 12,
    marginTop: 4,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  securityDisplay: {
    paddingVertical: 4,
  },
  securityLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 4,
  },
  securityValue: {
    fontSize: 14,
    color: "#1E293B",
    letterSpacing: 2,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  preferenceLabel: {
    fontSize: 14,
    color: "#1E293B",
  },
  preferenceValue: {
    fontSize: 13,
    color: "#64748B",
  },
  childRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  childName: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
  childGrade: {
    fontSize: 12,
    color: "#64748B",
  },
  emptyText: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    paddingVertical: 12,
  },
  subscriptionText: {
    fontSize: 14,
    color: "#1E293B",
    marginTop: 4,
  },
  versionText: {
    fontSize: 12,
    color: "#CBD5E1",
    textAlign: "center",
    marginTop: 24,
  },
});
