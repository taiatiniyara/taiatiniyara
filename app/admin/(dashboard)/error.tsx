"use client"

import { Button } from "@/components/ui/button"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-6">
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          {error.message || "An unexpected error occurred in the admin panel."}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
