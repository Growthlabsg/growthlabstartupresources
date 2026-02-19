'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Calendar, MapPin, Users } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const events = [
  {
    id: '1',
    title: 'Startup Pitch Night',
    description: 'Join us for an evening of startup pitches and networking',
    date: 'Mar 20, 2024',
    location: 'San Francisco, CA',
    type: 'In-Person',
    attendees: 150,
  },
  {
    id: '2',
    title: 'Virtual Startup Workshop',
    description: 'Learn the fundamentals of building a startup',
    date: 'Mar 25, 2024',
    location: 'Online',
    type: 'Virtual',
    attendees: 300,
  },
  {
    id: '3',
    title: 'Founder Meetup',
    description: 'Network with other founders and share experiences',
    date: 'Apr 5, 2024',
    location: 'New York, NY',
    type: 'In-Person',
    attendees: 80,
  },
]

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text">
            Networking Events
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Join networking events and connect with the startup community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <Badge>{event.type}</Badge>
                <span className="text-xs text-gray-500">{event.date}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow">{event.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {event.attendees} attendees
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => showToast(`Registering for ${event.title}...`, 'info')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Register
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

