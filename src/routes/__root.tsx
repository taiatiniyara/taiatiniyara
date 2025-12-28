import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/auth-context";import { ThemeProvider } from "@/context/theme-context";import TopNavigation from "@/components/nav";
import Footer from "@/components/footer";

const RootLayout = () => {
  const location = useLocation();
  
  // Hide footer on admin and student pages
  const hideFooter = location.pathname.startsWith('/admin') || location.pathname.startsWith('/student');
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <TopNavigation />
          <main className="flex-1">
            <Outlet />
          </main>
          {!hideFooter && <Footer />}
          <Toaster richColors position="bottom-right" />
          <TanStackRouterDevtools />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
