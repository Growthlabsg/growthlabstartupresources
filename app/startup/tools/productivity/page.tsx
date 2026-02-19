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
  Settings, MessageCircle, CheckSquare, FileText, Video, Calendar,
  Star, Heart, ExternalLink, Check, Zap, ArrowLeft, Users, Layers
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface ProductivityTool {
  id: string; name: string; description: string; subcategory: string; pricing: string
  priceRange?: string; rating: number; reviews: number; features: string[]; bestFor: string[]
  website: string; logo: string; startupDiscount?: string; integrations: string[]
  pros: string[]; cons: string[]
}

const subcategories = [
  { id: 'project', label: 'Project Management', icon: CheckSquare },
  { id: 'docs', label: 'Docs & Notes', icon: FileText },
  { id: 'chat', label: 'Team Chat', icon: MessageCircle },
  { id: 'video', label: 'Video & Meetings', icon: Video },
  { id: 'design', label: 'Design', icon: Layers },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
]

const tools: ProductivityTool[] = [
  { id: 'notion', name: 'Notion', description: 'All-in-one workspace for notes, docs, wikis, and project management.', subcategory: 'docs', pricing: 'freemium', priceRange: 'Free-$15/mo', rating: 4.7, reviews: 28000, features: ['Documents', 'Wikis', 'Projects', 'Databases', 'AI Assistant', 'Templates', 'Collaboration'], bestFor: ['Startups', 'Remote teams', 'Knowledge management'], website: 'notion.so', logo: 'NT', startupDiscount: 'Free for startups', integrations: ['Slack', 'GitHub', 'Figma', 'Jira'], pros: ['Flexible', 'Beautiful UI', 'Great for docs', 'Free startup plan'], cons: ['Learning curve', 'Can be slow', 'Complex for simple needs'] },
  { id: 'slack', name: 'Slack', description: 'Team communication hub with channels, DMs, and app integrations.', subcategory: 'chat', pricing: 'freemium', priceRange: 'Free-$15/mo', rating: 4.5, reviews: 45000, features: ['Channels', 'Direct Messages', 'File Sharing', 'Huddles', 'Workflow Builder', 'Apps', 'Search'], bestFor: ['All teams', 'Remote work', 'Async communication'], website: 'slack.com', logo: 'SL', integrations: ['Everything - 2000+ apps'], pros: ['Industry standard', 'Great integrations', 'Easy to use'], cons: ['Can be distracting', 'Expensive at scale', 'Message history limits'] },
  { id: 'asana', name: 'Asana', description: 'Project and work management for teams of all sizes.', subcategory: 'project', pricing: 'freemium', priceRange: 'Free-$25/mo', rating: 4.4, reviews: 18000, features: ['Tasks', 'Projects', 'Timelines', 'Portfolios', 'Automation', 'Forms', 'Goals'], bestFor: ['Cross-functional teams', 'Marketing', 'Operations'], website: 'asana.com', logo: 'AS', integrations: ['Slack', 'Google Workspace', 'Zoom', 'Salesforce'], pros: ['Multiple views', 'Great automation', 'Good free tier'], cons: ['Can be overwhelming', 'Limited reporting on free'] },
  { id: 'linear', name: 'Linear', description: 'Modern issue tracking built for high-performance product teams.', subcategory: 'project', pricing: 'freemium', priceRange: 'Free-$8/mo', rating: 4.9, reviews: 3200, features: ['Issues', 'Cycles', 'Roadmaps', 'Keyboard Shortcuts', 'GitHub Sync', 'API', 'Integrations'], bestFor: ['Engineering teams', 'Product teams', 'Startups'], website: 'linear.app', logo: 'LN', integrations: ['GitHub', 'Figma', 'Slack', 'Sentry'], pros: ['Fast', 'Beautiful UI', 'Great shortcuts', 'Developer-focused'], cons: ['Less flexible', 'Not for all team types'] },
  { id: 'figma', name: 'Figma', description: 'Collaborative design tool for UI/UX, prototyping, and design systems.', subcategory: 'design', pricing: 'freemium', priceRange: 'Free-$75/mo', rating: 4.8, reviews: 22000, features: ['Design', 'Prototyping', 'Dev Mode', 'FigJam', 'Plugins', 'Components', 'Auto Layout'], bestFor: ['Product teams', 'Designers', 'Design systems'], website: 'figma.com', logo: 'FG', startupDiscount: 'Free for 2 years', integrations: ['Slack', 'Jira', 'Notion', 'Zeplin'], pros: ['Collaborative', 'Web-based', 'Great plugins', 'Prototyping'], cons: ['Can be slow on large files', 'Limited offline'] },
  { id: 'monday', name: 'monday.com', description: 'Work OS that powers teams to run projects and workflows with confidence.', subcategory: 'project', pricing: 'paid', priceRange: '$9-$19/seat', rating: 4.6, reviews: 15000, features: ['Boards', 'Automations', 'Integrations', 'Dashboards', 'Docs', 'Forms', 'Time Tracking'], bestFor: ['All teams', 'Non-technical teams', 'Agencies'], website: 'monday.com', logo: 'MD', integrations: ['Slack', 'Zoom', 'Google Workspace', 'Salesforce'], pros: ['Visual', 'Easy to use', 'Good automations'], cons: ['Expensive', 'Can be overwhelming'] },
  { id: 'trello', name: 'Trello', description: 'Simple Kanban-style project management with boards, lists, and cards.', subcategory: 'project', pricing: 'freemium', priceRange: 'Free-$17.50/mo', rating: 4.4, reviews: 24000, features: ['Boards', 'Cards', 'Power-Ups', 'Automation', 'Templates', 'Calendar View'], bestFor: ['Simple projects', 'Visual thinkers', 'Small teams'], website: 'trello.com', logo: 'TR', integrations: ['Slack', 'Jira', 'Google Drive', 'Dropbox'], pros: ['Simple', 'Visual', 'Good free tier'], cons: ['Limited for complex projects', 'Power-ups cost extra'] },
  { id: 'zoom', name: 'Zoom', description: 'Video conferencing platform for meetings, webinars, and calls.', subcategory: 'video', pricing: 'freemium', priceRange: 'Free-$20/mo', rating: 4.4, reviews: 52000, features: ['Video Meetings', 'Webinars', 'Chat', 'Phone', 'Whiteboard', 'Recording', 'Breakout Rooms'], bestFor: ['Remote teams', 'All company sizes', 'Webinars'], website: 'zoom.us', logo: 'ZM', integrations: ['Slack', 'Google Calendar', 'Salesforce', 'HubSpot'], pros: ['Reliable', 'Easy to use', 'Good quality'], cons: ['Security concerns', 'Zoom fatigue', '40-min limit on free'] },
  { id: 'loom', name: 'Loom', description: 'Async video messaging for quick screen recordings and walkthroughs.', subcategory: 'video', pricing: 'freemium', priceRange: 'Free-$15/mo', rating: 4.7, reviews: 8200, features: ['Screen Recording', 'Video Messages', 'Analytics', 'Transcripts', 'Comments', 'CTAs', 'AI'], bestFor: ['Remote teams', 'Async communication', 'Tutorials'], website: 'loom.com', logo: 'LM', startupDiscount: 'Free for startups', integrations: ['Slack', 'Notion', 'Gmail', 'HubSpot'], pros: ['Easy recording', 'Great for async', 'Good analytics'], cons: ['Video only', 'Storage limits on free'] },
  { id: 'calendly', name: 'Calendly', description: 'Scheduling automation that eliminates the back-and-forth of booking meetings.', subcategory: 'calendar', pricing: 'freemium', priceRange: 'Free-$16/mo', rating: 4.7, reviews: 12000, features: ['Scheduling', 'Calendar Sync', 'Teams', 'Workflows', 'Routing', 'Integrations', 'Analytics'], bestFor: ['Sales', 'Recruiting', 'Customer success'], website: 'calendly.com', logo: 'CY', integrations: ['Zoom', 'Google Calendar', 'Salesforce', 'HubSpot'], pros: ['Simple', 'Great free tier', 'Many integrations'], cons: ['Limited customization', 'Branding on free'] },
  { id: 'miro', name: 'Miro', description: 'Online whiteboard for visual collaboration and brainstorming.', subcategory: 'design', pricing: 'freemium', priceRange: 'Free-$16/mo', rating: 4.8, reviews: 9500, features: ['Whiteboards', 'Templates', 'Collaboration', 'Sticky Notes', 'Diagramming', 'Video', 'Voting'], bestFor: ['Workshops', 'Design thinking', 'Remote collaboration'], website: 'miro.com', logo: 'MR', integrations: ['Slack', 'Jira', 'Notion', 'Microsoft Teams'], pros: ['Great for workshops', 'Many templates', 'Real-time collaboration'], cons: ['Can be laggy', 'Learning curve'] },
  { id: 'obsidian', name: 'Obsidian', description: 'Private and flexible note-taking app with powerful linking and plugins.', subcategory: 'docs', pricing: 'freemium', priceRange: 'Free-$50/year', rating: 4.8, reviews: 5800, features: ['Markdown', 'Linking', 'Graph View', 'Plugins', 'Local Storage', 'Themes', 'Templates'], bestFor: ['Personal knowledge', 'Developers', 'Writers'], website: 'obsidian.md', logo: 'OB', integrations: ['Local plugins', 'Git', 'Zapier'], pros: ['Local storage', 'Powerful linking', 'Great plugins', 'Privacy'], cons: ['No real-time collab', 'Technical setup'] },
]

