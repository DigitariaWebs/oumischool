import { Tabs } from "expo-router";
import React, { useMemo } from "react";
import { Users, Calendar, Inbox, Clock, User } from "lucide-react-native";
import { View, StyleSheet, Pressable, Platform, Text } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "@/config/colors";
import { useTheme } from "@/hooks/use-theme";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
      <BlurView
        intensity={100}
        tint={isDark ? "dark" : "light"}
        style={styles.tabBar}
      >
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

          const onLongPress = () => {
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItemWrapper}
            >
              <View style={[styles.tabItem, isFocused && styles.tabItemActive]}>
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    color: isFocused
                      ? COLORS.primary.DEFAULT
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
      </BlurView>
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

const createStyles = (
  colors: import("@/constants/theme").ThemeColors,
  isDark: boolean,
) =>
  StyleSheet.create({
    tabBarContainer: {
      position: "absolute",
      bottom: 10,
      left: 5,
      right: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    tabBar: {
      flexDirection: "row",
      backgroundColor: isDark
        ? "rgba(30, 30, 30, 0.9)"
        : "rgba(255, 255, 255, 0.7)",
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.5 : 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    tabItemWrapper: {
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    tabItem: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.buttonSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    tabItemActive: {
      backgroundColor: colors.card,
    },
    tabLabel: {
      fontSize: 10,
      fontWeight: "600",
      color: colors.textMuted,
    },
    tabLabelActive: {
      color: COLORS.primary.DEFAULT,
    },
  });
