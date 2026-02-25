import { apiClient } from "../client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: "PARENT" | "TUTOR";
  firstName: string;
  lastName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  status: string;
  child?: {
    id: string;
    name: string;
    avgScore: number;
    attendanceRate: number;
    enrolledSubjects?: string[];
  } | null;
}

export const authApi = {
  login: (body: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", body),
  register: (body: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", body),
  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>("/auth/refresh", { refreshToken }),
  forgotPassword: (email: string) =>
    apiClient.post<{ message: string }>("/auth/forgot-password", { email }),
  resetPassword: (
    token: string,
    email: string,
    code: string,
    password: string,
  ) =>
    apiClient.post<{ message: string }>("/auth/reset-password", {
      token,
      email,
      code,
      password,
    }),
  sendOtp: (email: string) =>
    apiClient.post<{ message: string }>("/auth/send-otp", { email }),
  verifyOtp: (email: string, code: string) =>
    apiClient.post<{ message: string }>("/auth/verify-otp", { email, code }),
  getProfile: () => apiClient.get<UserProfile>("/users/me"),
  updateProfile: (body: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: string;
  }) => apiClient.put<UserProfile>("/users/me", body),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.put("/users/me/password", { currentPassword, newPassword }),
};
