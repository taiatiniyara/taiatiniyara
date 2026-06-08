"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { services } from "@/lib/schema"
import { ServiceSchema } from "@/lib/validations/services"
import { eq } from "drizzle-orm"

export async function getServices() {
  return db.select().from(services).orderBy(services.sortOrder)
}

export async function getService(id: number) {
  const rows = await db.select().from(services).where(eq(services.id, id)).limit(1)
  return rows[0] ?? null
}

export async function createService(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = ServiceSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  await db.insert(services).values({
    ...parsed.data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  revalidatePath("/admin/services")
  return { success: true }
}

export async function updateService(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = ServiceSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  await db
    .update(services)
    .set({ ...parsed.data, updatedAt: new Date().toISOString() })
    .where(eq(services.id, id))

  revalidatePath("/admin/services")
  return { success: true }
}

export async function deleteService(id: number) {
  await db.delete(services).where(eq(services.id, id))
  revalidatePath("/admin/services")
  return { success: true }
}
