import type { CourseCategory } from "@/lib/drizzle/schema";
import CreateForm from "../forms/createForm";

export default function CreateCourseCategoryForm() {
  return (
    <CreateForm<CourseCategory>
      tableName="course_categories"
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
          options: ["Beginner", "Intermediate", "Advanced"],
        },
      ]}
      defaultValues={{
        created_at: new Date(),
        updated_at: new Date(),
      }}
    />
  );
}
