import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Child {
  id: string;
  name: string;
  dateOfBirth: string; // ISO date string (YYYY-MM-DD)
  grade: string;
  avatar: string;
  color: string;
  parentId: string;
  // Learning progress
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  weeklyActivity: number;
  monthlyGrowth: number;
  // Preferences
  favoriteSubjects?: string[];
  learningGoals?: string[];
  // Performance tracking
  subjectScores?: {
    [subjectId: string]: {
      subjectName: string;
      averageScore: number;
      progress: number;
      lessonsCompleted: number;
      totalLessons: number;
      lastActivity?: string;
    };
  };
  strengths?: string[];
  weaknesses?: string[];
  recentActivities?: {
    id: string;
    type: "lesson" | "exercise" | "quiz";
    title: string;
    subject: string;
    score?: number;
    completedAt: string;
  }[];
}

interface ChildrenState {
  children: Child[];
  activeChildId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChildrenState = {
  children: [],
  activeChildId: null,
  isLoading: false,
  error: null,
};

export const childrenSlice = createSlice({
  name: "children",
  initialState,
  reducers: {
    setActiveChild: (state, action: PayloadAction<string>) => {
      state.activeChildId = action.payload;
    },
    addChild: (state, action: PayloadAction<Child>) => {
      state.children.push(action.payload);
    },
    updateChild: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Child> }>,
    ) => {
      const index = state.children.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.children[index] = {
          ...state.children[index],
          ...action.payload.updates,
        };
      }
    },
    removeChild: (state, action: PayloadAction<string>) => {
      state.children = state.children.filter((c) => c.id !== action.payload);
      if (state.activeChildId === action.payload) {
        state.activeChildId = state.children[0]?.id || null;
      }
    },
    updateProgress: (
      state,
      action: PayloadAction<{
        childId: string;
        progress: number;
        lessonsCompleted: number;
      }>,
    ) => {
      const child = state.children.find((c) => c.id === action.payload.childId);
      if (child) {
        child.progress = action.payload.progress;
        child.lessonsCompleted = action.payload.lessonsCompleted;
      }
    },
  },
});

export const {
  setActiveChild,
  addChild,
  updateChild,
  removeChild,
  updateProgress,
} = childrenSlice.actions;

export default childrenSlice.reducer;
