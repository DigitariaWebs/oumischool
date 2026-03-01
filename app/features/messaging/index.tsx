import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import {
  Search,
  MessageSquarePlus,
  MessageCircle,
  Users,
  Clock,
  ArrowLeft,
  Sparkles,
} from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { FONTS } from "@/config/fonts";
import { useConversations, useUnreadCount } from "@/hooks/api/messaging";

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: "tutor" | "parent";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

// Images pour les avatars
const avatarImages = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140049.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140050.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
];

function avatarFor(id: string): string {
  let sum = 0;
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i);
  return avatarImages[sum % avatarImages.length];
}

const ConversationCard: React.FC<{
  conversation: Conversation;
  delay: number;
  onPress: () => void;
}> = ({ conversation, delay, onPress }) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.conversationAvatar}>
          <Image
            source={{ uri: conversation.participantAvatar }}
            style={styles.avatar}
          />
          {conversation.isOnline && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.participantName}>
              {conversation.participantName}
            </Text>
            <Text style={styles.messageTime}>
              {formatTime(conversation.lastMessageTime)}
            </Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
        </View>
        {conversation.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function MessagingScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { data: conversationsData = [] } = useConversations({
    enabled: isFocused,
  });
  const { data: unreadData } = useUnreadCount({ enabled: isFocused });
  const [searchQuery, setSearchQuery] = useState("");
  const conversationRows = Array.isArray(conversationsData)
    ? conversationsData
    : [];
  const conversations: Conversation[] = conversationRows.map((conversation) => {
    const participant = conversation.participants[0];
    const participantName =
      participant?.name || participant?.email || "Conversation";
    const participantId =
      participant?.id ?? conversation.participantIds[0] ?? conversation.id;
    return {
      id: conversation.id,
      participantId,
      participantName,
      participantAvatar: avatarFor(participantId),
      participantRole: participant?.role === "PARENT" ? "parent" : "tutor",
      lastMessage: conversation.lastMessage ?? "Aucun message",
      lastMessageTime: conversation.lastMessageAt
        ? new Date(conversation.lastMessageAt)
        : new Date(),
      unreadCount: conversation.unreadCount ?? 0,
      isOnline: false,
    };
  });

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalUnread =
    (typeof unreadData?.unreadCount === "number"
      ? unreadData.unreadCount
      : undefined) ??
    conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const onlineTutors = conversations.filter((c) => c.isOnline).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.newMessageButton}
          onPress={() => router.push("/messaging/new")}
        >
          <MessageSquarePlus size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "#8B5CF615" }]}>
              <MessageCircle size={16} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>
              {totalUnread > 0
                ? `${totalUnread} non lu${totalUnread > 1 ? "s" : ""}`
                : "Tout lu"}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "#10B98115" }]}>
              <Users size={16} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{onlineTutors} en ligne</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "#F59E0B15" }]}>
              <Clock size={16} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{conversations.length} conv</Text>
          </View>
        </View>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une conversation..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Liste des conversations */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          totalUnread > 0 ? (
            <View style={styles.sectionHeader}>
              <Sparkles size={16} color="#6366F1" />
              <Text style={styles.sectionTitle}>
                {totalUnread} nouveau{totalUnread > 1 ? "x" : ""} message
                {totalUnread > 1 ? "s" : ""}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <ConversationCard
            conversation={item}
            delay={200 + index * 50}
            onPress={() => router.push(`/messaging/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MessageSquarePlus size={48} color="#CBD5E1" />
            <Text style={styles.emptyStateTitle}>Aucune conversation</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? "Aucun résultat trouvé"
                : "Commencez une conversation avec vos tuteurs"}
            </Text>
          </View>
        }
      />

      {/* Bouton Add source */}
      <TouchableOpacity
        style={styles.sourceButton}
        onPress={() => router.push("/messaging/new")}
      >
        <Text style={styles.sourceButtonText}>+ Nouveau message</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header
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
    fontSize: 22,
    color: "#1E293B",
  },
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  // Stats Card
  statsCard: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    color: "#1E293B",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#F1F5F9",
  },

  // Search
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
  },

  // Section
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },

  // Conversation Card
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  conversationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  conversationAvatar: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#F8FAFC",
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  participantName: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#1E293B",
  },
  messageTime: {
    fontSize: 11,
    color: "#94A3B8",
  },
  lastMessage: {
    fontSize: 13,
    color: "#64748B",
  },
  unreadBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 11,
    color: "white",
    fontWeight: "700",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },

  // Source Button
  sourceButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#F1F5F9",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceButtonText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
  },
});
