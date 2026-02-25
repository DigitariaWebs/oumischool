import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Bell,
  Calendar,
  MessageSquare,
  Star,
  CreditCard,
  AlertCircle,
  Sparkles,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { useParentMe, useUpdateParentProfile } from "@/hooks/api/parent";

interface NotificationSettingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  delay: number;
}

const NotificationSetting: React.FC<NotificationSettingProps> = ({
  icon,
  title,
  description,
  value,
  onValueChange,
  delay,
}) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: "#E2E8F0",
          true: "#6366F1",
        }}
        thumbColor="white"
      />
    </View>
  </Animated.View>
);

export default function ParentNotificationsScreen() {
  const router = useRouter();
  const { data: parentProfile } = useParentMe();
  const updateParentProfile = useUpdateParentProfile();

  const [sessionReminders, setSessionReminders] = useState(true);
  const [sessionConfirmations, setSessionConfirmations] = useState(true);
  const [sessionCancellations, setSessionCancellations] = useState(true);
  const [messages, setMessages] = useState(true);
  const [messageReplies, setMessageReplies] = useState(true);
  const [reviews, setReviews] = useState(true);
  const [newReviews, setNewReviews] = useState(true);
  const [payments, setPayments] = useState(true);
  const [receipts, setReceipts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);
  const [promotions, setPromotions] = useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    if (parentProfile?.notificationPreferences && !initialized.current) {
      initialized.current = true;
      const np = parentProfile.notificationPreferences as Record<string, boolean>;
      if (np.sessionReminders !== undefined) setSessionReminders(np.sessionReminders);
      if (np.sessionConfirmations !== undefined) setSessionConfirmations(np.sessionConfirmations);
      if (np.sessionCancellations !== undefined) setSessionCancellations(np.sessionCancellations);
      if (np.messages !== undefined) setMessages(np.messages);
      if (np.messageReplies !== undefined) setMessageReplies(np.messageReplies);
      if (np.reviews !== undefined) setReviews(np.reviews);
      if (np.newReviews !== undefined) setNewReviews(np.newReviews);
      if (np.payments !== undefined) setPayments(np.payments);
      if (np.receipts !== undefined) setReceipts(np.receipts);
      if (np.systemUpdates !== undefined) setSystemUpdates(np.systemUpdates);
      if (np.promotions !== undefined) setPromotions(np.promotions);
    }
  }, [parentProfile]);

  const handleToggle = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    const current = (parentProfile?.notificationPreferences as Record<string, unknown>) ?? {};
    updateParentProfile.mutate({ notificationPreferences: { ...current, [key]: value } });
  };

  const notificationSettings = [
    {
      section: "Sessions",
      icon: <Calendar size={18} color="#6366F1" />,
      settings: [
        {
          icon: <Calendar size={18} color="#6366F1" />,
          title: "Rappels de session",
          description: "Notification 1h avant chaque session",
          value: sessionReminders,
          onValueChange: (v: boolean) => handleToggle("sessionReminders", v, setSessionReminders),
        },
        {
          icon: <Calendar size={18} color="#6366F1" />,
          title: "Confirmations",
          description: "Confirmation de réservation",
          value: sessionConfirmations,
          onValueChange: (v: boolean) => handleToggle("sessionConfirmations", v, setSessionConfirmations),
        },
        {
          icon: <AlertCircle size={18} color="#6366F1" />,
          title: "Annulations",
          description: "Notification d'annulation",
          value: sessionCancellations,
          onValueChange: (v: boolean) => handleToggle("sessionCancellations", v, setSessionCancellations),
        },
      ],
    },
    {
      section: "Messages",
      icon: <MessageSquare size={18} color="#10B981" />,
      settings: [
        {
          icon: <MessageSquare size={18} color="#10B981" />,
          title: "Nouveaux messages",
          description: "Messages des tuteurs",
          value: messages,
          onValueChange: (v: boolean) => handleToggle("messages", v, setMessages),
        },
        {
          icon: <MessageSquare size={18} color="#10B981" />,
          title: "Réponses",
          description: "Réponses à vos messages",
          value: messageReplies,
          onValueChange: (v: boolean) => handleToggle("messageReplies", v, setMessageReplies),
        },
      ],
    },
    {
      section: "Avis & Notes",
      icon: <Star size={18} color="#F59E0B" />,
      settings: [
        {
          icon: <Star size={18} color="#F59E0B" />,
          title: "Demandes d'avis",
          description: "Après chaque session",
          value: reviews,
          onValueChange: (v: boolean) => handleToggle("reviews", v, setReviews),
        },
        {
          icon: <Star size={18} color="#F59E0B" />,
          title: "Nouveaux avis",
          description: "Avis reçus des tuteurs",
          value: newReviews,
          onValueChange: (v: boolean) => handleToggle("newReviews", v, setNewReviews),
        },
      ],
    },
    {
      section: "Paiements",
      icon: <CreditCard size={18} color="#8B5CF6" />,
      settings: [
        {
          icon: <CreditCard size={18} color="#8B5CF6" />,
          title: "Confirmations de paiement",
          description: "Paiements effectués",
          value: payments,
          onValueChange: (v: boolean) => handleToggle("payments", v, setPayments),
        },
        {
          icon: <CreditCard size={18} color="#8B5CF6" />,
          title: "Reçus",
          description: "Reçus de paiement",
          value: receipts,
          onValueChange: (v: boolean) => handleToggle("receipts", v, setReceipts),
        },
      ],
    },
    {
      section: "Général",
      icon: <Bell size={18} color="#64748B" />,
      settings: [
        {
          icon: <Bell size={18} color="#64748B" />,
          title: "Mises à jour",
          description: "Nouvelles fonctionnalités",
          value: systemUpdates,
          onValueChange: (v: boolean) => handleToggle("systemUpdates", v, setSystemUpdates),
        },
        {
          icon: <Bell size={18} color="#64748B" />,
          title: "Promotions",
          description: "Offres et réductions",
          value: promotions,
          onValueChange: (v: boolean) => handleToggle("promotions", v, setPromotions),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Boule violette décorative */}
      <View style={styles.purpleBlob} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={22} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerRight}>
            <Sparkles size={16} color="#6366F1" />
          </View>
        </View>

        {/* Description */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.description}>
          <Text style={styles.descriptionText}>
            Gérez vos préférences de notification pour rester informé de ce qui est important.
          </Text>
        </Animated.View>

        {/* Notification Settings */}
        {notificationSettings.map((group, groupIndex) => (
          <Animated.View
            key={groupIndex}
            entering={FadeInDown.delay(200 + groupIndex * 100).duration(400)}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>{group.icon}</View>
              <Text style={styles.sectionTitle}>{group.section}</Text>
            </View>
            <View style={styles.card}>
              {group.settings.map((setting, settingIndex) => (
                <View key={settingIndex}>
                  <NotificationSetting
                    {...setting}
                    delay={250 + groupIndex * 100 + settingIndex * 50}
                  />
                  {settingIndex < group.settings.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Bouton Add source */}
        <TouchableOpacity style={styles.sourceButton}>
          <Bell size={16} color="#64748B" />
          <Text style={styles.sourceButtonText}>Paramètres avancés</Text>
        </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 40,
    zIndex: 1,
  },
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
  description: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#64748B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 6,
  },
  sourceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
});
