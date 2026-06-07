"use server"

import { getR2Object } from "@/lib/r2"

export async function fetchPostContent(contentR2Key: string): Promise<string | null> {
  if (!contentR2Key) return null
  try {
    return await getR2Object(contentR2Key)
  } catch {
    return null
  }
}
