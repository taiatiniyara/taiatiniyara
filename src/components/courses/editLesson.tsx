import type { Lesson } from "@/lib/drizzle/schema";
import EditForm from "../forms/editForm";

interface EditLessonFormProps {
  lessonId: string;
  useSlug?: boolean;
}

export default function EditLessonForm({
  lessonId,
  useSlug = false,
}: EditLessonFormProps) {
  return (
    <EditForm<Lesson>
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
      recordId={lessonId}
      matchColumn={useSlug ? "slug" : "id"}
    />
  );
}
