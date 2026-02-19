'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Shield, FileText, CheckCircle, XCircle, Plus, Trash2, Download,
  Clock, Calendar, AlertTriangle, Target, BarChart3, Search,
  Globe, Users, Building2, Scale, BookOpen, Bell, RefreshCw, 
  TrendingUp, AlertCircle, Eye, Filter, Settings
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

type ComplianceArea = 'corporate' | 'employment' | 'tax' | 'privacy' | 'industry' | 'financial' | 'environmental'
type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue' | 'upcoming'
type TaskPriority = 'critical' | 'high' | 'medium' | 'low'

interface ComplianceTask {
  id: string
  title: string
  description: string
  area: ComplianceArea
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assignee?: string
  recurring?: string
  notes?: string
  completedDate?: string
  created: string
}

interface RegulatoryUpdate {
  id: string
  title: string
  source: string
  area: ComplianceArea
  effectiveDate: string
  summary: string
  impact: 'high' | 'medium' | 'low'
  actionRequired: boolean
  status: 'new' | 'reviewed' | 'implemented' | 'not-applicable'
  created: string
}

interface ComplianceCalendarItem {
  id: string
  title: string
  type: 'filing' | 'renewal' | 'audit' | 'training' | 'review'
  date: string
  recurring?: string
  completed: boolean
  area: ComplianceArea
}

const areaInfo: Record<ComplianceArea, { label: string; icon: typeof Shield; color: string }> = {
  'corporate': { label: 'Corporate', icon: Building2, color: 'text-blue-600' },
  'employment': { label: 'Employment', icon: Users, color: 'text-green-600' },
  'tax': { label: 'Tax', icon: Scale, color: 'text-purple-600' },
  'privacy': { label: 'Privacy', icon: Shield, color: 'text-red-600' },
  'industry': { label: 'Industry', icon: Target, color: 'text-orange-600' },
  'financial': { label: 'Financial', icon: TrendingUp, color: 'text-cyan-600' },
  'environmental': { label: 'Environmental', icon: Globe, color: 'text-emerald-600' }
}

const statusColors: Record<TaskStatus, string> = {
  'pending': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'overdue': 'bg-red-100 text-red-800',
  'upcoming': 'bg-yellow-100 text-yellow-800'
}

const priorityColors: Record<TaskPriority, string> = {
  'critical': 'bg-red-100 text-red-800',
  'high': 'bg-orange-100 text-orange-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'low': 'bg-gray-100 text-gray-800'
}

const defaultTasks: ComplianceTask[] = [
  { id: '1', title: 'Annual Report Filing', description: 'File annual report with Secretary of State', area: 'corporate', status: 'pending', priority: 'high', dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], recurring: 'annual', created: new Date().toISOString() },
  { id: '2', title: 'Quarterly Tax Filing', description: 'Submit quarterly estimated tax payments', area: 'tax', status: 'pending', priority: 'high', dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], recurring: 'quarterly', created: new Date().toISOString() },
  { id: '3', title: 'Privacy Policy Review', description: 'Annual review and update of privacy policy', area: 'privacy', status: 'pending', priority: 'medium', dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], recurring: 'annual', created: new Date().toISOString() },
  { id: '4', title: 'Employee Handbook Update', description: 'Review and update employee handbook', area: 'employment', status: 'pending', priority: 'medium', dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], recurring: 'annual', created: new Date().toISOString() },
  { id: '5', title: 'Business License Renewal', description: 'Renew business operating license', area: 'corporate', status: 'upcoming', priority: 'high', dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], recurring: 'annual', created: new Date().toISOString() },
]

const defaultUpdates: RegulatoryUpdate[] = [
  { id: '1', title: 'New Data Privacy Requirements', source: 'FTC', area: 'privacy', effectiveDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], summary: 'New requirements for data breach notification timelines', impact: 'high', actionRequired: true, status: 'new', created: new Date().toISOString() },
  { id: '2', title: 'Minimum Wage Increase', source: 'DOL', area: 'employment', effectiveDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], summary: 'Federal minimum wage increase effective next quarter', impact: 'medium', actionRequired: true, status: 'new', created: new Date().toISOString() },
  { id: '3', title: 'Tax Reporting Changes', source: 'IRS', area: 'tax', effectiveDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], summary: 'Updated 1099 reporting thresholds for contractors', impact: 'medium', actionRequired: true, status: 'new', created: new Date().toISOString() },
]

