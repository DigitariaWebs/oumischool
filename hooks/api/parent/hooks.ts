import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parentApi, CreateChildPayload, UpdateChildPayload } from "./api";
import { parentKeys } from "./keys";

export function useParentMe() {
  return useQuery({
    queryKey: parentKeys.me(),
    queryFn: parentApi.getMe,
  });
}

export function useChildren() {
  return useQuery({
    queryKey: parentKeys.children(),
    queryFn: parentApi.getChildren,
  });
}

export function useChild(id: string) {
  return useQuery({
    queryKey: parentKeys.child(id),
    queryFn: () => parentApi.getChild(id),
    enabled: !!id,
  });
}

export function useCreateChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateChildPayload) => parentApi.createChild(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: parentKeys.children() });
    },
  });
}

export function useUpdateChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: UpdateChildPayload;
    }) => parentApi.updateChild(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: parentKeys.child(id) });
      qc.invalidateQueries({ queryKey: parentKeys.children() });
    },
  });
}

export function useDeleteChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => parentApi.deleteChild(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: parentKeys.children() });
    },
  });
}
