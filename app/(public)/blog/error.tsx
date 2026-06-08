"use client"

import { Button } from "@/components/ui/button"

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
