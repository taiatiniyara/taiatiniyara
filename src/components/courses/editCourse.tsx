import type { Course } from "@/lib/drizzle/schema";
import EditForm from "../forms/editForm";

interface EditCourseFormProps {
  courseId: string; // or slug
  useSlug?: boolean; // if true, will match by slug instead of id
}

export default function EditCourseForm({
  courseId,
  useSlug = false,
}: EditCourseFormProps) {
  return (
    <EditForm<Course>
      tableName="courses"
      fields={[
        {
          name: "title",
          type: "text",
        },
        {
          name: "description",
          type: "text",
        },
        {
          name: "img_url",
          type: "text",
        },
        {
          name: "technologies",
          type: "tags",
        },
      ]}
      recordId={courseId}
      matchColumn={useSlug ? "slug" : "id"}
    />
  );
}
