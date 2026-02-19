'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Route,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  Download,
  Sparkles,
  Eye,
  MousePointerClick,
  ShoppingCart,
  Heart,
  Star,
  MessageSquare,
  Mail,
  Globe,
  Smartphone,
  ChevronRight,
  Zap,
  BarChart3
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts'

type TouchpointType = 'awareness' | 'consideration' | 'decision' | 'purchase' | 'retention' | 'advocacy'
type ChannelType = 'organic' | 'paid' | 'social' | 'email' | 'direct' | 'referral'

interface JourneyStage {
  id: string
  name: string
  type: TouchpointType
  description: string
  channels: ChannelType[]
  touchpoints: string[]
  metrics: {
    visitors: number
    conversions: number
    dropoffRate: number
    avgTimeSpent: string
  }
  actions: string[]
  emotions: 'positive' | 'neutral' | 'negative'
  painPoints: string[]
  opportunities: string[]
}

interface CustomerJourney {
  id: string
  name: string
  description: string
  persona: string
  stages: JourneyStage[]
  totalVisitors: number
  totalConversions: number
  overallConversionRate: number
  created: string
  modified: string
}

interface JourneyTemplate {
  id: string
  name: string
  description: string
  stages: Omit<JourneyStage, 'id'>[]
}

const touchpointLabels: Record<TouchpointType, string> = {
  'awareness': 'Awareness',
  'consideration': 'Consideration',
  'decision': 'Decision',
  'purchase': 'Purchase',
  'retention': 'Retention',
  'advocacy': 'Advocacy'
}

const touchpointColors: Record<TouchpointType, string> = {
  'awareness': '#3b82f6',
  'consideration': '#8b5cf6',
  'decision': '#f59e0b',
  'purchase': '#10b981',
  'retention': '#ec4899',
  'advocacy': '#06b6d4'
}

const touchpointIcons: Record<TouchpointType, typeof Eye> = {
  'awareness': Eye,
  'consideration': Target,
  'decision': CheckCircle,
  'purchase': ShoppingCart,
  'retention': Heart,
  'advocacy': Star
}

const channelLabels: Record<ChannelType, string> = {
  'organic': 'Organic',
  'paid': 'Paid Ads',
  'social': 'Social Media',
  'email': 'Email',
  'direct': 'Direct',
  'referral': 'Referral'
}

