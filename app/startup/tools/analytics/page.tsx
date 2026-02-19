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
  BarChart3, LineChart, PieChart, Database, TrendingUp, Zap, Activity,
  Star, Heart, ExternalLink, Check, ArrowLeft, Eye, Users, Target
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface AnalyticsTool {
  id: string; name: string; description: string; subcategory: string; pricing: string
  priceRange?: string; rating: number; reviews: number; features: string[]; bestFor: string[]
  website: string; logo: string; startupDiscount?: string; integrations: string[]
  pros: string[]; cons: string[]
}

const subcategories = [
  { id: 'product', label: 'Product Analytics', icon: Activity },
  { id: 'web', label: 'Web Analytics', icon: BarChart3 },
  { id: 'data', label: 'Data Infrastructure', icon: Database },
  { id: 'bi', label: 'Business Intelligence', icon: PieChart },
  { id: 'session', label: 'Session Recording', icon: Eye },
  { id: 'ab', label: 'A/B Testing', icon: Target },
]

const tools: AnalyticsTool[] = [
  { id: 'amplitude', name: 'Amplitude', description: 'Product analytics platform for understanding user behavior and driving growth.', subcategory: 'product', pricing: 'freemium', priceRange: 'Free-Custom', rating: 4.6, reviews: 5600, features: ['Event Tracking', 'User Journeys', 'Cohorts', 'A/B Testing', 'Predictions', 'Pathfinder', 'Impact Analysis'], bestFor: ['Product teams', 'Growth teams', 'SaaS'], website: 'amplitude.com', logo: 'AM', startupDiscount: '$25K in credits', integrations: ['Segment', 'Snowflake', 'BigQuery', 'Braze'], pros: ['Powerful analytics', 'Great cohorts', 'Free tier generous'], cons: ['Learning curve', 'Can be slow', 'Expensive at scale'] },
  { id: 'mixpanel', name: 'Mixpanel', description: 'Event-based analytics for tracking user interactions and conversion optimization.', subcategory: 'product', pricing: 'freemium', priceRange: 'Free-$25/mo', rating: 4.5, reviews: 4800, features: ['Funnels', 'Retention', 'User Profiles', 'Flows', 'A/B Testing', 'Alerts', 'Messaging'], bestFor: ['Mobile apps', 'SaaS products', 'Growth teams'], website: 'mixpanel.com', logo: 'MX', startupDiscount: '$50K in credits', integrations: ['Segment', 'mParticle', 'Zapier'], pros: ['Great for mobile', 'Easy setup', 'Real-time data'], cons: ['UI can be confusing', 'Pricing per MTU'] },
  { id: 'posthog', name: 'PostHog', description: 'Open-source product analytics with feature flags, session recording, and A/B testing.', subcategory: 'product', pricing: 'freemium', priceRange: 'Free-Custom', rating: 4.7, reviews: 1800, features: ['Analytics', 'Session Recording', 'Feature Flags', 'A/B Testing', 'Surveys', 'SQL Access', 'Self-Host'], bestFor: ['Developers', 'Privacy-focused', 'Technical teams'], website: 'posthog.com', logo: 'PH', startupDiscount: 'Generous free tier', integrations: ['Everything via API', 'Segment', 'Slack'], pros: ['Open source', 'Self-host option', 'All-in-one', 'Great free tier'], cons: ['Newer platform', 'Self-hosting complexity'] },
  { id: 'ga4', name: 'Google Analytics 4', description: 'Free web and app analytics platform from Google with machine learning insights.', subcategory: 'web', pricing: 'free', rating: 4.2, reviews: 85000, features: ['Web Analytics', 'App Analytics', 'Conversions', 'Audiences', 'Explorations', 'BigQuery Export', 'Attribution'], bestFor: ['All websites', 'Google Ads users', 'E-commerce'], website: 'analytics.google.com', logo: 'GA', integrations: ['Google Ads', 'BigQuery', 'Looker', 'Tag Manager'], pros: ['Free', 'Powerful', 'BigQuery export', 'Machine learning'], cons: ['Learning curve', 'Complex UI', 'Data sampling'] },
  { id: 'plausible', name: 'Plausible', description: 'Privacy-friendly, lightweight web analytics without cookies.', subcategory: 'web', pricing: 'paid', priceRange: '$9-$99/mo', rating: 4.8, reviews: 2400, features: ['Lightweight Script', 'No Cookies', 'Goals', 'Campaigns', 'Custom Events', 'API', 'Email Reports'], bestFor: ['Privacy-focused', 'EU compliance', 'Simple analytics'], website: 'plausible.io', logo: 'PL', integrations: ['Zapier', 'Make', 'Slack'], pros: ['Privacy-first', 'Simple', 'Fast', 'GDPR compliant'], cons: ['Less features', 'No user-level data', 'Paid only'] },
  { id: 'segment', name: 'Segment', description: 'Customer data platform for collecting, cleaning, and routing data to other tools.', subcategory: 'data', pricing: 'freemium', priceRange: 'Free-Custom', rating: 4.4, reviews: 3500, features: ['Data Collection', 'Destinations', 'Audiences', 'Protocols', 'Privacy', 'Identity Resolution'], bestFor: ['Data-driven companies', 'Multi-tool stacks', 'Enterprise'], website: 'segment.com', logo: 'SG', startupDiscount: '$25K in credits', integrations: ['300+ destinations', 'All analytics tools'], pros: ['Single source of truth', 'Many integrations', 'Data quality'], cons: ['Expensive', 'Complexity', 'Learning curve'] },
  { id: 'hotjar', name: 'Hotjar', description: 'Behavior analytics with heatmaps, session recordings, and user feedback.', subcategory: 'session', pricing: 'freemium', priceRange: 'Free-$171/mo', rating: 4.5, reviews: 8500, features: ['Heatmaps', 'Session Recordings', 'Surveys', 'Feedback', 'Funnels', 'Form Analysis', 'User Interviews'], bestFor: ['UX teams', 'CRO', 'Product managers'], website: 'hotjar.com', logo: 'HJ', integrations: ['Google Analytics', 'Slack', 'HubSpot', 'Zapier'], pros: ['Visual insights', 'Easy setup', 'Good free tier'], cons: ['Can slow site', 'Recording limits', 'No real-time'] },
  { id: 'fullstory', name: 'FullStory', description: 'Digital experience intelligence with session replay and analytics.', subcategory: 'session', pricing: 'paid', priceRange: 'Custom', rating: 4.5, reviews: 3200, features: ['Session Replay', 'Heatmaps', 'Conversion Funnels', 'Frustration Signals', 'Search', 'Privacy Controls'], bestFor: ['Enterprise', 'UX teams', 'Product teams'], website: 'fullstory.com', logo: 'FS', integrations: ['Segment', 'Salesforce', 'Slack', 'Intercom'], pros: ['Powerful search', 'Frustration signals', 'Auto-capture'], cons: ['Expensive', 'Privacy concerns', 'Can be heavy'] },
  { id: 'heap', name: 'Heap', description: 'Automatic event capture and product analytics without manual instrumentation.', subcategory: 'product', pricing: 'freemium', priceRange: 'Free-Custom', rating: 4.4, reviews: 2800, features: ['Auto-capture', 'Retroactive Analysis', 'Funnels', 'Retention', 'Session Replay', 'Effort Analysis'], bestFor: ['Teams without engineers', 'Retroactive analysis'], website: 'heap.io', logo: 'HP', startupDiscount: 'Startup program available', integrations: ['Segment', 'Salesforce', 'Marketo'], pros: ['Auto-capture', 'No code needed', 'Retroactive data'], cons: ['Can be noisy', 'Complex queries', 'Expensive'] },
  { id: 'looker', name: 'Looker', description: 'Enterprise business intelligence platform now part of Google Cloud.', subcategory: 'bi', pricing: 'paid', priceRange: 'Custom', rating: 4.3, reviews: 4500, features: ['Data Modeling', 'Dashboards', 'Exploration', 'Embedded Analytics', 'LookML', 'Actions'], bestFor: ['Enterprise', 'Data teams', 'BI analysts'], website: 'looker.com', logo: 'LK', integrations: ['BigQuery', 'Snowflake', 'Redshift', 'All databases'], pros: ['Powerful modeling', 'Centralized logic', 'Embedded analytics'], cons: ['Expensive', 'Steep learning curve', 'Complex setup'] },
  { id: 'metabase', name: 'Metabase', description: 'Open-source business intelligence tool for querying and visualizing data.', subcategory: 'bi', pricing: 'freemium', priceRange: 'Free-$500/mo', rating: 4.6, reviews: 3800, features: ['SQL Editor', 'Dashboards', 'Questions', 'Alerts', 'Embedding', 'Self-Host'], bestFor: ['Startups', 'Small teams', 'Non-technical users'], website: 'metabase.com', logo: 'MB', integrations: ['All databases', 'Slack'], pros: ['Free tier', 'Easy to use', 'Self-host option', 'Great for SQL'], cons: ['Limited advanced features', 'Scaling challenges'] },
  { id: 'optimizely', name: 'Optimizely', description: 'Digital experience platform with A/B testing and feature management.', subcategory: 'ab', pricing: 'paid', priceRange: 'Custom', rating: 4.3, reviews: 4200, features: ['A/B Testing', 'Feature Flags', 'Personalization', 'Web Experimentation', 'Full Stack Testing', 'Stats Engine'], bestFor: ['Enterprise', 'Product teams', 'Marketing'], website: 'optimizely.com', logo: 'OP', integrations: ['Google Analytics', 'Segment', 'Salesforce'], pros: ['Enterprise-grade', 'Stats engine', 'Full-stack support'], cons: ['Very expensive', 'Complex setup', 'Steep learning curve'] },
  { id: 'launchdarkly', name: 'LaunchDarkly', description: 'Feature management platform for controlled rollouts and experimentation.', subcategory: 'ab', pricing: 'freemium', priceRange: 'Free-$20/seat', rating: 4.6, reviews: 2100, features: ['Feature Flags', 'Targeting', 'A/B Testing', 'Progressive Rollouts', 'SDKs', 'Audit Log'], bestFor: ['Engineering teams', 'DevOps', 'Product teams'], website: 'launchdarkly.com', logo: 'LD', integrations: ['All major platforms', 'Slack', 'DataDog'], pros: ['Developer-focused', 'Great SDKs', 'Reliable'], cons: ['Can get expensive', 'Complex pricing'] },
]

