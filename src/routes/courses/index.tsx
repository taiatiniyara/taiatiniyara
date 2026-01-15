import { createFileRoute } from "@tanstack/react-router";
import type { Course, CourseCategory } from "@/lib/drizzle/schema";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import React from "react";
import { Search, BookOpen, Users, GraduationCap, Code, TrendingUp, Filter } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export const Route = createFileRoute("/courses/")({
  component: RouteComponent,
});

type CourseWithCategory = Course & { 
  course_categories: Pick<CourseCategory, "level"> 
};

function RouteComponent() {
  useSEO({
    title: "Courses - Software Development Training & Learning",
    description:
      "Explore comprehensive software development courses designed for Fiji and the Pacific. Learn web development, programming, and modern technologies with expert-led training.",
    keywords:
      "coding courses Fiji, software development training, programming courses Pacific, web development learning, developer training Fiji",
    canonicalUrl: "/courses",
    ogType: "website",
  });

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedLevel, setSelectedLevel] = React.useState<string | null>(null);
  const [selectedTech, setSelectedTech] = React.useState<string | null>(null);

  const {
    data: courses,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["courses-with-level"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, img_url, description, slug, technologies, tags, course_categories(level)")
        .returns<CourseWithCategory[]>();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch enrollment counts for all courses
  const { data: enrollmentCounts } = useQuery({
    queryKey: ["enrollments", "counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("course_id");
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate enrollment count per course
  const getEnrollmentCount = (courseId: string) => {
    if (!enrollmentCounts) return 0;
    return enrollmentCounts.filter((e) => e.course_id === courseId).length;
  };

  // Calculate total students (unique users)
  const totalStudents = React.useMemo(() => {
    if (!enrollmentCounts) return 0;
    return enrollmentCounts.length;
  }, [enrollmentCounts]);

  // Get all unique technologies
  const allTechnologies = React.useMemo(() => {
    if (!courses) return [];
    return Array.from(
      new Set(
        courses.flatMap((course) => 
          Array.isArray(course.technologies) ? course.technologies : []
        )
      )
    ).sort();
  }, [courses]);

  // Filter courses
  const filteredCourses = React.useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      const matchesSearch = 
        !searchQuery || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = 
        !selectedLevel || 
        course.course_categories?.level === selectedLevel;
      
      const matchesTech = 
        !selectedTech || 
        (Array.isArray(course.technologies) && course.technologies.includes(selectedTech));
      
      return matchesSearch && matchesLevel && matchesTech;
    });
  }, [courses, searchQuery, selectedLevel, selectedTech]);

  const featuredCourse = courses?.[0]; // Latest course as featured
  const beginnerCount = courses?.filter(c => c.course_categories?.level === "Beginner").length || 0;
  const intermediateCount = courses?.filter(c => c.course_categories?.level === "Intermediate").length || 0;
  const advancedCount = courses?.filter(c => c.course_categories?.level === "Advanced").length || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner text="Loading courses..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error.message || "Failed to load courses"} />;
  }

  if (!courses || courses.length === 0) {
    return <EmptyListPlaceholder text="No courses available." />;
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <Heading level={1} className="mb-3 sm:mb-4">
              <span className="text-primary">Courses</span> & Learning
            </Heading>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Master software development with our comprehensive courses
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
            <Card className="p-4 sm:p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{courses.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Courses</p>
            </Card>
            
            <Card className="p-4 sm:p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{totalStudents}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Students</p>
            </Card>
            
            <Card className="p-4 sm:p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{beginnerCount}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Beginner</p>
            </Card>
            
            <Card className="p-4 sm:p-5 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Code className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{advancedCount}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Advanced</p>
            </Card>
          </div>

          {/* Featured Course Hero */}
          {featuredCourse && (
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">Featured Course</span>
              </div>
              <a 
                href={`/courses/${featuredCourse.slug}`}
                className="group block bg-linear-to-br from-primary/10 via-accent/5 to-transparent border-2 border-primary/20 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="relative h-48 sm:h-64 md:h-full overflow-hidden">
                    <img
                      src={featuredCourse.img_url || "/default-image.jpg"}
                      alt={featuredCourse.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-background/80 to-transparent md:hidden" />
                  </div>
                  <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                    {featuredCourse.course_categories?.level && (
                      <Badge variant="secondary" className="mb-3 w-fit">
                        {featuredCourse.course_categories.level}
                      </Badge>
                    )}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                      {featuredCourse.title}
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg mb-4 sm:mb-6 line-clamp-3">
                      {featuredCourse.description}
                    </p>
                    {/* Technologies */}
                    {featuredCourse.technologies && Array.isArray(featuredCourse.technologies) && featuredCourse.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featuredCourse.technologies.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {/* Enrollment count */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{getEnrollmentCount(featuredCourse.id)} students enrolled</span>
                    </div>
                    <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                      Start Learning
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* Search and Filter Section */}
          <Card className="p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <div className="space-y-3 sm:space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Search courses by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base"
                />
              </div>

              {/* Level Filter */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter by Level:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={!selectedLevel ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(null)}
                  >
                    All Levels
                  </Button>
                  <Button
                    variant={selectedLevel === "Beginner" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(selectedLevel === "Beginner" ? null : "Beginner")}
                  >
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Beginner ({beginnerCount})
                  </Button>
                  <Button
                    variant={selectedLevel === "Intermediate" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(selectedLevel === "Intermediate" ? null : "Intermediate")}
                  >
                    Intermediate ({intermediateCount})
                  </Button>
                  <Button
                    variant={selectedLevel === "Advanced" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(selectedLevel === "Advanced" ? null : "Advanced")}
                  >
                    Advanced ({advancedCount})
                  </Button>
                </div>
              </div>

              {/* Technology Filter */}
              {allTechnologies.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Filter by Technology:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={!selectedTech ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTech(null)}
                    >
                      All
                    </Button>
                    {allTechnologies.map((tech) => (
                      <Button
                        key={tech}
                        variant={selectedTech === tech ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                      >
                        {tech}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {(searchQuery || selectedLevel || selectedTech) && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Active filters:</p>
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {searchQuery}
                    </Badge>
                  )}
                  {selectedLevel && (
                    <Badge variant="secondary" className="gap-1">
                      Level: {selectedLevel}
                    </Badge>
                  )}
                  {selectedTech && (
                    <Badge variant="secondary" className="gap-1">
                      Tech: {selectedTech}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLevel(null);
                      setSelectedTech(null);
                    }}
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredCourses.slice(featuredCourse ? 1 : 0).map((course) => (
                <Card key={course.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  {course.img_url && (
                    <a href={`/courses/${course.slug}`} className="block">
                      <div className="relative h-40 sm:h-48 overflow-hidden bg-muted">
                        <img
                          src={course.img_url}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {course.course_categories?.level && (
                          <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 text-xs">
                            {course.course_categories.level}
                          </Badge>
                        )}
                      </div>
                    </a>
                  )}

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <a href={`/courses/${course.slug}`} className="block mb-3">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    </a>

                    {/* Technologies */}
                    {course.technologies && Array.isArray(course.technologies) && course.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {course.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {course.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{course.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Enrollment count */}
                    <div className="flex items-center gap-2 pb-3 mb-3 border-b text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{getEnrollmentCount(course.id)} students</span>
                    </div>

                    <a 
                      href={`/courses/${course.slug}`}
                      className="flex items-center text-primary font-medium group-hover:gap-2 transition-all"
                    >
                      Start Learning
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No courses found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLevel(null);
                  setSelectedTech(null);
                }}
              >
                Clear all filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
