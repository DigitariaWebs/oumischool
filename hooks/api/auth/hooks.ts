import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, LoginPayload, RegisterPayload } from "./api";
import { authKeys } from "./keys";
import { setToken, setRefreshToken, clearTokens } from "../client";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: async (data) => {
      await setToken(data.tokens.accessToken);
      await setRefreshToken(data.tokens.refreshToken);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: async (data) => {
      await setToken(data.tokens.accessToken);
      await setRefreshToken(data.tokens.refreshToken);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await clearTokens();
    },
    onSuccess: () => {
      qc.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      token,
      password,
    }: {
      token: string;
      password: string;
    }) => authApi.resetPassword(token, password),
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (email: string) => authApi.sendOtp(email),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      authApi.verifyOtp(email, code),
  });
}

export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authApi.getProfile,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authApi.changePassword(currentPassword, newPassword),
  });
}
