import { createClient } from "@/lib/supabase/server"
import { PostCard } from "./post-card"

interface PostsListProps {
  userId: string
}

export async function PostsList({ userId }: PostsListProps) {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (
        full_name,
        avatar_url,
        department,
        role
      ),
      post_likes!left (
        user_id
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-4">
      {posts && posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} currentUserId={userId} />)
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  )
}
