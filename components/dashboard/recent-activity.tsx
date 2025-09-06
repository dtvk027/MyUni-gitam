import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"

interface RecentActivityProps {
  userId: string
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  const supabase = await createClient()

  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:author_id (
          full_name,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5)

    if (error) {
      console.error("Error fetching posts:", error)
      throw error
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your campus community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.profiles?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{post.profiles?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">{post.profiles?.full_name || "Anonymous"}</p>
                    <p className="text-xs text-gray-500">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Recently"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">{post.content}</p>
                  {post.is_announcement && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                      Announcement
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity to show.</p>
              <p className="text-sm">Start by joining clubs or following other students!</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error("Error loading recent activity:", error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your campus community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <p>Unable to load recent activity.</p>
            <p className="text-sm">Please try refreshing the page.</p>
          </div>
        </CardContent>
      </Card>
    )
  }
}
