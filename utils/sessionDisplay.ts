import { subjectLabelFromId } from "./subjects";

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function looksLikeOpaqueIdentifier(value: string): boolean {
  const normalized = value.trim();
  if (!normalized) return true;
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      normalized,
    )
  ) {
    return true;
  }
  if (/^[a-f0-9]{24}$/i.test(normalized)) return true;
  if (
    /^(child|student|user|subject|course|matiere|tutor|teacher|session)[_-]?[0-9a-z-]+$/i.test(
      normalized,
    )
  ) {
    return true;
  }
  if (normalized.length > 24 && !/\s/.test(normalized)) return true;
  return false;
}

export function resolveSubjectDisplayName(
  session: Record<string, unknown>,
  fallback = "Cours",
): string {
  const subject = session.subject as Record<string, unknown> | undefined;
  const subjectNameCandidate =
    asNonEmptyString(subject?.name) ??
    asNonEmptyString(session.subjectName) ??
    asNonEmptyString(session.subjectLabel) ??
    asNonEmptyString(session.subjectTitle);

  if (
    subjectNameCandidate &&
    !looksLikeOpaqueIdentifier(subjectNameCandidate)
  ) {
    return subjectNameCandidate;
  }

  const subjectIdCandidate = asNonEmptyString(session.subjectId);
  if (!subjectIdCandidate) return fallback;
  if (looksLikeOpaqueIdentifier(subjectIdCandidate)) return fallback;
  return subjectLabelFromId(subjectIdCandidate, fallback);
}

export function resolveTutorDisplayName(
  session: Record<string, unknown>,
  fallback = "Tuteur",
): string {
  const tutor = session.tutor as Record<string, unknown> | undefined;
  const tutorUser = tutor?.user as Record<string, unknown> | undefined;
  const composedUserName = [
    asNonEmptyString(tutorUser?.firstName) ?? "",
    asNonEmptyString(tutorUser?.lastName) ?? "",
  ]
    .join(" ")
    .trim();
  const tutorEmailPrefix = asNonEmptyString(tutorUser?.email)?.split("@")[0];

  const candidates = [
    asNonEmptyString(composedUserName),
    asNonEmptyString(tutor?.fullName),
    asNonEmptyString(tutor?.name),
    asNonEmptyString(session.tutorName),
    asNonEmptyString(session.teacherName),
    asNonEmptyString(tutorEmailPrefix),
  ].filter((value): value is string => Boolean(value));

  const valid = candidates.find(
    (candidate) =>
      !looksLikeOpaqueIdentifier(candidate) && !candidate.includes("@"),
  );

  if (valid) return valid;

  const tutorIdCandidate = asNonEmptyString(session.tutorId);
  if (tutorIdCandidate && !looksLikeOpaqueIdentifier(tutorIdCandidate)) {
    return tutorIdCandidate;
  }

  return fallback;
}
