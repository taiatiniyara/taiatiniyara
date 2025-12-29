import { type CourseCategory, type Course } from "@/lib/drizzle/schema";
import CreateForm from "../forms/createForm";
import { slugGenerate } from "@/lib/utils";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

export default function CreateCourseForm() {
  const {data, error, isLoading} = useSupabaseQuery<CourseCategory>({
    tableName: "course_categories",
    queryKey: ["courseCat"],
    fields: ["id", "name"]
  });

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  return (
    <CreateForm<Course>
      tableName="courses"
      fields={[
        {
          name: "category_id",
          type: "select",
          options: data ? data.map(cat => cat.id) : []
        },
        {
          name: "title",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "technologies",
          type: "tags",
        },
        {
          name: "tags",
          type: "tags",
        },
        {
          name: "img_url",
          type: "text",
        }
      ]}
      defaultValues={{
        slug: slugGenerate(),
        created_at: new Date(),
        updated_at: new Date(),
      }}
    />
  );
}
