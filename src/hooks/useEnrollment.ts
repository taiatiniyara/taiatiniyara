import { useAuth } from "@/context/auth-context";
import { useSupabaseQuery } from "./useSupabaseQuery";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Enrollment } from "@/lib/drizzle/schema";

interface UseEnrollmentProps {
  courseId: string;
}

export function useEnrollment({ courseId }: UseEnrollmentProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Check if user is already enrolled
  const { data: enrollments, isLoading: checkingEnrollment } = useSupabaseQuery<Enrollment>({
    queryKey: ["enrollment", courseId, user?.id || "anonymous"],
    tableName: "enrollments",
    enabled: !!user?.id && !!courseId,
  });

  // Filter enrollments by user and course
  const isEnrolled = enrollments?.some(
    (e) => e.course_id === courseId && e.user_id === user?.id
  ) ?? false;

  const enroll = async () => {
    if (!user?.id) {
      throw new Error("User must be logged in to enroll");
    }

    if (isEnrolled) {
      throw new Error("Already enrolled in this course");
    }

    setIsEnrolling(true);
    try {
      const { error } = await supabase.from("enrollments").insert({
        user_id: user.id,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Invalidate queries to refetch enrollment data
      await queryClient.invalidateQueries({ queryKey: ["enrollment"] });
      await queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      await queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
    } finally {
      setIsEnrolling(false);
    }
  };

  return {
    isEnrolled,
    isEnrolling,
    enroll,
    checkingEnrollment,
  };
}
