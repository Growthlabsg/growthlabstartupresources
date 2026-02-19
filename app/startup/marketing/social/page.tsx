'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Share2, Users, Target, TrendingUp, CheckCircle, XCircle, Plus, Edit, Trash2,
  Download, Calendar, Heart, MessageCircle, Eye, Clock, BarChart3, Instagram,
  Twitter, Linkedin, Facebook, Youtube, Hash, Image, Video, FileText, Sparkles
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

type Platform = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'youtube' | 'tiktok'
type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'
type ContentType = 'text' | 'image' | 'video' | 'carousel' | 'story' | 'reel'

interface SocialPost {
  id: string
  content: string
  platforms: Platform[]
  contentType: ContentType
  status: PostStatus
  scheduledDate?: string
  publishedDate?: string
  hashtags: string[]
  metrics: { likes: number; comments: number; shares: number; views: number; engagement: number }
  created: string
}

interface ContentIdea {
  id: string
  title: string
  description: string
  platforms: Platform[]
  contentType: ContentType
  priority: 'high' | 'medium' | 'low'
  status: 'idea' | 'approved' | 'in-progress' | 'done'
  created: string
}

const platformLabels: Record<Platform, string> = {
  'twitter': 'Twitter/X', 'instagram': 'Instagram', 'linkedin': 'LinkedIn',
  'facebook': 'Facebook', 'youtube': 'YouTube', 'tiktok': 'TikTok'
}

const platformColors: Record<Platform, string> = {
  'twitter': '#1DA1F2', 'instagram': '#E4405F', 'linkedin': '#0077B5',
  'facebook': '#1877F2', 'youtube': '#FF0000', 'tiktok': '#000000'
}

const platformIcons: Record<Platform, typeof Twitter> = {
  'twitter': Twitter, 'instagram': Instagram, 'linkedin': Linkedin,
  'facebook': Facebook, 'youtube': Youtube, 'tiktok': Share2
}

const contentTypeLabels: Record<ContentType, string> = {
  'text': 'Text', 'image': 'Image', 'video': 'Video',
  'carousel': 'Carousel', 'story': 'Story', 'reel': 'Reel'
}

const statusColors: Record<PostStatus, string> = {
  'draft': 'bg-gray-100 text-gray-800', 'scheduled': 'bg-blue-100 text-blue-800',
  'published': 'bg-green-100 text-green-800', 'failed': 'bg-red-100 text-red-800'
}

const defaultIdeas: ContentIdea[] = [
  { id: '1', title: 'Product Launch Announcement', description: 'Share new feature release with demo video', platforms: ['twitter', 'linkedin'], contentType: 'video', priority: 'high', status: 'idea', created: new Date().toISOString() },
  { id: '2', title: 'Customer Success Story', description: 'Interview with happy customer', platforms: ['instagram', 'linkedin'], contentType: 'carousel', priority: 'medium', status: 'idea', created: new Date().toISOString() },
  { id: '3', title: 'Behind the Scenes', description: 'Show team working on new features', platforms: ['instagram', 'tiktok'], contentType: 'reel', priority: 'low', status: 'idea', created: new Date().toISOString() },
]

