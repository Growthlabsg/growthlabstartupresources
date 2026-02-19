'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Users, 
  Plus, 
  UserPlus,
  Edit,
  Trash2,
  X,
  Save,
  Download,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Activity,
  BarChart3,
  PieChart,
  Target,
  MessageSquare,
  Star,
  Eye,
  FileText,
  Award,
  TrendingUp,
  Zap,
  BookOpen,
  Link as LinkIcon
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

interface Advisor {
  id: string
  name: string
  role: string
  expertise: string[]
  equity: string
  compensation?: string
  company?: string
  title?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  website?: string
  bio?: string
  status: 'active' | 'inactive' | 'prospective' | 'former'
  startDate?: string
  endDate?: string
  engagementLevel: 'high' | 'medium' | 'low'
  valueRating: number
  categories: string[]
  notes?: string
}

interface Engagement {
  id: string
  advisorId: string
  date: string
  type: 'meeting' | 'email' | 'call' | 'consultation' | 'other'
  topic: string
  duration?: number
  notes?: string
  value?: string
}

interface Agreement {
  id: string
  advisorId: string
  type: 'equity' | 'cash' | 'hybrid' | 'unpaid'
  equityAmount?: string
  cashAmount?: string
  vestingSchedule?: string
  term?: string
  startDate: string
  endDate?: string
  status: 'draft' | 'active' | 'expired' | 'terminated'
  notes?: string
}

interface Recommendation {
  id: string
  name: string
  expertise: string[]
  reason: string
  matchScore: number
  source?: string
}

