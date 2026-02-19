'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  Users, Calendar, Users2, Check, MessageCircle, 
  Video, MapPin, Clock, Star, ArrowRight, Sparkles,
  TrendingUp, DollarSign, Code, Shield, Heart,
  Globe, Zap, Award, ChevronRight, ExternalLink,
  Bell, BookOpen, Briefcase, UserPlus
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { platformService, ForumCategory, NetworkingEvent, Mentor } from '@/lib/platform-service'

// Forum Categories with icons
const forumIconMap: Record<string, any> = {
  'DollarSign': DollarSign,
  'Code': Code,
  'TrendingUp': TrendingUp,
  'Shield': Shield,
  'Users': Users,
  'MessageCircle': MessageCircle,
}

const colorMap: Record<string, string> = {
  'green': 'bg-green-100 text-green-600',
  'blue': 'bg-blue-100 text-blue-600',
  'purple': 'bg-purple-100 text-purple-600',
  'orange': 'bg-orange-100 text-orange-600',
  'pink': 'bg-pink-100 text-pink-600',
  'gray': 'bg-gray-100 text-gray-600',
}

export default function CommunityNetworkingSection() {
  const [activeTab, setActiveTab] = useState<'forums' | 'events' | 'mentors'>('forums')
  const [forumCategories, setForumCategories] = useState<ForumCategory[]>([])
  const [events, setEvents] = useState<NetworkingEvent[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [categoriesData, eventsData, mentorsData] = await Promise.all([
        platformService.getForumCategories(),
        platformService.getEvents({ upcoming: true, limit: 6 }),
        platformService.getMentors({ available: true, limit: 6 }),
      ])
      setForumCategories(categoriesData)
      setEvents(eventsData)
      setMentors(mentorsData)
    } catch (error) {
      console.error('Failed to load community data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterEvent = async (eventId: string, eventTitle: string) => {
    try {
      await platformService.registerForEvent(eventId)
      showToast(`Successfully registered for ${eventTitle}!`, 'success')
    } catch (error) {
      showToast('Registration failed. Please try again.', 'error')
    }
  }

  const tabs = [
    { id: 'forums', label: 'Founder Forums', icon: MessageCircle, count: forumCategories.length },
    { id: 'events', label: 'Networking Events', icon: Calendar, count: events.length },
    { id: 'mentors', label: 'Mentor Connect', icon: Users2, count: mentors.length },
  ]

  return (
    <section className="mb-16" id="community">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full mb-3">
            <Users className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium text-indigo-600">Platform Integration</span>
            <Badge variant="new">Live</Badge>
          </div>
          <h2 className="text-3xl font-bold mb-2">Community & Networking</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Connect with 12,000+ founders, mentors, and investors. Access forums, events, and mentorship 
            programs directly from the GrowthLab platform.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link href="/community">
            <Button variant="outline" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              View All Community
            </Button>
          </Link>
          <Link href="/community/join">
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Join Community
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      )}

      {/* Forums Tab */}
      {!loading && activeTab === 'forums' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forumCategories.map((category) => {
              const IconComponent = forumIconMap[category.icon] || MessageCircle
              return (
                <Link key={category.id} href={`/community/forums/${category.id}`}>
                  <Card className="h-full hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${colorMap[category.color] || 'bg-gray-100 text-gray-600'}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {category.postsCount.toLocaleString()} posts
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {category.membersCount.toLocaleString()} members
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Featured Discussions */}
          <Card className="bg-gradient-to-br from-primary-50 to-indigo-50 border-primary-200">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary-500" />
              <h3 className="font-semibold text-gray-900">Trending Discussions</h3>
            </div>
            <div className="space-y-3">
              {[
                { title: 'How we raised $2M seed round in 3 weeks', replies: 67, category: 'Fundraising' },
                { title: 'Best practices for remote team culture', replies: 45, category: 'Team Building' },
                { title: 'Our journey from 0 to 10K users', replies: 89, category: 'Growth' },
              ].map((post, i) => (
                <Link key={i} href={`/community/forums/post/${i}`}>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all group">
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-primary-600">{post.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Badge variant="category">{post.category}</Badge>
                        <span>{post.replies} replies</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Events Tab */}
      {!loading && activeTab === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className={`h-2 ${
                  event.type === 'virtual' ? 'bg-blue-500' : 
                  event.type === 'in-person' ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={event.type === 'virtual' ? 'info' : event.type === 'in-person' ? 'success' : 'popular'}>
                      {event.type === 'virtual' ? <Video className="h-3 w-3 mr-1" /> : <MapPin className="h-3 w-3 mr-1" />}
                      {event.type}
                    </Badge>
                    <Badge variant="category">{event.category}</Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{event.time} {event.timezone} · {event.duration}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{event.attendees}{event.maxAttendees ? `/${event.maxAttendees}` : ''} attending</span>
                    </div>
                    <span className={`font-semibold ${event.price === 'free' ? 'text-green-600' : 'text-gray-900'}`}>
                      {event.price === 'free' ? 'Free' : `$${event.price}`}
                    </span>
                  </div>

                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleRegisterEvent(event.id, event.title)}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Register Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* View All Events */}
          <div className="text-center">
            <Link href="/events">
              <Button variant="outline" size="lg">
                View All Events
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Mentors Tab */}
      {!loading && activeTab === 'mentors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    {mentor.user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{mentor.user.name}</h3>
                    <p className="text-sm text-gray-600">{mentor.experience} experience</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-900">{mentor.rating}</span>
                      <span className="text-sm text-gray-500">({mentor.reviewsCount} reviews)</span>
                    </div>
                  </div>
                  <Badge variant={mentor.availability === 'available' ? 'success' : 'warning'}>
                    {mentor.availability}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{mentor.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise.slice(0, 3).map((skill, i) => (
                    <Badge key={i} variant="category" className="text-xs">{skill}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {mentor.sessionsCompleted} sessions
                  </span>
                  <span className="font-semibold text-gray-900">
                    {mentor.hourlyRate === 'free' ? 'Free' : `$${mentor.hourlyRate}/hr`}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/mentor-connect/${mentor.id}`} className="flex-1">
                    <Button className="w-full" size="sm">
                      <Users2 className="h-4 w-4 mr-2" />
                      Book Session
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => window.open(mentor.linkedIn, '_blank')}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Become a Mentor CTA */}
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-2">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-xl">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Become a Mentor</h3>
                  <p className="text-white/80">Share your expertise and help the next generation of founders</p>
                </div>
              </div>
              <Link href="/mentor-connect/apply">
                <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                  Apply Now
                </button>
              </Link>
            </div>
          </Card>
        </div>
      )}

    </section>
  )
}
