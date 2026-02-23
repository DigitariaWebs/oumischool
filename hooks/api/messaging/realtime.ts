const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidConversationId(
  value: string | undefined | null,
): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export function resolveMessagingSocketUrl(): string {
  const wsEnv = process.env.EXPO_PUBLIC_WS_URL;
  if (wsEnv && wsEnv.trim()) return wsEnv.trim();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";
  if (apiUrl.startsWith("https://")) {
    return apiUrl.replace("https://", "wss://");
  }
  if (apiUrl.startsWith("http://")) {
    return apiUrl.replace("http://", "ws://");
  }
  return apiUrl;
}
