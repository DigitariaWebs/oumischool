import { useRouter } from "expo-router";
import { useCallback } from "react";

/**
 * Returns a safe back handler that navigates to (tabs) when there's no history.
 * Prevents "GO_BACK was not handled" error when Redirect or replace clears the stack.
 */
export function useSafeBack(fallbackRoute: string = "/(tabs)") {
  const router = useRouter();

  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute);
    }
  }, [router, fallbackRoute]);
}
