'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  FileText, Download, Copy, Eye, Edit, Trash2, Plus, Search,
  CheckCircle, XCircle, Star, StarOff, Filter, BarChart3, Clock,
  Users, Building2, Shield, Scale, Briefcase, Heart, Globe, Share2,
  BookOpen, Sparkles, AlertCircle, Lock, Unlock
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

type ContractCategory = 'employment' | 'nda' | 'service' | 'partnership' | 'sales' | 'ip' | 'investment' | 'corporate'
type TemplateStatus = 'draft' | 'active' | 'archived'

interface ContractTemplate {
  id: string
  title: string
  category: ContractCategory
  description: string
  preview: string
  variables: string[]
  sections: string[]
  useCount: number
  rating: number
  isCustom: boolean
  status: TemplateStatus
  lastUsed?: string
  created: string
  modified: string
}

interface CustomContract {
  id: string
  templateId: string
  title: string
  status: 'draft' | 'finalized'
  variables: Record<string, string>
  created: string
  modified: string
}

const categoryInfo: Record<ContractCategory, { label: string; icon: typeof FileText; color: string; description: string }> = {
  'employment': { label: 'Employment', icon: Users, color: 'text-blue-600', description: 'Hiring, termination, and workplace agreements' },
  'nda': { label: 'NDA', icon: Lock, color: 'text-purple-600', description: 'Confidentiality and non-disclosure' },
  'service': { label: 'Service', icon: Briefcase, color: 'text-green-600', description: 'Service provider and consultant agreements' },
  'partnership': { label: 'Partnership', icon: Heart, color: 'text-pink-600', description: 'Business partnership agreements' },
  'sales': { label: 'Sales', icon: Globe, color: 'text-orange-600', description: 'Sales and distribution agreements' },
  'ip': { label: 'IP', icon: Shield, color: 'text-cyan-600', description: 'Intellectual property assignments' },
  'investment': { label: 'Investment', icon: Scale, color: 'text-amber-600', description: 'Investment and funding documents' },
  'corporate': { label: 'Corporate', icon: Building2, color: 'text-gray-600', description: 'Corporate governance documents' }
}

