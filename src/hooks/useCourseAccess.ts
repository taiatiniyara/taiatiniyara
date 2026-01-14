import { useAuth } from "@/context/auth-context";
import { useEnrollment } from "./useEnrollment";

interface UseCourseAccessProps {
  courseId: string;
}

export function useCourseAccess({ courseId }: UseCourseAccessProps) {
  const { user } = useAuth();
  const isAdmin = user?.user_metadata?.role === "admin";
  
  const { isEnrolled, checkingEnrollment } = useEnrollment({ courseId });

  // User has access if they are admin OR enrolled
  const hasAccess = isAdmin || isEnrolled;
  
  // Still loading if checking enrollment and not admin
  const isLoading = !isAdmin && checkingEnrollment;

  return {
    hasAccess,
    isLoading,
    isAdmin,
    isEnrolled,
  };
}
