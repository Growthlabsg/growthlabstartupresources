'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Mail,
  Send,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Copy,
  Eye,
  MailOpen,
  MousePointerClick,
  Clock,
  Calendar,
  FileText,
  Sparkles,
  BarChart3,
  Play,
  Pause,
  Zap,
  AlertCircle
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

type CampaignType = 'newsletter' | 'promotional' | 'drip' | 'transactional' | 'welcome' | 'reengagement'
type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'

interface EmailCampaign {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  subject: string
  preheader: string
  content: string
  recipients: number
  scheduledDate?: string
  sentDate?: string
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    unsubscribed: number
    openRate: number
    clickRate: number
    bounceRate: number
  }
  tags: string[]
  created: string
  modified: string
}

interface EmailTemplate {
  id: string
  name: string
  type: CampaignType
  subject: string
  preheader: string
  content: string
  created: string
}

interface Subscriber {
  id: string
  email: string
  name: string
  status: 'active' | 'unsubscribed' | 'bounced'
  tags: string[]
  subscribedDate: string
  lastEmailDate?: string
}

const campaignTypeLabels: Record<CampaignType, string> = {
  'newsletter': 'Newsletter',
  'promotional': 'Promotional',
  'drip': 'Drip Campaign',
  'transactional': 'Transactional',
  'welcome': 'Welcome Series',
  'reengagement': 'Re-engagement'
}

const statusLabels: Record<CampaignStatus, string> = {
  'draft': 'Draft',
  'scheduled': 'Scheduled',
  'sending': 'Sending',
  'sent': 'Sent',
  'paused': 'Paused'
}

const statusColors: Record<CampaignStatus, string> = {
  'draft': 'bg-gray-100 text-gray-800',
  'scheduled': 'bg-blue-100 text-blue-800',
  'sending': 'bg-yellow-100 text-yellow-800',
  'sent': 'bg-green-100 text-green-800',
  'paused': 'bg-orange-100 text-orange-800'
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    type: 'welcome',
    subject: 'Welcome to {{company_name}}! 🎉',
    preheader: 'We\'re excited to have you on board',
    content: `Hi {{first_name}},

Welcome to {{company_name}}! We're thrilled to have you join our community.

Here's what you can expect:
• Regular updates on new features
• Tips to get the most out of our product
• Exclusive offers for our subscribers

To get started, check out our quick start guide: {{getting_started_link}}

If you have any questions, just reply to this email – we're always here to help!

Best,
The {{company_name}} Team`,
    created: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Monthly Newsletter',
    type: 'newsletter',
    subject: '📬 {{month}} Newsletter: What\'s New at {{company_name}}',
    preheader: 'Your monthly dose of updates and insights',
    content: `Hi {{first_name}},

Here's what's been happening at {{company_name}} this month:

📢 ANNOUNCEMENTS
{{announcements}}

💡 TIPS & TRICKS
{{tips}}

📊 BY THE NUMBERS
{{stats}}

🔗 QUICK LINKS
• Blog: {{blog_link}}
• Help Center: {{help_link}}
• Contact Us: {{contact_link}}

Thanks for being part of our community!

Best,
The {{company_name}} Team`,
    created: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Promotional Offer',
    type: 'promotional',
    subject: '🔥 Limited Time: {{discount}}% Off Everything!',
    preheader: 'Don\'t miss this exclusive offer',
    content: `Hi {{first_name}},

We've got something special for you! 

For a limited time, get {{discount}}% off your next purchase with code: {{promo_code}}

🛒 Shop Now: {{shop_link}}

Offer expires: {{expiry_date}}

Don't wait – this deal won't last forever!

Best,
The {{company_name}} Team`,
    created: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Re-engagement Email',
    type: 'reengagement',
    subject: 'We miss you, {{first_name}}! 💔',
    preheader: 'It\'s been a while – here\'s what you\'ve missed',
    content: `Hi {{first_name}},

It's been a while since we've seen you, and we wanted to check in.

Here's what's new since your last visit:
{{updates}}

As a special welcome back offer, here's {{discount}}% off your next purchase: {{promo_code}}

We'd love to see you again!

Best,
The {{company_name}} Team`,
    created: new Date().toISOString()
  }
]