export default function AnalyticsToolsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubcategory, setFilterSubcategory] = useState<string>('all')
  const [filterPricing, setFilterPricing] = useState<string>('all')
  const [savedTools, setSavedTools] = useState<string[]>([])
  const [selectedTool, setSelectedTool] = useState<AnalyticsTool | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('savedAnalyticsTools')
    if (saved) setSavedTools(JSON.parse(saved))
  }, [])

  const toggleSave = (id: string) => {
    const updated = savedTools.includes(id) ? savedTools.filter(t => t !== id) : [...savedTools, id]
    setSavedTools(updated)
    localStorage.setItem('savedAnalyticsTools', JSON.stringify(updated))
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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/startup/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500 p-3 rounded-xl text-white"><BarChart3 className="h-8 w-8" /></div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text">Analytics & Data Tools</h1>
              <p className="text-gray-600">Product analytics, business intelligence, and data infrastructure</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {subcategories.map(sub => {
            const Icon = sub.icon
            const count = tools.filter(t => t.subcategory === sub.id).length
            return (
              <button key={sub.id} onClick={() => setFilterSubcategory(filterSubcategory === sub.id ? 'all' : sub.id)}
                className={`p-3 rounded-lg text-center transition-all ${filterSubcategory === sub.id ? 'bg-purple-500 text-white' : 'bg-white border hover:border-purple-300'}`}>
                <Icon className={`h-5 w-5 mx-auto mb-1 ${filterSubcategory === sub.id ? 'text-white' : 'text-purple-600'}`} />
                <div className="text-xs font-medium">{sub.label}</div>
                <div className="text-xs opacity-70">{count}</div>
              </button>
            )
          })}
        </div>

        <SimpleTabs tabs={[{ id: 'all', label: 'All Tools', icon: BarChart3 }, { id: 'saved', label: 'Saved', icon: Heart }]} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex flex-wrap gap-2 my-6">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-64" />
          <Select value={filterPricing} onChange={(e) => setFilterPricing(e.target.value)} options={[{ value: 'all', label: 'All Pricing' }, { value: 'free', label: 'Free' }, { value: 'freemium', label: 'Freemium' }, { value: 'paid', label: 'Paid' }]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => (
            <Card key={tool.id} className="p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedTool(tool)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center font-bold text-purple-700">{tool.logo}</div>
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
              {tool.startupDiscount && <div className="mt-3 p-2 bg-purple-50 rounded-lg text-sm text-purple-700"><Zap className="h-4 w-4 inline mr-1" />{tool.startupDiscount}</div>}
            </Card>
          ))}
        </div>

        {selectedTool && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedTool(null)}>
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center font-bold text-purple-700 text-xl">{selectedTool.logo}</div>
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
              {selectedTool.startupDiscount && <div className="p-3 bg-purple-50 rounded-lg mb-4"><Zap className="h-4 w-4 inline text-purple-600 mr-2" /><span className="text-purple-700 font-medium">Startup Discount: {selectedTool.startupDiscount}</span></div>}
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
