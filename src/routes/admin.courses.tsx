import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";
import ErrorBox from "@/components/ui/error";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import CreateCourseForm from "@/components/courses/createCouse";
import CreateCourseCategoryForm from "@/components/courses/createCourseCategory";
import { type Course, type CourseCategory } from "@/lib/drizzle/schema";
import React from "react";
import { Button } from "@/components/ui/button";
import EditCourseForm from "@/components/courses/editCourse";
import EditCourseCategoryForm from "@/components/courses/editCourseCategory";
import { AdminHeader } from "@/components/ui/admin-header";
import { FormWrapper } from "@/components/ui/form-wrapper";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/courses")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = React.useState<"courses" | "categories">("courses");
  
  const { data, error, isLoading } = useSupabaseQuery<Course>({
    queryKey: ["admin-courses"],
    tableName: "courses",
  });

  const { data: categories, error: categoriesError, isLoading: categoriesLoading } = useSupabaseQuery<CourseCategory>({
    queryKey: ["admin-course-categories"],
    tableName: "course_categories",
  });

  const [showCreateForm, setShowCreateForm] = React.useState<boolean>(false);
  const [editingCourseId, setEditingCourseId] = React.useState<string | null>(null);
  const [showCreateCategoryForm, setShowCreateCategoryForm] = React.useState<boolean>(false);
  const [editingCategoryId, setEditingCategoryId] = React.useState<string | null>(null);

  if (isLoading || categoriesLoading) return <LoadingSpinner text="Loading..." />;

  if (error || categoriesError) return <ErrorBox message={(error || categoriesError)?.message || "An error occurred"} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b">
        <button
          onClick={() => {
            setActiveTab("courses");
            setShowCreateForm(false);
            setEditingCourseId(null);
            setShowCreateCategoryForm(false);
            setEditingCategoryId(null);
          }}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === "courses"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Courses ({data?.length || 0})
        </button>
        <button
          onClick={() => {
            setActiveTab("categories");
            setShowCreateForm(false);
            setEditingCourseId(null);
            setShowCreateCategoryForm(false);
            setEditingCategoryId(null);
          }}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === "categories"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Categories ({categories?.length || 0})
        </button>
      </div>

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <>
          <AdminHeader
            title="Courses"
            description="Manage your courses and create new content"
            buttonText="Create Course"
            showForm={showCreateForm}
            onToggleForm={() => {
              setShowCreateForm(!showCreateForm);
              setEditingCourseId(null);
            }}
          />

          {showCreateForm && (
            <FormWrapper>
              <CreateCourseForm />
            </FormWrapper>
          )}

          {editingCourseId && (
            <FormWrapper title="Edit Course" onCancel={() => setEditingCourseId(null)}>
              <EditCourseForm courseId={editingCourseId} />
            </FormWrapper>
          )}

          {data && data.length === 0 ? (
            <div className="mt-8">
              <EmptyListPlaceholder text="No courses found. Create your first course to get started!" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {data?.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {course.img_url ? (
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <img 
                        src={course.img_url} 
                        alt={course.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <svg 
                        className="w-16 h-16 text-muted-foreground/30" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                        />
                      </svg>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                      {course.description}
                    </p>

                    <div className="flex flex-col gap-2 mt-auto">
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setEditingCourseId(course.id);
                          setShowCreateForm(false);
                        }}
                      >
                        Edit Course
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link 
                            to="/admin/courses/$courseSlug/lessons"
                            params={{ courseSlug: course.slug }}
                          >
                            Lessons
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link 
                            to="/courses/$slug"
                            params={{ slug: course.slug }}
                            target="_blank"
                          >
                            Preview
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <>
          <AdminHeader
            title="Course Categories"
            description="Manage course categories and difficulty levels"
            buttonText="Create Category"
            showForm={showCreateCategoryForm}
            onToggleForm={() => {
              setShowCreateCategoryForm(!showCreateCategoryForm);
              setEditingCategoryId(null);
            }}
          />

          {showCreateCategoryForm && (
            <FormWrapper>
              <CreateCourseCategoryForm />
            </FormWrapper>
          )}

          {editingCategoryId && (
            <FormWrapper title="Edit Category" onCancel={() => setEditingCategoryId(null)}>
              <EditCourseCategoryForm courseCategoryId={editingCategoryId} />
            </FormWrapper>
          )}

          {categories && categories.length === 0 ? (
            <div className="mt-8">
              <EmptyListPlaceholder text="No categories found. Create your first category to get started!" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {categories?.map((category) => (
                <Card
                  key={category.id}
                  className="p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold flex-1">{category.name}</h3>
                    <Badge variant="secondary">{category.level}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                    {category.description}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingCategoryId(category.id);
                        setShowCreateCategoryForm(false);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
