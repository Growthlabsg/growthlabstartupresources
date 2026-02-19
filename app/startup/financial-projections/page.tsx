'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  Save, 
  Download,
  Plus,
  X,
  Edit,
  Eye,
  Sparkles,
  LineChart,
  PieChart,
  Calculator,
  Target,
  AlertCircle,
  CheckCircle,
  Calendar,
  Users,
  Percent,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FileText,
  Share2,
  Zap,
  TrendingDown,
  Activity,
  Layers,
  GitCompare,
  Wind,
  Flag,
  Briefcase,
  BarChart3,
  Coins
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import Link from 'next/link'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

interface RevenueStream {
  id: string
  name: string
  monthlyAmount: number
  growthRate: number // Monthly growth rate in percentage
}

interface ExpenseCategory {
  id: string
  name: string
  monthlyAmount: number
  growthRate: number // Monthly growth rate in percentage
  category: 'fixed' | 'variable'
}

interface MonthlyProjection {
  month: number
  year: number
  revenue: number
  expenses: number
  cashFlow: number
  cumulativeCashFlow: number
}

interface KeyMetrics {
  monthlyBurnRate: number
  runway: number // months
  breakEvenMonth: number | null
  cac: number // Customer Acquisition Cost
  ltv: number // Lifetime Value
  ltvCacRatio: number
  grossMargin: number
  netMargin: number
}

type Scenario = 'optimistic' | 'realistic' | 'pessimistic'
type ViewMode = 'monthly' | 'annual' | 'summary'
type Timeframe = 12 | 24 | 36 | 48 | 60 // months

interface Milestone {
  id: string
  name: string
  targetAmount: number
  targetMonth: number
  type: 'revenue' | 'users' | 'funding' | 'profitability'
  achieved: boolean
}

interface InvestmentRound {
  id: string
  name: string
  amount: number
  month: number
  valuation: number
  dilution: number
}

interface SensitivityVariable {
  name: string
  baseValue: number
  changePercent: number
  impact: number
}

const defaultRevenueStreams: RevenueStream[] = [
  { id: '1', name: 'Product Sales', monthlyAmount: 0, growthRate: 5 },
  { id: '2', name: 'Subscription Revenue', monthlyAmount: 0, growthRate: 8 },
  { id: '3', name: 'Service Revenue', monthlyAmount: 0, growthRate: 3 },
]

const defaultExpenseCategories: ExpenseCategory[] = [
  { id: '1', name: 'Salaries & Benefits', monthlyAmount: 0, growthRate: 2, category: 'fixed' },
  { id: '2', name: 'Marketing & Advertising', monthlyAmount: 0, growthRate: 5, category: 'variable' },
  { id: '3', name: 'Office & Rent', monthlyAmount: 0, growthRate: 3, category: 'fixed' },
  { id: '4', name: 'Technology & Software', monthlyAmount: 0, growthRate: 4, category: 'variable' },
  { id: '5', name: 'Operations', monthlyAmount: 0, growthRate: 2, category: 'variable' },
]

