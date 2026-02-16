import { Tabs } from "expo-router";
import React from "react";
import { Users, Calendar, Clock, User, Inbox } from "lucide-react-native";

import { HapticTab } from "@/components/haptic-tab";
import { COLORS } from "@/config/colors";

export default function TutorTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8B5CF6",
        tabBarInactiveTintColor: COLORS.secondary[400],
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: COLORS.neutral.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.neutral[200],
          paddingBottom: 20,
          paddingTop: 8,
          height: 77,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Élèves",
          tabBarIcon: ({ color, focused }) => (
            <Users
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Sessions",
          tabBarIcon: ({ color, focused }) => (
            <Calendar
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: "Demandes",
          tabBarIcon: ({ color, focused }) => (
            <Inbox
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="availability"
        options={{
          title: "Disponibilités",
          tabBarIcon: ({ color, focused }) => (
            <Clock
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <User
              size={24}
              color={color}
              fill={focused ? color : "transparent"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
