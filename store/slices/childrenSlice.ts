import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Child {
  id: string;
  name: string;
  age: number;
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
      id: 'child-1',
      name: 'Adam',
      age: 8,
      grade: 'CE2',
      avatar: '',
      color: '#3B82F6',
      parentId: 'parent-1',
      progress: 75,
      lessonsCompleted: 15,
      totalLessons: 20,
      weeklyActivity: 5,
      monthlyGrowth: 12,
      favoriteSubjects: ['Mathématiques', 'Sciences'],
      learningGoals: ['Maîtriser les fractions', 'Améliorer la conjugaison'],
    },
    {
      id: 'child-2',
      name: 'Sofia',
      age: 6,
      grade: 'CP',
      avatar: '',
      color: '#EC4899',
      parentId: 'parent-1',
      progress: 60,
      lessonsCompleted: 12,
      totalLessons: 20,
      weeklyActivity: 4,
      monthlyGrowth: 8,
      favoriteSubjects: ['Français', 'Anglais'],
      learningGoals: ['Apprendre à lire', 'Reconnaître les lettres'],
    },
  ],
  activeChildId: 'child-1',
  isLoading: false,
  error: null,
};

export const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    setActiveChild: (state, action: PayloadAction<string>) => {
      state.activeChildId = action.payload;
    },
    addChild: (state, action: PayloadAction<Child>) => {
      state.children.push(action.payload);
    },
    updateChild: (state, action: PayloadAction<{ id: string; updates: Partial<Child> }>) => {
      const index = state.children.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.children[index] = { ...state.children[index], ...action.payload.updates };
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
      action: PayloadAction<{ childId: string; progress: number; lessonsCompleted: number }>
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
