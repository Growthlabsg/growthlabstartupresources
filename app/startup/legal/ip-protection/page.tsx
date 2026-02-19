'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  FileText, 
  Shield, 
  Copyright,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  HelpCircle,
  Sparkles,
  Calculator,
  BookOpen,
  Download,
  Share2,
  ArrowRight,
  Check,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Users
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

type IPType = 'patent' | 'trademark' | 'copyright' | 'trade-secret'
type IPStatus = 'planning' | 'filing' | 'pending' | 'approved' | 'rejected' | 'maintenance' | 'expired'

interface IPAsset {
  id: string
  type: IPType
  title: string
  description: string
  status: IPStatus
  filingDate: string
  registrationDate?: string
  expirationDate?: string
  jurisdiction: string
  cost: number
  renewalCost?: number
  applicationNumber?: string
  registrationNumber?: string
  notes?: string
  created: string
  modified: string
}

interface IPTypeInfo {
  id: IPType
  title: string
  shortName: string
  description: string
  protection: string
  duration: string
  cost: string
  timeline: string
  requirements: string[]
  pros: string[]
  cons: string[]
  bestFor: string[]
  icon: typeof FileText
}

const ipTypes: IPTypeInfo[] = [
  {
    id: 'patent',
    title: 'Patent',
    shortName: 'Patent',
    description: 'Exclusive rights granted for an invention, providing the right to exclude others from making, using, or selling the invention',
    protection: '20 years from filing date (utility patents)',
    duration: '20 years (utility), 15 years (design)',
    cost: '$5,000 - $15,000+',
    timeline: '2-3 years',
    requirements: [
      'Novel invention',
      'Non-obvious',
      'Useful',
      'Detailed description',
      'Claims defining the invention',
      'Drawings (if applicable)'
    ],
    pros: [
      'Strongest IP protection',
      'Exclusive rights for 20 years',
      'Can license or sell',
      'Deters competitors',
      'Increases company value',
      'Can be used as collateral'
    ],
    cons: [
      'Expensive to file and maintain',
      'Long application process',
      'Public disclosure required',
      'Complex application process',
      'Maintenance fees required',
      'Geographic limitations'
    ],
    bestFor: [
      'Inventions and innovations',
      'Technology products',
      'Manufacturing processes',
      'Software algorithms',
      'Medical devices',
      'Biotech innovations'
    ],
    icon: FileText
  },
  {
    id: 'trademark',
    title: 'Trademark',
    shortName: 'Trademark',
    description: 'Protects brand names, logos, slogans, and other identifiers that distinguish your goods or services',
    protection: '10 years, renewable indefinitely',
    duration: 'Indefinite (with renewals)',
    cost: '$250 - $2,000+',
    timeline: '6-12 months',
    requirements: [
      'Distinctive mark',
      'Use in commerce',
      'Not confusingly similar',
      'Proper classification',
      'Specimen of use',
      'Description of goods/services'
    ],
    pros: [
      'Protects brand identity',
      'Renewable indefinitely',
      'Relatively affordable',
      'Faster than patents',
      'Nationwide protection',
      'Can license or franchise'
    ],
    cons: [
      'Limited to specific goods/services',
      'Must maintain use',
      'Renewal fees required',
      'Can be challenged',
      'Geographic limitations',
      'Must monitor for infringement'
    ],
    bestFor: [
      'Brand names and logos',
      'Product names',
      'Service marks',
      'Slogans and taglines',
      'Company names',
      'Domain names'
    ],
    icon: Shield
  },
  {
    id: 'copyright',
    title: 'Copyright',
    shortName: 'Copyright',
    description: 'Protects original works of authorship including software, content, designs, and creative works',
    protection: 'Life of author + 70 years (individuals) or 95 years (corporate)',
    duration: 'Life + 70 years or 95 years',
    cost: '$35 - $500',
    timeline: '3-9 months',
    requirements: [
      'Original work',
      'Fixed in tangible medium',
      'Minimal creativity',
      'Copyright notice (optional)',
      'Registration (optional but recommended)',
      'Deposit copy'
    ],
    pros: [
      'Automatic protection upon creation',
      'Very affordable',
      'Long duration',
      'Easy to register',
      'Protects expression, not ideas',
      'Can license or sell'
    ],
    cons: [
      'Does not protect ideas',
      'Limited to expression',
      'Registration recommended for enforcement',
      'Must prove originality',
      'Fair use exceptions',
      'International variations'
    ],
    bestFor: [
      'Software code',
      'Written content',
      'Designs and artwork',
      'Music and audio',
      'Videos and films',
      'Photography'
    ],
    icon: Copyright
  },
  {
    id: 'trade-secret',
    title: 'Trade Secret',
    shortName: 'Trade Secret',
    description: 'Confidential business information that provides competitive advantage and is kept secret',
    protection: 'Indefinite (as long as kept secret)',
    duration: 'Indefinite',
    cost: '$0 - $5,000',
    timeline: 'Immediate',
    requirements: [
      'Information has economic value',
      'Not generally known',
      'Reasonable efforts to maintain secrecy',
      'NDAs with employees/partners',
      'Confidentiality agreements',
      'Security measures'
    ],
    pros: [
      'No registration required',
      'No expiration',
      'Immediate protection',
      'No public disclosure',
      'Can last indefinitely',
      'Lower cost'
    ],
    cons: [
      'Lost if disclosed',
      'No protection against independent discovery',
      'Requires ongoing security',
      'Difficult to enforce',
      'Limited to secrets',
      'Must prove secrecy measures'
    ],
    bestFor: [
      'Proprietary algorithms',
      'Customer lists',
      'Manufacturing processes',
      'Business methods',
      'Formulas and recipes',
      'Confidential data'
    ],
    icon: Lock
  }
]

