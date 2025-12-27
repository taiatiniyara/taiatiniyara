import { lazy, Suspense, type ComponentProps } from "react";
import LoadingSpinner from "./ui/loading-spinner";

const TiptapEditor = lazy(() => import("./tiptap"));

type TiptapProps = ComponentProps<typeof TiptapEditor>;

export default function TiptapLazy(props: TiptapProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-50 border rounded-md bg-muted/10">
          <LoadingSpinner />
        </div>
      }
    >
      <TiptapEditor {...props} />
    </Suspense>
  );
}
