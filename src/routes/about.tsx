import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <iframe className="w-full h-screen" src="/CV.pdf"></iframe>
    </div>
  );
}
