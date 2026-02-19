'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Target, 
  Plus, 
  CheckCircle, 
  X, 
  Edit, 
  Trash2, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  Download,
  Filter,
  Search,
  Flag,
  Clock,
  Award,
  Zap,
  XCircle,
  ArrowUp,
  ArrowDown,
  History,
  Repeat
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts'

type GoalPriority = 'low' | 'medium' | 'high' | 'critical'
type GoalStatus = 'not-started' | 'in-progress' | 'on-track' | 'at-risk' | 'completed' | 'cancelled'
type GoalCategory = 'business' | 'revenue' | 'users' | 'product' | 'marketing' | 'team' | 'funding' | 'other'
type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'

interface Milestone {
  id: string
  name: string
  targetValue: number
  completed: boolean
  completedDate?: string
}

interface ProgressEntry {
  id: string
  date: string
  value: number
  notes?: string
}

interface Goal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  deadline?: string
  category: GoalCategory
  priority: GoalPriority
  status: GoalStatus
  completed: boolean
  completedDate?: string
  milestones: Milestone[]
  progressHistory: ProgressEntry[]
  recurrence: RecurrenceType
  parentGoalId?: string
  subGoals: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

const priorityLabels: Record<GoalPriority, string> = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
  'critical': 'Critical'
}

const priorityColors: Record<GoalPriority, string> = {
  'low': 'bg-gray-100 text-gray-800',
  'medium': 'bg-blue-100 text-blue-800',
  'high': 'bg-orange-100 text-orange-800',
  'critical': 'bg-red-100 text-red-800'
}

const statusLabels: Record<GoalStatus, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  'completed': 'Completed',
  'cancelled': 'Cancelled'
}

const statusColors: Record<GoalStatus, string> = {
  'not-started': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'on-track': 'bg-green-100 text-green-800',
  'at-risk': 'bg-red-100 text-red-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-gray-100 text-gray-800'
}

const categoryLabels: Record<GoalCategory, string> = {
  'business': 'Business',
  'revenue': 'Revenue',
  'users': 'Users',
  'product': 'Product',
  'marketing': 'Marketing',
  'team': 'Team',
  'funding': 'Funding',
  'other': 'Other'
}

const recurrenceLabels: Record<RecurrenceType, string> = {
  'none': 'None',
  'daily': 'Daily',
  'weekly': 'Weekly',
  'monthly': 'Monthly',
  'quarterly': 'Quarterly',
  'yearly': 'Yearly'
}

