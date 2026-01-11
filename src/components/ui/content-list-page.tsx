import React from "react";
import LoadingSpinner from "./loading-spinner";
import ErrorBox from "./error";
import EmptyListPlaceholder from "./empty-list-placeholder";
import { PageHero } from "./page-hero";

interface ContentListPageProps<T> {
  title: string | React.ReactNode;
  description: string;
  data?: T[];
  isLoading: boolean;
  error: Error | null;
  emptyText: string;
  loadingText: string;
  renderItem: (item: T) => React.ReactNode;
  getItemKey: (item: T) => string;
}

export function ContentListPage<T>({
  title,
  description,
  data,
  isLoading,
  error,
  emptyText,
  loadingText,
  renderItem,
  getItemKey,
}: ContentListPageProps<T>) {
  if (isLoading) {
    return <LoadingSpinner text={loadingText} />;
  }

  if (error) {
    return <ErrorBox message={error.message} />;
  }

  if (!data || data.length === 0) {
    return <EmptyListPlaceholder text={emptyText} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20">
      <PageHero title={title} description={description} />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {data.map((item) => (
            <React.Fragment key={getItemKey(item)}>
              {renderItem(item)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
