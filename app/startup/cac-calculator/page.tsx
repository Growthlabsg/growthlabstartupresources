'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Calculator,
  TrendingUp,
  Sparkles,
  DollarSign,
  Target,
  BarChart3,
  History,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  Save,
  Download,
  Users,
  Percent,
  TrendingDown,
  PieChart,
  Calendar
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

type MarketingChannel = 'paid-ads' | 'organic' | 'social' | 'email' | 'content' | 'referral' | 'other'

interface MarketingChannelData {
  id: string
  channel: MarketingChannel
  spend: number
  customers: number
  cac: number
  date: string
  notes?: string
}

interface CACPeriod {
  id: string
  name: string
  startDate: string
  endDate: string
  totalSpend: number
  totalCustomers: number
  cac: number
  ltv?: number
  ltvCacRatio?: number
  paybackPeriod?: number
  notes?: string
}

interface Cohort {
  id: string
  name: string
  startDate: string
  customers: number
  totalSpend: number
  cac: number
  revenue: number
  ltv: number
}

export default function CACCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [marketingSpend, setMarketingSpend] = useState('')
  const [customersAcquired, setCustomersAcquired] = useState('')
  const [cac, setCac] = useState<number | null>(null)
  const [ltv, setLtv] = useState('')
  const [channels, setChannels] = useState<MarketingChannelData[]>([])
  const [editingChannel, setEditingChannel] = useState<MarketingChannelData | null>(null)
  const [periods, setPeriods] = useState<CACPeriod[]>([])
  const [editingPeriod, setEditingPeriod] = useState<CACPeriod | null>(null)
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null)

  const tabs = [
    { id: 'calculator', label: 'CAC Calculator', icon: Calculator },
    { id: 'channels', label: 'Channels', icon: PieChart },
    { id: 'periods', label: 'Periods', icon: Calendar },
    { id: 'cohorts', label: 'Cohorts', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cacCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.channels) setChannels(data.channels)
          if (data.periods) setPeriods(data.periods)
          if (data.cohorts) setCohorts(data.cohorts)
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
        periods,
        cohorts,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('cacCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const calculateCAC = () => {
    const spend = parseFloat(marketingSpend)
    const customers = parseFloat(customersAcquired)
    
    if (!spend || !customers || customers === 0) {
      showToast('Please enter valid values', 'error')
      return
    }

    const calculatedCAC = spend / customers
    setCac(calculatedCAC)
    showToast('CAC calculated!', 'success')
  }

  const calculateLTVCACRatio = (ltvValue: number, cacValue: number) => {
    if (cacValue === 0) return 0
    return ltvValue / cacValue
  }

  const calculatePaybackPeriod = (cacValue: number, monthlyRevenue: number) => {
    if (monthlyRevenue === 0) return Infinity
    return cacValue / monthlyRevenue
  }

  const addChannel = () => {
    const newChannel: MarketingChannelData = {
      id: Date.now().toString(),
      channel: 'paid-ads',
      spend: 0,
      customers: 0,
      cac: 0,
      date: new Date().toISOString().split('T')[0]
    }
    setEditingChannel(newChannel)
  }

  const saveChannel = () => {
    if (!editingChannel) return
    if (editingChannel.spend <= 0 || editingChannel.customers <= 0) {
      showToast('Please enter valid spend and customers', 'error')
      return
    }

    const calculatedCAC = editingChannel.spend / editingChannel.customers
    const updatedChannel = { ...editingChannel, cac: calculatedCAC }

    const updated = channels.find(c => c.id === updatedChannel.id)
      ? channels.map(c => c.id === updatedChannel.id ? updatedChannel : c)
      : [...channels, updatedChannel]

    setChannels(updated)
    setEditingChannel(null)
    saveToLocalStorage()
    showToast('Channel saved!', 'success')
  }

  const deleteChannel = (id: string) => {
    if (confirm('Are you sure you want to delete this channel?')) {
      const updated = channels.filter(c => c.id !== id)
      setChannels(updated)
      saveToLocalStorage()
      showToast('Channel deleted', 'info')
    }
  }

  const addPeriod = () => {
    const newPeriod: CACPeriod = {
      id: Date.now().toString(),
      name: 'New Period',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalSpend: 0,
      totalCustomers: 0,
      cac: 0
    }
    setEditingPeriod(newPeriod)
  }

  const savePeriod = () => {
    if (!editingPeriod) return
    if (!editingPeriod.name || editingPeriod.totalSpend <= 0 || editingPeriod.totalCustomers <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const calculatedCAC = editingPeriod.totalSpend / editingPeriod.totalCustomers
    const ltvValue = editingPeriod.ltv || 0
    const ltvCacRatio = ltvValue > 0 ? calculateLTVCACRatio(ltvValue, calculatedCAC) : undefined

    const updatedPeriod = {
      ...editingPeriod,
      cac: calculatedCAC,
      ltvCacRatio
    }

    const updated = periods.find(p => p.id === updatedPeriod.id)
      ? periods.map(p => p.id === updatedPeriod.id ? updatedPeriod : p)
      : [...periods, updatedPeriod]

    setPeriods(updated)
    setEditingPeriod(null)
    saveToLocalStorage()
    showToast('Period saved!', 'success')
  }

  const deletePeriod = (id: string) => {
    if (confirm('Are you sure you want to delete this period?')) {
      const updated = periods.filter(p => p.id !== id)
      setPeriods(updated)
      saveToLocalStorage()
      showToast('Period deleted', 'info')
    }
  }

  const addCohort = () => {
    const newCohort: Cohort = {
      id: Date.now().toString(),
      name: 'New Cohort',
      startDate: new Date().toISOString().split('T')[0],
      customers: 0,
      totalSpend: 0,
      cac: 0,
      revenue: 0,
      ltv: 0
    }
    setEditingCohort(newCohort)
  }

  const saveCohort = () => {
    if (!editingCohort) return
    if (!editingCohort.name || editingCohort.totalSpend <= 0 || editingCohort.customers <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const calculatedCAC = editingCohort.totalSpend / editingCohort.customers
    const calculatedLTV = editingCohort.revenue / editingCohort.customers

    const updatedCohort = {
      ...editingCohort,
      cac: calculatedCAC,
      ltv: calculatedLTV
    }

    const updated = cohorts.find(c => c.id === updatedCohort.id)
      ? cohorts.map(c => c.id === updatedCohort.id ? updatedCohort : c)
      : [...cohorts, updatedCohort]

    setCohorts(updated)
    setEditingCohort(null)
    saveToLocalStorage()
    showToast('Cohort saved!', 'success')
  }

  const deleteCohort = (id: string) => {
    if (confirm('Are you sure you want to delete this cohort?')) {
      const updated = cohorts.filter(c => c.id !== id)
      setCohorts(updated)
      saveToLocalStorage()
      showToast('Cohort deleted', 'info')
    }
  }

  const exportData = () => {
    const data = {
      currentCalculation: {
        marketingSpend: parseFloat(marketingSpend) || 0,
        customersAcquired: parseFloat(customersAcquired) || 0,
        cac,
        ltv: parseFloat(ltv) || 0,
        ltvCacRatio: ltv && cac ? calculateLTVCACRatio(parseFloat(ltv), cac) : null
      },
      channels,
      periods,
      cohorts,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cac-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported!', 'success')
  }

  const channelLabels: Record<MarketingChannel, string> = {
    'paid-ads': 'Paid Ads',
    'organic': 'Organic',
    'social': 'Social Media',
    'email': 'Email Marketing',
    'content': 'Content Marketing',
    'referral': 'Referral',
    'other': 'Other'
  }

  const channelColors: Record<MarketingChannel, string> = {
    'paid-ads': '#3b82f6',
    'organic': '#10b981',
    'social': '#f59e0b',
    'email': '#8b5cf6',
    'content': '#ec4899',
    'referral': '#06b6d4',
    'other': '#6b7280'
  }

  const channelChartData = channels.map(c => ({
    name: channelLabels[c.channel],
    cac: c.cac,
    spend: c.spend,
    customers: c.customers
  }))

  const channelPieData = Object.entries(
    channels.reduce((acc, c) => {
      acc[c.channel] = (acc[c.channel] || 0) + c.spend
      return acc
    }, {} as Record<MarketingChannel, number>)
  ).map(([channel, value]) => ({
    name: channelLabels[channel as MarketingChannel],
    value
  }))

  const cacHistory = periods.map(p => ({
    name: p.name,
    cac: p.cac,
    month: new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }))

  const ltvCacRatio = ltv && cac ? calculateLTVCACRatio(parseFloat(ltv), cac) : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            CAC Calculator
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate Customer Acquisition Cost, track by channel, and optimize marketing spend
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={saveToLocalStorage} className="shrink-0">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={exportData} className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">CAC</div>
                <div className="text-2xl font-bold text-primary-600">
                  {cac !== null ? `$${cac.toFixed(2)}` : '$0'}
                </div>
                <div className="text-xs text-gray-500 mt-1">per customer</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">LTV:CAC Ratio</div>
                <div className="text-2xl font-bold">
                  {ltvCacRatio !== null ? ltvCacRatio.toFixed(2) : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {ltvCacRatio !== null && ltvCacRatio < 3 && <span className="text-red-600">⚠️ Low</span>}
                  {ltvCacRatio !== null && ltvCacRatio >= 3 && ltvCacRatio < 5 && <span className="text-yellow-600">⚠️ Moderate</span>}
                  {ltvCacRatio !== null && ltvCacRatio >= 5 && <span className="text-green-600">✅ Good</span>}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Spend</div>
                <div className="text-2xl font-bold">
                  {marketingSpend ? `$${(parseFloat(marketingSpend) / 1000).toFixed(0)}K` : '$0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Customers</div>
                <div className="text-2xl font-bold">
                  {customersAcquired ? parseInt(customersAcquired).toLocaleString() : '0'}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary-500" />
                  CAC Calculator
                </h3>
                <div className="space-y-4">
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Marketing Spend ($) *</label>
                    <Input
                type="number"
                value={marketingSpend}
                onChange={(e) => setMarketingSpend(e.target.value)}
                      placeholder="10000"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Customers Acquired *</label>
                    <Input
                type="number"
                value={customersAcquired}
                onChange={(e) => setCustomersAcquired(e.target.value)}
                      placeholder="100"
              />
            </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LTV (Lifetime Value) ($)</label>
                    <Input
                      type="number"
                      value={ltv}
                      onChange={(e) => setLtv(e.target.value)}
                      placeholder="300"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional - for LTV:CAC ratio</p>
                  </div>
            <Button onClick={calculateCAC} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate CAC
            </Button>
            {cac !== null && (
              <div className="bg-primary-500/10 border-2 border-primary-500/20 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Customer Acquisition Cost</p>
                <p className="text-3xl font-bold text-primary-500">${cac.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-2">per customer</p>
                      {ltvCacRatio !== null && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600 mb-1">LTV:CAC Ratio</p>
                          <p className="text-2xl font-bold">
                            {ltvCacRatio.toFixed(2)}:1
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {ltvCacRatio < 3 && '⚠️ Low ratio - optimize CAC or increase LTV'}
                            {ltvCacRatio >= 3 && ltvCacRatio < 5 && '⚠️ Moderate ratio - aim for 5:1'}
                            {ltvCacRatio >= 5 && '✅ Good ratio - sustainable growth'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary-500" />
                  About CAC
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Customer Acquisition Cost (CAC)</strong> is the total cost of acquiring a new customer, including all marketing and sales expenses.
                  </p>
                  <p>
                    <strong>LTV:CAC Ratio</strong> measures customer value vs acquisition cost. Ideal ratio is 3:1 or higher.
                  </p>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-yellow-900 mb-1">Best Practices</div>
                        <ul className="text-xs text-yellow-800 space-y-1">
                          <li>• Aim for LTV:CAC ratio of 3:1 or higher</li>
                          <li>• Track CAC by marketing channel</li>
                          <li>• Monitor CAC trends over time</li>
                          <li>• Payback period should be &lt;12 months</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
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
                  <PieChart className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Marketing Channels</h2>
                </div>
                <Button onClick={addChannel} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Channel
                </Button>
              </div>

              {channels.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <PieChart className="h-16 w-16 mx-auto mb-4" />
                  <p>No channels yet. Add marketing channels to track CAC by channel.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Average CAC</div>
                      <div className="text-2xl font-bold">
                        ${(channels.reduce((sum, c) => sum + c.cac, 0) / channels.length).toFixed(2)}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Total Spend</div>
                      <div className="text-2xl font-bold">
                        ${(channels.reduce((sum, c) => sum + c.spend, 0) / 1000).toFixed(0)}K
                      </div>
                    </Card>
                  </div>

                  {channelChartData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">CAC by Channel</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={channelChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="cac" fill="#3b82f6" name="CAC ($)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  {channelPieData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Spend by Channel</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={channelPieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {channelPieData.map((entry, index) => {
                              const channel = Object.keys(channelLabels).find(k => channelLabels[k as MarketingChannel] === entry.name) as MarketingChannel
                              return <Cell key={`cell-${index}`} fill={channelColors[channel]} />
                            })}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {channels.map((channel) => (
                      <Card key={channel.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{channelLabels[channel.channel]}</h4>
                              <Badge variant="outline" className="text-xs">
                                {new Date(channel.date).toLocaleDateString()}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">CAC:</span> ${channel.cac.toFixed(2)}
                              </div>
                              <div>
                                <span className="font-medium">Spend:</span> ${(channel.spend / 1000).toFixed(0)}K
                              </div>
                              <div>
                                <span className="font-medium">Customers:</span> {channel.customers.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingChannel(channel)}
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
                </>
              )}
            </Card>
          </div>
        )}

        {/* Periods Tab */}
        {activeTab === 'periods' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">CAC Periods</h2>
                </div>
                <Button onClick={addPeriod} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Period
                </Button>
              </div>

              {periods.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="h-16 w-16 mx-auto mb-4" />
                  <p>No periods yet. Create periods to track CAC over time.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {periods.map((period) => (
                    <Card key={period.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{period.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                            </Badge>
                            {period.ltvCacRatio && (
                              <Badge 
                                variant={period.ltvCacRatio >= 5 ? 'beginner' : 'outline'}
                                className={`text-xs ${
                                  period.ltvCacRatio >= 5 ? '' : 
                                  period.ltvCacRatio >= 3 ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                LTV:CAC {period.ltvCacRatio.toFixed(1)}:1
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">CAC:</span> ${period.cac.toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">Spend:</span> ${(period.totalSpend / 1000).toFixed(0)}K
                            </div>
                            <div>
                              <span className="font-medium">Customers:</span> {period.totalCustomers.toLocaleString()}
                            </div>
                            {period.ltv && (
                              <div>
                                <span className="font-medium">LTV:</span> ${period.ltv.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPeriod(period)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePeriod(period.id)}
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
          </div>
        )}

        {/* Cohorts Tab */}
        {activeTab === 'cohorts' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Cohort Analysis</h2>
                </div>
                <Button onClick={addCohort} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Cohort
                </Button>
              </div>

              {cohorts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p>No cohorts yet. Create cohorts to analyze customer acquisition by cohort.</p>
                </div>
              ) : (
                <>
                  {cohorts.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Cohort Comparison</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={cohorts.map(c => ({
                          name: c.name,
                          cac: c.cac,
                          ltv: c.ltv,
                          ratio: c.ltv / c.cac
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="cac" fill="#ef4444" name="CAC" />
                          <Bar dataKey="ltv" fill="#10b981" name="LTV" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {cohorts.map((cohort) => {
                      const ratio = cohort.ltv / cohort.cac
                      return (
                        <Card key={cohort.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{cohort.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {new Date(cohort.startDate).toLocaleDateString()}
                                </Badge>
                                <Badge 
                                  variant={ratio >= 5 ? 'beginner' : 'outline'}
                                  className={`text-xs ${
                                    ratio >= 5 ? '' : 
                                    ratio >= 3 ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'
                                  }`}
                                >
                                  LTV:CAC {ratio.toFixed(1)}:1
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">CAC:</span> ${cohort.cac.toFixed(2)}
                                </div>
                                <div>
                                  <span className="font-medium">LTV:</span> ${cohort.ltv.toFixed(2)}
                                </div>
                                <div>
                                  <span className="font-medium">Customers:</span> {cohort.customers.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Revenue:</span> ${(cohort.revenue / 1000).toFixed(0)}K
                                </div>
                                <div>
                                  <span className="font-medium">Spend:</span> ${(cohort.totalSpend / 1000).toFixed(0)}K
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingCohort(cohort)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteCohort(cohort.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </>
              )}
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Average CAC</div>
                <div className="text-2xl font-bold">
                  {periods.length > 0 
                    ? `$${(periods.reduce((sum, p) => sum + p.cac, 0) / periods.length).toFixed(2)}`
                    : channels.length > 0
                    ? `$${(channels.reduce((sum, c) => sum + c.cac, 0) / channels.length).toFixed(2)}`
                    : '$0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Channels</div>
                <div className="text-2xl font-bold">{channels.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Cohorts</div>
                <div className="text-2xl font-bold">{cohorts.length}</div>
              </Card>
            </div>

            {cacHistory.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">CAC Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cacHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cac" stroke="#3b82f6" name="CAC ($)" />
                  </LineChart>
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
                <History className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Calculation History</h2>
              </div>
              {periods.length === 0 && channels.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No history yet. Create periods and channels to build history.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {periods.map((period) => (
                    <Card key={period.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{period.name}</h4>
                          <p className="text-sm text-gray-600">
                            CAC: ${period.cac.toFixed(2)} • {period.totalCustomers.toLocaleString()} customers
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(period.totalSpend / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-gray-600">Total Spend</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Edit Channel Modal */}
        {editingChannel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Marketing Channel</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingChannel(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Channel *</label>
                  <Select
                    value={editingChannel.channel}
                    onChange={(e) => setEditingChannel({ ...editingChannel, channel: e.target.value as MarketingChannel })}
                    options={[
                      { value: 'paid-ads', label: 'Paid Ads' },
                      { value: 'organic', label: 'Organic' },
                      { value: 'social', label: 'Social Media' },
                      { value: 'email', label: 'Email Marketing' },
                      { value: 'content', label: 'Content Marketing' },
                      { value: 'referral', label: 'Referral' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spend ($) *</label>
                    <Input
                      type="number"
                      value={editingChannel.spend}
                      onChange={(e) => setEditingChannel({ ...editingChannel, spend: parseFloat(e.target.value) || 0 })}
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customers *</label>
                    <Input
                      type="number"
                      value={editingChannel.customers}
                      onChange={(e) => setEditingChannel({ ...editingChannel, customers: parseInt(e.target.value) || 0 })}
                      placeholder="10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <Input
                    type="date"
                    value={editingChannel.date}
                    onChange={(e) => setEditingChannel({ ...editingChannel, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingChannel.notes || ''}
                    onChange={(e) => setEditingChannel({ ...editingChannel, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                {editingChannel.spend > 0 && editingChannel.customers > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Calculated CAC:</div>
                    <div className="text-lg font-bold text-primary-600">
                      ${(editingChannel.spend / editingChannel.customers).toFixed(2)}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={saveChannel} className="flex-1">
                    Save Channel
                  </Button>
                  <Button variant="outline" onClick={() => setEditingChannel(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Period Modal */}
        {editingPeriod && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Period</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingPeriod(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period Name *</label>
                  <Input
                    value={editingPeriod.name}
                    onChange={(e) => setEditingPeriod({ ...editingPeriod, name: e.target.value })}
                    placeholder="e.g., Q1 2024"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <Input
                      type="date"
                      value={editingPeriod.startDate}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                    <Input
                      type="date"
                      value={editingPeriod.endDate}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Spend ($) *</label>
                    <Input
                      type="number"
                      value={editingPeriod.totalSpend}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, totalSpend: parseFloat(e.target.value) || 0 })}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Customers *</label>
                    <Input
                      type="number"
                      value={editingPeriod.totalCustomers}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, totalCustomers: parseInt(e.target.value) || 0 })}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LTV ($)</label>
                    <Input
                      type="number"
                      value={editingPeriod.ltv || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || undefined
                        const ltvCacRatio = val && editingPeriod.cac > 0 ? calculateLTVCACRatio(val, editingPeriod.cac) : undefined
                        setEditingPeriod({ ...editingPeriod, ltv: val, ltvCacRatio })
                      }}
                      placeholder="300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingPeriod.notes || ''}
                    onChange={(e) => setEditingPeriod({ ...editingPeriod, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                {editingPeriod.totalSpend > 0 && editingPeriod.totalCustomers > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Calculated CAC:</div>
                    <div className="text-lg font-bold text-primary-600">
                      ${(editingPeriod.totalSpend / editingPeriod.totalCustomers).toFixed(2)}
                    </div>
                    {editingPeriod.ltvCacRatio && (
                      <div className="text-sm text-gray-600 mt-2">
                        LTV:CAC Ratio: {editingPeriod.ltvCacRatio.toFixed(2)}:1
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={savePeriod} className="flex-1">
                    Save Period
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPeriod(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Cohort Modal */}
        {editingCohort && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Cohort</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingCohort(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cohort Name *</label>
                  <Input
                    value={editingCohort.name}
                    onChange={(e) => setEditingCohort({ ...editingCohort, name: e.target.value })}
                    placeholder="e.g., Q1 2024 Cohort"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <Input
                    type="date"
                    value={editingCohort.startDate}
                    onChange={(e) => setEditingCohort({ ...editingCohort, startDate: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Spend ($) *</label>
                    <Input
                      type="number"
                      value={editingCohort.totalSpend}
                      onChange={(e) => setEditingCohort({ ...editingCohort, totalSpend: parseFloat(e.target.value) || 0 })}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customers *</label>
                    <Input
                      type="number"
                      value={editingCohort.customers}
                      onChange={(e) => setEditingCohort({ ...editingCohort, customers: parseInt(e.target.value) || 0 })}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Revenue ($) *</label>
                    <Input
                      type="number"
                      value={editingCohort.revenue}
                      onChange={(e) => setEditingCohort({ ...editingCohort, revenue: parseFloat(e.target.value) || 0 })}
                      placeholder="30000"
                    />
                  </div>
                </div>
                {editingCohort.totalSpend > 0 && editingCohort.customers > 0 && editingCohort.revenue > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">CAC:</div>
                        <div className="font-bold text-primary-600">
                          ${(editingCohort.totalSpend / editingCohort.customers).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">LTV:</div>
                        <div className="font-bold text-green-600">
                          ${(editingCohort.revenue / editingCohort.customers).toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-gray-600 mb-1">LTV:CAC Ratio:</div>
                        <div className="font-bold">
                          {((editingCohort.revenue / editingCohort.customers) / (editingCohort.totalSpend / editingCohort.customers)).toFixed(2)}:1
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={saveCohort} className="flex-1">
                    Save Cohort
                  </Button>
                  <Button variant="outline" onClick={() => setEditingCohort(null)}>
                    Cancel
                  </Button>
                </div>
          </div>
        </Card>
          </div>
        )}
      </div>
    </main>
  )
}
