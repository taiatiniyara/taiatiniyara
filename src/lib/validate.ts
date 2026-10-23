import type { JSONContent } from "@tiptap/core";
import type { PostInput, ProjectInput, Status } from "./db.ts";
import { isSlug, slugify } from "./slug.ts";

type Raw = Record<string, unknown>;
export type Parsed<T> = { ok: true; value: T; body: JSONContent | null } | { ok: false; error: string };

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const status = (v: unknown): Status => (v === "published" ? "published" : "draft");
const webUrl = (v: unknown) => {
  const s = str(v, 500);
  if (!s) return null;
  try {
    return ["http:", "https:"].includes(new URL(s).protocol) ? s : undefined;
  } catch {
    return undefined;
  }
};

function common(raw: Raw) {
  const title = str(raw.title, 120);
  if (!title) return { error: "Enter a title." } as const;
  const slug = str(raw.slug, 80) || slugify(title);
  if (!isSlug(slug)) return { error: "Use lowercase letters, numbers and single hyphens in the slug." } as const;
  const body = raw.body ?? null;
  if (body !== null && (typeof body !== "object" || (body as JSONContent).type !== "doc" || JSON.stringify(body).length > 1_000_000))
    return { error: "The post body is not valid." } as const;
  return { error: null, title, slug, summary: str(raw.summary, 300), status: status(raw.status), body: body as JSONContent | null };
}

export function parseProject(raw: Raw): Parsed<ProjectInput> {
  const c = common(raw);
  if (c.error) return { ok: false, error: c.error };
  const repo = webUrl(raw.repo_url);
  const live = webUrl(raw.live_url);
  if (repo === undefined || live === undefined) return { ok: false, error: "Enter links like https://example.com." };
  const result = str(raw.result, 160);
  const cover = str(raw.cover_key, 100) || null;
  if (cover && !/^media\/[a-f0-9]{64}\.(webp|gif)$/.test(cover)) return { ok: false, error: "The cover image is not valid." };
  return { ok: true, body: c.body, value: { slug: c.slug, title: c.title, summary: c.summary, result, status: c.status, cover_key: cover, repo_url: repo, live_url: live } };
}

export function parsePost(raw: Raw): Parsed<PostInput> {
  const c = common(raw);
  if (c.error) return { ok: false, error: c.error };
  const pid = raw.project_id === null || raw.project_id === "" || raw.project_id === undefined ? null : Number(raw.project_id);
  if (pid !== null && !Number.isInteger(pid)) return { ok: false, error: "Choose a valid project." };
  return { ok: true, body: c.body, value: { slug: c.slug, title: c.title, summary: c.summary, status: c.status, project_id: pid } };
}

export const isUniqueError = (e: unknown) => e instanceof Error && /UNIQUE/i.test(e.message);
