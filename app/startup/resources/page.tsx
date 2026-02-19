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
  BookOpen, Download, FileText, Video, Headphones, ExternalLink, Star,
  Heart, Search, Filter, Bookmark, Share2, Clock, Users, TrendingUp,
  Award, Zap, CheckCircle, ArrowRight, Play, Mic, Book, Globe,
  DollarSign, Lightbulb, Target, Rocket, Code, BarChart3, Calendar
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

type ResourceType = 'template' | 'ebook' | 'video' | 'podcast' | 'article' | 'tool' | 'course'
type ResourceCategory = 'fundraising' | 'marketing' | 'product' | 'legal' | 'finance' | 'growth' | 'leadership' | 'tech'

interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  category: ResourceCategory
  author?: string
  duration?: string
  format?: string
  downloadUrl?: string
  externalUrl?: string
  rating: number
  downloads: number
  featured: boolean
  new: boolean
  tags: string[]
  created: string
}

const typeInfo: Record<ResourceType, { label: string; icon: typeof FileText; color: string }> = {
  'template': { label: 'Template', icon: FileText, color: 'text-blue-600' },
  'ebook': { label: 'E-Book', icon: Book, color: 'text-green-600' },
  'video': { label: 'Video', icon: Video, color: 'text-red-600' },
  'podcast': { label: 'Podcast', icon: Mic, color: 'text-purple-600' },
  'article': { label: 'Article', icon: BookOpen, color: 'text-orange-600' },
  'tool': { label: 'Tool', icon: Zap, color: 'text-cyan-600' },
  'course': { label: 'Course', icon: Award, color: 'text-pink-600' },
}

const categoryInfo: Record<ResourceCategory, { label: string; icon: typeof DollarSign }> = {
  'fundraising': { label: 'Fundraising', icon: DollarSign },
  'marketing': { label: 'Marketing', icon: Target },
  'product': { label: 'Product', icon: Lightbulb },
  'legal': { label: 'Legal', icon: FileText },
  'finance': { label: 'Finance', icon: BarChart3 },
  'growth': { label: 'Growth', icon: TrendingUp },
  'leadership': { label: 'Leadership', icon: Users },
  'tech': { label: 'Technology', icon: Code },
}

