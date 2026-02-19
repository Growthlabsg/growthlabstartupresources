'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Save, 
  Download, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  XCircle,
  ArrowUp,
  ArrowDown,
  Percent,
  Users,
  MousePointerClick,
  Filter,
  Calendar,
  Activity,
  Zap,
  FileText,
  PieChart,
  LineChart as LineChartIcon,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Info,
  History,
  Sparkles
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts'

type ChannelType = 'organic' | 'paid' | 'social' | 'email' | 'direct' | 'referral' | 'other'
type ConversionType = 'purchase' | 'signup' | 'download' | 'form' | 'trial' | 'subscription' | 'other'

interface ConversionData {
  id: string
  name: string
  channel: ChannelType
  conversionType: ConversionType
  visitors: number
  conversions: number
  conversionRate: number
  revenue?: number
  cost?: number
  date: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface FunnelStage {
  id: string
  name: string
  visitors: number
  conversions: number
  conversionRate: number
  dropOff: number
  order: number
}

interface ConversionFunnel {
  id: string
  name: string
  stages: FunnelStage[]
  totalVisitors: number
  totalConversions: number
  overallConversionRate: number
  createdAt: string
  updatedAt: string
}

interface ABTest {
  id: string
  name: string
  variantA: {
    visitors: number
    conversions: number
    conversionRate: number
  }
  variantB: {
    visitors: number
    conversions: number
    conversionRate: number
  }
  improvement: number
  significance: 'high' | 'medium' | 'low'
  createdAt: string
}

const channelLabels: Record<ChannelType, string> = {
  'organic': 'Organic Search',
  'paid': 'Paid Ads',
  'social': 'Social Media',
  'email': 'Email',
  'direct': 'Direct',
  'referral': 'Referral',
  'other': 'Other'
}

const channelColors: Record<ChannelType, string> = {
  'organic': '#10b981',
  'paid': '#3b82f6',
  'social': '#8b5cf6',
  'email': '#f59e0b',
  'direct': '#6366f1',
  'referral': '#ec4899',
  'other': '#6b7280'
}

const conversionTypeLabels: Record<ConversionType, string> = {
  'purchase': 'Purchase',
  'signup': 'Signup',
  'download': 'Download',
  'form': 'Form Submission',
  'trial': 'Trial Signup',
  'subscription': 'Subscription',
  'other': 'Other'
}

export default function ConversionRateCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [visitors, setVisitors] = useState('')
  const [conversions, setConversions] = useState('')
  const [conversionRate, setConversionRate] = useState<number | null>(null)
  const [conversionData, setConversionData] = useState<ConversionData[]>([])
  const [funnels, setFunnels] = useState<ConversionFunnel[]>([])
  const [abTests, setAbTests] = useState<ABTest[]>([])
  const [editingData, setEditingData] = useState<ConversionData | null>(null)
  const [editingFunnel, setEditingFunnel] = useState<ConversionFunnel | null>(null)
  const [editingABTest, setEditingABTest] = useState<ABTest | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    channel: 'organic' as ChannelType,
    conversionType: 'purchase' as ConversionType,
    visitors: '',
    conversions: '',
    revenue: '',
    cost: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [funnelFormData, setFunnelFormData] = useState({
    name: '',
    stages: [] as Array<{ name: string; visitors: number; conversions: number }>
  })
  const [newStage, setNewStage] = useState({ name: '', visitors: '', conversions: '' })
  const [abTestFormData, setAbTestFormData] = useState({
    name: '',
    variantAVisitors: '',
    variantAConversions: '',
    variantBVisitors: '',
    variantBConversions: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterChannel, setFilterChannel] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'tracking', label: 'Tracking', icon: Target },
    { id: 'funnel', label: 'Funnel', icon: TrendingUp },
    { id: 'abtest', label: 'A/B Tests', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('conversionRateCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.conversionData) setConversionData(data.conversionData)
          if (data.funnels) setFunnels(data.funnels)
          if (data.abTests) setAbTests(data.abTests)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        conversionData,
        funnels,
        abTests,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('conversionRateCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const calculate = () => {
    const vis = parseFloat(visitors)
    const conv = parseFloat(conversions)
    
    if (!vis || !conv || vis === 0 || conv > vis) {
      showToast('Please enter valid values. Conversions cannot exceed visitors.', 'error')
      return
    }

    const rate = (conv / vis) * 100
    setConversionRate(rate)
    showToast('Conversion rate calculated!', 'success')
  }

  const addConversionData = () => {
    if (!formData.name || !formData.visitors || !formData.conversions) {
      showToast('Please fill in name, visitors, and conversions', 'error')
      return
    }

    const vis = parseFloat(formData.visitors) || 0
    const conv = parseFloat(formData.conversions) || 0
    const rate = vis > 0 ? (conv / vis) * 100 : 0

    const newData: ConversionData = {
      id: Date.now().toString(),
      name: formData.name,
      channel: formData.channel,
      conversionType: formData.conversionType,
      visitors: vis,
      conversions: conv,
      conversionRate: rate,
      revenue: formData.revenue ? parseFloat(formData.revenue) : undefined,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      date: formData.date,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setConversionData([...conversionData, newData])
    setEditingData(null)
    setFormData({
      name: '',
      channel: 'organic',
      conversionType: 'purchase',
      visitors: '',
      conversions: '',
      revenue: '',
      cost: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
    saveToLocalStorage()
    showToast('Conversion data added!', 'success')
  }

  const updateConversionData = () => {
    if (!editingData) return

    const vis = parseFloat(formData.visitors) || 0
    const conv = parseFloat(formData.conversions) || 0
    const rate = vis > 0 ? (conv / vis) * 100 : 0

    const updated: ConversionData = {
      ...editingData,
      name: formData.name,
      channel: formData.channel,
      conversionType: formData.conversionType,
      visitors: vis,
      conversions: conv,
      conversionRate: rate,
      revenue: formData.revenue ? parseFloat(formData.revenue) : undefined,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      date: formData.date,
      notes: formData.notes || undefined,
      updatedAt: new Date().toISOString()
    }

    const updatedData = conversionData.map(d => d.id === editingData.id ? updated : d)
    setConversionData(updatedData)
    setEditingData(null)
    setFormData({
      name: '',
      channel: 'organic',
      conversionType: 'purchase',
      visitors: '',
      conversions: '',
      revenue: '',
      cost: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
    saveToLocalStorage()
    showToast('Conversion data updated!', 'success')
  }

  const deleteConversionData = (id: string) => {
    if (confirm('Are you sure you want to delete this conversion data?')) {
      const updated = conversionData.filter(d => d.id !== id)
      setConversionData(updated)
      saveToLocalStorage()
      showToast('Conversion data deleted', 'info')
    }
  }

  const addFunnel = () => {
    if (!funnelFormData.name || funnelFormData.stages.length < 2) {
      showToast('Please add at least 2 funnel stages', 'error')
      return
    }

    const stages = funnelFormData.stages.map((stage, idx) => {
      const prevVisitors = idx > 0 ? funnelFormData.stages[idx - 1].visitors : stage.visitors
      const dropOff = prevVisitors > 0 ? ((prevVisitors - stage.visitors) / prevVisitors) * 100 : 0
      return {
        id: idx.toString(),
        name: stage.name,
        visitors: stage.visitors,
        conversions: stage.conversions,
        conversionRate: stage.visitors > 0 ? (stage.conversions / stage.visitors) * 100 : 0,
        dropOff,
        order: idx + 1
      }
    })

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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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

  const addABTest = () => {
    if (!abTestFormData.name || !abTestFormData.variantAVisitors || !abTestFormData.variantBVisitors) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const variantAVisitors = parseFloat(abTestFormData.variantAVisitors) || 0
    const variantAConversions = parseFloat(abTestFormData.variantAConversions) || 0
    const variantARate = variantAVisitors > 0 ? (variantAConversions / variantAVisitors) * 100 : 0

    const variantBVisitors = parseFloat(abTestFormData.variantBVisitors) || 0
    const variantBConversions = parseFloat(abTestFormData.variantBConversions) || 0
    const variantBRate = variantBVisitors > 0 ? (variantBConversions / variantBVisitors) * 100 : 0

    const improvement = variantARate > 0 ? ((variantBRate - variantARate) / variantARate) * 100 : 0
    const significance = Math.abs(improvement) > 20 ? 'high' : Math.abs(improvement) > 10 ? 'medium' : 'low'

    const newTest: ABTest = {
      id: Date.now().toString(),
      name: abTestFormData.name,
      variantA: {
        visitors: variantAVisitors,
        conversions: variantAConversions,
        conversionRate: variantARate
      },
      variantB: {
        visitors: variantBVisitors,
        conversions: variantBConversions,
        conversionRate: variantBRate
      },
      improvement,
      significance,
      createdAt: new Date().toISOString()
    }

    setAbTests([...abTests, newTest])
    setEditingABTest(null)
    setAbTestFormData({
      name: '',
      variantAVisitors: '',
      variantAConversions: '',
      variantBVisitors: '',
      variantBConversions: ''
    })
    saveToLocalStorage()
    showToast('A/B test added!', 'success')
  }

  const deleteABTest = (id: string) => {
    if (confirm('Are you sure you want to delete this A/B test?')) {
      const updated = abTests.filter(t => t.id !== id)
      setAbTests(updated)
      saveToLocalStorage()
      showToast('A/B test deleted', 'info')
    }
  }

  const filteredData = conversionData.filter(data => {
    const matchesSearch = data.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesChannel = filterChannel === 'all' || data.channel === filterChannel
    const matchesType = filterType === 'all' || data.conversionType === filterType
    return matchesSearch && matchesChannel && matchesType
  })

  const channelPerformance = Object.entries(
    conversionData.reduce((acc, data) => {
      if (!acc[data.channel]) {
        acc[data.channel] = { visitors: 0, conversions: 0 }
      }
      acc[data.channel].visitors += data.visitors
      acc[data.channel].conversions += data.conversions
      return acc
    }, {} as Record<ChannelType, { visitors: number; conversions: number }>)
  ).map(([channel, data]) => ({
    channel: channelLabels[channel as ChannelType],
    visitors: data.visitors,
    conversions: data.conversions,
    conversionRate: data.visitors > 0 ? (data.conversions / data.visitors) * 100 : 0
  }))

  const trendData = conversionData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(data => ({
      date: new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rate: data.conversionRate,
      name: data.name
    }))

  const totalVisitors = conversionData.reduce((sum, d) => sum + d.visitors, 0)
  const totalConversions = conversionData.reduce((sum, d) => sum + d.conversions, 0)
  const averageConversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0
  const totalRevenue = conversionData.reduce((sum, d) => sum + (d.revenue || 0), 0)
  const totalCost = conversionData.reduce((sum, d) => sum + (d.cost || 0), 0)
  const roi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

  const getBenchmarkColor = (rate: number) => {
    if (rate >= 5) return 'green'
    if (rate >= 2) return 'blue'
    if (rate >= 1) return 'yellow'
    return 'red'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Conversion Rate Calculator
              </span>
            </h1>
            <Target className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate, track, and optimize conversion rates across channels and funnels
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

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Visitors
                    </label>
                    <Input
                      type="number"
                      value={visitors}
                      onChange={(e) => setVisitors(e.target.value)}
                      placeholder="e.g., 10000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conversions
                    </label>
                    <Input
                      type="number"
                      value={conversions}
                      onChange={(e) => setConversions(e.target.value)}
                      placeholder="e.g., 250"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sales, signups, downloads, etc.</p>
                  </div>

                  <Button onClick={calculate} className="w-full" size="lg">
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate Conversion Rate
                  </Button>

                  {conversionRate !== null && (
                    <div className="space-y-4 pt-6 border-t">
                      <div className={`bg-${getBenchmarkColor(conversionRate)}-500/10 border-2 border-${getBenchmarkColor(conversionRate)}-500/20 rounded-lg p-6 text-center`}>
                        <p className="text-sm text-gray-600 mb-2">Conversion Rate</p>
                        <p className={`text-4xl font-bold text-${getBenchmarkColor(conversionRate)}-600`}>
                          {conversionRate.toFixed(2)}%
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {conversionRate >= 5 && '✅ Excellent conversion rate!'}
                          {conversionRate >= 2 && conversionRate < 5 && '👍 Good conversion rate'}
                          {conversionRate >= 1 && conversionRate < 2 && '⚠️ Average - room for improvement'}
                          {conversionRate < 1 && '❌ Below average - optimize your funnel'}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium mb-3">Benchmark Comparison</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Excellent</span>
                            <span className="font-semibold text-green-600">&gt; 5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Good</span>
                            <span className="font-semibold text-blue-600">2-5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Average</span>
                            <span className="font-semibold text-yellow-600">1-2%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Below Average</span>
                            <span className="font-semibold text-red-600">&lt; 1%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary-500" />
                  Conversion Rate Formula
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    Conversion rate measures the percentage of visitors who complete a desired action.
                  </p>
                  <p className="font-medium text-gray-700">Formula:</p>
                  <code className="block bg-gray-100 p-2 rounded text-xs">
                    Conversion Rate = (Conversions / Visitors) × 100%
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    Common conversion actions include purchases, signups, downloads, or form submissions.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Conversion Tracking</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-48"
                  />
                  <Select
                    value={filterChannel}
                    onChange={(e) => setFilterChannel(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Channels' },
                      ...Object.entries(channelLabels).map(([value, label]) => ({ value, label }))
                    ]}
                  />
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Types' },
                      ...Object.entries(conversionTypeLabels).map(([value, label]) => ({ value, label }))
                    ]}
                  />
                  <Button
                    onClick={() => {
                      setEditingData({
                        id: '',
                        name: '',
                        channel: 'organic',
                        conversionType: 'purchase',
                        visitors: 0,
                        conversions: 0,
                        conversionRate: 0,
                        date: new Date().toISOString().split('T')[0],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      })
                      setFormData({
                        name: '',
                        channel: 'organic',
                        conversionType: 'purchase',
                        visitors: '',
                        conversions: '',
                        revenue: '',
                        cost: '',
                        date: new Date().toISOString().split('T')[0],
                        notes: ''
                      })
                    }}
                    size="sm"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Data
                  </Button>
                </div>
              </div>

              {filteredData.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No conversion data yet. Add your first conversion data to start tracking.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredData.map((data) => (
                    <Card key={data.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{data.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {channelLabels[data.channel]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {conversionTypeLabels[data.conversionType]}
                            </Badge>
                            <Badge className={`text-xs bg-${getBenchmarkColor(data.conversionRate)}-100 text-${getBenchmarkColor(data.conversionRate)}-800`}>
                              {data.conversionRate.toFixed(2)}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Visitors:</span> {data.visitors.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Conversions:</span> {data.conversions.toLocaleString()}
                            </div>
                            {data.revenue && (
                              <div>
                                <span className="font-medium">Revenue:</span> ${data.revenue.toLocaleString()}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Date:</span> {new Date(data.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingData(data)
                              setFormData({
                                name: data.name,
                                channel: data.channel,
                                conversionType: data.conversionType,
                                visitors: data.visitors.toString(),
                                conversions: data.conversions.toString(),
                                revenue: data.revenue?.toString() || '',
                                cost: data.cost?.toString() || '',
                                date: data.date,
                                notes: data.notes || ''
                              })
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteConversionData(data.id)}
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

            {editingData && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingData.id ? 'Edit Conversion Data' : 'Add Conversion Data'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingData(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Landing Page Q1"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Channel *</label>
                      <Select
                        value={formData.channel}
                        onChange={(e) => setFormData({ ...formData, channel: e.target.value as ChannelType })}
                        options={Object.entries(channelLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Type *</label>
                      <Select
                        value={formData.conversionType}
                        onChange={(e) => setFormData({ ...formData, conversionType: e.target.value as ConversionType })}
                        options={Object.entries(conversionTypeLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Visitors *</label>
                      <Input
                        type="number"
                        value={formData.visitors}
                        onChange={(e) => setFormData({ ...formData, visitors: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Conversions *</label>
                      <Input
                        type="number"
                        value={formData.conversions}
                        onChange={(e) => setFormData({ ...formData, conversions: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Revenue ($)</label>
                      <Input
                        type="number"
                        value={formData.revenue}
                        onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
                      <Input
                        type="number"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes..."
                    />
                  </div>
                  {formData.visitors && formData.conversions && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm">
                        <div className="text-gray-600 mb-1">Conversion Rate:</div>
                        <div className="text-xl font-bold text-primary-600">
                          {((parseFloat(formData.conversions) / parseFloat(formData.visitors)) * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={editingData.id ? updateConversionData : addConversionData} className="flex-1">
                      {editingData.id ? 'Update Data' : 'Add Data'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingData(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Funnel Tab */}
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
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
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
                  <p>No conversion funnels yet. Add your first funnel to track conversion stages.</p>
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
                          <div key={stage.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{stage.name}</div>
                              <div className="text-sm text-gray-600">
                                {stage.visitors.toLocaleString()} visitors → {stage.conversions.toLocaleString()} conversions ({stage.conversionRate.toFixed(2)}%)
                              </div>
                            </div>
                            {idx > 0 && (
                              <div className="text-center">
                                <div className="text-xs text-gray-500 mb-1">Drop-off</div>
                                <div className="font-bold text-red-600">
                                  {stage.dropOff.toFixed(1)}%
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {funnel.stages.length > 0 && (
                        <Card className="mt-4">
                          <h4 className="font-semibold mb-3">Funnel Visualization</h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={funnel.stages.map(s => ({
                              name: s.name,
                              visitors: s.visitors,
                              conversions: s.conversions
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

        {/* A/B Tests Tab */}
        {activeTab === 'abtest' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">A/B Tests</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingABTest({
                      id: '',
                      name: '',
                      variantA: { visitors: 0, conversions: 0, conversionRate: 0 },
                      variantB: { visitors: 0, conversions: 0, conversionRate: 0 },
                      improvement: 0,
                      significance: 'low',
                      createdAt: new Date().toISOString()
                    })
                    setAbTestFormData({
                      name: '',
                      variantAVisitors: '',
                      variantAConversions: '',
                      variantBVisitors: '',
                      variantBConversions: ''
                    })
                  }}
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add A/B Test
                </Button>
              </div>

              {abTests.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Zap className="h-16 w-16 mx-auto mb-4" />
                  <p>No A/B tests yet. Add your first A/B test to compare conversion rates.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {abTests.map((test) => (
                    <Card key={test.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{test.name}</h4>
                            <Badge className={`text-xs ${
                              test.significance === 'high' ? 'bg-green-100 text-green-800' :
                              test.significance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {test.significance === 'high' ? 'High Significance' :
                               test.significance === 'medium' ? 'Medium Significance' :
                               'Low Significance'}
                            </Badge>
                            <Badge className={`text-xs ${test.improvement >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {test.improvement >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                              {Math.abs(test.improvement).toFixed(1)}% improvement
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Variant A:</span> {test.variantA.conversionRate.toFixed(2)}%
                            </div>
                            <div>
                              <span className="font-medium">Variant B:</span> {test.variantB.conversionRate.toFixed(2)}%
                            </div>
                            <div>
                              <span className="font-medium">A Visitors:</span> {test.variantA.visitors.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">B Visitors:</span> {test.variantB.visitors.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteABTest(test.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {editingABTest && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add A/B Test</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingABTest(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Name *</label>
                    <Input
                      value={abTestFormData.name}
                      onChange={(e) => setAbTestFormData({ ...abTestFormData, name: e.target.value })}
                      placeholder="e.g., Headline A/B Test"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant A Visitors *</label>
                      <Input
                        type="number"
                        value={abTestFormData.variantAVisitors}
                        onChange={(e) => setAbTestFormData({ ...abTestFormData, variantAVisitors: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant A Conversions *</label>
                      <Input
                        type="number"
                        value={abTestFormData.variantAConversions}
                        onChange={(e) => setAbTestFormData({ ...abTestFormData, variantAConversions: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant B Visitors *</label>
                      <Input
                        type="number"
                        value={abTestFormData.variantBVisitors}
                        onChange={(e) => setAbTestFormData({ ...abTestFormData, variantBVisitors: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant B Conversions *</label>
                      <Input
                        type="number"
                        value={abTestFormData.variantBConversions}
                        onChange={(e) => setAbTestFormData({ ...abTestFormData, variantBConversions: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  {abTestFormData.variantAVisitors && abTestFormData.variantBVisitors && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 mb-1">Variant A Rate:</div>
                          <div className="text-xl font-bold text-primary-600">
                            {((parseFloat(abTestFormData.variantAConversions) / parseFloat(abTestFormData.variantAVisitors)) * 100).toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Variant B Rate:</div>
                          <div className="text-xl font-bold text-primary-600">
                            {((parseFloat(abTestFormData.variantBConversions) / parseFloat(abTestFormData.variantBVisitors)) * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={addABTest} className="flex-1">
                      Add A/B Test
                    </Button>
                    <Button variant="outline" onClick={() => setEditingABTest(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Visitors</div>
                <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Conversions</div>
                <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Avg Conversion Rate</div>
                <div className="text-2xl font-bold">{averageConversionRate.toFixed(2)}%</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">ROI</div>
                <div className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                </div>
              </Card>
            </div>

            {channelPerformance.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Channel Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visitors" fill="#3b82f6" name="Visitors" />
                    <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {trendData.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Conversion Rate Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="rate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            )}

            {channelPerformance.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Conversion Rate by Channel</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversionRate" fill="#10b981" name="Conversion Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <History className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Calculation History</h2>
              </div>
              {conversionData.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No calculation history yet. Start tracking conversions to see history.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversionData
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((data) => (
                      <div key={data.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{data.name}</h4>
                            <div className="text-sm text-gray-600">
                              {new Date(data.date).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge className={`text-xs bg-${getBenchmarkColor(data.conversionRate)}-100 text-${getBenchmarkColor(data.conversionRate)}-800`}>
                            {data.conversionRate.toFixed(2)}%
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {data.visitors.toLocaleString()} visitors → {data.conversions.toLocaleString()} conversions
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
