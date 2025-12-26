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
import { ChevronsDown, LogIn, User2 } from "lucide-react";

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

  const { user, signOut } = useAuth();
  return (
    <div className="flex gap-4 p-4 items-center justify-between bg-white/20 backdrop-blur-xl sticky top-0 z-10">
      <a href="/">
        <img src="/logo.svg" alt="Logo" width={40} />
      </a>
      <nav>
        {navList.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`px-2 mx-2 ${path.split("/")[1] === item.href.slice(1) ? "text-pink-600 font-semibold" : "hover:text-gray-400 transition-colors"}`}
          >
            {item.name}
          </a>
        ))}
      </nav>

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
  );
}
