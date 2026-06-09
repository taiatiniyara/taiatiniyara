import { NextRequest, NextResponse } from "next/server"
import { uploadToR2 } from "@/lib/r2"
import { verifySessionCookie } from "@/lib/auth"
import { randomUUID } from "node:crypto"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const WEBP_QUALITY = 80
const MAX_DIMENSION = 1920

let sharpReady: boolean | null = null

async function trySharp(): Promise<typeof import("sharp").default> {
  const sharp = (await import("sharp")).default
  // Quick smoke test — process a tiny image to verify bindings work
  await sharp(Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"))
    .webp()
    .toBuffer()
  return sharp
}

async function convertToWebP(buffer: Buffer): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  if (sharpReady === null) {
    try {
      await trySharp()
      sharpReady = true
      console.log("sharp: ready")
    } catch {
      sharpReady = false
      console.warn("sharp: unavailable — uploading originals")
    }
  }

  if (!sharpReady) throw new Error("sharp unavailable")

  const sharp = (await import("sharp")).default
  const webpBuffer = await sharp(buffer)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
  return { buffer: webpBuffer, contentType: "image/webp", ext: "webp" }
}

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get("session")?.value
    if (!session || !(await verifySessionCookie(session))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024} MB)` },
        { status: 413 },
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let outBuffer: Buffer
    let contentType: string
    let ext: string

    try {
      const converted = await convertToWebP(buffer)
      outBuffer = converted.buffer
      contentType = converted.contentType
      ext = converted.ext
    } catch {
      outBuffer = buffer
      ext = file.name.split(".").pop()?.toLowerCase() ?? "png"
      contentType = file.type || "application/octet-stream"
    }

    const key = `uploads/${randomUUID()}.${ext}`
    const url = await uploadToR2(key, outBuffer, contentType)
    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("Upload error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
