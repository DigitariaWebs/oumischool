import { Tabs } from "expo-router";
import React from "react";
import {
  Home,
  Users,
  BookOpen,
  User,
  GraduationCap,
} from "lucide-react-native";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { THEME } from "@/config/theme";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

function TabItem({
  onPress,
  isFocused,
  icon,
  label,
  getIconColor,
  getLabelColor,
}: {
  onPress: () => void;
  isFocused: boolean;
  icon: any;
  label: string;
  getIconColor: (isFocused: boolean) => string;
  getLabelColor: (isFocused: boolean) => string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabItemWrapper,
        pressed && styles.tabItemPressed,
      ]}
    >
      <View
        style={[
          styles.tabIconContainer,
          isFocused && styles.tabIconContainerActive,
        ]}
      >
        {icon &&
          icon({
            color: getIconColor(isFocused),
            focused: isFocused,
          })}
      </View>
      <Text
        style={[
          styles.tabLabel,
          { color: getLabelColor(isFocused) },
          isFocused && styles.tabLabelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  const getIconColor = (isFocused: boolean) => {
    return isFocused ? THEME.colors.primary : COLORS.secondary[400];
  };

  const getLabelColor = (isFocused: boolean) => {
    return isFocused ? THEME.colors.primary : COLORS.secondary[400];
  };

  return (
    <View
      style={[styles.tabBarContainer, { paddingBottom: insets.bottom + 12 }]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            Haptics.selectionAsync();
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
            <TabItem
              key={route.key}
              onPress={onPress}
              isFocused={isFocused}
              icon={options.tabBarIcon}
              label={options.title}
              getIconColor={getIconColor}
              getLabelColor={getLabelColor}
            />
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
        name="resources-tab"
        options={{
          title: "Ressources",
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={22} color={color} />
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
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  tabItemWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemPressed: {
    opacity: 0.7,
  },
  tabIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    backgroundColor: "transparent",
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
