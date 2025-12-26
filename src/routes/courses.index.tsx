import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublishedCourses } from "@/lib/course";
import type { Course } from "@/types/course";
import { GraduationCap, BookOpen, Award } from "lucide-react";
import { SEO, StructuredData } from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/courses/")({
  component: CoursesIndex,
});

function CoursesIndex() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: number | null = null;

    const fetchCourses = async (retries = 3) => {
      try {
        console.log('Fetching published courses...');
        const data = await getPublishedCourses();
        if (!isMounted) return;
        
        console.log('Courses fetched:', data);
        setCourses(data);
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Error fetching courses:', err);
        
        // Retry logic for network errors
        if (retries > 0 && err instanceof Error && 
            (err.message.includes('fetch') || err.message.includes('network'))) {
          console.log(`Retrying... (${3 - retries + 1}/3)`);
          retryTimeout = setTimeout(() => fetchCourses(retries - 1), 1000 * (4 - retries));
          return;
        }
        
        setError(err as Error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchCourses();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Courses</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <p className="text-sm text-gray-500 mb-6">
            Please check your internet connection or try again later.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
            <Button variant="outline" onClick={() => {
              setIsLoading(true);
              setError(null);
              const retryFetch = async (retries = 3) => {
                try {
                  console.log('Retrying course fetch...');
                  const data = await getPublishedCourses();
                  console.log('Courses fetched:', data);
                  setCourses(data);
                  setError(null);
                } catch (err) {
                  console.error('Error fetching courses:', err);
                  
                  // Retry with exponential backoff
                  if (retries > 0) {
                    console.log(`Retrying... (${3 - retries + 1}/3)`);
                    setTimeout(() => retryFetch(retries - 1), 1000 * (4 - retries));
                    return;
                  }
                  
                  setError(err as Error);
                } finally {
                  if (retries === 0) {
                    setIsLoading(false);
                  }
                }
              };
              retryFetch();
            }}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Software Development Courses - Learn Web Development"
        description="Comprehensive online software development courses covering web development, programming fundamentals, React, TypeScript, system design, and modern development practices. Learn to build real-world applications."
        canonicalUrl="https://taiatiniyara.com/courses"
        ogType="website"
      />
      <StructuredData
        type="WebSite"
        data={{
          name: "Taia Tiniyara Developer Courses",
          description: "Online software development courses and tutorials",
          url: `${window.location.origin}/courses`,
          author: {
            "@type": "Person",
            name: "Taia Tiniyara",
            url: window.location.origin,
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
              item: window.location.origin,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Courses",
              item: `${window.location.origin}/courses`,
            },
          ],
        }}
      />
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <GraduationCap className="w-10 h-10" />
              Developer Courses
            </h1>
            <p className="text-slate-600 mt-2">
              Learn software development with comprehensive courses
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/courses/admin">
              <Button variant="outline">Courses Admin</Button>
            </Link>
            <Link to="/courses/modules-admin">
              <Button variant="outline">Modules Admin</Button>
            </Link>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <p className="text-xl">No courses published yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} to="/courses/$slug" params={{ slug: course.slug }}>
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    {course.level && (
                      <Badge>{course.level}</Badge>
                    )}
                    {course.featured && (
                      <Badge className="bg-purple-600 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge className="bg-green-500 text-white border-0">Free</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{course.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <BookOpen className="w-4 h-4" />
                    <span>Online Course</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
