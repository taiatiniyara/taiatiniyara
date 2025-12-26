import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '@/context/auth-context'
import TopNavigation from '@/components/nav'

const RootLayout = () => (
  <AuthProvider>
    <TopNavigation />
    <Outlet />
    <TanStackRouterDevtools />
  </AuthProvider>
)

export const Route = createRootRoute({ component: RootLayout })