import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/auth-context";
import TopNavigation from "@/components/nav";

const RootLayout = () => (
  <AuthProvider>
    <TopNavigation />
    <Outlet />
    <Toaster richColors position="bottom-right" />
    <TanStackRouterDevtools />
  </AuthProvider>
);

export const Route = createRootRoute({ component: RootLayout });
