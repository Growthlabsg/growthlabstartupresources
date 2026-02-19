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
  BarChart3,
  Target,
  History,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Download,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Info,
  Calendar,
  Percent,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

type MetricType = 'revenue' | 'users' | 'customers' | 'mrr' | 'arr' | 'custom'
type PeriodType = 'monthly' | 'quarterly' | 'yearly'

interface GrowthPeriod {
  id: string
  date: string
  value: number
  metric: MetricType
  notes?: string
}

interface GrowthScenario {
  id: string
  name: string
  startValue: number
  growthRate: number
  period: number
  projectedValue: number
  type: 'best' | 'base' | 'worst'
  notes?: string
}

interface GrowthMilestone {
  id: string
  name: string
  targetValue: number
  targetDate: string
  currentValue: number
  progress: number
  status: 'on-track' | 'at-risk' | 'achieved' | 'missed'
  notes?: string
}

export default function GrowthRateCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [startValue, setStartValue] = useState('')
  const [endValue, setEndValue] = useState('')
  const [timePeriod, setTimePeriod] = useState('12')
  const [periodType, setPeriodType] = useState<PeriodType>('monthly')
  const [metricType, setMetricType] = useState<MetricType>('revenue')
  const [growthRate, setGrowthRate] = useState<number | null>(null)
  const [cagr, setCagr] = useState<number | null>(null)
  const [momGrowth, setMomGrowth] = useState<number | null>(null)
  const [yoyGrowth, setYoyGrowth] = useState<number | null>(null)
  const [projections, setProjections] = useState<any[]>([])
  const [projectionPeriods, setProjectionPeriods] = useState('12')
  const [growthPeriods, setGrowthPeriods] = useState<GrowthPeriod[]>([])
  const [editingPeriod, setEditingPeriod] = useState<GrowthPeriod | null>(null)
  const [scenarios, setScenarios] = useState<GrowthScenario[]>([])
  const [editingScenario, setEditingScenario] = useState<GrowthScenario | null>(null)
  const [milestones, setMilestones] = useState<GrowthMilestone[]>([])
  const [editingMilestone, setEditingMilestone] = useState<GrowthMilestone | null>(null)

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'periods', label: 'Historical Data', icon: Calendar },
    { id: 'scenarios', label: 'Scenarios', icon: Target },
    { id: 'milestones', label: 'Milestones', icon: CheckCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('growthRateCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.growthPeriods) setGrowthPeriods(data.growthPeriods)
          if (data.scenarios) setScenarios(data.scenarios)
          if (data.milestones) setMilestones(data.milestones)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        growthPeriods,
        scenarios,
        milestones,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('growthRateCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const calculate = () => {
    const start = parseFloat(startValue)
    const end = parseFloat(endValue)
    const period = parseFloat(timePeriod)
    
    if (!start || !end || !period || start === 0 || period === 0) {
      showToast('Please enter valid values', 'error')
      return
    }

    // Simple growth rate
    const simpleGrowth = ((end - start) / start) * 100
    setGrowthRate(simpleGrowth)

    // CAGR (Compound Annual Growth Rate)
    const years = periodType === 'monthly' ? period / 12 : periodType === 'quarterly' ? period / 4 : period
    const cagrValue = years > 0 ? (Math.pow(end / start, 1 / years) - 1) * 100 : 0
    setCagr(cagrValue)

    // Month-over-Month growth (if monthly)
    if (periodType === 'monthly' && period >= 1) {
      const mom = ((end / start) ** (1 / period) - 1) * 100
      setMomGrowth(mom)
    } else {
      setMomGrowth(null)
    }

    // Year-over-Year growth
    if (period >= 12 || (periodType === 'yearly' && period >= 1)) {
      const yoy = ((end / start) ** (12 / period) - 1) * 100
      setYoyGrowth(yoy)
    } else {
      setYoyGrowth(null)
    }

    // Generate projections
    const projPeriods = parseInt(projectionPeriods) || 12
    const proj = []
    const periodRate = Math.pow(end / start, 1 / period)
    const periodLabel = periodType === 'monthly' ? 'Month' : periodType === 'quarterly' ? 'Quarter' : 'Year'
    
    for (let i = 1; i <= projPeriods; i++) {
      const projectedValue = end * Math.pow(periodRate, i)
      proj.push({
        period: `${periodLabel} ${i}`,
        value: projectedValue,
        growth: ((projectedValue - end) / end) * 100
      })
    }
    setProjections(proj)

    showToast('Growth rate calculated!', 'success')
  }

  const addGrowthPeriod = () => {
    const newPeriod: GrowthPeriod = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      value: 0,
      metric: metricType
    }
    setEditingPeriod(newPeriod)
  }

  const saveGrowthPeriod = () => {
    if (!editingPeriod) return
    if (!editingPeriod.date || editingPeriod.value <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const updated = growthPeriods.find(p => p.id === editingPeriod.id)
      ? growthPeriods.map(p => p.id === editingPeriod.id ? editingPeriod : p)
      : [...growthPeriods, editingPeriod].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setGrowthPeriods(updated)
    setEditingPeriod(null)
    saveToLocalStorage()
    showToast('Period saved!', 'success')
  }

  const deleteGrowthPeriod = (id: string) => {
    if (confirm('Are you sure you want to delete this period?')) {
      const updated = growthPeriods.filter(p => p.id !== id)
      setGrowthPeriods(updated)
      saveToLocalStorage()
      showToast('Period deleted', 'info')
    }
  }

  const createScenario = () => {
    const start = parseFloat(startValue) || 0
    const rate = growthRate || 0
    const period = parseInt(projectionPeriods) || 12

    if (start <= 0) {
      showToast('Please calculate growth rate first', 'error')
      return
    }

    const monthlyRate = rate / 100 / 12
    const projectedValue = start * Math.pow(1 + monthlyRate, period)

    const newScenario: GrowthScenario = {
      id: Date.now().toString(),
      name: 'New Scenario',
      startValue: start,
      growthRate: rate,
      period,
      projectedValue,
      type: 'base'
    }
    setEditingScenario(newScenario)
  }

  const saveScenario = () => {
    if (!editingScenario) return
    if (!editingScenario.name) {
      showToast('Please enter scenario name', 'error')
      return
    }

    const updated = scenarios.find(s => s.id === editingScenario.id)
      ? scenarios.map(s => s.id === editingScenario.id ? editingScenario : s)
      : [...scenarios, editingScenario]

    setScenarios(updated)
    setEditingScenario(null)
    saveToLocalStorage()
    showToast('Scenario saved!', 'success')
  }

  const deleteScenario = (id: string) => {
    if (confirm('Are you sure you want to delete this scenario?')) {
      const updated = scenarios.filter(s => s.id !== id)
      setScenarios(updated)
      saveToLocalStorage()
      showToast('Scenario deleted', 'info')
    }
  }

  const addMilestone = () => {
    const currentValue = parseFloat(endValue) || 0
    const newMilestone: GrowthMilestone = {
      id: Date.now().toString(),
      name: '',
      targetValue: 0,
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currentValue,
      progress: 0,
      status: 'on-track'
    }
    setEditingMilestone(newMilestone)
  }

  const saveMilestone = () => {
    if (!editingMilestone) return
    if (!editingMilestone.name || editingMilestone.targetValue <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const progress = editingMilestone.currentValue > 0 
      ? (editingMilestone.currentValue / editingMilestone.targetValue) * 100 
      : 0
    
    const daysUntil = Math.ceil((new Date(editingMilestone.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const dailyGrowthNeeded = editingMilestone.targetValue > editingMilestone.currentValue
      ? (editingMilestone.targetValue - editingMilestone.currentValue) / Math.max(daysUntil, 1)
      : 0

    let status: 'on-track' | 'at-risk' | 'achieved' | 'missed' = 'on-track'
    if (progress >= 100) {
      status = 'achieved'
    } else if (daysUntil < 0) {
      status = 'missed'
    } else if (dailyGrowthNeeded > editingMilestone.currentValue * 0.1) {
      status = 'at-risk'
    }

    const updated = { ...editingMilestone, progress, status }

    const updatedList = milestones.find(m => m.id === updated.id)
      ? milestones.map(m => m.id === updated.id ? updated : m)
      : [...milestones, updated]

    setMilestones(updatedList)
    setEditingMilestone(null)
    saveToLocalStorage()
    showToast('Milestone saved!', 'success')
  }

  const deleteMilestone = (id: string) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      const updated = milestones.filter(m => m.id !== id)
      setMilestones(updated)
      saveToLocalStorage()
      showToast('Milestone deleted', 'info')
    }
  }

  const exportData = () => {
    const data = {
      currentCalculation: {
        startValue: parseFloat(startValue) || 0,
        endValue: parseFloat(endValue) || 0,
        timePeriod: parseFloat(timePeriod) || 0,
        periodType,
        metricType,
        growthRate,
        cagr,
        momGrowth,
        yoyGrowth
      },
      projections,
      growthPeriods,
      scenarios,
      milestones,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `growth-rate-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported!', 'success')
  }

  const metricLabels: Record<MetricType, string> = {
    'revenue': 'Revenue',
    'users': 'Users',
    'customers': 'Customers',
    'mrr': 'MRR',
    'arr': 'ARR',
    'custom': 'Custom'
  }

  const getHistoricalChartData = () => {
    if (growthPeriods.length < 2) return []
    
    const sorted = [...growthPeriods].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return sorted.map((p, i) => {
      const prevValue = i > 0 ? sorted[i - 1].value : p.value
      const growth = prevValue > 0 ? ((p.value - prevValue) / prevValue) * 100 : 0
      return {
        date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: p.value,
        growth
      }
    })
  }

  const scenarioChartData = scenarios.map(s => ({
    name: s.name,
    projected: s.projectedValue,
    type: s.type
  }))

  const milestoneChartData = milestones.map(m => ({
    name: m.name,
    current: m.currentValue,
    target: m.targetValue,
    progress: m.progress
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Growth Rate Calculator
              </span>
            </h1>
            <TrendingUp className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate growth rates, project future growth, and track milestones for any metric
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
                <div className="text-sm text-gray-600 mb-1">Growth Rate</div>
                <div className={`text-2xl font-bold ${growthRate !== null && growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growthRate !== null ? `${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(2)}%` : '0%'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">CAGR</div>
                <div className={`text-2xl font-bold ${cagr !== null && cagr >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {cagr !== null ? `${cagr >= 0 ? '+' : ''}${cagr.toFixed(2)}%` : '0%'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">MoM Growth</div>
                <div className={`text-2xl font-bold ${momGrowth !== null && momGrowth >= 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {momGrowth !== null ? `${momGrowth >= 0 ? '+' : ''}${momGrowth.toFixed(2)}%` : 'N/A'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">YoY Growth</div>
                <div className={`text-2xl font-bold ${yoyGrowth !== null && yoyGrowth >= 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {yoyGrowth !== null ? `${yoyGrowth >= 0 ? '+' : ''}${yoyGrowth.toFixed(2)}%` : 'N/A'}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary-500" />
                  Growth Calculator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metric Type</label>
                    <Select
                      value={metricType}
                      onChange={(e) => setMetricType(e.target.value as MetricType)}
                      options={[
                        { value: 'revenue', label: 'Revenue' },
                        { value: 'users', label: 'Users' },
                        { value: 'customers', label: 'Customers' },
                        { value: 'mrr', label: 'MRR' },
                        { value: 'arr', label: 'ARR' },
                        { value: 'custom', label: 'Custom' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Starting Value ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={startValue}
                      onChange={(e) => setStartValue(e.target.value)}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ending Value ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={endValue}
                      onChange={(e) => setEndValue(e.target.value)}
                      placeholder="15000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Period *</label>
                      <Input
                        type="number"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
                      <Select
                        value={periodType}
                        onChange={(e) => setPeriodType(e.target.value as PeriodType)}
                        options={[
                          { value: 'monthly', label: 'Months' },
                          { value: 'quarterly', label: 'Quarters' },
                          { value: 'yearly', label: 'Years' }
                        ]}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Projection Periods</label>
                    <Input
                      type="number"
                      value={projectionPeriods}
                      onChange={(e) => setProjectionPeriods(e.target.value)}
                      placeholder="12"
                    />
                    <p className="text-xs text-gray-500 mt-1">Number of periods to project</p>
                  </div>
                  <Button onClick={calculate} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Growth Rate
                  </Button>
                  {growthRate !== null && (
                    <div className="bg-primary-500/10 border-2 border-primary-500/20 rounded-lg p-6 space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Overall Growth Rate</p>
                        <p className={`text-3xl font-bold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(2)}%
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded p-3">
                          <p className="text-xs text-gray-600 mb-1">CAGR</p>
                          <p className={`font-bold ${cagr !== null && cagr >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {cagr !== null ? `${cagr >= 0 ? '+' : ''}${cagr.toFixed(2)}%` : 'N/A'}
                          </p>
                        </div>
                        {momGrowth !== null && (
                          <div className="bg-purple-50 rounded p-3">
                            <p className="text-xs text-gray-600 mb-1">MoM</p>
                            <p className={`font-bold ${momGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {momGrowth >= 0 ? '+' : ''}{momGrowth.toFixed(2)}%
                            </p>
                          </div>
                        )}
                        {yoyGrowth !== null && (
                          <div className="bg-green-50 rounded p-3">
                            <p className="text-xs text-gray-600 mb-1">YoY</p>
                            <p className={`font-bold ${yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {yoyGrowth >= 0 ? '+' : ''}{yoyGrowth.toFixed(2)}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary-500" />
                  Growth Metrics
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700">Simple Growth Rate</p>
                    <p className="text-xs mt-1">((End - Start) / Start) × 100%</p>
                    <p className="text-xs text-gray-500">Total growth over the period</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">CAGR</p>
                    <p className="text-xs mt-1">Compound Annual Growth Rate</p>
                    <p className="text-xs text-gray-500">Accounts for compounding over time</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">MoM Growth</p>
                    <p className="text-xs mt-1">Month-over-Month growth rate</p>
                    <p className="text-xs text-gray-500">Average monthly growth</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">YoY Growth</p>
                    <p className="text-xs mt-1">Year-over-Year growth rate</p>
                    <p className="text-xs text-gray-500">Annualized growth projection</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-blue-900 mb-1">Best Practices</div>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• Track growth consistently</li>
                          <li>• Compare MoM and YoY trends</li>
                          <li>• Set realistic growth targets</li>
                          <li>• Monitor growth rate changes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {projections.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Growth Projections</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={[
                    { period: 'Current', value: parseFloat(endValue || '0'), growth: 0 },
                    ...projections
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Projected Value" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {projections.slice(0, 4).map((p, i) => (
                    <div key={i} className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600 mb-1">{p.period}</p>
                      <p className="font-semibold">${p.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <p className={`text-xs ${p.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {p.growth >= 0 ? '+' : ''}{p.growth.toFixed(1)}%
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Historical Data Tab */}
        {activeTab === 'periods' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Historical Growth Data</h2>
                </div>
                <Button onClick={addGrowthPeriod} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Period
                </Button>
              </div>

              {growthPeriods.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="h-16 w-16 mx-auto mb-4" />
                  <p>No historical data yet. Add periods to track growth over time.</p>
                </div>
              ) : (
                <>
                  {getHistoricalChartData().length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Growth Trend</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={getHistoricalChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Value" />
                          <Line type="monotone" dataKey="growth" stroke="#10b981" name="Growth %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {growthPeriods.map((period) => {
                      const prevPeriod = growthPeriods
                        .filter(p => new Date(p.date).getTime() < new Date(period.date).getTime())
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
                      const periodGrowth = prevPeriod && prevPeriod.value > 0
                        ? ((period.value - prevPeriod.value) / prevPeriod.value) * 100
                        : 0

                      return (
                        <Card key={period.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{new Date(period.date).toLocaleDateString()}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {metricLabels[period.metric]}
                                </Badge>
                                <Badge 
                                  variant={periodGrowth >= 0 ? 'beginner' : 'outline'} 
                                  className="text-xs"
                                >
                                  {periodGrowth >= 0 ? '+' : ''}{periodGrowth.toFixed(1)}%
                                </Badge>
                              </div>
                              <div className="text-lg font-bold text-primary-600">
                                ${period.value.toLocaleString()}
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
                                onClick={() => deleteGrowthPeriod(period.id)}
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

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Growth Scenarios</h2>
                </div>
                <Button onClick={createScenario} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Scenario
                </Button>
              </div>

              {scenarios.length === 0 && !editingScenario ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No scenarios yet. Create scenarios to model different growth paths.</p>
                </div>
              ) : (
                <>
                  {scenarioChartData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Scenario Comparison</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={scenarioChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="projected" fill="#3b82f6" name="Projected Value" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  {scenarios.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {scenarios.map((scenario) => (
                        <Card key={scenario.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{scenario.name}</h4>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    scenario.type === 'best' ? 'border-green-500' : 
                                    scenario.type === 'worst' ? 'border-red-500' : 
                                    'border-blue-500'
                                  }`}
                                >
                                  {scenario.type === 'best' ? 'Best Case' : scenario.type === 'worst' ? 'Worst Case' : 'Base Case'}
                                </Badge>
                                <Badge variant="beginner" className="text-xs">
                                  {scenario.growthRate >= 0 ? '+' : ''}{scenario.growthRate.toFixed(1)}% growth
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Start:</span> ${scenario.startValue.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Projected:</span> ${scenario.projectedValue.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Period:</span> {scenario.period} months
                                </div>
                                <div>
                                  <span className="font-medium">Growth:</span> {scenario.growthRate >= 0 ? '+' : ''}{scenario.growthRate.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingScenario(scenario)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteScenario(scenario.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {editingScenario && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Edit Scenario</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingScenario(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Name *</label>
                          <Input
                            value={editingScenario.name}
                            onChange={(e) => setEditingScenario({ ...editingScenario, name: e.target.value })}
                            placeholder="e.g., Optimistic Growth"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Type *</label>
                          <Select
                            value={editingScenario.type}
                            onChange={(e) => setEditingScenario({ ...editingScenario, type: e.target.value as 'best' | 'base' | 'worst' })}
                            options={[
                              { value: 'best', label: 'Best Case' },
                              { value: 'base', label: 'Base Case' },
                              { value: 'worst', label: 'Worst Case' }
                            ]}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Value ($)</label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editingScenario.startValue}
                              onChange={(e) => {
                                const start = parseFloat(e.target.value) || 0
                                const monthlyRate = editingScenario.growthRate / 100 / 12
                                const projected = start * Math.pow(1 + monthlyRate, editingScenario.period)
                                setEditingScenario({ ...editingScenario, startValue: start, projectedValue: projected })
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Growth Rate (%)</label>
                            <Input
                              type="number"
                              step="0.1"
                              value={editingScenario.growthRate}
                              onChange={(e) => {
                                const rate = parseFloat(e.target.value) || 0
                                const monthlyRate = rate / 100 / 12
                                const projected = editingScenario.startValue * Math.pow(1 + monthlyRate, editingScenario.period)
                                setEditingScenario({ ...editingScenario, growthRate: rate, projectedValue: projected })
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Period (months)</label>
                            <Input
                              type="number"
                              value={editingScenario.period}
                              onChange={(e) => {
                                const period = parseInt(e.target.value) || 0
                                const monthlyRate = editingScenario.growthRate / 100 / 12
                                const projected = editingScenario.startValue * Math.pow(1 + monthlyRate, period)
                                setEditingScenario({ ...editingScenario, period, projectedValue: projected })
                              }}
                            />
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm">
                            <div className="text-gray-600 mb-1">Projected Value:</div>
                            <div className="text-2xl font-bold text-primary-600">
                              ${editingScenario.projectedValue.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                          <textarea
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                            rows={3}
                            value={editingScenario.notes || ''}
                            onChange={(e) => setEditingScenario({ ...editingScenario, notes: e.target.value })}
                            placeholder="Additional notes..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveScenario} className="flex-1">
                            Save Scenario
                          </Button>
                          <Button variant="outline" onClick={() => setEditingScenario(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </>
              )}
            </Card>
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Growth Milestones</h2>
                </div>
                <Button onClick={addMilestone} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>

              {milestones.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                  <p>No milestones yet. Add milestones to track growth targets.</p>
                </div>
              ) : (
                <>
                  {milestoneChartData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Milestone Progress</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={milestoneChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="current" fill="#3b82f6" name="Current" />
                          <Bar dataKey="target" fill="#10b981" name="Target" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-4">
                    {milestones.map((milestone) => {
                      const daysUntil = Math.ceil((new Date(milestone.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                      const statusColors = {
                        'achieved': 'bg-green-100 border-green-500',
                        'on-track': 'bg-blue-100 border-blue-500',
                        'at-risk': 'bg-yellow-100 border-yellow-500',
                        'missed': 'bg-red-100 border-red-500'
                      }

                      return (
                        <Card key={milestone.id} className={`p-4 border-2 ${statusColors[milestone.status]}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{milestone.name}</h4>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    milestone.status === 'achieved' ? 'border-green-500' : 
                                    milestone.status === 'at-risk' ? 'border-yellow-500' : 
                                    milestone.status === 'missed' ? 'border-red-500' : 
                                    'border-blue-500'
                                  }`}
                                >
                                  {milestone.status === 'achieved' ? 'Achieved' : 
                                   milestone.status === 'at-risk' ? 'At Risk' : 
                                   milestone.status === 'missed' ? 'Missed' : 'On Track'}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                <div>
                                  <span className="text-gray-600">Current:</span>
                                  <div className="font-bold">${milestone.currentValue.toLocaleString()}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Target:</span>
                                  <div className="font-bold">${milestone.targetValue.toLocaleString()}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Progress:</span>
                                  <div className="font-bold">{milestone.progress.toFixed(1)}%</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Days Left:</span>
                                  <div className="font-bold">{daysUntil > 0 ? daysUntil : 'Overdue'}</div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    milestone.status === 'achieved' ? 'bg-green-500' : 
                                    milestone.status === 'at-risk' ? 'bg-yellow-500' : 
                                    milestone.status === 'missed' ? 'bg-red-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${Math.min(milestone.progress, 100)}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingMilestone(milestone)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMilestone(milestone.id)}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Periods</div>
                <div className="text-2xl font-bold">{growthPeriods.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Scenarios</div>
                <div className="text-2xl font-bold">{scenarios.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Active Milestones</div>
                <div className="text-2xl font-bold">
                  {milestones.filter(m => m.status !== 'achieved' && m.status !== 'missed').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Avg Growth Rate</div>
                <div className="text-2xl font-bold">
                  {growthPeriods.length > 1 
                    ? `${(getHistoricalChartData().reduce((sum, d) => sum + (d.growth || 0), 0) / getHistoricalChartData().length).toFixed(1)}%`
                    : '0%'}
                </div>
              </Card>
            </div>

            {getHistoricalChartData().length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Growth Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={getHistoricalChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Value" />
                  </AreaChart>
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
              {growthRate === null ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No calculations yet. Use the calculator to generate growth rate calculations.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold mb-1">Latest Calculation</h4>
                        <p className="text-sm text-gray-600">
                          {metricLabels[metricType]} • {timePeriod} {periodType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(2)}%
                        </p>
                        <p className="text-xs text-gray-500">Growth Rate</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Edit Growth Period Modal */}
        {editingPeriod && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Growth Period</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingPeriod(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <Input
                    type="date"
                    value={editingPeriod.date}
                    onChange={(e) => setEditingPeriod({ ...editingPeriod, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Metric Type *</label>
                  <Select
                    value={editingPeriod.metric}
                    onChange={(e) => setEditingPeriod({ ...editingPeriod, metric: e.target.value as MetricType })}
                    options={[
                      { value: 'revenue', label: 'Revenue' },
                      { value: 'users', label: 'Users' },
                      { value: 'customers', label: 'Customers' },
                      { value: 'mrr', label: 'MRR' },
                      { value: 'arr', label: 'ARR' },
                      { value: 'custom', label: 'Custom' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value ($) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingPeriod.value}
                    onChange={(e) => setEditingPeriod({ ...editingPeriod, value: parseFloat(e.target.value) || 0 })}
                    placeholder="10000"
                  />
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
                <div className="flex gap-2">
                  <Button onClick={saveGrowthPeriod} className="flex-1">
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

        {/* Edit Milestone Modal */}
        {editingMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Milestone</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingMilestone(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Milestone Name *</label>
                  <Input
                    value={editingMilestone.name}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, name: e.target.value })}
                    placeholder="e.g., $100K MRR"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Value ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingMilestone.currentValue}
                      onChange={(e) => {
                        const current = parseFloat(e.target.value) || 0
                        const progress = editingMilestone.targetValue > 0 ? (current / editingMilestone.targetValue) * 100 : 0
                        setEditingMilestone({ ...editingMilestone, currentValue: current, progress })
                      }}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Value ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingMilestone.targetValue}
                      onChange={(e) => {
                        const target = parseFloat(e.target.value) || 0
                        const progress = target > 0 ? (editingMilestone.currentValue / target) * 100 : 0
                        setEditingMilestone({ ...editingMilestone, targetValue: target, progress })
                      }}
                      placeholder="100000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date *</label>
                  <Input
                    type="date"
                    value={editingMilestone.targetDate}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, targetDate: e.target.value })}
                  />
                </div>
                {editingMilestone.targetValue > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm">
                      <div className="text-gray-600 mb-1">Progress:</div>
                      <div className="text-2xl font-bold text-primary-600">
                        {editingMilestone.progress.toFixed(1)}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${Math.min(editingMilestone.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingMilestone.notes || ''}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveMilestone} className="flex-1">
                    Save Milestone
                  </Button>
                  <Button variant="outline" onClick={() => setEditingMilestone(null)}>
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
