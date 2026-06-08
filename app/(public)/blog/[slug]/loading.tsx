export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 animate-pulse">
      <div className="h-64 sm:h-80 bg-muted mb-8" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 bg-muted rounded-full" />
        <div className="h-5 w-20 bg-muted rounded-full" />
      </div>
      <div className="h-10 w-3/4 bg-muted mb-3" />
      <div className="h-5 w-32 bg-muted mb-8" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-muted" />
        <div className="h-4 w-full bg-muted" />
        <div className="h-4 w-5/6 bg-muted" />
        <div className="h-4 w-2/3 bg-muted" />
      </div>
    </div>
  )
}
