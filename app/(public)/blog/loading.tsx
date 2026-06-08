import { Card } from "@/components/ui/card"

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10">
        <div className="h-10 w-32 bg-muted animate-pulse" />
        <div className="mt-2 h-5 w-64 bg-muted animate-pulse" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-44 bg-muted animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-24 bg-muted animate-pulse" />
              <div className="h-5 w-full bg-muted animate-pulse" />
              <div className="h-4 w-3/4 bg-muted animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
