'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  FileCheck, 
  Calculator,
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3,
  History,
  X,
  Plus,
  Edit,
  Trash2,
  Download,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  FileText,
  Percent,
  Target,
  Clock,
  TrendingDown,
  Users
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface ConvertibleNote {
  id: string
  name: string
  investorName: string
  issueDate: string
  maturityDate: string
  principalAmount: number
  interestRate: number
  discountRate: number
  valuationCap?: number
  conversionTrigger: 'equity-financing' | 'liquidity-event' | 'maturity' | 'dissolution'
  accruedInterest: number
  totalOwed: number
  notes?: string
  createdAt: string
  updatedAt: string
}

interface ConversionScenario {
  id: string
  noteId: string
  name: string
  nextRoundValuation: number
  nextRoundAmount: number
  conversionMethod: 'discount' | 'cap' | 'better-of'
  conversionPrice: number
  sharesReceived: number
  equityPercentage: number
  principalConverted: number
  interestConverted: number
}

export default function ConvertibleNoteCalculatorPage() {
  const [activeTab, setActiveTab] = useState('calculator')
  const [notes, setNotes] = useState<ConvertibleNote[]>([])
  const [editingNote, setEditingNote] = useState<ConvertibleNote | null>(null)
  const [conversionScenarios, setConversionScenarios] = useState<ConversionScenario[]>([])
  const [editingScenario, setEditingScenario] = useState<ConversionScenario | null>(null)
  const [selectedNotes, setSelectedNotes] = useState<string[]>([])
  const [totalShares, setTotalShares] = useState(10000000)

  const tabs = [
    { id: 'calculator', label: 'Note Calculator', icon: Calculator },
    { id: 'notes', label: 'My Notes', icon: FileText },
    { id: 'conversion', label: 'Conversion', icon: TrendingUp },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
    { id: 'templates', label: 'Templates', icon: FileCheck },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('convertibleNoteCalculatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.notes) setNotes(data.notes)
          if (data.conversionScenarios) setConversionScenarios(data.conversionScenarios)
          if (data.totalShares) setTotalShares(data.totalShares)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  useEffect(() => {
    // Update accrued interest for all notes
    const updated = notes.map(note => {
      const daysSinceIssue = Math.floor((new Date().getTime() - new Date(note.issueDate).getTime()) / (1000 * 60 * 60 * 24))
      const yearsSinceIssue = daysSinceIssue / 365
      const accrued = note.principalAmount * (note.interestRate / 100) * yearsSinceIssue
      const totalOwed = note.principalAmount + accrued
      return { ...note, accruedInterest: accrued, totalOwed }
    })
    if (updated.length > 0 && JSON.stringify(updated) !== JSON.stringify(notes)) {
      setNotes(updated)
    }
  }, [notes.length])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        notes,
        conversionScenarios,
        totalShares,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('convertibleNoteCalculatorData', JSON.stringify(data))
      showToast('Data saved!', 'success')
    }
  }

  const createNewNote = () => {
    const newNote: ConvertibleNote = {
      id: Date.now().toString(),
      name: 'New Convertible Note',
      investorName: '',
      issueDate: new Date().toISOString().split('T')[0],
      maturityDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      principalAmount: 0,
      interestRate: 0,
      discountRate: 20,
      valuationCap: 0,
      conversionTrigger: 'equity-financing',
      accruedInterest: 0,
      totalOwed: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEditingNote(newNote)
  }

  const saveNote = () => {
    if (!editingNote) return
    if (!editingNote.investorName || editingNote.principalAmount <= 0) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const daysSinceIssue = Math.floor((new Date().getTime() - new Date(editingNote.issueDate).getTime()) / (1000 * 60 * 60 * 24))
    const yearsSinceIssue = daysSinceIssue / 365
    const accrued = editingNote.principalAmount * (editingNote.interestRate / 100) * yearsSinceIssue
    const totalOwed = editingNote.principalAmount + accrued

    const updatedNote = {
      ...editingNote,
      accruedInterest: accrued,
      totalOwed,
      updatedAt: new Date().toISOString()
    }

    const updated = notes.find(n => n.id === updatedNote.id)
      ? notes.map(n => n.id === updatedNote.id ? updatedNote : n)
      : [...notes, updatedNote]

    setNotes(updated)
    setEditingNote(null)
    saveToLocalStorage()
    showToast('Convertible note saved!', 'success')
  }

  const deleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this convertible note?')) {
      const updated = notes.filter(n => n.id !== id)
      setNotes(updated)
      setConversionScenarios(conversionScenarios.filter(s => s.noteId !== id))
      saveToLocalStorage()
      showToast('Note deleted', 'info')
    }
  }

  const calculateConversion = (note: ConvertibleNote, nextRoundValuation: number, nextRoundAmount: number, method: 'discount' | 'cap' | 'better-of'): ConversionScenario => {
    let conversionPrice = 0
    let sharesReceived = 0
    let equityPercentage = 0

    const pricePerShare = nextRoundValuation / totalShares
    const totalOwed = note.totalOwed

    if (method === 'discount') {
      conversionPrice = pricePerShare * (1 - note.discountRate / 100)
      sharesReceived = totalOwed / conversionPrice
    } else if (method === 'cap' && note.valuationCap) {
      const capPricePerShare = note.valuationCap / totalShares
      conversionPrice = capPricePerShare
      sharesReceived = totalOwed / conversionPrice
    } else if (method === 'better-of' && note.valuationCap) {
      const discountPrice = pricePerShare * (1 - note.discountRate / 100)
      const capPrice = note.valuationCap / totalShares
      conversionPrice = Math.min(discountPrice, capPrice)
      sharesReceived = totalOwed / conversionPrice
    }

    const newTotalShares = totalShares + (nextRoundAmount / pricePerShare)
    equityPercentage = (sharesReceived / newTotalShares) * 100

    return {
      id: Date.now().toString(),
      noteId: note.id,
      name: `${note.name} - Conversion`,
      nextRoundValuation,
      nextRoundAmount,
      conversionMethod: method,
      conversionPrice,
      sharesReceived: Math.round(sharesReceived),
      equityPercentage,
      principalConverted: note.principalAmount,
      interestConverted: note.accruedInterest
    }
  }

  const createConversionScenario = () => {
    if (notes.length === 0) {
      showToast('Please create convertible notes first', 'error')
      return
    }
    const selectedNote = notes[0] // Default to first note
    const newScenario: ConversionScenario = {
      id: Date.now().toString(),
      noteId: selectedNote.id,
      name: 'New Conversion Scenario',
      nextRoundValuation: 0,
      nextRoundAmount: 0,
      conversionMethod: selectedNote.valuationCap ? 'better-of' : 'discount',
      conversionPrice: 0,
      sharesReceived: 0,
      equityPercentage: 0,
      principalConverted: selectedNote.principalAmount,
      interestConverted: selectedNote.accruedInterest
    }
    setEditingScenario(newScenario)
  }

  const saveConversionScenario = () => {
    if (!editingScenario) return
    const note = notes.find(n => n.id === editingScenario.noteId)
    if (!note) {
      showToast('Note not found', 'error')
      return
    }
    if (!editingScenario.nextRoundValuation || !editingScenario.nextRoundAmount) {
      showToast('Please enter next round valuation and amount', 'error')
      return
    }

    const calculated = calculateConversion(
      note,
      editingScenario.nextRoundValuation,
      editingScenario.nextRoundAmount,
      editingScenario.conversionMethod
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
    const data = {
      notes,
      conversionScenarios,
      totalShares,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `convertible-notes-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported!', 'success')
  }

  const templates = [
    {
      id: 'standard',
      name: 'Standard Convertible Note',
      description: 'Standard note with discount and valuation cap',
      discountRate: 20,
      interestRate: 6,
      valuationCap: 10000000
    },
    {
      id: 'discount-only',
      name: 'Discount Only',
      description: 'Note with only discount rate',
      discountRate: 20,
      interestRate: 0,
      valuationCap: 0
    },
    {
      id: 'cap-only',
      name: 'Valuation Cap Only',
      description: 'Note with only valuation cap',
      discountRate: 0,
      interestRate: 6,
      valuationCap: 10000000
    },
    {
      id: 'founder-friendly',
      name: 'Founder-Friendly',
      description: 'Lower discount and higher cap',
      discountRate: 15,
      interestRate: 4,
      valuationCap: 15000000
    }
  ]

  const applyTemplate = (template: typeof templates[0]) => {
    if (!editingNote) {
      createNewNote()
      setTimeout(() => {
        setEditingNote(prev => prev ? {
          ...prev,
          discountRate: template.discountRate,
          interestRate: template.interestRate,
          valuationCap: template.valuationCap || undefined
        } : null)
      }, 100)
    } else {
      setEditingNote({
        ...editingNote,
        discountRate: template.discountRate,
        interestRate: template.interestRate,
        valuationCap: template.valuationCap || undefined
      })
    }
    showToast(`${template.name} template applied!`, 'success')
  }

  const totalPrincipal = notes.reduce((sum, n) => sum + n.principalAmount, 0)
  const totalAccrued = notes.reduce((sum, n) => sum + n.accruedInterest, 0)
  const totalOwed = notes.reduce((sum, n) => sum + n.totalOwed, 0)

  const notesChartData = notes.map(n => ({
    name: n.name,
    principal: n.principalAmount,
    interest: n.accruedInterest,
    total: n.totalOwed
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            Convertible Note Calculator
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate conversion terms, track interest accrual, and model conversion scenarios for convertible notes
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={createNewNote} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
              {notes.length > 0 && (
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

        {/* Note Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Principal</div>
                <div className="text-2xl font-bold">${(totalPrincipal / 1000).toFixed(0)}K</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Accrued Interest</div>
                <div className="text-2xl font-bold text-yellow-600">${(totalAccrued / 1000).toFixed(0)}K</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-gray-600 mb-1">Total Owed</div>
                <div className="text-2xl font-bold text-primary-600">${(totalOwed / 1000).toFixed(0)}K</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary-500" />
                  Quick Calculator
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Outstanding Shares</label>
                    <Input
                      type="number"
                      value={totalShares}
                      onChange={(e) => setTotalShares(parseFloat(e.target.value) || 0)}
                      placeholder="10000000"
                    />
                  </div>
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Principal Amount ($)</label>
                    <Input
                type="number"
                      id="calc-principal"
                      placeholder="100000"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Rate (%)</label>
                    <Input
                type="number"
                      id="calc-discount"
                      placeholder="20"
              />
            </div>
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valuation Cap ($)</label>
                    <Input
                type="number"
                      id="calc-cap"
                      placeholder="10000000"
                    />
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Conversion Price (at cap)</div>
                    <div id="calc-result" className="text-lg font-bold text-primary-600">$0.00</div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary-500" />
                  About Convertible Notes
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Convertible Notes</strong> are debt instruments that convert to equity under specific conditions, typically:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Equity financing round (most common)</li>
                    <li>Liquidity event (acquisition, IPO)</li>
                    <li>Maturity date</li>
                    <li>Dissolution</li>
                  </ul>
                  <p className="mt-3">
                    <strong>Key Terms:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Discount Rate:</strong> Percentage discount on conversion price (typically 15-25%)</li>
                    <li><strong>Valuation Cap:</strong> Maximum valuation for conversion (investor-friendly)</li>
                    <li><strong>Interest Rate:</strong> Accrues until conversion (typically 4-8%)</li>
                    <li><strong>Maturity Date:</strong> When note must convert or be repaid</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* My Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Convertible Notes</h2>
                </div>
                <Button onClick={createNewNote} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              </div>

              {notes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>No convertible notes yet. Create your first note to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => {
                    const daysToMaturity = Math.floor((new Date(note.maturityDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <Card key={note.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{note.name}</h4>
                              <Badge variant="outline" className="text-xs">{note.investorName}</Badge>
                              {daysToMaturity < 90 && daysToMaturity > 0 && (
                                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                                  Matures in {daysToMaturity} days
                                </Badge>
                              )}
                              {daysToMaturity < 0 && (
                                <Badge variant="outline" className="text-xs bg-red-100 text-red-800">Past Maturity</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <span className="font-medium">Principal:</span> ${(note.principalAmount / 1000).toFixed(0)}K
                              </div>
                              <div>
                                <span className="font-medium">Interest:</span> ${(note.accruedInterest / 1000).toFixed(0)}K
                              </div>
                              <div>
                                <span className="font-medium">Total Owed:</span> ${(note.totalOwed / 1000).toFixed(0)}K
                              </div>
                              <div>
                                <span className="font-medium">Discount:</span> {note.discountRate}%
                              </div>
                            </div>
                            {note.valuationCap && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Valuation Cap:</span> ${(note.valuationCap / 1000000).toFixed(1)}M
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingNote(note)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNote(note.id)}
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

        {/* Conversion Tab */}
        {activeTab === 'conversion' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Conversion Scenarios</h2>
                </div>
                <Button onClick={createConversionScenario} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Scenario
                </Button>
              </div>

              {notes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <p>Please create convertible notes first to model conversions.</p>
                </div>
              ) : (
                <>
                  {conversionScenarios.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {conversionScenarios.map((scenario) => {
                        const note = notes.find(n => n.id === scenario.noteId)
                        return (
                          <Card key={scenario.id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold">{scenario.name}</h4>
                                  <Badge variant="outline" className="text-xs">{note?.name}</Badge>
                                  <Badge variant="beginner" className="text-xs">{scenario.conversionMethod}</Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Next Round:</span> ${(scenario.nextRoundValuation / 1000000).toFixed(1)}M
                                  </div>
                                  <div>
                                    <span className="font-medium">Shares:</span> {scenario.sharesReceived.toLocaleString()}
                                  </div>
                                  <div>
                                    <span className="font-medium">Equity:</span> {scenario.equityPercentage.toFixed(2)}%
                                  </div>
                                  <div>
                                    <span className="font-medium">Price/Share:</span> ${scenario.conversionPrice.toFixed(4)}
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
                        )
                      })}
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select Note *</label>
                          <Select
                            value={editingScenario.noteId}
                            onChange={(e) => {
                              const note = notes.find(n => n.id === e.target.value)
                              if (note) {
                                setEditingScenario({
                                  ...editingScenario,
                                  noteId: e.target.value,
                                  principalConverted: note.principalAmount,
                                  interestConverted: note.accruedInterest,
                                  conversionMethod: note.valuationCap ? 'better-of' : 'discount'
                                })
                              }
                            }}
                            options={notes.map(n => ({ value: n.id, label: n.name }))}
                          />
                        </div>
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
                                const note = notes.find(n => n.id === editingScenario.noteId)
                                if (note) {
                                  const calculated = calculateConversion(note, val, editingScenario.nextRoundAmount, editingScenario.conversionMethod)
                                  const { nextRoundValuation, nextRoundAmount, conversionMethod, ...rest } = calculated
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
                                const note = notes.find(n => n.id === editingScenario.noteId)
                                if (note) {
                                  const calculated = calculateConversion(note, editingScenario.nextRoundValuation, val, editingScenario.conversionMethod)
                                  const { nextRoundValuation, nextRoundAmount, conversionMethod, ...rest } = calculated
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Method *</label>
                          <Select
                            value={editingScenario.conversionMethod}
                            onChange={(e) => {
                              const method = e.target.value as 'discount' | 'cap' | 'better-of'
                              const note = notes.find(n => n.id === editingScenario.noteId)
                              if (note) {
                                const calculated = calculateConversion(note, editingScenario.nextRoundValuation, editingScenario.nextRoundAmount, method)
                                const { nextRoundValuation, nextRoundAmount, conversionMethod, ...rest } = calculated
                                setEditingScenario({
                                  ...editingScenario,
                                  conversionMethod: method,
                                  ...rest
                                })
                              }
                            }}
                            options={[
                              { value: 'discount', label: 'Discount Only' },
                              { value: 'cap', label: 'Valuation Cap Only' },
                              { value: 'better-of', label: 'Better of Discount or Cap' }
                            ]}
                          />
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold mb-3 text-green-900">Conversion Results:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-green-700 mb-1">Shares Received</div>
                              <div className="text-lg font-bold text-green-900">{editingScenario.sharesReceived.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-green-700 mb-1">Equity %</div>
                              <div className="text-lg font-bold text-green-900">{editingScenario.equityPercentage.toFixed(2)}%</div>
                            </div>
                            <div>
                              <div className="text-green-700 mb-1">Price/Share</div>
                              <div className="text-lg font-bold text-green-900">${editingScenario.conversionPrice.toFixed(4)}</div>
                            </div>
                            <div>
                              <div className="text-green-700 mb-1">Total Converted</div>
                              <div className="text-lg font-bold text-green-900">${(editingScenario.principalConverted + editingScenario.interestConverted).toLocaleString()}</div>
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
                <h2 className="text-2xl font-bold">Compare Notes</h2>
              </div>
              {notes.length < 2 ? (
                <div className="text-center py-12 text-gray-400">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>You need at least 2 notes to compare. Create more notes first.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notes.map((note) => (
                      <Card key={note.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{note.name}</h4>
                            <p className="text-sm text-gray-600">{note.investorName}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedNotes.includes(note.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedNotes([...selectedNotes, note.id])
                              } else {
                                setSelectedNotes(selectedNotes.filter(id => id !== note.id))
                              }
                            }}
                            className="rounded"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                  {selectedNotes.length >= 2 && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Comparison</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Term</th>
                              {selectedNotes.map(id => {
                                const note = notes.find(n => n.id === id)
                                return <th key={id} className="text-left p-2">{note?.name}</th>
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Principal</td>
                              {selectedNotes.map(id => {
                                const note = notes.find(n => n.id === id)
                                return <td key={id} className="p-2">${((note?.principalAmount || 0) / 1000).toFixed(0)}K</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Interest Rate</td>
                              {selectedNotes.map(id => {
                                const note = notes.find(n => n.id === id)
                                return <td key={id} className="p-2">{note?.interestRate}%</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Discount Rate</td>
                              {selectedNotes.map(id => {
                                const note = notes.find(n => n.id === id)
                                return <td key={id} className="p-2">{note?.discountRate}%</td>
                              })}
                            </tr>
                            <tr className="border-b">
                              <td className="p-2 font-medium">Valuation Cap</td>
                              {selectedNotes.map(id => {
                                const note = notes.find(n => n.id === id)
                                return <td key={id} className="p-2">{note?.valuationCap ? `$${(note.valuationCap / 1000000).toFixed(1)}M` : 'N/A'}</td>
                              })}
                            </tr>
                            <tr>
                              <td className="p-2 font-medium">Total Owed</td>
                              {selectedNotes.map(id => {
                                const note = notes.find(n => n.id === id)
                                return <td key={id} className="p-2">${((note?.totalOwed || 0) / 1000).toFixed(0)}K</td>
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
                <h2 className="text-2xl font-bold">Note Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="p-6 hover:shadow-lg transition-all">
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <div className="space-y-2 mb-4 text-xs text-gray-600">
                      {template.discountRate > 0 && (
                        <div>Discount: {template.discountRate}%</div>
                      )}
                      {template.interestRate > 0 && (
                        <div>Interest: {template.interestRate}%</div>
                      )}
                      {template.valuationCap > 0 && (
                        <div>Cap: ${(template.valuationCap / 1000000).toFixed(1)}M</div>
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
                <h2 className="text-2xl font-bold">Note History</h2>
              </div>
              {notes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No notes yet. Create your first convertible note to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <Card key={note.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{note.name}</h4>
                          <p className="text-sm text-gray-600">{note.investorName} • {new Date(note.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(note.totalOwed / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-gray-600">Total Owed</p>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
            </Card>
          </div>
        )}

        {/* Edit Note Modal */}
        {editingNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingNote.id && notes.find(n => n.id === editingNote.id) ? 'Edit Convertible Note' : 'New Convertible Note'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingNote(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note Name *</label>
                    <Input
                      value={editingNote.name}
                      onChange={(e) => setEditingNote({ ...editingNote, name: e.target.value })}
                      placeholder="e.g., Seed Note #1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investor Name *</label>
                    <Input
                      value={editingNote.investorName}
                      onChange={(e) => setEditingNote({ ...editingNote, investorName: e.target.value })}
                      placeholder="Investor Name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date *</label>
                    <Input
                      type="date"
                      value={editingNote.issueDate}
                      onChange={(e) => setEditingNote({ ...editingNote, issueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maturity Date *</label>
                    <Input
                      type="date"
                      value={editingNote.maturityDate}
                      onChange={(e) => setEditingNote({ ...editingNote, maturityDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Principal Amount ($) *</label>
                    <Input
                      type="number"
                      value={editingNote.principalAmount}
                      onChange={(e) => setEditingNote({ ...editingNote, principalAmount: parseFloat(e.target.value) || 0 })}
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingNote.interestRate}
                      onChange={(e) => setEditingNote({ ...editingNote, interestRate: parseFloat(e.target.value) || 0 })}
                      placeholder="6"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typically 4-8% annually</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Rate (%) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingNote.discountRate}
                      onChange={(e) => setEditingNote({ ...editingNote, discountRate: parseFloat(e.target.value) || 0 })}
                      placeholder="20"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typically 15-25%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valuation Cap ($)</label>
                    <Input
                      type="number"
                      value={editingNote.valuationCap || ''}
                      onChange={(e) => setEditingNote({ ...editingNote, valuationCap: parseFloat(e.target.value) || undefined })}
                      placeholder="10000000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional - maximum valuation for conversion</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Trigger</label>
                  <Select
                    value={editingNote.conversionTrigger}
                    onChange={(e) => setEditingNote({ ...editingNote, conversionTrigger: e.target.value as any })}
                    options={[
                      { value: 'equity-financing', label: 'Equity Financing' },
                      { value: 'liquidity-event', label: 'Liquidity Event' },
                      { value: 'maturity', label: 'Maturity Date' },
                      { value: 'dissolution', label: 'Dissolution' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingNote.notes || ''}
                    onChange={(e) => setEditingNote({ ...editingNote, notes: e.target.value })}
                    placeholder="Additional notes and observations..."
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Accrued Interest (estimated):</div>
                  <div className="text-lg font-bold text-primary-600">
                    ${(editingNote.principalAmount * (editingNote.interestRate / 100) * 
                      (Math.floor((new Date().getTime() - new Date(editingNote.issueDate).getTime()) / (1000 * 60 * 60 * 24)) / 365)).toFixed(0)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveNote} className="flex-1">
                    Save Note
                  </Button>
                  <Button variant="outline" onClick={() => setEditingNote(null)}>
                    Cancel
                  </Button>
                </div>
          </div>
        </Card>
          </div>
        )}
      </div>
    </main>
  )
}
