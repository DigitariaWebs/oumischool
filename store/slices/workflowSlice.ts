import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type WorkflowRole = "parent" | "child" | "tutor";

export type WorkflowRequestStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "expired";

export type WorkflowSessionStatus =
  | "awaiting_parent_approval"
  | "scheduled"
  | "awaiting_notes"
  | "awaiting_feedback_prompts"
  | "completed"
  | "cancelled";

export interface OnboardingProgress {
  userId: string;
  role: WorkflowRole;
  completionPercent: number;
  completedSteps: number;
  totalSteps: number;
  updatedAt: string;
}

export interface TutoringRequestWorkflow {
  id: string;
  parentId: string;
  childId: string;
  tutorId: string;
  subject: string;
  preferredStartAt: string;
  preferredEndAt: string;
  status: WorkflowRequestStatus;
  createdAt: string;
  responseDueAt: string;
  reminderAt: string;
  reminderSentAt?: string;
  respondedAt?: string;
  declineReason?: string;
  fallbackTutorIds: string[];
}

export interface SessionFeedback {
  rating?: number;
  comment?: string;
  submittedAt: string;
}

export interface SessionWorkflow {
  id: string;
  requestId: string;
  parentId: string;
  childId: string;
  tutorId: string;
  subject: string;
  startAt: string;
  endAt: string;
  status: WorkflowSessionStatus;
  parentApprovedAt?: string;
  tutorNote?: string;
  tutorNoteSubmittedAt?: string;
  feedbackPromptSent: {
    parent: boolean;
    child: boolean;
  };
  feedback: {
    parent?: SessionFeedback;
    child?: SessionFeedback;
  };
  completedAt?: string;
}

export interface CalendarEvent {
  id: string;
  sessionId: string;
  role: WorkflowRole;
  ownerId: string;
  startAt: string;
  endAt: string;
  title: string;
}

export interface ExerciseTask {
  id: string;
  childId: string;
  title: string;
  dueAt: string;
  completedAt?: string;
}

export interface TutorCatalogEntry {
  tutorId: string;
  subjects: string[];
  rating: number;
}

export interface NextBestAction {
  id: string;
  role: WorkflowRole;
  targetId: string;
  type: "approve_pending_session" | "complete_today_exercise" | "submit_session_notes";
  title: string;
  entityId: string;
  priority: number;
}

export interface WeeklyDigest {
  id: string;
  role: WorkflowRole;
  targetId: string;
  weekStartAt: string;
  generatedAt: string;
  summary: string;
  actionItems: string[];
}

interface WorkflowState {
  onboarding: Record<string, OnboardingProgress>;
  requests: TutoringRequestWorkflow[];
  sessions: SessionWorkflow[];
  calendarEvents: CalendarEvent[];
  exercises: ExerciseTask[];
  tutorCatalog: TutorCatalogEntry[];
  fallbackSuggestionsByRequestId: Record<string, string[]>;
  nextBestActions: NextBestAction[];
  digests: WeeklyDigest[];
}

const REQUEST_RESPONSE_WINDOW_HOURS = 24;
const REQUEST_REMINDER_LEAD_HOURS = 2;

const now = new Date();
const isoNow = now.toISOString();
const plusHours = (hours: number) =>
  new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
const minusHours = (hours: number) =>
  new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
const plusDays = (days: number) =>
  new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

const initialTutorCatalog: TutorCatalogEntry[] = [
  { tutorId: "tutor-1", subjects: ["Mathématiques", "Sciences"], rating: 4.8 },
  { tutorId: "tutor-2", subjects: ["Français", "Histoire"], rating: 4.7 },
  { tutorId: "tutor-3", subjects: ["Mathématiques", "Français"], rating: 4.9 },
];

