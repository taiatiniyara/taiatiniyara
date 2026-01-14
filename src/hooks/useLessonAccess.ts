import { useSupabaseQuery } from "./useSupabaseQuery";
import { useEnrollmentData } from "./useEnrollmentData";
import type { ProgressTracking, Lesson } from "@/lib/drizzle/schema";

interface UseLessonAccessProps {
  courseId: string;
  lessonId: string;
  allLessons?: Lesson[];
}

export function useLessonAccess({ courseId, lessonId, allLessons }: UseLessonAccessProps) {
  const { enrollment } = useEnrollmentData(courseId);

  // Get progress tracking for this enrollment
  const { data: progressData, isLoading: progressLoading } = useSupabaseQuery<ProgressTracking>({
    queryKey: [`course-progress-${courseId}`, enrollment?.id || "no-enrollment"],
    tableName: "progress_tracking",
    enabled: !!enrollment?.id,
  });

  // Find the index of the current lesson
  const currentLessonIndex = allLessons?.findIndex(l => l.id === lessonId) ?? -1;
  
  // Check if this is the first lesson
  const isFirstLesson = currentLessonIndex === 0;
  
  // Get the previous lesson
  const previousLesson = currentLessonIndex > 0 ? allLessons?.[currentLessonIndex - 1] : null;
  
  // Check if previous lesson is completed
  const previousLessonProgress = progressData?.find(
    p => p.enrollment_id === enrollment?.id && p.lesson_id === previousLesson?.id
  );
  
  const isPreviousLessonCompleted = previousLessonProgress?.is_completed ?? false;
  
  // User can access lesson if:
  // 1. It's the first lesson, OR
  // 2. The previous lesson is completed
  const canAccessLesson = isFirstLesson || isPreviousLessonCompleted;

  return {
    canAccessLesson,
    isFirstLesson,
    previousLesson,
    isPreviousLessonCompleted,
    isLoading: progressLoading,
  };
}
