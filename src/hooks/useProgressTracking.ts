import { useSupabaseQuery } from "./useSupabaseQuery";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useEnrollmentData } from "./useEnrollmentData";
import type { ProgressTracking } from "@/lib/drizzle/schema";

interface UseProgressTrackingProps {
  courseId: string;
  lessonId: string;
}

export function useProgressTracking({ courseId, lessonId }: UseProgressTrackingProps) {
  const queryClient = useQueryClient();
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const { enrollment, isEnrolled: hasEnrollment } = useEnrollmentData(courseId);

  // Get progress tracking for this lesson
  const { data: progressData, isLoading: loadingProgress } = useSupabaseQuery<ProgressTracking>({
    queryKey: ["progress", enrollment?.id || "no-enrollment", lessonId],
    tableName: "progress_tracking",
    enabled: !!enrollment?.id && !!lessonId,
  });

  const progress = progressData?.find(
    (p) => p.enrollment_id === enrollment?.id && p.lesson_id === lessonId
  );

  const isCompleted = progress?.is_completed ?? false;

  const markAsComplete = async () => {
    if (!enrollment?.id) {
      throw new Error("Must be enrolled in course to track progress");
    }

    if (isCompleted) {
      throw new Error("Lesson already marked as complete");
    }

    setIsMarkingComplete(true);
    try {
      const { error } = await supabase.from("progress_tracking").insert({
        enrollment_id: enrollment.id,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Invalidate queries to refetch progress data
      await queryClient.invalidateQueries({ queryKey: ["progress"] });
      await queryClient.invalidateQueries({ queryKey: [`course-progress-${courseId}`] });
    } finally {
      setIsMarkingComplete(false);
    }
  };

  return {
    isCompleted,
    isMarkingComplete,
    markAsComplete,
    loadingProgress,
    hasEnrollment,
  };
}
