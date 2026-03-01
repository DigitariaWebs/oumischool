import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { AppState, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { apiClient } from "@/hooks/api/client";

// ---------------------------------------------------------------------------
// Foreground handler — show alert + play sound while app is open
// SDK 54 uses shouldShowAlert (not shouldShowBanner/shouldShowList)
// ---------------------------------------------------------------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ---------------------------------------------------------------------------
// Route resolution
// ---------------------------------------------------------------------------
function resolveNotificationRoute(
  type: string,
  data: Record<string, unknown>,
): string | null {
  switch (type) {
    case "SESSION_REQUESTED":
    case "SESSION_ACCEPTED":
    case "SESSION_REJECTED":
    case "SESSION_CANCELLED":
    case "SESSION_COMPLETED":
    case "SESSION_REMINDER":
      return data.sessionId ? `/sessions/${data.sessionId}` : null;

    case "NEW_MESSAGE":
      return "/messaging";

    case "PAYMENT_RECEIVED":
    case "PAYMENT_FAILED":
    case "ORDER_REFUNDED":
    case "SUBSCRIPTION_EXPIRING":
    case "SUBSCRIPTION_EXPIRED":
      return "/pricing";

    case "REVIEW_RECEIVED":
    case "TUTOR_APPROVED":
    case "TUTOR_REJECTED":
      return "/(tabs-tutor)/profile";

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Main hook
// ---------------------------------------------------------------------------
export function usePushNotifications() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const router = useRouter();
  const tokenRef = useRef<string | null>(null);
  const foregroundListenerRef = useRef<Notifications.Subscription | null>(null);
  const responseListenerRef = useRef<Notifications.Subscription | null>(null);

  // Register token on login, deregister on logout
  useEffect(() => {
    if (isAuthenticated) {
      registerAndSyncToken().then((token) => {
        tokenRef.current = token;
      });
    } else {
      // User logged out — clear badge and deregister token from server
      if (tokenRef.current) {
        void apiClient
          .put("/users/me/push-token", { token: null })
          .catch(() => {});
        tokenRef.current = null;
      }
      Notifications.setBadgeCountAsync(0).catch(() => {});
    }
  }, [isAuthenticated]);

  // Clear badge when app comes to foreground
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        Notifications.setBadgeCountAsync(0).catch(() => {});
      }
    });
    return () => sub.remove();
  }, []);

  // Foreground notification listener — fired while app is open
  useEffect(() => {
    foregroundListenerRef.current =
      Notifications.addNotificationReceivedListener(() => {
        // Badge is incremented by the OS via shouldSetBadge — nothing extra needed
      });

    return () => {
      foregroundListenerRef.current?.remove();
    };
  }, []);

  // Tap listener — app in background or killed
  useEffect(() => {
    responseListenerRef.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = (response.notification.request.content.data ??
          {}) as Record<string, unknown>;
        const type = data.type as string | undefined;
        if (type) {
          const route = resolveNotificationRoute(type, data);
          if (route) {
            router.push(route as any);
          }
        }
        Notifications.setBadgeCountAsync(0).catch(() => {});
      });

    return () => {
      responseListenerRef.current?.remove();
    };
  }, [router]);

  // Handle notification that launched the app from killed state
  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const data = (response.notification.request.content.data ?? {}) as Record<
        string,
        unknown
      >;
      const type = data.type as string | undefined;
      if (type) {
        const route = resolveNotificationRoute(type, data);
        if (route) {
          router.push(route as any);
        }
      }
    });
  }, [router]);
}

// ---------------------------------------------------------------------------
// Token registration
// ---------------------------------------------------------------------------
async function registerAndSyncToken(): Promise<string | null> {
  try {
    if (!Device.isDevice) return null;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "OumiSchool",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF6B35",
        sound: "default",
        enableVibrate: true,
        showBadge: true,
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("[push] Permission not granted");
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.warn("[push] No EAS projectId — skipping token registration");
      return null;
    }

    const { data: token } = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    await apiClient.put("/users/me/push-token", { token });
    return token;
  } catch (err) {
    console.error("[push] Failed to register push token:", err);
    return null;
  }
}
