'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Users, FileText, CheckCircle, XCircle, Plus, Edit, Trash2, Download,
  DollarSign, Calendar, Clock, BookOpen, Shield, AlertCircle, Target,
  TrendingUp, Award, Briefcase, UserPlus, ClipboardList, BarChart3,
  Search, Filter, Copy, Eye, Settings, Sparkles
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type ContractType = 'full-time' | 'part-time' | 'contractor' | 'intern' | 'advisor' | 'consultant'
type ContractStatus = 'draft' | 'pending' | 'signed' | 'active' | 'terminated' | 'expired'
type EquityType = 'stock-options' | 'rsus' | 'phantom-stock' | 'profit-sharing'

interface EmploymentContract {
  id: string
  employeeName: string
  email: string
  role: string
  department: string
  type: ContractType
  status: ContractStatus
  startDate: string
  endDate?: string
  salary: number
  salaryType: 'annual' | 'hourly'
  equity?: {
    type: EquityType
    shares: number
    vestingPeriod: number
    cliffMonths: number
    strikePrice?: number
  }
  benefits: string[]
  probationPeriod?: number
  noticePeriod: number
  nonCompete?: boolean
  nda?: boolean
  created: string
  modified: string
}

interface ComplianceItem {
  id: string
  title: string
  description: string
  category: string
  required: boolean
  completed: boolean
  dueDate?: string
  notes?: string
  state?: string
}

interface EquityGrant {
  id: string
  employeeName: string
  type: EquityType
  shares: number
  grantDate: string
  vestingStart: string
  vestingPeriod: number
  cliffMonths: number
  vestedShares: number
  exercisedShares: number
  strikePrice: number
  status: 'active' | 'fully-vested' | 'cancelled' | 'exercised'
}

const contractTypes: Record<ContractType, { label: string; description: string }> = {
  'full-time': { label: 'Full-Time Employee', description: 'Standard full-time employment' },
  'part-time': { label: 'Part-Time Employee', description: 'Part-time employment' },
  'contractor': { label: 'Independent Contractor', description: '1099 contractor agreement' },
  'intern': { label: 'Intern', description: 'Paid or unpaid internship' },
  'advisor': { label: 'Advisor', description: 'Advisory agreement' },
  'consultant': { label: 'Consultant', description: 'Consulting agreement' }
}

const statusColors: Record<ContractStatus, string> = {
  'draft': 'bg-gray-100 text-gray-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'signed': 'bg-blue-100 text-blue-800',
  'active': 'bg-green-100 text-green-800',
  'terminated': 'bg-red-100 text-red-800',
  'expired': 'bg-orange-100 text-orange-800'
}

const defaultComplianceItems: ComplianceItem[] = [
  { id: '1', title: 'I-9 Employment Eligibility', description: 'Verify employment eligibility within 3 days of hire', category: 'Federal', required: true, completed: false },
  { id: '2', title: 'W-4 Tax Withholding', description: 'Collect federal tax withholding form', category: 'Federal', required: true, completed: false },
  { id: '3', title: 'State Tax Forms', description: 'Collect state-specific tax withholding forms', category: 'State', required: true, completed: false },
  { id: '4', title: 'Direct Deposit Authorization', description: 'Set up direct deposit for payroll', category: 'Payroll', required: false, completed: false },
  { id: '5', title: 'Employee Handbook Acknowledgment', description: 'Employee reviews and signs handbook receipt', category: 'Policies', required: true, completed: false },
  { id: '6', title: 'At-Will Employment Agreement', description: 'Acknowledge at-will employment status', category: 'Legal', required: true, completed: false },
  { id: '7', title: 'Confidentiality Agreement (NDA)', description: 'Sign non-disclosure agreement', category: 'Legal', required: true, completed: false },
  { id: '8', title: 'Invention Assignment Agreement', description: 'Assign IP rights to company', category: 'Legal', required: true, completed: false },
  { id: '9', title: 'Benefits Enrollment', description: 'Complete health insurance and benefits enrollment', category: 'Benefits', required: false, completed: false },
  { id: '10', title: '401(k) Enrollment', description: 'Set up retirement account contributions', category: 'Benefits', required: false, completed: false },
  { id: '11', title: 'Emergency Contact Form', description: 'Collect emergency contact information', category: 'HR', required: true, completed: false },
  { id: '12', title: 'Sexual Harassment Training', description: 'Complete required harassment prevention training', category: 'Training', required: true, completed: false },
  { id: '13', title: 'Safety Training', description: 'Complete workplace safety orientation', category: 'Training', required: true, completed: false },
  { id: '14', title: 'Equipment Agreement', description: 'Sign company equipment usage agreement', category: 'IT', required: false, completed: false },
  { id: '15', title: 'Background Check Authorization', description: 'Authorize and complete background check', category: 'HR', required: true, completed: false },
]

