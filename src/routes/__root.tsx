import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import circle from "@/components/img/logo.svg";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AlertDialogProvider } from "@/components/AlertDialogProvider";
import { User, LogOut, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthModal } from "@/components/AuthModal";

interface MenuListItem {
  name: string;
  to: string;
}

const menuItems: MenuListItem[] = [
  { name: "Home", to: "/" },
  { name: "Blog", to: "/blog" },
  { name: "About", to: "/about" },
  { name: "Projects", to: "/projects" },
  { name: "Courses", to: "/courses" },
];

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  
  // Track page views with Google Analytics
  useAnalytics();

  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    await signOut();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <nav
          className="border-b bg-white shadow-sm"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a
                href="/"
                className="flex items-center gap-2 text-xl font-bold hover:text-blue-600 transition-colors group"
                aria-label="Taia Tiniyara - Home"
              >
                <img
                  src={circle}
                  alt="Taia Tiniyara Logo"
                  className="h-9 w-9 group-hover:scale-110 transition-transform"
                />
              </a>

              {/* Desktop Navigation */}
              <div className="hidden md:flex gap-6 items-center">
                {menuItems.map((item) => (
                  <a  
                    key={item.to}
                    href={item.to}
                    className={"hover:text-blue-600 transition-colors " + (window.location.pathname === item.to ? "text-blue-600 font-medium" : "")}
                  >
                    {item.name}
                  </a>
                ))}
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <User className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {user?.email}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer">
                          <BookOpen className="mr-2 h-4 w-4" />
                          My Courses
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button onClick={() => setShowAuthModal(true)}>
                    Sign In
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t pt-4">
                <div className="flex flex-col gap-4">
                  <Link
                    to="/"
                    className="hover:text-blue-600 transition-colors py-2"
                    activeProps={{ className: "text-blue-600 font-medium" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/blog"
                    className="hover:text-blue-600 transition-colors py-2"
                    activeProps={{ className: "text-blue-600 font-medium" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    to="/about"
                    className="hover:text-blue-600 transition-colors py-2"
                    activeProps={{ className: "text-blue-600 font-medium" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/projects"
                    className="hover:text-blue-600 transition-colors py-2"
                    activeProps={{ className: "text-blue-600 font-medium" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Projects
                  </Link>
                  <Link
                    to="/courses"
                    className="hover:text-blue-600 transition-colors py-2"
                    activeProps={{ className: "text-blue-600 font-medium" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Courses
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                        activeProps={{ className: "bg-purple-700" }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <BookOpen className="w-4 h-4" />
                        My Courses
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Button onClick={() => {
                      setShowAuthModal(true);
                      setMobileMenuOpen(false);
                    }}>
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
      <main role="main" className="grow">
        <Outlet />
      </main>
      <footer className="border-t bg-gray-50 mt-16" role="contentinfo">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>
              © {new Date().getFullYear()} Taia Tiniyara. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <AlertDialogProvider>
        <Navigation />
      </AlertDialogProvider>
    </AuthProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
