'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  X, 
  Download,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Building2,
  UserCheck,
  FileText,
  Plus,
  Save,
  LogIn,
  LogOut,
  BookOpen,
  Zap,
  Filter,
  Search,
  ArrowRight,
  ArrowLeft,
  Info,
  XCircle
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

interface TeamMember {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  department: string
  startDate: string
  status: 'active' | 'onboarding' | 'on-leave' | 'offboarded'
  skills: string[]
  location?: string
  manager?: string
  salary?: string
  notes?: string
}

interface Role {
  id: string
  title: string
  department: string
  description: string
  requirements: string[]
  level: 'entry' | 'mid' | 'senior' | 'executive'
}

interface Goal {
  id: string
  title: string
  description: string
  assignedTo: string
  dueDate: string
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold'
  progress: number
  priority: 'low' | 'medium' | 'high'
  category: string
}

interface PerformanceReview {
  id: string
  employeeId: string
  reviewDate: string
  period: string
  overallRating: number
  strengths: string[]
  areasForImprovement: string[]
  goals: string[]
  notes: string
}

interface OnboardingTask {
  id: string
  title: string
  description: string
  assignedTo?: string
  dueDate?: string
  completed: boolean
  completedDate?: string
  category: 'documentation' | 'access' | 'training' | 'meetings' | 'other'
}

interface OnboardingWorkflow {
  id: string
  employeeId: string
  startDate: string
  completionDate?: string
  status: 'in-progress' | 'completed' | 'on-hold'
  tasks: OnboardingTask[]
  notes?: string
}

interface TimeEntry {
  id: string
  employeeId: string
  date: string
  checkIn?: string
  checkOut?: string
  hours: number
  project?: string
  notes?: string
}

interface LeaveRequest {
  id: string
  employeeId: string
  type: 'vacation' | 'sick' | 'personal' | 'unpaid' | 'other'
  startDate: string
  endDate: string
  days: number
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
  submittedDate: string
}

interface Skill {
  id: string
  name: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  certified: boolean
  certificationDate?: string
  notes?: string
}

