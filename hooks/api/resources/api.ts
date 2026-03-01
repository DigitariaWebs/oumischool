import { apiClient } from "../client";

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: string;
  subject: string;
  fileUrl: string;
  fileSize: string | null;
  tags: string[];
  status: string;
  isPaid: boolean;
  price: number | null; // in cents
  hasEntitlement?: boolean; // set when fetching a single resource as authenticated parent
  downloads: number;
  views: number;
  createdAt: string;
  uploader?: { id: string; email: string } | null;
}

export interface CreateResourcePayload {
  title: string;
  subject: string;
  type: "document" | "video" | "audio" | "image" | "other";
  fileUrl: string;
  fileSize?: string;
  description?: string;
  tags?: string[];
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export function resolveResourceUrl(fileUrl: string | null | undefined): string {
  const raw = typeof fileUrl === "string" ? fileUrl.trim() : "";
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const base = (
    process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000"
  ).replace(/\/+$/, "");
  return `${base}${raw.startsWith("/") ? "" : "/"}${raw}`;
}

export const resourcesApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiClient.get<Resource[]>(`/resources${qs}`);
  },
  get: (id: string) => apiClient.get<Resource>(`/resources/${id}`),
  create: (body: CreateResourcePayload) =>
    apiClient.post<Resource>("/resources", body),
  upload: (form: FormData) =>
    apiClient.postForm<Resource>("/resources/upload", form),
  update: (id: string, body: Partial<CreateResourcePayload>) =>
    apiClient.put<Resource>(`/resources/${id}`, body),
  delete: (id: string) => apiClient.del<void>(`/resources/${id}`),
  trackView: (id: string) => apiClient.post<void>(`/resources/${id}/view`),
  trackDownload: (id: string) =>
    apiClient.post<void>(`/resources/${id}/download`),
  getSecureDownloadUrl: (id: string) =>
    resolveResourceUrl(`/resources/${id}/download-secure`),
  addToLibrary: (id: string) =>
    apiClient.post<{ message: string }>(`/resources/${id}/add-to-library`),
};
