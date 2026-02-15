import { Child } from "@/store/slices/childrenSlice";

/**
 * Generate detailed performance insights for a child
 */
export const getPerformanceInsights = (child: Child): string => {
  const { progress, subjectScores, strengths, weaknesses } = child;

  let insights = "";

  // Overall assessment
  if (progress >= 80) {
    insights += "🌟 Excellent niveau général\n";
  } else if (progress >= 60) {
    insights += "📈 Bon niveau avec des marges de progression\n";
  } else {
    insights += "⚠️ Nécessite un accompagnement renforcé\n";
  }

  // Subject breakdown
  if (subjectScores) {
    insights += "\n**Détail par matière:**\n";
    Object.values(subjectScores).forEach((subject) => {
      const emoji =
        subject.averageScore >= 80
          ? "✅"
          : subject.averageScore >= 60
            ? "🔶"
            : "❌";
      insights += `${emoji} ${subject.subjectName}: ${subject.averageScore}% (${subject.lessonsCompleted}/${subject.totalLessons} leçons)\n`;
    });
  }

  // Strengths
  if (strengths && strengths.length > 0) {
    insights += `\n**Points forts:**\n${strengths.map((s) => `• ${s}`).join("\n")}\n`;
  }

  // Weaknesses
  if (weaknesses && weaknesses.length > 0) {
    insights += `\n**Points à améliorer:**\n${weaknesses.map((w) => `• ${w}`).join("\n")}\n`;
  }

  return insights;
};

/**
 * Generate recommendations based on child's performance
 */
export const generateRecommendations = (child: Child): string[] => {
  const recommendations: string[] = [];
  const { progress, weeklyActivity, subjectScores } = child;

  // Activity-based recommendations
  if (weeklyActivity < 3) {
    recommendations.push("Augmenter la fréquence à 4-5 sessions par semaine");
  } else if (weeklyActivity >= 5) {
    recommendations.push("Excellente régularité ! Maintenir ce rythme");
  }

  // Progress-based recommendations
  if (progress < 50) {
    recommendations.push("Revoir les bases avec du contenu adapté");
    recommendations.push("Sessions courtes (15-20 min) mais fréquentes");
  } else if (progress < 70) {
    recommendations.push("Consolider les acquis avant d'avancer");
    recommendations.push("Alterner révisions et nouveaux concepts");
  } else {
    recommendations.push("Introduire des défis plus avancés");
    recommendations.push("Explorer des sujets complémentaires");
  }

  // Subject-specific recommendations
  if (subjectScores) {
    const weakSubjects = Object.values(subjectScores).filter(
      (s) => s.averageScore < 70,
    );
    if (weakSubjects.length > 0) {
      weakSubjects.forEach((subject) => {
        recommendations.push(
          `Focus sur ${subject.subjectName}: 2-3 sessions ciblées cette semaine`,
        );
      });
    }
  }

  return recommendations;
};

/**
 * Calculate monthly trend
 */
export const getProgressTrend = (monthlyGrowth: number): string => {
  if (monthlyGrowth > 15) {
    return "📈 Progression exceptionnelle";
  } else if (monthlyGrowth > 10) {
    return "📈 Très bonne progression";
  } else if (monthlyGrowth > 5) {
    return "➡️ Progression régulière";
  } else if (monthlyGrowth > 0) {
    return "⬆️ Légère progression";
  } else if (monthlyGrowth === 0) {
    return "➡️ Stagnation";
  } else {
    return "⬇️ Régression - intervention nécessaire";
  }
};

/**
 * Get study recommendations by time of day
 */
export const getOptimalStudyTime = (child: Child): string => {
  // Mock logic - in real app, would analyze activity patterns
  return `**Meilleurs créneaux pour ${child.name}:**
• Matin: 9h-11h (concentration maximale)
• Après-midi: 16h-17h30 (révisions)
• Éviter: après 19h (fatigue)`;
};

/**
 * Generate comparison with grade average
 */
export const compareToGradeLevel = (child: Child): string => {
  const { progress, grade } = child;

  // Mock grade averages
  const gradeAverages: Record<string, number> = {
    CP: 65,
    CE1: 68,
    CE2: 70,
    CM1: 72,
    CM2: 75,
  };

  const gradeAvg = gradeAverages[grade] || 70;
  const diff = progress - gradeAvg;

  if (diff > 10) {
    return `🏆 ${Math.abs(diff)} points au-dessus de la moyenne ${grade}`;
  } else if (diff > 0) {
    return `✅ Légèrement au-dessus de la moyenne ${grade}`;
  } else if (diff > -10) {
    return `➡️ Proche de la moyenne ${grade}`;
  } else {
    return `⚠️ ${Math.abs(diff)} points en dessous de la moyenne ${grade}`;
  }
};

/**
 * Predict time to complete current level
 */
