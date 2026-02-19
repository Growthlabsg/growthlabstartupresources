'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Sparkles, 
  TrendingUp, 
  BarChart, 
  DollarSign, 
  Save,
  Download,
  Plus,
  Edit,
  Trash2,
  X,
  Target,
  AlertCircle,
  CheckCircle,
  Calendar,
  Percent,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FileText,
  Share2,
  Zap,
  TrendingDown,
  Activity,
  GitCompare,
  Wind,
  Flag,
  Briefcase,
  BarChart3,
  Coins,
  PieChart,
  LineChart,
  Calculator,
  Eye,
  Layers,
  Lightbulb
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
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
  growthRate: number
  category: 'product' | 'subscription' | 'service' | 'advertising' | 'other'
}

interface ExpenseCategory {
  id: string
  name: string
  monthlyAmount: number
  growthRate: number
  category: 'fixed' | 'variable'
  type: 'salaries' | 'marketing' | 'operations' | 'technology' | 'other'
}

interface MonthlyProjection {
  month: number
  monthName: string
  revenue: number
  expenses: number
  cashFlow: number
  cumulativeCashFlow: number
  burnRate: number
  runway: number
}

interface Scenario {
  id: string
  name: string
  revenueMultiplier: number
  expenseMultiplier: number
  growthRateAdjustment: number
}

interface AIInsight {
  id: string
  type: 'warning' | 'opportunity' | 'milestone' | 'recommendation'
  message: string
  month?: number
  priority: 'high' | 'medium' | 'low'
}

const defaultScenarios: Scenario[] = [
  { id: 'optimistic', name: 'Optimistic', revenueMultiplier: 1.2, expenseMultiplier: 0.9, growthRateAdjustment: 1.2 },
  { id: 'realistic', name: 'Realistic', revenueMultiplier: 1.0, expenseMultiplier: 1.0, growthRateAdjustment: 1.0 },
  { id: 'pessimistic', name: 'Pessimistic', revenueMultiplier: 0.8, expenseMultiplier: 1.1, growthRateAdjustment: 0.8 },
]

