import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Book, LayoutDashboard, Stamp, Users } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

interface SidebarListItem {
  text: string;
  href: string;
  icon: React.ReactNode;
}

const sidebarListItems: SidebarListItem[] = [
  { text: "Dashboard", href: "/admin", icon: <LayoutDashboard /> },
  { text: "Blog", href: "/admin/blog", icon: <Book /> },
  { text: "Courses", href: "/admin/courses", icon: <Stamp /> },
  { text: "Users", href: "/admin/users", icon: <Users /> },
];

const ADMIN_ACCESS_KEY = import.meta.env.VITE_ADMIN_ACCESS_KEY;
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;

if (!ADMIN_ACCESS_KEY || !ADMIN_KEY) {
  throw new Error("Admin access key is not defined in environment variables.");
}

function RouteComponent() {
  const path = window.location.pathname;

  const adminKey =
    typeof window !== "undefined" ? sessionStorage.getItem(ADMIN_KEY) : null;

  if (!adminKey || adminKey !== ADMIN_ACCESS_KEY) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const accessKey = formData.get(ADMIN_KEY);

          if (accessKey && accessKey === ADMIN_ACCESS_KEY) {
            sessionStorage.setItem(ADMIN_KEY, accessKey.toString());
            window.location.reload();
          } else {
            toast.error("Invalid access key. Please try again.");
          }
        }}
        className="p-8 space-y-4 border shadow bg-white m-4"
      >
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-700">Enter Access Key to continue:</p>
        <Input name={ADMIN_KEY} placeholder="Enter access key here..." />

        <Button type="submit">Check</Button>
      </form>
    );
  }

  return (
    <div className="flex items-start">
      <div className="w-fit min-h-screen flex flex-col border-r border-gray-300 gap-2 py-4">
        {sidebarListItems.map((item) => (
          <a
            className={`flex items-center gap-3 py-2 px-4 ${
              path === item.href
                ? "bg-pink-200 text-pink-600 font-semibold"
                : "hover:text-pink-600 transition-colors"
            }`}
            href={item.href}
            key={item.href}
          >
            {item.icon}
            {item.text}
          </a>
        ))}
      </div>
      <div className="p-4"><Outlet /></div>
      
    </div>
  );
}
