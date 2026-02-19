'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  ClipboardCheck, 
  CheckCircle, 
  Circle, 
  Save,
  Plus,
  Edit,
  Trash2,
  X,
  Download,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  Sparkles,
  FileText,
  Shield,
  DollarSign,
  Users,
  Briefcase,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Clock,
  Star,
  Paperclip,
  Eye,
  Target,
  Zap
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

interface ChecklistItem {
  id: string
  text: string
  description?: string
  completed: boolean
  priority: 'critical' | 'high' | 'medium' | 'low'
  dueDate?: string
  completedDate?: string
  assignedTo?: string
  notes?: string
  attachments?: string[]
  category: string
}

interface ChecklistCategory {
  id: string
  category: string
  icon: any
  items: ChecklistItem[]
}

interface Document {
  id: string
  name: string
  category: string
  itemId?: string
  uploadDate: string
  status: 'uploaded' | 'reviewed' | 'approved' | 'rejected'
  notes?: string
}

const initialCategories: ChecklistCategory[] = [
  {
    id: 'legal',
    category: 'Legal Documents',
    icon: Shield,
    items: [
      { id: '1', text: 'Articles of Incorporation', description: 'Certificate of incorporation and corporate charter', completed: false, priority: 'critical', category: 'legal' },
      { id: '2', text: 'Bylaws', description: 'Corporate bylaws and governance documents', completed: false, priority: 'critical', category: 'legal' },
      { id: '3', text: 'Cap Table', description: 'Current capitalization table with all shareholders', completed: false, priority: 'critical', category: 'legal' },
      { id: '4', text: 'Stock Option Plans', description: 'ESOP and option plan documents', completed: false, priority: 'high', category: 'legal' },
      { id: '5', text: 'Board Resolutions', description: 'Key board resolutions and minutes', completed: false, priority: 'high', category: 'legal' },
      { id: '6', text: 'Shareholder Agreements', description: 'All shareholder and investor agreements', completed: false, priority: 'critical', category: 'legal' },
      { id: '7', text: 'Operating Agreements', description: 'LLC operating agreements if applicable', completed: false, priority: 'high', category: 'legal' },
    ],
  },
  {
    id: 'financial',
    category: 'Financial Records',
    icon: DollarSign,
    items: [
      { id: '1', text: 'Financial Statements', description: 'P&L, balance sheet, cash flow statements', completed: false, priority: 'critical', category: 'financial' },
      { id: '2', text: 'Tax Returns', description: 'Last 3 years of corporate tax returns', completed: false, priority: 'critical', category: 'financial' },
      { id: '3', text: 'Bank Statements', description: 'Recent bank statements and reconciliations', completed: false, priority: 'high', category: 'financial' },
      { id: '4', text: 'Audit Reports', description: 'Any audit reports or reviews', completed: false, priority: 'high', category: 'financial' },
      { id: '5', text: 'Budget & Forecasts', description: 'Financial projections and budgets', completed: false, priority: 'high', category: 'financial' },
      { id: '6', text: 'Debt Agreements', description: 'Loan agreements and debt instruments', completed: false, priority: 'high', category: 'financial' },
      { id: '7', text: 'Revenue Recognition', description: 'Revenue recognition policies and practices', completed: false, priority: 'medium', category: 'financial' },
    ],
  },
  {
    id: 'ip',
    category: 'IP Documentation',
    icon: FileText,
    items: [
      { id: '1', text: 'Patent Applications', description: 'All patent applications and grants', completed: false, priority: 'high', category: 'ip' },
      { id: '2', text: 'Trademark Registrations', description: 'Trademark registrations and applications', completed: false, priority: 'high', category: 'ip' },
      { id: '3', text: 'Copyrights', description: 'Copyright registrations and notices', completed: false, priority: 'medium', category: 'ip' },
      { id: '4', text: 'License Agreements', description: 'Inbound and outbound license agreements', completed: false, priority: 'high', category: 'ip' },
      { id: '5', text: 'IP Assignment Agreements', description: 'Employee and contractor IP assignments', completed: false, priority: 'critical', category: 'ip' },
      { id: '6', text: 'Trade Secrets', description: 'Trade secret documentation and policies', completed: false, priority: 'medium', category: 'ip' },
      { id: '7', text: 'Domain Names', description: 'Domain name registrations and ownership', completed: false, priority: 'medium', category: 'ip' },
    ],
  },
  {
    id: 'team',
    category: 'Team Information',
    icon: Users,
    items: [
      { id: '1', text: 'Employee Contracts', description: 'All employment agreements and contracts', completed: false, priority: 'high', category: 'team' },
      { id: '2', text: 'Advisor Agreements', description: 'Advisor and consultant agreements', completed: false, priority: 'medium', category: 'team' },
      { id: '3', text: 'Organizational Chart', description: 'Current organizational structure', completed: false, priority: 'high', category: 'team' },
      { id: '4', text: 'Key Personnel Resumes', description: 'Resumes of key team members', completed: false, priority: 'high', category: 'team' },
      { id: '5', text: 'Compensation Plans', description: 'Compensation and equity plans', completed: false, priority: 'high', category: 'team' },
      { id: '6', text: 'Non-Compete Agreements', description: 'Non-compete and non-solicit agreements', completed: false, priority: 'medium', category: 'team' },
      { id: '7', text: 'Background Checks', description: 'Background check documentation', completed: false, priority: 'low', category: 'team' },
    ],
  },
  {
    id: 'business',
    category: 'Business Operations',
    icon: Briefcase,
    items: [
      { id: '1', text: 'Business Plan', description: 'Current business plan and strategy', completed: false, priority: 'high', category: 'business' },
      { id: '2', text: 'Market Analysis', description: 'Market research and competitive analysis', completed: false, priority: 'high', category: 'business' },
      { id: '3', text: 'Customer Contracts', description: 'Key customer and client agreements', completed: false, priority: 'high', category: 'business' },
      { id: '4', text: 'Vendor Agreements', description: 'Key vendor and supplier contracts', completed: false, priority: 'medium', category: 'business' },
      { id: '5', text: 'Partnership Agreements', description: 'Strategic partnership documents', completed: false, priority: 'medium', category: 'business' },
      { id: '6', text: 'Insurance Policies', description: 'All insurance policies and coverage', completed: false, priority: 'high', category: 'business' },
      { id: '7', text: 'Regulatory Compliance', description: 'Regulatory compliance documentation', completed: false, priority: 'high', category: 'business' },
    ],
  },
  {
    id: 'product',
    category: 'Product & Technology',
    icon: Zap,
    items: [
      { id: '1', text: 'Product Roadmap', description: 'Product development roadmap', completed: false, priority: 'high', category: 'product' },
      { id: '2', text: 'Technical Documentation', description: 'Technical specifications and architecture', completed: false, priority: 'high', category: 'product' },
      { id: '3', text: 'Source Code Documentation', description: 'Code documentation and repositories', completed: false, priority: 'medium', category: 'product' },
      { id: '4', text: 'Third-Party Software', description: 'Third-party software licenses and agreements', completed: false, priority: 'high', category: 'product' },
      { id: '5', text: 'Data Privacy Policies', description: 'Privacy policies and GDPR compliance', completed: false, priority: 'high', category: 'product' },
      { id: '6', text: 'Security Documentation', description: 'Security policies and procedures', completed: false, priority: 'high', category: 'product' },
      { id: '7', text: 'API Documentation', description: 'API documentation and integrations', completed: false, priority: 'medium', category: 'product' },
    ],
  },
]

