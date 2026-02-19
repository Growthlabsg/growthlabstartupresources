'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Users2, 
  Target, 
  BarChart3,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Sparkles,
  Calculator,
  BookOpen,
  Download,
  Share2,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Mail,
  Phone,
  Building2,
  User,
  FileText,
  Settings,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
  Filter,
  RefreshCw,
  Zap,
  Briefcase,
  Percent,
  TrendingDown,
  Send,
  MessageSquare,
  Star,
  Award,
  ThumbsUp,
  ThumbsDown,
  Play,
  Pause,
  Copy,
  ExternalLink,
  ChevronRight,
  MailOpen,
  MousePointerClick
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts'

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
type DealStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
type LeadSource = 'website' | 'referral' | 'social-media' | 'email' | 'cold-call' | 'event' | 'partner' | 'other'
type SequenceStatus = 'active' | 'paused' | 'completed' | 'draft'
type EmailStatus = 'pending' | 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced'

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone?: string
  title?: string
  source: LeadSource
  status: LeadStatus
  value: number
  probability: number
  expectedValue: number
  assignedTo?: string
  notes?: string
  score: number
  scoreFactors: {
    engagement: number
    fit: number
    intent: number
    timing: number
  }
  activities: {
    type: string
    date: string
    description: string
  }[]
  lastContacted?: string
  createdAt: string
  updatedAt: string
}

interface Deal {
  id: string
  name: string
  company: string
  stage: DealStage
  value: number
  probability: number
  expectedValue: number
  closeDate: string
  owner: string
  source: LeadSource
  notes?: string
  createdAt: string
  updatedAt: string
}

interface SalesStage {
  id: string
  name: string
  order: number
  probability: number
  description?: string
}

interface EmailSequence {
  id: string
  name: string
  description: string
  status: SequenceStatus
  steps: EmailStep[]
  enrolledLeads: string[]
  metrics: {
    sent: number
    opened: number
    clicked: number
    replied: number
    bounced: number
    unsubscribed: number
  }
  created: string
  modified: string
}

interface EmailStep {
  id: string
  order: number
  subject: string
  body: string
  delay: number // days
  delayUnit: 'hours' | 'days' | 'weeks'
  status: 'pending' | 'active' | 'completed'
}

interface SalesScript {
  id: string
  name: string
  type: 'cold-call' | 'discovery' | 'demo' | 'negotiation' | 'closing' | 'follow-up'
  script: string
  objections: {
    objection: string
    response: string
  }[]
  tips: string[]
  created: string
}

interface ProposalTemplate {
  id: string
  name: string
  description: string
  sections: {
    title: string
    content: string
  }[]
  created: string
}

const stageLabels: Record<DealStage, string> = {
  'prospecting': 'Prospecting',
  'qualification': 'Qualification',
  'proposal': 'Proposal',
  'negotiation': 'Negotiation',
  'closed-won': 'Closed Won',
  'closed-lost': 'Closed Lost'
}

const stageColors: Record<DealStage, string> = {
  'prospecting': '#6b7280',
  'qualification': '#3b82f6',
  'proposal': '#8b5cf6',
  'negotiation': '#f59e0b',
  'closed-won': '#10b981',
  'closed-lost': '#ef4444'
}

const statusLabels: Record<LeadStatus, string> = {
  'new': 'New',
  'contacted': 'Contacted',
  'qualified': 'Qualified',
  'proposal': 'Proposal',
  'negotiation': 'Negotiation',
  'won': 'Won',
  'lost': 'Lost'
}

const statusColors: Record<LeadStatus, string> = {
  'new': 'bg-blue-100 text-blue-800',
  'contacted': 'bg-yellow-100 text-yellow-800',
  'qualified': 'bg-purple-100 text-purple-800',
  'proposal': 'bg-orange-100 text-orange-800',
  'negotiation': 'bg-pink-100 text-pink-800',
  'won': 'bg-green-100 text-green-800',
  'lost': 'bg-red-100 text-red-800'
}

const sourceLabels: Record<LeadSource, string> = {
  'website': 'Website',
  'referral': 'Referral',
  'social-media': 'Social Media',
  'email': 'Email',
  'cold-call': 'Cold Call',
  'event': 'Event',
  'partner': 'Partner',
  'other': 'Other'
}

const sequenceStatusColors: Record<SequenceStatus, string> = {
  'active': 'bg-green-100 text-green-800',
  'paused': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-blue-100 text-blue-800',
  'draft': 'bg-gray-100 text-gray-800'
}

const scriptTypeLabels: Record<SalesScript['type'], string> = {
  'cold-call': 'Cold Call',
  'discovery': 'Discovery Call',
  'demo': 'Product Demo',
  'negotiation': 'Negotiation',
  'closing': 'Closing',
  'follow-up': 'Follow-up'
}