interface Training {
  id: string
  title: string
  description: string
  type: 'course' | 'workshop' | 'certification' | 'conference' | 'other'
  provider: string
  duration: number
  cost: number
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled'
  startDate?: string
  endDate?: string
  participants: string[]
  notes?: string
}

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState('team')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([])
  const [onboardingWorkflows, setOnboardingWorkflows] = useState<OnboardingWorkflow[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [skills, setSkills] = useState<Record<string, Skill[]>>({})
  const [trainings, setTrainings] = useState<Training[]>([])
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [editingReview, setEditingReview] = useState<PerformanceReview | null>(null)
  const [editingOnboarding, setEditingOnboarding] = useState<OnboardingWorkflow | null>(null)
  const [editingTimeEntry, setEditingTimeEntry] = useState<TimeEntry | null>(null)
  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null)
  const [editingTraining, setEditingTraining] = useState<Training | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [newOnboardingTask, setNewOnboardingTask] = useState({ title: '', description: '', category: 'documentation' as OnboardingTask['category'] })
  const [timeEntryFormData, setTimeEntryFormData] = useState({ date: new Date().toISOString().split('T')[0], checkIn: '', checkOut: '', hours: '', project: '', notes: '' })
  const [leaveFormData, setLeaveFormData] = useState({ type: 'vacation' as LeaveRequest['type'], startDate: '', endDate: '', reason: '' })
  const [trainingFormData, setTrainingFormData] = useState({ title: '', description: '', type: 'course' as Training['type'], provider: '', duration: '', cost: '', startDate: '', endDate: '', notes: '' })

  const tabs = [
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'roles', label: 'Roles & Structure', icon: Briefcase },
    { id: 'goals', label: 'Goals & OKRs', icon: Target },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'onboarding', label: 'Onboarding', icon: LogIn },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leave', label: 'Leave Management', icon: Calendar },
    { id: 'skills', label: 'Skills Matrix', icon: GraduationCap },
    { id: 'training', label: 'Training', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ]

  const departments = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'Operations',
    'Finance',
    'HR',
    'Customer Success',
    'Executive',
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('teamManagementData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.teamMembers) setTeamMembers(data.teamMembers)
          if (data.roles) setRoles(data.roles)
          if (data.goals) setGoals(data.goals)
          if (data.performanceReviews) setPerformanceReviews(data.performanceReviews)
          if (data.onboardingWorkflows) setOnboardingWorkflows(data.onboardingWorkflows)
          if (data.timeEntries) setTimeEntries(data.timeEntries)
          if (data.leaveRequests) setLeaveRequests(data.leaveRequests)
          if (data.skills) setSkills(data.skills)
          if (data.trainings) setTrainings(data.trainings)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        teamMembers,
        roles,
        goals,
        performanceReviews,
        onboardingWorkflows,
        timeEntries,
        leaveRequests,
        skills,
        trainings,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('teamManagementData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      email: '',
      role: '',
      department: '',
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      skills: [],
    }
    setEditingMember(newMember)
  }

  const saveTeamMember = () => {
    if (!editingMember) return
    if (!editingMember.name || !editingMember.email || !editingMember.role || !editingMember.department) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const existing = teamMembers.find(m => m.id === editingMember.id)
    if (existing) {
      setTeamMembers(teamMembers.map(m => m.id === editingMember.id ? editingMember : m))
      showToast('Team member updated!', 'success')
    } else {
      setTeamMembers([...teamMembers, editingMember])
      showToast('Team member added!', 'success')
    }
    setEditingMember(null)
    saveToLocalStorage()
  }

  const deleteTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id))
    showToast('Team member removed', 'success')
    saveToLocalStorage()
  }

  const addRole = () => {
    const newRole: Role = {
      id: Date.now().toString(),
      title: '',
      department: '',
      description: '',
      requirements: [],
      level: 'mid',
    }
    setEditingRole(newRole)
  }

  const saveRole = () => {
    if (!editingRole) return
    if (!editingRole.title || !editingRole.department) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const existing = roles.find(r => r.id === editingRole.id)
    if (existing) {
      setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r))
      showToast('Role updated!', 'success')
    } else {
      setRoles([...roles, editingRole])
      showToast('Role added!', 'success')
    }
    setEditingRole(null)
    saveToLocalStorage()
  }

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      status: 'not-started',
      progress: 0,
      priority: 'medium',
      category: '',
    }
    setEditingGoal(newGoal)
  }

  const saveGoal = () => {
    if (!editingGoal) return
    if (!editingGoal.title || !editingGoal.assignedTo) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const existing = goals.find(g => g.id === editingGoal.id)
    if (existing) {
      setGoals(goals.map(g => g.id === editingGoal.id ? editingGoal : g))
      showToast('Goal updated!', 'success')
    } else {
      setGoals([...goals, editingGoal])
      showToast('Goal added!', 'success')
    }
    setEditingGoal(null)
    saveToLocalStorage()
  }

  const addPerformanceReview = () => {
    const newReview: PerformanceReview = {
      id: Date.now().toString(),
      employeeId: '',
      reviewDate: new Date().toISOString().split('T')[0],
      period: '',
      overallRating: 0,
      strengths: [],
      areasForImprovement: [],
      goals: [],
      notes: '',
    }
    setEditingReview(newReview)
  }

  const savePerformanceReview = () => {
    if (!editingReview) return
    if (!editingReview.employeeId || !editingReview.period) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const existing = performanceReviews.find(r => r.id === editingReview.id)
    if (existing) {
      setPerformanceReviews(performanceReviews.map(r => r.id === editingReview.id ? editingReview : r))
      showToast('Performance review updated!', 'success')
    } else {
      setPerformanceReviews([...performanceReviews, editingReview])
      showToast('Performance review added!', 'success')
    }
    setEditingReview(null)
    saveToLocalStorage()
  }

  const exportData = () => {
    const data = {
      teamMembers,
      roles,
      goals,
      performanceReviews,
      onboardingWorkflows,
      timeEntries,
      leaveRequests,
      skills,
      trainings,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `team-management-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Team data exported successfully', 'success')
  }

  const addOnboardingWorkflow = (employeeId: string) => {
    const defaultTasks: OnboardingTask[] = [
      { id: '1', title: 'Complete paperwork', description: 'Fill out all required forms', category: 'documentation', completed: false },
      { id: '2', title: 'Set up accounts', description: 'Create email, Slack, and tool accounts', category: 'access', completed: false },
      { id: '3', title: 'Orientation meeting', description: 'Attend company orientation', category: 'meetings', completed: false },
      { id: '4', title: 'Training sessions', description: 'Complete initial training', category: 'training', completed: false },
    ]

    const newWorkflow: OnboardingWorkflow = {
      id: Date.now().toString(),
      employeeId,
      startDate: new Date().toISOString().split('T')[0],
      status: 'in-progress',
      tasks: defaultTasks
    }

    setOnboardingWorkflows([...onboardingWorkflows, newWorkflow])
    saveToLocalStorage()
    showToast('Onboarding workflow created!', 'success')
  }

  const toggleOnboardingTask = (workflowId: string, taskId: string) => {
    const updated = onboardingWorkflows.map(w => {
      if (w.id === workflowId) {
        const updatedTasks = w.tasks.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              completed: !t.completed,
              completedDate: !t.completed ? new Date().toISOString() : undefined
            }
          }
          return t
        })
        const allCompleted = updatedTasks.every(t => t.completed)
        return {
          ...w,
          tasks: updatedTasks,
          status: allCompleted ? 'completed' : w.status,
          completionDate: allCompleted ? new Date().toISOString() : w.completionDate
        }
      }
      return w
    })
    setOnboardingWorkflows(updated)
    saveToLocalStorage()
  }

  const addTimeEntry = () => {
    if (!timeEntryFormData.date || !timeEntryFormData.hours) {
      showToast('Please fill in date and hours', 'error')
      return
    }

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      employeeId: teamMembers[0]?.id || '',
      date: timeEntryFormData.date,
      checkIn: timeEntryFormData.checkIn || undefined,
      checkOut: timeEntryFormData.checkOut || undefined,
      hours: parseFloat(timeEntryFormData.hours) || 0,
      project: timeEntryFormData.project || undefined,
      notes: timeEntryFormData.notes || undefined
    }

    setTimeEntries([...timeEntries, newEntry])
    setTimeEntryFormData({ date: new Date().toISOString().split('T')[0], checkIn: '', checkOut: '', hours: '', project: '', notes: '' })
    saveToLocalStorage()
    showToast('Time entry added!', 'success')
  }

  const addLeaveRequest = () => {
    if (!leaveFormData.startDate || !leaveFormData.endDate) {
      showToast('Please fill in start and end dates', 'error')
      return
    }

    const start = new Date(leaveFormData.startDate)
    const end = new Date(leaveFormData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      employeeId: teamMembers[0]?.id || '',
      type: leaveFormData.type,
      startDate: leaveFormData.startDate,
      endDate: leaveFormData.endDate,
      days,
      status: 'pending',
      reason: leaveFormData.reason || undefined,
      submittedDate: new Date().toISOString().split('T')[0]
    }

    setLeaveRequests([...leaveRequests, newRequest])
    setLeaveFormData({ type: 'vacation', startDate: '', endDate: '', reason: '' })
    saveToLocalStorage()
    showToast('Leave request submitted!', 'success')
  }

  const updateLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    const updated = leaveRequests.map(r => r.id === id ? { ...r, status } : r)
    setLeaveRequests(updated)
    saveToLocalStorage()
    showToast(`Leave request ${status}!`, 'success')
  }

  const addSkill = (employeeId: string, skillName: string, category: string, level: Skill['level']) => {
    if (!skills[employeeId]) {
      skills[employeeId] = []
    }

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: skillName,
      category,
      level,
      certified: false
    }

    setSkills({ ...skills, [employeeId]: [...skills[employeeId], newSkill] })
    saveToLocalStorage()
    showToast('Skill added!', 'success')
  }

  const addTraining = () => {
    if (!trainingFormData.title || !trainingFormData.provider) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const newTraining: Training = {
      id: Date.now().toString(),
      title: trainingFormData.title,
      description: trainingFormData.description,
      type: trainingFormData.type,
      provider: trainingFormData.provider,
      duration: parseFloat(trainingFormData.duration) || 0,
      cost: parseFloat(trainingFormData.cost) || 0,
      status: 'planned',
      startDate: trainingFormData.startDate || undefined,
      endDate: trainingFormData.endDate || undefined,
      participants: [],
      notes: trainingFormData.notes || undefined
    }

    setTrainings([...trainings, newTraining])
    setTrainingFormData({ title: '', description: '', type: 'course', provider: '', duration: '', cost: '', startDate: '', endDate: '', notes: '' })
    saveToLocalStorage()
    showToast('Training added!', 'success')
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const departmentStats = departments.map(dept => ({
    name: dept,
    count: teamMembers.filter(m => m.department === dept).length
  }))

  const statusStats = [
    { name: 'Active', value: teamMembers.filter(m => m.status === 'active').length, color: '#10b981' },
    { name: 'Onboarding', value: teamMembers.filter(m => m.status === 'onboarding').length, color: '#3b82f6' },
    { name: 'On Leave', value: teamMembers.filter(m => m.status === 'on-leave').length, color: '#f59e0b' },
    { name: 'Offboarded', value: teamMembers.filter(m => m.status === 'offboarded').length, color: '#ef4444' },
  ]

  const goalStats = [
    { name: 'Completed', value: goals.filter(g => g.status === 'completed').length, color: '#10b981' },
    { name: 'In Progress', value: goals.filter(g => g.status === 'in-progress').length, color: '#3b82f6' },
    { name: 'Not Started', value: goals.filter(g => g.status === 'not-started').length, color: '#6b7280' },
    { name: 'On Hold', value: goals.filter(g => g.status === 'on-hold').length, color: '#f59e0b' },
  ]

  const avgPerformanceRating = performanceReviews.length > 0
    ? performanceReviews.reduce((sum, r) => sum + r.overallRating, 0) / performanceReviews.length
    : 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            Team Management Hub
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your startup team with comprehensive tools for hiring, performance tracking, goal setting, and team analytics.
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

        {/* Team Members Tab */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Team Members</h2>
                </div>
                <Button onClick={addTeamMember} size="sm" className="shrink-0">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Input
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Departments' },
                    ...departments.map(d => ({ value: d, label: d }))
                  ]}
                />
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'onboarding', label: 'Onboarding' },
                    { value: 'on-leave', label: 'On Leave' },
                    { value: 'offboarded', label: 'Offboarded' },
                  ]}
                />
              </div>

              {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Team Members Yet</h3>
                  <p className="text-gray-600 mb-6">Start building your team by adding your first member</p>
                  <Button onClick={addTeamMember}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Member
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMembers.map((member) => (
                    <Card key={member.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{member.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                          <Badge variant={member.status === 'active' ? 'new' : 'outline'} className="text-xs">
                            {member.status}
                          </Badge>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
              <Button
                            variant="ghost"
                size="sm"
                            onClick={() => setEditingMember(member)}
                            className="shrink-0"
              >
                            <Edit className="h-4 w-4" />
              </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTeamMember(member.id)}
                            className="shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{member.department}</span>
                        </div>
                        {member.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{member.location}</span>
                          </div>
                        )}
                        {member.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {member.skills.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                            {member.skills.length > 3 && (
                              <span className="text-xs text-gray-500">+{member.skills.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
            </Card>
          ))}
        </div>
              )}
            </Card>
      </div>
        )}

        {/* Roles & Structure Tab */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Roles & Structure</h2>
                </div>
                <Button onClick={addRole} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </div>

              {roles.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Roles Defined</h3>
                  <p className="text-gray-600 mb-6">Define roles and structure for your team</p>
                  <Button onClick={addRole}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Role
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <Card key={role.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{role.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{role.department}</p>
                          <Badge variant="outline" className="text-xs">
                            {role.level}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRole(role)}
                          className="shrink-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                      {role.requirements.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Requirements:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {role.requirements.slice(0, 3).map((req, idx) => (
                              <li key={idx}>• {req}</li>
                            ))}
                            {role.requirements.length > 3 && (
                              <li className="text-gray-500">+{role.requirements.length - 3} more</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Goals & OKRs Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Goals & OKRs</h2>
                </div>
                <Button onClick={addGoal} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>

              {goals.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
                  <p className="text-gray-600 mb-6">Set goals and OKRs for your team</p>
                  <Button onClick={addGoal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Goal
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => {
                    const assignedMember = teamMembers.find(m => m.id === goal.assignedTo)
                    return (
                      <Card key={goal.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-semibold">{goal.title}</h4>
                              <Badge variant={
                                goal.priority === 'high' ? 'new' :
                                goal.priority === 'medium' ? 'outline' : 'outline'
                              } className="text-xs">
                                {goal.priority}
                              </Badge>
                              <Badge variant={
                                goal.status === 'completed' ? 'new' :
                                goal.status === 'in-progress' ? 'outline' : 'outline'
                              } className="text-xs">
                                {goal.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                              <span>Assigned to: {assignedMember?.name || 'Unassigned'}</span>
                              {goal.dueDate && (
                                <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                              )}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-500 h-2 rounded-full transition-all"
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{goal.progress}% complete</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingGoal(goal)}
                            className="shrink-0 ml-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Performance Reviews</h2>
                </div>
                <Button onClick={addPerformanceReview} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Review
                </Button>
              </div>

              {performanceReviews.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Performance Reviews Yet</h3>
                  <p className="text-gray-600 mb-6">Start tracking team performance</p>
                  <Button onClick={addPerformanceReview}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Review
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {performanceReviews.map((review) => {
                    const employee = teamMembers.find(m => m.id === review.employeeId)
                    return (
                      <Card key={review.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{employee?.name || 'Unknown Employee'}</h4>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.overallRating
                                        ? 'text-yellow-500 fill-yellow-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="text-sm font-medium ml-2">{review.overallRating}/5</span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              Period: {review.period} • {new Date(review.reviewDate).toLocaleDateString()}
                            </div>
                            {review.strengths.length > 0 && (
                              <div className="mb-2">
                                <p className="text-xs font-medium text-gray-700 mb-1">Strengths:</p>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {review.strengths.map((strength, idx) => (
                                    <li key={idx}>• {strength}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {review.areasForImprovement.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-gray-700 mb-1">Areas for Improvement:</p>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {review.areasForImprovement.map((area, idx) => (
                                    <li key={idx}>• {area}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingReview(review)}
                            className="shrink-0 ml-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Onboarding Tab */}
        {activeTab === 'onboarding' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <LogIn className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Onboarding Workflows</h2>
                </div>
              </div>

              {onboardingWorkflows.length === 0 ? (
                <div className="text-center py-12">
                  <LogIn className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Onboarding Workflows</h3>
                  <p className="text-gray-600 mb-6">Create onboarding workflows for new team members</p>
                  {teamMembers.length > 0 && (
                    <Select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          addOnboardingWorkflow(e.target.value)
                        }
                      }}
                      options={[
                        { value: '', label: 'Select employee to onboard...' },
                        ...teamMembers.filter(m => m.status === 'onboarding').map(m => ({ value: m.id, label: m.name }))
                      ]}
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {onboardingWorkflows.map((workflow) => {
                    const employee = teamMembers.find(m => m.id === workflow.employeeId)
                    const completedTasks = workflow.tasks.filter(t => t.completed).length
                    const totalTasks = workflow.tasks.length
                    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

                    return (
                      <Card key={workflow.id} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{employee?.name || 'Unknown Employee'}</h4>
                              <Badge className={`text-xs ${
                                workflow.status === 'completed' ? 'bg-green-100 text-green-800' :
                                workflow.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {workflow.status}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {completedTasks} / {totalTasks} tasks completed
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                              <div
                                className="bg-primary-500 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="space-y-2">
                              {workflow.tasks.map((task) => (
                                <div key={task.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleOnboardingTask(workflow.id, task.id)}
                                    className="w-4 h-4"
                                  />
                                  <div className="flex-1">
                                    <div className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'font-medium'}`}>
                                      {task.title}
                                    </div>
                                    <div className="text-xs text-gray-600">{task.description}</div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {task.category}
                                  </Badge>
                                </div>
                              ))}
                            </div>
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

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Time Tracking</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingTimeEntry({
                      id: '',
                      employeeId: teamMembers[0]?.id || '',
                      date: new Date().toISOString().split('T')[0],
                      hours: 0
                    })
                    setTimeEntryFormData({ date: new Date().toISOString().split('T')[0], checkIn: '', checkOut: '', hours: '', project: '', notes: '' })
                  }}
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </div>

              {timeEntries.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No time entries yet. Add your first entry to start tracking.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {timeEntries
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 20)
                    .map((entry) => {
                      const employee = teamMembers.find(m => m.id === entry.employeeId)
                      return (
                        <Card key={entry.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{employee?.name || 'Unknown'}</h4>
                                <span className="text-sm text-gray-600">
                                  {new Date(entry.date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                {entry.checkIn && (
                                  <div>
                                    <span className="font-medium">Check In:</span> {entry.checkIn}
                                  </div>
                                )}
                                {entry.checkOut && (
                                  <div>
                                    <span className="font-medium">Check Out:</span> {entry.checkOut}
                                  </div>
                                )}
                                <div>
                                  <span className="font-medium">Hours:</span> {entry.hours}
                                </div>
                                {entry.project && (
                                  <div>
                                    <span className="font-medium">Project:</span> {entry.project}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                </div>
              )}
            </Card>

            {editingTimeEntry && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Time Entry</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingTimeEntry(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                      <Select
                        value={editingTimeEntry.employeeId}
                        onChange={(e) => setEditingTimeEntry({ ...editingTimeEntry, employeeId: e.target.value })}
                        options={[
                          { value: '', label: 'Select employee...' },
                          ...teamMembers.map(m => ({ value: m.id, label: m.name }))
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                      <Input
                        type="date"
                        value={timeEntryFormData.date}
                        onChange={(e) => setTimeEntryFormData({ ...timeEntryFormData, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check In</label>
                      <Input
                        type="time"
                        value={timeEntryFormData.checkIn}
                        onChange={(e) => setTimeEntryFormData({ ...timeEntryFormData, checkIn: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check Out</label>
                      <Input
                        type="time"
                        value={timeEntryFormData.checkOut}
                        onChange={(e) => setTimeEntryFormData({ ...timeEntryFormData, checkOut: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hours *</label>
                      <Input
                        type="number"
                        value={timeEntryFormData.hours}
                        onChange={(e) => setTimeEntryFormData({ ...timeEntryFormData, hours: e.target.value })}
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                      <Input
                        value={timeEntryFormData.project}
                        onChange={(e) => setTimeEntryFormData({ ...timeEntryFormData, project: e.target.value })}
                        placeholder="Project name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={2}
                      value={timeEntryFormData.notes}
                      onChange={(e) => setTimeEntryFormData({ ...timeEntryFormData, notes: e.target.value })}
                      placeholder="Additional notes..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addTimeEntry} className="flex-1">
                      Add Entry
                    </Button>
                    <Button variant="outline" onClick={() => setEditingTimeEntry(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Leave Management Tab */}
        {activeTab === 'leave' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Leave Management</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingLeave({
                      id: '',
                      employeeId: teamMembers[0]?.id || '',
                      type: 'vacation',
                      startDate: '',
                      endDate: '',
                      days: 0,
                      status: 'pending',
                      submittedDate: new Date().toISOString().split('T')[0]
                    })
                    setLeaveFormData({ type: 'vacation', startDate: '', endDate: '', reason: '' })
                  }}
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Request Leave
                </Button>
              </div>

              {leaveRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No leave requests yet. Submit your first leave request.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaveRequests
                    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                    .map((request) => {
                      const employee = teamMembers.find(m => m.id === request.employeeId)
                      return (
                        <Card key={request.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{employee?.name || 'Unknown'}</h4>
                                <Badge className={`text-xs ${
                                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {request.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {request.type}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Start:</span> {new Date(request.startDate).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">End:</span> {new Date(request.endDate).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Days:</span> {request.days}
                                </div>
                                <div>
                                  <span className="font-medium">Submitted:</span> {new Date(request.submittedDate).toLocaleDateString()}
                                </div>
                              </div>
                              {request.reason && (
                                <div className="text-sm text-gray-600 mt-2">
                                  <span className="font-medium">Reason:</span> {request.reason}
                                </div>
                              )}
                            </div>
                            {request.status === 'pending' && (
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateLeaveStatus(request.id, 'approved')}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateLeaveStatus(request.id, 'rejected')}
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                </div>
              )}
            </Card>

            {editingLeave && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Request Leave</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingLeave(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                    <Select
                      value={editingLeave.employeeId}
                      onChange={(e) => setEditingLeave({ ...editingLeave, employeeId: e.target.value })}
                      options={[
                        { value: '', label: 'Select employee...' },
                        ...teamMembers.map(m => ({ value: m.id, label: m.name }))
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                    <Select
                      value={leaveFormData.type}
                      onChange={(e) => setLeaveFormData({ ...leaveFormData, type: e.target.value as LeaveRequest['type'] })}
                      options={[
                        { value: 'vacation', label: 'Vacation' },
                        { value: 'sick', label: 'Sick Leave' },
                        { value: 'personal', label: 'Personal' },
                        { value: 'unpaid', label: 'Unpaid' },
                        { value: 'other', label: 'Other' }
                      ]}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                      <Input
                        type="date"
                        value={leaveFormData.startDate}
                        onChange={(e) => setLeaveFormData({ ...leaveFormData, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                      <Input
                        type="date"
                        value={leaveFormData.endDate}
                        onChange={(e) => setLeaveFormData({ ...leaveFormData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  {leaveFormData.startDate && leaveFormData.endDate && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm">
                        <span className="font-medium">Days:</span> {
                          Math.ceil((new Date(leaveFormData.endDate).getTime() - new Date(leaveFormData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
                        }
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={leaveFormData.reason}
                      onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
                      placeholder="Reason for leave..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addLeaveRequest} className="flex-1">
                      Submit Request
                    </Button>
                    <Button variant="outline" onClick={() => setEditingLeave(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Skills Matrix Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Skills Matrix</h2>
              </div>

              {teamMembers.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Add team members to track their skills.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map((member) => {
                    const memberSkills = skills[member.id] || []
                    return (
                      <Card key={member.id} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">{member.name}</h4>
                            <p className="text-sm text-gray-600">{member.role} • {member.department}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {memberSkills.length} skills
                          </Badge>
                        </div>
                        {memberSkills.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {memberSkills.map((skill) => (
                              <div key={skill.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">{skill.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {skill.level}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-600">
                                  {skill.category} {skill.certified && '• Certified'}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No skills tracked yet</div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Training & Development</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingTraining({
                      id: '',
                      title: '',
                      description: '',
                      type: 'course',
                      provider: '',
                      duration: 0,
                      cost: 0,
                      status: 'planned',
                      participants: []
                    })
                    setTrainingFormData({ title: '', description: '', type: 'course', provider: '', duration: '', cost: '', startDate: '', endDate: '', notes: '' })
                  }}
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Training
                </Button>
              </div>

              {trainings.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No training programs yet. Add your first training program.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trainings.map((training) => (
                    <Card key={training.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{training.title}</h4>
                            <Badge className={`text-xs ${
                              training.status === 'completed' ? 'bg-green-100 text-green-800' :
                              training.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              training.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {training.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {training.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{training.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Provider:</span> {training.provider}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {training.duration} hours
                            </div>
                            <div>
                              <span className="font-medium">Cost:</span> ${training.cost.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Participants:</span> {training.participants.length}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTraining(training)
                            setTrainingFormData({
                              title: training.title,
                              description: training.description,
                              type: training.type,
                              provider: training.provider,
                              duration: training.duration.toString(),
                              cost: training.cost.toString(),
                              startDate: training.startDate || '',
                              endDate: training.endDate || '',
                              notes: training.notes || ''
                            })
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {editingTraining && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingTraining.id ? 'Edit Training' : 'Add Training'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingTraining(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <Input
                      value={trainingFormData.title}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, title: e.target.value })}
                      placeholder="e.g., React Advanced Course"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={trainingFormData.description}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, description: e.target.value })}
                      placeholder="Training description..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <Select
                        value={trainingFormData.type}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, type: e.target.value as Training['type'] })}
                        options={[
                          { value: 'course', label: 'Course' },
                          { value: 'workshop', label: 'Workshop' },
                          { value: 'certification', label: 'Certification' },
                          { value: 'conference', label: 'Conference' },
                          { value: 'other', label: 'Other' }
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Provider *</label>
                      <Input
                        value={trainingFormData.provider}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, provider: e.target.value })}
                        placeholder="Training provider"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                      <Input
                        type="number"
                        value={trainingFormData.duration}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, duration: e.target.value })}
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
                      <Input
                        type="number"
                        value={trainingFormData.cost}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, cost: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <Select
                        value={editingTraining.status}
                        onChange={(e) => setEditingTraining({ ...editingTraining, status: e.target.value as Training['status'] })}
                        options={[
                          { value: 'planned', label: 'Planned' },
                          { value: 'in-progress', label: 'In Progress' },
                          { value: 'completed', label: 'Completed' },
                          { value: 'cancelled', label: 'Cancelled' }
                        ]}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <Input
                        type="date"
                        value={trainingFormData.startDate}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <Input
                        type="date"
                        value={trainingFormData.endDate}
                        onChange={(e) => setTrainingFormData({ ...trainingFormData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={trainingFormData.notes}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, notes: e.target.value })}
                      placeholder="Additional notes..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addTraining} className="flex-1">
                      {editingTraining.id ? 'Update Training' : 'Add Training'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingTraining(null)}>
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
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Members</div>
                <div className="text-2xl font-bold">{teamMembers.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Active</div>
                <div className="text-2xl font-bold text-green-600">
                  {teamMembers.filter(m => m.status === 'active').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Onboarding</div>
                <div className="text-2xl font-bold text-blue-600">
                  {onboardingWorkflows.filter(w => w.status === 'in-progress').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Goals</div>
                <div className="text-2xl font-bold">{goals.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Avg Performance</div>
                <div className="text-2xl font-bold text-primary-600">
                  {avgPerformanceRating.toFixed(1)}/5
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Leave Requests</div>
                <div className="text-2xl font-bold text-orange-600">
                  {leaveRequests.filter(r => r.status === 'pending').length}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Team by Department</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Team Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Goal Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={goalStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {goalStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Performance Trends</h3>
                {performanceReviews.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceReviews.map(r => ({
                      date: new Date(r.reviewDate).toLocaleDateString(),
                      rating: r.overallRating
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-400">
                    No performance data yet
                  </div>
                )}
              </Card>

              {timeEntries.length > 0 && (
                <Card>
                  <h3 className="font-semibold mb-4">Total Hours Tracked</h3>
                  <div className="text-center py-8">
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                      {timeEntries.reduce((sum, e) => sum + e.hours, 0).toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-600">hours across {timeEntries.length} entries</div>
                  </div>
                </Card>
              )}

              {trainings.length > 0 && (
                <Card>
                  <h3 className="font-semibold mb-4">Training Programs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{trainings.length}</div>
                      <div className="text-xs text-gray-600">Total Programs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {trainings.filter(t => t.status === 'in-progress').length}
                      </div>
                      <div className="text-xs text-gray-600">In Progress</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {trainings.filter(t => t.status === 'completed').length}
                      </div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        ${trainings.reduce((sum, t) => sum + t.cost, 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Total Investment</div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Edit Team Member Modal */}
        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
                <h3 className="text-lg font-bold">Team Member Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingMember(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <Input
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <Input
                      type="email"
                      value={editingMember.email}
                      onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input
                      type="tel"
                      value={editingMember.phone || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input
                      value={editingMember.location || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, location: e.target.value })}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                    <Input
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                    <Select
                      value={editingMember.department}
                      onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                      options={departments.map(d => ({ value: d, label: d }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={editingMember.startDate}
                      onChange={(e) => setEditingMember({ ...editingMember, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select
                      value={editingMember.status}
                      onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as any })}
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'onboarding', label: 'Onboarding' },
                        { value: 'on-leave', label: 'On Leave' },
                        { value: 'offboarded', label: 'Offboarded' },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                  <Input
                    value={editingMember.skills.join(', ')}
                    onChange={(e) => setEditingMember({ 
                      ...editingMember, 
                      skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingMember.notes || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t sticky bottom-0 bg-white mt-4">
                <Button onClick={saveTeamMember} className="flex-1 min-w-[120px]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Member
                </Button>
                <Button variant="outline" onClick={() => setEditingMember(null)} className="shrink-0">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Role Modal */}
        {editingRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
                <h3 className="text-lg font-bold">Role Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingRole(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <Input
                      value={editingRole.title}
                      onChange={(e) => setEditingRole({ ...editingRole, title: e.target.value })}
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                    <Select
                      value={editingRole.department}
                      onChange={(e) => setEditingRole({ ...editingRole, department: e.target.value })}
                      options={departments.map(d => ({ value: d, label: d }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <Select
                    value={editingRole.level}
                    onChange={(e) => setEditingRole({ ...editingRole, level: e.target.value as any })}
                    options={[
                      { value: 'entry', label: 'Entry Level' },
                      { value: 'mid', label: 'Mid Level' },
                      { value: 'senior', label: 'Senior' },
                      { value: 'executive', label: 'Executive' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingRole.description}
                    onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                    placeholder="Role description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (one per line)</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={4}
                    value={editingRole.requirements.join('\n')}
                    onChange={(e) => setEditingRole({ 
                      ...editingRole, 
                      requirements: e.target.value.split('\n').filter(r => r.trim())
                    })}
                    placeholder="Requirement 1&#10;Requirement 2&#10;..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t sticky bottom-0 bg-white mt-4">
                <Button onClick={saveRole} className="flex-1 min-w-[120px]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Role
                </Button>
                <Button variant="outline" onClick={() => setEditingRole(null)} className="shrink-0">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Goal Modal */}
        {editingGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
                <h3 className="text-lg font-bold">Goal Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingGoal(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <Input
                    value={editingGoal.title}
                    onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                    placeholder="Q1 Revenue Target"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingGoal.description}
                    onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                    placeholder="Goal description..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To *</label>
                    <Select
                      value={editingGoal.assignedTo}
                      onChange={(e) => setEditingGoal({ ...editingGoal, assignedTo: e.target.value })}
                      options={[
                        { value: '', label: 'Select member...' },
                        ...teamMembers.map(m => ({ value: m.id, label: m.name }))
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <Input
                      type="date"
                      value={editingGoal.dueDate}
                      onChange={(e) => setEditingGoal({ ...editingGoal, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select
                      value={editingGoal.status}
                      onChange={(e) => setEditingGoal({ ...editingGoal, status: e.target.value as any })}
                      options={[
                        { value: 'not-started', label: 'Not Started' },
                        { value: 'in-progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'on-hold', label: 'On Hold' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <Select
                      value={editingGoal.priority}
                      onChange={(e) => setEditingGoal({ ...editingGoal, priority: e.target.value as any })}
                      options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editingGoal.progress}
                    onChange={(e) => setEditingGoal({ ...editingGoal, progress: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Input
                    value={editingGoal.category}
                    onChange={(e) => setEditingGoal({ ...editingGoal, category: e.target.value })}
                    placeholder="e.g., Revenue, Product, Marketing"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t sticky bottom-0 bg-white mt-4">
                <Button onClick={saveGoal} className="flex-1 min-w-[120px]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Goal
                </Button>
                <Button variant="outline" onClick={() => setEditingGoal(null)} className="shrink-0">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Performance Review Modal */}
        {editingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
                <h3 className="text-lg font-bold">Performance Review</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingReview(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
                    <Select
                      value={editingReview.employeeId}
                      onChange={(e) => setEditingReview({ ...editingReview, employeeId: e.target.value })}
                      options={[
                        { value: '', label: 'Select employee...' },
                        ...teamMembers.map(m => ({ value: m.id, label: m.name }))
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Review Date</label>
                    <Input
                      type="date"
                      value={editingReview.reviewDate}
                      onChange={(e) => setEditingReview({ ...editingReview, reviewDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period *</label>
                  <Input
                    value={editingReview.period}
                    onChange={(e) => setEditingReview({ ...editingReview, period: e.target.value })}
                    placeholder="e.g., Q1 2024, H1 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating (1-5)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setEditingReview({ ...editingReview, overallRating: rating })}
                        className={`p-2 rounded-lg ${
                          editingReview.overallRating >= rating
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Star className="h-6 w-6" />
                      </button>
                    ))}
                    <span className="ml-2 font-medium">{editingReview.overallRating}/5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Strengths (one per line)</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingReview.strengths.join('\n')}
                    onChange={(e) => setEditingReview({ 
                      ...editingReview, 
                      strengths: e.target.value.split('\n').filter(s => s.trim())
                    })}
                    placeholder="Strength 1&#10;Strength 2&#10;..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Areas for Improvement (one per line)</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingReview.areasForImprovement.join('\n')}
                    onChange={(e) => setEditingReview({ 
                      ...editingReview, 
                      areasForImprovement: e.target.value.split('\n').filter(a => a.trim())
                    })}
                    placeholder="Area 1&#10;Area 2&#10;..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goals (one per line)</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingReview.goals.join('\n')}
                    onChange={(e) => setEditingReview({ 
                      ...editingReview, 
                      goals: e.target.value.split('\n').filter(g => g.trim())
                    })}
                    placeholder="Goal 1&#10;Goal 2&#10;..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingReview.notes}
                    onChange={(e) => setEditingReview({ ...editingReview, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t sticky bottom-0 bg-white mt-4">
                <Button onClick={savePerformanceReview} className="flex-1 min-w-[120px]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Review
                </Button>
                <Button variant="outline" onClick={() => setEditingReview(null)} className="shrink-0">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
