export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex min-h-[85vh] items-center bg-muted/30 px-4">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1fr_auto]">
          <div className="max-w-2xl space-y-6">
            <div className="h-4 w-48 bg-muted rounded-full" />
            <div className="space-y-3">
              <div className="h-10 w-full bg-muted rounded-full sm:h-12" />
              <div className="h-10 w-3/4 bg-muted rounded-full sm:h-12" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-full bg-muted rounded-full" />
              <div className="h-5 w-2/3 bg-muted rounded-full" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-36 bg-muted rounded-full" />
              <div className="h-10 w-28 bg-muted rounded-full" />
            </div>
          </div>
          <div className="h-72 w-full max-w-md bg-muted rounded-lg" />
        </div>
      </div>

      <div className="bg-primary/5 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 px-2 py-4">
                <div className="size-5 bg-muted rounded-full" />
                <div className="h-8 w-12 bg-muted rounded-full" />
                <div className="h-3 w-20 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-background px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-center gap-3">
            <div className="h-8 w-48 bg-muted rounded-full sm:h-10" />
            <div className="h-4 w-72 bg-muted rounded-full" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
