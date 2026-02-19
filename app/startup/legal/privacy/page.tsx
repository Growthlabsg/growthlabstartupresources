'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Shield, FileText, CheckCircle, XCircle, Plus, Edit, Trash2, Download,
  Lock, Eye, EyeOff, AlertTriangle, Globe, Users, Database, Key,
  ClipboardList, BarChart3, Search, Copy, Settings, Sparkles, AlertCircle,
  Calendar, Clock, Target, BookOpen, RefreshCw, ExternalLink
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type RegulationType = 'gdpr' | 'ccpa' | 'hipaa' | 'sox' | 'pci-dss' | 'iso-27001' | 'soc2'
type ComplianceStatus = 'compliant' | 'partial' | 'non-compliant' | 'not-applicable'
type DataCategory = 'personal' | 'sensitive' | 'financial' | 'health' | 'biometric' | 'location'
type AuditStatus = 'scheduled' | 'in-progress' | 'completed' | 'failed' | 'remediation'

interface ComplianceRequirement {
  id: string
  regulation: RegulationType
  requirement: string
  description: string
  category: string
  status: ComplianceStatus
  evidence?: string
  dueDate?: string
  assignee?: string
  notes?: string
}

interface DataInventory {
  id: string
  name: string
  category: DataCategory
  source: string
  purpose: string
  retention: string
  thirdPartySharing: boolean
  encryption: boolean
  accessControls: string
  location: string
  legalBasis?: string
}

interface SecurityAudit {
  id: string
  title: string
  type: string
  status: AuditStatus
  scheduledDate: string
  completedDate?: string
  findings: number
  criticalFindings: number
  auditor: string
  nextAuditDate?: string
  notes?: string
}

interface PolicyDocument {
  id: string
  title: string
  type: string
  version: string
  effectiveDate: string
  reviewDate: string
  status: 'draft' | 'active' | 'archived'
  lastUpdated: string
}

const regulationInfo: Record<RegulationType, { name: string; description: string; region: string }> = {
  'gdpr': { name: 'GDPR', description: 'General Data Protection Regulation (EU)', region: 'European Union' },
  'ccpa': { name: 'CCPA/CPRA', description: 'California Consumer Privacy Act', region: 'California, USA' },
  'hipaa': { name: 'HIPAA', description: 'Health Insurance Portability and Accountability Act', region: 'USA' },
  'sox': { name: 'SOX', description: 'Sarbanes-Oxley Act', region: 'USA' },
  'pci-dss': { name: 'PCI-DSS', description: 'Payment Card Industry Data Security Standard', region: 'Global' },
  'iso-27001': { name: 'ISO 27001', description: 'Information Security Management', region: 'Global' },
  'soc2': { name: 'SOC 2', description: 'Service Organization Control 2', region: 'Global' }
}

const statusColors: Record<ComplianceStatus, string> = {
  'compliant': 'bg-green-100 text-green-800',
  'partial': 'bg-yellow-100 text-yellow-800',
  'non-compliant': 'bg-red-100 text-red-800',
  'not-applicable': 'bg-gray-100 text-gray-800'
}

const auditStatusColors: Record<AuditStatus, string> = {
  'scheduled': 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
  'failed': 'bg-red-100 text-red-800',
  'remediation': 'bg-orange-100 text-orange-800'
}

