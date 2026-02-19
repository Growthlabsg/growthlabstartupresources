'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  Calculator,
  Sparkles,
  Download,
  Save,
  Share2,
  Target,
  PieChart as PieChartIcon,
  LineChart,
  Activity,
  Building2,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  BarChart3,
  TrendingDown,
  Award,
  Shield,
  Lightbulb
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart as RechartsLineChart, Line, AreaChart, Area } from 'recharts'

interface ValuationResult {
  method: string
  value: number
  confidence: 'high' | 'medium' | 'low'
  assumptions: string[]
}

interface Scenario {
  name: string
  revenue: number
  multiple: number
  valuation: number
}

interface IndustryBenchmark {
  industry: string
  avgMultiple: number
  range: string
  stage: string
}

export default function ValuationCalculatorPage() {
  const [activeTab, setActiveTab] = useState('revenue')
  const [savedValuations, setSavedValuations] = useState<ValuationResult[]>([])
  
  // Revenue Multiple inputs
  const [revenue, setRevenue] = useState('')
  const [revenueMultiple, setRevenueMultiple] = useState('5')
  const [industry, setIndustry] = useState('SaaS')
  const [revenueValuation, setRevenueValuation] = useState<number | null>(null)
  
  // Comparable Companies inputs
  const [comparableRevenue, setComparableRevenue] = useState('')
  const [comparableValuation, setComparableValuation] = useState('')
  const [comparableMultiple, setComparableMultiple] = useState<number | null>(null)
  const [comparableResult, setComparableResult] = useState<number | null>(null)
  
  // DCF inputs
  const [dcfRevenue, setDcfRevenue] = useState('')
  const [dcfGrowthRate, setDcfGrowthRate] = useState('20')
  const [dcfDiscountRate, setDcfDiscountRate] = useState('15')
  const [dcfTerminalMultiple, setDcfTerminalMultiple] = useState('10')
  const [dcfYears, setDcfYears] = useState('5')
  const [dcfResult, setDcfResult] = useState<number | null>(null)
  
  // Scorecard inputs
  const [scorecardBaseValue, setScorecardBaseValue] = useState('1000000')
  const [scorecardFactors, setScorecardFactors] = useState({
    strength: 100,
    market: 100,
    competition: 100,
    technology: 100,
    marketing: 100,
    need: 100
  })
  const [scorecardResult, setScorecardResult] = useState<number | null>(null)
  
  // Scenario Analysis
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  
  // All valuations for comparison
  const [allValuations, setAllValuations] = useState<ValuationResult[]>([])

  const tabs = [
    { id: 'revenue', label: 'Revenue Multiple', icon: TrendingUp },
    { id: 'comparable', label: 'Comparable Companies', icon: Building2 },
    { id: 'dcf', label: 'DCF Analysis', icon: Calculator },
    { id: 'scorecard', label: 'Scorecard Method', icon: Award },
    { id: 'scenarios', label: 'Scenario Analysis', icon: Target },
    { id: 'comparison', label: 'Valuation Comparison', icon: BarChart3 },
    { id: 'benchmarks', label: 'Industry Benchmarks', icon: Activity },
  ]

  const industries = [
    { value: 'SaaS', label: 'SaaS', multiple: 8 },
    { value: 'FinTech', label: 'FinTech', multiple: 6 },
    { value: 'E-commerce', label: 'E-commerce', multiple: 3 },
    { value: 'HealthTech', label: 'HealthTech', multiple: 7 },
    { value: 'EdTech', label: 'EdTech', multiple: 5 },
    { value: 'Marketplace', label: 'Marketplace', multiple: 4 },
    { value: 'Consumer', label: 'Consumer', multiple: 2 },
    { value: 'Enterprise', label: 'Enterprise', multiple: 6 },
  ]

  const industryBenchmarks: IndustryBenchmark[] = [
    { industry: 'SaaS', avgMultiple: 8, range: '5-12x', stage: 'Series A' },
    { industry: 'FinTech', avgMultiple: 6, range: '4-10x', stage: 'Series A' },
    { industry: 'E-commerce', avgMultiple: 3, range: '2-5x', stage: 'Series A' },
    { industry: 'HealthTech', avgMultiple: 7, range: '5-12x', stage: 'Series A' },
    { industry: 'EdTech', avgMultiple: 5, range: '3-8x', stage: 'Series A' },
    { industry: 'Marketplace', avgMultiple: 4, range: '2-7x', stage: 'Series A' },
  ]

  const scorecardFactorsList = [
    { key: 'strength', label: 'Strength of Management Team', max: 150 },
    { key: 'market', label: 'Size of Opportunity', max: 150 },
    { key: 'competition', label: 'Competitive Environment', max: 100 },
    { key: 'technology', label: 'Technology/Product', max: 150 },
    { key: 'marketing', label: 'Marketing/Sales Channels', max: 100 },
    { key: 'need', label: 'Need for Additional Funding', max: 100 },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('valuationCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.savedValuations) setSavedValuations(data.savedValuations)
          if (data.allValuations) setAllValuations(data.allValuations)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('valuationCalculatorData') || '{}')
      data[key] = value
      localStorage.setItem('valuationCalculatorData', JSON.stringify(data))
    }
  }

  const calculateRevenueMultiple = () => {
    if (!revenue) {
      showToast('Please enter revenue', 'error')
      return
    }

    const rev = parseFloat(revenue)
    const multiple = parseFloat(revenueMultiple)
    const valuation = rev * multiple

    setRevenueValuation(valuation)
    
    const result: ValuationResult = {
      method: `Revenue Multiple (${multiple}x)`,
      value: valuation,
      confidence: 'medium',
      assumptions: [`${multiple}x revenue multiple`, `Industry: ${industry}`]
    }
    
    addValuationResult(result)
    showToast('Valuation calculated!', 'success')
  }

  const calculateComparable = () => {
    if (!comparableRevenue || !comparableValuation) {
      showToast('Please enter both revenue and valuation', 'error')
      return
    }

    const compRev = parseFloat(comparableRevenue)
    const compVal = parseFloat(comparableValuation)
    const multiple = compVal / compRev

    setComparableMultiple(multiple)
    
    // Apply to your revenue
    const yourRevenue = parseFloat(revenue) || compRev
    const valuation = yourRevenue * multiple

    setComparableResult(valuation)
    
    const result: ValuationResult = {
      method: 'Comparable Companies',
      value: valuation,
      confidence: 'high',
      assumptions: [`Comparable multiple: ${multiple.toFixed(2)}x`, `Based on similar company analysis`]
    }
    
    addValuationResult(result)
    showToast('Comparable valuation calculated!', 'success')
  }

  const calculateDCF = () => {
    if (!dcfRevenue) {
      showToast('Please enter revenue', 'error')
      return
    }

    const rev = parseFloat(dcfRevenue)
    const growth = parseFloat(dcfGrowthRate) / 100
    const discount = parseFloat(dcfDiscountRate) / 100
    const terminal = parseFloat(dcfTerminalMultiple)
    const years = parseInt(dcfYears)

    // Simplified DCF calculation
    let pvCashFlows = 0
    let currentRevenue = rev

    for (let i = 1; i <= years; i++) {
      currentRevenue = currentRevenue * (1 + growth)
      const cashFlow = currentRevenue * 0.2 // Assume 20% margin
      const pv = cashFlow / Math.pow(1 + discount, i)
      pvCashFlows += pv
    }

    // Terminal value
    const terminalRevenue = currentRevenue * (1 + growth)
    const terminalValue = (terminalRevenue * terminal) / Math.pow(1 + discount, years)

    const valuation = pvCashFlows + terminalValue

    setDcfResult(valuation)
    
    const result: ValuationResult = {
      method: 'Discounted Cash Flow',
      value: valuation,
      confidence: 'high',
      assumptions: [
        `Growth rate: ${dcfGrowthRate}%`,
        `Discount rate: ${dcfDiscountRate}%`,
        `Terminal multiple: ${terminal}x`,
        `Projection period: ${years} years`
      ]
    }
    
    addValuationResult(result)
    showToast('DCF valuation calculated!', 'success')
  }

  const calculateScorecard = () => {
    if (!scorecardBaseValue) {
      showToast('Please enter base value', 'error')
      return
    }

    const base = parseFloat(scorecardBaseValue)
    const factor = (
      scorecardFactors.strength / 100 *
      scorecardFactors.market / 100 *
      scorecardFactors.competition / 100 *
      scorecardFactors.technology / 100 *
      scorecardFactors.marketing / 100 *
      scorecardFactors.need / 100
    )

    const valuation = base * factor

    setScorecardResult(valuation)
    
    const result: ValuationResult = {
      method: 'Scorecard Method',
      value: valuation,
      confidence: 'medium',
      assumptions: [
        `Base value: $${base.toLocaleString()}`,
        `Adjusted by factor scores`
      ]
    }
    
    addValuationResult(result)
    showToast('Scorecard valuation calculated!', 'success')
  }

  const addValuationResult = (result: ValuationResult) => {
    const updated = [...allValuations, result]
    setAllValuations(updated)
    saveToLocalStorage('allValuations', updated)
  }

  const saveValuation = (result: ValuationResult) => {
    const updated = [...savedValuations, result]
    setSavedValuations(updated)
    saveToLocalStorage('savedValuations', updated)
    showToast('Valuation saved!', 'success')
  }

  const deleteValuation = (index: number) => {
    const updated = savedValuations.filter((_, i) => i !== index)
    setSavedValuations(updated)
    saveToLocalStorage('savedValuations', updated)
    showToast('Valuation deleted', 'success')
  }

  const calculateScenarios = () => {
    if (!revenue) {
      showToast('Please enter base revenue first', 'error')
      return
    }

    const baseRev = parseFloat(revenue)
    const selectedIndustry = industries.find(i => i.value === industry)
    const baseMultiple = selectedIndustry?.multiple || 5

    const newScenarios: Scenario[] = [
      {
        name: 'Best Case',
        revenue: baseRev * 1.5,
        multiple: baseMultiple * 1.2,
        valuation: baseRev * 1.5 * baseMultiple * 1.2
      },
      {
        name: 'Base Case',
        revenue: baseRev,
        multiple: baseMultiple,
        valuation: baseRev * baseMultiple
      },
      {
        name: 'Worst Case',
        revenue: baseRev * 0.7,
        multiple: baseMultiple * 0.8,
        valuation: baseRev * 0.7 * baseMultiple * 0.8
      }
    ]

    setScenarios(newScenarios)
    showToast('Scenarios calculated!', 'success')
  }

  const exportData = () => {
    const data = {
      savedValuations,
      allValuations,
      scenarios,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `valuation-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  const valuationComparisonData = allValuations.map((v, idx) => ({
    method: v.method.split(' ')[0],
    value: v.value,
    index: idx
  }))

  const avgValuation = allValuations.length > 0
    ? allValuations.reduce((sum, v) => sum + v.value, 0) / allValuations.length
    : 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
              Valuation Calculator
            </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your startup valuation using multiple methodologies and compare results across different approaches.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportData} className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Revenue Multiple Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
          <Card>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Revenue Multiple Method</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Calculate valuation based on revenue multiples. Industry-specific multiples are provided as defaults.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual Revenue ($)</label>
                    <Input
                      type="number"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      placeholder="e.g., 1000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <Select
                      value={industry}
                      onChange={(e) => {
                        setIndustry(e.target.value)
                        const selected = industries.find(i => i.value === e.target.value)
                        if (selected) setRevenueMultiple(selected.multiple.toString())
                      }}
                      options={industries.map(i => ({ value: i.value, label: `${i.label} (${i.multiple}x)` }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Multiple</label>
                    <Input
                      type="number"
                      value={revenueMultiple}
                      onChange={(e) => setRevenueMultiple(e.target.value)}
                      placeholder="e.g., 5"
                      step="0.1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Industry average: {industries.find(i => i.value === industry)?.multiple}x
                    </p>
                  </div>
                  <Button onClick={calculateRevenueMultiple} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Valuation
                  </Button>
                </div>

                {revenueValuation !== null && (
                  <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Estimated Valuation</p>
                      <p className="text-4xl font-bold text-primary-600 mb-4">
                        ${revenueValuation.toLocaleString()}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Revenue:</span>
                          <span className="font-medium">${parseFloat(revenue).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Multiple:</span>
                          <span className="font-medium">{revenueMultiple}x</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Industry:</span>
                          <span className="font-medium">{industry}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full"
                        onClick={() => saveValuation({
                          method: `Revenue Multiple (${revenueMultiple}x)`,
                          value: revenueValuation,
                          confidence: 'medium',
                          assumptions: [`${revenueMultiple}x revenue multiple`, `Industry: ${industry}`]
                        })}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Valuation
            </Button>
                    </div>
                  </Card>
                )}
              </div>
          </Card>
          </div>
        )}

        {/* Comparable Companies Tab */}
        {activeTab === 'comparable' && (
          <div className="space-y-6">
          <Card>
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Comparable Companies Analysis</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Calculate valuation by comparing with similar companies in your industry.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comparable Company Revenue ($)</label>
                    <Input
                      type="number"
                      value={comparableRevenue}
                      onChange={(e) => setComparableRevenue(e.target.value)}
                      placeholder="e.g., 5000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comparable Company Valuation ($)</label>
                    <Input
                      type="number"
                      value={comparableValuation}
                      onChange={(e) => setComparableValuation(e.target.value)}
                      placeholder="e.g., 25000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Company Revenue ($)</label>
                    <Input
                      type="number"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      placeholder="e.g., 1000000"
                    />
                  </div>
                  <Button onClick={calculateComparable} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Valuation
                  </Button>
                </div>

                {comparableResult !== null && (
                  <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Estimated Valuation</p>
                      <p className="text-4xl font-bold text-primary-600 mb-4">
                        ${comparableResult.toLocaleString()}
                      </p>
                      {comparableMultiple !== null && (
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Comparable Multiple:</span>
                            <span className="font-medium">{comparableMultiple.toFixed(2)}x</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Your Revenue:</span>
                            <span className="font-medium">${parseFloat(revenue || comparableRevenue).toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full"
                        onClick={() => saveValuation({
                          method: 'Comparable Companies',
                          value: comparableResult,
                          confidence: 'high',
                          assumptions: [`Comparable multiple: ${comparableMultiple?.toFixed(2)}x`, `Based on similar company analysis`]
                        })}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Valuation
            </Button>
                    </div>
                  </Card>
                )}
              </div>
          </Card>
          </div>
        )}

        {/* DCF Analysis Tab */}
        {activeTab === 'dcf' && (
          <div className="space-y-6">
          <Card>
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Discounted Cash Flow (DCF) Analysis</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Calculate valuation based on projected future cash flows discounted to present value.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Annual Revenue ($)</label>
                    <Input
                      type="number"
                      value={dcfRevenue}
                      onChange={(e) => setDcfRevenue(e.target.value)}
                      placeholder="e.g., 1000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual Growth Rate (%)</label>
                    <Input
                      type="number"
                      value={dcfGrowthRate}
                      onChange={(e) => setDcfGrowthRate(e.target.value)}
                      placeholder="e.g., 20"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Rate (%)</label>
                    <Input
                      type="number"
                      value={dcfDiscountRate}
                      onChange={(e) => setDcfDiscountRate(e.target.value)}
                      placeholder="e.g., 15"
                      step="0.1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typical range: 10-25%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Terminal Multiple</label>
                    <Input
                      type="number"
                      value={dcfTerminalMultiple}
                      onChange={(e) => setDcfTerminalMultiple(e.target.value)}
                      placeholder="e.g., 10"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Projection Period (Years)</label>
                    <Input
                      type="number"
                      value={dcfYears}
                      onChange={(e) => setDcfYears(e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <Button onClick={calculateDCF} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate DCF Valuation
                  </Button>
                </div>

                {dcfResult !== null && (
                  <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">DCF Valuation</p>
                      <p className="text-4xl font-bold text-primary-600 mb-4">
                        ${dcfResult.toLocaleString()}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Growth Rate:</span>
                          <span className="font-medium">{dcfGrowthRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount Rate:</span>
                          <span className="font-medium">{dcfDiscountRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Projection Period:</span>
                          <span className="font-medium">{dcfYears} years</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full"
                        onClick={() => saveValuation({
                          method: 'Discounted Cash Flow',
                          value: dcfResult,
                          confidence: 'high',
                          assumptions: [
                            `Growth rate: ${dcfGrowthRate}%`,
                            `Discount rate: ${dcfDiscountRate}%`,
                            `Terminal multiple: ${dcfTerminalMultiple}x`,
                            `Projection period: ${dcfYears} years`
                          ]
                        })}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Valuation
            </Button>
                    </div>
                  </Card>
                )}
              </div>
          </Card>
        </div>
        )}

        {/* Scorecard Method Tab */}
        {activeTab === 'scorecard' && (
          <div className="space-y-6">
        <Card>
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Scorecard Method</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Adjust a base valuation using factor scores for different aspects of your startup.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Valuation ($)</label>
                    <Input
                      type="number"
                      value={scorecardBaseValue}
                      onChange={(e) => setScorecardBaseValue(e.target.value)}
                      placeholder="e.g., 1000000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typical base: $500K - $2M for seed stage</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Factor Scores (0-150%)</h4>
                    {scorecardFactorsList.map((factor) => (
                      <div key={factor.key}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm text-gray-700">{factor.label}</label>
                          <span className="text-sm font-medium">{scorecardFactors[factor.key as keyof typeof scorecardFactors]}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={factor.max}
                          value={scorecardFactors[factor.key as keyof typeof scorecardFactors]}
                          onChange={(e) => setScorecardFactors({
                            ...scorecardFactors,
                            [factor.key]: parseInt(e.target.value)
                          })}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>

                  <Button onClick={calculateScorecard} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Scorecard Valuation
                  </Button>
                </div>

                {scorecardResult !== null && (
                  <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Scorecard Valuation</p>
                      <p className="text-4xl font-bold text-primary-600 mb-4">
                        ${scorecardResult.toLocaleString()}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Base Value:</span>
                          <span className="font-medium">${parseFloat(scorecardBaseValue).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Adjustment Factor:</span>
                          <span className="font-medium">
                            {((scorecardFactors.strength / 100 * scorecardFactors.market / 100 * scorecardFactors.competition / 100 * scorecardFactors.technology / 100 * scorecardFactors.marketing / 100 * scorecardFactors.need / 100) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full"
                        onClick={() => saveValuation({
                          method: 'Scorecard Method',
                          value: scorecardResult,
                          confidence: 'medium',
                          assumptions: [
                            `Base value: $${parseFloat(scorecardBaseValue).toLocaleString()}`,
                            `Adjusted by factor scores`
                          ]
                        })}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Valuation
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Scenario Analysis Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Scenario Analysis</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Compare valuations across best case, base case, and worst case scenarios.
              </p>

              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Revenue ($)</label>
                    <Input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                      placeholder="e.g., 1000000"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <Select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      options={industries.map(i => ({ value: i.value, label: i.label }))}
                    />
                  </div>
            </div>
                <Button onClick={calculateScenarios} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Scenarios
            </Button>
              </div>

              {scenarios.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scenarios.map((scenario, idx) => (
                    <Card key={idx} className={`p-6 ${
                      idx === 0 ? 'bg-green-50' : idx === 1 ? 'bg-blue-50' : 'bg-red-50'
                    }`}>
                      <div className="text-center">
                        <h4 className="font-semibold text-lg mb-3">{scenario.name}</h4>
                        <p className="text-3xl font-bold text-primary-600 mb-4">
                          ${scenario.valuation.toLocaleString()}
                        </p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Revenue:</span>
                            <span className="font-medium">${scenario.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Multiple:</span>
                            <span className="font-medium">{scenario.multiple.toFixed(1)}x</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Valuation Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Valuation Comparison</h2>
              </div>

              {allValuations.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Valuations Yet</h3>
                  <p className="text-gray-600">Calculate valuations using different methods to compare results</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Total Methods</div>
                      <div className="text-2xl font-bold">{allValuations.length}</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Average Valuation</div>
                      <div className="text-2xl font-bold">${avgValuation.toLocaleString()}</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Range</div>
                      <div className="text-2xl font-bold">
                        ${Math.min(...allValuations.map(v => v.value)).toLocaleString()} - ${Math.max(...allValuations.map(v => v.value)).toLocaleString()}
                      </div>
                    </Card>
                  </div>

                  <Card className="mb-6">
                    <h3 className="font-semibold mb-4">Valuation Comparison Chart</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsBarChart data={valuationComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="method" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </Card>

                  <div className="space-y-4">
                    {allValuations.map((valuation, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{valuation.method}</h4>
                              <Badge variant={
                                valuation.confidence === 'high' ? 'new' :
                                valuation.confidence === 'medium' ? 'outline' : 'outline'
                              }>
                                {valuation.confidence} confidence
                              </Badge>
                            </div>
                            <p className="text-2xl font-bold text-primary-600 mb-2">
                              ${valuation.value.toLocaleString()}
                            </p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {valuation.assumptions.map((assumption, i) => (
                                <li key={i}>• {assumption}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex gap-1 shrink-0 ml-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => saveValuation(valuation)}
                              className="shrink-0"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updated = allValuations.filter((_, i) => i !== idx)
                                setAllValuations(updated)
                                saveToLocalStorage('allValuations', updated)
                                showToast('Valuation removed', 'success')
                              }}
                              className="shrink-0"
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

            {savedValuations.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Saved Valuations</h3>
                <div className="space-y-4">
                  {savedValuations.map((valuation, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{valuation.method}</h4>
                          <p className="text-xl font-bold text-primary-600">
                            ${valuation.value.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteValuation(idx)}
                          className="shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Industry Benchmarks Tab */}
        {activeTab === 'benchmarks' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Activity className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Industry Benchmarks</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Compare your valuation multiples with industry standards and benchmarks.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {industryBenchmarks.map((benchmark, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold">{benchmark.industry}</h4>
                      <Badge variant="outline">{benchmark.stage}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg Multiple:</span>
                        <span className="font-bold text-primary-600">{benchmark.avgMultiple}x</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Range:</span>
                        <span className="text-sm font-medium">{benchmark.range}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="mt-6 p-4 bg-blue-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Understanding Multiples</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Multiples vary by stage, growth rate, and market conditions</li>
                      <li>• Early-stage companies typically have lower multiples</li>
                      <li>• High-growth companies command premium multiples</li>
                      <li>• Use these as reference points, not absolute values</li>
                    </ul>
                  </div>
                </div>
              </Card>
        </Card>
          </div>
        )}
      </div>
    </main>
  )
}
