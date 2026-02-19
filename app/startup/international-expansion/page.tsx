'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Globe, 
  MapPin, 
  TrendingUp,
  Shield,
  DollarSign,
  Users,
  Activity,
  Plus,
  Edit,
  Trash2,
  X,
  Download,
  Save,
  Sparkles,
  Building2,
  FileText,
  Calculator,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface MarketEntry {
  id: string
  country: string
  marketSize: string
  entryStrategy: 'direct' | 'partnership' | 'acquisition' | 'franchise'
  timeline: string
  budget: string
  status: 'researching' | 'planning' | 'executing' | 'launched' | 'on-hold'
  risks: string[]
  opportunities: string[]
  notes: string
}

interface ComplianceRequirement {
  id: string
  country: string
  category: 'legal' | 'tax' | 'employment' | 'data' | 'product'
  requirement: string
  deadline: string
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  notes: string
}

interface CurrencyExchange {
  id: string
  fromCurrency: string
  toCurrency: string
  amount: number
  exchangeRate: number
  convertedAmount: number
  date: string
  notes: string
}

interface Partnership {
  id: string
  name: string
  country: string
  type: 'distributor' | 'manufacturer' | 'service-provider' | 'strategic'
  contactName: string
  contactEmail: string
  status: 'prospecting' | 'negotiating' | 'active' | 'inactive'
  value: string
  notes: string
}

