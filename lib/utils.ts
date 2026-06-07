import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTags(json: string): string[] {
  try {
    return JSON.parse(json)
  } catch {
    return []
  }
}

function extractText(node: unknown): string {
  if (typeof node === "string") return node
  if (!node || typeof node !== "object") return ""
  if (Array.isArray(node)) return node.map(extractText).join(" ")
  const obj = node as Record<string, unknown>
  if ("text" in obj && typeof obj.text === "string") return obj.text
  if ("content" in obj) return extractText(obj.content)
  return ""
}

export function getReadingTime(content: unknown): string {
  const text = extractText(content)
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}
