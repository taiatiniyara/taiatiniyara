import { NextRequest, NextResponse } from "next/server"
import { uploadToR2 } from "@/lib/r2"
import { COOKIE_NAME, hasValidSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value ?? null
  if (!hasValidSession(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const key = `uploads/${Date.now()}-${file.name}`
    const url = await uploadToR2(key, buffer, file.type)

    return NextResponse.json({ url, key })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
