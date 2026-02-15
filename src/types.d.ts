import { UserRole } from "@/store/slices/authSlice";
import { Child } from "@/store/slices/childrenSlice";

// AI Chatbot Types
export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export interface AIContext {
  type: "child" | "subject" | "general" | null;
  childId?: string;
  childData?: Child;
  subjectId?: string;
  subjectName?: string;
}

export interface ChatbotCapabilities {
  canAccessChildData: boolean;
  canAccessPerformanceData: boolean;
  canAccessSubjects: boolean;
  canGenerateMaterials: boolean;
  canAnswerSubjectQuestions: boolean;
  canProvideRecommendations: boolean;
}

export interface RoleBasedPrompts {
  welcomeMessage: string;
  quickPrompts: QuickPrompt[];
  capabilities: ChatbotCapabilities;
  contextAwareResponses: boolean;
}

export interface QuickPrompt {
  id: string;
  text: string;
  icon: string;
  requiresContext?: boolean;
  contextType?: "child" | "subject";
}

// Subject Types
export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Performance Types
export interface ChildPerformance {
  childId: string;
  overallProgress: number;
  subjectPerformance: SubjectPerformance[];
  recentActivity: ActivityRecord[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  progress: number;
  averageScore: number;
  lessonsCompleted: number;
  totalLessons: number;
  lastActivity: Date;
}

export interface ActivityRecord {
  id: string;
  type: "lesson" | "exercise" | "quiz";
  subjectId: string;
  title: string;
  score?: number;
  completedAt: Date;
}

// Tutor Material Types
export interface TutorMaterial {
  id: string;
  title: string;
  type: "lesson" | "exercise" | "quiz" | "worksheet";
  subjectId: string;
  grade: string;
  description: string;
  content?: string;
  createdAt: Date;
}