const defaultTemplates: ContractTemplate[] = [
  {
    id: 'emp-1',
    title: 'Employment Agreement (Full-Time)',
    category: 'employment',
    description: 'Standard full-time employment agreement with comprehensive terms covering compensation, benefits, duties, and termination.',
    preview: 'This Employment Agreement is entered into as of [START_DATE] between [COMPANY_NAME] ("Employer") and [EMPLOYEE_NAME] ("Employee")...',
    variables: ['COMPANY_NAME', 'EMPLOYEE_NAME', 'START_DATE', 'JOB_TITLE', 'SALARY', 'BENEFITS', 'NOTICE_PERIOD'],
    sections: ['Employment Terms', 'Compensation', 'Benefits', 'Duties', 'Confidentiality', 'Termination', 'Non-Compete'],
    useCount: 156,
    rating: 4.8,
    isCustom: false,
    status: 'active',
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  },
  {
    id: 'emp-2',
    title: 'Contractor Agreement',
    category: 'service',
    description: 'Independent contractor agreement for freelancers and consultants with clear scope, payment terms, and IP provisions.',
    preview: 'This Independent Contractor Agreement is made between [COMPANY_NAME] ("Client") and [CONTRACTOR_NAME] ("Contractor")...',
    variables: ['COMPANY_NAME', 'CONTRACTOR_NAME', 'START_DATE', 'END_DATE', 'SCOPE', 'RATE', 'PAYMENT_TERMS'],
    sections: ['Engagement', 'Scope of Work', 'Compensation', 'Independent Status', 'Confidentiality', 'IP Assignment', 'Termination'],
    useCount: 234,
    rating: 4.7,
    isCustom: false,
    status: 'active',
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  },
  {
    id: 'nda-1',
    title: 'Mutual Non-Disclosure Agreement',
    category: 'nda',
    description: 'Bilateral NDA protecting confidential information exchanged between two parties during business discussions.',
    preview: 'This Mutual Non-Disclosure Agreement is entered into by and between [PARTY_A] and [PARTY_B]...',
    variables: ['PARTY_A', 'PARTY_B', 'EFFECTIVE_DATE', 'TERM', 'PURPOSE'],
    sections: ['Definition of Confidential Information', 'Obligations', 'Exceptions', 'Term', 'Return of Materials'],
    useCount: 512,
    rating: 4.9,
    isCustom: false,
    status: 'active',
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  },
  {
    id: 'nda-2',
    title: 'One-Way NDA (Employee)',
    category: 'nda',
    description: 'Employee confidentiality agreement protecting company trade secrets and proprietary information.',
    preview: 'This Confidentiality Agreement is made between [COMPANY_NAME] ("Company") and the undersigned employee...',
    variables: ['COMPANY_NAME', 'EMPLOYEE_NAME', 'EFFECTIVE_DATE', 'POSITION'],
    sections: ['Confidential Information', 'Employee Obligations', 'Term', 'Remedies'],
    useCount: 189,
    rating: 4.6,
    isCustom: false,
    status: 'active',
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  },
  {
    id: 'service-1',
    title: 'Master Services Agreement',
    category: 'service',
    description: 'Comprehensive MSA for ongoing service relationships with attached SOWs for specific projects.',
    preview: 'This Master Services Agreement is entered into between [CLIENT_NAME] ("Client") and [PROVIDER_NAME] ("Provider")...',
    variables: ['CLIENT_NAME', 'PROVIDER_NAME', 'EFFECTIVE_DATE', 'GOVERNING_LAW'],
    sections: ['Services', 'Fees', 'Intellectual Property', 'Warranties', 'Limitation of Liability', 'Indemnification', 'Term'],
    useCount: 98,
    rating: 4.5,
    isCustom: false,
    status: 'active',
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  },
  {
    id: 'ip-1',
    title: 'Invention Assignment Agreement',
    category: 'ip',
    description: 'Agreement assigning employee inventions and intellectual property to the company.',
    preview: 'This Invention Assignment Agreement is made between [COMPANY_NAME] and [EMPLOYEE_NAME]...',
    variables: ['COMPANY_NAME', 'EMPLOYEE_NAME', 'EFFECTIVE_DATE'],
    sections: ['Assignment of Inventions', 'Disclosure', 'Assistance', 'Prior Inventions', 'Works for Hire'],
    useCount: 145,
    rating: 4.7,
    isCustom: false,
    status: 'active',
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  },
  {
    id: 'partner-1',
    title: 'Co-Founder Agreement',
    category: 'partnership',
    description: 'Agreement between co-founders covering equity splits, roles, vesting, and exit scenarios.',
    preview: 'This Co-Founder Agreement is entered into by the undersigned founders of [COMPANY_NAME]...',
    variables: ['COMPANY_NAME', 'FOUNDER_NAMES', 'EQUITY_SPLIT', 'VESTING_PERIOD', 'CLIFF_PERIOD'],
    sections: ['Equity Allocation', 'Vesting', 'Roles and Responsibilities', 'Decision Making', 'IP Assignment', 'Exit Provisions'],
    useCount: 76,
    rating: 4.8,
    isCustom: false,
    status: 'active',
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  },
  {
    id: 'invest-1',
    title: 'SAFE Agreement',
    category: 'investment',
    description: 'Simple Agreement for Future Equity - Y Combinator standard for early-stage investment.',
    preview: 'This SAFE is entered into on [DATE] between [COMPANY_NAME] and [INVESTOR_NAME]...',
    variables: ['COMPANY_NAME', 'INVESTOR_NAME', 'PURCHASE_AMOUNT', 'VALUATION_CAP', 'DISCOUNT_RATE'],
    sections: ['Purchase Amount', 'Conversion', 'Valuation Cap', 'Discount', 'Pro Rata Rights', 'Definitions'],
    useCount: 89,
    rating: 4.9,
    isCustom: false,
    status: 'active',
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  },
  {
    id: 'advisor-1',
    title: 'Advisor Agreement',
    category: 'service',
    description: 'Agreement for startup advisors including equity compensation and vesting terms.',
    preview: 'This Advisor Agreement is made between [COMPANY_NAME] and [ADVISOR_NAME]...',
    variables: ['COMPANY_NAME', 'ADVISOR_NAME', 'EQUITY_GRANT', 'VESTING_PERIOD', 'SERVICES'],
    sections: ['Services', 'Equity Compensation', 'Vesting', 'Confidentiality', 'IP Assignment', 'Term'],
    useCount: 112,
    rating: 4.6,
    isCustom: false,
    status: 'active',
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  },
  {
    id: 'sales-1',
    title: 'SaaS Subscription Agreement',
    category: 'sales',
    description: 'Standard terms for SaaS product subscriptions including service levels and usage terms.',
    preview: 'This Subscription Agreement governs access to [PRODUCT_NAME] provided by [COMPANY_NAME]...',
    variables: ['COMPANY_NAME', 'PRODUCT_NAME', 'SUBSCRIPTION_FEE', 'BILLING_CYCLE', 'SLA_UPTIME'],
    sections: ['Subscription', 'Fees', 'Service Levels', 'Data', 'Security', 'Termination', 'Limitation of Liability'],
    useCount: 67,
    rating: 4.4,
    isCustom: false,
    status: 'active',
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  },
]

