import { createFileRoute, Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'
import { Heading } from '@/components/ui/heading'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Book, FolderOpen, GraduationCap, TrendingUp, Activity, ArrowRight, MessageSquare, UserPlus, Users } from 'lucide-react'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { StatCard } from '@/components/ui/stat-card'
import { ActivityFeed } from '@/components/ui/activity-feed'
import type { BlogPost, Project, Course, UserProfile, Enrollment } from '@/lib/drizzle/schema'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  
  // Fetch all statistics
  const { data: blogPosts, isLoading: loadingBlogs } = useSupabaseQuery<BlogPost>({
    queryKey: ["admin-stats-blogs"],
    tableName: "blog_posts",
    fields: ["id", "title", "created_at", "is_published"],
  })

  const { data: projects, isLoading: loadingProjects } = useSupabaseQuery<Project>({
    queryKey: ["admin-stats-projects"],
    tableName: "projects",
    fields: ["id", "title", "created_at"],
  })

  const { data: courses, isLoading: loadingCourses } = useSupabaseQuery<Course>({
    queryKey: ["admin-stats-courses"],
    tableName: "courses",
    fields: ["id", "title", "created_at"],
  })

  const { data: users, isLoading: loadingUsers } = useSupabaseQuery<UserProfile>({
    queryKey: ["admin-stats-users"],
    tableName: "user_profiles",
    fields: ["id", "name", "role", "created_at"],
  })

  const { data: enrollments, isLoading: loadingEnrollments } = useSupabaseQuery<Enrollment>({
    queryKey: ["admin-stats-enrollments"],
    tableName: "enrollments",
    fields: ["id", "enrolled_at", "user_id", "course_id"],
  })

  const isLoading = loadingBlogs || loadingProjects || loadingCourses || loadingUsers || loadingEnrollments

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  // Calculate statistics
  const publishedBlogs = blogPosts?.filter(p => p.is_published).length || 0
  const totalBlogs = blogPosts?.length || 0
  const totalProjects = projects?.length || 0
  const totalCourses = courses?.length || 0
  const totalUsers = users?.length || 0
  const totalStudents = users?.filter(u => u.role === 'user').length || 0
  const totalEnrollments = enrollments?.length || 0

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const recentBlogs = blogPosts?.filter(b => new Date(b.created_at) > sevenDaysAgo).length || 0
  const recentEnrollments = enrollments?.filter(e => new Date(e.enrolled_at) > sevenDaysAgo).length || 0
  const recentUsers = users?.filter(u => new Date(u.created_at) > sevenDaysAgo).length || 0

  // Get recent items for activity feed
  const recentActivityItems = [
    ...(blogPosts?.slice(0, 3).map(b => ({
      id: b.id,
      type: 'blog',
      title: `New blog post: ${b.title}`,
      date: b.created_at,
      icon: Book,
      iconBgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    })) || []),
    ...(enrollments?.slice(0, 3).map(e => ({
      id: e.id,
      type: 'enrollment',
      title: 'New course enrollment',
      date: e.enrolled_at,
      icon: GraduationCap,
      iconBgColor: 'bg-chart-3/10',
      iconColor: 'text-chart-3',
    })) || []),
    ...(users?.slice(0, 2).map(u => ({
      id: u.id,
      type: 'user',
      title: `New user: ${u.name}`,
      date: u.created_at,
      icon: UserPlus,
      iconBgColor: 'bg-chart-2/10',
      iconColor: 'text-chart-2',
    })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
      {/* Header */}
      <div>
        <Heading variant="section" className="mb-1 sm:mb-2">Admin Dashboard</Heading>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome back, {user?.user_metadata?.fullName || 'Admin'}! Here's your platform overview.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          icon={Book}
          title="Blog Posts"
          value={totalBlogs}
          subtitle={`${publishedBlogs} published`}
          badge={`+${recentBlogs} this week`}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
        />

        <StatCard
          icon={FolderOpen}
          title="Projects"
          value={totalProjects}
          badge="Portfolio"
          iconBgColor="bg-chart-1/10"
          iconColor="text-chart-1"
        />

        <StatCard
          icon={GraduationCap}
          title="Courses"
          value={totalCourses}
          badge={`${totalEnrollments} enrollments`}
          iconBgColor="bg-chart-3/10"
          iconColor="text-chart-3"
        />

        <StatCard
          icon={Users}
          title="Total Users"
          value={totalUsers}
          subtitle={`${totalStudents} students`}
          badge={`+${recentUsers} this week`}
          iconBgColor="bg-chart-2/10"
          iconColor="text-chart-2"
        />
      </div>

      {/* Two Column Layout for Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <ActivityFeed
          activities={recentActivityItems}
          title="Recent Activity"
          emptyMessage="No recent activity"
          maxItems={8}
        />

        {/* Quick Actions */}
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            <h2 className="text-lg sm:text-xl font-bold">Quick Actions</h2>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <Link to="/admin/blog" className="block">
              <div className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 hover:border-primary transition-all group">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-semibold mb-1 group-hover:text-primary transition-colors">Create New Blog Post</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Write and publish a new article</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

            <Link to="/admin/courses" className="block">
              <div className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 hover:border-primary transition-all group">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-semibold mb-1 group-hover:text-primary transition-colors">Add New Course</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Create a new course offering</p>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </div>
              </div>
            </Link>

            <Link to="/admin/projects" className="block">
              <div className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 hover:border-primary transition-all group">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Add New Project</h3>
                    <p className="text-sm text-muted-foreground">Showcase your latest work</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

            <Link to="/admin/users" className="block">
              <div className="p-4 border rounded-lg hover:bg-muted/50 hover:border-primary transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Manage Users</h3>
                    <p className="text-sm text-muted-foreground">View and manage user accounts</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {/* Platform Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{recentEnrollments}</p>
              <p className="text-sm text-muted-foreground">New enrollments this week</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalEnrollments}</p>
              <p className="text-sm text-muted-foreground">Total course enrollments</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{recentBlogs + recentEnrollments + recentUsers}</p>
              <p className="text-sm text-muted-foreground">Total activities this week</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
