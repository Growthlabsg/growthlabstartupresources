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
  TrendingDown,
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
  Calendar,
  Percent,
  PieChart,
  Clock
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts'

type InvestmentType = 'marketing' | 'product' | 'infrastructure' | 'hiring' | 'technology' | 'other'

interface Investment {
  id: string
  name: string
  type: InvestmentType
  investmentAmount: number
  returnAmount: number
  timePeriod: number
  startDate: string
  roi: number
  annualizedRoi: number
  netProfit: number
  paybackPeriod: number
  notes?: string
}

interface ROIProjection {
  id: string
  name: string
  investmentAmount: number
  monthlyReturn: number
  growthRate: number
  months: number
  projections: { month: number; cumulativeReturn: number; roi: number }[]
}

export default function ROICalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [investment, setInvestment] = useState('')
  const [returnAmount, setReturnAmount] = useState('')
  const [timePeriod, setTimePeriod] = useState('12')
  const [roi, setRoi] = useState<number | null>(null)
  const [annualizedRoi, setAnnualizedRoi] = useState<number | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null)
  const [projections, setProjections] = useState<ROIProjection[]>([])
  const [editingProjection, setEditingProjection] = useState<ROIProjection | null>(null)

  const tabs = [
    { id: 'calculator', label: 'ROI Calculator', icon: Calculator },
    { id: 'investments', label: 'Investments', icon: DollarSign },
    { id: 'projections', label: 'Projections', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('roiCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.investments) setInvestments(data.investments)
          if (data.projections) setProjections(data.projections)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        investments,
        projections,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('roiCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const calculateROI = (inv: number, ret: number) => {
    if (inv === 0) return 0
    return ((ret - inv) / inv) * 100
  }

  const calculateAnnualizedROI = (inv: number, ret: number, months: number) => {
    if (inv === 0 || months === 0) return 0
    const years = months / 12
    if (years <= 0) return 0
    return (Math.pow(ret / inv, 1 / years) - 1) * 100
  }

  const calculatePaybackPeriod = (inv: number, monthlyReturn: number) => {
    if (monthlyReturn <= 0) return Infinity
    return inv / monthlyReturn
  }

  const calculate = () => {
    const inv = parseFloat(investment)
    const ret = parseFloat(returnAmount)
    const period = parseFloat(timePeriod)
    
    if (!inv || !ret || !period || inv === 0) {
      showToast('Please enter valid values', 'error')
      return
    }

    const calculatedROI = calculateROI(inv, ret)
    const annualized = calculateAnnualizedROI(inv, ret, period)

    setRoi(calculatedROI)
    setAnnualizedRoi(annualized)
    showToast('ROI calculated!', 'success')
  }

  const addInvestment = () => {
    const newInvestment: Investment = {
      id: Date.now().toString(),
      name: '',
      type: 'marketing',
      investmentAmount: 0,
      returnAmount: 0,
      timePeriod: 12,
      startDate: new Date().toISOString().split('T')[0],
      roi: 0,
      annualizedRoi: 0,
      netProfit: 0,
      paybackPeriod: 0
    }
    setEditingInvestment(newInvestment)
  }

  const saveInvestment = () => {
    if (!editingInvestment) return
    if (!editingInvestment.name || editingInvestment.investmentAmount <= 0 || editingInvestment.returnAmount < 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const calculatedROI = calculateROI(editingInvestment.investmentAmount, editingInvestment.returnAmount)
    const annualized = calculateAnnualizedROI(editingInvestment.investmentAmount, editingInvestment.returnAmount, editingInvestment.timePeriod)
    const netProfit = editingInvestment.returnAmount - editingInvestment.investmentAmount
    const monthlyReturn = editingInvestment.returnAmount / editingInvestment.timePeriod
    const paybackPeriod = calculatePaybackPeriod(editingInvestment.investmentAmount, monthlyReturn)

    const updatedInvestment = {
      ...editingInvestment,
      roi: calculatedROI,
      annualizedRoi: annualized,
      netProfit,
      paybackPeriod
    }

    const updated = investments.find(i => i.id === updatedInvestment.id)
      ? investments.map(i => i.id === updatedInvestment.id ? updatedInvestment : i)
      : [...investments, updatedInvestment]

    setInvestments(updated)
    setEditingInvestment(null)
    saveToLocalStorage()
    showToast('Investment saved!', 'success')
  }

  const deleteInvestment = (id: string) => {
    if (confirm('Are you sure you want to delete this investment?')) {
      const updated = investments.filter(i => i.id !== id)
      setInvestments(updated)
      saveToLocalStorage()
      showToast('Investment deleted', 'info')
    }
  }

  const createProjection = () => {
    const newProjection: ROIProjection = {
      id: Date.now().toString(),
      name: 'New Projection',
      investmentAmount: parseFloat(investment) || 0,
      monthlyReturn: 0,
      growthRate: 0,
      months: 12,
      projections: []
    }
    calculateProjection(newProjection)
    setEditingProjection(newProjection)
  }

  const calculateProjection = (projection: ROIProjection) => {
    const projections: { month: number; cumulativeReturn: number; roi: number }[] = []
    let cumulativeReturn = 0
    let currentMonthlyReturn = projection.monthlyReturn

    for (let month = 1; month <= projection.months; month++) {
      cumulativeReturn += currentMonthlyReturn
      const roi = projection.investmentAmount > 0 ? calculateROI(projection.investmentAmount, cumulativeReturn) : 0
      projections.push({ month, cumulativeReturn, roi })
      
      if (projection.growthRate > 0) {
        currentMonthlyReturn = currentMonthlyReturn * (1 + projection.growthRate / 100)
      }
    }

    projection.projections = projections
  }

  const saveProjection = () => {
    if (!editingProjection) return
    if (!editingProjection.name || editingProjection.investmentAmount <= 0 || editingProjection.monthlyReturn <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    calculateProjection(editingProjection)
    const updated = projections.find(p => p.id === editingProjection.id)
      ? projections.map(p => p.id === editingProjection.id ? editingProjection : p)
      : [...projections, editingProjection]

    setProjections(updated)
    setEditingProjection(null)
    saveToLocalStorage()
    showToast('Projection saved!', 'success')
  }

  const deleteProjection = (id: string) => {
    if (confirm('Are you sure you want to delete this projection?')) {
      const updated = projections.filter(p => p.id !== id)
      setProjections(updated)
      saveToLocalStorage()
      showToast('Projection deleted', 'info')
    }
  }

  const exportData = () => {
    const data = {
      currentCalculation: {
        investment: parseFloat(investment) || 0,
        returnAmount: parseFloat(returnAmount) || 0,
        timePeriod: parseFloat(timePeriod) || 0,
        roi,
        annualizedRoi
      },
      investments,
      projections,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roi-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported!', 'success')
  }

  const investmentTypeLabels: Record<InvestmentType, string> = {
    'marketing': 'Marketing',
    'product': 'Product Development',
    'infrastructure': 'Infrastructure',
    'hiring': 'Hiring',
    'technology': 'Technology',
    'other': 'Other'
  }

  const investmentTypeColors: Record<InvestmentType, string> = {
    'marketing': '#3b82f6',
    'product': '#10b981',
    'infrastructure': '#f59e0b',
    'hiring': '#8b5cf6',
    'technology': '#ec4899',
    'other': '#6b7280'
  }

  const investmentChartData = investments.map(i => ({
    name: i.name,
    roi: i.roi,
    annualizedRoi: i.annualizedRoi,
    netProfit: i.netProfit
  }))

  const investmentByType = investments.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.investmentAmount
    return acc
  }, {} as Record<InvestmentType, number>)

  const roiHistory = investments.map(i => ({
    name: i.name,
    roi: i.roi,
    month: new Date(i.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }))

  const totalInvestment = investments.reduce((sum, i) => sum + i.investmentAmount, 0)
  const totalReturn = investments.reduce((sum, i) => sum + i.returnAmount, 0)
  const totalROI = totalInvestment > 0 ? calculateROI(totalInvestment, totalReturn) : 0
  const averageROI = investments.length > 0 ? investments.reduce((sum, i) => sum + i.roi, 0) / investments.length : 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                ROI Calculator
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate Return on Investment, track investments, and project future returns
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
                <div className="text-sm text-gray-600 mb-1">ROI</div>
                <div className={`text-2xl font-bold ${roi !== null && roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {roi !== null ? `${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%` : '0%'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Annualized ROI</div>
                <div className="text-2xl font-bold text-primary-600">
                  {annualizedRoi !== null ? `${annualizedRoi >= 0 ? '+' : ''}${annualizedRoi.toFixed(2)}%` : '0%'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Net Profit</div>
                <div className={`text-2xl font-bold ${investment && returnAmount && parseFloat(returnAmount) - parseFloat(investment) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {investment && returnAmount ? `$${(parseFloat(returnAmount) - parseFloat(investment)).toLocaleString()}` : '$0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Investment</div>
                <div className="text-2xl font-bold">
                  {investment ? `$${(parseFloat(investment) / 1000).toFixed(0)}K` : '$0'}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary-500" />
                  ROI Calculator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Initial Investment ($) *</label>
                    <Input
                      type="number"
                      value={investment}
                      onChange={(e) => setInvestment(e.target.value)}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Amount ($) *</label>
                    <Input
                      type="number"
                      value={returnAmount}
                      onChange={(e) => setReturnAmount(e.target.value)}
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (months) *</label>
                    <Input
                      type="number"
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(e.target.value)}
                      placeholder="12"
                    />
                  </div>
                  <Button onClick={calculate} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate ROI
                  </Button>
                  {roi !== null && (
                    <div className="bg-primary-500/10 border-2 border-primary-500/20 rounded-lg p-6 space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">ROI</p>
                        <p className={`text-3xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Annualized ROI</p>
                        <p className="text-2xl font-bold text-primary-600">
                          {annualizedRoi !== null ? `${annualizedRoi >= 0 ? '+' : ''}${annualizedRoi.toFixed(2)}%` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Net Profit/Loss</p>
                        <p className={`text-2xl font-bold ${parseFloat(returnAmount) - parseFloat(investment) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${(parseFloat(returnAmount) - parseFloat(investment)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary-500" />
                  About ROI
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Return on Investment (ROI)</strong> measures the efficiency of an investment by comparing the return to the cost.
                  </p>
                  <p>
                    <strong>Formula:</strong> ROI = ((Return - Investment) / Investment) × 100%
                  </p>
                  <p>
                    <strong>Annualized ROI</strong> adjusts ROI for the time period, allowing comparison across different investment durations.
                  </p>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-yellow-900 mb-1">Best Practices</div>
                        <ul className="text-xs text-yellow-800 space-y-1">
                          <li>• Aim for ROI &gt;20% for most investments</li>
                          <li>• Track ROI by investment type</li>
                          <li>• Monitor payback period</li>
                          <li>• Compare annualized ROI across investments</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Investments Tab */}
        {activeTab === 'investments' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Investment Tracking</h2>
                </div>
                <Button onClick={addInvestment} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Investment
                </Button>
              </div>

              {investments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <DollarSign className="h-16 w-16 mx-auto mb-4" />
                  <p>No investments yet. Add investments to track ROI over time.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Total Investment</div>
                      <div className="text-2xl font-bold">${(totalInvestment / 1000).toFixed(0)}K</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Total Return</div>
                      <div className="text-2xl font-bold text-green-600">${(totalReturn / 1000).toFixed(0)}K</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Total ROI</div>
                      <div className={`text-2xl font-bold ${totalROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(2)}%
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Average ROI</div>
                      <div className={`text-2xl font-bold ${averageROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {averageROI >= 0 ? '+' : ''}{averageROI.toFixed(2)}%
                      </div>
                    </Card>
                  </div>

                  {investmentChartData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">ROI by Investment</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={investmentChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="roi" fill="#3b82f6" name="ROI (%)" />
                          <Bar dataKey="annualizedRoi" fill="#10b981" name="Annualized ROI (%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  {Object.keys(investmentByType).length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Investment by Type</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={Object.entries(investmentByType).map(([type, value]) => ({
                              name: investmentTypeLabels[type as InvestmentType],
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
                            {Object.entries(investmentByType).map(([type], index) => (
                              <Cell key={`cell-${index}`} fill={investmentTypeColors[type as InvestmentType]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {investments.map((inv) => (
                      <Card key={inv.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{inv.name}</h4>
                              <Badge variant="outline" className="text-xs">{investmentTypeLabels[inv.type]}</Badge>
                              <Badge 
                                variant={inv.roi >= 20 ? 'beginner' : inv.roi >= 0 ? 'warning' : 'error'}
                                className="text-xs"
                              >
                                {inv.roi >= 0 ? '+' : ''}{inv.roi.toFixed(1)}% ROI
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Investment:</span> ${(inv.investmentAmount / 1000).toFixed(0)}K
                              </div>
                              <div>
                                <span className="font-medium">Return:</span> ${(inv.returnAmount / 1000).toFixed(0)}K
                              </div>
                              <div>
                                <span className="font-medium">ROI:</span> {inv.roi >= 0 ? '+' : ''}{inv.roi.toFixed(1)}%
                              </div>
                              <div>
                                <span className="font-medium">Annualized:</span> {inv.annualizedRoi >= 0 ? '+' : ''}{inv.annualizedRoi.toFixed(1)}%
                              </div>
                              <div>
                                <span className="font-medium">Payback:</span> {inv.paybackPeriod === Infinity ? 'N/A' : `${inv.paybackPeriod.toFixed(1)} months`}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingInvestment(inv)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteInvestment(inv.id)}
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

        {/* Projections Tab */}
        {activeTab === 'projections' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">ROI Projections</h2>
                </div>
                <Button onClick={createProjection} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Projection
                </Button>
              </div>

              {projections.length === 0 && !editingProjection ? (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <p>No projections yet. Create projections to model future ROI.</p>
                </div>
              ) : (
                <>
                  {projections.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {projections.map((projection) => (
                        <Card key={projection.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{projection.name}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Investment:</span> ${(projection.investmentAmount / 1000).toFixed(0)}K
                                </div>
                                <div>
                                  <span className="font-medium">Monthly Return:</span> ${(projection.monthlyReturn / 1000).toFixed(0)}K
                                </div>
                                <div>
                                  <span className="font-medium">Growth Rate:</span> {projection.growthRate}%/mo
                                </div>
                                <div>
                                  <span className="font-medium">Final ROI:</span> {projection.projections.length > 0 
                                    ? `${projection.projections[projection.projections.length - 1].roi >= 0 ? '+' : ''}${projection.projections[projection.projections.length - 1].roi.toFixed(1)}%`
                                    : 'N/A'}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingProjection(projection)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteProjection(projection.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {editingProjection && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Edit Projection</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingProjection(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Projection Name *</label>
                          <Input
                            value={editingProjection.name}
                            onChange={(e) => setEditingProjection({ ...editingProjection, name: e.target.value })}
                            placeholder="e.g., Marketing Campaign Q1"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($) *</label>
                            <Input
                              type="number"
                              value={editingProjection.investmentAmount}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const updated = { ...editingProjection, investmentAmount: val }
                                calculateProjection(updated)
                                setEditingProjection(updated)
                              }}
                              placeholder="10000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Return ($) *</label>
                            <Input
                              type="number"
                              value={editingProjection.monthlyReturn}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const updated = { ...editingProjection, monthlyReturn: val }
                                calculateProjection(updated)
                                setEditingProjection(updated)
                              }}
                              placeholder="1000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Growth Rate (%/mo)</label>
                            <Input
                              type="number"
                              step="0.1"
                              value={editingProjection.growthRate}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const updated = { ...editingProjection, growthRate: val }
                                calculateProjection(updated)
                                setEditingProjection(updated)
                              }}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Projection Period (months) *</label>
                            <Input
                              type="number"
                              value={editingProjection.months}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 12
                                const updated = { ...editingProjection, months: val }
                                calculateProjection(updated)
                                setEditingProjection(updated)
                              }}
                              placeholder="12"
                            />
                          </div>
                        </div>
                        {editingProjection.projections.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3">ROI Projection Chart</h4>
                            <ResponsiveContainer width="100%" height={300}>
                              <AreaChart data={editingProjection.projections}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="roi" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="ROI (%)" />
                                <Line type="monotone" dataKey="cumulativeReturn" stroke="#10b981" name="Cumulative Return ($)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button onClick={saveProjection} className="flex-1">
                            Save Projection
                          </Button>
                          <Button variant="outline" onClick={() => setEditingProjection(null)}>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Investments</div>
                <div className="text-2xl font-bold">{investments.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Investment</div>
                <div className="text-2xl font-bold">${(totalInvestment / 1000).toFixed(0)}K</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Return</div>
                <div className="text-2xl font-bold text-green-600">${(totalReturn / 1000).toFixed(0)}K</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Average ROI</div>
                <div className={`text-2xl font-bold ${averageROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {averageROI >= 0 ? '+' : ''}{averageROI.toFixed(1)}%
                </div>
              </Card>
            </div>

            {roiHistory.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">ROI Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={roiHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="roi" stroke="#3b82f6" name="ROI (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {Object.keys(investmentByType).length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">ROI by Investment Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(investmentByType).map(([type, amount]) => {
                    const typeInvestments = investments.filter(i => i.type === type)
                    const typeReturn = typeInvestments.reduce((sum, i) => sum + i.returnAmount, 0)
                    const typeROI = amount > 0 ? calculateROI(amount, typeReturn) : 0
                    return {
                      type: investmentTypeLabels[type as InvestmentType],
                      roi: typeROI,
                      investment: amount
                    }
                  })}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="roi" fill="#3b82f6" name="ROI (%)" />
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
                <h2 className="text-2xl font-bold">Investment History</h2>
              </div>
              {investments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No investment history yet. Add investments to build history.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {investments.map((inv) => (
                    <Card key={inv.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{inv.name}</h4>
                          <p className="text-sm text-gray-600">
                            {investmentTypeLabels[inv.type]} • {new Date(inv.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${inv.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {inv.roi >= 0 ? '+' : ''}{inv.roi.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-600">ROI</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Edit Investment Modal */}
        {editingInvestment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Investment</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingInvestment(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Name *</label>
                  <Input
                    value={editingInvestment.name}
                    onChange={(e) => setEditingInvestment({ ...editingInvestment, name: e.target.value })}
                    placeholder="e.g., Marketing Campaign Q1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Type *</label>
                  <Select
                    value={editingInvestment.type}
                    onChange={(e) => setEditingInvestment({ ...editingInvestment, type: e.target.value as InvestmentType })}
                    options={[
                      { value: 'marketing', label: 'Marketing' },
                      { value: 'product', label: 'Product Development' },
                      { value: 'infrastructure', label: 'Infrastructure' },
                      { value: 'hiring', label: 'Hiring' },
                      { value: 'technology', label: 'Technology' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($) *</label>
                    <Input
                      type="number"
                      value={editingInvestment.investmentAmount}
                      onChange={(e) => setEditingInvestment({ ...editingInvestment, investmentAmount: parseFloat(e.target.value) || 0 })}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Amount ($) *</label>
                    <Input
                      type="number"
                      value={editingInvestment.returnAmount}
                      onChange={(e) => setEditingInvestment({ ...editingInvestment, returnAmount: parseFloat(e.target.value) || 0 })}
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (months) *</label>
                    <Input
                      type="number"
                      value={editingInvestment.timePeriod}
                      onChange={(e) => setEditingInvestment({ ...editingInvestment, timePeriod: parseInt(e.target.value) || 0 })}
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <Input
                      type="date"
                      value={editingInvestment.startDate}
                      onChange={(e) => setEditingInvestment({ ...editingInvestment, startDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingInvestment.notes || ''}
                    onChange={(e) => setEditingInvestment({ ...editingInvestment, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                {editingInvestment.investmentAmount > 0 && editingInvestment.returnAmount >= 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">ROI:</div>
                        <div className={`font-bold ${calculateROI(editingInvestment.investmentAmount, editingInvestment.returnAmount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {calculateROI(editingInvestment.investmentAmount, editingInvestment.returnAmount) >= 0 ? '+' : ''}
                          {calculateROI(editingInvestment.investmentAmount, editingInvestment.returnAmount).toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Annualized ROI:</div>
                        <div className="font-bold text-primary-600">
                          {calculateAnnualizedROI(editingInvestment.investmentAmount, editingInvestment.returnAmount, editingInvestment.timePeriod) >= 0 ? '+' : ''}
                          {calculateAnnualizedROI(editingInvestment.investmentAmount, editingInvestment.returnAmount, editingInvestment.timePeriod).toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Net Profit:</div>
                        <div className={`font-bold ${editingInvestment.returnAmount - editingInvestment.investmentAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${(editingInvestment.returnAmount - editingInvestment.investmentAmount).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Payback Period:</div>
                        <div className="font-bold">
                          {editingInvestment.timePeriod > 0 && editingInvestment.returnAmount > 0
                            ? `${calculatePaybackPeriod(editingInvestment.investmentAmount, editingInvestment.returnAmount / editingInvestment.timePeriod).toFixed(1)} months`
                            : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={saveInvestment} className="flex-1">
                    Save Investment
                  </Button>
                  <Button variant="outline" onClick={() => setEditingInvestment(null)}>
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
