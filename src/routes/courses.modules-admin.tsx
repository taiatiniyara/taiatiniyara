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
  useModulesByCourse,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
} from "@/hooks/useCourseQueries";
import type { Course, CourseModule, CreateModuleInput } from "@/types/course";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Pencil, Trash2, Plus, X, BookOpen, Video, GraduationCap, ArrowLeft } from "lucide-react";
import { useAlertDialog } from "@/components/AlertDialogProvider";
import { generateSlug } from "@/lib/admin-utils";
import { AdminRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/courses/modules-admin")({
  component: ModulesAdmin,
});

function ModulesAdmin() {
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useAlertDialog();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);

  // Fetch all courses
  const { data: coursesData, isLoading: loadingCourses } = useAllCourses(1, 100);
  const courses = coursesData?.courses || [];

  // Fetch modules for selected course
  const { data: modules = [], isLoading: modulesLoading } = useModulesByCourse(selectedCourse?.id || "");

  // Mutations
  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();
  const deleteModuleMutation = useDeleteModule();

  // Module form state
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleSlug, setModuleSlug] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleContent, setModuleContent] = useState("");
  const [moduleVideoUrl, setModuleVideoUrl] = useState("");
  const [moduleDuration, setModuleDuration] = useState(0);
  const [moduleOrderIndex, setModuleOrderIndex] = useState(0);
  const [modulePublished, setModulePublished] = useState(false);

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

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsCreatingModule(false);
    resetModuleForm();
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
          showAlert("Error", "Failed to delete module.");
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
      showAlert("Error", "Failed to save module.");
    }
  };

  if (loadingCourses) {
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              Modules Admin
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage course modules
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate({ to: "/courses/admin" })}
              variant="outline"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Manage Courses
            </Button>
            <Button
              onClick={() => navigate({ to: "/courses" })}
              variant="outline"
            >
              View Courses
            </Button>
          </div>
        </div>

        {!selectedCourse ? (
          // Course Selection View
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Select a Course</h2>
            <div className="space-y-4">
              {courses.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No courses available. Create a course first!
                </p>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer"
                    onClick={() => handleSelectCourse(course)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {course.title}
                          </h3>
                          {course.published ? (
                            <Badge className="bg-green-500 text-white border-0 text-xs">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Draft
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage Modules
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        ) : (
          // Module Management View
          <div className="space-y-6">
            {/* Selected Course Header */}
            <Card className="p-6 bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      onClick={() => {
                        setSelectedCourse(null);
                        setIsCreatingModule(false);
                        resetModuleForm();
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {selectedCourse.title}
                    </h2>
                    {selectedCourse.published ? (
                      <Badge className="bg-green-500 text-white border-0">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Draft
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 ml-12">
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
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Module Form */}
            {isCreatingModule && (
              <Card className="p-6 border-2 border-purple-200 dark:border-purple-800">
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
                        autoFocus
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
                      {createModuleMutation.isPending || updateModuleMutation.isPending
                        ? "Saving..."
                        : editingModule
                        ? "Update Module"
                        : "Create Module"}
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
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">
                Modules ({modules.length})
              </h3>
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
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
