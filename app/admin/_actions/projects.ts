"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { projects } from "@/lib/schema"
import { ProjectSchema } from "@/lib/validations/projects"
import { eq } from "drizzle-orm"

export async function getProjects() {
  return db.select().from(projects).orderBy(projects.sortOrder)
}

export async function getProject(id: number) {
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
  return rows[0] ?? null
}

export async function createProject(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = ProjectSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  await db.insert(projects).values({
    ...parsed.data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  revalidatePath("/admin/projects")
  revalidatePath("/admin")
  revalidatePath("/")
  return { success: true }
}

export async function updateProject(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = ProjectSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  await db
    .update(projects)
    .set({ ...parsed.data, updatedAt: new Date().toISOString() })
    .where(eq(projects.id, id))

  revalidatePath("/admin/projects")
  revalidatePath("/admin")
  revalidatePath("/")
  return { success: true }
}

export async function deleteProject(id: number) {
  await db.delete(projects).where(eq(projects.id, id))
  revalidatePath("/admin/projects")
  revalidatePath("/admin")
  revalidatePath("/")
  return { success: true }
}