const defaultScripts: SalesScript[] = [
  {
    id: '1',
    name: 'Cold Call Opening',
    type: 'cold-call',
    script: `Hi [Name], this is [Your Name] from [Company]. I'm reaching out because I noticed [Observation about their company].

We help [Target customer type] like [Similar company] to [Key benefit]. They've seen [Specific result].

I'd love to learn more about how you're currently handling [Pain point]. Do you have 2 minutes?`,
    objections: [
      { objection: "I'm not interested", response: "I completely understand. Before I go, can I ask what your current solution looks like for [pain point]? I'd hate for you to miss out on [benefit] that companies like [reference] are seeing." },
      { objection: "We're already using a solution", response: "That's great to hear! Many of our best customers came from [competitor]. What made you choose them originally? And how is it working out for [specific use case]?" },
      { objection: "Send me an email", response: "I'd be happy to. To make sure I send you the most relevant information, can you tell me what your biggest challenge is with [area]?" }
    ],
    tips: ['Research the prospect before calling', 'Be confident but not pushy', 'Focus on value, not features'],
    created: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Discovery Call Framework',
    type: 'discovery',
    script: `Opening:
"Thanks for taking the time today, [Name]. Before we dive in, I'd love to understand your goals for this call. What would make this time valuable for you?"

Situation Questions:
- "Can you walk me through how your team currently handles [process]?"
- "What tools or systems are you using today?"
- "How many people are involved in [process]?"

Problem Questions:
- "What's the biggest challenge you face with [area]?"
- "How much time does your team spend on [manual task]?"
- "What happens when [problem scenario] occurs?"

Impact Questions:
- "How does this issue affect your team's productivity?"
- "What does this cost you in terms of time/money/opportunities?"
- "If you could wave a magic wand, what would you change?"

Next Steps:
- "Based on what you've shared, I think we can help. Can I show you specifically how?"`,
    objections: [],
    tips: ['Listen more than you talk (80/20 rule)', 'Take detailed notes', 'Ask follow-up questions'],
    created: new Date().toISOString()
  }
]

const defaultProposalTemplates: ProposalTemplate[] = [
  {
    id: '1',
    name: 'SaaS Proposal Template',
    description: 'Standard proposal template for SaaS solutions',
    sections: [
      { title: 'Executive Summary', content: 'Brief overview of the proposal and key benefits...' },
      { title: 'Understanding Your Needs', content: 'Based on our conversations, we understand that...' },
      { title: 'Proposed Solution', content: 'Our solution addresses your challenges by...' },
      { title: 'Implementation Plan', content: 'We propose a phased implementation approach...' },
      { title: 'Investment', content: 'Pricing and payment terms...' },
      { title: 'Next Steps', content: 'To move forward, we recommend...' }
    ],
    created: new Date().toISOString()
  }
]

