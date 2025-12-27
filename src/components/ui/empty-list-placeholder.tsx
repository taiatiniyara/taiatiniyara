interface EmptyListPlaceholderProps {
  text: string;
}

export default function EmptyListPlaceholder({
  text,
}: EmptyListPlaceholderProps) {
  return (
    <div className="flex min-h-100 w-full items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Nothing here yet</h3>
          <p className="text-muted-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
}
