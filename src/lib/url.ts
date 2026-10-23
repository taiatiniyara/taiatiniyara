/** Link allow-list: http(s), mailto, or a site-relative path. Everything else (javascript:, data:, //host) is dropped. */
export function safeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.startsWith("/")) return url[1] !== "/" && url[1] !== "\\";
  try {
    return ["http:", "https:", "mailto:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

/** Image src allow-list: only our own content-hashed media. */
export const MEDIA_PATH = /^\/media\/[a-f0-9]{64}\.(webp|gif)$/;
export const IMAGE_WIDTHS = [480, 800, 1200, 2000];
