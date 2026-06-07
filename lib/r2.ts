import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToR2(key: string, body: Buffer | string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: body,
    ContentType: contentType,
  })
  await r2Client.send(command)
  return getR2Url(key)
}

function getR2Url(key: string): string {
  const base = process.env.R2_PUBLIC_URL
  if (!base) {
    // Fallback: use custom domain pattern; user must set R2_PUBLIC_URL in production
    return `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`
  }
  return `${base.replace(/\/$/, "")}/${key}`
}

export async function getR2Object(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  })
  const response = await r2Client.send(command)
  if (!response.Body) return null
  return response.Body.transformToString("utf-8")
}
