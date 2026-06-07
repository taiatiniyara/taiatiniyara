"use server"

import { db } from "@/lib/db"
import { projects } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createProject(data: {
  title: string
  description: string
  techStack: string
  imageUrl: string
  link: string
  clientName: string
  completedDate: string
  testimonial: string
  featured: number
}) {
  await db.insert(projects).values({
    ...data,
    createdAt: new Date().toISOString(),
  })
  revalidatePath("/admin/projects")
}

export async function updateProject(
  id: number,
  data: {
    title: string
    description: string
    techStack: string
    imageUrl: string
    link: string
    clientName: string
    completedDate: string
    testimonial: string
    featured: number
  }
) {
  await db.update(projects).set(data).where(eq(projects.id, id))
  revalidatePath("/admin/projects")
}

export async function deleteProject(id: number) {
  await db.delete(projects).where(eq(projects.id, id))
  revalidatePath("/admin/projects")
}
