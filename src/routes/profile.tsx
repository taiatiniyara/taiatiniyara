import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Heading } from "@/components/ui/heading";
import {
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.fullName || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  const handleUpdateName = async () => {
    if (!fullName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { fullName: fullName.trim() },
      });

      if (error) throw error;

      toast.success("Name updated successfully!");
      setIsEditing(false);

      // Refresh the page to update the auth context
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to update name");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.user_metadata?.fullName || "");
    setIsEditing(false);
  };

  if (!user) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 py-6 sm:py-8 md:py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header Card */}
        <Card className="mb-4 sm:mb-6 p-4 sm:p-6 border-none shadow-lg">
          <div>
            <Heading variant="section" className="text-foreground">
              {user?.user_metadata?.fullName || "User"}
            </Heading>
            <p className="text-muted-foreground flex items-center gap-2 mt-2">
              <Mail className="w-4 h-4" />
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5"
              >
                <Shield className="w-3 h-3" />
                {user?.user_metadata?.role || "user"}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information Card */}
          <Card className="p-6 shadow-lg border-none">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-500" />
                Personal Information
              </h2>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </Label>
                {isEditing ? (
                  <div className="mt-2 space-y-3">
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      disabled={isUpdating}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpdateName}
                        disabled={isUpdating}
                        size="sm"
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {isUpdating ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        disabled={isUpdating}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-foreground font-medium">
                    {user?.user_metadata?.fullName || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </Label>
                <p className="mt-2 text-foreground font-medium break-all">
                  {user?.email}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Role
                </Label>
                <p className="mt-2 text-foreground font-medium capitalize">
                  {user?.user_metadata?.role || "user"}
                </p>
              </div>
            </div>
          </Card>

          {/* Account Activity Card */}
          <Card className="p-6 shadow-lg border-none">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Account Activity
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Created
                  </p>
                  <p className="text-foreground font-semibold mt-1">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Sign In
                  </p>
                  <p className="text-foreground font-semibold mt-1">
                    {user?.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions Card */}
        <Card className="mt-6 p-6 shadow-lg border-none">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/" })}
              className="flex-1"
            >
              Go to Home
            </Button>
            <Button
              onClick={() =>
                navigate({
                  to:
                    user?.user_metadata?.role === "admin"
                      ? "/admin"
                      : "/student",
                })
              }
              className="flex-1"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="flex-1"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Badge({
  variant = "default",
  className = "",
  children,
}: {
  variant?: "default" | "secondary";
  className?: string;
  children: React.ReactNode;
}) {
  const variants = {
    default: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    secondary: "bg-secondary text-secondary-foreground",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