export default function DueDiligencePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [categories, setCategories] = useState<ChecklistCategory[]>(initialCategories)
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'completed' | 'pending'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null)
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItemForm, setNewItemForm] = useState({ text: '', description: '', priority: 'medium' as ChecklistItem['priority'], category: 'legal', dueDate: '', assignedTo: '' })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'checklist', label: 'Checklist', icon: ClipboardCheck },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dueDiligenceData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.categories) setCategories(data.categories)
          if (data.documents) setDocuments(data.documents)
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
        documents,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('dueDiligenceData', JSON.stringify(data))
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
            return { 
              ...item, 
              completed: newCompleted,
              completedDate: newCompleted ? new Date().toISOString() : undefined
            }
          }
          return item
        })
        return { ...category, items: updatedItems }
      }
      return category
    }))
    saveToLocalStorage()
  }

  const addItem = () => {
    if (!newItemForm.text || !newItemForm.category) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const category = categories.find(c => c.id === newItemForm.category)
    if (category) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemForm.text,
        description: newItemForm.description,
        completed: false,
        priority: newItemForm.priority,
        category: newItemForm.category,
        dueDate: newItemForm.dueDate || undefined,
        assignedTo: newItemForm.assignedTo || undefined,
      }

      const updated = categories.map(c => {
        if (c.id === newItemForm.category) {
          return { ...c, items: [...c.items, newItem] }
        }
        return c
      })

      setCategories(updated)
      setNewItemForm({ text: '', description: '', priority: 'medium', category: 'legal', dueDate: '', assignedTo: '' })
      setShowAddItem(false)
      saveToLocalStorage()
      showToast('Item added!', 'success')
    }
  }

  const deleteItem = (categoryId: string, itemId: string) => {
    const updated = categories.map(c => {
      if (c.id === categoryId) {
        return { ...c, items: c.items.filter(i => i.id !== itemId) }
      }
      return c
    })
    setCategories(updated)
    saveToLocalStorage()
    showToast('Item deleted', 'success')
  }

  const updateItem = () => {
    if (!editingItem) return

    const updated = categories.map(c => {
      if (c.id === editingItem.category) {
        return {
          ...c,
          items: c.items.map(i => i.id === editingItem.id ? editingItem : i)
        }
      }
      return c
    })

    setCategories(updated)
    setEditingItem(null)
    saveToLocalStorage()
    showToast('Item updated!', 'success')
  }

  const addDocument = (name: string, category: string, itemId?: string) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name,
      category,
      itemId,
      uploadDate: new Date().toISOString(),
      status: 'uploaded'
    }
    setDocuments([...documents, newDoc])
    saveToLocalStorage()
    showToast('Document added!', 'success')
  }

  const exportData = () => {
    const allItems = categories.flatMap(c => c.items)
    const data = {
      categories,
      documents,
      summary: {
        totalItems: allItems.length,
        completedItems: allItems.filter(i => i.completed).length,
        progress: allItems.length > 0 ? (allItems.filter(i => i.completed).length / allItems.length) * 100 : 0
      },
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `due-diligence-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  const allItems = categories.flatMap(c => c.items)
  const totalItems = allItems.length
  const completedItems = allItems.filter(item => item.completed).length
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority
    const matchesCompleted = filterCompleted === 'all' ||
      (filterCompleted === 'completed' && item.completed) ||
      (filterCompleted === 'pending' && !item.completed)
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesPriority && matchesCompleted && matchesCategory
  })

  const priorityStats = [
    { name: 'Critical', value: allItems.filter(i => i.priority === 'critical' && !i.completed).length, color: '#ef4444' },
    { name: 'High', value: allItems.filter(i => i.priority === 'high' && !i.completed).length, color: '#f59e0b' },
    { name: 'Medium', value: allItems.filter(i => i.priority === 'medium' && !i.completed).length, color: '#3b82f6' },
    { name: 'Low', value: allItems.filter(i => i.priority === 'low' && !i.completed).length, color: '#6b7280' },
  ]

  const categoryStats = categories.map(cat => ({
    name: cat.category,
    total: cat.items.length,
    completed: cat.items.filter(i => i.completed).length,
    progress: cat.items.length > 0 ? (cat.items.filter(i => i.completed).length / cat.items.length) * 100 : 0
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Due Diligence Checklist
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive checklist to prepare for investor due diligence with document tracking and progress analytics.
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Progress</div>
                <div className="text-2xl font-bold text-primary-600">{Math.round(progress)}%</div>
              </Card>
            </div>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Overall Progress</h3>
                <span className="text-lg font-bold text-primary-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-primary-500 h-4 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {completedItems} of {totalItems} items completed
              </p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Progress by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" />
                    <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Pending Items by Priority</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={priorityStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const categoryCompleted = category.items.filter(item => item.completed).length
                const categoryTotal = category.items.length
                const categoryProgress = categoryTotal > 0 ? (categoryCompleted / categoryTotal) * 100 : 0
                const Icon = category.icon

                return (
                  <Card key={category.id} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="h-5 w-5 text-primary-500" />
                      <h4 className="font-semibold">{category.category}</h4>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all" 
                        style={{ width: `${categoryProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{categoryCompleted}/{categoryTotal}</span>
                      <span className="font-medium text-primary-600">{Math.round(categoryProgress)}%</span>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Due Diligence Checklist</h2>
                </div>
                <Button onClick={() => setShowAddItem(true)} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  options={[
                    { value: 'all', label: 'All Priorities' },
                    { value: 'critical', label: 'Critical' },
                    { value: 'high', label: 'High' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'low', label: 'Low' },
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

              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardCheck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No items match your filters</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {categories.map((category) => {
                    const categoryItems = category.items.filter(item => 
                      filteredItems.some(fi => fi.id === item.id)
                    )
                    if (categoryItems.length === 0) return null

                    return (
                      <Card key={category.id} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {React.createElement(category.icon, { className: "h-5 w-5 text-primary-500" })}
                            <h3 className="font-semibold text-lg">{category.category}</h3>
                            <Badge variant="outline" className="text-xs">
                              {categoryItems.filter(i => i.completed).length}/{categoryItems.length}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {categoryItems.map((item) => {
                            const priorityColors = {
                              critical: 'bg-red-100 text-red-800',
                              high: 'bg-orange-100 text-orange-800',
                              medium: 'bg-blue-100 text-blue-800',
                              low: 'bg-gray-100 text-gray-800'
                            }

                            return (
                              <div
                                key={item.id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <button
                                  onClick={() => toggleItem(category.id, item.id)}
                                  className="mt-0.5 shrink-0"
                                >
                                  {item.completed ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-400" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                      {item.text}
                                    </span>
                                    <Badge className={`text-xs ${priorityColors[item.priority]}`}>
                                      {item.priority}
                                    </Badge>
                                    {item.dueDate && (
                                      <Badge variant="outline" className="text-xs">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(item.dueDate).toLocaleDateString()}
                                      </Badge>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                  )}
                                  {item.notes && (
                                    <p className="text-xs text-gray-500 mt-1 italic">{item.notes}</p>
                                  )}
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingItem(item)}
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
                            )
                          })}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Document Management</h2>
                </div>
                <Button
                  onClick={() => {
                    const name = prompt('Document name:')
                    if (name) {
                      const category = prompt('Category:', 'legal')
                      if (category) {
                        addDocument(name, category)
                      }
                    }
                  }}
                  size="sm"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => {
                    const statusColors = {
                      uploaded: 'bg-blue-100 text-blue-800',
                      reviewed: 'bg-yellow-100 text-yellow-800',
                      approved: 'bg-green-100 text-green-800',
                      rejected: 'bg-red-100 text-red-800'
                    }

                    return (
                      <Card key={doc.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{doc.name}</h4>
                              <Badge className={`text-xs ${statusColors[doc.status]}`}>
                                {doc.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {doc.category}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                            </div>
                            {doc.notes && (
                              <p className="text-sm text-gray-600 mt-2">{doc.notes}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Completion by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" />
                    <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Pending Items by Priority</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={priorityStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <h3 className="font-semibold mb-4">Category Progress</h3>
              <div className="space-y-4">
                {categoryStats.map((stat) => (
                  <div key={stat.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stat.name}</span>
                      <span className="text-sm text-gray-600">
                        {stat.completed}/{stat.total} ({Math.round(stat.progress)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Add Checklist Item</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAddItem(false)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Text *</label>
                  <Input
                    value={newItemForm.text}
                    onChange={(e) => setNewItemForm({ ...newItemForm, text: e.target.value })}
                    placeholder="e.g., Articles of Incorporation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={newItemForm.description}
                    onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
                    placeholder="Item description..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <Select
                      value={newItemForm.category}
                      onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                      options={categories.map(c => ({ value: c.id, label: c.category }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <Select
                      value={newItemForm.priority}
                      onChange={(e) => setNewItemForm({ ...newItemForm, priority: e.target.value as any })}
                      options={[
                        { value: 'critical', label: 'Critical' },
                        { value: 'high', label: 'High' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'low', label: 'Low' },
                      ]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <Input
                      type="date"
                      value={newItemForm.dueDate}
                      onChange={(e) => setNewItemForm({ ...newItemForm, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                    <Input
                      value={newItemForm.assignedTo}
                      onChange={(e) => setNewItemForm({ ...newItemForm, assignedTo: e.target.value })}
                      placeholder="Team member name"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addItem} className="flex-1">
                    Add Item
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddItem(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Edit Checklist Item</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Text *</label>
                  <Input
                    value={editingItem.text}
                    onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <Select
                      value={editingItem.priority}
                      onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value as any })}
                      options={[
                        { value: 'critical', label: 'Critical' },
                        { value: 'high', label: 'High' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'low', label: 'Low' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <Input
                      type="date"
                      value={editingItem.dueDate || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingItem.notes || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={updateItem} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditingItem(null)}>
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
