export const performanceKeys = {
  all: ["performance"] as const,
  byChild: (childId: string) => [...performanceKeys.all, childId] as const,
  records: (childId: string, params?: Record<string, unknown>) =>
    [...performanceKeys.byChild(childId), "records", params] as const,
  activities: (childId: string, params?: Record<string, unknown>) =>
    [...performanceKeys.byChild(childId), "activities", params] as const,
  recommendations: (childId: string) =>
    [...performanceKeys.byChild(childId), "recommendations"] as const,
};
