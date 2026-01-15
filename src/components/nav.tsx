import { useAuth } from "@/context/auth-context";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsDown, LogIn, User2, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavList {
  name: string;
  href: string;
}

const navList: NavList[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Courses", href: "/courses" },
];

export default function TopNavigation() {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, signOut } = useAuth();
  return (
    <>
      <div className="bg-background/60 backdrop-blur-md sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex gap-4 py-4 items-center justify-between">
            <a href="/">
              <img
                src="/logo.svg"
                alt="Logo"
                width={40}
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              {navList.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`${path.split("/")[1] === item.href.slice(1) ? "text-emerald-500 font-bold" : "hover:text-gray-400 transition-colors"}`}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Desktop Auth Button */}
              <div className="hidden md:block">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <User2 />
                        {user.user_metadata.fullName.split(" ")[0]}
                        <ChevronsDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <a href="/profile">Profile</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a
                          href={
                            user.user_metadata.role === "admin"
                              ? "/admin"
                              : "/student"
                          }
                        >
                          Dashboard
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-emerald-500 font-medium"
                        onSelect={async (e) => {
                          e.preventDefault();
                          try {
                            const { error } = await signOut();
                            if (error) {
                              console.error("Sign out error:", error);
                            }
                            // Force reload to clear state
                            window.location.replace("/");
                          } catch (err) {
                            console.error("Sign out failed:", err);
                          }
                        }}
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    onClick={() => {
                      window.location.href = "/login";
                    }}
                  >
                    <LogIn /> Sign In
                  </Button>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-18.25 z-40 bg-background/95 backdrop-blur-lg overflow-y-auto">
          <nav className="flex flex-col p-6 space-y-3 pb-safe">
            {navList.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-6 py-4 rounded-lg text-lg font-medium min-h-12 flex items-center ${
                  path.split("/")[1] === item.href.slice(1)
                    ? "text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-950/30"
                    : "hover:bg-accent transition-colors"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}

            <div className="pt-6 mt-6 border-t border-border">
              {user ? (
                <>
                  <div className="px-6 py-3 text-sm text-muted-foreground bg-muted/50 rounded-lg mb-3">
                    Signed in as{" "}
                    <span className="font-semibold">
                      {user.user_metadata.fullName}
                    </span>
                  </div>
                  <a
                    href="/profile"
                    className="px-6 py-4 rounded-lg text-lg min-h-12 flex items-center hover:bg-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </a>
                  <a
                    href={
                      user.user_metadata.role === "admin"
                        ? "/admin"
                        : "/student"
                    }
                    className="px-6 py-4 rounded-lg text-lg min-h-12 flex items-center hover:bg-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                  <button
                    className="w-full text-left px-6 py-4 rounded-lg text-lg min-h-12 flex items-center text-emerald-500 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                    onClick={async () => {
                      try {
                        const { error } = await signOut();
                        if (error) {
                          console.error("Sign out error:", error);
                        }
                        setMobileMenuOpen(false);
                        // Force reload to clear state
                        window.location.replace("/");
                      } catch (err) {
                        console.error("Sign out failed:", err);
                      }
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Button
                  className="w-full min-h-12 text-lg"
                  size="lg"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/login";
                  }}
                >
                  <LogIn /> Sign In
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
