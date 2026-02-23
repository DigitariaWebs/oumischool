const SUBJECT_NAME_MAP: Record<string, string> = {
  math: "Maths",
  mathematics: "Maths",
  maths: "Maths",
  fr: "Français",
  french: "Français",
  francais: "Français",
  français: "Français",
  science: "Sciences",
  sciences: "Sciences",
  english: "Anglais",
  anglais: "Anglais",
  history: "Histoire",
  histoire: "Histoire",
};

function prettifySubjectToken(value: string): string {
  if (!value) return "";
  const normalized = value.replace(/[_-]+/g, " ").trim();
  if (!normalized) return "";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function subjectLabelFromId(
  subjectIdOrName: unknown,
  fallback = "Matière",
): string {
  if (typeof subjectIdOrName !== "string") return fallback;
  const raw = subjectIdOrName.trim();
  if (!raw) return fallback;
  const key = raw.toLowerCase();
  return SUBJECT_NAME_MAP[key] ?? (prettifySubjectToken(raw) || fallback);
}
