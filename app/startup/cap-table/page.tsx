'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  PieChart, 
  Plus, 
  Save, 
  Download,
  Edit,
  Trash2,
  X,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  FileText,
  Calculator,
  History,
  Award,
  Briefcase,
  Zap,
  AlertCircle
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface Shareholder {
  id: string
  name: string
  email?: string
  shares: number
  percentage: number
  type: 'founder' | 'investor' | 'employee' | 'option-pool' | 'advisor'
  vestingSchedule?: string
  fullyVested?: boolean
  investmentAmount?: number
  pricePerShare?: number
  round?: string
  notes?: string
}

interface FundingRound {
  id: string
  name: string
  date: string
  amount: number
  valuation: number
  pricePerShare: number
  sharesIssued: number
  investors: string[]
}

interface DilutionScenario {
  id: string
  name: string
  newShares: number
  newInvestors: Shareholder[]
  resultingCapTable: Shareholder[]
}

export default function CapTablePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [shareholders, setShareholders] = useState<Shareholder[]>([])
  const [editingShareholder, setEditingShareholder] = useState<Shareholder | null>(null)
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([])
  const [editingRound, setEditingRound] = useState<FundingRound | null>(null)
  const [dilutionScenarios, setDilutionScenarios] = useState<DilutionScenario[]>([])
  const [editingScenario, setEditingScenario] = useState<DilutionScenario | null>(null)
  const [optionPoolSize, setOptionPoolSize] = useState(20)
  const [companyValuation, setCompanyValuation] = useState(10000000)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'shareholders', label: 'Shareholders', icon: Users },
    { id: 'rounds', label: 'Funding Rounds', icon: DollarSign },
    { id: 'dilution', label: 'Dilution Analysis', icon: TrendingDown },
    { id: 'options', label: 'Option Pool', icon: Award },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('capTableData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.shareholders) setShareholders(data.shareholders)
          if (data.fundingRounds) setFundingRounds(data.fundingRounds)
          if (data.dilutionScenarios) setDilutionScenarios(data.dilutionScenarios)
          if (data.optionPoolSize) setOptionPoolSize(data.optionPoolSize)
          if (data.companyValuation) setCompanyValuation(data.companyValuation)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      } else {
        // Initialize with default data
        setShareholders([
          { id: '1', name: 'Founder 1', shares: 5000000, percentage: 40, type: 'founder', fullyVested: true },
          { id: '2', name: 'Founder 2', shares: 5000000, percentage: 40, type: 'founder', fullyVested: true },
    { id: '3', name: 'Option Pool', shares: 2000000, percentage: 16, type: 'option-pool' },
          { id: '4', name: 'Seed Investor', shares: 1000000, percentage: 4, type: 'investor', investmentAmount: 400000, pricePerShare: 0.40, round: 'Seed' },
        ])
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        shareholders,
        fundingRounds,
        dilutionScenarios,
        optionPoolSize,
        companyValuation,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('capTableData', JSON.stringify(data))
      showToast('Cap table saved!', 'success')
    }
  }

  const totalShares = shareholders.reduce((sum, s) => sum + s.shares, 0)

  const recalculatePercentages = (sharesList: Shareholder[]) => {
    const total = sharesList.reduce((sum, s) => sum + s.shares, 0)
    return sharesList.map(s => ({
      ...s,
      percentage: total > 0 ? (s.shares / total) * 100 : 0
    }))
  }

  const addShareholder = () => {
    const newShareholder: Shareholder = {
      id: Date.now().toString(),
      name: '',
      shares: 0,
      percentage: 0,
      type: 'employee',
      fullyVested: false
    }
    setEditingShareholder(newShareholder)
  }

  const saveShareholder = () => {
    if (!editingShareholder) return
    if (!editingShareholder.name || editingShareholder.shares <= 0) {
      showToast('Please enter name and shares', 'error')
      return
    }

    const updated = shareholders.find(s => s.id === editingShareholder.id)
      ? shareholders.map(s => s.id === editingShareholder.id ? editingShareholder : s)
      : [...shareholders, editingShareholder]

    const recalculated = recalculatePercentages(updated)
    setShareholders(recalculated)
    setEditingShareholder(null)
    saveToLocalStorage()
    showToast('Shareholder saved!', 'success')
  }

  const deleteShareholder = (id: string) => {
    if (confirm('Are you sure you want to delete this shareholder?')) {
      const updated = shareholders.filter(s => s.id !== id)
      const recalculated = recalculatePercentages(updated)
      setShareholders(recalculated)
      saveToLocalStorage()
      showToast('Shareholder deleted', 'info')
    }
  }

  const addFundingRound = () => {
    const newRound: FundingRound = {
      id: Date.now().toString(),
      name: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      valuation: 0,
      pricePerShare: 0,
      sharesIssued: 0,
      investors: []
    }
    setEditingRound(newRound)
  }

  const saveFundingRound = () => {
    if (!editingRound) return
    if (!editingRound.name || editingRound.amount <= 0 || editingRound.valuation <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const pricePerShare = editingRound.valuation / totalShares
    const sharesIssued = editingRound.amount / pricePerShare

    const updatedRound = {
      ...editingRound,
      pricePerShare,
      sharesIssued: Math.round(sharesIssued)
    }

    const updated = fundingRounds.find(r => r.id === updatedRound.id)
      ? fundingRounds.map(r => r.id === updatedRound.id ? updatedRound : r)
      : [...fundingRounds, updatedRound]

    setFundingRounds(updated)
    setEditingRound(null)
    saveToLocalStorage()
    showToast('Funding round saved!', 'success')
  }

  const calculateDilution = (newShares: number, newInvestors: Shareholder[]) => {
    const currentTotal = totalShares
    const newTotal = currentTotal + newShares
    const dilutionFactor = newShares / newTotal

    const diluted = shareholders.map(s => ({
      ...s,
      percentage: (s.shares / newTotal) * 100
    }))

    const newInvestorsWithShares = newInvestors.map(inv => ({
      ...inv,
      percentage: (inv.shares / newTotal) * 100
    }))

    return [...diluted, ...newInvestorsWithShares]
  }

  const createDilutionScenario = () => {
    const newScenario: DilutionScenario = {
      id: Date.now().toString(),
      name: '',
      newShares: 0,
      newInvestors: [],
      resultingCapTable: []
    }
    setEditingScenario(newScenario)
  }

  const saveDilutionScenario = () => {
    if (!editingScenario) return
    if (!editingScenario.name || editingScenario.newShares <= 0) {
      showToast('Please enter scenario name and new shares', 'error')
      return
    }

    const resultingCapTable = calculateDilution(editingScenario.newShares, editingScenario.newInvestors)
    const updatedScenario = {
      ...editingScenario,
      resultingCapTable
    }

    const updated = dilutionScenarios.find(s => s.id === updatedScenario.id)
      ? dilutionScenarios.map(s => s.id === updatedScenario.id ? updatedScenario : s)
      : [...dilutionScenarios, updatedScenario]

    setDilutionScenarios(updated)
    setEditingScenario(null)
    saveToLocalStorage()
    showToast('Dilution scenario saved!', 'success')
  }

  const exportData = () => {
    const data = {
      shareholders,
      fundingRounds,
      dilutionScenarios,
      optionPoolSize,
      companyValuation,
      totalShares,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cap-table-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Cap table exported!', 'success')
  }

  const chartData = shareholders.map(s => ({
    name: s.name,
    value: s.percentage,
    type: s.type
  }))

  const COLORS = {
    founder: '#10b981',
    investor: '#3b82f6',
    employee: '#f59e0b',
    'option-pool': '#8b5cf6',
    advisor: '#ec4899'
  }

  const getTypeColor = (type: string) => {
    return COLORS[type as keyof typeof COLORS] || '#6b7280'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            Cap Table Manager
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your startup's capitalization table, track equity ownership, and model dilution scenarios
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <PieChart className="h-6 w-6 text-primary-500" />
              <div>
                <p className="text-sm text-gray-600">Total Shares</p>
                <p className="text-2xl font-bold">{totalShares.toLocaleString()}</p>
              </div>
            </div>
          </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Shareholders</p>
                <p className="text-2xl font-bold">{shareholders.length}</p>
              </div>
            </div>
          </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-6 w-6 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Option Pool</p>
                <p className="text-2xl font-bold">
                      {shareholders.find(s => s.type === 'option-pool')?.percentage.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Company Valuation</p>
                    <p className="text-2xl font-bold">${(companyValuation / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Ownership Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => percent ? `${name}: ${(percent * 100).toFixed(1)}%` : name}
                      outerRadius={80}
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
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(
                    shareholders.reduce((acc, s) => {
                      acc[s.type] = (acc[s.type] || 0) + s.percentage
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
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-2">
                {fundingRounds.slice(-5).reverse().map((round) => (
                  <div key={round.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{round.name}</p>
                      <p className="text-sm text-gray-600">{new Date(round.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(round.amount / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-gray-600">${(round.valuation / 1000000).toFixed(1)}M valuation</p>
                    </div>
                  </div>
                ))}
                {fundingRounds.length === 0 && (
                  <p className="text-center py-8 text-gray-400">No funding rounds yet</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Shareholders Tab */}
        {activeTab === 'shareholders' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Shareholders</h2>
                </div>
                <Button onClick={addShareholder} size="sm" className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Shareholder
              </Button>
              </div>

              {shareholders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p>No shareholders yet. Add your first shareholder to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {shareholders.map((shareholder) => (
                    <Card key={shareholder.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{shareholder.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {shareholder.type}
                            </Badge>
                            {shareholder.fullyVested && (
                              <Badge variant="beginner" className="text-xs">
                                Fully Vested
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                            <div>
                              <span className="font-medium">Shares:</span> {shareholder.shares.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Ownership:</span> {shareholder.percentage.toFixed(2)}%
                            </div>
                            {shareholder.investmentAmount && (
                              <div>
                                <span className="font-medium">Investment:</span> ${(shareholder.investmentAmount / 1000).toFixed(0)}K
                              </div>
                            )}
                            {shareholder.pricePerShare && (
                              <div>
                                <span className="font-medium">Price/Share:</span> ${shareholder.pricePerShare.toFixed(2)}
                              </div>
                            )}
                          </div>
                          {shareholder.vestingSchedule && (
                            <p className="text-xs text-gray-500">Vesting: {shareholder.vestingSchedule}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingShareholder(shareholder)}
                          >
                            <Edit className="h-4 w-4" />
              </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteShareholder(shareholder.id)}
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
                              width: `${shareholder.percentage}%`,
                              backgroundColor: getTypeColor(shareholder.type)
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
                                  <span className="font-medium">Amount:</span> ${(round.amount / 1000).toFixed(0)}K
                                </div>
                                <div>
                                  <span className="font-medium">Valuation:</span> ${(round.valuation / 1000000).toFixed(1)}M
                                </div>
                                <div>
                                  <span className="font-medium">Price/Share:</span> ${round.pricePerShare.toFixed(2)}
                                </div>
                                <div>
                                  <span className="font-medium">Shares Issued:</span> {round.sharesIssued.toLocaleString()}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($) *</label>
                            <Input
                              type="number"
                              value={editingRound.amount}
                              onChange={(e) => setEditingRound({ ...editingRound, amount: parseFloat(e.target.value) || 0 })}
                              placeholder="1000000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Valuation ($) *</label>
                            <Input
                              type="number"
                              value={editingRound.valuation}
                              onChange={(e) => setEditingRound({ ...editingRound, valuation: parseFloat(e.target.value) || 0 })}
                              placeholder="10000000"
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Calculated Values:</div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Price per Share:</span> ${(editingRound.valuation / totalShares).toFixed(4)}
                            </div>
                            <div>
                              <span className="font-medium">Shares to Issue:</span> {Math.round(editingRound.amount / (editingRound.valuation / totalShares)).toLocaleString()}
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
                      {shareholders.filter(s => s.type === 'founder').map(f => `${f.name}: ${f.percentage.toFixed(2)}%`).join(', ')}
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
                                {scenario.resultingCapTable.filter(s => s.type === 'founder').map((founder) => (
                                  <div key={founder.id}>
                                    <span className="font-medium">{founder.name}:</span> {founder.percentage.toFixed(2)}%
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
                              const resulting = calculateDilution(newShares, editingScenario.newInvestors)
                              setEditingScenario({
                                ...editingScenario,
                                newShares,
                                resultingCapTable: resulting
                              })
                            }}
                            placeholder="1000000"
                          />
                        </div>
                        {editingScenario.resultingCapTable.length > 0 && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-3">Resulting Ownership:</h4>
                            <div className="space-y-2">
                              {editingScenario.resultingCapTable.map((shareholder) => (
                                <div key={shareholder.id} className="flex items-center justify-between text-sm">
                                  <span>{shareholder.name}</span>
                                  <span className="font-medium">{shareholder.percentage.toFixed(2)}%</span>
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

        {/* Option Pool Tab */}
        {activeTab === 'options' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Option Pool Management</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Option Pool Size (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={optionPoolSize}
                    onChange={(e) => {
                      const newSize = parseFloat(e.target.value) || 0
                      setOptionPoolSize(newSize)
                      saveToLocalStorage()
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 15-20% for early-stage startups
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Current Option Pool</h4>
                  <div className="text-sm text-purple-800">
                    {shareholders.find(s => s.type === 'option-pool') ? (
                      <>
                        <p>Shares: {shareholders.find(s => s.type === 'option-pool')!.shares.toLocaleString()}</p>
                        <p>Ownership: {shareholders.find(s => s.type === 'option-pool')!.percentage.toFixed(2)}%</p>
                      </>
                    ) : (
                      <p>No option pool configured</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <History className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Cap Table History</h2>
              </div>
              <div className="space-y-3">
                {fundingRounds.map((round) => (
                  <Card key={round.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold mb-1">{round.name}</h4>
                        <p className="text-sm text-gray-600">{new Date(round.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(round.amount / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-600">${(round.valuation / 1000000).toFixed(1)}M pre-money</p>
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

        {/* Edit Shareholder Modal */}
        {editingShareholder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingShareholder.id && shareholders.find(s => s.id === editingShareholder.id) ? 'Edit Shareholder' : 'New Shareholder'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingShareholder(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <Input
                      value={editingShareholder.name}
                      onChange={(e) => setEditingShareholder({ ...editingShareholder, name: e.target.value })}
                      placeholder="Shareholder name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <Select
                      value={editingShareholder.type}
                      onChange={(e) => setEditingShareholder({ ...editingShareholder, type: e.target.value as any })}
                      options={[
                        { value: 'founder', label: 'Founder' },
                        { value: 'investor', label: 'Investor' },
                        { value: 'employee', label: 'Employee' },
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
                    value={editingShareholder.shares}
                    onChange={(e) => {
                      const shares = parseFloat(e.target.value) || 0
                      const percentage = totalShares > 0 ? (shares / (totalShares + shares - (shareholders.find(s => s.id === editingShareholder.id)?.shares || 0))) * 100 : 0
                      setEditingShareholder({ ...editingShareholder, shares, percentage })
                    }}
                    placeholder="1000000"
                  />
                </div>
                {editingShareholder.type === 'investor' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($)</label>
                      <Input
                        type="number"
                        value={editingShareholder.investmentAmount || ''}
                        onChange={(e) => setEditingShareholder({ ...editingShareholder, investmentAmount: parseFloat(e.target.value) || 0 })}
                        placeholder="1000000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price per Share ($)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editingShareholder.pricePerShare || ''}
                        onChange={(e) => setEditingShareholder({ ...editingShareholder, pricePerShare: parseFloat(e.target.value) || 0 })}
                        placeholder="0.50"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vesting Schedule</label>
                  <Input
                    value={editingShareholder.vestingSchedule || ''}
                    onChange={(e) => setEditingShareholder({ ...editingShareholder, vestingSchedule: e.target.value })}
                    placeholder="e.g., 4 years with 1 year cliff"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingShareholder.fullyVested || false}
                    onChange={(e) => setEditingShareholder({ ...editingShareholder, fullyVested: e.target.checked })}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-700">Fully Vested</label>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Ownership:</div>
                  <div className="text-lg font-bold text-primary-600">
                    {editingShareholder.percentage.toFixed(2)}%
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveShareholder} className="flex-1">
                    Save Shareholder
                  </Button>
                  <Button variant="outline" onClick={() => setEditingShareholder(null)}>
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
