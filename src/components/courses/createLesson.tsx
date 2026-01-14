import { type Lesson } from "@/lib/drizzle/schema";
import CreateForm from "../forms/createForm";
import { slugGenerate } from "@/lib/utils";
import { getNextLessonOrder } from "@/lib/lesson-utils";

interface CreateLessonFormProps {
  courseId: string;
}

export default function CreateLessonForm({ courseId }: CreateLessonFormProps) {
  const handleBeforeSubmit = async (data: Partial<Lesson>) => {
    // Auto-generate the order for this lesson
    const order = await getNextLessonOrder(courseId);
    return { ...data, order };
  };

  return (
    <CreateForm<Lesson>
      tableName="lessons"
      fields={[
        {
          name: "title",
          type: "text",
        },
        {
          name: "duration_minutes",
          type: "number",
        },
        {
          name: "content",
          type: "richtext",
        },
      ]}
      defaultValues={{
        course_id: courseId,
        slug: slugGenerate(),
        created_at: new Date(),
        updated_at: new Date(),
        content: "<p>Start writing your lesson content...</p>",
      }}
      beforeSubmit={handleBeforeSubmit}
    />
  );
}