export default function SocialMediaPlannerPage() {
  const [activeTab, setActiveTab] = useState('calendar')
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [ideas, setIdeas] = useState<ContentIdea[]>(defaultIdeas)
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null)
  const [postForm, setPostForm] = useState({
    content: '', platforms: [] as Platform[], contentType: 'text' as ContentType,
    scheduledDate: '', hashtags: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'ideas', label: 'Content Ideas', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('socialMediaPlannerData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.posts) setPosts(data.posts)
          if (data.ideas) setIdeas(data.ideas.length > 0 ? data.ideas : defaultIdeas)
        } catch (e) { console.error('Error loading data:', e) }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    localStorage.setItem('socialMediaPlannerData', JSON.stringify({ posts, ideas, lastSaved: new Date().toISOString() }))
    showToast('Data saved!', 'success')
  }

  const addPost = () => {
    if (!postForm.content || postForm.platforms.length === 0) {
      showToast('Please add content and select platforms', 'error')
      return
    }
    const newPost: SocialPost = {
      id: Date.now().toString(), content: postForm.content, platforms: postForm.platforms,
      contentType: postForm.contentType, status: postForm.scheduledDate ? 'scheduled' : 'draft',
      scheduledDate: postForm.scheduledDate || undefined,
      hashtags: postForm.hashtags.split(' ').filter(h => h.startsWith('#')),
      metrics: { likes: 0, comments: 0, shares: 0, views: 0, engagement: 0 },
      created: new Date().toISOString()
    }
    setPosts([...posts, newPost])
    setEditingPost(null)
    setPostForm({ content: '', platforms: [], contentType: 'text', scheduledDate: '', hashtags: '' })
    saveToLocalStorage()
    showToast('Post created!', 'success')
  }

  const publishPost = (id: string) => {
    const updated = posts.map(p => {
      if (p.id === id) {
        const likes = Math.floor(Math.random() * 500) + 50
        const comments = Math.floor(Math.random() * 50) + 5
        const shares = Math.floor(Math.random() * 100) + 10
        const views = Math.floor(Math.random() * 5000) + 500
        return {
          ...p, status: 'published' as PostStatus, publishedDate: new Date().toISOString(),
          metrics: { likes, comments, shares, views, engagement: ((likes + comments + shares) / views) * 100 }
        }
      }
      return p
    })
    setPosts(updated)
    saveToLocalStorage()
    showToast('Post published!', 'success')
  }

  const deletePost = (id: string) => {
    if (confirm('Delete this post?')) {
      setPosts(posts.filter(p => p.id !== id))
      saveToLocalStorage()
      showToast('Post deleted', 'info')
    }
  }

  const togglePlatform = (platform: Platform) => {
    const platforms = postForm.platforms.includes(platform)
      ? postForm.platforms.filter(p => p !== platform)
      : [...postForm.platforms, platform]
    setPostForm({ ...postForm, platforms })
  }

  const updateIdeaStatus = (id: string, status: ContentIdea['status']) => {
    setIdeas(ideas.map(i => i.id === id ? { ...i, status } : i))
    saveToLocalStorage()
  }

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = filterPlatform === 'all' || p.platforms.includes(filterPlatform as Platform)
    return matchesSearch && matchesPlatform
  })

  const publishedPosts = posts.filter(p => p.status === 'published')
  const totalEngagement = publishedPosts.reduce((sum, p) => sum + p.metrics.likes + p.metrics.comments + p.metrics.shares, 0)
  const totalViews = publishedPosts.reduce((sum, p) => sum + p.metrics.views, 0)
  const avgEngagement = publishedPosts.length > 0 ? publishedPosts.reduce((sum, p) => sum + p.metrics.engagement, 0) / publishedPosts.length : 0

  const platformData = Object.entries(platformLabels).map(([platform]) => ({
    name: platformLabels[platform as Platform],
    posts: posts.filter(p => p.platforms.includes(platform as Platform)).length,
    engagement: publishedPosts.filter(p => p.platforms.includes(platform as Platform))
      .reduce((sum, p) => sum + p.metrics.likes + p.metrics.comments, 0)
  }))

  const COLORS = ['#1DA1F2', '#E4405F', '#0077B5', '#1877F2', '#FF0000', '#000000']

  const generateCalendarDays = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const days: Date[] = []
    const startPadding = firstDay.getDay()
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(firstDay)
      d.setDate(d.getDate() - i - 1)
      days.push(d)
    }
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(today.getFullYear(), today.getMonth(), i))
    const endPadding = 42 - days.length
    for (let i = 1; i <= endPadding; i++) days.push(new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, i))
    return days
  }

  const getPostsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return posts.filter(p => p.scheduledDate?.split('T')[0] === dateStr || p.publishedDate?.split('T')[0] === dateStr)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Share2 className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Social Media Planner
              </span>
            </h1>
            <Share2 className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plan, schedule, and analyze your social media content across all platforms
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={saveToLocalStorage}>
                <Download className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Content Calendar</h2>
                <Button onClick={() => setEditingPost({ id: '', content: '', platforms: [], contentType: 'text', status: 'draft', hashtags: [], metrics: { likes: 0, comments: 0, shares: 0, views: 0, engagement: 0 }, created: new Date().toISOString() })} size="sm">
                  <Plus className="h-4 w-4 mr-2" /> New Post
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">{day}</div>
                ))}
                {generateCalendarDays().map((date, idx) => {
                  const dayPosts = getPostsForDate(date)
                  const isCurrentMonth = date.getMonth() === new Date().getMonth()
                  const isToday = date.toDateString() === new Date().toDateString()
                  return (
                    <div key={idx} className={`min-h-[80px] p-1 border rounded-lg ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${isToday ? 'border-primary-500 border-2' : 'border-gray-200'}`}>
                      <div className={`text-xs font-medium mb-1 ${isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>{date.getDate()}</div>
                      <div className="space-y-1">
                        {dayPosts.slice(0, 2).map(post => (
                          <div key={post.id} className="flex gap-0.5">
                            {post.platforms.slice(0, 2).map(p => {
                              const Icon = platformIcons[p]
                              return <Icon key={p} className="h-3 w-3" style={{ color: platformColors[p] }} />
                            })}
                          </div>
                        ))}
                        {dayPosts.length > 2 && <div className="text-xs text-gray-500">+{dayPosts.length - 2}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {editingPost && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create Post</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingPost(null)}><XCircle className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platforms *</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(platformLabels).map(([platform, label]) => {
                        const Icon = platformIcons[platform as Platform]
                        return (
                          <button key={platform} className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 ${postForm.platforms.includes(platform as Platform) ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
                            onClick={() => togglePlatform(platform as Platform)}>
                            <Icon className="h-4 w-4" style={{ color: platformColors[platform as Platform] }} />
                            <span className="text-sm">{label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                    <textarea className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none" rows={4}
                      value={postForm.content} onChange={(e) => setPostForm({ ...postForm, content: e.target.value })} placeholder="What do you want to share?" />
                    <div className="text-xs text-gray-500 mt-1">{postForm.content.length}/280 characters</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                      <Select value={postForm.contentType} onChange={(e) => setPostForm({ ...postForm, contentType: e.target.value as ContentType })}
                        options={Object.entries(contentTypeLabels).map(([value, label]) => ({ value, label }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule (optional)</label>
                      <Input type="datetime-local" value={postForm.scheduledDate} onChange={(e) => setPostForm({ ...postForm, scheduledDate: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                    <Input value={postForm.hashtags} onChange={(e) => setPostForm({ ...postForm, hashtags: e.target.value })} placeholder="#startup #marketing #growth" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addPost} className="flex-1">Create Post</Button>
                    <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">All Posts</h2>
                <div className="flex gap-2">
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search posts..." className="w-48" />
                  <Select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}
                    options={[{ value: 'all', label: 'All Platforms' }, ...Object.entries(platformLabels).map(([value, label]) => ({ value, label }))]} />
                </div>
              </div>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Share2 className="h-16 w-16 mx-auto mb-4" />
                  <p>No posts found. Create your first post.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map(post => (
                    <Card key={post.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {post.platforms.map(p => {
                              const Icon = platformIcons[p]
                              return <Icon key={p} className="h-5 w-5" style={{ color: platformColors[p] }} />
                            })}
                            <Badge className={statusColors[post.status]}>{post.status}</Badge>
                            <Badge variant="outline" className="text-xs">{contentTypeLabels[post.contentType]}</Badge>
                          </div>
                          <p className="text-gray-700 mb-2">{post.content}</p>
                          {post.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {post.hashtags.map((h, i) => <Badge key={i} variant="outline" className="text-xs text-blue-600">{h}</Badge>)}
                            </div>
                          )}
                          {post.status === 'published' && (
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {post.metrics.likes}</span>
                              <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {post.metrics.comments}</span>
                              <span className="flex items-center gap-1"><Share2 className="h-4 w-4" /> {post.metrics.shares}</span>
                              <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {post.metrics.views}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {post.status === 'draft' && <Button variant="ghost" size="sm" onClick={() => publishPost(post.id)}><CheckCircle className="h-4 w-4" /></Button>}
                          <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Ideas Tab */}
        {activeTab === 'ideas' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Content Ideas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ideas.map(idea => (
                  <Card key={idea.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{idea.title}</h4>
                      <Badge className={idea.priority === 'high' ? 'bg-red-100 text-red-800' : idea.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                        {idea.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
                    <div className="flex gap-1 mb-3">
                      {idea.platforms.map(p => {
                        const Icon = platformIcons[p]
                        return <Icon key={p} className="h-4 w-4" style={{ color: platformColors[p] }} />
                      })}
                    </div>
                    <Select value={idea.status} onChange={(e) => updateIdeaStatus(idea.id, e.target.value as ContentIdea['status'])}
                      options={[{ value: 'idea', label: 'Idea' }, { value: 'approved', label: 'Approved' }, { value: 'in-progress', label: 'In Progress' }, { value: 'done', label: 'Done' }]} className="text-xs" />
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2"><FileText className="h-5 w-5 text-blue-500" /><div className="text-sm text-gray-600">Total Posts</div></div>
                <div className="text-2xl font-bold">{posts.length}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2"><Eye className="h-5 w-5 text-purple-500" /><div className="text-sm text-gray-600">Total Views</div></div>
                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2"><Heart className="h-5 w-5 text-red-500" /><div className="text-sm text-gray-600">Total Engagement</div></div>
                <div className="text-2xl font-bold">{totalEngagement.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-5 w-5 text-green-500" /><div className="text-sm text-gray-600">Avg Engagement</div></div>
                <div className="text-2xl font-bold text-green-600">{avgEngagement.toFixed(1)}%</div>
              </Card>
            </div>
            {platformData.some(d => d.posts > 0) && (
              <Card>
                <h3 className="font-semibold mb-4">Posts by Platform</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={10} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="posts" fill="#3b82f6" name="Posts" />
                    <Bar dataKey="engagement" fill="#10b981" name="Engagement" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