export default function InternationalExpansionPage() {
  const [activeTab, setActiveTab] = useState('market-entry')
  const [marketEntries, setMarketEntries] = useState<MarketEntry[]>([])
  const [complianceRequirements, setComplianceRequirements] = useState<ComplianceRequirement[]>([])
  const [currencyExchanges, setCurrencyExchanges] = useState<CurrencyExchange[]>([])
  const [partnerships, setPartnerships] = useState<Partnership[]>([])
  const [editingEntry, setEditingEntry] = useState<MarketEntry | null>(null)
  const [editingCompliance, setEditingCompliance] = useState<ComplianceRequirement | null>(null)
  const [editingExchange, setEditingExchange] = useState<CurrencyExchange | null>(null)
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null)

  const tabs = [
    { id: 'market-entry', label: 'Market Entry', icon: MapPin },
    { id: 'compliance', label: 'Legal & Compliance', icon: Shield },
    { id: 'currency', label: 'Currency & Finance', icon: DollarSign },
    { id: 'partnerships', label: 'Partnerships', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ]

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Japan', 'Singapore', 'India', 'Brazil', 'Mexico', 'Spain',
    'Italy', 'Netherlands', 'Sweden', 'Switzerland', 'UAE', 'South Korea',
    'China', 'Hong Kong'
  ]

  const currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'SGD',
    'HKD', 'BRL', 'MXN', 'SEK', 'NOK', 'DKK', 'PLN', 'ZAR', 'KRW', 'AED'
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('internationalExpansionData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.marketEntries) setMarketEntries(data.marketEntries)
          if (data.complianceRequirements) setComplianceRequirements(data.complianceRequirements)
          if (data.currencyExchanges) setCurrencyExchanges(data.currencyExchanges)
          if (data.partnerships) setPartnerships(data.partnerships)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        marketEntries,
        complianceRequirements,
        currencyExchanges,
        partnerships,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('internationalExpansionData', JSON.stringify(data))
    }
  }

  const exportData = () => {
    const data = {
      marketEntries,
      complianceRequirements,
      currencyExchanges,
      partnerships,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `international-expansion-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  // Market Entry functions
  const addMarketEntry = () => {
    const newEntry: MarketEntry = {
      id: Date.now().toString(),
      country: '',
      marketSize: '',
      entryStrategy: 'direct',
      timeline: '',
      budget: '',
      status: 'researching',
      risks: [],
      opportunities: [],
      notes: '',
    }
    setEditingEntry(newEntry)
  }

  const saveMarketEntry = () => {
    if (!editingEntry) return
    if (!editingEntry.country) {
      showToast('Please select a country', 'error')
      return
    }

    const existing = marketEntries.find(e => e.id === editingEntry.id)
    if (existing) {
      setMarketEntries(marketEntries.map(e => e.id === editingEntry.id ? editingEntry : e))
      showToast('Market entry updated!', 'success')
    } else {
      setMarketEntries([...marketEntries, editingEntry])
      showToast('Market entry added!', 'success')
    }
    setEditingEntry(null)
    saveToLocalStorage()
  }

  const deleteMarketEntry = (id: string) => {
    setMarketEntries(marketEntries.filter(e => e.id !== id))
    showToast('Market entry removed', 'success')
    saveToLocalStorage()
  }

  // Compliance functions
  const addComplianceRequirement = () => {
    const newRequirement: ComplianceRequirement = {
      id: Date.now().toString(),
      country: '',
      category: 'legal',
      requirement: '',
      deadline: '',
      status: 'pending',
      notes: '',
    }
    setEditingCompliance(newRequirement)
  }

  const saveComplianceRequirement = () => {
    if (!editingCompliance) return
    if (!editingCompliance.country || !editingCompliance.requirement) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const existing = complianceRequirements.find(c => c.id === editingCompliance.id)
    if (existing) {
      setComplianceRequirements(complianceRequirements.map(c => c.id === editingCompliance.id ? editingCompliance : c))
      showToast('Compliance requirement updated!', 'success')
    } else {
      setComplianceRequirements([...complianceRequirements, editingCompliance])
      showToast('Compliance requirement added!', 'success')
    }
    setEditingCompliance(null)
    saveToLocalStorage()
  }

  const deleteComplianceRequirement = (id: string) => {
    setComplianceRequirements(complianceRequirements.filter(c => c.id !== id))
    showToast('Compliance requirement removed', 'success')
    saveToLocalStorage()
  }

  // Currency Exchange functions
  const addCurrencyExchange = () => {
    const newExchange: CurrencyExchange = {
      id: Date.now().toString(),
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: 0,
      exchangeRate: 0,
      convertedAmount: 0,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    }
    setEditingExchange(newExchange)
  }

  const calculateExchange = (exchange: CurrencyExchange) => {
    if (exchange.amount && exchange.exchangeRate) {
      return exchange.amount * exchange.exchangeRate
    }
    return 0
  }

  const saveCurrencyExchange = () => {
    if (!editingExchange) return
    if (!editingExchange.fromCurrency || !editingExchange.toCurrency) {
      showToast('Please select currencies', 'error')
      return
    }

    const converted = calculateExchange(editingExchange)
    const updatedExchange = { ...editingExchange, convertedAmount: converted }

    const existing = currencyExchanges.find(e => e.id === updatedExchange.id)
    if (existing) {
      setCurrencyExchanges(currencyExchanges.map(e => e.id === updatedExchange.id ? updatedExchange : e))
      showToast('Currency exchange updated!', 'success')
    } else {
      setCurrencyExchanges([...currencyExchanges, updatedExchange])
      showToast('Currency exchange added!', 'success')
    }
    setEditingExchange(null)
    saveToLocalStorage()
  }

  const deleteCurrencyExchange = (id: string) => {
    setCurrencyExchanges(currencyExchanges.filter(e => e.id !== id))
    showToast('Currency exchange removed', 'success')
    saveToLocalStorage()
  }

  // Partnership functions
  const addPartnership = () => {
    const newPartnership: Partnership = {
      id: Date.now().toString(),
      name: '',
      country: '',
      type: 'distributor',
      contactName: '',
      contactEmail: '',
      status: 'prospecting',
      value: '',
      notes: '',
    }
    setEditingPartnership(newPartnership)
  }

  const savePartnership = () => {
    if (!editingPartnership) return
    if (!editingPartnership.name || !editingPartnership.country) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const existing = partnerships.find(p => p.id === editingPartnership.id)
    if (existing) {
      setPartnerships(partnerships.map(p => p.id === editingPartnership.id ? editingPartnership : p))
      showToast('Partnership updated!', 'success')
    } else {
      setPartnerships([...partnerships, editingPartnership])
      showToast('Partnership added!', 'success')
    }
    setEditingPartnership(null)
    saveToLocalStorage()
  }

  const deletePartnership = (id: string) => {
    setPartnerships(partnerships.filter(p => p.id !== id))
    showToast('Partnership removed', 'success')
    saveToLocalStorage()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                International Expansion
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plan and execute your global expansion with market entry strategies, compliance tracking, currency management, and partnership tools.
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

        {/* Market Entry Tab */}
        {activeTab === 'market-entry' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Market Entry Planning</h2>
                </div>
                <Button onClick={addMarketEntry} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Market Entry
                </Button>
              </div>

              {marketEntries.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Market Entries Yet</h3>
                  <p className="text-gray-600 mb-6">Start planning your international expansion</p>
                  <Button onClick={addMarketEntry}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Market Entry
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketEntries.map((entry) => (
                    <Card key={entry.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{entry.country}</h4>
                          <Badge variant={
                            entry.status === 'launched' ? 'new' :
                            entry.status === 'executing' ? 'outline' : 'outline'
                          } className="text-xs mb-2">
                            {entry.status}
                          </Badge>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingEntry(entry)}
                            className="shrink-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMarketEntry(entry.id)}
                            className="shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Strategy:</span> {entry.entryStrategy}
                        </div>
                        {entry.marketSize && (
                          <div>
                            <span className="font-medium">Market Size:</span> {entry.marketSize}
                          </div>
                        )}
                        {entry.timeline && (
                          <div>
                            <span className="font-medium">Timeline:</span> {entry.timeline}
                          </div>
                        )}
                        {entry.budget && (
                          <div>
                            <span className="font-medium">Budget:</span> {entry.budget}
                          </div>
                        )}
                        {entry.risks.length > 0 && (
                          <div>
                            <span className="font-medium">Risks:</span> {entry.risks.length} identified
                          </div>
                        )}
                        {entry.opportunities.length > 0 && (
                          <div>
                            <span className="font-medium">Opportunities:</span> {entry.opportunities.length} identified
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Edit Market Entry Modal */}
        {editingEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
                <h3 className="text-lg font-bold">Market Entry Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingEntry(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <Select
                      value={editingEntry.country}
                      onChange={(e) => setEditingEntry({ ...editingEntry, country: e.target.value })}
                      options={[
                        { value: '', label: 'Select country...' },
                        ...countries.map(c => ({ value: c, label: c }))
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Entry Strategy</label>
                    <Select
                      value={editingEntry.entryStrategy}
                      onChange={(e) => setEditingEntry({ ...editingEntry, entryStrategy: e.target.value as any })}
                      options={[
                        { value: 'direct', label: 'Direct Entry' },
                        { value: 'partnership', label: 'Partnership' },
                        { value: 'acquisition', label: 'Acquisition' },
                        { value: 'franchise', label: 'Franchise' },
                      ]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Market Size</label>
                    <Input
                      value={editingEntry.marketSize}
                      onChange={(e) => setEditingEntry({ ...editingEntry, marketSize: e.target.value })}
                      placeholder="e.g., $50M, Large, Medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select
                      value={editingEntry.status}
                      onChange={(e) => setEditingEntry({ ...editingEntry, status: e.target.value as any })}
                      options={[
                        { value: 'researching', label: 'Researching' },
                        { value: 'planning', label: 'Planning' },
                        { value: 'executing', label: 'Executing' },
                        { value: 'launched', label: 'Launched' },
                        { value: 'on-hold', label: 'On Hold' },
                      ]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                    <Input
                      value={editingEntry.timeline}
                      onChange={(e) => setEditingEntry({ ...editingEntry, timeline: e.target.value })}
                      placeholder="e.g., Q2 2024, 6 months"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <Input
                      value={editingEntry.budget}
                      onChange={(e) => setEditingEntry({ ...editingEntry, budget: e.target.value })}
                      placeholder="e.g., $500K, $1M"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Risks (one per line)</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingEntry.risks.join('\n')}
                    onChange={(e) => setEditingEntry({ 
                      ...editingEntry, 
                      risks: e.target.value.split('\n').filter(r => r.trim())
                    })}
                    placeholder="Risk 1&#10;Risk 2&#10;..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opportunities (one per line)</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingEntry.opportunities.join('\n')}
                    onChange={(e) => setEditingEntry({ 
                      ...editingEntry, 
                      opportunities: e.target.value.split('\n').filter(o => o.trim())
                    })}
                    placeholder="Opportunity 1&#10;Opportunity 2&#10;..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingEntry.notes}
                    onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t sticky bottom-0 bg-white mt-4">
                <Button onClick={saveMarketEntry} className="flex-1 min-w-[120px]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Entry
                </Button>
                <Button variant="outline" onClick={() => setEditingEntry(null)} className="shrink-0">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Legal & Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Legal & Compliance</h2>
                </div>
                <Button onClick={addComplianceRequirement} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </div>

              {complianceRequirements.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Compliance Requirements Yet</h3>
                  <p className="text-gray-600 mb-6">Track legal and compliance requirements for your expansion</p>
                  <Button onClick={addComplianceRequirement}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Requirement
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {complianceRequirements.map((requirement) => {
                    const isOverdue = requirement.deadline && 
                      new Date(requirement.deadline) < new Date() && 
                      requirement.status !== 'completed'
                    return (
                      <Card key={requirement.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-semibold">{requirement.requirement}</h4>
                              <Badge variant={
                                requirement.status === 'completed' ? 'new' :
                                isOverdue ? 'outline' : 'outline'
                              } className="text-xs">
                                {requirement.status}
                              </Badge>
                              {isOverdue && (
                                <Badge variant="outline" className="text-xs text-red-600">
                                  Overdue
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Country:</span> {requirement.country}
                              </div>
                              <div>
                                <span className="font-medium">Category:</span> {requirement.category}
                              </div>
                              {requirement.deadline && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Deadline: {new Date(requirement.deadline).toLocaleDateString()}</span>
                                </div>
                              )}
                              {requirement.notes && (
                                <p className="text-gray-500 italic">{requirement.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCompliance(requirement)}
                              className="shrink-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteComplianceRequirement(requirement.id)}
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

        {/* Edit Compliance Requirement Modal */}
        {editingCompliance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
                <h3 className="text-lg font-bold">Compliance Requirement</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingCompliance(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <Select
                      value={editingCompliance.country}
                      onChange={(e) => setEditingCompliance({ ...editingCompliance, country: e.target.value })}
                      options={[
                        { value: '', label: 'Select country...' },
                        ...countries.map(c => ({ value: c, label: c }))
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Select
                      value={editingCompliance.category}
                      onChange={(e) => setEditingCompliance({ ...editingCompliance, category: e.target.value as any })}
                      options={[
                        { value: 'legal', label: 'Legal' },
                        { value: 'tax', label: 'Tax' },
                        { value: 'employment', label: 'Employment' },
                        { value: 'data', label: 'Data Privacy' },
                        { value: 'product', label: 'Product Compliance' },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirement *</label>
                  <Input
                    value={editingCompliance.requirement}
                    onChange={(e) => setEditingCompliance({ ...editingCompliance, requirement: e.target.value })}
                    placeholder="e.g., GDPR compliance, Tax registration"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <Input
                      type="date"
                      value={editingCompliance.deadline}
                      onChange={(e) => setEditingCompliance({ ...editingCompliance, deadline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select
                      value={editingCompliance.status}
                      onChange={(e) => setEditingCompliance({ ...editingCompliance, status: e.target.value as any })}
                      options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'in-progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'overdue', label: 'Overdue' },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingCompliance.notes}
                    onChange={(e) => setEditingCompliance({ ...editingCompliance, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t sticky bottom-0 bg-white mt-4">
                <Button onClick={saveComplianceRequirement} className="flex-1 min-w-[120px]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Requirement
                </Button>
                <Button variant="outline" onClick={() => setEditingCompliance(null)} className="shrink-0">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Currency & Finance Tab */}
        {activeTab === 'currency' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Currency & Finance</h2>
                </div>
                <Button onClick={addCurrencyExchange} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exchange
                </Button>
              </div>

              {currencyExchanges.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Currency Exchanges Yet</h3>
                  <p className="text-gray-600 mb-6">Track currency conversions and exchange rates</p>
                  <Button onClick={addCurrencyExchange}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Exchange
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currencyExchanges.map((exchange) => (
                    <Card key={exchange.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold">{exchange.fromCurrency}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-2xl font-bold">{exchange.toCurrency}</span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Amount:</span> {exchange.amount.toLocaleString()} {exchange.fromCurrency}
                            </div>
                            <div>
                              <span className="font-medium">Rate:</span> {exchange.exchangeRate.toFixed(4)}
                            </div>
                            <div className="text-lg font-bold text-primary-600">
                              = {exchange.convertedAmount.toLocaleString()} {exchange.toCurrency}
                            </div>
                            {exchange.date && (
                              <div className="text-xs text-gray-500">
                                {new Date(exchange.date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingExchange(exchange)}
                            className="shrink-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCurrencyExchange(exchange.id)}
                            className="shrink-0"
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
          </div>
        )}

        {/* Edit Currency Exchange Modal */}
        {editingExchange && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
                <h3 className="text-lg font-bold">Currency Exchange</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingExchange(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Currency *</label>
                    <Select
                      value={editingExchange.fromCurrency}
                      onChange={(e) => {
                        const updated = { ...editingExchange, fromCurrency: e.target.value }
                        updated.convertedAmount = calculateExchange(updated)
                        setEditingExchange(updated)
                      }}
                      options={currencies.map(c => ({ value: c, label: c }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Currency *</label>
                    <Select
                      value={editingExchange.toCurrency}
                      onChange={(e) => {
                        const updated = { ...editingExchange, toCurrency: e.target.value }
                        updated.convertedAmount = calculateExchange(updated)
                        setEditingExchange(updated)
                      }}
                      options={currencies.map(c => ({ value: c, label: c }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <Input
                      type="number"
                      value={editingExchange.amount}
                      onChange={(e) => {
                        const updated = { ...editingExchange, amount: parseFloat(e.target.value) || 0 }
                        updated.convertedAmount = calculateExchange(updated)
                        setEditingExchange(updated)
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Rate</label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={editingExchange.exchangeRate}
                      onChange={(e) => {
                        const updated = { ...editingExchange, exchangeRate: parseFloat(e.target.value) || 0 }
                        updated.convertedAmount = calculateExchange(updated)
                        setEditingExchange(updated)
                      }}
                      placeholder="0.0000"
                    />
                  </div>
                </div>
                {editingExchange.convertedAmount > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Converted Amount</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {editingExchange.convertedAmount.toLocaleString()} {editingExchange.toCurrency}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <Input
                    type="date"
                    value={editingExchange.date}
                    onChange={(e) => setEditingExchange({ ...editingExchange, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingExchange.notes}
                    onChange={(e) => setEditingExchange({ ...editingExchange, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t sticky bottom-0 bg-white mt-4">
                <Button onClick={saveCurrencyExchange} className="flex-1 min-w-[120px]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Exchange
                </Button>
                <Button variant="outline" onClick={() => setEditingExchange(null)} className="shrink-0">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Partnerships Tab */}
        {activeTab === 'partnerships' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Local Partnerships</h2>
                </div>
                <Button onClick={addPartnership} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partnership
                </Button>
              </div>

              {partnerships.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Partnerships Yet</h3>
                  <p className="text-gray-600 mb-6">Track local partnerships for your expansion</p>
                  <Button onClick={addPartnership}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Partnership
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partnerships.map((partnership) => (
                    <Card key={partnership.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{partnership.name}</h4>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant={
                              partnership.status === 'active' ? 'new' :
                              partnership.status === 'negotiating' ? 'outline' : 'outline'
                            } className="text-xs">
                              {partnership.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {partnership.type}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Country:</span> {partnership.country}
                            </div>
                            {partnership.contactName && (
                              <div>
                                <span className="font-medium">Contact:</span> {partnership.contactName}
                              </div>
                            )}
                            {partnership.value && (
                              <div>
                                <span className="font-medium">Value:</span> {partnership.value}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPartnership(partnership)}
                            className="shrink-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePartnership(partnership.id)}
                            className="shrink-0"
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
          </div>
        )}

        {/* Edit Partnership Modal */}
        {editingPartnership && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
                <h3 className="text-lg font-bold">Partnership Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingPartnership(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Name *</label>
                    <Input
                      value={editingPartnership.name}
                      onChange={(e) => setEditingPartnership({ ...editingPartnership, name: e.target.value })}
                      placeholder="Company or Partner Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <Select
                      value={editingPartnership.country}
                      onChange={(e) => setEditingPartnership({ ...editingPartnership, country: e.target.value })}
                      options={[
                        { value: '', label: 'Select country...' },
                        ...countries.map(c => ({ value: c, label: c }))
                      ]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Select
                      value={editingPartnership.type}
                      onChange={(e) => setEditingPartnership({ ...editingPartnership, type: e.target.value as any })}
                      options={[
                        { value: 'distributor', label: 'Distributor' },
                        { value: 'manufacturer', label: 'Manufacturer' },
                        { value: 'service-provider', label: 'Service Provider' },
                        { value: 'strategic', label: 'Strategic Partner' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select
                      value={editingPartnership.status}
                      onChange={(e) => setEditingPartnership({ ...editingPartnership, status: e.target.value as any })}
                      options={[
                        { value: 'prospecting', label: 'Prospecting' },
                        { value: 'negotiating', label: 'Negotiating' },
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                      ]}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <Input
                      value={editingPartnership.contactName}
                      onChange={(e) => setEditingPartnership({ ...editingPartnership, contactName: e.target.value })}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <Input
                      type="email"
                      value={editingPartnership.contactEmail}
                      onChange={(e) => setEditingPartnership({ ...editingPartnership, contactEmail: e.target.value })}
                      placeholder="contact@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Value</label>
                  <Input
                    value={editingPartnership.value}
                    onChange={(e) => setEditingPartnership({ ...editingPartnership, value: e.target.value })}
                    placeholder="e.g., $500K, Strategic, High-value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingPartnership.notes}
                    onChange={(e) => setEditingPartnership({ ...editingPartnership, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t sticky bottom-0 bg-white mt-4">
                <Button onClick={savePartnership} className="flex-1 min-w-[120px]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Partnership
                </Button>
                <Button variant="outline" onClick={() => setEditingPartnership(null)} className="shrink-0">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Market Entries</div>
                <div className="text-2xl font-bold">{marketEntries.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Compliance Items</div>
                <div className="text-2xl font-bold">{complianceRequirements.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Currency Exchanges</div>
                <div className="text-2xl font-bold">{currencyExchanges.length}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Partnerships</div>
                <div className="text-2xl font-bold">{partnerships.length}</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4">Market Entries by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Researching', value: marketEntries.filter(e => e.status === 'researching').length },
                    { name: 'Planning', value: marketEntries.filter(e => e.status === 'planning').length },
                    { name: 'Executing', value: marketEntries.filter(e => e.status === 'executing').length },
                    { name: 'Launched', value: marketEntries.filter(e => e.status === 'launched').length },
                    { name: 'On Hold', value: marketEntries.filter(e => e.status === 'on-hold').length },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Compliance Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pending', value: complianceRequirements.filter(c => c.status === 'pending').length, color: '#6b7280' },
                        { name: 'In Progress', value: complianceRequirements.filter(c => c.status === 'in-progress').length, color: '#3b82f6' },
                        { name: 'Completed', value: complianceRequirements.filter(c => c.status === 'completed').length, color: '#10b981' },
                        { name: 'Overdue', value: complianceRequirements.filter(c => c.status === 'overdue').length, color: '#ef4444' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Pending', color: '#6b7280' },
                        { name: 'In Progress', color: '#3b82f6' },
                        { name: 'Completed', color: '#10b981' },
                        { name: 'Overdue', color: '#ef4444' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Partnerships by Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Distributor', value: partnerships.filter(p => p.type === 'distributor').length },
                    { name: 'Manufacturer', value: partnerships.filter(p => p.type === 'manufacturer').length },
                    { name: 'Service Provider', value: partnerships.filter(p => p.type === 'service-provider').length },
                    { name: 'Strategic', value: partnerships.filter(p => p.type === 'strategic').length },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4">Top Countries</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countries.map(country => ({
                    name: country.length > 10 ? country.substring(0, 10) + '...' : country,
                    fullName: country,
                    entries: marketEntries.filter(e => e.country === country).length,
                    partnerships: partnerships.filter(p => p.country === country).length,
                    total: marketEntries.filter(e => e.country === country).length + 
                           partnerships.filter(p => p.country === country).length
                  })).filter(c => c.total > 0).slice(0, 10).sort((a, b) => b.total - a.total)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="entries" fill="#3b82f6" name="Market Entries" />
                    <Bar dataKey="partnerships" fill="#8b5cf6" name="Partnerships" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <h3 className="font-semibold mb-4">Summary Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Active Market Entries</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {marketEntries.filter(e => e.status === 'executing' || e.status === 'launched').length}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Completed Compliance</div>
                  <div className="text-2xl font-bold text-green-600">
                    {complianceRequirements.filter(c => c.status === 'completed').length}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Active Partnerships</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {partnerships.filter(p => p.status === 'active').length}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