const resources: Resource[] = [
  // Templates
  { id: 't1', title: 'Pitch Deck Template', description: 'Professional 12-slide pitch deck template used by YC startups to raise millions.', type: 'template', category: 'fundraising', format: 'PowerPoint/Google Slides', rating: 4.9, downloads: 15420, featured: true, new: false, tags: ['pitch', 'investors', 'fundraising'], created: '2024-01-15' },
  { id: 't2', title: 'Financial Model Template', description: '5-year financial projection model with revenue forecasting, burn rate, and runway analysis.', type: 'template', category: 'finance', format: 'Excel/Google Sheets', rating: 4.8, downloads: 12350, featured: true, new: false, tags: ['finance', 'projections', 'planning'], created: '2024-02-01' },
  { id: 't3', title: 'Business Plan Template', description: 'Comprehensive business plan template with market analysis and go-to-market strategy sections.', type: 'template', category: 'product', format: 'Word/Google Docs', rating: 4.7, downloads: 9870, featured: false, new: false, tags: ['business plan', 'strategy'], created: '2024-01-20' },
  { id: 't4', title: 'Cap Table Template', description: 'Equity management spreadsheet for tracking ownership, dilution, and option pools.', type: 'template', category: 'fundraising', format: 'Excel/Google Sheets', rating: 4.8, downloads: 7650, featured: false, new: true, tags: ['equity', 'cap table', 'ownership'], created: '2024-03-01' },
  { id: 't5', title: 'OKR Planning Template', description: 'Objectives and Key Results framework template for quarterly goal setting.', type: 'template', category: 'leadership', format: 'Notion/Google Docs', rating: 4.6, downloads: 5430, featured: false, new: true, tags: ['OKRs', 'goals', 'planning'], created: '2024-03-10' },
  { id: 't6', title: 'Marketing Strategy Template', description: 'Complete marketing plan template with channel strategy and budget allocation.', type: 'template', category: 'marketing', format: 'PowerPoint/Google Slides', rating: 4.5, downloads: 6780, featured: false, new: false, tags: ['marketing', 'strategy', 'channels'], created: '2024-02-15' },
  { id: 't7', title: 'SAFE Agreement Template', description: 'Standard Y Combinator SAFE agreement for pre-seed and seed funding rounds.', type: 'template', category: 'legal', format: 'Word/PDF', rating: 4.9, downloads: 8920, featured: true, new: false, tags: ['SAFE', 'legal', 'investment'], created: '2024-01-05' },
  { id: 't8', title: 'Product Roadmap Template', description: 'Visual product roadmap template for planning features and releases.', type: 'template', category: 'product', format: 'Notion/Figma', rating: 4.7, downloads: 4560, featured: false, new: false, tags: ['product', 'roadmap', 'planning'], created: '2024-02-20' },
  
  // E-Books
  { id: 'e1', title: 'The Startup Funding Guide', description: 'Complete guide to raising venture capital from pre-seed to Series A.', type: 'ebook', category: 'fundraising', author: 'GrowthLab Team', format: 'PDF (85 pages)', rating: 4.8, downloads: 25600, featured: true, new: false, tags: ['fundraising', 'VC', 'investors'], created: '2024-01-10' },
  { id: 'e2', title: 'Growth Hacking Playbook', description: 'Tactics and strategies used by the fastest-growing startups.', type: 'ebook', category: 'growth', author: 'Growth Experts', format: 'PDF (120 pages)', rating: 4.7, downloads: 18900, featured: false, new: false, tags: ['growth', 'marketing', 'acquisition'], created: '2024-02-05' },
  { id: 'e3', title: 'SaaS Metrics Bible', description: 'Essential metrics every SaaS founder needs to track and optimize.', type: 'ebook', category: 'finance', author: 'SaaS Analytics', format: 'PDF (65 pages)', rating: 4.9, downloads: 14200, featured: true, new: false, tags: ['SaaS', 'metrics', 'analytics'], created: '2024-01-25' },
  { id: 'e4', title: 'Product-Market Fit Guide', description: 'Framework for finding and validating product-market fit.', type: 'ebook', category: 'product', author: 'Product School', format: 'PDF (45 pages)', rating: 4.6, downloads: 11800, featured: false, new: true, tags: ['PMF', 'product', 'validation'], created: '2024-03-05' },
  
  // Videos
  { id: 'v1', title: 'How to Pitch to Investors', description: 'Master class on delivering a compelling pitch to VCs and angel investors.', type: 'video', category: 'fundraising', author: 'Y Combinator', duration: '45 min', rating: 4.9, downloads: 32100, featured: true, new: false, tags: ['pitch', 'investors', 'presentation'], created: '2024-01-08' },
  { id: 'v2', title: 'Building Your First Product', description: 'From idea to MVP - practical guide for first-time founders.', type: 'video', category: 'product', author: 'a16z', duration: '1 hr 15 min', rating: 4.8, downloads: 22400, featured: false, new: false, tags: ['product', 'MVP', 'building'], created: '2024-02-12' },
  { id: 'v3', title: 'Startup Sales Fundamentals', description: 'B2B sales strategies for early-stage startups.', type: 'video', category: 'growth', author: 'First Round', duration: '55 min', rating: 4.7, downloads: 15600, featured: false, new: true, tags: ['sales', 'B2B', 'revenue'], created: '2024-03-08' },
  
  // Podcasts
  { id: 'p1', title: 'The Startup Journey Podcast', description: 'Weekly interviews with successful founders sharing their stories.', type: 'podcast', category: 'leadership', author: 'Various Founders', duration: 'Weekly episodes', rating: 4.8, downloads: 45000, featured: true, new: false, tags: ['founders', 'interviews', 'stories'], created: '2024-01-01' },
  { id: 'p2', title: 'Growth Marketing Deep Dives', description: 'Tactical growth strategies from marketing leaders at top startups.', type: 'podcast', category: 'marketing', author: 'Marketing Leaders', duration: 'Bi-weekly', rating: 4.6, downloads: 28500, featured: false, new: false, tags: ['growth', 'marketing', 'tactics'], created: '2024-01-15' },
  { id: 'p3', title: 'Tech Trends for Founders', description: 'Latest technology trends and how startups can leverage them.', type: 'podcast', category: 'tech', author: 'Tech Analysts', duration: 'Weekly', rating: 4.5, downloads: 19800, featured: false, new: true, tags: ['tech', 'trends', 'innovation'], created: '2024-03-01' },
  
  // Courses
  { id: 'c1', title: 'Startup Fundamentals Course', description: '10-module course covering everything from idea to launch.', type: 'course', category: 'product', author: 'Startup School', duration: '8 hours', rating: 4.9, downloads: 38500, featured: true, new: false, tags: ['fundamentals', 'startup', 'launch'], created: '2024-01-05' },
  { id: 'c2', title: 'Financial Modeling for Startups', description: 'Learn to build professional financial models for fundraising.', type: 'course', category: 'finance', author: 'Finance Academy', duration: '6 hours', rating: 4.8, downloads: 21200, featured: false, new: false, tags: ['finance', 'modeling', 'fundraising'], created: '2024-02-01' },
  { id: 'c3', title: 'Leadership for First-Time Founders', description: 'Essential leadership skills for building and managing teams.', type: 'course', category: 'leadership', author: 'Leadership Institute', duration: '5 hours', rating: 4.7, downloads: 16800, featured: false, new: true, tags: ['leadership', 'team', 'management'], created: '2024-03-12' },
]

