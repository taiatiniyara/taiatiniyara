export function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary"
          role="status"
          aria-label={text}
        />
        <div className="text-sm text-muted-foreground">{text}</div>
      </div>
    </div>
  )
}
