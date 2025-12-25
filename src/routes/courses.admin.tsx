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
  useModulesByCourse,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
} from "@/hooks/useCourseQueries";
import type { Course, CreateCourseInput, CourseModule, CreateModuleInput } from "@/types/course";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Pencil, Trash2, Plus, X, GraduationCap, BookOpen, Video } from "lucide-react";
import { useAlertDialog } from "@/components/AlertDialogProvider";

export const Route = createFileRoute("/courses/admin")({
  component: CoursesAdmin,
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function CoursesAdmin() {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useAlertDialog();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);

  // Fetch all courses (including drafts)
  const { data: coursesData, isLoading: loading } = useAllCourses(1, 100);
  const courses = coursesData?.courses || [];

  // Fetch modules for selected course
  const { data: modules = [], isLoading: modulesLoading } = useModulesByCourse(selectedCourse?.id || "");

  // Mutations
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();
  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();
  const deleteModuleMutation = useDeleteModule();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [durationHours, setDurationHours] = useState(0);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  // Module form state
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleSlug, setModuleSlug] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleContent, setModuleContent] = useState("");
  const [moduleVideoUrl, setModuleVideoUrl] = useState("");
  const [moduleDuration, setModuleDuration] = useState(0);
  const [moduleOrderIndex, setModuleOrderIndex] = useState(0);
  const [modulePublished, setModulePublished] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setContent("");
    setThumbnail("");
    setCategory("");
    setLevel('beginner');
    setDurationHours(0);
    setTechnologies([]);
    setTechInput("");
    setFeatured(false);
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

  const handleAddTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput("");
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const resetModuleForm = () => {
    setModuleTitle("");
    setModuleSlug("");
    setModuleDescription("");
    setModuleContent("");
    setModuleVideoUrl("");
    setModuleDuration(0);
    setModuleOrderIndex(modules.length);
    setModulePublished(false);
    setEditingModule(null);
    setIsCreatingModule(false);
  };

  const handleModuleTitleChange = (value: string) => {
    setModuleTitle(value);
    if (!editingModule) {
      setModuleSlug(generateSlug(value));
    }
  };

  const handleViewModules = (course: Course) => {
    setSelectedCourse(course);
    setIsCreating(false);
    setIsCreatingModule(false);
  };

  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module);
    setModuleTitle(module.title);
    setModuleSlug(module.slug);
    setModuleDescription(module.description || "");
    setModuleContent(module.content);
    setModuleVideoUrl(module.video_url || "");
    setModuleDuration(module.duration_minutes);
    setModuleOrderIndex(module.order_index);
    setModulePublished(module.published);
    setIsCreatingModule(true);
  };

  const handleDeleteModule = async (id: string) => {
    showConfirm(
      "Delete Module",
      "Are you sure you want to delete this module? This action cannot be undone.",
      async () => {
        try {
          await deleteModuleMutation.mutateAsync({
            id,
            courseId: selectedCourse!.id,
          });
          showAlert("Success", "Module deleted successfully!");
        } catch (error) {
          console.error("Error deleting module:", error);
          showAlert("Error", "Failed to delete module. Check console for details.");
        }
      }
    );
  };

  const handleSubmitModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const moduleData: CreateModuleInput = {
      course_id: selectedCourse.id,
      title: moduleTitle,
      slug: moduleSlug,
      description: moduleDescription || undefined,
      content: moduleContent,
      video_url: moduleVideoUrl || undefined,
      duration_minutes: moduleDuration,
      order_index: moduleOrderIndex,
      published: modulePublished,
    };

    try {
      if (editingModule) {
        await updateModuleMutation.mutateAsync({
          id: editingModule.id,
          input: moduleData,
        });
        showAlert("Success", "Module updated successfully!");
      } else {
        await createModuleMutation.mutateAsync(moduleData);
        showAlert("Success", "Module created successfully!");
      }
      resetModuleForm();
    } catch (error) {
      console.error("Error saving module:", error);
      showAlert("Error", "Failed to save module. Check console for details.");
    }
  };

  const handleEdit = async (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setSlug(course.slug);
    setDescription(course.description);
    setContent(course.content);
    setThumbnail(course.thumbnail || "");
    setCategory(course.category || "");
    setLevel(course.level || 'beginner');
    setDurationHours(course.duration_hours);
    setTechnologies(course.technologies || []);
    setFeatured(course.featured);
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
          console.error("Error deleting course:", error);
          showAlert("Error", "Failed to delete course. Check console for details.");
        }
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const courseData: CreateCourseInput = {
      title,
      slug,
      description,
      content,
      thumbnail: thumbnail || undefined,
      category: category || undefined,
      level,
      duration_hours: durationHours,
      technologies,
      featured,
      published,
      published_at: published ? new Date().toISOString() : undefined,
    };

    try {
      if (editingCourse) {
        await updateCourseMutation.mutateAsync({
          id: editingCourse.id,
          input: courseData,
        });
        showAlert("Success", "Course updated successfully!");
      } else {
        await createCourseMutation.mutateAsync(courseData);
        showAlert("Success", "Course created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving course:", error);
      showAlert("Error", "Failed to save course. Check console for details.");
    }
  };

  const levelColors = {
    beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
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
            onClick={() => setIsCreating(!isCreating)}
            variant={isCreating ? "outline" : "default"}
          >
            {isCreating ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                New Course
              </>
            )}
          </Button>
          <Button
            onClick={() => navigate({ to: "/courses" })}
            variant="outline"
          >
            View Courses
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Form */}
        {isCreating && (
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingCourse ? "Edit Course" : "Create New Course"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="React Masterclass 2024"
                />
              </div>

              {/* Slug */}
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

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder="A brief description of the course..."
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write the full course description..."
                />
              </div>

              {/* Thumbnail */}
              <div>
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Category and Level */}
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

              {/* Duration */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    step="0.5"
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                  />
                </div>

              </div>

              {/* Technologies */}
              <div>
                <Label>Technologies</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTechnology();
                      }
                    }}
                    placeholder="React, TypeScript, etc."
                  />
                  <Button
                    type="button"
                    onClick={handleAddTechnology}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTechnology(tech)}
                    >
                      {tech} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Published</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={
                    createCourseMutation.isPending || updateCourseMutation.isPending
                  }
                >
                  {editingCourse ? "Update Course" : "Create Course"}
                </Button>
                {editingCourse && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </Card>
        )}

        {/* Course List */}
        <Card className={`p-6 ${isCreating ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
          <h2 className="text-2xl font-bold mb-6">All Courses ({courses.length})</h2>
          <div className="space-y-4">
            {courses.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No courses yet. Create your first course!
              </p>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          {course.title}
                        </h3>
                        {course.featured && (
                          <Badge className="bg-purple-600 text-white border-0 text-xs">
                            Featured
                          </Badge>
                        )}
                        {course.published ? (
                          <Badge className="bg-green-500 text-white border-0 text-xs">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Draft
                          </Badge>
                        )}
                        {course.level && (
                          <Badge className={`${levelColors[course.level]} border-0 text-xs`}>
                            {course.level}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{course.duration_hours}h</span>
                        {course.category && <span>• {course.category}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(course)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewModules(course)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <BookOpen className="w-4 h-4" />
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

        {/* Module Management Panel */}
        {selectedCourse && (
          <Card className="lg:col-span-3 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Modules: {selectedCourse.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {modulesLoading ? "Loading..." : `${modules.length} modules`}
                </p>
              </div>
              <div className="flex gap-2">
                {!isCreatingModule ? (
                  <Button
                    onClick={() => {
                      setIsCreatingModule(true);
                      setEditingModule(null);
                      setModuleOrderIndex(modules.length);
                    }}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setIsCreatingModule(false);
                      resetModuleForm();
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setSelectedCourse(null);
                    setIsCreatingModule(false);
                    resetModuleForm();
                  }}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>

            {/* Module Form */}
            {isCreatingModule && (
              <Card className="p-6 mb-6 border-2 border-purple-200 dark:border-purple-800">
                <h3 className="text-xl font-bold mb-4">
                  {editingModule ? "Edit Module" : "Create New Module"}
                </h3>
                <form onSubmit={handleSubmitModule} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="module-title">Title *</Label>
                      <Input
                        id="module-title"
                        value={moduleTitle}
                        onChange={(e) => handleModuleTitleChange(e.target.value)}
                        required
                        placeholder="Introduction to React"
                      />
                    </div>
                    <div>
                      <Label htmlFor="module-slug">Slug *</Label>
                      <Input
                        id="module-slug"
                        value={moduleSlug}
                        onChange={(e) => setModuleSlug(e.target.value)}
                        required
                        placeholder="introduction-to-react"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="module-description">Description</Label>
                    <Textarea
                      id="module-description"
                      value={moduleDescription}
                      onChange={(e) => setModuleDescription(e.target.value)}
                      rows={2}
                      placeholder="Brief module description..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="module-content">Content *</Label>
                    <RichTextEditor
                      content={moduleContent}
                      onChange={setModuleContent}
                      placeholder="Write the module content..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="module-video">Video URL</Label>
                      <Input
                        id="module-video"
                        value={moduleVideoUrl}
                        onChange={(e) => setModuleVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="module-duration">Duration (minutes)</Label>
                      <Input
                        id="module-duration"
                        type="number"
                        min="0"
                        value={moduleDuration}
                        onChange={(e) => setModuleDuration(Number(e.target.value))}
                        placeholder="45"
                      />
                    </div>
                    <div>
                      <Label htmlFor="module-order">Order Index</Label>
                      <Input
                        id="module-order"
                        type="number"
                        min="0"
                        value={moduleOrderIndex}
                        onChange={(e) => setModuleOrderIndex(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={modulePublished}
                        onChange={(e) => setModulePublished(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Published</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={
                        createModuleMutation.isPending || updateModuleMutation.isPending
                      }
                    >
                      {editingModule ? "Update Module" : "Create Module"}
                    </Button>
                    {editingModule && (
                      <Button type="button" variant="outline" onClick={resetModuleForm}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </Card>
            )}

            {/* Modules List */}
            <div className="space-y-3">
              {modules.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No modules yet. Create your first module!
                </p>
              ) : (
                modules
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((module, index) => (
                    <div
                      key={module.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-slate-500 dark:text-slate-400 text-sm font-mono">
                              #{index + 1}
                            </span>
                            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              {module.title}
                            </h4>
                            {module.published ? (
                              <Badge className="bg-green-500 text-white border-0 text-xs">
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Draft
                              </Badge>
                            )}
                            {module.video_url && (
                              <Video className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                          {module.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {module.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>Order: {module.order_index}</span>
                            {module.duration_minutes > 0 && (
                              <span>• {module.duration_minutes} min</span>
                            )}
                            <span>• {module.slug}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditModule(module)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteModule(module.id)}
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
        )}
      </div>
    </div>
  );
}
