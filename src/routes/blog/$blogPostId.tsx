import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$blogPostId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/blog/$blogPostId"!</div>
}
