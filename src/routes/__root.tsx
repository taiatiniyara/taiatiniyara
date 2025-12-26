import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '@/context/auth-context'

const RootLayout = () => (
  <AuthProvider>
    <Outlet />
    <TanStackRouterDevtools />
  </AuthProvider>
)

export const Route = createRootRoute({ component: RootLayout })