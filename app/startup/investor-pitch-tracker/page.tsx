'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Briefcase, 
  Plus, 
  Calendar, 
  TrendingUp,
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
  DollarSign,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Activity,
  BarChart3,
  PieChart,
  Target,
  MessageSquare,
  Paperclip,
  Star,
  Eye,
  ArrowRight,
  Building2,
  Zap
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts'

interface Pitch {
  id: string
  investorName: string
  investorType: 'VC' | 'Angel' | 'Corporate' | 'Accelerator' | 'Government' | 'Other'
  firmName?: string
  contactName?: string
  email?: string
  phone?: string
  location?: string
  date: string
  time?: string
  status: 'scheduled' | 'completed' | 'follow-up' | 'declined' | 'funded'
  stage: 'initial' | 'first-meeting' | 'second-meeting' | 'due-diligence' | 'term-sheet' | 'closed'
  amount: string
  equity?: string
  valuation?: string
  notes?: string
  feedback?: string
  outcome?: 'positive' | 'neutral' | 'negative' | 'pending'
  nextSteps?: string
  followUpDate?: string
  attachments?: string[]
  rating?: number
}

interface Investor {
  id: string
  name: string
  firmName?: string
  type: 'VC' | 'Angel' | 'Corporate' | 'Accelerator' | 'Government' | 'Other'
  email?: string
  phone?: string
  location?: string
  website?: string
  focus: string[]
  stage: string[]
  avgCheckSize: string
  portfolio: number
  industries: string[]
  description?: string
  notes?: string
  relationshipStatus: 'cold' | 'warm' | 'hot' | 'invested'
  lastContact?: string
  totalPitches: number
  successfulPitches: number
}

interface Communication {
  id: string
  pitchId: string
  type: 'email' | 'call' | 'meeting' | 'note'
  date: string
  subject?: string
  content: string
  direction: 'outbound' | 'inbound'
  attachments?: string[]
}

