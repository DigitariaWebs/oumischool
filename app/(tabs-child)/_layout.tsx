import { Tabs } from "expo-router";
import React from "react";
import { BookOpen, PenLine, TrendingUp, User } from "lucide-react-native";

import { HapticTab } from "@/components/haptic-tab";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

export default function ChildTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: COLORS.secondary[400],
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: COLORS.neutral.white,
          borderTopWidth: 0,
          paddingBottom: 24,
          paddingTop: 12,
          height: 85,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "700",
          fontFamily: FONTS.fredoka,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Leçons",
          tabBarIcon: ({ color, focused }) => (
            <BookOpen
              size={30}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: "Jeux",
          tabBarIcon: ({ color, focused }) => (
            <PenLine
              size={30}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Bravo",
          tabBarIcon: ({ color, focused }) => (
            <TrendingUp
              size={30}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Moi",
          tabBarIcon: ({ color, focused }) => (
            <User
              size={30}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