const makeRequest = (
  id: string,
  data: {
    parentId: string;
    childId: string;
    tutorId: string;
    subject: string;
    preferredStartAt: string;
    preferredEndAt: string;
    status?: WorkflowRequestStatus;
    createdAt?: string;
  },
): TutoringRequestWorkflow => {
  const createdAt = data.createdAt ?? isoNow;
  const dueAt = new Date(
    new Date(createdAt).getTime() + REQUEST_RESPONSE_WINDOW_HOURS * 60 * 60 * 1000,
  ).toISOString();
  const reminderAt = new Date(
    new Date(dueAt).getTime() - REQUEST_REMINDER_LEAD_HOURS * 60 * 60 * 1000,
  ).toISOString();

  return {
    id,
    parentId: data.parentId,
    childId: data.childId,
    tutorId: data.tutorId,
    subject: data.subject,
    preferredStartAt: data.preferredStartAt,
    preferredEndAt: data.preferredEndAt,
    status: data.status ?? "pending",
    createdAt,
    responseDueAt: dueAt,
    reminderAt,
    fallbackTutorIds: [],
  };
};

const sessionToCalendarEvents = (session: SessionWorkflow): CalendarEvent[] => [
  {
    id: `${session.id}-parent`,
    sessionId: session.id,
    role: "parent",
    ownerId: session.parentId,
    startAt: session.startAt,
    endAt: session.endAt,
    title: `${session.subject} avec tuteur`,
  },
  {
    id: `${session.id}-child`,
    sessionId: session.id,
    role: "child",
    ownerId: session.childId,
    startAt: session.startAt,
    endAt: session.endAt,
    title: `${session.subject} - cours`,
  },
  {
    id: `${session.id}-tutor`,
    sessionId: session.id,
    role: "tutor",
    ownerId: session.tutorId,
    startAt: session.startAt,
    endAt: session.endAt,
    title: `${session.subject} - élève`,
  },
];

const initialRequests: TutoringRequestWorkflow[] = [
  makeRequest("req-1", {
    parentId: "parent-1",
    childId: "child-1",
    tutorId: "tutor-1",
    subject: "Mathématiques",
    preferredStartAt: plusDays(1),
    preferredEndAt: plusDays(1),
    createdAt: minusHours(2),
  }),
  makeRequest("req-2", {
    parentId: "parent-1",
    childId: "child-2",
    tutorId: "tutor-1",
    subject: "Français",
    preferredStartAt: plusDays(2),
    preferredEndAt: plusDays(2),
    status: "declined",
    createdAt: minusHours(28),
  }),
];

const initialSessions: SessionWorkflow[] = [
  {
    id: "session-1",
    requestId: "req-seeded-1",
    parentId: "parent-1",
    childId: "child-1",
    tutorId: "tutor-1",
    subject: "Mathématiques",
    startAt: minusHours(3),
    endAt: minusHours(2),
    status: "awaiting_notes",
    feedbackPromptSent: { parent: false, child: false },
    feedback: {},
  },
  {
    id: "session-2",
    requestId: "req-seeded-2",
    parentId: "parent-1",
    childId: "child-2",
    tutorId: "tutor-1",
    subject: "Français",
    startAt: plusDays(1),
    endAt: plusDays(1),
    status: "awaiting_parent_approval",
    feedbackPromptSent: { parent: false, child: false },
    feedback: {},
  },
];

const initialState: WorkflowState = {
  onboarding: {
    "parent-1": {
      userId: "parent-1",
      role: "parent",
      completionPercent: 80,
      completedSteps: 4,
      totalSteps: 5,
      updatedAt: isoNow,
    },
    "child-1": {
      userId: "child-1",
      role: "child",
      completionPercent: 75,
      completedSteps: 3,
      totalSteps: 4,
      updatedAt: isoNow,
    },
    "child-2": {
      userId: "child-2",
      role: "child",
      completionPercent: 65,
      completedSteps: 3,
      totalSteps: 4,
      updatedAt: isoNow,
    },
    "tutor-1": {
      userId: "tutor-1",
      role: "tutor",
      completionPercent: 90,
      completedSteps: 9,
      totalSteps: 10,
      updatedAt: isoNow,
    },
  },
  requests: initialRequests,
  sessions: initialSessions,
  calendarEvents: initialSessions.flatMap(sessionToCalendarEvents),
  exercises: [
    {
      id: "exercise-1",
      childId: "child-1",
      title: "Jeu d'addition",
      dueAt: isoNow,
    },
  ],
  tutorCatalog: initialTutorCatalog,
  fallbackSuggestionsByRequestId: {},
  nextBestActions: [],
  digests: [],
};

