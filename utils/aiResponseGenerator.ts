import { UserRole } from "@/store/slices/authSlice";
import { AIContext, AIChatMessage } from "@/types";
import { Child } from "@/store/slices/childrenSlice";
import {
  getPerformanceInsights,
  generateRecommendations,
  getProgressTrend,
  compareToGradeLevel,
  predictCompletionTime,
  getMotivationalMessage,
  formatRecentActivities,
  getSubjectConsistency,
  getNextMilestone,
} from "./performanceHelpers";

interface ResponseGeneratorParams {
  userMessage: string;
  role: UserRole;
  context: AIContext;
  messageHistory?: AIChatMessage[];
}

export const generateAIResponse = ({
  userMessage,
  role,
  context,
  messageHistory,
}: ResponseGeneratorParams): string => {
  const lowerMessage = userMessage.toLowerCase();

  switch (role) {
    case "child":
      return generateChildResponse(lowerMessage, context);
    case "parent":
      return generateParentResponse(lowerMessage, context);
    case "tutor":
      return generateTutorResponse(lowerMessage, context);
    default:
      return "Je suis là pour vous aider. Posez-moi vos questions !";
  }
};

const generateChildResponse = (message: string, context: AIContext): string => {
  // Subject-specific responses
  if (message.includes("fraction")) {
    return `Les fractions, c'est simple ! Imagine une pizza. 🍕

Si tu la coupes en 4 parts égales, chaque part représente 1/4 (un quart).

📐 Le chiffre du bas (dénominateur) dit en combien de parts on coupe.
📊 Le chiffre du haut (numérateur) dit combien on en prend.

**Exemple :** 3/4 = 3 parts sur 4 parts totales

Tu veux que je t'explique comment additionner des fractions ?`;
  }

  if (message.includes("conjugaison") || message.includes("verbe")) {
    return `La conjugaison, c'est apprendre comment les verbes changent selon qui fait l'action ! 📝

**Les 3 groupes de verbes :**
- 1er groupe : verbes en -er (manger, jouer)
- 2ème groupe : verbes en -ir (finir, choisir)
- 3ème groupe : verbes irréguliers (être, avoir, aller)

**Exemple avec "manger" au présent :**
- Je mange
- Tu manges
- Il/Elle mange
- Nous mangeons
- Vous mangez
- Ils/Elles mangent

Quel verbe veux-tu apprendre à conjuguer ?`;
  }

  if (message.includes("science") || message.includes("biologie")) {
    return `Les sciences, c'est passionnant ! 🔬

Je peux t'aider avec :
- Les animaux et les plantes
- Le corps humain
- L'eau et les états de la matière
- Le système solaire
- Les expériences scientifiques

Qu'est-ce qui t'intéresse le plus ?`;
  }

  if (message.includes("devoirs") || message.includes("aide")) {
    return `Je suis là pour t'aider avec tes devoirs ! 📚

Dis-moi :
- Quelle matière ?
- Quel est l'exercice ou le sujet ?

Je vais t'expliquer étape par étape pour que tu comprennes bien ! N'hésite pas à poser toutes tes questions.`;
  }

  if (message.includes("mathématiques") || message.includes("maths")) {
    return `Les mathématiques, c'est amusant ! 🧮

Je peux t'aider avec :
- Les additions et soustractions
- Les multiplications et divisions
- Les fractions
- La géométrie
- Les problèmes mathématiques

De quoi as-tu besoin en particulier ?`;
  }

  // Context-aware response for child's own data
  if (context.type === "subject" && context.subjectName) {
    return `Super ! Parlons de ${context.subjectName}. Qu'est-ce que tu veux apprendre ou réviser dans cette matière ?`;
  }

  // Default child response
  return `Je suis là pour t'aider à apprendre ! 🌟

Tu peux me poser des questions sur :
- Les mathématiques
- Le français
- Les sciences
- L'histoire-géographie
- Et toutes tes autres matières !

Qu'est-ce que tu veux apprendre aujourd'hui ?`;
};

