'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Target, 
  TrendingUp, 
  Users,
  DollarSign,
  BarChart3,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Sparkles,
  Calculator,
  BookOpen,
  Download,
  Share2,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Megaphone,
  Mail,
  Video,
  Image,
  Search,
  MessageSquare,
  Zap,
  FileText,
  Settings,
  PieChart,
  Shield,
  Star,
  Globe,
  Lightbulb,
  User,
  Heart,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Copy,
  ExternalLink
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

type ChannelType = 'seo' | 'social-media' | 'paid-ads' | 'email' | 'content' | 'influencer' | 'pr' | 'events' | 'affiliate' | 'other'
type CampaignStatus = 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'
type StrategyFramework = 'aarrr' | 'rice' | 'growth-funnel' | 'content-marketing' | 'social-media' | 'paid-ads'
type ContentType = 'blog' | 'social' | 'video' | 'email' | 'webinar' | 'podcast' | 'infographic' | 'whitepaper'
type ContentStatus = 'idea' | 'planning' | 'in-progress' | 'review' | 'scheduled' | 'published'

interface MarketingChannel {
  id: string
  type: ChannelType
  name: string
  description: string
  budget: number
  monthlyBudget: number
  targetAudience: string
  goals: string[]
  kpis: string[]
  status: CampaignStatus
  startDate: string
  endDate?: string
  notes?: string
  created: string
  modified: string
}

interface Campaign {
  id: string
  name: string
  description: string
  channels: string[]
  budget: number
  status: CampaignStatus
  startDate: string
  endDate: string
  targetAudience: string
  goals: string[]
  metrics: {
    impressions?: number
    clicks?: number
    conversions?: number
    revenue?: number
    ctr?: number
    cpc?: number
    roas?: number
  }
  notes?: string
  created: string
  modified: string
}

interface Competitor {
  id: string
  name: string
  website: string
  description: string
  strengths: string[]
  weaknesses: string[]
  channels: ChannelType[]
  pricePosition: 'budget' | 'mid-market' | 'premium' | 'enterprise'
  marketShare: number
  rating: number
  notes?: string
  created: string
}

interface CustomerPersona {
  id: string
  name: string
  avatar: string
  demographics: {
    age: string
    gender: string
    location: string
    income: string
    education: string
    occupation: string
  }
  psychographics: {
    goals: string[]
    challenges: string[]
    values: string[]
    fears: string[]
    motivations: string[]
  }
  behaviors: {
    preferredChannels: ChannelType[]
    buyingBehavior: string
    decisionFactors: string[]
    contentPreferences: ContentType[]
  }
  created: string
}

interface ContentItem {
  id: string
  title: string
  type: ContentType
  channel: ChannelType
  status: ContentStatus
  author: string
  dueDate: string
  publishDate?: string
  description: string
  keywords: string[]
  persona?: string
  notes?: string
  created: string
}

interface StrategyTemplate {
  id: StrategyFramework
  name: string
  description: string
  framework: string
  steps: string[]
  channels: ChannelType[]
  icon: typeof Target
}

const strategyTemplates: StrategyTemplate[] = [
  {
    id: 'aarrr',
    name: 'AARRR Framework',
    description: 'Pirate Metrics: Acquisition, Activation, Retention, Revenue, Referral',
    framework: 'AARRR',
    steps: [
      'Acquisition: How do users find you?',
      'Activation: Do users have a great first experience?',
      'Retention: Do users come back?',
      'Revenue: How do you make money?',
      'Referral: Do users tell others?'
    ],
    channels: ['seo', 'social-media', 'paid-ads', 'email', 'content'],
    icon: Target
  },
  {
    id: 'rice',
    name: 'RICE Prioritization',
    description: 'Reach, Impact, Confidence, Effort - Prioritize marketing initiatives',
    framework: 'RICE',
    steps: [
      'Reach: How many people will this reach?',
      'Impact: How much will this impact each person?',
      'Confidence: How confident are you in estimates?',
      'Effort: How much effort will this take?'
    ],
    channels: ['seo', 'content', 'social-media', 'paid-ads'],
    icon: TrendingUp
  },
  {
    id: 'growth-funnel',
    name: 'Growth Funnel Strategy',
    description: 'Awareness → Interest → Consideration → Purchase → Loyalty',
    framework: 'Funnel',
    steps: [
      'Awareness: Top of funnel - brand awareness',
      'Interest: Middle of funnel - engagement',
      'Consideration: Bottom of funnel - evaluation',
      'Purchase: Conversion and sales',
      'Loyalty: Retention and advocacy'
    ],
    channels: ['seo', 'social-media', 'paid-ads', 'email', 'content'],
    icon: BarChart3
  },
  {
    id: 'content-marketing',
    name: 'Content Marketing Strategy',
    description: 'Create and distribute valuable content to attract and retain customers',
    framework: 'Content',
    steps: [
      'Define content goals and audience',
      'Create content calendar',
      'Produce high-quality content',
      'Distribute across channels',
      'Measure and optimize performance'
    ],
    channels: ['content', 'seo', 'social-media', 'email'],
    icon: FileText
  },
  {
    id: 'social-media',
    name: 'Social Media Strategy',
    description: 'Build brand presence and engage audiences on social platforms',
    framework: 'Social',
    steps: [
      'Choose relevant platforms',
      'Define brand voice and style',
      'Create content calendar',
      'Engage with audience',
      'Analyze and optimize'
    ],
    channels: ['social-media', 'influencer', 'content'],
    icon: MessageSquare
  },
  {
    id: 'paid-ads',
    name: 'Paid Advertising Strategy',
    description: 'Maximize ROI from paid advertising campaigns',
    framework: 'Paid',
    steps: [
      'Define campaign objectives',
      'Identify target audience',
      'Choose ad platforms',
      'Create ad creatives',
      'Set budgets and bids',
      'Monitor and optimize'
    ],
    channels: ['paid-ads', 'seo', 'social-media'],
    icon: Megaphone
  }
]

