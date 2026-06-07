"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ErrorDisplay({
  reset,
  message = "An unexpected error occurred. Please try again.",
}: {
  error: Error & { digest?: string }
  reset: () => void
  message?: string
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground text-center max-w-md">{message}</p>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={reset}>
          Try Again
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
