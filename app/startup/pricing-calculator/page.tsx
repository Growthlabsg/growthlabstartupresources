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
  DollarSign,
  Target,
  TrendingUp,
  Sparkles,
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
  Percent,
  Users,
  PieChart,
  TrendingDown
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

type PricingStrategy = 'cost-plus' | 'value-based' | 'competitive' | 'penetration' | 'skimming' | 'dynamic'
type PricingTier = 'basic' | 'standard' | 'premium' | 'enterprise' | 'custom'

interface PricingTierData {
  id: string
  name: string
  tier: PricingTier
  price: number
  cost: number
  margin: number
  features: string[]
  targetCustomers: string
  notes?: string
}

interface Competitor {
  id: string
  name: string
  price: number
  features: string[]
  marketShare?: number
  notes?: string
}

interface PricingScenario {
  id: string
  name: string
  strategy: PricingStrategy
  costPerUnit: number
  desiredMargin: number
  competitorPrice?: number
  valuePerception?: number
  recommendedPrice: number
  profitPerUnit: number
  actualMargin: number
  date: string
  notes?: string
}

interface PriceSensitivity {
  price: number
  demand: number
  revenue: number
  profit: number
}

export default function PricingCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [costPerUnit, setCostPerUnit] = useState('')
  const [desiredMargin, setDesiredMargin] = useState('30')
  const [competitorPrice, setCompetitorPrice] = useState('')
  const [valuePerception, setValuePerception] = useState('')
  const [targetPrice, setTargetPrice] = useState<number | null>(null)
  const [costPlusPrice, setCostPlusPrice] = useState<number | null>(null)
  const [competitivePrice, setCompetitivePrice] = useState<number | null>(null)
  const [valueBasedPrice, setValueBasedPrice] = useState<number | null>(null)
  const [pricingTiers, setPricingTiers] = useState<PricingTierData[]>([])
  const [editingTier, setEditingTier] = useState<PricingTierData | null>(null)
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null)
  const [scenarios, setScenarios] = useState<PricingScenario[]>([])
  const [editingScenario, setEditingScenario] = useState<PricingScenario | null>(null)
  const [priceSensitivity, setPriceSensitivity] = useState<PriceSensitivity[]>([])

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'tiers', label: 'Pricing Tiers', icon: Target },
    { id: 'competitors', label: 'Competitors', icon: Users },
    { id: 'scenarios', label: 'Scenarios', icon: TrendingUp },
    { id: 'sensitivity', label: 'Price Sensitivity', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pricingCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.pricingTiers) setPricingTiers(data.pricingTiers)
          if (data.competitors) setCompetitors(data.competitors)
          if (data.scenarios) setScenarios(data.scenarios)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        pricingTiers,
        competitors,
        scenarios,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('pricingCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const calculateCostPlus = (cost: number, margin: number) => {
    if (margin >= 100) return Infinity
    return cost / (1 - margin / 100)
  }

  const calculateValueBased = (cost: number, valuePerception: number) => {
    // Value-based pricing: Price based on perceived value multiplier
    return cost * (valuePerception / 100)
  }

  const calculate = () => {
    const cost = parseFloat(costPerUnit)
    const margin = parseFloat(desiredMargin)
    const competitor = competitorPrice ? parseFloat(competitorPrice) : null
    const value = valuePerception ? parseFloat(valuePerception) : null
    
    if (!cost || !margin || margin < 0 || margin > 100) {
      showToast('Please enter valid values. Margin must be between 0-100%.', 'error')
      return
    }

    // Cost-plus pricing
    const costPlus = calculateCostPlus(cost, margin)
    setCostPlusPrice(costPlus)

    // Competitive pricing (if provided)
    if (competitor !== null) {
      setCompetitivePrice(competitor)
    } else {
      setCompetitivePrice(null)
    }

    // Value-based pricing (if provided)
    if (value !== null) {
      const valueBased = calculateValueBased(cost, value)
      setValueBasedPrice(valueBased)
    } else {
      setValueBasedPrice(null)
    }

    // Recommended price: average of available methods
    let prices: number[] = [costPlus]
    if (competitor !== null) prices.push(competitor)
    if (value !== null && valueBasedPrice !== null) prices.push(valueBasedPrice)
    
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length
    setTargetPrice(avgPrice)

    showToast('Pricing calculated!', 'success')
  }

  const calculatePriceSensitivity = () => {
    const cost = parseFloat(costPerUnit) || 0
    if (cost <= 0) {
      showToast('Please enter cost per unit first', 'error')
      return
    }

    const basePrice = targetPrice || cost * 1.5
    const sensitivity: PriceSensitivity[] = []

    // Generate price points from 50% to 200% of base price
    for (let i = 50; i <= 200; i += 10) {
      const price = basePrice * (i / 100)
      // Demand decreases as price increases (price elasticity)
      const priceElasticity = -1.5 // Typical elasticity
      const priceChange = (price - basePrice) / basePrice
      const demandChange = priceElasticity * priceChange
      const demand = Math.max(0, 100 * (1 + demandChange))
      const revenue = price * demand
      const profit = (price - cost) * demand

      sensitivity.push({
        price: Math.round(price * 100) / 100,
        demand: Math.round(demand * 10) / 10,
        revenue: Math.round(revenue),
        profit: Math.round(profit)
      })
    }

    setPriceSensitivity(sensitivity)
  }

  const addPricingTier = () => {
    const newTier: PricingTierData = {
      id: Date.now().toString(),
      name: '',
      tier: 'basic',
      price: 0,
      cost: 0,
      margin: 0,
      features: [],
      targetCustomers: ''
    }
    setEditingTier(newTier)
  }

  const savePricingTier = () => {
    if (!editingTier) return
    if (!editingTier.name || editingTier.price <= 0 || editingTier.cost < 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const margin = editingTier.price > 0 ? ((editingTier.price - editingTier.cost) / editingTier.price) * 100 : 0
    const updatedTier = { ...editingTier, margin }

    const updated = pricingTiers.find(t => t.id === updatedTier.id)
      ? pricingTiers.map(t => t.id === updatedTier.id ? updatedTier : t)
      : [...pricingTiers, updatedTier]

    setPricingTiers(updated)
    setEditingTier(null)
    saveToLocalStorage()
    showToast('Pricing tier saved!', 'success')
  }

  const deletePricingTier = (id: string) => {
    if (confirm('Are you sure you want to delete this pricing tier?')) {
      const updated = pricingTiers.filter(t => t.id !== id)
      setPricingTiers(updated)
      saveToLocalStorage()
      showToast('Pricing tier deleted', 'info')
    }
  }

  const addCompetitor = () => {
    const newCompetitor: Competitor = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      features: []
    }
    setEditingCompetitor(newCompetitor)
  }

  const saveCompetitor = () => {
    if (!editingCompetitor) return
    if (!editingCompetitor.name || editingCompetitor.price <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const updated = competitors.find(c => c.id === editingCompetitor.id)
      ? competitors.map(c => c.id === editingCompetitor.id ? editingCompetitor : c)
      : [...competitors, editingCompetitor]

    setCompetitors(updated)
    setEditingCompetitor(null)
    saveToLocalStorage()
    showToast('Competitor saved!', 'success')
  }

  const deleteCompetitor = (id: string) => {
    if (confirm('Are you sure you want to delete this competitor?')) {
      const updated = competitors.filter(c => c.id !== id)
      setCompetitors(updated)
      saveToLocalStorage()
      showToast('Competitor deleted', 'info')
    }
  }

  const createScenario = () => {
    const cost = parseFloat(costPerUnit) || 0
    const margin = parseFloat(desiredMargin) || 30
    const competitor = competitorPrice ? parseFloat(competitorPrice) : undefined
    const value = valuePerception ? parseFloat(valuePerception) : undefined

    if (cost <= 0) {
      showToast('Please enter cost per unit first', 'error')
      return
    }

    const costPlus = calculateCostPlus(cost, margin)
    let recommendedPrice = costPlus
    if (competitor !== undefined) {
      recommendedPrice = (costPlus + competitor) / 2
    }
    if (value !== undefined) {
      const valueBased = calculateValueBased(cost, value)
      recommendedPrice = (recommendedPrice + valueBased) / 2
    }

    const profitPerUnit = recommendedPrice - cost
    const actualMargin = recommendedPrice > 0 ? (profitPerUnit / recommendedPrice) * 100 : 0

    const newScenario: PricingScenario = {
      id: Date.now().toString(),
      name: 'New Scenario',
      strategy: competitor ? 'competitive' : 'cost-plus',
      costPerUnit: cost,
      desiredMargin: margin,
      competitorPrice: competitor,
      valuePerception: value,
      recommendedPrice,
      profitPerUnit,
      actualMargin,
      date: new Date().toISOString().split('T')[0]
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

  const exportData = () => {
    const data = {
      currentCalculation: {
        costPerUnit: parseFloat(costPerUnit) || 0,
        desiredMargin: parseFloat(desiredMargin) || 0,
        competitorPrice: competitorPrice ? parseFloat(competitorPrice) : null,
        targetPrice,
        costPlusPrice,
        competitivePrice,
        valueBasedPrice
      },
      pricingTiers,
      competitors,
      scenarios,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pricing-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported!', 'success')
  }

  const tierLabels: Record<PricingTier, string> = {
    'basic': 'Basic',
    'standard': 'Standard',
    'premium': 'Premium',
    'enterprise': 'Enterprise',
    'custom': 'Custom'
  }

  const tierColors: Record<PricingTier, string> = {
    'basic': '#6b7280',
    'standard': '#3b82f6',
    'premium': '#8b5cf6',
    'enterprise': '#10b981',
    'custom': '#f59e0b'
  }

  const strategyLabels: Record<PricingStrategy, string> = {
    'cost-plus': 'Cost-Plus',
    'value-based': 'Value-Based',
    'competitive': 'Competitive',
    'penetration': 'Penetration',
    'skimming': 'Price Skimming',
    'dynamic': 'Dynamic'
  }

  const tierChartData = pricingTiers.map(t => ({
    name: t.name,
    price: t.price,
    margin: t.margin
  }))

  const competitorChartData = competitors.map(c => ({
    name: c.name,
    price: c.price
  }))

  const scenarioHistory = scenarios.map(s => ({
    name: s.name,
    price: s.recommendedPrice,
    margin: s.actualMargin,
    month: new Date(s.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Pricing Calculator
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate optimal pricing using multiple strategies and analyze price sensitivity
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
                <div className="text-sm text-gray-600 mb-1">Recommended Price</div>
                <div className="text-2xl font-bold text-primary-600">
                  {targetPrice ? `$${targetPrice.toFixed(2)}` : '$0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Cost-Plus Price</div>
                <div className="text-2xl font-bold text-blue-600">
                  {costPlusPrice ? `$${costPlusPrice.toFixed(2)}` : '$0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Profit per Unit</div>
                <div className={`text-2xl font-bold ${targetPrice && costPerUnit && targetPrice - parseFloat(costPerUnit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {targetPrice && costPerUnit ? `$${(targetPrice - parseFloat(costPerUnit)).toFixed(2)}` : '$0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Actual Margin</div>
                <div className="text-2xl font-bold">
                  {targetPrice && costPerUnit ? `${(((targetPrice - parseFloat(costPerUnit)) / targetPrice) * 100).toFixed(1)}%` : '0%'}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary-500" />
                  Pricing Calculator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Unit ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={costPerUnit}
                      onChange={(e) => setCostPerUnit(e.target.value)}
                      placeholder="10.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total cost to produce one unit</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Desired Profit Margin (%) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={desiredMargin}
                      onChange={(e) => setDesiredMargin(e.target.value)}
                      placeholder="30"
                    />
                    <p className="text-xs text-gray-500 mt-1">Target profit margin percentage</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Competitor Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={competitorPrice}
                      onChange={(e) => setCompetitorPrice(e.target.value)}
                      placeholder="25.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional - price charged by competitors</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value Perception (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={valuePerception}
                      onChange={(e) => setValuePerception(e.target.value)}
                      placeholder="200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional - perceived value multiplier (e.g., 200% = 2x cost)</p>
                  </div>
                  <Button onClick={calculate} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Pricing
                  </Button>
                  {targetPrice !== null && (
                    <div className="bg-primary-500/10 border-2 border-primary-500/20 rounded-lg p-6 space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Recommended Price</p>
                        <p className="text-3xl font-bold text-primary-600">${targetPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">per unit</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded p-3">
                          <p className="text-xs text-gray-600 mb-1">Cost-Plus</p>
                          <p className="font-bold text-blue-600">${costPlusPrice?.toFixed(2)}</p>
                        </div>
                        {competitivePrice && (
                          <div className="bg-green-50 rounded p-3">
                            <p className="text-xs text-gray-600 mb-1">Competitive</p>
                            <p className="font-bold text-green-600">${competitivePrice.toFixed(2)}</p>
                          </div>
                        )}
                        {valueBasedPrice && (
                          <div className="bg-purple-50 rounded p-3">
                            <p className="text-xs text-gray-600 mb-1">Value-Based</p>
                            <p className="font-bold text-purple-600">${valueBasedPrice.toFixed(2)}</p>
                          </div>
                        )}
                      </div>
                      <div className="pt-3 border-t">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Profit per Unit</span>
                          <span className="font-bold text-green-600">
                            ${(targetPrice - parseFloat(costPerUnit)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Actual Margin</span>
                          <span className="font-bold">
                            {(((targetPrice - parseFloat(costPerUnit)) / targetPrice) * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary-500" />
                  Pricing Strategies
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700">Cost-Plus Pricing</p>
                    <p className="text-xs mt-1">Price = Cost / (1 - Margin%)</p>
                    <p className="text-xs text-gray-500">Simple and ensures profit margin</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Value-Based Pricing</p>
                    <p className="text-xs mt-1">Price = Cost × Value Multiplier</p>
                    <p className="text-xs text-gray-500">Based on perceived customer value</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Competitive Pricing</p>
                    <p className="text-xs mt-1">Price based on competitor analysis</p>
                    <p className="text-xs text-gray-500">Match or beat competitor prices</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-yellow-900 mb-1">Best Practices</div>
                        <ul className="text-xs text-yellow-800 space-y-1">
                          <li>• Test different pricing strategies</li>
                          <li>• Monitor price sensitivity</li>
                          <li>• Consider value perception</li>
                          <li>• Review competitor pricing regularly</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Pricing Tiers Tab */}
        {activeTab === 'tiers' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Pricing Tiers</h2>
                </div>
                <Button onClick={addPricingTier} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </div>

              {pricingTiers.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No pricing tiers yet. Add tiers to create a pricing structure.</p>
                </div>
              ) : (
                <>
                  {tierChartData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Pricing Tier Comparison</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={tierChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="price" fill="#3b82f6" name="Price ($)" />
                          <Bar dataKey="margin" fill="#10b981" name="Margin (%)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {pricingTiers.map((tier) => (
                      <Card key={tier.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{tier.name}</h4>
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{ borderColor: tierColors[tier.tier] }}
                              >
                                {tierLabels[tier.tier]}
                              </Badge>
                              <Badge variant="beginner" className="text-xs">
                                {tier.margin.toFixed(1)}% margin
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <span className="font-medium">Price:</span> ${tier.price.toFixed(2)}
                              </div>
                              <div>
                                <span className="font-medium">Cost:</span> ${tier.cost.toFixed(2)}
                              </div>
                              <div>
                                <span className="font-medium">Profit:</span> ${(tier.price - tier.cost).toFixed(2)}
                              </div>
                              <div>
                                <span className="font-medium">Target:</span> {tier.targetCustomers || 'N/A'}
                              </div>
                            </div>
                            {tier.features.length > 0 && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Features: </span>
                                <span className="text-gray-600">{tier.features.join(', ')}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTier(tier)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePricingTier(tier.id)}
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

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Competitor Pricing</h2>
                </div>
                <Button onClick={addCompetitor} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competitor
                </Button>
              </div>

              {competitors.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p>No competitors yet. Add competitors to analyze competitive pricing.</p>
                </div>
              ) : (
                <>
                  {competitorChartData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Competitor Price Comparison</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={competitorChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="price" fill="#3b82f6" name="Price ($)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <div className="space-y-3">
                    {competitors.map((competitor) => (
                      <Card key={competitor.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{competitor.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                ${competitor.price.toFixed(2)}
                              </Badge>
                              {competitor.marketShare && (
                                <Badge variant="beginner" className="text-xs">
                                  {competitor.marketShare}% market share
                                </Badge>
                              )}
                            </div>
                            {competitor.features.length > 0 && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Features: </span>
                                {competitor.features.join(', ')}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCompetitor(competitor)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCompetitor(competitor.id)}
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

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Pricing Scenarios</h2>
                </div>
                <Button onClick={createScenario} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Scenario
                </Button>
              </div>

              {scenarios.length === 0 && !editingScenario ? (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <p>No scenarios yet. Create scenarios to compare different pricing strategies.</p>
                </div>
              ) : (
                <>
                  {scenarios.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {scenarios.map((scenario) => (
                        <Card key={scenario.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{scenario.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {strategyLabels[scenario.strategy]}
                                </Badge>
                                <Badge variant="beginner" className="text-xs">
                                  {scenario.actualMargin.toFixed(1)}% margin
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Price:</span> ${scenario.recommendedPrice.toFixed(2)}
                                </div>
                                <div>
                                  <span className="font-medium">Cost:</span> ${scenario.costPerUnit.toFixed(2)}
                                </div>
                                <div>
                                  <span className="font-medium">Profit:</span> ${scenario.profitPerUnit.toFixed(2)}
                                </div>
                                <div>
                                  <span className="font-medium">Date:</span> {new Date(scenario.date).toLocaleDateString()}
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
                            placeholder="e.g., Q1 Pricing Strategy"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Strategy *</label>
                          <Select
                            value={editingScenario.strategy}
                            onChange={(e) => setEditingScenario({ ...editingScenario, strategy: e.target.value as PricingStrategy })}
                            options={[
                              { value: 'cost-plus', label: 'Cost-Plus' },
                              { value: 'value-based', label: 'Value-Based' },
                              { value: 'competitive', label: 'Competitive' },
                              { value: 'penetration', label: 'Penetration' },
                              { value: 'skimming', label: 'Price Skimming' },
                              { value: 'dynamic', label: 'Dynamic' }
                            ]}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Unit ($)</label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editingScenario.costPerUnit}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Price ($)</label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editingScenario.recommendedPrice}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Actual Margin (%)</label>
                            <Input
                              type="number"
                              step="0.1"
                              value={editingScenario.actualMargin}
                              readOnly
                              className="bg-gray-50"
                            />
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

        {/* Price Sensitivity Tab */}
        {activeTab === 'sensitivity' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Price Sensitivity Analysis</h2>
                </div>
                <Button onClick={calculatePriceSensitivity} size="sm" className="shrink-0">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>

              {priceSensitivity.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>Calculate break-even first, then click Calculate to analyze price sensitivity.</p>
                </div>
              ) : (
                <>
                  <Card className="mb-6">
                    <h3 className="font-semibold mb-4">Price Sensitivity Chart</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={priceSensitivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="price" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Revenue ($)" />
                        <Area type="monotone" dataKey="profit" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Profit ($)" />
                        <Line type="monotone" dataKey="demand" stroke="#f59e0b" name="Demand (%)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card>
                    <h3 className="font-semibold mb-4">Sensitivity Table</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Price</th>
                            <th className="text-right p-2">Demand %</th>
                            <th className="text-right p-2">Revenue</th>
                            <th className="text-right p-2">Profit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {priceSensitivity.filter((p, i) => i % 2 === 0).map((point, idx) => (
                            <tr key={idx} className={`border-b ${point.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                              <td className="p-2 font-medium">${point.price.toFixed(2)}</td>
                              <td className="p-2 text-right">{point.demand.toFixed(1)}%</td>
                              <td className="p-2 text-right">${point.revenue.toLocaleString()}</td>
                              <td className={`p-2 text-right font-bold ${point.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${point.profit.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
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
                <div className="text-sm text-gray-600 mb-1">Total Tiers</div>
                <div className="text-2xl font-bold">{pricingTiers.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Competitors</div>
                <div className="text-2xl font-bold">{competitors.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Average Price</div>
                <div className="text-2xl font-bold">
                  {pricingTiers.length > 0 
                    ? `$${(pricingTiers.reduce((sum, t) => sum + t.price, 0) / pricingTiers.length).toFixed(2)}`
                    : '$0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Average Margin</div>
                <div className="text-2xl font-bold">
                  {pricingTiers.length > 0 
                    ? `${(pricingTiers.reduce((sum, t) => sum + t.margin, 0) / pricingTiers.length).toFixed(1)}%`
                    : '0%'}
                </div>
              </Card>
            </div>

            {scenarioHistory.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Pricing Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scenarioHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#3b82f6" name="Price ($)" />
                    <Line type="monotone" dataKey="margin" stroke="#10b981" name="Margin (%)" />
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
                <h2 className="text-2xl font-bold">Pricing History</h2>
              </div>
              {scenarios.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No pricing history yet. Create scenarios to build history.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scenarios.map((scenario) => (
                    <Card key={scenario.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{scenario.name}</h4>
                          <p className="text-sm text-gray-600">
                            {strategyLabels[scenario.strategy]} • ${scenario.recommendedPrice.toFixed(2)} • {scenario.actualMargin.toFixed(1)}% margin
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{new Date(scenario.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Edit Pricing Tier Modal */}
        {editingTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Pricing Tier</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingTier(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tier Name *</label>
                    <Input
                      value={editingTier.name}
                      onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                      placeholder="e.g., Starter Plan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tier Type *</label>
                    <Select
                      value={editingTier.tier}
                      onChange={(e) => setEditingTier({ ...editingTier, tier: e.target.value as PricingTier })}
                      options={[
                        { value: 'basic', label: 'Basic' },
                        { value: 'standard', label: 'Standard' },
                        { value: 'premium', label: 'Premium' },
                        { value: 'enterprise', label: 'Enterprise' },
                        { value: 'custom', label: 'Custom' }
                      ]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingTier.price}
                      onChange={(e) => {
                        const price = parseFloat(e.target.value) || 0
                        const margin = price > 0 ? ((price - editingTier.cost) / price) * 100 : 0
                        setEditingTier({ ...editingTier, price, margin })
                      }}
                      placeholder="29.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingTier.cost}
                      onChange={(e) => {
                        const cost = parseFloat(e.target.value) || 0
                        const margin = editingTier.price > 0 ? ((editingTier.price - cost) / editingTier.price) * 100 : 0
                        setEditingTier({ ...editingTier, cost, margin })
                      }}
                      placeholder="10.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Customers</label>
                  <Input
                    value={editingTier.targetCustomers}
                    onChange={(e) => setEditingTier({ ...editingTier, targetCustomers: e.target.value })}
                    placeholder="e.g., Small businesses, Startups"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
                  <Input
                    value={editingTier.features.join(', ')}
                    onChange={(e) => setEditingTier({ ...editingTier, features: e.target.value.split(',').map(f => f.trim()).filter(f => f) })}
                    placeholder="Feature 1, Feature 2, Feature 3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingTier.notes || ''}
                    onChange={(e) => setEditingTier({ ...editingTier, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                {editingTier.price > 0 && editingTier.cost >= 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Profit per Unit:</div>
                        <div className="font-bold text-green-600">
                          ${(editingTier.price - editingTier.cost).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Margin:</div>
                        <div className="font-bold text-primary-600">
                          {editingTier.margin.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={savePricingTier} className="flex-1">
                    Save Tier
                  </Button>
                  <Button variant="outline" onClick={() => setEditingTier(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Competitor Modal */}
        {editingCompetitor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Competitor</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingCompetitor(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Competitor Name *</label>
                  <Input
                    value={editingCompetitor.name}
                    onChange={(e) => setEditingCompetitor({ ...editingCompetitor, name: e.target.value })}
                    placeholder="e.g., Competitor A"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingCompetitor.price}
                      onChange={(e) => setEditingCompetitor({ ...editingCompetitor, price: parseFloat(e.target.value) || 0 })}
                      placeholder="25.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Market Share (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingCompetitor.marketShare || ''}
                      onChange={(e) => setEditingCompetitor({ ...editingCompetitor, marketShare: parseFloat(e.target.value) || undefined })}
                      placeholder="15"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
                  <Input
                    value={editingCompetitor.features.join(', ')}
                    onChange={(e) => setEditingCompetitor({ ...editingCompetitor, features: e.target.value.split(',').map(f => f.trim()).filter(f => f) })}
                    placeholder="Feature 1, Feature 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingCompetitor.notes || ''}
                    onChange={(e) => setEditingCompetitor({ ...editingCompetitor, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveCompetitor} className="flex-1">
                    Save Competitor
                  </Button>
                  <Button variant="outline" onClick={() => setEditingCompetitor(null)}>
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
