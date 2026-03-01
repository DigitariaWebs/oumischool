import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resourcesApi, CreateResourcePayload } from "./api";
import { resourceKeys } from "./keys";

export function useResources(params?: Record<string, string>) {
  return useQuery({
    queryKey: resourceKeys.list(params),
    queryFn: () => resourcesApi.list(params),
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: () => resourcesApi.get(id),
    enabled: !!id,
  });
}

export function useCreateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateResourcePayload) => resourcesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: resourceKeys.lists() });
    },
  });
}

export function useUploadResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => resourcesApi.upload(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: resourceKeys.lists() });
    },
  });
}

export function useUpdateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<CreateResourcePayload>;
    }) => resourcesApi.update(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: resourceKeys.detail(id) });
      qc.invalidateQueries({ queryKey: resourceKeys.lists() });
    },
  });
}

export function useDeleteResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resourcesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: resourceKeys.lists() });
    },
  });
}

export function useTrackResourceView() {
  return useMutation({
    mutationFn: (id: string) => resourcesApi.trackView(id),
  });
}

export function useTrackResourceDownload() {
  return useMutation({
    mutationFn: (id: string) => resourcesApi.trackDownload(id),
  });
}

export function useAddToLibrary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resourcesApi.addToLibrary(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: resourceKeys.lists() });
    },
  });
}
