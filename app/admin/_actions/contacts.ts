"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { contacts } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { ReplySchema } from "@/lib/validations/contacts"
import { sendReply } from "@/lib/email"

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
  revalidatePath("/admin")
  return { success: true }
}

export async function markAsUnread(id: number) {
  await db.update(contacts).set({ isRead: 0 }).where(eq(contacts.id, id))
  revalidatePath("/admin/messages")
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteContact(id: number) {
  await db.delete(contacts).where(eq(contacts.id, id))
  revalidatePath("/admin/messages")
  revalidatePath("/admin")
  return { success: true }
}

export async function markAllAsRead() {
  await db.update(contacts).set({ isRead: 1 }).where(eq(contacts.isRead, 0))
  revalidatePath("/admin/messages")
  return { success: true }
}

export async function sendReplyToContact(formData: FormData) {
  const parsed = ReplySchema.safeParse({
    id: Number(formData.get("id")),
    message: formData.get("message"),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { id, message } = parsed.data

  const [row] = await db
    .select({ name: contacts.name, email: contacts.email })
    .from(contacts)
    .where(eq(contacts.id, id))
    .limit(1)

  if (!row) {
    return { error: { _form: ["Contact not found"] } }
  }

  try {
    await sendReply({
      toName: row.name,
      toEmail: row.email,
      replyBody: message,
    })
    return { success: true }
  } catch {
    return { error: { _form: ["Failed to send reply. Check SMTP configuration."] } }
  }
}
