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
  Wrench, DollarSign, Target, BarChart3, Settings, Search, Star, StarOff,
  ExternalLink, Check, Users, Zap, Shield, Globe, Clock, Heart, Filter,
  ChevronRight, TrendingUp, Code, MessageCircle, Mail, FileText, Database,
  Briefcase, CreditCard, PieChart, Megaphone, Share2, Calendar, Video
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

type ToolCategory = 'financial' | 'marketing' | 'productivity' | 'analytics' | 'development' | 'communication' | 'sales' | 'hr'
type PricingType = 'free' | 'freemium' | 'paid' | 'enterprise'

interface Tool {
  id: string
  name: string
  description: string
  category: ToolCategory
  subcategory: string
  pricing: PricingType
  priceRange?: string
  rating: number
  reviews: number
  features: string[]
  bestFor: string[]
  website: string
  logo: string
  startupDiscount?: string
  integrations: string[]
  popular: boolean
}

const categoryInfo: Record<ToolCategory, { label: string; icon: typeof Wrench; color: string; description: string }> = {
  'financial': { label: 'Financial', icon: DollarSign, color: 'text-green-600', description: 'Accounting, banking, and invoicing' },
  'marketing': { label: 'Marketing', icon: Target, color: 'text-pink-600', description: 'SEO, social media, and email' },
  'productivity': { label: 'Productivity', icon: Settings, color: 'text-blue-600', description: 'Project management and collaboration' },
  'analytics': { label: 'Analytics', icon: BarChart3, color: 'text-purple-600', description: 'Data tracking and business intelligence' },
  'development': { label: 'Development', icon: Code, color: 'text-orange-600', description: 'Coding, hosting, and DevOps' },
  'communication': { label: 'Communication', icon: MessageCircle, color: 'text-cyan-600', description: 'Team chat and video conferencing' },
  'sales': { label: 'Sales & CRM', icon: Briefcase, color: 'text-amber-600', description: 'CRM and sales automation' },
  'hr': { label: 'HR & Hiring', icon: Users, color: 'text-red-600', description: 'Recruiting and people management' },
}

