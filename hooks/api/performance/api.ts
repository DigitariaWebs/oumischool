import { apiClient } from "../client";

export interface PerformanceRecord {
  id: string;
  childId: string;
  subjectId: string | null;
  activityType: string;
  score: number | null;
  attended: boolean;
  notes: string | null;
  recordedAt: string;
  subject?: { id: string; name: string; color: string | null } | null;
  title?: string | null;
}

export interface SubjectPerformance {
  subjectId: string | null;
  avgScore: number;
  activityCount: number;
}

export interface ChildPerformanceSummary {
  childId: string;
  avgScore: number;
  attendanceRate: number;
  enrolledSubjects: string[];
  subjectPerformance: SubjectPerformance[];
  recentActivities: PerformanceRecord[];
}

export interface RecommendationItem {
  subjectId: string;
  subjectName: string;
  color: string;
  icon: string | null;
  type: "needs_improvement" | "developing" | "explore";
  avgScore: number | null;
  message: string;
}

export interface RecommendationsResponse {
  childId: string;
  recommendations: RecommendationItem[];
}

export interface RecordActivityPayload {
  subjectId?: string;
  activityType: string;
  score?: number;
  attended?: boolean;
  notes?: string;
}

export const performanceApi = {
  getRecords: (childId: string, params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiClient.get<ChildPerformanceSummary>(
      `/children/${childId}/performance${qs}`,
    );
  },
  getActivities: (childId: string, limit = 50) =>
    apiClient.get<PerformanceRecord[]>(
      `/children/${childId}/activities?limit=${limit}`,
    ),
  getRecommendations: (childId: string) =>
    apiClient.get<RecommendationsResponse>(
      `/children/${childId}/recommendations`,
    ),
  recordActivity: (childId: string, body: RecordActivityPayload) =>
    apiClient.post<PerformanceRecord>(`/children/${childId}/activities`, body),
};
