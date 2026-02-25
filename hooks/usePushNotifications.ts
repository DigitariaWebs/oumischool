import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { apiClient } from "@/hooks/api/client";

// ---------------------------------------------------------------------------
// Foreground notification handler — show banner + play sound while app is open
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
// Navigate to the right screen when the user taps a notification
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
      return "/pricing";

    case "SUBSCRIPTION_EXPIRING":
    case "SUBSCRIPTION_EXPIRED":
      return "/pricing";

    case "REVIEW_RECEIVED":
      return "/tutor/reviews";

    case "TUTOR_APPROVED":
    case "TUTOR_REJECTED":
      return "/profile";

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Main hook — call once, inside an authenticated context
// ---------------------------------------------------------------------------
export function usePushNotifications() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const router = useRouter();
  const responseListenerRef = useRef<Notifications.Subscription | null>(null);
  const tokenRegisteredRef = useRef(false);

  // Register push token with the server whenever the user logs in
  useEffect(() => {
    if (!isAuthenticated || tokenRegisteredRef.current) return;

    registerAndSyncToken();
    tokenRegisteredRef.current = true;

    return () => {
      tokenRegisteredRef.current = false;
    };
  }, [isAuthenticated]);

  // Deregister when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      tokenRegisteredRef.current = false;
    }
  }, [isAuthenticated]);

  // Listen for notification taps (app in background/killed)
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
      });

    return () => {
      responseListenerRef.current?.remove();
    };
  }, [router]);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function registerAndSyncToken(): Promise<void> {
  try {
    if (!Device.isDevice) {
      // Push tokens are not available on simulators — skip silently
      return;
    }

    // Android: create notification channel first
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF6B35",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("[push] Notification permission not granted");
      return;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.warn(
        "[push] No EAS projectId found in app config — skipping push token registration",
      );
      return;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    const token = tokenResponse.data;

    // Persist to server (fire-and-forget from UI perspective)
    await apiClient.put("/users/me/push-token", { token });
  } catch (err) {
    // Never crash the app over push registration
    console.error("[push] Failed to register push token:", err);
  }
}
