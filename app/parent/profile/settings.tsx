import React, { useState, useMemo } from "react";
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
  Dimensions,
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
  CheckCircle,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import { useTheme } from "@/hooks/use-theme";
import { ThemeColors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ParentSettingsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const children = useAppSelector((state) => state.children.children);
  const { colors, isDark, setTheme } = useTheme();

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

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
  const [units, setUnits] = useState("metric");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Nous avons besoin de l'accès à la galerie pour changer la photo de profil.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    dispatch(
      updateUser({
        name,
        email,
        phoneNumber: phone,
        avatar: avatarUri,
      }),
    );
    setEditMode(false);
    Alert.alert("Succès", "Profil mis à jour avec succès");
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Reset to original values if canceling
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

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }
    // TODO: Implement password change logic
    Alert.alert("Succès", "Mot de passe modifié avec succès");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSecurityEditMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Organic blob background */}
      <View style={styles.blobContainer}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
      </View>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(600).springify()}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Paramètres</Text>
          <View style={styles.headerBadge}>
            <Settings size={12} color="#10B981" />
            <Text style={styles.headerBadgeText}>Configuration</Text>
          </View>
        </View>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Card */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(600).springify()}
          style={styles.heroCard}
        >
          <LinearGradient
            colors={["#6366F1", "#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTop}>
                <View style={styles.sparkleContainer}>
                  <Sparkles size={18} color="rgba(255,255,255,0.9)" />
                </View>
                <Text style={styles.heroLabel}>Compte</Text>
              </View>
              <Text style={styles.heroTitle}>
                {user?.name || "Utilisateur"}
              </Text>
              <View style={styles.heroBadge}>
                <CheckCircle size={14} color="#FCD34D" />
                <Text style={styles.heroBadgeText}>
                  Compte vérifié • {children.length} enfant
                  {children.length !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>
            {/* Decorative circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
          </LinearGradient>
        </Animated.View>

        {/* Profile Section */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <View
              style={[styles.sectionIcon, { backgroundColor: "#3B82F615" }]}
            >
              <User size={18} color="#3B82F6" />
            </View>
            <Text style={styles.sectionTitle}>Profil</Text>
            <TouchableOpacity
              onPress={handleEditToggle}
              style={styles.editButton}
            >
              <Edit size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {!editMode ? (
              <View style={styles.profileDisplay}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{
                      uri: avatarUri || "https://via.placeholder.com/100",
                    }}
                    style={styles.avatar}
                  />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.displayName}>
                    {name || "Nom non défini"}
                  </Text>
                  <Text style={styles.displayEmail}>
                    {email || "Email non défini"}
                  </Text>
                  <Text style={styles.displayPhone}>
                    {phone || "Téléphone non défini"}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.avatarEditContainer}>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.avatarWrapper}
                  >
                    <Image
                      source={{
                        uri: avatarUri || "https://via.placeholder.com/100",
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.cameraOverlay}>
                      <Camera size={24} color={COLORS.neutral.white} />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.avatarHint}>Appuyez pour changer</Text>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nom complet</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Votre nom"
                    placeholderTextColor={COLORS.neutral[400]}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={COLORS.neutral[400]}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Téléphone</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+33 6 12 34 56 78"
                    keyboardType="phone-pad"
                    placeholderTextColor={COLORS.neutral[400]}
                  />
                </View>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                >
                  <Save size={18} color={COLORS.neutral.white} />
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>

        {/* Security Section */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Lock size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Sécurité</Text>
            <TouchableOpacity
              onPress={handleSecurityEditToggle}
              style={styles.editButton}
            >
              <Edit size={20} color={COLORS.primary.DEFAULT} />
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {!securityEditMode ? (
              <View style={styles.securityDisplay}>
                <Text style={styles.securityLabel}>Mot de passe</Text>
                <Text style={styles.securityValue}>••••••••</Text>
                <Text style={styles.securityHint}>
                  Cliquez sur modifier pour changer
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Mot de passe actuel</Text>
                  <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="••••••••"
                    secureTextEntry
                    placeholderTextColor={COLORS.neutral[400]}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nouveau mot de passe</Text>
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="••••••••"
                    secureTextEntry
                    placeholderTextColor={COLORS.neutral[400]}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirmer le mot de passe</Text>
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    secureTextEntry
                    placeholderTextColor={COLORS.neutral[400]}
                  />
                </View>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleChangePassword}
                >
                  <Lock size={18} color={COLORS.neutral.white} />
                  <Text style={styles.saveButtonText}>
                    Changer le mot de passe
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>

        {/* Preferences Section */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Globe size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Préférences</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Moon size={20} color={COLORS.secondary[700]} />
                <Text style={styles.preferenceLabel}>Mode sombre</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={(value) => setTheme(value ? "dark" : "light")}
                trackColor={{
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Globe size={20} color={COLORS.secondary[700]} />
                <Text style={styles.preferenceLabel}>Langue</Text>
              </View>
              <TouchableOpacity style={styles.languageButton}>
                <Text style={styles.languageText}>{language}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Clock size={20} color={COLORS.secondary[700]} />
                <Text style={styles.preferenceLabel}>Fuseau horaire</Text>
              </View>
              <TouchableOpacity style={styles.languageButton}>
                <Text style={styles.languageText}>{timezone}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Ruler size={20} color={COLORS.secondary[700]} />
                <Text style={styles.preferenceLabel}>Unités</Text>
              </View>
              <TouchableOpacity style={styles.languageButton}>
                <Text style={styles.languageText}>{units}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Notifications Section */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Bell size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Bell size={20} color={COLORS.secondary[700]} />
                <Text style={styles.preferenceLabel}>Notifications push</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Text style={styles.preferenceLabel}>Notifications email</Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Text style={styles.preferenceLabel}>Notifications in-app</Text>
              </View>
              <Switch
                value={inAppNotifications}
                onValueChange={setInAppNotifications}
                trackColor={{
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
          </View>
        </Animated.View>

        {/* Privacy Section */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Shield size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Confidentialité</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Shield size={20} color={COLORS.secondary[700]} />
                <Text style={styles.preferenceLabel}>Partage de données</Text>
              </View>
              <Switch
                value={dataSharing}
                onValueChange={setDataSharing}
                trackColor={{
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLeft}>
                <Text style={styles.preferenceLabel}>Suivi analytique</Text>
              </View>
              <Switch
                value={analytics}
                onValueChange={setAnalytics}
                trackColor={{
                  false: COLORS.neutral[300],
                  true: COLORS.primary.DEFAULT,
                }}
                thumbColor={COLORS.neutral.white}
              />
            </View>
          </View>
        </Animated.View>

        {/* Children Profiles Section */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Users size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Profils enfants</Text>
          </View>
          <View style={styles.card}>
            {children && children.length > 0 ? (
              children.map((child, index) => (
                <View key={child.id}>
                  <TouchableOpacity
                    style={styles.childRow}
                    onPress={() =>
                      router.push(`/parent/child/details?id=${child.id}`)
                    }
                  >
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childAge}>{child.dateOfBirth}</Text>
                    </View>
                    <ArrowLeft
                      size={16}
                      color={COLORS.secondary[400]}
                      style={{ transform: [{ rotate: "180deg" }] }}
                    />
                  </TouchableOpacity>
                  {index < children.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noChildren}>Aucun enfant ajouté</Text>
            )}
            <TouchableOpacity
              style={styles.addChildButton}
              onPress={() => router.push("/(tabs)/children-tab")}
            >
              <Users size={18} color={COLORS.neutral.white} />
              <Text style={styles.addChildText}>Gérer les enfants</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Subscription Section */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Abonnement</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionPlan}>Plan actuel: Premium</Text>
              <Text style={styles.subscriptionDetails}>
                Renouvellement le 15/12/2024
              </Text>
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => router.push("/parent/profile/subscription")}
            >
              <CreditCard size={18} color={COLORS.neutral.white} />
              <Text style={styles.saveButtonText}>Gérer l'abonnement</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Help & Support Section */}
        <Animated.View
          entering={FadeInDown.delay(900).duration(400)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <HelpCircle size={20} color={COLORS.secondary[700]} />
            <Text style={styles.sectionTitle}>Aide & Support</Text>
          </View>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.helpRow}
              onPress={() => router.push("/parent/profile/help")}
            >
              <HelpCircle size={20} color={COLORS.secondary[700]} />
              <Text style={styles.helpText}>Centre d'aide</Text>
              <ArrowLeft
                size={16}
                color={COLORS.secondary[400]}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.helpRow}
              onPress={() => Alert.alert("Contact", "support@oumischool.com")}
            >
              <Text style={styles.helpText}>Contacter le support</Text>
              <ArrowLeft
                size={16}
                color={COLORS.secondary[400]}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.appVersion}>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // Blob Background
    blobContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      overflow: "hidden",
    },
    blob: {
      position: "absolute",
      borderRadius: 999,
      opacity: 0.1,
    },
    blob1: {
      width: 200,
      height: 200,
      backgroundColor: "#8B5CF6",
      top: -50,
      right: -50,
    },
    blob2: {
      width: 150,
      height: 150,
      backgroundColor: "#10B981",
      top: 80,
      left: -30,
    },
    editButton: {
      marginLeft: "auto",
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
    },
    profileDisplay: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    avatarContainer: {
      marginRight: 16,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: colors.input,
    },
    profileInfo: {
      flex: 1,
    },
    displayName: {
      fontFamily: FONTS.fredoka,
      fontSize: 18,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    displayEmail: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    displayPhone: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
    },
    avatarEditContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    avatarWrapper: {
      position: "relative",
    },
    cameraOverlay: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: COLORS.primary.DEFAULT,
      borderRadius: 16,
      width: 32,
      height: 32,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarHint: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: COLORS.secondary[600],
      marginTop: 8,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    headerCenter: {
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 20,
      color: colors.textPrimary,
    },
    headerBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#10B98115",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginTop: 2,
    },
    headerBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 10,
      color: "#10B981",
      fontWeight: "600",
    },
    placeholder: {
      width: 44,
    },
    // Hero Card
    heroCard: {
      marginHorizontal: 20,
      marginBottom: 24,
      borderRadius: 28,
      overflow: "hidden",
      shadowColor: "#8B5CF6",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 8,
    },
    heroGradient: {
      padding: 24,
      position: "relative",
      overflow: "hidden",
    },
    heroContent: {
      position: "relative",
      zIndex: 1,
    },
    heroTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    sparkleContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    heroLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
    },
    heroTitle: {
      fontFamily: FONTS.fredoka,
      fontSize: 28,
      color: COLORS.neutral.white,
      lineHeight: 34,
      marginBottom: 4,
    },
    heroBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: "flex-start",
      marginTop: 12,
    },
    heroBadgeText: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: "rgba(255,255,255,0.95)",
      fontWeight: "500",
    },
    heroCircle1: {
      position: "absolute",
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.1)",
      top: -30,
      right: -30,
    },
    heroCircle2: {
      position: "absolute",
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255,255,255,0.08)",
      bottom: -20,
      right: 50,
    },
    // Section
    section: {
      marginBottom: 24,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 14,
    },
    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    sectionTitle: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 18,
      shadowColor: isDark ? "#000" : COLORS.secondary.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    input: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: colors.textPrimary,
      backgroundColor: colors.input,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    },
    saveButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      padding: 14,
      marginTop: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    saveButtonText: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: COLORS.neutral.white,
    },
    preferenceRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
    },
    preferenceLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    preferenceLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: colors.textPrimary,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      marginVertical: 4,
    },
    languageButton: {
      backgroundColor: colors.input,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
    },
    languageText: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    childRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
    },
    childInfo: {
      flex: 1,
    },
    childName: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    childAge: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    noChildren: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      paddingVertical: 16,
    },
    addChildButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      padding: 14,
      marginTop: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    addChildText: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      fontWeight: "600",
      color: COLORS.neutral.white,
    },
    subscriptionInfo: {
      marginBottom: 16,
    },
    subscriptionPlan: {
      fontFamily: FONTS.fredoka,
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subscriptionDetails: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textSecondary,
    },
    helpRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
    },
    helpText: {
      fontFamily: FONTS.secondary,
      fontSize: 15,
      color: colors.textPrimary,
      flex: 1,
      marginLeft: 12,
    },
    appVersion: {
      alignItems: "center",
      paddingVertical: 24,
    },
    versionText: {
      fontFamily: FONTS.secondary,
      fontSize: 13,
      color: colors.textMuted,
    },
    securityDisplay: {
      alignItems: "center",
    },
    securityLabel: {
      fontFamily: FONTS.secondary,
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    securityValue: {
      fontFamily: FONTS.secondary,
      fontSize: 16,
      color: colors.textPrimary,
      letterSpacing: 2,
      marginBottom: 8,
    },
    securityHint: {
      fontFamily: FONTS.secondary,
      fontSize: 12,
      color: colors.textMuted,
    },
  });
