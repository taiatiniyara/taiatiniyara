import { NextRequest, NextResponse } from "next/server"
import { uploadToR2 } from "@/lib/r2"
import { verifySessionCookie } from "@/lib/auth"
import { randomUUID } from "node:crypto"

const WEBP_QUALITY = 80
const MAX_DIMENSION = 1920

async function convertToWebP(buffer: Buffer): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  try {
    const sharp = (await import("sharp")).default
    const webpBuffer = await sharp(buffer)
      .rotate()
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer()
    return { buffer: webpBuffer, contentType: "image/webp", ext: "webp" }
  } catch {
    console.warn("sharp unavailable — uploading original format without conversion")
    throw new Error("sharp unavailable")
  }
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get("session")?.value
  if (!session || !(await verifySessionCookie(session))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

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
      ext = file.name.split(".").pop() ?? "png"
      contentType = file.type || "application/octet-stream"
    }

    const key = `uploads/${randomUUID()}.${ext}`
    const url = await uploadToR2(key, outBuffer, contentType)
    return NextResponse.json({ url })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
