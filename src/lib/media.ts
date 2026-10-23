export const MAX_BYTES = { webp: 5 * 1024 * 1024, gif: 10 * 1024 * 1024 };

/** Detect by magic bytes, never by the client's declared type. The browser already shrank everything else to WebP. */
export function sniff(b: Uint8Array): "webp" | "gif" | null {
  const ascii = (from: number, to: number) => String.fromCharCode(...b.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a") return "gif";
  return null;
}

export async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const d = new Uint8Array(await crypto.subtle.digest("SHA-256", data));
  return [...d].map((x) => x.toString(16).padStart(2, "0")).join("");
}
