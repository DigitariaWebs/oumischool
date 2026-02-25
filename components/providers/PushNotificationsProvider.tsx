import { usePushNotifications } from "@/hooks/usePushNotifications";

/**
 * Mounts the push-notification side-effects.
 * - Requests permission + registers Expo push token with the server on login
 * - Sets up foreground notification display handler
 * - Handles notification taps → navigates to the right screen
 *
 * Must be rendered inside both Redux Provider and NavigationContainer
 * (i.e. inside the Expo Router stack).
 */
export function PushNotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  usePushNotifications();
  return <>{children}</>;
}
