'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  BarChart3, 
  TrendingUp, 
  Target,
  Settings,
  Activity,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  X,
  Download,
  Filter,
  Search,
  Zap,
  FileText,
  PieChart,
  Calendar,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Shield,
  Gauge,
  Building2,
  Wrench,
  Repeat,
  Play,
  Pause,
  StopCircle
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts'

type KPICategory = 'revenue' | 'users' | 'operations' | 'quality' | 'efficiency' | 'custom'
type ProcessStatus = 'active' | 'paused' | 'completed' | 'failed'
type ResourceType = 'human' | 'equipment' | 'software' | 'infrastructure' | 'other'
type QualityStatus = 'pass' | 'fail' | 'warning' | 'pending'

interface KPI {
  id: string
  name: string
  category: KPICategory
  currentValue: number
  targetValue: number
  unit: string
  trend: number
  status: 'on-track' | 'at-risk' | 'behind'
  date: string
  notes?: string
}

interface Process {
  id: string
  name: string
  description: string
  status: ProcessStatus
  automation: boolean
  frequency: string
  lastRun?: string
  nextRun?: string
  successRate: number
  averageDuration: number
  steps: string[]
  createdAt: string
  updatedAt: string
}

interface Resource {
  id: string
  name: string
  type: ResourceType
  capacity: number
  utilization: number
  cost: number
  status: 'available' | 'in-use' | 'maintenance' | 'unavailable'
  assignedTo?: string
  notes?: string
}

interface QualityCheck {
  id: string
  name: string
  category: string
  status: QualityStatus
  score: number
  maxScore: number
  checkedBy: string
  checkedDate: string
  issues: string[]
  notes?: string
}

const categoryLabels: Record<KPICategory, string> = {
  'revenue': 'Revenue',
  'users': 'Users',
  'operations': 'Operations',
  'quality': 'Quality',
  'efficiency': 'Efficiency',
  'custom': 'Custom'
}

const statusLabels: Record<ProcessStatus, string> = {
  'active': 'Active',
  'paused': 'Paused',
  'completed': 'Completed',
  'failed': 'Failed'
}

const statusColors: Record<ProcessStatus, string> = {
  'active': 'bg-green-100 text-green-800',
  'paused': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-blue-100 text-blue-800',
  'failed': 'bg-red-100 text-red-800'
}

const resourceTypeLabels: Record<ResourceType, string> = {
  'human': 'Human',
  'equipment': 'Equipment',
  'software': 'Software',
  'infrastructure': 'Infrastructure',
  'other': 'Other'
}

const qualityStatusLabels: Record<QualityStatus, string> = {
  'pass': 'Pass',
  'fail': 'Fail',
  'warning': 'Warning',
  'pending': 'Pending'
}

const qualityStatusColors: Record<QualityStatus, string> = {
  'pass': 'bg-green-100 text-green-800',
  'fail': 'bg-red-100 text-red-800',
  'warning': 'bg-yellow-100 text-yellow-800',
  'pending': 'bg-gray-100 text-gray-800'
}