const defaultGDPRRequirements: ComplianceRequirement[] = [
  { id: '1', regulation: 'gdpr', requirement: 'Lawful Basis for Processing', description: 'Document lawful basis for each data processing activity', category: 'Legal Basis', status: 'non-compliant' },
  { id: '2', regulation: 'gdpr', requirement: 'Data Subject Rights', description: 'Implement processes for access, deletion, and portability requests', category: 'Rights', status: 'non-compliant' },
  { id: '3', regulation: 'gdpr', requirement: 'Privacy Notice', description: 'Provide clear and transparent privacy notice', category: 'Transparency', status: 'non-compliant' },
  { id: '4', regulation: 'gdpr', requirement: 'Consent Management', description: 'Obtain and manage valid consent for data processing', category: 'Consent', status: 'non-compliant' },
  { id: '5', regulation: 'gdpr', requirement: 'Data Processing Agreements', description: 'Execute DPAs with all data processors', category: 'Contracts', status: 'non-compliant' },
  { id: '6', regulation: 'gdpr', requirement: 'Data Protection Impact Assessment', description: 'Conduct DPIAs for high-risk processing', category: 'Risk', status: 'non-compliant' },
  { id: '7', regulation: 'gdpr', requirement: 'Breach Notification', description: 'Implement 72-hour breach notification process', category: 'Incident Response', status: 'non-compliant' },
  { id: '8', regulation: 'gdpr', requirement: 'Records of Processing', description: 'Maintain Article 30 records of processing activities', category: 'Documentation', status: 'non-compliant' },
  { id: '9', regulation: 'gdpr', requirement: 'Data Minimization', description: 'Collect only necessary data for specified purposes', category: 'Principles', status: 'non-compliant' },
  { id: '10', regulation: 'gdpr', requirement: 'Security Measures', description: 'Implement appropriate technical and organizational measures', category: 'Security', status: 'non-compliant' },
]

const securityChecklist = [
  { id: '1', category: 'Access Control', item: 'Multi-factor authentication enabled', critical: true },
  { id: '2', category: 'Access Control', item: 'Role-based access control implemented', critical: true },
  { id: '3', category: 'Access Control', item: 'Password policy enforced (12+ chars, complexity)', critical: true },
  { id: '4', category: 'Access Control', item: 'Session timeout configured (15-30 mins)', critical: false },
  { id: '5', category: 'Encryption', item: 'Data encrypted at rest (AES-256)', critical: true },
  { id: '6', category: 'Encryption', item: 'Data encrypted in transit (TLS 1.2+)', critical: true },
  { id: '7', category: 'Encryption', item: 'Encryption key management implemented', critical: true },
  { id: '8', category: 'Network', item: 'Firewall configured and monitored', critical: true },
  { id: '9', category: 'Network', item: 'Intrusion detection/prevention system', critical: false },
  { id: '10', category: 'Network', item: 'VPN for remote access', critical: false },
  { id: '11', category: 'Monitoring', item: 'Security event logging enabled', critical: true },
  { id: '12', category: 'Monitoring', item: 'Log retention (90+ days)', critical: false },
  { id: '13', category: 'Monitoring', item: 'Alert system for security events', critical: true },
  { id: '14', category: 'Backup', item: 'Regular automated backups', critical: true },
  { id: '15', category: 'Backup', item: 'Backup encryption', critical: true },
  { id: '16', category: 'Backup', item: 'Disaster recovery plan tested', critical: false },
  { id: '17', category: 'Vulnerability', item: 'Regular vulnerability scanning', critical: true },
  { id: '18', category: 'Vulnerability', item: 'Penetration testing (annual)', critical: false },
  { id: '19', category: 'Vulnerability', item: 'Patch management process', critical: true },
  { id: '20', category: 'Training', item: 'Security awareness training', critical: true },
]

