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
