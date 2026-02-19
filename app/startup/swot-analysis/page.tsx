'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  BarChart, 
  Plus, 
  Save, 
  Download,
  Share2,
  Edit,
  Trash2,
  X,
  Sparkles,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
  History,
  Lightbulb,
  Printer,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface SWOTItem {
  id: string
  text: string
  priority: 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  category?: string
}

interface ActionItem {
  id: string
  title: string
  description: string
  category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats'
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'completed'
  dueDate?: string
}

interface SWOTAnalysis {
  id: string
  name: string
  strengths: SWOTItem[]
  weaknesses: SWOTItem[]
  opportunities: SWOTItem[]
  threats: SWOTItem[]
  createdAt: string
  updatedAt: string
}

export default function SWOTAnalysisPage() {
  const [activeTab, setActiveTab] = useState('analysis')
  const [editingItem, setEditingItem] = useState<{item: SWOTItem, category: string} | null>(null)
  const [strengths, setStrengths] = useState<SWOTItem[]>([])
  const [weaknesses, setWeaknesses] = useState<SWOTItem[]>([])
  const [opportunities, setOpportunities] = useState<SWOTItem[]>([])
  const [threats, setThreats] = useState<SWOTItem[]>([])
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [editingAction, setEditingAction] = useState<ActionItem | null>(null)
  const [analyses, setAnalyses] = useState<SWOTAnalysis[]>([])
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null)
  const [analysisName, setAnalysisName] = useState('My SWOT Analysis')

  const tabs = [
    { id: 'analysis', label: 'SWOT Analysis', icon: BarChart },
    { id: 'actions', label: 'Action Items', icon: Target },
    { id: 'strategies', label: 'Strategies', icon: Lightbulb },
    { id: 'history', label: 'History', icon: History },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swotAnalysisData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.strengths) setStrengths(data.strengths)
          if (data.weaknesses) setWeaknesses(data.weaknesses)
          if (data.opportunities) setOpportunities(data.opportunities)
          if (data.threats) setThreats(data.threats)
          if (data.actionItems) setActionItems(data.actionItems)
          if (data.analyses) setAnalyses(data.analyses)
          if (data.analysisName) setAnalysisName(data.analysisName)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        strengths,
        weaknesses,
        opportunities,
        threats,
        actionItems,
        analyses,
        analysisName,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('swotAnalysisData', JSON.stringify(data))
      showToast('Analysis saved!', 'success')
    }
  }

  const addItem = (category: string) => {
    const newItem: SWOTItem = {
      id: Date.now().toString(),
      text: '',
      priority: 'medium',
      impact: 'medium'
    }
    setEditingItem({ item: newItem, category })
  }

  const saveItem = () => {
    if (!editingItem) return
    if (!editingItem.item.text.trim()) {
      showToast('Please enter item text', 'error')
      return
    }

    const updatedItem = editingItem.item
    switch (editingItem.category) {
      case 'strengths':
        setStrengths(strengths.find(s => s.id === updatedItem.id) 
          ? strengths.map(s => s.id === updatedItem.id ? updatedItem : s)
          : [...strengths, updatedItem])
        break
      case 'weaknesses':
        setWeaknesses(weaknesses.find(w => w.id === updatedItem.id)
          ? weaknesses.map(w => w.id === updatedItem.id ? updatedItem : w)
          : [...weaknesses, updatedItem])
        break
      case 'opportunities':
        setOpportunities(opportunities.find(o => o.id === updatedItem.id)
          ? opportunities.map(o => o.id === updatedItem.id ? updatedItem : o)
          : [...opportunities, updatedItem])
        break
      case 'threats':
        setThreats(threats.find(t => t.id === updatedItem.id)
          ? threats.map(t => t.id === updatedItem.id ? updatedItem : t)
          : [...threats, updatedItem])
        break
    }
    setEditingItem(null)
    saveToLocalStorage()
  }

  const deleteItem = (id: string, category: string) => {
    switch (category) {
      case 'strengths':
        setStrengths(strengths.filter(s => s.id !== id))
        break
      case 'weaknesses':
        setWeaknesses(weaknesses.filter(w => w.id !== id))
        break
      case 'opportunities':
        setOpportunities(opportunities.filter(o => o.id !== id))
        break
      case 'threats':
        setThreats(threats.filter(t => t.id !== id))
        break
    }
    saveToLocalStorage()
  }

  const addActionItem = () => {
    const newAction: ActionItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      category: 'strengths',
      priority: 'medium',
      status: 'todo'
    }
    setEditingAction(newAction)
  }

  const saveActionItem = () => {
    if (!editingAction) return
    if (!editingAction.title.trim()) {
      showToast('Please enter action title', 'error')
      return
    }

    const updated = actionItems.find(a => a.id === editingAction.id)
      ? actionItems.map(a => a.id === editingAction.id ? editingAction : a)
      : [...actionItems, editingAction]
    setActionItems(updated)
    setEditingAction(null)
    saveToLocalStorage()
  }

  const deleteActionItem = (id: string) => {
    setActionItems(actionItems.filter(a => a.id !== id))
    saveToLocalStorage()
  }

  const saveAnalysis = () => {
    const analysis: SWOTAnalysis = {
      id: selectedAnalysis || Date.now().toString(),
      name: analysisName,
      strengths,
      weaknesses,
      opportunities,
      threats,
      createdAt: selectedAnalysis ? analyses.find(a => a.id === selectedAnalysis)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updated = analyses.find(a => a.id === analysis.id)
      ? analyses.map(a => a.id === analysis.id ? analysis : a)
      : [...analyses, analysis]
    setAnalyses(updated)
    setSelectedAnalysis(analysis.id)
    saveToLocalStorage()
    showToast('Analysis saved to history!', 'success')
  }

  const loadAnalysis = (id: string) => {
    const analysis = analyses.find(a => a.id === id)
    if (analysis) {
      setStrengths(analysis.strengths)
      setWeaknesses(analysis.weaknesses)
      setOpportunities(analysis.opportunities)
      setThreats(analysis.threats)
      setAnalysisName(analysis.name)
      setSelectedAnalysis(id)
      showToast('Analysis loaded!', 'success')
    }
  }

  const exportData = () => {
    const data = {
      analysisName,
      strengths,
      weaknesses,
      opportunities,
      threats,
      actionItems,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `swot-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Analysis exported!', 'success')
  }

  const exportPDF = () => {
    window.print()
    showToast('Opening print dialog...', 'info')
  }

  const resetAnalysis = () => {
    if (confirm('Are you sure you want to reset? This will clear all current data.')) {
      setStrengths([])
      setWeaknesses([])
      setOpportunities([])
      setThreats([])
      setActionItems([])
      setAnalysisName('My SWOT Analysis')
      saveToLocalStorage()
      showToast('Analysis reset', 'success')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const generateStrategies = () => {
    const strategies = []
    
    // SO Strategies (Strengths + Opportunities)
    strengths.forEach(s => {
      opportunities.forEach(o => {
        if (s.priority === 'high' && o.priority === 'high') {
          strategies.push({
            type: 'SO',
            title: `Leverage ${s.text} to capitalize on ${o.text}`,
            description: `Use your strength in ${s.text} to take advantage of the opportunity: ${o.text}`
          })
        }
      })
    })

    // ST Strategies (Strengths + Threats)
    strengths.forEach(s => {
      threats.forEach(t => {
        if (s.priority === 'high' && t.priority === 'high') {
          strategies.push({
            type: 'ST',
            title: `Use ${s.text} to counter ${t.text}`,
            description: `Leverage your strength in ${s.text} to mitigate the threat: ${t.text}`
          })
        }
      })
    })

    // WO Strategies (Weaknesses + Opportunities)
    weaknesses.forEach(w => {
      opportunities.forEach(o => {
        if (w.priority === 'high' && o.priority === 'high') {
          strategies.push({
            type: 'WO',
            title: `Address ${w.text} to pursue ${o.text}`,
            description: `Overcome your weakness in ${w.text} to take advantage of: ${o.text}`
          })
        }
      })
    })

    // WT Strategies (Weaknesses + Threats)
    weaknesses.forEach(w => {
      threats.forEach(t => {
        if (w.priority === 'high' && t.priority === 'high') {
          strategies.push({
            type: 'WT',
            title: `Defend against ${t.text} by addressing ${w.text}`,
            description: `Minimize your weakness in ${w.text} to defend against the threat: ${t.text}`
          })
        }
      })
    })

    return strategies
  }

  const strategies = generateStrategies()

  const chartData = [
    { name: 'Strengths', value: strengths.length, color: '#10b981' },
    { name: 'Weaknesses', value: weaknesses.length, color: '#ef4444' },
    { name: 'Opportunities', value: opportunities.length, color: '#3b82f6' },
    { name: 'Threats', value: threats.length, color: '#f59e0b' },
  ]

  const priorityData = [
    { name: 'High', strengths: strengths.filter(s => s.priority === 'high').length, weaknesses: weaknesses.filter(w => w.priority === 'high').length, opportunities: opportunities.filter(o => o.priority === 'high').length, threats: threats.filter(t => t.priority === 'high').length },
    { name: 'Medium', strengths: strengths.filter(s => s.priority === 'medium').length, weaknesses: weaknesses.filter(w => w.priority === 'medium').length, opportunities: opportunities.filter(o => o.priority === 'medium').length, threats: threats.filter(t => t.priority === 'medium').length },
    { name: 'Low', strengths: strengths.filter(s => s.priority === 'low').length, weaknesses: weaknesses.filter(w => w.priority === 'low').length, opportunities: opportunities.filter(o => o.priority === 'low').length, threats: threats.filter(t => t.priority === 'low').length },
  ]

  const renderSWOTCard = (title: string, items: SWOTItem[], category: string, bgColor: string, borderColor: string, textColor: string) => {
    return (
      <Card className={`${bgColor} border-2 ${borderColor}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-lg ${textColor}`}>{title}</h3>
          <Button variant="ghost" size="sm" onClick={() => addItem(category)} className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No items yet. Click + to add.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className={`p-3 bg-white rounded-lg border ${borderColor} hover:shadow-md transition-all`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{item.text}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(item.priority)}`}>
                        Priority: {item.priority}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getImpactColor(item.impact)}`}>
                        Impact: {item.impact}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingItem({ item, category })}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id, category)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            SWOT Analysis Tool
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze your startup's strengths, weaknesses, opportunities, and threats with comprehensive tools
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Input
                value={analysisName}
                onChange={(e) => setAnalysisName(e.target.value)}
                placeholder="Analysis name..."
                className="max-w-xs"
              />
              <Button variant="outline" size="sm" onClick={saveToLocalStorage} className="shrink-0">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={saveAnalysis} className="shrink-0">
                <History className="h-4 w-4 mr-2" />
                Save to History
              </Button>
              <Button variant="outline" size="sm" onClick={exportData} className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={exportPDF} className="shrink-0">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={resetAnalysis} className="shrink-0">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
                </div>

        {/* SWOT Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderSWOTCard('Strengths', strengths, 'strengths', 'bg-emerald-50/50', 'border-emerald-300', 'text-emerald-800')}
              {renderSWOTCard('Weaknesses', weaknesses, 'weaknesses', 'bg-rose-50/50', 'border-rose-300', 'text-rose-800')}
              {renderSWOTCard('Opportunities', opportunities, 'opportunities', 'bg-blue-50/50', 'border-blue-300', 'text-blue-800')}
              {renderSWOTCard('Threats', threats, 'threats', 'bg-amber-50/50', 'border-amber-300', 'text-amber-800')}
            </div>

            {/* Statistics */}
            {(strengths.length > 0 || weaknesses.length > 0 || opportunities.length > 0 || threats.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="font-semibold mb-4">SWOT Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
          </Card>

                <Card>
                  <h3 className="font-semibold mb-4">Priority Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={priorityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="strengths" stackId="a" fill="#10b981" />
                      <Bar dataKey="weaknesses" stackId="a" fill="#ef4444" />
                      <Bar dataKey="opportunities" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="threats" stackId="a" fill="#f59e0b" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Action Items Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Action Items</h2>
                </div>
                <Button onClick={addActionItem} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Action
              </Button>
            </div>

              {actionItems.length === 0 && !editingAction ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>No action items yet. Create actions based on your SWOT analysis.</p>
                </div>
              ) : (
                <>
                  {actionItems.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {actionItems.map((action) => (
                        <Card key={action.id} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{action.title}</h4>
                                <Badge variant={action.status === 'completed' ? 'beginner' : action.status === 'in-progress' ? 'outline' : 'featured'}>
                                  {action.status}
                                </Badge>
                                <Badge variant="outline" className={getPriorityColor(action.priority)}>
                                  {action.priority} priority
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Category: {action.category}</span>
                                {action.dueDate && <span>Due: {action.dueDate}</span>}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingAction(action)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteActionItem(action.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
              ))}
            </div>
                  )}

                  {editingAction && (
                    <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {editingAction.id && actionItems.find(a => a.id === editingAction.id) ? 'Edit Action' : 'New Action'}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingAction(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                          <Input
                            value={editingAction.title}
                            onChange={(e) => setEditingAction({ ...editingAction, title: e.target.value })}
                            placeholder="Action item title..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                            rows={3}
                            value={editingAction.description}
                            onChange={(e) => setEditingAction({ ...editingAction, description: e.target.value })}
                            placeholder="Action description..."
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <Select
                              value={editingAction.category}
                              onChange={(e) => setEditingAction({ ...editingAction, category: e.target.value as any })}
                              options={[
                                { value: 'strengths', label: 'Strengths' },
                                { value: 'weaknesses', label: 'Weaknesses' },
                                { value: 'opportunities', label: 'Opportunities' },
                                { value: 'threats', label: 'Threats' }
                              ]}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <Select
                              value={editingAction.priority}
                              onChange={(e) => setEditingAction({ ...editingAction, priority: e.target.value as any })}
                              options={[
                                { value: 'high', label: 'High' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'low', label: 'Low' }
                              ]}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <Select
                              value={editingAction.status}
                              onChange={(e) => setEditingAction({ ...editingAction, status: e.target.value as any })}
                              options={[
                                { value: 'todo', label: 'To Do' },
                                { value: 'in-progress', label: 'In Progress' },
                                { value: 'completed', label: 'Completed' }
                              ]}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                          <Input
                            type="date"
                            value={editingAction.dueDate || ''}
                            onChange={(e) => setEditingAction({ ...editingAction, dueDate: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveActionItem} className="flex-1">
                            Save Action
                          </Button>
                          <Button variant="outline" onClick={() => setEditingAction(null)}>
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

        {/* Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Strategic Recommendations</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Based on your SWOT analysis, here are strategic recommendations combining your strengths, weaknesses, opportunities, and threats.
              </p>

              {strategies.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Lightbulb className="h-16 w-16 mx-auto mb-4" />
                  <p>Add high-priority items to your SWOT analysis to generate strategic recommendations.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {strategies.map((strategy, idx) => (
                    <Card key={idx} className="p-4 border-l-4 border-primary-500">
                      <div className="flex items-start gap-3 mb-2">
                        <Badge variant="featured" className="shrink-0">{strategy.type}</Badge>
                        <h4 className="font-semibold flex-1">{strategy.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{strategy.description}</p>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Strategy Types</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
                  <div>
                    <strong>SO Strategies:</strong> Leverage strengths to capitalize on opportunities
                  </div>
                  <div>
                    <strong>ST Strategies:</strong> Use strengths to counter threats
                  </div>
                  <div>
                    <strong>WO Strategies:</strong> Address weaknesses to pursue opportunities
                  </div>
                  <div>
                    <strong>WT Strategies:</strong> Minimize weaknesses to defend against threats
                  </div>
                </div>
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
                <h2 className="text-2xl font-bold">Analysis History</h2>
            </div>

              {analyses.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No saved analyses yet. Save your current analysis to view it here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analyses.map((analysis) => (
                    <Card key={analysis.id} className="p-4 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between cursor-pointer" onClick={() => loadAnalysis(analysis.id)}>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{analysis.name}</h4>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                            <span>Strengths: {analysis.strengths.length}</span>
                            <span>Weaknesses: {analysis.weaknesses.length}</span>
                            <span>Opportunities: {analysis.opportunities.length}</span>
                            <span>Threats: {analysis.threats.length}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Created: {new Date(analysis.createdAt).toLocaleDateString()} | 
                            Updated: {new Date(analysis.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            loadAnalysis(analysis.id)
                          }}
                        >
                          Load
                        </Button>
                      </div>
                    </Card>
              ))}
            </div>
              )}
          </Card>
        </div>
        )}

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit {editingItem.category.charAt(0).toUpperCase() + editingItem.category.slice(1)} Item</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Text *</label>
                  <textarea
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={editingItem.item.text}
                    onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, text: e.target.value } })}
                    placeholder="Enter item description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <Select
                      value={editingItem.item.priority}
                      onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, priority: e.target.value as any } })}
                      options={[
                        { value: 'high', label: 'High' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'low', label: 'Low' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Impact</label>
                    <Select
                      value={editingItem.item.impact}
                      onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, impact: e.target.value as any } })}
                      options={[
                        { value: 'high', label: 'High' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'low', label: 'Low' }
                      ]}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveItem} className="flex-1">
                    Save Item
                  </Button>
                  <Button variant="outline" onClick={() => setEditingItem(null)}>
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
