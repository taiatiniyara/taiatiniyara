import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ClipLoader } from "react-spinners";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSessionStorage } from "@/hooks/useSessionStorage";

interface AdminLayoutProps {
  title: string;
  viewPath: string;
  viewLabel: string;
  isLoading?: boolean;
  children: ReactNode;
  adminKey: string;
  storageKey: string;
  onCreateNew?: () => void;
  showCreateButton?: boolean;
}

export function AdminLayout({
  title,
  viewPath,
  viewLabel,
  isLoading = false,
  children,
  adminKey,
  storageKey,
  onCreateNew,
  showCreateButton = true,
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const sessionStorage = useSessionStorage<string | null>(storageKey, null);
  const [storedKey, setStoredKey] = sessionStorage;

  // Auth check
  if (storedKey !== adminKey) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Admin Access</h2>
          <p className="mb-4">
            Please enter the admin key to access the {title.toLowerCase()}{" "}
            panel.
          </p>
          <Input
            type="password"
            placeholder="Enter admin key"
            value={storedKey || ""}
            onChange={(e) => setStoredKey(e.target.value)}
          />
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-100">
          <ClipLoader color="#3b82f6" size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="flex gap-4">
          <Button onClick={() => navigate({ to: viewPath })} variant="outline">
            {viewLabel}
          </Button>
          {showCreateButton && onCreateNew && (
            <Button onClick={onCreateNew}>Create New</Button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
