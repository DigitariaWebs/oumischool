import { Tabs } from "expo-router";
import React from "react";
import { Calendar, Inbox, User, Home, BookOpen } from "lucide-react-native";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FONTS } from "@/config/fonts";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.tabBarContainer, { paddingBottom: insets.bottom + 12 }]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tabItemWrapper,
                pressed && styles.tabPressed,
              ]}
            >
              <View
                style={[
                  styles.tabIconContainer,
                  isFocused && styles.tabIconContainerActive,
                ]}
              >
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    color: isFocused ? "#6366F1" : "#94A3B8",
                    focused: isFocused,
                  })}
              </View>
              <Text
                style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
              >
                {options.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TutorTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Sessions",
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: "Ressources",
          tabBarIcon: ({ color }) => <BookOpen size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: "Demandes",
          tabBarIcon: ({ color }) => <Inbox size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "92%",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tabItemWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  tabIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    overflow: "hidden",
  },
  tabIconContainerActive: {
    backgroundColor: "#EEF2FF",
  },
  tabLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
  tabLabelActive: {
    color: "#6366F1",
    fontWeight: "700",
  },
});
