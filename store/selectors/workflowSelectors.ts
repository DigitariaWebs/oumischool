import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { WorkflowRole } from "@/store/slices/workflowSlice";

export const selectWorkflowState = (state: RootState) => state.workflow;

export const selectOnboardingCompletionByUserId = (
  state: RootState,
  userId: string,
) => state.workflow.onboarding[userId]?.completionPercent ?? 0;

export const selectRequestsByStatus = createSelector(
  [selectWorkflowState],
  (workflow) => {
    const summary = {
      pending: 0,
      accepted: 0,
      declined: 0,
      expired: 0,
    };
    workflow.requests.forEach((request) => {
      summary[request.status] += 1;
    });
    return summary;
  },
);

export const selectNextBestAction = (
  state: RootState,
  role: WorkflowRole,
  targetId: string,
) =>
  state.workflow.nextBestActions.find(
    (action) => action.role === role && action.targetId === targetId,
  ) ?? null;

export const selectExpiringPendingRequests = createSelector(
  [selectWorkflowState],
  (workflow) => {
    const now = Date.now();
    return workflow.requests.filter((request) => {
      if (request.status !== "pending") return false;
      const dueTs = new Date(request.responseDueAt).getTime();
      return dueTs > now && dueTs - now <= 2 * 60 * 60 * 1000;
    });
  },
);

export const selectCalendarByRole = (
  state: RootState,
  role: WorkflowRole,
  ownerId: string,
) =>
  state.workflow.calendarEvents.filter(
    (event) => event.role === role && event.ownerId === ownerId,
  );

export const selectFallbackTutorsForRequest = (
  state: RootState,
  requestId: string,
) => state.workflow.fallbackSuggestionsByRequestId[requestId] ?? [];

export const selectWeeklyDigest = (
  state: RootState,
  role: WorkflowRole,
  targetId: string,
) =>
  state.workflow.digests
    .filter((digest) => digest.role === role && digest.targetId === targetId)
    .sort(
      (a, b) =>
        new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
    )[0] ?? null;
