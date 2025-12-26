import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/courses/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/courses/categories/"!</div>
}
