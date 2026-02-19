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
  Calculator,
  Sparkles,
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
  Download,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  FileText,
  Clock,
  Percent,
  Award,
  TrendingDown
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts'

type OptionType = 'iso' | 'nso' | 'rsu'
type VestingFrequency = 'monthly' | 'quarterly' | 'annually'

interface OptionGrant {
  id: string
  employeeName: string
  employeeEmail: string
  grantDate: string
  optionType: OptionType
  totalOptions: number
  exercisePrice: number
  vestingSchedule: VestingSchedule
  exercisedOptions: number
  notes?: string
}

interface VestingSchedule {
  totalYears: number
  cliffMonths: number
  vestingFrequency: VestingFrequency
  startDate: string
}

interface OptionPool {
  totalShares: number
  allocatedShares: number
  reservedShares: number
  availableShares: number
  percentageOfCompany: number
}

interface ExerciseScenario {
  id: string
  name: string
  currentValuation: number
  exercisePrice: number
  optionsToExercise: number
  taxRate: number
  resultingValue: number
  taxOwed: number
  netValue: number
}

export default function ESOPCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [totalShares, setTotalShares] = useState(10000000)
  const [optionPool, setOptionPool] = useState<OptionPool>({
    totalShares: 2000000,
    allocatedShares: 0,
    reservedShares: 0,
    availableShares: 2000000,
    percentageOfCompany: 20
  })
  const [optionGrants, setOptionGrants] = useState<OptionGrant[]>([])
  const [editingGrant, setEditingGrant] = useState<OptionGrant | null>(null)
  const [exerciseScenarios, setExerciseScenarios] = useState<ExerciseScenario[]>([])
  const [editingScenario, setEditingScenario] = useState<ExerciseScenario | null>(null)
  const [currentValuation, setCurrentValuation] = useState(10000000)

  const tabs = [
    { id: 'calculator', label: 'ESOP Calculator', icon: Calculator },
    { id: 'pool', label: 'Option Pool', icon: Target },
    { id: 'grants', label: 'Option Grants', icon: Award },
    { id: 'vesting', label: 'Vesting Tracker', icon: Calendar },
    { id: 'exercise', label: 'Exercise Calculator', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('esopCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.totalShares) setTotalShares(data.totalShares)
          if (data.optionPool) setOptionPool(data.optionPool)
          if (data.optionGrants) setOptionGrants(data.optionGrants)
          if (data.exerciseScenarios) setExerciseScenarios(data.exerciseScenarios)
          if (data.currentValuation) setCurrentValuation(data.currentValuation)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  useEffect(() => {
    updateOptionPool()
  }, [optionGrants, totalShares])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        totalShares,
        optionPool,
        optionGrants,
        exerciseScenarios,
        currentValuation,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('esopCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const updateOptionPool = () => {
    const allocated = optionGrants.reduce((sum, grant) => sum + grant.totalOptions, 0)
    const reserved = optionGrants.reduce((sum, grant) => {
      const vested = calculateVestedOptions(grant)
      return sum + (grant.totalOptions - vested)
    }, 0)
    const available = optionPool.totalShares - allocated
    const percentage = (optionPool.totalShares / totalShares) * 100

    setOptionPool({
      ...optionPool,
      allocatedShares: allocated,
      reservedShares: reserved,
      availableShares: available,
      percentageOfCompany: percentage
    })
  }

  const calculateVestedOptions = (grant: OptionGrant, currentDate: Date = new Date()) => {
    const startDate = new Date(grant.vestingSchedule.startDate)
    const monthsElapsed = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
                         (currentDate.getMonth() - startDate.getMonth())
    
    if (monthsElapsed < grant.vestingSchedule.cliffMonths) {
      return 0
    }

    const totalMonths = grant.vestingSchedule.totalYears * 12
    const vestedMonths = Math.min(monthsElapsed, totalMonths)
    
    let vestedOptions = 0
    if (grant.vestingSchedule.vestingFrequency === 'monthly') {
      vestedOptions = (grant.totalOptions / totalMonths) * vestedMonths
    } else if (grant.vestingSchedule.vestingFrequency === 'quarterly') {
      const quartersVested = Math.floor(vestedMonths / 3)
      const totalQuarters = grant.vestingSchedule.totalYears * 4
      vestedOptions = (grant.totalOptions / totalQuarters) * quartersVested
    } else {
      const yearsVested = Math.floor(vestedMonths / 12)
      vestedOptions = (grant.totalOptions / grant.vestingSchedule.totalYears) * yearsVested
    }

    return Math.min(Math.floor(vestedOptions), grant.totalOptions)
  }

  const addOptionGrant = () => {
    const newGrant: OptionGrant = {
      id: Date.now().toString(),
      employeeName: '',
      employeeEmail: '',
      grantDate: new Date().toISOString().split('T')[0],
      optionType: 'iso',
      totalOptions: 0,
      exercisePrice: 0.01,
      vestingSchedule: {
        totalYears: 4,
        cliffMonths: 12,
        vestingFrequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0]
      },
      exercisedOptions: 0
    }
    setEditingGrant(newGrant)
  }

  const saveOptionGrant = () => {
    if (!editingGrant) return
    if (!editingGrant.employeeName || editingGrant.totalOptions <= 0) {
      showToast('Please enter employee name and total options', 'error')
      return
    }
    if (editingGrant.totalOptions > optionPool.availableShares) {
      showToast(`Not enough options available. Only ${optionPool.availableShares.toLocaleString()} available.`, 'error')
      return
    }

    const updated = optionGrants.find(g => g.id === editingGrant.id)
      ? optionGrants.map(g => g.id === editingGrant.id ? editingGrant : g)
      : [...optionGrants, editingGrant]

    setOptionGrants(updated)
    setEditingGrant(null)
    saveToLocalStorage()
    showToast('Option grant saved!', 'success')
  }

  const deleteOptionGrant = (id: string) => {
    if (confirm('Are you sure you want to delete this option grant?')) {
      const updated = optionGrants.filter(g => g.id !== id)
      setOptionGrants(updated)
      saveToLocalStorage()
      showToast('Option grant deleted', 'info')
    }
  }

  const calculateExerciseValue = (scenario: ExerciseScenario) => {
    const pricePerShare = currentValuation / totalShares
    const spread = pricePerShare - scenario.exercisePrice
    const grossValue = spread * scenario.optionsToExercise
    const taxOwed = grossValue * (scenario.taxRate / 100)
    const netValue = grossValue - taxOwed

    return {
      ...scenario,
      resultingValue: grossValue,
      taxOwed,
      netValue
    }
  }

  const createExerciseScenario = () => {
    if (optionGrants.length === 0) {
      showToast('Please create option grants first', 'error')
      return
    }
    const newScenario: ExerciseScenario = {
      id: Date.now().toString(),
      name: '',
      currentValuation,
      exercisePrice: 0.01,
      optionsToExercise: 0,
      taxRate: 37, // Default federal tax rate
      resultingValue: 0,
      taxOwed: 0,
      netValue: 0
    }
    setEditingScenario(newScenario)
  }

  const saveExerciseScenario = () => {
    if (!editingScenario) return
    if (!editingScenario.name || editingScenario.optionsToExercise <= 0) {
      showToast('Please enter scenario name and options to exercise', 'error')
      return
    }

    const calculated = calculateExerciseValue(editingScenario)
    const updated = exerciseScenarios.find(s => s.id === calculated.id)
      ? exerciseScenarios.map(s => s.id === calculated.id ? calculated : s)
      : [...exerciseScenarios, calculated]

    setExerciseScenarios(updated)
    setEditingScenario(null)
    saveToLocalStorage()
    showToast('Exercise scenario saved!', 'success')
  }

  const exportData = () => {
    const data = {
      totalShares,
      optionPool,
      optionGrants,
      exerciseScenarios,
      currentValuation,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `esop-calculator-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported!', 'success')
  }

  const getVestingTimeline = (grant: OptionGrant) => {
    const timeline = []
    const startDate = new Date(grant.vestingSchedule.startDate)
    const totalMonths = grant.vestingSchedule.totalYears * 12
    
    for (let month = 0; month <= totalMonths; month += grant.vestingSchedule.vestingFrequency === 'monthly' ? 1 : 
      grant.vestingSchedule.vestingFrequency === 'quarterly' ? 3 : 12) {
      const date = new Date(startDate)
      date.setMonth(date.getMonth() + month)
      const vested = calculateVestedOptions({ ...grant, vestingSchedule: { ...grant.vestingSchedule, startDate: date.toISOString().split('T')[0] } }, date)
      timeline.push({
        date: date.toISOString().split('T')[0],
        vested,
        month
      })
    }
    return timeline
  }

  const grantsChartData = optionGrants.map(g => ({
    name: g.employeeName,
    total: g.totalOptions,
    vested: calculateVestedOptions(g),
    unvested: g.totalOptions - calculateVestedOptions(g)
  }))

  const poolChartData = [
    { name: 'Allocated', value: optionPool.allocatedShares },
    { name: 'Reserved', value: optionPool.reservedShares },
    { name: 'Available', value: optionPool.availableShares }
  ]

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6']

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            ESOP Calculator
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage Employee Stock Option Plans, track vesting, and calculate exercise values
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

        {/* ESOP Calculator Tab */}
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
                        updateOptionPool()
                      }}
                      placeholder="10000000"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Option Pool Size</label>
                    <Input
                      type="number"
                      value={optionPool.totalShares}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0
                        setOptionPool({ ...optionPool, totalShares: val })
                      }}
                      placeholder="2000000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {((optionPool.totalShares / totalShares) * 100).toFixed(1)}% of company
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Pool Status</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {optionPool.availableShares.toLocaleString()} available
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {optionPool.allocatedShares.toLocaleString()} allocated
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary-500" />
                  Option Calculator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options to Grant</label>
                    <Input
                type="number"
                      placeholder="Enter options"
                      id="options-input"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter Percentage (%)</label>
                    <Input
                type="number"
                      step="0.01"
                      placeholder="Enter percentage"
                      id="percentage-input"
                      onChange={(e) => {
                        const percentage = parseFloat(e.target.value) || 0
                        const options = (percentage / 100) * totalShares
                        const input = document.getElementById('options-input') as HTMLInputElement
                        if (input) input.value = Math.round(options).toString()
                      }}
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Resulting Equity</div>
                    <div id="equity-result" className="text-lg font-bold text-primary-600">0%</div>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Info className="h-5 w-5 text-primary-500" />
                <h3 className="font-semibold">Option Types</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">ISO (Incentive Stock Options)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tax advantages for employees</li>
                    <li>• $100K annual limit</li>
                    <li>• No tax on exercise (if held 2+ years)</li>
                    <li>• AMT may apply</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">NSO (Non-Qualified Stock Options)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• More flexible than ISO</li>
                    <li>• No annual limit</li>
                    <li>• Taxed as ordinary income on exercise</li>
                    <li>• Company gets tax deduction</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">RSU (Restricted Stock Units)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Actual shares, not options</li>
                    <li>• Taxed when vested</li>
                    <li>• No exercise price</li>
                    <li>• Simpler for employees</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Option Pool Tab */}
        {activeTab === 'pool' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Option Pool Management</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Pool Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Pool Size</label>
                      <Input
                        type="number"
                        value={optionPool.totalShares}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0
                          setOptionPool({ ...optionPool, totalShares: val })
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {((optionPool.totalShares / totalShares) * 100).toFixed(1)}% of total shares
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 mb-1">Allocated</div>
                          <div className="text-lg font-bold">{optionPool.allocatedShares.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Available</div>
                          <div className="text-lg font-bold text-green-600">{optionPool.availableShares.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Reserved</div>
                          <div className="text-lg font-bold">{optionPool.reservedShares.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">% of Company</div>
                          <div className="text-lg font-bold">{optionPool.percentageOfCompany.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Pool Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={poolChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${((value / optionPool.totalShares) * 100).toFixed(1)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {poolChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Option Grants Tab */}
        {activeTab === 'grants' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Option Grants</h2>
                </div>
                <Button onClick={addOptionGrant} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Grant
                </Button>
              </div>

              {optionGrants.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Award className="h-16 w-16 mx-auto mb-4" />
                  <p>No option grants yet. Create your first grant to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {optionGrants.map((grant) => {
                    const vested = calculateVestedOptions(grant)
                    const unvested = grant.totalOptions - vested
                    return (
                      <Card key={grant.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{grant.employeeName}</h4>
                              <Badge variant="outline" className="text-xs">{grant.optionType.toUpperCase()}</Badge>
                              <Badge variant="beginner" className="text-xs">
                                {((vested / grant.totalOptions) * 100).toFixed(0)}% Vested
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{grant.employeeEmail}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Total Options:</span> {grant.totalOptions.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Vested:</span> {vested.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Exercise Price:</span> ${grant.exercisePrice.toFixed(4)}
                              </div>
                              <div>
                                <span className="font-medium">Grant Date:</span> {new Date(grant.grantDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingGrant(grant)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteOptionGrant(grant.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-green-500 transition-all"
                              style={{ width: `${(vested / grant.totalOptions) * 100}%` }}
                            />
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

        {/* Vesting Tracker Tab */}
        {activeTab === 'vesting' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Vesting Tracker</h2>
              </div>

              {optionGrants.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="h-16 w-16 mx-auto mb-4" />
                  <p>No option grants yet. Create grants to track vesting.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {optionGrants.map((grant) => {
                    const vested = calculateVestedOptions(grant)
                    const timeline = getVestingTimeline(grant)
                    return (
                      <Card key={grant.id} className="p-6">
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">{grant.employeeName}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Total:</span> {grant.totalOptions.toLocaleString()}
                            </div>
                            <div>
                              <span className="text-gray-600">Vested:</span> {vested.toLocaleString()}
                            </div>
                            <div>
                              <span className="text-gray-600">Unvested:</span> {(grant.totalOptions - vested).toLocaleString()}
                            </div>
                            <div>
                              <span className="text-gray-600">% Vested:</span> {((vested / grant.totalOptions) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <h5 className="text-sm font-medium mb-2">Vesting Schedule</h5>
                          <div className="text-xs text-gray-600">
                            {grant.vestingSchedule.totalYears} years, {grant.vestingSchedule.cliffMonths} month cliff, {grant.vestingSchedule.vestingFrequency} vesting
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={timeline}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="vested" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Card>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Exercise Calculator Tab */}
        {activeTab === 'exercise' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Exercise Calculator</h2>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Current Valuation"
                    value={currentValuation}
                    onChange={(e) => setCurrentValuation(parseFloat(e.target.value) || 0)}
                    className="w-40"
                  />
                  <Button onClick={createExerciseScenario} size="sm" className="shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    New Scenario
                  </Button>
                </div>
              </div>

              {exerciseScenarios.length === 0 && !editingScenario ? (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <p>No exercise scenarios yet. Create one to calculate exercise values.</p>
                </div>
              ) : (
                <>
                  {exerciseScenarios.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {exerciseScenarios.map((scenario) => (
                        <Card key={scenario.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{scenario.name}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Options:</span> {scenario.optionsToExercise.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Gross Value:</span> ${scenario.resultingValue.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Tax Owed:</span> ${scenario.taxOwed.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Net Value:</span> <span className="text-green-600 font-bold">${scenario.netValue.toLocaleString()}</span>
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
                        <h3 className="text-lg font-semibold">Edit Exercise Scenario</h3>
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
                            placeholder="e.g., Employee Exercise - 2024"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Options to Exercise *</label>
                            <Input
                              type="number"
                              value={editingScenario.optionsToExercise}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const calculated = calculateExerciseValue({ ...editingScenario, optionsToExercise: val })
                                setEditingScenario(calculated)
                              }}
                              placeholder="10000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Price ($) *</label>
                            <Input
                              type="number"
                              step="0.0001"
                              value={editingScenario.exercisePrice}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const calculated = calculateExerciseValue({ ...editingScenario, exercisePrice: val })
                                setEditingScenario(calculated)
                              }}
                              placeholder="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                            <Input
                              type="number"
                              step="0.1"
                              value={editingScenario.taxRate}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                const calculated = calculateExerciseValue({ ...editingScenario, taxRate: val })
                                setEditingScenario(calculated)
                              }}
                              placeholder="37"
              />
            </div>
            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Valuation ($)</label>
                            <Input
                type="number"
                              value={editingScenario.currentValuation}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                setCurrentValuation(val)
                                const calculated = calculateExerciseValue({ ...editingScenario, currentValuation: val })
                                setEditingScenario(calculated)
                              }}
                              placeholder="10000000"
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold mb-3 text-green-900">Exercise Results:</h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-green-700 mb-1">Gross Value</div>
                              <div className="text-lg font-bold text-green-900">${editingScenario.resultingValue.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-green-700 mb-1">Tax Owed</div>
                              <div className="text-lg font-bold text-red-600">${editingScenario.taxOwed.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-green-700 mb-1">Net Value</div>
                              <div className="text-lg font-bold text-green-900">${editingScenario.netValue.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveExerciseScenario} className="flex-1">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Grants</div>
                <div className="text-2xl font-bold">{optionGrants.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Options</div>
                <div className="text-2xl font-bold">{optionGrants.reduce((sum, g) => sum + g.totalOptions, 0).toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Vested Options</div>
                <div className="text-2xl font-bold text-green-600">
                  {optionGrants.reduce((sum, g) => sum + calculateVestedOptions(g), 0).toLocaleString()}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Pool Utilization</div>
                <div className="text-2xl font-bold">
                  {((optionPool.allocatedShares / optionPool.totalShares) * 100).toFixed(0)}%
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Vesting Status by Grant</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={grantsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="vested" fill="#10b981" name="Vested" />
                    <Bar dataKey="unvested" fill="#f59e0b" name="Unvested" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Option Type Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={Object.entries(
                        optionGrants.reduce((acc, g) => {
                          acc[g.optionType] = (acc[g.optionType] || 0) + g.totalOptions
                          return acc
                        }, {} as Record<string, number>)
                      ).map(([type, value]) => ({ name: type.toUpperCase(), value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {['iso', 'nso', 'rsu'].map((type, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <History className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Grant History</h2>
              </div>
              <div className="space-y-3">
                {optionGrants.map((grant) => (
                  <Card key={grant.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold mb-1">{grant.employeeName}</h4>
                        <p className="text-sm text-gray-600">{new Date(grant.grantDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{grant.totalOptions.toLocaleString()} options</p>
                        <p className="text-xs text-gray-600">{grant.optionType.toUpperCase()}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                {optionGrants.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <History className="h-16 w-16 mx-auto mb-4" />
                    <p>No grant history yet</p>
              </div>
            )}
          </div>
        </Card>
          </div>
        )}

        {/* Edit Option Grant Modal */}
        {editingGrant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingGrant.id && optionGrants.find(g => g.id === editingGrant.id) ? 'Edit Option Grant' : 'New Option Grant'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingGrant(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name *</label>
                    <Input
                      value={editingGrant.employeeName}
                      onChange={(e) => setEditingGrant({ ...editingGrant, employeeName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee Email</label>
                    <Input
                      type="email"
                      value={editingGrant.employeeEmail}
                      onChange={(e) => setEditingGrant({ ...editingGrant, employeeEmail: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grant Date *</label>
                    <Input
                      type="date"
                      value={editingGrant.grantDate}
                      onChange={(e) => setEditingGrant({ ...editingGrant, grantDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Option Type *</label>
                    <Select
                      value={editingGrant.optionType}
                      onChange={(e) => setEditingGrant({ ...editingGrant, optionType: e.target.value as OptionType })}
                      options={[
                        { value: 'iso', label: 'ISO (Incentive Stock Options)' },
                        { value: 'nso', label: 'NSO (Non-Qualified Stock Options)' },
                        { value: 'rsu', label: 'RSU (Restricted Stock Units)' }
                      ]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Options *</label>
                    <Input
                      type="number"
                      value={editingGrant.totalOptions}
                      onChange={(e) => setEditingGrant({ ...editingGrant, totalOptions: parseFloat(e.target.value) || 0 })}
                      placeholder="10000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {((editingGrant.totalOptions / totalShares) * 100).toFixed(2)}% of company
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Price ($) *</label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={editingGrant.exercisePrice}
                      onChange={(e) => setEditingGrant({ ...editingGrant, exercisePrice: parseFloat(e.target.value) || 0 })}
                      placeholder="0.01"
                    />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Vesting Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Years</label>
                      <Input
                        type="number"
                        value={editingGrant.vestingSchedule.totalYears}
                        onChange={(e) => setEditingGrant({
                          ...editingGrant,
                          vestingSchedule: {
                            ...editingGrant.vestingSchedule,
                            totalYears: parseInt(e.target.value) || 4
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cliff (Months)</label>
                      <Input
                        type="number"
                        value={editingGrant.vestingSchedule.cliffMonths}
                        onChange={(e) => setEditingGrant({
                          ...editingGrant,
                          vestingSchedule: {
                            ...editingGrant.vestingSchedule,
                            cliffMonths: parseInt(e.target.value) || 12
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vesting Frequency</label>
                      <Select
                        value={editingGrant.vestingSchedule.vestingFrequency}
                        onChange={(e) => setEditingGrant({
                          ...editingGrant,
                          vestingSchedule: {
                            ...editingGrant.vestingSchedule,
                            vestingFrequency: e.target.value as VestingFrequency
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
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={editingGrant.vestingSchedule.startDate}
                      onChange={(e) => setEditingGrant({
                        ...editingGrant,
                        vestingSchedule: {
                          ...editingGrant.vestingSchedule,
                          startDate: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingGrant.notes || ''}
                    onChange={(e) => setEditingGrant({ ...editingGrant, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveOptionGrant} className="flex-1">
                    Save Grant
                  </Button>
                  <Button variant="outline" onClick={() => setEditingGrant(null)}>
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
