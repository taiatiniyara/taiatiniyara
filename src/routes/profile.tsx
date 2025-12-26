import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/label";

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

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  if (!user) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your account information
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <Label>User ID</Label>
                  <p>{user?.id}</p>
                </div>
                <div>
                  <Label>Full Name</Label>
                  <p>{user?.user_metadata?.fullName || "Not provided"}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <p>{user?.user_metadata?.role || "Not provided"}</p>
                </div>
                <div>
                  <Label>Account Created</Label>
                  <p>
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label>Last Sign In</Label>
                  <p>
                    {user?.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate({ to: "/" })}>
                Go to Home
              </Button>
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
