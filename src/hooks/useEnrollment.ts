import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useEnrollmentData } from "./useEnrollmentData";

interface UseEnrollmentProps {
  courseId: string;
}

export function useEnrollment({ courseId }: UseEnrollmentProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { isEnrolled, isLoading: checkingEnrollment } = useEnrollmentData(courseId);

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
