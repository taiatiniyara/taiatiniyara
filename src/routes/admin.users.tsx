import { createFileRoute } from "@tanstack/react-router";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import type { UserProfile, Enrollment } from "@/lib/drizzle/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBox from "@/components/ui/error";
import { User, Mail, Calendar, Award, BookOpen, Shield } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/users")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");

  const { data: users, error, isLoading } = useSupabaseQuery<UserProfile>({
    queryKey: ["admin-users"],
    tableName: "user_profiles",
    orderBy: { column: "created_at", ascending: false },
  });

  const { data: enrollments } = useSupabaseQuery<Enrollment>({
    queryKey: ["admin-users-enrollments"],
    tableName: "enrollments",
    fields: ["id", "user_id", "course_id"],
  });

  if (isLoading) return <LoadingSpinner text="Loading users..." />;
  if (error) return <ErrorBox message={error.message} />;

  // Filter users based on search and role
  const filteredUsers = users?.filter((user) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Count enrollments per user
  const getUserEnrollmentCount = (userId: string) => {
    return enrollments?.filter((e) => e.user_id === userId).length || 0;
  };

  const totalUsers = users?.length || 0;
  const totalAdmins = users?.filter((u) => u.role === "admin").length || 0;
  const totalStudents = users?.filter((u) => u.role === "user").length || 0;

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <Heading variant="section" className="mb-2">
          User Management
        </Heading>
        <p className="text-muted-foreground">
          Manage and view all registered users on the platform
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalUsers}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-chart-3/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalAdmins}</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-chart-2/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalStudents}</p>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRoleFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                roleFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setRoleFilter("admin")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                roleFilter === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Admins
            </button>
            <button
              onClick={() => setRoleFilter("user")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                roleFilter === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Students
            </button>
          </div>
        </div>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const enrollmentCount = getUserEnrollmentCount(user.id);
            return (
              <Card key={user.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-chart-2/20 flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? (
                            <><Shield className="w-3 h-3 mr-1" />Admin</>
                          ) : (
                            "Student"
                          )}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:shrink-0">
                    {user.role === "user" && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                        <Award className="w-4 h-4 text-chart-3" />
                        <div>
                          <p className="text-xs text-muted-foreground">Enrollments</p>
                          <p className="text-lg font-bold">{enrollmentCount}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-12 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No users found matching your criteria.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
