"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { products } from "@/lib/schema"
import { ProductSchema } from "@/lib/validations/products"
import { eq } from "drizzle-orm"

export async function getProducts() {
  return db.select().from(products).orderBy(products.sortOrder)
}

export async function getProduct(id: number) {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1)
  return rows[0] ?? null
}

export async function createProduct(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = ProductSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  await db.insert(products).values({
    ...parsed.data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  revalidatePath("/admin/products")
  revalidatePath("/admin")
  revalidatePath("/")
  return { success: true }
}

export async function updateProduct(id: number, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = ProductSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  await db
    .update(products)
    .set({ ...parsed.data, updatedAt: new Date().toISOString() })
    .where(eq(products.id, id))

  revalidatePath("/admin/products")
  revalidatePath("/admin")
  revalidatePath("/")
  return { success: true }
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id))
  revalidatePath("/admin/products")
  revalidatePath("/admin")
  revalidatePath("/")
  return { success: true }
}