const generateParentResponse = (
  message: string,
  context: AIContext,
): string => {
  // Context-aware responses for specific child
  if (context.type === "child" && context.childData) {
    const child = context.childData;

    if (message.includes("performance") || message.includes("résultat")) {
      const insights = getPerformanceInsights(child);
      const trend = getProgressTrend(child.monthlyGrowth);
      const comparison = compareToGradeLevel(child);
      const completion = predictCompletionTime(child);
      const motivation = getMotivationalMessage(child);

      return `📊 **Rapport de Performances - ${child.name}**

**Vue d'ensemble:**
• Progression globale: ${child.progress}%
• Leçons: ${child.lessonsCompleted}/${child.totalLessons} complétées
• Activité: ${child.weeklyActivity} sessions/semaine
• Tendance: ${trend}

**Comparaison:**
${comparison}

**Estimation:**
${completion}

${insights}

${motivation}

Voulez-vous des détails sur une matière ou des recommandations personnalisées ?`;
    }

    if (
      message.includes("difficulté") ||
      message.includes("faiblesse") ||
      message.includes("problème")
    ) {
      const weaknesses = child.weaknesses || [];
      const recommendations = generateRecommendations(child);
      const consistency = getSubjectConsistency(child);

      return `🎯 **Analyse des Difficultés - ${child.name}**

**Points à améliorer:**
${weaknesses.length > 0 ? weaknesses.map((w) => `• ${w}`).join("\n") : "Aucune difficulté majeure identifiée"}

**Équilibre des matières:**
${consistency}

**Recommandations personnalisées:**
${recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

**Actions immédiates:**
- Focus cette semaine sur les points faibles identifiés
- Sessions courtes (20-25 min) mais régulières
- Renforcement positif après chaque progrès

Voulez-vous un plan d'action détaillé ?`;
    }

    if (
      message.includes("recommandation") ||
      message.includes("conseil") ||
      message.includes("suggestion")
    ) {
      const recommendations = generateRecommendations(child);
      const nextMilestone = getNextMilestone(child);
      const motivation = getMotivationalMessage(child);

      return `💡 **Recommandations Personnalisées - ${child.name}**

**Profil:** ${child.grade}, ${child.progress}% de progression

**Recommandations prioritaires:**
${recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

**Prochain objectif:**
${nextMilestone}

**Plan d'action suggéré:**
• Lundi/Mercredi/Vendredi: Sessions principales (30 min)
• Mardi/Jeudi: Révisions courtes (15 min)
• Week-end: Activités ludiques éducatives

**Matières favorites:** ${child.favoriteSubjects?.join(", ") || "Non défini"}
**Objectifs d'apprentissage:** ${child.learningGoals?.join(" | ") || "À définir"}

${motivation}

Souhaitez-vous des conseils sur une matière spécifique ?`;
    }

    if (
      message.includes("progrès") ||
      message.includes("évolution") ||
      message.includes("amélioration")
    ) {
      const trend = getProgressTrend(child.monthlyGrowth);
      const comparison = compareToGradeLevel(child);
      const recentActivities = formatRecentActivities(child);
      const motivation = getMotivationalMessage(child);

      return `📈 **Évolution et Progrès - ${child.name}**

**Ce mois-ci:**
• Croissance: +${child.monthlyGrowth}%
• Activité: ${child.weeklyActivity} sessions/semaine
• Leçons complétées: ${child.lessonsCompleted}/${child.totalLessons}

**Tendance:**
${trend}

**Position:**
${comparison}

${recentActivities}

**Objectifs en cours:**
${child.learningGoals && child.learningGoals.length > 0 ? child.learningGoals.map((g, i) => `${i + 1}. ${g}`).join("\n") : "Aucun objectif défini pour le moment"}

${motivation}

Voulez-vous définir de nouveaux objectifs ou ajuster le rythme d'apprentissage ?`;
    }

    // Default with child context
    const nextMilestone = getNextMilestone(child);
    const motivation = getMotivationalMessage(child);

    return `👋 Contexte actif: **${child.name}** (${child.grade})

${motivation}

**Prochain objectif:** ${nextMilestone}

**Je peux vous aider avec:**
📊 Performances détaillées et statistiques
🎯 Identification des difficultés et forces
💡 Recommandations personnalisées
📈 Suivi de l'évolution mensuelle
🗓️ Planification d'activités
📚 Conseils par matière

Que souhaitez-vous savoir sur ${child.name} ?`;
  }

  // No child context
  if (
    message.includes("enfant") ||
    message.includes("child") ||
    message.includes("sélection")
  ) {
    return `👨‍👩‍👧‍👦 **Sélection de contexte**

Pour vous fournir des analyses précises, veuillez d'abord sélectionner l'enfant concerné.

Une fois le contexte défini, je pourrai vous aider avec :
- Analyse détaillée des performances
- Identification des points forts et faibles
- Recommandations personnalisées
- Suivi de la progression
- Conseils pédagogiques adaptés

Sélectionnez un enfant pour commencer !`;
  }

  // General parent questions
  if (message.includes("comment") && message.includes("motiv")) {
    return `🎯 **Conseils pour motiver votre enfant**

1. **Célébrer les petites victoires** - Chaque progrès compte !
2. **Créer une routine** - Sessions courtes mais régulières
3. **Rendre l'apprentissage ludique** - Utiliser les jeux éducatifs
4. **Être présent et encourageant** - Montrer de l'intérêt pour ses activités
5. **Fixer des objectifs réalisables** - Progresser étape par étape

**Système de récompenses suggéré :**
- 5 sessions = petite récompense
- 1 semaine complète = activité spéciale
- Objectif atteint = grande célébration

Voulez-vous des conseils spécifiques pour un de vos enfants ?`;
  }

  // Default parent response
  return `Bonjour ! Je suis votre assistant parental. 👨‍👩‍👧‍👦

Pour une analyse personnalisée, veuillez sélectionner un enfant.

Je peux ensuite vous aider avec :
📊 Analyse des performances
🎯 Identification des difficultés
💡 Recommandations personnalisées
📈 Suivi de la progression
🎓 Conseils pédagogiques

Comment puis-je vous aider aujourd'hui ?`;
};

