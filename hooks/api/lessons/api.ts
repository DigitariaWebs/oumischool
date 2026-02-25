import { apiClient } from "../client";

export interface LessonMaterial {
  id: string;
  lessonId: string;
  title: string;
  soldSeparately: boolean;
  resourceId: string | null;
}

export interface Lesson {
  id: string;
  tutorId: string;
  subjectId: string;
  seriesId: string | null;
  title: string;
  description: string | null;
  duration: string | null;
  orderInSeries: number | null;
  createdAt: string;
  materials: LessonMaterial[];
}

export interface LessonSeries {
  id: string;
  tutorId: string;
  subjectId: string;
  title: string;
  description: string | null;
  createdAt: string;
  lessons: Lesson[];
}

export const lessonsApi = {
  listSeriesByTutor: (tutorId: string) =>
    apiClient.get<LessonSeries[]>(`/tutors/${tutorId}/lessons`),
  getSeries: (id: string) =>
    apiClient.get<LessonSeries>(`/lesson-series/${id}`),
  getLesson: (id: string) => apiClient.get<Lesson>(`/lessons/${id}`),
};