const contractTemplates = [
  { id: 'ft-standard', name: 'Standard Full-Time', type: 'full-time' as ContractType, description: 'Standard employment agreement for full-time employees' },
  { id: 'pt-standard', name: 'Standard Part-Time', type: 'part-time' as ContractType, description: 'Part-time employment agreement' },
  { id: 'contractor-standard', name: 'Contractor Agreement', type: 'contractor' as ContractType, description: 'Independent contractor agreement' },
  { id: 'intern-paid', name: 'Paid Internship', type: 'intern' as ContractType, description: 'Paid internship agreement' },
  { id: 'advisor-equity', name: 'Advisor Agreement', type: 'advisor' as ContractType, description: 'Advisor agreement with equity compensation' },
  { id: 'consultant-project', name: 'Project Consultant', type: 'consultant' as ContractType, description: 'Project-based consulting agreement' },
]

export default function EmploymentLawPage() {
  const [activeTab, setActiveTab] = useState('contracts')
  const [contracts, setContracts] = useState<EmploymentContract[]>([])
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(defaultComplianceItems)
  const [equityGrants, setEquityGrants] = useState<EquityGrant[]>([])
  const [editingContract, setEditingContract] = useState<EmploymentContract | null>(null)
  const [selectedContract, setSelectedContract] = useState<EmploymentContract | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedState, setSelectedState] = useState('California')
  
  const [contractForm, setContractForm] = useState({
    employeeName: '',
    email: '',
    role: '',
    department: '',
    type: 'full-time' as ContractType,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    salary: '',
    salaryType: 'annual' as 'annual' | 'hourly',
    probationPeriod: '90',
    noticePeriod: '14',
    nonCompete: false,
    nda: true,
    benefits: ['Health Insurance', 'Dental', 'Vision', 'PTO']
  })

  const [equityForm, setEquityForm] = useState({
    employeeName: '',
    type: 'stock-options' as EquityType,
    shares: '',
    grantDate: new Date().toISOString().split('T')[0],
    vestingPeriod: '48',
    cliffMonths: '12',
    strikePrice: ''
  })

  const tabs = [
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'equity', label: 'Equity', icon: TrendingUp },
    { id: 'templates', label: 'Templates', icon: Copy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('employmentLawData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.contracts) setContracts(data.contracts)
          if (data.complianceItems) setComplianceItems(data.complianceItems)
          if (data.equityGrants) setEquityGrants(data.equityGrants)
          if (data.selectedState) setSelectedState(data.selectedState)
        } catch (e) {
          console.error('Error loading data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    localStorage.setItem('employmentLawData', JSON.stringify({
      contracts, complianceItems, equityGrants, selectedState,
      lastSaved: new Date().toISOString()
    }))
    showToast('Data saved!', 'success')
  }

  const addContract = () => {
    if (!contractForm.employeeName || !contractForm.role) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const newContract: EmploymentContract = {
      id: Date.now().toString(),
      employeeName: contractForm.employeeName,
      email: contractForm.email,
      role: contractForm.role,
      department: contractForm.department,
      type: contractForm.type,
      status: 'draft',
      startDate: contractForm.startDate,
      endDate: contractForm.endDate || undefined,
      salary: parseFloat(contractForm.salary) || 0,
      salaryType: contractForm.salaryType,
      benefits: contractForm.benefits,
      probationPeriod: parseInt(contractForm.probationPeriod) || undefined,
      noticePeriod: parseInt(contractForm.noticePeriod) || 14,
      nonCompete: contractForm.nonCompete,
      nda: contractForm.nda,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }

    setContracts([...contracts, newContract])
    setEditingContract(null)
    resetContractForm()
    saveToLocalStorage()
    showToast('Contract created!', 'success')
  }

  const updateContractStatus = (id: string, status: ContractStatus) => {
    setContracts(contracts.map(c => c.id === id ? { ...c, status, modified: new Date().toISOString() } : c))
    saveToLocalStorage()
    showToast('Contract updated!', 'success')
  }

  const deleteContract = (id: string) => {
    if (confirm('Delete this contract?')) {
      setContracts(contracts.filter(c => c.id !== id))
      saveToLocalStorage()
      showToast('Contract deleted', 'info')
    }
  }

  const resetContractForm = () => {
    setContractForm({
      employeeName: '', email: '', role: '', department: '',
      type: 'full-time', startDate: new Date().toISOString().split('T')[0],
      endDate: '', salary: '', salaryType: 'annual', probationPeriod: '90',
      noticePeriod: '14', nonCompete: false, nda: true,
      benefits: ['Health Insurance', 'Dental', 'Vision', 'PTO']
    })
  }

  const toggleComplianceItem = (id: string) => {
    setComplianceItems(complianceItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
    saveToLocalStorage()
  }

  const addEquityGrant = () => {
    if (!equityForm.employeeName || !equityForm.shares) {
      showToast('Please fill in required fields', 'error')
      return
    }

    const newGrant: EquityGrant = {
      id: Date.now().toString(),
      employeeName: equityForm.employeeName,
      type: equityForm.type,
      shares: parseInt(equityForm.shares) || 0,
      grantDate: equityForm.grantDate,
      vestingStart: equityForm.grantDate,
      vestingPeriod: parseInt(equityForm.vestingPeriod) || 48,
      cliffMonths: parseInt(equityForm.cliffMonths) || 12,
      vestedShares: 0,
      exercisedShares: 0,
      strikePrice: parseFloat(equityForm.strikePrice) || 0,
      status: 'active'
    }

    setEquityGrants([...equityGrants, newGrant])
    setEquityForm({
      employeeName: '', type: 'stock-options', shares: '',
      grantDate: new Date().toISOString().split('T')[0],
      vestingPeriod: '48', cliffMonths: '12', strikePrice: ''
    })
    saveToLocalStorage()
    showToast('Equity grant added!', 'success')
  }

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || c.type === filterType
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const completedCompliance = complianceItems.filter(i => i.completed).length
  const totalCompliance = complianceItems.length
  const compliancePercent = Math.round((completedCompliance / totalCompliance) * 100)

  const totalEquity = equityGrants.reduce((sum, g) => sum + g.shares, 0)
  const totalVested = equityGrants.reduce((sum, g) => sum + g.vestedShares, 0)

  const contractsByType = Object.entries(contractTypes).map(([type, info]) => ({
    name: info.label,
    count: contracts.filter(c => c.type === type).length
  })).filter(d => d.count > 0)

  const complianceByCategory = Array.from(new Set(complianceItems.map(i => i.category))).map(cat => ({
    name: cat,
    completed: complianceItems.filter(i => i.category === cat && i.completed).length,
    total: complianceItems.filter(i => i.category === cat).length
  }))

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Employment Law Hub
              </span>
          </h1>
            <Users className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage employment contracts, ensure compliance, and track equity compensation
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex flex-wrap gap-2 justify-end">
              <Select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                options={usStates.map(s => ({ value: s, label: s }))}
                className="w-48"
              />
              <Button variant="outline" size="sm" onClick={saveToLocalStorage}>
                <Download className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </div>
        </div>

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">Employment Contracts</h2>
                <div className="flex flex-wrap gap-2">
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-40" />
                  <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                    options={[{ value: 'all', label: 'All Types' }, ...Object.entries(contractTypes).map(([v, i]) => ({ value: v, label: i.label }))]} />
                  <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    options={[{ value: 'all', label: 'All Status' }, { value: 'draft', label: 'Draft' }, { value: 'pending', label: 'Pending' }, { value: 'signed', label: 'Signed' }, { value: 'active', label: 'Active' }, { value: 'terminated', label: 'Terminated' }]} />
                  <Button onClick={() => setEditingContract({ id: '', employeeName: '', email: '', role: '', department: '', type: 'full-time', status: 'draft', startDate: '', salary: 0, salaryType: 'annual', benefits: [], noticePeriod: 14, created: '', modified: '' })} size="sm">
                    <Plus className="h-4 w-4 mr-2" /> New Contract
                  </Button>
                </div>
              </div>

              {filteredContracts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>No contracts found. Create your first employment contract.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContracts.map(contract => (
                    <Card key={contract.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{contract.employeeName}</h4>
                            <Badge variant="outline">{contractTypes[contract.type]?.label}</Badge>
                            <Badge className={statusColors[contract.status]}>{contract.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{contract.role} • {contract.department || 'No Department'}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span><DollarSign className="h-4 w-4 inline" /> ${contract.salary.toLocaleString()}/{contract.salaryType === 'annual' ? 'yr' : 'hr'}</span>
                            <span><Calendar className="h-4 w-4 inline" /> {new Date(contract.startDate).toLocaleDateString()}</span>
                            {contract.nda && <Badge variant="outline" className="text-xs">NDA</Badge>}
                            {contract.nonCompete && <Badge variant="outline" className="text-xs">Non-Compete</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {contract.status === 'draft' && (
                            <Button variant="ghost" size="sm" onClick={() => updateContractStatus(contract.id, 'pending')}>
                              Send
                            </Button>
                          )}
                          {contract.status === 'pending' && (
                            <Button variant="ghost" size="sm" onClick={() => updateContractStatus(contract.id, 'signed')}>
                              Mark Signed
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteContract(contract.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {editingContract && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create Employment Contract</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingContract(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name *</label>
                      <Input value={contractForm.employeeName} onChange={(e) => setContractForm({ ...contractForm, employeeName: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input value={contractForm.email} onChange={(e) => setContractForm({ ...contractForm, email: e.target.value })} placeholder="john@company.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role/Title *</label>
                      <Input value={contractForm.role} onChange={(e) => setContractForm({ ...contractForm, role: e.target.value })} placeholder="Software Engineer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <Input value={contractForm.department} onChange={(e) => setContractForm({ ...contractForm, department: e.target.value })} placeholder="Engineering" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type</label>
                      <Select value={contractForm.type} onChange={(e) => setContractForm({ ...contractForm, type: e.target.value as ContractType })}
                        options={Object.entries(contractTypes).map(([v, i]) => ({ value: v, label: i.label }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <Input type="date" value={contractForm.startDate} onChange={(e) => setContractForm({ ...contractForm, startDate: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date (if applicable)</label>
                      <Input type="date" value={contractForm.endDate} onChange={(e) => setContractForm({ ...contractForm, endDate: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                      <Input type="number" value={contractForm.salary} onChange={(e) => setContractForm({ ...contractForm, salary: e.target.value })} placeholder="75000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Salary Type</label>
                      <Select value={contractForm.salaryType} onChange={(e) => setContractForm({ ...contractForm, salaryType: e.target.value as 'annual' | 'hourly' })}
                        options={[{ value: 'annual', label: 'Annual' }, { value: 'hourly', label: 'Hourly' }]} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Probation Period (days)</label>
                      <Input type="number" value={contractForm.probationPeriod} onChange={(e) => setContractForm({ ...contractForm, probationPeriod: e.target.value })} placeholder="90" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={contractForm.nda} onChange={(e) => setContractForm({ ...contractForm, nda: e.target.checked })} className="w-4 h-4" />
                      <span className="text-sm">Include NDA</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={contractForm.nonCompete} onChange={(e) => setContractForm({ ...contractForm, nonCompete: e.target.checked })} className="w-4 h-4" />
                      <span className="text-sm">Include Non-Compete</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addContract} className="flex-1">Create Contract</Button>
                    <Button variant="outline" onClick={() => setEditingContract(null)}>Cancel</Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Compliance Progress</div>
                <div className="text-2xl font-bold text-green-600">{compliancePercent}%</div>
                <div className="text-sm text-gray-500">{completedCompliance}/{totalCompliance} items completed</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Required Items</div>
                <div className="text-2xl font-bold">{complianceItems.filter(i => i.required).length}</div>
                <div className="text-sm text-gray-500">{complianceItems.filter(i => i.required && i.completed).length} completed</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Selected State</div>
                <div className="text-2xl font-bold">{selectedState}</div>
                <div className="text-sm text-gray-500">State-specific requirements</div>
              </Card>
            </div>

            <Card>
              <h2 className="text-2xl font-bold mb-6">Onboarding Compliance Checklist</h2>
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full transition-all" style={{ width: `${compliancePercent}%` }} />
                </div>
              </div>
              <div className="space-y-3">
                {complianceItems.map(item => (
                  <div key={item.id} className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-primary-300'}`}
                    onClick={() => toggleComplianceItem(item.id)}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${item.completed ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                      {item.completed && <CheckCircle className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>{item.title}</h4>
                        {item.required && <Badge variant="outline" className="text-xs bg-red-50 text-red-700">Required</Badge>}
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Equity Tab */}
        {activeTab === 'equity' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Grants</div>
                <div className="text-2xl font-bold">{equityGrants.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Shares Granted</div>
                <div className="text-2xl font-bold">{totalEquity.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Vested</div>
                <div className="text-2xl font-bold text-green-600">{totalVested.toLocaleString()}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Unvested</div>
                <div className="text-2xl font-bold text-yellow-600">{(totalEquity - totalVested).toLocaleString()}</div>
              </Card>
            </div>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Equity Grants</h2>
                <Button size="sm" onClick={() => document.getElementById('equity-form')?.scrollIntoView()}>
                  <Plus className="h-4 w-4 mr-2" /> New Grant
              </Button>
              </div>

              {equityGrants.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <p>No equity grants yet. Add your first grant below.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {equityGrants.map(grant => (
                    <Card key={grant.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{grant.employeeName}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{grant.type}</Badge>
                            <Badge className="bg-green-100 text-green-800">{grant.status}</Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 mt-3 text-sm text-gray-600">
                            <div><span className="font-medium">Shares:</span> {grant.shares.toLocaleString()}</div>
                            <div><span className="font-medium">Vested:</span> {grant.vestedShares.toLocaleString()}</div>
                            <div><span className="font-medium">Strike:</span> ${grant.strikePrice}</div>
                            <div><span className="font-medium">Vesting:</span> {grant.vestingPeriod}mo / {grant.cliffMonths}mo cliff</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6" id="equity-form">
              <h3 className="text-lg font-semibold mb-4">Add Equity Grant</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name *</label>
                    <Input value={equityForm.employeeName} onChange={(e) => setEquityForm({ ...equityForm, employeeName: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equity Type</label>
                    <Select value={equityForm.type} onChange={(e) => setEquityForm({ ...equityForm, type: e.target.value as EquityType })}
                      options={[{ value: 'stock-options', label: 'Stock Options' }, { value: 'rsus', label: 'RSUs' }, { value: 'phantom-stock', label: 'Phantom Stock' }, { value: 'profit-sharing', label: 'Profit Sharing' }]} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shares *</label>
                    <Input type="number" value={equityForm.shares} onChange={(e) => setEquityForm({ ...equityForm, shares: e.target.value })} placeholder="10000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Strike Price ($)</label>
                    <Input type="number" value={equityForm.strikePrice} onChange={(e) => setEquityForm({ ...equityForm, strikePrice: e.target.value })} placeholder="0.10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vesting (months)</label>
                    <Input type="number" value={equityForm.vestingPeriod} onChange={(e) => setEquityForm({ ...equityForm, vestingPeriod: e.target.value })} placeholder="48" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cliff (months)</label>
                    <Input type="number" value={equityForm.cliffMonths} onChange={(e) => setEquityForm({ ...equityForm, cliffMonths: e.target.value })} placeholder="12" />
                  </div>
                </div>
                <Button onClick={addEquityGrant}>Add Equity Grant</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Contract Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractTemplates.map(template => (
                  <Card key={template.id} className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-primary-500/10 p-2 rounded-lg text-primary-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <Badge variant="outline" className="text-xs">{contractTypes[template.type]?.label}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                        setContractForm({ ...contractForm, type: template.type })
                        setEditingContract({ id: '', employeeName: '', email: '', role: '', department: '', type: template.type, status: 'draft', startDate: '', salary: 0, salaryType: 'annual', benefits: [], noticePeriod: 14, created: '', modified: '' })
                        setActiveTab('contracts')
                        showToast('Template loaded!', 'success')
                      }}>
                        <Copy className="h-4 w-4 mr-2" /> Use
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
            </Card>
          ))}
        </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Contracts</div>
                <div className="text-2xl font-bold">{contracts.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Active Contracts</div>
                <div className="text-2xl font-bold text-green-600">{contracts.filter(c => c.status === 'active').length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Payroll</div>
                <div className="text-2xl font-bold">${contracts.filter(c => c.salaryType === 'annual').reduce((sum, c) => sum + c.salary, 0).toLocaleString()}/yr</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Compliance Score</div>
                <div className="text-2xl font-bold text-blue-600">{compliancePercent}%</div>
              </Card>
            </div>

            {contractsByType.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Contracts by Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={contractsByType} cx="50%" cy="50%" labelLine={false}
                      label={({ name, count }) => `${name}: ${count}`} outerRadius={100} dataKey="count">
                      {contractsByType.map((_, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}

            {complianceByCategory.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Compliance by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={complianceByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={10} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" />
                    <Bar dataKey="total" fill="#3b82f6" name="Total" />
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
