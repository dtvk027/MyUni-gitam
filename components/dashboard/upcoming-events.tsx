import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"

export async function UpcomingEvents() {
  const supabase = await createClient()

  // Get upcoming events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events && events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="p-3 rounded-lg border hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                <Badge variant="secondary" className="text-xs">
                  {event.category}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-gray-500 space-x-3">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {format(new Date(event.event_date), "MMM d, h:mm a")}
                </div>
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {event.location}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No upcoming events</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
