'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  TrendingUp, 
  Plus, 
  Save,
  Edit,
  Trash2,
  X,
  Download,
  Building2,
  Target,
  DollarSign,
  BarChart3,
  Activity,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Users,
  Globe,
  FileText
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts'

interface Competitor {
  id: string
  name: string
  website?: string
  description: string
  marketShare: string
  pricing: string
  pricingModel: 'subscription' | 'one-time' | 'freemium' | 'usage-based' | 'other'
  targetMarket: string
  strengths: string[]
  weaknesses: string[]
  features: string[]
  funding?: string
  employees?: string
  founded?: string
  location?: string
  notes: string
}

export default function CompetitiveAnalysisPage() {
  const [activeTab, setActiveTab] = useState('competitors')
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'competitors', label: 'Competitors', icon: Building2 },
    { id: 'features', label: 'Feature Comparison', icon: CheckCircle },
    { id: 'swot', label: 'SWOT Analysis', icon: Target },
    { id: 'pricing', label: 'Pricing Analysis', icon: DollarSign },
    { id: 'positioning', label: 'Market Positioning', icon: BarChart3 },
    { id: 'insights', label: 'Insights', icon: Activity },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('competitiveAnalysisData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.competitors) setCompetitors(data.competitors)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        competitors,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('competitiveAnalysisData', JSON.stringify(data))
    }
  }

  const exportData = () => {
    const data = {
      competitors,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `competitive-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Analysis exported successfully', 'success')
  }

  const addCompetitor = () => {
    const newCompetitor: Competitor = {
      id: Date.now().toString(),
      name: '',
      description: '',
      marketShare: '',
      pricing: '',
      pricingModel: 'subscription',
      targetMarket: '',
      strengths: [],
      weaknesses: [],
      features: [],
      notes: '',
    }
    setEditingCompetitor(newCompetitor)
  }

  const saveCompetitor = () => {
    if (!editingCompetitor) return
    if (!editingCompetitor.name) {
      showToast('Please enter competitor name', 'error')
      return
    }

    const existing = competitors.find(c => c.id === editingCompetitor.id)
    if (existing) {
      setCompetitors(competitors.map(c => c.id === editingCompetitor.id ? editingCompetitor : c))
      showToast('Competitor updated!', 'success')
    } else {
      setCompetitors([...competitors, editingCompetitor])
      showToast('Competitor added!', 'success')
    }
    setEditingCompetitor(null)
    saveToLocalStorage()
  }

  const deleteCompetitor = (id: string) => {
    setCompetitors(competitors.filter(c => c.id !== id))
    showToast('Competitor removed', 'success')
    saveToLocalStorage()
  }

  const filteredCompetitors = competitors.filter(competitor =>
    competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    competitor.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Feature Comparison
  const getAllFeatures = () => {
    const featureSet = new Set<string>()
    competitors.forEach(competitor => {
      competitor.features.forEach(feature => featureSet.add(feature))
    })
    return Array.from(featureSet).sort()
  }

  const hasFeature = (competitorId: string, feature: string) => {
    const competitor = competitors.find(c => c.id === competitorId)
    return competitor?.features.includes(feature) || false
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            Competitive Analysis
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze your competitors, compare features, identify market positioning, and discover competitive advantages.
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

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Competitors</h2>
                </div>
                <Button onClick={addCompetitor} size="sm" className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Competitor
          </Button>
        </div>

              <div className="mb-4">
                <Input
                  placeholder="Search competitors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filteredCompetitors.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Competitors Yet</h3>
                  <p className="text-gray-600 mb-6">Start analyzing your competitive landscape</p>
                  <Button onClick={addCompetitor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Competitor
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCompetitors.map((competitor) => (
                    <Card key={competitor.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{competitor.name}</h4>
                          {competitor.marketShare && (
                            <Badge variant="outline" className="text-xs mb-2">
                              {competitor.marketShare} market share
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCompetitor(competitor)}
                            className="shrink-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCompetitor(competitor.id)}
                            className="shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{competitor.description}</p>
                      <div className="space-y-2 text-sm">
                        {competitor.pricing && (
                          <div>
                            <span className="font-medium text-gray-700">Pricing:</span>{' '}
                            <span className="text-gray-600">{competitor.pricing}</span>
                          </div>
                        )}
                        {competitor.targetMarket && (
                          <div>
                            <span className="font-medium text-gray-700">Target:</span>{' '}
                            <span className="text-gray-600">{competitor.targetMarket}</span>
                          </div>
                        )}
                        {competitor.features.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-700">Features:</span>{' '}
                            <span className="text-gray-600">{competitor.features.length} listed</span>
                          </div>
                        )}
                        {competitor.strengths.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-700">Strengths:</span>{' '}
                            <span className="text-gray-600">{competitor.strengths.length} identified</span>
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

        {/* Edit Competitor Modal */}
        {editingCompetitor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
                <h3 className="text-lg font-bold">Competitor Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingCompetitor(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <Input
                    value={editingCompetitor.name}
                    onChange={(e) => setEditingCompetitor({ ...editingCompetitor, name: e.target.value })}
                    placeholder="Competitor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <Input
                    type="url"
                    value={editingCompetitor.website || ''}
                    onChange={(e) => setEditingCompetitor({ ...editingCompetitor, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingCompetitor.description}
                    onChange={(e) => setEditingCompetitor({ ...editingCompetitor, description: e.target.value })}
                    placeholder="Brief description of the competitor..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Market Share</label>
                    <Input
                      value={editingCompetitor.marketShare}
                      onChange={(e) => setEditingCompetitor({ ...editingCompetitor, marketShare: e.target.value })}
                      placeholder="e.g., 25%, Large, Medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
                    <Input
                      value={editingCompetitor.pricing}
                      onChange={(e) => setEditingCompetitor({ ...editingCompetitor, pricing: e.target.value })}
                      placeholder="e.g., $99/month, $999/year"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Model</label>
                    <Select
                      value={editingCompetitor.pricingModel}
                      onChange={(e) => setEditingCompetitor({ ...editingCompetitor, pricingModel: e.target.value as any })}
                      options={[
                        { value: 'subscription', label: 'Subscription' },
                        { value: 'one-time', label: 'One-Time' },
                        { value: 'freemium', label: 'Freemium' },
                        { value: 'usage-based', label: 'Usage-Based' },
                        { value: 'other', label: 'Other' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Market</label>
                    <Input
                      value={editingCompetitor.targetMarket}
                      onChange={(e) => setEditingCompetitor({ ...editingCompetitor, targetMarket: e.target.value })}
                      placeholder="e.g., Enterprise, SMB, Consumer"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Funding</label>
                    <Input
                      value={editingCompetitor.funding || ''}
                      onChange={(e) => setEditingCompetitor({ ...editingCompetitor, funding: e.target.value })}
                      placeholder="e.g., $10M Series A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employees</label>
                    <Input
                      value={editingCompetitor.employees || ''}
                      onChange={(e) => setEditingCompetitor({ ...editingCompetitor, employees: e.target.value })}
                      placeholder="e.g., 50-100"
                    />
                      </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Founded</label>
                    <Input
                      value={editingCompetitor.founded || ''}
                      onChange={(e) => setEditingCompetitor({ ...editingCompetitor, founded: e.target.value })}
                      placeholder="e.g., 2020"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input
                    value={editingCompetitor.location || ''}
                    onChange={(e) => setEditingCompetitor({ ...editingCompetitor, location: e.target.value })}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={4}
                    value={editingCompetitor.features.join('\n')}
                    onChange={(e) => setEditingCompetitor({ 
                      ...editingCompetitor, 
                      features: e.target.value.split('\n').filter(f => f.trim())
                    })}
                    placeholder="Feature 1&#10;Feature 2&#10;..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Strengths (one per line)</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingCompetitor.strengths.join('\n')}
                    onChange={(e) => setEditingCompetitor({ 
                      ...editingCompetitor, 
                      strengths: e.target.value.split('\n').filter(s => s.trim())
                    })}
                    placeholder="Strength 1&#10;Strength 2&#10;..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weaknesses (one per line)</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingCompetitor.weaknesses.join('\n')}
                    onChange={(e) => setEditingCompetitor({ 
                      ...editingCompetitor, 
                      weaknesses: e.target.value.split('\n').filter(w => w.trim())
                    })}
                    placeholder="Weakness 1&#10;Weakness 2&#10;..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={editingCompetitor.notes}
                    onChange={(e) => setEditingCompetitor({ ...editingCompetitor, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t sticky bottom-0 bg-white mt-4">
                <Button onClick={saveCompetitor} className="flex-1 min-w-[120px]">
                  <Save className="h-4 w-4 mr-2" />
                  Save Competitor
                </Button>
                <Button variant="outline" onClick={() => setEditingCompetitor(null)} className="shrink-0">
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Feature Comparison Tab */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Feature Comparison Matrix</h2>
              </div>

              {competitors.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Competitors Yet</h3>
                  <p className="text-gray-600 mb-6">Add competitors to compare features</p>
                  <Button onClick={addCompetitor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Competitor
                  </Button>
                </div>
              ) : getAllFeatures().length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Features Listed</h3>
                  <p className="text-gray-600">Add features to competitors to see comparison</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 font-semibold text-gray-700 sticky left-0 bg-white z-10 min-w-[200px]">
                          Feature
                        </th>
                        {competitors.map((competitor) => (
                          <th key={competitor.id} className="text-center p-3 font-semibold text-gray-700 min-w-[150px]">
                            {competitor.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getAllFeatures().map((feature, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-medium text-gray-900 sticky left-0 bg-white z-10">
                            {feature}
                          </td>
                          {competitors.map((competitor) => (
                            <td key={competitor.id} className="p-3 text-center">
                              {hasFeature(competitor.id, feature) ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {competitors.length > 0 && getAllFeatures().length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Feature Summary</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {competitors.map((competitor) => {
                      const totalFeatures = getAllFeatures().length
                      const hasFeatures = getAllFeatures().filter(f => hasFeature(competitor.id, f)).length
                      const percentage = totalFeatures > 0 ? Math.round((hasFeatures / totalFeatures) * 100) : 0
                      return (
                        <div key={competitor.id} className="flex items-center justify-between">
                          <span className="text-gray-700">{competitor.name}:</span>
                          <span className="font-semibold text-blue-600">
                            {hasFeatures}/{totalFeatures} ({percentage}%)
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* SWOT Analysis Tab */}
        {activeTab === 'swot' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">SWOT Analysis</h2>
              </div>

              {competitors.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Competitors Yet</h3>
                  <p className="text-gray-600 mb-6">Add competitors to perform SWOT analysis</p>
                  <Button onClick={addCompetitor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Competitor
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {competitors.map((competitor) => (
                    <Card key={competitor.id} className="p-6">
                      <h3 className="text-xl font-bold mb-4">{competitor.name}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Strengths
                            </h4>
                            {competitor.strengths.length > 0 ? (
                              <ul className="space-y-1">
                                {competitor.strengths.map((strength, idx) => (
                                  <li key={idx} className="text-sm text-green-700">• {strength}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-green-600 italic">No strengths listed</p>
                            )}
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                              <XCircle className="h-4 w-4" />
                              Weaknesses
                            </h4>
                            {competitor.weaknesses.length > 0 ? (
                              <ul className="space-y-1">
                                {competitor.weaknesses.map((weakness, idx) => (
                                  <li key={idx} className="text-sm text-red-700">• {weakness}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-red-600 italic">No weaknesses listed</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Opportunities
                            </h4>
                            <p className="text-sm text-blue-600 italic">Edit competitor to add opportunities</p>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                            <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Threats
                            </h4>
                            <p className="text-sm text-orange-600 italic">Edit competitor to add threats</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingCompetitor(competitor)}
                          className="w-full"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit SWOT
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Pricing Analysis Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Pricing Analysis</h2>
              </div>

              {competitors.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Competitors Yet</h3>
                  <p className="text-gray-600 mb-6">Add competitors to analyze pricing</p>
                  <Button onClick={addCompetitor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Competitor
                  </Button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left p-3 font-semibold text-gray-700">Competitor</th>
                          <th className="text-left p-3 font-semibold text-gray-700">Pricing</th>
                          <th className="text-left p-3 font-semibold text-gray-700">Model</th>
                          <th className="text-left p-3 font-semibold text-gray-700">Target Market</th>
                          <th className="text-left p-3 font-semibold text-gray-700">Market Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {competitors.map((competitor) => (
                          <tr key={competitor.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-900">{competitor.name}</td>
                            <td className="p-3 text-gray-700">{competitor.pricing || 'N/A'}</td>
                            <td className="p-3">
                              <Badge variant="outline" className="text-xs">
                                {competitor.pricingModel}
                              </Badge>
                            </td>
                            <td className="p-3 text-gray-600">{competitor.targetMarket || 'N/A'}</td>
                            <td className="p-3 text-gray-600">{competitor.marketShare || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-blue-50">
                      <div className="text-sm text-gray-600 mb-1">Pricing Models</div>
                      <div className="space-y-2 mt-2">
                        {['subscription', 'one-time', 'freemium', 'usage-based', 'other'].map((model) => {
                          const count = competitors.filter(c => c.pricingModel === model).length
                          if (count === 0) return null
                          return (
                            <div key={model} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700 capitalize">{model.replace('-', ' ')}</span>
                              <span className="font-semibold text-blue-600">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </Card>

                    <Card className="p-4 bg-green-50">
                      <div className="text-sm text-gray-600 mb-1">Target Markets</div>
                      <div className="space-y-2 mt-2">
                        {Array.from(new Set(competitors.map(c => c.targetMarket).filter(Boolean))).map((market) => {
                          const count = competitors.filter(c => c.targetMarket === market).length
                          return (
                            <div key={market} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">{market}</span>
                              <span className="font-semibold text-green-600">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </Card>

                    <Card className="p-4 bg-purple-50">
                      <div className="text-sm text-gray-600 mb-1">Market Share Distribution</div>
                      <div className="space-y-2 mt-2">
                        {competitors.filter(c => c.marketShare).map((competitor) => (
                          <div key={competitor.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 truncate">{competitor.name}</span>
                            <span className="font-semibold text-purple-600">{competitor.marketShare}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </Card>
          </div>
        )}

        {/* Market Positioning Tab */}
        {activeTab === 'positioning' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Market Positioning</h2>
              </div>

              {competitors.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Competitors Yet</h3>
                  <p className="text-gray-600 mb-6">Add competitors to view market positioning</p>
                  <Button onClick={addCompetitor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Competitor
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-4">Market Share Comparison</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={competitors
                          .filter(c => c.marketShare)
                          .map(c => ({
                            name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
                            fullName: c.name,
                            share: parseFloat(c.marketShare.replace('%', '')) || 0
                          }))
                          .sort((a, b) => b.share - a.share)
                        }>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="share" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-4">Pricing Model Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                          { name: 'Subscription', value: competitors.filter(c => c.pricingModel === 'subscription').length },
                          { name: 'One-Time', value: competitors.filter(c => c.pricingModel === 'one-time').length },
                          { name: 'Freemium', value: competitors.filter(c => c.pricingModel === 'freemium').length },
                          { name: 'Usage-Based', value: competitors.filter(c => c.pricingModel === 'usage-based').length },
                          { name: 'Other', value: competitors.filter(c => c.pricingModel === 'other').length },
                        ].filter(item => item.value > 0)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>

                  <Card>
                    <h3 className="font-semibold mb-4">Competitive Landscape</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {competitors.map((competitor) => (
                        <div key={competitor.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
                          <h4 className="font-semibold mb-2">{competitor.name}</h4>
                          <div className="space-y-2 text-sm">
                            {competitor.marketShare && (
                              <div>
                                <span className="text-gray-600">Market Share: </span>
                                <span className="font-medium">{competitor.marketShare}</span>
                              </div>
                            )}
                            {competitor.pricing && (
                              <div>
                                <span className="text-gray-600">Pricing: </span>
                                <span className="font-medium">{competitor.pricing}</span>
                              </div>
                            )}
                            {competitor.targetMarket && (
                              <div>
                                <span className="text-gray-600">Target: </span>
                                <span className="font-medium">{competitor.targetMarket}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-600">Features: </span>
                              <span className="font-medium">{competitor.features.length}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Strengths: </span>
                              <span className="font-medium">{competitor.strengths.length}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Weaknesses: </span>
                              <span className="font-medium">{competitor.weaknesses.length}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </Card>
          </div>
        )}

        {/* Competitive Advantages & Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Activity className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Competitive Advantages & Insights</h2>
        </div>

              {competitors.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Competitors Yet</h3>
                  <p className="text-gray-600 mb-6">Add competitors to generate insights</p>
                  <Button onClick={addCompetitor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Competitor
          </Button>
        </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="p-6 bg-green-50 border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-bold text-green-900">Market Opportunities</h3>
                      </div>
                      <ul className="space-y-2">
                        {competitors.length > 0 && (
                          <li className="text-sm text-green-800">
                            • {competitors.length} competitor{competitors.length !== 1 ? 's' : ''} identified in your market
                          </li>
                        )}
                        {competitors.filter(c => c.weaknesses.length > 0).length > 0 && (
                          <li className="text-sm text-green-800">
                            • {competitors.filter(c => c.weaknesses.length > 0).length} competitor{competitors.filter(c => c.weaknesses.length > 0).length !== 1 ? 's' : ''} have identified weaknesses you can exploit
                          </li>
                        )}
                        {competitors.filter(c => c.pricingModel === 'subscription').length > 0 && (
                          <li className="text-sm text-green-800">
                            • Consider alternative pricing models - {competitors.filter(c => c.pricingModel === 'subscription').length} use subscription model
                          </li>
                        )}
                        {getAllFeatures().length > 0 && (
                          <li className="text-sm text-green-800">
                            • {getAllFeatures().length} unique features identified across competitors - opportunity to differentiate
                          </li>
                        )}
                      </ul>
                    </Card>

                    <Card className="p-6 bg-blue-50 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="h-5 w-5 text-blue-600" />
                        <h3 className="font-bold text-blue-900">Competitive Gaps</h3>
                      </div>
                      <ul className="space-y-2">
                        {competitors.filter(c => !c.pricing || c.pricing === '').length > 0 && (
                          <li className="text-sm text-blue-800">
                            • {competitors.filter(c => !c.pricing || c.pricing === '').length} competitor{competitors.filter(c => !c.pricing || c.pricing === '').length !== 1 ? 's' : ''} missing pricing information
                          </li>
                        )}
                        {competitors.filter(c => c.features.length === 0).length > 0 && (
                          <li className="text-sm text-blue-800">
                            • {competitors.filter(c => c.features.length === 0).length} competitor{competitors.filter(c => c.features.length === 0).length !== 1 ? 's' : ''} have no features listed - research opportunity
                          </li>
                        )}
                        {competitors.filter(c => c.strengths.length === 0 && c.weaknesses.length === 0).length > 0 && (
                          <li className="text-sm text-blue-800">
                            • {competitors.filter(c => c.strengths.length === 0 && c.weaknesses.length === 0).length} competitor{competitors.filter(c => c.strengths.length === 0 && c.weaknesses.length === 0).length !== 1 ? 's' : ''} need SWOT analysis
                          </li>
                        )}
                        {competitors.filter(c => !c.targetMarket || c.targetMarket === '').length > 0 && (
                          <li className="text-sm text-blue-800">
                            • {competitors.filter(c => !c.targetMarket || c.targetMarket === '').length} competitor{competitors.filter(c => !c.targetMarket || c.targetMarket === '').length !== 1 ? 's' : ''} missing target market information
                          </li>
                        )}
                      </ul>
                    </Card>
                  </div>

                  <Card>
                    <h3 className="font-semibold mb-4">Key Insights</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Feature Coverage</h4>
                        <p className="text-sm text-gray-600">
                          Across all competitors, {getAllFeatures().length} unique features have been identified. 
                          The average competitor has {competitors.length > 0 ? Math.round(competitors.reduce((sum, c) => sum + c.features.length, 0) / competitors.length) : 0} features listed.
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Market Positioning</h4>
                        <p className="text-sm text-gray-600">
                          {competitors.filter(c => c.marketShare).length > 0 
                            ? `${competitors.filter(c => c.marketShare).length} competitors have market share data. ` 
                            : 'No market share data available. '}
                          {competitors.filter(c => c.pricing).length > 0 
                            ? `${competitors.filter(c => c.pricing).length} competitors have pricing information listed.`
                            : 'No pricing information available.'}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Competitive Analysis Completeness</h4>
                        <div className="space-y-2 mt-2">
                          {competitors.map((competitor) => {
                            const completeness = [
                              competitor.name ? 1 : 0,
                              competitor.description ? 1 : 0,
                              competitor.pricing ? 1 : 0,
                              competitor.marketShare ? 1 : 0,
                              competitor.features.length > 0 ? 1 : 0,
                              competitor.strengths.length > 0 ? 1 : 0,
                              competitor.weaknesses.length > 0 ? 1 : 0,
                            ].reduce((a, b) => a + b, 0)
                            const percentage = Math.round((completeness / 7) * 100)
                            return (
                              <div key={competitor.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{competitor.name}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        percentage >= 80 ? 'bg-green-500' :
                                        percentage >= 60 ? 'bg-blue-500' :
                                        percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="font-medium w-12 text-right">{percentage}%</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                          <h4 className="font-semibold text-yellow-900">Recommended Actions</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-yellow-800">
                          {competitors.filter(c => c.features.length === 0).length > 0 && (
                            <li>• Research and add features for {competitors.filter(c => c.features.length === 0).length} competitor{competitors.filter(c => c.features.length === 0).length !== 1 ? 's' : ''}</li>
                          )}
                          {competitors.filter(c => !c.pricing).length > 0 && (
                            <li>• Gather pricing information for {competitors.filter(c => !c.pricing).length} competitor{competitors.filter(c => !c.pricing).length !== 1 ? 's' : ''}</li>
                          )}
                          {competitors.filter(c => c.strengths.length === 0 && c.weaknesses.length === 0).length > 0 && (
                            <li>• Complete SWOT analysis for {competitors.filter(c => c.strengths.length === 0 && c.weaknesses.length === 0).length} competitor{competitors.filter(c => c.strengths.length === 0 && c.weaknesses.length === 0).length !== 1 ? 's' : ''}</li>
                          )}
                          <li>• Identify unique features that differentiate your product</li>
                          <li>• Analyze pricing gaps and opportunities</li>
                          <li>• Monitor competitor weaknesses for market entry opportunities</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