const defaultTemplates: JourneyTemplate[] = [
  {
    id: 'saas',
    name: 'SaaS Customer Journey',
    description: 'Standard journey for SaaS products',
    stages: [
      {
        name: 'Discovery',
        type: 'awareness',
        description: 'Customer becomes aware of the problem and potential solutions',
        channels: ['organic', 'paid', 'social'],
        touchpoints: ['Blog posts', 'Social media ads', 'Word of mouth'],
        metrics: { visitors: 10000, conversions: 3000, dropoffRate: 70, avgTimeSpent: '2 min' },
        actions: ['Read blog', 'Watch video', 'Share content'],
        emotions: 'neutral',
        painPoints: ['Information overload', 'Not sure where to start'],
        opportunities: ['SEO content', 'Educational webinars']
      },
      {
        name: 'Research',
        type: 'consideration',
        description: 'Customer evaluates different solutions',
        channels: ['organic', 'email'],
        touchpoints: ['Product pages', 'Comparison guides', 'Case studies'],
        metrics: { visitors: 3000, conversions: 1000, dropoffRate: 67, avgTimeSpent: '5 min' },
        actions: ['Compare features', 'Read reviews', 'Request demo'],
        emotions: 'neutral',
        painPoints: ['Too many options', 'Pricing confusion'],
        opportunities: ['Comparison content', 'Free trials']
      },
      {
        name: 'Evaluation',
        type: 'decision',
        description: 'Customer decides to try the product',
        channels: ['direct', 'email'],
        touchpoints: ['Demo calls', 'Free trial', 'Pricing page'],
        metrics: { visitors: 1000, conversions: 300, dropoffRate: 70, avgTimeSpent: '15 min' },
        actions: ['Start trial', 'Schedule demo', 'Review pricing'],
        emotions: 'positive',
        painPoints: ['Complex signup', 'Credit card required'],
        opportunities: ['Simplified onboarding', 'No-CC trial']
      },
      {
        name: 'Purchase',
        type: 'purchase',
        description: 'Customer converts to paid user',
        channels: ['direct'],
        touchpoints: ['Checkout', 'Upgrade prompts', 'Sales calls'],
        metrics: { visitors: 300, conversions: 100, dropoffRate: 67, avgTimeSpent: '10 min' },
        actions: ['Enter payment', 'Select plan', 'Confirm purchase'],
        emotions: 'positive',
        painPoints: ['Price objections', 'Contract concerns'],
        opportunities: ['Flexible pricing', 'Money-back guarantee']
      },
      {
        name: 'Onboarding',
        type: 'retention',
        description: 'Customer learns to use the product',
        channels: ['email', 'direct'],
        touchpoints: ['Welcome emails', 'Product tours', 'Support'],
        metrics: { visitors: 100, conversions: 80, dropoffRate: 20, avgTimeSpent: '30 min' },
        actions: ['Complete setup', 'Watch tutorials', 'Contact support'],
        emotions: 'positive',
        painPoints: ['Learning curve', 'Missing features'],
        opportunities: ['In-app guidance', 'Proactive support']
      },
      {
        name: 'Advocacy',
        type: 'advocacy',
        description: 'Customer recommends to others',
        channels: ['social', 'referral'],
        touchpoints: ['Reviews', 'Referral program', 'Social sharing'],
        metrics: { visitors: 80, conversions: 20, dropoffRate: 75, avgTimeSpent: '5 min' },
        actions: ['Write review', 'Refer friend', 'Share on social'],
        emotions: 'positive',
        painPoints: ['No incentive', 'Complicated referral'],
        opportunities: ['Referral rewards', 'Easy sharing']
      }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Journey',
    description: 'Journey for online retail customers',
    stages: [
      {
        name: 'Browse',
        type: 'awareness',
        description: 'Customer discovers products',
        channels: ['organic', 'paid', 'social'],
        touchpoints: ['Product ads', 'Social posts', 'Search results'],
        metrics: { visitors: 50000, conversions: 10000, dropoffRate: 80, avgTimeSpent: '1 min' },
        actions: ['Click ad', 'Browse catalog', 'Save items'],
        emotions: 'neutral',
        painPoints: ['Too many products', 'Slow load times'],
        opportunities: ['Personalization', 'Fast loading']
      },
      {
        name: 'Evaluate',
        type: 'consideration',
        description: 'Customer reviews products',
        channels: ['direct'],
        touchpoints: ['Product pages', 'Reviews', 'Comparisons'],
        metrics: { visitors: 10000, conversions: 3000, dropoffRate: 70, avgTimeSpent: '3 min' },
        actions: ['Read reviews', 'Check sizing', 'Compare options'],
        emotions: 'neutral',
        painPoints: ['Missing info', 'Bad photos'],
        opportunities: ['Detailed descriptions', 'Video content']
      },
      {
        name: 'Add to Cart',
        type: 'decision',
        description: 'Customer adds items to cart',
        channels: ['direct'],
        touchpoints: ['Add to cart button', 'Wishlist', 'Cart page'],
        metrics: { visitors: 3000, conversions: 1500, dropoffRate: 50, avgTimeSpent: '2 min' },
        actions: ['Add to cart', 'Select variants', 'View cart'],
        emotions: 'positive',
        painPoints: ['Stock issues', 'Price changes'],
        opportunities: ['Urgency messaging', 'Cart saving']
      },
      {
        name: 'Checkout',
        type: 'purchase',
        description: 'Customer completes purchase',
        channels: ['direct'],
        touchpoints: ['Checkout form', 'Payment', 'Confirmation'],
        metrics: { visitors: 1500, conversions: 750, dropoffRate: 50, avgTimeSpent: '5 min' },
        actions: ['Enter info', 'Select shipping', 'Pay'],
        emotions: 'neutral',
        painPoints: ['Long checkout', 'Shipping costs'],
        opportunities: ['Express checkout', 'Free shipping']
      }
    ]
  }
]

export default function CustomerJourneyPage() {
  const [activeTab, setActiveTab] = useState('journeys')
  const [journeys, setJourneys] = useState<CustomerJourney[]>([])
  const [editingJourney, setEditingJourney] = useState<CustomerJourney | null>(null)
  const [selectedJourney, setSelectedJourney] = useState<CustomerJourney | null>(null)
  const [journeyFormData, setJourneyFormData] = useState({
    name: '',
    description: '',
    persona: ''
  })
  const [stageFormData, setStageFormData] = useState({
    name: '',
    type: 'awareness' as TouchpointType,
    description: '',
    channels: [] as ChannelType[],
    touchpoints: '',
    visitors: '',
    conversions: '',
    actions: '',
    emotions: 'neutral' as 'positive' | 'neutral' | 'negative',
    painPoints: '',
    opportunities: ''
  })
  const [editingStage, setEditingStage] = useState<JourneyStage | null>(null)

  const tabs = [
    { id: 'journeys', label: 'Journeys', icon: Route },
    { id: 'templates', label: 'Templates', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customerJourneyData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.journeys) setJourneys(data.journeys)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = { journeys, lastSaved: new Date().toISOString() }
      localStorage.setItem('customerJourneyData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const applyTemplate = (template: JourneyTemplate) => {
    const newJourney: CustomerJourney = {
      id: Date.now().toString(),
      name: `${template.name} - Copy`,
      description: template.description,
      persona: 'Default Persona',
      stages: template.stages.map((s, idx) => ({
        ...s,
        id: `${Date.now()}-${idx}`
      })),
      totalVisitors: template.stages[0]?.metrics.visitors || 0,
      totalConversions: template.stages[template.stages.length - 1]?.metrics.conversions || 0,
      overallConversionRate: 0,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }

    const firstVisitors = newJourney.stages[0]?.metrics.visitors || 1
    const lastConversions = newJourney.stages[newJourney.stages.length - 1]?.metrics.conversions || 0
    newJourney.overallConversionRate = (lastConversions / firstVisitors) * 100

    setJourneys([...journeys, newJourney])
    saveToLocalStorage()
    showToast('Template applied! Journey created.', 'success')
  }

  const createEmptyJourney = () => {
    if (!journeyFormData.name) {
      showToast('Please enter a journey name', 'error')
      return
    }

    const newJourney: CustomerJourney = {
      id: Date.now().toString(),
      name: journeyFormData.name,
      description: journeyFormData.description,
      persona: journeyFormData.persona,
      stages: [],
      totalVisitors: 0,
      totalConversions: 0,
      overallConversionRate: 0,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }

    setJourneys([...journeys, newJourney])
    setEditingJourney(null)
    setJourneyFormData({ name: '', description: '', persona: '' })
    saveToLocalStorage()
    showToast('Journey created!', 'success')
  }

  const addStageToJourney = (journeyId: string) => {
    if (!stageFormData.name) {
      showToast('Please enter a stage name', 'error')
      return
    }

    const newStage: JourneyStage = {
      id: Date.now().toString(),
      name: stageFormData.name,
      type: stageFormData.type,
      description: stageFormData.description,
      channels: stageFormData.channels,
      touchpoints: stageFormData.touchpoints.split(',').map(t => t.trim()).filter(Boolean),
      metrics: {
        visitors: parseInt(stageFormData.visitors) || 0,
        conversions: parseInt(stageFormData.conversions) || 0,
        dropoffRate: 0,
        avgTimeSpent: '5 min'
      },
      actions: stageFormData.actions.split(',').map(a => a.trim()).filter(Boolean),
      emotions: stageFormData.emotions,
      painPoints: stageFormData.painPoints.split(',').map(p => p.trim()).filter(Boolean),
      opportunities: stageFormData.opportunities.split(',').map(o => o.trim()).filter(Boolean)
    }

    const updated = journeys.map(j => {
      if (j.id === journeyId) {
        const stages = [...j.stages, newStage]
        // Recalculate metrics
        const firstVisitors = stages[0]?.metrics.visitors || 1
        const lastConversions = stages[stages.length - 1]?.metrics.conversions || 0
        return {
          ...j,
          stages,
          totalVisitors: firstVisitors,
          totalConversions: lastConversions,
          overallConversionRate: (lastConversions / firstVisitors) * 100,
          modified: new Date().toISOString()
        }
      }
      return j
    })

    setJourneys(updated)
    setEditingStage(null)
    resetStageForm()
    saveToLocalStorage()
    showToast('Stage added!', 'success')
  }

  const deleteJourney = (id: string) => {
    if (confirm('Are you sure you want to delete this journey?')) {
      setJourneys(journeys.filter(j => j.id !== id))
      if (selectedJourney?.id === id) setSelectedJourney(null)
      saveToLocalStorage()
      showToast('Journey deleted', 'info')
    }
  }

  const deleteStage = (journeyId: string, stageId: string) => {
    const updated = journeys.map(j => {
      if (j.id === journeyId) {
        const stages = j.stages.filter(s => s.id !== stageId)
        const firstVisitors = stages[0]?.metrics.visitors || 1
        const lastConversions = stages[stages.length - 1]?.metrics.conversions || 0
        return {
          ...j,
          stages,
          totalVisitors: firstVisitors,
          totalConversions: lastConversions,
          overallConversionRate: stages.length > 0 ? (lastConversions / firstVisitors) * 100 : 0,
          modified: new Date().toISOString()
        }
      }
      return j
    })
    setJourneys(updated)
    saveToLocalStorage()
    showToast('Stage deleted', 'info')
  }

  const resetStageForm = () => {
    setStageFormData({
      name: '',
      type: 'awareness',
      description: '',
      channels: [],
      touchpoints: '',
      visitors: '',
      conversions: '',
      actions: '',
      emotions: 'neutral',
      painPoints: '',
      opportunities: ''
    })
  }

  const toggleChannel = (channel: ChannelType) => {
    const channels = stageFormData.channels.includes(channel)
      ? stageFormData.channels.filter(c => c !== channel)
      : [...stageFormData.channels, channel]
    setStageFormData({ ...stageFormData, channels })
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#06b6d4']

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Route className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Customer Journey Builder
              </span>
            </h1>
            <Route className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Map, visualize, and optimize your customer's journey from awareness to advocacy
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={saveToLocalStorage}>
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Journeys Tab */}
        {activeTab === 'journeys' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Customer Journeys</h2>
                <Button
                  onClick={() => setEditingJourney({
                    id: '',
                    name: '',
                    description: '',
                    persona: '',
                    stages: [],
                    totalVisitors: 0,
                    totalConversions: 0,
                    overallConversionRate: 0,
                    created: new Date().toISOString(),
                    modified: new Date().toISOString()
                  })}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Journey
                </Button>
              </div>

              {journeys.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Route className="h-16 w-16 mx-auto mb-4" />
                  <p className="mb-4">No customer journeys yet. Create your first journey or use a template.</p>
                  <Button variant="outline" onClick={() => setActiveTab('templates')}>
                    Browse Templates
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {journeys.map((journey) => (
                    <Card key={journey.id} className="p-4 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{journey.name}</h4>
                          <p className="text-sm text-gray-600">{journey.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedJourney(journey)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteJourney(journey.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm mb-3">
                        <div>
                          <div className="font-bold">{journey.stages.length}</div>
                          <div className="text-gray-500">Stages</div>
                        </div>
                        <div>
                          <div className="font-bold">{journey.totalVisitors.toLocaleString()}</div>
                          <div className="text-gray-500">Visitors</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-600">{journey.overallConversionRate.toFixed(1)}%</div>
                          <div className="text-gray-500">Conv. Rate</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 overflow-x-auto pb-2">
                        {journey.stages.map((stage, idx) => (
                          <React.Fragment key={stage.id}>
                            <div
                              className="shrink-0 px-2 py-1 rounded text-xs text-white"
                              style={{ backgroundColor: touchpointColors[stage.type] }}
                            >
                              {stage.name}
                            </div>
                            {idx < journey.stages.length - 1 && (
                              <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {/* Selected Journey Detail View */}
            {selectedJourney && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedJourney.name}</h3>
                    <p className="text-gray-600">{selectedJourney.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingStage({
                          id: '',
                          name: '',
                          type: 'awareness',
                          description: '',
                          channels: [],
                          touchpoints: [],
                          metrics: { visitors: 0, conversions: 0, dropoffRate: 0, avgTimeSpent: '' },
                          actions: [],
                          emotions: 'neutral',
                          painPoints: [],
                          opportunities: []
                        })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Stage
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedJourney(null)}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Journey Visualization */}
                <div className="relative mb-8">
                  <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 z-0" />
                  <div className="relative z-10 flex justify-between overflow-x-auto pb-4">
                    {selectedJourney.stages.map((stage, idx) => {
                      const Icon = touchpointIcons[stage.type]
                      return (
                        <div key={stage.id} className="flex flex-col items-center min-w-[150px] px-2">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold mb-2"
                            style={{ backgroundColor: touchpointColors[stage.type] }}
                          >
                            <Icon className="h-8 w-8" />
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-sm">{stage.name}</div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {touchpointLabels[stage.type]}
                            </Badge>
                            <div className="text-xs text-gray-600 mt-2">
                              {stage.metrics.visitors.toLocaleString()} visitors
                            </div>
                            <div className="text-xs text-green-600">
                              {stage.metrics.conversions.toLocaleString()} conv.
                            </div>
                            {idx < selectedJourney.stages.length - 1 && (
                              <div className="text-xs text-red-500 mt-1">
                                ↓ {stage.metrics.dropoffRate}% drop-off
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => deleteStage(selectedJourney.id, stage.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Stage Details */}
                <div className="space-y-4">
                  {selectedJourney.stages.map((stage) => (
                    <Card key={stage.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: touchpointColors[stage.type] }}
                          >
                            {React.createElement(touchpointIcons[stage.type], { className: 'h-5 w-5' })}
                          </div>
                          <div>
                            <h4 className="font-semibold">{stage.name}</h4>
                            <p className="text-sm text-gray-600">{stage.description}</p>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            stage.emotions === 'positive' ? 'bg-green-100 text-green-800' :
                            stage.emotions === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {stage.emotions}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-gray-500">Channels</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {stage.channels.map((ch) => (
                              <Badge key={ch} variant="outline" className="text-xs">
                                {channelLabels[ch]}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Touchpoints</div>
                          <div className="font-medium">{stage.touchpoints.join(', ')}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Pain Points</div>
                          <div className="text-red-600 text-xs">{stage.painPoints.join(', ')}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Opportunities</div>
                          <div className="text-green-600 text-xs">{stage.opportunities.join(', ')}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Funnel Chart */}
                {selectedJourney.stages.length > 0 && (
                  <Card className="mt-6">
                    <h4 className="font-semibold mb-4">Conversion Funnel</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={selectedJourney.stages.map(s => ({
                          name: s.name,
                          visitors: s.metrics.visitors,
                          conversions: s.metrics.conversions
                        }))}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="visitors" fill="#3b82f6" name="Visitors" />
                        <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                )}
              </Card>
            )}

            {/* Add Stage Form */}
            {editingStage && selectedJourney && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Journey Stage</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingStage(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stage Name *</label>
                      <Input
                        value={stageFormData.name}
                        onChange={(e) => setStageFormData({ ...stageFormData, name: e.target.value })}
                        placeholder="e.g., Discovery"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stage Type *</label>
                      <Select
                        value={stageFormData.type}
                        onChange={(e) => setStageFormData({ ...stageFormData, type: e.target.value as TouchpointType })}
                        options={Object.entries(touchpointLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={2}
                      value={stageFormData.description}
                      onChange={(e) => setStageFormData({ ...stageFormData, description: e.target.value })}
                      placeholder="Describe this stage..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(channelLabels).map(([value, label]) => (
                        <button
                          key={value}
                          className={`px-3 py-1 rounded-full text-sm border-2 ${
                            stageFormData.channels.includes(value as ChannelType)
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-300 text-gray-600'
                          }`}
                          onClick={() => toggleChannel(value as ChannelType)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Visitors</label>
                      <Input
                        type="number"
                        value={stageFormData.visitors}
                        onChange={(e) => setStageFormData({ ...stageFormData, visitors: e.target.value })}
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Conversions</label>
                      <Input
                        type="number"
                        value={stageFormData.conversions}
                        onChange={(e) => setStageFormData({ ...stageFormData, conversions: e.target.value })}
                        placeholder="3000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Touchpoints (comma-separated)</label>
                    <Input
                      value={stageFormData.touchpoints}
                      onChange={(e) => setStageFormData({ ...stageFormData, touchpoints: e.target.value })}
                      placeholder="Blog posts, Social media ads, Word of mouth"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => addStageToJourney(selectedJourney.id)} className="flex-1">
                      Add Stage
                    </Button>
                    <Button variant="outline" onClick={() => setEditingStage(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* New Journey Form */}
            {editingJourney && !editingJourney.id && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create New Journey</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingJourney(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Journey Name *</label>
                    <Input
                      value={journeyFormData.name}
                      onChange={(e) => setJourneyFormData({ ...journeyFormData, name: e.target.value })}
                      placeholder="e.g., SaaS Customer Journey"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={2}
                      value={journeyFormData.description}
                      onChange={(e) => setJourneyFormData({ ...journeyFormData, description: e.target.value })}
                      placeholder="Describe this journey..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Persona</label>
                    <Input
                      value={journeyFormData.persona}
                      onChange={(e) => setJourneyFormData({ ...journeyFormData, persona: e.target.value })}
                      placeholder="e.g., Startup Founder"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createEmptyJourney} className="flex-1">
                      Create Journey
                    </Button>
                    <Button variant="outline" onClick={() => setEditingJourney(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Journey Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {defaultTemplates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <h4 className="font-semibold mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-2">
                      {template.stages.map((stage, idx) => (
                        <React.Fragment key={idx}>
                          <div
                            className="shrink-0 px-2 py-1 rounded text-xs text-white"
                            style={{ backgroundColor: touchpointColors[stage.type] }}
                          >
                            {stage.name}
                          </div>
                          {idx < template.stages.length - 1 && (
                            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      {template.stages.length} stages
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => applyTemplate(template)}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
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
                <div className="text-sm text-gray-600 mb-1">Total Journeys</div>
                <div className="text-2xl font-bold">{journeys.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Stages</div>
                <div className="text-2xl font-bold">
                  {journeys.reduce((sum, j) => sum + j.stages.length, 0)}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Avg Conversion Rate</div>
                <div className="text-2xl font-bold text-green-600">
                  {journeys.length > 0
                    ? (journeys.reduce((sum, j) => sum + j.overallConversionRate, 0) / journeys.length).toFixed(1)
                    : 0}%
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Visitors</div>
                <div className="text-2xl font-bold">
                  {journeys.reduce((sum, j) => sum + j.totalVisitors, 0).toLocaleString()}
                </div>
              </Card>
            </div>

            {journeys.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Journey Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={journeys.map(j => ({
                    name: j.name,
                    visitors: j.totalVisitors,
                    conversions: j.totalConversions,
                    rate: j.overallConversionRate
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visitors" fill="#3b82f6" name="Visitors" />
                    <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
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

