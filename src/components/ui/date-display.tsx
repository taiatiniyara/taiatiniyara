export function DateDisplay({ date }: { date: string | Date }) {
  const dateString = date instanceof Date ? date.toDateString() : new Date(date).toDateString();
  
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      {dateString}
    </div>
  );
}
