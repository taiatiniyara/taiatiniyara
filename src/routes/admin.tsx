import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import {
  Book,
  LayoutDashboard,
  Stamp,
  Users,
  Menu,
  X,
  Pencil,
} from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";

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
  { text: "Projects", href: "/admin/projects", icon: <Pencil /> },
  { text: "Courses", href: "/admin/courses", icon: <Stamp /> },
  { text: "Users", href: "/admin/users", icon: <Users /> },
];

function RouteComponent() {
  const path = window.location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user?.user_metadata?.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div className="flex flex-col lg:flex-row items-start">
      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-white rounded-full shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 lg:top-18.25 inset-y-0 left-0 z-40 w-64 lg:w-fit min-h-screen lg:h-[calc(100vh-73px)]
          flex flex-col border-r border-gray-300 gap-2 py-4 bg-background
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {sidebarListItems.map((item) => (
          <a
            className={`flex items-center gap-3 py-2 px-4 ${
              path === item.href
                ? "bg-emerald-200 text-emerald-500 font-semibold"
                : "hover:text-emerald-500 transition-colors"
            }`}
            href={item.href}
            key={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.icon}
            <span className="whitespace-nowrap">{item.text}</span>
          </a>
        ))}
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="p-4 sm:p-6 w-full overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