export default function GoalTrackerPage() {
  const [activeTab, setActiveTab] = useState('goals')
  const [goals, setGoals] = useState<Goal[]>([])
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: '0',
    unit: '',
    deadline: '',
    category: 'business' as GoalCategory,
    priority: 'medium' as GoalPriority,
    status: 'not-started' as GoalStatus,
    recurrence: 'none' as RecurrenceType,
    notes: ''
  })
  const [newMilestone, setNewMilestone] = useState({ name: '', targetValue: '' })
  const [progressEntry, setProgressEntry] = useState({ value: '', notes: '' })

  const tabs = [
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('goalTrackerData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.goals) setGoals(data.goals)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        goals,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('goalTrackerData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const getProgress = (goal: Goal) => {
    if (goal.targetValue === 0) return 0
    return Math.min(100, (goal.currentValue / goal.targetValue) * 100)
  }

  const getStatus = (goal: Goal): GoalStatus => {
    if (goal.completed) return 'completed'
    if (goal.currentValue === 0) return 'not-started'
    
    const progress = getProgress(goal)
    const daysRemaining = goal.deadline 
      ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null
    
    if (daysRemaining !== null && daysRemaining < 0) return 'at-risk'
    if (progress >= 100) return 'completed'
    if (progress >= 75) return 'on-track'
    if (daysRemaining !== null && daysRemaining < 7 && progress < 50) return 'at-risk'
    return 'in-progress'
  }

  const addGoal = () => {
    if (!formData.title || !formData.targetValue) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      targetValue: parseFloat(formData.targetValue),
      currentValue: parseFloat(formData.currentValue || '0'),
      unit: formData.unit,
      deadline: formData.deadline || undefined,
      category: formData.category,
      priority: formData.priority,
      status: getStatus({
        id: '',
        title: formData.title,
        description: formData.description,
        targetValue: parseFloat(formData.targetValue),
        currentValue: parseFloat(formData.currentValue || '0'),
        unit: formData.unit,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        completed: false,
        milestones: [],
        progressHistory: [],
        recurrence: formData.recurrence,
        subGoals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
      completed: false,
      milestones: [],
      progressHistory: [],
      recurrence: formData.recurrence,
      subGoals: [],
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setGoals([...goals, newGoal])
    setEditingGoal(null)
    setFormData({
      title: '',
      description: '',
      targetValue: '',
      currentValue: '0',
      unit: '',
      deadline: '',
      category: 'business',
      priority: 'medium',
      status: 'not-started',
      recurrence: 'none',
      notes: ''
    })
    saveToLocalStorage()
    showToast('Goal added!', 'success')
  }

  const updateGoal = () => {
    if (!editingGoal || !formData.title || !formData.targetValue) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const updated: Goal = {
      ...editingGoal,
      title: formData.title,
      description: formData.description,
      targetValue: parseFloat(formData.targetValue),
      currentValue: parseFloat(formData.currentValue || '0'),
      unit: formData.unit,
      deadline: formData.deadline || undefined,
      category: formData.category,
      priority: formData.priority,
      status: getStatus({
        ...editingGoal,
        targetValue: parseFloat(formData.targetValue),
        currentValue: parseFloat(formData.currentValue || '0')
      }),
      recurrence: formData.recurrence,
      notes: formData.notes || undefined,
      updatedAt: new Date().toISOString()
    }

    const updatedGoals = goals.map(g => g.id === editingGoal.id ? updated : g)
    setGoals(updatedGoals)
    setEditingGoal(null)
    setFormData({
      title: '',
      description: '',
      targetValue: '',
      currentValue: '0',
      unit: '',
      deadline: '',
      category: 'business',
      priority: 'medium',
      status: 'not-started',
      recurrence: 'none',
      notes: ''
    })
    saveToLocalStorage()
    showToast('Goal updated!', 'success')
  }

  const deleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      const updated = goals.filter(g => g.id !== id)
      setGoals(updated)
      saveToLocalStorage()
      showToast('Goal deleted!', 'info')
    }
  }

  const toggleComplete = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const newCompleted = !g.completed
        return {
          ...g,
          completed: newCompleted,
          completedDate: newCompleted ? new Date().toISOString() : undefined,
          status: newCompleted ? 'completed' : getStatus(g),
          updatedAt: new Date().toISOString()
        }
      }
      return g
    })
    setGoals(updated)
    saveToLocalStorage()
    showToast('Goal status updated!', 'success')
  }

  const updateProgress = (id: string, value: number) => {
    const goal = goals.find(g => g.id === id)
    if (!goal) return

    const updated = goals.map(g => {
      if (g.id === id) {
        const newProgress: ProgressEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          value,
          notes: progressEntry.notes || undefined
        }
        return {
          ...g,
          currentValue: value,
          progressHistory: [...g.progressHistory, newProgress],
          status: getStatus({ ...g, currentValue: value }),
          completed: value >= g.targetValue,
          completedDate: value >= g.targetValue ? new Date().toISOString() : g.completedDate,
          updatedAt: new Date().toISOString()
        }
      }
      return g
    })
    setGoals(updated)
    setProgressEntry({ value: '', notes: '' })
    saveToLocalStorage()
    showToast('Progress updated!', 'success')
  }

  const addMilestone = (goalId: string) => {
    if (!newMilestone.name || !newMilestone.targetValue) {
      showToast('Please fill in milestone name and target value', 'error')
      return
    }

    const milestone: Milestone = {
      id: Date.now().toString(),
      name: newMilestone.name,
      targetValue: parseFloat(newMilestone.targetValue),
      completed: false
    }

    const updated = goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          milestones: [...g.milestones, milestone],
          updatedAt: new Date().toISOString()
        }
      }
      return g
    })
    setGoals(updated)
    setNewMilestone({ name: '', targetValue: '' })
    saveToLocalStorage()
    showToast('Milestone added!', 'success')
  }

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          milestones: g.milestones.map(m => {
            if (m.id === milestoneId) {
              return {
                ...m,
                completed: !m.completed,
                completedDate: !m.completed ? new Date().toISOString() : undefined
              }
            }
            return m
          }),
          updatedAt: new Date().toISOString()
        }
      }
      return g
    })
    setGoals(updated)
    saveToLocalStorage()
  }

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (goal.description && goal.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || goal.category === filterCategory
    const matchesPriority = filterPriority === 'all' || goal.priority === filterPriority
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus
  })

  const completedGoals = goals.filter(g => g.completed).length
  const totalGoals = goals.length
  const overallProgress = totalGoals > 0 
    ? goals.reduce((sum, g) => sum + getProgress(g), 0) / totalGoals 
    : 0
  const atRiskGoals = goals.filter(g => g.status === 'at-risk').length
  const onTrackGoals = goals.filter(g => g.status === 'on-track').length

  const categoryDistribution = Object.entries(
    goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1
      return acc
    }, {} as Record<GoalCategory, number>)
  ).map(([category, count]) => ({
    name: categoryLabels[category as GoalCategory],
    value: count
  }))

  const priorityDistribution = Object.entries(
    goals.reduce((acc, goal) => {
      acc[goal.priority] = (acc[goal.priority] || 0) + 1
      return acc
    }, {} as Record<GoalPriority, number>)
  ).map(([priority, count]) => ({
    name: priorityLabels[priority as GoalPriority],
    value: count
  }))

  const progressTrendData = goals
    .filter(g => g.progressHistory.length > 0)
    .flatMap(g => g.progressHistory.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: entry.value,
      goal: g.title
    })))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Goal Tracker
              </span>
            </h1>
            <Target className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Set, track, and achieve your startup goals with comprehensive progress monitoring
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

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Goals</div>
                <div className="text-2xl font-bold text-primary-600">{totalGoals}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Completed</div>
                <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">On Track</div>
                <div className="text-2xl font-bold text-blue-600">{onTrackGoals}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">At Risk</div>
                <div className="text-2xl font-bold text-red-600">{atRiskGoals}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Avg Progress</div>
                <div className="text-2xl font-bold text-purple-600">{overallProgress.toFixed(0)}%</div>
              </Card>
            </div>

            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Goals</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search goals..."
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
                  <Select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Priorities' },
                      ...Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))
                    ]}
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
                      setEditingGoal({
                        id: '',
                        title: '',
                        description: '',
                        targetValue: 0,
                        currentValue: 0,
                        unit: '',
                        category: 'business',
                        priority: 'medium',
                        status: 'not-started',
                        completed: false,
                        milestones: [],
                        progressHistory: [],
                        recurrence: 'none',
                        subGoals: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      })
                      setFormData({
                        title: '',
                        description: '',
                        targetValue: '',
                        currentValue: '0',
                        unit: '',
                        deadline: '',
                        category: 'business',
                        priority: 'medium',
                        status: 'not-started',
                        recurrence: 'none',
                        notes: ''
                      })
                    }}
                    size="sm"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </div>

              {filteredGoals.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No goals found. Add your first goal to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredGoals.map((goal) => {
                    const progress = getProgress(goal)
                    const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !goal.completed
                    const daysRemaining = goal.deadline 
                      ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      : null

                    return (
                      <Card key={goal.id} className={`p-4 ${goal.completed ? 'opacity-75' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <input
                                type="checkbox"
                                checked={goal.completed}
                                onChange={() => toggleComplete(goal.id)}
                                className="w-5 h-5 shrink-0"
                              />
                              <h3 className={`text-lg font-semibold ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                                {goal.title}
                              </h3>
                              <Badge className={`text-xs ${priorityColors[goal.priority]}`}>
                                {priorityLabels[goal.priority]}
                              </Badge>
                              <Badge className={`text-xs ${statusColors[goal.status]}`}>
                                {statusLabels[goal.status]}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {categoryLabels[goal.category]}
                              </Badge>
                              {goal.recurrence !== 'none' && (
                                <Badge variant="outline" className="text-xs">
                                  <Repeat className="h-3 w-3 mr-1" />
                                  {recurrenceLabels[goal.recurrence]}
                                </Badge>
                              )}
                              {isOverdue && (
                                <Badge className="text-xs bg-red-100 text-red-800">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Overdue
                                </Badge>
                              )}
                            </div>
                            {goal.description && (
                              <p className="text-sm text-gray-600 mb-3 ml-8">{goal.description}</p>
                            )}
                            <div className="ml-8 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {goal.currentValue.toLocaleString()} {goal.unit} / {goal.targetValue.toLocaleString()} {goal.unit}
                                </span>
                                <span className="font-semibold">{progress.toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    goal.completed ? 'bg-green-500' : 
                                    goal.status === 'at-risk' ? 'bg-red-500' :
                                    goal.status === 'on-track' ? 'bg-green-500' :
                                    'bg-primary-500'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                                {goal.deadline && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(goal.deadline).toLocaleDateString()}
                                    {daysRemaining !== null && (
                                      <span className={daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-orange-600' : ''}>
                                        ({daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`})
                                      </span>
                                    )}
                                  </div>
                                )}
                                {goal.milestones.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Flag className="h-3 w-3" />
                                    {goal.milestones.filter(m => m.completed).length} / {goal.milestones.length} milestones
                                  </div>
                                )}
                              </div>
                              {goal.milestones.length > 0 && (
                                <div className="mt-3 space-y-1">
                                  {goal.milestones.map((milestone) => (
                                    <div key={milestone.id} className="flex items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={milestone.completed}
                                        onChange={() => toggleMilestone(goal.id, milestone.id)}
                                        className="w-4 h-4"
                                      />
                                      <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                                        {milestone.name} ({milestone.targetValue} {goal.unit})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Input
                              type="number"
                              value={progressEntry.value}
                              onChange={(e) => setProgressEntry({ ...progressEntry, value: e.target.value })}
                              placeholder="Update"
                              className="w-24"
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                if (progressEntry.value) {
                                  updateProgress(goal.id, parseFloat(progressEntry.value))
                                }
                              }}
                            >
                              Update
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingGoal(goal)
                                setFormData({
                                  title: goal.title,
                                  description: goal.description,
                                  targetValue: goal.targetValue.toString(),
                                  currentValue: goal.currentValue.toString(),
                                  unit: goal.unit,
                                  deadline: goal.deadline || '',
                                  category: goal.category,
                                  priority: goal.priority,
                                  status: goal.status,
                                  recurrence: goal.recurrence,
                                  notes: goal.notes || ''
                                })
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteGoal(goal.id)}
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

            {editingGoal && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingGoal.id ? 'Edit Goal' : 'Add Goal'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingGoal(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Reach 1000 users"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your goal..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Value *</label>
                      <Input
                        type="number"
                        value={formData.targetValue}
                        onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Value</label>
                      <Input
                        type="number"
                        value={formData.currentValue}
                        onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                      <Input
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="users, $, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                      <Input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <Select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as GoalCategory })}
                        options={Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <Select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as GoalPriority })}
                        options={Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recurrence</label>
                      <Select
                        value={formData.recurrence}
                        onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as RecurrenceType })}
                        options={Object.entries(recurrenceLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                  </div>
                  {editingGoal.id && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add Milestone</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                        <Input
                          value={newMilestone.name}
                          onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                          placeholder="Milestone name"
                        />
                        <Input
                          type="number"
                          value={newMilestone.targetValue}
                          onChange={(e) => setNewMilestone({ ...newMilestone, targetValue: e.target.value })}
                          placeholder="Target value"
                        />
                        <Button onClick={() => addMilestone(editingGoal.id)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Milestone
                        </Button>
                      </div>
                    </div>
                  )}
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
                  <div className="flex gap-2">
                    <Button onClick={editingGoal.id ? updateGoal : addGoal} className="flex-1">
                      {editingGoal.id ? 'Update Goal' : 'Add Goal'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingGoal(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Goals</div>
                <div className="text-2xl font-bold">{totalGoals}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Completed</div>
                <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">On Track</div>
                <div className="text-2xl font-bold text-blue-600">{onTrackGoals}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">At Risk</div>
                <div className="text-2xl font-bold text-red-600">{atRiskGoals}</div>
              </Card>
            </div>

            {categoryDistribution.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Goals by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => percent ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}

            {priorityDistribution.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Goals by Priority</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priorityDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {progressTrendData.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Progress Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={progressTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
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
                <h2 className="text-2xl font-bold">Goal Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4 hover:shadow-lg transition-all">
                  <div className="bg-primary-500/10 text-primary-600 p-3 rounded-lg w-fit mb-3">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Revenue Goal</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Track monthly or annual revenue targets
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </Card>
                <Card className="p-4 hover:shadow-lg transition-all">
                  <div className="bg-primary-500/10 text-primary-600 p-3 rounded-lg w-fit mb-3">
                    <Target className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2">User Growth</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Set and track user acquisition goals
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </Card>
                <Card className="p-4 hover:shadow-lg transition-all">
                  <div className="bg-primary-500/10 text-primary-600 p-3 rounded-lg w-fit mb-3">
                    <Award className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Product Launch</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Track milestones for product releases
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </Card>
              </div>
            </Card>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <History className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Progress History</h2>
              </div>
              {goals.filter(g => g.progressHistory.length > 0).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No progress history yet. Update goal progress to see history.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals
                    .filter(g => g.progressHistory.length > 0)
                    .map((goal) => (
                      <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-3">{goal.title}</h4>
                        <div className="space-y-2">
                          {goal.progressHistory
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 5)
                            .map((entry) => (
                              <div key={entry.id} className="flex items-center justify-between text-sm">
                                <div>
                                  <span className="font-medium">{entry.value.toLocaleString()} {goal.unit}</span>
                                  <span className="text-gray-500 ml-2">
                                    {new Date(entry.date).toLocaleDateString()}
                                  </span>
                                </div>
                                {entry.notes && (
                                  <span className="text-gray-600 text-xs">{entry.notes}</span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
