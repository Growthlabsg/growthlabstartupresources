'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Calendar, 
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
  Clock,
  TrendingDown
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface RunwayScenario {
  id: string
  name: string
  currentCash: number
  monthlyBurn: number
  monthlyRevenue: number
  growthRate: number
  months: number
  runway: number
  projectedCash: number[]
  projectedRunway: number[]
  notes?: string
}

interface CashFlowEntry {
  id: string
  date: string
  cashBalance: number
  burnRate: number
  revenue: number
  notes?: string
}

interface FundingMilestone {
  id: string
  name: string
  targetDate: string
  targetAmount: number
  status: 'planned' | 'in-progress' | 'completed'
  notes?: string
}

export default function RunwayCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [currentCash, setCurrentCash] = useState('')
  const [monthlyBurn, setMonthlyBurn] = useState('')
  const [monthlyRevenue, setMonthlyRevenue] = useState('0')
  const [runway, setRunway] = useState<number | null>(null)
  const [scenarios, setScenarios] = useState<RunwayScenario[]>([])
  const [editingScenario, setEditingScenario] = useState<RunwayScenario | null>(null)
  const [cashFlowEntries, setCashFlowEntries] = useState<CashFlowEntry[]>([])
  const [editingCashFlow, setEditingCashFlow] = useState<CashFlowEntry | null>(null)
  const [fundingMilestones, setFundingMilestones] = useState<FundingMilestone[]>([])
  const [editingMilestone, setEditingMilestone] = useState<FundingMilestone | null>(null)

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calendar },
    { id: 'scenarios', label: 'Scenarios', icon: Target },
    { id: 'cashflow', label: 'Cash Flow', icon: TrendingUp },
    { id: 'funding', label: 'Funding', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('runwayCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.scenarios) setScenarios(data.scenarios)
          if (data.cashFlowEntries) setCashFlowEntries(data.cashFlowEntries)
          if (data.fundingMilestones) setFundingMilestones(data.fundingMilestones)
          if (data.currentCash) setCurrentCash(data.currentCash)
          if (data.monthlyBurn) setMonthlyBurn(data.monthlyBurn)
          if (data.monthlyRevenue) setMonthlyRevenue(data.monthlyRevenue)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        scenarios,
        cashFlowEntries,
        fundingMilestones,
        currentCash,
        monthlyBurn,
        monthlyRevenue,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('runwayCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const calculate = () => {
    const cash = parseFloat(currentCash)
    const burn = parseFloat(monthlyBurn)
    const revenue = parseFloat(monthlyRevenue) || 0
    
    if (!cash || !burn || burn === 0) {
      showToast('Please enter valid values', 'error')
      return
    }

    const netBurn = burn - revenue
    const calculatedRunway = netBurn > 0 ? cash / netBurn : Infinity
    
    setRunway(calculatedRunway)
    showToast('Runway calculated!', 'success')
  }

  const calculateScenario = (scenario: RunwayScenario) => {
    const projectedCash: number[] = []
    const projectedRunway: number[] = []
    let cash = scenario.currentCash
    let currentBurn = scenario.monthlyBurn
    let currentRevenue = scenario.monthlyRevenue

    for (let i = 0; i < scenario.months; i++) {
      const netBurn = currentBurn - currentRevenue
      cash = cash - netBurn
      projectedCash.push(Math.max(0, cash))
      projectedRunway.push(cash > 0 && netBurn > 0 ? cash / netBurn : 0)
      
      // Apply growth rate to revenue
      if (scenario.growthRate > 0) {
        currentRevenue = currentRevenue * (1 + scenario.growthRate / 100)
      }
    }

    scenario.projectedCash = projectedCash
    scenario.projectedRunway = projectedRunway
    scenario.runway = projectedCash[0] > 0 && (scenario.monthlyBurn - scenario.monthlyRevenue) > 0 
      ? scenario.currentCash / (scenario.monthlyBurn - scenario.monthlyRevenue) 
      : Infinity
  }

  const createScenario = () => {
    const newScenario: RunwayScenario = {
      id: Date.now().toString(),
      name: 'New Scenario',
      currentCash: parseFloat(currentCash) || 0,
      monthlyBurn: parseFloat(monthlyBurn) || 0,
      monthlyRevenue: parseFloat(monthlyRevenue) || 0,
      growthRate: 0,
      months: 12,
      runway: 0,
      projectedCash: [],
      projectedRunway: []
    }
    calculateScenario(newScenario)
    setEditingScenario(newScenario)
  }

  const saveScenario = () => {
    if (!editingScenario) return
    if (!editingScenario.name || editingScenario.currentCash <= 0 || editingScenario.monthlyBurn <= 0) {
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

  const deleteScenario = (id: string) => {
    if (confirm('Are you sure you want to delete this scenario?')) {
      const updated = scenarios.filter(s => s.id !== id)
      setScenarios(updated)
      saveToLocalStorage()
      showToast('Scenario deleted', 'info')
    }
  }

  const addCashFlowEntry = () => {
    const newEntry: CashFlowEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      cashBalance: parseFloat(currentCash) || 0,
      burnRate: parseFloat(monthlyBurn) || 0,
      revenue: parseFloat(monthlyRevenue) || 0
    }
    setEditingCashFlow(newEntry)
  }

  const saveCashFlowEntry = () => {
    if (!editingCashFlow) return
    if (!editingCashFlow.date || editingCashFlow.cashBalance < 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const updated = cashFlowEntries.find(e => e.id === editingCashFlow.id)
      ? cashFlowEntries.map(e => e.id === editingCashFlow.id ? editingCashFlow : e)
      : [...cashFlowEntries, editingCashFlow]

    setCashFlowEntries(updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    setEditingCashFlow(null)
    saveToLocalStorage()
    showToast('Cash flow entry saved!', 'success')
  }

  const deleteCashFlowEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const updated = cashFlowEntries.filter(e => e.id !== id)
      setCashFlowEntries(updated)
      saveToLocalStorage()
      showToast('Entry deleted', 'info')
    }
  }

  const addFundingMilestone = () => {
    const newMilestone: FundingMilestone = {
      id: Date.now().toString(),
      name: 'New Milestone',
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      targetAmount: 0,
      status: 'planned'
    }
    setEditingMilestone(newMilestone)
  }

  const saveFundingMilestone = () => {
    if (!editingMilestone) return
    if (!editingMilestone.name || !editingMilestone.targetDate || editingMilestone.targetAmount <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const updated = fundingMilestones.find(m => m.id === editingMilestone.id)
      ? fundingMilestones.map(m => m.id === editingMilestone.id ? editingMilestone : m)
      : [...fundingMilestones, editingMilestone]

    setFundingMilestones(updated)
    setEditingMilestone(null)
    saveToLocalStorage()
    showToast('Milestone saved!', 'success')
  }

  const deleteFundingMilestone = (id: string) => {
    if (confirm('Are you sure you want to delete this milestone?')) {
      const updated = fundingMilestones.filter(m => m.id !== id)
      setFundingMilestones(updated)
      saveToLocalStorage()
      showToast('Milestone deleted', 'info')
    }
  }

  const exportData = () => {
    const data = {
      currentCalculation: {
        currentCash: parseFloat(currentCash) || 0,
        monthlyBurn: parseFloat(monthlyBurn) || 0,
        monthlyRevenue: parseFloat(monthlyRevenue) || 0,
        runway
      },
      scenarios,
      cashFlowEntries,
      fundingMilestones,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `runway-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported!', 'success')
  }

  const scenarioChartData = editingScenario ? editingScenario.projectedCash.map((cash, index) => ({
    month: `Month ${index + 1}`,
    cash: Math.max(0, cash),
    runway: editingScenario.projectedRunway[index]
  })) : []

  const cashFlowChartData = cashFlowEntries.map(e => ({
    date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    cash: e.cashBalance,
    burn: e.burnRate,
    revenue: e.revenue
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Runway Calculator
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate runway, model scenarios, track cash flow, and plan funding milestones
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Current Cash</div>
                <div className="text-2xl font-bold">
                  {currentCash ? `$${(parseFloat(currentCash) / 1000).toFixed(0)}K` : '$0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Monthly Burn</div>
                <div className="text-2xl font-bold text-red-600">
                  {monthlyBurn ? `$${(parseFloat(monthlyBurn) / 1000).toFixed(0)}K` : '$0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Runway</div>
                <div className="text-2xl font-bold text-primary-600">
                  {runway !== null ? (runway === Infinity ? '∞' : `${runway.toFixed(1)} months`) : '0 months'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {runway !== null && runway < 6 && <span className="text-red-600">⚠️ Low</span>}
                  {runway !== null && runway >= 6 && runway < 12 && <span className="text-yellow-600">⚠️ Moderate</span>}
                  {runway !== null && runway >= 12 && runway !== Infinity && <span className="text-green-600">✅ Good</span>}
                  {runway === Infinity && <span className="text-green-600">✅ Profitable</span>}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-500" />
                  Runway Calculator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Cash Balance ($) *</label>
                    <Input
                      type="number"
                      value={currentCash}
                      onChange={(e) => setCurrentCash(e.target.value)}
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Burn Rate ($) *</label>
                    <Input
                      type="number"
                      value={monthlyBurn}
                      onChange={(e) => setMonthlyBurn(e.target.value)}
                      placeholder="20000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Revenue ($)</label>
                    <Input
                      type="number"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional - reduces net burn</p>
                  </div>
                  <Button onClick={calculate} className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calculate Runway
                  </Button>
                  {runway !== null && (
                    <div className="bg-primary-500/10 border-2 border-primary-500/20 rounded-lg p-6 text-center">
                      <p className="text-sm text-gray-600 mb-2">Estimated Runway</p>
                      <p className="text-3xl font-bold text-primary-500">
                        {runway === Infinity ? '∞ (Profitable)' : `${runway.toFixed(1)} months`}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {runway < 6 && '⚠️ Low runway - consider fundraising immediately'}
                        {runway >= 6 && runway < 12 && '⚠️ Moderate runway - plan for next round'}
                        {runway >= 12 && runway !== Infinity && '✅ Good runway - continue monitoring'}
                        {runway === Infinity && '✅ Profitable - no immediate funding needed'}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary-500" />
                  About Runway
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Runway</strong> is the number of months your startup can operate with current cash at current burn rate.
                  </p>
                  <p>
                    <strong>Net Burn</strong> = Monthly Burn - Monthly Revenue
                  </p>
                  <p>
                    <strong>Runway</strong> = Current Cash / Net Burn
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
                          <li>• Model different scenarios regularly</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Runway Scenarios</h2>
                </div>
                <Button onClick={createScenario} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Scenario
                </Button>
              </div>

              {scenarios.length === 0 && !editingScenario ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No scenarios yet. Create a scenario to model different runway projections.</p>
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
                                  <span className="font-medium">Runway:</span> {scenario.runway === Infinity ? '∞' : `${scenario.runway.toFixed(1)} months`}
                                </div>
                                <div>
                                  <span className="font-medium">Monthly Burn:</span> ${(scenario.monthlyBurn / 1000).toFixed(0)}K
                                </div>
                                <div>
                                  <span className="font-medium">Monthly Revenue:</span> ${(scenario.monthlyRevenue / 1000).toFixed(0)}K
                                </div>
                                <div>
                                  <span className="font-medium">Growth Rate:</span> {scenario.growthRate}%
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Growth Rate (%/mo)</label>
                            <Input
                              type="number"
                              step="0.1"
                              value={editingScenario.growthRate}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const updated = { ...editingScenario, growthRate: val }
                                calculateScenario(updated)
                                setEditingScenario(updated)
                              }}
                              placeholder="0"
                            />
                            <p className="text-xs text-gray-500 mt-1">Monthly revenue growth percentage</p>
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

        {/* Cash Flow Tab - Block 2 */}
        {activeTab === 'cashflow' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Cash Flow Tracking</h2>
                </div>
                <Button onClick={addCashFlowEntry} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </div>

              {cashFlowEntries.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <p>No cash flow entries yet. Add entries to track cash flow over time.</p>
                </div>
              ) : (
                <>
                  {cashFlowChartData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Cash Flow Trend</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={cashFlowChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="cash" stroke="#3b82f6" name="Cash Balance" />
                          <Line type="monotone" dataKey="burn" stroke="#ef4444" name="Burn Rate" />
                          <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {cashFlowEntries.map((entry) => (
                      <Card key={entry.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{new Date(entry.date).toLocaleDateString()}</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Cash:</span> ${(entry.cashBalance / 1000).toFixed(0)}K
                              </div>
                              <div>
                                <span className="font-medium">Burn:</span> ${(entry.burnRate / 1000).toFixed(0)}K/mo
                              </div>
                              <div>
                                <span className="font-medium">Revenue:</span> ${(entry.revenue / 1000).toFixed(0)}K/mo
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCashFlow(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCashFlowEntry(entry.id)}
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

        {/* Funding Tab - Block 4 */}
        {activeTab === 'funding' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Funding Milestones</h2>
                </div>
                <Button onClick={addFundingMilestone} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Milestone
                </Button>
              </div>

              {fundingMilestones.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <DollarSign className="h-16 w-16 mx-auto mb-4" />
                  <p>No funding milestones yet. Add milestones to track your fundraising timeline.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fundingMilestones.map((milestone) => {
                    const daysUntil = Math.floor((new Date(milestone.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <Card key={milestone.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{milestone.name}</h4>
                              <Badge 
                                variant={milestone.status === 'completed' ? 'beginner' : milestone.status === 'in-progress' ? 'outline' : 'outline'}
                                className="text-xs"
                              >
                                {milestone.status}
                              </Badge>
                              {daysUntil < 90 && daysUntil > 0 && (
                                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                                  {daysUntil} days left
                                </Badge>
                              )}
                              {daysUntil < 0 && milestone.status !== 'completed' && (
                                <Badge variant="outline" className="text-xs bg-red-100 text-red-800">Overdue</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Target Date:</span> {new Date(milestone.targetDate).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Target Amount:</span> ${(milestone.targetAmount / 1000).toFixed(0)}K
                              </div>
                              <div>
                                <span className="font-medium">Days Until:</span> {daysUntil > 0 ? daysUntil : 'Past due'}
                              </div>
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
                              onClick={() => deleteFundingMilestone(milestone.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

        {/* Analytics Tab - Block 5 */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Average Runway</div>
                <div className="text-2xl font-bold">
                  {scenarios.length > 0 
                    ? scenarios[0].runway === Infinity 
                      ? '∞' 
                      : `${(scenarios.reduce((sum, s) => sum + (s.runway === Infinity ? 0 : s.runway), 0) / scenarios.length).toFixed(1)} months`
                    : '0 months'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Scenarios</div>
                <div className="text-2xl font-bold">{scenarios.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Funding Milestones</div>
                <div className="text-2xl font-bold">{fundingMilestones.length}</div>
              </Card>
            </div>

            {scenarios.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Scenario Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scenarios.flatMap((s, idx) => 
                    s.projectedCash.map((cash, month) => ({
                      month: `M${month + 1}`,
                      [`${s.name}`]: cash,
                      scenario: s.name
                    }))
                  )}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {scenarios.map((s, idx) => (
                      <Line key={s.id} type="monotone" dataKey={s.name} stroke={`hsl(${idx * 60}, 70%, 50%)`} />
                    ))}
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
              {scenarios.length === 0 && cashFlowEntries.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No history yet. Create scenarios and track cash flow to build history.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scenarios.map((scenario) => (
                    <Card key={scenario.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{scenario.name}</h4>
                          <p className="text-sm text-gray-600">
                            Runway: {scenario.runway === Infinity ? '∞' : `${scenario.runway.toFixed(1)} months`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(scenario.currentCash / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-gray-600">Starting Cash</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Edit Cash Flow Modal */}
        {editingCashFlow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Cash Flow Entry</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingCashFlow(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <Input
                    type="date"
                    value={editingCashFlow.date}
                    onChange={(e) => setEditingCashFlow({ ...editingCashFlow, date: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cash Balance ($) *</label>
                    <Input
                      type="number"
                      value={editingCashFlow.cashBalance}
                      onChange={(e) => setEditingCashFlow({ ...editingCashFlow, cashBalance: parseFloat(e.target.value) || 0 })}
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Burn Rate ($/mo)</label>
                    <Input
                      type="number"
                      value={editingCashFlow.burnRate}
                      onChange={(e) => setEditingCashFlow({ ...editingCashFlow, burnRate: parseFloat(e.target.value) || 0 })}
                      placeholder="20000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Revenue ($/mo)</label>
                    <Input
                      type="number"
                      value={editingCashFlow.revenue}
                      onChange={(e) => setEditingCashFlow({ ...editingCashFlow, revenue: parseFloat(e.target.value) || 0 })}
                      placeholder="5000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingCashFlow.notes || ''}
                    onChange={(e) => setEditingCashFlow({ ...editingCashFlow, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveCashFlowEntry} className="flex-1">
                    Save Entry
                  </Button>
                  <Button variant="outline" onClick={() => setEditingCashFlow(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Funding Milestone Modal */}
        {editingMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Funding Milestone</h3>
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
                    placeholder="e.g., Series A Round"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Date *</label>
                    <Input
                      type="date"
                      value={editingMilestone.targetDate}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, targetDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount ($) *</label>
                    <Input
                      type="number"
                      value={editingMilestone.targetAmount}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, targetAmount: parseFloat(e.target.value) || 0 })}
                      placeholder="1000000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <Select
                    value={editingMilestone.status}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, status: e.target.value as any })}
                    options={[
                      { value: 'planned', label: 'Planned' },
                      { value: 'in-progress', label: 'In Progress' },
                      { value: 'completed', label: 'Completed' }
                    ]}
                  />
                </div>
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
                  <Button onClick={saveFundingMilestone} className="flex-1">
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
