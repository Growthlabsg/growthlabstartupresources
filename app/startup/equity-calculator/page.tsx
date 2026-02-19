'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Percent, 
  Calculator,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  History,
  X,
  Plus,
  Edit,
  Trash2,
  Calendar,
  PieChart,
  Download,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  FileText,
  Clock
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts'

interface EquityHolder {
  id: string
  name: string
  type: 'founder' | 'employee' | 'investor' | 'advisor' | 'option-pool'
  shares: number
  percentage: number
  fullyVested: boolean
  vestingSchedule?: VestingSchedule
  grantDate?: string
}

interface VestingSchedule {
  totalYears: number
  cliffMonths: number
  vestingFrequency: 'monthly' | 'quarterly' | 'annually'
  startDate: string
}

interface DilutionScenario {
  id: string
  name: string
  newShares: number
  newInvestors: EquityHolder[]
  resultingOwnership: EquityHolder[]
  dilutionImpact: Record<string, number>
}

interface FundingRound {
  id: string
  name: string
  date: string
  preMoneyValuation: number
  investmentAmount: number
  newSharesIssued: number
  pricePerShare: number
}

export default function EquityCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [totalShares, setTotalShares] = useState(10000000)
  const [equityHolders, setEquityHolders] = useState<EquityHolder[]>([])
  const [editingHolder, setEditingHolder] = useState<EquityHolder | null>(null)
  const [dilutionScenarios, setDilutionScenarios] = useState<DilutionScenario[]>([])
  const [editingScenario, setEditingScenario] = useState<DilutionScenario | null>(null)
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([])
  const [editingRound, setEditingRound] = useState<FundingRound | null>(null)
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)

  const tabs = [
    { id: 'calculator', label: 'Equity Calculator', icon: Calculator },
    { id: 'distribution', label: 'Distribution', icon: PieChart },
    { id: 'dilution', label: 'Dilution Analysis', icon: TrendingDown },
    { id: 'vesting', label: 'Vesting Calculator', icon: Calendar },
    { id: 'rounds', label: 'Funding Rounds', icon: DollarSign },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('equityCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.totalShares) setTotalShares(data.totalShares)
          if (data.equityHolders) setEquityHolders(data.equityHolders)
          if (data.dilutionScenarios) setDilutionScenarios(data.dilutionScenarios)
          if (data.fundingRounds) setFundingRounds(data.fundingRounds)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      } else {
        // Initialize with default data
        setEquityHolders([
          { id: '1', name: 'Founder 1', type: 'founder', shares: 4000000, percentage: 40, fullyVested: false },
          { id: '2', name: 'Founder 2', type: 'founder', shares: 4000000, percentage: 40, fullyVested: false },
          { id: '3', name: 'Option Pool', type: 'option-pool', shares: 2000000, percentage: 20, fullyVested: true },
        ])
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        totalShares,
        equityHolders,
        dilutionScenarios,
        fundingRounds,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('equityCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const recalculatePercentages = (holders: EquityHolder[], shares: number) => {
    return holders.map(h => ({
      ...h,
      percentage: shares > 0 ? (h.shares / shares) * 100 : 0
    }))
  }

  const addEquityHolder = () => {
    const newHolder: EquityHolder = {
      id: Date.now().toString(),
      name: '',
      type: 'employee',
      shares: 0,
      percentage: 0,
      fullyVested: false
    }
    setEditingHolder(newHolder)
  }

  const saveEquityHolder = () => {
    if (!editingHolder) return
    if (!editingHolder.name || editingHolder.shares <= 0) {
      showToast('Please enter name and shares', 'error')
      return
    }

    const updated = equityHolders.find(h => h.id === editingHolder.id)
      ? equityHolders.map(h => h.id === editingHolder.id ? editingHolder : h)
      : [...equityHolders, editingHolder]

    const recalculated = recalculatePercentages(updated, totalShares)
    setEquityHolders(recalculated)
    setEditingHolder(null)
    saveToLocalStorage()
    showToast('Equity holder saved!', 'success')
  }

  const deleteEquityHolder = (id: string) => {
    if (confirm('Are you sure you want to delete this equity holder?')) {
      const updated = equityHolders.filter(h => h.id !== id)
      const recalculated = recalculatePercentages(updated, totalShares)
      setEquityHolders(recalculated)
      saveToLocalStorage()
      showToast('Equity holder deleted', 'info')
    }
  }

  const calculateEquityFromPercentage = (percentage: number) => {
    return (percentage / 100) * totalShares
  }

  const calculatePercentageFromShares = (shares: number) => {
    return totalShares > 0 ? (shares / totalShares) * 100 : 0
  }

  const createDilutionScenario = () => {
    const newScenario: DilutionScenario = {
      id: Date.now().toString(),
      name: '',
      newShares: 0,
      newInvestors: [],
      resultingOwnership: [],
      dilutionImpact: {}
    }
    setEditingScenario(newScenario)
  }

  const calculateDilution = (newShares: number, newInvestors: EquityHolder[]) => {
    const newTotal = totalShares + newShares
    const dilutionImpact: Record<string, number> = {}
    
    const resultingOwnership = equityHolders.map(holder => {
      const newPercentage = (holder.shares / newTotal) * 100
      const dilution = holder.percentage - newPercentage
      dilutionImpact[holder.id] = dilution
      return {
        ...holder,
        percentage: newPercentage
      }
    })

    const newInvestorsWithPercentage = newInvestors.map(inv => ({
      ...inv,
      percentage: (inv.shares / newTotal) * 100
    }))

    return {
      resultingOwnership: [...resultingOwnership, ...newInvestorsWithPercentage],
      dilutionImpact
    }
  }

  const saveDilutionScenario = () => {
    if (!editingScenario) return
    if (!editingScenario.name || editingScenario.newShares <= 0) {
      showToast('Please enter scenario name and new shares', 'error')
      return
    }

    const { resultingOwnership, dilutionImpact } = calculateDilution(
      editingScenario.newShares,
      editingScenario.newInvestors
    )

    const updatedScenario = {
      ...editingScenario,
      resultingOwnership,
      dilutionImpact
    }

    const updated = dilutionScenarios.find(s => s.id === updatedScenario.id)
      ? dilutionScenarios.map(s => s.id === updatedScenario.id ? updatedScenario : s)
      : [...dilutionScenarios, updatedScenario]

    setDilutionScenarios(updated)
    setEditingScenario(null)
    saveToLocalStorage()
    showToast('Dilution scenario saved!', 'success')
  }

  const calculateVestedShares = (holder: EquityHolder, currentDate: Date = new Date()) => {
    if (!holder.vestingSchedule || holder.fullyVested) {
      return holder.shares
    }

    const startDate = new Date(holder.vestingSchedule.startDate)
    const monthsElapsed = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
                         (currentDate.getMonth() - startDate.getMonth())
    
    if (monthsElapsed < holder.vestingSchedule.cliffMonths) {
      return 0
    }

    const totalMonths = holder.vestingSchedule.totalYears * 12
    const vestedMonths = Math.min(monthsElapsed, totalMonths)
    
    let vestedShares = 0
    if (holder.vestingSchedule.vestingFrequency === 'monthly') {
      vestedShares = (holder.shares / totalMonths) * vestedMonths
    } else if (holder.vestingSchedule.vestingFrequency === 'quarterly') {
      const quartersVested = Math.floor(vestedMonths / 3)
      const totalQuarters = holder.vestingSchedule.totalYears * 4
      vestedShares = (holder.shares / totalQuarters) * quartersVested
    } else {
      const yearsVested = Math.floor(vestedMonths / 12)
      vestedShares = (holder.shares / holder.vestingSchedule.totalYears) * yearsVested
    }

    return Math.min(vestedShares, holder.shares)
  }

  const addFundingRound = () => {
    const newRound: FundingRound = {
      id: Date.now().toString(),
      name: '',
      date: new Date().toISOString().split('T')[0],
      preMoneyValuation: 0,
      investmentAmount: 0,
      newSharesIssued: 0,
      pricePerShare: 0
    }
    setEditingRound(newRound)
  }

  const saveFundingRound = () => {
    if (!editingRound) return
    if (!editingRound.name || editingRound.preMoneyValuation <= 0 || editingRound.investmentAmount <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const pricePerShare = editingRound.preMoneyValuation / totalShares
    const newSharesIssued = editingRound.investmentAmount / pricePerShare

    const updatedRound = {
      ...editingRound,
      pricePerShare,
      newSharesIssued: Math.round(newSharesIssued)
    }

    const updated = fundingRounds.find(r => r.id === updatedRound.id)
      ? fundingRounds.map(r => r.id === updatedRound.id ? updatedRound : r)
      : [...fundingRounds, updatedRound]

    setFundingRounds(updated)
    setEditingRound(null)
    saveToLocalStorage()
    showToast('Funding round saved!', 'success')
  }

  const exportData = () => {
    const data = {
      totalShares,
      equityHolders,
      dilutionScenarios,
      fundingRounds,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `equity-calculator-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported!', 'success')
  }

  const chartData = equityHolders.map(h => ({
    name: h.name,
    value: h.percentage,
    type: h.type
  }))

  const COLORS = {
    founder: '#10b981',
    employee: '#f59e0b',
    investor: '#3b82f6',
    'option-pool': '#8b5cf6',
    advisor: '#ec4899'
  }

  const getTypeColor = (type: string) => {
    return COLORS[type as keyof typeof COLORS] || '#6b7280'
  }

  const vestedData = equityHolders.map(h => ({
    name: h.name,
    total: h.shares,
    vested: calculateVestedShares(h),
    unvested: h.shares - calculateVestedShares(h)
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            Equity Calculator
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate equity distribution, model dilution scenarios, and track vesting schedules
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

        {/* Equity Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary-500" />
                  Quick Calculator
                </h3>
                <div className="space-y-4">
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Outstanding Shares</label>
                    <Input
                type="number"
                value={totalShares}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0
                        setTotalShares(val)
                        const recalculated = recalculatePercentages(equityHolders, val)
                        setEquityHolders(recalculated)
                      }}
                      placeholder="10000000"
                    />
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Current Distribution</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {equityHolders.reduce((sum, h) => sum + h.percentage, 0).toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {equityHolders.reduce((sum, h) => sum + h.shares, 0).toLocaleString()} shares allocated
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary-500" />
                  Convert Between Shares & Percentage
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shares</label>
                    <Input
                      type="number"
                      placeholder="Enter shares"
                      onChange={(e) => {
                        const shares = parseFloat(e.target.value) || 0
                        const percentage = calculatePercentageFromShares(shares)
                        const resultDiv = document.getElementById('shares-to-percentage')
                        if (resultDiv) {
                          resultDiv.textContent = `${percentage.toFixed(2)}%`
                        }
                      }}
                    />
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Percentage: </span>
                      <span id="shares-to-percentage" className="font-bold text-primary-600">0%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Percentage (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter percentage"
                      onChange={(e) => {
                        const percentage = parseFloat(e.target.value) || 0
                        const shares = calculateEquityFromPercentage(percentage)
                        const resultDiv = document.getElementById('percentage-to-shares')
                        if (resultDiv) {
                          resultDiv.textContent = shares.toLocaleString()
                        }
                      }}
                    />
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Shares: </span>
                      <span id="percentage-to-shares" className="font-bold text-primary-600">0</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Equity Holders</h2>
                </div>
                <Button onClick={addEquityHolder} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Holder
                </Button>
              </div>

              {equityHolders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p>No equity holders yet. Add your first equity holder to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {equityHolders.map((holder) => (
                    <Card key={holder.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{holder.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {holder.type}
                            </Badge>
                            {holder.fullyVested && (
                              <Badge variant="beginner" className="text-xs">
                                Fully Vested
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Shares:</span> {holder.shares.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Ownership:</span> {holder.percentage.toFixed(2)}%
                            </div>
                            {holder.vestingSchedule && !holder.fullyVested && (
                              <div>
                                <span className="font-medium">Vested:</span> {calculateVestedShares(holder).toLocaleString()}
                              </div>
                            )}
                            {holder.vestingSchedule && !holder.fullyVested && (
            <div>
                                <span className="font-medium">Unvested:</span> {(holder.shares - calculateVestedShares(holder)).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingHolder(holder)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEquityHolder(holder.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${holder.percentage}%`,
                              backgroundColor: getTypeColor(holder.type)
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Distribution Tab */}
        {activeTab === 'distribution' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Ownership Distribution</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getTypeColor(entry.type)} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Ownership by Type</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={Object.entries(
                    equityHolders.reduce((acc, h) => {
                      acc[h.type] = (acc[h.type] || 0) + h.percentage
                      return acc
                    }, {} as Record<string, number>)
                  ).map(([type, value]) => ({ type, value }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <h3 className="font-semibold mb-4">Detailed Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Shares</th>
                      <th className="text-right p-2">Percentage</th>
                      <th className="text-right p-2">Vested</th>
                      <th className="text-right p-2">Unvested</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equityHolders.map((holder) => (
                      <tr key={holder.id} className="border-b">
                        <td className="p-2 font-medium">{holder.name}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">{holder.type}</Badge>
                        </td>
                        <td className="p-2 text-right">{holder.shares.toLocaleString()}</td>
                        <td className="p-2 text-right">{holder.percentage.toFixed(2)}%</td>
                        <td className="p-2 text-right">
                          {holder.vestingSchedule && !holder.fullyVested 
                            ? calculateVestedShares(holder).toLocaleString()
                            : holder.shares.toLocaleString()}
                        </td>
                        <td className="p-2 text-right">
                          {holder.vestingSchedule && !holder.fullyVested
                            ? (holder.shares - calculateVestedShares(holder)).toLocaleString()
                            : '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Dilution Analysis Tab */}
        {activeTab === 'dilution' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Dilution Analysis</h2>
                </div>
                <Button onClick={createDilutionScenario} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Scenario
                </Button>
              </div>

              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Current Ownership</h4>
                    <div className="text-sm text-yellow-800">
                      {equityHolders.filter(h => h.type === 'founder').map(f => `${f.name}: ${f.percentage.toFixed(2)}%`).join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {dilutionScenarios.length === 0 && !editingScenario ? (
                <div className="text-center py-12 text-gray-400">
                  <TrendingDown className="h-16 w-16 mx-auto mb-4" />
                  <p>No dilution scenarios yet. Create one to model future funding rounds.</p>
                </div>
              ) : (
                <>
                  {dilutionScenarios.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {dilutionScenarios.map((scenario) => (
                        <Card key={scenario.id} className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{scenario.name}</h4>
                              <div className="text-sm text-gray-600 mb-3">
                                New Shares: {scenario.newShares.toLocaleString()}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                {scenario.resultingOwnership.filter(h => h.type === 'founder').map((founder) => (
                                  <div key={founder.id}>
                                    <div className="font-medium">{founder.name}</div>
                                    <div className="text-gray-600">
                                      {founder.percentage.toFixed(2)}% 
                                      <span className="text-red-600 ml-2">
                                        ({scenario.dilutionImpact[founder.id]?.toFixed(2)}% dilution)
                                      </span>
                                    </div>
                                  </div>
                                ))}
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
                        <h3 className="text-lg font-semibold">Edit Dilution Scenario</h3>
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
                            placeholder="e.g., Series A Dilution"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Shares to Issue *</label>
                          <Input
                            type="number"
                            value={editingScenario.newShares}
                            onChange={(e) => {
                              const newShares = parseFloat(e.target.value) || 0
                              const { resultingOwnership, dilutionImpact } = calculateDilution(newShares, editingScenario.newInvestors)
                              setEditingScenario({
                                ...editingScenario,
                                newShares,
                                resultingOwnership,
                                dilutionImpact
                              })
                            }}
                            placeholder="1000000"
                          />
                        </div>
                        {editingScenario.resultingOwnership.length > 0 && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-3">Resulting Ownership:</h4>
                            <div className="space-y-2">
                              {editingScenario.resultingOwnership.map((holder) => (
                                <div key={holder.id} className="flex items-center justify-between text-sm">
                                  <span>{holder.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{holder.percentage.toFixed(2)}%</span>
                                    {editingScenario.dilutionImpact[holder.id] && (
                                      <span className="text-red-600 text-xs">
                                        ({editingScenario.dilutionImpact[holder.id].toFixed(2)}% ↓)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button onClick={saveDilutionScenario} className="flex-1">
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

        {/* Vesting Calculator Tab */}
        {activeTab === 'vesting' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Vesting Calculator</h2>
              </div>

              {equityHolders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="h-16 w-16 mx-auto mb-4" />
                  <p>No equity holders yet. Add equity holders to track vesting.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {equityHolders.map((holder) => {
                    const vested = calculateVestedShares(holder)
                    const unvested = holder.shares - vested
                    return (
                      <Card key={holder.id} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">{holder.name}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Total Shares:</span> {holder.shares.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Vested:</span> {vested.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Unvested:</span> {unvested.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Vested %:</span> {((vested / holder.shares) * 100).toFixed(1)}%
                              </div>
                            </div>
                            {holder.vestingSchedule && (
                              <div className="mt-3 text-xs text-gray-500">
                                Schedule: {holder.vestingSchedule.totalYears} years, {holder.vestingSchedule.cliffMonths} month cliff, {holder.vestingSchedule.vestingFrequency} vesting
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingHolder(holder)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-3 rounded-full bg-green-500 transition-all"
                            style={{ width: `${(vested / holder.shares) * 100}%` }}
                          />
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Funding Rounds Tab */}
        {activeTab === 'rounds' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Funding Rounds</h2>
                </div>
                <Button onClick={addFundingRound} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Round
                </Button>
              </div>

              {fundingRounds.length === 0 && !editingRound ? (
                <div className="text-center py-12 text-gray-400">
                  <DollarSign className="h-16 w-16 mx-auto mb-4" />
                  <p>No funding rounds yet. Add your first funding round.</p>
                </div>
              ) : (
                <>
                  {fundingRounds.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {fundingRounds.map((round) => (
                        <Card key={round.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{round.name}</h4>
                                <Badge variant="outline">{new Date(round.date).toLocaleDateString()}</Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Pre-Money:</span> ${(round.preMoneyValuation / 1000000).toFixed(1)}M
                                </div>
                                <div>
                                  <span className="font-medium">Investment:</span> ${(round.investmentAmount / 1000).toFixed(0)}K
                                </div>
                                <div>
                                  <span className="font-medium">Price/Share:</span> ${round.pricePerShare.toFixed(4)}
                                </div>
                                <div>
                                  <span className="font-medium">New Shares:</span> {round.newSharesIssued.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingRound(round)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {editingRound && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Edit Funding Round</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingRound(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Round Name *</label>
                            <Input
                              value={editingRound.name}
                              onChange={(e) => setEditingRound({ ...editingRound, name: e.target.value })}
                              placeholder="e.g., Seed Round"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                            <Input
                              type="date"
                              value={editingRound.date}
                              onChange={(e) => setEditingRound({ ...editingRound, date: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pre-Money Valuation ($) *</label>
                            <Input
                              type="number"
                              value={editingRound.preMoneyValuation}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const pricePerShare = val / totalShares
                                const newShares = editingRound.investmentAmount / pricePerShare
                                setEditingRound({
                                  ...editingRound,
                                  preMoneyValuation: val,
                                  pricePerShare,
                                  newSharesIssued: Math.round(newShares)
                                })
                              }}
                              placeholder="10000000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($) *</label>
                            <Input
                              type="number"
                              value={editingRound.investmentAmount}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const pricePerShare = editingRound.preMoneyValuation / totalShares
                                const newShares = val / pricePerShare
                                setEditingRound({
                                  ...editingRound,
                                  investmentAmount: val,
                                  pricePerShare,
                                  newSharesIssued: Math.round(newShares)
                                })
                              }}
                              placeholder="2000000"
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Calculated Values:</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Price per Share:</span> ${editingRound.pricePerShare.toFixed(4)}
                            </div>
                            <div>
                              <span className="font-medium">New Shares to Issue:</span> {editingRound.newSharesIssued.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveFundingRound} className="flex-1">
                            Save Round
                          </Button>
                          <Button variant="outline" onClick={() => setEditingRound(null)}>
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

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <History className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Equity History</h2>
              </div>
              <div className="space-y-4">
                {fundingRounds.map((round) => (
                  <Card key={round.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold mb-1">{round.name}</h4>
                        <p className="text-sm text-gray-600">{new Date(round.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(round.investmentAmount / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-600">${(round.preMoneyValuation / 1000000).toFixed(1)}M pre-money</p>
                      </div>
                    </div>
                  </Card>
                ))}
                {fundingRounds.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <History className="h-16 w-16 mx-auto mb-4" />
                    <p>No funding history yet</p>
              </div>
            )}
          </div>
        </Card>
          </div>
        )}

        {/* Edit Equity Holder Modal */}
        {editingHolder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingHolder.id && equityHolders.find(h => h.id === editingHolder.id) ? 'Edit Equity Holder' : 'New Equity Holder'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingHolder(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <Input
                      value={editingHolder.name}
                      onChange={(e) => setEditingHolder({ ...editingHolder, name: e.target.value })}
                      placeholder="Holder name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <Select
                      value={editingHolder.type}
                      onChange={(e) => setEditingHolder({ ...editingHolder, type: e.target.value as any })}
                      options={[
                        { value: 'founder', label: 'Founder' },
                        { value: 'employee', label: 'Employee' },
                        { value: 'investor', label: 'Investor' },
                        { value: 'option-pool', label: 'Option Pool' },
                        { value: 'advisor', label: 'Advisor' }
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shares *</label>
                  <Input
                    type="number"
                    value={editingHolder.shares}
                    onChange={(e) => {
                      const shares = parseFloat(e.target.value) || 0
                      const percentage = calculatePercentageFromShares(shares)
                      setEditingHolder({ ...editingHolder, shares, percentage })
                    }}
                    placeholder="1000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter Percentage (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingHolder.percentage}
                    onChange={(e) => {
                      const percentage = parseFloat(e.target.value) || 0
                      const shares = calculateEquityFromPercentage(percentage)
                      setEditingHolder({ ...editingHolder, shares, percentage })
                    }}
                    placeholder="10.00"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingHolder.fullyVested || false}
                    onChange={(e) => setEditingHolder({ ...editingHolder, fullyVested: e.target.checked })}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-700">Fully Vested</label>
                </div>
                {!editingHolder.fullyVested && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">Vesting Schedule</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Years</label>
                        <Input
                          type="number"
                          value={editingHolder.vestingSchedule?.totalYears || 4}
                          onChange={(e) => setEditingHolder({
                            ...editingHolder,
                            vestingSchedule: {
                              ...(editingHolder.vestingSchedule || {
                                totalYears: 4,
                                cliffMonths: 12,
                                vestingFrequency: 'monthly',
                                startDate: new Date().toISOString().split('T')[0]
                              }),
                              totalYears: parseInt(e.target.value) || 4
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cliff (Months)</label>
                        <Input
                          type="number"
                          value={editingHolder.vestingSchedule?.cliffMonths || 12}
                          onChange={(e) => setEditingHolder({
                            ...editingHolder,
                            vestingSchedule: {
                              ...(editingHolder.vestingSchedule || {
                                totalYears: 4,
                                cliffMonths: 12,
                                vestingFrequency: 'monthly',
                                startDate: new Date().toISOString().split('T')[0]
                              }),
                              cliffMonths: parseInt(e.target.value) || 12
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vesting Frequency</label>
                        <Select
                          value={editingHolder.vestingSchedule?.vestingFrequency || 'monthly'}
                          onChange={(e) => setEditingHolder({
                            ...editingHolder,
                            vestingSchedule: {
                              ...(editingHolder.vestingSchedule || {
                                totalYears: 4,
                                cliffMonths: 12,
                                vestingFrequency: 'monthly',
                                startDate: new Date().toISOString().split('T')[0]
                              }),
                              vestingFrequency: e.target.value as any
                            }
                          })}
                          options={[
                            { value: 'monthly', label: 'Monthly' },
                            { value: 'quarterly', label: 'Quarterly' },
                            { value: 'annually', label: 'Annually' }
                          ]}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grant Date</label>
                      <Input
                        type="date"
                        value={editingHolder.vestingSchedule?.startDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEditingHolder({
                          ...editingHolder,
                          vestingSchedule: {
                            ...(editingHolder.vestingSchedule || {
                              totalYears: 4,
                              cliffMonths: 12,
                              vestingFrequency: 'monthly',
                              startDate: new Date().toISOString().split('T')[0]
                            }),
                            startDate: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Ownership:</div>
                  <div className="text-lg font-bold text-primary-600">
                    {editingHolder.percentage.toFixed(2)}%
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveEquityHolder} className="flex-1">
                    Save Holder
                  </Button>
                  <Button variant="outline" onClick={() => setEditingHolder(null)}>
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
