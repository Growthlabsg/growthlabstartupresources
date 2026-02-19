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
  Target, Mail, Share2, Search, Megaphone, PenTool, Video, BarChart3,
  Star, Heart, ExternalLink, Check, Zap, ArrowLeft, Globe, Users
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface MarketingTool {
  id: string; name: string; description: string; subcategory: string; pricing: string
  priceRange?: string; rating: number; reviews: number; features: string[]; bestFor: string[]
  website: string; logo: string; startupDiscount?: string; integrations: string[]
  pros: string[]; cons: string[]
}

const subcategories = [
  { id: 'automation', label: 'Marketing Automation', icon: Target },
  { id: 'email', label: 'Email Marketing', icon: Mail },
  { id: 'social', label: 'Social Media', icon: Share2 },
  { id: 'seo', label: 'SEO & Content', icon: Search },
  { id: 'ads', label: 'Advertising', icon: Megaphone },
  { id: 'design', label: 'Design', icon: PenTool },
]

const tools: MarketingTool[] = [
  { id: 'hubspot', name: 'HubSpot Marketing', description: 'All-in-one inbound marketing platform with CRM, email, landing pages, and analytics.', subcategory: 'automation', pricing: 'freemium', priceRange: 'Free-$3200/mo', rating: 4.5, reviews: 18500, features: ['CRM', 'Email Marketing', 'Landing Pages', 'Analytics', 'Automation', 'Social Media', 'Blog', 'SEO'], bestFor: ['B2B companies', 'Inbound marketing', 'Content marketing'], website: 'hubspot.com', logo: 'HS', startupDiscount: '90% off for startups', integrations: ['Salesforce', 'Slack', 'Zapier', 'WordPress'], pros: ['Free tier available', 'All-in-one platform', 'Great education'], cons: ['Expensive at scale', 'Complex setup'] },
  { id: 'mailchimp', name: 'Mailchimp', description: 'Email marketing platform with automation, landing pages, and audience management.', subcategory: 'email', pricing: 'freemium', priceRange: 'Free-$350/mo', rating: 4.3, reviews: 22000, features: ['Email Campaigns', 'Automation', 'Landing Pages', 'Analytics', 'A/B Testing', 'Segmentation', 'Templates'], bestFor: ['Small businesses', 'E-commerce', 'Beginners'], website: 'mailchimp.com', logo: 'MC', integrations: ['Shopify', 'WordPress', 'Canva', 'Zapier'], pros: ['Easy to use', 'Free tier', 'Great templates'], cons: ['Expensive for large lists', 'Limited automation on free'] },
  { id: 'semrush', name: 'SEMrush', description: 'Comprehensive SEO toolkit with keyword research, site audits, and competitive analysis.', subcategory: 'seo', pricing: 'paid', priceRange: '$120-$450/mo', rating: 4.6, reviews: 9800, features: ['Keyword Research', 'Site Audit', 'Backlink Analysis', 'Competitor Research', 'Content Marketing', 'PPC', 'Social Media'], bestFor: ['SEO professionals', 'Content marketers', 'Agencies'], website: 'semrush.com', logo: 'SR', integrations: ['Google Analytics', 'Google Search Console', 'WordPress'], pros: ['Comprehensive data', 'Great for SEO', 'Competitor insights'], cons: ['Expensive', 'Learning curve'] },
  { id: 'ahrefs', name: 'Ahrefs', description: 'Powerful SEO toolset for backlink analysis, keyword research, and site audits.', subcategory: 'seo', pricing: 'paid', priceRange: '$99-$999/mo', rating: 4.7, reviews: 7500, features: ['Backlink Analysis', 'Keyword Explorer', 'Site Audit', 'Content Explorer', 'Rank Tracker', 'Site Explorer'], bestFor: ['SEO specialists', 'Link builders', 'Content creators'], website: 'ahrefs.com', logo: 'AH', integrations: ['Google Search Console', 'Google Analytics'], pros: ['Best backlink data', 'Content tools', 'Easy to use'], cons: ['Pricey', 'No free plan'] },
  { id: 'buffer', name: 'Buffer', description: 'Social media scheduling and analytics platform for growing your audience.', subcategory: 'social', pricing: 'freemium', priceRange: 'Free-$120/mo', rating: 4.4, reviews: 7500, features: ['Scheduling', 'Analytics', 'Engagement', 'Team Collaboration', 'Landing Pages', 'AI Assistant'], bestFor: ['Social media managers', 'Small teams', 'Creators'], website: 'buffer.com', logo: 'BF', integrations: ['Canva', 'Dropbox', 'Giphy', 'Zapier'], pros: ['Clean UI', 'Easy scheduling', 'Good analytics'], cons: ['Limited features on free', 'Some platform limitations'] },
  { id: 'hootsuite', name: 'Hootsuite', description: 'Enterprise social media management platform with scheduling and analytics.', subcategory: 'social', pricing: 'paid', priceRange: '$99-$739/mo', rating: 4.2, reviews: 12000, features: ['Scheduling', 'Analytics', 'Monitoring', 'Team Collaboration', 'Ads Management', 'Inbox'], bestFor: ['Enterprises', 'Agencies', 'Large teams'], website: 'hootsuite.com', logo: 'HT', integrations: ['Salesforce', 'Zendesk', 'Slack'], pros: ['All platforms', 'Team features', 'Monitoring'], cons: ['Expensive', 'Clunky interface'] },
  { id: 'canva', name: 'Canva', description: 'Graphic design platform for creating stunning visuals without design skills.', subcategory: 'design', pricing: 'freemium', priceRange: 'Free-$13/mo', rating: 4.7, reviews: 35000, features: ['Templates', 'Brand Kit', 'Collaboration', 'Video Editing', 'AI Tools', 'Magic Resize', 'Presentations'], bestFor: ['Non-designers', 'Social media', 'Marketing teams'], website: 'canva.com', logo: 'CV', integrations: ['Mailchimp', 'HubSpot', 'Buffer', 'Dropbox'], pros: ['Easy to use', 'Great templates', 'Affordable'], cons: ['Limited advanced features', 'Some template fatigue'] },
  { id: 'klaviyo', name: 'Klaviyo', description: 'Email and SMS marketing platform built for e-commerce growth.', subcategory: 'email', pricing: 'freemium', priceRange: 'Free-$1000+/mo', rating: 4.6, reviews: 5200, features: ['Email Marketing', 'SMS', 'Automation', 'Segmentation', 'Analytics', 'A/B Testing', 'Forms'], bestFor: ['E-commerce', 'Shopify stores', 'DTC brands'], website: 'klaviyo.com', logo: 'KL', integrations: ['Shopify', 'WooCommerce', 'Magento'], pros: ['E-commerce focused', 'Great segmentation', 'Revenue tracking'], cons: ['Expensive at scale', 'Complex for beginners'] },
  { id: 'convertkit', name: 'ConvertKit', description: 'Email marketing for creators with simple automation and landing pages.', subcategory: 'email', pricing: 'freemium', priceRange: 'Free-$59/mo', rating: 4.5, reviews: 4800, features: ['Email', 'Automation', 'Landing Pages', 'Forms', 'Creator Network', 'Commerce', 'Sponsorships'], bestFor: ['Creators', 'Bloggers', 'Newsletter writers'], website: 'convertkit.com', logo: 'CK', integrations: ['WordPress', 'Shopify', 'Teachable'], pros: ['Creator-focused', 'Simple automation', 'Good support'], cons: ['Limited design options', 'Basic analytics'] },
  { id: 'intercom', name: 'Intercom', description: 'Customer messaging platform for marketing, sales, and support.', subcategory: 'automation', pricing: 'paid', priceRange: '$74+/mo', rating: 4.4, reviews: 6800, features: ['Live Chat', 'Chatbots', 'Product Tours', 'Email', 'Help Center', 'Inbox'], bestFor: ['SaaS companies', 'Product-led growth'], website: 'intercom.com', logo: 'IC', startupDiscount: '95% off for startups', integrations: ['Salesforce', 'Slack', 'HubSpot'], pros: ['Great for SaaS', 'Product tours', 'Modern UI'], cons: ['Expensive', 'Complex pricing'] },
  { id: 'hotjar', name: 'Hotjar', description: 'Behavior analytics with heatmaps, recordings, and feedback tools.', subcategory: 'automation', pricing: 'freemium', priceRange: 'Free-$171/mo', rating: 4.5, reviews: 8500, features: ['Heatmaps', 'Recordings', 'Surveys', 'Feedback', 'Funnels', 'Form Analysis'], bestFor: ['UX teams', 'Conversion optimization', 'Product teams'], website: 'hotjar.com', logo: 'HJ', integrations: ['Google Analytics', 'Slack', 'HubSpot'], pros: ['Visual insights', 'Easy setup', 'Free tier'], cons: ['Can slow site', 'Limited on free'] },
]