const unique = <T>(items: T[]) => [...new Set(items)];

const recommendSimilarTutors = (
  request: TutoringRequestWorkflow,
  catalog: TutorCatalogEntry[],
): string[] =>
  catalog
    .filter((entry) => entry.tutorId !== request.tutorId)
    .filter((entry) => entry.subjects.includes(request.subject))
    .sort((a, b) => b.rating - a.rating)
    .map((entry) => entry.tutorId)
    .slice(0, 3);

const maybeCompleteSession = (session: SessionWorkflow, nowIso: string) => {
  if (
    session.tutorNoteSubmittedAt &&
    session.feedbackPromptSent.parent &&
    session.feedbackPromptSent.child
  ) {
    session.status = "completed";
    session.completedAt = nowIso;
  }
};

const recomputeNextBestActions = (state: WorkflowState) => {
  const parentIds = unique(
    state.sessions.map((s) => s.parentId).concat(state.requests.map((r) => r.parentId)),
  );
  const childIds = unique(
    state.exercises.map((e) => e.childId).concat(state.sessions.map((s) => s.childId)),
  );
  const tutorIds = unique(
    state.sessions.map((s) => s.tutorId).concat(state.requests.map((r) => r.tutorId)),
  );

  const actions: NextBestAction[] = [];

  parentIds.forEach((parentId) => {
    const pendingApproval = state.sessions.find(
      (session) =>
        session.parentId === parentId && session.status === "awaiting_parent_approval",
    );
    if (pendingApproval) {
      actions.push({
        id: `nba-parent-${parentId}`,
        role: "parent",
        targetId: parentId,
        type: "approve_pending_session",
        title: "Approve pending session",
        entityId: pendingApproval.id,
        priority: 100,
      });
    }
  });

  childIds.forEach((childId) => {
    const pendingExercise = state.exercises.find(
      (exercise) => exercise.childId === childId && !exercise.completedAt,
    );
    if (pendingExercise) {
      actions.push({
        id: `nba-child-${childId}`,
        role: "child",
        targetId: childId,
        type: "complete_today_exercise",
        title: "Complete today's exercise",
        entityId: pendingExercise.id,
        priority: 90,
      });
    }
  });

  tutorIds.forEach((tutorId) => {
    const notesPending = state.sessions.find(
      (session) => session.tutorId === tutorId && session.status === "awaiting_notes",
    );
    if (notesPending) {
      actions.push({
        id: `nba-tutor-${tutorId}`,
        role: "tutor",
        targetId: tutorId,
        type: "submit_session_notes",
        title: "Submit session notes",
        entityId: notesPending.id,
        priority: 95,
      });
    }
  });

  state.nextBestActions = actions.sort((a, b) => b.priority - a.priority);
};

