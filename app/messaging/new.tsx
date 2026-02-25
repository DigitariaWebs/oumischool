import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Search } from "lucide-react-native";

import { FONTS } from "@/config/fonts";
import {
  MessagingContact,
  useMessagingContacts,
  useStartConversation,
} from "@/hooks/api/messaging";

function titleForContact(contact: MessagingContact): string {
  return contact.name?.trim() || contact.email;
}

function subtitleForContact(contact: MessagingContact): string {
  const role = contact.role.toLowerCase();
  return `${role} • ${contact.email}`;
}

export default function NewConversationScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const trimmedQuery = query.trim();

  const { data, isLoading } = useMessagingContacts(trimmedQuery || undefined);
  const startConversation = useStartConversation();
  const contacts = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const onSelect = async (contact: MessagingContact) => {
    if (pendingUserId) return;
    setPendingUserId(contact.id);
    try {
      const conversation = await startConversation.mutateAsync({
        participantIds: [contact.id],
      });
      router.replace(`/messaging/${conversation.id}`);
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.title}>Nouveau message</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher un utilisateur..."
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#6366F1" />
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const disabled =
              startConversation.isPending && pendingUserId !== item.id;
            return (
              <TouchableOpacity
                style={styles.contactRow}
                onPress={() => onSelect(item)}
                disabled={disabled}
                activeOpacity={0.7}
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactAvatarText}>
                    {titleForContact(item).charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.contactMeta}>
                  <Text style={styles.contactTitle} numberOfLines={1}>
                    {titleForContact(item)}
                  </Text>
                  <Text style={styles.contactSubtitle} numberOfLines={1}>
                    {subtitleForContact(item)}
                  </Text>
                </View>
                {pendingUserId === item.id && startConversation.isPending ? (
                  <ActivityIndicator size="small" color="#6366F1" />
                ) : null}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyTitle}>Aucun contact trouvé</Text>
              <Text style={styles.emptyText}>
                {trimmedQuery
                  ? "Essayez un autre nom ou e-mail."
                  : "Aucun contact disponible pour le moment."}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
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
  title: {
    fontFamily: FONTS.fredoka,
    fontSize: 18,
    color: "#0F172A",
  },
  spacer: {
    width: 40,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBox: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
  },
  contactRow: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
  },
  contactAvatarText: {
    fontFamily: FONTS.fredoka,
    fontSize: 15,
    color: "#4F46E5",
  },
  contactMeta: {
    flex: 1,
    gap: 2,
  },
  contactTitle: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "600",
  },
  contactSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 6,
  },
  emptyTitle: {
    fontFamily: FONTS.fredoka,
    fontSize: 16,
    color: "#0F172A",
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 13,
  },
});