const channelLabels: Record<ChannelType, string> = {
  'seo': 'SEO',
  'social-media': 'Social Media',
  'paid-ads': 'Paid Ads',
  'email': 'Email Marketing',
  'content': 'Content Marketing',
  'influencer': 'Influencer Marketing',
  'pr': 'PR & Media',
  'events': 'Events & Webinars',
  'affiliate': 'Affiliate Marketing',
  'other': 'Other'
}

const statusLabels: Record<CampaignStatus, string> = {
  'planning': 'Planning',
  'active': 'Active',
  'paused': 'Paused',
  'completed': 'Completed',
  'cancelled': 'Cancelled'
}

const statusColors: Record<CampaignStatus, string> = {
  'planning': 'bg-gray-100 text-gray-800',
  'active': 'bg-green-100 text-green-800',
  'paused': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-blue-100 text-blue-800',
  'cancelled': 'bg-red-100 text-red-800'
}

const contentTypeLabels: Record<ContentType, string> = {
  'blog': 'Blog Post',
  'social': 'Social Post',
  'video': 'Video',
  'email': 'Email',
  'webinar': 'Webinar',
  'podcast': 'Podcast',
  'infographic': 'Infographic',
  'whitepaper': 'Whitepaper'
}

const contentStatusLabels: Record<ContentStatus, string> = {
  'idea': 'Idea',
  'planning': 'Planning',
  'in-progress': 'In Progress',
  'review': 'Review',
  'scheduled': 'Scheduled',
  'published': 'Published'
}

const contentStatusColors: Record<ContentStatus, string> = {
  'idea': 'bg-purple-100 text-purple-800',
  'planning': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'review': 'bg-yellow-100 text-yellow-800',
  'scheduled': 'bg-orange-100 text-orange-800',
  'published': 'bg-green-100 text-green-800'
}

const avatarOptions = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '👨‍🔬', '👩‍🔬', '🧑‍💼', '🧑‍💻']

