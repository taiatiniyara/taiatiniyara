"use client"

import { ErrorDisplay } from "@/components/shared/error-display"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorDisplay
      error={error}
      reset={reset}
      message="An unexpected error occurred. Please try again."
    />
  )
}