export default function IPProtectionPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedIPType, setSelectedIPType] = useState<IPType | null>(null)
  const [ipAssets, setIpAssets] = useState<IPAsset[]>([])
  const [editingAsset, setEditingAsset] = useState<IPAsset | null>(null)
  const [formData, setFormData] = useState({
    type: 'patent' as IPType,
    title: '',
    description: '',
    status: 'planning' as IPStatus,
    filingDate: new Date().toISOString().split('T')[0],
    registrationDate: '',
    expirationDate: '',
    jurisdiction: 'United States',
    cost: '',
    renewalCost: '',
    applicationNumber: '',
    registrationNumber: '',
    notes: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'portfolio', label: 'My IP Portfolio', icon: Target },
    { id: 'calculator', label: 'Cost Calculator', icon: Calculator },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
    { id: 'guide', label: 'Guide', icon: HelpCircle },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ipProtectionData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.ipAssets) setIpAssets(data.ipAssets)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        ipAssets,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('ipProtectionData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const addIPAsset = () => {
    if (!formData.title || !formData.description) {
      showToast('Please fill in title and description', 'error')
      return
    }

    const newAsset: IPAsset = {
      id: Date.now().toString(),
      type: formData.type,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      filingDate: formData.filingDate,
      registrationDate: formData.registrationDate || undefined,
      expirationDate: formData.expirationDate || undefined,
      jurisdiction: formData.jurisdiction,
      cost: parseFloat(formData.cost) || 0,
      renewalCost: formData.renewalCost ? parseFloat(formData.renewalCost) : undefined,
      applicationNumber: formData.applicationNumber || undefined,
      registrationNumber: formData.registrationNumber || undefined,
      notes: formData.notes || undefined,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }

    setIpAssets([...ipAssets, newAsset])
    setEditingAsset(null)
    setFormData({
      type: 'patent',
      title: '',
      description: '',
      status: 'planning',
      filingDate: new Date().toISOString().split('T')[0],
      registrationDate: '',
      expirationDate: '',
      jurisdiction: 'United States',
      cost: '',
      renewalCost: '',
      applicationNumber: '',
      registrationNumber: '',
      notes: ''
    })
    saveToLocalStorage()
    showToast('IP asset added!', 'success')
  }

  const updateIPAsset = () => {
    if (!editingAsset) return

    const updated: IPAsset = {
      ...editingAsset,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      filingDate: formData.filingDate,
      registrationDate: formData.registrationDate || undefined,
      expirationDate: formData.expirationDate || undefined,
      jurisdiction: formData.jurisdiction,
      cost: parseFloat(formData.cost) || 0,
      renewalCost: formData.renewalCost ? parseFloat(formData.renewalCost) : undefined,
      applicationNumber: formData.applicationNumber || undefined,
      registrationNumber: formData.registrationNumber || undefined,
      notes: formData.notes || undefined,
      modified: new Date().toISOString()
    }

    const updatedAssets = ipAssets.map(a => a.id === editingAsset.id ? updated : a)
    setIpAssets(updatedAssets)
    setEditingAsset(null)
    saveToLocalStorage()
    showToast('IP asset updated!', 'success')
  }

  const deleteIPAsset = (id: string) => {
    if (confirm('Are you sure you want to delete this IP asset?')) {
      const updated = ipAssets.filter(a => a.id !== id)
      setIpAssets(updated)
      saveToLocalStorage()
      showToast('IP asset deleted', 'info')
    }
  }

  const calculateTotalCost = () => {
    return ipAssets.reduce((sum, asset) => sum + asset.cost, 0)
  }

  const calculateAnnualCost = () => {
    return ipAssets.reduce((sum, asset) => sum + (asset.renewalCost || 0), 0)
  }

  const currentIPType = selectedIPType ? ipTypes.find(t => t.id === selectedIPType) : null
  const filteredAssets = ipAssets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || asset.type === filterType
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const statusLabels: Record<IPStatus, string> = {
    'planning': 'Planning',
    'filing': 'Filing',
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'maintenance': 'Maintenance',
    'expired': 'Expired'
  }

  const statusColors: Record<IPStatus, string> = {
    'planning': 'bg-gray-100 text-gray-800',
    'filing': 'bg-blue-100 text-blue-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'maintenance': 'bg-purple-100 text-purple-800',
    'expired': 'bg-orange-100 text-orange-800'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                IP Protection Resources
              </span>
          </h1>
            <Shield className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Protect your intellectual property with comprehensive guides, tools, and portfolio management
          </p>
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ipTypes.map((ipType) => {
                const IconComponent = ipType.icon
                return (
                  <Card
                    key={ipType.id}
                    className="hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedIPType(ipType.id)}
                  >
              <div className="bg-primary-500/10 p-3 rounded-lg text-primary-500 w-fit mb-4">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{ipType.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{ipType.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {ipType.cost}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Learn More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            {currentIPType && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary-500/10 p-3 rounded-lg text-primary-500">
                    {React.createElement(currentIPType.icon, { className: "h-6 w-6" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{currentIPType.title}</h2>
                    <p className="text-gray-600">{currentIPType.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Advantages
                    </h3>
                    <ul className="space-y-2">
                      {currentIPType.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      Disadvantages
                    </h3>
                    <ul className="space-y-2">
                      {currentIPType.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Key Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Protection Duration</div>
                      <div className="font-semibold">{currentIPType.duration}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Typical Cost</div>
                      <div className="font-semibold">{currentIPType.cost}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Timeline</div>
                      <div className="font-semibold">{currentIPType.timeline}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Best For</div>
                      <div className="text-sm">{currentIPType.bestFor.join(', ')}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {currentIPType.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">My IP Portfolio</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search IP assets..."
                    className="w-48"
                  />
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Types' },
                      { value: 'patent', label: 'Patent' },
                      { value: 'trademark', label: 'Trademark' },
                      { value: 'copyright', label: 'Copyright' },
                      { value: 'trade-secret', label: 'Trade Secret' }
                    ]}
                  />
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'planning', label: 'Planning' },
                      { value: 'filing', label: 'Filing' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'approved', label: 'Approved' },
                      { value: 'rejected', label: 'Rejected' },
                      { value: 'maintenance', label: 'Maintenance' },
                      { value: 'expired', label: 'Expired' }
                    ]}
                  />
                  <Button
                    onClick={() => {
                      setEditingAsset({
                        id: '',
                        type: 'patent',
                        title: '',
                        description: '',
                        status: 'planning',
                        filingDate: new Date().toISOString().split('T')[0],
                        jurisdiction: 'United States',
                        cost: 0,
                        created: new Date().toISOString(),
                        modified: new Date().toISOString()
                      })
                      setFormData({
                        type: 'patent',
                        title: '',
                        description: '',
                        status: 'planning',
                        filingDate: new Date().toISOString().split('T')[0],
                        registrationDate: '',
                        expirationDate: '',
                        jurisdiction: 'United States',
                        cost: '',
                        renewalCost: '',
                        applicationNumber: '',
                        registrationNumber: '',
                        notes: ''
                      })
                    }}
                    size="sm"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add IP Asset
                  </Button>
                </div>
              </div>

              {filteredAssets.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No IP assets found. Add your first IP asset to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAssets.map((asset) => {
                    const ipType = ipTypes.find(t => t.id === asset.type)
                    const IconComponent = ipType?.icon || FileText
                    return (
                      <Card key={asset.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="bg-primary-500/10 text-primary-600 p-2 rounded-lg">
                                {React.createElement(IconComponent, { className: "h-5 w-5" })}
                              </div>
                              <h4 className="font-semibold">{asset.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {ipType?.shortName || asset.type}
                              </Badge>
                              <Badge className={`text-xs ${statusColors[asset.status]}`}>
                                {statusLabels[asset.status]}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{asset.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Cost:</span> ${asset.cost.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Filing Date:</span> {new Date(asset.filingDate).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Jurisdiction:</span> {asset.jurisdiction}
                              </div>
                              {asset.applicationNumber && (
                                <div>
                                  <span className="font-medium">App #:</span> {asset.applicationNumber}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingAsset(asset)
                                setFormData({
                                  type: asset.type,
                                  title: asset.title,
                                  description: asset.description,
                                  status: asset.status,
                                  filingDate: asset.filingDate,
                                  registrationDate: asset.registrationDate || '',
                                  expirationDate: asset.expirationDate || '',
                                  jurisdiction: asset.jurisdiction,
                                  cost: asset.cost.toString(),
                                  renewalCost: asset.renewalCost?.toString() || '',
                                  applicationNumber: asset.applicationNumber || '',
                                  registrationNumber: asset.registrationNumber || '',
                                  notes: asset.notes || ''
                                })
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
              <Button
                              variant="ghost"
                size="sm"
                              onClick={() => deleteIPAsset(asset.id)}
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

            {editingAsset && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingAsset.id ? 'Edit IP Asset' : 'Add IP Asset'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingAsset(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IP Type *</label>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as IPType })}
                      options={ipTypes.map(t => ({ value: t.id, label: t.title }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Mobile App Patent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the IP asset..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                      <Select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as IPStatus })}
                        options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filing Date *</label>
                      <Input
                        type="date"
                        value={formData.filingDate}
                        onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
                      <Input
                        type="date"
                        value={formData.registrationDate}
                        onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                      <Input
                        type="date"
                        value={formData.expirationDate}
                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($) *</label>
                      <Input
                        type="number"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Renewal Cost ($)</label>
                      <Input
                        type="number"
                        value={formData.renewalCost}
                        onChange={(e) => setFormData({ ...formData, renewalCost: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Application Number</label>
                      <Input
                        value={formData.applicationNumber}
                        onChange={(e) => setFormData({ ...formData, applicationNumber: e.target.value })}
                        placeholder="e.g., US12345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                      <Input
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        placeholder="e.g., REG123456"
                      />
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
                  <div className="flex gap-2">
                    <Button onClick={editingAsset.id ? updateIPAsset : addIPAsset} className="flex-1">
                      {editingAsset.id ? 'Update Asset' : 'Add Asset'}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingAsset(null)}>
                      Cancel
              </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Cost Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total IP Assets</div>
                <div className="text-2xl font-bold">{ipAssets.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Investment</div>
                <div className="text-2xl font-bold">${calculateTotalCost().toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Annual Renewal Cost</div>
                <div className="text-2xl font-bold">${calculateAnnualCost().toLocaleString()}</div>
              </Card>
            </div>
            <Card>
              <h3 className="font-semibold mb-4">IP Cost Breakdown</h3>
              <div className="space-y-4">
                {ipTypes.map((ipType) => {
                  const typeAssets = ipAssets.filter(a => a.type === ipType.id)
                  const typeCost = typeAssets.reduce((sum, a) => sum + a.cost, 0)
                  const typeCount = typeAssets.length
                  return (
                    <div key={ipType.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-500/10 text-primary-600 p-2 rounded-lg">
                          {React.createElement(ipType.icon, { className: "h-5 w-5" })}
                        </div>
                        <div>
                          <div className="font-semibold">{ipType.title}</div>
                          <div className="text-sm text-gray-600">{typeCount} asset{typeCount !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${typeCost.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Total cost</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">IP Type Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">IP Type</th>
                      <th className="text-left p-3">Duration</th>
                      <th className="text-left p-3">Cost</th>
                      <th className="text-left p-3">Timeline</th>
                      <th className="text-left p-3">Protection</th>
                      <th className="text-left p-3">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ipTypes.map((ipType) => (
                      <tr key={ipType.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">{ipType.title}</td>
                        <td className="p-3">{ipType.duration}</td>
                        <td className="p-3">{ipType.cost}</td>
                        <td className="p-3">{ipType.timeline}</td>
                        <td className="p-3">{ipType.protection}</td>
                        <td className="p-3">{ipType.bestFor.slice(0, 2).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Guide Tab */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">IP Protection Best Practices</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">1. Start Early</h3>
                  <p className="text-gray-600 mb-2">
                    Begin protecting your IP as soon as you create it. Early protection prevents others from claiming your innovations.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li>File provisional patents before public disclosure</li>
                    <li>Register trademarks before launch</li>
                    <li>Use copyright notices on all creative works</li>
                    <li>Implement trade secret protections from day one</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">2. Document Everything</h3>
                  <p className="text-gray-600 mb-2">
                    Maintain detailed records of your IP creation process, including dates, inventors, and development milestones.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">3. Use NDAs</h3>
                  <p className="text-gray-600 mb-2">
                    Always use Non-Disclosure Agreements when sharing confidential information with employees, partners, or investors.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">4. Monitor and Enforce</h3>
                  <p className="text-gray-600 mb-2">
                    Regularly monitor for infringement and be prepared to enforce your IP rights when necessary.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">5. Consider International Protection</h3>
                  <p className="text-gray-600 mb-2">
                    If you plan to operate internationally, consider filing for IP protection in those countries as well.
                  </p>
                </div>
              </div>
            </Card>
        </div>
        )}
      </div>
    </main>
  )
}
