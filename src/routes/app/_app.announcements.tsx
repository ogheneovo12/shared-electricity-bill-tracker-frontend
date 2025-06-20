import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_app/announcements')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/_app/announcements"!</div>
}