const generateTutorResponse = (message: string, context: AIContext): string => {
  if (
    message.includes("plan de leçon") ||
    message.includes("plan de cours") ||
    message.includes("leçon")
  ) {
    return `📋 **Création de plan de leçon**

Je peux vous aider à créer un plan de leçon structuré !

**De quoi avez-vous besoin ?**
- Matière/sujet
- Niveau (CP, CE1, CE2, etc.)
- Durée souhaitée
- Objectifs pédagogiques

**Le plan inclura :**
✓ Introduction et objectifs
✓ Concepts clés à enseigner
✓ Activités pratiques
✓ Exercices d'application
✓ Évaluation

Donnez-moi les détails et je génère le plan !`;
  }

  if (message.includes("exercice") || message.includes("activité")) {
    return `✏️ **Génération d'exercices**

Je peux créer des exercices adaptés à vos besoins !

**Spécifiez :**
- Matière (maths, français, sciences...)
- Niveau de difficulté
- Type (QCM, problèmes, rédaction...)
- Nombre d'exercices
- Thème ou concept spécifique

**Types d'exercices disponibles :**
📝 Exercices à trous
🎯 Questions à choix multiples
🧮 Problèmes mathématiques
📖 Compréhension de texte
✍️ Exercices de rédaction

Quels exercices voulez-vous créer ?`;
  }

  if (message.includes("quiz") || message.includes("évaluation")) {
    return `📝 **Création de quiz**

Je peux générer un quiz personnalisé !

**Paramètres du quiz :**
- Matière et thème
- Niveau des élèves
- Nombre de questions (5-20)
- Type de questions (QCM, Vrai/Faux, Réponse courte)
- Temps suggéré

**Format du quiz :**
✓ Questions progressives (facile → difficile)
✓ Corrigé détaillé inclus
✓ Barème de notation
✓ Critères d'évaluation

Donnez-moi les détails pour créer votre quiz !`;
  }

  if (message.includes("ressource") || message.includes("matériel")) {
    return `🔍 **Ressources pédagogiques**

Je peux vous aider à trouver des ressources adaptées !

**Types de ressources :**
📚 Supports de cours
🎥 Vidéos éducatives
🖼️ Images et schémas
🎮 Jeux pédagogiques
📊 Outils d'évaluation
📖 Lectures recommandées

**Pour quelle matière et niveau ?**
Donnez-moi plus de détails et je vous suggère les meilleures ressources !`;
  }

  if (
    message.includes("différenciation") ||
    message.includes("adapter") ||
    message.includes("niveau")
  ) {
    return `🎯 **Différenciation pédagogique**

Adapter l'enseignement à différents niveaux :

**Stratégies suggérées :**
1. **Groupes de niveau** - Exercices adaptés à chaque groupe
2. **Supports variés** - Visuel, auditif, kinesthésique
3. **Rythmes différents** - Laisser le temps nécessaire
4. **Aides graduées** - Indices progressifs selon les besoins
5. **Évaluations flexibles** - Formats adaptés

**Outils :**
- Fiches de différents niveaux
- Exercices à étapes
- Bonus pour les plus rapides
- Supports visuels supplémentaires

Sur quel concept voulez-vous différencier ?`;
  }

  // Context-aware for subject
  if (context.type === "subject" && context.subjectName) {
    return `📚 **Ressources pour ${context.subjectName}**

Je peux vous aider à créer du contenu pour cette matière !

Que souhaitez-vous :
- Plans de leçons
- Exercices pratiques
- Quiz d'évaluation
- Activités ludiques
- Fiches de révision

Quel type de contenu vous intéresse ?`;
  }

  // Default tutor response
  return `Bonjour ! Je suis votre assistant pédagogique. 👨‍🏫

Je peux vous aider avec :

📋 **Planification**
- Plans de leçons structurés
- Progression pédagogique

✏️ **Création de contenu**
- Exercices variés
- Quiz et évaluations
- Fiches d'activités

🔍 **Ressources**
- Matériel pédagogique
- Outils d'enseignement

🎯 **Différenciation**
- Adapter aux niveaux
- Supports variés

Comment puis-je vous assister aujourd'hui ?`;
};

// Helper function to determine child weaknesses
const getChildWeaknesses = (child: Child): string => {
  const progress = child.progress;
  const subjects = child.favoriteSubjects || [];

  if (progress < 50) {
    return `**Plusieurs domaines nécessitent attention :**
- Progression globale faible (${progress}%)
- Probablement des bases à renforcer
- Manque possible de pratique régulière`;
  } else if (progress < 70) {
    return `**Points à améliorer :**
- Progression modérée (${progress}%)
- Certains concepts restent à consolider
- Besoin de plus de pratique sur les sujets difficiles`;
  } else {
    return `**Axes d'optimisation :**
- Excellente progression globale (${progress}%)
- Travailler les matières moins favorites
- Approfondir les concepts avancés`;
  }
};

export const getContextualPrompt = (
  role: UserRole,
  context: AIContext,
): string => {
  if (role === "parent" && context.type === "child" && context.childData) {
    return `Contexte actif : ${context.childData.name}`;
  }
  if (context.type === "subject" && context.subjectName) {
    return `Contexte actif : ${context.subjectName}`;
  }
  return "";
};