export default function AdvisoryBoardBuilderPage() {
  const [activeTab, setActiveTab] = useState('advisors')
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null)
  const [editingEngagement, setEditingEngagement] = useState<Engagement | null>(null)
  const [editingAgreement, setEditingAgreement] = useState<Agreement | null>(null)
  const [showAddAdvisor, setShowAddAdvisor] = useState(false)
  const [showAddEngagement, setShowAddEngagement] = useState(false)
  const [showAddAgreement, setShowAddAgreement] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | Advisor['status']>('all')
  const [filterExpertise, setFilterExpertise] = useState<string>('all')
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null)

  const tabs = [
    { id: 'advisors', label: 'Advisors', icon: Users },
    { id: 'recommendations', label: 'Recommendations', icon: Target },
    { id: 'engagements', label: 'Engagements', icon: MessageSquare },
    { id: 'agreements', label: 'Agreements', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const expertiseCategories = [
    'Go-to-Market',
    'Product Development',
    'Technology',
    'Sales',
    'Marketing',
    'Finance',
    'Legal',
    'Operations',
    'HR',
    'International Expansion',
    'Fundraising',
    'Strategic Planning'
  ]

  const advisorFormData = {
    name: '',
    role: '',
    expertise: [] as string[],
    equity: '',
    compensation: '',
    company: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    bio: '',
    status: 'prospective' as Advisor['status'],
    startDate: '',
    engagementLevel: 'medium' as Advisor['engagementLevel'],
    valueRating: 0,
    categories: [] as string[],
    notes: ''
  }

  const [newAdvisorForm, setNewAdvisorForm] = useState(advisorFormData)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('advisoryBoardBuilderData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.advisors) setAdvisors(data.advisors)
          if (data.engagements) setEngagements(data.engagements)
          if (data.agreements) setAgreements(data.agreements)
          if (data.recommendations) setRecommendations(data.recommendations)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        advisors,
        engagements,
        agreements,
        recommendations,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('advisoryBoardBuilderData', JSON.stringify(data))
    }
  }

  const addAdvisor = () => {
    if (!newAdvisorForm.name || !newAdvisorForm.role) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const newAdvisor: Advisor = {
      id: Date.now().toString(),
      name: newAdvisorForm.name,
      role: newAdvisorForm.role,
      expertise: newAdvisorForm.expertise,
      equity: newAdvisorForm.equity || '0%',
      compensation: newAdvisorForm.compensation || undefined,
      company: newAdvisorForm.company || undefined,
      title: newAdvisorForm.title || undefined,
      email: newAdvisorForm.email || undefined,
      phone: newAdvisorForm.phone || undefined,
      location: newAdvisorForm.location || undefined,
      linkedin: newAdvisorForm.linkedin || undefined,
      website: newAdvisorForm.website || undefined,
      bio: newAdvisorForm.bio || undefined,
      status: newAdvisorForm.status,
      startDate: newAdvisorForm.startDate || undefined,
      engagementLevel: newAdvisorForm.engagementLevel,
      valueRating: newAdvisorForm.valueRating || 0,
      categories: newAdvisorForm.categories,
      notes: newAdvisorForm.notes || undefined
    }

    setAdvisors([...advisors, newAdvisor])
    setNewAdvisorForm(advisorFormData)
    setShowAddAdvisor(false)
    saveToLocalStorage()
    showToast('Advisor added!', 'success')
  }

  const updateAdvisor = () => {
    if (!editingAdvisor) return

    const updated = advisors.map(a => a.id === editingAdvisor.id ? editingAdvisor : a)
    setAdvisors(updated)
    setEditingAdvisor(null)
    saveToLocalStorage()
    showToast('Advisor updated!', 'success')
  }

  const deleteAdvisor = (id: string) => {
    setAdvisors(advisors.filter(a => a.id !== id))
    setEngagements(engagements.filter(e => e.advisorId !== id))
    setAgreements(agreements.filter(a => a.advisorId !== id))
    saveToLocalStorage()
    showToast('Advisor deleted', 'success')
  }

  const addEngagement = (advisorId: string) => {
    const newEngagement: Engagement = {
      id: Date.now().toString(),
      advisorId,
      date: new Date().toISOString().split('T')[0],
      type: 'meeting',
      topic: '',
      duration: 0
    }
    setEditingEngagement(newEngagement)
    setShowAddEngagement(true)
  }

  const saveEngagement = () => {
    if (!editingEngagement || !editingEngagement.topic) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const existing = engagements.find(e => e.id === editingEngagement.id)
    if (existing) {
      setEngagements(engagements.map(e => e.id === editingEngagement.id ? editingEngagement : e))
      showToast('Engagement updated!', 'success')
    } else {
      setEngagements([...engagements, editingEngagement])
      showToast('Engagement added!', 'success')
    }

    setEditingEngagement(null)
    setShowAddEngagement(false)
    saveToLocalStorage()
  }

  const addAgreement = (advisorId: string) => {
    const newAgreement: Agreement = {
      id: Date.now().toString(),
      advisorId,
      type: 'equity',
      startDate: new Date().toISOString().split('T')[0],
      status: 'draft'
    }
    setEditingAgreement(newAgreement)
    setShowAddAgreement(true)
  }

  const saveAgreement = () => {
    if (!editingAgreement) return

    const existing = agreements.find(a => a.id === editingAgreement.id)
    if (existing) {
      setAgreements(agreements.map(a => a.id === editingAgreement.id ? editingAgreement : a))
      showToast('Agreement updated!', 'success')
    } else {
      setAgreements([...agreements, editingAgreement])
      showToast('Agreement added!', 'success')
    }

    setEditingAgreement(null)
    setShowAddAgreement(false)
    saveToLocalStorage()
  }

  const generateRecommendations = () => {
    const newRecommendations: Recommendation[] = [
  {
    id: '1',
        name: 'Sarah Johnson',
        expertise: ['Go-to-Market', 'Sales'],
        reason: 'Strong background in B2B sales and market expansion',
        matchScore: 95,
        source: 'LinkedIn'
  },
  {
    id: '2',
        name: 'Michael Chen',
        expertise: ['Product Development', 'Technology'],
        reason: 'Expert in SaaS product development and scaling',
        matchScore: 88,
        source: 'Referral'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        expertise: ['Finance', 'Fundraising'],
        reason: 'Former CFO with extensive fundraising experience',
        matchScore: 92,
        source: 'Network'
      }
    ]
    setRecommendations(newRecommendations)
    showToast('Recommendations generated!', 'success')
  }

  const exportData = () => {
    const data = {
      advisors,
      engagements,
      agreements,
      recommendations,
      summary: {
        totalAdvisors: advisors.length,
        activeAdvisors: advisors.filter(a => a.status === 'active').length,
        totalEngagements: engagements.length,
        totalAgreements: agreements.length
      },
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `advisory-board-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  const filteredAdvisors = advisors.filter(advisor => {
    const matchesSearch = 
      advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      advisor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      advisor.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      advisor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || advisor.status === filterStatus
    const matchesExpertise = filterExpertise === 'all' || advisor.expertise.includes(filterExpertise)
    return matchesSearch && matchesStatus && matchesExpertise
  })

  const statusStats = [
    { name: 'Active', value: advisors.filter(a => a.status === 'active').length, color: '#10b981' },
    { name: 'Prospective', value: advisors.filter(a => a.status === 'prospective').length, color: '#3b82f6' },
    { name: 'Inactive', value: advisors.filter(a => a.status === 'inactive').length, color: '#6b7280' },
    { name: 'Former', value: advisors.filter(a => a.status === 'former').length, color: '#ef4444' },
  ]

  const engagementStats = engagements.reduce((acc, eng) => {
    acc[eng.type] = (acc[eng.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const engagementData = Object.entries(engagementStats).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            Advisory Board Builder
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build and manage your advisory board with role definitions, compensation tracking, and engagement analytics.
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

        {/* Advisors Tab */}
        {activeTab === 'advisors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Advisors</div>
                <div className="text-2xl font-bold">{advisors.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Active</div>
                <div className="text-2xl font-bold text-green-600">
                  {advisors.filter(a => a.status === 'active').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Prospective</div>
                <div className="text-2xl font-bold text-blue-600">
                  {advisors.filter(a => a.status === 'prospective').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Engagements</div>
                <div className="text-2xl font-bold text-orange-600">{engagements.length}</div>
              </Card>
            </div>

            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Advisory Board</h2>
                </div>
                <Button onClick={() => setShowAddAdvisor(true)} size="sm" className="shrink-0">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Advisor
          </Button>
        </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Input
                    placeholder="Search advisors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'active', label: 'Active' },
                    { value: 'prospective', label: 'Prospective' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'former', label: 'Former' },
                  ]}
                />
                <Select
                  value={filterExpertise}
                  onChange={(e) => setFilterExpertise(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Expertise' },
                    ...expertiseCategories.map(cat => ({ value: cat, label: cat }))
                  ]}
                />
              </div>

              {filteredAdvisors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Advisors Yet</h3>
                  <p className="text-gray-600 mb-6">Start building your advisory board</p>
                  <Button onClick={() => setShowAddAdvisor(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Advisor
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAdvisors.map((advisor) => {
                    const statusColors = {
                      active: 'bg-green-100 text-green-800',
                      prospective: 'bg-blue-100 text-blue-800',
                      inactive: 'bg-gray-100 text-gray-800',
                      former: 'bg-red-100 text-red-800'
                    }

                    const engagementColors = {
                      high: 'bg-green-100 text-green-800',
                      medium: 'bg-yellow-100 text-yellow-800',
                      low: 'bg-gray-100 text-gray-800'
                    }

                    return (
                      <Card key={advisor.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold">{advisor.name}</h3>
                              <Badge className={`text-xs ${statusColors[advisor.status]}`}>
                                {advisor.status}
                              </Badge>
                              <Badge className={`text-xs ${engagementColors[advisor.engagementLevel]}`}>
                                {advisor.engagementLevel}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{advisor.role}</p>
                            {advisor.company && (
                              <p className="text-xs text-gray-500 mb-2">{advisor.company}</p>
                            )}
                            <div className="space-y-1 mb-3">
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Expertise:</span> {advisor.expertise.join(', ')}
                              </div>
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Equity:</span> {advisor.equity}
                              </div>
                              {advisor.compensation && (
                                <div className="text-xs text-gray-600">
                                  <span className="font-medium">Compensation:</span> {advisor.compensation}
                                </div>
                              )}
                              {advisor.valueRating > 0 && (
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${
                                        star <= advisor.valueRating
                                          ? 'text-yellow-500 fill-yellow-500'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingAdvisor(advisor)
                                setSelectedAdvisor(advisor)
                              }}
                              className="shrink-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAdvisor(advisor.id)}
                              className="shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addEngagement(advisor.id)}
                            className="flex-1 text-xs"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Engagement
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addAgreement(advisor.id)}
                            className="flex-1 text-xs"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Agreement
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

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Advisor Recommendations</h2>
                </div>
                <Button onClick={generateRecommendations} size="sm" className="shrink-0">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Recommendations
                </Button>
              </div>

              {recommendations.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-6">Generate recommendations based on your needs</p>
                  <Button onClick={generateRecommendations}>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Recommendations
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{rec.name}</h3>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {rec.matchScore}% Match
                            </Badge>
                            {rec.source && (
                              <Badge variant="outline" className="text-xs">
                                {rec.source}
                              </Badge>
                            )}
                          </div>
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Expertise:</p>
                            <div className="flex flex-wrap gap-1">
                              {rec.expertise.map((exp, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {exp}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{rec.reason}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setNewAdvisorForm({
                              ...advisorFormData,
                              name: rec.name,
                              expertise: rec.expertise,
                              status: 'prospective'
                            })
                            setShowAddAdvisor(true)
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add to Board
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Engagements Tab */}
        {activeTab === 'engagements' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Engagement Tracking</h2>
              </div>

              {engagements.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No engagements tracked yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {engagements
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((engagement) => {
                      const advisor = advisors.find(a => a.id === engagement.advisorId)
                      const typeIcons = {
                        meeting: Calendar,
                        email: Mail,
                        call: Phone,
                        consultation: Briefcase,
                        other: MessageSquare
                      }
                      const Icon = typeIcons[engagement.type]

                      return (
                        <Card key={engagement.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Icon className="h-5 w-5 text-primary-500" />
                                <h4 className="font-semibold">{advisor?.name || 'Unknown Advisor'}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {engagement.type}
                                </Badge>
                                <span className="text-xs text-gray-600">
                                  {new Date(engagement.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm font-medium mb-1">{engagement.topic}</p>
                              {engagement.duration && (
                                <p className="text-xs text-gray-600 mb-2">
                                  Duration: {engagement.duration} minutes
                                </p>
                              )}
                              {engagement.notes && (
                                <p className="text-sm text-gray-600">{engagement.notes}</p>
                              )}
                              {engagement.value && (
                                <div className="mt-2 p-2 bg-green-50 rounded">
                                  <p className="text-xs font-medium text-green-900">Value:</p>
                                  <p className="text-sm text-green-800">{engagement.value}</p>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingEngagement(engagement)
                                setShowAddEngagement(true)
                              }}
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

        {/* Agreements Tab */}
        {activeTab === 'agreements' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Advisor Agreements</h2>
              </div>

              {agreements.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No agreements recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agreements.map((agreement) => {
                    const advisor = advisors.find(a => a.id === agreement.advisorId)
                    const statusColors = {
                      draft: 'bg-gray-100 text-gray-800',
                      active: 'bg-green-100 text-green-800',
                      expired: 'bg-red-100 text-red-800',
                      terminated: 'bg-red-100 text-red-800'
                    }

                    return (
                      <Card key={agreement.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{advisor?.name || 'Unknown Advisor'}</h4>
                              <Badge className={`text-xs ${statusColors[agreement.status]}`}>
                                {agreement.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {agreement.type}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                              {agreement.equityAmount && (
                                <div>
                                  <span className="font-medium">Equity:</span> {agreement.equityAmount}
                                </div>
                              )}
                              {agreement.cashAmount && (
                                <div>
                                  <span className="font-medium">Cash:</span> {agreement.cashAmount}
                                </div>
                              )}
                              <div>
                                <span className="font-medium">Start:</span> {new Date(agreement.startDate).toLocaleDateString()}
                              </div>
                              {agreement.endDate && (
                                <div>
                                  <span className="font-medium">End:</span> {new Date(agreement.endDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            {agreement.vestingSchedule && (
                              <p className="text-xs text-gray-600 mb-2">
                                Vesting: {agreement.vestingSchedule}
                              </p>
                            )}
                            {agreement.notes && (
                              <p className="text-sm text-gray-600">{agreement.notes}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingAgreement(agreement)
                              setShowAddAgreement(true)
                            }}
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Advisor Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={statusStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Engagement Types</h3>
                {engagementData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-400">
                    No engagement data yet
                  </div>
                )}
              </Card>
            </div>

            <Card>
              <h3 className="font-semibold mb-4">Expertise Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {expertiseCategories.map((category) => {
                  const count = advisors.filter(a => a.expertise.includes(category)).length
                  if (count === 0) return null
                  return (
                    <div key={category} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">{category}</div>
                      <div className="text-2xl font-bold text-primary-600">{count}</div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Add/Edit Advisor Modal */}
        {(showAddAdvisor || editingAdvisor) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-3xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {editingAdvisor ? 'Edit Advisor' : 'Add Advisor'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowAddAdvisor(false)
                  setEditingAdvisor(null)
                  setNewAdvisorForm(advisorFormData)
                }} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <Input
                      value={editingAdvisor?.name || newAdvisorForm.name}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, name: e.target.value })
                        : setNewAdvisorForm({ ...newAdvisorForm, name: e.target.value })
                      }
                      placeholder="Advisor name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                    <Input
                      value={editingAdvisor?.role || newAdvisorForm.role}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, role: e.target.value })
                        : setNewAdvisorForm({ ...newAdvisorForm, role: e.target.value })
                      }
                      placeholder="e.g., Strategic Advisor"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <Input
                      value={editingAdvisor?.company || newAdvisorForm.company}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, company: e.target.value })
                        : setNewAdvisorForm({ ...newAdvisorForm, company: e.target.value })
                      }
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <Input
                      value={editingAdvisor?.title || newAdvisorForm.title}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, title: e.target.value })
                        : setNewAdvisorForm({ ...newAdvisorForm, title: e.target.value })
                      }
                      placeholder="Job title"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expertise (select multiple)</label>
                  <div className="flex flex-wrap gap-2">
                    {expertiseCategories.map((category) => {
                      const selected = editingAdvisor
                        ? editingAdvisor.expertise.includes(category)
                        : newAdvisorForm.expertise.includes(category)
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            if (editingAdvisor) {
                              const updated = editingAdvisor.expertise.includes(category)
                                ? editingAdvisor.expertise.filter(e => e !== category)
                                : [...editingAdvisor.expertise, category]
                              setEditingAdvisor({ ...editingAdvisor, expertise: updated })
                            } else {
                              const updated = newAdvisorForm.expertise.includes(category)
                                ? newAdvisorForm.expertise.filter(e => e !== category)
                                : [...newAdvisorForm.expertise, category]
                              setNewAdvisorForm({ ...newAdvisorForm, expertise: updated })
                            }
                          }}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            selected
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equity</label>
                    <Input
                      value={editingAdvisor?.equity || newAdvisorForm.equity}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, equity: e.target.value })
                        : setNewAdvisorForm({ ...newAdvisorForm, equity: e.target.value })
                      }
                      placeholder="0.5%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Compensation</label>
                    <Input
                      value={editingAdvisor?.compensation || newAdvisorForm.compensation}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, compensation: e.target.value })
                        : setNewAdvisorForm({ ...newAdvisorForm, compensation: e.target.value })
                      }
                      placeholder="$X/month or $X/hour"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={editingAdvisor?.email || newAdvisorForm.email}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, email: e.target.value })
                        : setNewAdvisorForm({ ...newAdvisorForm, email: e.target.value })
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input
                      type="tel"
                      value={editingAdvisor?.phone || newAdvisorForm.phone}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, phone: e.target.value })
                        : setNewAdvisorForm({ ...newAdvisorForm, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input
                      value={editingAdvisor?.location || newAdvisorForm.location}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, location: e.target.value })
                        : setNewAdvisorForm({ ...newAdvisorForm, location: e.target.value })
                      }
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <Input
                      value={editingAdvisor?.linkedin || newAdvisorForm.linkedin}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, linkedin: e.target.value })
                        : setNewAdvisorForm({ ...newAdvisorForm, linkedin: e.target.value })
                      }
                      placeholder="LinkedIn URL"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select
                      value={editingAdvisor?.status || newAdvisorForm.status}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, status: e.target.value as Advisor['status'] })
                        : setNewAdvisorForm({ ...newAdvisorForm, status: e.target.value as Advisor['status'] })
                      }
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'prospective', label: 'Prospective' },
                        { value: 'inactive', label: 'Inactive' },
                        { value: 'former', label: 'Former' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Engagement Level</label>
                    <Select
                      value={editingAdvisor?.engagementLevel || newAdvisorForm.engagementLevel}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, engagementLevel: e.target.value as Advisor['engagementLevel'] })
                        : setNewAdvisorForm({ ...newAdvisorForm, engagementLevel: e.target.value as Advisor['engagementLevel'] })
                      }
                      options={[
                        { value: 'high', label: 'High' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'low', label: 'Low' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value Rating (1-5)</label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={editingAdvisor?.valueRating || newAdvisorForm.valueRating}
                      onChange={(e) => editingAdvisor
                        ? setEditingAdvisor({ ...editingAdvisor, valueRating: parseInt(e.target.value) || 0 })
                        : setNewAdvisorForm({ ...newAdvisorForm, valueRating: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={4}
                    value={editingAdvisor?.bio || newAdvisorForm.bio}
                    onChange={(e) => editingAdvisor
                      ? setEditingAdvisor({ ...editingAdvisor, bio: e.target.value })
                      : setNewAdvisorForm({ ...newAdvisorForm, bio: e.target.value })
                    }
                    placeholder="Advisor bio and background..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingAdvisor?.notes || newAdvisorForm.notes}
                    onChange={(e) => editingAdvisor
                      ? setEditingAdvisor({ ...editingAdvisor, notes: e.target.value })
                      : setNewAdvisorForm({ ...newAdvisorForm, notes: e.target.value })
                    }
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={editingAdvisor ? updateAdvisor : addAdvisor} 
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingAdvisor ? 'Update Advisor' : 'Add Advisor'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddAdvisor(false)
                    setEditingAdvisor(null)
                    setNewAdvisorForm(advisorFormData)
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add/Edit Engagement Modal */}
        {showAddEngagement && editingEngagement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Engagement</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowAddEngagement(false)
                  setEditingEngagement(null)
                }} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advisor</label>
                  <Select
                    value={editingEngagement.advisorId}
                    onChange={(e) => setEditingEngagement({ ...editingEngagement, advisorId: e.target.value })}
                    options={[
                      { value: '', label: 'Select advisor...' },
                      ...advisors.map(a => ({ value: a.id, label: a.name }))
                    ]}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Input
                      type="date"
                      value={editingEngagement.date}
                      onChange={(e) => setEditingEngagement({ ...editingEngagement, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Select
                      value={editingEngagement.type}
                      onChange={(e) => setEditingEngagement({ ...editingEngagement, type: e.target.value as Engagement['type'] })}
                      options={[
                        { value: 'meeting', label: 'Meeting' },
                        { value: 'email', label: 'Email' },
                        { value: 'call', label: 'Call' },
                        { value: 'consultation', label: 'Consultation' },
                        { value: 'other', label: 'Other' },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
                  <Input
                    value={editingEngagement.topic}
                    onChange={(e) => setEditingEngagement({ ...editingEngagement, topic: e.target.value })}
                    placeholder="Engagement topic"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={editingEngagement.duration || ''}
                      onChange={(e) => setEditingEngagement({ ...editingEngagement, duration: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                    <Input
                      value={editingEngagement.value || ''}
                      onChange={(e) => setEditingEngagement({ ...editingEngagement, value: e.target.value })}
                      placeholder="Value delivered"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={4}
                    value={editingEngagement.notes || ''}
                    onChange={(e) => setEditingEngagement({ ...editingEngagement, notes: e.target.value })}
                    placeholder="Engagement notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveEngagement} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Engagement
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddEngagement(false)
                    setEditingEngagement(null)
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add/Edit Agreement Modal */}
        {showAddAgreement && editingAgreement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Advisor Agreement</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowAddAgreement(false)
                  setEditingAgreement(null)
                }} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advisor</label>
                  <Select
                    value={editingAgreement.advisorId}
                    onChange={(e) => setEditingAgreement({ ...editingAgreement, advisorId: e.target.value })}
                    options={[
                      { value: '', label: 'Select advisor...' },
                      ...advisors.map(a => ({ value: a.id, label: a.name }))
                    ]}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Select
                      value={editingAgreement.type}
                      onChange={(e) => setEditingAgreement({ ...editingAgreement, type: e.target.value as Agreement['type'] })}
                      options={[
                        { value: 'equity', label: 'Equity' },
                        { value: 'cash', label: 'Cash' },
                        { value: 'hybrid', label: 'Hybrid' },
                        { value: 'unpaid', label: 'Unpaid' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select
                      value={editingAgreement.status}
                      onChange={(e) => setEditingAgreement({ ...editingAgreement, status: e.target.value as Agreement['status'] })}
                      options={[
                        { value: 'draft', label: 'Draft' },
                        { value: 'active', label: 'Active' },
                        { value: 'expired', label: 'Expired' },
                        { value: 'terminated', label: 'Terminated' },
                      ]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equity Amount</label>
                    <Input
                      value={editingAgreement.equityAmount || ''}
                      onChange={(e) => setEditingAgreement({ ...editingAgreement, equityAmount: e.target.value })}
                      placeholder="0.5%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cash Amount</label>
                    <Input
                      value={editingAgreement.cashAmount || ''}
                      onChange={(e) => setEditingAgreement({ ...editingAgreement, cashAmount: e.target.value })}
                      placeholder="$X/month"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <Input
                      type="date"
                      value={editingAgreement.startDate}
                      onChange={(e) => setEditingAgreement({ ...editingAgreement, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <Input
                      type="date"
                      value={editingAgreement.endDate || ''}
                      onChange={(e) => setEditingAgreement({ ...editingAgreement, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vesting Schedule</label>
                  <Input
                    value={editingAgreement.vestingSchedule || ''}
                    onChange={(e) => setEditingAgreement({ ...editingAgreement, vestingSchedule: e.target.value })}
                    placeholder="e.g., 4 years, 1 year cliff"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
                  <Input
                    value={editingAgreement.term || ''}
                    onChange={(e) => setEditingAgreement({ ...editingAgreement, term: e.target.value })}
                    placeholder="e.g., 12 months"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingAgreement.notes || ''}
                    onChange={(e) => setEditingAgreement({ ...editingAgreement, notes: e.target.value })}
                    placeholder="Agreement notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveAgreement} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Agreement
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddAgreement(false)
                    setEditingAgreement(null)
                  }}>
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
