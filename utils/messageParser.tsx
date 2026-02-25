import React from "react";
import { Text, View } from "react-native";
import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";

export interface ParsedContent {
  type:
    | "text"
    | "bold"
    | "italic"
    | "list"
    | "heading"
    | "tip"
    | "stat"
    | "code";
  content: string;
  items?: string[];
}

export function parseMessageContent(text: string): ParsedContent[][] {
  const lines = text.split("\n");
  const result: ParsedContent[][] = [];
  let currentLine: ParsedContent[] = [];
  let inList = false;
  let listItems: string[] = [];

  const processInlineFormatting = (line: string): ParsedContent[] => {
    const parts: ParsedContent[] = [];
    let remaining = line;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
      if (boldMatch) {
        parts.push({ type: "bold", content: boldMatch[1] });
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      const italicMatch = remaining.match(/^\*(.+?)\*/);
      if (italicMatch) {
        parts.push({ type: "italic", content: italicMatch[1] });
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      const codeMatch = remaining.match(/^`(.+?)`/);
      if (codeMatch) {
        parts.push({ type: "code", content: codeMatch[1] });
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      const match = remaining.match(/^[^*`]+/);
      if (match) {
        parts.push({ type: "text", content: match[0] });
        remaining = remaining.slice(match[0].length);
      } else {
        break;
      }
    }

    return parts.length > 0 ? parts : [{ type: "text", content: "" }];
  };

  const processLine = (line: string): ParsedContent[] => {
    const trimmed = line.trim();

    if (
      trimmed.startsWith("📊") ||
      trimmed.startsWith("📈") ||
      trimmed.startsWith("🎯") ||
      trimmed.startsWith("💡") ||
      trimmed.startsWith("📋") ||
      trimmed.startsWith("✏️") ||
      trimmed.startsWith("📝") ||
      trimmed.startsWith("🔍") ||
      trimmed.startsWith("👋")
    ) {
      return [{ type: "heading", content: trimmed }];
    }

    if (
      trimmed.startsWith("✓") ||
      trimmed.startsWith("•") ||
      trimmed.startsWith("- ")
    ) {
      return [{ type: "list", content: trimmed.replace(/^[✓•-]\s*/, "") }];
    }

    if (trimmed.match(/^\d+\.\s/)) {
      return [{ type: "list", content: trimmed.replace(/^\d+\.\s*/, "") }];
    }

    if (
      trimmed.startsWith("💡") ||
      trimmed.startsWith("🎯") ||
      trimmed.startsWith("📌")
    ) {
      return [{ type: "tip", content: trimmed.replace(/^[💡🎯📌]\s*/, "") }];
    }

    if (trimmed.match(/^[A-ZÀÂÇÉÈÊÎÏÔÛÜ]{2,}.*:$/)) {
      return [{ type: "heading", content: trimmed }];
    }

    return processInlineFormatting(trimmed);
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList && listItems.length > 0) {
        result.push([{ type: "list", content: "", items: [...listItems] }]);
        listItems = [];
        inList = false;
      }
      if (currentLine.length > 0) {
        result.push(currentLine);
        currentLine = [];
      }
      continue;
    }

    if (
      trimmed.startsWith("✓") ||
      trimmed.startsWith("•") ||
      trimmed.startsWith("- ") ||
      trimmed.match(/^\d+\.\s/) ||
      trimmed.startsWith("▸")
    ) {
      if (currentLine.length > 0) {
        result.push(currentLine);
        currentLine = [];
      }
      const itemText = trimmed
        .replace(/^[✓•\-\d\.\s▸]+/, "")
        .replace(/^\*\*/, "")
        .replace(/\*\*$/, "");
      listItems.push(itemText);
      inList = true;
      continue;
    }

    if (inList && listItems.length > 0) {
      result.push([{ type: "list", content: "", items: [...listItems] }]);
      listItems = [];
      inList = false;
    }

    currentLine.push(...processLine(line));
  }

  if (inList && listItems.length > 0) {
    result.push([{ type: "list", content: "", items: [...listItems] }]);
  }

  if (currentLine.length > 0) {
    result.push(currentLine);
  }

  return result.length > 0 ? result : [[{ type: "text", content: text }]];
}

interface ContentRendererProps {
  content: ParsedContent[][];
  isDark?: boolean;
}

export function ContentRenderer({
  content,
  isDark = false,
}: ContentRendererProps) {
  const colors = {
    text: isDark ? "rgba(255,255,255,0.85)" : COLORS.secondary[800],
    bold: isDark ? "#FFFFFF" : COLORS.secondary[900],
    italic: isDark ? "rgba(255,255,255,0.8)" : COLORS.secondary[800],
    code: isDark ? "#A78BFA" : COLORS.primary[700],
    codeBg: isDark ? "rgba(139, 92, 246, 0.15)" : COLORS.primary[50],
    heading: isDark ? "#FFFFFF" : COLORS.secondary[900],
    bullet: isDark ? "#A78BFA" : COLORS.primary.DEFAULT,
    tipBg: isDark ? "rgba(139, 92, 246, 0.15)" : COLORS.primary[50],
    tipBorder: isDark ? "#A78BFA" : COLORS.primary.DEFAULT,
    tipText: isDark ? "#C4B5FD" : COLORS.primary[700],
  };

  return (
    <>
      {content.map((line, lineIndex) => {
        const hasList = line.some((c) => c.type === "list");

        if (hasList) {
          const listItem = line.find((c) => c.type === "list");
          if (listItem?.items) {
            return (
              <View key={lineIndex} style={{ marginVertical: 6 }}>
                {listItem.items.map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: "row",
                      marginBottom: 4,
                      paddingLeft: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 15,
                        lineHeight: 22,
                        color: colors.bullet,
                        marginRight: 8,
                        fontWeight: "600",
                      }}
                    >
                      •
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 15,
                        lineHeight: 22,
                        color: colors.text,
                        flex: 1,
                      }}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            );
          }
        }

        return (
          <Text
            key={lineIndex}
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 4 }}
          >
            {line.map((segment, segIndex) => {
              if (segment.type === "bold") {
                return (
                  <Text
                    key={segIndex}
                    style={{
                      fontFamily: FONTS.secondary,
                      fontSize: 15,
                      lineHeight: 22,
                      color: colors.bold,
                      fontWeight: "700",
                    }}
                  >
                    {segment.content}
                  </Text>
                );
              }
              if (segment.type === "italic") {
                return (
                  <Text
                    key={segIndex}
                    style={{
                      fontFamily: FONTS.secondary,
                      fontSize: 15,
                      lineHeight: 22,
                      color: colors.italic,
                      fontStyle: "italic",
                    }}
                  >
                    {segment.content}
                  </Text>
                );
              }
              if (segment.type === "code") {
                return (
                  <Text
                    key={segIndex}
                    style={{
                      fontFamily: FONTS.secondary,
                      fontSize: 14,
                      lineHeight: 20,
                      color: colors.code,
                      backgroundColor: colors.codeBg,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }}
                  >
                    {segment.content}
                  </Text>
                );
              }
              if (segment.type === "heading") {
                return (
                  <Text
                    key={segIndex}
                    style={{
                      fontFamily: FONTS.fredoka,
                      fontSize: 16,
                      fontWeight: "600",
                      color: colors.heading,
                      marginTop: 8,
                      marginBottom: 6,
                    }}
                  >
                    {segment.content}
                  </Text>
                );
              }
              if (segment.type === "tip") {
                return (
                  <View
                    key={segIndex}
                    style={{
                      backgroundColor: colors.tipBg,
                      padding: 12,
                      borderRadius: 12,
                      marginVertical: 8,
                      borderLeftWidth: 3,
                      borderLeftColor: colors.tipBorder,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.secondary,
                        fontSize: 14,
                        lineHeight: 20,
                        color: colors.tipText,
                      }}
                    >
                      {segment.content}
                    </Text>
                  </View>
                );
              }
              return (
                <Text
                  key={segIndex}
                  style={{
                    fontFamily: FONTS.secondary,
                    fontSize: 15,
                    lineHeight: 22,
                    color: colors.text,
                  }}
                >
                  {segment.content}
                </Text>
              );
            })}
          </Text>
        );
      })}
    </>
  );
}
