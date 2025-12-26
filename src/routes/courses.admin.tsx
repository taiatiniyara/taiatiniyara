import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  useAllCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "@/hooks/useCourseQueries";
import type { Course, CreateCourseInput } from "@/types/course";
import { Pencil, Trash2, Plus, X, GraduationCap, BookOpen } from "lucide-react";
import { useAlertDialog } from "@/components/AlertDialogProvider";
import { generateSlug } from "@/lib/admin-utils";
import { AdminRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/courses/admin")({
  component: CoursesAdmin,
});

function CoursesAdmin() {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useAlertDialog();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all courses (including drafts)
  const { data: coursesData, isPending: loading } = useAllCourses(1, 100);
  const courses = coursesData?.courses || [];

  // Mutations
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [published, setPublished] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setThumbnail("");
    setCategory("");
    setLevel('beginner');
    setTechnologies([]);
    setPublished(false);
    setEditingCourse(null);
    setIsCreating(false);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingCourse) {
      setSlug(generateSlug(value));
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setSlug(course.slug);
    setDescription(course.description);
    setThumbnail(course.thumbnail || "");
    setCategory(course.category || "");
    setLevel(course.level || 'beginner');
    setTechnologies(course.technologies || []);
    setPublished(course.published);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      "Delete Course",
      "Are you sure you want to delete this course? This action cannot be undone.",
      async () => {
        try {
          await deleteCourseMutation.mutateAsync(id);
          showAlert("Success", "Course deleted successfully!");
        } catch (error) {
          showAlert("Error", "Failed to delete course.");
        }
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!title.trim() || !slug.trim() || !description.trim()) {
      showAlert("Error", "Please fill in all required fields");
      return;
    }

    const courseData: CreateCourseInput = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      thumbnail: thumbnail?.trim() || undefined,
      category: category?.trim() || undefined,
      level: level,
      technologies: technologies,
      featured: false,
      published: published,
      published_at: published ? new Date().toISOString() : undefined,
    };

    try {
      console.log('Submitting course data:', courseData);
      if (editingCourse) {
        await updateCourseMutation.mutateAsync({
          id: editingCourse.id,
          input: courseData,
        });
        showAlert("Success", "Course updated successfully!");
      } else {
        const result = await createCourseMutation.mutateAsync(courseData);
        console.log('Course created:', result);
        showAlert("Success", "Course created successfully!");
      }
      resetForm();
    } catch (error: any) {
      console.error('Error saving course:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });
      const errorMessage = error?.message?.includes('duplicate key')
        ? "A course with this slug already exists."
        : `Failed to save course: ${error?.message || 'Unknown error'}`;
      showAlert("Error", errorMessage);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading courses...</p>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-8 h-8" />
              Courses Admin
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage your online courses
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate({ to: "/courses/modules-admin" })}
              variant="outline"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Modules
            </Button>
            <Button
              onClick={() => navigate({ to: "/courses" })}
              variant="outline"
            >
              View Site
            </Button>
          </div>
        </div>

        {/* Course Form */}
        {isCreating && (
          <Card className="p-6 mb-8 border-2 border-purple-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingCourse ? "Edit Course" : "Create New Course"}
              </h2>
              <Button onClick={resetForm} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="React Masterclass 2024"
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="react-masterclass-2024"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  placeholder="Full description of the course"
                />
              </div>

              <div>
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Web Development"
                  />
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <select
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input
                  id="technologies"
                  value={technologies.join(", ")}
                  onChange={(e) => setTechnologies(e.target.value.split(",").map(t => t.trim()).filter(t => t))}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Published</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={createCourseMutation.isPending || updateCourseMutation.isPending}
                >
                  {createCourseMutation.isPending || updateCourseMutation.isPending
                    ? "Saving..."
                    : editingCourse
                    ? "Update Course"
                    : "Create Course"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Course List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Courses ({courses.length})</h2>
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Course
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {courses.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No courses yet. Create your first course!
              </p>
            ) : (
              courses.map((course: any) => (
                <div
                  key={course.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        {course.published ? (
                          <Badge className="bg-green-500 text-white border-0">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                        {course.level && (
                          <Badge variant="outline">{course.level}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                        {course.description}
                      </p>
                      {(course.category || (course.technologies && course.technologies.length > 0)) && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          {course.category && <span>{course.category}</span>}
                          {course.category && course.technologies && course.technologies.length > 0 && <span>•</span>}
                          {course.technologies && course.technologies.length > 0 && (
                            <span>{course.technologies.join(", ")}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(course)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(course.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AdminRoute>
  );
}
