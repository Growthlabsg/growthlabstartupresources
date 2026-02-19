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
  AlertCircle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Target,
  BarChart3,
  History,
  Copy,
  X,
  Plus,
  Edit,
  Trash2,
  Lightbulb,
  AlertTriangle,
  Info,
  Calculator,
  FileCheck
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TermSheet {
  id: string
  name: string
  companyName: string
  investorName: string
  date: string
  
  // Valuation & Investment
  preMoneyValuation: number
  investmentAmount: number
  postMoneyValuation: number
  equityPercentage: number
  pricePerShare: number
  
  // Terms
  liquidationPreference: number
  participationRights: boolean
  antiDilution: 'none' | 'full-ratchet' | 'weighted-average'
  boardSeats: number
  protectiveProvisions: string[]
  dragAlong: boolean
  tagAlong: boolean
  vestingSchedule: string
  optionPool: number
  
  // Rights
  proRataRights: boolean
  informationRights: boolean
  registrationRights: boolean
  rightOfFirstRefusal: boolean
  
  // Other Terms
  conversionRights: string
  redemptionRights: string
  votingRights: string
  notes: string
  
  createdAt: string
  updatedAt: string
}

interface TermAnalysis {
  riskLevel: 'low' | 'medium' | 'high'
  riskFactors: string[]
  favorableTerms: string[]
  concerns: string[]
  recommendations: string[]
  overallScore: number
}

