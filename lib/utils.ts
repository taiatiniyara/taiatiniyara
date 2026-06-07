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
