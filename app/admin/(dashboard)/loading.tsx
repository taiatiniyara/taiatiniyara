export default function AdminLoading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-40 bg-muted animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-none" />
        ))}
      </div>
    </div>
  )
}