export default function PrivacySecurityPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>(defaultGDPRRequirements)
  const [dataInventory, setDataInventory] = useState<DataInventory[]>([])
  const [audits, setAudits] = useState<SecurityAudit[]>([])
  const [policies, setPolicies] = useState<PolicyDocument[]>([])
  const [securityItems, setSecurityItems] = useState(securityChecklist.map(item => ({ ...item, completed: false })))
  const [selectedRegulation, setSelectedRegulation] = useState<RegulationType>('gdpr')
  const [editingData, setEditingData] = useState<DataInventory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [dataForm, setDataForm] = useState({
    name: '', category: 'personal' as DataCategory, source: '', purpose: '',
    retention: '12 months', thirdPartySharing: false, encryption: true,
    accessControls: '', location: 'United States', legalBasis: 'consent'
  })

  const [policyForm, setPolicyForm] = useState({
    title: '', type: 'privacy-policy', version: '1.0',
    effectiveDate: new Date().toISOString().split('T')[0]
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'compliance', label: 'Compliance', icon: CheckCircle },
    { id: 'data-mapping', label: 'Data Mapping', icon: Database },
    { id: 'security', label: 'Security Audit', icon: Lock },
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('privacySecurityData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.requirements) setRequirements(data.requirements)
          if (data.dataInventory) setDataInventory(data.dataInventory)
          if (data.audits) setAudits(data.audits)
          if (data.policies) setPolicies(data.policies)
          if (data.securityItems) setSecurityItems(data.securityItems)
        } catch (e) {
          console.error('Error loading data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    localStorage.setItem('privacySecurityData', JSON.stringify({
      requirements, dataInventory, audits, policies, securityItems,
      lastSaved: new Date().toISOString()
    }))
    showToast('Data saved!', 'success')
  }

  const updateRequirementStatus = (id: string, status: ComplianceStatus) => {
    setRequirements(requirements.map(r => r.id === id ? { ...r, status } : r))
    saveToLocalStorage()
  }

  const toggleSecurityItem = (id: string) => {
    setSecurityItems(securityItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
    saveToLocalStorage()
  }

  const addDataInventory = () => {
    if (!dataForm.name || !dataForm.purpose) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const newData: DataInventory = {
      id: Date.now().toString(),
      name: dataForm.name,
      category: dataForm.category,
      source: dataForm.source,
      purpose: dataForm.purpose,
      retention: dataForm.retention,
      thirdPartySharing: dataForm.thirdPartySharing,
      encryption: dataForm.encryption,
      accessControls: dataForm.accessControls,
      location: dataForm.location,
      legalBasis: dataForm.legalBasis
    }

    setDataInventory([...dataInventory, newData])
    setEditingData(null)
    setDataForm({
      name: '', category: 'personal', source: '', purpose: '',
      retention: '12 months', thirdPartySharing: false, encryption: true,
      accessControls: '', location: 'United States', legalBasis: 'consent'
    })
    saveToLocalStorage()
    showToast('Data added to inventory!', 'success')
  }

  const deleteDataInventory = (id: string) => {
    if (confirm('Delete this data from inventory?')) {
      setDataInventory(dataInventory.filter(d => d.id !== id))
      saveToLocalStorage()
      showToast('Data removed', 'info')
    }
  }

  const addPolicy = () => {
    if (!policyForm.title) {
      showToast('Please enter a policy title', 'error')
      return
    }

    const newPolicy: PolicyDocument = {
      id: Date.now().toString(),
      title: policyForm.title,
      type: policyForm.type,
      version: policyForm.version,
      effectiveDate: policyForm.effectiveDate,
      reviewDate: new Date(new Date(policyForm.effectiveDate).setFullYear(new Date(policyForm.effectiveDate).getFullYear() + 1)).toISOString().split('T')[0],
      status: 'draft',
      lastUpdated: new Date().toISOString()
    }

    setPolicies([...policies, newPolicy])
    setPolicyForm({ title: '', type: 'privacy-policy', version: '1.0', effectiveDate: new Date().toISOString().split('T')[0] })
    saveToLocalStorage()
    showToast('Policy created!', 'success')
  }

  const filteredRequirements = requirements.filter(r =>
    r.regulation === selectedRegulation &&
    (r.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
     r.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const compliantCount = requirements.filter(r => r.status === 'compliant').length
  const partialCount = requirements.filter(r => r.status === 'partial').length
  const totalRequirements = requirements.length
  const complianceScore = Math.round((compliantCount + partialCount * 0.5) / totalRequirements * 100)

  const securityCompleted = securityItems.filter(i => i.completed).length
  const securityTotal = securityItems.length
  const securityScore = Math.round((securityCompleted / securityTotal) * 100)

  const criticalSecurityCompleted = securityItems.filter(i => i.critical && i.completed).length
  const criticalSecurityTotal = securityItems.filter(i => i.critical).length

  const complianceByStatus = [
    { name: 'Compliant', value: compliantCount, color: '#10b981' },
    { name: 'Partial', value: partialCount, color: '#f59e0b' },
    { name: 'Non-Compliant', value: requirements.filter(r => r.status === 'non-compliant').length, color: '#ef4444' },
  ].filter(d => d.value > 0)

  const dataByCategory = Array.from(new Set(dataInventory.map(d => d.category))).map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: dataInventory.filter(d => d.category === cat).length
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            Data Privacy & Security
              </span>
          </h1>
            <Shield className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ensure compliance with data protection regulations and maintain security best practices
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={saveToLocalStorage}>
                <Download className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div className="text-sm text-gray-600">Compliance Score</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{complianceScore}%</div>
                <div className="text-sm text-gray-500">{compliantCount}/{totalRequirements} requirements</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-5 w-5 text-green-500" />
                  <div className="text-sm text-gray-600">Security Score</div>
                </div>
                <div className="text-2xl font-bold text-green-600">{securityScore}%</div>
                <div className="text-sm text-gray-500">{securityCompleted}/{securityTotal} controls</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-purple-500" />
                  <div className="text-sm text-gray-600">Data Assets</div>
                </div>
                <div className="text-2xl font-bold">{dataInventory.length}</div>
                <div className="text-sm text-gray-500">in inventory</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-orange-500" />
                  <div className="text-sm text-gray-600">Active Policies</div>
                </div>
                <div className="text-2xl font-bold">{policies.filter(p => p.status === 'active').length}</div>
                <div className="text-sm text-gray-500">of {policies.length} total</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Supported Regulations</h3>
                <div className="space-y-3">
                  {Object.entries(regulationInfo).map(([key, info]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{info.name}</div>
                        <div className="text-sm text-gray-600">{info.description}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">{info.region}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => setActiveTab('compliance')}>
                    <CheckCircle className="h-6 w-6 mb-2 text-green-600" />
                    <span>Run Compliance Check</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => setActiveTab('security')}>
                    <Lock className="h-6 w-6 mb-2 text-blue-600" />
                    <span>Security Audit</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => setActiveTab('data-mapping')}>
                    <Database className="h-6 w-6 mb-2 text-purple-600" />
                    <span>Map Data</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => setActiveTab('policies')}>
                    <FileText className="h-6 w-6 mb-2 text-orange-600" />
                    <span>Manage Policies</span>
                  </Button>
                </div>
              </Card>
            </div>

            {criticalSecurityTotal > 0 && criticalSecurityCompleted < criticalSecurityTotal && (
              <Card className="p-4 bg-red-50 border-2 border-red-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800">Critical Security Controls Missing</h4>
                    <p className="text-sm text-red-600">
                      {criticalSecurityTotal - criticalSecurityCompleted} of {criticalSecurityTotal} critical security controls are not implemented.
                      <Button variant="ghost" size="sm" className="ml-2 text-red-700" onClick={() => setActiveTab('security')}>
                        Review Now
                      </Button>
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Compliance Requirements</h2>
                  <p className="text-gray-600">Track and manage regulatory compliance</p>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedRegulation} onChange={(e) => setSelectedRegulation(e.target.value as RegulationType)}
                    options={Object.entries(regulationInfo).map(([v, i]) => ({ value: v, label: i.name }))} />
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-40" />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{regulationInfo[selectedRegulation].name} Compliance</span>
                  <span className="text-sm text-gray-600">{complianceScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all ${complianceScore >= 80 ? 'bg-green-600' : complianceScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${complianceScore}%` }} />
                </div>
              </div>

              <div className="space-y-3">
                {filteredRequirements.map(req => (
                  <div key={req.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{req.requirement}</h4>
                        <Badge variant="outline" className="text-xs">{req.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{req.description}</p>
                    </div>
                    <Select value={req.status} onChange={(e) => updateRequirementStatus(req.id, e.target.value as ComplianceStatus)}
                      options={[
                        { value: 'compliant', label: '✓ Compliant' },
                        { value: 'partial', label: '◐ Partial' },
                        { value: 'non-compliant', label: '✗ Non-Compliant' },
                        { value: 'not-applicable', label: '- N/A' }
                      ]} className="w-40" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Data Mapping Tab */}
        {activeTab === 'data-mapping' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Data Inventory</h2>
                  <p className="text-gray-600">Map and track all personal data processing activities</p>
                </div>
                <Button onClick={() => setEditingData({ id: '', name: '', category: 'personal', source: '', purpose: '', retention: '', thirdPartySharing: false, encryption: false, accessControls: '', location: '' })} size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Data
                </Button>
              </div>

              {dataInventory.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Database className="h-16 w-16 mx-auto mb-4" />
                  <p>No data mapped yet. Add your first data processing activity.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dataInventory.map(data => (
                    <Card key={data.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{data.name}</h4>
                            <Badge variant="outline">{data.category}</Badge>
                            {data.encryption && <Badge className="bg-green-100 text-green-800">Encrypted</Badge>}
                            {data.thirdPartySharing && <Badge className="bg-yellow-100 text-yellow-800">Third-party</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{data.purpose}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                            <span><Globe className="h-4 w-4 inline" /> {data.location}</span>
                            <span><Clock className="h-4 w-4 inline" /> {data.retention}</span>
                            <span><Users className="h-4 w-4 inline" /> {data.source}</span>
                            {data.legalBasis && <span><FileText className="h-4 w-4 inline" /> {data.legalBasis}</span>}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteDataInventory(data.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {editingData && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add Data to Inventory</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingData(null)}>
                    <XCircle className="h-4 w-4" />
              </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data Name *</label>
                      <Input value={dataForm.name} onChange={(e) => setDataForm({ ...dataForm, name: e.target.value })} placeholder="e.g., User Email Addresses" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <Select value={dataForm.category} onChange={(e) => setDataForm({ ...dataForm, category: e.target.value as DataCategory })}
                        options={[{ value: 'personal', label: 'Personal' }, { value: 'sensitive', label: 'Sensitive' }, { value: 'financial', label: 'Financial' }, { value: 'health', label: 'Health' }, { value: 'biometric', label: 'Biometric' }, { value: 'location', label: 'Location' }]} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purpose *</label>
                    <Input value={dataForm.purpose} onChange={(e) => setDataForm({ ...dataForm, purpose: e.target.value })} placeholder="e.g., Account management and communication" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                      <Input value={dataForm.source} onChange={(e) => setDataForm({ ...dataForm, source: e.target.value })} placeholder="e.g., User registration" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period</label>
                      <Select value={dataForm.retention} onChange={(e) => setDataForm({ ...dataForm, retention: e.target.value })}
                        options={[{ value: '6 months', label: '6 months' }, { value: '12 months', label: '12 months' }, { value: '24 months', label: '24 months' }, { value: '5 years', label: '5 years' }, { value: 'Indefinite', label: 'Indefinite' }]} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Legal Basis</label>
                      <Select value={dataForm.legalBasis} onChange={(e) => setDataForm({ ...dataForm, legalBasis: e.target.value })}
                        options={[{ value: 'consent', label: 'Consent' }, { value: 'contract', label: 'Contract' }, { value: 'legal-obligation', label: 'Legal Obligation' }, { value: 'legitimate-interest', label: 'Legitimate Interest' }]} />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={dataForm.encryption} onChange={(e) => setDataForm({ ...dataForm, encryption: e.target.checked })} className="w-4 h-4" />
                      <span className="text-sm">Encrypted</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={dataForm.thirdPartySharing} onChange={(e) => setDataForm({ ...dataForm, thirdPartySharing: e.target.checked })} className="w-4 h-4" />
                      <span className="text-sm">Shared with Third Parties</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addDataInventory} className="flex-1">Add to Inventory</Button>
                    <Button variant="outline" onClick={() => setEditingData(null)}>Cancel</Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Security Score</div>
                <div className="text-2xl font-bold text-green-600">{securityScore}%</div>
                <div className="text-sm text-gray-500">{securityCompleted}/{securityTotal} controls</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Critical Controls</div>
                <div className="text-2xl font-bold text-red-600">{criticalSecurityCompleted}/{criticalSecurityTotal}</div>
                <div className="text-sm text-gray-500">implemented</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Missing Controls</div>
                <div className="text-2xl font-bold">{securityTotal - securityCompleted}</div>
                <div className="text-sm text-gray-500">to implement</div>
              </Card>
            </div>

            <Card>
              <h2 className="text-2xl font-bold mb-6">Security Controls Checklist</h2>
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full transition-all" style={{ width: `${securityScore}%` }} />
                </div>
              </div>

              {Array.from(new Set(securityItems.map(i => i.category))).map(category => (
                <div key={category} className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary-500" />
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {securityItems.filter(i => i.category === category).map(item => (
                      <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-primary-300'}`}
                        onClick={() => toggleSecurityItem(item.id)}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.completed ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                          {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>{item.item}</span>
                        {item.critical && <Badge className="bg-red-100 text-red-800 text-xs">Critical</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Policy Documents</h2>
                <Button size="sm" onClick={() => document.getElementById('policy-form')?.scrollIntoView()}>
                  <Plus className="h-4 w-4 mr-2" /> New Policy
                </Button>
              </div>

              {policies.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>No policies created yet. Add your first policy document.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {policies.map(policy => (
                    <Card key={policy.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{policy.title}</h4>
                            <Badge variant="outline">v{policy.version}</Badge>
                            <Badge className={policy.status === 'active' ? 'bg-green-100 text-green-800' : policy.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                              {policy.status}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span><Calendar className="h-4 w-4 inline" /> Effective: {new Date(policy.effectiveDate).toLocaleDateString()}</span>
                            <span><RefreshCw className="h-4 w-4 inline" /> Review: {new Date(policy.reviewDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                        </div>
                      </div>
            </Card>
          ))}
        </div>
              )}
            </Card>

            <Card className="p-6" id="policy-form">
              <h3 className="text-lg font-semibold mb-4">Create New Policy</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Policy Title *</label>
                    <Input value={policyForm.title} onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })} placeholder="e.g., Privacy Policy" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Select value={policyForm.type} onChange={(e) => setPolicyForm({ ...policyForm, type: e.target.value })}
                      options={[{ value: 'privacy-policy', label: 'Privacy Policy' }, { value: 'terms-of-service', label: 'Terms of Service' }, { value: 'cookie-policy', label: 'Cookie Policy' }, { value: 'data-retention', label: 'Data Retention Policy' }, { value: 'security-policy', label: 'Security Policy' }, { value: 'acceptable-use', label: 'Acceptable Use Policy' }]} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
                    <Input value={policyForm.version} onChange={(e) => setPolicyForm({ ...policyForm, version: e.target.value })} placeholder="1.0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
                    <Input type="date" value={policyForm.effectiveDate} onChange={(e) => setPolicyForm({ ...policyForm, effectiveDate: e.target.value })} />
                  </div>
                </div>
                <Button onClick={addPolicy}>Create Policy</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Overall Compliance</div>
                <div className="text-2xl font-bold text-blue-600">{complianceScore}%</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Security Posture</div>
                <div className="text-2xl font-bold text-green-600">{securityScore}%</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Data Assets</div>
                <div className="text-2xl font-bold">{dataInventory.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Policies</div>
                <div className="text-2xl font-bold">{policies.length}</div>
              </Card>
            </div>

            {complianceByStatus.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Compliance Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={complianceByStatus} cx="50%" cy="50%" labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`} outerRadius={100} dataKey="value">
                      {complianceByStatus.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}

            {dataByCategory.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Data Inventory by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name="Data Assets" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
