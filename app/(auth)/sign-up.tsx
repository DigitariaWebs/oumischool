import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  Users,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Check,
  Monitor,
  MapPin,
  UserPlus,
  Baby,
  BookOpen,
  Clock,
  Info,
  Crown,
  Calendar,
} from "lucide-react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeInRight,
  FadeOutLeft,
} from "react-native-reanimated";
import DateTimePicker from "@react-native-community/datetimepicker";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { ASSETS } from "@/config/assets";
import { SPACING, RADIUS } from "@/constants/tokens";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useRegister } from "@/hooks/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { loginSuccess } from "@/store/slices/authSlice";
import {
  useSubscriptionPlans,
  useCreateSubscription,
} from "@/hooks/api/subscriptions";
import type { SubscriptionPlan } from "@/hooks/api/subscriptions";
import { useSubjects } from "@/hooks/api/subjects";
import { useUpdateTutorProfile } from "@/hooks/api/tutors";
import { useCreateChild } from "@/hooks/api/parent";

const ROLE_COLORS = {
  parent: { main: "#6366F1", light: "#EEF2FF", dark: "#4338CA" },
  tutor: { main: "#10B981", light: "#D1FAE5", dark: "#059669" },
};

const GRADES = [
  { id: "PS", label: "Petite Section", short: "PS" },
  { id: "MS", label: "Moyenne Section", short: "MS" },
  { id: "GS", label: "Grande Section", short: "GS" },
  { id: "CP", label: "CP", short: "CP" },
  { id: "CE1", label: "CE1", short: "CE1" },
  { id: "CE2", label: "CE2", short: "CE2" },
  { id: "CM1", label: "CM1", short: "CM1" },
  { id: "CM2", label: "CM2", short: "CM2" },
];

type Role = "parent" | "tutor";
type StepId =
  | "role"
  | "account"
  | "plan"
  | "tutor-prefs"
  | "child"
  | "tutor-summary";

function getSteps(role: Role | null): StepId[] {
  if (role === "parent") return ["role", "account", "plan", "child"];
  if (role === "tutor")
    return ["role", "account", "tutor-prefs", "tutor-summary"];
  return ["role"];
}

function getTotalSteps(role: Role | null): number {
  return getSteps(role).length;
}

