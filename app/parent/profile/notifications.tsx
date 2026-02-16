import React, { useState } from "react";
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
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

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
          false: COLORS.neutral[300],
          true: COLORS.primary.DEFAULT,
        }}
        thumbColor={COLORS.neutral.white}
      />
    </View>
  </Animated.View>
);

export default function ParentNotificationsScreen() {
  const router = useRouter();

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

  const notificationSettings = [
    {
      section: "Sessions",
      icon: <Calendar size={20} color={COLORS.primary.DEFAULT} />,
      settings: [
        {
          icon: <Calendar size={20} color={COLORS.primary[600]} />,
          title: "Rappels de session",
          description: "Notification 1h avant chaque session",
          value: sessionReminders,
          onValueChange: setSessionReminders,
        },
        {
          icon: <Calendar size={20} color={COLORS.primary[600]} />,
          title: "Confirmations",
          description: "Confirmation de réservation",
          value: sessionConfirmations,
          onValueChange: setSessionConfirmations,
        },
        {
          icon: <AlertCircle size={20} color={COLORS.primary[600]} />,
          title: "Annulations",
          description: "Notification d'annulation",
          value: sessionCancellations,
          onValueChange: setSessionCancellations,
        },
      ],
    },
    {
      section: "Messages",
      icon: <MessageSquare size={20} color="#10B981" />,
      settings: [
        {
          icon: <MessageSquare size={20} color="#10B981" />,
          title: "Nouveaux messages",
          description: "Messages des tuteurs",
          value: messages,
          onValueChange: setMessages,
        },
        {
          icon: <MessageSquare size={20} color="#10B981" />,
          title: "Réponses",
          description: "Réponses à vos messages",
          value: messageReplies,
          onValueChange: setMessageReplies,
        },
      ],
    },
    {
      section: "Avis & Notes",
      icon: <Star size={20} color="#F59E0B" />,
      settings: [
        {
          icon: <Star size={20} color="#F59E0B" />,
          title: "Demandes d'avis",
          description: "Après chaque session",
          value: reviews,
          onValueChange: setReviews,
        },
        {
          icon: <Star size={20} color="#F59E0B" />,
          title: "Nouveaux avis",
          description: "Avis reçus des tuteurs",
          value: newReviews,
          onValueChange: setNewReviews,
        },
      ],
    },
    {
      section: "Paiements",
      icon: <CreditCard size={20} color="#8B5CF6" />,
      settings: [
        {
          icon: <CreditCard size={20} color="#8B5CF6" />,
          title: "Confirmations de paiement",
          description: "Paiements effectués",
          value: payments,
          onValueChange: setPayments,
        },
        {
          icon: <CreditCard size={20} color="#8B5CF6" />,
          title: "Reçus",
          description: "Reçus de paiement",
          value: receipts,
          onValueChange: setReceipts,
        },
      ],
    },
    {
      section: "Général",
      icon: <Bell size={20} color={COLORS.secondary[600]} />,
      settings: [
        {
          icon: <Bell size={20} color={COLORS.secondary[600]} />,
          title: "Mises à jour",
          description: "Nouvelles fonctionnalités",
          value: systemUpdates,
          onValueChange: setSystemUpdates,
        },
        {
          icon: <Bell size={20} color={COLORS.secondary[600]} />,
          title: "Promotions",
          description: "Offres et réductions",
          value: promotions,
          onValueChange: setPromotions,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={COLORS.secondary[900]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Description */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.description}
        >
          <Text style={styles.descriptionText}>
            Gérez vos préférences de notification pour rester informé de tout ce
            qui est important pour vous.
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
              {group.icon}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 20,
    color: COLORS.secondary[900],
  },
  placeholder: {
    width: 40,
  },
  description: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  descriptionText: {
    fontFamily: FONTS.secondary,
    fontSize: 14,
    color: COLORS.secondary[600],
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: COLORS.secondary[900],
  },
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.secondary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: FONTS.secondary,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.secondary[900],
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.secondary[500],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
    marginVertical: 4,
  },
});
