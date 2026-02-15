import { UserRole } from "@/store/slices/authSlice";
import { RoleBasedPrompts, QuickPrompt } from "@/src/types";

export const getRoleBasedConfig = (role: UserRole): RoleBasedPrompts => {
  switch (role) {
    case "child":
      return getChildConfig();
    case "parent":
      return getParentConfig();
    case "tutor":
      return getTutorConfig();
    default:
      return getChildConfig();
  }
};

const getChildConfig = (): RoleBasedPrompts => ({
  welcomeMessage:
    "Bonjour ! Je suis ton assistant d'apprentissage. Je peux t'aider avec tes devoirs, t'expliquer des concepts et répondre à tes questions sur toutes tes matières. Qu'est-ce que tu aimerais apprendre aujourd'hui ?",
  quickPrompts: [
    {
      id: "fractions",
      text: "Explique les fractions",
      icon: "calculator",
    },
    {
      id: "conjugation",
      text: "Aide avec la conjugaison",
      icon: "file-text",
    },
    {
      id: "science",
      text: "Question de sciences",
      icon: "flask",
    },
    {
      id: "homework",
      text: "Aide aux devoirs",
      icon: "book-open",
    },
  ],
  capabilities: {
    canAccessChildData: true,
    canAccessPerformanceData: true,
    canAccessSubjects: true,
    canGenerateMaterials: false,
    canAnswerSubjectQuestions: true,
    canProvideRecommendations: false,
  },
  contextAwareResponses: true,
});

const getParentConfig = (): RoleBasedPrompts => ({
  welcomeMessage:
    "Bonjour ! Je suis votre assistant parental. Je peux vous aider à suivre les progrès de vos enfants, analyser leurs performances, identifier leurs points forts et axes d'amélioration. Sélectionnez un enfant pour commencer ou posez-moi vos questions.",
  quickPrompts: [
    {
      id: "performance",
      text: "Voir les performances",
      icon: "chart-line",
      requiresContext: true,
      contextType: "child",
    },
    {
      id: "weaknesses",
      text: "Identifier les difficultés",
      icon: "alert-circle",
      requiresContext: true,
      contextType: "child",
    },
    {
      id: "recommendations",
      text: "Recommandations personnalisées",
      icon: "lightbulb",
      requiresContext: true,
      contextType: "child",
    },
    {
      id: "progress",
      text: "Évolution mensuelle",
      icon: "trending-up",
      requiresContext: true,
      contextType: "child",
    },
  ],
  capabilities: {
    canAccessChildData: true,
    canAccessPerformanceData: true,
    canAccessSubjects: true,
    canGenerateMaterials: false,
    canAnswerSubjectQuestions: false,
    canProvideRecommendations: true,
  },
  contextAwareResponses: true,
});

const getTutorConfig = (): RoleBasedPrompts => ({
  welcomeMessage:
    "Bonjour ! Je suis votre assistant pédagogique. Je peux vous aider à créer du contenu éducatif, générer des exercices, préparer des plans de cours et trouver des ressources pédagogiques adaptées à vos besoins.",
  quickPrompts: [
    {
      id: "lesson-plan",
      text: "Créer un plan de leçon",
      icon: "clipboard",
    },
    {
      id: "exercises",
      text: "Générer des exercices",
      icon: "edit",
    },
    {
      id: "quiz",
      text: "Créer un quiz",
      icon: "help-circle",
    },
    {
      id: "resources",
      text: "Trouver des ressources",
      icon: "search",
    },
  ],
  capabilities: {
    canAccessChildData: false,
    canAccessPerformanceData: false,
    canAccessSubjects: true,
    canGenerateMaterials: true,
    canAnswerSubjectQuestions: true,
    canProvideRecommendations: false,
  },
  contextAwareResponses: true,
});

export const getIconForPrompt = (iconName: string) => {
  const iconMap: Record<string, string> = {
    calculator: "Calculator",
    "file-text": "FileText",
    flask: "Beaker",
    "book-open": "BookOpen",
    "chart-line": "TrendingUp",
    "alert-circle": "AlertCircle",
    lightbulb: "Lightbulb",
    "trending-up": "TrendingUp",
    clipboard: "Clipboard",
    edit: "Edit",
    "help-circle": "HelpCircle",
    search: "Search",
  };
  return iconMap[iconName] || "Sparkles";
};