export default function TermSheetPage() {
  const [activeTab, setActiveTab] = useState('analyzer')
  const [termSheets, setTermSheets] = useState<TermSheet[]>([])
  const [editingSheet, setEditingSheet] = useState<TermSheet | null>(null)
  const [selectedSheets, setSelectedSheets] = useState<string[]>([])
  const [analysis, setAnalysis] = useState<TermAnalysis | null>(null)

  const tabs = [
    { id: 'analyzer', label: 'Term Sheet Analyzer', icon: FileText },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
    { id: 'templates', label: 'Templates', icon: FileCheck },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('termSheetData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.termSheets) setTermSheets(data.termSheets)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        termSheets,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('termSheetData', JSON.stringify(data))
      showToast('Term sheet saved!', 'success')
    }
  }

  const calculatePostMoneyValuation = (preMoney: number, investment: number) => {
    return preMoney + investment
  }

  const calculateEquityPercentage = (investment: number, postMoney: number) => {
    return postMoney > 0 ? (investment / postMoney) * 100 : 0
  }

  const createNewTermSheet = () => {
    const newSheet: TermSheet = {
      id: Date.now().toString(),
      name: 'New Term Sheet',
      companyName: '',
      investorName: '',
      date: new Date().toISOString().split('T')[0],
      preMoneyValuation: 0,
      investmentAmount: 0,
      postMoneyValuation: 0,
      equityPercentage: 0,
      pricePerShare: 0,
      liquidationPreference: 1,
      participationRights: false,
      antiDilution: 'none',
      boardSeats: 0,
      protectiveProvisions: [],
      dragAlong: true,
      tagAlong: true,
      vestingSchedule: '4 years with 1 year cliff',
      optionPool: 20,
      proRataRights: true,
      informationRights: true,
      registrationRights: true,
      rightOfFirstRefusal: true,
      conversionRights: 'Standard conversion rights',
      redemptionRights: 'None',
      votingRights: 'Standard voting rights',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEditingSheet(newSheet)
  }

  const saveTermSheet = () => {
    if (!editingSheet) return
    if (!editingSheet.companyName || !editingSheet.investorName) {
      showToast('Please enter company and investor names', 'error')
      return
    }

    const postMoney = calculatePostMoneyValuation(editingSheet.preMoneyValuation, editingSheet.investmentAmount)
    const equity = calculateEquityPercentage(editingSheet.investmentAmount, postMoney)
    const pricePerShare = editingSheet.preMoneyValuation > 0 ? editingSheet.preMoneyValuation / 1000000 : 0

    const updatedSheet = {
      ...editingSheet,
      postMoneyValuation: postMoney,
      equityPercentage: equity,
      pricePerShare,
      updatedAt: new Date().toISOString()
    }

    const updated = termSheets.find(s => s.id === updatedSheet.id)
      ? termSheets.map(s => s.id === updatedSheet.id ? updatedSheet : s)
      : [...termSheets, updatedSheet]

    setTermSheets(updated)
    setEditingSheet(null)
    analyzeTermSheet(updatedSheet)
    saveToLocalStorage()
    showToast('Term sheet saved!', 'success')
  }

  const deleteTermSheet = (id: string) => {
    if (confirm('Are you sure you want to delete this term sheet?')) {
      const updated = termSheets.filter(s => s.id !== id)
      setTermSheets(updated)
      saveToLocalStorage()
      showToast('Term sheet deleted', 'info')
    }
  }

  const analyzeTermSheet = (sheet: TermSheet): TermAnalysis => {
    const riskFactors: string[] = []
    const favorableTerms: string[] = []
    const concerns: string[] = []
    const recommendations: string[] = []
    let riskScore = 0

    // Analyze liquidation preference
    if (sheet.liquidationPreference > 1) {
      riskFactors.push(`High liquidation preference (${sheet.liquidationPreference}x)`)
      concerns.push('Multiple liquidation preference can significantly reduce founder returns')
      riskScore += 3
    } else {
      favorableTerms.push('Standard 1x liquidation preference')
    }

    // Analyze participation rights
    if (sheet.participationRights) {
      riskFactors.push('Participation rights enabled')
      concerns.push('Participation rights allow double-dipping on exit')
      riskScore += 2
    } else {
      favorableTerms.push('No participation rights')
    }

    // Analyze anti-dilution
    if (sheet.antiDilution === 'full-ratchet') {
      riskFactors.push('Full ratchet anti-dilution')
      concerns.push('Full ratchet is very founder-unfriendly')
      riskScore += 3
      recommendations.push('Negotiate for weighted-average anti-dilution instead')
    } else if (sheet.antiDilution === 'weighted-average') {
      favorableTerms.push('Weighted-average anti-dilution (standard)')
    }

    // Analyze board seats
    if (sheet.boardSeats > 2) {
      riskFactors.push(`High number of investor board seats (${sheet.boardSeats})`)
      concerns.push('Too many investor board seats can reduce founder control')
      riskScore += 1
    }

    // Analyze option pool
    if (sheet.optionPool > 25) {
      riskFactors.push(`Large option pool (${sheet.optionPool}%)`)
      concerns.push('Large option pool dilutes founders significantly')
      riskScore += 1
    } else if (sheet.optionPool >= 15 && sheet.optionPool <= 20) {
      favorableTerms.push(`Reasonable option pool size (${sheet.optionPool}%)`)
    }

    // Analyze protective provisions
    if (sheet.protectiveProvisions.length > 10) {
      riskFactors.push(`Many protective provisions (${sheet.protectiveProvisions.length})`)
      concerns.push('Excessive protective provisions can limit operational flexibility')
      riskScore += 2
    }

    // Analyze vesting
    if (!sheet.vestingSchedule.includes('cliff')) {
      recommendations.push('Consider adding a vesting cliff for founders')
    }

    // Overall assessment
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (riskScore >= 7) riskLevel = 'high'
    else if (riskScore >= 4) riskLevel = 'medium'

    const overallScore = Math.max(0, 100 - (riskScore * 10))

    if (overallScore >= 80) {
      favorableTerms.push('Overall favorable terms for founders')
    } else if (overallScore < 60) {
      concerns.push('Term sheet has several founder-unfriendly terms')
      recommendations.push('Consider negotiating key terms before signing')
    }

    const analysis: TermAnalysis = {
      riskLevel,
      riskFactors,
      favorableTerms,
      concerns,
      recommendations,
      overallScore
    }

    setAnalysis(analysis)
    return analysis
  }

  const exportData = () => {
    if (!editingSheet) {
      showToast('No term sheet to export', 'error')
      return
    }
    const data = {
      ...editingSheet,
      analysis,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `term-sheet-${editingSheet.companyName}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Term sheet exported!', 'success')
  }

  const templates = [
    {
      id: 'seed-friendly',
      name: 'Founder-Friendly Seed',
      description: 'Standard terms for seed rounds',
      terms: {
        liquidationPreference: 1,
        participationRights: false,
        antiDilution: 'weighted-average',
        boardSeats: 1,
        optionPool: 20
      }
    },
    {
      id: 'series-a-standard',
      name: 'Standard Series A',
      description: 'Typical Series A terms',
      terms: {
        liquidationPreference: 1,
        participationRights: false,
        antiDilution: 'weighted-average',
        boardSeats: 2,
        optionPool: 20
      }
    },
    {
      id: 'investor-friendly',
      name: 'Investor-Friendly',
      description: 'Terms more favorable to investors',
      terms: {
        liquidationPreference: 2,
        participationRights: true,
        antiDilution: 'full-ratchet',
        boardSeats: 3,
        optionPool: 25
      }
    }
  ]

  const applyTemplate = (template: typeof templates[0]) => {
    const templateUpdates = {
      liquidationPreference: template.terms.liquidationPreference,
      participationRights: template.terms.participationRights,
      antiDilution: template.terms.antiDilution,
      boardSeats: template.terms.boardSeats,
      optionPool: template.terms.optionPool
    }
    if (!editingSheet) {
      createNewTermSheet()
      setTimeout(() => {
        setEditingSheet(prev => prev ? { ...prev, ...templateUpdates } as TermSheet : prev)
      }, 100)
    } else {
      setEditingSheet({ ...editingSheet, ...templateUpdates } as TermSheet)
    }
    showToast(`${template.name} template applied!`, 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Term Sheet Analyzer
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze, compare, and understand term sheets with comprehensive tools and expert guidance
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={createNewTermSheet} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                New Term Sheet
              </Button>
              {editingSheet && (
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

        {/* Term Sheet Analyzer Tab */}
        {activeTab === 'analyzer' && (
          <div className="space-y-6">
            {!editingSheet ? (
              <Card>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Term Sheet Selected</h3>
                  <p className="text-gray-600 mb-6">Create a new term sheet or load an existing one to get started</p>
                  <Button onClick={createNewTermSheet}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Term Sheet
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Form */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Term Sheet Details</h2>
                        <Button variant="ghost" size="sm" onClick={() => setEditingSheet(null)}>
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
                              <label className="block text-sm font-medium text-gray-700 mb-2">Term Sheet Name *</label>
                              <Input
                                value={editingSheet.name}
                                onChange={(e) => setEditingSheet({ ...editingSheet, name: e.target.value })}
                                placeholder="e.g., Series A Term Sheet"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                              <Input
                                type="date"
                                value={editingSheet.date}
                                onChange={(e) => setEditingSheet({ ...editingSheet, date: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                              <Input
                                value={editingSheet.companyName}
                                onChange={(e) => setEditingSheet({ ...editingSheet, companyName: e.target.value })}
                                placeholder="Your Company Inc."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Investor Name *</label>
                              <Input
                                value={editingSheet.investorName}
                                onChange={(e) => setEditingSheet({ ...editingSheet, investorName: e.target.value })}
                                placeholder="Investor Name"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Valuation & Investment */}
                        <div>
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary-500" />
                            Valuation & Investment
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Pre-Money Valuation ($) *</label>
                              <Input
                                type="number"
                                value={editingSheet.preMoneyValuation}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0
                                  const postMoney = calculatePostMoneyValuation(val, editingSheet.investmentAmount)
                                  const equity = calculateEquityPercentage(editingSheet.investmentAmount, postMoney)
                                  setEditingSheet({
                                    ...editingSheet,
                                    preMoneyValuation: val,
                                    postMoneyValuation: postMoney,
                                    equityPercentage: equity
                                  })
                                }}
                                placeholder="10000000"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($) *</label>
                              <Input
                                type="number"
                                value={editingSheet.investmentAmount}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0
                                  const postMoney = calculatePostMoneyValuation(editingSheet.preMoneyValuation, val)
                                  const equity = calculateEquityPercentage(val, postMoney)
                                  setEditingSheet({
                                    ...editingSheet,
                                    investmentAmount: val,
                                    postMoneyValuation: postMoney,
                                    equityPercentage: equity
                                  })
                                }}
                                placeholder="2000000"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Post-Money Valuation</label>
                              <Input
                                type="number"
                                value={editingSheet.postMoneyValuation.toLocaleString()}
                                disabled
                                className="bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Equity Percentage</label>
                              <Input
                                type="number"
                                value={editingSheet.equityPercentage.toFixed(2)}
                                disabled
                                className="bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Key Terms */}
                        <div>
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary-500" />
                            Key Terms
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Liquidation Preference</label>
                              <Input
                                type="number"
                                step="0.1"
                                value={editingSheet.liquidationPreference}
                                onChange={(e) => setEditingSheet({ ...editingSheet, liquidationPreference: parseFloat(e.target.value) || 1 })}
                                placeholder="1"
                              />
                              <p className="text-xs text-gray-500 mt-1">Standard is 1x</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Anti-Dilution</label>
                              <Select
                                value={editingSheet.antiDilution}
                                onChange={(e) => setEditingSheet({ ...editingSheet, antiDilution: e.target.value as any })}
                                options={[
                                  { value: 'none', label: 'None' },
                                  { value: 'weighted-average', label: 'Weighted Average' },
                                  { value: 'full-ratchet', label: 'Full Ratchet' }
                                ]}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Board Seats</label>
                              <Input
                                type="number"
                                value={editingSheet.boardSeats}
                                onChange={(e) => setEditingSheet({ ...editingSheet, boardSeats: parseInt(e.target.value) || 0 })}
                                placeholder="1"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Option Pool (%)</label>
                              <Input
                                type="number"
                                value={editingSheet.optionPool}
                                onChange={(e) => setEditingSheet({ ...editingSheet, optionPool: parseFloat(e.target.value) || 0 })}
                                placeholder="20"
                              />
                            </div>
                          </div>
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingSheet.participationRights}
                                onChange={(e) => setEditingSheet({ ...editingSheet, participationRights: e.target.checked })}
                                className="rounded"
                              />
                              <label className="text-sm text-gray-700">Participation Rights</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingSheet.dragAlong}
                                onChange={(e) => setEditingSheet({ ...editingSheet, dragAlong: e.target.checked })}
                                className="rounded"
                              />
                              <label className="text-sm text-gray-700">Drag-Along Rights</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingSheet.tagAlong}
                                onChange={(e) => setEditingSheet({ ...editingSheet, tagAlong: e.target.checked })}
                                className="rounded"
                              />
                              <label className="text-sm text-gray-700">Tag-Along Rights</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingSheet.proRataRights}
                                onChange={(e) => setEditingSheet({ ...editingSheet, proRataRights: e.target.checked })}
                                className="rounded"
                              />
                              <label className="text-sm text-gray-700">Pro Rata Rights</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingSheet.informationRights}
                                onChange={(e) => setEditingSheet({ ...editingSheet, informationRights: e.target.checked })}
                                className="rounded"
                              />
                              <label className="text-sm text-gray-700">Information Rights</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingSheet.registrationRights}
                                onChange={(e) => setEditingSheet({ ...editingSheet, registrationRights: e.target.checked })}
                                className="rounded"
                              />
                              <label className="text-sm text-gray-700">Registration Rights</label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vesting Schedule</label>
                          <Input
                            value={editingSheet.vestingSchedule}
                            onChange={(e) => setEditingSheet({ ...editingSheet, vestingSchedule: e.target.value })}
                            placeholder="4 years with 1 year cliff"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                          <textarea
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                            rows={4}
                            value={editingSheet.notes}
                            onChange={(e) => setEditingSheet({ ...editingSheet, notes: e.target.value })}
                            placeholder="Additional notes and observations..."
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={saveTermSheet} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            Save Term Sheet
                          </Button>
                          <Button variant="outline" onClick={() => {
                            analyzeTermSheet(editingSheet)
                            showToast('Analysis updated!', 'success')
                          }}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analyze
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Analysis Sidebar */}
                  <div className="space-y-6">
                    {analysis && (
                      <Card>
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart3 className="h-5 w-5 text-primary-500" />
                          <h3 className="font-semibold">Term Analysis</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg border-2" style={{
                            borderColor: analysis.riskLevel === 'high' ? '#ef4444' : analysis.riskLevel === 'medium' ? '#f59e0b' : '#10b981',
                            backgroundColor: analysis.riskLevel === 'high' ? '#fef2f2' : analysis.riskLevel === 'medium' ? '#fffbeb' : '#f0fdf4'
                          }}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold">Risk Level</span>
                              <Badge variant={analysis.riskLevel === 'high' ? 'featured' : analysis.riskLevel === 'medium' ? 'outline' : 'beginner'}>
                                {analysis.riskLevel.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-2xl font-bold mb-1">{analysis.overallScore}/100</div>
                            <div className="text-sm text-gray-600">Overall Score</div>
                          </div>

                          {analysis.favorableTerms.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Favorable Terms
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700">
                                {analysis.favorableTerms.map((term, idx) => (
                                  <li key={idx}>• {term}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {analysis.riskFactors.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                Risk Factors
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700">
                                {analysis.riskFactors.map((factor, idx) => (
                                  <li key={idx}>• {factor}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {analysis.concerns.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-yellow-700 mb-2 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                Concerns
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700">
                                {analysis.concerns.map((concern, idx) => (
                                  <li key={idx}>• {concern}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {analysis.recommendations.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-1">
                                <Lightbulb className="h-4 w-4" />
                                Recommendations
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700">
                                {analysis.recommendations.map((rec, idx) => (
                                  <li key={idx}>• {rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </Card>
                    )}

                    <Card>
                      <h3 className="font-semibold mb-4">Quick Stats</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Post-Money Valuation</div>
                          <div className="text-lg font-bold">${(editingSheet.postMoneyValuation / 1000000).toFixed(2)}M</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Equity to Investor</div>
                          <div className="text-lg font-bold">{editingSheet.equityPercentage.toFixed(2)}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Price per Share</div>
                          <div className="text-lg font-bold">${editingSheet.pricePerShare.toFixed(4)}</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Compare Term Sheets</h2>
              </div>
              {termSheets.length < 2 ? (
                <div className="text-center py-12 text-gray-400">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>You need at least 2 term sheets to compare. Create more term sheets first.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {termSheets.map((sheet) => (
                      <Card key={sheet.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{sheet.name}</h4>
                            <p className="text-sm text-gray-600">{sheet.companyName} - {sheet.investorName}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedSheets.includes(sheet.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSheets([...selectedSheets, sheet.id])
                              } else {
                                setSelectedSheets(selectedSheets.filter(id => id !== sheet.id))
                              }
                            }}
                            className="rounded"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                  {selectedSheets.length >= 2 && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Comparison</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Term</th>
                              {selectedSheets.map(id => {
                                const sheet = termSheets.find(s => s.id === id)
                                return <th key={id} className="text-left p-2">{sheet?.name}</th>
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Pre-Money Valuation</td>
                              {selectedSheets.map(id => {
                                const sheet = termSheets.find(s => s.id === id)
                                return <td key={id} className="p-2">${(sheet?.preMoneyValuation || 0) / 1000000}M</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Investment Amount</td>
                              {selectedSheets.map(id => {
                                const sheet = termSheets.find(s => s.id === id)
                                return <td key={id} className="p-2">${(sheet?.investmentAmount || 0) / 1000}K</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Equity %</td>
                              {selectedSheets.map(id => {
                                const sheet = termSheets.find(s => s.id === id)
                                return <td key={id} className="p-2">{sheet?.equityPercentage.toFixed(2)}%</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Liquidation Preference</td>
                              {selectedSheets.map(id => {
                                const sheet = termSheets.find(s => s.id === id)
                                return <td key={id} className="p-2">{sheet?.liquidationPreference}x</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Participation Rights</td>
                              {selectedSheets.map(id => {
                                const sheet = termSheets.find(s => s.id === id)
                                return <td key={id} className="p-2">{sheet?.participationRights ? 'Yes' : 'No'}</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Anti-Dilution</td>
                              {selectedSheets.map(id => {
                                const sheet = termSheets.find(s => s.id === id)
                                return <td key={id} className="p-2">{sheet?.antiDilution}</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Board Seats</td>
                              {selectedSheets.map(id => {
                                const sheet = termSheets.find(s => s.id === id)
                                return <td key={id} className="p-2">{sheet?.boardSeats}</td>
                              })}
                            </tr>
                            <tr>
                              <td className="p-2 font-medium">Option Pool</td>
                              {selectedSheets.map(id => {
                                const sheet = termSheets.find(s => s.id === id)
                                return <td key={id} className="p-2">{sheet?.optionPool}%</td>
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
                <h2 className="text-2xl font-bold">Term Sheet Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="p-6 hover:shadow-lg transition-all">
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <div className="space-y-2 mb-4 text-xs text-gray-600">
                      <div>Liquidation: {template.terms.liquidationPreference}x</div>
                      <div>Participation: {template.terms.participationRights ? 'Yes' : 'No'}</div>
                      <div>Anti-Dilution: {template.terms.antiDilution}</div>
                      <div>Board Seats: {template.terms.boardSeats}</div>
                      <div>Option Pool: {template.terms.optionPool}%</div>
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
                <h2 className="text-2xl font-bold">Term Sheet History</h2>
              </div>
              {termSheets.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No term sheets yet. Create your first term sheet to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {termSheets.map((sheet) => (
                    <Card key={sheet.id} className="p-4 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between cursor-pointer" onClick={() => setEditingSheet(sheet)}>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{sheet.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span>{sheet.companyName}</span>
                            <span>•</span>
                            <span>{sheet.investorName}</span>
                            <span>•</span>
                            <span>{new Date(sheet.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>${(sheet.preMoneyValuation / 1000000).toFixed(1)}M pre-money</span>
                            <span>${(sheet.investmentAmount / 1000).toFixed(0)}K investment</span>
                            <span>{sheet.equityPercentage.toFixed(2)}% equity</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingSheet(sheet)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTermSheet(sheet.id)
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