export default function ProductivityToolsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubcategory, setFilterSubcategory] = useState<string>('all')
  const [filterPricing, setFilterPricing] = useState<string>('all')
  const [savedTools, setSavedTools] = useState<string[]>([])
  const [selectedTool, setSelectedTool] = useState<ProductivityTool | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('savedProductivityTools')
    if (saved) setSavedTools(JSON.parse(saved))
  }, [])

  const toggleSave = (id: string) => {
    const updated = savedTools.includes(id) ? savedTools.filter(t => t !== id) : [...savedTools, id]
    setSavedTools(updated)
    localStorage.setItem('savedProductivityTools', JSON.stringify(updated))
    showToast(savedTools.includes(id) ? 'Removed' : 'Saved!', 'success')
  }

  const filteredTools = tools.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSub = filterSubcategory === 'all' || t.subcategory === filterSubcategory
    const matchesPricing = filterPricing === 'all' || t.pricing === filterPricing
    const matchesTab = activeTab === 'all' || (activeTab === 'saved' && savedTools.includes(t.id))
    return matchesSearch && matchesSub && matchesPricing && matchesTab
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/startup/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-xl text-white"><Settings className="h-8 w-8" /></div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text">Productivity Tools</h1>
              <p className="text-gray-600">Project management, collaboration, and team communication</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {subcategories.map(sub => {
            const Icon = sub.icon
            const count = tools.filter(t => t.subcategory === sub.id).length
            return (
              <button key={sub.id} onClick={() => setFilterSubcategory(filterSubcategory === sub.id ? 'all' : sub.id)}
                className={`p-3 rounded-lg text-center transition-all ${filterSubcategory === sub.id ? 'bg-blue-500 text-white' : 'bg-white border hover:border-blue-300'}`}>
                <Icon className={`h-5 w-5 mx-auto mb-1 ${filterSubcategory === sub.id ? 'text-white' : 'text-blue-600'}`} />
                <div className="text-xs font-medium">{sub.label}</div>
                <div className="text-xs opacity-70">{count}</div>
              </button>
            )
          })}
        </div>

        <SimpleTabs tabs={[{ id: 'all', label: 'All Tools', icon: Settings }, { id: 'saved', label: 'Saved', icon: Heart }]} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex flex-wrap gap-2 my-6">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-64" />
          <Select value={filterPricing} onChange={(e) => setFilterPricing(e.target.value)} options={[{ value: 'all', label: 'All Pricing' }, { value: 'free', label: 'Free' }, { value: 'freemium', label: 'Freemium' }, { value: 'paid', label: 'Paid' }]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => (
            <Card key={tool.id} className="p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedTool(tool)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center font-bold text-blue-700">{tool.logo}</div>
                  <div><h3 className="font-semibold">{tool.name}</h3><span className="text-sm text-gray-500">{subcategories.find(s => s.id === tool.subcategory)?.label}</span></div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleSave(tool.id) }} className="text-gray-400 hover:text-red-500">
                  {savedTools.includes(tool.id) ? <Heart className="h-5 w-5 fill-current text-red-500" /> : <Heart className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tool.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={tool.pricing === 'free' ? 'new' : tool.pricing === 'freemium' ? 'featured' : 'outline'}>{tool.pricing}</Badge>
                {tool.priceRange && <span className="text-sm text-gray-500">{tool.priceRange}</span>}
              </div>
              <div className="flex items-center gap-2 text-sm"><Star className="h-4 w-4 text-yellow-500 fill-current" /><span className="font-medium">{tool.rating}</span><span className="text-gray-400">({tool.reviews.toLocaleString()})</span></div>
              {tool.startupDiscount && <div className="mt-3 p-2 bg-blue-50 rounded-lg text-sm text-blue-700"><Zap className="h-4 w-4 inline mr-1" />{tool.startupDiscount}</div>}
            </Card>
          ))}
        </div>

        {selectedTool && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedTool(null)}>
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center font-bold text-blue-700 text-xl">{selectedTool.logo}</div>
                  <div><h2 className="text-2xl font-bold">{selectedTool.name}</h2><Badge variant="outline">{subcategories.find(s => s.id === selectedTool.subcategory)?.label}</Badge></div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedTool(null)}>✕</Button>
              </div>
              <p className="text-gray-600 mb-4">{selectedTool.description}</p>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center"><div className="text-sm text-gray-500">Pricing</div><div className="font-semibold">{selectedTool.priceRange || selectedTool.pricing}</div></div>
                <div className="p-3 bg-gray-50 rounded-lg text-center"><div className="text-sm text-gray-500">Rating</div><div className="font-semibold">⭐ {selectedTool.rating}</div></div>
                <div className="p-3 bg-gray-50 rounded-lg text-center"><div className="text-sm text-gray-500">Reviews</div><div className="font-semibold">{selectedTool.reviews.toLocaleString()}</div></div>
              </div>
              {selectedTool.startupDiscount && <div className="p-3 bg-blue-50 rounded-lg mb-4"><Zap className="h-4 w-4 inline text-blue-600 mr-2" /><span className="text-blue-700 font-medium">Startup Discount: {selectedTool.startupDiscount}</span></div>}
              <div className="mb-4"><h4 className="font-semibold mb-2">Features</h4><div className="flex flex-wrap gap-2">{selectedTool.features.map((f, i) => <Badge key={i} variant="outline">{f}</Badge>)}</div></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><h4 className="font-semibold mb-2 text-green-600">Pros</h4><ul className="space-y-1">{selectedTool.pros.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-green-600 mt-0.5" />{p}</li>)}</ul></div>
                <div><h4 className="font-semibold mb-2 text-orange-600">Cons</h4><ul className="space-y-1">{selectedTool.cons.map((c, i) => <li key={i} className="flex items-start gap-2 text-sm"><span className="text-orange-600">•</span>{c}</li>)}</ul></div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => window.open(`https://${selectedTool.website}`, '_blank')}><ExternalLink className="h-4 w-4 mr-2" /> Visit Website</Button>
                <Button variant="outline" onClick={() => toggleSave(selectedTool.id)}><Heart className={`h-4 w-4 mr-2 ${savedTools.includes(selectedTool.id) ? 'fill-current text-red-500' : ''}`} />{savedTools.includes(selectedTool.id) ? 'Saved' : 'Save'}</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