export default function ComplianceHubPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [tasks, setTasks] = useState<ComplianceTask[]>(defaultTasks)
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>(defaultUpdates)
  const [editingTask, setEditingTask] = useState<ComplianceTask | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterArea, setFilterArea] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')

  const [taskForm, setTaskForm] = useState({
    title: '', description: '', area: 'corporate' as ComplianceArea,
    priority: 'medium' as TaskPriority, dueDate: '', recurring: '', assignee: ''
  })

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'updates', label: 'Regulatory Updates', icon: Bell },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('complianceHubData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.tasks) setTasks(data.tasks)
          if (data.updates) setUpdates(data.updates)
        } catch (e) {
          console.error('Error loading data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    localStorage.setItem('complianceHubData', JSON.stringify({
      tasks, updates, lastSaved: new Date().toISOString()
    }))
    showToast('Data saved!', 'success')
  }

  const addTask = () => {
    if (!taskForm.title || !taskForm.dueDate) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const newTask: ComplianceTask = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      area: taskForm.area,
      status: 'pending',
      priority: taskForm.priority,
      dueDate: taskForm.dueDate,
      assignee: taskForm.assignee || undefined,
      recurring: taskForm.recurring || undefined,
      created: new Date().toISOString()
    }

    setTasks([...tasks, newTask])
    setEditingTask(null)
    setTaskForm({ title: '', description: '', area: 'corporate', priority: 'medium', dueDate: '', recurring: '', assignee: '' })
    saveToLocalStorage()
    showToast('Task created!', 'success')
  }

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(t => t.id === id ? { 
      ...t, status, 
      completedDate: status === 'completed' ? new Date().toISOString() : undefined 
    } : t))
    saveToLocalStorage()
  }

  const deleteTask = (id: string) => {
    if (confirm('Delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id))
      saveToLocalStorage()
      showToast('Task deleted', 'info')
    }
  }

  const updateUpdateStatus = (id: string, status: RegulatoryUpdate['status']) => {
    setUpdates(updates.map(u => u.id === id ? { ...u, status } : u))
    saveToLocalStorage()
  }

  // Calculate metrics
  const today = new Date()
  const overdueTasks = tasks.filter(t => new Date(t.dueDate) < today && t.status !== 'completed')
  const upcomingTasks = tasks.filter(t => {
    const due = new Date(t.dueDate)
    const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 30 && t.status !== 'completed'
  })
  const completedTasks = tasks.filter(t => t.status === 'completed')
  const complianceScore = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 100

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesArea = filterArea === 'all' || t.area === filterArea
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority
    return matchesSearch && matchesArea && matchesStatus && matchesPriority
  })

  const tasksByArea = Object.entries(areaInfo).map(([area, info]) => ({
    name: info.label,
    pending: tasks.filter(t => t.area === area && t.status !== 'completed').length,
    completed: tasks.filter(t => t.area === area && t.status === 'completed').length
  }))

  const tasksByStatus = [
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#6b7280' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#3b82f6' },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
    { name: 'Overdue', value: overdueTasks.length, color: '#ef4444' },
  ].filter(d => d.value > 0)

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Compliance Hub
              </span>
            </h1>
            <Shield className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track regulatory requirements, manage compliance tasks, and stay updated on legal changes
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={saveToLocalStorage}>
                <Download className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <div className="text-sm text-gray-600">Compliance Score</div>
                </div>
                <div className={`text-2xl font-bold ${complianceScore >= 80 ? 'text-green-600' : complianceScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {complianceScore}%
                </div>
                <div className="text-sm text-gray-500">{completedTasks.length}/{tasks.length} tasks completed</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div className="text-sm text-gray-600">Overdue Tasks</div>
                </div>
                <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
                <div className="text-sm text-gray-500">require immediate attention</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div className="text-sm text-gray-600">Due in 30 Days</div>
                </div>
                <div className="text-2xl font-bold text-yellow-600">{upcomingTasks.length}</div>
                <div className="text-sm text-gray-500">upcoming deadlines</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-5 w-5 text-orange-500" />
                  <div className="text-sm text-gray-600">New Updates</div>
                </div>
                <div className="text-2xl font-bold text-orange-600">{updates.filter(u => u.status === 'new').length}</div>
                <div className="text-sm text-gray-500">regulatory changes</div>
              </Card>
            </div>

            {overdueTasks.length > 0 && (
              <Card className="p-4 bg-red-50 border-2 border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <h3 className="font-semibold text-red-800">Overdue Compliance Tasks</h3>
                </div>
                <div className="space-y-2">
                  {overdueTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <div>
                        <span className="font-medium">{task.title}</span>
                        <span className="text-sm text-red-600 ml-2">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      <Button size="sm" onClick={() => updateTaskStatus(task.id, 'completed')}>
                        Mark Complete
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasksByStatus.length > 0 && (
                <Card>
                  <h3 className="font-semibold mb-4">Tasks by Status</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={tasksByStatus} cx="50%" cy="50%" labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`} outerRadius={80} dataKey="value">
                        {tasksByStatus.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {tasksByArea.some(d => d.pending > 0 || d.completed > 0) && (
                <Card>
                  <h3 className="font-semibold mb-4">Tasks by Area</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={tasksByArea}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                      <Bar dataKey="completed" fill="#10b981" name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </div>

            <Card>
              <h3 className="font-semibold mb-4">Compliance Areas Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {Object.entries(areaInfo).map(([area, info]) => {
                  const Icon = info.icon
                  const areaTasks = tasks.filter(t => t.area === area)
                  const completed = areaTasks.filter(t => t.status === 'completed').length
                  const total = areaTasks.length
                  const score = total > 0 ? Math.round((completed / total) * 100) : 100
                  return (
                    <div key={area} className="p-3 bg-gray-50 rounded-lg text-center">
                      <Icon className={`h-6 w-6 mx-auto mb-2 ${info.color}`} />
                      <div className="text-sm font-medium">{info.label}</div>
                      <div className={`text-lg font-bold ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {score}%
                      </div>
                      <div className="text-xs text-gray-500">{completed}/{total}</div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">Compliance Tasks</h2>
                <div className="flex flex-wrap gap-2">
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-36" />
                  <Select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}
                    options={[{ value: 'all', label: 'All Areas' }, ...Object.entries(areaInfo).map(([v, i]) => ({ value: v, label: i.label }))]} />
                  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    options={[{ value: 'all', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'in-progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }, { value: 'overdue', label: 'Overdue' }]} />
                  <Button onClick={() => setEditingTask({ id: '', title: '', description: '', area: 'corporate', status: 'pending', priority: 'medium', dueDate: '', created: '' })} size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                  <p>No tasks found. Create your first compliance task.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map(task => {
                    const AreaIcon = areaInfo[task.area].icon
                    const isOverdue = new Date(task.dueDate) < today && task.status !== 'completed'
                    return (
                      <Card key={task.id} className={`p-4 ${isOverdue ? 'border-2 border-red-300 bg-red-50' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <AreaIcon className={`h-5 w-5 ${areaInfo[task.area].color}`} />
                              <h4 className="font-semibold">{task.title}</h4>
                              <Badge variant="outline">{areaInfo[task.area].label}</Badge>
                              <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                              <Badge className={isOverdue ? 'bg-red-100 text-red-800' : statusColors[task.status]}>
                                {isOverdue ? 'Overdue' : task.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                <Calendar className="h-4 w-4 inline" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                              {task.recurring && <span><RefreshCw className="h-4 w-4 inline" /> {task.recurring}</span>}
                              {task.assignee && <span><Users className="h-4 w-4 inline" /> {task.assignee}</span>}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {task.status !== 'completed' && (
                              <Select value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                                options={[
                                  { value: 'pending', label: 'Pending' },
                                  { value: 'in-progress', label: 'In Progress' },
                                  { value: 'completed', label: 'Completed' }
                                ]} className="w-32" />
                            )}
                            <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
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

            {editingTask && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Compliance Task</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingTask(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                    <Input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="e.g., Annual Report Filing" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none" rows={2}
                      value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Task details..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                      <Select value={taskForm.area} onChange={(e) => setTaskForm({ ...taskForm, area: e.target.value as ComplianceArea })}
                        options={Object.entries(areaInfo).map(([v, i]) => ({ value: v, label: i.label }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <Select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as TaskPriority })}
                        options={[{ value: 'critical', label: 'Critical' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                      <Input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recurring</label>
                      <Select value={taskForm.recurring} onChange={(e) => setTaskForm({ ...taskForm, recurring: e.target.value })}
                        options={[{ value: '', label: 'One-time' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'annual', label: 'Annual' }]} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                      <Input value={taskForm.assignee} onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })} placeholder="e.g., Legal Team" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addTask} className="flex-1">Create Task</Button>
                    <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Regulatory Updates Tab */}
        {activeTab === 'updates' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Regulatory Updates</h2>
                  <p className="text-gray-600">Stay informed about regulatory changes that may affect your business</p>
                </div>
                <Badge variant="outline">{updates.filter(u => u.status === 'new').length} new updates</Badge>
              </div>

              <div className="space-y-4">
                {updates.map(update => {
                  const AreaIcon = areaInfo[update.area].icon
                  return (
                    <Card key={update.id} className={`p-4 ${update.status === 'new' ? 'border-2 border-orange-300 bg-orange-50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AreaIcon className={`h-5 w-5 ${areaInfo[update.area].color}`} />
                            <h4 className="font-semibold">{update.title}</h4>
                            <Badge variant="outline">{update.source}</Badge>
                            <Badge className={update.impact === 'high' ? 'bg-red-100 text-red-800' : update.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                              {update.impact} impact
                            </Badge>
                            {update.actionRequired && <Badge className="bg-orange-100 text-orange-800">Action Required</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{update.summary}</p>
                          <div className="text-sm text-gray-500">
                            <Calendar className="h-4 w-4 inline" /> Effective: {new Date(update.effectiveDate).toLocaleDateString()}
                          </div>
                        </div>
                        <Select value={update.status} onChange={(e) => updateUpdateStatus(update.id, e.target.value as RegulatoryUpdate['status'])}
                          options={[
                            { value: 'new', label: 'New' },
                            { value: 'reviewed', label: 'Reviewed' },
                            { value: 'implemented', label: 'Implemented' },
                            { value: 'not-applicable', label: 'N/A' }
                          ]} className="w-36" />
                      </div>
                    </Card>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Compliance Calendar</h2>
              <div className="space-y-4">
                {tasks.filter(t => t.status !== 'completed').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(task => {
                  const daysUntil = Math.ceil((new Date(task.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                  const isOverdue = daysUntil < 0
                  const AreaIcon = areaInfo[task.area].icon
                  return (
                    <div key={task.id} className={`flex items-center gap-4 p-4 rounded-lg ${isOverdue ? 'bg-red-50 border-2 border-red-200' : daysUntil <= 7 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'}`}>
                      <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center ${isOverdue ? 'bg-red-100' : daysUntil <= 7 ? 'bg-yellow-100' : 'bg-primary-100'}`}>
                        <div className="text-xs font-medium">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short' })}</div>
                        <div className="text-lg font-bold">{new Date(task.dueDate).getDate()}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <AreaIcon className={`h-4 w-4 ${areaInfo[task.area].color}`} />
                          <h4 className="font-semibold">{task.title}</h4>
                          <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      <div className={`text-sm font-medium ${isOverdue ? 'text-red-600' : daysUntil <= 7 ? 'text-yellow-600' : 'text-gray-600'}`}>
                        {isOverdue ? `${Math.abs(daysUntil)} days overdue` : daysUntil === 0 ? 'Due today' : `${daysUntil} days`}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Compliance Summary Report</h3>
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Overall Compliance Score</span>
                    <span className="font-bold text-green-600">{complianceScore}%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Total Tasks</span>
                    <span className="font-bold">{tasks.length}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Completed Tasks</span>
                    <span className="font-bold text-green-600">{completedTasks.length}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Overdue Tasks</span>
                    <span className="font-bold text-red-600">{overdueTasks.length}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Upcoming (30 days)</span>
                    <span className="font-bold text-yellow-600">{upcomingTasks.length}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Download className="h-4 w-4 mr-2" /> Export Report
                </Button>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('tasks')}>
                    <Plus className="h-4 w-4 mr-2" /> Add Compliance Task
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('updates')}>
                    <Bell className="h-4 w-4 mr-2" /> Review Regulatory Updates
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('calendar')}>
                    <Calendar className="h-4 w-4 mr-2" /> View Calendar
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={saveToLocalStorage}>
                    <Download className="h-4 w-4 mr-2" /> Save All Data
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

