import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function setRefreshToken(token: string): Promise<void> {
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData = false,
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData && body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData
      ? (body as FormData)
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json?.error?.message ?? `Request failed: ${res.status}`);
  }
  return json.data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
  postForm: <T>(path: string, form: FormData) =>
    request<T>("POST", path, form, true),
};
