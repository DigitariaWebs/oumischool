import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionApi, RequestSessionPayload } from "./api";
import { sessionKeys } from "./keys";

export function useSessions() {
  return useQuery({
    queryKey: sessionKeys.list(),
    queryFn: sessionApi.list,
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionApi.detail(id),
    enabled: !!id,
  });
}

export function useRequestSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: RequestSessionPayload) => sessionApi.request(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useAcceptSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionApi.accept(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useRejectSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionApi.reject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useScheduleSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionApi.schedule(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useCancelSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useCompleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionApi.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
