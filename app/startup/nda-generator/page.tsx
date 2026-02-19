'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Shield, 
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
  Users,
  GitBranch,
  FileCheck
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

type NDAType = 'mutual' | 'unilateral' | 'multiparty' | 'employee' | 'investor' | 'vendor' | 'consultant'
type NDAStatus = 'draft' | 'sent' | 'signed' | 'expired' | 'terminated'

interface NDA {
  id: string
  title: string
  type: NDAType
  status: NDAStatus
  disclosingParty: string
  receivingParty: string
  purpose: string
  duration: number
  effectiveDate: string
  expirationDate: string
  jurisdiction: string
  confidentialInfo: string[]
  exclusions: string[]
  obligations: string[]
  term: number
  created: string
  modified: string
  notes?: string
}

const ndaTemplates: Record<NDAType, {
  name: string
  description: string
  defaultDuration: number
  defaultJurisdiction: string
}> = {
  'mutual': {
    name: 'Mutual NDA',
    description: 'Both parties agree to keep each other\'s information confidential',
    defaultDuration: 2,
    defaultJurisdiction: 'United States'
  },
  'unilateral': {
    name: 'Unilateral NDA',
    description: 'One party discloses information, the other party keeps it confidential',
    defaultDuration: 2,
    defaultJurisdiction: 'United States'
  },
  'multiparty': {
    name: 'Multiparty NDA',
    description: 'NDA involving three or more parties',
    defaultDuration: 3,
    defaultJurisdiction: 'United States'
  },
  'employee': {
    name: 'Employee NDA',
    description: 'NDA for employees to protect company confidential information',
    defaultDuration: 5,
    defaultJurisdiction: 'United States'
  },
  'investor': {
    name: 'Investor NDA',
    description: 'NDA for investors during due diligence and fundraising',
    defaultDuration: 2,
    defaultJurisdiction: 'United States'
  },
  'vendor': {
    name: 'Vendor NDA',
    description: 'NDA for vendors and suppliers',
    defaultDuration: 2,
    defaultJurisdiction: 'United States'
  },
  'consultant': {
    name: 'Consultant NDA',
    description: 'NDA for consultants and independent contractors',
    defaultDuration: 2,
    defaultJurisdiction: 'United States'
  }
}

