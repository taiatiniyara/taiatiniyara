"use client"

import { Button } from "@/components/ui/button"

export default function HomeError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="font-heading text-2xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-muted-foreground">
        We couldn&apos;t load the page. Please try again.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try Again
      </Button>
    </div>
  )
}
