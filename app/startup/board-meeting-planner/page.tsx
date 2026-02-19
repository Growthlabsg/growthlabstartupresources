'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Calendar, 
  Plus, 
  FileText,
  Edit,
  Trash2,
  X,
  Save,
  Download,
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Activity,
  BarChart3,
  Target,
  MessageSquare,
  Paperclip,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building2,
  Star,
  ArrowRight,
  ArrowLeft,
  Zap,
  BookOpen,
  CheckSquare
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

interface AgendaItem {
  id: string
  title: string
  description?: string
  duration: number
  presenter: string
  order: number
  category: 'financial' | 'operational' | 'strategic' | 'governance' | 'other'
  status: 'pending' | 'in-progress' | 'completed' | 'deferred'
  notes?: string
  attachments?: string[]
}

interface BoardMember {
  id: string
  name: string
  role: 'chair' | 'director' | 'observer' | 'executive' | 'advisor'
  email?: string
  phone?: string
  company?: string
  expertise?: string[]
  attendance: number
  totalMeetings: number
}

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  location?: string
  type: 'regular' | 'special' | 'annual' | 'emergency'
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  agenda: AgendaItem[]
  attendees: string[]
  minutes?: string
  actionItems: ActionItem[]
  attachments?: string[]
  notes?: string
}

interface ActionItem {
  id: string
  title: string
  description?: string
  assignedTo: string
  dueDate?: string
  status: 'open' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  meetingId: string
  completedDate?: string
  notes?: string
}

interface Minutes {
  id: string
  meetingId: string
  date: string
  attendees: string[]
  agendaItems: { id: string; title: string; notes: string }[]
  decisions: string[]
  actionItems: string[]
  nextMeetingDate?: string
  notes?: string
}

