import { useAuth } from "@/context/auth-context";
import { useSupabaseQuery } from "./useSupabaseQuery";
import type { Enrollment } from "@/lib/drizzle/schema";

/**
 * Shared hook to fetch enrollment data for a course
 * Reduces duplication across useEnrollment, useProgressTracking, and useCourseProgress
 */
export function useEnrollmentData(courseId: string) {
  const { user } = useAuth();

  const { data: enrollments, isLoading } = useSupabaseQuery<Enrollment>({
    queryKey: ["enrollment", courseId, user?.id || "anonymous"],
    tableName: "enrollments",
    enabled: !!user?.id && !!courseId,
  });

  const enrollment = enrollments?.find(
    (e) => e.course_id === courseId && e.user_id === user?.id
  );

  return {
    enrollment,
    enrollments,
    isEnrolled: !!enrollment,
    isLoading,
  };
}