export default function FinancialProjectionsPage() {
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>(defaultRevenueStreams)
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(defaultExpenseCategories)
  const [projections, setProjections] = useState<MonthlyProjection[]>([])
  const [keyMetrics, setKeyMetrics] = useState<KeyMetrics | null>(null)
  const [scenario, setScenario] = useState<Scenario>('realistic')
  const [viewMode, setViewMode] = useState<ViewMode>('monthly')
  const [timeframe, setTimeframe] = useState<Timeframe>(36)
  const [startingCash, setStartingCash] = useState(0)
  const [projectionName, setProjectionName] = useState('My Financial Projections')
  const [isLoaded, setIsLoaded] = useState(false)
  const [editingRevenueId, setEditingRevenueId] = useState<string | null>(null)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [showSensitivity, setShowSensitivity] = useState(false)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [investmentRounds, setInvestmentRounds] = useState<InvestmentRound[]>([])
  const [unitEconomics, setUnitEconomics] = useState({
    averageOrderValue: 0,
    customerLifetime: 12,
    monthlyChurnRate: 5,
    costPerAcquisition: 0,
    costPerUnit: 0,
  })
  const [sensitivityResults, setSensitivityResults] = useState<SensitivityVariable[]>([])

  // Scenario multipliers
  const scenarioMultipliers = {
    optimistic: { revenue: 1.2, expenses: 0.9 },
    realistic: { revenue: 1.0, expenses: 1.0 },
    pessimistic: { revenue: 0.8, expenses: 1.1 },
  }

  // Initialize on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoaded(true)
      return
    }

    try {
      const saved = localStorage.getItem('financialProjections')
      if (saved) {
        const data = JSON.parse(saved)
        setProjectionName(data.name || 'My Financial Projections')
        setRevenueStreams(data.revenueStreams || defaultRevenueStreams)
        setExpenseCategories(data.expenseCategories || defaultExpenseCategories)
        setStartingCash(data.startingCash || 0)
        setTimeframe(data.timeframe || 36)
        setScenario(data.scenario || 'realistic')
      }
    } catch (error) {
      console.error('Error loading financial projections:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Calculate projections
  const calculateProjections = useCallback(() => {
    const multiplier = scenarioMultipliers[scenario]
    const months: MonthlyProjection[] = []
    let cumulativeCashFlow = startingCash

    for (let i = 0; i < timeframe; i++) {
      const month = (i % 12) + 1
      const year = Math.floor(i / 12) + new Date().getFullYear()

      // Calculate revenue with growth
      let totalRevenue = 0
      revenueStreams.forEach(stream => {
        const baseAmount = stream.monthlyAmount * Math.pow(1 + stream.growthRate / 100, i)
        totalRevenue += baseAmount * multiplier.revenue
      })

      // Calculate expenses with growth
      let totalExpenses = 0
      expenseCategories.forEach(category => {
        const baseAmount = category.monthlyAmount * Math.pow(1 + category.growthRate / 100, i)
        totalExpenses += baseAmount * multiplier.expenses
      })

      const cashFlow = totalRevenue - totalExpenses
      cumulativeCashFlow += cashFlow

      months.push({
        month,
        year,
        revenue: Math.round(totalRevenue),
        expenses: Math.round(totalExpenses),
        cashFlow: Math.round(cashFlow),
        cumulativeCashFlow: Math.round(cumulativeCashFlow),
      })
    }

    setProjections(months)

    // Calculate key metrics
    const lastMonth = months[months.length - 1]
    const avgMonthlyRevenue = months.reduce((sum, m) => sum + m.revenue, 0) / months.length
    const avgMonthlyExpenses = months.reduce((sum, m) => sum + m.expenses, 0) / months.length
    const monthlyBurnRate = avgMonthlyExpenses - avgMonthlyRevenue
    const runway = monthlyBurnRate > 0 ? Math.floor(startingCash / monthlyBurnRate) : Infinity
    const breakEvenMonth = months.findIndex(m => m.cumulativeCashFlow > 0) + 1 || null
    const grossMargin = avgMonthlyRevenue > 0 ? ((avgMonthlyRevenue - avgMonthlyExpenses * 0.6) / avgMonthlyRevenue) * 100 : 0
    const netMargin = avgMonthlyRevenue > 0 ? ((avgMonthlyRevenue - avgMonthlyExpenses) / avgMonthlyRevenue) * 100 : 0

    // Simplified CAC and LTV (can be enhanced with actual customer data)
    const cac = avgMonthlyExpenses * 0.3 / Math.max(1, avgMonthlyRevenue / 100) // Assume 30% of expenses on marketing
    const ltv = avgMonthlyRevenue / Math.max(1, avgMonthlyRevenue / 100) * 12 // Assume 12 month average lifetime
    const ltvCacRatio = cac > 0 ? ltv / cac : 0

    setKeyMetrics({
      monthlyBurnRate: Math.round(monthlyBurnRate),
      runway: runway === Infinity ? -1 : runway,
      breakEvenMonth,
      cac: Math.round(cac),
      ltv: Math.round(ltv),
      ltvCacRatio: Math.round(ltvCacRatio * 10) / 10,
      grossMargin: Math.round(grossMargin * 10) / 10,
      netMargin: Math.round(netMargin * 10) / 10,
    })
  }, [revenueStreams, expenseCategories, scenario, timeframe, startingCash])

  useEffect(() => {
    if (isLoaded) {
      calculateProjections()
    }
  }, [isLoaded, calculateProjections])

  const handleAddRevenueStream = () => {
    const newStream: RevenueStream = {
      id: `revenue-${Date.now()}`,
      name: 'New Revenue Stream',
      monthlyAmount: 0,
      growthRate: 5,
    }
    setRevenueStreams([...revenueStreams, newStream])
    setEditingRevenueId(newStream.id)
  }

  const handleAddExpenseCategory = () => {
    const newCategory: ExpenseCategory = {
      id: `expense-${Date.now()}`,
      name: 'New Expense',
      monthlyAmount: 0,
      growthRate: 2,
      category: 'variable',
    }
    setExpenseCategories([...expenseCategories, newCategory])
    setEditingExpenseId(newCategory.id)
  }

  const handleDeleteRevenueStream = (id: string) => {
    if (revenueStreams.length <= 1) {
      showToast('You must have at least one revenue stream', 'error')
      return
    }
    setRevenueStreams(revenueStreams.filter(s => s.id !== id))
    showToast('Revenue stream deleted', 'info')
  }

  const handleDeleteExpenseCategory = (id: string) => {
    if (expenseCategories.length <= 1) {
      showToast('You must have at least one expense category', 'error')
      return
    }
    setExpenseCategories(expenseCategories.filter(c => c.id !== id))
    showToast('Expense category deleted', 'info')
  }

  const handleSave = () => {
    if (typeof window === 'undefined') return
    try {
      const data = {
        name: projectionName,
        revenueStreams,
        expenseCategories,
        startingCash,
        timeframe,
        scenario,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem('financialProjections', JSON.stringify(data))
      showToast('Financial projections saved!', 'success')
    } catch (error) {
      showToast('Error saving projections', 'error')
    }
  }

  const handleLoad = () => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem('financialProjections')
      if (saved) {
        const data = JSON.parse(saved)
        setProjectionName(data.name || 'My Financial Projections')
        setRevenueStreams(data.revenueStreams || defaultRevenueStreams)
        setExpenseCategories(data.expenseCategories || defaultExpenseCategories)
        setStartingCash(data.startingCash || 0)
        setTimeframe(data.timeframe || 36)
        setScenario(data.scenario || 'realistic')
        showToast('Financial projections loaded!', 'success')
      } else {
        showToast('No saved projections found', 'info')
      }
    } catch (error) {
      showToast('Error loading projections', 'error')
    }
  }

  const handleExport = async (format: 'pdf' | 'excel') => {
    showToast(`Exporting as ${format.toUpperCase()}...`, 'info')
    
    try {
      if (format === 'pdf') {
        const { exportFinancialProjectionsToPDF } = await import('@/lib/utils/financial-export')
        await exportFinancialProjectionsToPDF({
          name: projectionName,
          revenueStreams,
          expenseCategories,
          projections,
          keyMetrics,
          scenario,
          timeframe,
          startingCash,
        })
      } else {
        const { exportFinancialProjectionsToExcel } = await import('@/lib/utils/financial-export')
        await exportFinancialProjectionsToExcel({
          name: projectionName,
          revenueStreams,
          expenseCategories,
          projections,
          keyMetrics,
          scenario,
          timeframe,
          startingCash,
        })
      }
      showToast(`Exported as ${format.toUpperCase()}!`, 'success')
    } catch (error) {
      console.error('Export error:', error)
      showToast(`Error exporting ${format.toUpperCase()}. Please try again.`, 'error')
    }
  }

  const handleShare = () => {
    if (typeof window === 'undefined') return
    if (navigator.share) {
      navigator.share({
        title: projectionName,
        text: 'Check out my financial projections',
        url: window.location.href,
      })
        .then(() => showToast('Shared successfully!', 'success'))
        .catch(() => showToast('Share cancelled', 'info'))
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => showToast('Link copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy link', 'error'))
    }
  }

  const calculateSensitivity = () => {
    const variables: SensitivityVariable[] = []
    
    // Revenue growth sensitivity
    const baseRevenue = totalMonthlyRevenue
    const highRevenue = totalMonthlyRevenue * 1.2
    const revenueImpact = ((highRevenue - baseRevenue) / baseRevenue) * 100
    variables.push({
      name: 'Revenue Growth (+20%)',
      baseValue: baseRevenue,
      changePercent: 20,
      impact: revenueImpact,
    })

    // Expense reduction sensitivity
    const baseExpenses = totalMonthlyExpenses
    const lowExpenses = totalMonthlyExpenses * 0.9
    const expenseImpact = ((baseExpenses - lowExpenses) / baseExpenses) * 100
    variables.push({
      name: 'Expense Reduction (-10%)',
      baseValue: baseExpenses,
      changePercent: -10,
      impact: expenseImpact,
    })

    // Starting cash sensitivity
    if (startingCash > 0) {
      const highCash = startingCash * 1.5
      const cashImpact = ((highCash - startingCash) / startingCash) * 100
      variables.push({
        name: 'Starting Cash (+50%)',
        baseValue: startingCash,
        changePercent: 50,
        impact: cashImpact,
      })
    }

    setSensitivityResults(variables)
  }

  const totalMonthlyRevenue = revenueStreams.reduce((sum, s) => sum + s.monthlyAmount, 0)
  const totalMonthlyExpenses = expenseCategories.reduce((sum, c) => sum + c.monthlyAmount, 0)
  const currentCashFlow = totalMonthlyRevenue - totalMonthlyExpenses

  // Group projections by year for annual view
  const annualProjections = projections.reduce((acc, proj) => {
    if (!acc[proj.year]) {
      acc[proj.year] = { year: proj.year, revenue: 0, expenses: 0, cashFlow: 0, months: 0, cumulativeCashFlow: startingCash }
    }
    acc[proj.year].revenue += proj.revenue
    acc[proj.year].expenses += proj.expenses
    acc[proj.year].cashFlow += proj.cashFlow
    acc[proj.year].months += 1
    return acc
  }, {} as Record<number, { year: number; revenue: number; expenses: number; cashFlow: number; months: number; cumulativeCashFlow: number }>)

  // Calculate cumulative cash flow for annual projections
  let runningCumulative = startingCash
  Object.keys(annualProjections).forEach((year) => {
    const yearNum = parseInt(year)
    runningCumulative += annualProjections[yearNum].cashFlow
    annualProjections[yearNum].cumulativeCashFlow = runningCumulative
  })

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Financial Projections...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                  Financial Projections
                </span>
              </h1>
              <input
                type="text"
                value={projectionName}
                onChange={(e) => setProjectionName(e.target.value)}
                className="text-lg text-gray-600 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 w-full"
                placeholder="Enter projection name..."
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleLoad}>
                <FileText className="h-4 w-4 mr-2" />
                Load
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            Build comprehensive financial projections with revenue, expenses, and key metrics
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-xl font-bold text-green-600">${totalMonthlyRevenue.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Expenses</p>
                <p className="text-xl font-bold text-red-600">${totalMonthlyExpenses.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${currentCashFlow >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <BarChart className={`h-5 w-5 ${currentCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cash Flow</p>
                <p className={`text-xl font-bold ${currentCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${currentCashFlow.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Starting Cash</p>
                <p className="text-xl font-bold text-blue-600">${startingCash.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <h3 className="font-semibold mb-4">Scenario</h3>
            <div className="space-y-2">
              {(['optimistic', 'realistic', 'pessimistic'] as Scenario[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    scenario === s
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="capitalize">{s}</span>
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold mb-4">Timeframe</h3>
            <div className="space-y-2">
              {[12, 24, 36, 48, 60].map((months) => (
                <button
                  key={months}
                  onClick={() => setTimeframe(months as Timeframe)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    timeframe === months
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {months} months ({months / 12} years)
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold mb-4">View Mode</h3>
            <div className="space-y-2">
              {(['monthly', 'annual', 'summary'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all capitalize ${
                    viewMode === mode
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold mb-4">Starting Cash</h3>
            <input
              type="number"
              value={startingCash || ''}
              onChange={(e) => setStartingCash(Number(e.target.value))}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">Current cash balance</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Streams */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Revenue Streams</h2>
              <Button size="sm" onClick={handleAddRevenueStream}>
                <Plus className="h-4 w-4 mr-2" />
                Add Stream
              </Button>
            </div>
            <div className="space-y-4">
              {revenueStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={stream.name}
                        onChange={(e) =>
                          setRevenueStreams(
                            revenueStreams.map((s) =>
                              s.id === stream.id ? { ...s, name: e.target.value } : s
                            )
                          )
                        }
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Amount ($)</label>
                      <input
                        type="number"
                        value={stream.monthlyAmount || ''}
                        onChange={(e) =>
                          setRevenueStreams(
                            revenueStreams.map((s) =>
                              s.id === stream.id ? { ...s, monthlyAmount: Number(e.target.value) } : s
                            )
                          )
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Growth Rate (%/mo)</label>
                        <input
                          type="number"
                          value={stream.growthRate || ''}
                          onChange={(e) =>
                            setRevenueStreams(
                              revenueStreams.map((s) =>
                                s.id === stream.id ? { ...s, growthRate: Number(e.target.value) } : s
                              )
                            )
                          }
                          placeholder="5"
                          step="0.1"
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                        />
                      </div>
                      {revenueStreams.length > 1 && (
                        <button
                          onClick={() => handleDeleteRevenueStream(stream.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Key Metrics */}
          <Card>
            <h3 className="font-semibold mb-4">Key Metrics</h3>
            {keyMetrics && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Burn Rate</p>
                  <p className={`text-2xl font-bold ${keyMetrics.monthlyBurnRate >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${keyMetrics.monthlyBurnRate.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Runway</p>
                  <p className={`text-2xl font-bold ${keyMetrics.runway > 0 && keyMetrics.runway < 12 ? 'text-red-600' : keyMetrics.runway > 24 ? 'text-green-600' : 'text-amber-600'}`}>
                    {keyMetrics.runway === -1 ? '∞' : `${keyMetrics.runway} months`}
                  </p>
                </div>
                {keyMetrics.breakEvenMonth && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Break-Even Month</p>
                    <p className="text-2xl font-bold text-primary-600">Month {keyMetrics.breakEvenMonth}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">CAC (Customer Acquisition Cost)</p>
                  <p className="text-xl font-bold text-gray-900">${keyMetrics.cac.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">LTV (Lifetime Value)</p>
                  <p className="text-xl font-bold text-gray-900">${keyMetrics.ltv.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">LTV:CAC Ratio</p>
                  <p className={`text-xl font-bold ${keyMetrics.ltvCacRatio >= 3 ? 'text-green-600' : keyMetrics.ltvCacRatio >= 1 ? 'text-amber-600' : 'text-red-600'}`}>
                    {keyMetrics.ltvCacRatio}:1
                  </p>
                  {keyMetrics.ltvCacRatio < 3 && (
                    <p className="text-xs text-amber-600 mt-1">Target: 3:1 or higher</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Gross Margin</p>
                  <p className={`text-xl font-bold ${keyMetrics.grossMargin >= 50 ? 'text-green-600' : keyMetrics.grossMargin >= 30 ? 'text-amber-600' : 'text-red-600'}`}>
                    {keyMetrics.grossMargin.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Net Margin</p>
                  <p className={`text-xl font-bold ${keyMetrics.netMargin >= 20 ? 'text-green-600' : keyMetrics.netMargin >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                    {keyMetrics.netMargin.toFixed(1)}%
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Expense Categories */}
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Expense Categories</h2>
            <Button size="sm" onClick={handleAddExpenseCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expenseCategories.map((category) => (
              <div
                key={category.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) =>
                        setExpenseCategories(
                          expenseCategories.map((c) =>
                            c.id === category.id ? { ...c, name: e.target.value } : c
                          )
                        )
                      }
                      className="flex-1 font-semibold px-2 py-1 border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                    />
                    {expenseCategories.length > 1 && (
                      <button
                        onClick={() => handleDeleteExpenseCategory(category.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Monthly Amount ($)</label>
                      <input
                        type="number"
                        value={category.monthlyAmount || ''}
                        onChange={(e) =>
                          setExpenseCategories(
                            expenseCategories.map((c) =>
                              c.id === category.id ? { ...c, monthlyAmount: Number(e.target.value) } : c
                            )
                          )
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Growth Rate (%/mo)</label>
                      <input
                        type="number"
                        value={category.growthRate || ''}
                        onChange={(e) =>
                          setExpenseCategories(
                            expenseCategories.map((c) =>
                              c.id === category.id ? { ...c, growthRate: Number(e.target.value) } : c
                            )
                          )
                        }
                        placeholder="2"
                        step="0.1"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setExpenseCategories(
                          expenseCategories.map((c) =>
                            c.id === category.id ? { ...c, category: 'fixed' } : c
                          )
                        )
                      }
                      className={`flex-1 px-3 py-1 rounded text-xs font-medium transition-all ${
                        category.category === 'fixed'
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                      }`}
                    >
                      Fixed
                    </button>
                    <button
                      onClick={() =>
                        setExpenseCategories(
                          expenseCategories.map((c) =>
                            c.id === category.id ? { ...c, category: 'variable' } : c
                          )
                        )
                      }
                      className={`flex-1 px-3 py-1 rounded text-xs font-medium transition-all ${
                        category.category === 'variable'
                          ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                      }`}
                    >
                      Variable
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts Section */}
        {projections.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Revenue vs Expenses Chart */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary-500" />
                Revenue vs Expenses
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={projections.slice(0, 12)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={(item) => `${item.month}/${item.year}`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Card>

            {/* Cash Flow Trend */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary-500" />
                Cash Flow Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={projections.slice(0, 12)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={(item) => `${item.month}/${item.year}`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cashFlow" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Cash Flow"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cumulativeCashFlow" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Cumulative"
                    strokeDasharray="5 5"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary-500" />
                Revenue Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={revenueStreams.map(s => ({ name: s.name, value: s.monthlyAmount }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueStreams.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card>

            {/* Expense Breakdown */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary-500" />
                Expense Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={expenseCategories.map(c => ({ name: c.name, value: c.monthlyAmount }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Projections Table */}
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Projections</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => calculateProjections()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Recalculate
              </Button>
            </div>
          </div>

          {viewMode === 'summary' && keyMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
                <p className="text-sm text-green-700 mb-2">Total Revenue ({timeframe} months)</p>
                <p className="text-3xl font-bold text-green-700">
                  ${projections.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border-2 border-red-200">
                <p className="text-sm text-red-700 mb-2">Total Expenses ({timeframe} months)</p>
                <p className="text-3xl font-bold text-red-700">
                  ${projections.reduce((sum, p) => sum + p.expenses, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-blue-700 mb-2">Net Cash Flow</p>
                <p className={`text-3xl font-bold ${projections[projections.length - 1]?.cumulativeCashFlow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ${projections[projections.length - 1]?.cumulativeCashFlow.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200">
                <p className="text-sm text-purple-700 mb-2">Average Monthly Growth</p>
                <p className="text-3xl font-bold text-purple-700">
                  {projections.length > 1
                    ? (((projections[projections.length - 1].revenue - projections[0].revenue) / projections[0].revenue) * 100 / (timeframe / 12)).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Period</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Expenses</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Cash Flow</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {viewMode === 'annual' ? (
                    Object.values(annualProjections).map((proj, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          proj.cashFlow < 0 ? 'bg-red-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-4">Year {proj.year}</td>
                        <td className="text-right py-3 px-4 font-medium text-green-600">
                          ${proj.revenue.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 font-medium text-red-600">
                          ${proj.expenses.toLocaleString()}
                        </td>
                        <td className={`text-right py-3 px-4 font-bold ${proj.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${proj.cashFlow.toLocaleString()}
                        </td>
                        <td className={`text-right py-3 px-4 font-semibold ${proj.cumulativeCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${proj.cumulativeCashFlow.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    projections.map((proj, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          proj.cashFlow < 0 ? 'bg-red-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-4">{proj.month}/{proj.year}</td>
                        <td className="text-right py-3 px-4 font-medium text-green-600">
                          ${proj.revenue.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 font-medium text-red-600">
                          ${proj.expenses.toLocaleString()}
                        </td>
                        <td className={`text-right py-3 px-4 font-bold ${proj.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${proj.cashFlow.toLocaleString()}
                        </td>
                        <td className={`text-right py-3 px-4 font-semibold ${proj.cumulativeCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${proj.cumulativeCashFlow.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Funding Needs Calculator */}
        {keyMetrics && keyMetrics.monthlyBurnRate > 0 && (
          <Card className="mt-6 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-amber-600" />
                  Funding Needs Calculator
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Calculate how much funding you need to reach your milestones
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <p className="text-sm text-gray-600 mb-1">Current Runway</p>
                    <p className={`text-2xl font-bold ${keyMetrics.runway > 0 && keyMetrics.runway < 12 ? 'text-red-600' : keyMetrics.runway > 24 ? 'text-green-600' : 'text-amber-600'}`}>
                      {keyMetrics.runway === -1 ? '∞' : `${keyMetrics.runway} months`}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <p className="text-sm text-gray-600 mb-1">Monthly Burn Rate</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${keyMetrics.monthlyBurnRate.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <p className="text-sm text-gray-600 mb-1">Funding for 18 Months</p>
                    <p className="text-2xl font-bold text-primary-600">
                      ${(keyMetrics.monthlyBurnRate * 18).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Enhanced Metrics Dashboard */}
        {keyMetrics && (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-500" />
              Detailed Metrics Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border-2 ${
                keyMetrics.ltvCacRatio >= 3 
                  ? 'bg-green-50 border-green-200' 
                  : keyMetrics.ltvCacRatio >= 1 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">LTV:CAC Ratio</span>
                  {keyMetrics.ltvCacRatio >= 3 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                <p className={`text-3xl font-bold ${
                  keyMetrics.ltvCacRatio >= 3 ? 'text-green-700' : keyMetrics.ltvCacRatio >= 1 ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {keyMetrics.ltvCacRatio}:1
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {keyMetrics.ltvCacRatio >= 3 ? 'Excellent' : keyMetrics.ltvCacRatio >= 1 ? 'Needs Improvement' : 'Critical'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                keyMetrics.grossMargin >= 50 
                  ? 'bg-green-50 border-green-200' 
                  : keyMetrics.grossMargin >= 30 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Gross Margin</span>
                  {keyMetrics.grossMargin >= 50 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                <p className={`text-3xl font-bold ${
                  keyMetrics.grossMargin >= 50 ? 'text-green-700' : keyMetrics.grossMargin >= 30 ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {keyMetrics.grossMargin.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {keyMetrics.grossMargin >= 50 ? 'Healthy' : keyMetrics.grossMargin >= 30 ? 'Moderate' : 'Low'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                keyMetrics.netMargin >= 20 
                  ? 'bg-green-50 border-green-200' 
                  : keyMetrics.netMargin >= 0 
                  ? 'bg-amber-50 border-amber-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Net Margin</span>
                  {keyMetrics.netMargin >= 20 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : keyMetrics.netMargin >= 0 ? (
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <p className={`text-3xl font-bold ${
                  keyMetrics.netMargin >= 20 ? 'text-green-700' : keyMetrics.netMargin >= 0 ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {keyMetrics.netMargin.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {keyMetrics.netMargin >= 20 ? 'Profitable' : keyMetrics.netMargin >= 0 ? 'Break-even' : 'Loss-making'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                keyMetrics.runway > 0 && keyMetrics.runway < 12 
                  ? 'bg-red-50 border-red-200' 
                  : keyMetrics.runway > 24 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Runway</span>
                  {keyMetrics.runway > 24 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : keyMetrics.runway > 12 ? (
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <p className={`text-3xl font-bold ${
                  keyMetrics.runway > 0 && keyMetrics.runway < 12 ? 'text-red-700' : keyMetrics.runway > 24 ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {keyMetrics.runway === -1 ? '∞' : `${keyMetrics.runway} mo`}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {keyMetrics.runway > 24 ? 'Secure' : keyMetrics.runway > 12 ? 'Moderate' : 'Urgent'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Enhanced Features Tabs */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant={showComparison ? "primary" : "outline"}
            onClick={() => setShowComparison(!showComparison)}
            className="w-full"
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Scenarios
          </Button>
          <Button
            variant={showSensitivity ? "primary" : "outline"}
            onClick={() => {
              setShowSensitivity(!showSensitivity)
              if (!showSensitivity) calculateSensitivity()
            }}
            className="w-full"
          >
            <Wind className="h-4 w-4 mr-2" />
            Sensitivity Analysis
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const newMilestone: Milestone = {
                id: `milestone-${Date.now()}`,
                name: 'New Milestone',
                targetAmount: 0,
                targetMonth: 12,
                type: 'revenue',
                achieved: false,
              }
              setMilestones([...milestones, newMilestone])
              showToast('Milestone added', 'success')
            }}
            className="w-full"
          >
            <Flag className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const newRound: InvestmentRound = {
                id: `round-${Date.now()}`,
                name: 'Seed Round',
                amount: 0,
                month: 6,
                valuation: 0,
                dilution: 0,
              }
              setInvestmentRounds([...investmentRounds, newRound])
              showToast('Investment round added', 'success')
            }}
            className="w-full"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Add Funding Round
          </Button>
        </div>

        {/* Comparison Mode */}
        {showComparison && (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-primary-500" />
              Scenario Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Metric</th>
                    <th className="text-right py-3 px-4 font-semibold text-green-600">Optimistic</th>
                    <th className="text-right py-3 px-4 font-semibold text-blue-600">Realistic</th>
                    <th className="text-right py-3 px-4 font-semibold text-red-600">Pessimistic</th>
                  </tr>
                </thead>
                <tbody>
                  {(['optimistic', 'realistic', 'pessimistic'] as Scenario[]).map((scenarioType) => {
                    const multiplier = scenarioMultipliers[scenarioType]
                    const scenarioProj = projections.map(p => ({
                      ...p,
                      revenue: p.revenue * multiplier.revenue,
                      expenses: p.expenses * multiplier.expenses,
                      cashFlow: (p.revenue * multiplier.revenue) - (p.expenses * multiplier.expenses),
                    }))
                    const totalRevenue = scenarioProj.reduce((sum, p) => sum + p.revenue, 0)
                    const totalExpenses = scenarioProj.reduce((sum, p) => sum + p.expenses, 0)
                    const finalCashFlow = scenarioProj[scenarioProj.length - 1]?.cumulativeCashFlow || 0
                    
                    return scenarioType === 'realistic' ? (
                      <React.Fragment key={scenarioType}>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Total Revenue ({timeframe} months)</td>
                          <td className="text-right py-3 px-4">${totalRevenue.toLocaleString()}</td>
                          <td className="text-right py-3 px-4 font-bold">${totalRevenue.toLocaleString()}</td>
                          <td className="text-right py-3 px-4">${totalRevenue.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Total Expenses ({timeframe} months)</td>
                          <td className="text-right py-3 px-4">${totalExpenses.toLocaleString()}</td>
                          <td className="text-right py-3 px-4 font-bold">${totalExpenses.toLocaleString()}</td>
                          <td className="text-right py-3 px-4">${totalExpenses.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">Final Cash Position</td>
                          <td className="text-right py-3 px-4 text-green-600">${finalCashFlow.toLocaleString()}</td>
                          <td className="text-right py-3 px-4 font-bold">${finalCashFlow.toLocaleString()}</td>
                          <td className="text-right py-3 px-4 text-red-600">${finalCashFlow.toLocaleString()}</td>
                        </tr>
                      </React.Fragment>
                    ) : null
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Sensitivity Analysis */}
        {showSensitivity && (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wind className="h-5 w-5 text-primary-500" />
              Sensitivity Analysis
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              See how changes in key variables impact your financial projections
            </p>
            {sensitivityResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sensitivityResults.map((variable, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{variable.name}</span>
                      <span className={`text-sm font-bold ${
                        variable.impact > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {variable.impact > 0 ? '+' : ''}{variable.impact.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      Base: ${variable.baseValue.toLocaleString()} | Change: {variable.changePercent > 0 ? '+' : ''}{variable.changePercent}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          variable.impact > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.abs(variable.impact) * 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Milestones Tracking */}
        {milestones.length > 0 && (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Flag className="h-5 w-5 text-primary-500" />
              Financial Milestones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {milestones.map((milestone) => {
                const projectionAtMonth = projections[milestone.targetMonth - 1]
                const currentValue = milestone.type === 'revenue' 
                  ? projectionAtMonth?.revenue || 0
                  : projectionAtMonth?.cumulativeCashFlow || 0
                const progress = milestone.targetAmount > 0 
                  ? Math.min(100, (currentValue / milestone.targetAmount) * 100)
                  : 0
                
                return (
                  <div key={milestone.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        value={milestone.name}
                        onChange={(e) => setMilestones(milestones.map(m => 
                          m.id === milestone.id ? { ...m, name: e.target.value } : m
                        ))}
                        className="font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2"
                      />
                      <button
                        onClick={() => setMilestones(milestones.filter(m => m.id !== milestone.id))}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={milestone.type}
                          onChange={(e) => setMilestones(milestones.map(m => 
                            m.id === milestone.id ? { ...m, type: e.target.value as any } : m
                          ))}
                          className="text-xs px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="revenue">Revenue</option>
                          <option value="users">Users</option>
                          <option value="funding">Funding</option>
                          <option value="profitability">Profitability</option>
                        </select>
                        <input
                          type="number"
                          value={milestone.targetMonth}
                          onChange={(e) => setMilestones(milestones.map(m => 
                            m.id === milestone.id ? { ...m, targetMonth: Number(e.target.value) } : m
                          ))}
                          placeholder="Month"
                          className="w-20 text-xs px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Target Amount</label>
                        <input
                          type="number"
                          value={milestone.targetAmount || ''}
                          onChange={(e) => setMilestones(milestones.map(m => 
                            m.id === milestone.id ? { ...m, targetAmount: Number(e.target.value) } : m
                          ))}
                          className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress: ${currentValue.toLocaleString()}</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              progress >= 100 ? 'bg-green-500' : 'bg-primary-500'
                            }`}
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Investment Rounds Planning */}
        {investmentRounds.length > 0 && (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary-500" />
              Investment Rounds Planning
            </h3>
            <div className="space-y-4">
              {investmentRounds.map((round) => {
                const projectionAtMonth = projections[round.month - 1]
                const postMoneyValuation = round.valuation + round.amount
                const preMoneyValuation = round.valuation
                
                return (
                  <div key={round.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="text-xs text-gray-600">Round Name</label>
                        <input
                          type="text"
                          value={round.name}
                          onChange={(e) => setInvestmentRounds(investmentRounds.map(r => 
                            r.id === round.id ? { ...r, name: e.target.value } : r
                          ))}
                          className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Amount ($)</label>
                        <input
                          type="number"
                          value={round.amount || ''}
                          onChange={(e) => {
                            const amount = Number(e.target.value)
                            const dilution = round.valuation > 0 ? (amount / (round.valuation + amount)) * 100 : 0
                            setInvestmentRounds(investmentRounds.map(r => 
                              r.id === round.id ? { ...r, amount, dilution } : r
                            ))
                          }}
                          className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Pre-Money Valuation ($)</label>
                        <input
                          type="number"
                          value={round.valuation || ''}
                          onChange={(e) => {
                            const valuation = Number(e.target.value)
                            const dilution = valuation > 0 ? (round.amount / (valuation + round.amount)) * 100 : 0
                            setInvestmentRounds(investmentRounds.map(r => 
                              r.id === round.id ? { ...r, valuation, dilution } : r
                            ))
                          }}
                          className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Month</label>
                        <input
                          type="number"
                          value={round.month}
                          onChange={(e) => setInvestmentRounds(investmentRounds.map(r => 
                            r.id === round.id ? { ...r, month: Number(e.target.value) } : r
                          ))}
                          className="w-full mt-1 px-3 py-2 border-2 border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => setInvestmentRounds(investmentRounds.filter(r => r.id !== round.id))}
                          className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md border-2 border-red-200"
                        >
                          <X className="h-4 w-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Post-Money Valuation:</span>
                        <p className="font-bold text-primary-600">${postMoneyValuation.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Dilution:</span>
                        <p className="font-bold">{round.dilution.toFixed(2)}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Cash After Round:</span>
                        <p className="font-bold text-green-600">
                          ${((projectionAtMonth?.cumulativeCashFlow || 0) + round.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Enhanced Unit Economics */}
        <Card className="mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary-500" />
            Unit Economics Calculator
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Average Order Value ($)</label>
              <input
                type="number"
                value={unitEconomics.averageOrderValue || ''}
                onChange={(e) => setUnitEconomics({ ...unitEconomics, averageOrderValue: Number(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Lifetime (months)</label>
              <input
                type="number"
                value={unitEconomics.customerLifetime}
                onChange={(e) => setUnitEconomics({ ...unitEconomics, customerLifetime: Number(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Churn Rate (%)</label>
              <input
                type="number"
                value={unitEconomics.monthlyChurnRate}
                onChange={(e) => setUnitEconomics({ ...unitEconomics, monthlyChurnRate: Number(e.target.value) })}
                step="0.1"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Per Acquisition ($)</label>
              <input
                type="number"
                value={unitEconomics.costPerAcquisition || ''}
                onChange={(e) => setUnitEconomics({ ...unitEconomics, costPerAcquisition: Number(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Per Unit ($)</label>
              <input
                type="number"
                value={unitEconomics.costPerUnit || ''}
                onChange={(e) => setUnitEconomics({ ...unitEconomics, costPerUnit: Number(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <div className="w-full bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <p className="text-xs text-gray-600 mb-1">LTV (Lifetime Value)</p>
                <p className="text-2xl font-bold text-primary-600">
                  ${(unitEconomics.averageOrderValue * unitEconomics.customerLifetime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          {unitEconomics.costPerAcquisition > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-1">LTV:CAC Ratio</p>
                <p className={`text-2xl font-bold ${
                  (unitEconomics.averageOrderValue * unitEconomics.customerLifetime) / unitEconomics.costPerAcquisition >= 3
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  {((unitEconomics.averageOrderValue * unitEconomics.customerLifetime) / unitEconomics.costPerAcquisition).toFixed(2)}:1
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Gross Margin per Unit</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${(unitEconomics.averageOrderValue - unitEconomics.costPerUnit).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Payback Period (months)</p>
                <p className="text-2xl font-bold text-purple-600">
                  {unitEconomics.averageOrderValue > 0 
                    ? (unitEconomics.costPerAcquisition / (unitEconomics.averageOrderValue * (1 - unitEconomics.monthlyChurnRate / 100))).toFixed(1)
                    : 0}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* AI Enhanced Link */}
        <Card className="mt-6 bg-gradient-to-br from-primary-500/10 to-primary-500/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-500" />
                AI Enhanced Version
              </h3>
              <p className="text-sm text-gray-600">
                Get AI-powered financial projections based on your industry and business model
              </p>
            </div>
            <Link href="/startup/financial-projections/enhanced">
              <Button size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Try AI Enhanced
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}
