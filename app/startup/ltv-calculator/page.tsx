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
  DollarSign,
  Sparkles,
  Users,
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
  TrendingUp,
  TrendingDown,
  Percent,
  Calendar,
  PieChart
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts'

type CustomerSegment = 'enterprise' | 'mid-market' | 'smb' | 'consumer' | 'other'

interface CustomerSegmentData {
  id: string
  segment: CustomerSegment
  avgOrderValue: number
  purchaseFrequency: number
  customerLifespan: number
  retentionRate: number
  ltv: number
  date: string
  notes?: string
}

interface LTVPeriod {
  id: string
  name: string
  startDate: string
  endDate: string
  avgOrderValue: number
  purchaseFrequency: number
  customerLifespan: number
  retentionRate: number
  ltv: number
  cac?: number
  ltvCacRatio?: number
  notes?: string
}

interface Cohort {
  id: string
  name: string
  startDate: string
  customers: number
  totalRevenue: number
  avgOrderValue: number
  purchaseFrequency: number
  customerLifespan: number
  retentionRate: number
  ltv: number
  churnRate: number
}

export default function LTVCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [avgOrderValue, setAvgOrderValue] = useState('')
  const [purchaseFrequency, setPurchaseFrequency] = useState('')
  const [customerLifespan, setCustomerLifespan] = useState('')
  const [retentionRate, setRetentionRate] = useState('100')
  const [ltv, setLtv] = useState<number | null>(null)
  const [cac, setCac] = useState('')
  const [segments, setSegments] = useState<CustomerSegmentData[]>([])
  const [editingSegment, setEditingSegment] = useState<CustomerSegmentData | null>(null)
  const [periods, setPeriods] = useState<LTVPeriod[]>([])
  const [editingPeriod, setEditingPeriod] = useState<LTVPeriod | null>(null)
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null)

  const tabs = [
    { id: 'calculator', label: 'LTV Calculator', icon: Calculator },
    { id: 'segments', label: 'Segments', icon: Users },
    { id: 'periods', label: 'Periods', icon: Calendar },
    { id: 'cohorts', label: 'Cohorts', icon: PieChart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ltvCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.segments) setSegments(data.segments)
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
        segments,
        periods,
        cohorts,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('ltvCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const calculateLTV = (aov: number, frequency: number, lifespan: number, retention: number = 100) => {
    // LTV = AOV × Purchase Frequency × Customer Lifespan × Retention Rate
    return aov * frequency * lifespan * (retention / 100)
  }

  const calculateLTVWithRetention = () => {
    const aov = parseFloat(avgOrderValue)
    const frequency = parseFloat(purchaseFrequency)
    const lifespan = parseFloat(customerLifespan)
    const retention = parseFloat(retentionRate) || 100
    
    if (!aov || !frequency || !lifespan) {
      showToast('Please enter all required values', 'error')
      return
    }

    const calculatedLTV = calculateLTV(aov, frequency, lifespan, retention)
    setLtv(calculatedLTV)
    showToast('LTV calculated!', 'success')
  }

  const calculateChurnRate = (retentionRate: number) => {
    return 100 - retentionRate
  }

  const calculateLTVCACRatio = (ltvValue: number, cacValue: number) => {
    if (cacValue === 0) return 0
    return ltvValue / cacValue
  }

  const addSegment = () => {
    const newSegment: CustomerSegmentData = {
      id: Date.now().toString(),
      segment: 'consumer',
      avgOrderValue: 0,
      purchaseFrequency: 0,
      customerLifespan: 0,
      retentionRate: 100,
      ltv: 0,
      date: new Date().toISOString().split('T')[0]
    }
    setEditingSegment(newSegment)
  }

  const saveSegment = () => {
    if (!editingSegment) return
    if (editingSegment.avgOrderValue <= 0 || editingSegment.purchaseFrequency <= 0 || editingSegment.customerLifespan <= 0) {
      showToast('Please enter valid values', 'error')
      return
    }

    const calculatedLTV = calculateLTV(
      editingSegment.avgOrderValue,
      editingSegment.purchaseFrequency,
      editingSegment.customerLifespan,
      editingSegment.retentionRate
    )
    const updatedSegment = { ...editingSegment, ltv: calculatedLTV }

    const updated = segments.find(s => s.id === updatedSegment.id)
      ? segments.map(s => s.id === updatedSegment.id ? updatedSegment : s)
      : [...segments, updatedSegment]

    setSegments(updated)
    setEditingSegment(null)
    saveToLocalStorage()
    showToast('Segment saved!', 'success')
  }

  const deleteSegment = (id: string) => {
    if (confirm('Are you sure you want to delete this segment?')) {
      const updated = segments.filter(s => s.id !== id)
      setSegments(updated)
      saveToLocalStorage()
      showToast('Segment deleted', 'info')
    }
  }

  const addPeriod = () => {
    const newPeriod: LTVPeriod = {
      id: Date.now().toString(),
      name: 'New Period',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      avgOrderValue: 0,
      purchaseFrequency: 0,
      customerLifespan: 0,
      retentionRate: 100,
      ltv: 0
    }
    setEditingPeriod(newPeriod)
  }

  const savePeriod = () => {
    if (!editingPeriod) return
    if (!editingPeriod.name || editingPeriod.avgOrderValue <= 0 || editingPeriod.purchaseFrequency <= 0 || editingPeriod.customerLifespan <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const calculatedLTV = calculateLTV(
      editingPeriod.avgOrderValue,
      editingPeriod.purchaseFrequency,
      editingPeriod.customerLifespan,
      editingPeriod.retentionRate
    )
    const cacValue = editingPeriod.cac || 0
    const ltvCacRatio = cacValue > 0 ? calculateLTVCACRatio(calculatedLTV, cacValue) : undefined

    const updatedPeriod = {
      ...editingPeriod,
      ltv: calculatedLTV,
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
      totalRevenue: 0,
      avgOrderValue: 0,
      purchaseFrequency: 0,
      customerLifespan: 0,
      retentionRate: 100,
      ltv: 0,
      churnRate: 0
    }
    setEditingCohort(newCohort)
  }

  const saveCohort = () => {
    if (!editingCohort) return
    if (!editingCohort.name || editingCohort.customers <= 0 || editingCohort.totalRevenue <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const calculatedLTV = editingCohort.totalRevenue / editingCohort.customers
    const calculatedChurn = calculateChurnRate(editingCohort.retentionRate)

    const updatedCohort = {
      ...editingCohort,
      ltv: calculatedLTV,
      churnRate: calculatedChurn
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
        avgOrderValue: parseFloat(avgOrderValue) || 0,
        purchaseFrequency: parseFloat(purchaseFrequency) || 0,
        customerLifespan: parseFloat(customerLifespan) || 0,
        retentionRate: parseFloat(retentionRate) || 100,
        ltv,
        cac: parseFloat(cac) || 0,
        ltvCacRatio: ltv && cac ? calculateLTVCACRatio(ltv, parseFloat(cac)) : null
      },
      segments,
      periods,
      cohorts,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ltv-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported!', 'success')
  }

  const segmentLabels: Record<CustomerSegment, string> = {
    'enterprise': 'Enterprise',
    'mid-market': 'Mid-Market',
    'smb': 'SMB',
    'consumer': 'Consumer',
    'other': 'Other'
  }

  const segmentColors: Record<CustomerSegment, string> = {
    'enterprise': '#3b82f6',
    'mid-market': '#10b981',
    'smb': '#f59e0b',
    'consumer': '#8b5cf6',
    'other': '#6b7280'
  }

  const segmentChartData = segments.map(s => ({
    name: segmentLabels[s.segment],
    ltv: s.ltv,
    retention: s.retentionRate
  }))

  const ltvHistory = periods.map(p => ({
    name: p.name,
    ltv: p.ltv,
    month: new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }))

  const ltvCacRatio = ltv && cac ? calculateLTVCACRatio(ltv, parseFloat(cac)) : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            LTV Calculator
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate Customer Lifetime Value, track by segment, and analyze retention
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
                <div className="text-sm text-gray-600 mb-1">LTV</div>
                <div className="text-2xl font-bold text-primary-600">
                  {ltv !== null ? `$${ltv.toLocaleString()}` : '$0'}
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
                <div className="text-sm text-gray-600 mb-1">Retention Rate</div>
                <div className="text-2xl font-bold">
                  {retentionRate ? `${retentionRate}%` : '100%'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Churn Rate</div>
                <div className="text-2xl font-bold text-red-600">
                  {retentionRate ? `${(100 - parseFloat(retentionRate)).toFixed(1)}%` : '0%'}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary-500" />
                  LTV Calculator
                </h3>
                <div className="space-y-4">
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Order Value ($) *</label>
                    <Input
                type="number"
                value={avgOrderValue}
                onChange={(e) => setAvgOrderValue(e.target.value)}
                      placeholder="50"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Frequency (per year) *</label>
                    <Input
                type="number"
                      step="0.1"
                value={purchaseFrequency}
                onChange={(e) => setPurchaseFrequency(e.target.value)}
                      placeholder="12"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Lifespan (years) *</label>
                    <Input
                type="number"
                      step="0.1"
                value={customerLifespan}
                onChange={(e) => setCustomerLifespan(e.target.value)}
                      placeholder="3"
              />
            </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retention Rate (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={retentionRate}
                      onChange={(e) => setRetentionRate(e.target.value)}
                      placeholder="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Percentage of customers retained</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CAC ($)</label>
                    <Input
                      type="number"
                      value={cac}
                      onChange={(e) => setCac(e.target.value)}
                      placeholder="30"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional - for LTV:CAC ratio</p>
                  </div>
                  <Button onClick={calculateLTVWithRetention} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate LTV
            </Button>
            {ltv !== null && (
              <div className="bg-primary-500/10 border-2 border-primary-500/20 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Customer Lifetime Value</p>
                <p className="text-3xl font-bold text-primary-500">${ltv.toLocaleString()}</p>
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
                  About LTV
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Customer Lifetime Value (LTV)</strong> is the total revenue a customer generates over their entire relationship with your business.
                  </p>
                  <p>
                    <strong>Formula:</strong> LTV = AOV × Purchase Frequency × Customer Lifespan × Retention Rate
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
                          <li>• Track LTV by customer segment</li>
                          <li>• Monitor retention rate trends</li>
                          <li>• Focus on increasing customer lifespan</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Segments Tab */}
        {activeTab === 'segments' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Customer Segments</h2>
                </div>
                <Button onClick={addSegment} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Segment
                </Button>
              </div>

              {segments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p>No segments yet. Add customer segments to track LTV by segment.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Average LTV</div>
                      <div className="text-2xl font-bold">
                        ${(segments.reduce((sum, s) => sum + s.ltv, 0) / segments.length).toLocaleString()}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Average Retention</div>
                      <div className="text-2xl font-bold">
                        {(segments.reduce((sum, s) => sum + s.retentionRate, 0) / segments.length).toFixed(1)}%
                      </div>
                    </Card>
                  </div>

                  {segmentChartData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">LTV by Segment</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={segmentChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="ltv" fill="#3b82f6" name="LTV ($)" />
                          <Bar dataKey="retention" fill="#10b981" name="Retention (%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {segments.map((segment) => (
                      <Card key={segment.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{segmentLabels[segment.segment]}</h4>
                              <Badge variant="outline" className="text-xs">
                                {new Date(segment.date).toLocaleDateString()}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">LTV:</span> ${segment.ltv.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">AOV:</span> ${segment.avgOrderValue.toFixed(2)}
                              </div>
                              <div>
                                <span className="font-medium">Frequency:</span> {segment.purchaseFrequency}/yr
                              </div>
                              <div>
                                <span className="font-medium">Retention:</span> {segment.retentionRate}%
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingSegment(segment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSegment(segment.id)}
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
                  <h2 className="text-2xl font-bold">LTV Periods</h2>
                </div>
                <Button onClick={addPeriod} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Period
                </Button>
              </div>

              {periods.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="h-16 w-16 mx-auto mb-4" />
                  <p>No periods yet. Create periods to track LTV over time.</p>
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
                                variant={period.ltvCacRatio >= 5 ? 'beginner' : period.ltvCacRatio >= 3 ? 'outline' : 'outline'}
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
                              <span className="font-medium">LTV:</span> ${period.ltv.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">AOV:</span> ${period.avgOrderValue.toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">Retention:</span> {period.retentionRate}%
                            </div>
                            {period.cac && (
                              <div>
                                <span className="font-medium">CAC:</span> ${period.cac.toFixed(2)}
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
                  <PieChart className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Cohort Analysis</h2>
                </div>
                <Button onClick={addCohort} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Cohort
                </Button>
              </div>

              {cohorts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <PieChart className="h-16 w-16 mx-auto mb-4" />
                  <p>No cohorts yet. Create cohorts to analyze LTV by customer cohort.</p>
                </div>
              ) : (
                <>
                  {cohorts.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Cohort Comparison</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={cohorts.map(c => ({
                          name: c.name,
                          ltv: c.ltv,
                          retention: c.retentionRate,
                          churn: c.churnRate
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="ltv" fill="#3b82f6" name="LTV ($)" />
                          <Bar dataKey="retention" fill="#10b981" name="Retention (%)" />
                          <Bar dataKey="churn" fill="#ef4444" name="Churn (%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {cohorts.map((cohort) => (
                      <Card key={cohort.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{cohort.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {new Date(cohort.startDate).toLocaleDateString()}
                              </Badge>
                              <Badge 
                                variant={cohort.retentionRate >= 80 ? 'beginner' : cohort.retentionRate >= 60 ? 'outline' : 'outline'}
                                className={`text-xs ${
                                  cohort.retentionRate >= 80 ? '' : 
                                  cohort.retentionRate >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                {cohort.retentionRate}% Retention
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">LTV:</span> ${cohort.ltv.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Customers:</span> {cohort.customers.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Revenue:</span> ${(cohort.totalRevenue / 1000).toFixed(0)}K
                              </div>
                              <div>
                                <span className="font-medium">Retention:</span> {cohort.retentionRate}%
                              </div>
                              <div>
                                <span className="font-medium">Churn:</span> {cohort.churnRate.toFixed(1)}%
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
                    ))}
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
                <div className="text-sm text-gray-600 mb-1">Average LTV</div>
                <div className="text-2xl font-bold">
                  {periods.length > 0 
                    ? `$${(periods.reduce((sum, p) => sum + p.ltv, 0) / periods.length).toLocaleString()}`
                    : segments.length > 0
                    ? `$${(segments.reduce((sum, s) => sum + s.ltv, 0) / segments.length).toLocaleString()}`
                    : '$0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Segments</div>
                <div className="text-2xl font-bold">{segments.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Cohorts</div>
                <div className="text-2xl font-bold">{cohorts.length}</div>
              </Card>
            </div>

            {ltvHistory.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">LTV Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ltvHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ltv" stroke="#3b82f6" name="LTV ($)" />
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
              {periods.length === 0 && segments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No history yet. Create periods and segments to build history.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {periods.map((period) => (
                    <Card key={period.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{period.name}</h4>
                          <p className="text-sm text-gray-600">
                            LTV: ${period.ltv.toLocaleString()} • Retention: {period.retentionRate}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${period.avgOrderValue.toFixed(2)}</p>
                          <p className="text-xs text-gray-600">AOV</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Edit Segment Modal */}
        {editingSegment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Customer Segment</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingSegment(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Segment *</label>
                  <Select
                    value={editingSegment.segment}
                    onChange={(e) => setEditingSegment({ ...editingSegment, segment: e.target.value as CustomerSegment })}
                    options={[
                      { value: 'enterprise', label: 'Enterprise' },
                      { value: 'mid-market', label: 'Mid-Market' },
                      { value: 'smb', label: 'SMB' },
                      { value: 'consumer', label: 'Consumer' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avg Order Value ($) *</label>
                    <Input
                      type="number"
                      value={editingSegment.avgOrderValue}
                      onChange={(e) => setEditingSegment({ ...editingSegment, avgOrderValue: parseFloat(e.target.value) || 0 })}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Frequency (per year) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingSegment.purchaseFrequency}
                      onChange={(e) => setEditingSegment({ ...editingSegment, purchaseFrequency: parseFloat(e.target.value) || 0 })}
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Lifespan (years) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingSegment.customerLifespan}
                      onChange={(e) => setEditingSegment({ ...editingSegment, customerLifespan: parseFloat(e.target.value) || 0 })}
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retention Rate (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingSegment.retentionRate}
                      onChange={(e) => setEditingSegment({ ...editingSegment, retentionRate: parseFloat(e.target.value) || 100 })}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <Input
                    type="date"
                    value={editingSegment.date}
                    onChange={(e) => setEditingSegment({ ...editingSegment, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingSegment.notes || ''}
                    onChange={(e) => setEditingSegment({ ...editingSegment, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                {editingSegment.avgOrderValue > 0 && editingSegment.purchaseFrequency > 0 && editingSegment.customerLifespan > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Calculated LTV:</div>
                    <div className="text-lg font-bold text-primary-600">
                      ${calculateLTV(editingSegment.avgOrderValue, editingSegment.purchaseFrequency, editingSegment.customerLifespan, editingSegment.retentionRate).toLocaleString()}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={saveSegment} className="flex-1">
                    Save Segment
                  </Button>
                  <Button variant="outline" onClick={() => setEditingSegment(null)}>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avg Order Value ($) *</label>
                    <Input
                      type="number"
                      value={editingPeriod.avgOrderValue}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, avgOrderValue: parseFloat(e.target.value) || 0 })}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Frequency (per year) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingPeriod.purchaseFrequency}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, purchaseFrequency: parseFloat(e.target.value) || 0 })}
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Lifespan (years) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingPeriod.customerLifespan}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, customerLifespan: parseFloat(e.target.value) || 0 })}
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retention Rate (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingPeriod.retentionRate}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, retentionRate: parseFloat(e.target.value) || 100 })}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CAC ($)</label>
                    <Input
                      type="number"
                      value={editingPeriod.cac || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || undefined
                        const ltvValue = calculateLTV(editingPeriod.avgOrderValue, editingPeriod.purchaseFrequency, editingPeriod.customerLifespan, editingPeriod.retentionRate)
                        const ltvCacRatio = val && val > 0 ? calculateLTVCACRatio(ltvValue, val) : undefined
                        setEditingPeriod({ ...editingPeriod, cac: val, ltvCacRatio })
                      }}
                      placeholder="30"
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
                {editingPeriod.avgOrderValue > 0 && editingPeriod.purchaseFrequency > 0 && editingPeriod.customerLifespan > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Calculated LTV:</div>
                    <div className="text-lg font-bold text-primary-600">
                      ${calculateLTV(editingPeriod.avgOrderValue, editingPeriod.purchaseFrequency, editingPeriod.customerLifespan, editingPeriod.retentionRate).toLocaleString()}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Customers *</label>
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
                      value={editingCohort.totalRevenue}
                      onChange={(e) => setEditingCohort({ ...editingCohort, totalRevenue: parseFloat(e.target.value) || 0 })}
                      placeholder="30000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retention Rate (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingCohort.retentionRate}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 100
                        setEditingCohort({ ...editingCohort, retentionRate: val, churnRate: calculateChurnRate(val) })
                      }}
                      placeholder="100"
                    />
                  </div>
                </div>
                {editingCohort.customers > 0 && editingCohort.totalRevenue > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">LTV:</div>
                        <div className="font-bold text-primary-600">
                          ${(editingCohort.totalRevenue / editingCohort.customers).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Churn Rate:</div>
                        <div className="font-bold text-red-600">
                          {calculateChurnRate(editingCohort.retentionRate).toFixed(1)}%
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
