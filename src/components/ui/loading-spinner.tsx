import BarLoader from "react-spinners/BarLoader";

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
}

export default function LoadingSpinner({ size, text }: LoadingSpinnerProps) {
  return (
    <div className="flex min-h-[400px] w-full flex-col gap-6 items-center justify-center p-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
        <svg className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <BarLoader color="hsl(var(--primary))" width={size || 200} />
      {text && <p className="text-muted-foreground text-lg animate-pulse">{text}</p>}
    </div>
  );
}