const books = [
  { id: 'b1', title: 'Zero to One', author: 'Peter Thiel', category: 'Strategy', rating: 4.8, description: 'Notes on startups, or how to build the future.' },
  { id: 'b2', title: 'The Lean Startup', author: 'Eric Ries', category: 'Product', rating: 4.7, description: 'How today\'s entrepreneurs use continuous innovation.' },
  { id: 'b3', title: 'Crossing the Chasm', author: 'Geoffrey Moore', category: 'Marketing', rating: 4.6, description: 'Marketing and selling high-tech products to mainstream customers.' },
  { id: 'b4', title: 'The Hard Thing About Hard Things', author: 'Ben Horowitz', category: 'Leadership', rating: 4.9, description: 'Building a business when there are no easy answers.' },
  { id: 'b5', title: 'Hooked', author: 'Nir Eyal', category: 'Product', rating: 4.5, description: 'How to build habit-forming products.' },
  { id: 'b6', title: 'Blitzscaling', author: 'Reid Hoffman', category: 'Growth', rating: 4.6, description: 'The lightning-fast path to building massively valuable companies.' },
]

export default function ResourcesHubPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [savedResources, setSavedResources] = useState<string[]>([])

  const tabs = [
    { id: 'all', label: 'All Resources', icon: BookOpen },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'learning', label: 'Learning', icon: Video },
    { id: 'books', label: 'Books', icon: Book },
    { id: 'saved', label: 'Saved', icon: Heart },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('savedResources')
    if (saved) setSavedResources(JSON.parse(saved))
  }, [])

  const toggleSave = (id: string) => {
    const updated = savedResources.includes(id) ? savedResources.filter(r => r !== id) : [...savedResources, id]
    setSavedResources(updated)
    localStorage.setItem('savedResources', JSON.stringify(updated))
    showToast(savedResources.includes(id) ? 'Removed' : 'Saved!', 'success')
  }

  const handleDownload = (resource: Resource) => {
    showToast(`Downloading ${resource.title}...`, 'success')
  }

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || r.type === filterType
    const matchesCategory = filterCategory === 'all' || r.category === filterCategory
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'templates' && r.type === 'template') ||
      (activeTab === 'learning' && ['video', 'course', 'podcast', 'ebook'].includes(r.type)) ||
      (activeTab === 'saved' && savedResources.includes(r.id))
    return matchesSearch && matchesType && matchesCategory && matchesTab
  })

  const featuredResources = resources.filter(r => r.featured)
  const newResources = resources.filter(r => r.new)
  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Startup Resources Library
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Free templates, guides, videos, and learning resources to accelerate your startup journey
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <FileText className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{resources.filter(r => r.type === 'template').length}</div>
            <div className="text-sm text-gray-600">Templates</div>
          </Card>
          <Card className="p-4 text-center">
            <Video className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{resources.filter(r => ['video', 'course'].includes(r.type)).length}</div>
            <div className="text-sm text-gray-600">Videos & Courses</div>
          </Card>
          <Card className="p-4 text-center">
            <Book className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{resources.filter(r => r.type === 'ebook').length + books.length}</div>
            <div className="text-sm text-gray-600">Books & E-Books</div>
          </Card>
          <Card className="p-4 text-center">
            <Download className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{Math.round(totalDownloads / 1000)}K+</div>
            <div className="text-sm text-gray-600">Downloads</div>
          </Card>
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab !== 'books' && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search resources..." className="w-64" />
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}
              options={[{ value: 'all', label: 'All Types' }, ...Object.entries(typeInfo).map(([k, v]) => ({ value: k, label: v.label }))]} />
            <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              options={[{ value: 'all', label: 'All Categories' }, ...Object.entries(categoryInfo).map(([k, v]) => ({ value: k, label: v.label }))]} />
          </div>
        )}

        {activeTab === 'all' && featuredResources.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-yellow-500" /> Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredResources.slice(0, 4).map(resource => {
                const TypeIcon = typeInfo[resource.type].icon
                return (
                  <Card key={resource.id} className="p-4 border-2 border-yellow-200 bg-yellow-50">
                    <div className="flex items-start justify-between mb-2">
                      <TypeIcon className={`h-5 w-5 ${typeInfo[resource.type].color}`} />
                      <Badge variant="featured">Featured</Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{resource.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" /> {resource.rating}
                      <span>•</span>
                      <Download className="h-4 w-4" /> {(resource.downloads / 1000).toFixed(1)}K
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'books' ? (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-4">Recommended Startup Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map(book => (
                  <div key={book.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xl shrink-0">
                        {book.title.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                        <Badge variant="outline" className="mt-1 text-xs">{book.category}</Badge>
                        <p className="text-sm text-gray-500 mt-2">{book.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" /> {book.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(resource => {
              const TypeIcon = typeInfo[resource.type].icon
              const CategoryIcon = categoryInfo[resource.category].icon
              return (
                <Card key={resource.id} className="p-4 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TypeIcon className={`h-5 w-5 ${typeInfo[resource.type].color}`} />
                      <Badge variant="outline">{typeInfo[resource.type].label}</Badge>
                      {resource.new && <Badge variant="new">New</Badge>}
                    </div>
                    <button onClick={() => toggleSave(resource.id)} className="text-gray-400 hover:text-red-500">
                      {savedResources.includes(resource.id) ? <Heart className="h-5 w-5 fill-current text-red-500" /> : <Heart className="h-5 w-5" />}
                    </button>
                  </div>
                  <h3 className="font-semibold mb-1">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500 fill-current" /> {resource.rating}</span>
                    <span className="flex items-center gap-1"><Download className="h-4 w-4" /> {(resource.downloads / 1000).toFixed(1)}K</span>
                    {resource.duration && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {resource.duration}</span>}
                  </div>

                  {resource.author && <p className="text-xs text-gray-500 mb-3">By {resource.author}</p>}
                  {resource.format && <p className="text-xs text-gray-500 mb-3">Format: {resource.format}</p>}

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => handleDownload(resource)}>
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {filteredResources.length === 0 && activeTab !== 'books' && (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="h-16 w-16 mx-auto mb-4" />
            <p>No resources found matching your criteria.</p>
          </div>
        )}

        <Card className="mt-8 p-6 bg-gradient-to-r from-primary-500 to-purple-600 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Want More Resources?</h3>
              <p className="opacity-90">Subscribe to get new templates and guides delivered to your inbox.</p>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="bg-white/20 border-white/30 text-white placeholder:text-white/70 w-64" />
              <Button variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">Subscribe</Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}

