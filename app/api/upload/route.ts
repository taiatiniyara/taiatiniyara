import { NextRequest, NextResponse } from "next/server"
import { uploadToR2 } from "@/lib/r2"
import { verifySessionCookie } from "@/lib/auth"
import { randomUUID } from "node:crypto"

export async function POST(req: NextRequest) {
  // Auth check
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
    const ext = file.name.split(".").pop() || "png"
    const key = `uploads/${randomUUID()}.${ext}`

    const url = await uploadToR2(key, buffer, file.type)
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