const tools: Tool[] = [
  // Financial Tools
  { id: 'quickbooks', name: 'QuickBooks', description: 'All-in-one accounting software for small businesses', category: 'financial', subcategory: 'Accounting', pricing: 'paid', priceRange: '$25-$180/mo', rating: 4.5, reviews: 12500, features: ['Invoicing', 'Expense Tracking', 'Payroll', 'Tax Prep', 'Bank Sync'], bestFor: ['Small businesses', 'Freelancers'], website: 'quickbooks.com', logo: 'QB', startupDiscount: '50% off first 3 months', integrations: ['Stripe', 'PayPal', 'Square'], popular: true },
  { id: 'stripe', name: 'Stripe', description: 'Payment processing platform for internet businesses', category: 'financial', subcategory: 'Payments', pricing: 'paid', priceRange: '2.9% + 30¢', rating: 4.8, reviews: 25000, features: ['Payment Processing', 'Subscriptions', 'Invoicing', 'Fraud Prevention', 'Global Payments'], bestFor: ['SaaS', 'E-commerce', 'Marketplaces'], website: 'stripe.com', logo: 'ST', integrations: ['All major platforms'], popular: true },
  { id: 'mercury', name: 'Mercury', description: 'Banking for startups with no fees', category: 'financial', subcategory: 'Banking', pricing: 'free', rating: 4.7, reviews: 3500, features: ['No Fees', 'Virtual Cards', 'Team Cards', 'Treasury', 'API Access'], bestFor: ['Tech startups', 'VC-backed companies'], website: 'mercury.com', logo: 'MC', startupDiscount: 'Free for startups', integrations: ['QuickBooks', 'Xero'], popular: true },
  { id: 'brex', name: 'Brex', description: 'Corporate cards and spend management for startups', category: 'financial', subcategory: 'Expense Management', pricing: 'freemium', rating: 4.6, reviews: 4200, features: ['Corporate Cards', 'Expense Management', 'Rewards', 'Bill Pay', 'Travel'], bestFor: ['Funded startups', 'Fast-growing companies'], website: 'brex.com', logo: 'BX', integrations: ['NetSuite', 'QuickBooks'], popular: true },
  { id: 'xero', name: 'Xero', description: 'Cloud accounting software for small businesses', category: 'financial', subcategory: 'Accounting', pricing: 'paid', priceRange: '$13-$70/mo', rating: 4.4, reviews: 8900, features: ['Invoicing', 'Bank Reconciliation', 'Inventory', 'Projects', 'Payroll'], bestFor: ['Small businesses', 'Accountants'], website: 'xero.com', logo: 'XO', integrations: ['Stripe', 'HubSpot', 'Shopify'], popular: false },
  
  // Marketing Tools
  { id: 'hubspot', name: 'HubSpot', description: 'All-in-one marketing, sales, and service platform', category: 'marketing', subcategory: 'Marketing Automation', pricing: 'freemium', priceRange: 'Free-$3200/mo', rating: 4.5, reviews: 18500, features: ['CRM', 'Email Marketing', 'Landing Pages', 'Analytics', 'Automation'], bestFor: ['B2B companies', 'Inbound marketing'], website: 'hubspot.com', logo: 'HS', startupDiscount: '90% off for startups', integrations: ['Salesforce', 'Slack', 'Zapier'], popular: true },
  { id: 'mailchimp', name: 'Mailchimp', description: 'Email marketing and automation platform', category: 'marketing', subcategory: 'Email Marketing', pricing: 'freemium', priceRange: 'Free-$350/mo', rating: 4.3, reviews: 22000, features: ['Email Campaigns', 'Automation', 'Landing Pages', 'Analytics', 'Audience Segmentation'], bestFor: ['Small businesses', 'E-commerce'], website: 'mailchimp.com', logo: 'MC', integrations: ['Shopify', 'WordPress', 'Canva'], popular: true },
  { id: 'semrush', name: 'SEMrush', description: 'All-in-one SEO and marketing toolkit', category: 'marketing', subcategory: 'SEO', pricing: 'paid', priceRange: '$120-$450/mo', rating: 4.6, reviews: 9800, features: ['Keyword Research', 'Site Audit', 'Competitor Analysis', 'Content Marketing', 'PPC'], bestFor: ['SEO professionals', 'Content marketers'], website: 'semrush.com', logo: 'SR', integrations: ['Google Analytics', 'Google Search Console'], popular: true },
  { id: 'buffer', name: 'Buffer', description: 'Social media scheduling and analytics', category: 'marketing', subcategory: 'Social Media', pricing: 'freemium', priceRange: 'Free-$120/mo', rating: 4.4, reviews: 7500, features: ['Scheduling', 'Analytics', 'Engagement', 'Team Collaboration', 'Landing Pages'], bestFor: ['Social media managers', 'Small teams'], website: 'buffer.com', logo: 'BF', integrations: ['Canva', 'Dropbox', 'Giphy'], popular: false },
  { id: 'canva', name: 'Canva', description: 'Graphic design platform for creating visual content', category: 'marketing', subcategory: 'Design', pricing: 'freemium', priceRange: 'Free-$13/mo', rating: 4.7, reviews: 35000, features: ['Templates', 'Brand Kit', 'Collaboration', 'Video Editing', 'AI Tools'], bestFor: ['Non-designers', 'Social media content'], website: 'canva.com', logo: 'CV', integrations: ['Mailchimp', 'HubSpot', 'Buffer'], popular: true },
  
  // Productivity Tools
  { id: 'notion', name: 'Notion', description: 'All-in-one workspace for notes, docs, and projects', category: 'productivity', subcategory: 'Docs & Notes', pricing: 'freemium', priceRange: 'Free-$15/mo', rating: 4.7, reviews: 28000, features: ['Documents', 'Wikis', 'Projects', 'Databases', 'AI Assistant'], bestFor: ['Startups', 'Remote teams'], website: 'notion.so', logo: 'NT', startupDiscount: 'Free for startups', integrations: ['Slack', 'GitHub', 'Figma'], popular: true },
  { id: 'slack', name: 'Slack', description: 'Team communication and collaboration platform', category: 'productivity', subcategory: 'Team Chat', pricing: 'freemium', priceRange: 'Free-$15/mo', rating: 4.5, reviews: 45000, features: ['Channels', 'DMs', 'File Sharing', 'Huddles', 'Workflow Builder'], bestFor: ['Remote teams', 'All company sizes'], website: 'slack.com', logo: 'SL', integrations: ['Everything'], popular: true },
  { id: 'asana', name: 'Asana', description: 'Project management and team collaboration', category: 'productivity', subcategory: 'Project Management', pricing: 'freemium', priceRange: 'Free-$25/mo', rating: 4.4, reviews: 18000, features: ['Tasks', 'Projects', 'Timelines', 'Portfolios', 'Automation'], bestFor: ['Cross-functional teams', 'Marketing teams'], website: 'asana.com', logo: 'AS', integrations: ['Slack', 'Google Workspace', 'Zoom'], popular: true },
  { id: 'linear', name: 'Linear', description: 'Modern issue tracking for product teams', category: 'productivity', subcategory: 'Issue Tracking', pricing: 'freemium', priceRange: 'Free-$8/mo', rating: 4.9, reviews: 3200, features: ['Issues', 'Cycles', 'Roadmaps', 'Keyboard Shortcuts', 'GitHub Sync'], bestFor: ['Engineering teams', 'Startups'], website: 'linear.app', logo: 'LN', integrations: ['GitHub', 'Figma', 'Slack'], popular: true },
  { id: 'figma', name: 'Figma', description: 'Collaborative design and prototyping tool', category: 'productivity', subcategory: 'Design', pricing: 'freemium', priceRange: 'Free-$75/mo', rating: 4.8, reviews: 22000, features: ['Design', 'Prototyping', 'Dev Mode', 'FigJam', 'Plugins'], bestFor: ['Product teams', 'Designers'], website: 'figma.com', logo: 'FG', startupDiscount: 'Free for 2 years', integrations: ['Slack', 'Jira', 'Notion'], popular: true },
  
  // Analytics Tools
  { id: 'amplitude', name: 'Amplitude', description: 'Product analytics for digital products', category: 'analytics', subcategory: 'Product Analytics', pricing: 'freemium', priceRange: 'Free-Custom', rating: 4.6, reviews: 5600, features: ['Event Tracking', 'User Journeys', 'Cohorts', 'A/B Testing', 'Predictions'], bestFor: ['Product teams', 'Growth teams'], website: 'amplitude.com', logo: 'AM', startupDiscount: '$25K in credits', integrations: ['Segment', 'Snowflake', 'BigQuery'], popular: true },
  { id: 'mixpanel', name: 'Mixpanel', description: 'Product analytics for conversion and retention', category: 'analytics', subcategory: 'Product Analytics', pricing: 'freemium', priceRange: 'Free-$25/mo', rating: 4.5, reviews: 4800, features: ['Funnels', 'Retention', 'User Profiles', 'Flows', 'Experimentation'], bestFor: ['Mobile apps', 'SaaS products'], website: 'mixpanel.com', logo: 'MX', startupDiscount: '$50K in credits', integrations: ['Segment', 'mParticle'], popular: true },
  { id: 'posthog', name: 'PostHog', description: 'Open-source product analytics suite', category: 'analytics', subcategory: 'Product Analytics', pricing: 'freemium', priceRange: 'Free-Custom', rating: 4.7, reviews: 1800, features: ['Analytics', 'Session Recording', 'Feature Flags', 'A/B Testing', 'Surveys'], bestFor: ['Developers', 'Privacy-focused teams'], website: 'posthog.com', logo: 'PH', integrations: ['Everything via API'], popular: true },
  { id: 'segment', name: 'Segment', description: 'Customer data platform for data collection', category: 'analytics', subcategory: 'Data Infrastructure', pricing: 'freemium', priceRange: 'Free-Custom', rating: 4.4, reviews: 3500, features: ['Data Collection', 'Destinations', 'Audiences', 'Protocols', 'Privacy'], bestFor: ['Data-driven companies', 'Multi-tool stacks'], website: 'segment.com', logo: 'SG', startupDiscount: '$25K in credits', integrations: ['300+ integrations'], popular: true },
  
  // Development Tools
  { id: 'vercel', name: 'Vercel', description: 'Frontend cloud platform for web development', category: 'development', subcategory: 'Hosting', pricing: 'freemium', priceRange: 'Free-$20/mo', rating: 4.8, reviews: 8500, features: ['Edge Functions', 'Analytics', 'Preview Deploys', 'Serverless', 'CDN'], bestFor: ['Frontend developers', 'Next.js apps'], website: 'vercel.com', logo: 'VC', integrations: ['GitHub', 'GitLab', 'Bitbucket'], popular: true },
  { id: 'github', name: 'GitHub', description: 'Code hosting and collaboration platform', category: 'development', subcategory: 'Version Control', pricing: 'freemium', priceRange: 'Free-$21/mo', rating: 4.8, reviews: 55000, features: ['Repositories', 'Actions', 'Copilot', 'Security', 'Codespaces'], bestFor: ['All developers'], website: 'github.com', logo: 'GH', integrations: ['Everything'], popular: true },
  { id: 'aws', name: 'AWS', description: 'Cloud computing services platform', category: 'development', subcategory: 'Cloud', pricing: 'paid', priceRange: 'Pay-as-you-go', rating: 4.5, reviews: 42000, features: ['Compute', 'Storage', 'Database', 'AI/ML', 'Security'], bestFor: ['Enterprise', 'Scalable apps'], website: 'aws.amazon.com', logo: 'AW', startupDiscount: '$100K in credits', integrations: ['Everything'], popular: true },
  
  // Communication Tools
  { id: 'zoom', name: 'Zoom', description: 'Video conferencing and webinar platform', category: 'communication', subcategory: 'Video Conferencing', pricing: 'freemium', priceRange: 'Free-$20/mo', rating: 4.4, reviews: 52000, features: ['Video Meetings', 'Webinars', 'Chat', 'Phone', 'Whiteboard'], bestFor: ['Remote teams', 'All company sizes'], website: 'zoom.us', logo: 'ZM', integrations: ['Slack', 'Google Calendar', 'Salesforce'], popular: true },
  { id: 'loom', name: 'Loom', description: 'Async video messaging for work', category: 'communication', subcategory: 'Video Messaging', pricing: 'freemium', priceRange: 'Free-$15/mo', rating: 4.7, reviews: 8200, features: ['Screen Recording', 'Video Messages', 'Analytics', 'Transcripts', 'Comments'], bestFor: ['Remote teams', 'Async communication'], website: 'loom.com', logo: 'LM', startupDiscount: 'Free for startups', integrations: ['Slack', 'Notion', 'Gmail'], popular: true },
  
  // Sales & CRM Tools
  { id: 'salesforce', name: 'Salesforce', description: 'Enterprise CRM and sales platform', category: 'sales', subcategory: 'CRM', pricing: 'paid', priceRange: '$25-$300/mo', rating: 4.3, reviews: 38000, features: ['CRM', 'Sales Cloud', 'Marketing Cloud', 'Service Cloud', 'AI'], bestFor: ['Enterprise sales', 'Large teams'], website: 'salesforce.com', logo: 'SF', integrations: ['Everything'], popular: true },
  { id: 'pipedrive', name: 'Pipedrive', description: 'Sales CRM designed by salespeople', category: 'sales', subcategory: 'CRM', pricing: 'paid', priceRange: '$15-$99/mo', rating: 4.5, reviews: 12500, features: ['Pipeline Management', 'Email Integration', 'Automation', 'Reports', 'Mobile App'], bestFor: ['SMB sales teams', 'Sales-focused companies'], website: 'pipedrive.com', logo: 'PD', integrations: ['Slack', 'Zoom', 'Mailchimp'], popular: false },
  
  // HR Tools
  { id: 'gusto', name: 'Gusto', description: 'Payroll, benefits, and HR platform', category: 'hr', subcategory: 'Payroll', pricing: 'paid', priceRange: '$40+/mo', rating: 4.6, reviews: 8500, features: ['Payroll', 'Benefits', 'HR', 'Time Tracking', 'Hiring'], bestFor: ['Small businesses', 'Startups'], website: 'gusto.com', logo: 'GT', integrations: ['QuickBooks', 'Xero', 'Slack'], popular: true },
  { id: 'rippling', name: 'Rippling', description: 'HR, IT, and Finance platform for businesses', category: 'hr', subcategory: 'HRIS', pricing: 'paid', priceRange: '$8+/mo per user', rating: 4.8, reviews: 4200, features: ['HR', 'IT', 'Payroll', 'Benefits', 'Device Management'], bestFor: ['Growing startups', 'Tech companies'], website: 'rippling.com', logo: 'RP', integrations: ['Everything'], popular: true },
]

