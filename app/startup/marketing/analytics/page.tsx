'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Target,
  Users,
  MousePointerClick,
  Percent,
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
  Activity,
  ArrowUp,
  ArrowDown,
  Filter,
  RefreshCw,
  Layers,
  GitBranch,
  CircleDot,
  Route,
  Star,
  Globe,
  Smartphone
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area, Sankey, FunnelChart, Funnel, LabelList, ComposedChart } from 'recharts'

type MetricType = 'traffic' | 'conversions' | 'revenue' | 'engagement' | 'leads' | 'custom'
type ChannelType = 'organic' | 'paid' | 'social' | 'email' | 'direct' | 'referral' | 'affiliate' | 'other'
type TimeRange = '7d' | '30d' | '90d' | '1y' | 'custom'
type AttributionModel = 'first-touch' | 'last-touch' | 'linear' | 'time-decay' | 'position-based'
type TouchpointType = 'awareness' | 'consideration' | 'decision' | 'purchase' | 'retention'

interface Metric {
  id: string
  name: string
  type: MetricType
  value: number
  previousValue: number
  change: number
  unit: string
  date: string
  channel?: ChannelType
  notes?: string
}

interface ConversionFunnel {
  id: string
  name: string
  stages: {
    name: string
    visitors: number
    conversions: number
    conversionRate: number
  }[]
  totalVisitors: number
  totalConversions: number
  overallConversionRate: number
  created: string
  modified: string
}

interface ROIAnalysis {
  id: string
  name: string
  channel: ChannelType
  spend: number
  revenue: number
  roi: number
  roas: number
  period: string
  startDate: string
  endDate: string
  notes?: string
  created: string
  modified: string
}

interface CohortData {
  id: string
  name: string
  startDate: string
  endDate: string
  totalUsers: number
  retentionData: {
    week: number
    activeUsers: number
    retentionRate: number
  }[]
  created: string
}

interface AttributionData {
  id: string
  conversionId: string
  conversionValue: number
  touchpoints: {
    channel: ChannelType
    timestamp: string
    type: TouchpointType
    credit: number
  }[]
  model: AttributionModel
  created: string
}

interface CustomerJourney {
  id: string
  name: string
  description: string
  stages: {
    id: string
    name: string
    type: TouchpointType
    channels: ChannelType[]
    metrics: {
      visitors: number
      conversions: number
      dropoff: number
    }
    touchpoints: string[]
  }[]
  created: string
}

interface ChannelPerformance {
  channel: ChannelType
  visits: number
  conversions: number
  revenue: number
  cost: number
  conversionRate: number
  cpa: number
  roas: number
  roi: number
}

const channelLabels: Record<ChannelType, string> = {
  'organic': 'Organic Search',
  'paid': 'Paid Ads',
  'social': 'Social Media',
  'email': 'Email',
  'direct': 'Direct',
  'referral': 'Referral',
  'affiliate': 'Affiliate',
  'other': 'Other'
}

const channelColors: Record<ChannelType, string> = {
  'organic': '#10b981',
  'paid': '#3b82f6',
  'social': '#8b5cf6',
  'email': '#f59e0b',
  'direct': '#6366f1',
  'referral': '#ec4899',
  'affiliate': '#06b6d4',
  'other': '#6b7280'
}

const attributionModelLabels: Record<AttributionModel, string> = {
  'first-touch': 'First Touch',
  'last-touch': 'Last Touch',
  'linear': 'Linear',
  'time-decay': 'Time Decay',
  'position-based': 'Position Based'
}

const touchpointLabels: Record<TouchpointType, string> = {
  'awareness': 'Awareness',
  'consideration': 'Consideration',
  'decision': 'Decision',
  'purchase': 'Purchase',
  'retention': 'Retention'
}

const touchpointColors: Record<TouchpointType, string> = {
  'awareness': '#3b82f6',
  'consideration': '#8b5cf6',
  'decision': '#f59e0b',
  'purchase': '#10b981',
  'retention': '#ec4899'
}

