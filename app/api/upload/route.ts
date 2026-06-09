import { NextRequest, NextResponse } from "next/server"
import { uploadToR2 } from "@/lib/r2"
import { verifySessionCookie } from "@/lib/auth"
import { randomUUID } from "node:crypto"
import sharp from "sharp"

const WEBP_QUALITY = 80
const MAX_DIMENSION = 1920

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
    const key = `uploads/${randomUUID()}.webp`

    const webpBuffer = await sharp(buffer)
      .rotate()
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer()

    const url = await uploadToR2(key, webpBuffer, "image/webp")
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
