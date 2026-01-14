import { Button } from "@/components/ui/button";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useAuth } from "@/context/auth-context";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

interface EnrollButtonProps {
  courseId: string;
  courseTitle: string;
}

export function EnrollButton({ courseId, courseTitle }: EnrollButtonProps) {
  const { user } = useAuth();
  const { isEnrolled, isEnrolling, enroll, checkingEnrollment } = useEnrollment({ courseId });

  const handleEnroll = async () => {
    try {
      await enroll();
      toast.success(`Successfully enrolled in "${courseTitle}"!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to enroll";
      toast.error(message);
    }
  };

  if (!user) {
    return (
      <Button size="lg" asChild>
        <Link to="/login">
          Sign in to Enroll
        </Link>
      </Button>
    );
  }

  if (checkingEnrollment) {
    return (
      <Button size="lg" disabled>
        Checking enrollment...
      </Button>
    );
  }

  if (isEnrolled) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button size="lg" variant="secondary" disabled>
          ✓ Enrolled
        </Button>
        <p className="text-sm text-muted-foreground">
          You're enrolled in this course
        </p>
      </div>
    );
  }

  return (
    <Button 
      size="lg" 
      onClick={handleEnroll}
      disabled={isEnrolling}
    >
      {isEnrolling ? "Enrolling..." : "Enroll in Course"}
    </Button>
  );
}