export const predictCompletionTime = (child: Child): string => {
  const { lessonsCompleted, totalLessons, weeklyActivity } = child;
  const remaining = totalLessons - lessonsCompleted;

  if (remaining <= 0) {
    return "✅ Niveau complété !";
  }

  const weeksNeeded = Math.ceil(remaining / weeklyActivity);

  if (weeksNeeded <= 2) {
    return `⚡ Environ ${weeksNeeded} semaine${weeksNeeded > 1 ? "s" : ""} au rythme actuel`;
  } else if (weeksNeeded <= 4) {
    return `📅 Environ 1 mois au rythme actuel`;
  } else {
    return `📅 Environ ${Math.ceil(weeksNeeded / 4)} mois au rythme actuel`;
  }
};

/**
 * Get motivational message based on progress
 */
export const getMotivationalMessage = (child: Child): string => {
  const { progress, monthlyGrowth } = child;

  if (monthlyGrowth > 15) {
    return "🔥 Progression incroyable ! Continue sur cette lancée !";
  } else if (monthlyGrowth > 10) {
    return "⭐ Très beaux progrès ! L'effort paie !";
  } else if (progress >= 80) {
    return "🏆 Excellent travail ! Tu es sur la bonne voie !";
  } else if (progress >= 60) {
    return "👍 Bon travail ! Quelques efforts supplémentaires pour atteindre l'excellence !";
  } else if (monthlyGrowth > 0) {
    return "💪 Tu progresses ! Continue, chaque effort compte !";
  } else {
    return "🌱 Chaque grand parcours commence par un premier pas. Tu peux le faire !";
  }
};

/**
 * Format recent activities for display
 */
export const formatRecentActivities = (child: Child): string => {
  if (!child.recentActivities || child.recentActivities.length === 0) {
    return "Aucune activité récente";
  }

  let output = "**Activités récentes:**\n";
  child.recentActivities.slice(0, 5).forEach((activity) => {
    const icon =
      activity.type === "lesson"
        ? "📖"
        : activity.type === "quiz"
          ? "📝"
          : "✏️";
    const scoreText = activity.score ? ` - ${activity.score}%` : "";
    const date = new Date(activity.completedAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
    output += `${icon} ${activity.title} (${activity.subject})${scoreText} - ${date}\n`;
  });

  return output;
};

/**
 * Calculate subject consistency (how regularly child studies each subject)
 */
export const getSubjectConsistency = (child: Child): string => {
  if (!child.subjectScores) {
    return "Données insuffisantes";
  }

  const subjects = Object.values(child.subjectScores);
  const avgProgress =
    subjects.reduce((sum, s) => sum + s.progress, 0) / subjects.length;
  const variance =
    subjects.reduce(
      (sum, s) => sum + Math.pow(s.progress - avgProgress, 2),
      0,
    ) / subjects.length;

  if (variance < 100) {
    return "✅ Très équilibré - progression uniforme sur toutes les matières";
  } else if (variance < 300) {
    return "🔶 Assez équilibré - quelques matières en retard";
  } else {
    return "⚠️ Déséquilibré - besoin de rééquilibrer l'attention entre matières";
  }
};

/**
 * Get learning style suggestion based on performance patterns
 */
export const getLearningStyleSuggestion = (child: Child): string => {
  // Mock implementation - in real app, would analyze performance data
  const styles = [
    "visuel (schémas, vidéos, images)",
    "auditif (explications orales, podcasts)",
    "kinesthésique (manipulation, expériences)",
    "lecture/écriture (textes, résumés)",
  ];

  // Simple logic based on favorite subjects
  const favorites = child.favoriteSubjects || [];
  if (favorites.includes("Mathématiques") || favorites.includes("Sciences")) {
    return `💡 Style d'apprentissage suggéré: ${styles[0]} et ${styles[2]}`;
  } else if (favorites.includes("Français") || favorites.includes("Anglais")) {
    return `💡 Style d'apprentissage suggéré: ${styles[1]} et ${styles[3]}`;
  } else {
    return `💡 Style d'apprentissage suggéré: Combiner ${styles[0]} et ${styles[1]}`;
  }
};

/**
 * Get next milestone for the child
 */
export const getNextMilestone = (child: Child): string => {
  const { progress, lessonsCompleted, totalLessons } = child;

  if (lessonsCompleted >= totalLessons) {
    return "🎉 Passer au niveau supérieur !";
  } else if (progress >= 90) {
    return `🎯 Compléter les ${totalLessons - lessonsCompleted} dernières leçons`;
  } else if (progress >= 75) {
    return "🎯 Atteindre 90% de progression";
  } else if (progress >= 50) {
    return "🎯 Atteindre 75% de progression";
  } else {
    return "🎯 Atteindre 50% de progression";
  }
};
