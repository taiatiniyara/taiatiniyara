import { createFileRoute } from '@tanstack/react-router'
import { Sandpack } from "@codesandbox/sandpack-react";

export const Route = createFileRoute('/playground')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><Sandpack theme="dark" template="node" /></div>
}