export default function EmailMarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null)
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'newsletter' as CampaignType,
    subject: '',
    preheader: '',
    content: '',
    recipients: '',
    scheduledDate: '',
    tags: ''
  })
  const [subscriberForm, setSubscriberForm] = useState({
    email: '',
    name: '',
    tags: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', icon: Mail },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'subscribers', label: 'Subscribers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('emailMarketingData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.campaigns) setCampaigns(data.campaigns)
          if (data.templates) setTemplates(data.templates.length > 0 ? data.templates : defaultTemplates)
          if (data.subscribers) setSubscribers(data.subscribers)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        campaigns,
        templates,
        subscribers,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('emailMarketingData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const addCampaign = () => {
    if (!campaignForm.name || !campaignForm.subject) {
      showToast('Please fill in name and subject', 'error')
      return
    }

    const newCampaign: EmailCampaign = {
      id: Date.now().toString(),
      name: campaignForm.name,
      type: campaignForm.type,
      status: 'draft',
      subject: campaignForm.subject,
      preheader: campaignForm.preheader,
      content: campaignForm.content,
      recipients: parseInt(campaignForm.recipients) || 0,
      scheduledDate: campaignForm.scheduledDate || undefined,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0
      },
      tags: campaignForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }

    setCampaigns([...campaigns, newCampaign])
    setEditingCampaign(null)
    resetCampaignForm()
    saveToLocalStorage()
    showToast('Campaign created!', 'success')
  }

  const updateCampaignStatus = (id: string, status: CampaignStatus) => {
    const updated = campaigns.map(c => {
      if (c.id === id) {
        let metrics = { ...c.metrics }
        if (status === 'sent' && c.status !== 'sent') {
          // Simulate sending with random metrics
          const sent = c.recipients || 100
          const delivered = Math.floor(sent * (0.95 + Math.random() * 0.04))
          const opened = Math.floor(delivered * (0.2 + Math.random() * 0.3))
          const clicked = Math.floor(opened * (0.1 + Math.random() * 0.2))
          const bounced = sent - delivered
          const unsubscribed = Math.floor(sent * Math.random() * 0.02)
          
          metrics = {
            sent,
            delivered,
            opened,
            clicked,
            bounced,
            unsubscribed,
            openRate: (opened / delivered) * 100,
            clickRate: (clicked / opened) * 100 || 0,
            bounceRate: (bounced / sent) * 100
          }
        }
        return { ...c, status, metrics, sentDate: status === 'sent' ? new Date().toISOString() : c.sentDate }
      }
      return c
    })
    setCampaigns(updated)
    saveToLocalStorage()
    showToast(`Campaign ${status === 'sent' ? 'sent' : 'updated'}!`, 'success')
  }

  const deleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== id))
      if (selectedCampaign?.id === id) setSelectedCampaign(null)
      saveToLocalStorage()
      showToast('Campaign deleted', 'info')
    }
  }

  const resetCampaignForm = () => {
    setCampaignForm({
      name: '',
      type: 'newsletter',
      subject: '',
      preheader: '',
      content: '',
      recipients: '',
      scheduledDate: '',
      tags: ''
    })
  }

  const useTemplate = (template: EmailTemplate) => {
    setEditingCampaign({
      id: '',
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
      type: template.type,
      status: 'draft',
      subject: template.subject,
      preheader: template.preheader,
      content: template.content,
      recipients: 0,
      metrics: {
        sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0,
        openRate: 0, clickRate: 0, bounceRate: 0
      },
      tags: [],
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    })
    setCampaignForm({
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
      type: template.type,
      subject: template.subject,
      preheader: template.preheader,
      content: template.content,
      recipients: '',
      scheduledDate: '',
      tags: ''
    })
    setActiveTab('campaigns')
    showToast('Template loaded!', 'success')
  }

  const addSubscriber = () => {
    if (!subscriberForm.email) {
      showToast('Please enter an email', 'error')
      return
    }

    const newSubscriber: Subscriber = {
      id: Date.now().toString(),
      email: subscriberForm.email,
      name: subscriberForm.name,
      status: 'active',
      tags: subscriberForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      subscribedDate: new Date().toISOString()
    }

    setSubscribers([...subscribers, newSubscriber])
    setSubscriberForm({ email: '', name: '', tags: '' })
    saveToLocalStorage()
    showToast('Subscriber added!', 'success')
  }

  const updateSubscriberStatus = (id: string, status: Subscriber['status']) => {
    setSubscribers(subscribers.map(s => s.id === id ? { ...s, status } : s))
    saveToLocalStorage()
    showToast('Subscriber updated!', 'success')
  }

  const deleteSubscriber = (id: string) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      setSubscribers(subscribers.filter(s => s.id !== id))
      saveToLocalStorage()
      showToast('Subscriber deleted', 'info')
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || campaign.type === filterType
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  // Analytics data
  const sentCampaigns = campaigns.filter(c => c.status === 'sent')
  const totalSent = sentCampaigns.reduce((sum, c) => sum + c.metrics.sent, 0)
  const totalOpened = sentCampaigns.reduce((sum, c) => sum + c.metrics.opened, 0)
  const totalClicked = sentCampaigns.reduce((sum, c) => sum + c.metrics.clicked, 0)
  const avgOpenRate = sentCampaigns.length > 0
    ? sentCampaigns.reduce((sum, c) => sum + c.metrics.openRate, 0) / sentCampaigns.length
    : 0
  const avgClickRate = sentCampaigns.length > 0
    ? sentCampaigns.reduce((sum, c) => sum + c.metrics.clickRate, 0) / sentCampaigns.length
    : 0

  const campaignPerformanceData = sentCampaigns.slice(-10).map(c => ({
    name: c.name.substring(0, 15) + (c.name.length > 15 ? '...' : ''),
    openRate: c.metrics.openRate,
    clickRate: c.metrics.clickRate
  }))

  const campaignTypeData = Object.entries(
    campaigns.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1
      return acc
    }, {} as Record<CampaignType, number>)
  ).map(([type, count]) => ({
    name: campaignTypeLabels[type as CampaignType],
    value: count
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Email Marketing Hub
              </span>
            </h1>
            <Mail className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create, send, and analyze email campaigns to engage your audience
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={saveToLocalStorage}>
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">Email Campaigns</h2>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search campaigns..."
                    className="w-48"
                  />
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Types' },
                      ...Object.entries(campaignTypeLabels).map(([value, label]) => ({ value, label }))
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
                      setEditingCampaign({
                        id: '',
                        name: '',
                        type: 'newsletter',
                        status: 'draft',
                        subject: '',
                        preheader: '',
                        content: '',
                        recipients: 0,
                        metrics: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0, openRate: 0, clickRate: 0, bounceRate: 0 },
                        tags: [],
                        created: new Date().toISOString(),
                        modified: new Date().toISOString()
                      })
                      resetCampaignForm()
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Campaign
                  </Button>
                </div>
              </div>

              {filteredCampaigns.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Mail className="h-16 w-16 mx-auto mb-4" />
                  <p className="mb-4">No campaigns found. Create your first campaign or use a template.</p>
                  <Button variant="outline" onClick={() => setActiveTab('templates')}>
                    Browse Templates
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCampaigns.map((campaign) => (
                    <Card key={campaign.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{campaign.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {campaignTypeLabels[campaign.type]}
                            </Badge>
                            <Badge className={`text-xs ${statusColors[campaign.status]}`}>
                              {statusLabels[campaign.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
                          {campaign.status === 'sent' && (
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Sent:</span>{' '}
                                <span className="font-medium">{campaign.metrics.sent.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Open Rate:</span>{' '}
                                <span className="font-medium text-blue-600">{campaign.metrics.openRate.toFixed(1)}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Click Rate:</span>{' '}
                                <span className="font-medium text-green-600">{campaign.metrics.clickRate.toFixed(1)}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Bounce Rate:</span>{' '}
                                <span className="font-medium text-red-600">{campaign.metrics.bounceRate.toFixed(1)}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {campaign.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateCampaignStatus(campaign.id, 'sent')}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCampaign(campaign)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCampaign(campaign.id)}
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

            {/* Campaign Detail View */}
            {selectedCampaign && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedCampaign.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{campaignTypeLabels[selectedCampaign.type]}</Badge>
                      <Badge className={statusColors[selectedCampaign.status]}>
                        {statusLabels[selectedCampaign.status]}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCampaign(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>

                {selectedCampaign.status === 'sent' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card className="p-4 text-center">
                      <Send className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">{selectedCampaign.metrics.sent}</div>
                      <div className="text-sm text-gray-500">Sent</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <MailOpen className="h-6 w-6 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">{selectedCampaign.metrics.openRate.toFixed(1)}%</div>
                      <div className="text-sm text-gray-500">Open Rate</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <MousePointerClick className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold">{selectedCampaign.metrics.clickRate.toFixed(1)}%</div>
                      <div className="text-sm text-gray-500">Click Rate</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                      <div className="text-2xl font-bold">{selectedCampaign.metrics.bounceRate.toFixed(1)}%</div>
                      <div className="text-sm text-gray-500">Bounce Rate</div>
                    </Card>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Subject</div>
                    <div className="font-medium">{selectedCampaign.subject}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Preheader</div>
                    <div className="text-gray-600">{selectedCampaign.preheader}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Content</div>
                    <pre className="p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap font-sans">
                      {selectedCampaign.content}
                    </pre>
                  </div>
                </div>
              </Card>
            )}

            {/* New Campaign Form */}
            {editingCampaign && !editingCampaign.id && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create Campaign</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingCampaign(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name *</label>
                      <Input
                        value={campaignForm.name}
                        onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                        placeholder="e.g., March Newsletter"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <Select
                        value={campaignForm.type}
                        onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value as CampaignType })}
                        options={Object.entries(campaignTypeLabels).map(([value, label]) => ({ value, label }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line *</label>
                    <Input
                      value={campaignForm.subject}
                      onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                      placeholder="Your compelling subject line"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preheader</label>
                    <Input
                      value={campaignForm.preheader}
                      onChange={(e) => setCampaignForm({ ...campaignForm, preheader: e.target.value })}
                      placeholder="Preview text that appears after subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={10}
                      value={campaignForm.content}
                      onChange={(e) => setCampaignForm({ ...campaignForm, content: e.target.value })}
                      placeholder="Your email content... Use {{variable}} for personalization"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                      <Input
                        type="number"
                        value={campaignForm.recipients}
                        onChange={(e) => setCampaignForm({ ...campaignForm, recipients: e.target.value })}
                        placeholder="Number of recipients"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule (optional)</label>
                      <Input
                        type="datetime-local"
                        value={campaignForm.scheduledDate}
                        onChange={(e) => setCampaignForm({ ...campaignForm, scheduledDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addCampaign} className="flex-1">
                      Create Campaign
                    </Button>
                    <Button variant="outline" onClick={() => setEditingCampaign(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Email Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {campaignTypeLabels[template.type]}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => useTemplate(template)}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Use
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Subject:</strong> {template.subject}
                    </div>
                    <pre className="p-3 bg-gray-50 rounded text-xs text-gray-600 whitespace-pre-wrap font-sans line-clamp-4">
                      {template.content}
                    </pre>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Subscribers</h2>
                <div className="text-sm text-gray-600">
                  {subscribers.filter(s => s.status === 'active').length} active of {subscribers.length} total
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Input
                  value={subscriberForm.email}
                  onChange={(e) => setSubscriberForm({ ...subscriberForm, email: e.target.value })}
                  placeholder="Email address"
                />
                <Input
                  value={subscriberForm.name}
                  onChange={(e) => setSubscriberForm({ ...subscriberForm, name: e.target.value })}
                  placeholder="Name (optional)"
                />
                <Button onClick={addSubscriber}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subscriber
                </Button>
              </div>

              {subscribers.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p>No subscribers yet. Add your first subscriber above.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {subscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{subscriber.email}</div>
                        {subscriber.name && <div className="text-sm text-gray-600">{subscriber.name}</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${
                          subscriber.status === 'active' ? 'bg-green-100 text-green-800' :
                          subscriber.status === 'bounced' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {subscriber.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSubscriber(subscriber.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
                <div className="flex items-center gap-2 mb-2">
                  <Send className="h-5 w-5 text-blue-500" />
                  <div className="text-sm text-gray-600">Total Sent</div>
                </div>
                <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MailOpen className="h-5 w-5 text-green-500" />
                  <div className="text-sm text-gray-600">Total Opened</div>
                </div>
                <div className="text-2xl font-bold">{totalOpened.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  <div className="text-sm text-gray-600">Avg Open Rate</div>
                </div>
                <div className="text-2xl font-bold text-green-600">{avgOpenRate.toFixed(1)}%</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointerClick className="h-5 w-5 text-orange-500" />
                  <div className="text-sm text-gray-600">Avg Click Rate</div>
                </div>
                <div className="text-2xl font-bold">{avgClickRate.toFixed(1)}%</div>
              </Card>
            </div>

            {campaignPerformanceData.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Campaign Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={campaignPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={10} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="openRate" fill="#3b82f6" name="Open Rate (%)" />
                    <Bar dataKey="clickRate" fill="#10b981" name="Click Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {campaignTypeData.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Campaigns by Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={campaignTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {campaignTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

