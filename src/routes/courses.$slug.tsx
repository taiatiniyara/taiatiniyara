import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCourse, useEnrollInCourse, useEnrollment } from "@/hooks/useCourseQueries";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Award,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { SEO, StructuredData } from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { useAlertDialog } from "@/components/AlertDialogProvider";

export const Route = createFileRoute("/courses/$slug")({
  component: CourseDetail,
});

function CourseDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlertDialog();
  const { data: course, isLoading, error } = useCourse(slug);
  const { user, isAuthenticated } = useAuth();
  const enrollMutation = useEnrollInCourse();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Check if user is enrolled
  const { data: enrollment } = useEnrollment(
    course?.id || '',
    user?.id || '',
  );
  const userEnrolled = !!enrollment;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleStartLearning = async () => {
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }

    if (userEnrolled) {
      // Navigate to first module or last accessed module
      if (course.modules && course.modules.length > 0) {
        navigate({
          to: '/courses/$courseSlug/$moduleSlug',
          params: { courseSlug: course.slug, moduleSlug: course.modules[0].slug },
        });
      }
      return;
    }

    // Enroll user
    try {
      await enrollMutation.mutateAsync({
        course_id: course.id,
        user_id: user.id,
        user_email: user.email || '',
      });
      
      // Navigate to first module
      if (course.modules && course.modules.length > 0) {
        navigate({
          to: '/courses/$courseSlug/$moduleSlug',
          params: { courseSlug: course.slug, moduleSlug: course.modules[0].slug },
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enroll in course. Please try again.';
      
      // If already enrolled, just navigate to the course
      if (errorMessage.includes('already enrolled')) {
        if (course.modules && course.modules.length > 0) {
          navigate({
            to: '/courses/$courseSlug/$moduleSlug',
            params: { courseSlug: course.slug, moduleSlug: course.modules[0].slug },
          });
        }
      } else {
        showAlert("Enrollment Error", errorMessage);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const siteUrl = window.location.origin;
  const courseUrl = `${siteUrl}/courses/${course.slug}`;
  const courseDescription =
    course.description || `${course.title} - A course by Taia Tiniyara`;

  const levelColors = {
    beginner:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    intermediate:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <>
      <SEO
        title={course.title}
        description={courseDescription}
        canonicalUrl={courseUrl}
        ogType="article"
        ogImage={course.thumbnail || undefined}
        ogImageAlt={`${course.title} - Course by Taia Tiniyara`}
        publishedTime={course.published_at || undefined}
        modifiedTime={course.updated_at}
        tags={course.technologies || []}
      />
      <StructuredData
        type="Course"
        data={{
          name: course.title,
          description: courseDescription,
          provider: {
            "@type": "Person",
            name: "Taia Tiniyara",
            url: siteUrl,
          },
          offers: {
            "@type": "Offer",
            price: 0,
            priceCurrency: "USD",
          },
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        data={{
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: siteUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Courses",
              item: `${siteUrl}/courses`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: course.title,
              item: courseUrl,
            },
          ],
        }}
      />
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <Button
          onClick={() => navigate({ to: "/courses" })}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <Card className="overflow-hidden">
              {course.thumbnail && (
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                  {course.featured && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-purple-600 text-white border-0">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              <div className="p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {course.level && (
                    <Badge className={`${levelColors[course.level]} border-0`}>
                      {course.level.charAt(0).toUpperCase() +
                        course.level.slice(1)}
                    </Badge>
                  )}
                  {course.category && (
                    <Badge variant="outline">{course.category}</Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  {course.title}
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex flex-wrap gap-6 py-4 border-y border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm">
                      {Math.round(course.total_duration_minutes / 60)} hours
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm">
                      {course.total_modules} modules
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <PlayCircle className="w-5 h-5" />
                    <span className="text-sm">
                      {course.total_duration_minutes} min total
                    </span>
                  </div>
                </div>

                {course.published_at && (
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
                    Published on {formatDate(course.published_at)}
                  </p>
                )}
              </div>
            </Card>

            {/* Technologies */}
            {course.technologies && course.technologies.length > 0 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Technologies Covered
                </h2>
                <div className="flex flex-wrap gap-2">
                  {course.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="px-3 py-1 text-sm"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enroll Card */}
            <Card className="p-6 sticky top-6">
              <Button 
                className="w-full mb-4" 
                size="lg"
                onClick={handleStartLearning}
                disabled={enrollMutation.isPending}
              >
                {enrollMutation.isPending ? (
                  "Enrolling..."
                ) : userEnrolled ? (
                  "Continue Learning"
                ) : (
                  "Start Learning"
                )}
              </Button>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{course.total_modules} modules</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>{Math.round(course.total_duration_minutes / 60)} hours of content</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </Card>

            {/* Course Curriculum */}
            {course.modules && course.modules.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Course Curriculum
                </h3>
                <div className="space-y-2">
                  {course.modules.map((module, index) => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <PlayCircle className="w-4 h-4 text-purple-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                            {index + 1}. {module.title}
                          </p>
                        </div>
                      </div>
                      {module.duration_minutes > 0 && (
                        <span className="text-xs text-slate-500 shrink-0 ml-2">
                          {module.duration_minutes}m
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleStartLearning}
      />
    </>
  );
}
