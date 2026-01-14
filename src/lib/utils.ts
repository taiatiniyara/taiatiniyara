import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugGenerate(){
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let slug = '';
  for (let i = 0; i < 16; i++) {
    slug += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return slug;
}

/**
 * Formats duration from minutes to a human-readable format
 * @param minutes - Duration in minutes
 * @returns Formatted string like "1.5h", "2h", "0.5h"
 */
export function formatDuration(minutes: number): string {
  const hours = minutes / 60;
  
  // If less than 1 hour, show as decimal (e.g., "0.5h")
  if (hours < 1) {
    return `${hours.toFixed(1)}h`;
  }
  
  // If whole hours, show without decimal (e.g., "2h")
  if (hours % 1 === 0) {
    return `${hours}h`;
  }
  
  // Otherwise show with one decimal place (e.g., "2.5h")
  return `${hours.toFixed(1)}h`;
}