import type { JSONContent } from "@tiptap/core";
import { emptyDoc } from "./content.ts";

export type Status = "draft" | "published";

export interface Project {
  id: number;
  slug: string;
  title: string;
  summary: string;
  result: string;
  cover_key: string | null;
  repo_url: string | null;
  live_url: string | null;
  sort_order: number;
  status: Status;
  published_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface Post {
  id: number;
  project_id: number | null;
  slug: string;
  title: string;
  summary: string;
  status: Status;
  published_at: number | null;
  created_at: number;
  updated_at: number;
}

/** A post plus the project it belongs to, for feeds and URLs. */
export interface PostRow extends Post {
  project_slug: string | null;
  project_title: string | null;
}

export const postPath = (p: Pick<PostRow, "slug" | "project_slug">) =>
  p.project_slug ? `/projects/${p.project_slug}/${p.slug}` : `/blog/${p.slug}`;

const now = () => Math.floor(Date.now() / 1000);
const POST_SELECT = `SELECT posts.*, projects.slug AS project_slug, projects.title AS project_title
  FROM posts LEFT JOIN projects ON projects.id = posts.project_id`;

// ---- bodies (R2) ----

export const bodyKey = (kind: "posts" | "projects", id: number) => `${kind}/${id}.json`;

export async function getBody(bucket: R2Bucket, kind: "posts" | "projects", id: number): Promise<JSONContent> {
  const obj = await bucket.get(bodyKey(kind, id));
  return obj ? ((await obj.json()) as JSONContent) : emptyDoc;
}

export const putBody = (bucket: R2Bucket, kind: "posts" | "projects", id: number, doc: JSONContent) =>
  bucket.put(bodyKey(kind, id), JSON.stringify(doc), { httpMetadata: { contentType: "application/json" } });

// ---- projects ----

export async function listProjects(db: D1Database, drafts = false) {
  const where = drafts ? "" : "WHERE status = 'published'";
  const { results } = await db.prepare(`SELECT * FROM projects ${where} ORDER BY sort_order, id`).all<Project>();
  return results;
}

export const getProjectBySlug = (db: D1Database, slug: string, drafts = false) =>
  db.prepare(`SELECT * FROM projects WHERE slug = ?1 ${drafts ? "" : "AND status = 'published'"}`).bind(slug).first<Project>();

export const getProject = (db: D1Database, id: number) =>
  db.prepare("SELECT * FROM projects WHERE id = ?1").bind(id).first<Project>();

export interface ProjectInput {
  slug: string;
  title: string;
  summary: string;
  result: string;
  cover_key: string | null;
  repo_url: string | null;
  live_url: string | null;
  status: Status;
}

export async function saveProject(db: D1Database, id: number | null, input: ProjectInput): Promise<number> {
  const t = now();
  if (id === null) {
    const next = await db.prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM projects").first<{ n: number }>();
    const row = await db
      .prepare(
        `INSERT INTO projects (slug, title, summary, result, cover_key, repo_url, live_url, sort_order, status, published_at, created_at, updated_at)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?11) RETURNING id`,
      )
      .bind(input.slug, input.title, input.summary, input.result, input.cover_key, input.repo_url, input.live_url, next!.n, input.status, input.status === "published" ? t : null, t)
      .first<{ id: number }>();
    return row!.id;
  }
  // Slug is locked once published_at is set; published_at is set once, on first publish.
  await db
    .prepare(
      `UPDATE projects SET
         slug = CASE WHEN published_at IS NULL THEN ?2 ELSE slug END,
         title = ?3, summary = ?4, result = ?5, cover_key = ?6, repo_url = ?7, live_url = ?8, status = ?9,
         published_at = COALESCE(published_at, CASE WHEN ?9 = 'published' THEN ?10 END),
         updated_at = ?10
       WHERE id = ?1`,
    )
    .bind(id, input.slug, input.title, input.summary, input.result, input.cover_key, input.repo_url, input.live_url, input.status, t)
    .run();
  return id;
}

/** Swap sort_order with the neighbouring project. */
export async function moveProject(db: D1Database, id: number, dir: "up" | "down") {
  const all = await listProjects(db, true);
  const i = all.findIndex((p) => p.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= all.length) return;
  // Renumber so equal sort_orders can't make the swap a no-op.
  const order = all.map((p) => p.id);
  [order[i], order[j]] = [order[j], order[i]];
  await db.batch(order.map((pid, n) => db.prepare("UPDATE projects SET sort_order = ?2 WHERE id = ?1").bind(pid, n + 1)));
}

/** Returns false (and deletes nothing) while the project still has posts. */
export async function deleteProject(db: D1Database, bucket: R2Bucket, id: number): Promise<boolean> {
  const n = await db.prepare("SELECT COUNT(*) AS n FROM posts WHERE project_id = ?1").bind(id).first<{ n: number }>();
  if (n!.n > 0) return false;
  await db.prepare("DELETE FROM projects WHERE id = ?1").bind(id).run();
  await bucket.delete(bodyKey("projects", id));
  return true;
}

// ---- posts ----

export async function listPosts(db: D1Database, opts: { projectId?: number; drafts?: boolean; limit?: number } = {}) {
  const where: string[] = [];
  if (!opts.drafts) where.push("posts.status = 'published'", "(projects.id IS NULL OR projects.status = 'published')");
  if (opts.projectId !== undefined) where.push("posts.project_id = ?1");
  const sql = `${POST_SELECT} ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY COALESCE(posts.published_at, posts.created_at) DESC, posts.id DESC LIMIT ${opts.limit ?? 500}`;
  const stmt = db.prepare(sql);
  const { results } = await (opts.projectId !== undefined ? stmt.bind(opts.projectId) : stmt).all<PostRow>();
  return results;
}

export const getPost = (db: D1Database, id: number) =>
  db.prepare(`${POST_SELECT} WHERE posts.id = ?1`).bind(id).first<PostRow>();

/** Public lookup: projectSlug null means a standalone /blog/<slug> post. */
export function getPostBySlug(db: D1Database, projectSlug: string | null, slug: string) {
  return db
    .prepare(
      `${POST_SELECT} WHERE posts.slug = ?1 AND posts.status = 'published' AND ${
        projectSlug === null ? "posts.project_id IS NULL" : "projects.slug = ?2 AND projects.status = 'published'"
      }`,
    )
    .bind(...(projectSlug === null ? [slug] : [slug, projectSlug]))
    .first<PostRow>();
}

export interface PostInput {
  project_id: number | null;
  slug: string;
  title: string;
  summary: string;
  status: Status;
}

export async function savePost(db: D1Database, id: number | null, input: PostInput): Promise<number> {
  const t = now();
  if (id === null) {
    const row = await db
      .prepare(
        `INSERT INTO posts (project_id, slug, title, summary, status, published_at, created_at, updated_at)
         VALUES (?1,?2,?3,?4,?5,?6,?7,?7) RETURNING id`,
      )
      .bind(input.project_id, input.slug, input.title, input.summary, input.status, input.status === "published" ? t : null, t)
      .first<{ id: number }>();
    return row!.id;
  }
  // Slug and project (i.e. the URL) are locked once published_at is set.
  await db
    .prepare(
      `UPDATE posts SET
         project_id = CASE WHEN published_at IS NULL THEN ?2 ELSE project_id END,
         slug = CASE WHEN published_at IS NULL THEN ?3 ELSE slug END,
         title = ?4, summary = ?5, status = ?6,
         published_at = COALESCE(published_at, CASE WHEN ?6 = 'published' THEN ?7 END),
         updated_at = ?7
       WHERE id = ?1`,
    )
    .bind(id, input.project_id, input.slug, input.title, input.summary, input.status, t)
    .run();
  return id;
}

export async function deletePost(db: D1Database, bucket: R2Bucket, id: number) {
  await db.prepare("DELETE FROM posts WHERE id = ?1").bind(id).run();
  await bucket.delete(bodyKey("posts", id));
}

// ---- media ----

export const recordMedia = (db: D1Database, key: string, size: number) =>
  db.prepare("INSERT OR IGNORE INTO media (key, size, created_at) VALUES (?1, ?2, ?3)").bind(key, size, now()).run();

export async function listMedia(db: D1Database) {
  const { results } = await db.prepare("SELECT * FROM media ORDER BY created_at DESC").all<{ key: string; size: number; created_at: number }>();
  return results;
}

// ---- enquiries (contact form) ----

export interface Enquiry {
  id: number;
  email: string;
  message: string;
  timeline: string;
  created_at: number;
}

export const saveEnquiry = (db: D1Database, e: Pick<Enquiry, "email" | "message" | "timeline">) =>
  db.prepare("INSERT INTO enquiries (email, message, timeline, created_at) VALUES (?1,?2,?3,?4)").bind(e.email, e.message, e.timeline, now()).run();

export async function listEnquiries(db: D1Database) {
  const { results } = await db.prepare("SELECT * FROM enquiries ORDER BY created_at DESC, id DESC LIMIT 200").all<Enquiry>();
  return results;
}

export const deleteEnquiry = (db: D1Database, id: number) => db.prepare("DELETE FROM enquiries WHERE id = ?1").bind(id).run();

/** How many enquiries arrived since `since` (unix seconds), for the contact form's flood limit. */
export async function countEnquiriesSince(db: D1Database, since: number) {
  const row = await db.prepare("SELECT COUNT(*) AS n FROM enquiries WHERE created_at >= ?1").bind(since).first<{ n: number }>();
  return row!.n;
}
