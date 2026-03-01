import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  parentApi,
  CreateChildPayload,
  UpdateChildPayload,
  UpdateParentProfilePayload,
} from "./api";
import { parentKeys } from "./keys";

export function useParentMe() {
  return useQuery({
    queryKey: parentKeys.me(),
    queryFn: parentApi.getMe,
  });
}

export function useUpdateParentProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateParentProfilePayload) =>
      parentApi.updateProfile(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: parentKeys.me() });
    },
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ uri, fileName }: { uri: string; fileName: string }) =>
      parentApi.uploadAvatar(uri, fileName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: parentKeys.me() });
    },
  });
}

export function useRequestDeletion() {
  return useMutation({
    mutationFn: (reason?: string) => parentApi.requestDeletion(reason),
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
    mutationFn: ({ id, body }: { id: string; body: UpdateChildPayload }) =>
      parentApi.updateChild(id, body),
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

export function useChildProgress(childId: string) {
  return useQuery({
    queryKey: parentKeys.child(childId).concat(["progress"]),
    queryFn: () => parentApi.getChildProgress(childId),
    enabled: !!childId,
  });
}

export function useFavoriteTutors() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => parentApi.getFavoriteTutors(),
  });
}

export function useAddFavoriteTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tutorId: string) => parentApi.addFavoriteTutor(tutorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavoriteTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tutorId: string) => parentApi.removeFavoriteTutor(tutorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
