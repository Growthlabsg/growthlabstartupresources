'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  TrendingUp, 
  Calendar,
  Save,
  Download,
  Share2,
  Sparkles,
  DollarSign,
  TrendingDown,
  BarChart3,
  History,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  Target,
  PieChart,
  Clock
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts'

type ExpenseCategory = 'salaries' | 'office' | 'marketing' | 'product' | 'legal' | 'other'

interface Expense {
  id: string
  category: ExpenseCategory
  description: string
  amount: number
  date: string
  recurring: boolean
}

interface BurnRatePeriod {
  id: string
  name: string
  startDate: string
  endDate: string
  startingCash: number
  endingCash: number
  revenue: number
  expenses: Expense[]
  grossBurn: number
  netBurn: number
  runway: number
  notes?: string
}

interface Scenario {
  id: string
  name: string
  currentCash: number
  monthlyBurn: number
  monthlyRevenue: number
  months: number
  projectedCash: number[]
  projectedRunway: number[]
}

export default function BurnRateCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [startingCash, setStartingCash] = useState('')
  const [endingCash, setEndingCash] = useState('')
  const [revenue, setRevenue] = useState('0')
  const [months, setMonths] = useState('1')
  const [burnRate, setBurnRate] = useState<number | null>(null)
  const [netBurnRate, setNetBurnRate] = useState<number | null>(null)
  const [runway, setRunway] = useState<number | null>(null)
  const [periods, setPeriods] = useState<BurnRatePeriod[]>([])
  const [editingPeriod, setEditingPeriod] = useState<BurnRatePeriod | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null)
  const [currentCash, setCurrentCash] = useState('')

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'periods', label: 'Periods', icon: Calendar },
    { id: 'scenarios', label: 'Scenarios', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('burnRateCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.periods) setPeriods(data.periods)
          if (data.expenses) setExpenses(data.expenses)
          if (data.scenarios) setScenarios(data.scenarios)
          if (data.currentCash) setCurrentCash(data.currentCash)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        periods,
        expenses,
        scenarios,
        currentCash,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('burnRateCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const calculate = () => {
    const start = parseFloat(startingCash)
    const end = parseFloat(endingCash)
    const rev = parseFloat(revenue) || 0
    const monthCount = parseFloat(months)
    
    if (!start || !end || !monthCount) {
      showToast('Please enter all required values', 'error')
      return
    }

    const grossBurn = (start - end) / monthCount
    const netBurn = grossBurn - (rev / monthCount)
    const calculatedRunway = end / grossBurn
    
    setBurnRate(grossBurn)
    setNetBurnRate(netBurn)
    setRunway(calculatedRunway)
    showToast('Burn rate calculated!', 'success')
  }

  const addExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      category: 'other',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      recurring: false
    }
    setEditingExpense(newExpense)
  }

  const saveExpense = () => {
    if (!editingExpense) return
    if (!editingExpense.description || editingExpense.amount <= 0) {
      showToast('Please enter description and amount', 'error')
      return
    }

    const updated = expenses.find(e => e.id === editingExpense.id)
      ? expenses.map(e => e.id === editingExpense.id ? editingExpense : e)
      : [...expenses, editingExpense]

    setExpenses(updated)
    setEditingExpense(null)
    saveToLocalStorage()
    showToast('Expense saved!', 'success')
  }

  const deleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      const updated = expenses.filter(e => e.id !== id)
      setExpenses(updated)
      saveToLocalStorage()
      showToast('Expense deleted', 'info')
    }
  }

  const addPeriod = () => {
    const newPeriod: BurnRatePeriod = {
      id: Date.now().toString(),
      name: 'New Period',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startingCash: 0,
      endingCash: 0,
      revenue: 0,
      expenses: [],
      grossBurn: 0,
      netBurn: 0,
      runway: 0
    }
    setEditingPeriod(newPeriod)
  }

  const savePeriod = () => {
    if (!editingPeriod) return
    if (!editingPeriod.name || editingPeriod.startingCash <= 0 || editingPeriod.endingCash < 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const daysDiff = Math.floor((new Date(editingPeriod.endDate).getTime() - new Date(editingPeriod.startDate).getTime()) / (1000 * 60 * 60 * 24))
    const monthsDiff = daysDiff / 30
    const totalExpenses = editingPeriod.expenses.reduce((sum, e) => sum + e.amount, 0)
    const grossBurn = (editingPeriod.startingCash - editingPeriod.endingCash) / monthsDiff
    const netBurn = grossBurn - (editingPeriod.revenue / monthsDiff)
    const runway = editingPeriod.endingCash / grossBurn

    const updatedPeriod = {
      ...editingPeriod,
      grossBurn,
      netBurn,
      runway
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

  const createScenario = () => {
    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: 'New Scenario',
      currentCash: parseFloat(currentCash) || 0,
      monthlyBurn: burnRate || 0,
      monthlyRevenue: parseFloat(revenue) || 0,
      months: 12,
      projectedCash: [],
      projectedRunway: []
    }
    calculateScenario(newScenario)
    setEditingScenario(newScenario)
  }

  const calculateScenario = (scenario: Scenario) => {
    const projectedCash: number[] = []
    const projectedRunway: number[] = []
    let cash = scenario.currentCash

    for (let i = 0; i < scenario.months; i++) {
      cash = cash - scenario.monthlyBurn + scenario.monthlyRevenue
      projectedCash.push(Math.max(0, cash))
      projectedRunway.push(cash > 0 ? cash / scenario.monthlyBurn : 0)
    }

    scenario.projectedCash = projectedCash
    scenario.projectedRunway = projectedRunway
  }

  const saveScenario = () => {
    if (!editingScenario) return
    if (!editingScenario.name || editingScenario.monthlyBurn <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    calculateScenario(editingScenario)
    const updated = scenarios.find(s => s.id === editingScenario.id)
      ? scenarios.map(s => s.id === editingScenario.id ? editingScenario : s)
      : [...scenarios, editingScenario]

    setScenarios(updated)
    setEditingScenario(null)
    saveToLocalStorage()
    showToast('Scenario saved!', 'success')
  }

  const exportData = () => {
    const data = {
      currentCalculation: {
        startingCash: parseFloat(startingCash) || 0,
        endingCash: parseFloat(endingCash) || 0,
        revenue: parseFloat(revenue) || 0,
        months: parseFloat(months) || 0,
        burnRate,
        netBurnRate,
        runway
      },
      periods,
      expenses,
      scenarios,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `burn-rate-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported!', 'success')
  }

  const expenseByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<ExpenseCategory, number>)

  const categoryColors: Record<ExpenseCategory, string> = {
    salaries: '#10b981',
    office: '#3b82f6',
    marketing: '#f59e0b',
    product: '#8b5cf6',
    legal: '#ec4899',
    other: '#6b7280'
  }

  const categoryLabels: Record<ExpenseCategory, string> = {
    salaries: 'Salaries',
    office: 'Office & Rent',
    marketing: 'Marketing',
    product: 'Product & Development',
    legal: 'Legal & Accounting',
    other: 'Other'
  }

  const burnRateHistory = periods.map(p => ({
    name: p.name,
    grossBurn: p.grossBurn,
    netBurn: p.netBurn,
    month: new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }))

  const scenarioChartData = editingScenario ? editingScenario.projectedCash.map((cash, index) => ({
    month: `Month ${index + 1}`,
    cash: Math.max(0, cash),
    runway: editingScenario.projectedRunway[index]
  })) : []

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Burn Rate Calculator
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track burn rate, manage expenses, and project runway to plan funding needs
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
                <div className="text-sm text-gray-600 mb-1">Gross Burn Rate</div>
                <div className="text-2xl font-bold text-red-600">
                  {burnRate !== null ? `$${(burnRate / 1000).toFixed(0)}K` : '$0'}
                </div>
                <div className="text-xs text-gray-500 mt-1">per month</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Net Burn Rate</div>
                <div className="text-2xl font-bold text-orange-600">
                  {netBurnRate !== null ? `$${(netBurnRate / 1000).toFixed(0)}K` : '$0'}
                </div>
                <div className="text-xs text-gray-500 mt-1">per month</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Runway</div>
                <div className="text-2xl font-bold text-primary-600">
                  {runway !== null ? `${runway.toFixed(1)}` : '0'} months
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {runway !== null && runway < 6 && <span className="text-red-600">⚠️ Low</span>}
                  {runway !== null && runway >= 6 && runway < 12 && <span className="text-yellow-600">⚠️ Moderate</span>}
                  {runway !== null && runway >= 12 && <span className="text-green-600">✅ Good</span>}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Current Cash</div>
                <div className="text-2xl font-bold">
                  {endingCash ? `$${(parseFloat(endingCash) / 1000).toFixed(0)}K` : '$0'}
                </div>
                <div className="text-xs text-gray-500 mt-1">ending balance</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary-500" />
                  Burn Rate Calculator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Starting Cash ($) *</label>
                    <Input
                      type="number"
                      value={startingCash}
                      onChange={(e) => setStartingCash(e.target.value)}
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ending Cash ($) *</label>
                    <Input
                      type="number"
                      value={endingCash}
                      onChange={(e) => setEndingCash(e.target.value)}
                      placeholder="80000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Revenue ($)</label>
                    <Input
                      type="number"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total revenue during period</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (months) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={months}
                      onChange={(e) => setMonths(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <Button onClick={calculate} className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Calculate Burn Rate
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary-500" />
                  About Burn Rate
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Gross Burn Rate</strong> is the total amount of cash your company spends per month.
                  </p>
                  <p>
                    <strong>Net Burn Rate</strong> is gross burn minus revenue (actual cash outflow).
                  </p>
                  <p>
                    <strong>Runway</strong> is how many months you can operate with current cash at current burn rate.
                  </p>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-yellow-900 mb-1">Best Practices</div>
                        <ul className="text-xs text-yellow-800 space-y-1">
                          <li>• Maintain 12+ months runway</li>
                          <li>• Start fundraising 6 months before running out</li>
                          <li>• Track both gross and net burn</li>
                          <li>• Monitor burn rate trends monthly</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Expense Tracking</h2>
                </div>
                <Button onClick={addExpense} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>

              {expenses.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <DollarSign className="h-16 w-16 mx-auto mb-4" />
                  <p>No expenses yet. Add your first expense to start tracking.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
                      <div className="text-2xl font-bold">
                        ${(expenses.reduce((sum, e) => sum + e.amount, 0) / 1000).toFixed(0)}K
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Monthly Average</div>
                      <div className="text-2xl font-bold">
                        ${(expenses.reduce((sum, e) => sum + (e.recurring ? e.amount : 0), 0) / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-500 mt-1">recurring expenses</div>
                    </Card>
                  </div>

                  <div className="space-y-3 mb-6">
                    {expenses.map((expense) => (
                      <Card key={expense.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{expense.description}</h4>
                              <Badge variant="outline" className="text-xs">{categoryLabels[expense.category]}</Badge>
                              {expense.recurring && (
                                <Badge variant="beginner" className="text-xs">Recurring</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              ${expense.amount.toLocaleString()} • {new Date(expense.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingExpense(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteExpense(expense.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <h3 className="font-semibold mb-4">Expenses by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={Object.entries(expenseByCategory).map(([category, value]) => ({
                            name: categoryLabels[category as ExpenseCategory],
                            value
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {Object.entries(expenseByCategory).map(([category], index) => (
                            <Cell key={`cell-${index}`} fill={categoryColors[category as ExpenseCategory]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </Card>
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
                  <h2 className="text-2xl font-bold">Burn Rate Periods</h2>
                </div>
                <Button onClick={addPeriod} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Period
                </Button>
              </div>

              {periods.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="h-16 w-16 mx-auto mb-4" />
                  <p>No periods yet. Create your first period to track burn rate over time.</p>
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
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Gross Burn:</span> ${(period.grossBurn / 1000).toFixed(0)}K/mo
                            </div>
                            <div>
                              <span className="font-medium">Net Burn:</span> ${(period.netBurn / 1000).toFixed(0)}K/mo
                            </div>
                            <div>
                              <span className="font-medium">Runway:</span> {period.runway.toFixed(1)} months
                            </div>
                            <div>
                              <span className="font-medium">Revenue:</span> ${(period.revenue / 1000).toFixed(0)}K
                            </div>
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

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Scenario Planning</h2>
                </div>
                <Button onClick={createScenario} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Scenario
                </Button>
              </div>

              {scenarios.length === 0 && !editingScenario ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No scenarios yet. Create a scenario to project future cash flow.</p>
                </div>
              ) : (
                <>
                  {scenarios.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {scenarios.map((scenario) => (
                        <Card key={scenario.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{scenario.name}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Monthly Burn:</span> ${(scenario.monthlyBurn / 1000).toFixed(0)}K
                                </div>
                                <div>
                                  <span className="font-medium">Monthly Revenue:</span> ${(scenario.monthlyRevenue / 1000).toFixed(0)}K
                                </div>
                                <div>
                                  <span className="font-medium">Projected Cash:</span> ${(scenario.projectedCash[scenario.projectedCash.length - 1] / 1000).toFixed(0)}K
                                </div>
                                <div>
                                  <span className="font-medium">Months:</span> {scenario.months}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingScenario(scenario)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
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
                            placeholder="e.g., Current Plan"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Cash ($) *</label>
                            <Input
                              type="number"
                              value={editingScenario.currentCash}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const updated = { ...editingScenario, currentCash: val }
                                calculateScenario(updated)
                                setEditingScenario(updated)
                              }}
                              placeholder="100000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Burn ($) *</label>
                            <Input
                              type="number"
                              value={editingScenario.monthlyBurn}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const updated = { ...editingScenario, monthlyBurn: val }
                                calculateScenario(updated)
                                setEditingScenario(updated)
                              }}
                              placeholder="20000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Revenue ($)</label>
                            <Input
                              type="number"
                              value={editingScenario.monthlyRevenue}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const updated = { ...editingScenario, monthlyRevenue: val }
                                calculateScenario(updated)
                                setEditingScenario(updated)
                              }}
                              placeholder="5000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Projection Period (months) *</label>
                            <Input
                              type="number"
                              value={editingScenario.months}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 12
                                const updated = { ...editingScenario, months: val }
                                calculateScenario(updated)
                                setEditingScenario(updated)
                              }}
                              placeholder="12"
                            />
                          </div>
                        </div>
                        {scenarioChartData.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">Projection Chart</h4>
                            <ResponsiveContainer width="100%" height={300}>
                              <AreaChart data={scenarioChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="cash" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Cash Balance" />
                                <Line type="monotone" dataKey="runway" stroke="#10b981" name="Runway (months)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        )}
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Average Gross Burn</div>
                <div className="text-2xl font-bold">
                  {periods.length > 0 
                    ? `$${(periods.reduce((sum, p) => sum + p.grossBurn, 0) / periods.length / 1000).toFixed(0)}K`
                    : '$0'}
                </div>
                <div className="text-xs text-gray-500 mt-1">per month</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Average Net Burn</div>
                <div className="text-2xl font-bold">
                  {periods.length > 0 
                    ? `$${(periods.reduce((sum, p) => sum + p.netBurn, 0) / periods.length / 1000).toFixed(0)}K`
                    : '$0'}
                </div>
                <div className="text-xs text-gray-500 mt-1">per month</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
                <div className="text-2xl font-bold">
                  ${(expenses.reduce((sum, e) => sum + e.amount, 0) / 1000).toFixed(0)}K
                </div>
              </Card>
            </div>

            {burnRateHistory.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Burn Rate Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={burnRateHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="grossBurn" stroke="#ef4444" name="Gross Burn" />
                    <Line type="monotone" dataKey="netBurn" stroke="#f59e0b" name="Net Burn" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {Object.keys(expenseByCategory).length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Expenses by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(expenseByCategory).map(([category, value]) => ({
                    category: categoryLabels[category as ExpenseCategory],
                    amount: value
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#3b82f6" />
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
                <History className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Calculation History</h2>
              </div>
              {periods.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No history yet. Create periods to track burn rate over time.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {periods.map((period) => (
                    <Card key={period.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{period.name}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(period.grossBurn / 1000).toFixed(0)}K/mo</p>
                          <p className="text-xs text-gray-600">Runway: {period.runway.toFixed(1)} months</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Edit Expense Modal */}
        {editingExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Expense</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingExpense(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <Input
                    value={editingExpense.description}
                    onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                    placeholder="e.g., Office Rent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($) *</label>
                    <Input
                      type="number"
                      value={editingExpense.amount}
                      onChange={(e) => setEditingExpense({ ...editingExpense, amount: parseFloat(e.target.value) || 0 })}
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <Select
                      value={editingExpense.category}
                      onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value as ExpenseCategory })}
                      options={[
                        { value: 'salaries', label: 'Salaries' },
                        { value: 'office', label: 'Office & Rent' },
                        { value: 'marketing', label: 'Marketing' },
                        { value: 'product', label: 'Product & Development' },
                        { value: 'legal', label: 'Legal & Accounting' },
                        { value: 'other', label: 'Other' }
                      ]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <Input
                      type="date"
                      value={editingExpense.date}
                      onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    <input
                      type="checkbox"
                      checked={editingExpense.recurring}
                      onChange={(e) => setEditingExpense({ ...editingExpense, recurring: e.target.checked })}
                      className="rounded"
                    />
                    <label className="text-sm text-gray-700">Recurring expense</label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveExpense} className="flex-1">
                    Save Expense
                  </Button>
                  <Button variant="outline" onClick={() => setEditingExpense(null)}>
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
            <Card className="max-w-2xl w-full my-8">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Starting Cash ($) *</label>
                    <Input
                      type="number"
                      value={editingPeriod.startingCash}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, startingCash: parseFloat(e.target.value) || 0 })}
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ending Cash ($) *</label>
                    <Input
                      type="number"
                      value={editingPeriod.endingCash}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, endingCash: parseFloat(e.target.value) || 0 })}
                      placeholder="80000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Revenue ($)</label>
                    <Input
                      type="number"
                      value={editingPeriod.revenue}
                      onChange={(e) => setEditingPeriod({ ...editingPeriod, revenue: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
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
      </div>
    </main>
  )
}
