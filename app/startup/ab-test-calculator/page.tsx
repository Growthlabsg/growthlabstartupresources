'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Save, 
  Download, 
  BarChart3, 
  CheckCircle, 
  XCircle,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Percent,
  Users,
  Zap,
  FileText,
  PieChart,
  Activity,
  History,
  Info,
  AlertCircle,
  Sparkles,
  Calendar,
  Filter,
  X
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

type TestStatus = 'planning' | 'running' | 'completed' | 'paused'
type TestType = 'conversion' | 'click-through' | 'engagement' | 'revenue' | 'other'

interface ABTest {
  id: string
  name: string
  description?: string
  testType: TestType
  status: TestStatus
  variantA: {
    name: string
    visitors: number
    conversions: number
    conversionRate: number
    revenue?: number
  }
  variantB: {
    name: string
    visitors: number
    conversions: number
    conversionRate: number
    revenue?: number
  }
  confidenceLevel: number
  improvement: number
  zScore: number
  pValue: number
  isSignificant: boolean
  winner: 'A' | 'B' | 'Tie'
  startDate: string
  endDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface SampleSizeCalculation {
  baselineRate: number
  minimumDetectableEffect: number
  confidenceLevel: number
  power: number
  requiredSampleSize: number
}

const testTypeLabels: Record<TestType, string> = {
  'conversion': 'Conversion Rate',
  'click-through': 'Click-Through Rate',
  'engagement': 'Engagement',
  'revenue': 'Revenue',
  'other': 'Other'
}

const statusLabels: Record<TestStatus, string> = {
  'planning': 'Planning',
  'running': 'Running',
  'completed': 'Completed',
  'paused': 'Paused'
}

const statusColors: Record<TestStatus, string> = {
  'planning': 'bg-gray-100 text-gray-800',
  'running': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'paused': 'bg-yellow-100 text-yellow-800'
}

export default function ABTestCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [variantAVisitors, setVariantAVisitors] = useState('')
  const [variantAConversions, setVariantAConversions] = useState('')
  const [variantBVisitors, setVariantBVisitors] = useState('')
  const [variantBConversions, setVariantBConversions] = useState('')
  const [confidenceLevel, setConfidenceLevel] = useState('95')
  const [results, setResults] = useState<any>(null)
  const [tests, setTests] = useState<ABTest[]>([])
  const [editingTest, setEditingTest] = useState<ABTest | null>(null)
  const [sampleSizeCalc, setSampleSizeCalc] = useState<SampleSizeCalculation | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    testType: 'conversion' as TestType,
    status: 'planning' as TestStatus,
    variantAName: 'Variant A',
    variantBName: 'Variant B',
    variantAVisitors: '',
    variantAConversions: '',
    variantARevenue: '',
    variantBVisitors: '',
    variantBConversions: '',
    variantBRevenue: '',
    confidenceLevel: '95',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  })
  const [sampleSizeFormData, setSampleSizeFormData] = useState({
    baselineRate: '',
    minimumDetectableEffect: '',
    confidenceLevel: '95',
    power: '80'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'tests', label: 'My Tests', icon: Target },
    { id: 'samplesize', label: 'Sample Size', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'templates', label: 'Templates', icon: FileText },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('abTestCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.tests) setTests(data.tests)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        tests,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('abTestCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const calculateZScore = (p1: number, n1: number, p2: number, n2: number) => {
    const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2)
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2))
    if (se === 0) return 0
    return (p1 - p2) / se
  }

  const calculatePValue = (zScore: number) => {
    // Approximation using normal distribution
    const absZ = Math.abs(zScore)
    if (absZ > 6) return 0
    if (absZ < 0.1) return 1
    
    // Using approximation formula
    const t = 1 / (1 + 0.2316419 * absZ)
    const d = 0.3989423 * Math.exp(-absZ * absZ / 2)
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return 2 * (1 - p)
  }

  const calculate = () => {
    const aVis = parseFloat(variantAVisitors)
    const aConv = parseFloat(variantAConversions)
    const bVis = parseFloat(variantBVisitors)
    const bConv = parseFloat(variantBConversions)
    const confidence = parseFloat(confidenceLevel) / 100
    
    if (!aVis || !aConv || !bVis || !bConv || aVis === 0 || bVis === 0) {
      showToast('Please enter valid values for both variants', 'error')
      return
    }

    if (aConv > aVis || bConv > bVis) {
      showToast('Conversions cannot exceed visitors', 'error')
      return
    }

    const rateA = aConv / aVis
    const rateB = bConv / bVis
    const improvement = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0

    // Calculate statistical significance
    const zScore = calculateZScore(rateA, aVis, rateB, bVis)
    const zCritical = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.58 : 1.645
    const isSignificant = Math.abs(zScore) > zCritical
    const pValue = calculatePValue(zScore)

    const winner = rateB > rateA ? 'B' : rateA > rateB ? 'A' : 'Tie'

    setResults({
      variantA: { visitors: aVis, conversions: aConv, rate: rateA },
      variantB: { visitors: bVis, conversions: bConv, rate: rateB },
      improvement,
      zScore,
      isSignificant,
      pValue,
      winner,
      confidence,
    })

    showToast('A/B test analyzed!', 'success')
  }

  const calculateSampleSize = () => {
    const baselineRate = parseFloat(sampleSizeFormData.baselineRate) / 100
    const mde = parseFloat(sampleSizeFormData.minimumDetectableEffect) / 100
    const confidence = parseFloat(sampleSizeFormData.confidenceLevel) / 100
    const power = parseFloat(sampleSizeFormData.power) / 100

    if (!baselineRate || !mde || baselineRate <= 0 || baselineRate >= 1) {
      showToast('Please enter valid baseline rate and MDE', 'error')
      return
    }

    const zAlpha = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.58 : 1.645
    const zBeta = power === 0.8 ? 0.84 : power === 0.9 ? 1.28 : 0.67

    const p1 = baselineRate
    const p2 = baselineRate + mde
    const pooledP = (p1 + p2) / 2

    const numerator = Math.pow(zAlpha * Math.sqrt(2 * pooledP * (1 - pooledP)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2)
    const denominator = Math.pow(p2 - p1, 2)

    const requiredSampleSize = Math.ceil(numerator / denominator)

    setSampleSizeCalc({
      baselineRate,
      minimumDetectableEffect: mde,
      confidenceLevel: confidence,
      power,
      requiredSampleSize
    })

    showToast('Sample size calculated!', 'success')
  }

  const addTest = () => {
    if (!formData.name || !formData.variantAVisitors || !formData.variantBVisitors) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const aVis = parseFloat(formData.variantAVisitors) || 0
    const aConv = parseFloat(formData.variantAConversions) || 0
    const rateA = aVis > 0 ? aConv / aVis : 0

    const bVis = parseFloat(formData.variantBVisitors) || 0
    const bConv = parseFloat(formData.variantBConversions) || 0
    const rateB = bVis > 0 ? bConv / bVis : 0

    const improvement = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0
    const confidence = parseFloat(formData.confidenceLevel) / 100
    const zScore = calculateZScore(rateA, aVis, rateB, bVis)
    const zCritical = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.58 : 1.645
    const isSignificant = Math.abs(zScore) > zCritical
    const pValue = calculatePValue(zScore)
    const winner = rateB > rateA ? 'B' : rateA > rateB ? 'A' : 'Tie'

    const newTest: ABTest = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description || undefined,
      testType: formData.testType,
      status: formData.status,
      variantA: {
        name: formData.variantAName,
        visitors: aVis,
        conversions: aConv,
        conversionRate: rateA,
        revenue: formData.variantARevenue ? parseFloat(formData.variantARevenue) : undefined
      },
      variantB: {
        name: formData.variantBName,
        visitors: bVis,
        conversions: bConv,
        conversionRate: rateB,
        revenue: formData.variantBRevenue ? parseFloat(formData.variantBRevenue) : undefined
      },
      confidenceLevel: confidence,
      improvement,
      zScore,
      pValue,
      isSignificant,
      winner,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTests([...tests, newTest])
    setEditingTest(null)
    setFormData({
      name: '',
      description: '',
      testType: 'conversion',
      status: 'planning',
      variantAName: 'Variant A',
      variantBName: 'Variant B',
      variantAVisitors: '',
      variantAConversions: '',
      variantARevenue: '',
      variantBVisitors: '',
      variantBConversions: '',
      variantBRevenue: '',
      confidenceLevel: '95',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    })
    saveToLocalStorage()
    showToast('Test added!', 'success')
  }

  const updateTest = () => {
    if (!editingTest) return

    const aVis = parseFloat(formData.variantAVisitors) || 0
    const aConv = parseFloat(formData.variantAConversions) || 0
    const rateA = aVis > 0 ? aConv / aVis : 0

    const bVis = parseFloat(formData.variantBVisitors) || 0
    const bConv = parseFloat(formData.variantBConversions) || 0
    const rateB = bVis > 0 ? bConv / bVis : 0

    const improvement = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0
    const confidence = parseFloat(formData.confidenceLevel) / 100
    const zScore = calculateZScore(rateA, aVis, rateB, bVis)
    const zCritical = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.58 : 1.645
    const isSignificant = Math.abs(zScore) > zCritical
    const pValue = calculatePValue(zScore)
    const winner = rateB > rateA ? 'B' : rateA > rateB ? 'A' : 'Tie'

    const updated: ABTest = {
      ...editingTest,
      name: formData.name,
      description: formData.description || undefined,
      testType: formData.testType,
      status: formData.status,
      variantA: {
        name: formData.variantAName,
        visitors: aVis,
        conversions: aConv,
        conversionRate: rateA,
        revenue: formData.variantARevenue ? parseFloat(formData.variantARevenue) : undefined
      },
      variantB: {
        name: formData.variantBName,
        visitors: bVis,
        conversions: bConv,
        conversionRate: rateB,
        revenue: formData.variantBRevenue ? parseFloat(formData.variantBRevenue) : undefined
      },
      confidenceLevel: confidence,
      improvement,
      zScore,
      pValue,
      isSignificant,
      winner,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      notes: formData.notes || undefined,
      updatedAt: new Date().toISOString()
    }

    const updatedTests = tests.map(t => t.id === editingTest.id ? updated : t)
    setTests(updatedTests)
    setEditingTest(null)
    setFormData({
      name: '',
      description: '',
      testType: 'conversion',
      status: 'planning',
      variantAName: 'Variant A',
      variantBName: 'Variant B',
      variantAVisitors: '',
      variantAConversions: '',
      variantARevenue: '',
      variantBVisitors: '',
      variantBConversions: '',
      variantBRevenue: '',
      confidenceLevel: '95',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    })
    saveToLocalStorage()
    showToast('Test updated!', 'success')
  }

  const deleteTest = (id: string) => {
    if (confirm('Are you sure you want to delete this test?')) {
      const updated = tests.filter(t => t.id !== id)
      setTests(updated)
      saveToLocalStorage()
      showToast('Test deleted', 'info')
    }
  }

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (test.description && test.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || test.status === filterStatus
    const matchesType = filterType === 'all' || test.testType === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const testStats = {
    total: tests.length,
    running: tests.filter(t => t.status === 'running').length,
    completed: tests.filter(t => t.status === 'completed').length,
    significant: tests.filter(t => t.isSignificant).length,
    averageImprovement: tests.length > 0 
      ? tests.reduce((sum, t) => sum + t.improvement, 0) / tests.length 
      : 0
  }

  const testTypeDistribution = Object.entries(
    tests.reduce((acc, test) => {
      acc[test.testType] = (acc[test.testType] || 0) + 1
      return acc
    }, {} as Record<TestType, number>)
  ).map(([type, count]) => ({
    name: testTypeLabels[type as TestType],
    value: count
  }))

  const chartData = results ? [
    { name: 'Variant A', rate: results.variantA.rate * 100 },
    { name: 'Variant B', rate: results.variantB.rate * 100 },
  ] : []

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                A/B Test Calculator
              </span>
            </h1>
            <Zap className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze A/B test results, calculate sample sizes, and track test performance
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={saveToLocalStorage} className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Variant A (Control)</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Visitors
                        </label>
                        <Input
                          type="number"
                          value={variantAVisitors}
                          onChange={(e) => setVariantAVisitors(e.target.value)}
                          placeholder="e.g., 1000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Conversions
                        </label>
                        <Input
                          type="number"
                          value={variantAConversions}
                          onChange={(e) => setVariantAConversions(e.target.value)}
                          placeholder="e.g., 50"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Variant B (Test)</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Visitors
                        </label>
                        <Input
                          type="number"
                          value={variantBVisitors}
                          onChange={(e) => setVariantBVisitors(e.target.value)}
                          placeholder="e.g., 1000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Conversions
                        </label>
                        <Input
                          type="number"
                          value={variantBConversions}
                          onChange={(e) => setVariantBConversions(e.target.value)}
                          placeholder="e.g., 60"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confidence Level (%)
                    </label>
                    <Select
                      value={confidenceLevel}
                      onChange={(e) => setConfidenceLevel(e.target.value)}
                      options={[
                        { value: '90', label: '90%' },
                        { value: '95', label: '95%' },
                        { value: '99', label: '99%' }
                      ]}
                    />
                  </div>

                  <Button onClick={calculate} className="w-full" size="lg">
                    <Calculator className="h-5 w-5 mr-2" />
                    Analyze A/B Test
                  </Button>

                  {results && (
                    <div className="space-y-4 pt-6 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-500/10 border-2 border-blue-500/20 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">Variant A Rate</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {(results.variantA.rate * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div className="bg-green-500/10 border-2 border-green-500/20 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">Variant B Rate</p>
                          <p className="text-2xl font-bold text-green-600">
                            {(results.variantB.rate * 100).toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      <div className={`border-2 rounded-lg p-4 ${
                        results.isSignificant 
                          ? 'bg-green-500/10 border-green-500/20' 
                          : 'bg-yellow-500/10 border-yellow-500/20'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">Winner: Variant {results.winner}</p>
                          {results.isSignificant ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Significant
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Not Significant
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                          <div>
                            <div className="text-gray-600 mb-1">Improvement</div>
                            <div className={`font-bold ${results.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {results.improvement >= 0 ? '+' : ''}{results.improvement.toFixed(2)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Z-Score</div>
                            <div className="font-bold">{results.zScore.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">P-Value</div>
                            <div className="font-bold">{results.pValue.toFixed(4)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600 mb-1">Confidence</div>
                            <div className="font-bold">{(results.confidence * 100).toFixed(0)}%</div>
                          </div>
                        </div>
                      </div>

                      {chartData.length > 0 && (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                              <Legend />
                              <Bar dataKey="rate" fill="#3b82f6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary-500" />
                  About A/B Testing
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    A/B testing compares two variants to determine which performs better.
                  </p>
                  <p className="font-medium text-gray-700">Key Metrics:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Conversion Rate</li>
                    <li>Statistical Significance</li>
                    <li>Confidence Level</li>
                    <li>Z-Score</li>
                    <li>P-Value</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* My Tests Tab */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">A/B Tests</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tests..."
                    className="w-48"
                  />
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Status' },
                      ...Object.entries(statusLabels).map(([value, label]) => ({ value, label }))
                    ]}
                  />
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Types' },
                      ...Object.entries(testTypeLabels).map(([value, label]) => ({ value, label }))
                    ]}
                  />
                  <Button
                    onClick={() => {
                      setEditingTest({
                        id: '',
                        name: '',
                        testType: 'conversion',
                        status: 'planning',
                        variantA: { name: 'Variant A', visitors: 0, conversions: 0, conversionRate: 0 },
                        variantB: { name: 'Variant B', visitors: 0, conversions: 0, conversionRate: 0 },
                        confidenceLevel: 0.95,
                        improvement: 0,
                        zScore: 0,
                        pValue: 0,
                        isSignificant: false,
                        winner: 'Tie',
                        startDate: new Date().toISOString().split('T')[0],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      })
                      setFormData({
                        name: '',
                        description: '',
                        testType: 'conversion',
                        status: 'planning',
                        variantAName: 'Variant A',
                        variantBName: 'Variant B',
                        variantAVisitors: '',
                        variantAConversions: '',
                        variantARevenue: '',
                        variantBVisitors: '',
                        variantBConversions: '',
                        variantBRevenue: '',
                        confidenceLevel: '95',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: '',
                        notes: ''
                      })
                    }}
                    size="sm"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Test
                  </Button>
                </div>
              </div>

              {filteredTests.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No tests found. Add your first A/B test to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTests.map((test) => (
                    <Card key={test.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{test.name}</h4>
                            <Badge className={`text-xs ${statusColors[test.status]}`}>
                              {statusLabels[test.status]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {testTypeLabels[test.testType]}
                            </Badge>
                            {test.isSignificant && (
                              <Badge className="text-xs bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Significant
                              </Badge>
                            )}
                            <Badge className={`text-xs ${test.winner === 'B' ? 'bg-green-100 text-green-800' : test.winner === 'A' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                              Winner: {test.winner}
                            </Badge>
                          </div>
                          {test.description && (
                            <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Variant A:</span> {(test.variantA.conversionRate * 100).toFixed(2)}%
                            </div>
                            <div>
                              <span className="font-medium">Variant B:</span> {(test.variantB.conversionRate * 100).toFixed(2)}%
                            </div>
                            <div>
                              <span className="font-medium">Improvement:</span> {test.improvement >= 0 ? '+' : ''}{test.improvement.toFixed(2)}%
                            </div>
                            <div>
                              <span className="font-medium">P-Value:</span> {test.pValue.toFixed(4)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Started:</span> {new Date(test.startDate).toLocaleDateString()}
                            {test.endDate && (
                              <> • <span className="font-medium">Ended:</span> {new Date(test.endDate).toLocaleDateString()}</>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTest(test)
                              setFormData({
                                name: test.name,
                                description: test.description || '',
                                testType: test.testType,
                                status: test.status,
                                variantAName: test.variantA.name,
                                variantBName: test.variantB.name,
                                variantAVisitors: test.variantA.visitors.toString(),
                                variantAConversions: test.variantA.conversions.toString(),
                                variantARevenue: test.variantA.revenue?.toString() || '',
                                variantBVisitors: test.variantB.visitors.toString(),
                                variantBConversions: test.variantB.conversions.toString(),
                                variantBRevenue: test.variantB.revenue?.toString() || '',
                                confidenceLevel: (test.confidenceLevel * 100).toString(),
                                startDate: test.startDate,
                                endDate: test.endDate || '',
                                notes: test.notes || ''
                              })
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTest(test.id)}
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

            {editingTest && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingTest.id ? 'Edit A/B Test' : 'Add A/B Test'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingTest(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Headline A/B Test"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Test description..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Test Type *</label>
                      <Select
                        value={formData.testType}
                        onChange={(e) => setFormData({ ...formData, testType: e.target.value as TestType })}
                        options={Object.entries(testTypeLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                      <Select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as TestStatus })}
                        options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant A Name</label>
                      <Input
                        value={formData.variantAName}
                        onChange={(e) => setFormData({ ...formData, variantAName: e.target.value })}
                        placeholder="Variant A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant B Name</label>
                      <Input
                        value={formData.variantBName}
                        onChange={(e) => setFormData({ ...formData, variantBName: e.target.value })}
                        placeholder="Variant B"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant A Visitors *</label>
                      <Input
                        type="number"
                        value={formData.variantAVisitors}
                        onChange={(e) => setFormData({ ...formData, variantAVisitors: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant A Conversions *</label>
                      <Input
                        type="number"
                        value={formData.variantAConversions}
                        onChange={(e) => setFormData({ ...formData, variantAConversions: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant B Visitors *</label>
                      <Input
                        type="number"
                        value={formData.variantBVisitors}
                        onChange={(e) => setFormData({ ...formData, variantBVisitors: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant B Conversions *</label>
                      <Input
                        type="number"
                        value={formData.variantBConversions}
                        onChange={(e) => setFormData({ ...formData, variantBConversions: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant A Revenue ($)</label>
                      <Input
                        type="number"
                        value={formData.variantARevenue}
                        onChange={(e) => setFormData({ ...formData, variantARevenue: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant B Revenue ($)</label>
                      <Input
                        type="number"
                        value={formData.variantBRevenue}
                        onChange={(e) => setFormData({ ...formData, variantBRevenue: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Level (%)</label>
                      <Select
                        value={formData.confidenceLevel}
                        onChange={(e) => setFormData({ ...formData, confidenceLevel: e.target.value })}
                        options={[
                          { value: '90', label: '90%' },
                          { value: '95', label: '95%' },
                          { value: '99', label: '99%' }
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes..."
                    />
                  </div>
                  {formData.variantAVisitors && formData.variantBVisitors && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 mb-1">Variant A Rate:</div>
                          <div className="text-xl font-bold text-primary-600">
                            {((parseFloat(formData.variantAConversions) / parseFloat(formData.variantAVisitors)) * 100).toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Variant B Rate:</div>
                          <div className="text-xl font-bold text-primary-600">
                            {((parseFloat(formData.variantBConversions) / parseFloat(formData.variantBVisitors)) * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={editingTest.id ? updateTest : addTest} className="flex-1">
                      {editingTest.id ? 'Update Test' : 'Add Test'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingTest(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Sample Size Tab */}
        {activeTab === 'samplesize' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Sample Size Calculator</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Baseline Conversion Rate (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={sampleSizeFormData.baselineRate}
                    onChange={(e) => setSampleSizeFormData({ ...sampleSizeFormData, baselineRate: e.target.value })}
                    placeholder="e.g., 2.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current conversion rate</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Detectable Effect (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={sampleSizeFormData.minimumDetectableEffect}
                    onChange={(e) => setSampleSizeFormData({ ...sampleSizeFormData, minimumDetectableEffect: e.target.value })}
                    placeholder="e.g., 20"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum improvement you want to detect</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confidence Level (%)
                    </label>
                    <Select
                      value={sampleSizeFormData.confidenceLevel}
                      onChange={(e) => setSampleSizeFormData({ ...sampleSizeFormData, confidenceLevel: e.target.value })}
                      options={[
                        { value: '90', label: '90%' },
                        { value: '95', label: '95%' },
                        { value: '99', label: '99%' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statistical Power (%)
                    </label>
                    <Select
                      value={sampleSizeFormData.power}
                      onChange={(e) => setSampleSizeFormData({ ...sampleSizeFormData, power: e.target.value })}
                      options={[
                        { value: '80', label: '80%' },
                        { value: '90', label: '90%' },
                        { value: '95', label: '95%' }
                      ]}
                    />
                  </div>
                </div>
                <Button onClick={calculateSampleSize} className="w-full" size="lg">
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate Sample Size
                </Button>
                {sampleSizeCalc && (
                  <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <h3 className="font-semibold mb-4">Required Sample Size</h3>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-primary-600 mb-2">
                        {sampleSizeCalc.requiredSampleSize.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">per variant</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Baseline Rate</div>
                        <div className="font-bold">{(sampleSizeCalc.baselineRate * 100).toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">MDE</div>
                        <div className="font-bold">{(sampleSizeCalc.minimumDetectableEffect * 100).toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Confidence</div>
                        <div className="font-bold">{(sampleSizeCalc.confidenceLevel * 100).toFixed(0)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Power</div>
                        <div className="font-bold">{(sampleSizeCalc.power * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <div className="text-sm text-gray-600">
                        <strong>Total Sample Size:</strong> {(sampleSizeCalc.requiredSampleSize * 2).toLocaleString()} visitors
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Tests</div>
                <div className="text-2xl font-bold">{testStats.total}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Running</div>
                <div className="text-2xl font-bold text-blue-600">{testStats.running}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Completed</div>
                <div className="text-2xl font-bold text-green-600">{testStats.completed}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Significant</div>
                <div className="text-2xl font-bold text-green-600">{testStats.significant}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Avg Improvement</div>
                <div className={`text-2xl font-bold ${testStats.averageImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {testStats.averageImprovement >= 0 ? '+' : ''}{testStats.averageImprovement.toFixed(1)}%
                </div>
              </Card>
            </div>

            {testTypeDistribution.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Test Type Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={testTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => percent ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {testTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}

            {tests.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Test Performance</h3>
                <div className="space-y-4">
                  {tests
                    .filter(t => t.status === 'completed')
                    .sort((a, b) => b.improvement - a.improvement)
                    .slice(0, 5)
                    .map((test) => (
                      <div key={test.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{test.name}</h4>
                          <Badge className={`text-xs ${test.improvement >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {test.improvement >= 0 ? '+' : ''}{test.improvement.toFixed(2)}%
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          Winner: Variant {test.winner} • {test.isSignificant ? 'Significant' : 'Not Significant'}
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">A/B Test Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 hover:shadow-lg transition-all">
                  <div className="bg-primary-500/10 text-primary-600 p-3 rounded-lg w-fit mb-3">
                    <Target className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Landing Page Headline</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Test different headlines to improve conversion rates
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </Card>
                <Card className="p-4 hover:shadow-lg transition-all">
                  <div className="bg-primary-500/10 text-primary-600 p-3 rounded-lg w-fit mb-3">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2">CTA Button</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Test button colors, text, and placement
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </Card>
                <Card className="p-4 hover:shadow-lg transition-all">
                  <div className="bg-primary-500/10 text-primary-600 p-3 rounded-lg w-fit mb-3">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Pricing Page</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Test different pricing strategies and layouts
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </Card>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
