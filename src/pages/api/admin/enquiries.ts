import type { APIContext } from "astro";
import { env } from "cloudflare:workers";
import { deleteEnquiry } from "../../../lib/db.ts";

// DELETE { id }
export async function DELETE({ request }: APIContext) {
  const { id } = (await request.json()) as { id: number };
  if (!Number.isInteger(Number(id))) return Response.json({ error: "Bad request." }, { status: 400 });
  await deleteEnquiry(env.DB, Number(id));
  return Response.json({ ok: true });
}
