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

interface NavList {
  name: string;
  href: string;
}

const navList: NavList[] = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Courses", href: "/courses" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
];

export default function TopNavigation() {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, signOut } = useAuth();
  return (
    <>
      <div className="bg-white/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex gap-4 py-4 items-center justify-between">
            <a href="/">
              <img src="/logo.svg" alt="Logo" width={40} />
            </a>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              {navList.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`${path.split("/")[1] === item.href.slice(1) ? "text-pink-600 font-semibold" : "hover:text-gray-400 transition-colors"}`}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
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
                            user.user_metadata.role === "admin" ? "/admin" : "/student"
                          }
                        >
                          Dashboard
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-pink-600 font-medium"
                        onClick={async () => {
                          await signOut();
                          window.location.href = "/";
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
                className="md:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
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
        <div className="md:hidden fixed inset-0 top-18 z-50 bg-white/95 backdrop-blur-lg">
          <nav className="flex flex-col p-4 space-y-2">
            {navList.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-md text-lg ${
                  path.split("/")[1] === item.href.slice(1)
                    ? "text-pink-600 font-semibold bg-pink-50"
                    : "hover:bg-gray-100 transition-colors"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            <div className="pt-4 mt-4 border-t">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Signed in as <span className="font-semibold">{user.user_metadata.fullName}</span>
                  </div>
                  <a
                    href="/profile"
                    className="block px-4 py-3 rounded-md text-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </a>
                  <a
                    href={user.user_metadata.role === "admin" ? "/admin" : "/student"}
                    className="block px-4 py-3 rounded-md text-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                  <button
                    className="w-full text-left px-4 py-3 rounded-md text-lg text-pink-600 font-medium hover:bg-pink-50 transition-colors"
                    onClick={async () => {
                      await signOut();
                      setMobileMenuOpen(false);
                      window.location.href = "/";
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Button
                  className="w-full"
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
