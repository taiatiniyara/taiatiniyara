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
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <Card className="p-4 sm:p-6 md:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Manage your account information
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="border-b border-gray-200 pb-4 sm:pb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Email</Label>
                  <p className="text-sm sm:text-base">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm">User ID</Label>
                  <p className="text-xs sm:text-sm break-all">{user?.id}</p>
                </div>
                <div>
                  <Label className="text-sm">Full Name</Label>
                  <p className="text-sm sm:text-base">{user?.user_metadata?.fullName || "Not provided"}</p>
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

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button variant="outline" onClick={() => navigate({ to: "/" })} className="w-full sm:w-auto">
                Go to Home
              </Button>
              <Button variant="destructive" onClick={handleSignOut} className="w-full sm:w-auto">
                Sign Out
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
