interface ErrorBoxProps {
  message: string;
}
export default function ErrorBox({ message }: ErrorBoxProps) {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Oops! Something went wrong</h3>
          <p className="text-destructive">{message}</p>
        </div>
      </div>
    </div>
  );
}
