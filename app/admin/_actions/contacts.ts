"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { contacts } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function getContacts() {
  return db.select().from(contacts).orderBy(contacts.createdAt)
}

export async function getUnreadCount() {
  const rows = await db.select().from(contacts).where(eq(contacts.isRead, 0))
  return rows.length
}

export async function markAsRead(id: number) {
  await db.update(contacts).set({ isRead: 1 }).where(eq(contacts.id, id))
  revalidatePath("/admin/messages")
  return { success: true }
}

export async function markAsUnread(id: number) {
  await db.update(contacts).set({ isRead: 0 }).where(eq(contacts.id, id))
  revalidatePath("/admin/messages")
  return { success: true }
}

export async function deleteContact(id: number) {
  await db.delete(contacts).where(eq(contacts.id, id))
  revalidatePath("/admin/messages")
  return { success: true }
}