export default function MarketingToolsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubcategory, setFilterSubcategory] = useState<string>('all')
  const [filterPricing, setFilterPricing] = useState<string>('all')
  const [savedTools, setSavedTools] = useState<string[]>([])
  const [selectedTool, setSelectedTool] = useState<MarketingTool | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('savedMarketingTools')
    if (saved) setSavedTools(JSON.parse(saved))
  }, [])

  const toggleSave = (id: string) => {
    const updated = savedTools.includes(id) ? savedTools.filter(t => t !== id) : [...savedTools, id]
    setSavedTools(updated)
    localStorage.setItem('savedMarketingTools', JSON.stringify(updated))
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
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/startup/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-pink-500 p-3 rounded-xl text-white"><Target className="h-8 w-8" /></div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text">Marketing Tools</h1>
              <p className="text-gray-600">SEO, social media, email marketing, and growth tools</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {subcategories.map(sub => {
            const Icon = sub.icon
            const count = tools.filter(t => t.subcategory === sub.id).length
            return (
              <button key={sub.id} onClick={() => setFilterSubcategory(filterSubcategory === sub.id ? 'all' : sub.id)}
                className={`p-3 rounded-lg text-center transition-all ${filterSubcategory === sub.id ? 'bg-pink-500 text-white' : 'bg-white border hover:border-pink-300'}`}>
                <Icon className={`h-5 w-5 mx-auto mb-1 ${filterSubcategory === sub.id ? 'text-white' : 'text-pink-600'}`} />
                <div className="text-xs font-medium">{sub.label}</div>
                <div className="text-xs opacity-70">{count}</div>
              </button>
            )
          })}
        </div>

        <SimpleTabs tabs={[{ id: 'all', label: 'All Tools', icon: Target }, { id: 'saved', label: 'Saved', icon: Heart }]} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex flex-wrap gap-2 my-6">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-64" />
          <Select value={filterPricing} onChange={(e) => setFilterPricing(e.target.value)} options={[{ value: 'all', label: 'All Pricing' }, { value: 'free', label: 'Free' }, { value: 'freemium', label: 'Freemium' }, { value: 'paid', label: 'Paid' }]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => (
            <Card key={tool.id} className="p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedTool(tool)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center font-bold text-pink-700">{tool.logo}</div>
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
              {tool.startupDiscount && <div className="mt-3 p-2 bg-pink-50 rounded-lg text-sm text-pink-700"><Zap className="h-4 w-4 inline mr-1" />{tool.startupDiscount}</div>}
            </Card>
          ))}
        </div>

        {selectedTool && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedTool(null)}>
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center font-bold text-pink-700 text-xl">{selectedTool.logo}</div>
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
              {selectedTool.startupDiscount && <div className="p-3 bg-pink-50 rounded-lg mb-4"><Zap className="h-4 w-4 inline text-pink-600 mr-2" /><span className="text-pink-700 font-medium">Startup Discount: {selectedTool.startupDiscount}</span></div>}
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
