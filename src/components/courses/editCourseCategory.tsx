import type { CourseCategory } from "@/lib/drizzle/schema";
import EditForm from "../forms/editForm";

interface EditCourseCategoryFormProps {
  courseCategoryId: string;
  useSlug?: boolean;
}

export default function EditCourseCategoryForm({
  courseCategoryId,
  useSlug = false,
}: EditCourseCategoryFormProps) {
  return (
    <EditForm<CourseCategory>
      recordId={courseCategoryId}
      matchColumn={useSlug ? "slug" : "id"}
      fields={[
        {
          name: "name",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "level",
          type: "select",
          options: [
            {
              label: "Beginner",
              value: "Beginner",
            },
            {
              label: "Intermediate",
              value: "Intermediate",
            },
            {
              label: "Advanced",
              value: "Advanced",
            },
          ],
        },
      ]}
      tableName="course_categories"
    />
  );
}
