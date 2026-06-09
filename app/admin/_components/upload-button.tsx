"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

type Props = {
  onUpload: (url: string) => void
  currentUrl?: string
}

export function UploadButton({ onUpload, currentUrl }: Props) {
  const [url, setUrl] = useState<string>(currentUrl || "")
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const text = await res.text()
      try {
        const json = JSON.parse(text)
        if (!res.ok) {
          toast.error(json.error || "Upload failed")
          return
        }
        setUrl(json.url)
        onUpload(json.url)
      } catch {
        toast.error(`Unexpected response (${res.status}): ${text.slice(0, 200)}`)
      }
    } catch (err) {
      toast.error(`Upload failed — ${err instanceof Error ? err.message : "network error"}`)
    } finally {
      setUploading(false)
    }
  }

  function handleRemove() {
    setUrl("")
    onUpload("")
  }

  return (
    <div className="space-y-2">
      {url ? (
        <div className="relative inline-block">
          <Image
            src={url}
            alt="Upload preview"
            width={200}
            height={120}
            className="rounded-none border object-cover"
            style={{ width: 200, height: 120 }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        <span className="ml-1.5">{url ? "Change Image" : "Upload Image"}</span>
      </Button>
    </div>
  )
}
