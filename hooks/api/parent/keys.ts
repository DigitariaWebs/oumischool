export const parentKeys = {
  all: ["parent"] as const,
  me: () => [...parentKeys.all, "me"] as const,
  children: () => [...parentKeys.all, "children"] as const,
  child: (id: string) => [...parentKeys.children(), id] as const,
};