export const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    setOnboardingCompletion: (
      state,
      action: PayloadAction<{
        userId: string;
        role: WorkflowRole;
        completionPercent: number;
        completedSteps: number;
        totalSteps: number;
      }>,
    ) => {
      const nowIso = new Date().toISOString();
      state.onboarding[action.payload.userId] = {
        userId: action.payload.userId,
        role: action.payload.role,
        completionPercent: action.payload.completionPercent,
        completedSteps: action.payload.completedSteps,
        totalSteps: action.payload.totalSteps,
        updatedAt: nowIso,
      };
    },
    createTutoringRequest: (
      state,
      action: PayloadAction<{
        parentId: string;
        childId: string;
        tutorId: string;
        subject: string;
        preferredStartAt: string;
        preferredEndAt: string;
      }>,
    ) => {
      const requestId = `req-${Date.now()}`;
      const request = makeRequest(requestId, action.payload);
      state.requests.unshift(request);
      recomputeNextBestActions(state);
    },
    acceptTutoringRequest: (
      state,
      action: PayloadAction<{
        requestId: string;
        startAt?: string;
        endAt?: string;
      }>,
    ) => {
      const request = state.requests.find((r) => r.id === action.payload.requestId);
      if (!request || request.status !== "pending") {
        return;
      }

      const nowIso = new Date().toISOString();
      request.status = "accepted";
      request.respondedAt = nowIso;

      const session: SessionWorkflow = {
        id: `session-${request.id}`,
        requestId: request.id,
        parentId: request.parentId,
        childId: request.childId,
        tutorId: request.tutorId,
        subject: request.subject,
        startAt: action.payload.startAt ?? request.preferredStartAt,
        endAt: action.payload.endAt ?? request.preferredEndAt,
        status: "awaiting_parent_approval",
        feedbackPromptSent: { parent: false, child: false },
        feedback: {},
      };

      state.sessions.unshift(session);
      state.calendarEvents = state.calendarEvents.filter(
        (event) => event.sessionId !== session.id,
      );
      state.calendarEvents.push(...sessionToCalendarEvents(session));
      recomputeNextBestActions(state);
    },
    declineTutoringRequest: (
      state,
      action: PayloadAction<{ requestId: string; reason?: string }>,
    ) => {
      const request = state.requests.find((r) => r.id === action.payload.requestId);
      if (!request || request.status !== "pending") {
        return;
      }

      const nowIso = new Date().toISOString();
      request.status = "declined";
      request.respondedAt = nowIso;
      request.declineReason = action.payload.reason;

      const fallback = recommendSimilarTutors(request, state.tutorCatalog);
      request.fallbackTutorIds = fallback;
      state.fallbackSuggestionsByRequestId[request.id] = fallback;
      recomputeNextBestActions(state);
    },
    runRequestTimingSweep: (
      state,
      action: PayloadAction<{ now?: string } | undefined>,
    ) => {
      const nowIso = action.payload?.now ?? new Date().toISOString();
      const nowTs = new Date(nowIso).getTime();

      state.requests.forEach((request) => {
        if (request.status !== "pending") {
          return;
        }

        if (!request.reminderSentAt && new Date(request.reminderAt).getTime() <= nowTs) {
          request.reminderSentAt = nowIso;
        }

        if (new Date(request.responseDueAt).getTime() <= nowTs) {
          request.status = "expired";
          request.respondedAt = nowIso;
          const fallback = recommendSimilarTutors(request, state.tutorCatalog);
          request.fallbackTutorIds = fallback;
          state.fallbackSuggestionsByRequestId[request.id] = fallback;
        }
      });

      recomputeNextBestActions(state);
    },
    approvePendingSessionByParent: (
      state,
      action: PayloadAction<{ sessionId: string; approvedAt?: string }>,
    ) => {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId);
      if (!session || session.status !== "awaiting_parent_approval") {
        return;
      }

      session.status = "scheduled";
      session.parentApprovedAt = action.payload.approvedAt ?? new Date().toISOString();
      recomputeNextBestActions(state);
    },
    runSessionLifecycleSweep: (
      state,
      action: PayloadAction<{ now?: string } | undefined>,
    ) => {
      const nowIso = action.payload?.now ?? new Date().toISOString();
      const nowTs = new Date(nowIso).getTime();

      state.sessions.forEach((session) => {
        if (
          session.status === "scheduled" &&
          new Date(session.endAt).getTime() <= nowTs
        ) {
          session.status = "awaiting_notes";
        }

        if (session.status === "awaiting_feedback_prompts") {
          maybeCompleteSession(session, nowIso);
        }
      });

      recomputeNextBestActions(state);
    },
    submitTutorSessionNote: (
      state,
      action: PayloadAction<{
        sessionId: string;
        note: string;
        submittedAt?: string;
      }>,
    ) => {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId);
      if (!session || session.status === "completed" || session.status === "cancelled") {
        return;
      }

      const nowIso = action.payload.submittedAt ?? new Date().toISOString();
      session.tutorNote = action.payload.note;
      session.tutorNoteSubmittedAt = nowIso;
      session.status = "awaiting_feedback_prompts";
      maybeCompleteSession(session, nowIso);
      recomputeNextBestActions(state);
    },
    markFeedbackPromptDelivered: (
      state,
      action: PayloadAction<{
        sessionId: string;
        role: "parent" | "child";
        deliveredAt?: string;
      }>,
    ) => {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId);
      if (!session || session.status === "completed" || session.status === "cancelled") {
        return;
      }

      const nowIso = action.payload.deliveredAt ?? new Date().toISOString();
      session.feedbackPromptSent[action.payload.role] = true;
      if (!session.tutorNoteSubmittedAt) {
        session.status = "awaiting_notes";
      } else {
        session.status = "awaiting_feedback_prompts";
      }
      maybeCompleteSession(session, nowIso);
      recomputeNextBestActions(state);
    },
    submitSessionFeedback: (
      state,
      action: PayloadAction<{
        sessionId: string;
        role: "parent" | "child";
        rating?: number;
        comment?: string;
        submittedAt?: string;
      }>,
    ) => {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId);
      if (!session) {
        return;
      }
      session.feedback[action.payload.role] = {
        rating: action.payload.rating,
        comment: action.payload.comment,
        submittedAt: action.payload.submittedAt ?? new Date().toISOString(),
      };
    },
    markExerciseCompleted: (
      state,
      action: PayloadAction<{
        childId: string;
        exerciseId: string;
        title: string;
        completedAt?: string;
      }>,
    ) => {
      const completedAt = action.payload.completedAt ?? new Date().toISOString();
      const existing = state.exercises.find(
        (task) => task.id === action.payload.exerciseId && task.childId === action.payload.childId,
      );

      if (existing) {
        existing.completedAt = completedAt;
      } else {
        state.exercises.push({
          id: action.payload.exerciseId,
          childId: action.payload.childId,
          title: action.payload.title,
          dueAt: completedAt,
          completedAt,
        });
      }

      recomputeNextBestActions(state);
    },
    generateWeeklyDigests: (
      state,
      action: PayloadAction<{
        weekStartAt: string;
        generatedAt?: string;
      }>,
    ) => {
      const generatedAt = action.payload.generatedAt ?? new Date().toISOString();
      const weekStartTs = new Date(action.payload.weekStartAt).getTime();
      const weekEndTs = weekStartTs + 7 * 24 * 60 * 60 * 1000;

      const parentIds = unique(state.requests.map((r) => r.parentId));
      const childIds = unique(state.exercises.map((e) => e.childId));
      const tutorIds = unique(state.requests.map((r) => r.tutorId));

      parentIds.forEach((parentId) => {
        const parentSessions = state.sessions.filter((s) => s.parentId === parentId);
        const completed = parentSessions.filter((session) => {
          if (!session.completedAt) return false;
          const ts = new Date(session.completedAt).getTime();
          return ts >= weekStartTs && ts < weekEndTs;
        }).length;
        const pendingApprovals = parentSessions.filter(
          (session) => session.status === "awaiting_parent_approval",
        ).length;
        const digest: WeeklyDigest = {
          id: `digest-parent-${parentId}-${action.payload.weekStartAt}`,
          role: "parent",
          targetId: parentId,
          weekStartAt: action.payload.weekStartAt,
          generatedAt,
          summary: `${completed} sessions completed this week.`,
          actionItems:
            pendingApprovals > 0
              ? [`Approve ${pendingApprovals} pending session(s).`]
              : ["Keep current learning rhythm."],
        };
        state.digests = state.digests.filter((d) => d.id !== digest.id);
        state.digests.push(digest);
      });

      childIds.forEach((childId) => {
        const completedExercises = state.exercises.filter((exercise) => {
          if (exercise.childId !== childId || !exercise.completedAt) return false;
          const ts = new Date(exercise.completedAt).getTime();
          return ts >= weekStartTs && ts < weekEndTs;
        }).length;
        const digest: WeeklyDigest = {
          id: `digest-child-${childId}-${action.payload.weekStartAt}`,
          role: "child",
          targetId: childId,
          weekStartAt: action.payload.weekStartAt,
          generatedAt,
          summary: `Great work: ${completedExercises} exercise(s) completed.`,
          actionItems: ["Keep consistency and finish today's mission."],
        };
        state.digests = state.digests.filter((d) => d.id !== digest.id);
        state.digests.push(digest);
      });

      tutorIds.forEach((tutorId) => {
        const tutorRequestsPending = state.requests.filter(
          (request) => request.tutorId === tutorId && request.status === "pending",
        ).length;
        const tutorSessionsCompleted = state.sessions.filter((session) => {
          if (session.tutorId !== tutorId || !session.completedAt) return false;
          const ts = new Date(session.completedAt).getTime();
          return ts >= weekStartTs && ts < weekEndTs;
        }).length;
        const digest: WeeklyDigest = {
          id: `digest-tutor-${tutorId}-${action.payload.weekStartAt}`,
          role: "tutor",
          targetId: tutorId,
          weekStartAt: action.payload.weekStartAt,
          generatedAt,
          summary: `${tutorSessionsCompleted} session(s) completed this week.`,
          actionItems:
            tutorRequestsPending > 0
              ? [`Respond to ${tutorRequestsPending} pending request(s).`]
              : ["Continue sharing session notes on time."],
        };
        state.digests = state.digests.filter((d) => d.id !== digest.id);
        state.digests.push(digest);
      });
    },
    runWorkflowAutomation: (
      state,
      action: PayloadAction<{ now?: string } | undefined>,
    ) => {
      const nowIso = action.payload?.now ?? new Date().toISOString();
      const nowTs = new Date(nowIso).getTime();

      state.requests.forEach((request) => {
        if (request.status !== "pending") return;

        if (!request.reminderSentAt && new Date(request.reminderAt).getTime() <= nowTs) {
          request.reminderSentAt = nowIso;
        }
        if (new Date(request.responseDueAt).getTime() <= nowTs) {
          request.status = "expired";
          request.respondedAt = nowIso;
          const fallback = recommendSimilarTutors(request, state.tutorCatalog);
          request.fallbackTutorIds = fallback;
          state.fallbackSuggestionsByRequestId[request.id] = fallback;
        }
      });

      state.sessions.forEach((session) => {
        if (session.status === "scheduled" && new Date(session.endAt).getTime() <= nowTs) {
          session.status = "awaiting_notes";
        }
        if (session.status === "awaiting_feedback_prompts") {
          maybeCompleteSession(session, nowIso);
        }
      });

      recomputeNextBestActions(state);
    },
  },
});

recomputeNextBestActions(initialState);

export const {
  setOnboardingCompletion,
  createTutoringRequest,
  acceptTutoringRequest,
  declineTutoringRequest,
  runRequestTimingSweep,
  approvePendingSessionByParent,
  runSessionLifecycleSweep,
  submitTutorSessionNote,
  markFeedbackPromptDelivered,
  submitSessionFeedback,
  markExerciseCompleted,
  generateWeeklyDigests,
  runWorkflowAutomation,
} = workflowSlice.actions;

export default workflowSlice.reducer;
