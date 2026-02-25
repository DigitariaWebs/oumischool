import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  calendarApi,
  CreateCalendarEventPayload,
  UpdateCalendarEventPayload,
} from "./api";
import { calendarKeys } from "./keys";

export function useCalendarEvents(params?: Record<string, string>) {
  return useQuery({
    queryKey: calendarKeys.events(params),
    queryFn: () => calendarApi.list(params),
  });
}

export function useCreateCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCalendarEventPayload) => calendarApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}

export function useUpdateCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: UpdateCalendarEventPayload;
    }) => calendarApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}

export function useDeleteCalendarEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => calendarApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}