export default function MarketingStrategyPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [channels, setChannels] = useState<MarketingChannel[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [personas, setPersonas] = useState<CustomerPersona[]>([])
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [editingChannel, setEditingChannel] = useState<MarketingChannel | null>(null)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null)
  const [editingPersona, setEditingPersona] = useState<CustomerPersona | null>(null)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<StrategyFramework | null>(null)
  const [formData, setFormData] = useState({
    type: 'seo' as ChannelType,
    name: '',
    description: '',
    budget: '',
    monthlyBudget: '',
    targetAudience: '',
    goals: [] as string[],
    kpis: [] as string[],
    status: 'planning' as CampaignStatus,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  })
  const [competitorForm, setCompetitorForm] = useState({
    name: '',
    website: '',
    description: '',
    strengths: [] as string[],
    weaknesses: [] as string[],
    channels: [] as ChannelType[],
    pricePosition: 'mid-market' as 'budget' | 'mid-market' | 'premium' | 'enterprise',
    marketShare: '',
    rating: '',
    notes: ''
  })
  const [personaForm, setPersonaForm] = useState({
    name: '',
    avatar: '👨‍💼',
    age: '',
    gender: '',
    location: '',
    income: '',
    education: '',
    occupation: '',
    goals: [] as string[],
    challenges: [] as string[],
    values: [] as string[],
    fears: [] as string[],
    motivations: [] as string[],
    preferredChannels: [] as ChannelType[],
    buyingBehavior: '',
    decisionFactors: [] as string[],
    contentPreferences: [] as ContentType[]
  })
  const [contentForm, setContentForm] = useState({
    title: '',
    type: 'blog' as ContentType,
    channel: 'content' as ChannelType,
    status: 'idea' as ContentStatus,
    author: '',
    dueDate: new Date().toISOString().split('T')[0],
    publishDate: '',
    description: '',
    keywords: [] as string[],
    persona: '',
    notes: ''
  })
  const [newGoal, setNewGoal] = useState('')
  const [newKpi, setNewKpi] = useState('')
  const [newStrength, setNewStrength] = useState('')
  const [newWeakness, setNewWeakness] = useState('')
  const [newKeyword, setNewKeyword] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('month')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'channels', label: 'Channels', icon: Megaphone },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'competitors', label: 'Competitors', icon: Shield },
    { id: 'personas', label: 'Personas', icon: Users },
    { id: 'content', label: 'Content Calendar', icon: Calendar },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'budget', label: 'Budget', icon: DollarSign },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('marketingStrategyDataV2')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.channels) setChannels(data.channels)
          if (data.campaigns) setCampaigns(data.campaigns)
          if (data.competitors) setCompetitors(data.competitors)
          if (data.personas) setPersonas(data.personas)
          if (data.contentItems) setContentItems(data.contentItems)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        channels,
        campaigns,
        competitors,
        personas,
        contentItems,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('marketingStrategyDataV2', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const addChannel = () => {
    if (!formData.name || !formData.description) {
      showToast('Please fill in name and description', 'error')
      return
    }

    const newChannel: MarketingChannel = {
      id: Date.now().toString(),
      type: formData.type,
      name: formData.name,
      description: formData.description,
      budget: parseFloat(formData.budget) || 0,
      monthlyBudget: parseFloat(formData.monthlyBudget) || 0,
      targetAudience: formData.targetAudience,
      goals: formData.goals,
      kpis: formData.kpis,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      notes: formData.notes || undefined,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }

    setChannels([...channels, newChannel])
    resetForm()
    saveToLocalStorage()
    showToast('Marketing channel added!', 'success')
  }

  const updateChannel = () => {
    if (!editingChannel) return

    const updated: MarketingChannel = {
      ...editingChannel,
      type: formData.type,
      name: formData.name,
      description: formData.description,
      budget: parseFloat(formData.budget) || 0,
      monthlyBudget: parseFloat(formData.monthlyBudget) || 0,
      targetAudience: formData.targetAudience,
      goals: formData.goals,
      kpis: formData.kpis,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      notes: formData.notes || undefined,
      modified: new Date().toISOString()
    }

    const updatedChannels = channels.map(c => c.id === editingChannel.id ? updated : c)
    setChannels(updatedChannels)
    setEditingChannel(null)
    resetForm()
    saveToLocalStorage()
    showToast('Channel updated!', 'success')
  }

  const deleteChannel = (id: string) => {
    if (confirm('Are you sure you want to delete this channel?')) {
      const updated = channels.filter(c => c.id !== id)
      setChannels(updated)
      saveToLocalStorage()
      showToast('Channel deleted', 'info')
    }
  }

  const addCompetitor = () => {
    if (!competitorForm.name || !competitorForm.website) {
      showToast('Please fill in name and website', 'error')
      return
    }

    const newCompetitor: Competitor = {
      id: Date.now().toString(),
      name: competitorForm.name,
      website: competitorForm.website,
      description: competitorForm.description,
      strengths: competitorForm.strengths,
      weaknesses: competitorForm.weaknesses,
      channels: competitorForm.channels,
      pricePosition: competitorForm.pricePosition,
      marketShare: parseFloat(competitorForm.marketShare) || 0,
      rating: parseFloat(competitorForm.rating) || 0,
      notes: competitorForm.notes || undefined,
      created: new Date().toISOString()
    }

    setCompetitors([...competitors, newCompetitor])
    setEditingCompetitor(null)
    resetCompetitorForm()
    saveToLocalStorage()
    showToast('Competitor added!', 'success')
  }

  const deleteCompetitor = (id: string) => {
    if (confirm('Are you sure you want to delete this competitor?')) {
      setCompetitors(competitors.filter(c => c.id !== id))
      saveToLocalStorage()
      showToast('Competitor deleted', 'info')
    }
  }

  const addPersona = () => {
    if (!personaForm.name) {
      showToast('Please enter persona name', 'error')
      return
    }

    const newPersona: CustomerPersona = {
      id: Date.now().toString(),
      name: personaForm.name,
      avatar: personaForm.avatar,
      demographics: {
        age: personaForm.age,
        gender: personaForm.gender,
        location: personaForm.location,
        income: personaForm.income,
        education: personaForm.education,
        occupation: personaForm.occupation
      },
      psychographics: {
        goals: personaForm.goals,
        challenges: personaForm.challenges,
        values: personaForm.values,
        fears: personaForm.fears,
        motivations: personaForm.motivations
      },
      behaviors: {
        preferredChannels: personaForm.preferredChannels,
        buyingBehavior: personaForm.buyingBehavior,
        decisionFactors: personaForm.decisionFactors,
        contentPreferences: personaForm.contentPreferences
      },
      created: new Date().toISOString()
    }

    setPersonas([...personas, newPersona])
    setEditingPersona(null)
    resetPersonaForm()
    saveToLocalStorage()
    showToast('Customer persona added!', 'success')
  }

  const deletePersona = (id: string) => {
    if (confirm('Are you sure you want to delete this persona?')) {
      setPersonas(personas.filter(p => p.id !== id))
      saveToLocalStorage()
      showToast('Persona deleted', 'info')
    }
  }

  const addContentItem = () => {
    if (!contentForm.title) {
      showToast('Please enter content title', 'error')
      return
    }

    const newContent: ContentItem = {
      id: Date.now().toString(),
      title: contentForm.title,
      type: contentForm.type,
      channel: contentForm.channel,
      status: contentForm.status,
      author: contentForm.author,
      dueDate: contentForm.dueDate,
      publishDate: contentForm.publishDate || undefined,
      description: contentForm.description,
      keywords: contentForm.keywords,
      persona: contentForm.persona || undefined,
      notes: contentForm.notes || undefined,
      created: new Date().toISOString()
    }

    setContentItems([...contentItems, newContent])
    setEditingContent(null)
    resetContentForm()
    saveToLocalStorage()
    showToast('Content item added!', 'success')
  }

  const updateContentStatus = (id: string, status: ContentStatus) => {
    const updated = contentItems.map(c => c.id === id ? { ...c, status } : c)
    setContentItems(updated)
    saveToLocalStorage()
    showToast('Content status updated!', 'success')
  }

  const deleteContentItem = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      setContentItems(contentItems.filter(c => c.id !== id))
      saveToLocalStorage()
      showToast('Content deleted', 'info')
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'seo',
      name: '',
      description: '',
      budget: '',
      monthlyBudget: '',
      targetAudience: '',
      goals: [],
      kpis: [],
      status: 'planning',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    })
    setNewGoal('')
    setNewKpi('')
  }

  const resetCompetitorForm = () => {
    setCompetitorForm({
      name: '',
      website: '',
      description: '',
      strengths: [],
      weaknesses: [],
      channels: [],
      pricePosition: 'mid-market',
      marketShare: '',
      rating: '',
      notes: ''
    })
    setNewStrength('')
    setNewWeakness('')
  }

  const resetPersonaForm = () => {
    setPersonaForm({
      name: '',
      avatar: '👨‍💼',
      age: '',
      gender: '',
      location: '',
      income: '',
      education: '',
      occupation: '',
      goals: [],
      challenges: [],
      values: [],
      fears: [],
      motivations: [],
      preferredChannels: [],
      buyingBehavior: '',
      decisionFactors: [],
      contentPreferences: []
    })
  }

  const resetContentForm = () => {
    setContentForm({
      title: '',
      type: 'blog',
      channel: 'content',
      status: 'idea',
      author: '',
      dueDate: new Date().toISOString().split('T')[0],
      publishDate: '',
      description: '',
      keywords: [],
      persona: '',
      notes: ''
    })
    setNewKeyword('')
  }

  const loadTemplate = (templateId: StrategyFramework) => {
    const template = strategyTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      showToast(`${template.name} template loaded!`, 'success')
    }
  }

  const calculateTotalBudget = () => {
    return channels.reduce((sum, c) => sum + c.budget, 0) + campaigns.reduce((sum, c) => sum + c.budget, 0)
  }

  const calculateMonthlyBudget = () => {
    return channels.reduce((sum, c) => sum + c.monthlyBudget, 0)
  }

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         channel.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || channel.type === filterType
    const matchesStatus = filterStatus === 'all' || channel.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const channelBudgetData = Object.entries(
    channels.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + c.budget
      return acc
    }, {} as Record<ChannelType, number>)
  ).map(([type, budget]) => ({
    name: channelLabels[type as ChannelType],
    budget
  }))

  const campaignStatusData = Object.entries(
    campaigns.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1
      return acc
    }, {} as Record<CampaignStatus, number>)
  ).map(([status, count]) => ({
    name: statusLabels[status as CampaignStatus],
    count
  }))

  const contentByStatusData = Object.entries(
    contentItems.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1
      return acc
    }, {} as Record<ContentStatus, number>)
  ).map(([status, count]) => ({
    name: contentStatusLabels[status as ContentStatus],
    count
  }))

  const competitorRadarData = competitors.map(c => ({
    name: c.name,
    marketShare: c.marketShare,
    rating: c.rating * 20,
    channels: c.channels.length * 10
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1']

  const getContentItemsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return contentItems.filter(c => c.dueDate === dateStr || c.publishDate === dateStr)
  }

  const generateCalendarDays = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const days: Date[] = []
    
    // Add padding days from previous month
    const startPadding = firstDay.getDay()
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(firstDay)
      d.setDate(d.getDate() - i - 1)
      days.push(d)
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(today.getFullYear(), today.getMonth(), i))
    }
    
    // Add padding days for next month
    const endPadding = 42 - days.length
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, i))
    }
    
    return days
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Marketing Strategy Builder
              </span>
          </h1>
            <Target className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build comprehensive marketing strategies with competitor analysis, customer personas, and content planning
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={saveToLocalStorage} className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Megaphone className="h-5 w-5 text-blue-500" />
                  <div className="text-sm text-gray-600">Channels</div>
                </div>
                <div className="text-2xl font-bold">{channels.length}</div>
                <div className="text-xs text-gray-500">{channels.filter(c => c.status === 'active').length} active</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <div className="text-sm text-gray-600">Competitors</div>
                </div>
                <div className="text-2xl font-bold">{competitors.length}</div>
                <div className="text-xs text-gray-500">Tracked</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <div className="text-sm text-gray-600">Personas</div>
                </div>
                <div className="text-2xl font-bold">{personas.length}</div>
                <div className="text-xs text-gray-500">Created</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <div className="text-sm text-gray-600">Content Items</div>
                </div>
                <div className="text-2xl font-bold">{contentItems.length}</div>
                <div className="text-xs text-gray-500">{contentItems.filter(c => c.status === 'published').length} published</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Budget by Channel</h3>
                {channelBudgetData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={channelBudgetData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="budget"
                      >
                        {channelBudgetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <PieChart className="h-12 w-12 mx-auto mb-2" />
                    <p>No budget data yet</p>
                  </div>
                )}
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Content Pipeline</h3>
                {contentByStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={contentByStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto mb-2" />
                    <p>No content items yet</p>
                  </div>
                )}
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('channels')}>
                    <Plus className="h-4 w-4 mr-2" /> Add Marketing Channel
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('competitors')}>
                    <Plus className="h-4 w-4 mr-2" /> Add Competitor
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('personas')}>
                    <Plus className="h-4 w-4 mr-2" /> Create Persona
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('content')}>
                    <Plus className="h-4 w-4 mr-2" /> Schedule Content
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Recent Content</h3>
                {contentItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-2" />
                    <p>No content items yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {contentItems.slice(0, 5).map((content) => (
                      <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{content.title}</div>
                          <div className="text-xs text-gray-500">{contentTypeLabels[content.type]}</div>
                        </div>
                        <Badge className={`text-xs ${contentStatusColors[content.status]}`}>
                          {contentStatusLabels[content.status]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Channels Tab */}
        {activeTab === 'channels' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Megaphone className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Marketing Channels</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search channels..."
                    className="w-48"
                  />
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Types' },
                      ...Object.entries(channelLabels).map(([value, label]) => ({ value, label }))
                    ]}
                  />
                  <Button
                    onClick={() => {
                      setEditingChannel({
                        id: '',
                        type: 'seo',
                        name: '',
                        description: '',
                        budget: 0,
                        monthlyBudget: 0,
                        targetAudience: '',
                        goals: [],
                        kpis: [],
                        status: 'planning',
                        startDate: new Date().toISOString().split('T')[0],
                        created: new Date().toISOString(),
                        modified: new Date().toISOString()
                      })
                      resetForm()
                    }}
                    size="sm"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Channel
                  </Button>
                </div>
              </div>

              {filteredChannels.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Megaphone className="h-16 w-16 mx-auto mb-4" />
                  <p>No channels found. Add your first marketing channel to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredChannels.map((channel) => (
                    <Card key={channel.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{channel.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {channelLabels[channel.type]}
                            </Badge>
                            <Badge className={`text-xs ${statusColors[channel.status]}`}>
                              {statusLabels[channel.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Budget:</span> ${channel.budget.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Monthly:</span> ${channel.monthlyBudget.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Start:</span> {new Date(channel.startDate).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Goals:</span> {channel.goals.length}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingChannel(channel)
                              setFormData({
                                type: channel.type,
                                name: channel.name,
                                description: channel.description,
                                budget: channel.budget.toString(),
                                monthlyBudget: channel.monthlyBudget.toString(),
                                targetAudience: channel.targetAudience,
                                goals: channel.goals,
                                kpis: channel.kpis,
                                status: channel.status,
                                startDate: channel.startDate,
                                endDate: channel.endDate || '',
                                notes: channel.notes || ''
                              })
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteChannel(channel.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {editingChannel && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingChannel.id ? 'Edit Channel' : 'Add Channel'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setEditingChannel(null)
                    resetForm()
                  }}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Channel Type *</label>
                      <Select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as ChannelType })}
                        options={Object.entries(channelLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Channel Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Google Ads Campaign"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the marketing channel..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget ($)</label>
                      <Input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget ($)</label>
                      <Input
                        type="number"
                        value={formData.monthlyBudget}
                        onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                      <Select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as CampaignStatus })}
                        options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={editingChannel.id ? updateChannel : addChannel} className="flex-1">
                      {editingChannel.id ? 'Update Channel' : 'Add Channel'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setEditingChannel(null)
                      resetForm()
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Competitor Analysis</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingCompetitor({
                      id: '',
                      name: '',
                      website: '',
                      description: '',
                      strengths: [],
                      weaknesses: [],
                      channels: [],
                      pricePosition: 'mid-market',
                      marketShare: 0,
                      rating: 0,
                      created: new Date().toISOString()
                    })
                    resetCompetitorForm()
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competitor
                </Button>
              </div>

              {competitors.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Shield className="h-16 w-16 mx-auto mb-4" />
                  <p>No competitors tracked yet. Add your first competitor to start analysis.</p>
                </div>
              ) : (
                <>
                  {competitorRadarData.length > 2 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Competitor Comparison</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={competitorRadarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="name" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="Market Share" dataKey="marketShare" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                          <Radar name="Rating" dataKey="rating" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                          <Radar name="Channels" dataKey="channels" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {competitors.map((competitor) => (
                      <Card key={competitor.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{competitor.name}</h4>
                            <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-500 hover:underline flex items-center gap-1">
                              {competitor.website} <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => deleteCompetitor(competitor.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{competitor.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="font-medium">Price:</span>{' '}
                            <Badge variant="outline" className="text-xs capitalize">{competitor.pricePosition}</Badge>
                          </div>
                          <div>
                            <span className="font-medium">Market Share:</span> {competitor.marketShare}%
                          </div>
                          <div>
                            <span className="font-medium">Rating:</span> {'⭐'.repeat(Math.round(competitor.rating))}
                          </div>
                          <div>
                            <span className="font-medium">Channels:</span> {competitor.channels.length}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {competitor.strengths.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-green-600 mb-1">Strengths</div>
                              <div className="flex flex-wrap gap-1">
                                {competitor.strengths.map((s, i) => (
                                  <Badge key={i} className="text-xs bg-green-100 text-green-800">{s}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {competitor.weaknesses.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-red-600 mb-1">Weaknesses</div>
                              <div className="flex flex-wrap gap-1">
                                {competitor.weaknesses.map((w, i) => (
                                  <Badge key={i} className="text-xs bg-red-100 text-red-800">{w}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </Card>

            {editingCompetitor && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Competitor</h3>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setEditingCompetitor(null)
                    resetCompetitorForm()
                  }}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Competitor Name *</label>
                      <Input
                        value={competitorForm.name}
                        onChange={(e) => setCompetitorForm({ ...competitorForm, name: e.target.value })}
                        placeholder="e.g., Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website *</label>
                      <Input
                        value={competitorForm.website}
                        onChange={(e) => setCompetitorForm({ ...competitorForm, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={2}
                      value={competitorForm.description}
                      onChange={(e) => setCompetitorForm({ ...competitorForm, description: e.target.value })}
                      placeholder="Brief description of the competitor..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price Position</label>
                      <Select
                        value={competitorForm.pricePosition}
                        onChange={(e) => setCompetitorForm({ ...competitorForm, pricePosition: e.target.value as typeof competitorForm.pricePosition })}
                        options={[
                          { value: 'budget', label: 'Budget' },
                          { value: 'mid-market', label: 'Mid-Market' },
                          { value: 'premium', label: 'Premium' },
                          { value: 'enterprise', label: 'Enterprise' }
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Market Share (%)</label>
                      <Input
                        type="number"
                        value={competitorForm.marketShare}
                        onChange={(e) => setCompetitorForm({ ...competitorForm, marketShare: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={competitorForm.rating}
                        onChange={(e) => setCompetitorForm({ ...competitorForm, rating: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Strengths</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newStrength}
                        onChange={(e) => setNewStrength(e.target.value)}
                        placeholder="Add strength"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newStrength.trim()) {
                            setCompetitorForm({ ...competitorForm, strengths: [...competitorForm.strengths, newStrength.trim()] })
                            setNewStrength('')
                          }
                        }}
                      />
              <Button
                variant="outline"
                        onClick={() => {
                          if (newStrength.trim()) {
                            setCompetitorForm({ ...competitorForm, strengths: [...competitorForm.strengths, newStrength.trim()] })
                            setNewStrength('')
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {competitorForm.strengths.map((s, idx) => (
                        <Badge key={idx} className="bg-green-100 text-green-800 flex items-center gap-1">
                          {s}
                          <XCircle
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => setCompetitorForm({ ...competitorForm, strengths: competitorForm.strengths.filter((_, i) => i !== idx) })}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weaknesses</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newWeakness}
                        onChange={(e) => setNewWeakness(e.target.value)}
                        placeholder="Add weakness"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newWeakness.trim()) {
                            setCompetitorForm({ ...competitorForm, weaknesses: [...competitorForm.weaknesses, newWeakness.trim()] })
                            setNewWeakness('')
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (newWeakness.trim()) {
                            setCompetitorForm({ ...competitorForm, weaknesses: [...competitorForm.weaknesses, newWeakness.trim()] })
                            setNewWeakness('')
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {competitorForm.weaknesses.map((w, idx) => (
                        <Badge key={idx} className="bg-red-100 text-red-800 flex items-center gap-1">
                          {w}
                          <XCircle
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => setCompetitorForm({ ...competitorForm, weaknesses: competitorForm.weaknesses.filter((_, i) => i !== idx) })}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addCompetitor} className="flex-1">
                      Add Competitor
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setEditingCompetitor(null)
                      resetCompetitorForm()
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Personas Tab */}
        {activeTab === 'personas' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Customer Personas</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingPersona({
                      id: '',
                      name: '',
                      avatar: '👨‍💼',
                      demographics: { age: '', gender: '', location: '', income: '', education: '', occupation: '' },
                      psychographics: { goals: [], challenges: [], values: [], fears: [], motivations: [] },
                      behaviors: { preferredChannels: [], buyingBehavior: '', decisionFactors: [], contentPreferences: [] },
                      created: new Date().toISOString()
                    })
                    resetPersonaForm()
                  }}
                size="sm"
              >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Persona
              </Button>
              </div>

              {personas.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p>No customer personas yet. Create your first persona to better understand your audience.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personas.map((persona) => (
                    <Card key={persona.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{persona.avatar}</div>
                          <div>
                            <h4 className="font-semibold">{persona.name}</h4>
                            <div className="text-sm text-gray-600">{persona.demographics.occupation}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deletePersona(persona.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div><span className="font-medium">Age:</span> {persona.demographics.age}</div>
                          <div><span className="font-medium">Gender:</span> {persona.demographics.gender}</div>
                          <div><span className="font-medium">Location:</span> {persona.demographics.location}</div>
                          <div><span className="font-medium">Income:</span> {persona.demographics.income}</div>
                        </div>
                        {persona.psychographics.goals.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Goals</div>
                            <div className="flex flex-wrap gap-1">
                              {persona.psychographics.goals.slice(0, 3).map((g, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{g}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {persona.psychographics.challenges.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Challenges</div>
                            <div className="flex flex-wrap gap-1">
                              {persona.psychographics.challenges.slice(0, 3).map((c, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {persona.behaviors.preferredChannels.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">Preferred Channels</div>
                            <div className="flex flex-wrap gap-1">
                              {persona.behaviors.preferredChannels.map((c, i) => (
                                <Badge key={i} className="text-xs bg-blue-100 text-blue-800">{channelLabels[c]}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
            </Card>
          ))}
        </div>
              )}
            </Card>

            {editingPersona && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create Customer Persona</h3>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setEditingPersona(null)
                    resetPersonaForm()
                  }}>
                    <XCircle className="h-4 w-4" />
                  </Button>
      </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                      <div className="flex flex-wrap gap-2">
                        {avatarOptions.map((avatar) => (
                          <button
                            key={avatar}
                            className={`text-2xl p-2 rounded-lg border-2 ${personaForm.avatar === avatar ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => setPersonaForm({ ...personaForm, avatar })}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Persona Name *</label>
                      <Input
                        value={personaForm.name}
                        onChange={(e) => setPersonaForm({ ...personaForm, name: e.target.value })}
                        placeholder="e.g., Startup Steve"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                      <Input
                        value={personaForm.age}
                        onChange={(e) => setPersonaForm({ ...personaForm, age: e.target.value })}
                        placeholder="25-35"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <Input
                        value={personaForm.gender}
                        onChange={(e) => setPersonaForm({ ...personaForm, gender: e.target.value })}
                        placeholder="Male/Female/Other"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <Input
                        value={personaForm.location}
                        onChange={(e) => setPersonaForm({ ...personaForm, location: e.target.value })}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Income</label>
                      <Input
                        value={personaForm.income}
                        onChange={(e) => setPersonaForm({ ...personaForm, income: e.target.value })}
                        placeholder="$75,000 - $100,000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                      <Input
                        value={personaForm.education}
                        onChange={(e) => setPersonaForm({ ...personaForm, education: e.target.value })}
                        placeholder="Bachelor's Degree"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                      <Input
                        value={personaForm.occupation}
                        onChange={(e) => setPersonaForm({ ...personaForm, occupation: e.target.value })}
                        placeholder="Product Manager"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addPersona} className="flex-1">
                      Create Persona
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setEditingPersona(null)
                      resetPersonaForm()
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Content Calendar Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Content Calendar</h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={calendarView === 'month' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarView('month')}
                  >
                    Month
                  </Button>
                  <Button
                    variant={calendarView === 'week' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarView('week')}
                  >
                    Week
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingContent({
                        id: '',
                        title: '',
                        type: 'blog',
                        channel: 'content',
                        status: 'idea',
                        author: '',
                        dueDate: new Date().toISOString().split('T')[0],
                        description: '',
                        keywords: [],
                        created: new Date().toISOString()
                      })
                      resetContentForm()
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              </div>

              {calendarView === 'month' && (
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                      {day}
                    </div>
                  ))}
                  {generateCalendarDays().map((date, idx) => {
                    const items = getContentItemsForDate(date)
                    const isCurrentMonth = date.getMonth() === new Date().getMonth()
                    const isToday = date.toDateString() === new Date().toDateString()
                    return (
                      <div
                        key={idx}
                        className={`min-h-[100px] p-1 border rounded-lg ${
                          isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                        } ${isToday ? 'border-primary-500 border-2' : 'border-gray-200'}`}
                      >
                        <div className={`text-xs font-medium mb-1 ${isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {items.slice(0, 2).map((item) => (
                            <div
                              key={item.id}
                              className={`text-xs p-1 rounded truncate cursor-pointer ${contentStatusColors[item.status]}`}
                              title={item.title}
                            >
                              {item.title}
                            </div>
                          ))}
                          {items.length > 2 && (
                            <div className="text-xs text-gray-500">+{items.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {calendarView === 'week' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contentItems
                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                      .map((content) => (
                        <Card key={content.id} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{content.title}</h4>
                              <div className="text-xs text-gray-500">Due: {new Date(content.dueDate).toLocaleDateString()}</div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => deleteContentItem(content.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">{contentTypeLabels[content.type]}</Badge>
                            <Badge className={`text-xs ${contentStatusColors[content.status]}`}>
                              {contentStatusLabels[content.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.description}</p>
                          <Select
                            value={content.status}
                            onChange={(e) => updateContentStatus(content.id, e.target.value as ContentStatus)}
                            options={Object.entries(contentStatusLabels).map(([value, label]) => ({ value, label }))}
                            className="text-xs"
                          />
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </Card>

            {editingContent && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Content Item</h3>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setEditingContent(null)
                    resetContentForm()
                  }}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <Input
                      value={contentForm.title}
                      onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                      placeholder="e.g., How to Scale Your Startup in 2024"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <Select
                        value={contentForm.type}
                        onChange={(e) => setContentForm({ ...contentForm, type: e.target.value as ContentType })}
                        options={Object.entries(contentTypeLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
                      <Select
                        value={contentForm.channel}
                        onChange={(e) => setContentForm({ ...contentForm, channel: e.target.value as ChannelType })}
                        options={Object.entries(channelLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <Select
                        value={contentForm.status}
                        onChange={(e) => setContentForm({ ...contentForm, status: e.target.value as ContentStatus })}
                        options={Object.entries(contentStatusLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <Input
                        type="date"
                        value={contentForm.dueDate}
                        onChange={(e) => setContentForm({ ...contentForm, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={contentForm.description}
                      onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                      placeholder="Brief description of the content..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Add keyword"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newKeyword.trim()) {
                            setContentForm({ ...contentForm, keywords: [...contentForm.keywords, newKeyword.trim()] })
                            setNewKeyword('')
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (newKeyword.trim()) {
                            setContentForm({ ...contentForm, keywords: [...contentForm.keywords, newKeyword.trim()] })
                            setNewKeyword('')
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {contentForm.keywords.map((k, idx) => (
                        <Badge key={idx} variant="outline" className="flex items-center gap-1">
                          {k}
                          <XCircle
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => setContentForm({ ...contentForm, keywords: contentForm.keywords.filter((_, i) => i !== idx) })}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addContentItem} className="flex-1">
                      Add Content
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setEditingContent(null)
                      resetContentForm()
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Marketing Campaigns</h2>
              </div>
              <div className="text-center py-12 text-gray-400">
                <Target className="h-16 w-16 mx-auto mb-4" />
                <p>Campaign management coming soon. Use the Channels tab to manage your marketing activities.</p>
              </div>
            </Card>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Strategy Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategyTemplates.map((template) => {
                  const IconComponent = template.icon
                  return (
                    <Card
                      key={template.id}
                      className="p-4 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div onClick={() => loadTemplate(template.id)}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-primary-500/10 text-primary-600 p-2 rounded-lg">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <h4 className="font-semibold">{template.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="text-xs text-gray-500 mb-3">
                          Framework: {template.framework}
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="text-xs font-medium text-gray-700 mb-2">Steps:</div>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {template.steps.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="h-3 w-3 text-primary-600 mt-0.5 shrink-0" />
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Budget</div>
                <div className="text-2xl font-bold">${calculateTotalBudget().toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Monthly Budget</div>
                <div className="text-2xl font-bold">${calculateMonthlyBudget().toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Active Channels</div>
                <div className="text-2xl font-bold">
                  {channels.filter(c => c.status === 'active').length}
                </div>
              </Card>
            </div>

            {channelBudgetData.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Budget Distribution</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={channelBudgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="budget" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            <Card>
              <h3 className="font-semibold mb-4">Budget Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(
                  channels.reduce((acc, c) => {
                    if (!acc[c.type]) acc[c.type] = { budget: 0, monthly: 0, count: 0 }
                    acc[c.type].budget += c.budget
                    acc[c.type].monthly += c.monthlyBudget
                    acc[c.type].count += 1
                    return acc
                  }, {} as Record<ChannelType, { budget: number; monthly: number; count: number }>)
                ).map(([type, data]) => (
                  <div key={type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold">{channelLabels[type as ChannelType]}</div>
                      <div className="text-sm text-gray-600">{data.count} channel{data.count !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${data.budget.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">${data.monthly.toLocaleString()}/mo</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