export default function ContractTemplatesPage() {
  const [activeTab, setActiveTab] = useState('templates')
  const [templates, setTemplates] = useState<ContractTemplate[]>(defaultTemplates)
  const [customContracts, setCustomContracts] = useState<CustomContract[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)

  const tabs = [
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'my-contracts', label: 'My Contracts', icon: Briefcase },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contractTemplatesData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.customContracts) setCustomContracts(data.customContracts)
          if (data.favorites) setFavorites(data.favorites)
        } catch (e) {
          console.error('Error loading data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    localStorage.setItem('contractTemplatesData', JSON.stringify({
      customContracts, favorites, lastSaved: new Date().toISOString()
    }))
    showToast('Data saved!', 'success')
  }

  const toggleFavorite = (id: string) => {
    setFavorites(favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id])
    saveToLocalStorage()
  }

  const useTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template)
    const initialVars: Record<string, string> = {}
    template.variables.forEach(v => { initialVars[v] = '' })
    setVariables(initialVars)
  }

  const createContract = () => {
    if (!selectedTemplate) return
    
    const hasEmptyRequired = Object.values(variables).some(v => !v)
    if (hasEmptyRequired) {
      showToast('Please fill in all variables', 'error')
      return
    }

    const newContract: CustomContract = {
      id: Date.now().toString(),
      templateId: selectedTemplate.id,
      title: `${selectedTemplate.title} - ${variables['COMPANY_NAME'] || 'Draft'}`,
      status: 'draft',
      variables: { ...variables },
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }

    setCustomContracts([...customContracts, newContract])
    
    // Update template use count
    setTemplates(templates.map(t => 
      t.id === selectedTemplate.id 
        ? { ...t, useCount: t.useCount + 1, lastUsed: new Date().toISOString() }
        : t
    ))
    
    setSelectedTemplate(null)
    setVariables({})
    saveToLocalStorage()
    showToast('Contract created!', 'success')
  }

  const deleteContract = (id: string) => {
    if (confirm('Delete this contract?')) {
      setCustomContracts(customContracts.filter(c => c.id !== id))
      saveToLocalStorage()
      showToast('Contract deleted', 'info')
    }
  }

  const generatePreview = () => {
    if (!selectedTemplate) return ''
    let preview = selectedTemplate.preview
    Object.entries(variables).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`\\[${key}\\]`, 'g'), value || `[${key}]`)
    })
    return preview
  }

  const downloadContract = (contract: CustomContract) => {
    const template = templates.find(t => t.id === contract.templateId)
    if (!template) return

    let content = template.preview
    Object.entries(contract.variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value)
    })

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${contract.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Contract downloaded!', 'success')
  }

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const favoriteTemplates = templates.filter(t => favorites.includes(t.id))
  const topTemplates = [...templates].sort((a, b) => b.useCount - a.useCount).slice(0, 5)

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Contract Templates Library
              </span>
            </h1>
            <FileText className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional legal templates for startups - customize and generate contracts in minutes
          </p>
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && !selectedTemplate && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Contract Templates</h2>
                  <p className="text-gray-600">{templates.length} templates available</p>
                </div>
                <div className="flex gap-2">
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search templates..." className="w-48" />
                  <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                    options={[{ value: 'all', label: 'All Categories' }, ...Object.entries(categoryInfo).map(([v, i]) => ({ value: v, label: i.label }))]} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map(template => {
                  const CategoryIcon = categoryInfo[template.category].icon
                  const isFavorite = favorites.includes(template.id)
                  return (
                    <Card key={template.id} className="p-4 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-primary-500/10`}>
                            <CategoryIcon className={`h-5 w-5 ${categoryInfo[template.category].color}`} />
                          </div>
                          <Badge variant="outline">{categoryInfo[template.category].label}</Badge>
                        </div>
                        <button onClick={() => toggleFavorite(template.id)} className="text-yellow-500 hover:text-yellow-600">
                          {isFavorite ? <Star className="h-5 w-5 fill-current" /> : <StarOff className="h-5 w-5" />}
                        </button>
                      </div>
                      <h3 className="font-semibold mb-2">{template.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" /> {template.rating}
                        </span>
                        <span>•</span>
                        <span>{template.useCount} uses</span>
                        <span>•</span>
                        <span>{template.variables.length} variables</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => useTemplate(template)}>
                          <Copy className="h-4 w-4 mr-2" /> Use Template
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedTemplate(template); setShowPreview(true) }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Template Editor */}
        {selectedTemplate && !showPreview && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
                    <XCircle className="h-5 w-5" />
                  </Button>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTemplate.title}</h2>
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowPreview(true)}>
                    <Eye className="h-4 w-4 mr-2" /> Preview
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Fill in Variables</h3>
                  <div className="space-y-4">
                    {selectedTemplate.variables.map(variable => (
                      <div key={variable}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {variable.replace(/_/g, ' ')} *
                        </label>
                        <Input
                          value={variables[variable] || ''}
                          onChange={(e) => setVariables({ ...variables, [variable]: e.target.value })}
                          placeholder={`Enter ${variable.replace(/_/g, ' ').toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button onClick={createContract} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" /> Create Contract
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedTemplate(null)}>Cancel</Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Template Information</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Sections Included</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.sections.map(section => (
                          <Badge key={section} variant="outline">{section}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Template Stats</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Rating: <span className="font-medium">{selectedTemplate.rating}/5</span></div>
                        <div>Uses: <span className="font-medium">{selectedTemplate.useCount}</span></div>
                        <div>Category: <span className="font-medium">{categoryInfo[selectedTemplate.category].label}</span></div>
                        <div>Variables: <span className="font-medium">{selectedTemplate.variables.length}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Preview Modal */}
        {selectedTemplate && showPreview && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Preview: {selectedTemplate.title}</h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Variables
                  </Button>
                  <Button variant="ghost" onClick={() => { setSelectedTemplate(null); setShowPreview(false) }}>
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg font-mono text-sm whitespace-pre-wrap">
                {generatePreview()}
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={createContract}>
                  <CheckCircle className="h-4 w-4 mr-2" /> Create Contract
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Back to Editor
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* My Contracts Tab */}
        {activeTab === 'my-contracts' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Contracts</h2>
                <Badge variant="outline">{customContracts.length} contracts</Badge>
              </div>

              {customContracts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Briefcase className="h-16 w-16 mx-auto mb-4" />
                  <p>No contracts created yet. Start by using a template.</p>
                  <Button className="mt-4" onClick={() => setActiveTab('templates')}>
                    Browse Templates
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {customContracts.map(contract => {
                    const template = templates.find(t => t.id === contract.templateId)
                    return (
                      <Card key={contract.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{contract.title}</h4>
                              <Badge className={contract.status === 'finalized' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {contract.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Template: {template?.title || 'Unknown'}</p>
                            <div className="text-sm text-gray-500">
                              <Clock className="h-4 w-4 inline" /> Created: {new Date(contract.created).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => downloadContract(contract)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteContract(contract.id)}>
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

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Favorite Templates</h2>
              {favoriteTemplates.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Star className="h-16 w-16 mx-auto mb-4" />
                  <p>No favorites yet. Star templates you use frequently.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteTemplates.map(template => {
                    const CategoryIcon = categoryInfo[template.category].icon
                    return (
                      <Card key={template.id} className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CategoryIcon className={`h-5 w-5 ${categoryInfo[template.category].color}`} />
                          <Badge variant="outline">{categoryInfo[template.category].label}</Badge>
                          <button onClick={() => toggleFavorite(template.id)} className="ml-auto text-yellow-500">
                            <Star className="h-5 w-5 fill-current" />
                          </button>
                        </div>
                        <h3 className="font-semibold mb-2">{template.title}</h3>
                        <Button size="sm" className="w-full" onClick={() => useTemplate(template)}>
                          Use Template
                        </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Templates</div>
                <div className="text-2xl font-bold">{templates.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">My Contracts</div>
                <div className="text-2xl font-bold">{customContracts.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Favorites</div>
                <div className="text-2xl font-bold text-yellow-600">{favorites.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Categories</div>
                <div className="text-2xl font-bold">{Object.keys(categoryInfo).length}</div>
              </Card>
            </div>

            <Card>
              <h3 className="font-semibold mb-4">Most Popular Templates</h3>
              <div className="space-y-3">
                {topTemplates.map((template, idx) => (
                  <div key={template.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{template.title}</h4>
                      <div className="text-sm text-gray-500">{template.useCount} uses • {template.rating} rating</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => useTemplate(template)}>
                      Use
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold mb-4">Templates by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(categoryInfo).map(([category, info]) => {
                  const Icon = info.icon
                  const count = templates.filter(t => t.category === category).length
                  return (
                    <div key={category} className="p-4 bg-gray-50 rounded-lg text-center">
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${info.color}`} />
                      <div className="font-medium">{info.label}</div>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-xs text-gray-500">templates</div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}

