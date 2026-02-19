'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Users, Calendar, MessageSquare, Star } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const mentors = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Serial Entrepreneur',
    expertise: ['SaaS', 'B2B', 'Fundraising'],
    experience: '10+ years',
    rating: 4.9,
    sessions: 150,
    image: '👩‍💼',
  },
  {
    id: '2',
    name: 'Michael Johnson',
    title: 'Tech Startup Advisor',
    expertise: ['Product Development', 'Engineering', 'Scaling'],
    experience: '15+ years',
    rating: 4.8,
    sessions: 200,
    image: '👨‍💻',
  },
  {
    id: '3',
    name: 'Emily Davis',
    title: 'Growth & Marketing Expert',
    expertise: ['Marketing', 'Growth Hacking', 'Branding'],
    experience: '12+ years',
    rating: 4.9,
    sessions: 180,
    image: '👩‍🎨',
  },
]

export default function MentorshipPage() {
  const handleBookSession = (mentorId: string, mentorName: string) => {
    showToast(`Booking session with ${mentorName}...`, 'info')
    setTimeout(() => {
      showToast(`Session request sent to ${mentorName}!`, 'success')
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text">
            Mentor Connect
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl">
            Connect with experienced mentors and advisors who can guide your startup journey. Get personalized advice, feedback, and support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="flex flex-col">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{mentor.image}</div>
                <h3 className="text-xl font-bold mb-1">{mentor.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{mentor.title}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold">{mentor.rating}</span>
                  <span className="text-sm text-gray-500">({mentor.sessions} sessions)</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Expertise:</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-6">
                <span className="font-medium">Experience:</span> {mentor.experience}
              </div>
              <Button
                className="w-full"
                onClick={() => handleBookSession(mentor.id, mentor.name)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Session
              </Button>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <MessageSquare className="h-8 w-8 text-primary-500 mb-4" />
            <h3 className="font-semibold mb-2">1-on-1 Sessions</h3>
            <p className="text-sm text-gray-600">
              Schedule personalized mentoring sessions tailored to your needs
            </p>
          </Card>
          <Card>
            <Users className="h-8 w-8 text-primary-500 mb-4" />
            <h3 className="font-semibold mb-2">Industry Experts</h3>
            <p className="text-sm text-gray-600">
              Connect with mentors who have deep expertise in your industry
            </p>
          </Card>
          <Card>
            <Calendar className="h-8 w-8 text-primary-500 mb-4" />
            <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
            <p className="text-sm text-gray-600">
              Book sessions at times that work for you
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}