export default function EnhancedFinancialProjectionsPage() {
  const [activeTab, setActiveTab] = useState('projections')
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([])
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([])
  const [projections, setProjections] = useState<MonthlyProjection[]>([])
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(defaultScenarios[1])
  const [timeframe, setTimeframe] = useState(12)
  const [startingCash, setStartingCash] = useState(0)
  const [projectionName, setProjectionName] = useState('AI Financial Projections')
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [editingRevenue, setEditingRevenue] = useState<RevenueStream | null>(null)
  const [editingExpense, setEditingExpense] = useState<ExpenseCategory | null>(null)
  const [showAddRevenue, setShowAddRevenue] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [comparisonScenarios, setComparisonScenarios] = useState<Scenario[]>([])

  const tabs = [
    { id: 'projections', label: 'Projections', icon: TrendingUp },
    { id: 'revenue', label: 'Revenue Streams', icon: DollarSign },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'scenarios', label: 'Scenarios', icon: GitCompare },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aiFinancialProjectionsData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.revenueStreams) setRevenueStreams(data.revenueStreams)
          if (data.expenseCategories) setExpenseCategories(data.expenseCategories)
          if (data.startingCash !== undefined) setStartingCash(data.startingCash)
          if (data.timeframe) setTimeframe(data.timeframe)
          if (data.projectionName) setProjectionName(data.projectionName)
          if (data.selectedScenario) setSelectedScenario(data.selectedScenario)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        revenueStreams,
        expenseCategories,
        startingCash,
        timeframe,
        projectionName,
        selectedScenario,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('aiFinancialProjectionsData', JSON.stringify(data))
    }
  }

  const calculateProjections = () => {
    if (revenueStreams.length === 0 && expenseCategories.length === 0) {
      showToast('Please add at least one revenue stream or expense category', 'error')
      return
    }

    const proj: MonthlyProjection[] = []
    let cumulativeCash = startingCash
    let currentMonth = new Date().getMonth()
    let currentYear = new Date().getFullYear()

    for (let i = 0; i < timeframe; i++) {
      const monthIndex = (currentMonth + i) % 12
      const year = currentYear + Math.floor((currentMonth + i) / 12)

      // Calculate revenue
      let totalRevenue = 0
      revenueStreams.forEach(stream => {
        const baseAmount = stream.monthlyAmount
        const growthFactor = Math.pow(1 + (stream.growthRate * selectedScenario.growthRateAdjustment) / 100, i)
        totalRevenue += baseAmount * growthFactor * selectedScenario.revenueMultiplier
      })

      // Calculate expenses
      let totalExpenses = 0
      expenseCategories.forEach(expense => {
        const baseAmount = expense.monthlyAmount
        const growthFactor = Math.pow(1 + (expense.growthRate * selectedScenario.growthRateAdjustment) / 100, i)
        totalExpenses += baseAmount * growthFactor * selectedScenario.expenseMultiplier
      })

      const cashFlow = totalRevenue - totalExpenses
      cumulativeCash += cashFlow
      const burnRate = totalExpenses - totalRevenue
      const runway = totalExpenses > 0 ? cumulativeCash / totalExpenses : 0

      proj.push({
        month: i + 1,
        monthName: `${monthNames[monthIndex]} ${year}`,
        revenue: totalRevenue,
        expenses: totalExpenses,
        cashFlow,
        cumulativeCashFlow: cumulativeCash,
        burnRate: burnRate > 0 ? burnRate : 0,
        runway: runway > 0 ? runway : 0
      })
    }

    setProjections(proj)
    generateAIInsights(proj)
    saveToLocalStorage()
    showToast('AI-powered projections calculated!', 'success')
  }

  const generateAIInsights = (proj: MonthlyProjection[]) => {
    const insights: AIInsight[] = []

    // Check for cash flow issues
    const negativeCashFlowMonths = proj.filter(p => p.cashFlow < 0)
    if (negativeCashFlowMonths.length > 0) {
      insights.push({
        id: '1',
        type: 'warning',
        message: `Negative cash flow detected in ${negativeCashFlowMonths.length} months. Consider reducing expenses or increasing revenue.`,
        priority: 'high'
      })
    }

    // Check for runway
    const lowRunwayMonths = proj.filter(p => p.runway > 0 && p.runway < 6)
    if (lowRunwayMonths.length > 0) {
      insights.push({
        id: '2',
        type: 'warning',
        message: `Runway drops below 6 months in month ${lowRunwayMonths[0].month}. Consider fundraising or cost reduction.`,
        month: lowRunwayMonths[0].month,
        priority: 'high'
      })
    }

    // Check for profitability
    const breakEvenMonth = proj.findIndex(p => p.cashFlow > 0)
    if (breakEvenMonth !== -1) {
      insights.push({
        id: '3',
        type: 'milestone',
        message: `Projected break-even point reached in ${proj[breakEvenMonth].monthName}`,
        month: breakEvenMonth + 1,
        priority: 'medium'
      })
    }

    // Check for growth opportunities
    if (revenueStreams.length < 3) {
      insights.push({
        id: '4',
        type: 'opportunity',
        message: 'Consider diversifying revenue streams to reduce risk and increase growth potential.',
        priority: 'medium'
      })
    }

    // Check expense growth
    const avgExpenseGrowth = expenseCategories.reduce((sum, e) => sum + e.growthRate, 0) / expenseCategories.length
    const avgRevenueGrowth = revenueStreams.reduce((sum, r) => sum + r.growthRate, 0) / revenueStreams.length
    if (avgExpenseGrowth > avgRevenueGrowth) {
      insights.push({
        id: '5',
        type: 'warning',
        message: 'Expense growth rate exceeds revenue growth rate. This may impact profitability.',
        priority: 'high'
      })
    }

    // Revenue milestone
    const revenueMilestones = [10000, 50000, 100000, 500000, 1000000]
    revenueMilestones.forEach(milestone => {
      const milestoneMonth = proj.findIndex(p => p.revenue >= milestone)
      if (milestoneMonth !== -1 && !insights.find(i => i.message.includes(`$${milestone.toLocaleString()}`))) {
        insights.push({
          id: `milestone-${milestone}`,
          type: 'milestone',
          message: `Projected to reach $${milestone.toLocaleString()}/month revenue in ${proj[milestoneMonth].monthName}`,
          month: milestoneMonth + 1,
          priority: 'low'
        })
      }
    })

    setAiInsights(insights)
  }

  const addRevenueStream = () => {
    const newStream: RevenueStream = {
      id: Date.now().toString(),
      name: '',
      monthlyAmount: 0,
      growthRate: 5,
      category: 'product'
    }
    setEditingRevenue(newStream)
    setShowAddRevenue(true)
  }

  const saveRevenueStream = () => {
    if (!editingRevenue || !editingRevenue.name) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const existing = revenueStreams.find(r => r.id === editingRevenue.id)
    if (existing) {
      setRevenueStreams(revenueStreams.map(r => r.id === editingRevenue.id ? editingRevenue : r))
      showToast('Revenue stream updated!', 'success')
    } else {
      setRevenueStreams([...revenueStreams, editingRevenue])
      showToast('Revenue stream added!', 'success')
    }

    setEditingRevenue(null)
    setShowAddRevenue(false)
    saveToLocalStorage()
  }

  const addExpenseCategory = () => {
    const newExpense: ExpenseCategory = {
      id: Date.now().toString(),
      name: '',
      monthlyAmount: 0,
      growthRate: 2,
      category: 'fixed',
      type: 'operations'
    }
    setEditingExpense(newExpense)
    setShowAddExpense(true)
  }

  const saveExpenseCategory = () => {
    if (!editingExpense || !editingExpense.name) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const existing = expenseCategories.find(e => e.id === editingExpense.id)
    if (existing) {
      setExpenseCategories(expenseCategories.map(e => e.id === editingExpense.id ? editingExpense : e))
      showToast('Expense category updated!', 'success')
    } else {
      setExpenseCategories([...expenseCategories, editingExpense])
      showToast('Expense category added!', 'success')
    }

    setEditingExpense(null)
    setShowAddExpense(false)
    saveToLocalStorage()
  }

  const exportData = () => {
    const data = {
      projectionName,
      revenueStreams,
      expenseCategories,
      projections,
      selectedScenario,
      timeframe,
      startingCash,
      aiInsights,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-financial-projections-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  const exportToCSV = () => {
    if (projections.length === 0) {
      showToast('No projections to export', 'error')
      return
    }

    const headers = ['Month', 'Month Name', 'Revenue', 'Expenses', 'Cash Flow', 'Cumulative Cash Flow', 'Burn Rate', 'Runway (Months)']
    const rows = projections.map(p => [
      p.month,
      p.monthName,
      p.revenue.toFixed(2),
      p.expenses.toFixed(2),
      p.cashFlow.toFixed(2),
      p.cumulativeCashFlow.toFixed(2),
      p.burnRate.toFixed(2),
      p.runway.toFixed(2)
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial-projections-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('CSV exported successfully', 'success')
  }

  const totalRevenue = revenueStreams.reduce((sum, r) => sum + r.monthlyAmount, 0)
  const totalExpenses = expenseCategories.reduce((sum, e) => sum + e.monthlyAmount, 0)
  const netCashFlow = totalRevenue - totalExpenses
  const breakEvenMonth = projections.findIndex(p => p.cashFlow > 0)
  const avgMonthlyGrowth = revenueStreams.length > 0
    ? revenueStreams.reduce((sum, r) => sum + r.growthRate, 0) / revenueStreams.length
    : 0

  const projectionChartData = projections.map(p => ({
    month: p.monthName,
    revenue: Math.round(p.revenue),
    expenses: Math.round(p.expenses),
    cashFlow: Math.round(p.cashFlow),
    cumulative: Math.round(p.cumulativeCashFlow)
  }))

  const revenueBreakdown = revenueStreams.map(r => ({
    name: r.name,
    value: r.monthlyAmount
  }))

  const expenseBreakdown = expenseCategories.map(e => ({
    name: e.name,
    value: e.monthlyAmount
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                AI-Powered Financial Projections
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate intelligent financial projections with AI-driven insights, scenario modeling, and advanced analytics.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={exportToCSV} className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportData} className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
        </div>

        {/* Projections Tab */}
        {activeTab === 'projections' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                <div className="text-2xl font-bold text-green-600">
                  ${totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">per month</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
                <div className="text-2xl font-bold text-red-600">
                  ${totalExpenses.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">per month</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Net Cash Flow</div>
                <div className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netCashFlow.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">per month</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Avg Growth Rate</div>
                <div className="text-2xl font-bold text-primary-600">
                  {avgMonthlyGrowth.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">monthly</div>
              </Card>
            </div>

          <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Financial Projections</h2>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedScenario.id}
                    onChange={(e) => {
                      const scenario = defaultScenarios.find(s => s.id === e.target.value)
                      if (scenario) setSelectedScenario(scenario)
                    }}
                    options={defaultScenarios.map(s => ({ value: s.id, label: s.name }))}
                  />
                  <Select
                    value={timeframe.toString()}
                    onChange={(e) => setTimeframe(parseInt(e.target.value))}
                    options={[
                      { value: '12', label: '12 Months' },
                      { value: '24', label: '24 Months' },
                      { value: '36', label: '36 Months' },
                      { value: '48', label: '48 Months' },
                      { value: '60', label: '60 Months' },
                    ]}
                  />
                  <Button onClick={calculateProjections} size="sm" className="shrink-0">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Starting Cash</label>
                  <Input
                  type="number"
                    value={startingCash}
                    onChange={(e) => setStartingCash(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Projection Name</label>
                  <Input
                    value={projectionName}
                    onChange={(e) => setProjectionName(e.target.value)}
                    placeholder="Projection name"
                  />
                </div>
              </div>

              {projections.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <h3 className="font-semibold mb-4">Revenue & Expenses</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={projectionChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                          <Legend />
                          <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                          <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </Card>

                    <Card>
                      <h3 className="font-semibold mb-4">Cash Flow Trend</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={projectionChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                          <Area type="monotone" dataKey="cashFlow" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Cash Flow" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>

                  <Card>
                    <h3 className="font-semibold mb-4">Monthly Projections</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Month</th>
                            <th className="text-right p-2">Revenue</th>
                            <th className="text-right p-2">Expenses</th>
                            <th className="text-right p-2">Cash Flow</th>
                            <th className="text-right p-2">Cumulative</th>
                            <th className="text-right p-2">Runway</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projections.map((proj) => (
                            <tr key={proj.month} className="border-b hover:bg-gray-50">
                              <td className="p-2 font-medium">{proj.monthName}</td>
                              <td className="p-2 text-right text-green-600">${proj.revenue.toLocaleString()}</td>
                              <td className="p-2 text-right text-red-600">${proj.expenses.toLocaleString()}</td>
                              <td className={`p-2 text-right font-medium ${proj.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${proj.cashFlow.toLocaleString()}
                              </td>
                              <td className={`p-2 text-right ${proj.cumulativeCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${proj.cumulativeCashFlow.toLocaleString()}
                              </td>
                              <td className="p-2 text-right">
                                {proj.runway > 0 ? `${proj.runway.toFixed(1)}m` : 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {breakEvenMonth !== -1 && (
                    <Card className="p-4 bg-green-50">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">Break-Even Projection</p>
                          <p className="text-sm text-green-700">
                            Projected to reach break-even in {projections[breakEvenMonth].monthName}
                          </p>
              </div>
            </div>
          </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Projections Yet</h3>
                  <p className="text-gray-600 mb-6">Add revenue streams and expenses, then generate AI-powered projections</p>
                  <Button onClick={calculateProjections}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Projections
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Revenue Streams Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
          <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Revenue Streams</h2>
                </div>
                <Button onClick={addRevenueStream} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stream
                </Button>
              </div>

              {revenueStreams.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Revenue Streams</h3>
                  <p className="text-gray-600 mb-6">Add your revenue streams to build accurate projections</p>
                  <Button onClick={addRevenueStream}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Stream
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {revenueStreams.map((stream) => (
                    <Card key={stream.id} className="p-4">
                      <div className="flex items-start justify-between">
              <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{stream.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {stream.category}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {stream.growthRate}% growth
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Monthly:</span> ${stream.monthlyAmount.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Annual:</span> ${(stream.monthlyAmount * 12).toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Growth:</span> {stream.growthRate}%/mo
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingRevenue(stream)
                              setShowAddRevenue(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRevenueStreams(revenueStreams.filter(r => r.id !== stream.id))
                              saveToLocalStorage()
                              showToast('Revenue stream deleted', 'success')
                            }}
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

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Expense Categories</h2>
                </div>
                <Button onClick={addExpenseCategory} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {expenseCategories.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingDown className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Expense Categories</h3>
                  <p className="text-gray-600 mb-6">Add your expense categories to build accurate projections</p>
                  <Button onClick={addExpenseCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Category
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {expenseCategories.map((expense) => (
                    <Card key={expense.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{expense.name}</h4>
                            <Badge className={`text-xs ${expense.category === 'fixed' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                              {expense.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {expense.type}
                            </Badge>
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              {expense.growthRate}% growth
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Monthly:</span> ${expense.monthlyAmount.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Annual:</span> ${(expense.monthlyAmount * 12).toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Growth:</span> {expense.growthRate}%/mo
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingExpense(expense)
                              setShowAddExpense(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setExpenseCategories(expenseCategories.filter(e => e.id !== expense.id))
                              saveToLocalStorage()
                              showToast('Expense category deleted', 'success')
                            }}
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

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
          <Card>
              <div className="flex items-center gap-3 mb-6">
                <GitCompare className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Scenario Modeling</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {defaultScenarios.map((scenario) => (
                  <Card
                    key={scenario.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedScenario.id === scenario.id ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <div onClick={() => {
                      setSelectedScenario(scenario)
                      saveToLocalStorage()
                    }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{scenario.name}</h3>
                      {selectedScenario.id === scenario.id && (
                        <CheckCircle className="h-5 w-5 text-primary-500" />
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Revenue:</span> {scenario.revenueMultiplier > 1 ? '+' : ''}{((scenario.revenueMultiplier - 1) * 100).toFixed(0)}%
                      </div>
                      <div>
                        <span className="font-medium">Expenses:</span> {scenario.expenseMultiplier > 1 ? '+' : ''}{((scenario.expenseMultiplier - 1) * 100).toFixed(0)}%
                      </div>
                      <div>
                        <span className="font-medium">Growth:</span> {scenario.growthRateAdjustment > 1 ? '+' : ''}{((scenario.growthRateAdjustment - 1) * 100).toFixed(0)}%
                      </div>
                    </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Current Scenario:</strong> {selectedScenario.name} - 
                  Revenue multiplier: {selectedScenario.revenueMultiplier}x, 
                  Expense multiplier: {selectedScenario.expenseMultiplier}x, 
                  Growth adjustment: {selectedScenario.growthRateAdjustment}x
                </p>
            </div>
          </Card>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
              </div>

              {aiInsights.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Generate projections to see AI-powered insights</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiInsights
                    .sort((a, b) => {
                      const priorityOrder = { high: 3, medium: 2, low: 1 }
                      return priorityOrder[b.priority] - priorityOrder[a.priority]
                    })
                    .map((insight) => {
                      const typeColors = {
                        warning: 'bg-red-50 border-red-200',
                        opportunity: 'bg-blue-50 border-blue-200',
                        milestone: 'bg-green-50 border-green-200',
                        recommendation: 'bg-yellow-50 border-yellow-200'
                      }

                      const typeIcons = {
                        warning: AlertCircle,
                        opportunity: TrendingUp,
                        milestone: Target,
                        recommendation: Lightbulb
                      }

                      const Icon = typeIcons[insight.type] || AlertCircle

                      return (
                        <Card key={insight.id} className={`p-4 border-2 ${typeColors[insight.type]}`}>
                          <div className="flex items-start gap-3">
                            <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${
                              insight.type === 'warning' ? 'text-red-600' :
                              insight.type === 'opportunity' ? 'text-blue-600' :
                              insight.type === 'milestone' ? 'text-green-600' :
                              'text-yellow-600'
                            }`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium capitalize">{insight.type}</span>
                                <Badge className={`text-xs ${
                                  insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {insight.priority}
                                </Badge>
                                {insight.month && (
                                  <Badge variant="outline" className="text-xs">
                                    Month {insight.month}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-700">{insight.message}</p>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {revenueBreakdown.length > 0 && (
                <Card>
                  <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={revenueBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => percent ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {expenseBreakdown.length > 0 && (
                <Card>
                  <h3 className="font-semibold mb-4">Expense Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => percent ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Card>
              )}
        </div>

            {projections.length > 0 && (
        <Card>
                <h3 className="font-semibold mb-4">Cumulative Cash Flow</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={projectionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="cumulative" stroke="#3b82f6" strokeWidth={2} name="Cumulative Cash Flow" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* Add/Edit Revenue Stream Modal */}
        {showAddRevenue && editingRevenue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Revenue Stream</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowAddRevenue(false)
                  setEditingRevenue(null)
                }} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <Input
                    value={editingRevenue.name}
                    onChange={(e) => setEditingRevenue({ ...editingRevenue, name: e.target.value })}
                    placeholder="e.g., Product Sales"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Amount *</label>
                    <Input
                      type="number"
                      value={editingRevenue.monthlyAmount || ''}
                      onChange={(e) => setEditingRevenue({ ...editingRevenue, monthlyAmount: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Growth Rate (%/month)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingRevenue.growthRate || ''}
                      onChange={(e) => setEditingRevenue({ ...editingRevenue, growthRate: parseFloat(e.target.value) || 0 })}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select
                    value={editingRevenue.category}
                    onChange={(e) => setEditingRevenue({ ...editingRevenue, category: e.target.value as RevenueStream['category'] })}
                    options={[
                      { value: 'product', label: 'Product' },
                      { value: 'subscription', label: 'Subscription' },
                      { value: 'service', label: 'Service' },
                      { value: 'advertising', label: 'Advertising' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                </div>
            <div className="flex gap-2">
                  <Button onClick={saveRevenueStream} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Stream
              </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddRevenue(false)
                    setEditingRevenue(null)
                  }}>
                    Cancel
              </Button>
            </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add/Edit Expense Category Modal */}
        {showAddExpense && editingExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Expense Category</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowAddExpense(false)
                  setEditingExpense(null)
                }} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <Input
                    value={editingExpense.name}
                    onChange={(e) => setEditingExpense({ ...editingExpense, name: e.target.value })}
                    placeholder="e.g., Salaries & Benefits"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Amount *</label>
                    <Input
                      type="number"
                      value={editingExpense.monthlyAmount || ''}
                      onChange={(e) => setEditingExpense({ ...editingExpense, monthlyAmount: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Growth Rate (%/month)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingExpense.growthRate || ''}
                      onChange={(e) => setEditingExpense({ ...editingExpense, growthRate: parseFloat(e.target.value) || 0 })}
                      placeholder="2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Select
                      value={editingExpense.category}
                      onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value as ExpenseCategory['category'] })}
                      options={[
                        { value: 'fixed', label: 'Fixed' },
                        { value: 'variable', label: 'Variable' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Select
                      value={editingExpense.type}
                      onChange={(e) => setEditingExpense({ ...editingExpense, type: e.target.value as ExpenseCategory['type'] })}
                      options={[
                        { value: 'salaries', label: 'Salaries' },
                        { value: 'marketing', label: 'Marketing' },
                        { value: 'operations', label: 'Operations' },
                        { value: 'technology', label: 'Technology' },
                        { value: 'other', label: 'Other' },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveExpenseCategory} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Category
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddExpense(false)
                    setEditingExpense(null)
                  }}>
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
