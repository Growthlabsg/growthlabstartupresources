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
  TrendingDown,
  Percent,
  PieChart
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

type CostCategory = 'rent' | 'salaries' | 'utilities' | 'marketing' | 'software' | 'materials' | 'shipping' | 'other'

interface FixedCost {
  id: string
  name: string
  category: CostCategory
  amount: number
  recurring: boolean
  frequency: 'monthly' | 'quarterly' | 'annually'
  notes?: string
}

interface VariableCost {
  id: string
  name: string
  category: CostCategory
  costPerUnit: number
  notes?: string
}

interface Product {
  id: string
  name: string
  pricePerUnit: number
  variableCostPerUnit: number
  contributionMargin: number
  marginPercentage: number
  breakEvenUnits: number
  breakEvenRevenue: number
}

interface BreakEvenScenario {
  id: string
  name: string
  fixedCosts: number
  variableCosts: number
  pricePerUnit: number
  breakEvenUnits: number
  breakEvenRevenue: number
  contributionMargin: number
  marginPercentage: number
  projectedSales: number
  projectedProfit: number
  date: string
  notes?: string
}

interface Projection {
  units: number
  revenue: number
  totalCosts: number
  profit: number
  margin: number
}

export default function BreakEvenCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [fixedCosts, setFixedCosts] = useState('')
  const [variableCosts, setVariableCosts] = useState('')
  const [pricePerUnit, setPricePerUnit] = useState('')
  const [breakEven, setBreakEven] = useState<{ units: number; revenue: number; margin: number; contributionMargin: number } | null>(null)
  const [fixedCostItems, setFixedCostItems] = useState<FixedCost[]>([])
  const [editingFixedCost, setEditingFixedCost] = useState<FixedCost | null>(null)
  const [variableCostItems, setVariableCostItems] = useState<VariableCost[]>([])
  const [editingVariableCost, setEditingVariableCost] = useState<VariableCost | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [scenarios, setScenarios] = useState<BreakEvenScenario[]>([])
  const [editingScenario, setEditingScenario] = useState<BreakEvenScenario | null>(null)
  const [projectedSales, setProjectedSales] = useState('')

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'costs', label: 'Costs', icon: DollarSign },
    { id: 'products', label: 'Products', icon: Target },
    { id: 'scenarios', label: 'Scenarios', icon: TrendingUp },
    { id: 'projections', label: 'Projections', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('breakEvenCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.fixedCostItems) setFixedCostItems(data.fixedCostItems)
          if (data.variableCostItems) setVariableCostItems(data.variableCostItems)
          if (data.products) setProducts(data.products)
          if (data.scenarios) setScenarios(data.scenarios)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  useEffect(() => {
    // Auto-calculate total fixed costs from items
    const totalFixed = fixedCostItems.reduce((sum, item) => {
      let annualAmount = item.amount
      if (item.frequency === 'monthly') annualAmount = item.amount * 12
      else if (item.frequency === 'quarterly') annualAmount = item.amount * 4
      return sum + annualAmount
    }, 0)
    if (totalFixed > 0) {
      setFixedCosts(totalFixed.toString())
    }
  }, [fixedCostItems])

  useEffect(() => {
    // Auto-calculate total variable costs from items
    const totalVariable = variableCostItems.reduce((sum, item) => sum + item.costPerUnit, 0)
    if (totalVariable > 0) {
      setVariableCosts(totalVariable.toString())
    }
  }, [variableCostItems])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        fixedCostItems,
        variableCostItems,
        products,
        scenarios,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('breakEvenCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const calculate = () => {
    const fixed = parseFloat(fixedCosts)
    const variable = parseFloat(variableCosts)
    const price = parseFloat(pricePerUnit)
    
    if (!fixed || !variable || !price || price <= variable) {
      showToast('Please enter valid values. Price must be greater than variable cost.', 'error')
      return
    }

    const contributionMargin = price - variable
    const breakEvenUnits = fixed / contributionMargin
    const breakEvenRevenue = breakEvenUnits * price
    const margin = (contributionMargin / price) * 100

    setBreakEven({
      units: breakEvenUnits,
      revenue: breakEvenRevenue,
      margin,
      contributionMargin
    })
    showToast('Break-even point calculated!', 'success')
  }

  const addFixedCost = () => {
    const newCost: FixedCost = {
      id: Date.now().toString(),
      name: '',
      category: 'other',
      amount: 0,
      recurring: true,
      frequency: 'monthly'
    }
    setEditingFixedCost(newCost)
  }

  const saveFixedCost = () => {
    if (!editingFixedCost) return
    if (!editingFixedCost.name || editingFixedCost.amount <= 0) {
      showToast('Please enter name and amount', 'error')
      return
    }

    const updated = fixedCostItems.find(c => c.id === editingFixedCost.id)
      ? fixedCostItems.map(c => c.id === editingFixedCost.id ? editingFixedCost : c)
      : [...fixedCostItems, editingFixedCost]

    setFixedCostItems(updated)
    setEditingFixedCost(null)
    saveToLocalStorage()
    showToast('Fixed cost saved!', 'success')
  }

  const deleteFixedCost = (id: string) => {
    if (confirm('Are you sure you want to delete this fixed cost?')) {
      const updated = fixedCostItems.filter(c => c.id !== id)
      setFixedCostItems(updated)
      saveToLocalStorage()
      showToast('Fixed cost deleted', 'info')
    }
  }

  const addVariableCost = () => {
    const newCost: VariableCost = {
      id: Date.now().toString(),
      name: '',
      category: 'materials',
      costPerUnit: 0
    }
    setEditingVariableCost(newCost)
  }

  const saveVariableCost = () => {
    if (!editingVariableCost) return
    if (!editingVariableCost.name || editingVariableCost.costPerUnit <= 0) {
      showToast('Please enter name and cost per unit', 'error')
      return
    }

    const updated = variableCostItems.find(c => c.id === editingVariableCost.id)
      ? variableCostItems.map(c => c.id === editingVariableCost.id ? editingVariableCost : c)
      : [...variableCostItems, editingVariableCost]

    setVariableCostItems(updated)
    setEditingVariableCost(null)
    saveToLocalStorage()
    showToast('Variable cost saved!', 'success')
  }

  const deleteVariableCost = (id: string) => {
    if (confirm('Are you sure you want to delete this variable cost?')) {
      const updated = variableCostItems.filter(c => c.id !== id)
      setVariableCostItems(updated)
      saveToLocalStorage()
      showToast('Variable cost deleted', 'info')
    }
  }

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      pricePerUnit: 0,
      variableCostPerUnit: 0,
      contributionMargin: 0,
      marginPercentage: 0,
      breakEvenUnits: 0,
      breakEvenRevenue: 0
    }
    setEditingProduct(newProduct)
  }

  const saveProduct = () => {
    if (!editingProduct) return
    if (!editingProduct.name || editingProduct.pricePerUnit <= 0 || editingProduct.variableCostPerUnit < 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }
    if (editingProduct.pricePerUnit <= editingProduct.variableCostPerUnit) {
      showToast('Price must be greater than variable cost', 'error')
      return
    }

    const totalFixed = fixedCostItems.reduce((sum, item) => {
      let annualAmount = item.amount
      if (item.frequency === 'monthly') annualAmount = item.amount * 12
      else if (item.frequency === 'quarterly') annualAmount = item.amount * 4
      return sum + annualAmount
    }, 0)

    const contributionMargin = editingProduct.pricePerUnit - editingProduct.variableCostPerUnit
    const marginPercentage = (contributionMargin / editingProduct.pricePerUnit) * 100
    const breakEvenUnits = totalFixed > 0 ? totalFixed / contributionMargin : 0
    const breakEvenRevenue = breakEvenUnits * editingProduct.pricePerUnit

    const updatedProduct = {
      ...editingProduct,
      contributionMargin,
      marginPercentage,
      breakEvenUnits,
      breakEvenRevenue
    }

    const updated = products.find(p => p.id === updatedProduct.id)
      ? products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      : [...products, updatedProduct]

    setProducts(updated)
    setEditingProduct(null)
    saveToLocalStorage()
    showToast('Product saved!', 'success')
  }

  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter(p => p.id !== id)
      setProducts(updated)
      saveToLocalStorage()
      showToast('Product deleted', 'info')
    }
  }

  const createScenario = () => {
    const fixed = parseFloat(fixedCosts) || 0
    const variable = parseFloat(variableCosts) || 0
    const price = parseFloat(pricePerUnit) || 0
    const sales = parseFloat(projectedSales) || 0

    if (fixed <= 0 || variable < 0 || price <= variable) {
      showToast('Please calculate break-even first', 'error')
      return
    }

    const contributionMargin = price - variable
    const breakEvenUnits = fixed / contributionMargin
    const breakEvenRevenue = breakEvenUnits * price
    const marginPercentage = (contributionMargin / price) * 100
    const projectedProfit = sales > 0 ? (sales * contributionMargin) - fixed : 0

    const newScenario: BreakEvenScenario = {
      id: Date.now().toString(),
      name: 'New Scenario',
      fixedCosts: fixed,
      variableCosts: variable,
      pricePerUnit: price,
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      marginPercentage,
      projectedSales: sales,
      projectedProfit,
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

  const generateProjections = (): Projection[] => {
    const fixed = parseFloat(fixedCosts) || 0
    const variable = parseFloat(variableCosts) || 0
    const price = parseFloat(pricePerUnit) || 0

    if (fixed <= 0 || price <= variable) return []

    const projections: Projection[] = []
    const breakEvenUnits = fixed / (price - variable)
    const maxUnits = Math.max(breakEvenUnits * 2, 1000)

    for (let units = 0; units <= maxUnits; units += Math.max(1, Math.floor(maxUnits / 20))) {
      const revenue = units * price
      const totalCosts = fixed + (units * variable)
      const profit = revenue - totalCosts
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0

      projections.push({
        units: Math.round(units),
        revenue: Math.round(revenue),
        totalCosts: Math.round(totalCosts),
        profit: Math.round(profit),
        margin
      })
    }

    return projections
  }

  const exportData = () => {
    const data = {
      currentCalculation: {
        fixedCosts: parseFloat(fixedCosts) || 0,
        variableCosts: parseFloat(variableCosts) || 0,
        pricePerUnit: parseFloat(pricePerUnit) || 0,
        breakEven
      },
      fixedCostItems,
      variableCostItems,
      products,
      scenarios,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `break-even-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported!', 'success')
  }

  const costCategoryLabels: Record<CostCategory, string> = {
    'rent': 'Rent',
    'salaries': 'Salaries',
    'utilities': 'Utilities',
    'marketing': 'Marketing',
    'software': 'Software',
    'materials': 'Materials',
    'shipping': 'Shipping',
    'other': 'Other'
  }

  const fixedCostByCategory = fixedCostItems.reduce((acc, item) => {
    let annualAmount = item.amount
    if (item.frequency === 'monthly') annualAmount = item.amount * 12
    else if (item.frequency === 'quarterly') annualAmount = item.amount * 4
    acc[item.category] = (acc[item.category] || 0) + annualAmount
    return acc
  }, {} as Record<CostCategory, number>)

  const projections = generateProjections()
  const projectionChartData = projections.map(p => ({
    units: p.units,
    revenue: p.revenue,
    costs: p.totalCosts,
    profit: p.profit
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Break-Even Calculator
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate break-even point, track costs, and analyze profitability scenarios
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
                <div className="text-sm text-gray-600 mb-1">Break-Even Units</div>
                <div className="text-2xl font-bold text-primary-600">
                  {breakEven ? breakEven.units.toFixed(0) : '0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Break-Even Revenue</div>
                <div className="text-2xl font-bold text-green-600">
                  {breakEven ? `$${breakEven.revenue.toLocaleString()}` : '$0'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Contribution Margin</div>
                <div className="text-2xl font-bold">
                  {breakEven ? `${breakEven.margin.toFixed(1)}%` : '0%'}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Fixed Costs</div>
                <div className="text-2xl font-bold">
                  {fixedCosts ? `$${(parseFloat(fixedCosts) / 1000).toFixed(0)}K` : '$0'}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary-500" />
                  Break-Even Calculator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Costs ($) *</label>
                    <Input
                      type="number"
                      value={fixedCosts}
                      onChange={(e) => setFixedCosts(e.target.value)}
                      placeholder="50000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total annual fixed costs</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variable Costs per Unit ($) *</label>
                    <Input
                      type="number"
                      value={variableCosts}
                      onChange={(e) => setVariableCosts(e.target.value)}
                      placeholder="10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cost per unit sold</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Unit ($) *</label>
                    <Input
                      type="number"
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(e.target.value)}
                      placeholder="50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Selling price per unit</p>
                  </div>
                  <Button onClick={calculate} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Break-Even
                  </Button>
                  {breakEven && (
                    <div className="bg-primary-500/10 border-2 border-primary-500/20 rounded-lg p-6 space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Break-Even Units</p>
                        <p className="text-3xl font-bold text-primary-500">{breakEven.units.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Break-Even Revenue</p>
                        <p className="text-3xl font-bold text-green-600">${breakEven.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Contribution Margin</p>
                        <p className="text-2xl font-bold text-blue-600">{breakEven.margin.toFixed(2)}%</p>
                        <p className="text-xs text-gray-500 mt-1">${breakEven.contributionMargin.toFixed(2)} per unit</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary-500" />
                  About Break-Even
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Break-Even Point</strong> is when total revenue equals total costs. At this point, you're neither making a profit nor a loss.
                  </p>
                  <p>
                    <strong>Formula:</strong> Break-Even Units = Fixed Costs / (Price - Variable Costs)
                  </p>
                  <p>
                    <strong>Contribution Margin</strong> is the amount each unit contributes to covering fixed costs and generating profit.
                  </p>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-yellow-900 mb-1">Best Practices</div>
                        <ul className="text-xs text-yellow-800 space-y-1">
                          <li>• Track all fixed and variable costs accurately</li>
                          <li>• Monitor contribution margin trends</li>
                          <li>• Aim for contribution margin &gt;50%</li>
                          <li>• Regularly review break-even point</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Costs Tab */}
        {activeTab === 'costs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-6 w-6 text-primary-500 shrink-0" />
                    <h2 className="text-2xl font-bold">Fixed Costs</h2>
                  </div>
                  <Button onClick={addFixedCost} size="sm" className="shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cost
                  </Button>
                </div>

                {fixedCostItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <DollarSign className="h-16 w-16 mx-auto mb-4" />
                    <p>No fixed costs yet. Add fixed costs to track expenses.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total Annual Fixed Costs</div>
                      <div className="text-2xl font-bold text-primary-600">
                        ${fixedCostItems.reduce((sum, item) => {
                          let annualAmount = item.amount
                          if (item.frequency === 'monthly') annualAmount = item.amount * 12
                          else if (item.frequency === 'quarterly') annualAmount = item.amount * 4
                          return sum + annualAmount
                        }, 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {fixedCostItems.map((cost) => {
                        let annualAmount = cost.amount
                        if (cost.frequency === 'monthly') annualAmount = cost.amount * 12
                        else if (cost.frequency === 'quarterly') annualAmount = cost.amount * 4
                        return (
                          <Card key={cost.id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold">{cost.name}</h4>
                                  <Badge variant="outline" className="text-xs">{costCategoryLabels[cost.category]}</Badge>
                                  <Badge variant="beginner" className="text-xs">{cost.frequency}</Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                  ${cost.amount.toLocaleString()}/{cost.frequency} • ${annualAmount.toLocaleString()}/year
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingFixedCost(cost)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteFixedCost(cost.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </>
                )}
              </Card>

              <Card>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-primary-500 shrink-0" />
                    <h2 className="text-2xl font-bold">Variable Costs</h2>
                  </div>
                  <Button onClick={addVariableCost} size="sm" className="shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cost
                  </Button>
                </div>

                {variableCostItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                    <p>No variable costs yet. Add variable costs per unit.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total Variable Cost per Unit</div>
                      <div className="text-2xl font-bold text-green-600">
                        ${variableCostItems.reduce((sum, item) => sum + item.costPerUnit, 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {variableCostItems.map((cost) => (
                        <Card key={cost.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{cost.name}</h4>
                                <Badge variant="outline" className="text-xs">{costCategoryLabels[cost.category]}</Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                ${cost.costPerUnit.toFixed(2)} per unit
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingVariableCost(cost)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteVariableCost(cost.id)}
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

            {Object.keys(fixedCostByCategory).length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Fixed Costs by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(fixedCostByCategory).map(([category, value]) => ({
                    category: costCategoryLabels[category as CostCategory],
                    amount: value
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#3b82f6" name="Annual Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Products & Services</h2>
                </div>
                <Button onClick={addProduct} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No products yet. Add products to calculate break-even for each.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((product) => (
                    <Card key={product.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{product.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {product.marginPercentage.toFixed(1)}% margin
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Price:</span> ${product.pricePerUnit.toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">Break-Even Units:</span> {product.breakEvenUnits.toFixed(0)}
                            </div>
                            <div>
                              <span className="font-medium">Break-Even Revenue:</span> ${product.breakEvenRevenue.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Contribution:</span> ${product.contributionMargin.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteProduct(product.id)}
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
                  <TrendingUp className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Break-Even Scenarios</h2>
                </div>
                <Button onClick={createScenario} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Scenario
                </Button>
              </div>

              {scenarios.length === 0 && !editingScenario ? (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <p>No scenarios yet. Create scenarios to compare different break-even points.</p>
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
                                  {new Date(scenario.date).toLocaleDateString()}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Break-Even Units:</span> {scenario.breakEvenUnits.toFixed(0)}
                                </div>
                                <div>
                                  <span className="font-medium">Break-Even Revenue:</span> ${scenario.breakEvenRevenue.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Margin:</span> {scenario.marginPercentage.toFixed(1)}%
                                </div>
                                {scenario.projectedSales > 0 && (
                                  <div>
                                    <span className="font-medium">Projected Profit:</span> ${scenario.projectedProfit.toLocaleString()}
                                  </div>
                                )}
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Costs ($)</label>
                            <Input
                              type="number"
                              value={editingScenario.fixedCosts}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Variable Costs ($)</label>
                            <Input
                              type="number"
                              value={editingScenario.variableCosts}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price per Unit ($)</label>
                            <Input
                              type="number"
                              value={editingScenario.pricePerUnit}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Projected Sales (units)</label>
                          <Input
                            type="number"
                            value={editingScenario.projectedSales}
                            onChange={(e) => {
                              const sales = parseFloat(e.target.value) || 0
                              const profit = (sales * editingScenario.contributionMargin) - editingScenario.fixedCosts
                              setEditingScenario({ ...editingScenario, projectedSales: sales, projectedProfit: profit })
                            }}
                            placeholder="1000"
                          />
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600 mb-1">Break-Even Units</div>
                              <div className="font-bold text-primary-600">{editingScenario.breakEvenUnits.toFixed(0)}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Break-Even Revenue</div>
                              <div className="font-bold text-green-600">${editingScenario.breakEvenRevenue.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Contribution Margin</div>
                              <div className="font-bold">{editingScenario.marginPercentage.toFixed(1)}%</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Projected Profit</div>
                              <div className={`font-bold ${editingScenario.projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${editingScenario.projectedProfit.toLocaleString()}
                              </div>
                            </div>
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

        {/* Projections Tab */}
        {activeTab === 'projections' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Profit/Loss Projections</h2>
              </div>

              {!breakEven ? (
                <div className="text-center py-12 text-gray-400">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>Please calculate break-even first to see projections.</p>
                </div>
              ) : (
                <>
                  {projectionChartData.length > 0 && (
                    <Card className="mb-6">
                      <h3 className="font-semibold mb-4">Revenue vs Costs</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={projectionChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="units" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Revenue" />
                          <Area type="monotone" dataKey="costs" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Total Costs" />
                          <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Profit" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>
                  )}

                  <Card>
                    <h3 className="font-semibold mb-4">Projection Table</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Units</th>
                            <th className="text-right p-2">Revenue</th>
                            <th className="text-right p-2">Total Costs</th>
                            <th className="text-right p-2">Profit</th>
                            <th className="text-right p-2">Margin %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projections.filter((p, i) => i % Math.max(1, Math.floor(projections.length / 10)) === 0).map((projection, idx) => (
                            <tr key={idx} className={`border-b ${projection.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                              <td className="p-2 font-medium">{projection.units.toLocaleString()}</td>
                              <td className="p-2 text-right">${projection.revenue.toLocaleString()}</td>
                              <td className="p-2 text-right">${projection.totalCosts.toLocaleString()}</td>
                              <td className={`p-2 text-right font-bold ${projection.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${projection.profit.toLocaleString()}
                              </td>
                              <td className="p-2 text-right">{projection.margin.toFixed(1)}%</td>
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

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <History className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Calculation History</h2>
              </div>
              {scenarios.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No history yet. Create scenarios to build history.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scenarios.map((scenario) => (
                    <Card key={scenario.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{scenario.name}</h4>
                          <p className="text-sm text-gray-600">
                            Break-Even: {scenario.breakEvenUnits.toFixed(0)} units • ${scenario.breakEvenRevenue.toLocaleString()} revenue
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{scenario.marginPercentage.toFixed(1)}%</p>
                          <p className="text-xs text-gray-600">Margin</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Edit Fixed Cost Modal */}
        {editingFixedCost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Fixed Cost</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingFixedCost(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Name *</label>
                  <Input
                    value={editingFixedCost.name}
                    onChange={(e) => setEditingFixedCost({ ...editingFixedCost, name: e.target.value })}
                    placeholder="e.g., Office Rent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <Select
                      value={editingFixedCost.category}
                      onChange={(e) => setEditingFixedCost({ ...editingFixedCost, category: e.target.value as CostCategory })}
                      options={[
                        { value: 'rent', label: 'Rent' },
                        { value: 'salaries', label: 'Salaries' },
                        { value: 'utilities', label: 'Utilities' },
                        { value: 'marketing', label: 'Marketing' },
                        { value: 'software', label: 'Software' },
                        { value: 'materials', label: 'Materials' },
                        { value: 'shipping', label: 'Shipping' },
                        { value: 'other', label: 'Other' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($) *</label>
                    <Input
                      type="number"
                      value={editingFixedCost.amount}
                      onChange={(e) => setEditingFixedCost({ ...editingFixedCost, amount: parseFloat(e.target.value) || 0 })}
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                    <Select
                      value={editingFixedCost.frequency}
                      onChange={(e) => setEditingFixedCost({ ...editingFixedCost, frequency: e.target.value as any })}
                      options={[
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'quarterly', label: 'Quarterly' },
                        { value: 'annually', label: 'Annually' }
                      ]}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    <input
                      type="checkbox"
                      checked={editingFixedCost.recurring}
                      onChange={(e) => setEditingFixedCost({ ...editingFixedCost, recurring: e.target.checked })}
                      className="rounded"
                    />
                    <label className="text-sm text-gray-700">Recurring</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingFixedCost.notes || ''}
                    onChange={(e) => setEditingFixedCost({ ...editingFixedCost, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveFixedCost} className="flex-1">
                    Save Cost
                  </Button>
                  <Button variant="outline" onClick={() => setEditingFixedCost(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Variable Cost Modal */}
        {editingVariableCost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Variable Cost</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingVariableCost(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Name *</label>
                  <Input
                    value={editingVariableCost.name}
                    onChange={(e) => setEditingVariableCost({ ...editingVariableCost, name: e.target.value })}
                    placeholder="e.g., Material Cost"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <Select
                      value={editingVariableCost.category}
                      onChange={(e) => setEditingVariableCost({ ...editingVariableCost, category: e.target.value as CostCategory })}
                      options={[
                        { value: 'materials', label: 'Materials' },
                        { value: 'shipping', label: 'Shipping' },
                        { value: 'marketing', label: 'Marketing' },
                        { value: 'other', label: 'Other' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Unit ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingVariableCost.costPerUnit}
                      onChange={(e) => setEditingVariableCost({ ...editingVariableCost, costPerUnit: parseFloat(e.target.value) || 0 })}
                      placeholder="10.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingVariableCost.notes || ''}
                    onChange={(e) => setEditingVariableCost({ ...editingVariableCost, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveVariableCost} className="flex-1">
                    Save Cost
                  </Button>
                  <Button variant="outline" onClick={() => setEditingVariableCost(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Product</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingProduct(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g., Premium Plan"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Unit ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingProduct.pricePerUnit}
                      onChange={(e) => setEditingProduct({ ...editingProduct, pricePerUnit: parseFloat(e.target.value) || 0 })}
                      placeholder="50.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variable Cost per Unit ($) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingProduct.variableCostPerUnit}
                      onChange={(e) => setEditingProduct({ ...editingProduct, variableCostPerUnit: parseFloat(e.target.value) || 0 })}
                      placeholder="10.00"
                    />
                  </div>
                </div>
                {editingProduct.pricePerUnit > 0 && editingProduct.variableCostPerUnit >= 0 && editingProduct.pricePerUnit > editingProduct.variableCostPerUnit && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Contribution Margin:</div>
                        <div className="font-bold text-primary-600">
                          ${(editingProduct.pricePerUnit - editingProduct.variableCostPerUnit).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Margin %:</div>
                        <div className="font-bold">
                          {(((editingProduct.pricePerUnit - editingProduct.variableCostPerUnit) / editingProduct.pricePerUnit) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={saveProduct} className="flex-1">
                    Save Product
                  </Button>
                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
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
