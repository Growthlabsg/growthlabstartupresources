'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  CheckSquare, 
  Circle, 
  Save,
  Plus,
  Edit,
  Trash2,
  X,
  Download,
  Search as SearchIcon,
  Filter,
  Calendar,
  AlertCircle,
  Sparkles,
  Target,
  Rocket,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Shield,
  Building2,
  Zap,
  Award,
  Activity,
  BarChart3,
  Clock,
  Star,
  Lightbulb
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface ChecklistItem {
  id: string
  text: string
  description?: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  notes?: string
  category: string
  stage: string
}

interface ChecklistCategory {
  id: string
  title: string
  icon: any
  stage: string
  items: ChecklistItem[]
}

interface Milestone {
  id: string
  name: string
  targetDate: string
  completed: boolean
  items: string[]
}

const initialChecklistCategories: ChecklistCategory[] = [
  {
    id: 'idea',
    title: 'Idea & Validation',
    icon: Lightbulb,
    stage: 'idea',
    items: [
      { id: 'idea-1', text: 'Validate problem-solution fit', description: 'Confirm that your solution addresses a real problem', completed: false, priority: 'high', category: 'idea', stage: 'idea' },
      { id: 'idea-2', text: 'Conduct market research', description: 'Research market size, trends, and opportunities', completed: false, priority: 'high', category: 'idea', stage: 'idea' },
      { id: 'idea-3', text: 'Define target customer persona', description: 'Create detailed customer profiles', completed: false, priority: 'high', category: 'idea', stage: 'idea' },
      { id: 'idea-4', text: 'Interview 10+ potential customers', description: 'Gather direct feedback from target users', completed: false, priority: 'high', category: 'idea', stage: 'idea' },
      { id: 'idea-5', text: 'Analyze competitive landscape', description: 'Identify competitors and market positioning', completed: false, priority: 'medium', category: 'idea', stage: 'idea' },
      { id: 'idea-6', text: 'Create problem statement', description: 'Clearly articulate the problem you\'re solving', completed: false, priority: 'medium', category: 'idea', stage: 'idea' },
      { id: 'idea-7', text: 'Test solution with MVP', description: 'Build and test minimum viable product', completed: false, priority: 'high', category: 'idea', stage: 'idea' },
      { id: 'idea-8', text: 'Calculate market size (TAM/SAM/SOM)', description: 'Determine addressable market opportunity', completed: false, priority: 'medium', category: 'idea', stage: 'idea' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal & Structure',
    icon: Shield,
    stage: 'legal',
    items: [
      { id: 'legal-1', text: 'Choose business entity type', description: 'LLC, Corporation, etc.', completed: false, priority: 'high', category: 'legal', stage: 'legal' },
      { id: 'legal-2', text: 'Register business entity', description: 'File with state authorities', completed: false, priority: 'high', category: 'legal', stage: 'legal' },
      { id: 'legal-3', text: 'Obtain EIN from IRS', description: 'Employer Identification Number', completed: false, priority: 'high', category: 'legal', stage: 'legal' },
      { id: 'legal-4', text: 'Set up business bank account', description: 'Separate business finances', completed: false, priority: 'high', category: 'legal', stage: 'legal' },
      { id: 'legal-5', text: 'Register domain name', description: 'Secure your online presence', completed: false, priority: 'medium', category: 'legal', stage: 'legal' },
      { id: 'legal-6', text: 'Trademark business name/logo', description: 'Protect your brand identity', completed: false, priority: 'medium', category: 'legal', stage: 'legal' },
      { id: 'legal-7', text: 'Create founder agreement', description: 'Define equity, roles, and responsibilities', completed: false, priority: 'high', category: 'legal', stage: 'legal' },
      { id: 'legal-8', text: 'Set up cap table', description: 'Track equity ownership', completed: false, priority: 'high', category: 'legal', stage: 'legal' },
      { id: 'legal-9', text: 'Draft terms of service', description: 'Legal terms for your product/service', completed: false, priority: 'medium', category: 'legal', stage: 'legal' },
      { id: 'legal-10', text: 'Create privacy policy', description: 'GDPR/CCPA compliant privacy policy', completed: false, priority: 'medium', category: 'legal', stage: 'legal' },
    ],
  },
  {
    id: 'product',
    title: 'Product Development',
    icon: Rocket,
    stage: 'product',
    items: [
      { id: 'product-1', text: 'Create product roadmap', description: 'Plan features and releases', completed: false, priority: 'high', category: 'product', stage: 'product' },
      { id: 'product-2', text: 'Build MVP', description: 'Minimum viable product development', completed: false, priority: 'high', category: 'product', stage: 'product' },
      { id: 'product-3', text: 'Set up development environment', description: 'CI/CD, version control, etc.', completed: false, priority: 'high', category: 'product', stage: 'product' },
      { id: 'product-4', text: 'Implement core features', description: 'Essential functionality for launch', completed: false, priority: 'high', category: 'product', stage: 'product' },
      { id: 'product-5', text: 'Conduct user testing', description: 'Test with real users', completed: false, priority: 'high', category: 'product', stage: 'product' },
      { id: 'product-6', text: 'Set up analytics', description: 'Track user behavior and metrics', completed: false, priority: 'medium', category: 'product', stage: 'product' },
      { id: 'product-7', text: 'Implement error tracking', description: 'Monitor and fix bugs', completed: false, priority: 'medium', category: 'product', stage: 'product' },
      { id: 'product-8', text: 'Create user documentation', description: 'Help guides and tutorials', completed: false, priority: 'low', category: 'product', stage: 'product' },
      { id: 'product-9', text: 'Set up customer support system', description: 'Help desk and ticketing', completed: false, priority: 'medium', category: 'product', stage: 'product' },
      { id: 'product-10', text: 'Prepare for scale', description: 'Infrastructure and architecture', completed: false, priority: 'medium', category: 'product', stage: 'product' },
    ],
  },
  {
    id: 'launch',
    title: 'Launch Preparation',
    icon: Zap,
    stage: 'launch',
    items: [
      { id: 'launch-1', text: 'Create landing page', description: 'Marketing and conversion page', completed: false, priority: 'high', category: 'launch', stage: 'launch' },
      { id: 'launch-2', text: 'Set up email marketing', description: 'Newsletter and campaigns', completed: false, priority: 'medium', category: 'launch', stage: 'launch' },
      { id: 'launch-3', text: 'Create social media accounts', description: 'LinkedIn, Twitter, etc.', completed: false, priority: 'medium', category: 'launch', stage: 'launch' },
      { id: 'launch-4', text: 'Prepare launch announcement', description: 'Press release and messaging', completed: false, priority: 'high', category: 'launch', stage: 'launch' },
      { id: 'launch-5', text: 'Build waitlist/beta list', description: 'Early adopter signups', completed: false, priority: 'high', category: 'launch', stage: 'launch' },
      { id: 'launch-6', text: 'Set up payment processing', description: 'Stripe, PayPal, etc.', completed: false, priority: 'high', category: 'launch', stage: 'launch' },
      { id: 'launch-7', text: 'Create onboarding flow', description: 'User onboarding experience', completed: false, priority: 'high', category: 'launch', stage: 'launch' },
      { id: 'launch-8', text: 'Prepare customer support', description: 'FAQ, help docs, support team', completed: false, priority: 'medium', category: 'launch', stage: 'launch' },
      { id: 'launch-9', text: 'Set up monitoring and alerts', description: 'System health monitoring', completed: false, priority: 'high', category: 'launch', stage: 'launch' },
      { id: 'launch-10', text: 'Plan launch day activities', description: 'Marketing and PR activities', completed: false, priority: 'medium', category: 'launch', stage: 'launch' },
    ],
  },
  {
    id: 'growth',
    title: 'Growth & Scaling',
    icon: TrendingUp,
    stage: 'growth',
    items: [
      { id: 'growth-1', text: 'Acquire first 10 customers', description: 'Initial customer acquisition', completed: false, priority: 'high', category: 'growth', stage: 'growth' },
      { id: 'growth-2', text: 'Acquire first 100 customers', description: 'Early growth milestone', completed: false, priority: 'high', category: 'growth', stage: 'growth' },
      { id: 'growth-3', text: 'Achieve product-market fit', description: 'Strong demand and retention', completed: false, priority: 'high', category: 'growth', stage: 'growth' },
      { id: 'growth-4', text: 'Implement growth metrics', description: 'CAC, LTV, retention, etc.', completed: false, priority: 'high', category: 'growth', stage: 'growth' },
      { id: 'growth-5', text: 'Scale marketing efforts', description: 'Increase marketing budget and channels', completed: false, priority: 'medium', category: 'growth', stage: 'growth' },
      { id: 'growth-6', text: 'Build referral program', description: 'Customer referral incentives', completed: false, priority: 'medium', category: 'growth', stage: 'growth' },
      { id: 'growth-7', text: 'Expand to new markets', description: 'Geographic or segment expansion', completed: false, priority: 'low', category: 'growth', stage: 'growth' },
      { id: 'growth-8', text: 'Hire key team members', description: 'Critical roles for scaling', completed: false, priority: 'high', category: 'growth', stage: 'growth' },
      { id: 'growth-9', text: 'Optimize conversion funnel', description: 'Improve conversion rates', completed: false, priority: 'medium', category: 'growth', stage: 'growth' },
      { id: 'growth-10', text: 'Build strategic partnerships', description: 'Partnerships for growth', completed: false, priority: 'low', category: 'growth', stage: 'growth' },
    ],
  },
  {
    id: 'funding',
    title: 'Funding Readiness',
    icon: DollarSign,
    stage: 'funding',
    items: [
      { id: 'funding-1', text: 'Prepare pitch deck', description: 'Investor presentation deck', completed: false, priority: 'high', category: 'funding', stage: 'funding' },
      { id: 'funding-2', text: 'Create financial projections', description: '3-5 year financial forecasts', completed: false, priority: 'high', category: 'funding', stage: 'funding' },
      { id: 'funding-3', text: 'Identify target investors', description: 'Research and list potential investors', completed: false, priority: 'high', category: 'funding', stage: 'funding' },
      { id: 'funding-4', text: 'Prepare executive summary', description: 'One-page business summary', completed: false, priority: 'high', category: 'funding', stage: 'funding' },
      { id: 'funding-5', text: 'Create investor data room', description: 'Due diligence materials', completed: false, priority: 'medium', category: 'funding', stage: 'funding' },
      { id: 'funding-6', text: 'Practice pitch presentation', description: 'Rehearse investor pitch', completed: false, priority: 'high', category: 'funding', stage: 'funding' },
      { id: 'funding-7', text: 'Calculate valuation', description: 'Determine company valuation', completed: false, priority: 'high', category: 'funding', stage: 'funding' },
      { id: 'funding-8', text: 'Prepare term sheet', description: 'Investment terms template', completed: false, priority: 'medium', category: 'funding', stage: 'funding' },
      { id: 'funding-9', text: 'Set up investor outreach', description: 'Email templates and tracking', completed: false, priority: 'medium', category: 'funding', stage: 'funding' },
      { id: 'funding-10', text: 'Schedule investor meetings', description: 'Book pitch meetings', completed: false, priority: 'high', category: 'funding', stage: 'funding' },
    ],
  },
  {
    id: 'operations',
    title: 'Operations & Team',
    icon: Users,
    stage: 'operations',
    items: [
      { id: 'ops-1', text: 'Hire founding team', description: 'Co-founders and early employees', completed: false, priority: 'high', category: 'operations', stage: 'operations' },
      { id: 'ops-2', text: 'Set up HR processes', description: 'Hiring, onboarding, policies', completed: false, priority: 'medium', category: 'operations', stage: 'operations' },
      { id: 'ops-3', text: 'Create employee handbook', description: 'Company policies and culture', completed: false, priority: 'low', category: 'operations', stage: 'operations' },
      { id: 'ops-4', text: 'Set up payroll system', description: 'Payroll processing and benefits', completed: false, priority: 'high', category: 'operations', stage: 'operations' },
      { id: 'ops-5', text: 'Implement project management', description: 'Tools and processes', completed: false, priority: 'medium', category: 'operations', stage: 'operations' },
      { id: 'ops-6', text: 'Establish company culture', description: 'Values, mission, vision', completed: false, priority: 'medium', category: 'operations', stage: 'operations' },
      { id: 'ops-7', text: 'Set up communication tools', description: 'Slack, email, meetings', completed: false, priority: 'high', category: 'operations', stage: 'operations' },
      { id: 'ops-8', text: 'Create employee equity plan', description: 'ESOP and vesting schedules', completed: false, priority: 'medium', category: 'operations', stage: 'operations' },
      { id: 'ops-9', text: 'Set up accounting system', description: 'Bookkeeping and financial tracking', completed: false, priority: 'high', category: 'operations', stage: 'operations' },
      { id: 'ops-10', text: 'Establish vendor relationships', description: 'Key suppliers and partners', completed: false, priority: 'low', category: 'operations', stage: 'operations' },
    ],
  },
]

export default function ChecklistPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [categories, setCategories] = useState<ChecklistCategory[]>(initialChecklistCategories)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'completed' | 'pending'>('all')
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItemCategory, setNewItemCategory] = useState('idea')

  const tabs = [
    { id: 'all', label: 'All Items', icon: FileText },
    { id: 'idea', label: 'Idea & Validation', icon: Lightbulb },
    { id: 'legal', label: 'Legal & Structure', icon: Shield },
    { id: 'product', label: 'Product Development', icon: Rocket },
    { id: 'launch', label: 'Launch Preparation', icon: Zap },
    { id: 'growth', label: 'Growth & Scaling', icon: TrendingUp },
    { id: 'funding', label: 'Funding Readiness', icon: DollarSign },
    { id: 'operations', label: 'Operations & Team', icon: Users },
    { id: 'milestones', label: 'Milestones', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('startupChecklistData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.categories) setCategories(data.categories)
          if (data.milestones) setMilestones(data.milestones)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        categories,
        milestones,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('startupChecklistData', JSON.stringify(data))
    }
  }

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        const updatedItems = category.items.map(item => {
          if (item.id === itemId) {
            const newCompleted = !item.completed
            if (newCompleted) {
              showToast(`Completed: ${item.text}`, 'success')
            }
            return { ...item, completed: newCompleted }
          }
          return item
        })
        return { ...category, items: updatedItems }
      }
      return category
    }))
    saveToLocalStorage()
  }

  const addCustomItem = () => {
    if (!editingItem?.text) {
      showToast('Please enter item text', 'error')
      return
    }

    const category = categories.find(c => c.id === newItemCategory)
    if (!category) return

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      text: editingItem.text,
      description: editingItem.description,
      completed: false,
      priority: editingItem.priority || 'medium',
      dueDate: editingItem.dueDate,
      notes: editingItem.notes,
      category: newItemCategory,
      stage: category.stage
    }

    const updated = categories.map(c => 
      c.id === newItemCategory 
        ? { ...c, items: [...c.items, newItem] }
        : c
    )

    setCategories(updated)
    saveToLocalStorage()
    setEditingItem(null)
    setShowAddItem(false)
    showToast('Item added!', 'success')
  }

  const deleteItem = (categoryId: string, itemId: string) => {
    const updated = categories.map(category => 
      category.id === categoryId
        ? { ...category, items: category.items.filter(item => item.id !== itemId) }
        : category
    )
    setCategories(updated)
    saveToLocalStorage()
    showToast('Item deleted', 'success')
  }

  const updateItem = (categoryId: string, updatedItem: ChecklistItem) => {
    const updated = categories.map(category => 
      category.id === categoryId
        ? { ...category, items: category.items.map(item => item.id === updatedItem.id ? updatedItem : item) }
        : category
    )
    setCategories(updated)
    saveToLocalStorage()
    setEditingItem(null)
    showToast('Item updated!', 'success')
  }

  const exportData = () => {
    const data = {
      categories,
      milestones,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `startup-checklist-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Checklist exported successfully', 'success')
  }

  const allItems = categories.flatMap(cat => cat.items)
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority
    const matchesCompleted = filterCompleted === 'all' ||
                            (filterCompleted === 'completed' && item.completed) ||
                            (filterCompleted === 'pending' && !item.completed)
    const matchesTab = activeTab === 'all' || item.stage === activeTab

    return matchesSearch && matchesPriority && matchesCompleted && matchesTab
  })

  const totalItems = allItems.length
  const completedItems = allItems.filter(item => item.completed).length
  const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  const categoryProgress = categories.map(cat => ({
    name: cat.title,
    completed: cat.items.filter(i => i.completed).length,
    total: cat.items.length,
    progress: cat.items.length > 0 ? (cat.items.filter(i => i.completed).length / cat.items.length) * 100 : 0
  }))

  const priorityData = [
    { name: 'High', value: allItems.filter(i => i.priority === 'high' && !i.completed).length, color: '#ef4444' },
    { name: 'Medium', value: allItems.filter(i => i.priority === 'medium' && !i.completed).length, color: '#f59e0b' },
    { name: 'Low', value: allItems.filter(i => i.priority === 'low' && !i.completed).length, color: '#6b7280' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
                <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                  Startup Checklist
                </span>
              </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your startup journey with comprehensive checklists for every stage - from idea validation to scaling.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => {
                setEditingItem({ id: '', text: '', completed: false, priority: 'medium', category: newItemCategory, stage: categories.find(c => c.id === newItemCategory)?.stage || 'idea' })
                setShowAddItem(true)
              }} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <Button variant="outline" size="sm" onClick={exportData} className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export
            </Button>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="mb-6 p-6 bg-gradient-to-r from-primary-50 to-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Overall Progress</h3>
              <p className="text-sm text-gray-600">{completedItems} of {totalItems} items completed</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">{Math.round(overallProgress)}%</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-primary-500 h-4 rounded-full transition-all duration-500" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </Card>

        {/* Filters */}
        {(activeTab === 'all' || activeTab === 'analytics') && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                options={[
                  { value: 'all', label: 'All Priorities' },
                  { value: 'high', label: 'High Priority' },
                  { value: 'medium', label: 'Medium Priority' },
                  { value: 'low', label: 'Low Priority' },
                ]}
              />
              <Select
                value={filterCompleted}
                onChange={(e) => setFilterCompleted(e.target.value as any)}
                options={[
                  { value: 'all', label: 'All Items' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'pending', label: 'Pending' },
                ]}
              />
            </div>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Items</div>
                <div className="text-2xl font-bold">{totalItems}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Completed</div>
                <div className="text-2xl font-bold text-green-600">{completedItems}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Remaining</div>
                <div className="text-2xl font-bold text-orange-600">{totalItems - completedItems}</div>
              </Card>
        </div>

            <Card>
              <h3 className="font-semibold mb-4">Progress by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={categoryProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#3b82f6" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="font-semibold mb-4">Pending Items by Priority</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Checklist Items */}
        {activeTab !== 'analytics' && activeTab !== 'milestones' && (
          <div className="space-y-6">
            {activeTab === 'all' ? (
              <div className="space-y-6">
          {categories.map((category) => {
                  const categoryItems = filteredItems.filter(item => item.category === category.id)
                  if (categoryItems.length === 0) return null

                  const categoryCompleted = categoryItems.filter(item => item.completed).length
                  const categoryTotal = categoryItems.length
                  const categoryProgress = categoryTotal > 0 ? (categoryCompleted / categoryTotal) * 100 : 0

                  return (
                    <Card key={category.id}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <category.icon className="h-5 w-5 text-primary-500" />
                          <h3 className="text-lg font-semibold">{category.title}</h3>
                        </div>
                        <Badge variant="outline">{categoryCompleted}/{categoryTotal}</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${categoryProgress}%` }}
                        />
                      </div>
                      <div className="space-y-2">
                        {categoryItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <button
                              onClick={() => toggleItem(category.id, item.id)}
                              className="mt-1 shrink-0"
                            >
                              {item.completed ? (
                                <CheckSquare className="h-5 w-5 text-green-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span
                                  className={`font-medium ${
                                    item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                  }`}
                                >
                                  {item.text}
                                </span>
                                <Badge variant={
                                  item.priority === 'high' ? 'new' :
                                  item.priority === 'medium' ? 'outline' : 'outline'
                                } className="text-xs">
                                  {item.priority}
                                </Badge>
                                {item.dueDate && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                              )}
                              {item.notes && (
                                <p className="text-xs text-gray-500 italic">Note: {item.notes}</p>
                              )}
                            </div>
                            <div className="flex gap-1 shrink-0 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const categoryItem = categories.find(c => c.id === category.id)?.items.find(i => i.id === item.id)
                                  if (categoryItem) setEditingItem({ ...categoryItem, category: category.id })
                                }}
                                className="shrink-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteItem(category.id, item.id)}
                                className="shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              categories
                .filter(cat => cat.id === activeTab)
                .map((category) => {
            const categoryCompleted = category.items.filter(item => item.completed).length
            const categoryTotal = category.items.length
            const categoryProgress = categoryTotal > 0 ? (categoryCompleted / categoryTotal) * 100 : 0

            return (
              <Card key={category.id}>
                <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <category.icon className="h-5 w-5 text-primary-500" />
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                        </div>
                  <Badge variant="outline">{categoryCompleted}/{categoryTotal}</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${categoryProgress}%` }}
                        />
                </div>
                      <div className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <button
                      onClick={() => toggleItem(category.id, item.id)}
                              className="mt-1 shrink-0"
                    >
                      {item.completed ? (
                        <CheckSquare className="h-5 w-5 text-green-500" />
                      ) : (
                                <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                                  className={`font-medium ${
                          item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                      >
                        {item.text}
                      </span>
                                <Badge variant={
                                  item.priority === 'high' ? 'new' :
                                  item.priority === 'medium' ? 'outline' : 'outline'
                                } className="text-xs">
                                  {item.priority}
                                </Badge>
                                {item.dueDate && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                              )}
                              {item.notes && (
                                <p className="text-xs text-gray-500 italic">Note: {item.notes}</p>
                              )}
                            </div>
                            <div className="flex gap-1 shrink-0 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingItem({ ...item, category: category.id })}
                                className="shrink-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteItem(category.id, item.id)}
                                className="shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                    </div>
                  ))}
                </div>
              </Card>
            )
                })
            )}
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500" />
                  <h2 className="text-2xl font-bold">Milestones</h2>
                </div>
                <Button size="sm" onClick={() => {
                  const newMilestone: Milestone = {
                    id: Date.now().toString(),
                    name: '',
                    targetDate: '',
                    completed: false,
                    items: []
                  }
                  setMilestones([...milestones, newMilestone])
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>

              {milestones.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Milestones Yet</h3>
                  <p className="text-gray-600 mb-6">Create milestones to track major achievements</p>
                  <Button onClick={() => {
                    const newMilestone: Milestone = {
                      id: Date.now().toString(),
                      name: '',
                      targetDate: '',
                      completed: false,
                      items: []
                    }
                    setMilestones([...milestones, newMilestone])
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Milestone
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <Card key={milestone.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{milestone.name}</h4>
                            <Badge variant={milestone.completed ? 'new' : 'outline'}>
                              {milestone.completed ? 'Completed' : 'Pending'}
                            </Badge>
                            {milestone.targetDate && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(milestone.targetDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          {milestone.items.length > 0 && (
                            <div className="text-sm text-gray-600">
                              {milestone.items.length} associated items
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = milestones.filter(m => m.id !== milestone.id)
                            setMilestones(updated)
                            saveToLocalStorage()
                            showToast('Milestone deleted', 'success')
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
                <h3 className="text-lg font-bold">{showAddItem ? 'Add New Item' : 'Edit Item'}</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingItem(null)
                  setShowAddItem(false)
                }} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
              {showAddItem && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select
                    value={newItemCategory}
                    onChange={(e) => {
                      setNewItemCategory(e.target.value)
                      setEditingItem({ ...editingItem, category: e.target.value, stage: categories.find(c => c.id === e.target.value)?.stage || 'idea' })
                    }}
                    options={categories.map(c => ({ value: c.id, label: c.title }))}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Text</label>
                <Input
                  value={editingItem.text}
                  onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                  placeholder="e.g., Complete market research"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Additional details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <Select
                    value={editingItem.priority}
                    onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value as any })}
                    options={[
                      { value: 'high', label: 'High' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'low', label: 'Low' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date (Optional)</label>
                  <Input
                    type="date"
                    value={editingItem.dueDate || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                  rows={2}
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  placeholder="Add notes..."
                />
              </div>
              </div>
              <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-white mt-4">
                <Button
                  onClick={() => {
                    if (showAddItem) {
                      addCustomItem()
                    } else {
                      const category = categories.find(c => c.items.some(i => i.id === editingItem.id))
                      if (category) updateItem(category.id, editingItem)
                    }
                  }}
                  className="flex-1"
                >
                  {showAddItem ? 'Add Item' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => {
                  setEditingItem(null)
                  setShowAddItem(false)
                }} className="shrink-0">
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
