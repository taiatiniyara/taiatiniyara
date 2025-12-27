import type { BlogPost } from "@/lib/drizzle/schema";
import EditForm from "../forms/editForm";

interface EditBlogFormProps {
  blogId: string; // or slug
  useSlug?: boolean; // if true, will match by slug instead of id
}

export default function EditBlogForm({ blogId, useSlug = false }: EditBlogFormProps) {
  return (
    <EditForm<BlogPost>
      tableName="blog_posts"
      recordId={blogId}
      matchColumn={useSlug ? "slug" : "id"}
      fields={[
        {
          name: "title",
          type: "textarea",
        },
        {
          name: "excerpt",
          type: "textarea",
        },
        {
          name: "tags",
          type: "tags",
        },
        {
          name: "content",
          type: "richtext",
        },
        {
          name: "img_url",
          type: "text",
        },
      ]}
    />
  );
}
