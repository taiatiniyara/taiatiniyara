"use server"

import { db } from "@/lib/db"
import { products } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function createProduct(data: {
  name: string
  description: string
  techStack: string
  imageUrl: string
  link: string
  status: string
  featured: number
}) {
  await db.insert(products).values({
    ...data,
    createdAt: new Date().toISOString(),
  })
  revalidatePath("/admin/products")
}

export async function updateProduct(
  id: number,
  data: {
    name: string
    description: string
    techStack: string
    imageUrl: string
    link: string
    status: string
    featured: number
  }
) {
  await db.update(products).set(data).where(eq(products.id, id))
  revalidatePath("/admin/products")
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id))
  revalidatePath("/admin/products")
}
