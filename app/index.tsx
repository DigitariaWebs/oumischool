import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

import { authApi } from "@/hooks/api/auth";
import { clearTokens, getToken } from "@/hooks/api/client";
import { useAppDispatch } from "@/store/hooks";
import { loginSuccess, logout } from "@/store/slices/authSlice";

export default function Index() {
  const dispatch = useAppDispatch();
  const [target, setTarget] = useState<
    "/sign-in" | "/(tabs)" | "/(tabs-tutor)" | "/(tabs-child)" | null
  >(null);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const token = await getToken();
        if (!token) {
          if (mounted) setTarget("/sign-in");
          return;
        }

        const profile = await authApi.getProfile();
        const rawRole = profile.role.toUpperCase();
        let appRole: "parent" | "tutor" | "child";
        if (rawRole === "TUTOR") {
          appRole = "tutor";
        } else if (rawRole === "CHILD") {
          appRole = "child";
        } else if (rawRole === "PARENT") {
          appRole = "parent";
        } else {
          await clearTokens();
          dispatch(logout());
          if (mounted) setTarget("/sign-in");
          return;
        }

        dispatch(
          loginSuccess({
            user: {
              id: profile.id,
              email: profile.email,
              name: profile.email,
              role: appRole,
            },
            token,
          }),
        );

        if (mounted) {
          setTarget(
            appRole === "tutor"
              ? "/(tabs-tutor)"
              : appRole === "child"
                ? "/(tabs-child)"
                : "/(tabs)",
          );
        }
      } catch {
        await clearTokens();
        dispatch(logout());
        if (mounted) setTarget("/sign-in");
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (!target) return null;

  return <Redirect href={target} />;
}
