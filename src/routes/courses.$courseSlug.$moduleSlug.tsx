import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/hooks/useCourseQueries";
import { useUser } from "@/hooks/useUser";
import {
  getCompletedModules,
  markModuleComplete,
  unmarkModuleComplete,
  updateCourseProgress,
  isUserEnrolled,
} from "@/lib/course";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/courses/$courseSlug/$moduleSlug")({
  component: ModuleLearning,
});

function ModuleLearning() {
  const { courseSlug, moduleSlug } = Route.useParams();
  const navigate = useNavigate();
  const { data: course, isPending, isError } = useCourse(courseSlug);
  const { user, isAuthenticated } = useUser();
  const [showSidebar, setShowSidebar] = useState(true);
  const [completedModules, setCompletedModules] = useState<Set<string>>(
    new Set()
  );
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Load completed modules from Supabase
  useEffect(() => {
    const loadCompletedModules = async () => {
      if (course && user?.id) {
        try {
          const completedIds = await getCompletedModules(course.id, user.id);
          setCompletedModules(new Set(completedIds));
        } catch (err) {
          console.error('Error loading completed modules:', err);
        }
      }
    };
    
    loadCompletedModules();
  }, [course, user?.id]);

  // Scroll to top when module changes
  useEffect(() => {
    // Scroll the window to the very top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Also scroll the content area
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [moduleSlug]);

  // Check if user is enrolled via Supabase
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!isAuthenticated || !course || !user?.id) {
        return;
      }

      try {
        const enrolled = await isUserEnrolled(course.id, user.id);
        if (!enrolled) {
          // Not enrolled, redirect to course page
          navigate({
            to: "/courses/$slug",
            params: { slug: courseSlug },
          });
        }
      } catch (err) {
        console.error('Error checking enrollment:', err);
      }
    };
    
    checkEnrollment();
  }, [isAuthenticated, course, courseSlug, navigate, user?.id]);

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError || !course) {
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

  const currentModule = course.modules?.find((m: any) => m.slug === moduleSlug);

  if (!currentModule) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
          <p className="text-gray-600 mb-6">
            The module you're looking for doesn't exist.
          </p>
          <Link to="/courses/$slug" params={{ slug: courseSlug }}>
            <Button>Back to Course</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const currentIndex = course.modules?.findIndex((m: any) => m.slug === moduleSlug) ?? -1;
  const previousModule =
    currentIndex > 0 && course.modules ? course.modules[currentIndex - 1] : null;
  const nextModule =
    currentIndex >= 0 && course.modules && currentIndex < course.modules.length - 1
      ? course.modules[currentIndex + 1]
      : null;

  const handleMarkComplete = async (toggle: boolean = true) => {
    if (!user?.id || !course) return;

    const newCompleted = new Set(completedModules);
    const isCurrentlyCompleted = completedModules.has(currentModule.id);
    
    try {
      if (toggle && isCurrentlyCompleted) {
        // Unmark as complete (only if toggle is true)
        await unmarkModuleComplete(currentModule.id, user.id);
        newCompleted.delete(currentModule.id);
      } else if (!isCurrentlyCompleted) {
        // Mark as complete
        await markModuleComplete(
          currentModule.id,
          course.id,
          user.id,
          user.email || ''
        );
        newCompleted.add(currentModule.id);
      }
      
      setCompletedModules(newCompleted);

      // Calculate and update progress
      const progressValue = course.modules
        ? Math.round((newCompleted.size / course.modules.length) * 100)
        : 0;
      
      await updateCourseProgress(course.id, user.id, progressValue);
    } catch (err) {
      console.error('Error updating module completion:', err);
      alert('Failed to update progress. Please try again.');
    }
  };

  const handleNextModule = async () => {
    // Mark current module as complete before navigating
    if (!completedModules.has(currentModule.id)) {
      await handleMarkComplete(false);
    }
  };

  const handlePreviousModule = async () => {
    // Mark current module as complete before navigating
    if (!completedModules.has(currentModule.id)) {
      await handleMarkComplete(false);
    }
  };

  const handleCourseComplete = async () => {
    // Mark current (last) module as complete before navigating
    if (!completedModules.has(currentModule.id)) {
      await handleMarkComplete(false);
    }
  };

  const isCompleted = completedModules.has(currentModule.id);
  const progress = course.modules
    ? Math.round((completedModules.size / course.modules.length) * 100)
    : 0;

  return (
    <>
      <SEO
        title={`${currentModule.title} - ${course.title}`}
        description={
          currentModule.description ||
          `Learn ${currentModule.title} in ${course.title}`
        }
        canonicalUrl={`${window.location.origin}/courses/${courseSlug}/${moduleSlug}`}
      />

      <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
        {/* Sidebar */}
        <div
          className={`${
            showSidebar ? "w-80" : "w-0"
          } bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 overflow-hidden flex flex-col`}
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <Link
              to="/courses/$slug"
              params={{ slug: courseSlug }}
              className="flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Link>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              {course.title}
            </h2>
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 px-2">
              Course Curriculum
            </h3>
            <div className="space-y-1">
              {course.modules?.map((module: any, index: number) => {
                const isCurrentModule = module.id === currentModule.id;
                const isModuleCompleted = completedModules.has(module.id);

                return (
                  <Link
                    key={module.id}
                    to="/courses/$courseSlug/$moduleSlug"
                    params={{ courseSlug, moduleSlug: module.slug }}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      isCurrentModule
                        ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isModuleCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : isCurrentModule ? (
                        <PlayCircle className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          isCurrentModule
                            ? "text-purple-700 dark:text-purple-300"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {index + 1}. {module.title}
                      </p>
                      {module.duration_minutes > 0 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {module.duration_minutes} min
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  {showSidebar ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {currentModule.title}
                  </h1>
                  {currentModule.duration_minutes > 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {currentModule.duration_minutes} minutes
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant={isCompleted ? "outline" : "default"}
                onClick={() => handleMarkComplete(true)}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div ref={contentAreaRef} className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-4 md:p-6">
              {/* Video Player */}
              {currentModule.video_url && (
                <Card className="mb-4 overflow-hidden">
                  <div className="aspect-video bg-slate-900">
                    {currentModule.video_url.includes("youtube.com") ||
                    currentModule.video_url.includes("youtu.be") ? (
                      <iframe
                        src={currentModule.video_url.replace(
                          "watch?v=",
                          "embed/"
                        )}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={currentModule.video_url}
                        controls
                        className="w-full h-full"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                </Card>
              )}

              {/* Module Description */}
              {currentModule.description && (
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
                        Module Overview
                      </h2>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {currentModule.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Module Content */}
              <Card className="p-6 md:p-8 bg-white dark:bg-slate-800">
                <style>{`
                  .module-content {
                    font-size: 16px;
                    line-height: 1.65;
                    color: #334155;
                  }
                  .dark .module-content {
                    color: #cbd5e1;
                  }
                  .module-content h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                    color: #0f172a;
                  }
                  .dark .module-content h1 {
                    color: #f1f5f9;
                  }
                  .module-content h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    padding-bottom: 0.4rem;
                    border-bottom: 2px solid #e2e8f0;
                    color: #1e293b;
                  }
                  .dark .module-content h2 {
                    color: #f1f5f9;
                    border-bottom-color: #475569;
                  }
                  .module-content h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                    color: #1e293b;
                  }
                  .dark .module-content h3 {
                    color: #e2e8f0;
                  }
                  .module-content p {
                    margin-bottom: 1rem;
                    line-height: 1.7;
                  }
                  .module-content strong {
                    font-weight: 700;
                    color: #0f172a;
                  }
                  .dark .module-content strong {
                    color: #f8fafc;
                  }
                  .module-content a {
                    color: #9333ea;
                    font-weight: 500;
                    text-decoration: none;
                    border-bottom: 1px solid transparent;
                    transition: border-color 0.2s;
                  }
                  .module-content a:hover {
                    border-bottom-color: #9333ea;
                  }
                  .dark .module-content a {
                    color: #c084fc;
                  }
                  .dark .module-content a:hover {
                    border-bottom-color: #c084fc;
                  }
                  .module-content code {
                    background: #f1f5f9;
                    color: #7c3aed;
                    padding: 0.2rem 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.9em;
                    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                    font-weight: 600;
                  }
                  .dark .module-content code {
                    background: #312e81;
                    color: #c4b5fd;
                  }
                  .module-content pre {
                    background: #1e293b;
                    color: #e2e8f0;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin: 1rem 0;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    border: 1px solid #334155;
                  }
                  .dark .module-content pre {
                    background: #0f172a;
                    border-color: #1e293b;
                  }
                  .module-content pre code {
                    background: transparent;
                    color: inherit;
                    padding: 0;
                    border-radius: 0;
                    font-weight: 400;
                  }
                  .module-content ul, .module-content ol {
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                  }
                  .module-content ul {
                    list-style-type: disc;
                  }
                  .module-content ol {
                    list-style-type: decimal;
                  }
                  .module-content li {
                    margin-bottom: 0.5rem;
                    line-height: 1.65;
                  }
                  .module-content li::marker {
                    color: #9333ea;
                    font-weight: 600;
                  }
                  .dark .module-content li::marker {
                    color: #c084fc;
                  }
                  .module-content blockquote {
                    border-left: 4px solid #9333ea;
                    background: #faf5ff;
                    padding: 0.75rem 1rem;
                    margin: 1rem 0;
                    border-radius: 0 0.375rem 0.375rem 0;
                    font-style: italic;
                  }
                  .dark .module-content blockquote {
                    background: #2e1065;
                    border-left-color: #c084fc;
                  }
                  .module-content img {
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    margin: 1.5rem 0;
                    max-width: 100%;
                    height: auto;
                  }
                  .module-content hr {
                    border: none;
                    border-top: 2px solid #e2e8f0;
                    margin: 1.5rem 0;
                  }
                  .dark .module-content hr {
                    border-top-color: #475569;
                  }
                  .module-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                  }
                  .module-content th {
                    background: #f8fafc;
                    padding: 0.625rem 0.875rem;
                    text-align: left;
                    font-weight: 600;
                    border: 1px solid #e2e8f0;
                  }
                  .dark .module-content th {
                    background: #1e293b;
                    border-color: #475569;
                  }
                  .module-content td {
                    padding: 0.625rem 0.875rem;
                    border: 1px solid #e2e8f0;
                  }
                  .dark .module-content td {
                    border-color: #475569;
                  }
                `}</style>
                <div
                  className="module-content"
                  dangerouslySetInnerHTML={{ __html: currentModule.content }}
                />
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4 gap-4">
                {previousModule ? (
                  <Link
                    to="/courses/$courseSlug/$moduleSlug"
                    params={{ courseSlug, moduleSlug: previousModule.slug }}
                    onClick={handlePreviousModule}
                  >
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}

                {nextModule ? (
                  <Link
                    to="/courses/$courseSlug/$moduleSlug"
                    params={{ courseSlug, moduleSlug: nextModule.slug }}
                    onClick={handleNextModule}
                  >
                    <Button size="sm">
                      Next: {nextModule.title}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/courses/$slug" params={{ slug: courseSlug }} onClick={handleCourseComplete}>
                    <Button size="sm">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Course Complete
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
