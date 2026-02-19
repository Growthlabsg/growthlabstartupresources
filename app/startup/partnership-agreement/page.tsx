'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import React from 'react'
import { 
  Users, 
  Save, 
  Download, 
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  Copy,
  Share2,
  Printer,
  History,
  BarChart3,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  Calendar,
  GitBranch,
  FileCheck,
  DollarSign,
  Percent,
  TrendingUp
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

type PartnershipType = 'general' | 'limited' | 'llp' | 'joint-venture' | 'strategic-alliance' | 'distribution' | 'technology'
type PartnershipStatus = 'draft' | 'active' | 'pending' | 'terminated' | 'expired'

interface Partner {
  name: string
  contribution: string
  ownership: number
  role: string
  responsibilities: string[]
}

interface Partnership {
  id: string
  title: string
  type: PartnershipType
  status: PartnershipStatus
  partners: Partner[]
  partnershipName: string
  effectiveDate: string
  term: number
  expirationDate: string
  jurisdiction: string
  capitalContributions: Record<string, number>
  profitSharing: Record<string, number>
  management: string
  decisionMaking: string
  disputeResolution: string
  termination: string
  dissolution: string
  created: string
  modified: string
  notes?: string
}

const partnershipTemplates: Record<PartnershipType, {
  name: string
  description: string
  defaultTerm: number
  defaultJurisdiction: string
}> = {
  'general': {
    name: 'General Partnership',
    description: 'Partners share equal rights and responsibilities in managing the business',
    defaultTerm: 5,
    defaultJurisdiction: 'United States'
  },
  'limited': {
    name: 'Limited Partnership',
    description: 'Partnership with general and limited partners',
    defaultTerm: 5,
    defaultJurisdiction: 'United States'
  },
  'llp': {
    name: 'Limited Liability Partnership (LLP)',
    description: 'Partners have limited liability protection',
    defaultTerm: 5,
    defaultJurisdiction: 'United States'
  },
  'joint-venture': {
    name: 'Joint Venture',
    description: 'Partnership for a specific project or business opportunity',
    defaultTerm: 3,
    defaultJurisdiction: 'United States'
  },
  'strategic-alliance': {
    name: 'Strategic Alliance',
    description: 'Partnership for strategic business collaboration',
    defaultTerm: 3,
    defaultJurisdiction: 'United States'
  },
  'distribution': {
    name: 'Distribution Partnership',
    description: 'Partnership for product distribution and sales',
    defaultTerm: 3,
    defaultJurisdiction: 'United States'
  },
  'technology': {
    name: 'Technology Partnership',
    description: 'Partnership for technology development and licensing',
    defaultTerm: 5,
    defaultJurisdiction: 'United States'
  }
}

export default function PartnershipAgreementPage() {
  const [activeTab, setActiveTab] = useState('generator')
  const [partnerships, setPartnerships] = useState<Partnership[]>([])
  const [currentPartnership, setCurrentPartnership] = useState<Partnership | null>(null)
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'general' as PartnershipType,
    partnershipName: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    term: '5',
    jurisdiction: 'United States',
    partners: [] as Partner[],
    management: '',
    decisionMaking: '',
    disputeResolution: '',
    termination: '',
    dissolution: '',
    notes: ''
  })
  const [newPartner, setNewPartner] = useState({
    name: '',
    contribution: '',
    ownership: '',
    role: '',
    responsibilities: [] as string[]
  })
  const [newResponsibility, setNewResponsibility] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [comparingPartnerships, setComparingPartnerships] = useState<string[]>([])
  const [partnershipHistory, setPartnershipHistory] = useState<Record<string, Partnership[]>>({})
  const [partnershipAnalytics, setPartnershipAnalytics] = useState<Record<string, {
    views: number
    edits: number
    exports: number
    lastAccessed: string
  }>>({})

  const tabs = [
    { id: 'generator', label: 'Generator', icon: Users },
    { id: 'documents', label: 'My Partnerships', icon: FileText },
    { id: 'templates', label: 'Templates', icon: FileCheck },
    { id: 'compare', label: 'Compare', icon: GitBranch },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('partnershipAgreementData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.partnerships) setPartnerships(data.partnerships)
          if (data.history) setPartnershipHistory(data.history)
          if (data.analytics) setPartnershipAnalytics(data.analytics)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        partnerships,
        history: partnershipHistory,
        analytics: partnershipAnalytics,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('partnershipAgreementData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const saveAnalytics = (partnershipId: string, action: 'view' | 'edit' | 'export') => {
    const analytics = partnershipAnalytics[partnershipId] || {
      views: 0,
      edits: 0,
      exports: 0,
      lastAccessed: new Date().toISOString()
    }
    
    if (action === 'view') analytics.views++
    if (action === 'edit') analytics.edits++
    if (action === 'export') analytics.exports++
    analytics.lastAccessed = new Date().toISOString()
    
    const updated = { ...partnershipAnalytics, [partnershipId]: analytics }
    setPartnershipAnalytics(updated)
    saveToLocalStorage()
  }

  const calculateOwnership = (partners: Partner[]): Record<string, number> => {
    const total = partners.reduce((sum, p) => sum + (parseFloat(p.ownership.toString()) || 0), 0)
    if (total === 0) {
      // Equal distribution if no ownership specified
      const equal = 100 / partners.length
      return partners.reduce((acc, p) => ({ ...acc, [p.name]: equal }), {})
    }
    return partners.reduce((acc, p) => ({
      ...acc,
      [p.name]: parseFloat(p.ownership.toString()) || 0
    }), {})
  }

  const generatePartnership = () => {
    if (formData.partners.length < 2) {
      showToast('Please add at least 2 partners', 'error')
      return
    }

    const term = parseInt(formData.term) || 5
    const effectiveDate = new Date(formData.effectiveDate)
    const expirationDate = new Date(effectiveDate)
    expirationDate.setFullYear(expirationDate.getFullYear() + term)

    const ownership = calculateOwnership(formData.partners)
    const capitalContributions: Record<string, number> = {}
    const profitSharing: Record<string, number> = {}

    formData.partners.forEach(partner => {
      capitalContributions[partner.name] = parseFloat(partner.contribution) || 0
      profitSharing[partner.name] = ownership[partner.name] || 0
    })

    const newPartnership: Partnership = {
      id: Date.now().toString(),
      title: formData.title || `${formData.type} Partnership - ${formData.partnershipName}`,
      type: formData.type,
      status: 'draft',
      partners: formData.partners,
      partnershipName: formData.partnershipName,
      effectiveDate: formData.effectiveDate,
      term,
      expirationDate: expirationDate.toISOString().split('T')[0],
      jurisdiction: formData.jurisdiction,
      capitalContributions,
      profitSharing,
      management: formData.management,
      decisionMaking: formData.decisionMaking,
      disputeResolution: formData.disputeResolution,
      termination: formData.termination,
      dissolution: formData.dissolution,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      notes: formData.notes
    }

    setPartnerships([...partnerships, newPartnership])
    setCurrentPartnership(newPartnership)
    setEditingPartnership(newPartnership)
    saveToLocalStorage()
    saveAnalytics(newPartnership.id, 'view')
    showToast('Partnership agreement generated successfully!', 'success')
  }

  const loadTemplate = (type: PartnershipType) => {
    const template = partnershipTemplates[type]
    setFormData({
      ...formData,
      type,
      term: template.defaultTerm.toString(),
      jurisdiction: template.defaultJurisdiction
    })
    showToast(`${template.name} template loaded!`, 'success')
  }

  const addPartner = () => {
    if (!newPartner.name) {
      showToast('Please enter partner name', 'error')
      return
    }

    const ownership = parseFloat(newPartner.ownership) || 0
    const partner: Partner = {
      name: newPartner.name,
      contribution: newPartner.contribution,
      ownership,
      role: newPartner.role,
      responsibilities: newPartner.responsibilities
    }

    setFormData({
      ...formData,
      partners: [...formData.partners, partner]
    })

    setNewPartner({
      name: '',
      contribution: '',
      ownership: '',
      role: '',
      responsibilities: []
    })
    showToast('Partner added!', 'success')
  }

  const removePartner = (index: number) => {
    const updated = formData.partners.filter((_, i) => i !== index)
    setFormData({ ...formData, partners: updated })
    showToast('Partner removed', 'info')
  }

  const updatePartnership = () => {
    if (!editingPartnership) return

    if (formData.partners.length < 2) {
      showToast('Please add at least 2 partners', 'error')
      return
    }

    const term = parseInt(formData.term) || editingPartnership.term
    const effectiveDate = new Date(formData.effectiveDate || editingPartnership.effectiveDate)
    const expirationDate = new Date(effectiveDate)
    expirationDate.setFullYear(expirationDate.getFullYear() + term)

    const ownership = calculateOwnership(formData.partners)
    const capitalContributions: Record<string, number> = {}
    const profitSharing: Record<string, number> = {}

    formData.partners.forEach(partner => {
      capitalContributions[partner.name] = parseFloat(partner.contribution) || 0
      profitSharing[partner.name] = ownership[partner.name] || 0
    })

    const updated: Partnership = {
      ...editingPartnership,
      title: formData.title || editingPartnership.title,
      type: formData.type,
      partners: formData.partners,
      partnershipName: formData.partnershipName || editingPartnership.partnershipName,
      effectiveDate: formData.effectiveDate || editingPartnership.effectiveDate,
      term,
      expirationDate: expirationDate.toISOString().split('T')[0],
      jurisdiction: formData.jurisdiction || editingPartnership.jurisdiction,
      capitalContributions,
      profitSharing,
      management: formData.management || editingPartnership.management,
      decisionMaking: formData.decisionMaking || editingPartnership.decisionMaking,
      disputeResolution: formData.disputeResolution || editingPartnership.disputeResolution,
      termination: formData.termination || editingPartnership.termination,
      dissolution: formData.dissolution || editingPartnership.dissolution,
      modified: new Date().toISOString(),
      notes: formData.notes
    }

    // Save to history
    const history = partnershipHistory[editingPartnership.id] || []
    setPartnershipHistory({ ...partnershipHistory, [editingPartnership.id]: [...history, editingPartnership] })

    const updatedPartnerships = partnerships.map(p => p.id === editingPartnership.id ? updated : p)
    setPartnerships(updatedPartnerships)
    setCurrentPartnership(updated)
    setEditingPartnership(null)
    saveToLocalStorage()
    saveAnalytics(editingPartnership.id, 'edit')
    showToast('Partnership updated!', 'success')
  }

  const deletePartnership = (id: string) => {
    if (confirm('Are you sure you want to delete this partnership?')) {
      const updated = partnerships.filter(p => p.id !== id)
      setPartnerships(updated)
      saveToLocalStorage()
      showToast('Partnership deleted', 'info')
    }
  }

  const generatePartnershipDocument = (partnership: Partnership): string => {
    const template = partnershipTemplates[partnership.type]
    const partnersList = partnership.partners.map(p => p.name).join(', ')
    const totalCapital = Object.values(partnership.capitalContributions).reduce((sum, val) => sum + val, 0)

    return `
PARTNERSHIP AGREEMENT
${template.name.toUpperCase()}

This Partnership Agreement (the "Agreement") is entered into on ${new Date(partnership.effectiveDate).toLocaleDateString()} by and between the following partners:

${partnership.partners.map((partner, idx) => `${idx + 1}. ${partner.name}${partner.role ? ` (${partner.role})` : ''}`).join('\n')}

1. PARTNERSHIP NAME AND PURPOSE
The partnership shall be known as "${partnership.partnershipName}" (the "Partnership"). The purpose of the Partnership is to ${partnership.notes || 'engage in business activities as agreed upon by the partners'}.

2. PARTNERSHIP TYPE
This is a ${template.name} formed under the laws of ${partnership.jurisdiction}.

3. CAPITAL CONTRIBUTIONS
Each partner has contributed the following capital to the Partnership:
${partnership.partners.map(partner => {
  const contribution = partnership.capitalContributions[partner.name] || 0
  return `   - ${partner.name}: $${contribution.toLocaleString()}${partner.contribution ? ` (${partner.contribution})` : ''}`
}).join('\n')}

Total Capital Contributions: $${totalCapital.toLocaleString()}

4. OWNERSHIP AND PROFIT SHARING
Ownership and profit sharing shall be as follows:
${partnership.partners.map(partner => {
  const ownership = partnership.profitSharing[partner.name] || 0
  return `   - ${partner.name}: ${ownership.toFixed(1)}%`
}).join('\n')}

5. PARTNER ROLES AND RESPONSIBILITIES
${partnership.partners.map(partner => {
  if (partner.responsibilities.length === 0) return null
  return `   ${partner.name}${partner.role ? ` (${partner.role})` : ''}:\n${partner.responsibilities.map(r => `     - ${r}`).join('\n')}`
}).filter(Boolean).join('\n\n') || 'Each partner shall contribute their expertise and efforts to the Partnership as agreed upon.'}

6. MANAGEMENT
${partnership.management || 'The Partnership shall be managed by all partners collectively. Major decisions require the consent of partners representing a majority of ownership interests.'}

7. DECISION MAKING
${partnership.decisionMaking || 'Decisions shall be made by majority vote of the partners based on ownership percentages. Unanimous consent is required for major decisions such as dissolution, admission of new partners, or changes to this Agreement.'}

8. TERM
This Partnership shall commence on ${new Date(partnership.effectiveDate).toLocaleDateString()} and shall continue for ${partnership.term} year(s), unless earlier terminated in accordance with this Agreement.

9. DISPUTE RESOLUTION
${partnership.disputeResolution || 'Any disputes arising under this Agreement shall be resolved through good faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.'}

10. TERMINATION
${partnership.termination || 'This Partnership may be terminated by mutual written consent of all partners, or upon the occurrence of events specified in this Agreement, including but not limited to bankruptcy, death, or withdrawal of a partner.'}

11. DISSOLUTION
${partnership.dissolution || 'Upon dissolution, the Partnership assets shall be liquidated, debts paid, and remaining assets distributed to partners in accordance with their ownership percentages.'}

12. JURISDICTION
This Agreement shall be governed by and construed in accordance with the laws of ${partnership.jurisdiction}.

IN WITNESS WHEREOF, the partners have executed this Agreement as of the date first written above.

${partnership.partners.map(partner => `
${partner.name}
_________________________
Signature
`).join('\n')}
    `.trim()
  }

  const exportToPDF = (partnership: Partnership) => {
    const docText = generatePartnershipDocument(partnership)
    const blob = new Blob([docText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${partnership.title.replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
    saveAnalytics(partnership.id, 'export')
    showToast('Partnership agreement exported!', 'success')
  }

  const exportToWord = (partnership: Partnership) => {
    const docText = generatePartnershipDocument(partnership)
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${partnership.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <pre>${docText}</pre>
</body>
</html>
    `
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${partnership.title.replace(/\s+/g, '-')}.html`
    a.click()
    URL.revokeObjectURL(url)
    saveAnalytics(partnership.id, 'export')
    showToast('Partnership agreement exported!', 'success')
  }

  const printPartnership = (partnership: Partnership) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${partnership.title}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
              h2 { color: #555; margin-top: 30px; }
              pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
            </style>
          </head>
          <body>
            <pre>${generatePartnershipDocument(partnership)}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const filteredPartnerships = partnerships.filter(partnership => {
    const matchesSearch = partnership.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partnership.partnershipName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partnership.partners.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || partnership.status === filterStatus
    const matchesType = filterType === 'all' || partnership.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const typeLabels: Record<PartnershipType, string> = {
    'general': 'General',
    'limited': 'Limited',
    'llp': 'LLP',
    'joint-venture': 'Joint Venture',
    'strategic-alliance': 'Strategic Alliance',
    'distribution': 'Distribution',
    'technology': 'Technology'
  }

  const statusLabels: Record<PartnershipStatus, string> = {
    'draft': 'Draft',
    'active': 'Active',
    'pending': 'Pending',
    'terminated': 'Terminated',
    'expired': 'Expired'
  }

  const statusColors: Record<PartnershipStatus, string> = {
    'draft': 'bg-gray-100 text-gray-800',
    'active': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'terminated': 'bg-red-100 text-red-800',
    'expired': 'bg-orange-100 text-orange-800'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            Partnership Agreement Generator
              </span>
          </h1>
            <Users className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate, manage, and track Partnership Agreements for all your business partnerships
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={saveToLocalStorage} className="shrink-0">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Generator Tab */}
        {activeTab === 'generator' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Generate Partnership Agreement</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., General Partnership - ABC & XYZ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Type *</label>
                  <Select
                    value={formData.type}
                    onChange={(e) => {
                      const type = e.target.value as PartnershipType
                      const template = partnershipTemplates[type]
                      setFormData({
                        ...formData,
                        type,
                        term: template.defaultTerm.toString(),
                        jurisdiction: template.defaultJurisdiction
                      })
                    }}
                    options={Object.entries(partnershipTemplates).map(([value, template]) => ({
                      value,
                      label: `${template.name} - ${template.description}`
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Name *</label>
                  <Input
                    value={formData.partnershipName}
                    onChange={(e) => setFormData({ ...formData, partnershipName: e.target.value })}
                    placeholder="e.g., ABC-XYZ Partnership"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date *</label>
                    <Input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Term (years) *</label>
                    <Input
                      type="number"
                      value={formData.term}
                      onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jurisdiction *</label>
                    <Input
                      value={formData.jurisdiction}
                      onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                      placeholder="United States"
                    />
                  </div>
                </div>

                {/* Partners Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Partners ({formData.partners.length})</h3>
                    <Badge variant="outline">
                      {formData.partners.reduce((sum, p) => sum + (parseFloat(p.ownership.toString()) || 0), 0).toFixed(1)}% ownership
                    </Badge>
                  </div>
                  
                  {formData.partners.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {formData.partners.map((partner, idx) => (
                        <Card key={idx} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{partner.name}</h4>
                                {partner.role && (
                                  <Badge variant="outline" className="text-xs">{partner.role}</Badge>
                                )}
                                <Badge variant="beginner" className="text-xs">
                                  {parseFloat(partner.ownership.toString()) || 0}% ownership
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Contribution:</span> ${parseFloat(partner.contribution) || 0}
                                </div>
                                <div>
                                  <span className="font-medium">Ownership:</span> {parseFloat(partner.ownership.toString()) || 0}%
                                </div>
                                {partner.responsibilities.length > 0 && (
                                  <div>
                                    <span className="font-medium">Responsibilities:</span> {partner.responsibilities.length}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePartner(idx)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  <Card className="p-4 bg-gray-50">
                    <h4 className="font-semibold mb-4">Add Partner</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Partner Name *</label>
                          <Input
                            value={newPartner.name}
                            onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="Enter partner name"
                />
              </div>
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                          <Input
                            value={newPartner.role}
                            onChange={(e) => setNewPartner({ ...newPartner, role: e.target.value })}
                            placeholder="e.g., Managing Partner"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Capital Contribution ($)</label>
                          <Input
                            type="number"
                            value={newPartner.contribution}
                            onChange={(e) => setNewPartner({ ...newPartner, contribution: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ownership (%)</label>
                          <Input
                            type="number"
                            step="0.1"
                            value={newPartner.ownership}
                            onChange={(e) => setNewPartner({ ...newPartner, ownership: e.target.value })}
                            placeholder="0"
                />
              </div>
            </div>
            <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            value={newResponsibility}
                            onChange={(e) => setNewResponsibility(e.target.value)}
                            placeholder="Add responsibility"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newResponsibility.trim()) {
                                setNewPartner({
                                  ...newPartner,
                                  responsibilities: [...newPartner.responsibilities, newResponsibility.trim()]
                                })
                                setNewResponsibility('')
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (newResponsibility.trim()) {
                                setNewPartner({
                                  ...newPartner,
                                  responsibilities: [...newPartner.responsibilities, newResponsibility.trim()]
                                })
                                setNewResponsibility('')
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newPartner.responsibilities.map((item, idx) => (
                            <Badge key={idx} variant="outline" className="flex items-center gap-1">
                              {item}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => {
                                  setNewPartner({
                                    ...newPartner,
                                    responsibilities: newPartner.responsibilities.filter((_, i) => i !== idx)
                                  })
                                }}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button onClick={addPartner} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Partner
                      </Button>
                    </div>
                  </Card>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Management Structure</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={formData.management}
                    onChange={(e) => setFormData({ ...formData, management: e.target.value })}
                    placeholder="Describe how the partnership will be managed..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Decision Making Process</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={formData.decisionMaking}
                    onChange={(e) => setFormData({ ...formData, decisionMaking: e.target.value })}
                    placeholder="Describe how decisions will be made..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dispute Resolution</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={formData.disputeResolution}
                    onChange={(e) => setFormData({ ...formData, disputeResolution: e.target.value })}
                    placeholder="Describe dispute resolution process..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Termination Provisions</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={formData.termination}
                    onChange={(e) => setFormData({ ...formData, termination: e.target.value })}
                    placeholder="Describe termination provisions..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dissolution Provisions</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={formData.dissolution}
                    onChange={(e) => setFormData({ ...formData, dissolution: e.target.value })}
                    placeholder="Describe dissolution process..."
              />
            </div>
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
                <Button onClick={editingPartnership ? updatePartnership : generatePartnership} className="w-full" size="lg">
                  <Users className="h-4 w-4 mr-2" />
                  {editingPartnership ? 'Update Agreement' : 'Generate Agreement'}
                </Button>
              </div>
            </Card>

            {currentPartnership && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Generated Agreement Preview</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportToPDF(currentPartnership)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportToWord(currentPartnership)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Word
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => printPartnership(currentPartnership)}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generatePartnershipDocument(currentPartnership)}
                  </pre>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* My Partnerships Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">My Partnerships</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search partnerships..."
                    className="w-48"
                  />
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'draft', label: 'Draft' },
                      { value: 'active', label: 'Active' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'terminated', label: 'Terminated' },
                      { value: 'expired', label: 'Expired' }
                    ]}
                  />
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Types' },
                      ...Object.entries(partnershipTemplates).map(([value, template]) => ({
                        value,
                        label: template.name
                      }))
                    ]}
                  />
                </div>
              </div>

              {filteredPartnerships.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>No partnerships found. Generate your first partnership agreement to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPartnerships.map((partnership) => {
                    const isExpired = new Date(partnership.expirationDate) < new Date()
                    const totalCapital = Object.values(partnership.capitalContributions).reduce((sum, val) => sum + val, 0)
                    return (
                      <Card key={partnership.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{partnership.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {typeLabels[partnership.type]}
                              </Badge>
                              <Badge className={`text-xs ${statusColors[partnership.status]}`}>
                                {statusLabels[partnership.status]}
                              </Badge>
                              {isExpired && partnership.status !== 'expired' && (
                                <Badge className="text-xs bg-red-100 text-red-800">
                                  Expired
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <span className="font-medium">Partners:</span> {partnership.partners.length}
                              </div>
                              <div>
                                <span className="font-medium">Capital:</span> ${totalCapital.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Effective:</span> {new Date(partnership.effectiveDate).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Expires:</span> {new Date(partnership.expirationDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Partners:</span> {partnership.partners.map(p => p.name).join(', ')}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingPartnership(partnership)
                                setFormData({
                                  title: partnership.title,
                                  type: partnership.type,
                                  partnershipName: partnership.partnershipName,
                                  effectiveDate: partnership.effectiveDate,
                                  term: partnership.term.toString(),
                                  jurisdiction: partnership.jurisdiction,
                                  partners: partnership.partners,
                                  management: partnership.management,
                                  decisionMaking: partnership.decisionMaking,
                                  disputeResolution: partnership.disputeResolution,
                                  termination: partnership.termination,
                                  dissolution: partnership.dissolution,
                                  notes: partnership.notes || ''
                                })
                                setActiveTab('generator')
                                saveAnalytics(partnership.id, 'view')
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => exportToPDF(partnership)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePartnership(partnership.id)}
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

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <FileCheck className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Partnership Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(partnershipTemplates).map(([type, template]) => (
                  <Card
                    key={type}
                    className="p-4 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div 
                      className="flex items-center gap-3 mb-3"
                      onClick={() => loadTemplate(type as PartnershipType)}
                    >
                      <div className="bg-primary-500/10 text-primary-600 p-2 rounded-lg">
                        <Users className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold">{template.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="text-xs text-gray-500">
                      Default Term: {template.defaultTerm} year(s) • Jurisdiction: {template.defaultJurisdiction}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <GitBranch className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Compare Partnerships</h2>
              </div>
              {partnerships.length < 2 ? (
                <div className="text-center py-12 text-gray-400">
                  <GitBranch className="h-16 w-16 mx-auto mb-4" />
                  <p>You need at least 2 partnerships to compare. Generate more partnerships to use this feature.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Partnerships to Compare (2 partnerships)
              </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {partnerships.map((partnership) => {
                        const isSelected = comparingPartnerships.includes(partnership.id)
                        return (
                          <Card
                            key={partnership.id}
                            className={`p-4 transition-all ${
                              isSelected ? 'border-2 border-primary-500 bg-primary-50' : 'hover:border-primary-300'
                            }`}
                          >
                            <div 
                              className="flex items-center gap-3 cursor-pointer"
                              onClick={() => {
                                if (isSelected) {
                                  setComparingPartnerships(comparingPartnerships.filter(id => id !== partnership.id))
                                } else if (comparingPartnerships.length < 2) {
                                  setComparingPartnerships([...comparingPartnerships, partnership.id])
                                } else {
                                  showToast('Please select only 2 partnerships to compare', 'error')
                                }
                              }}
                            >
                              <div className="bg-primary-500/10 text-primary-600 p-2 rounded-lg">
                                <Users className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{partnership.title}</h4>
                                <p className="text-sm text-gray-600">{typeLabels[partnership.type]}</p>
                              </div>
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 text-primary-500" />
                              )}
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                  {comparingPartnerships.length === 2 && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Comparison</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {comparingPartnerships.map((partnershipId, idx) => {
                          const partnership = partnerships.find(p => p.id === partnershipId)
                          if (!partnership) return null
                          const totalCapital = Object.values(partnership.capitalContributions).reduce((sum, val) => sum + val, 0)
                          return (
                            <div key={partnershipId} className="space-y-4">
                              <div className="flex items-center gap-3 mb-4">
                                <Badge variant={idx === 0 ? 'new' : 'outline'}>
                                  Partnership {idx + 1}
                                </Badge>
                                <h4 className="font-semibold">{partnership.title}</h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Type:</span> {typeLabels[partnership.type]}
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span> {statusLabels[partnership.status]}
                                </div>
                                <div>
                                  <span className="font-medium">Partners:</span> {partnership.partners.length}
                                </div>
                                <div>
                                  <span className="font-medium">Total Capital:</span> ${totalCapital.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Term:</span> {partnership.term} year(s)
                                </div>
                                <div>
                                  <span className="font-medium">Effective Date:</span> {new Date(partnership.effectiveDate).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Expiration Date:</span> {new Date(partnership.expirationDate).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Jurisdiction:</span> {partnership.jurisdiction}
                                </div>
                              </div>
                              <div className="pt-4 border-t">
                                <h5 className="font-medium mb-2">Partners:</h5>
                                <div className="space-y-1">
                                  {partnership.partners.map((partner) => (
                                    <div key={partner.name} className="text-sm text-gray-600">
                                      • {partner.name} ({partnership.profitSharing[partner.name]?.toFixed(1)}% ownership)
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </Card>
                  )}
                </>
              )}
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Partnerships</div>
                <div className="text-2xl font-bold">{partnerships.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Views</div>
                <div className="text-2xl font-bold">
                  {Object.values(partnershipAnalytics).reduce((sum, a) => sum + a.views, 0)}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Edits</div>
                <div className="text-2xl font-bold">
                  {Object.values(partnershipAnalytics).reduce((sum, a) => sum + a.edits, 0)}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Exports</div>
                <div className="text-2xl font-bold">
                  {Object.values(partnershipAnalytics).reduce((sum, a) => sum + a.exports, 0)}
                </div>
              </Card>
            </div>
            <Card>
              <h3 className="font-semibold mb-4">Partnership Analytics</h3>
              {Object.keys(partnershipAnalytics).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>No analytics data yet. Start using partnerships to see analytics.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {partnerships.map((partnership) => {
                    const analytics = partnershipAnalytics[partnership.id]
                    if (!analytics) return null
                    return (
                      <Card key={partnership.id} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">{partnership.title}</h4>
                          <Badge variant="outline">{typeLabels[partnership.type]}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Views</div>
                            <div className="text-xl font-bold">{analytics.views}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Edits</div>
                            <div className="text-xl font-bold">{analytics.edits}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Exports</div>
                            <div className="text-xl font-bold">{analytics.exports}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Last Accessed</div>
                            <div className="text-sm font-medium">
                              {new Date(analytics.lastAccessed).toLocaleDateString()}
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

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <History className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Partnership History</h2>
              </div>
              {Object.keys(partnershipHistory).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No history yet. Document versions will be saved automatically when you edit partnerships.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(partnershipHistory).map(([partnershipId, versions]) => {
                    const currentPartnership = partnerships.find(p => p.id === partnershipId)
                    if (!currentPartnership) return null
                    return (
                      <Card key={partnershipId} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{currentPartnership.title}</h3>
                            <p className="text-sm text-gray-600">{typeLabels[currentPartnership.type]}</p>
                          </div>
                          <Badge variant="outline">
                            {versions.length} version{versions.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border-2 border-primary-200">
                            <div>
                              <div className="font-semibold">Current Version</div>
                              <div className="text-sm text-gray-600">
                                Modified: {new Date(currentPartnership.modified).toLocaleString()}
                              </div>
                            </div>
                            <Badge variant="new">Current</Badge>
                          </div>
                          {versions.slice().reverse().map((version, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div>
                                <div className="font-medium">Version {versions.length - idx}</div>
                                <div className="text-sm text-gray-600">
                                  Modified: {new Date(version.modified).toLocaleString()}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingPartnership(version)
                                  setFormData({
                                    title: version.title,
                                    type: version.type,
                                    partnershipName: version.partnershipName,
                                    effectiveDate: version.effectiveDate,
                                    term: version.term.toString(),
                                    jurisdiction: version.jurisdiction,
                                    partners: version.partners,
                                    management: version.management,
                                    decisionMaking: version.decisionMaking,
                                    disputeResolution: version.disputeResolution,
                                    termination: version.termination,
                                    dissolution: version.dissolution,
                                    notes: version.notes || ''
                                  })
                                  setActiveTab('generator')
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
            </Button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
