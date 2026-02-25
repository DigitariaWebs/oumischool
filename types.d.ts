import { Child } from "@/store/slices/childrenSlice";
import { ComponentType } from "react";
import { ViewStyle } from "react-native";

export interface ExerciseItem {
  id: number;
  subject: string;
  title: string;
  description: string;
  Icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
  route: string;
  progress?: number;
}

// UI Component Types
export interface BlobBackgroundProps {
  colors?: string[];
  opacity?: number;
  style?: ViewStyle;
}

export interface HeroCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: {
    icon: React.ReactNode;
    text: string;
  };
  gradientColors?: string[];
  children?: React.ReactNode;
  style?: ViewStyle;
}

export interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down";
  style?: ViewStyle;
}

export interface TabHeaderProps {
  title: string;
  icon: React.ReactNode;
  badge?: string | number;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
  delay?: number;
  style?: ViewStyle;
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  delay?: number;
  style?: ViewStyle;
}

// AI Chatbot Types
export interface AIChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string; // ISO string instead of Date for Redux serialization
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

// Tutor Types
export interface Tutor {
  id: string;
  name: string;
  subjects: Subject[];
  rating: number;
  reviewsCount: number;
  bio: string;
  avatar?: string;
  hourlyRate: number;
  availability: string[];
  languages: string[];
  experience: number;
  inPersonAvailable: boolean;
  inPersonRate?: number;
}

export interface TutorRecommendation {
  tutorId: string;
  childId: string;
  reason: string; // e.g., "Recommended for Math based on child's performance"
  subjectId: string;
}

// Curriculum and Lesson Types
export interface Lesson {
  id: string;
  title: string;
  order: number;
  description?: string;
  duration?: string;
  resources?: LessonResource[];
}

export interface LessonResource {
  id: string;
  type: "pdf" | "video" | "worksheet" | "interactive";
  title: string;
  url: string;
}

export interface Curriculum {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  description: string;
  lessonsCount: number;
  duration: string;
  level: string;
  lessons: Lesson[];
  tutorId: string;
}

// Booking Types
export interface BookingDetails {
  tutorId: string;
  childrenIds: string[];
  mode: "online" | "inPerson";
  day: string;
  timeSlot: string;
  recurring: boolean;
  totalPrice: number;
  startDate?: Date;
}

export interface TutorAvailability {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface TutorMethodology {
  approach: string;
  techniques: string[];
}

export interface TutorReview {
  id: string;
  parentName: string;
  childName: string;
  rating: number;
  date: string;
  comment: string;
}

// Messaging Types
export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string; // ISO string for serialization
  senderId: string;
  isOwn: boolean;
  isRead: boolean;
  attachment?: {
    type: "image" | "file";
    url: string;
    name?: string;
  };
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: "tutor" | "parent";
  lastMessage: string;
  lastMessageTime: string; // ISO string
  unreadCount: number;
  isOnline: boolean;
}

// Pricing & Payment Types
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: "month" | "year";
  description: string;
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "bank";
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  date: string; // ISO string
  status: "completed" | "pending" | "failed";
  description: string;
  invoiceUrl?: string;
}

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: "active" | "canceled" | "expired";
  startDate: string; // ISO string
  endDate?: string; // ISO string
  autoRenew: boolean;
  paymentMethodId: string;
}
