"use server"

import { db } from "@/lib/db"
import { services } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createService(data: {
  title: string
  description: string
  icon: string
  sortOrder: number
}) {
  await db.insert(services).values(data)
  revalidatePath("/admin/services")
}

export async function updateService(
  id: number,
  data: {
    title: string
    description: string
    icon: string
    sortOrder: number
  }
) {
  await db.update(services).set(data).where(eq(services.id, id))
  revalidatePath("/admin/services")
}

export async function deleteService(id: number) {
  await db.delete(services).where(eq(services.id, id))
  revalidatePath("/admin/services")
}