export default function NDAGeneratorPage() {
  const [activeTab, setActiveTab] = useState('generator')
  const [ndas, setNdas] = useState<NDA[]>([])
  const [currentNDA, setCurrentNDA] = useState<NDA | null>(null)
  const [editingNDA, setEditingNDA] = useState<NDA | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'mutual' as NDAType,
    disclosingParty: '',
    receivingParty: '',
    purpose: '',
    duration: '2',
    effectiveDate: new Date().toISOString().split('T')[0],
    jurisdiction: 'United States',
    confidentialInfo: [] as string[],
    exclusions: [] as string[],
    obligations: [] as string[],
    notes: ''
  })
  const [newInfoItem, setNewInfoItem] = useState('')
  const [newExclusionItem, setNewExclusionItem] = useState('')
  const [newObligationItem, setNewObligationItem] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [comparingNDAs, setComparingNDAs] = useState<string[]>([])
  const [ndaHistory, setNdaHistory] = useState<Record<string, NDA[]>>({})
  const [ndaAnalytics, setNdaAnalytics] = useState<Record<string, {
    views: number
    edits: number
    exports: number
    lastAccessed: string
  }>>({})

  const tabs = [
    { id: 'generator', label: 'Generator', icon: Shield },
    { id: 'documents', label: 'My NDAs', icon: FileText },
    { id: 'templates', label: 'Templates', icon: FileCheck },
    { id: 'compare', label: 'Compare', icon: GitBranch },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ndaGeneratorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.ndas) setNdas(data.ndas)
          if (data.history) setNdaHistory(data.history)
          if (data.analytics) setNdaAnalytics(data.analytics)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        ndas,
        history: ndaHistory,
        analytics: ndaAnalytics,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('ndaGeneratorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const saveAnalytics = (ndaId: string, action: 'view' | 'edit' | 'export') => {
    const analytics = ndaAnalytics[ndaId] || {
      views: 0,
      edits: 0,
      exports: 0,
      lastAccessed: new Date().toISOString()
    }
    
    if (action === 'view') analytics.views++
    if (action === 'edit') analytics.edits++
    if (action === 'export') analytics.exports++
    analytics.lastAccessed = new Date().toISOString()
    
    const updated = { ...ndaAnalytics, [ndaId]: analytics }
    setNdaAnalytics(updated)
    saveToLocalStorage()
  }

  const generateNDA = () => {
    if (!formData.disclosingParty || !formData.receivingParty) {
      showToast('Please fill in party names', 'error')
      return
    }

    const duration = parseInt(formData.duration) || 2
    const effectiveDate = new Date(formData.effectiveDate)
    const expirationDate = new Date(effectiveDate)
    expirationDate.setFullYear(expirationDate.getFullYear() + duration)

    const newNDA: NDA = {
      id: Date.now().toString(),
      title: formData.title || `${formData.type} NDA - ${formData.disclosingParty} & ${formData.receivingParty}`,
      type: formData.type,
      status: 'draft',
      disclosingParty: formData.disclosingParty,
      receivingParty: formData.receivingParty,
      purpose: formData.purpose,
      duration,
      effectiveDate: formData.effectiveDate,
      expirationDate: expirationDate.toISOString().split('T')[0],
      jurisdiction: formData.jurisdiction,
      confidentialInfo: formData.confidentialInfo,
      exclusions: formData.exclusions,
      obligations: formData.obligations,
      term: duration,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      notes: formData.notes
    }

    setNdas([...ndas, newNDA])
    setCurrentNDA(newNDA)
    setEditingNDA(newNDA)
    saveToLocalStorage()
    saveAnalytics(newNDA.id, 'view')
      showToast('NDA generated successfully!', 'success')
  }

  const loadTemplate = (type: NDAType) => {
    const template = ndaTemplates[type]
    setFormData({
      ...formData,
      type,
      duration: template.defaultDuration.toString(),
      jurisdiction: template.defaultJurisdiction
    })
    showToast(`${template.name} template loaded!`, 'success')
  }

  const updateNDA = () => {
    if (!editingNDA) return

    const duration = parseInt(formData.duration) || editingNDA.duration
    const effectiveDate = new Date(formData.effectiveDate || editingNDA.effectiveDate)
    const expirationDate = new Date(effectiveDate)
    expirationDate.setFullYear(expirationDate.getFullYear() + duration)

    const updated: NDA = {
      ...editingNDA,
      title: formData.title || editingNDA.title,
      type: formData.type,
      disclosingParty: formData.disclosingParty || editingNDA.disclosingParty,
      receivingParty: formData.receivingParty || editingNDA.receivingParty,
      purpose: formData.purpose || editingNDA.purpose,
      duration,
      effectiveDate: formData.effectiveDate || editingNDA.effectiveDate,
      expirationDate: expirationDate.toISOString().split('T')[0],
      jurisdiction: formData.jurisdiction || editingNDA.jurisdiction,
      confidentialInfo: formData.confidentialInfo,
      exclusions: formData.exclusions,
      obligations: formData.obligations,
      term: duration,
      modified: new Date().toISOString(),
      notes: formData.notes
    }

    // Save to history
    const history = ndaHistory[editingNDA.id] || []
    setNdaHistory({ ...ndaHistory, [editingNDA.id]: [...history, editingNDA] })

    const updatedNdas = ndas.map(n => n.id === editingNDA.id ? updated : n)
    setNdas(updatedNdas)
    setCurrentNDA(updated)
    setEditingNDA(null)
    saveToLocalStorage()
    saveAnalytics(editingNDA.id, 'edit')
    showToast('NDA updated!', 'success')
  }

  const deleteNDA = (id: string) => {
    if (confirm('Are you sure you want to delete this NDA?')) {
      const updated = ndas.filter(n => n.id !== id)
      setNdas(updated)
      saveToLocalStorage()
      showToast('NDA deleted', 'info')
    }
  }

  const generateNDADocument = (nda: NDA): string => {
    const template = ndaTemplates[nda.type]
    const isMutual = nda.type === 'mutual'
    const parties = isMutual 
      ? `${nda.disclosingParty} and ${nda.receivingParty} (collectively, the "Parties")`
      : `${nda.disclosingParty} (the "Disclosing Party") and ${nda.receivingParty} (the "Receiving Party")`

    return `
NON-DISCLOSURE AGREEMENT
${nda.type.toUpperCase()} NDA

This ${template.name} (the "Agreement") is entered into on ${new Date(nda.effectiveDate).toLocaleDateString()} between ${parties}.

1. PURPOSE
${nda.purpose || 'The parties wish to engage in discussions regarding potential business opportunities and may disclose confidential information to each other.'}

2. CONFIDENTIAL INFORMATION
${nda.confidentialInfo.length > 0 
  ? nda.confidentialInfo.map((info, i) => `${i + 1}. ${info}`).join('\n')
  : 'Confidential information includes all non-public, proprietary information disclosed by the Disclosing Party, including but not limited to business plans, financial information, customer lists, technical data, and trade secrets.'}

3. OBLIGATIONS
${nda.obligations.length > 0
  ? nda.obligations.map((obligation, i) => `${i + 1}. ${obligation}`).join('\n')
  : isMutual
    ? 'Each party agrees to:\n   a. Maintain the confidentiality of all confidential information received from the other party\n   b. Not disclose confidential information to any third party without prior written consent\n   c. Use confidential information solely for the purpose stated in this Agreement\n   d. Take reasonable measures to protect the confidentiality of the information'
    : 'The Receiving Party agrees to:\n   a. Maintain the confidentiality of all confidential information received from the Disclosing Party\n   b. Not disclose confidential information to any third party without prior written consent\n   c. Use confidential information solely for the purpose stated in this Agreement\n   d. Take reasonable measures to protect the confidentiality of the information'}

4. EXCLUSIONS
${nda.exclusions.length > 0
  ? nda.exclusions.map((exclusion, i) => `${i + 1}. ${exclusion}`).join('\n')
  : 'This Agreement does not apply to information that:\n   a. Was known to the Receiving Party prior to disclosure\n   b. Is or becomes publicly available through no breach of this Agreement\n   c. Is independently developed by the Receiving Party\n   d. Is rightfully received from a third party without breach of any confidentiality obligation'}

5. TERM
This Agreement shall remain in effect for ${nda.duration} year(s) from the effective date, or until terminated by mutual written consent of the parties.

6. JURISDICTION
This Agreement shall be governed by and construed in accordance with the laws of ${nda.jurisdiction}.

7. REMEDIES
Breach of this Agreement may result in irreparable harm, and the parties agree that monetary damages may not be sufficient. The parties may seek injunctive relief and other remedies available at law or in equity.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

${nda.disclosingParty}
_________________________
Signature

${nda.receivingParty}
_________________________
Signature
    `.trim()
  }

  const exportToPDF = (nda: NDA) => {
    const document = generateNDADocument(nda)
    const blob = new Blob([document], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${nda.title.replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
    saveAnalytics(nda.id, 'export')
    showToast('NDA exported!', 'success')
  }

  const exportToWord = (nda: NDA) => {
    const document = generateNDADocument(nda)
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${nda.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    p { margin: 10px 0; }
  </style>
</head>
<body>
  <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${document}</pre>
</body>
</html>
    `
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${nda.title.replace(/\s+/g, '-')}.html`
    a.click()
    URL.revokeObjectURL(url)
    saveAnalytics(nda.id, 'export')
    showToast('NDA exported!', 'success')
  }

  const printNDA = (nda: NDA) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${nda.title}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
              h2 { color: #555; margin-top: 30px; }
              pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
            </style>
          </head>
          <body>
            <pre>${generateNDADocument(nda)}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const filteredNDAs = ndas.filter(nda => {
    const matchesSearch = nda.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nda.disclosingParty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nda.receivingParty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || nda.status === filterStatus
    const matchesType = filterType === 'all' || nda.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const typeLabels: Record<NDAType, string> = {
    'mutual': 'Mutual',
    'unilateral': 'Unilateral',
    'multiparty': 'Multiparty',
    'employee': 'Employee',
    'investor': 'Investor',
    'vendor': 'Vendor',
    'consultant': 'Consultant'
  }

  const statusLabels: Record<NDAStatus, string> = {
    'draft': 'Draft',
    'sent': 'Sent',
    'signed': 'Signed',
    'expired': 'Expired',
    'terminated': 'Terminated'
  }

  const statusColors: Record<NDAStatus, string> = {
    'draft': 'bg-gray-100 text-gray-800',
    'sent': 'bg-blue-100 text-blue-800',
    'signed': 'bg-green-100 text-green-800',
    'expired': 'bg-red-100 text-red-800',
    'terminated': 'bg-yellow-100 text-yellow-800'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            NDA Generator
              </span>
          </h1>
            <Shield className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate, manage, and track Non-Disclosure Agreements for all your business needs
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
                <Shield className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Generate NDA</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NDA Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Mutual NDA - Company A & Company B"
                  />
                </div>
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NDA Type *</label>
                  <Select
                    value={formData.type}
                    onChange={(e) => {
                      const type = e.target.value as NDAType
                      const template = ndaTemplates[type]
                      setFormData({
                        ...formData,
                        type,
                        duration: template.defaultDuration.toString(),
                        jurisdiction: template.defaultJurisdiction
                      })
                    }}
                    options={Object.entries(ndaTemplates).map(([value, template]) => ({
                      value,
                      label: `${template.name} - ${template.description}`
                    }))}
                  />
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.type === 'mutual' ? 'Party 1 *' : 'Disclosing Party *'}
                </label>
                    <Input
                  value={formData.disclosingParty}
                  onChange={(e) => setFormData({ ...formData, disclosingParty: e.target.value })}
                  placeholder="Enter party name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.type === 'mutual' ? 'Party 2 *' : 'Receiving Party *'}
                </label>
                    <Input
                  value={formData.receivingParty}
                  onChange={(e) => setFormData({ ...formData, receivingParty: e.target.value })}
                  placeholder="Enter party name"
                />
              </div>
            </div>
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose *</label>
              <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={4}
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="Describe the purpose of the NDA..."
              />
            </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (years) *</label>
                    <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="2"
              />
            </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date *</label>
                    <Input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confidential Information</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newInfoItem}
                      onChange={(e) => setNewInfoItem(e.target.value)}
                      placeholder="Add confidential information item"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newInfoItem.trim()) {
                          setFormData({
                            ...formData,
                            confidentialInfo: [...formData.confidentialInfo, newInfoItem.trim()]
                          })
                          setNewInfoItem('')
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (newInfoItem.trim()) {
                          setFormData({
                            ...formData,
                            confidentialInfo: [...formData.confidentialInfo, newInfoItem.trim()]
                          })
                          setNewInfoItem('')
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.confidentialInfo.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="flex items-center gap-1">
                        {item}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              confidentialInfo: formData.confidentialInfo.filter((_, i) => i !== idx)
                            })
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newExclusionItem}
                      onChange={(e) => setNewExclusionItem(e.target.value)}
                      placeholder="Add exclusion item"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newExclusionItem.trim()) {
                          setFormData({
                            ...formData,
                            exclusions: [...formData.exclusions, newExclusionItem.trim()]
                          })
                          setNewExclusionItem('')
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (newExclusionItem.trim()) {
                          setFormData({
                            ...formData,
                            exclusions: [...formData.exclusions, newExclusionItem.trim()]
                          })
                          setNewExclusionItem('')
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.exclusions.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="flex items-center gap-1">
                        {item}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              exclusions: formData.exclusions.filter((_, i) => i !== idx)
                            })
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Obligations</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newObligationItem}
                      onChange={(e) => setNewObligationItem(e.target.value)}
                      placeholder="Add obligation item"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newObligationItem.trim()) {
                          setFormData({
                            ...formData,
                            obligations: [...formData.obligations, newObligationItem.trim()]
                          })
                          setNewObligationItem('')
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (newObligationItem.trim()) {
                          setFormData({
                            ...formData,
                            obligations: [...formData.obligations, newObligationItem.trim()]
                          })
                          setNewObligationItem('')
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.obligations.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="flex items-center gap-1">
                        {item}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              obligations: formData.obligations.filter((_, i) => i !== idx)
                            })
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
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
                <Button onClick={generateNDA} className="w-full" size="lg">
              <Shield className="h-4 w-4 mr-2" />
              Generate NDA
            </Button>
          </div>
        </Card>

            {currentNDA && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Generated NDA Preview</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportToPDF(currentNDA)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportToWord(currentNDA)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Word
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => printNDA(currentNDA)}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generateNDADocument(currentNDA)}
                  </pre>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* My NDAs Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">My NDAs</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search NDAs..."
                    className="w-48"
                  />
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'draft', label: 'Draft' },
                      { value: 'sent', label: 'Sent' },
                      { value: 'signed', label: 'Signed' },
                      { value: 'expired', label: 'Expired' },
                      { value: 'terminated', label: 'Terminated' }
                    ]}
                  />
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Types' },
                      ...Object.entries(ndaTemplates).map(([value, template]) => ({
                        value,
                        label: template.name
                      }))
                    ]}
                  />
                </div>
              </div>

              {filteredNDAs.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>No NDAs found. Generate your first NDA to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNDAs.map((nda) => {
                    const isExpired = new Date(nda.expirationDate) < new Date()
                    return (
                      <Card key={nda.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{nda.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {typeLabels[nda.type]}
                              </Badge>
                              <Badge className={`text-xs ${statusColors[nda.status]}`}>
                                {statusLabels[nda.status]}
                              </Badge>
                              {isExpired && nda.status !== 'expired' && (
                                <Badge className="text-xs bg-red-100 text-red-800">
                                  Expired
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <span className="font-medium">Parties:</span> {nda.disclosingParty} & {nda.receivingParty}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span> {nda.duration} year(s)
                              </div>
                              <div>
                                <span className="font-medium">Effective:</span> {new Date(nda.effectiveDate).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Expires:</span> {new Date(nda.expirationDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Purpose:</span> {nda.purpose.substring(0, 100)}{nda.purpose.length > 100 ? '...' : ''}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingNDA(nda)
                                setFormData({
                                  title: nda.title,
                                  type: nda.type,
                                  disclosingParty: nda.disclosingParty,
                                  receivingParty: nda.receivingParty,
                                  purpose: nda.purpose,
                                  duration: nda.duration.toString(),
                                  effectiveDate: nda.effectiveDate,
                                  jurisdiction: nda.jurisdiction,
                                  confidentialInfo: nda.confidentialInfo,
                                  exclusions: nda.exclusions,
                                  obligations: nda.obligations,
                                  notes: nda.notes || ''
                                })
                                setActiveTab('generator')
                                saveAnalytics(nda.id, 'view')
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => exportToPDF(nda)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNDA(nda.id)}
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
                <h2 className="text-2xl font-bold">NDA Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(ndaTemplates).map(([type, template]) => (
                  <Card
                    key={type}
                    className="p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => loadTemplate(type as NDAType)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-primary-500/10 text-primary-600 p-2 rounded-lg">
                        <Shield className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold">{template.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="text-xs text-gray-500">
                      Default Duration: {template.defaultDuration} year(s) • Jurisdiction: {template.defaultJurisdiction}
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
                <h2 className="text-2xl font-bold">Compare NDAs</h2>
              </div>
              {ndas.length < 2 ? (
                <div className="text-center py-12 text-gray-400">
                  <GitBranch className="h-16 w-16 mx-auto mb-4" />
                  <p>You need at least 2 NDAs to compare. Generate more NDAs to use this feature.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select NDAs to Compare (2 NDAs)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ndas.map((nda) => {
                        const isSelected = comparingNDAs.includes(nda.id)
                        return (
                          <Card
                            key={nda.id}
                            className={`p-4 cursor-pointer transition-all ${
                              isSelected ? 'border-2 border-primary-500 bg-primary-50' : 'hover:border-primary-300'
                            }`}
                            onClick={() => {
                              if (isSelected) {
                                setComparingNDAs(comparingNDAs.filter(id => id !== nda.id))
                              } else if (comparingNDAs.length < 2) {
                                setComparingNDAs([...comparingNDAs, nda.id])
                              } else {
                                showToast('Please select only 2 NDAs to compare', 'error')
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-primary-500/10 text-primary-600 p-2 rounded-lg">
                                <Shield className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{nda.title}</h4>
                                <p className="text-sm text-gray-600">{typeLabels[nda.type]}</p>
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
                  {comparingNDAs.length === 2 && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Comparison</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {comparingNDAs.map((ndaId, idx) => {
                          const nda = ndas.find(n => n.id === ndaId)
                          if (!nda) return null
                          return (
                            <div key={ndaId} className="space-y-4">
                              <div className="flex items-center gap-3 mb-4">
                                <Badge variant={idx === 0 ? 'new' : 'outline'}>
                                  NDA {idx + 1}
                                </Badge>
                                <h4 className="font-semibold">{nda.title}</h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Type:</span> {typeLabels[nda.type]}
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span> {statusLabels[nda.status]}
                                </div>
                                <div>
                                  <span className="font-medium">Parties:</span> {nda.disclosingParty} & {nda.receivingParty}
                                </div>
                                <div>
                                  <span className="font-medium">Duration:</span> {nda.duration} year(s)
                                </div>
                                <div>
                                  <span className="font-medium">Effective Date:</span> {new Date(nda.effectiveDate).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Expiration Date:</span> {new Date(nda.expirationDate).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Jurisdiction:</span> {nda.jurisdiction}
                                </div>
                                <div>
                                  <span className="font-medium">Confidential Info Items:</span> {nda.confidentialInfo.length}
                                </div>
                                <div>
                                  <span className="font-medium">Exclusions:</span> {nda.exclusions.length}
                                </div>
                                <div>
                                  <span className="font-medium">Obligations:</span> {nda.obligations.length}
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
                <div className="text-sm text-gray-600 mb-1">Total NDAs</div>
                <div className="text-2xl font-bold">{ndas.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Views</div>
                <div className="text-2xl font-bold">
                  {Object.values(ndaAnalytics).reduce((sum, a) => sum + a.views, 0)}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Edits</div>
                <div className="text-2xl font-bold">
                  {Object.values(ndaAnalytics).reduce((sum, a) => sum + a.edits, 0)}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Exports</div>
                <div className="text-2xl font-bold">
                  {Object.values(ndaAnalytics).reduce((sum, a) => sum + a.exports, 0)}
                </div>
              </Card>
            </div>
            <Card>
              <h3 className="font-semibold mb-4">NDA Analytics</h3>
              {Object.keys(ndaAnalytics).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>No analytics data yet. Start using NDAs to see analytics.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ndas.map((nda) => {
                    const analytics = ndaAnalytics[nda.id]
                    if (!analytics) return null
                    return (
                      <Card key={nda.id} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">{nda.title}</h4>
                          <Badge variant="outline">{typeLabels[nda.type]}</Badge>
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
                <h2 className="text-2xl font-bold">NDA History</h2>
              </div>
              {Object.keys(ndaHistory).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No history yet. Document versions will be saved automatically when you edit NDAs.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(ndaHistory).map(([ndaId, versions]) => {
                    const currentNDA = ndas.find(n => n.id === ndaId)
                    if (!currentNDA) return null
                    return (
                      <Card key={ndaId} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{currentNDA.title}</h3>
                            <p className="text-sm text-gray-600">{typeLabels[currentNDA.type]}</p>
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
                                Modified: {new Date(currentNDA.modified).toLocaleString()}
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
                                  setEditingNDA(version)
                                  setFormData({
                                    title: version.title,
                                    type: version.type,
                                    disclosingParty: version.disclosingParty,
                                    receivingParty: version.receivingParty,
                                    purpose: version.purpose,
                                    duration: version.duration.toString(),
                                    effectiveDate: version.effectiveDate,
                                    jurisdiction: version.jurisdiction,
                                    confidentialInfo: version.confidentialInfo,
                                    exclusions: version.exclusions,
                                    obligations: version.obligations,
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