export default function MarketingAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [attributionModel, setAttributionModel] = useState<AttributionModel>('last-touch')
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [funnels, setFunnels] = useState<ConversionFunnel[]>([])
  const [roiAnalyses, setRoiAnalyses] = useState<ROIAnalysis[]>([])
  const [cohorts, setCohorts] = useState<CohortData[]>([])
  const [journeys, setJourneys] = useState<CustomerJourney[]>([])
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null)
  const [editingFunnel, setEditingFunnel] = useState<ConversionFunnel | null>(null)
  const [editingROI, setEditingROI] = useState<ROIAnalysis | null>(null)
  const [editingCohort, setEditingCohort] = useState<CohortData | null>(null)
  const [editingJourney, setEditingJourney] = useState<CustomerJourney | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'traffic' as MetricType,
    value: '',
    previousValue: '',
    unit: '',
    channel: 'organic' as ChannelType,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [funnelFormData, setFunnelFormData] = useState({
    name: '',
    stages: [] as Array<{ name: string; visitors: number; conversions: number }>
  })
  const [newStage, setNewStage] = useState({ name: '', visitors: '', conversions: '' })
  const [roiFormData, setRoiFormData] = useState({
    name: '',
    channel: 'organic' as ChannelType,
    spend: '',
    revenue: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [cohortFormData, setCohortFormData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    totalUsers: ''
  })
  const [journeyFormData, setJourneyFormData] = useState({
    name: '',
    description: ''
  })

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'metrics', label: 'KPIs', icon: Target },
    { id: 'funnel', label: 'Conversion Funnel', icon: TrendingUp },
    { id: 'cohort', label: 'Cohort Analysis', icon: Layers },
    { id: 'attribution', label: 'Attribution', icon: GitBranch },
    { id: 'journey', label: 'Customer Journey', icon: Route },
    { id: 'roi', label: 'ROI Analysis', icon: DollarSign },
    { id: 'channels', label: 'Channels', icon: Megaphone },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('marketingAnalyticsDataV2')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.metrics) setMetrics(data.metrics)
          if (data.funnels) setFunnels(data.funnels)
          if (data.roiAnalyses) setRoiAnalyses(data.roiAnalyses)
          if (data.cohorts) setCohorts(data.cohorts)
          if (data.journeys) setJourneys(data.journeys)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        metrics,
        funnels,
        roiAnalyses,
        cohorts,
        journeys,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('marketingAnalyticsDataV2', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const addMetric = () => {
    if (!formData.name || !formData.value) {
      showToast('Please fill in name and value', 'error')
      return
    }

    const value = parseFloat(formData.value) || 0
    const previousValue = parseFloat(formData.previousValue) || 0
    const change = previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0

    const newMetric: Metric = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      value,
      previousValue,
      change,
      unit: formData.unit || '',
      date: formData.date,
      channel: formData.channel,
      notes: formData.notes || undefined
    }

    setMetrics([...metrics, newMetric])
    setEditingMetric(null)
    resetMetricForm()
    saveToLocalStorage()
    showToast('Metric added!', 'success')
  }

  const updateMetric = () => {
    if (!editingMetric) return

    const value = parseFloat(formData.value) || 0
    const previousValue = parseFloat(formData.previousValue) || 0
    const change = previousValue > 0 ? ((value - previousValue) / previousValue) * 100 : 0

    const updated: Metric = {
      ...editingMetric,
      name: formData.name,
      type: formData.type,
      value,
      previousValue,
      change,
      unit: formData.unit,
      date: formData.date,
      channel: formData.channel,
      notes: formData.notes || undefined
    }

    const updatedMetrics = metrics.map(m => m.id === editingMetric.id ? updated : m)
    setMetrics(updatedMetrics)
    setEditingMetric(null)
    resetMetricForm()
    saveToLocalStorage()
    showToast('Metric updated!', 'success')
  }

  const deleteMetric = (id: string) => {
    if (confirm('Are you sure you want to delete this metric?')) {
      const updated = metrics.filter(m => m.id !== id)
      setMetrics(updated)
      saveToLocalStorage()
      showToast('Metric deleted', 'info')
    }
  }

  const resetMetricForm = () => {
    setFormData({
      name: '',
      type: 'traffic',
      value: '',
      previousValue: '',
      unit: '',
      channel: 'organic',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
  }

  const addFunnel = () => {
    if (!funnelFormData.name || funnelFormData.stages.length < 2) {
      showToast('Please add at least 2 funnel stages', 'error')
      return
    }

    const stages = funnelFormData.stages.map(stage => ({
      name: stage.name,
      visitors: stage.visitors,
      conversions: stage.conversions,
      conversionRate: stage.visitors > 0 ? (stage.conversions / stage.visitors) * 100 : 0
    }))

    const totalVisitors = stages[0]?.visitors || 0
    const totalConversions = stages[stages.length - 1]?.conversions || 0
    const overallConversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0

    const newFunnel: ConversionFunnel = {
      id: Date.now().toString(),
      name: funnelFormData.name,
      stages,
      totalVisitors,
      totalConversions,
      overallConversionRate,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }

    setFunnels([...funnels, newFunnel])
    setEditingFunnel(null)
    setFunnelFormData({ name: '', stages: [] })
    setNewStage({ name: '', visitors: '', conversions: '' })
    saveToLocalStorage()
    showToast('Conversion funnel added!', 'success')
  }

  const addFunnelStage = () => {
    if (!newStage.name || !newStage.visitors) {
      showToast('Please fill in stage name and visitors', 'error')
      return
    }

    setFunnelFormData({
      ...funnelFormData,
      stages: [...funnelFormData.stages, {
        name: newStage.name,
        visitors: parseFloat(newStage.visitors) || 0,
        conversions: parseFloat(newStage.conversions) || 0
      }]
    })
    setNewStage({ name: '', visitors: '', conversions: '' })
  }

  const deleteFunnel = (id: string) => {
    if (confirm('Are you sure you want to delete this funnel?')) {
      const updated = funnels.filter(f => f.id !== id)
      setFunnels(updated)
      saveToLocalStorage()
      showToast('Funnel deleted', 'info')
    }
  }

  const addROI = () => {
    if (!roiFormData.name || !roiFormData.spend || !roiFormData.revenue) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const spend = parseFloat(roiFormData.spend) || 0
    const revenue = parseFloat(roiFormData.revenue) || 0
    const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0
    const roas = spend > 0 ? revenue / spend : 0

    const newROI: ROIAnalysis = {
      id: Date.now().toString(),
      name: roiFormData.name,
      channel: roiFormData.channel,
      spend,
      revenue,
      roi,
      roas,
      period: `${roiFormData.startDate} to ${roiFormData.endDate}`,
      startDate: roiFormData.startDate,
      endDate: roiFormData.endDate,
      notes: roiFormData.notes || undefined,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }

    setRoiAnalyses([...roiAnalyses, newROI])
    setEditingROI(null)
    resetROIForm()
    saveToLocalStorage()
    showToast('ROI analysis added!', 'success')
  }

  const resetROIForm = () => {
    setRoiFormData({
      name: '',
      channel: 'organic',
      spend: '',
      revenue: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      notes: ''
    })
  }

  const deleteROI = (id: string) => {
    if (confirm('Are you sure you want to delete this ROI analysis?')) {
      const updated = roiAnalyses.filter(r => r.id !== id)
      setRoiAnalyses(updated)
      saveToLocalStorage()
      showToast('ROI analysis deleted', 'info')
    }
  }

  const addCohort = () => {
    if (!cohortFormData.name || !cohortFormData.totalUsers) {
      showToast('Please fill in cohort name and total users', 'error')
      return
    }

    // Generate sample retention data
    const totalUsers = parseFloat(cohortFormData.totalUsers) || 100
    const retentionData = []
    let remaining = totalUsers
    for (let week = 0; week <= 8; week++) {
      const retention = week === 0 ? 100 : Math.max(10, 100 - (week * 12) + (Math.random() * 10 - 5))
      const activeUsers = Math.round(totalUsers * (retention / 100))
      retentionData.push({
        week,
        activeUsers,
        retentionRate: retention
      })
      remaining = activeUsers
    }

    const newCohort: CohortData = {
      id: Date.now().toString(),
      name: cohortFormData.name,
      startDate: cohortFormData.startDate,
      endDate: cohortFormData.endDate,
      totalUsers,
      retentionData,
      created: new Date().toISOString()
    }

    setCohorts([...cohorts, newCohort])
    setEditingCohort(null)
    setCohortFormData({
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      totalUsers: ''
    })
    saveToLocalStorage()
    showToast('Cohort added!', 'success')
  }

  const deleteCohort = (id: string) => {
    if (confirm('Are you sure you want to delete this cohort?')) {
      setCohorts(cohorts.filter(c => c.id !== id))
      saveToLocalStorage()
      showToast('Cohort deleted', 'info')
    }
  }

  const addJourney = () => {
    if (!journeyFormData.name) {
      showToast('Please enter journey name', 'error')
      return
    }

    const defaultStages = [
      { id: '1', name: 'Awareness', type: 'awareness' as TouchpointType, channels: ['social', 'paid'] as ChannelType[], metrics: { visitors: 10000, conversions: 5000, dropoff: 50 }, touchpoints: ['Social Media Ad', 'Blog Post'] },
      { id: '2', name: 'Consideration', type: 'consideration' as TouchpointType, channels: ['email', 'organic'] as ChannelType[], metrics: { visitors: 5000, conversions: 2500, dropoff: 50 }, touchpoints: ['Email Newsletter', 'Product Page'] },
      { id: '3', name: 'Decision', type: 'decision' as TouchpointType, channels: ['direct', 'email'] as ChannelType[], metrics: { visitors: 2500, conversions: 1000, dropoff: 60 }, touchpoints: ['Demo Request', 'Pricing Page'] },
      { id: '4', name: 'Purchase', type: 'purchase' as TouchpointType, channels: ['direct'] as ChannelType[], metrics: { visitors: 1000, conversions: 500, dropoff: 50 }, touchpoints: ['Checkout', 'Payment'] },
    ]

    const newJourney: CustomerJourney = {
      id: Date.now().toString(),
      name: journeyFormData.name,
      description: journeyFormData.description,
      stages: defaultStages,
      created: new Date().toISOString()
    }

    setJourneys([...journeys, newJourney])
    setEditingJourney(null)
    setJourneyFormData({ name: '', description: '' })
    saveToLocalStorage()
    showToast('Customer journey added!', 'success')
  }

  const deleteJourney = (id: string) => {
    if (confirm('Are you sure you want to delete this journey?')) {
      setJourneys(journeys.filter(j => j.id !== id))
      saveToLocalStorage()
      showToast('Journey deleted', 'info')
    }
  }

  const calculateChannelPerformance = (): ChannelPerformance[] => {
    const channelData: Record<ChannelType, ChannelPerformance> = {} as Record<ChannelType, ChannelPerformance>

    metrics.forEach(metric => {
      if (!metric.channel) return
      if (!channelData[metric.channel]) {
        channelData[metric.channel] = {
          channel: metric.channel,
          visits: 0,
          conversions: 0,
          revenue: 0,
          cost: 0,
          conversionRate: 0,
          cpa: 0,
          roas: 0,
          roi: 0
        }
      }
      if (metric.type === 'traffic') channelData[metric.channel].visits += metric.value
      if (metric.type === 'conversions') channelData[metric.channel].conversions += metric.value
      if (metric.type === 'revenue') channelData[metric.channel].revenue += metric.value
    })

    roiAnalyses.forEach(roi => {
      if (!channelData[roi.channel]) {
        channelData[roi.channel] = {
          channel: roi.channel,
          visits: 0,
          conversions: 0,
          revenue: 0,
          cost: 0,
          conversionRate: 0,
          cpa: 0,
          roas: 0,
          roi: 0
        }
      }
      channelData[roi.channel].revenue += roi.revenue
      channelData[roi.channel].cost += roi.spend
    })

    return Object.values(channelData).map(ch => ({
      ...ch,
      conversionRate: ch.visits > 0 ? (ch.conversions / ch.visits) * 100 : 0,
      cpa: ch.conversions > 0 ? ch.cost / ch.conversions : 0,
      roas: ch.cost > 0 ? ch.revenue / ch.cost : 0,
      roi: ch.cost > 0 ? ((ch.revenue - ch.cost) / ch.cost) * 100 : 0
    }))
  }

  const channelPerformance = calculateChannelPerformance()

  // Calculate attribution by channel
  const calculateAttribution = () => {
    const attribution: Record<ChannelType, number> = {} as Record<ChannelType, number>
    const totalConversions = metrics.filter(m => m.type === 'conversions').reduce((sum, m) => sum + m.value, 0)

    metrics.filter(m => m.type === 'conversions' && m.channel).forEach(m => {
      if (m.channel) {
        attribution[m.channel] = (attribution[m.channel] || 0) + m.value
      }
    })

    return Object.entries(attribution).map(([channel, value]) => ({
      channel: channelLabels[channel as ChannelType],
      value,
      percentage: totalConversions > 0 ? (value / totalConversions) * 100 : 0
    }))
  }

  const attributionData = calculateAttribution()

  const metricTrendData = metrics
    .filter(m => m.type === 'traffic')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: m.value
    }))

  const conversionTrendData = metrics
    .filter(m => m.type === 'conversions')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: m.value
    }))

  const channelRevenueData = channelPerformance.map(ch => ({
    name: channelLabels[ch.channel],
    revenue: ch.revenue,
    cost: ch.cost,
    roi: ch.roi
  }))

  const roiComparisonData = roiAnalyses.map(roi => ({
    name: roi.name,
    roi: roi.roi,
    roas: roi.roas
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

  const totalRevenue = metrics.filter(m => m.type === 'revenue').reduce((sum, m) => sum + m.value, 0) +
                       roiAnalyses.reduce((sum, r) => sum + r.revenue, 0)
  const totalSpend = roiAnalyses.reduce((sum, r) => sum + r.spend, 0)
  const overallROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0
  const overallROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0
  const totalTraffic = metrics.filter(m => m.type === 'traffic').reduce((sum, m) => sum + m.value, 0)
  const totalConversions = metrics.filter(m => m.type === 'conversions').reduce((sum, m) => sum + m.value, 0)
  const overallConversionRate = totalTraffic > 0 ? (totalConversions / totalTraffic) * 100 : 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Marketing Analytics
              </span>
          </h1>
            <BarChart3 className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track KPIs, analyze cohorts, understand attribution, and optimize your customer journey
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                options={[
                  { value: '7d', label: 'Last 7 days' },
                  { value: '30d', label: 'Last 30 days' },
                  { value: '90d', label: 'Last 90 days' },
                  { value: '1y', label: 'Last year' },
                  { value: 'custom', label: 'Custom' }
                ]}
                className="w-40"
              />
              <Button variant="outline" size="sm" onClick={saveToLocalStorage} className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
                <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">All time</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div className="text-sm text-gray-600">Overall ROI</div>
                </div>
                <div className={`text-2xl font-bold ${overallROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overallROI >= 0 ? '+' : ''}{overallROI.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">ROAS: {overallROAS.toFixed(2)}x</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <div className="text-sm text-gray-600">Total Traffic</div>
                </div>
                <div className="text-2xl font-bold">{totalTraffic.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Visitors</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                </div>
                <div className="text-2xl font-bold">{overallConversionRate.toFixed(2)}%</div>
                <div className="text-xs text-gray-500 mt-1">{totalConversions.toLocaleString()} conversions</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {metricTrendData.length > 0 && (
                <Card>
                  <h3 className="font-semibold mb-4">Traffic Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={metricTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {conversionTrendData.length > 0 && (
                <Card>
                  <h3 className="font-semibold mb-4">Conversion Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={conversionTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attributionData.length > 0 && (
                <Card>
                  <h3 className="font-semibold mb-4">Channel Attribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={attributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ channel, percentage }) => `${channel}: ${percentage.toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {attributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {channelRevenueData.length > 0 && (
                <Card>
                  <h3 className="font-semibold mb-4">Channel Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={channelRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                      <Bar dataKey="cost" fill="#ef4444" name="Cost ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* KPIs Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Key Performance Indicators</h2>
                </div>
              <Button
                  onClick={() => {
                    setEditingMetric({
                      id: '',
                      name: '',
                      type: 'traffic',
                      value: 0,
                      previousValue: 0,
                      change: 0,
                      unit: '',
                      date: new Date().toISOString().split('T')[0],
                      channel: 'organic'
                    })
                    resetMetricForm()
                  }}
                size="sm"
                  className="shrink-0"
              >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Metric
              </Button>
              </div>

              {metrics.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No metrics yet. Add your first metric to start tracking performance.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {metrics.map((metric) => (
                    <Card key={metric.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{metric.name}</h4>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(metric.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingMetric(metric)
                              setFormData({
                                name: metric.name,
                                type: metric.type,
                                value: metric.value.toString(),
                                previousValue: metric.previousValue.toString(),
                                unit: metric.unit,
                                channel: metric.channel || 'organic',
                                date: metric.date,
                                notes: metric.notes || ''
                              })
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMetric(metric.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-2xl font-bold mb-2">
                        {metric.value.toLocaleString()} {metric.unit}
                      </div>
                      <div className="flex items-center gap-2">
                        {metric.change !== 0 && (
                          <Badge className={metric.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {metric.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                            {Math.abs(metric.change).toFixed(1)}%
                          </Badge>
                        )}
                        {metric.channel && (
                          <Badge variant="outline" className="text-xs">
                            {channelLabels[metric.channel]}
                          </Badge>
                        )}
                      </div>
            </Card>
          ))}
        </div>
              )}
            </Card>

            {editingMetric && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingMetric.id ? 'Edit Metric' : 'Add Metric'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingMetric(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Metric Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Website Visitors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Metric Type *</label>
                      <Select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as MetricType })}
                        options={[
                          { value: 'traffic', label: 'Traffic' },
                          { value: 'conversions', label: 'Conversions' },
                          { value: 'revenue', label: 'Revenue' },
                          { value: 'engagement', label: 'Engagement' },
                          { value: 'leads', label: 'Leads' },
                          { value: 'custom', label: 'Custom' }
                        ]}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Value *</label>
                      <Input
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Previous Value</label>
                      <Input
                        type="number"
                        value={formData.previousValue}
                        onChange={(e) => setFormData({ ...formData, previousValue: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                      <Input
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="e.g., visitors, $, %"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
                      <Select
                        value={formData.channel}
                        onChange={(e) => setFormData({ ...formData, channel: e.target.value as ChannelType })}
                        options={Object.entries(channelLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={editingMetric.id ? updateMetric : addMetric} className="flex-1">
                      {editingMetric.id ? 'Update Metric' : 'Add Metric'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingMetric(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Conversion Funnel Tab */}
        {activeTab === 'funnel' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Conversion Funnels</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingFunnel({
                      id: '',
                      name: '',
                      stages: [],
                      totalVisitors: 0,
                      totalConversions: 0,
                      overallConversionRate: 0,
                      created: new Date().toISOString(),
                      modified: new Date().toISOString()
                    })
                    setFunnelFormData({ name: '', stages: [] })
                    setNewStage({ name: '', visitors: '', conversions: '' })
                  }}
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funnel
                </Button>
              </div>

              {funnels.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <p>No conversion funnels yet. Add your first funnel to track conversion rates.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {funnels.map((funnel) => (
                    <Card key={funnel.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{funnel.name}</h3>
                          <div className="text-sm text-gray-600 mt-1">
                            Overall: {funnel.overallConversionRate.toFixed(2)}% ({funnel.totalConversions.toLocaleString()} / {funnel.totalVisitors.toLocaleString()})
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteFunnel(funnel.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {funnel.stages.map((stage, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{stage.name}</div>
                              <div className="text-sm text-gray-600">
                                {stage.visitors.toLocaleString()} visitors → {stage.conversions.toLocaleString()} conversions ({stage.conversionRate.toFixed(2)}%)
                              </div>
                            </div>
                            {idx < funnel.stages.length - 1 && (
                              <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">Drop-off</div>
                                <div className="font-bold text-red-600">
                                  {((1 - (funnel.stages[idx + 1].visitors / stage.visitors)) * 100).toFixed(1)}%
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {funnel.stages.length > 0 && (
                        <div className="mt-4">
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={funnel.stages.map((s) => ({
                              name: s.name,
                              visitors: s.visitors,
                              conversions: s.conversions
                            }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" fontSize={12} />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="visitors" fill="#3b82f6" name="Visitors" />
                              <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {editingFunnel && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Conversion Funnel</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingFunnel(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Funnel Name *</label>
                    <Input
                      value={funnelFormData.name}
                      onChange={(e) => setFunnelFormData({ ...funnelFormData, name: e.target.value })}
                      placeholder="e.g., Website Conversion Funnel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Funnel Stage</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                      <Input
                        value={newStage.name}
                        onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                        placeholder="Stage name"
                      />
                      <Input
                        type="number"
                        value={newStage.visitors}
                        onChange={(e) => setNewStage({ ...newStage, visitors: e.target.value })}
                        placeholder="Visitors"
                      />
                      <Input
                        type="number"
                        value={newStage.conversions}
                        onChange={(e) => setNewStage({ ...newStage, conversions: e.target.value })}
                        placeholder="Conversions"
                      />
                    </div>
                    <Button variant="outline" onClick={addFunnelStage} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Stage
                    </Button>
                  </div>
                  {funnelFormData.stages.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-medium">Funnel Stages:</div>
                      {funnelFormData.stages.map((stage, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{stage.name}</div>
                            <div className="text-sm text-gray-600">
                              {stage.visitors} visitors, {stage.conversions} conversions
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFunnelFormData({
                                ...funnelFormData,
                                stages: funnelFormData.stages.filter((_, i) => i !== idx)
                              })
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={addFunnel} className="flex-1" disabled={funnelFormData.stages.length < 2}>
                      Add Funnel
                    </Button>
                    <Button variant="outline" onClick={() => setEditingFunnel(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Cohort Analysis Tab */}
        {activeTab === 'cohort' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Layers className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Cohort Analysis</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingCohort({
                      id: '',
                      name: '',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: new Date().toISOString().split('T')[0],
                      totalUsers: 0,
                      retentionData: [],
                      created: new Date().toISOString()
                    })
                  }}
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Cohort
                </Button>
              </div>

              {cohorts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Layers className="h-16 w-16 mx-auto mb-4" />
                  <p>No cohorts yet. Add your first cohort to analyze user retention over time.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cohorts.map((cohort) => (
                    <Card key={cohort.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{cohort.name}</h3>
                          <div className="text-sm text-gray-600 mt-1">
                            {cohort.totalUsers.toLocaleString()} users | {cohort.startDate} to {cohort.endDate}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCohort(cohort.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Cohort Retention Grid */}
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left p-2 bg-gray-50">Week</th>
                              {cohort.retentionData.map((d) => (
                                <th key={d.week} className="text-center p-2 bg-gray-50">
                                  W{d.week}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-2 font-medium">Users</td>
                              {cohort.retentionData.map((d) => (
                                <td key={d.week} className="text-center p-2">
                                  {d.activeUsers}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="p-2 font-medium">Retention</td>
                              {cohort.retentionData.map((d) => {
                                const color = d.retentionRate > 70 ? 'bg-green-100' : 
                                              d.retentionRate > 40 ? 'bg-yellow-100' : 'bg-red-100'
                                return (
                                  <td key={d.week} className={`text-center p-2 ${color}`}>
                                    {d.retentionRate.toFixed(0)}%
                                  </td>
                                )
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={cohort.retentionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" tickFormatter={(w) => `W${w}`} />
                          <YAxis domain={[0, 100]} />
                          <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                          <Area type="monotone" dataKey="retentionRate" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Retention Rate" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {editingCohort && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Cohort</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingCohort(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cohort Name *</label>
                    <Input
                      value={cohortFormData.name}
                      onChange={(e) => setCohortFormData({ ...cohortFormData, name: e.target.value })}
                      placeholder="e.g., January 2024 Signups"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <Input
                        type="date"
                        value={cohortFormData.startDate}
                        onChange={(e) => setCohortFormData({ ...cohortFormData, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <Input
                        type="date"
                        value={cohortFormData.endDate}
                        onChange={(e) => setCohortFormData({ ...cohortFormData, endDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Users *</label>
                      <Input
                        type="number"
                        value={cohortFormData.totalUsers}
                        onChange={(e) => setCohortFormData({ ...cohortFormData, totalUsers: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addCohort} className="flex-1">
                      Add Cohort
                    </Button>
                    <Button variant="outline" onClick={() => setEditingCohort(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Attribution Tab */}
        {activeTab === 'attribution' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <GitBranch className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Attribution Modeling</h2>
                </div>
                <Select
                  value={attributionModel}
                  onChange={(e) => setAttributionModel(e.target.value as AttributionModel)}
                  options={Object.entries(attributionModelLabels).map(([value, label]) => ({ value, label }))}
                  className="w-48"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-4">Attribution Model Explanation</h3>
                  <div className="space-y-3">
                    {Object.entries(attributionModelLabels).map(([model, label]) => (
                      <div
                        key={model}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          attributionModel === model ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setAttributionModel(model as AttributionModel)}
                      >
                        <div className="font-medium">{label}</div>
                        <div className="text-sm text-gray-600">
                          {model === 'first-touch' && '100% credit to the first touchpoint'}
                          {model === 'last-touch' && '100% credit to the last touchpoint before conversion'}
                          {model === 'linear' && 'Equal credit distributed across all touchpoints'}
                          {model === 'time-decay' && 'More credit to touchpoints closer to conversion'}
                          {model === 'position-based' && '40% first, 40% last, 20% distributed to middle'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Channel Attribution</h3>
                  {attributionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={attributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ channel, percentage }) => `${channel}: ${percentage.toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {attributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <GitBranch className="h-12 w-12 mx-auto mb-2" />
                      <p>Add conversion metrics with channels to see attribution data</p>
                    </div>
                  )}
                </div>
              </div>

              {attributionData.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Attribution Breakdown</h3>
                  <div className="space-y-2">
                    {attributionData.map((attr, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div
                          className="w-4 h-4 rounded-full shrink-0"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{attr.channel}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{attr.value.toLocaleString()} conversions</div>
                          <div className="text-sm text-gray-600">{attr.percentage.toFixed(1)}% of total</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Customer Journey Tab */}
        {activeTab === 'journey' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Route className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Customer Journey Mapping</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingJourney({
                      id: '',
                      name: '',
                      description: '',
                      stages: [],
                      created: new Date().toISOString()
                    })
                    setJourneyFormData({ name: '', description: '' })
                  }}
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Journey
                </Button>
              </div>

              {journeys.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Route className="h-16 w-16 mx-auto mb-4" />
                  <p>No customer journeys yet. Create your first journey to visualize the customer experience.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {journeys.map((journey) => (
                    <Card key={journey.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{journey.name}</h3>
                          <div className="text-sm text-gray-600 mt-1">{journey.description}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteJourney(journey.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Journey Stages */}
                      <div className="relative">
                        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 z-0" />
                        <div className="relative z-10 flex justify-between">
                          {journey.stages.map((stage, idx) => (
                            <div key={stage.id} className="flex flex-col items-center" style={{ width: `${100 / journey.stages.length}%` }}>
                              <div
                                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold mb-2"
                                style={{ backgroundColor: touchpointColors[stage.type] }}
                              >
                                {idx + 1}
                              </div>
                              <div className="text-center">
                                <div className="font-semibold">{stage.name}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {stage.metrics.visitors.toLocaleString()} visitors
                                </div>
                                <div className="text-xs text-gray-600">
                                  {stage.metrics.dropoff}% drop-off
                                </div>
                              </div>
                              <div className="flex flex-wrap justify-center gap-1 mt-2">
                                {stage.channels.map((ch) => (
                                  <Badge key={ch} variant="outline" className="text-xs">
                                    {channelLabels[ch]}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {journey.stages.length > 0 && (
                        <div className="mt-6">
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={journey.stages.map(s => ({
                              name: s.name,
                              visitors: s.metrics.visitors,
                              conversions: s.metrics.conversions
                            }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" fontSize={12} />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="visitors" fill="#3b82f6" name="Visitors" />
                              <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {editingJourney && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create Customer Journey</h3>
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
                      placeholder="Describe the customer journey..."
                    />
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700">
                      <strong>Note:</strong> A default journey template with Awareness, Consideration, Decision, and Purchase stages will be created. You can customize it after creation.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addJourney} className="flex-1">
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

        {/* ROI Analysis Tab */}
        {activeTab === 'roi' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">ROI Analysis</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingROI({
                      id: '',
                      name: '',
                      channel: 'organic',
                      spend: 0,
                      revenue: 0,
                      roi: 0,
                      roas: 0,
                      period: '',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: new Date().toISOString().split('T')[0],
                      created: new Date().toISOString(),
                      modified: new Date().toISOString()
                    })
                    resetROIForm()
                  }}
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add ROI Analysis
                </Button>
              </div>

              {roiAnalyses.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <DollarSign className="h-16 w-16 mx-auto mb-4" />
                  <p>No ROI analyses yet. Add your first ROI analysis to track return on investment.</p>
                </div>
              ) : (
                <>
                  {roiComparisonData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">ROI Comparison</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={roiComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" fontSize={12} />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="roi" fill="#10b981" name="ROI (%)" />
                          <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#3b82f6" strokeWidth={2} name="ROAS (x)" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-4">
                    {roiAnalyses.map((roi) => (
                      <Card key={roi.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{roi.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {channelLabels[roi.channel]}
                              </Badge>
                              <Badge className={`text-xs ${roi.roi >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                ROI: {roi.roi >= 0 ? '+' : ''}{roi.roi.toFixed(1)}%
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <span className="font-medium">Spend:</span> ${roi.spend.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Revenue:</span> ${roi.revenue.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">ROAS:</span> {roi.roas.toFixed(2)}x
                              </div>
                              <div>
                                <span className="font-medium">Period:</span> {roi.period}
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Profit:</span> ${(roi.revenue - roi.spend).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteROI(roi.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </Card>

            {editingROI && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add ROI Analysis</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingROI(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Name *</label>
                      <Input
                        value={roiFormData.name}
                        onChange={(e) => setRoiFormData({ ...roiFormData, name: e.target.value })}
                        placeholder="e.g., Q1 Paid Ads Campaign"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Channel *</label>
                      <Select
                        value={roiFormData.channel}
                        onChange={(e) => setRoiFormData({ ...roiFormData, channel: e.target.value as ChannelType })}
                        options={Object.entries(channelLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Spend ($) *</label>
                      <Input
                        type="number"
                        value={roiFormData.spend}
                        onChange={(e) => setRoiFormData({ ...roiFormData, spend: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Revenue ($) *</label>
                      <Input
                        type="number"
                        value={roiFormData.revenue}
                        onChange={(e) => setRoiFormData({ ...roiFormData, revenue: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  {roiFormData.spend && roiFormData.revenue && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 mb-1">ROI:</div>
                          <div className={`text-xl font-bold ${(parseFloat(roiFormData.revenue) - parseFloat(roiFormData.spend)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {((parseFloat(roiFormData.revenue) - parseFloat(roiFormData.spend)) / parseFloat(roiFormData.spend) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">ROAS:</div>
                          <div className="text-xl font-bold text-primary-600">
                            {(parseFloat(roiFormData.revenue) / parseFloat(roiFormData.spend)).toFixed(2)}x
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={addROI} className="flex-1">
                      Add Analysis
                    </Button>
                    <Button variant="outline" onClick={() => setEditingROI(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Channels Tab */}
        {activeTab === 'channels' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Channel Performance</h2>
              {channelPerformance.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Megaphone className="h-16 w-16 mx-auto mb-4" />
                  <p>No channel performance data yet. Add metrics and ROI analyses to see channel performance.</p>
                </div>
              ) : (
                <>
                  {channelRevenueData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Revenue vs Cost by Channel</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={channelRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" fontSize={10} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                          <Bar dataKey="cost" fill="#ef4444" name="Cost ($)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-4">
                    {channelPerformance.map((perf) => (
                      <Card key={perf.channel} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: channelColors[perf.channel] }}
                            />
                            <h4 className="font-semibold">{channelLabels[perf.channel]}</h4>
                          </div>
                          <Badge className={perf.roi >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            ROI: {perf.roi >= 0 ? '+' : ''}{perf.roi.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600 mb-1">Visits</div>
                            <div className="font-bold">{perf.visits.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Conversions</div>
                            <div className="font-bold">{perf.conversions.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Conversion Rate</div>
                            <div className="font-bold">{perf.conversionRate.toFixed(2)}%</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">CPA</div>
                            <div className="font-bold">${perf.cpa.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Revenue</div>
                            <div className="font-bold text-green-600">${perf.revenue.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Cost</div>
                            <div className="font-bold text-red-600">${perf.cost.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">ROAS</div>
                            <div className="font-bold">{perf.roas.toFixed(2)}x</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">ROI</div>
                            <div className={`font-bold ${perf.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {perf.roi >= 0 ? '+' : ''}{perf.roi.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
