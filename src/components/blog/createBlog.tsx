import type { BlogPost } from "@/lib/drizzle/schema";
import CreateForm from "../forms/createForm";
import { slugGenerate } from "@/lib/utils";

export default function CreateBlogForm() {
  return (
    <CreateForm<BlogPost>
      tableName="blog_posts"
      fields={[
        {
          name: "title",
          type: "text",
        },
        {
          name: "excerpt",
          type: "textarea",
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
      defaultValues={{
        created_at: new Date(),
        updated_at: new Date(),
        slug: slugGenerate(),
        is_published: true,
        tags: [],
      }}
    />
  );
}
