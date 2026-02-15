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
  children: [
    {
      id: "child-1",
      name: "Adam",
      dateOfBirth: "2016-03-15",
      grade: "CE2",
      avatar: "",
      color: "#3B82F6",
      parentId: "parent-1",
      progress: 75,
      lessonsCompleted: 15,
      totalLessons: 20,
      weeklyActivity: 5,
      monthlyGrowth: 12,
      favoriteSubjects: ["Mathématiques", "Sciences"],
      learningGoals: ["Maîtriser les fractions", "Améliorer la conjugaison"],
      subjectScores: {
        math: {
          subjectName: "Mathématiques",
          averageScore: 85,
          progress: 80,
          lessonsCompleted: 8,
          totalLessons: 10,
          lastActivity: "2024-01-15",
        },
        french: {
          subjectName: "Français",
          averageScore: 72,
          progress: 65,
          lessonsCompleted: 5,
          totalLessons: 10,
          lastActivity: "2024-01-14",
        },
        science: {
          subjectName: "Sciences",
          averageScore: 88,
          progress: 85,
          lessonsCompleted: 6,
          totalLessons: 8,
          lastActivity: "2024-01-16",
        },
      },
      strengths: [
        "Calcul mental",
        "Raisonnement logique",
        "Sciences naturelles",
      ],
      weaknesses: ["Orthographe", "Conjugaison du passé composé"],
      recentActivities: [
        {
          id: "act-1",
          type: "quiz",
          title: "Les fractions",
          subject: "Mathématiques",
          score: 90,
          completedAt: "2024-01-15T14:30:00Z",
        },
        {
          id: "act-2",
          type: "lesson",
          title: "La conjugaison",
          subject: "Français",
          completedAt: "2024-01-14T10:15:00Z",
        },
      ],
    },
    {
      id: "child-2",
      name: "Sofia",
      dateOfBirth: "2018-07-22",
      grade: "CP",
      avatar: "",
      color: "#EC4899",
      parentId: "parent-1",
      progress: 60,
      lessonsCompleted: 12,
      totalLessons: 20,
      weeklyActivity: 4,
      monthlyGrowth: 8,
      favoriteSubjects: ["Français", "Anglais"],
      learningGoals: ["Apprendre à lire", "Reconnaître les lettres"],
      subjectScores: {
        french: {
          subjectName: "Français",
          averageScore: 78,
          progress: 70,
          lessonsCompleted: 7,
          totalLessons: 10,
          lastActivity: "2024-01-15",
        },
        math: {
          subjectName: "Mathématiques",
          averageScore: 65,
          progress: 55,
          lessonsCompleted: 4,
          totalLessons: 10,
          lastActivity: "2024-01-13",
        },
      },
      strengths: ["Lecture", "Mémorisation", "Expression orale"],
      weaknesses: ["Calcul simple", "Concentration prolongée"],
      recentActivities: [
        {
          id: "act-3",
          type: "exercise",
          title: "Les syllabes",
          subject: "Français",
          score: 85,
          completedAt: "2024-01-15T11:20:00Z",
        },
      ],
    },
  ],
  activeChildId: "child-1",
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
