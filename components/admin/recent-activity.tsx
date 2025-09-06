import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"

export async function RecentActivity() {
  const supabase = await createClient()

  // Get recent activity across the platform
  const { data: recentPosts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (
        full_name,
        role
      )
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Platform Activity</CardTitle>
        <CardDescription>Latest posts and updates from users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentPosts && recentPosts.length > 0 ? (
          recentPosts.map((post) => (
            <div key={post.id} className="flex items-start justify-between p-3 rounded-lg border hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-900">{post.profiles?.full_name || "Anonymous"}</p>
                  <Badge variant="secondary" className="text-xs">
                    {post.profiles?.role || "student"}
                  </Badge>
                  {post.is_announcement && <Badge className="text-xs bg-blue-100 text-blue-800">Announcement</Badge>}
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{post.content}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                  <span>{post.likes_count || 0} likes</span>
                  <span>{post.comments_count || 0} comments</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to show.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
