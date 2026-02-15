import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "parent" | "child" | "tutor";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  // Parent-specific
  children?: string[]; // IDs of children
  // Child-specific
  parentId?: string;
  grade?: string;
  age?: number;
  // Tutor-specific
  subjects?: string[];
  hourlyRate?: number;
  rating?: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Mock accounts for development
export const MOCK_ACCOUNTS = {
  parent: {
    id: "parent-1",
    email: "fatima@example.com",
    name: "Fatima",
    role: "parent" as UserRole,
    avatar: "",
    phoneNumber: "+33612345678",
    children: ["child-1", "child-2"],
  },
  child1: {
    id: "child-1",
    email: "adam@example.com",
    name: "Adam",
    role: "child" as UserRole,
    avatar: "",
    parentId: "parent-1",
    grade: "CE2",
    age: 8,
  },
  child2: {
    id: "child-2",
    email: "sofia@example.com",
    name: "Sofia",
    role: "child" as UserRole,
    avatar: "",
    parentId: "parent-1",
    grade: "CP",
    age: 6,
  },
  tutor: {
    id: "tutor-1",
    email: "mohamed@tutor.com",
    name: "Mohamed Alami",
    role: "tutor" as UserRole,
    avatar: "",
    subjects: ["Mathématiques", "Sciences"],
    hourlyRate: 25,
    rating: 4.8,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    // Mock login for development
    mockLogin: (state, action: PayloadAction<UserRole>) => {
      const role = action.payload;
      let user: User;

      switch (role) {
        case "parent":
          user = MOCK_ACCOUNTS.parent;
          break;
        case "child":
          user = MOCK_ACCOUNTS.child1;
          break;
        case "tutor":
          user = MOCK_ACCOUNTS.tutor;
          break;
        default:
          user = MOCK_ACCOUNTS.parent;
      }

      state.isAuthenticated = true;
      state.user = user;
      state.token = "mock-token-" + role;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  mockLogin,
} = authSlice.actions;

export default authSlice.reducer;
