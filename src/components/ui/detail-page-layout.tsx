import { type ReactNode } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBox from "@/components/ui/error";
import EmptyListPlaceholder from "@/components/ui/empty-list-placeholder";

interface DetailPageLayoutProps {
  isLoading: boolean;
  error?: Error | null;
  data?: any;
  loadingText?: string;
  errorMessage?: string;
  emptyMessage?: string;
  children: ReactNode;
}

export function DetailPageLayout({
  isLoading,
  error,
  data,
  loadingText = "Loading...",
  errorMessage = "Failed to load content. Please try again later.",
  emptyMessage = "Content not found.",
  children,
}: DetailPageLayoutProps) {
  if (isLoading) {
    return <LoadingSpinner text={loadingText} />;
  }

  if (error) {
    return <ErrorBox message={errorMessage} />;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <EmptyListPlaceholder text={emptyMessage} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
