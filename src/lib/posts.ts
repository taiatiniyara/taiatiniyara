import type { PostRow } from "./db.ts";

/** Reading trail for a post. `all` is the public list, newest first (as listPosts returns it). */
export function postNeighbours(all: PostRow[], post: Pick<PostRow, "id" | "project_id">, relatedMax = 3) {
  const i = all.findIndex((p) => p.id === post.id);
  return {
    newer: i > 0 ? all[i - 1] : null,
    older: i >= 0 && i < all.length - 1 ? all[i + 1] : null,
    related: post.project_id === null ? [] : all.filter((p) => p.project_id === post.project_id && p.id !== post.id).slice(0, relatedMax),
  };
}

export function articleLd(post: PostRow, canonical: string, image?: string) {
  const iso = (sec: number) => new Date(sec * 1000).toISOString();
  return {
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.summary && { description: post.summary }),
    datePublished: iso(post.published_at ?? post.created_at),
    dateModified: iso(post.updated_at),
    author: { "@type": "Person", name: "Taia Tiniyara", url: "https://taiatiniyara.com" },
    mainEntityOfPage: canonical,
    ...(image && { image: new URL(image.startsWith("/media/") && !image.endsWith(".gif") ? `${image}?w=1200` : image, canonical).href }),
  };
}
