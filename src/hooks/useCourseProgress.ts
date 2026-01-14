import { useAuth } from "@/context/auth-context";
import { useSupabaseQuery } from "./useSupabaseQuery";
import type { ProgressTracking, Enrollment, Lesson } from "@/lib/drizzle/schema";

interface UseCourseProgressProps {
  courseId: string;
}

export function useCourseProgress({ courseId }: UseCourseProgressProps) {
  const { user } = useAuth();

  // Get enrollment
  const { data: enrollments } = useSupabaseQuery<Enrollment>({
    queryKey: ["enrollment", courseId, user?.id || "anonymous"],
    tableName: "enrollments",
    enabled: !!user?.id && !!courseId,
  });

  const enrollment = enrollments?.find(
    (e) => e.course_id === courseId && e.user_id === user?.id
  );

  // Get all lessons for this course
  const { data: lessons, isLoading: lessonsLoading } = useSupabaseQuery<Lesson>({
    queryKey: [`course-lessons/${courseId}`],
    tableName: "lessons",
    params: { name: "course_id", value: courseId },
    fields: ["id"],
    enabled: !!courseId,
  });

  // Get progress tracking for this enrollment
  const { data: progressData, isLoading: progressLoading } = useSupabaseQuery<ProgressTracking>({
    queryKey: [`course-progress-${courseId}`, enrollment?.id || "no-enrollment"],
    tableName: "progress_tracking",
    enabled: !!enrollment?.id,
  });

  const progress = progressData?.filter(p => p.enrollment_id === enrollment?.id);

  const totalLessons = lessons?.length || 0;
  const completedLessons = progress?.filter(p => p.is_completed).length || 0;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    totalLessons,
    completedLessons,
    progressPercentage,
    isLoading: lessonsLoading || progressLoading,
    hasEnrollment: !!enrollment,
  };
}
