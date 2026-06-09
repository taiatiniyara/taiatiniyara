import { NextRequest, NextResponse } from "next/server"
import { uploadToR2 } from "@/lib/r2"
import { verifySessionCookie } from "@/lib/auth"
import { randomUUID } from "node:crypto"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

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
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png"
    const contentType = file.type || "application/octet-stream"
    const key = `uploads/${randomUUID()}.${ext}`

    const url = await uploadToR2(key, buffer, contentType)
    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("Upload error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