export default function InvestorPitchTrackerPage() {
  const [activeTab, setActiveTab] = useState('pitches')
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [investors, setInvestors] = useState<Investor[]>([])
  const [communications, setCommunications] = useState<Communication[]>([])
  const [editingPitch, setEditingPitch] = useState<Pitch | null>(null)
  const [editingInvestor, setEditingInvestor] = useState<Investor | null>(null)
  const [showAddPitch, setShowAddPitch] = useState(false)
  const [showAddInvestor, setShowAddInvestor] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | Pitch['status']>('all')
  const [filterStage, setFilterStage] = useState<'all' | Pitch['stage']>('all')
  const [filterType, setFilterType] = useState<'all' | Investor['type']>('all')

  const tabs = [
    { id: 'pitches', label: 'Pitches', icon: Briefcase },
    { id: 'investors', label: 'Investors', icon: Users },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'pipeline', label: 'Pipeline', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const pitchFormData = {
    investorName: '',
    investorType: 'VC' as Investor['type'],
    firmName: '',
    contactName: '',
    email: '',
    phone: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    status: 'scheduled' as Pitch['status'],
    stage: 'initial' as Pitch['stage'],
    amount: '',
    equity: '',
    valuation: '',
    notes: '',
    feedback: '',
    outcome: 'pending' as Pitch['outcome'],
    nextSteps: '',
    followUpDate: '',
    rating: 0
  }

  const [newPitchForm, setNewPitchForm] = useState(pitchFormData)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('investorPitchTrackerData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.pitches) setPitches(data.pitches)
          if (data.investors) setInvestors(data.investors)
          if (data.communications) setCommunications(data.communications)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        pitches,
        investors,
        communications,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('investorPitchTrackerData', JSON.stringify(data))
    }
  }

  const addPitch = () => {
    if (!newPitchForm.investorName || !newPitchForm.date) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const newPitch: Pitch = {
      id: Date.now().toString(),
      investorName: newPitchForm.investorName,
      investorType: newPitchForm.investorType,
      firmName: newPitchForm.firmName || undefined,
      contactName: newPitchForm.contactName || undefined,
      email: newPitchForm.email || undefined,
      phone: newPitchForm.phone || undefined,
      location: newPitchForm.location || undefined,
      date: newPitchForm.date,
      time: newPitchForm.time || undefined,
      status: newPitchForm.status,
      stage: newPitchForm.stage,
      amount: newPitchForm.amount || '',
      equity: newPitchForm.equity || undefined,
      valuation: newPitchForm.valuation || undefined,
      notes: newPitchForm.notes || undefined,
      feedback: newPitchForm.feedback || undefined,
      outcome: newPitchForm.outcome,
      nextSteps: newPitchForm.nextSteps || undefined,
      followUpDate: newPitchForm.followUpDate || undefined,
      rating: newPitchForm.rating || undefined
    }

    setPitches([...pitches, newPitch])
    setNewPitchForm(pitchFormData)
    setShowAddPitch(false)
    saveToLocalStorage()
    showToast('Pitch added!', 'success')
  }

  const updatePitch = () => {
    if (!editingPitch) return

    const updated = pitches.map(p => p.id === editingPitch.id ? editingPitch : p)
    setPitches(updated)
    setEditingPitch(null)
    saveToLocalStorage()
    showToast('Pitch updated!', 'success')
  }

  const deletePitch = (id: string) => {
    setPitches(pitches.filter(p => p.id !== id))
    setCommunications(communications.filter(c => c.pitchId !== id))
    saveToLocalStorage()
    showToast('Pitch deleted', 'success')
  }

  const addInvestor = () => {
    const newInvestor: Investor = {
      id: Date.now().toString(),
      name: '',
      type: 'VC',
      focus: [],
      stage: [],
      avgCheckSize: '',
      portfolio: 0,
      industries: [],
      relationshipStatus: 'cold',
      totalPitches: 0,
      successfulPitches: 0
    }
    setEditingInvestor(newInvestor)
    setShowAddInvestor(true)
  }

  const saveInvestor = () => {
    if (!editingInvestor || !editingInvestor.name) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const existing = investors.find(i => i.id === editingInvestor.id)
    if (existing) {
      setInvestors(investors.map(i => i.id === editingInvestor.id ? editingInvestor : i))
      showToast('Investor updated!', 'success')
    } else {
      setInvestors([...investors, editingInvestor])
      showToast('Investor added!', 'success')
    }
    setEditingInvestor(null)
    setShowAddInvestor(false)
    saveToLocalStorage()
  }

  const addCommunication = (pitchId: string, type: Communication['type'], content: string) => {
    const newComm: Communication = {
      id: Date.now().toString(),
      pitchId,
      type,
      date: new Date().toISOString(),
      content,
      direction: 'outbound'
    }
    setCommunications([...communications, newComm])
    saveToLocalStorage()
    showToast('Communication added!', 'success')
  }

  const exportData = () => {
    const data = {
      pitches,
      investors,
      communications,
      summary: {
        totalPitches: pitches.length,
        scheduled: pitches.filter(p => p.status === 'scheduled').length,
        completed: pitches.filter(p => p.status === 'completed').length,
        funded: pitches.filter(p => p.status === 'funded').length
      },
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `investor-pitch-tracker-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  const filteredPitches = pitches.filter(pitch => {
    const matchesSearch = 
      pitch.investorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pitch.firmName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pitch.contactName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || pitch.status === filterStatus
    const matchesStage = filterStage === 'all' || pitch.stage === filterStage
    return matchesSearch && matchesStatus && matchesStage
  })

  const statusStats = [
    { name: 'Scheduled', value: pitches.filter(p => p.status === 'scheduled').length, color: '#3b82f6' },
    { name: 'Completed', value: pitches.filter(p => p.status === 'completed').length, color: '#10b981' },
    { name: 'Follow-up', value: pitches.filter(p => p.status === 'follow-up').length, color: '#f59e0b' },
    { name: 'Funded', value: pitches.filter(p => p.status === 'funded').length, color: '#8b5cf6' },
    { name: 'Declined', value: pitches.filter(p => p.status === 'declined').length, color: '#ef4444' },
  ]

  const stageStats = pitches.map(p => p.stage).reduce((acc, stage) => {
    acc[stage] = (acc[stage] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const stageData = Object.entries(stageStats).map(([name, value]) => ({
    name: name.replace('-', ' '),
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
                Investor Pitch Tracker
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your investor meetings, follow-ups, funding progress, and manage investor relationships.
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

        {/* Pitches Tab */}
        {activeTab === 'pitches' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Pitches</div>
                <div className="text-2xl font-bold">{pitches.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Scheduled</div>
                <div className="text-2xl font-bold text-blue-600">
                  {pitches.filter(p => p.status === 'scheduled').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Completed</div>
                <div className="text-2xl font-bold text-green-600">
                  {pitches.filter(p => p.status === 'completed').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Follow-up</div>
                <div className="text-2xl font-bold text-orange-600">
                  {pitches.filter(p => p.status === 'follow-up').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Funded</div>
                <div className="text-2xl font-bold text-purple-600">
                  {pitches.filter(p => p.status === 'funded').length}
                </div>
              </Card>
            </div>

            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Pitch Meetings</h2>
                </div>
                <Button onClick={() => setShowAddPitch(true)} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pitch
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Input
                    placeholder="Search pitches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  options={[
                    { value: 'all', label: 'All Statuses' },
                    { value: 'scheduled', label: 'Scheduled' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'follow-up', label: 'Follow-up' },
                    { value: 'declined', label: 'Declined' },
                    { value: 'funded', label: 'Funded' },
                  ]}
                />
                <Select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value as any)}
                  options={[
                    { value: 'all', label: 'All Stages' },
                    { value: 'initial', label: 'Initial' },
                    { value: 'first-meeting', label: 'First Meeting' },
                    { value: 'second-meeting', label: 'Second Meeting' },
                    { value: 'due-diligence', label: 'Due Diligence' },
                    { value: 'term-sheet', label: 'Term Sheet' },
                    { value: 'closed', label: 'Closed' },
                  ]}
                />
              </div>

              {filteredPitches.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Pitches Yet</h3>
                  <p className="text-gray-600 mb-6">Start tracking your investor pitches</p>
                  <Button onClick={() => setShowAddPitch(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Pitch
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPitches
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((pitch) => {
                      const statusColors = {
                        scheduled: 'bg-blue-100 text-blue-800',
                        completed: 'bg-green-100 text-green-800',
                        'follow-up': 'bg-orange-100 text-orange-800',
                        declined: 'bg-red-100 text-red-800',
                        funded: 'bg-purple-100 text-purple-800'
                      }

                      const stageLabels = {
                        initial: 'Initial',
                        'first-meeting': 'First Meeting',
                        'second-meeting': 'Second Meeting',
                        'due-diligence': 'Due Diligence',
                        'term-sheet': 'Term Sheet',
                        closed: 'Closed'
                      }

                      return (
                        <Card key={pitch.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="font-semibold text-lg">{pitch.investorName}</h3>
                                {pitch.firmName && (
                                  <span className="text-sm text-gray-600">({pitch.firmName})</span>
                                )}
                                <Badge className={`text-xs ${statusColors[pitch.status]}`}>
                                  {pitch.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {stageLabels[pitch.stage]}
                                </Badge>
                                {pitch.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-medium">{pitch.rating}</span>
                                  </div>
                                )}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(pitch.date).toLocaleDateString()}</span>
                                  {pitch.time && <span>{pitch.time}</span>}
                                </div>
                                {pitch.amount && (
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{pitch.amount}</span>
                                  </div>
                                )}
                                {pitch.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{pitch.location}</span>
                                  </div>
                                )}
                                {pitch.contactName && (
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>{pitch.contactName}</span>
                                  </div>
                                )}
                              </div>
                              {pitch.notes && (
                                <p className="text-sm text-gray-600 mb-2">{pitch.notes}</p>
                              )}
                              {pitch.feedback && (
                                <div className="p-2 bg-blue-50 rounded-lg mb-2">
                                  <p className="text-xs font-medium text-blue-900 mb-1">Feedback:</p>
                                  <p className="text-sm text-blue-800">{pitch.feedback}</p>
                                </div>
                              )}
                              {pitch.nextSteps && (
                                <div className="p-2 bg-yellow-50 rounded-lg">
                                  <p className="text-xs font-medium text-yellow-900 mb-1">Next Steps:</p>
                                  <p className="text-sm text-yellow-800">{pitch.nextSteps}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1 shrink-0 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingPitch(pitch)}
                                className="shrink-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deletePitch(pitch.id)}
                                className="shrink-0"
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
          </div>
        )}

        {/* Investors Tab */}
        {activeTab === 'investors' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Investor Database</h2>
                </div>
                <Button onClick={addInvestor} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Investor
                </Button>
              </div>

              {investors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No investors added yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investors.map((investor) => {
                    const relationshipColors = {
                      cold: 'bg-gray-100 text-gray-800',
                      warm: 'bg-blue-100 text-blue-800',
                      hot: 'bg-orange-100 text-orange-800',
                      invested: 'bg-green-100 text-green-800'
                    }

                    return (
                      <Card key={investor.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-semibold">{investor.name}</h4>
                              {investor.firmName && (
                                <span className="text-sm text-gray-600">({investor.firmName})</span>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {investor.type}
                              </Badge>
                              <Badge className={`text-xs ${relationshipColors[investor.relationshipStatus]}`}>
                                {investor.relationshipStatus}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              {investor.avgCheckSize && (
                                <div>Avg Check: {investor.avgCheckSize}</div>
                              )}
                              {investor.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{investor.location}</span>
                                </div>
                              )}
                              <div>Pitches: {investor.totalPitches} ({investor.successfulPitches} successful)</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingInvestor(investor)
                              setShowAddInvestor(true)
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

        {/* Communications Tab */}
        {activeTab === 'communications' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Communications</h2>
              </div>

              {communications.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No communications tracked yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {communications
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((comm) => {
                      const pitch = pitches.find(p => p.id === comm.pitchId)
                      const typeIcons = {
                        email: Mail,
                        call: Phone,
                        meeting: Calendar,
                        note: FileText
                      }
                      const Icon = typeIcons[comm.type]

                      return (
                        <Card key={comm.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <Icon className="h-5 w-5 text-primary-500 mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="font-medium">{pitch?.investorName || 'Unknown'}</span>
                                <Badge variant="outline" className="text-xs">
                                  {comm.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {comm.direction}
                                </Badge>
                                <span className="text-xs text-gray-600">
                                  {new Date(comm.date).toLocaleDateString()}
                                </span>
                              </div>
                              {comm.subject && (
                                <p className="font-medium text-sm mb-1">{comm.subject}</p>
                              )}
                              <p className="text-sm text-gray-600">{comm.content}</p>
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

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Funding Pipeline</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {['initial', 'first-meeting', 'second-meeting', 'due-diligence', 'term-sheet', 'closed'].map((stage) => {
                  const stagePitches = pitches.filter(p => p.stage === stage)
                  const stageLabels = {
                    initial: 'Initial',
                    'first-meeting': 'First Meeting',
                    'second-meeting': 'Second Meeting',
                    'due-diligence': 'Due Diligence',
                    'term-sheet': 'Term Sheet',
                    closed: 'Closed'
                  }

                  return (
                    <Card key={stage} className="p-4">
                      <div className="font-semibold mb-3 text-sm">{stageLabels[stage as Pitch['stage']]}</div>
                      <div className="text-2xl font-bold mb-2">{stagePitches.length}</div>
                      <div className="space-y-2">
                        {stagePitches.slice(0, 3).map((pitch) => (
                          <div key={pitch.id} className="text-xs p-2 bg-gray-50 rounded">
                            {pitch.investorName}
                          </div>
                        ))}
                        {stagePitches.length > 3 && (
                          <div className="text-xs text-gray-500">+{stagePitches.length - 3} more</div>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Pitch Status Distribution</h3>
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
                <h3 className="font-semibold mb-4">Pipeline Stages</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <h3 className="font-semibold mb-4">Pitch Timeline</h3>
              {pitches.length > 0 ? (
                <div className="space-y-2">
                  {pitches
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((pitch) => (
                      <div key={pitch.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium w-32">
                          {new Date(pitch.date).toLocaleDateString()}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{pitch.investorName}</div>
                          <div className="text-sm text-gray-600">{pitch.stage}</div>
                        </div>
                        <Badge className={`text-xs ${statusStats.find(s => s.name.toLowerCase() === pitch.status)?.color || '#gray'}`}>
                          {pitch.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">No pitch data available</div>
              )}
            </Card>
          </div>
        )}

        {/* Add/Edit Pitch Modal */}
        {(showAddPitch || editingPitch) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-3xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {editingPitch ? 'Edit Pitch' : 'Add Pitch Meeting'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowAddPitch(false)
                  setEditingPitch(null)
                  setNewPitchForm(pitchFormData)
                }} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investor Name *</label>
                    <Input
                      value={editingPitch?.investorName || newPitchForm.investorName}
                      onChange={(e) => editingPitch 
                        ? setEditingPitch({ ...editingPitch, investorName: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, investorName: e.target.value })
                      }
                      placeholder="Investor name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name</label>
                    <Input
                      value={editingPitch?.firmName || newPitchForm.firmName}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, firmName: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, firmName: e.target.value })
                      }
                      placeholder="Firm name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investor Type</label>
                    <Select
                      value={editingPitch?.investorType || newPitchForm.investorType}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, investorType: e.target.value as Investor['type'] })
                        : setNewPitchForm({ ...newPitchForm, investorType: e.target.value as Investor['type'] })
                      }
                      options={[
                        { value: 'VC', label: 'VC' },
                        { value: 'Angel', label: 'Angel' },
                        { value: 'Corporate', label: 'Corporate' },
                        { value: 'Accelerator', label: 'Accelerator' },
                        { value: 'Government', label: 'Government' },
                        { value: 'Other', label: 'Other' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <Input
                      value={editingPitch?.contactName || newPitchForm.contactName}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, contactName: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, contactName: e.target.value })
                      }
                      placeholder="Contact name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={editingPitch?.email || newPitchForm.email}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, email: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, email: e.target.value })
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input
                      type="tel"
                      value={editingPitch?.phone || newPitchForm.phone}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, phone: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <Input
                      type="date"
                      value={editingPitch?.date || newPitchForm.date}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, date: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <Input
                      type="time"
                      value={editingPitch?.time || newPitchForm.time}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, time: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, time: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input
                      value={editingPitch?.location || newPitchForm.location}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, location: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, location: e.target.value })
                      }
                      placeholder="Location"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select
                      value={editingPitch?.status || newPitchForm.status}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, status: e.target.value as Pitch['status'] })
                        : setNewPitchForm({ ...newPitchForm, status: e.target.value as Pitch['status'] })
                      }
                      options={[
                        { value: 'scheduled', label: 'Scheduled' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'follow-up', label: 'Follow-up' },
                        { value: 'declined', label: 'Declined' },
                        { value: 'funded', label: 'Funded' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                    <Select
                      value={editingPitch?.stage || newPitchForm.stage}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, stage: e.target.value as Pitch['stage'] })
                        : setNewPitchForm({ ...newPitchForm, stage: e.target.value as Pitch['stage'] })
                      }
                      options={[
                        { value: 'initial', label: 'Initial' },
                        { value: 'first-meeting', label: 'First Meeting' },
                        { value: 'second-meeting', label: 'Second Meeting' },
                        { value: 'due-diligence', label: 'Due Diligence' },
                        { value: 'term-sheet', label: 'Term Sheet' },
                        { value: 'closed', label: 'Closed' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <Input
                      value={editingPitch?.amount || newPitchForm.amount}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, amount: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, amount: e.target.value })
                      }
                      placeholder="$500K"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equity</label>
                    <Input
                      value={editingPitch?.equity || newPitchForm.equity}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, equity: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, equity: e.target.value })
                      }
                      placeholder="10%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valuation</label>
                    <Input
                      value={editingPitch?.valuation || newPitchForm.valuation}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, valuation: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, valuation: e.target.value })
                      }
                      placeholder="$5M"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingPitch?.notes || newPitchForm.notes}
                    onChange={(e) => editingPitch
                      ? setEditingPitch({ ...editingPitch, notes: e.target.value })
                      : setNewPitchForm({ ...newPitchForm, notes: e.target.value })
                    }
                    placeholder="Meeting notes..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingPitch?.feedback || newPitchForm.feedback}
                    onChange={(e) => editingPitch
                      ? setEditingPitch({ ...editingPitch, feedback: e.target.value })
                      : setNewPitchForm({ ...newPitchForm, feedback: e.target.value })
                    }
                    placeholder="Investor feedback..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={2}
                    value={editingPitch?.nextSteps || newPitchForm.nextSteps}
                    onChange={(e) => editingPitch
                      ? setEditingPitch({ ...editingPitch, nextSteps: e.target.value })
                      : setNewPitchForm({ ...newPitchForm, nextSteps: e.target.value })
                    }
                    placeholder="Next steps..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
                    <Input
                      type="date"
                      value={editingPitch?.followUpDate || newPitchForm.followUpDate}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, followUpDate: e.target.value })
                        : setNewPitchForm({ ...newPitchForm, followUpDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={editingPitch?.rating || newPitchForm.rating}
                      onChange={(e) => editingPitch
                        ? setEditingPitch({ ...editingPitch, rating: parseInt(e.target.value) || 0 })
                        : setNewPitchForm({ ...newPitchForm, rating: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={editingPitch ? updatePitch : addPitch} 
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingPitch ? 'Update Pitch' : 'Add Pitch'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddPitch(false)
                    setEditingPitch(null)
                    setNewPitchForm(pitchFormData)
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add/Edit Investor Modal */}
        {showAddInvestor && editingInvestor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {editingInvestor.id && investors.find(i => i.id === editingInvestor.id) ? 'Edit Investor' : 'Add Investor'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowAddInvestor(false)
                  setEditingInvestor(null)
                }} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <Input
                      value={editingInvestor.name}
                      onChange={(e) => setEditingInvestor({ ...editingInvestor, name: e.target.value })}
                      placeholder="Investor name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name</label>
                    <Input
                      value={editingInvestor.firmName || ''}
                      onChange={(e) => setEditingInvestor({ ...editingInvestor, firmName: e.target.value })}
                      placeholder="Firm name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Select
                      value={editingInvestor.type}
                      onChange={(e) => setEditingInvestor({ ...editingInvestor, type: e.target.value as Investor['type'] })}
                      options={[
                        { value: 'VC', label: 'VC' },
                        { value: 'Angel', label: 'Angel' },
                        { value: 'Corporate', label: 'Corporate' },
                        { value: 'Accelerator', label: 'Accelerator' },
                        { value: 'Government', label: 'Government' },
                        { value: 'Other', label: 'Other' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Status</label>
                    <Select
                      value={editingInvestor.relationshipStatus}
                      onChange={(e) => setEditingInvestor({ ...editingInvestor, relationshipStatus: e.target.value as Investor['relationshipStatus'] })}
                      options={[
                        { value: 'cold', label: 'Cold' },
                        { value: 'warm', label: 'Warm' },
                        { value: 'hot', label: 'Hot' },
                        { value: 'invested', label: 'Invested' },
                      ]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={editingInvestor.email || ''}
                      onChange={(e) => setEditingInvestor({ ...editingInvestor, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input
                      type="tel"
                      value={editingInvestor.phone || ''}
                      onChange={(e) => setEditingInvestor({ ...editingInvestor, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input
                    value={editingInvestor.location || ''}
                    onChange={(e) => setEditingInvestor({ ...editingInvestor, location: e.target.value })}
                    placeholder="Location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingInvestor.notes || ''}
                    onChange={(e) => setEditingInvestor({ ...editingInvestor, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveInvestor} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Investor
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddInvestor(false)
                    setEditingInvestor(null)
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
