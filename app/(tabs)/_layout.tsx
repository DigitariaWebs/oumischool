import { Tabs } from "expo-router";
import React from "react";
import { Home, Users, User, GraduationCap, Library } from "lucide-react-native";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { THEME } from "@/config/theme";
import { COLORS } from "@/config/colors";
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
                    color: isFocused
                      ? THEME.colors.primary
                      : COLORS.secondary[400],
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

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, focused }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="children-tab"
        options={{
          title: "Enfants",
          tabBarIcon: ({ color, focused }) => <Users size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Bibliothèque",
          tabBarIcon: ({ color, focused }) => (
            <Library size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tutors-tab"
        options={{
          title: "Tuteurs",
          tabBarIcon: ({ color, focused }) => (
            <GraduationCap size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => <User size={22} color={color} />,
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
    backgroundColor: THEME.colors.white,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "92%",
    borderWidth: 1,
    borderColor: THEME.colors.border,
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
    backgroundColor: COLORS.primary[50],
  },
  tabLabel: {
    fontFamily: FONTS.secondary,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.secondary[400],
  },
  tabLabelActive: {
    color: THEME.colors.primary,
    fontWeight: "700",
  },
});
