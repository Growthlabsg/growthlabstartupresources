'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  FileText, 
  Save, 
  Download,
  Sparkles,
  Calculator,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart3,
  History,
  X,
  Plus,
  Edit,
  Trash2,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Info,
  FileCheck,
  Copy,
  Eye
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

type SAFEType = 'valuation-cap' | 'discount' | 'valuation-cap-discount' | 'mfn' | 'custom'

interface SAFEAgreement {
  id: string
  name: string
  companyName: string
  investorName: string
  date: string
  type: SAFEType
  
  // Investment Details
  investmentAmount: number
  valuationCap?: number
  discountRate?: number
  mfnClause?: boolean
  
  // Conversion Terms
  conversionTrigger: 'equity-financing' | 'liquidity-event' | 'dissolution'
  conversionPrice?: number
  proRataRights: boolean
  informationRights: boolean
  
  // Additional Terms
  mostFavoredNation?: boolean
  earlyExitProvisions?: string
  notes?: string
  
  createdAt: string
  updatedAt: string
}

interface ConversionScenario {
  id: string
  name: string
  nextRoundValuation: number
  nextRoundAmount: number
  resultingEquity: number
  conversionPrice: number
  sharesIssued: number
}

export default function SAFEGeneratorPage() {
  const [activeTab, setActiveTab] = useState('generator')
  const [safes, setSafes] = useState<SAFEAgreement[]>([])
  const [editingSafe, setEditingSafe] = useState<SAFEAgreement | null>(null)
  const [conversionScenarios, setConversionScenarios] = useState<ConversionScenario[]>([])
  const [editingScenario, setEditingScenario] = useState<ConversionScenario | null>(null)
  const [selectedSafes, setSelectedSafes] = useState<string[]>([])

  const tabs = [
    { id: 'generator', label: 'SAFE Generator', icon: FileText },
    { id: 'conversion', label: 'Conversion Calculator', icon: Calculator },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
    { id: 'templates', label: 'Templates', icon: FileCheck },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('safeGeneratorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.safes) setSafes(data.safes)
          if (data.conversionScenarios) setConversionScenarios(data.conversionScenarios)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        safes,
        conversionScenarios,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('safeGeneratorData', JSON.stringify(data))
      showToast('SAFE saved!', 'success')
    }
  }

  const createNewSAFE = () => {
    const newSafe: SAFEAgreement = {
      id: Date.now().toString(),
      name: 'New SAFE Agreement',
      companyName: '',
      investorName: '',
      date: new Date().toISOString().split('T')[0],
      type: 'valuation-cap-discount',
      investmentAmount: 0,
      valuationCap: 0,
      discountRate: 20,
      conversionTrigger: 'equity-financing',
      proRataRights: true,
      informationRights: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEditingSafe(newSafe)
  }

  const saveSAFE = () => {
    if (!editingSafe) return
    if (!editingSafe.companyName || !editingSafe.investorName || editingSafe.investmentAmount <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    // Validate based on SAFE type
    if (editingSafe.type === 'valuation-cap' && !editingSafe.valuationCap) {
      showToast('Valuation cap is required for this SAFE type', 'error')
      return
    }
    if (editingSafe.type === 'discount' && !editingSafe.discountRate) {
      showToast('Discount rate is required for this SAFE type', 'error')
      return
    }
    if (editingSafe.type === 'valuation-cap-discount' && (!editingSafe.valuationCap || !editingSafe.discountRate)) {
      showToast('Both valuation cap and discount rate are required', 'error')
      return
    }

    const updated = safes.find(s => s.id === editingSafe.id)
      ? safes.map(s => s.id === editingSafe.id ? { ...editingSafe, updatedAt: new Date().toISOString() } : s)
      : [...safes, { ...editingSafe, updatedAt: new Date().toISOString() }]

    setSafes(updated)
    setEditingSafe(null)
    saveToLocalStorage()
    showToast('SAFE agreement saved!', 'success')
  }

  const deleteSAFE = (id: string) => {
    if (confirm('Are you sure you want to delete this SAFE?')) {
      const updated = safes.filter(s => s.id !== id)
      setSafes(updated)
      saveToLocalStorage()
      showToast('SAFE deleted', 'info')
    }
  }

  const calculateConversion = (safe: SAFEAgreement, nextRoundValuation: number, nextRoundAmount: number): ConversionScenario => {
    let conversionPrice = 0
    let resultingEquity = 0
    let sharesIssued = 0

    // Calculate conversion price based on SAFE type
    if (safe.type === 'valuation-cap' && safe.valuationCap) {
      // Convert at valuation cap
      const pricePerShare = safe.valuationCap / 1000000 // Assuming 1M shares outstanding
      conversionPrice = pricePerShare
      sharesIssued = safe.investmentAmount / pricePerShare
      resultingEquity = (sharesIssued / (1000000 + sharesIssued)) * 100
    } else if (safe.type === 'discount' && safe.discountRate) {
      // Convert with discount
      const pricePerShare = (nextRoundValuation / 1000000) * (1 - safe.discountRate / 100)
      conversionPrice = pricePerShare
      sharesIssued = safe.investmentAmount / pricePerShare
      resultingEquity = (sharesIssued / (1000000 + sharesIssued)) * 100
    } else if (safe.type === 'valuation-cap-discount' && safe.valuationCap && safe.discountRate) {
      // Use the more favorable option
      const capPrice = safe.valuationCap / 1000000
      const discountPrice = (nextRoundValuation / 1000000) * (1 - safe.discountRate / 100)
      conversionPrice = Math.min(capPrice, discountPrice)
      sharesIssued = safe.investmentAmount / conversionPrice
      resultingEquity = (sharesIssued / (1000000 + sharesIssued)) * 100
    } else if (safe.type === 'mfn') {
      // Most Favored Nation - converts at same terms as next investor
      const pricePerShare = nextRoundValuation / 1000000
      conversionPrice = pricePerShare
      sharesIssued = safe.investmentAmount / pricePerShare
      resultingEquity = (sharesIssued / (1000000 + sharesIssued)) * 100
    }

    return {
      id: Date.now().toString(),
      name: `${safe.name} - Conversion`,
      nextRoundValuation,
      nextRoundAmount,
      resultingEquity,
      conversionPrice,
      sharesIssued: Math.round(sharesIssued)
    }
  }

  const createConversionScenario = () => {
    if (!editingSafe) {
      showToast('Please create or select a SAFE first', 'error')
      return
    }
    const newScenario: ConversionScenario = {
      id: Date.now().toString(),
      name: 'New Conversion Scenario',
      nextRoundValuation: 0,
      nextRoundAmount: 0,
      resultingEquity: 0,
      conversionPrice: 0,
      sharesIssued: 0
    }
    setEditingScenario(newScenario)
  }

  const saveConversionScenario = () => {
    if (!editingScenario || !editingSafe) return
    if (!editingScenario.nextRoundValuation || !editingScenario.nextRoundAmount) {
      showToast('Please enter next round valuation and amount', 'error')
      return
    }

    const calculated = calculateConversion(
      editingSafe,
      editingScenario.nextRoundValuation,
      editingScenario.nextRoundAmount
    )

    const updatedScenario = {
      ...editingScenario,
      ...calculated
    }

    const updated = conversionScenarios.find(s => s.id === updatedScenario.id)
      ? conversionScenarios.map(s => s.id === updatedScenario.id ? updatedScenario : s)
      : [...conversionScenarios, updatedScenario]

    setConversionScenarios(updated)
    setEditingScenario(null)
    saveToLocalStorage()
    showToast('Conversion scenario saved!', 'success')
  }

  const exportData = () => {
    if (!editingSafe) {
      showToast('No SAFE to export', 'error')
      return
    }
    const data = {
      ...editingSafe,
      conversionScenarios: conversionScenarios.filter(s => s.name.includes(editingSafe.name)),
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `safe-agreement-${editingSafe.companyName}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('SAFE exported!', 'success')
  }

  const templates = [
    {
      id: 'standard-cap-discount',
      name: 'Standard (Cap + Discount)',
      description: 'Most common SAFE with valuation cap and discount',
      type: 'valuation-cap-discount' as SAFEType,
      valuationCap: 10000000,
      discountRate: 20
    },
    {
      id: 'valuation-cap-only',
      name: 'Valuation Cap Only',
      description: 'SAFE with only valuation cap',
      type: 'valuation-cap' as SAFEType,
      valuationCap: 10000000,
      discountRate: 0
    },
    {
      id: 'discount-only',
      name: 'Discount Only',
      description: 'SAFE with only discount rate',
      type: 'discount' as SAFEType,
      valuationCap: 0,
      discountRate: 20
    },
    {
      id: 'mfn',
      name: 'Most Favored Nation',
      description: 'MFN SAFE with no cap or discount',
      type: 'mfn' as SAFEType,
      valuationCap: 0,
      discountRate: 0
    }
  ]

  const applyTemplate = (template: typeof templates[0]) => {
    if (!editingSafe) {
      createNewSAFE()
      setTimeout(() => {
        setEditingSafe(prev => {
          if (!prev) return null
          return {
            ...prev,
            type: template.type,
            valuationCap: template.valuationCap,
            discountRate: template.discountRate
          }
        })
      }, 100)
    } else {
      setEditingSafe({
        ...editingSafe,
        type: template.type,
        valuationCap: template.valuationCap,
        discountRate: template.discountRate
      })
    }
    showToast(`${template.name} template applied!`, 'success')
  }

  const getSAFETypeDescription = (type: SAFEType) => {
    switch (type) {
      case 'valuation-cap':
        return 'Converts at the lower of the valuation cap or the price in the next round'
      case 'discount':
        return 'Converts at a discount to the price in the next round'
      case 'valuation-cap-discount':
        return 'Converts at the lower of the valuation cap or the discounted price'
      case 'mfn':
        return 'Most Favored Nation - converts at the same terms as the next investor'
      default:
        return 'Custom SAFE terms'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                SAFE Generator
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate and analyze Simple Agreement for Future Equity (SAFE) documents with conversion calculators
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={createNewSAFE} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                New SAFE
              </Button>
              {editingSafe && (
                <>
                  <Button variant="outline" size="sm" onClick={saveToLocalStorage} className="shrink-0">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportData} className="shrink-0">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* SAFE Generator Tab */}
        {activeTab === 'generator' && (
          <div className="space-y-6">
            {!editingSafe ? (
              <Card>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No SAFE Selected</h3>
                  <p className="text-gray-600 mb-6">Create a new SAFE agreement or load an existing one</p>
                  <Button onClick={createNewSAFE}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New SAFE
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">SAFE Agreement Details</h2>
                      <Button variant="ghost" size="sm" onClick={() => setEditingSafe(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Info className="h-5 w-5 text-primary-500" />
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SAFE Name *</label>
                            <Input
                              value={editingSafe.name}
                              onChange={(e) => setEditingSafe({ ...editingSafe, name: e.target.value })}
                              placeholder="e.g., Seed SAFE #1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                            <Input
                              type="date"
                              value={editingSafe.date}
                              onChange={(e) => setEditingSafe({ ...editingSafe, date: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                            <Input
                              value={editingSafe.companyName}
                              onChange={(e) => setEditingSafe({ ...editingSafe, companyName: e.target.value })}
                              placeholder="Your Company Inc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Investor Name *</label>
                            <Input
                              value={editingSafe.investorName}
                              onChange={(e) => setEditingSafe({ ...editingSafe, investorName: e.target.value })}
                              placeholder="Investor Name"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SAFE Type */}
                      <div>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary-500" />
                          SAFE Type
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                          <Select
                            value={editingSafe.type}
                            onChange={(e) => setEditingSafe({ ...editingSafe, type: e.target.value as SAFEType })}
                            options={[
                              { value: 'valuation-cap-discount', label: 'Valuation Cap + Discount' },
                              { value: 'valuation-cap', label: 'Valuation Cap Only' },
                              { value: 'discount', label: 'Discount Only' },
                              { value: 'mfn', label: 'Most Favored Nation (MFN)' },
                              { value: 'custom', label: 'Custom' }
                            ]}
                          />
                          <p className="text-xs text-gray-500 mt-2">{getSAFETypeDescription(editingSafe.type)}</p>
                        </div>
                      </div>

                      {/* Investment Details */}
                      <div>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary-500" />
                          Investment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($) *</label>
                            <Input
                              type="number"
                              value={editingSafe.investmentAmount}
                              onChange={(e) => setEditingSafe({ ...editingSafe, investmentAmount: parseFloat(e.target.value) || 0 })}
                              placeholder="100000"
                            />
                          </div>
                          {(editingSafe.type === 'valuation-cap' || editingSafe.type === 'valuation-cap-discount') && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Valuation Cap ($) *</label>
                              <Input
                                type="number"
                                value={editingSafe.valuationCap || ''}
                                onChange={(e) => setEditingSafe({ ...editingSafe, valuationCap: parseFloat(e.target.value) || 0 })}
                                placeholder="10000000"
                              />
                              <p className="text-xs text-gray-500 mt-1">Maximum valuation for conversion</p>
                            </div>
                          )}
                          {(editingSafe.type === 'discount' || editingSafe.type === 'valuation-cap-discount') && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Rate (%) *</label>
                              <Input
                                type="number"
                                value={editingSafe.discountRate || ''}
                                onChange={(e) => setEditingSafe({ ...editingSafe, discountRate: parseFloat(e.target.value) || 0 })}
                                placeholder="20"
                              />
                              <p className="text-xs text-gray-500 mt-1">Standard is 15-25%</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Conversion Terms */}
                      <div>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary-500" />
                          Conversion Terms
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Trigger</label>
                            <Select
                              value={editingSafe.conversionTrigger}
                              onChange={(e) => setEditingSafe({ ...editingSafe, conversionTrigger: e.target.value as any })}
                              options={[
                                { value: 'equity-financing', label: 'Equity Financing' },
                                { value: 'liquidity-event', label: 'Liquidity Event' },
                                { value: 'dissolution', label: 'Dissolution' }
                              ]}
                            />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingSafe.proRataRights}
                                onChange={(e) => setEditingSafe({ ...editingSafe, proRataRights: e.target.checked })}
                                className="rounded"
                              />
                              <label className="text-sm text-gray-700">Pro Rata Rights</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingSafe.informationRights}
                                onChange={(e) => setEditingSafe({ ...editingSafe, informationRights: e.target.checked })}
                                className="rounded"
                              />
                              <label className="text-sm text-gray-700">Information Rights</label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                          rows={4}
                          value={editingSafe.notes || ''}
                          onChange={(e) => setEditingSafe({ ...editingSafe, notes: e.target.value })}
                          placeholder="Additional notes and observations..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={saveSAFE} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Save SAFE
                        </Button>
                        <Button variant="outline" onClick={() => setEditingSafe(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <h3 className="font-semibold mb-4">Quick Summary</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Investment Amount</div>
                        <div className="text-lg font-bold">${(editingSafe.investmentAmount / 1000).toFixed(0)}K</div>
                      </div>
                      {editingSafe.valuationCap && (
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Valuation Cap</div>
                          <div className="text-lg font-bold">${(editingSafe.valuationCap / 1000000).toFixed(1)}M</div>
                        </div>
                      )}
                      {editingSafe.discountRate && (
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Discount Rate</div>
                          <div className="text-lg font-bold">{editingSafe.discountRate}%</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-600 mb-1">SAFE Type</div>
                        <Badge variant="outline">{editingSafe.type.replace('-', ' ').toUpperCase()}</Badge>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-start gap-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-yellow-900 mb-1">Best Practices</h4>
                        <ul className="text-xs text-yellow-800 space-y-1">
                          <li>• Valuation cap should reflect current company value</li>
                          <li>• Discount rate typically 15-25%</li>
                          <li>• Include pro rata rights for investors</li>
                          <li>• Consider MFN clause for early investors</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Conversion Calculator Tab */}
        {activeTab === 'conversion' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Conversion Calculator</h2>
                </div>
                {editingSafe && (
                  <Button onClick={createConversionScenario} size="sm" className="shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    New Scenario
                  </Button>
                )}
              </div>

              {!editingSafe ? (
                <div className="text-center py-12 text-gray-400">
                  <Calculator className="h-16 w-16 mx-auto mb-4" />
                  <p>Please create or select a SAFE first to calculate conversions.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Current SAFE: {editingSafe.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-800">
                      <div>
                        <span className="font-medium">Investment:</span> ${(editingSafe.investmentAmount / 1000).toFixed(0)}K
                      </div>
                      {editingSafe.valuationCap && (
                        <div>
                          <span className="font-medium">Cap:</span> ${(editingSafe.valuationCap / 1000000).toFixed(1)}M
                        </div>
                      )}
                      {editingSafe.discountRate && (
                        <div>
                          <span className="font-medium">Discount:</span> {editingSafe.discountRate}%
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Type:</span> {editingSafe.type}
                      </div>
                    </div>
                  </div>

                  {conversionScenarios.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {conversionScenarios.map((scenario) => (
                        <Card key={scenario.id} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{scenario.name}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Next Round Valuation:</span> ${(scenario.nextRoundValuation / 1000000).toFixed(1)}M
                                </div>
                                <div>
                                  <span className="font-medium">Conversion Price:</span> ${scenario.conversionPrice.toFixed(4)}
                                </div>
                                <div>
                                  <span className="font-medium">Shares Issued:</span> {scenario.sharesIssued.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Resulting Equity:</span> {scenario.resultingEquity.toFixed(2)}%
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingScenario(scenario)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {editingScenario && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Edit Conversion Scenario</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingScenario(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Name *</label>
                          <Input
                            value={editingScenario.name}
                            onChange={(e) => setEditingScenario({ ...editingScenario, name: e.target.value })}
                            placeholder="e.g., Series A Conversion"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Next Round Valuation ($) *</label>
                            <Input
                              type="number"
                              value={editingScenario.nextRoundValuation}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                if (editingSafe) {
                                  const calculated = calculateConversion(editingSafe, val, editingScenario.nextRoundAmount)
                                  const { nextRoundValuation, nextRoundAmount, ...rest } = calculated
                                  setEditingScenario({
                                    ...editingScenario,
                                    nextRoundValuation: val,
                                    ...rest
                                  })
                                }
                              }}
                              placeholder="20000000"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Next Round Amount ($) *</label>
                            <Input
                              type="number"
                              value={editingScenario.nextRoundAmount}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                if (editingSafe) {
                                  const calculated = calculateConversion(editingSafe, editingScenario.nextRoundValuation, val)
                                  const { nextRoundValuation, nextRoundAmount, ...rest } = calculated
                                  setEditingScenario({
                                    ...editingScenario,
                                    nextRoundAmount: val,
                                    ...rest
                                  })
                                }
                              }}
                              placeholder="5000000"
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-3">Conversion Results:</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Conversion Price:</span> ${editingScenario.conversionPrice.toFixed(4)}
                            </div>
                            <div>
                              <span className="font-medium">Shares Issued:</span> {editingScenario.sharesIssued.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Resulting Equity:</span> {editingScenario.resultingEquity.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveConversionScenario} className="flex-1">
                            Save Scenario
                          </Button>
                          <Button variant="outline" onClick={() => setEditingScenario(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </>
              )}
            </Card>
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Compare SAFEs</h2>
              </div>
              {safes.length < 2 ? (
                <div className="text-center py-12 text-gray-400">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>You need at least 2 SAFEs to compare. Create more SAFEs first.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {safes.map((safe) => (
                      <Card key={safe.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{safe.name}</h4>
                            <p className="text-sm text-gray-600">{safe.companyName} - {safe.investorName}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedSafes.includes(safe.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSafes([...selectedSafes, safe.id])
                              } else {
                                setSelectedSafes(selectedSafes.filter(id => id !== safe.id))
                              }
                            }}
                            className="rounded"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                  {selectedSafes.length >= 2 && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Comparison</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Term</th>
                              {selectedSafes.map(id => {
                                const safe = safes.find(s => s.id === id)
                                return <th key={id} className="text-left p-2">{safe?.name}</th>
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Investment Amount</td>
                              {selectedSafes.map(id => {
                                const safe = safes.find(s => s.id === id)
                                return <td key={id} className="p-2">${((safe?.investmentAmount || 0) / 1000).toFixed(0)}K</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Type</td>
                              {selectedSafes.map(id => {
                                const safe = safes.find(s => s.id === id)
                                return <td key={id} className="p-2">{safe?.type}</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Valuation Cap</td>
                              {selectedSafes.map(id => {
                                const safe = safes.find(s => s.id === id)
                                return <td key={id} className="p-2">{safe?.valuationCap ? `$${(safe.valuationCap / 1000000).toFixed(1)}M` : 'N/A'}</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Discount Rate</td>
                              {selectedSafes.map(id => {
                                const safe = safes.find(s => s.id === id)
                                return <td key={id} className="p-2">{safe?.discountRate ? `${safe.discountRate}%` : 'N/A'}</td>
                              })}
                            </tr>
                            <tr>
                              <td className="p-2 font-medium">Pro Rata Rights</td>
                              {selectedSafes.map(id => {
                                const safe = safes.find(s => s.id === id)
                                return <td key={id} className="p-2">{safe?.proRataRights ? 'Yes' : 'No'}</td>
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}
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
                <FileCheck className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">SAFE Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="p-6 hover:shadow-lg transition-all">
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <div className="space-y-2 mb-4 text-xs text-gray-600">
                      {template.valuationCap > 0 && (
                        <div>Valuation Cap: ${(template.valuationCap / 1000000).toFixed(1)}M</div>
                      )}
                      {template.discountRate > 0 && (
                        <div>Discount: {template.discountRate}%</div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => applyTemplate(template)}
                    >
                      Apply Template
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <History className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">SAFE History</h2>
              </div>
              {safes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No SAFEs yet. Create your first SAFE agreement to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {safes.map((safe) => (
                    <Card key={safe.id} className="p-4 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between cursor-pointer" onClick={() => setEditingSafe(safe)}>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{safe.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span>{safe.companyName}</span>
                            <span>•</span>
                            <span>{safe.investorName}</span>
                            <span>•</span>
                            <span>{new Date(safe.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>${(safe.investmentAmount / 1000).toFixed(0)}K investment</span>
                            {safe.valuationCap && <span>${(safe.valuationCap / 1000000).toFixed(1)}M cap</span>}
                            {safe.discountRate && <span>{safe.discountRate}% discount</span>}
                            <Badge variant="outline" className="text-xs">{safe.type}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingSafe(safe)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSAFE(safe.id)
                            }}
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
      </div>
    </main>
  )
}
