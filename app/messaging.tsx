import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, MessageSquarePlus } from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { SPACING } from "@/constants/tokens";
import { ConversationCard } from "@/components/messaging/ConversationCard";
import { EmptyState, LoadingState } from "@/components/ui";
import { useDebounce } from "@/hooks/useDebounce";

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

// Mock data - replace with real data from store/API
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participantId: "tutor-1",
    participantName: "Marie Dupont",
    participantAvatar: "https://via.placeholder.com/100",
    participantRole: "tutor",
    lastMessage: "Bonjour, je confirme la séance de maths pour demain à 14h.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "conv-2",
    participantId: "tutor-2",
    participantName: "Jean Martin",
    participantAvatar: "https://via.placeholder.com/100",
    participantRole: "tutor",
    lastMessage:
      "Les devoirs de sciences sont prêts. Emma peut commencer quand elle veut.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "conv-3",
    participantId: "tutor-3",
    participantName: "Sophie Leroy",
    participantAvatar: "https://via.placeholder.com/100",
    participantRole: "tutor",
    lastMessage: "Merci pour votre confiance ! À bientôt.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "conv-4",
    participantId: "tutor-4",
    participantName: "Pierre Dubois",
    participantAvatar: "https://via.placeholder.com/100",
    participantRole: "tutor",
    lastMessage: "Le prochain cours d'anglais est prévu pour lundi prochain.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unreadCount: 1,
    isOnline: false,
  },
];

export default function MessagingScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredConversations = mockConversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const totalUnread = mockConversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0,
  );

  const handleConversationPress = (conversationId: string) => {
    router.push(`/messaging/${conversationId}`);
  };

  const handleNewMessage = () => {
    // Navigate to tutor selection or contact list
    router.push("/messaging/new");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Messages</Text>
          {totalUnread > 0 && (
            <Text style={styles.headerSubtitle}>
              {totalUnread} message{totalUnread > 1 ? "s" : ""} non lu
              {totalUnread > 1 ? "s" : ""}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.newMessageButton}
          onPress={handleNewMessage}
          activeOpacity={0.7}
        >
          <MessageSquarePlus size={24} color={COLORS.primary.DEFAULT} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.secondary[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.neutral[400]}
          />
        </View>
      </View>

      {/* Conversations List */}
      {isLoading ? (
        <LoadingState message="Chargement des conversations..." />
      ) : filteredConversations.length === 0 ? (
        searchQuery ? (
          <EmptyState
            icon={<Search size={48} color={COLORS.secondary[400]} />}
            title="Aucune conversation trouvée"
            description={`Aucun résultat pour "${searchQuery}"`}
          />
        ) : (
          <EmptyState
            icon={<MessageSquarePlus size={48} color={COLORS.secondary[400]} />}
            title="Aucune conversation"
            description="Commencez une conversation avec vos tuteurs"
            actionLabel="Nouveau message"
            onAction={handleNewMessage}
          />
        )
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ConversationCard
              id={item.id}
              participantName={item.participantName}
              participantAvatar={item.participantAvatar}
              lastMessage={item.lastMessage}
              lastMessageTime={item.lastMessageTime}
              unreadCount={item.unreadCount}
              isOnline={item.isOnline}
              onPress={() => handleConversationPress(item.id)}
              delay={index * 50}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[200],
  },
  headerTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 24,
    color: COLORS.secondary[900],
    fontWeight: "700",
  },
  headerSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: 13,
    color: COLORS.primary.DEFAULT,
    fontWeight: "600",
    marginTop: 2,
  },
  newMessageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.neutral.white,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.neutral[100],
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.secondary,
    fontSize: 15,
    color: COLORS.secondary[900],
  },
});
