'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import Link from 'next/link'
import { 
  Video, Mic, Award, Play, Clock, Star, Heart, ExternalLink, ArrowLeft,
  Users, TrendingUp, BookOpen, CheckCircle, PlayCircle, Headphones,
  Calendar, Globe, Filter, Search
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

type ContentType = 'video' | 'podcast' | 'course' | 'webinar'
type TopicCategory = 'fundraising' | 'product' | 'growth' | 'leadership' | 'marketing' | 'tech' | 'sales' | 'operations'

interface LearningContent {
  id: string
  title: string
  description: string
  type: ContentType
  category: TopicCategory
  source: string
  author: string
  duration: string
  rating: number
  views: number
  url: string
  thumbnail: string
  featured: boolean
  free: boolean
  tags: string[]
  published: string
}

const typeInfo: Record<ContentType, { label: string; icon: typeof Video; color: string }> = {
  'video': { label: 'Video', icon: Video, color: 'text-red-600' },
  'podcast': { label: 'Podcast', icon: Mic, color: 'text-purple-600' },
  'course': { label: 'Course', icon: Award, color: 'text-blue-600' },
  'webinar': { label: 'Webinar', icon: Globe, color: 'text-green-600' },
}

const categoryInfo: Record<TopicCategory, { label: string; color: string }> = {
  'fundraising': { label: 'Fundraising', color: 'bg-green-100 text-green-800' },
  'product': { label: 'Product', color: 'bg-blue-100 text-blue-800' },
  'growth': { label: 'Growth', color: 'bg-orange-100 text-orange-800' },
  'leadership': { label: 'Leadership', color: 'bg-purple-100 text-purple-800' },
  'marketing': { label: 'Marketing', color: 'bg-pink-100 text-pink-800' },
  'tech': { label: 'Technology', color: 'bg-cyan-100 text-cyan-800' },
  'sales': { label: 'Sales', color: 'bg-amber-100 text-amber-800' },
  'operations': { label: 'Operations', color: 'bg-gray-100 text-gray-800' },
}

const content: LearningContent[] = [
  // Videos
  { id: 'v1', title: 'How to Pitch Your Startup', description: 'Y Combinator partner explains how to deliver a compelling 3-minute pitch that captures investor attention.', type: 'video', category: 'fundraising', source: 'Y Combinator', author: 'Michael Seibel', duration: '15 min', rating: 4.9, views: 850000, url: 'https://youtube.com', thumbnail: 'YC', featured: true, free: true, tags: ['pitch', 'investors', 'YC'], published: '2024-01-15' },
  { id: 'v2', title: 'Finding Product-Market Fit', description: 'A deep dive into how successful startups identified and achieved product-market fit.', type: 'video', category: 'product', source: 'a16z', author: 'Marc Andreessen', duration: '45 min', rating: 4.8, views: 420000, url: 'https://youtube.com', thumbnail: 'A16Z', featured: true, free: true, tags: ['PMF', 'product', 'validation'], published: '2024-02-01' },
  { id: 'v3', title: 'Building a Sales Machine', description: 'How to build and scale a B2B sales team from zero to your first 100 customers.', type: 'video', category: 'sales', source: 'First Round', author: 'Aaron Ross', duration: '38 min', rating: 4.7, views: 185000, url: 'https://youtube.com', thumbnail: 'FR', featured: false, free: true, tags: ['sales', 'B2B', 'scaling'], published: '2024-02-15' },
  { id: 'v4', title: 'Startup Metrics That Matter', description: 'Understanding the key metrics VCs look at when evaluating startups.', type: 'video', category: 'fundraising', source: 'Sequoia', author: 'Roelof Botha', duration: '28 min', rating: 4.8, views: 320000, url: 'https://youtube.com', thumbnail: 'SQ', featured: false, free: true, tags: ['metrics', 'KPIs', 'fundraising'], published: '2024-01-20' },
  { id: 'v5', title: 'Technical Hiring for Non-Technical Founders', description: 'How to evaluate and hire great engineers when you are not technical yourself.', type: 'video', category: 'tech', source: 'TechCrunch', author: 'Various', duration: '52 min', rating: 4.5, views: 95000, url: 'https://youtube.com', thumbnail: 'TC', featured: false, free: true, tags: ['hiring', 'engineering', 'team'], published: '2024-03-01' },
  
  // Podcasts
  { id: 'p1', title: 'How I Built This', description: 'Stories behind the people who created some of the world\'s best known companies.', type: 'podcast', category: 'leadership', source: 'NPR', author: 'Guy Raz', duration: 'Weekly • 45-60 min', rating: 4.9, views: 2500000, url: 'https://npr.org', thumbnail: 'HIBT', featured: true, free: true, tags: ['founders', 'stories', 'inspiration'], published: '2024-01-01' },
  { id: 'p2', title: 'The Twenty Minute VC', description: 'Interviews with the world\'s leading VCs and founders in just 20 minutes.', type: 'podcast', category: 'fundraising', source: '20VC', author: 'Harry Stebbings', duration: 'Daily • 20 min', rating: 4.7, views: 1800000, url: 'https://20vc.com', thumbnail: '20VC', featured: true, free: true, tags: ['VC', 'investing', 'founders'], published: '2024-01-01' },
  { id: 'p3', title: 'Masters of Scale', description: 'Reid Hoffman shares lessons and wisdom from his own experience and legendary entrepreneurs.', type: 'podcast', category: 'growth', source: 'WaitWhat', author: 'Reid Hoffman', duration: 'Weekly • 35 min', rating: 4.8, views: 1200000, url: 'https://mastersofscale.com', thumbnail: 'MOS', featured: false, free: true, tags: ['scaling', 'growth', 'wisdom'], published: '2024-01-01' },
  { id: 'p4', title: 'Lenny\'s Podcast', description: 'Interviews with product leaders on building and scaling world-class products.', type: 'podcast', category: 'product', source: 'Lenny', author: 'Lenny Rachitsky', duration: 'Weekly • 60 min', rating: 4.9, views: 850000, url: 'https://lennyspodcast.com', thumbnail: 'LP', featured: true, free: true, tags: ['product', 'PM', 'careers'], published: '2024-01-01' },
  { id: 'p5', title: 'The SaaS Podcast', description: 'Actionable advice for SaaS founders on building and growing their businesses.', type: 'podcast', category: 'growth', source: 'Omer Khan', author: 'Omer Khan', duration: 'Weekly • 45 min', rating: 4.6, views: 350000, url: 'https://saasclub.io', thumbnail: 'SP', featured: false, free: true, tags: ['SaaS', 'growth', 'founders'], published: '2024-01-01' },
  { id: 'p6', title: 'First Round Review Podcast', description: 'Conversations with the tactical leaders behind today\'s fastest-growing companies.', type: 'podcast', category: 'operations', source: 'First Round', author: 'First Round', duration: 'Bi-weekly • 40 min', rating: 4.7, views: 420000, url: 'https://firstround.com', thumbnail: 'FRR', featured: false, free: true, tags: ['tactics', 'operations', 'scaling'], published: '2024-01-01' },
  
  // Courses
  { id: 'c1', title: 'Startup School', description: 'Free online program to help founders build and launch their startups with YC curriculum.', type: 'course', category: 'product', source: 'Y Combinator', author: 'YC Partners', duration: '10 weeks', rating: 4.9, views: 500000, url: 'https://startupschool.org', thumbnail: 'SS', featured: true, free: true, tags: ['YC', 'fundamentals', 'startup'], published: '2024-01-01' },
  { id: 'c2', title: 'Growth Marketing Course', description: 'Comprehensive course on growth marketing strategies used by top startups.', type: 'course', category: 'marketing', source: 'Reforge', author: 'Brian Balfour', duration: '8 weeks', rating: 4.8, views: 125000, url: 'https://reforge.com', thumbnail: 'RF', featured: true, free: false, tags: ['growth', 'marketing', 'acquisition'], published: '2024-02-01' },
  { id: 'c3', title: 'Product Management Fundamentals', description: 'Learn the core skills every product manager needs to build great products.', type: 'course', category: 'product', source: 'Product School', author: 'Various PMs', duration: '6 weeks', rating: 4.7, views: 180000, url: 'https://productschool.com', thumbnail: 'PS', featured: false, free: false, tags: ['PM', 'product', 'skills'], published: '2024-01-15' },
  { id: 'c4', title: 'Financial Modeling for Startups', description: 'Build professional financial models and projections for fundraising.', type: 'course', category: 'fundraising', source: 'Wall Street Prep', author: 'Finance Experts', duration: '4 weeks', rating: 4.6, views: 85000, url: 'https://wallstreetprep.com', thumbnail: 'WSP', featured: false, free: false, tags: ['finance', 'modeling', 'fundraising'], published: '2024-02-15' },
  
  // Webinars
  { id: 'w1', title: 'State of Startups 2024', description: 'Annual analysis of startup trends, funding, and market conditions.', type: 'webinar', category: 'fundraising', source: 'First Round', author: 'First Round Team', duration: '90 min', rating: 4.7, views: 45000, url: 'https://firstround.com', thumbnail: 'SOS', featured: false, free: true, tags: ['trends', 'data', '2024'], published: '2024-03-01' },
  { id: 'w2', title: 'AI for Startups', description: 'How startups can leverage AI to build competitive advantages.', type: 'webinar', category: 'tech', source: 'a16z', author: 'AI Team', duration: '60 min', rating: 4.8, views: 78000, url: 'https://a16z.com', thumbnail: 'AI', featured: true, free: true, tags: ['AI', 'technology', 'innovation'], published: '2024-03-10' },
]

export default function LearningHubPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [savedContent, setSavedContent] = useState<string[]>([])
  const [watchedContent, setWatchedContent] = useState<string[]>([])

  const tabs = [
    { id: 'all', label: 'All Content', icon: PlayCircle },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'podcasts', label: 'Podcasts', icon: Headphones },
    { id: 'courses', label: 'Courses', icon: Award },
    { id: 'saved', label: 'Saved', icon: Heart },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('savedLearning')
    const watched = localStorage.getItem('watchedLearning')
    if (saved) setSavedContent(JSON.parse(saved))
    if (watched) setWatchedContent(JSON.parse(watched))
  }, [])

  const toggleSave = (id: string) => {
    const updated = savedContent.includes(id) ? savedContent.filter(c => c !== id) : [...savedContent, id]
    setSavedContent(updated)
    localStorage.setItem('savedLearning', JSON.stringify(updated))
    showToast(savedContent.includes(id) ? 'Removed' : 'Saved!', 'success')
  }

  const toggleWatched = (id: string) => {
    const updated = watchedContent.includes(id) ? watchedContent.filter(c => c !== id) : [...watchedContent, id]
    setWatchedContent(updated)
    localStorage.setItem('watchedLearning', JSON.stringify(updated))
  }

  const filteredContent = content.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || c.type === filterType
    const matchesCategory = filterCategory === 'all' || c.category === filterCategory
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'videos' && c.type === 'video') ||
      (activeTab === 'podcasts' && c.type === 'podcast') ||
      (activeTab === 'courses' && (c.type === 'course' || c.type === 'webinar')) ||
      (activeTab === 'saved' && savedContent.includes(c.id))
    return matchesSearch && matchesType && matchesCategory && matchesTab
  })

  const featuredContent = content.filter(c => c.featured)

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/startup/resources" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Resources
        </Link>

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PlayCircle className="h-10 w-10 text-red-600" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Learning Hub
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Videos, podcasts, courses, and webinars from the world's best startup educators
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ type: 'video', label: 'Videos', icon: Video, count: content.filter(c => c.type === 'video').length },
            { type: 'podcast', label: 'Podcasts', icon: Mic, count: content.filter(c => c.type === 'podcast').length },
            { type: 'course', label: 'Courses', icon: Award, count: content.filter(c => c.type === 'course').length },
            { type: 'webinar', label: 'Webinars', icon: Globe, count: content.filter(c => c.type === 'webinar').length }].map(item => (
            <Card key={item.type} className="p-4 text-center cursor-pointer hover:shadow-md transition-all" onClick={() => setFilterType(item.type)}>
              <item.icon className={`h-6 w-6 mx-auto mb-2 ${typeInfo[item.type as ContentType].color}`} />
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </Card>
          ))}
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search content..." className="w-64" />
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            options={[{ value: 'all', label: 'All Types' }, ...Object.entries(typeInfo).map(([k, v]) => ({ value: k, label: v.label }))]} />
          <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            options={[{ value: 'all', label: 'All Topics' }, ...Object.entries(categoryInfo).map(([k, v]) => ({ value: k, label: v.label }))]} />
        </div>

        {activeTab === 'all' && featuredContent.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Star className="h-5 w-5 text-yellow-500" /> Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredContent.slice(0, 3).map(item => {
                const TypeIcon = typeInfo[item.type].icon
                return (
                  <Card key={item.id} className="overflow-hidden border-2 border-yellow-200">
                    <div className={`h-24 bg-gradient-to-br from-${item.type === 'video' ? 'red' : item.type === 'podcast' ? 'purple' : 'blue'}-500 to-${item.type === 'video' ? 'pink' : item.type === 'podcast' ? 'indigo' : 'cyan'}-600 flex items-center justify-center`}>
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <TypeIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="featured">Featured</Badge>
                        <Badge variant="outline">{item.source}</Badge>
                      </div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map(item => {
            const TypeIcon = typeInfo[item.type].icon
            return (
              <Card key={item.id} className="p-4 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${item.type === 'video' ? 'bg-red-100' : item.type === 'podcast' ? 'bg-purple-100' : item.type === 'course' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      <TypeIcon className={`h-5 w-5 ${typeInfo[item.type].color}`} />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-xs">{typeInfo[item.type].label}</Badge>
                    </div>
                  </div>
                  <button onClick={() => toggleSave(item.id)} className="text-gray-400 hover:text-red-500">
                    {savedContent.includes(item.id) ? <Heart className="h-5 w-5 fill-current text-red-500" /> : <Heart className="h-5 w-5" />}
                  </button>
                </div>

                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.source} • {item.author}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge className={categoryInfo[item.category].color}>{categoryInfo[item.category].label}</Badge>
                  {item.free && <Badge variant="new">Free</Badge>}
                  {watchedContent.includes(item.id) && <Badge variant="outline"><CheckCircle className="h-3 w-3 mr-1" /> Watched</Badge>}
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500 fill-current" /> {item.rating}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {(item.views / 1000).toFixed(0)}K</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {item.duration}</span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => { toggleWatched(item.id); window.open(item.url, '_blank') }}>
                    <Play className="h-4 w-4 mr-1" /> {item.type === 'podcast' ? 'Listen' : 'Watch'}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <PlayCircle className="h-16 w-16 mx-auto mb-4" />
            <p>No content found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  )
}