export default function BoardMeetingPlannerPage() {
  const [activeTab, setActiveTab] = useState('meetings')
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [minutes, setMinutes] = useState<Minutes[]>([])
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null)
  const [editingAgendaItem, setEditingAgendaItem] = useState<AgendaItem | null>(null)
  const [editingActionItem, setEditingActionItem] = useState<ActionItem | null>(null)
  const [showAddMeeting, setShowAddMeeting] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | Meeting['status']>('all')
  const [filterType, setFilterType] = useState<'all' | Meeting['type']>('all')
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)

  const tabs = [
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'agenda', label: 'Agenda Builder', icon: FileText },
    { id: 'minutes', label: 'Minutes', icon: BookOpen },
    { id: 'actions', label: 'Action Items', icon: CheckSquare },
    { id: 'members', label: 'Board Members', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const meetingFormData = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    type: 'regular' as Meeting['type'],
    status: 'scheduled' as Meeting['status'],
    agenda: [] as AgendaItem[],
    attendees: [] as string[],
    notes: ''
  }

  const [newMeetingForm, setNewMeetingForm] = useState(meetingFormData)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('boardMeetingPlannerData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.meetings) setMeetings(data.meetings)
          if (data.boardMembers) setBoardMembers(data.boardMembers)
          if (data.actionItems) setActionItems(data.actionItems)
          if (data.minutes) setMinutes(data.minutes)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        meetings,
        boardMembers,
        actionItems,
        minutes,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('boardMeetingPlannerData', JSON.stringify(data))
    }
  }

  const addMeeting = () => {
    if (!newMeetingForm.title || !newMeetingForm.date) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: newMeetingForm.title,
      date: newMeetingForm.date,
      time: newMeetingForm.time || '',
      location: newMeetingForm.location || undefined,
      type: newMeetingForm.type,
      status: newMeetingForm.status,
      agenda: [],
      attendees: newMeetingForm.attendees,
      actionItems: [],
      notes: newMeetingForm.notes || undefined
    }

    setMeetings([...meetings, newMeeting])
    setNewMeetingForm(meetingFormData)
    setShowAddMeeting(false)
    saveToLocalStorage()
    showToast('Meeting added!', 'success')
  }

  const updateMeeting = () => {
    if (!editingMeeting) return

    const updated = meetings.map(m => m.id === editingMeeting.id ? editingMeeting : m)
    setMeetings(updated)
    setEditingMeeting(null)
    saveToLocalStorage()
    showToast('Meeting updated!', 'success')
  }

  const deleteMeeting = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id))
    setActionItems(actionItems.filter(a => a.meetingId !== id))
    setMinutes(minutes.filter(m => m.meetingId !== id))
    saveToLocalStorage()
    showToast('Meeting deleted', 'success')
  }

  const addAgendaItem = (meetingId: string) => {
    const newItem: AgendaItem = {
      id: Date.now().toString(),
      title: '',
      duration: 15,
      presenter: '',
      order: 0,
      category: 'other',
      status: 'pending'
    }
    setEditingAgendaItem(newItem)
    setSelectedMeeting(meetings.find(m => m.id === meetingId) || null)
  }

  const saveAgendaItem = () => {
    if (!editingAgendaItem || !selectedMeeting) return
    if (!editingAgendaItem.title || !editingAgendaItem.presenter) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const updated = meetings.map(m => {
      if (m.id === selectedMeeting.id) {
        const existing = m.agenda.find(a => a.id === editingAgendaItem.id)
        if (existing) {
          return {
            ...m,
            agenda: m.agenda.map(a => a.id === editingAgendaItem.id ? editingAgendaItem : a)
          }
        } else {
          const maxOrder = m.agenda.length > 0 ? Math.max(...m.agenda.map(a => a.order)) : -1
          return {
            ...m,
            agenda: [...m.agenda, { ...editingAgendaItem, order: maxOrder + 1 }]
          }
        }
      }
      return m
    })

    setMeetings(updated)
    setEditingAgendaItem(null)
    setSelectedMeeting(null)
    saveToLocalStorage()
    showToast('Agenda item saved!', 'success')
  }

  const addActionItem = (meetingId: string) => {
    const newItem: ActionItem = {
      id: Date.now().toString(),
      title: '',
      assignedTo: '',
      status: 'open',
      priority: 'medium',
      meetingId
    }
    setEditingActionItem(newItem)
  }

  const saveActionItem = () => {
    if (!editingActionItem) return
    if (!editingActionItem.title || !editingActionItem.assignedTo) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const existing = actionItems.find(a => a.id === editingActionItem.id)
    if (existing) {
      setActionItems(actionItems.map(a => a.id === editingActionItem.id ? editingActionItem : a))
      showToast('Action item updated!', 'success')
    } else {
      setActionItems([...actionItems, editingActionItem])
      showToast('Action item added!', 'success')
    }

    setEditingActionItem(null)
    saveToLocalStorage()
  }

  const addBoardMember = () => {
    const newMember: BoardMember = {
      id: Date.now().toString(),
      name: '',
      role: 'director',
      attendance: 0,
      totalMeetings: 0
    }
    setEditingMember(newMember)
    setShowAddMember(true)
  }

  const saveBoardMember = () => {
    if (!editingMember || !editingMember.name) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const existing = boardMembers.find(m => m.id === editingMember.id)
    if (existing) {
      setBoardMembers(boardMembers.map(m => m.id === editingMember.id ? editingMember : m))
      showToast('Board member updated!', 'success')
    } else {
      setBoardMembers([...boardMembers, editingMember])
      showToast('Board member added!', 'success')
    }

    setEditingMember(null)
    setShowAddMember(false)
    saveToLocalStorage()
  }

  const exportAgenda = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId)
    if (!meeting) return

    const agendaText = meeting.agenda
      .sort((a, b) => a.order - b.order)
      .map((item, index) => 
        `${index + 1}. ${item.title}\n   Presenter: ${item.presenter}\n   Duration: ${item.duration} min\n   ${item.description || ''}`
      )
      .join('\n\n')

    const content = `Board Meeting Agenda\n${meeting.title}\nDate: ${new Date(meeting.date).toLocaleDateString()}\nTime: ${meeting.time}\n\n${agendaText}`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agenda-${meeting.date}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Agenda exported!', 'success')
  }

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = 
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.location?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || meeting.status === filterStatus
    const matchesType = filterType === 'all' || meeting.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const statusStats = [
    { name: 'Scheduled', value: meetings.filter(m => m.status === 'scheduled').length, color: '#3b82f6' },
    { name: 'In Progress', value: meetings.filter(m => m.status === 'in-progress').length, color: '#f59e0b' },
    { name: 'Completed', value: meetings.filter(m => m.status === 'completed').length, color: '#10b981' },
    { name: 'Cancelled', value: meetings.filter(m => m.status === 'cancelled').length, color: '#ef4444' },
  ]

  const actionItemStats = [
    { name: 'Open', value: actionItems.filter(a => a.status === 'open').length, color: '#3b82f6' },
    { name: 'In Progress', value: actionItems.filter(a => a.status === 'in-progress').length, color: '#f59e0b' },
    { name: 'Completed', value: actionItems.filter(a => a.status === 'completed').length, color: '#10b981' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            Board Meeting Planner
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plan and organize board meetings with agenda templates, minutes tracking, and action item management.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>
        </div>

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Meetings</div>
                <div className="text-2xl font-bold">{meetings.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Scheduled</div>
                <div className="text-2xl font-bold text-blue-600">
                  {meetings.filter(m => m.status === 'scheduled').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Completed</div>
                <div className="text-2xl font-bold text-green-600">
                  {meetings.filter(m => m.status === 'completed').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Action Items</div>
                <div className="text-2xl font-bold text-orange-600">{actionItems.length}</div>
              </Card>
            </div>

            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Board Meetings</h2>
                </div>
                <Button onClick={() => setShowAddMeeting(true)} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meeting
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Input
                    placeholder="Search meetings..."
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
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                />
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'regular', label: 'Regular' },
                    { value: 'special', label: 'Special' },
                    { value: 'annual', label: 'Annual' },
                    { value: 'emergency', label: 'Emergency' },
                  ]}
                />
              </div>

              {filteredMeetings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Meetings Yet</h3>
                  <p className="text-gray-600 mb-6">Start planning your board meetings</p>
                  <Button onClick={() => setShowAddMeeting(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Meeting
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMeetings
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((meeting) => {
                      const typeColors = {
                        regular: 'bg-blue-100 text-blue-800',
                        special: 'bg-purple-100 text-purple-800',
                        annual: 'bg-green-100 text-green-800',
                        emergency: 'bg-red-100 text-red-800'
                      }

                      const statusColors = {
                        scheduled: 'bg-blue-100 text-blue-800',
                        'in-progress': 'bg-orange-100 text-orange-800',
                        completed: 'bg-green-100 text-green-800',
                        cancelled: 'bg-red-100 text-red-800'
                      }

                      return (
                        <Card key={meeting.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="font-semibold text-lg">{meeting.title}</h3>
                                <Badge className={`text-xs ${typeColors[meeting.type]}`}>
                                  {meeting.type}
                                </Badge>
                                <Badge className={`text-xs ${statusColors[meeting.status]}`}>
                                  {meeting.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(meeting.date).toLocaleDateString()}</span>
                                </div>
                                {meeting.time && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{meeting.time}</span>
                                  </div>
                                )}
                                {meeting.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{meeting.location}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>{meeting.attendees.length} attendees</span>
                                </div>
                              </div>
                              {meeting.agenda.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Agenda Items: {meeting.agenda.length}</p>
                                  <div className="text-xs text-gray-600">
                                    Total Duration: {meeting.agenda.reduce((sum, item) => sum + item.duration, 0)} min
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1 shrink-0 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingMeeting(meeting)
                                  setSelectedMeeting(meeting)
                                }}
                                className="shrink-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => exportAgenda(meeting.id)}
                                className="shrink-0"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteMeeting(meeting.id)}
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

        {/* Agenda Builder Tab */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
        <Card>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Agenda Builder</h2>
              </div>

              {meetings.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Create a meeting first to build an agenda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <Card key={meeting.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{meeting.title}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(meeting.date).toLocaleDateString()} • {meeting.agenda.length} items
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedMeeting(meeting)
                            addAgendaItem(meeting.id)
                          }}
                        >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
                      </div>
                      {meeting.agenda.length > 0 ? (
                        <div className="space-y-2">
                          {meeting.agenda
                            .sort((a, b) => a.order - b.order)
                            .map((item, index) => (
                              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="text-lg font-bold text-primary-500 w-8">{index + 1}</span>
                                <div className="flex-1">
                                  <div className="font-medium">{item.title}</div>
                                  <div className="text-sm text-gray-600">
                                    {item.presenter} • {item.duration} min
                                  </div>
                                  {item.description && (
                                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingAgendaItem(item)
                                    setSelectedMeeting(meeting)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          No agenda items yet
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Minutes Tab */}
        {activeTab === 'minutes' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Meeting Minutes</h2>
              </div>

              {minutes.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No minutes recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {minutes
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((minute) => {
                      const meeting = meetings.find(m => m.id === minute.meetingId)
                      return (
                        <Card key={minute.id} className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{meeting?.title || 'Unknown Meeting'}</h3>
                              <p className="text-sm text-gray-600">
                                {new Date(minute.date).toLocaleDateString()} • {minute.attendees.length} attendees
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                          {minute.decisions.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Decisions:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {minute.decisions.map((decision, idx) => (
                                  <li key={idx}>• {decision}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {minute.actionItems.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Action Items:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {minute.actionItems.map((item, idx) => (
                                  <li key={idx}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Card>
                      )
                    })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Action Items Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Action Items</h2>
                </div>
                {meetings.length > 0 && (
                  <Button
                    onClick={() => {
                      const meeting = meetings[0]
                      if (meeting) addActionItem(meeting.id)
                    }}
                    size="sm"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action Item
                  </Button>
                )}
              </div>

              {actionItems.length === 0 ? (
                <div className="text-center py-12">
                  <CheckSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No action items yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {actionItems
                    .sort((a, b) => {
                      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
                      return priorityOrder[b.priority] - priorityOrder[a.priority]
                    })
                    .map((item) => {
                      const meeting = meetings.find(m => m.id === item.meetingId)
                      const priorityColors = {
                        critical: 'bg-red-100 text-red-800',
                        high: 'bg-orange-100 text-orange-800',
                        medium: 'bg-blue-100 text-blue-800',
                        low: 'bg-gray-100 text-gray-800'
                      }

                      const statusColors = {
                        open: 'bg-blue-100 text-blue-800',
                        'in-progress': 'bg-orange-100 text-orange-800',
                        completed: 'bg-green-100 text-green-800',
                        cancelled: 'bg-red-100 text-red-800'
                      }

                      return (
                        <Card key={item.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h4 className="font-semibold">{item.title}</h4>
                                <Badge className={`text-xs ${priorityColors[item.priority]}`}>
                                  {item.priority}
                                </Badge>
                                <Badge className={`text-xs ${statusColors[item.status]}`}>
                                  {item.status}
                                </Badge>
                              </div>
                              {item.description && (
                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              )}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Assigned to:</span> {item.assignedTo}
                                </div>
                                {item.dueDate && (
                                  <div>
                                    <span className="font-medium">Due:</span> {new Date(item.dueDate).toLocaleDateString()}
                                  </div>
                                )}
                                {meeting && (
                                  <div>
                                    <span className="font-medium">Meeting:</span> {meeting.title}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingActionItem(item)}
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

        {/* Board Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Board Members</h2>
                </div>
                <Button onClick={addBoardMember} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>

              {boardMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No board members added yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {boardMembers.map((member) => {
                    const roleColors = {
                      chair: 'bg-purple-100 text-purple-800',
                      director: 'bg-blue-100 text-blue-800',
                      observer: 'bg-gray-100 text-gray-800',
                      executive: 'bg-green-100 text-green-800',
                      advisor: 'bg-orange-100 text-orange-800'
                    }

                    const attendanceRate = member.totalMeetings > 0 
                      ? (member.attendance / member.totalMeetings) * 100 
                      : 0

                    return (
                      <Card key={member.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-semibold">{member.name}</h4>
                              <Badge className={`text-xs ${roleColors[member.role]}`}>
                                {member.role}
                              </Badge>
                            </div>
                            {member.company && (
                              <p className="text-sm text-gray-600 mb-2">{member.company}</p>
                            )}
                            <div className="text-sm text-gray-600 space-y-1">
                              {member.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <span>{member.email}</span>
                                </div>
                              )}
                              <div>
                                Attendance: {member.attendance}/{member.totalMeetings} ({Math.round(attendanceRate)}%)
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingMember(member)
                              setShowAddMember(true)
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
                <h3 className="font-semibold mb-4">Meeting Status Distribution</h3>
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
                <h3 className="font-semibold mb-4">Action Item Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={actionItemStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {actionItemStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {/* Add/Edit Meeting Modal */}
        {(showAddMeeting || editingMeeting) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-3xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {editingMeeting ? 'Edit Meeting' : 'Add Board Meeting'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowAddMeeting(false)
                  setEditingMeeting(null)
                  setNewMeetingForm(meetingFormData)
                }} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title *</label>
                  <Input
                    value={editingMeeting?.title || newMeetingForm.title}
                    onChange={(e) => editingMeeting
                      ? setEditingMeeting({ ...editingMeeting, title: e.target.value })
                      : setNewMeetingForm({ ...newMeetingForm, title: e.target.value })
                    }
                    placeholder="Q1 2024 Board Meeting"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <Input
                      type="date"
                      value={editingMeeting?.date || newMeetingForm.date}
                      onChange={(e) => editingMeeting
                        ? setEditingMeeting({ ...editingMeeting, date: e.target.value })
                        : setNewMeetingForm({ ...newMeetingForm, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <Input
                      type="time"
                      value={editingMeeting?.time || newMeetingForm.time}
                      onChange={(e) => editingMeeting
                        ? setEditingMeeting({ ...editingMeeting, time: e.target.value })
                        : setNewMeetingForm({ ...newMeetingForm, time: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Select
                      value={editingMeeting?.type || newMeetingForm.type}
                      onChange={(e) => editingMeeting
                        ? setEditingMeeting({ ...editingMeeting, type: e.target.value as Meeting['type'] })
                        : setNewMeetingForm({ ...newMeetingForm, type: e.target.value as Meeting['type'] })
                      }
                      options={[
                        { value: 'regular', label: 'Regular' },
                        { value: 'special', label: 'Special' },
                        { value: 'annual', label: 'Annual' },
                        { value: 'emergency', label: 'Emergency' },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input
                    value={editingMeeting?.location || newMeetingForm.location}
                    onChange={(e) => editingMeeting
                      ? setEditingMeeting({ ...editingMeeting, location: e.target.value })
                      : setNewMeetingForm({ ...newMeetingForm, location: e.target.value })
                    }
                    placeholder="Meeting location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingMeeting?.notes || newMeetingForm.notes}
                    onChange={(e) => editingMeeting
                      ? setEditingMeeting({ ...editingMeeting, notes: e.target.value })
                      : setNewMeetingForm({ ...newMeetingForm, notes: e.target.value })
                    }
                    placeholder="Meeting notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={editingMeeting ? updateMeeting : addMeeting} 
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingMeeting ? 'Update Meeting' : 'Add Meeting'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddMeeting(false)
                    setEditingMeeting(null)
                    setNewMeetingForm(meetingFormData)
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add/Edit Agenda Item Modal */}
        {editingAgendaItem && selectedMeeting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Agenda Item</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingAgendaItem(null)
                  setSelectedMeeting(null)
                }} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <Input
                    value={editingAgendaItem.title}
                    onChange={(e) => setEditingAgendaItem({ ...editingAgendaItem, title: e.target.value })}
                    placeholder="Agenda item title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingAgendaItem.description || ''}
                    onChange={(e) => setEditingAgendaItem({ ...editingAgendaItem, description: e.target.value })}
                    placeholder="Item description..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min) *</label>
                    <Input
                      type="number"
                      value={editingAgendaItem.duration}
                      onChange={(e) => setEditingAgendaItem({ ...editingAgendaItem, duration: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Presenter *</label>
                    <Input
                      value={editingAgendaItem.presenter}
                      onChange={(e) => setEditingAgendaItem({ ...editingAgendaItem, presenter: e.target.value })}
                      placeholder="Presenter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Select
                      value={editingAgendaItem.category}
                      onChange={(e) => setEditingAgendaItem({ ...editingAgendaItem, category: e.target.value as AgendaItem['category'] })}
                      options={[
                        { value: 'financial', label: 'Financial' },
                        { value: 'operational', label: 'Operational' },
                        { value: 'strategic', label: 'Strategic' },
                        { value: 'governance', label: 'Governance' },
                        { value: 'other', label: 'Other' },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveAgendaItem} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Item
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setEditingAgendaItem(null)
                    setSelectedMeeting(null)
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add/Edit Action Item Modal */}
        {editingActionItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Action Item</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingActionItem(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
          </div>
          <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <Input
                    value={editingActionItem.title}
                    onChange={(e) => setEditingActionItem({ ...editingActionItem, title: e.target.value })}
                    placeholder="Action item title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingActionItem.description || ''}
                    onChange={(e) => setEditingActionItem({ ...editingActionItem, description: e.target.value })}
                    placeholder="Action item description..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To *</label>
                    <Input
                      value={editingActionItem.assignedTo}
                      onChange={(e) => setEditingActionItem({ ...editingActionItem, assignedTo: e.target.value })}
                      placeholder="Person name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <Input
                      type="date"
                      value={editingActionItem.dueDate || ''}
                      onChange={(e) => setEditingActionItem({ ...editingActionItem, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <Select
                      value={editingActionItem.priority}
                      onChange={(e) => setEditingActionItem({ ...editingActionItem, priority: e.target.value as ActionItem['priority'] })}
                      options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' },
                        { value: 'critical', label: 'Critical' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select
                      value={editingActionItem.status}
                      onChange={(e) => setEditingActionItem({ ...editingActionItem, status: e.target.value as ActionItem['status'] })}
                      options={[
                        { value: 'open', label: 'Open' },
                        { value: 'in-progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'cancelled', label: 'Cancelled' },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveActionItem} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Action Item
                  </Button>
                  <Button variant="outline" onClick={() => setEditingActionItem(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add/Edit Board Member Modal */}
        {showAddMember && editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {editingMember.id && boardMembers.find(m => m.id === editingMember.id) ? 'Edit Board Member' : 'Add Board Member'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowAddMember(false)
                  setEditingMember(null)
                }} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <Input
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    placeholder="Board member name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <Select
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value as BoardMember['role'] })}
                      options={[
                        { value: 'chair', label: 'Chair' },
                        { value: 'director', label: 'Director' },
                        { value: 'observer', label: 'Observer' },
                        { value: 'executive', label: 'Executive' },
                        { value: 'advisor', label: 'Advisor' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <Input
                      value={editingMember.company || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, company: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={editingMember.email || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input
                      type="tel"
                      value={editingMember.phone || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveBoardMember} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Member
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowAddMember(false)
                    setEditingMember(null)
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