export default function SalesProcessPage() {
  const [activeTab, setActiveTab] = useState('pipeline')
  const [leads, setLeads] = useState<Lead[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [stages, setStages] = useState<SalesStage[]>([
    { id: '1', name: 'Prospecting', order: 1, probability: 10 },
    { id: '2', name: 'Qualification', order: 2, probability: 25 },
    { id: '3', name: 'Proposal', order: 3, probability: 50 },
    { id: '4', name: 'Negotiation', order: 4, probability: 75 },
    { id: '5', name: 'Closed Won', order: 5, probability: 100 },
  ])
  const [sequences, setSequences] = useState<EmailSequence[]>([])
  const [scripts, setScripts] = useState<SalesScript[]>(defaultScripts)
  const [proposals, setProposals] = useState<ProposalTemplate[]>(defaultProposalTemplates)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [editingSequence, setEditingSequence] = useState<EmailSequence | null>(null)
  const [editingScript, setEditingScript] = useState<SalesScript | null>(null)
  const [selectedScript, setSelectedScript] = useState<SalesScript | null>(null)
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    title: '',
    source: 'website' as LeadSource,
    status: 'new' as LeadStatus,
    value: '',
    probability: '',
    assignedTo: '',
    notes: ''
  })
  const [dealFormData, setDealFormData] = useState({
    name: '',
    company: '',
    stage: 'prospecting' as DealStage,
    value: '',
    probability: '',
    closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    owner: '',
    source: 'website' as LeadSource,
    notes: ''
  })
  const [sequenceFormData, setSequenceFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as SequenceStatus
  })
  const [newStep, setNewStep] = useState({
    subject: '',
    body: '',
    delay: '1',
    delayUnit: 'days' as 'hours' | 'days' | 'weeks'
  })
  const [sequenceSteps, setSequenceSteps] = useState<EmailStep[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterStage, setFilterStage] = useState<string>('all')
  const [filterSource, setFilterSource] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'score' | 'value' | 'date'>('score')

  const tabs = [
    { id: 'pipeline', label: 'Pipeline', icon: BarChart3 },
    { id: 'leads', label: 'Leads', icon: Target },
    { id: 'scoring', label: 'Lead Scoring', icon: Star },
    { id: 'sequences', label: 'Email Sequences', icon: Mail },
    { id: 'scripts', label: 'Sales Scripts', icon: FileText },
    { id: 'proposals', label: 'Proposals', icon: Briefcase },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('salesProcessDataV2')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.leads) setLeads(data.leads)
          if (data.deals) setDeals(data.deals)
          if (data.stages) setStages(data.stages)
          if (data.sequences) setSequences(data.sequences)
          if (data.scripts) setScripts(data.scripts.length > 0 ? data.scripts : defaultScripts)
          if (data.proposals) setProposals(data.proposals.length > 0 ? data.proposals : defaultProposalTemplates)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        leads,
        deals,
        stages,
        sequences,
        scripts,
        proposals,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('salesProcessDataV2', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const calculateExpectedValue = (value: number, probability: number) => {
    return value * (probability / 100)
  }

  const calculateLeadScore = (lead: Partial<Lead>): { score: number; factors: Lead['scoreFactors'] } => {
    let engagement = 0
    let fit = 0
    let intent = 0
    let timing = 0

    // Engagement scoring (based on activities and interactions)
    if (lead.activities && lead.activities.length > 0) {
      engagement = Math.min(25, lead.activities.length * 5)
    }

    // Fit scoring (based on company info)
    if (lead.company) fit += 10
    if (lead.title) fit += 10
    if (lead.phone) fit += 5

    // Intent scoring (based on source and status)
    const sourceScores: Record<LeadSource, number> = {
      'website': 15,
      'referral': 20,
      'event': 15,
      'social-media': 10,
      'email': 10,
      'cold-call': 5,
      'partner': 18,
      'other': 5
    }
    intent = sourceScores[lead.source as LeadSource] || 5

    // Status scoring
    const statusScores: Record<LeadStatus, number> = {
      'new': 0,
      'contacted': 5,
      'qualified': 15,
      'proposal': 20,
      'negotiation': 25,
      'won': 25,
      'lost': 0
    }
    intent += statusScores[lead.status as LeadStatus] || 0

    // Timing scoring (based on last contact and deal value)
    if (lead.value && lead.value > 10000) timing += 15
    else if (lead.value && lead.value > 5000) timing += 10
    else if (lead.value && lead.value > 1000) timing += 5

    if (lead.lastContacted) {
      const daysSinceContact = Math.floor((Date.now() - new Date(lead.lastContacted).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceContact < 7) timing += 10
      else if (daysSinceContact < 14) timing += 5
    }

    const factors = { engagement, fit, intent, timing }
    const score = Math.min(100, engagement + fit + intent + timing)

    return { score, factors }
  }

  const addLead = () => {
    if (!leadFormData.name || !leadFormData.email || !leadFormData.company) {
      showToast('Please fill in name, email, and company', 'error')
      return
    }

    const value = parseFloat(leadFormData.value) || 0
    const probability = parseFloat(leadFormData.probability) || 0
    const expectedValue = calculateExpectedValue(value, probability)

    const leadData = {
      source: leadFormData.source,
      status: leadFormData.status,
      company: leadFormData.company,
      title: leadFormData.title,
      phone: leadFormData.phone,
      value,
      activities: [],
      lastContacted: undefined
    }

    const { score, factors } = calculateLeadScore(leadData)

    const newLead: Lead = {
      id: Date.now().toString(),
      name: leadFormData.name,
      company: leadFormData.company,
      email: leadFormData.email,
      phone: leadFormData.phone || undefined,
      title: leadFormData.title || undefined,
      source: leadFormData.source,
      status: leadFormData.status,
      value,
      probability,
      expectedValue,
      assignedTo: leadFormData.assignedTo || undefined,
      notes: leadFormData.notes || undefined,
      score,
      scoreFactors: factors,
      activities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setLeads([...leads, newLead])
    setEditingLead(null)
    resetLeadForm()
    saveToLocalStorage()
    showToast('Lead added!', 'success')
  }

  const updateLead = () => {
    if (!editingLead) return

    const value = parseFloat(leadFormData.value) || 0
    const probability = parseFloat(leadFormData.probability) || 0
    const expectedValue = calculateExpectedValue(value, probability)

    const leadData = {
      source: leadFormData.source,
      status: leadFormData.status,
      company: leadFormData.company,
      title: leadFormData.title,
      phone: leadFormData.phone,
      value,
      activities: editingLead.activities,
      lastContacted: editingLead.lastContacted
    }

    const { score, factors } = calculateLeadScore(leadData)

    const updated: Lead = {
      ...editingLead,
      name: leadFormData.name,
      company: leadFormData.company,
      email: leadFormData.email,
      phone: leadFormData.phone || undefined,
      title: leadFormData.title || undefined,
      source: leadFormData.source,
      status: leadFormData.status,
      value,
      probability,
      expectedValue,
      assignedTo: leadFormData.assignedTo || undefined,
      notes: leadFormData.notes || undefined,
      score,
      scoreFactors: factors,
      updatedAt: new Date().toISOString()
    }

    const updatedLeads = leads.map(l => l.id === editingLead.id ? updated : l)
    setLeads(updatedLeads)
    setEditingLead(null)
    resetLeadForm()
    saveToLocalStorage()
    showToast('Lead updated!', 'success')
  }

  const deleteLead = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      const updated = leads.filter(l => l.id !== id)
      setLeads(updated)
      saveToLocalStorage()
      showToast('Lead deleted', 'info')
    }
  }

  const resetLeadForm = () => {
    setLeadFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      title: '',
      source: 'website',
      status: 'new',
      value: '',
      probability: '',
      assignedTo: '',
      notes: ''
    })
  }

  const addDeal = () => {
    if (!dealFormData.name || !dealFormData.company || !dealFormData.value) {
      showToast('Please fill in name, company, and value', 'error')
      return
    }

    const value = parseFloat(dealFormData.value) || 0
    const probability = parseFloat(dealFormData.probability) || stages.find(s => s.name.toLowerCase() === dealFormData.stage.replace('-', ' '))?.probability || 50
    const expectedValue = calculateExpectedValue(value, probability)

    const newDeal: Deal = {
      id: Date.now().toString(),
      name: dealFormData.name,
      company: dealFormData.company,
      stage: dealFormData.stage,
      value,
      probability,
      expectedValue,
      closeDate: dealFormData.closeDate,
      owner: dealFormData.owner,
      source: dealFormData.source,
      notes: dealFormData.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setDeals([...deals, newDeal])
    setEditingDeal(null)
    resetDealForm()
    saveToLocalStorage()
    showToast('Deal added!', 'success')
  }

  const updateDeal = () => {
    if (!editingDeal) return

    const value = parseFloat(dealFormData.value) || 0
    const probability = parseFloat(dealFormData.probability) || stages.find(s => s.name.toLowerCase() === dealFormData.stage.replace('-', ' '))?.probability || 50
    const expectedValue = calculateExpectedValue(value, probability)

    const updated: Deal = {
      ...editingDeal,
      name: dealFormData.name,
      company: dealFormData.company,
      stage: dealFormData.stage,
      value,
      probability,
      expectedValue,
      closeDate: dealFormData.closeDate,
      owner: dealFormData.owner,
      source: dealFormData.source,
      notes: dealFormData.notes || undefined,
      updatedAt: new Date().toISOString()
    }

    const updatedDeals = deals.map(d => d.id === editingDeal.id ? updated : d)
    setDeals(updatedDeals)
    setEditingDeal(null)
    resetDealForm()
    saveToLocalStorage()
    showToast('Deal updated!', 'success')
  }

  const deleteDeal = (id: string) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      const updated = deals.filter(d => d.id !== id)
      setDeals(updated)
      saveToLocalStorage()
      showToast('Deal deleted', 'info')
    }
  }

  const resetDealForm = () => {
    setDealFormData({
      name: '',
      company: '',
      stage: 'prospecting',
      value: '',
      probability: '',
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: '',
      source: 'website',
      notes: ''
    })
  }

  const addSequence = () => {
    if (!sequenceFormData.name || sequenceSteps.length === 0) {
      showToast('Please add a name and at least one step', 'error')
      return
    }

    const newSequence: EmailSequence = {
      id: Date.now().toString(),
      name: sequenceFormData.name,
      description: sequenceFormData.description,
      status: sequenceFormData.status,
      steps: sequenceSteps,
      enrolledLeads: [],
      metrics: {
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        bounced: 0,
        unsubscribed: 0
      },
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }

    setSequences([...sequences, newSequence])
    setEditingSequence(null)
    resetSequenceForm()
    saveToLocalStorage()
    showToast('Email sequence created!', 'success')
  }

  const deleteSequence = (id: string) => {
    if (confirm('Are you sure you want to delete this sequence?')) {
      setSequences(sequences.filter(s => s.id !== id))
      saveToLocalStorage()
      showToast('Sequence deleted', 'info')
    }
  }

  const toggleSequenceStatus = (id: string) => {
    const updated = sequences.map(s => {
      if (s.id === id) {
        const newStatus: SequenceStatus = s.status === 'active' ? 'paused' : 'active'
        return { ...s, status: newStatus }
      }
      return s
    })
    setSequences(updated)
    saveToLocalStorage()
    showToast('Sequence status updated!', 'success')
  }

  const resetSequenceForm = () => {
    setSequenceFormData({
      name: '',
      description: '',
      status: 'draft'
    })
    setSequenceSteps([])
    setNewStep({
      subject: '',
      body: '',
      delay: '1',
      delayUnit: 'days'
    })
  }

  const addSequenceStep = () => {
    if (!newStep.subject || !newStep.body) {
      showToast('Please fill in subject and body', 'error')
      return
    }

    const step: EmailStep = {
      id: Date.now().toString(),
      order: sequenceSteps.length + 1,
      subject: newStep.subject,
      body: newStep.body,
      delay: parseInt(newStep.delay) || 1,
      delayUnit: newStep.delayUnit,
      status: 'pending'
    }

    setSequenceSteps([...sequenceSteps, step])
    setNewStep({
      subject: '',
      body: '',
      delay: '1',
      delayUnit: 'days'
    })
  }

  const deleteSequenceStep = (stepId: string) => {
    setSequenceSteps(sequenceSteps.filter(s => s.id !== stepId))
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus
    const matchesSource = filterSource === 'all' || lead.source === filterSource
    return matchesSearch && matchesStatus && matchesSource
  }).sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score
    if (sortBy === 'value') return b.value - a.value
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = filterStage === 'all' || deal.stage === filterStage
    const matchesSource = filterSource === 'all' || deal.source === filterSource
    return matchesSearch && matchesStage && matchesSource
  })

  const pipelineData = stages.map(stage => {
    const stageDeals = deals.filter(d => {
      const stageName = stage.name.toLowerCase().replace(' ', '-')
      return d.stage === stageName || (stageName === 'closed-won' && d.stage === 'closed-won') || (stageName === 'closed-lost' && d.stage === 'closed-lost')
    })
    return {
      stage: stage.name,
      deals: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + d.value, 0),
      expectedValue: stageDeals.reduce((sum, d) => sum + d.expectedValue, 0)
    }
  })

  const sourceDistribution = Object.entries(
    leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1
      return acc
    }, {} as Record<LeadSource, number>)
  ).map(([source, count]) => ({
    name: sourceLabels[source as LeadSource],
    value: count
  }))

  const scoreDistribution = [
    { name: 'Hot (80-100)', value: leads.filter(l => l.score >= 80).length, color: '#ef4444' },
    { name: 'Warm (50-79)', value: leads.filter(l => l.score >= 50 && l.score < 80).length, color: '#f59e0b' },
    { name: 'Cold (0-49)', value: leads.filter(l => l.score < 50).length, color: '#3b82f6' }
  ]

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0)
  const totalExpectedValue = deals.reduce((sum, d) => sum + d.expectedValue, 0)
  const wonDeals = deals.filter(d => d.stage === 'closed-won')
  const totalWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0)
  const winRate = deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0
  const averageDealSize = deals.length > 0 ? totalPipelineValue / deals.length : 0
  const hotLeads = leads.filter(l => l.score >= 80).length
  const warmLeads = leads.filter(l => l.score >= 50 && l.score < 80).length

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100'
    if (score >= 50) return 'text-orange-600 bg-orange-100'
    return 'text-blue-600 bg-blue-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Hot'
    if (score >= 50) return 'Warm'
    return 'Cold'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Sales Process Builder
              </span>
            </h1>
            <Target className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage leads with scoring, automate email sequences, and close more deals
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

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  <div className="text-sm text-gray-600">Total Pipeline</div>
                </div>
                <div className="text-2xl font-bold">${totalPipelineValue.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div className="text-sm text-gray-600">Expected Value</div>
                </div>
                <div className="text-2xl font-bold">${totalExpectedValue.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-green-500" />
                  <div className="text-sm text-gray-600">Won Deals</div>
                </div>
                <div className="text-2xl font-bold text-green-600">${totalWonValue.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="h-5 w-5 text-orange-500" />
                  <div className="text-sm text-gray-600">Win Rate</div>
                </div>
                <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
              </Card>
            </div>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Sales Pipeline</h3>
                <Button
                  onClick={() => {
                    setEditingDeal({
                      id: '',
                      name: '',
                      company: '',
                      stage: 'prospecting',
                      value: 0,
                      probability: 0,
                      expectedValue: 0,
                      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      owner: '',
                      source: 'website',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    })
                    resetDealForm()
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deal
                </Button>
              </div>
              <div className="overflow-x-auto">
                <div className="flex gap-4 min-w-max pb-4">
                  {stages.filter(s => s.name !== 'Closed Lost').map((stage) => {
                    const stageDeals = deals.filter(d => {
                      const stageName = stage.name.toLowerCase().replace(' ', '-')
                      return d.stage === stageName || 
                             (stageName === 'closed-won' && d.stage === 'closed-won')
                    })
                    return (
                      <div key={stage.id} className="w-72 shrink-0">
                        <div className="bg-gray-100 rounded-lg p-4 mb-2">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{stage.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {stageDeals.length}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            ${stageDeals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="space-y-2 min-h-[200px]">
                          {stageDeals.map((deal) => (
                            <Card
                              key={deal.id}
                              className="p-3 cursor-pointer hover:shadow-md transition-all"
                            >
                              <div onClick={() => {
                                setEditingDeal(deal)
                                setDealFormData({
                                  name: deal.name,
                                  company: deal.company,
                                  stage: deal.stage,
                                  value: deal.value.toString(),
                                  probability: deal.probability.toString(),
                                  closeDate: deal.closeDate,
                                  owner: deal.owner,
                                  source: deal.source,
                                  notes: deal.notes || ''
                                })
                              }}>
                                <div className="font-medium text-sm mb-1">{deal.name}</div>
                                <div className="text-xs text-gray-600 mb-2">{deal.company}</div>
                                <div className="font-bold text-primary-600">${deal.value.toLocaleString()}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {deal.probability}% probability
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

            {pipelineData.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Pipeline Value by Stage</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pipelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" name="Total Value ($)" />
                    <Bar dataKey="expectedValue" fill="#10b981" name="Expected Value ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Leads</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search leads..."
                    className="w-48"
                  />
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    options={[
                      { value: 'score', label: 'Sort by Score' },
                      { value: 'value', label: 'Sort by Value' },
                      { value: 'date', label: 'Sort by Date' }
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
                      setEditingLead({
                        id: '',
                        name: '',
                        company: '',
                        email: '',
                        source: 'website',
                        status: 'new',
                        value: 0,
                        probability: 0,
                        expectedValue: 0,
                        score: 0,
                        scoreFactors: { engagement: 0, fit: 0, intent: 0, timing: 0 },
                        activities: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      })
                      resetLeadForm()
                    }}
                    size="sm"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lead
                  </Button>
                </div>
              </div>

              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No leads found. Add your first lead to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead) => (
                    <Card key={lead.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={`text-sm font-bold ${getScoreColor(lead.score)}`}>
                              {lead.score} - {getScoreLabel(lead.score)}
                            </Badge>
                            <h4 className="font-semibold">{lead.name}</h4>
                            <Badge className={`text-xs ${statusColors[lead.status]}`}>
                              {statusLabels[lead.status]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {sourceLabels[lead.source]}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Company:</span> {lead.company}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span> {lead.email}
                            </div>
                            {lead.phone && (
                              <div>
                                <span className="font-medium">Phone:</span> {lead.phone}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Value:</span> ${lead.value.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Expected Value:</span> ${lead.expectedValue.toLocaleString()} ({lead.probability}% probability)
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingLead(lead)
                              setLeadFormData({
                                name: lead.name,
                                company: lead.company,
                                email: lead.email,
                                phone: lead.phone || '',
                                title: lead.title || '',
                                source: lead.source,
                                status: lead.status,
                                value: lead.value.toString(),
                                probability: lead.probability.toString(),
                                assignedTo: lead.assignedTo || '',
                                notes: lead.notes || ''
                              })
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLead(lead.id)}
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

            {editingLead && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingLead.id ? 'Edit Lead' : 'Add Lead'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingLead(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <Input
                        value={leadFormData.name}
                        onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                      <Input
                        value={leadFormData.company}
                        onChange={(e) => setLeadFormData({ ...leadFormData, company: e.target.value })}
                        placeholder="Acme Inc"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <Input
                        type="email"
                        value={leadFormData.email}
                        onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                        placeholder="john@acme.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <Input
                        type="tel"
                        value={leadFormData.phone}
                        onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
                      <Select
                        value={leadFormData.source}
                        onChange={(e) => setLeadFormData({ ...leadFormData, source: e.target.value as LeadSource })}
                        options={Object.entries(sourceLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                      <Select
                        value={leadFormData.status}
                        onChange={(e) => setLeadFormData({ ...leadFormData, status: e.target.value as LeadStatus })}
                        options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Value ($)</label>
                      <Input
                        type="number"
                        value={leadFormData.value}
                        onChange={(e) => setLeadFormData({ ...leadFormData, value: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={editingLead.id ? updateLead : addLead} className="flex-1">
                      {editingLead.id ? 'Update Lead' : 'Add Lead'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingLead(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Lead Scoring Tab */}
        {activeTab === 'scoring' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Hot Leads (80+)</div>
                    <div className="text-2xl font-bold text-red-600">{hotLeads}</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Warm Leads (50-79)</div>
                    <div className="text-2xl font-bold text-orange-600">{warmLeads}</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Leads</div>
                    <div className="text-2xl font-bold">{leads.length}</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Lead Score Distribution</h3>
                {scoreDistribution.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={scoreDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Star className="h-12 w-12 mx-auto mb-2" />
                    <p>No leads to analyze</p>
                  </div>
                )}
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Scoring Criteria</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium">Engagement (0-25 pts)</h4>
                    </div>
                    <p className="text-sm text-gray-600">Based on activities, interactions, and response rate</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">Fit (0-25 pts)</h4>
                    </div>
                    <p className="text-sm text-gray-600">Company size, title, industry match, and completeness of profile</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-green-500" />
                      <h4 className="font-medium">Intent (0-25 pts)</h4>
                    </div>
                    <p className="text-sm text-gray-600">Lead source quality, status progression, and expressed interest</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <h4 className="font-medium">Timing (0-25 pts)</h4>
                    </div>
                    <p className="text-sm text-gray-600">Deal value, recency of contact, and urgency indicators</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <h3 className="font-semibold mb-4">Top Scored Leads</h3>
              {leads.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Star className="h-16 w-16 mx-auto mb-4" />
                  <p>No leads yet. Add leads to see scoring.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leads
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10)
                    .map((lead, idx) => (
                      <div key={lead.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{lead.name}</span>
                            <Badge className={`text-xs ${statusColors[lead.status]}`}>
                              {statusLabels[lead.status]}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">{lead.company} | ${lead.value.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <Badge className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                            {lead.score}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">{getScoreLabel(lead.score)}</div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs text-center">
                          <div>
                            <div className="font-medium">{lead.scoreFactors.engagement}</div>
                            <div className="text-gray-500">Eng</div>
                          </div>
                          <div>
                            <div className="font-medium">{lead.scoreFactors.fit}</div>
                            <div className="text-gray-500">Fit</div>
                          </div>
                          <div>
                            <div className="font-medium">{lead.scoreFactors.intent}</div>
                            <div className="text-gray-500">Int</div>
                          </div>
                          <div>
                            <div className="font-medium">{lead.scoreFactors.timing}</div>
                            <div className="text-gray-500">Tim</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Email Sequences Tab */}
        {activeTab === 'sequences' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Email Sequences</h2>
                </div>
                <Button
                  onClick={() => {
                    setEditingSequence({
                      id: '',
                      name: '',
                      description: '',
                      status: 'draft',
                      steps: [],
                      enrolledLeads: [],
                      metrics: { sent: 0, opened: 0, clicked: 0, replied: 0, bounced: 0, unsubscribed: 0 },
                      created: new Date().toISOString(),
                      modified: new Date().toISOString()
                    })
                    resetSequenceForm()
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Sequence
                </Button>
              </div>

              {sequences.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Mail className="h-16 w-16 mx-auto mb-4" />
                  <p>No email sequences yet. Create your first sequence to automate outreach.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sequences.map((sequence) => (
                    <Card key={sequence.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold">{sequence.name}</h4>
                            <Badge className={`text-xs ${sequenceStatusColors[sequence.status]}`}>
                              {sequence.status.charAt(0).toUpperCase() + sequence.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{sequence.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSequenceStatus(sequence.id)}
                          >
                            {sequence.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSequence(sequence.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center text-sm mb-4">
                        <div>
                          <div className="text-lg font-bold">{sequence.metrics.sent}</div>
                          <div className="text-gray-500">Sent</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">{sequence.metrics.opened}</div>
                          <div className="text-gray-500">Opened</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{sequence.metrics.clicked}</div>
                          <div className="text-gray-500">Clicked</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{sequence.metrics.replied}</div>
                          <div className="text-gray-500">Replied</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-600">{sequence.metrics.bounced}</div>
                          <div className="text-gray-500">Bounced</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{sequence.enrolledLeads.length}</div>
                          <div className="text-gray-500">Enrolled</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {sequence.steps.map((step, idx) => (
                          <React.Fragment key={step.id}>
                            <div className="shrink-0 p-2 bg-gray-100 rounded-lg text-center min-w-[120px]">
                              <div className="text-xs text-gray-500 mb-1">Step {idx + 1}</div>
                              <div className="text-sm font-medium truncate">{step.subject}</div>
                            </div>
                            {idx < sequence.steps.length - 1 && (
                              <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {editingSequence && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create Email Sequence</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingSequence(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sequence Name *</label>
                      <Input
                        value={sequenceFormData.name}
                        onChange={(e) => setSequenceFormData({ ...sequenceFormData, name: e.target.value })}
                        placeholder="e.g., Cold Outreach Sequence"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <Select
                        value={sequenceFormData.status}
                        onChange={(e) => setSequenceFormData({ ...sequenceFormData, status: e.target.value as SequenceStatus })}
                        options={[
                          { value: 'draft', label: 'Draft' },
                          { value: 'active', label: 'Active' },
                          { value: 'paused', label: 'Paused' }
                        ]}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={2}
                      value={sequenceFormData.description}
                      onChange={(e) => setSequenceFormData({ ...sequenceFormData, description: e.target.value })}
                      placeholder="Brief description..."
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">Add Email Step</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                        <Input
                          value={newStep.subject}
                          onChange={(e) => setNewStep({ ...newStep, subject: e.target.value })}
                          placeholder="e.g., Quick question about {{company}}"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
                        <textarea
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                          rows={4}
                          value={newStep.body}
                          onChange={(e) => setNewStep({ ...newStep, body: e.target.value })}
                          placeholder="Hi {{name}},\n\nI noticed that..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Delay</label>
                          <Input
                            type="number"
                            value={newStep.delay}
                            onChange={(e) => setNewStep({ ...newStep, delay: e.target.value })}
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                          <Select
                            value={newStep.delayUnit}
                            onChange={(e) => setNewStep({ ...newStep, delayUnit: e.target.value as typeof newStep.delayUnit })}
                            options={[
                              { value: 'hours', label: 'Hours' },
                              { value: 'days', label: 'Days' },
                              { value: 'weeks', label: 'Weeks' }
                            ]}
                          />
                        </div>
                      </div>
                      <Button variant="outline" onClick={addSequenceStep} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Step
                      </Button>
                    </div>
                  </div>

                  {sequenceSteps.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-4">Sequence Steps ({sequenceSteps.length})</h4>
                      <div className="space-y-2">
                        {sequenceSteps.map((step, idx) => (
                          <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold shrink-0">
                                {idx + 1}
                              </div>
                              <div>
                                <div className="font-medium">{step.subject}</div>
                                <div className="text-sm text-gray-600">
                                  {idx === 0 ? 'Send immediately' : `Wait ${step.delay} ${step.delayUnit}`}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSequenceStep(step.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={addSequence} className="flex-1" disabled={sequenceSteps.length === 0}>
                      Create Sequence
                    </Button>
                    <Button variant="outline" onClick={() => setEditingSequence(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Sales Scripts Tab */}
        {activeTab === 'scripts' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Sales Scripts Library</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {scripts.map((script) => (
                  <Card
                    key={script.id}
                    className="p-4 cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div onClick={() => setSelectedScript(script)}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary-500/10 text-primary-600 p-2 rounded-lg">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{script.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {scriptTypeLabels[script.type]}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{script.script.substring(0, 100)}...</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>{script.objections.length} objections</span>
                        <span>{script.tips.length} tips</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {selectedScript && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedScript.name}</h3>
                    <Badge variant="outline" className="mt-1">{scriptTypeLabels[selectedScript.type]}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedScript.script)
                        showToast('Script copied!', 'success')
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Script
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedScript(null)}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Script</h4>
                    <pre className="p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap font-sans">
                      {selectedScript.script}
                    </pre>
                  </div>
                  {selectedScript.objections.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Objection Handlers</h4>
                      <div className="space-y-3">
                        {selectedScript.objections.map((obj, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-2 mb-2">
                              <ThumbsDown className="h-4 w-4 text-red-500 mt-1 shrink-0" />
                              <div className="font-medium text-red-700">{obj.objection}</div>
                            </div>
                            <div className="flex items-start gap-2 ml-6">
                              <ThumbsUp className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                              <div className="text-green-700">{obj.response}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedScript.tips.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tips</h4>
                      <ul className="space-y-2">
                        {selectedScript.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Proposals Tab */}
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Proposal Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposals.map((proposal) => (
                  <Card key={proposal.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{proposal.name}</h4>
                        <p className="text-sm text-gray-600">{proposal.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Use
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500">
                      {proposal.sections.length} sections: {proposal.sections.map(s => s.title).join(', ')}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Forecast Tab */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Sales Forecast</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Forecasted Revenue</div>
                  <div className="text-2xl font-bold">${totalExpectedValue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1">Based on current pipeline</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Average Deal Size</div>
                  <div className="text-2xl font-bold">${averageDealSize.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1">Across all deals</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Deals</div>
                  <div className="text-2xl font-bold">{deals.length}</div>
                  <div className="text-xs text-gray-500 mt-1">In pipeline</div>
                </Card>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-3">Forecast Calculation</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Forecasted Revenue = Sum of (Deal Value × Probability) for all deals
                </p>
                <div className="text-sm">
                  <div className="font-medium">Current Forecast:</div>
                  <div className="text-lg font-bold text-primary-600">
                    ${totalExpectedValue.toLocaleString()}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Leads</div>
                <div className="text-2xl font-bold">{leads.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Deals</div>
                <div className="text-2xl font-bold">{deals.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Won Deals</div>
                <div className="text-2xl font-bold text-green-600">
                  {deals.filter(d => d.stage === 'closed-won').length}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Win Rate</div>
                <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
              </Card>
            </div>

            {sourceDistribution.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Lead Source Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={sourceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* Deal Edit Modal */}
        {editingDeal && (
          <Card className="p-6 fixed inset-4 md:inset-auto md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingDeal.id ? 'Edit Deal' : 'Add Deal'}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setEditingDeal(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Name *</label>
                  <Input
                    value={dealFormData.name}
                    onChange={(e) => setDealFormData({ ...dealFormData, name: e.target.value })}
                    placeholder="e.g., Enterprise License"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                  <Input
                    value={dealFormData.company}
                    onChange={(e) => setDealFormData({ ...dealFormData, company: e.target.value })}
                    placeholder="Acme Inc"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stage *</label>
                  <Select
                    value={dealFormData.stage}
                    onChange={(e) => setDealFormData({ ...dealFormData, stage: e.target.value as DealStage })}
                    options={Object.entries(stageLabels).map(([value, label]) => ({ value, label }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value ($) *</label>
                  <Input
                    type="number"
                    value={dealFormData.value}
                    onChange={(e) => setDealFormData({ ...dealFormData, value: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Close Date</label>
                  <Input
                    type="date"
                    value={dealFormData.closeDate}
                    onChange={(e) => setDealFormData({ ...dealFormData, closeDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={editingDeal.id ? updateDeal : addDeal} className="flex-1">
                  {editingDeal.id ? 'Update Deal' : 'Add Deal'}
                </Button>
                <Button variant="outline" onClick={() => setEditingDeal(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
        {editingDeal && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setEditingDeal(null)} />}
      </div>
    </main>
  )
}