export default function OperationsDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [kpis, setKpis] = useState<KPI[]>([])
  const [processes, setProcesses] = useState<Process[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([])
  const [editingKPI, setEditingKPI] = useState<KPI | null>(null)
  const [editingProcess, setEditingProcess] = useState<Process | null>(null)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [kpiFormData, setKpiFormData] = useState({
    name: '',
    category: 'revenue' as KPICategory,
    currentValue: '',
    targetValue: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [processFormData, setProcessFormData] = useState({
    name: '',
    description: '',
    automation: false,
    frequency: '',
    steps: [] as string[]
  })
  const [newStep, setNewStep] = useState('')
  const [resourceFormData, setResourceFormData] = useState({
    name: '',
    type: 'human' as ResourceType,
    capacity: '',
    utilization: '',
    cost: '',
    status: 'available' as Resource['status'],
    assignedTo: '',
    notes: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'kpis', label: 'KPIs', icon: Target },
    { id: 'processes', label: 'Processes', icon: Zap },
    { id: 'resources', label: 'Resources', icon: Building2 },
    { id: 'quality', label: 'Quality', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('operationsDashboardData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.kpis) setKpis(data.kpis)
          if (data.processes) setProcesses(data.processes)
          if (data.resources) setResources(data.resources)
          if (data.qualityChecks) setQualityChecks(data.qualityChecks)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        kpis,
        processes,
        resources,
        qualityChecks,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('operationsDashboardData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const addKPI = () => {
    if (!kpiFormData.name || !kpiFormData.targetValue) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const currentValue = parseFloat(kpiFormData.currentValue) || 0
    const targetValue = parseFloat(kpiFormData.targetValue) || 0
    const progress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0
    const trend = 0 // Calculate from previous values if available
    const status: 'on-track' | 'at-risk' | 'behind' = progress >= 75 ? 'on-track' : progress >= 50 ? 'at-risk' : 'behind'

    const newKPI: KPI = {
      id: Date.now().toString(),
      name: kpiFormData.name,
      category: kpiFormData.category,
      currentValue,
      targetValue,
      unit: kpiFormData.unit,
      trend,
      status,
      date: kpiFormData.date,
      notes: kpiFormData.notes || undefined
    }

    setKpis([...kpis, newKPI])
    setEditingKPI(null)
    setKpiFormData({
      name: '',
      category: 'revenue',
      currentValue: '',
      targetValue: '',
      unit: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
    saveToLocalStorage()
    showToast('KPI added!', 'success')
  }

  const addProcess = () => {
    if (!processFormData.name || processFormData.steps.length === 0) {
      showToast('Please fill in name and add at least one step', 'error')
      return
    }

    const newProcess: Process = {
      id: Date.now().toString(),
      name: processFormData.name,
      description: processFormData.description,
      status: 'active',
      automation: processFormData.automation,
      frequency: processFormData.frequency,
      successRate: 0,
      averageDuration: 0,
      steps: processFormData.steps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setProcesses([...processes, newProcess])
    setEditingProcess(null)
    setProcessFormData({
      name: '',
      description: '',
      automation: false,
      frequency: '',
      steps: []
    })
    setNewStep('')
    saveToLocalStorage()
    showToast('Process added!', 'success')
  }

  const addProcessStep = () => {
    if (!newStep) {
      showToast('Please enter a step', 'error')
      return
    }
    setProcessFormData({
      ...processFormData,
      steps: [...processFormData.steps, newStep]
    })
    setNewStep('')
  }

  const addResource = () => {
    if (!resourceFormData.name || !resourceFormData.capacity) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const newResource: Resource = {
      id: Date.now().toString(),
      name: resourceFormData.name,
      type: resourceFormData.type,
      capacity: parseFloat(resourceFormData.capacity) || 0,
      utilization: parseFloat(resourceFormData.utilization) || 0,
      cost: parseFloat(resourceFormData.cost) || 0,
      status: resourceFormData.status,
      assignedTo: resourceFormData.assignedTo || undefined,
      notes: resourceFormData.notes || undefined
    }

    setResources([...resources, newResource])
    setEditingResource(null)
    setResourceFormData({
      name: '',
      type: 'human',
      capacity: '',
      utilization: '',
      cost: '',
      status: 'available',
      assignedTo: '',
      notes: ''
    })
    saveToLocalStorage()
    showToast('Resource added!', 'success')
  }

  const deleteKPI = (id: string) => {
    if (confirm('Are you sure you want to delete this KPI?')) {
      const updated = kpis.filter(k => k.id !== id)
      setKpis(updated)
      saveToLocalStorage()
      showToast('KPI deleted', 'info')
    }
  }

  const deleteProcess = (id: string) => {
    if (confirm('Are you sure you want to delete this process?')) {
      const updated = processes.filter(p => p.id !== id)
      setProcesses(updated)
      saveToLocalStorage()
      showToast('Process deleted', 'info')
    }
  }

  const deleteResource = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      const updated = resources.filter(r => r.id !== id)
      setResources(updated)
      saveToLocalStorage()
      showToast('Resource deleted', 'info')
    }
  }

  const toggleProcessStatus = (id: string, newStatus: ProcessStatus) => {
    const updated = processes.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      }
      return p
    })
    setProcesses(updated)
    saveToLocalStorage()
    showToast('Process status updated!', 'success')
  }

  const filteredKPIs = kpis.filter(kpi => {
    const matchesSearch = kpi.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || kpi.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = process.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || process.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalKPIs = kpis.length
  const onTrackKPIs = kpis.filter(k => k.status === 'on-track').length
  const atRiskKPIs = kpis.filter(k => k.status === 'at-risk').length
  const activeProcesses = processes.filter(p => p.status === 'active').length
  const totalResources = resources.length
  const averageUtilization = resources.length > 0
    ? resources.reduce((sum, r) => sum + r.utilization, 0) / resources.length
    : 0
  const totalQualityChecks = qualityChecks.length
  const passedChecks = qualityChecks.filter(q => q.status === 'pass').length
  const qualityScore = totalQualityChecks > 0
    ? (passedChecks / totalQualityChecks) * 100
    : 0

  const kpiCategoryData = Object.entries(
    kpis.reduce((acc, kpi) => {
      acc[kpi.category] = (acc[kpi.category] || 0) + 1
      return acc
    }, {} as Record<KPICategory, number>)
  ).map(([category, count]) => ({
    name: categoryLabels[category as KPICategory],
    value: count
  }))

  const resourceUtilizationData = resources.map(r => ({
    name: r.name,
    utilization: r.utilization,
    capacity: r.capacity
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            Operations Dashboard
              </span>
          </h1>
            <Settings className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor, manage, and optimize your startup operations with comprehensive analytics
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total KPIs</div>
                <div className="text-2xl font-bold text-primary-600">{totalKPIs}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {onTrackKPIs} on track
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Active Processes</div>
                <div className="text-2xl font-bold text-blue-600">{activeProcesses}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {processes.length} total
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Resource Utilization</div>
                <div className="text-2xl font-bold text-green-600">{averageUtilization.toFixed(0)}%</div>
                <div className="text-xs text-gray-500 mt-1">
                  {totalResources} resources
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Quality Score</div>
                <div className="text-2xl font-bold text-purple-600">{qualityScore.toFixed(0)}%</div>
                <div className="text-xs text-gray-500 mt-1">
                  {passedChecks} / {totalQualityChecks} passed
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kpiCategoryData.length > 0 && (
                <Card>
                  <h3 className="font-semibold mb-4">KPIs by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={kpiCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {kpiCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {resourceUtilizationData.length > 0 && (
                <Card>
                  <h3 className="font-semibold mb-4">Resource Utilization</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={resourceUtilizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="utilization" fill="#3b82f6" name="Utilization (%)" />
                      <Bar dataKey="capacity" fill="#10b981" name="Capacity" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* KPIs Tab */}
        {activeTab === 'kpis' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Key Performance Indicators</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search KPIs..."
                    className="w-48"
                  />
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Categories' },
                      ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))
                    ]}
                  />
                  <Button
                    onClick={() => {
                      setEditingKPI({
                        id: '',
                        name: '',
                        category: 'revenue',
                        currentValue: 0,
                        targetValue: 0,
                        unit: '',
                        trend: 0,
                        status: 'on-track',
                        date: new Date().toISOString().split('T')[0]
                      })
                      setKpiFormData({
                        name: '',
                        category: 'revenue',
                        currentValue: '',
                        targetValue: '',
                        unit: '',
                        date: new Date().toISOString().split('T')[0],
                        notes: ''
                      })
                    }}
                    size="sm"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add KPI
                  </Button>
                </div>
              </div>

              {filteredKPIs.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No KPIs found. Add your first KPI to start tracking.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredKPIs.map((kpi) => {
                    const progress = kpi.targetValue > 0 ? (kpi.currentValue / kpi.targetValue) * 100 : 0
                    return (
                      <Card key={kpi.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{kpi.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {categoryLabels[kpi.category]}
                              </Badge>
                              <Badge className={`text-xs ${
                                kpi.status === 'on-track' ? 'bg-green-100 text-green-800' :
                                kpi.status === 'at-risk' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {kpi.status === 'on-track' ? 'On Track' :
                                 kpi.status === 'at-risk' ? 'At Risk' :
                                 'Behind'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <span className="font-medium">Current:</span> {kpi.currentValue.toLocaleString()} {kpi.unit}
                              </div>
                              <div>
                                <span className="font-medium">Target:</span> {kpi.targetValue.toLocaleString()} {kpi.unit}
                              </div>
                              <div>
                                <span className="font-medium">Progress:</span> {progress.toFixed(0)}%
                              </div>
                              <div>
                                <span className="font-medium">Trend:</span> {kpi.trend >= 0 ? '+' : ''}{kpi.trend.toFixed(1)}%
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  kpi.status === 'on-track' ? 'bg-green-500' :
                                  kpi.status === 'at-risk' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(100, progress)}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingKPI(kpi)
                                setKpiFormData({
                                  name: kpi.name,
                                  category: kpi.category,
                                  currentValue: kpi.currentValue.toString(),
                                  targetValue: kpi.targetValue.toString(),
                                  unit: kpi.unit,
                                  date: kpi.date,
                                  notes: kpi.notes || ''
                                })
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteKPI(kpi.id)}
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

            {editingKPI && (
              <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingKPI.id ? 'Edit KPI' : 'Add KPI'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingKPI(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">KPI Name *</label>
                    <Input
                      value={kpiFormData.name}
                      onChange={(e) => setKpiFormData({ ...kpiFormData, name: e.target.value })}
                      placeholder="e.g., Monthly Revenue"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <Select
                        value={kpiFormData.category}
                        onChange={(e) => setKpiFormData({ ...kpiFormData, category: e.target.value as KPICategory })}
                        options={Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                      <Input
                        value={kpiFormData.unit}
                        onChange={(e) => setKpiFormData({ ...kpiFormData, unit: e.target.value })}
                        placeholder="e.g., $, users, %"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Value *</label>
                      <Input
                        type="number"
                        value={kpiFormData.currentValue}
                        onChange={(e) => setKpiFormData({ ...kpiFormData, currentValue: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Value *</label>
                      <Input
                        type="number"
                        value={kpiFormData.targetValue}
                        onChange={(e) => setKpiFormData({ ...kpiFormData, targetValue: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Input
                      type="date"
                      value={kpiFormData.date}
                      onChange={(e) => setKpiFormData({ ...kpiFormData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={kpiFormData.notes}
                      onChange={(e) => setKpiFormData({ ...kpiFormData, notes: e.target.value })}
                      placeholder="Additional notes..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addKPI} className="flex-1">
                      {editingKPI.id ? 'Update KPI' : 'Add KPI'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingKPI(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Processes Tab */}
        {activeTab === 'processes' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Processes & Automation</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search processes..."
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
                  <Button
                    onClick={() => {
                      setEditingProcess({
                        id: '',
                        name: '',
                        description: '',
                        status: 'active',
                        automation: false,
                        frequency: '',
                        successRate: 0,
                        averageDuration: 0,
                        steps: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      })
                      setProcessFormData({
                        name: '',
                        description: '',
                        automation: false,
                        frequency: '',
                        steps: []
                      })
                      setNewStep('')
                    }}
                    size="sm"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Process
                  </Button>
                </div>
              </div>

              {filteredProcesses.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Zap className="h-16 w-16 mx-auto mb-4" />
                  <p>No processes found. Add your first process to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProcesses.map((process) => (
                    <Card key={process.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{process.name}</h4>
                            <Badge className={`text-xs ${statusColors[process.status]}`}>
                              {statusLabels[process.status]}
                            </Badge>
                            {process.automation && (
                              <Badge variant="outline" className="text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                Automated
                              </Badge>
                            )}
                          </div>
                          {process.description && (
                            <p className="text-sm text-gray-600 mb-3">{process.description}</p>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Frequency:</span> {process.frequency || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Success Rate:</span> {process.successRate.toFixed(0)}%
                            </div>
                            <div>
                              <span className="font-medium">Avg Duration:</span> {process.averageDuration.toFixed(0)} min
                            </div>
                            <div>
                              <span className="font-medium">Steps:</span> {process.steps.length}
                            </div>
                          </div>
                          {process.steps.length > 0 && (
                            <div className="space-y-1">
                              {process.steps.map((step, idx) => (
                                <div key={idx} className="text-sm text-gray-600">
                                  {idx + 1}. {step}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleProcessStatus(process.id, process.status === 'active' ? 'paused' : 'active')}
                          >
                            {process.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingProcess(process)
                              setProcessFormData({
                                name: process.name,
                                description: process.description,
                                automation: process.automation,
                                frequency: process.frequency,
                                steps: process.steps
                              })
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteProcess(process.id)}
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

            {editingProcess && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingProcess.id ? 'Edit Process' : 'Add Process'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingProcess(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Process Name *</label>
                    <Input
                      value={processFormData.name}
                      onChange={(e) => setProcessFormData({ ...processFormData, name: e.target.value })}
                      placeholder="e.g., Customer Onboarding"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={processFormData.description}
                      onChange={(e) => setProcessFormData({ ...processFormData, description: e.target.value })}
                      placeholder="Process description..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                      <Input
                        value={processFormData.frequency}
                        onChange={(e) => setProcessFormData({ ...processFormData, frequency: e.target.value })}
                        placeholder="e.g., Daily, Weekly"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={processFormData.automation}
                        onChange={(e) => setProcessFormData({ ...processFormData, automation: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <label className="text-sm font-medium text-gray-700">Automated</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Process Step</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        placeholder="Step description"
                        className="flex-1"
                      />
                      <Button onClick={addProcessStep}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Step
                      </Button>
                    </div>
                    {processFormData.steps.length > 0 && (
                      <div className="space-y-2">
                        {processFormData.steps.map((step, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm">{idx + 1}. {step}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setProcessFormData({
                                  ...processFormData,
                                  steps: processFormData.steps.filter((_, i) => i !== idx)
                                })
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
          ))}
        </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addProcess} className="flex-1">
                      {editingProcess.id ? 'Update Process' : 'Add Process'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProcess(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
        <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Resource Planning</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingResource({
                      id: '',
                      name: '',
                      type: 'human',
                      capacity: 0,
                      utilization: 0,
                      cost: 0,
                      status: 'available'
                    })
                    setResourceFormData({
                      name: '',
                      type: 'human',
                      capacity: '',
                      utilization: '',
                      cost: '',
                      status: 'available',
                      assignedTo: '',
                      notes: ''
                    })
                  }}
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </div>

              {resources.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Building2 className="h-16 w-16 mx-auto mb-4" />
                  <p>No resources found. Add your first resource to start tracking.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resources.map((resource) => (
                    <Card key={resource.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{resource.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {resourceTypeLabels[resource.type]}
                            </Badge>
                            <Badge className={`text-xs ${
                              resource.status === 'available' ? 'bg-green-100 text-green-800' :
                              resource.status === 'in-use' ? 'bg-blue-100 text-blue-800' :
                              resource.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {resource.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Capacity:</span> {resource.capacity}
                            </div>
                            <div>
                              <span className="font-medium">Utilization:</span> {resource.utilization}%
                            </div>
                            <div>
                              <span className="font-medium">Cost:</span> ${resource.cost.toLocaleString()}
                            </div>
                            {resource.assignedTo && (
                              <div>
                                <span className="font-medium">Assigned:</span> {resource.assignedTo}
                              </div>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                resource.utilization >= 90 ? 'bg-red-500' :
                                resource.utilization >= 70 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${resource.utilization}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingResource(resource)
                              setResourceFormData({
                                name: resource.name,
                                type: resource.type,
                                capacity: resource.capacity.toString(),
                                utilization: resource.utilization.toString(),
                                cost: resource.cost.toString(),
                                status: resource.status,
                                assignedTo: resource.assignedTo || '',
                                notes: resource.notes || ''
                              })
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteResource(resource.id)}
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

            {editingResource && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingResource.id ? 'Edit Resource' : 'Add Resource'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingResource(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resource Name *</label>
                    <Input
                      value={resourceFormData.name}
                      onChange={(e) => setResourceFormData({ ...resourceFormData, name: e.target.value })}
                      placeholder="e.g., Development Team"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                      <Select
                        value={resourceFormData.type}
                        onChange={(e) => setResourceFormData({ ...resourceFormData, type: e.target.value as ResourceType })}
                        options={Object.entries(resourceTypeLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                      <Select
                        value={resourceFormData.status}
                        onChange={(e) => setResourceFormData({ ...resourceFormData, status: e.target.value as Resource['status'] })}
                        options={[
                          { value: 'available', label: 'Available' },
                          { value: 'in-use', label: 'In Use' },
                          { value: 'maintenance', label: 'Maintenance' },
                          { value: 'unavailable', label: 'Unavailable' }
                        ]}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
                      <Input
                        type="number"
                        value={resourceFormData.capacity}
                        onChange={(e) => setResourceFormData({ ...resourceFormData, capacity: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Utilization (%)</label>
                      <Input
                        type="number"
                        value={resourceFormData.utilization}
                        onChange={(e) => setResourceFormData({ ...resourceFormData, utilization: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
                      <Input
                        type="number"
                        value={resourceFormData.cost}
                        onChange={(e) => setResourceFormData({ ...resourceFormData, cost: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                    <Input
                      value={resourceFormData.assignedTo}
                      onChange={(e) => setResourceFormData({ ...resourceFormData, assignedTo: e.target.value })}
                      placeholder="Team or person name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={resourceFormData.notes}
                      onChange={(e) => setResourceFormData({ ...resourceFormData, notes: e.target.value })}
                      placeholder="Additional notes..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addResource} className="flex-1">
                      {editingResource.id ? 'Update Resource' : 'Add Resource'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingResource(null)}>
                      Cancel
            </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Quality Tab */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Quality Control</h2>
              </div>
              {qualityChecks.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Shield className="h-16 w-16 mx-auto mb-4" />
                  <p>No quality checks yet. Quality control features coming soon.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {qualityChecks.map((check) => (
                    <Card key={check.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{check.name}</h4>
                            <Badge className={`text-xs ${qualityStatusColors[check.status]}`}>
                              {qualityStatusLabels[check.status]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {check.category}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Score: {check.score} / {check.maxScore} • Checked by {check.checkedBy} on {new Date(check.checkedDate).toLocaleDateString()}
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total KPIs</div>
                <div className="text-2xl font-bold">{totalKPIs}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Active Processes</div>
                <div className="text-2xl font-bold text-blue-600">{activeProcesses}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Resource Utilization</div>
                <div className="text-2xl font-bold text-green-600">{averageUtilization.toFixed(0)}%</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Quality Score</div>
                <div className="text-2xl font-bold text-purple-600">{qualityScore.toFixed(0)}%</div>
              </Card>
            </div>

            {kpiCategoryData.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">KPI Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={kpiCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {kpiCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}

            {resourceUtilizationData.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Resource Utilization Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resourceUtilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="utilization" fill="#3b82f6" name="Utilization (%)" />
                    <Bar dataKey="capacity" fill="#10b981" name="Capacity" />
                  </BarChart>
                </ResponsiveContainer>
        </Card>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
