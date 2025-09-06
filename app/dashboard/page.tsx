import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      redirect("/auth/login")
    }

    // Get user profile with error handling
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader user={data.user} profile={profile} />

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {profile?.full_name || "Student"}!</h1>
            <p className="text-blue-100">
              {profile?.department && `${profile.department} • `}
              {profile?.year_of_study && `Year ${profile.year_of_study}`}
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards userId={data.user.id} />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <RecentActivity userId={data.user.id} />
            </div>
            <div className="space-y-6">
              <QuickActions />
              <UpcomingEvents />
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    redirect("/auth/login")
  }
}
