import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SLUG_CONFIG, DURATION, READING, SOCIAL_SHARE_URLS, type SocialPlatform } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a random slug for unique identifiers
 * @returns Random alphanumeric string of configured length
 */
export function slugGenerate(): string {
  const { characters, length } = SLUG_CONFIG;
  let slug = '';
  for (let i = 0; i < length; i++) {
    slug += characters.charAt(Math.floor(Math.random() * characters.length));
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
  if (hours < DURATION.minHoursDecimal) {
    return `${hours.toFixed(DURATION.decimalPlaces)}h`;
  }
  
  // If whole hours, show without decimal (e.g., "2h")
  if (hours % 1 === 0) {
    return `${hours}h`;
  }
  
  // Otherwise show with one decimal place (e.g., "2.5h")
  return `${hours.toFixed(DURATION.decimalPlaces)}h`;
}

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Formats a date to a readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculates reading time for content based on word count
 * Assumes average reading speed from READING constant
 * @param content - HTML or text content to analyze
 * @returns Estimated reading time in minutes
 */
export function calculateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / READING.wordsPerMinute);
}

/**
 * Generates a share URL for social media platforms
 * @param platform - Social media platform
 * @param url - URL to share
 * @param title - Optional title for platforms that support it
 * @returns Generated share URL
 */
export function getSocialShareUrl(platform: SocialPlatform, url: string, title?: string): string {
  return SOCIAL_SHARE_URLS[platform](url, title);
}

/**
 * Opens a social share popup window
 * @param platform - Social media platform
 * @param url - URL to share
 * @param title - Optional title for platforms that support it
 */
export function openSharePopup(platform: SocialPlatform, url: string, title?: string): void {
  const shareUrl = getSocialShareUrl(platform, url, title);
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

/**
 * Copies text to clipboard and returns success status
 * @param text - Text to copy
 * @returns Promise that resolves to true if successful
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}