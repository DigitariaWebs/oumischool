import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tutorApi, TutorUpdatePayload, CreateAvailabilityPayload } from "./api";
import { tutorKeys } from "./keys";

export function useTutors(params?: {
  subject?: string;
  minRating?: number;
  maxPrice?: number;
}) {
  return useQuery({
    queryKey: tutorKeys.list(params),
    queryFn: () => tutorApi.list(params),
  });
}

export function useTutorDetail(id: string) {
  return useQuery({
    queryKey: tutorKeys.detail(id),
    queryFn: () => tutorApi.detail(id),
    enabled: !!id,
  });
}

export function useTutorAvailability(id: string) {
  return useQuery({
    queryKey: tutorKeys.availability(id),
    queryFn: () => tutorApi.availability(id),
    enabled: !!id,
  });
}

export function useTutorLessons(id: string) {
  return useQuery({
    queryKey: tutorKeys.lessons(id),
    queryFn: () => tutorApi.lessons(id),
    enabled: !!id,
  });
}

export function useTutorReviews(id: string) {
  return useQuery({
    queryKey: tutorKeys.reviews(id),
    queryFn: () => tutorApi.reviews(id),
    enabled: !!id,
  });
}

export function useMyStudents() {
  return useQuery({
    queryKey: tutorKeys.myStudents(),
    queryFn: tutorApi.getMyStudents,
  });
}

export function useMyTutorProfile() {
  return useQuery({
    queryKey: tutorKeys.myProfile(),
    queryFn: tutorApi.getMe,
  });
}

export function useMyResources() {
  return useQuery({
    queryKey: tutorKeys.myResources(),
    queryFn: tutorApi.getMyResources,
  });
}

export function useMySessions() {
  return useQuery({
    queryKey: tutorKeys.mySessions(),
    queryFn: tutorApi.getMySessions,
  });
}

export function useMyEarnings() {
  return useQuery({
    queryKey: tutorKeys.myEarnings(),
    queryFn: tutorApi.getMyEarnings,
  });
}

export function useMyAvailability() {
  return useQuery({
    queryKey: tutorKeys.myAvailability(),
    queryFn: tutorApi.getMyAvailability,
  });
}

export function useUpdateTutorProfile() {
  return useMutation({
    mutationFn: (body: TutorUpdatePayload) => tutorApi.updateMe(body),
  });
}

export function useAddAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAvailabilityPayload) =>
      tutorApi.addAvailability(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tutorKeys.all });
    },
  });
}

export function useUpdateAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: CreateAvailabilityPayload;
    }) => tutorApi.updateAvailability(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tutorKeys.all });
    },
  });
}

export function useDeleteAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tutorApi.deleteAvailability(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tutorKeys.all });
    },
  });
}

export function useToggleAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tutorApi.toggleAvailability(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tutorKeys.all });
    },
  });
}