export default function ToolsHubPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterPricing, setFilterPricing] = useState<string>('all')
  const [savedTools, setSavedTools] = useState<string[]>([])
  const [compareTools, setCompareTools] = useState<string[]>([])

  const tabs = [
    { id: 'all', label: 'All Tools', icon: Wrench },
    { id: 'popular', label: 'Popular', icon: TrendingUp },
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('savedTools')
    if (saved) setSavedTools(JSON.parse(saved))
  }, [])

  const toggleSave = (id: string) => {
    const updated = savedTools.includes(id) ? savedTools.filter(t => t !== id) : [...savedTools, id]
    setSavedTools(updated)
    localStorage.setItem('savedTools', JSON.stringify(updated))
    showToast(savedTools.includes(id) ? 'Removed from saved' : 'Saved!', 'success')
  }

  const toggleCompare = (id: string) => {
    if (compareTools.includes(id)) {
      setCompareTools(compareTools.filter(t => t !== id))
    } else if (compareTools.length < 3) {
      setCompareTools([...compareTools, id])
    } else {
      showToast('Maximum 3 tools for comparison', 'error')
    }
  }

  const filteredTools = tools.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory
    const matchesPricing = filterPricing === 'all' || t.pricing === filterPricing
    const matchesTab = activeTab === 'all' || (activeTab === 'popular' && t.popular) || (activeTab === 'saved' && savedTools.includes(t.id))
    return matchesSearch && matchesCategory && matchesPricing && matchesTab
  })

  const compareToolsData = tools.filter(t => compareTools.includes(t.id))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wrench className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Recommended Tools & Software
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the best tools for your startup. Curated recommendations with exclusive startup discounts.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {Object.entries(categoryInfo).map(([key, info]) => {
            const Icon = info.icon
            const count = tools.filter(t => t.category === key).length
            return (
              <button key={key} onClick={() => { setFilterCategory(key); setActiveTab('all') }}
                className={`p-3 rounded-lg text-center transition-all ${filterCategory === key ? 'bg-primary-500 text-white' : 'bg-white border hover:border-primary-300'}`}>
                <Icon className={`h-5 w-5 mx-auto mb-1 ${filterCategory === key ? 'text-white' : info.color}`} />
                <div className="text-xs font-medium">{info.label}</div>
                <div className="text-xs opacity-70">{count} tools</div>
              </button>
            )
          })}
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tools..." className="w-64" />
          <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            options={[{ value: 'all', label: 'All Categories' }, ...Object.entries(categoryInfo).map(([k, v]) => ({ value: k, label: v.label }))]} />
          <Select value={filterPricing} onChange={(e) => setFilterPricing(e.target.value)}
            options={[{ value: 'all', label: 'All Pricing' }, { value: 'free', label: 'Free' }, { value: 'freemium', label: 'Freemium' }, { value: 'paid', label: 'Paid' }]} />
          {filterCategory !== 'all' && <Button variant="ghost" size="sm" onClick={() => setFilterCategory('all')}>Clear Filters</Button>}
        </div>

        {activeTab === 'compare' && compareTools.length > 0 ? (
          <Card className="mb-8">
            <h3 className="text-xl font-bold mb-4">Tool Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="p-3 text-left">Feature</th>{compareToolsData.map(t => <th key={t.id} className="p-3 text-left">{t.name}</th>)}</tr></thead>
                <tbody>
                  <tr className="border-b"><td className="p-3 font-medium">Category</td>{compareToolsData.map(t => <td key={t.id} className="p-3">{categoryInfo[t.category].label}</td>)}</tr>
                  <tr className="border-b"><td className="p-3 font-medium">Pricing</td>{compareToolsData.map(t => <td key={t.id} className="p-3">{t.priceRange || t.pricing}</td>)}</tr>
                  <tr className="border-b"><td className="p-3 font-medium">Rating</td>{compareToolsData.map(t => <td key={t.id} className="p-3">⭐ {t.rating} ({t.reviews.toLocaleString()})</td>)}</tr>
                  <tr className="border-b"><td className="p-3 font-medium">Best For</td>{compareToolsData.map(t => <td key={t.id} className="p-3">{t.bestFor.join(', ')}</td>)}</tr>
                  <tr><td className="p-3 font-medium">Startup Discount</td>{compareToolsData.map(t => <td key={t.id} className="p-3 text-green-600">{t.startupDiscount || 'None'}</td>)}</tr>
                </tbody>
              </table>
            </div>
            <Button variant="outline" className="mt-4" onClick={() => setCompareTools([])}>Clear Comparison</Button>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => {
            const CategoryIcon = categoryInfo[tool.category].icon
            return (
              <Card key={tool.id} className="p-4 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center font-bold text-gray-700">{tool.logo}</div>
                    <div>
                      <h3 className="font-semibold">{tool.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <CategoryIcon className={`h-3 w-3 ${categoryInfo[tool.category].color}`} />
                        <span>{tool.subcategory}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => toggleSave(tool.id)} className="text-gray-400 hover:text-red-500">
                    {savedTools.includes(tool.id) ? <Heart className="h-5 w-5 fill-current text-red-500" /> : <Heart className="h-5 w-5" />}
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-3">{tool.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={tool.pricing === 'free' ? 'new' : tool.pricing === 'freemium' ? 'featured' : 'outline'}>{tool.pricing}</Badge>
                  {tool.priceRange && <span className="text-sm text-gray-500">{tool.priceRange}</span>}
                  {tool.popular && <Badge className="bg-orange-100 text-orange-700">Popular</Badge>}
                </div>

                <div className="flex items-center gap-2 mb-3 text-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{tool.rating}</span>
                  <span className="text-gray-400">({tool.reviews.toLocaleString()} reviews)</span>
                </div>

                {tool.startupDiscount && (
                  <div className="p-2 bg-green-50 rounded-lg text-sm text-green-700 mb-3">
                    <Zap className="h-4 w-4 inline mr-1" />Startup: {tool.startupDiscount}
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mb-4">
                  {tool.features.slice(0, 3).map((f, i) => <Badge key={i} variant="outline" className="text-xs">{f}</Badge>)}
                  {tool.features.length > 3 && <Badge variant="outline" className="text-xs">+{tool.features.length - 3}</Badge>}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(`https://${tool.website}`, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-1" /> Visit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleCompare(tool.id)} className={compareTools.includes(tool.id) ? 'bg-primary-100' : ''}>
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Wrench className="h-16 w-16 mx-auto mb-4" />
            <p>No tools found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  )
}