export default function SignUpScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const registerMutation = useRegister();
  const createSubscriptionMutation = useCreateSubscription();
  const updateTutorMutation = useUpdateTutorProfile();
  const createChildMutation = useCreateChild();

  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [sessionModes, setSessionModes] = useState({
    online: false,
    presential: false,
  });
  const [sessionTypes, setSessionTypes] = useState({
    individual: false,
    group: false,
  });
  const [hourlyRate, setHourlyRate] = useState("");
  const [bio, setBio] = useState("");

  const [childName, setChildName] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [childDateOfBirth, setChildDateOfBirth] = useState("");

  const steps = getSteps(role);
  const totalSteps = getTotalSteps(role);
  const currentStepId = steps[currentStep] ?? "role";
  const colors = role ? ROLE_COLORS[role] : ROLE_COLORS.parent;

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    } else {
      router.back();
    }
  };

  const handleSelectRole = (selected: Role) => {
    setRole(selected);
    setCurrentStep(1);
    setError(null);
  };

  const handleRegister = async () => {
    if (!role) return;
    if (!firstName || !email || !password) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (!acceptedTerms) {
      setError("Veuillez accepter les conditions d'utilisation");
      return;
    }
    setError(null);
    try {
      const data = await registerMutation.mutateAsync({
        email,
        password,
        role: role.toUpperCase() as "PARENT" | "TUTOR",
        firstName,
        lastName: lastName || firstName,
      });
      const appRole: "parent" | "tutor" =
        data.user.role.toUpperCase() === "TUTOR" ? "tutor" : "parent";
      dispatch(
        loginSuccess({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: `${firstName} ${lastName}`.trim(),
            role: appRole,
          },
          token: data.tokens.accessToken,
        }),
      );
      setCurrentStep(currentStep + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription échouée");
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handlePlanContinue = async () => {
    setError(null);
    if (selectedPlanId) {
      try {
        await createSubscriptionMutation.mutateAsync({
          planId: selectedPlanId,
        });
      } catch {
        // Non-blocking: subscription can be created later from profile
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleTutorPrefsContinue = async () => {
    setError(null);
    if (selectedSubjects.length === 0) {
      setError("Veuillez sélectionner au moins une matière");
      return;
    }
    if (!sessionModes.online && !sessionModes.presential) {
      setError("Veuillez choisir au moins un mode de cours");
      return;
    }
    if (!sessionTypes.individual && !sessionTypes.group) {
      setError("Veuillez choisir au moins un type de session");
      return;
    }

    const sessionPricing: Record<string, unknown> = {};
    const rate = parseFloat(hourlyRate) || 0;

    if (sessionTypes.individual) {
      sessionPricing.individual = {
        ...(sessionModes.online && {
          online: { pricePerStudent: rate, accepted: true },
        }),
        ...(sessionModes.presential && {
          presential: { pricePerStudent: rate, accepted: true },
        }),
      };
    }
    if (sessionTypes.group) {
      sessionPricing.group = {
        ...(sessionModes.online && {
          online: { pricePerStudent: rate, accepted: true },
        }),
        ...(sessionModes.presential && {
          presential: { pricePerStudent: rate, accepted: true },
        }),
      };
    }

    try {
      await updateTutorMutation.mutateAsync({
        subjects: selectedSubjects,
        sessionPricing,
        hourlyRate: rate || undefined,
        bio: bio || undefined,
      });
      setCurrentStep(currentStep + 1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour du profil",
      );
    }
  };

  const handleCreateChild = async () => {
    if (!childName || !childGrade || !childDateOfBirth) {
      setError("Veuillez remplir le nom, la date de naissance et le niveau");
      return;
    }
    setError(null);
    try {
      await createChildMutation.mutateAsync({
        name: childName,
        grade: childGrade,
        dateOfBirth: new Date(childDateOfBirth).toISOString(),
      });
      router.replace("/pricing");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création du profil enfant",
      );
    }
  };

  const handleFinishParent = () => {
    router.replace("/(tabs)");
  };

  const handleFinishTutor = () => {
    router.replace("/(tabs-tutor)");
  };

  const renderProgressBar = () => {
    if (currentStep === 0) return null;
    const progress = ((currentStep + 1) / totalSteps) * 100;
    return (
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress}%`, backgroundColor: colors.main },
          ]}
        />
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStepId) {
      case "role":
        return <RoleStep onSelect={handleSelectRole} />;
      case "account":
        return (
          <AccountStep
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            acceptedTerms={acceptedTerms}
            setAcceptedTerms={setAcceptedTerms}
            error={error}
            isLoading={registerMutation.isPending}
            onSubmit={handleRegister}
            role={role!}
            colors={colors}
          />
        );
      case "plan":
        return (
          <PlanStep
            selectedPlanId={selectedPlanId}
            onSelectPlan={handleSelectPlan}
            isCreating={createSubscriptionMutation.isPending}
            onContinue={handlePlanContinue}
            colors={colors}
          />
        );
      case "tutor-prefs":
        return (
          <TutorPrefsStep
            selectedSubjects={selectedSubjects}
            setSelectedSubjects={setSelectedSubjects}
            sessionModes={sessionModes}
            setSessionModes={setSessionModes}
            sessionTypes={sessionTypes}
            setSessionTypes={setSessionTypes}
            hourlyRate={hourlyRate}
            setHourlyRate={setHourlyRate}
            bio={bio}
            setBio={setBio}
            error={error}
            isLoading={updateTutorMutation.isPending}
            onSubmit={handleTutorPrefsContinue}
            colors={colors}
          />
        );
      case "child":
        return (
          <ChildStep
            childName={childName}
            setChildName={setChildName}
            childGrade={childGrade}
            setChildGrade={setChildGrade}
            childDateOfBirth={childDateOfBirth}
            setChildDateOfBirth={setChildDateOfBirth}
            error={error}
            isLoading={createChildMutation.isPending}
            onSubmit={handleCreateChild}
            onSkip={handleFinishParent}
            colors={colors}
          />
        );
      case "tutor-summary":
        return (
          <TutorSummaryStep
            firstName={firstName}
            lastName={lastName}
            email={email}
            selectedSubjects={selectedSubjects}
            sessionModes={sessionModes}
            sessionTypes={sessionTypes}
            hourlyRate={hourlyRate}
            bio={bio}
            onFinish={handleFinishTutor}
            colors={colors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            entering={FadeInUp.delay(200).duration(600)}
            style={styles.headerRow}
          >
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={22} color="#1E293B" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>{renderProgressBar()}</View>
            <View style={{ width: 44 }} />
          </Animated.View>

          {currentStepId === "role" && (
            <Animated.View
              entering={FadeInUp.delay(250).duration(600)}
              style={styles.logoContainer}
            >
              <Image
                source={ASSETS.logo}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
          )}

          {renderStepContent()}

          {currentStepId !== "role" && currentStepId !== "account" && (
            <Animated.View
              entering={FadeInDown.delay(600).duration(600)}
              style={styles.footer}
            >
              <Text style={styles.footerText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => router.push("/sign-in")}>
                <Text style={[styles.signInText, { color: colors.main }]}>
                  Se connecter
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function RoleStep({ onSelect }: { onSelect: (role: Role) => void }) {
  const router = useRouter();
  return (
    <Animated.View entering={FadeInRight.duration(500)} exiting={FadeOutLeft}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Créer un compte</Text>
        <Text style={styles.stepSubtitle}>
          Comment souhaitez-vous utiliser Oumi&apos;School ?
        </Text>
      </View>

      <View style={styles.roleCardsContainer}>
        <TouchableOpacity
          style={[styles.roleCard, { borderColor: ROLE_COLORS.parent.main }]}
          onPress={() => onSelect("parent")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.roleIconCircle,
              { backgroundColor: ROLE_COLORS.parent.light },
            ]}
          >
            <Users size={32} color={ROLE_COLORS.parent.main} />
          </View>
          <Text style={styles.roleCardTitle}>Je suis Parent</Text>
          <Text style={styles.roleCardDesc}>
            Trouvez des tuteurs qualifiés, suivez la progression de vos enfants
            et gérez leurs cours
          </Text>
          <View
            style={[
              styles.roleCardArrow,
              { backgroundColor: ROLE_COLORS.parent.main },
            ]}
          >
            <ChevronRight size={20} color="white" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, { borderColor: ROLE_COLORS.tutor.main }]}
          onPress={() => onSelect("tutor")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.roleIconCircle,
              { backgroundColor: ROLE_COLORS.tutor.light },
            ]}
          >
            <GraduationCap size={32} color={ROLE_COLORS.tutor.main} />
          </View>
          <Text style={styles.roleCardTitle}>Je suis Tuteur</Text>
          <Text style={styles.roleCardDesc}>
            Proposez vos cours en ligne ou en présentiel, gérez vos
            disponibilités et développez votre activité
          </Text>
          <View
            style={[
              styles.roleCardArrow,
              { backgroundColor: ROLE_COLORS.tutor.main },
            ]}
          >
            <ChevronRight size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Déjà un compte ? </Text>
        <TouchableOpacity onPress={() => router.push("/sign-in")}>
          <Text style={[styles.signInText, { color: ROLE_COLORS.parent.main }]}>
            Se connecter
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function AccountStep({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  acceptedTerms,
  setAcceptedTerms,
  error,
  isLoading,
  onSubmit,
  role,
  colors,
}: {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  acceptedTerms: boolean;
  setAcceptedTerms: (v: boolean) => void;
  error: string | null;
  isLoading: boolean;
  onSubmit: () => void;
  role: Role;
  colors: { main: string; light: string; dark: string };
}) {
  const router = useRouter();
  return (
    <Animated.View entering={FadeInRight.duration(500)} exiting={FadeOutLeft}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Vos informations</Text>
        <Text style={styles.stepSubtitle}>
          {role === "parent"
            ? "Créez votre compte parent"
            : "Créez votre compte tuteur"}
        </Text>
      </View>

      <View style={[styles.formCard, { borderTopColor: colors.main }]}>
        <View style={styles.nameRow}>
          <View style={{ flex: 1 }}>
            <Input
              label="Prénom"
              placeholder="Votre prénom"
              value={firstName}
              onChangeText={setFirstName}
              icon={<User size={18} color="#94A3B8" />}
              containerStyle={styles.inputContainer}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Nom"
              placeholder="Votre nom"
              value={lastName}
              onChangeText={setLastName}
              icon={<User size={18} color="#94A3B8" />}
              containerStyle={styles.inputContainer}
            />
          </View>
        </View>

        <Input
          label="Email"
          placeholder="votre@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          icon={<Mail size={18} color="#94A3B8" />}
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Mot de passe"
          placeholder="Min. 8 caractères"
          value={password}
          onChangeText={setPassword}
          isPassword
          icon={<Lock size={18} color="#94A3B8" />}
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Confirmer le mot de passe"
          placeholder="Retapez votre mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
          icon={<Lock size={18} color="#94A3B8" />}
          containerStyle={styles.inputContainer}
        />

        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              acceptedTerms && {
                backgroundColor: colors.main,
                borderColor: colors.main,
              },
            ]}
          >
            {acceptedTerms && <Check size={14} color="white" />}
          </View>
          <Text style={styles.termsText}>
            J&apos;accepte les{" "}
            <Text style={[styles.termsLink, { color: colors.main }]}>
              conditions d&apos;utilisation
            </Text>{" "}
            et la{" "}
            <Text style={[styles.termsLink, { color: colors.main }]}>
              politique de confidentialité
            </Text>
          </Text>
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title="Créer mon compte"
          onPress={onSubmit}
          isLoading={isLoading}
          fullWidth
          style={[styles.primaryButton, { backgroundColor: colors.main }]}
          icon={<ChevronRight size={20} color="white" />}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Déjà un compte ? </Text>
        <TouchableOpacity onPress={() => router.push("/sign-in")}>
          <Text style={[styles.signInText, { color: colors.main }]}>
            Se connecter
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function PlanStep({
  selectedPlanId,
  onSelectPlan,
  isCreating,
  onContinue,
  colors,
}: {
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
  isCreating: boolean;
  onContinue: () => void | Promise<void>;
  colors: { main: string; light: string; dark: string };
}) {
  const { data: plans = [], isLoading } = useSubscriptionPlans();

  return (
    <Animated.View entering={FadeInRight.duration(500)} exiting={FadeOutLeft}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Choisissez votre offre</Text>
        <Text style={styles.stepSubtitle}>
          Sélectionnez un plan pour profiter de toutes les fonctionnalités. Vous
          pourrez payer plus tard.
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.main}
          style={{ paddingVertical: 40 }}
        />
      ) : (
        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <PlanOptionCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlanId === plan.id}
              isPopular={plans.length >= 3 && index === 1}
              onSelect={() => onSelectPlan(plan.id)}
              colors={colors}
              delay={index * 100}
            />
          ))}
        </View>
      )}

      <View style={styles.planInfoCard}>
        <Info size={16} color={COLORS.info} />
        <Text style={styles.planInfoText}>
          Le paiement sera effectué plus tard depuis votre profil. Aucun
          prélèvement immédiat.
        </Text>
      </View>

      <Button
        title={selectedPlanId ? "Confirmer ce plan" : "Sélectionnez un plan"}
        onPress={onContinue}
        isLoading={isCreating}
        disabled={!selectedPlanId}
        fullWidth
        style={[
          styles.primaryButton,
          {
            backgroundColor: selectedPlanId
              ? colors.main
              : COLORS.secondary[200],
          },
        ]}
        textStyle={
          selectedPlanId ? undefined : { color: COLORS.secondary[600] }
        }
        icon={
          <ChevronRight
            size={20}
            color={selectedPlanId ? "white" : COLORS.secondary[600]}
          />
        }
      />
    </Animated.View>
  );
}

function PlanOptionCard({
  plan,
  isSelected,
  isPopular,
  onSelect,
  colors,
  delay,
}: {
  plan: SubscriptionPlan;
  isSelected: boolean;
  isPopular: boolean;
  onSelect: () => void;
  colors: { main: string; light: string; dark: string };
  delay: number;
}) {
  const { width } = useWindowDimensions();
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(500)}>
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && { borderColor: colors.main, borderWidth: 2 },
          isPopular &&
            !isSelected && { borderColor: COLORS.warning, borderWidth: 2 },
        ]}
        onPress={onSelect}
        activeOpacity={0.7}
      >
        {isPopular && (
          <View style={styles.popularBadge}>
            <Crown size={12} color={COLORS.warning} />
            <Text style={styles.popularBadgeText}>Populaire</Text>
          </View>
        )}

        <View style={styles.planCardHeader}>
          <View>
            <Text style={styles.planCardName}>{plan.name}</Text>
            {plan.description && (
              <Text style={[styles.planCardDesc, { maxWidth: width * 0.45 }]}>
                {plan.description}
              </Text>
            )}
          </View>
          <View style={styles.planPriceContainer}>
            <Text style={[styles.planPrice, { color: colors.main }]}>
              {plan.price}€
            </Text>
            <Text style={styles.planPricePeriod}>/mois</Text>
          </View>
        </View>

        <View style={styles.planFeaturesContainer}>
          {plan.features.slice(0, 4).map((feature, idx) => (
            <View key={idx} style={styles.planFeatureRow}>
              <Check
                size={14}
                color={isSelected ? colors.main : COLORS.secondary[400]}
                strokeWidth={3}
              />
              <Text style={styles.planFeatureText}>{feature}</Text>
            </View>
          ))}
          {plan.maxChildren && (
            <View style={styles.planFeatureRow}>
              <Check
                size={14}
                color={isSelected ? colors.main : COLORS.secondary[400]}
                strokeWidth={3}
              />
              <Text style={styles.planFeatureText}>
                Jusqu&apos;à {plan.maxChildren} enfant
                {plan.maxChildren > 1 ? "s" : ""}
              </Text>
            </View>
          )}
        </View>

        {isSelected && (
          <View
            style={[styles.selectedIndicator, { backgroundColor: colors.main }]}
          >
            <Check size={16} color="white" strokeWidth={3} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function TutorPrefsStep({
  selectedSubjects,
  setSelectedSubjects,
  sessionModes,
  setSessionModes,
  sessionTypes,
  setSessionTypes,
  hourlyRate,
  setHourlyRate,
  bio,
  setBio,
  error,
  isLoading,
  onSubmit,
  colors,
}: {
  selectedSubjects: string[];
  setSelectedSubjects: (v: string[]) => void;
  sessionModes: { online: boolean; presential: boolean };
  setSessionModes: (v: { online: boolean; presential: boolean }) => void;
  sessionTypes: { individual: boolean; group: boolean };
  setSessionTypes: (v: { individual: boolean; group: boolean }) => void;
  hourlyRate: string;
  setHourlyRate: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  error: string | null;
  isLoading: boolean;
  onSubmit: () => void;
  colors: { main: string; light: string; dark: string };
}) {
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();

  const toggleSubject = (name: string) => {
    if (selectedSubjects.includes(name)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== name));
    } else {
      setSelectedSubjects([...selectedSubjects, name]);
    }
  };

  return (
    <Animated.View entering={FadeInRight.duration(500)} exiting={FadeOutLeft}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Vos préférences</Text>
        <Text style={styles.stepSubtitle}>
          Configurez votre profil de tuteur pour que les parents puissent vous
          trouver
        </Text>
      </View>

      <View style={[styles.formCard, { borderTopColor: colors.main }]}>
        <Text style={styles.sectionLabel}>Matières enseignées</Text>
        {subjectsLoading ? (
          <ActivityIndicator
            size="small"
            color={colors.main}
            style={{ paddingVertical: 16 }}
          />
        ) : (
          <View style={styles.subjectGrid}>
            {subjects.map((subject) => {
              const isActive = selectedSubjects.includes(subject.name);
              return (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.subjectChip,
                    isActive && {
                      backgroundColor: colors.light,
                      borderColor: colors.main,
                    },
                  ]}
                  onPress={() => toggleSubject(subject.name)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.subjectDot,
                      { backgroundColor: subject.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.subjectChipText,
                      isActive && { color: colors.dark, fontWeight: "700" },
                    ]}
                  >
                    {subject.name}
                  </Text>
                  {isActive && (
                    <Check size={14} color={colors.main} strokeWidth={3} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>
          Mode de cours
        </Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleCard,
              sessionModes.online && {
                backgroundColor: colors.light,
                borderColor: colors.main,
              },
            ]}
            onPress={() =>
              setSessionModes({
                ...sessionModes,
                online: !sessionModes.online,
              })
            }
            activeOpacity={0.7}
          >
            <Monitor
              size={24}
              color={sessionModes.online ? colors.main : COLORS.secondary[400]}
            />
            <Text
              style={[
                styles.toggleCardText,
                sessionModes.online && {
                  color: colors.dark,
                  fontWeight: "700",
                },
              ]}
            >
              En ligne
            </Text>
            {sessionModes.online && (
              <View
                style={[styles.toggleCheck, { backgroundColor: colors.main }]}
              >
                <Check size={12} color="white" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleCard,
              sessionModes.presential && {
                backgroundColor: colors.light,
                borderColor: colors.main,
              },
            ]}
            onPress={() =>
              setSessionModes({
                ...sessionModes,
                presential: !sessionModes.presential,
              })
            }
            activeOpacity={0.7}
          >
            <MapPin
              size={24}
              color={
                sessionModes.presential ? colors.main : COLORS.secondary[400]
              }
            />
            <Text
              style={[
                styles.toggleCardText,
                sessionModes.presential && {
                  color: colors.dark,
                  fontWeight: "700",
                },
              ]}
            >
              En présentiel
            </Text>
            {sessionModes.presential && (
              <View
                style={[styles.toggleCheck, { backgroundColor: colors.main }]}
              >
                <Check size={12} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>
          Type de session
        </Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleCard,
              sessionTypes.individual && {
                backgroundColor: colors.light,
                borderColor: colors.main,
              },
            ]}
            onPress={() =>
              setSessionTypes({
                ...sessionTypes,
                individual: !sessionTypes.individual,
              })
            }
            activeOpacity={0.7}
          >
            <User
              size={24}
              color={
                sessionTypes.individual ? colors.main : COLORS.secondary[400]
              }
            />
            <Text
              style={[
                styles.toggleCardText,
                sessionTypes.individual && {
                  color: colors.dark,
                  fontWeight: "700",
                },
              ]}
            >
              Individuel
            </Text>
            {sessionTypes.individual && (
              <View
                style={[styles.toggleCheck, { backgroundColor: colors.main }]}
              >
                <Check size={12} color="white" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleCard,
              sessionTypes.group && {
                backgroundColor: colors.light,
                borderColor: colors.main,
              },
            ]}
            onPress={() =>
              setSessionTypes({
                ...sessionTypes,
                group: !sessionTypes.group,
              })
            }
            activeOpacity={0.7}
          >
            <Users
              size={24}
              color={sessionTypes.group ? colors.main : COLORS.secondary[400]}
            />
            <Text
              style={[
                styles.toggleCardText,
                sessionTypes.group && {
                  color: colors.dark,
                  fontWeight: "700",
                },
              ]}
            >
              En groupe
            </Text>
            {sessionTypes.group && (
              <View
                style={[styles.toggleCheck, { backgroundColor: colors.main }]}
              >
                <Check size={12} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>
          Tarif horaire
        </Text>
        <View style={styles.rateInputContainer}>
          <TextInput
            style={styles.rateInput}
            value={hourlyRate}
            onChangeText={(text) => setHourlyRate(text.replace(/[^0-9.]/g, ""))}
            placeholder="0"
            keyboardType="decimal-pad"
            placeholderTextColor={COLORS.secondary[300]}
          />
          <Text style={styles.rateSuffix}>€ / heure</Text>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>
          Bio (optionnel)
        </Text>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={setBio}
          placeholder="Présentez-vous en quelques mots..."
          multiline
          numberOfLines={3}
          maxLength={300}
          textAlignVertical="top"
          placeholderTextColor={COLORS.secondary[300]}
        />
        <Text style={styles.charCount}>{bio.length}/300</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title="Continuer"
          onPress={onSubmit}
          isLoading={isLoading}
          fullWidth
          style={[styles.primaryButton, { backgroundColor: colors.main }]}
          icon={<ChevronRight size={20} color="white" />}
        />
      </View>
    </Animated.View>
  );
}

function ChildStep({
  childName,
  setChildName,
  childGrade,
  setChildGrade,
  childDateOfBirth,
  setChildDateOfBirth,
  error,
  isLoading,
  onSubmit,
  onSkip,
  colors,
}: {
  childName: string;
  setChildName: (v: string) => void;
  childGrade: string;
  setChildGrade: (v: string) => void;
  childDateOfBirth: string;
  setChildDateOfBirth: (v: string) => void;
  error: string | null;
  isLoading: boolean;
  onSubmit: () => void;
  onSkip: () => void;
  colors: { main: string; light: string; dark: string };
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getDefaultDate = (): Date => {
    if (childDateOfBirth) return new Date(childDateOfBirth);
    const d = new Date();
    d.setFullYear(d.getFullYear() - 10);
    return d;
  };

  const getMaxDate = (): Date => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 3);
    return d;
  };

  const getMinDate = (): Date => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d;
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) {
      setChildDateOfBirth(selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <Animated.View entering={FadeInRight.duration(500)} exiting={FadeOutLeft}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Votre enfant</Text>
        <Text style={styles.stepSubtitle}>
          Ajoutez le profil de votre premier enfant. Vous pourrez en ajouter
          d&apos;autres plus tard.
        </Text>
      </View>

      <View style={[styles.formCard, { borderTopColor: colors.main }]}>
        <Input
          label="Prénom de l'enfant"
          placeholder="Ex: Adam, Sofia..."
          value={childName}
          onChangeText={setChildName}
          icon={<Baby size={18} color="#94A3B8" />}
          containerStyle={styles.inputContainer}
        />

        <Text style={styles.sectionLabel}>Date de naissance</Text>
        <TouchableOpacity
          style={[
            styles.datePickerButton,
            childDateOfBirth && { borderColor: colors.main },
          ]}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <Calendar
            size={18}
            color={childDateOfBirth ? colors.main : "#94A3B8"}
          />
          <Text
            style={[
              styles.datePickerText,
              !childDateOfBirth && styles.datePickerPlaceholder,
              childDateOfBirth && { color: COLORS.secondary[800] },
            ]}
          >
            {childDateOfBirth
              ? formatDateForDisplay(childDateOfBirth)
              : "Sélectionner la date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={getDefaultDate()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            maximumDate={getMaxDate()}
            minimumDate={getMinDate()}
            locale="fr-FR"
          />
        )}

        <Text style={styles.sectionLabel}>Niveau scolaire</Text>
        <Text style={styles.sectionHint}>
          Sélectionnez le niveau actuel de votre enfant
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gradesContainer}
        >
          {GRADES.map((g) => (
            <TouchableOpacity
              key={g.id}
              style={[
                styles.gradePill,
                childGrade === g.id && {
                  borderColor: colors.main,
                  backgroundColor: colors.main,
                },
              ]}
              onPress={() => setChildGrade(g.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.gradeText,
                  childGrade === g.id && styles.gradeTextActive,
                ]}
              >
                {g.short}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {childGrade && (
          <Animated.View
            entering={FadeInRight.duration(400)}
            style={[styles.selectedGradeCard, { borderLeftColor: colors.main }]}
          >
            <BookOpen size={16} color={colors.main} />
            <Text style={[styles.selectedGradeText, { color: colors.dark }]}>
              {GRADES.find((g) => g.id === childGrade)?.label}
            </Text>
          </Animated.View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title="Ajouter et continuer"
          onPress={onSubmit}
          isLoading={isLoading}
          fullWidth
          disabled={!childName || !childGrade || !childDateOfBirth}
          style={[styles.primaryButton, { backgroundColor: colors.main }]}
          icon={<UserPlus size={20} color="white" />}
        />

        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Passer cette étape</Text>
          <ChevronRight size={16} color={COLORS.secondary[400]} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function TutorSummaryStep({
  firstName,
  lastName,
  email,
  selectedSubjects,
  sessionModes,
  sessionTypes,
  hourlyRate,
  bio,
  onFinish,
  colors,
}: {
  firstName: string;
  lastName: string;
  email: string;
  selectedSubjects: string[];
  sessionModes: { online: boolean; presential: boolean };
  sessionTypes: { individual: boolean; group: boolean };
  hourlyRate: string;
  bio: string;
  onFinish: () => void;
  colors: { main: string; light: string; dark: string };
}) {
  const modes = [
    sessionModes.online && "En ligne",
    sessionModes.presential && "En présentiel",
  ].filter(Boolean);
  const types = [
    sessionTypes.individual && "Individuel",
    sessionTypes.group && "En groupe",
  ].filter(Boolean);

  return (
    <Animated.View entering={FadeInRight.duration(500)} exiting={FadeOutLeft}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Récapitulatif</Text>
        <Text style={styles.stepSubtitle}>
          Vérifiez vos informations avant de commencer
        </Text>
      </View>

      <View style={[styles.summaryCard, { borderTopColor: colors.main }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Nom</Text>
          <Text style={styles.summaryValue}>
            {firstName} {lastName}
          </Text>
        </View>
        <View style={styles.summaryDivider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Email</Text>
          <Text style={styles.summaryValue}>{email}</Text>
        </View>
        <View style={styles.summaryDivider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Matières</Text>
          <View style={styles.summaryChips}>
            {selectedSubjects.map((s, i) => (
              <View
                key={i}
                style={[styles.summaryChip, { backgroundColor: colors.light }]}
              >
                <Text style={[styles.summaryChipText, { color: colors.dark }]}>
                  {s}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.summaryDivider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Modes</Text>
          <Text style={styles.summaryValue}>{modes.join(", ")}</Text>
        </View>
        <View style={styles.summaryDivider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Types</Text>
          <Text style={styles.summaryValue}>{types.join(", ")}</Text>
        </View>
        <View style={styles.summaryDivider} />

        {hourlyRate && (
          <>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tarif</Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: colors.main, fontWeight: "700" },
                ]}
              >
                {hourlyRate}€/h
              </Text>
            </View>
            <View style={styles.summaryDivider} />
          </>
        )}

        {bio && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Bio</Text>
            <Text style={[styles.summaryValue, { flex: 1 }]} numberOfLines={3}>
              {bio}
            </Text>
          </View>
        )}
      </View>

      <Animated.View
        entering={FadeInUp.delay(200).duration(500)}
        style={styles.approvalNotice}
      >
        <View style={styles.approvalIconContainer}>
          <Clock size={20} color={COLORS.warning} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.approvalTitle}>En attente de validation</Text>
          <Text style={styles.approvalDesc}>
            Votre profil sera examiné par notre équipe. Vous serez notifié une
            fois votre compte approuvé.
          </Text>
        </View>
      </Animated.View>

      <Button
        title="Commencer"
        onPress={onFinish}
        fullWidth
        style={[styles.primaryButton, { backgroundColor: colors.main }]}
        icon={<Sparkles size={20} color="white" />}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  progressContainer: {
    height: 6,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
  },
  stepHeader: {
    marginBottom: 24,
    alignItems: "center",
  },
  stepTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 26,
    color: COLORS.secondary[900],
    marginBottom: 8,
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.secondary[500],
    textAlign: "center",
    paddingHorizontal: 10,
    lineHeight: 20,
  },

  // Role Step
  roleCardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    shadowColor: COLORS.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: "relative",
  },
  roleIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  roleCardTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
    marginBottom: 8,
  },
  roleCardDesc: {
    fontSize: 14,
    color: COLORS.secondary[500],
    lineHeight: 20,
    marginBottom: 8,
  },
  roleCardArrow: {
    position: "absolute",
    top: 24,
    right: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  // Form Card
  formCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderTopWidth: 4,
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputContainer: {
    marginBottom: 14,
  },

  // Terms
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.secondary[300],
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.secondary[500],
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: "600",
  },

  // Buttons
  primaryButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 30,
  },

  // Error
  errorText: {
    color: COLORS.error.DEFAULT,
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.secondary[500],
  },
  signInText: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Plan Step
  plansContainer: {
    gap: 12,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    position: "relative",
    overflow: "hidden",
  },
  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.warning,
  },
  planCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  planCardName: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  planCardDesc: {
    fontSize: 12,
    color: COLORS.secondary[500],
    marginTop: 2,
  },
  planPriceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planPrice: {
    fontFamily: FONTS.fredoka,
    fontSize: 28,
    fontWeight: "700",
  },
  planPricePeriod: {
    fontSize: 13,
    color: COLORS.secondary[400],
    marginLeft: 2,
  },
  planFeaturesContainer: {
    gap: 6,
  },
  planFeatureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planFeatureText: {
    fontSize: 13,
    color: COLORS.secondary[600],
  },
  selectedIndicator: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  planInfoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: COLORS.info + "10",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  planInfoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.secondary[600],
    lineHeight: 18,
  },

  // Tutor Prefs Step
  sectionLabel: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 10,
  },
  sectionHint: {
    fontSize: 13,
    color: COLORS.secondary[400],
    marginBottom: 12,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  datePickerText: {
    fontSize: 15,
    color: COLORS.secondary[800],
  },
  datePickerPlaceholder: {
    color: COLORS.secondary[400],
  },
  subjectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  subjectChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subjectChipText: {
    fontSize: 13,
    color: COLORS.secondary[600],
    fontWeight: "500",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 12,
  },
  toggleCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: COLORS.neutral[100],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: 16,
    gap: 8,
    position: "relative",
  },
  toggleCardText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.secondary[600],
  },
  toggleCheck: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    paddingHorizontal: 16,
    height: 48,
  },
  rateInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: FONTS.fredoka,
    fontWeight: "700",
    color: COLORS.secondary[900],
  },
  rateSuffix: {
    fontSize: 14,
    color: COLORS.secondary[400],
    fontWeight: "500",
  },
  bioInput: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    padding: 14,
    fontSize: 14,
    color: COLORS.secondary[900],
    minHeight: 80,
    fontFamily: FONTS.secondary,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: COLORS.secondary[300],
    marginTop: 4,
    marginBottom: 8,
  },

  // Child Step
  gradesContainer: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 12,
  },
  gradePill: {
    minWidth: 60,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.neutral[200],
    alignItems: "center",
    justifyContent: "center",
  },
  gradeText: {
    fontFamily: FONTS.fredoka,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.secondary[700],
  },
  gradeTextActive: {
    color: COLORS.neutral.white,
  },
  selectedGradeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.neutral[50],
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedGradeText: {
    fontFamily: FONTS.fredoka,
    fontSize: 14,
    fontWeight: "600",
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 12,
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
    color: COLORS.secondary[400],
    fontWeight: "500",
  },

  // Summary Step
  summaryCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderTopWidth: 4,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.secondary[400],
    fontWeight: "500",
    width: 80,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.secondary[800],
    fontWeight: "600",
    textAlign: "right",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
  },
  summaryChips: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "flex-end",
  },
  summaryChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  summaryChipText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Approval Notice
  approvalNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  approvalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  approvalTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 4,
  },
  approvalDesc: {
    fontSize: 13,
    color: COLORS.secondary[600],
    lineHeight: 18,
  },
});
