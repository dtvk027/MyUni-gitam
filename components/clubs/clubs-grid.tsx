import { createClient } from "@/lib/supabase/server"
import { ClubCard } from "./club-card"

interface ClubsGridProps {
  userId: string
}

export async function ClubsGrid({ userId }: ClubsGridProps) {
  const supabase = await createClient()

  const { data: clubs } = await supabase
    .from("clubs")
    .select(`
      *,
      profiles:created_by (
        full_name
      ),
      club_memberships!left (
        user_id
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">All Clubs ({clubs?.length || 0})</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs && clubs.length > 0 ? (
          clubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              currentUserId={userId}
              isMember={club.club_memberships?.some((m: any) => m.user_id === userId)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p>No clubs found. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  )
}
