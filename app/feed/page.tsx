import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FeedHeader } from "@/components/feed/feed-header"
import { CreatePost } from "@/components/feed/create-post"
import { PostsList } from "@/components/feed/posts-list"

export default async function FeedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="min-h-screen bg-gray-50">
      <FeedHeader />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          <CreatePost user={data.user} profile={profile} />
          <PostsList userId={data.user.id} />
        </div>
      </main>
    </div>
  )
}
