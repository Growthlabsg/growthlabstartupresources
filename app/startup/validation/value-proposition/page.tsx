'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import SimpleTabs from '@/components/ui/SimpleTabs'
import Link from 'next/link'
import { 
  Heart, User, Zap, Target, Plus, Trash2, Download, Save, ArrowLeft,
  CheckCircle, XCircle, Sparkles, Gift, AlertTriangle, TrendingUp,
  Star, Award, ArrowRight, RefreshCw, Copy
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface CustomerJob {
  id: string
  description: string
  type: 'functional' | 'social' | 'emotional'
  importance: 'high' | 'medium' | 'low'
}

interface CustomerPain {
  id: string
  description: string
  severity: 'extreme' | 'high' | 'moderate' | 'low'
  frequency: 'always' | 'often' | 'sometimes' | 'rarely'
}

interface CustomerGain {
  id: string
  description: string
  type: 'required' | 'expected' | 'desired' | 'unexpected'
  importance: 'high' | 'medium' | 'low'
}

interface PainReliever {
  id: string
  description: string
  painId?: string
  effectiveness: 'high' | 'medium' | 'low'
}

interface GainCreator {
  id: string
  description: string
  gainId?: string
  impact: 'high' | 'medium' | 'low'
}

interface Product {
  id: string
  name: string
  description: string
  type: 'physical' | 'digital' | 'service' | 'financial'
}

interface ValuePropositionCanvas {
  id: string
  name: string
  customerSegment: string
  customerJobs: CustomerJob[]
  customerPains: CustomerPain[]
  customerGains: CustomerGain[]
  products: Product[]
  painRelievers: PainReliever[]
  gainCreators: GainCreator[]
  created: string
  modified: string
}

const jobTypes = [
  { value: 'functional', label: 'Functional', description: 'Tasks they want to complete' },
  { value: 'social', label: 'Social', description: 'How they want to be perceived' },
  { value: 'emotional', label: 'Emotional', description: 'How they want to feel' }
]

const painSeverities = [
  { value: 'extreme', label: 'Extreme', color: 'bg-red-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'moderate', label: 'Moderate', color: 'bg-yellow-500' },
  { value: 'low', label: 'Low', color: 'bg-green-500' }
]

const gainTypes = [
  { value: 'required', label: 'Required', description: 'Essential for solution to work' },
  { value: 'expected', label: 'Expected', description: 'Basic expectations' },
  { value: 'desired', label: 'Desired', description: 'Nice to have' },
  { value: 'unexpected', label: 'Unexpected', description: 'Beyond expectations' }
]

const defaultCanvas: ValuePropositionCanvas = {
  id: '',
  name: '',
  customerSegment: '',
  customerJobs: [],
  customerPains: [],
  customerGains: [],
  products: [],
  painRelievers: [],
  gainCreators: [],
  created: '',
  modified: ''
}

export default function ValuePropositionPage() {
  const [activeTab, setActiveTab] = useState('customer')
  const [canvas, setCanvas] = useState<ValuePropositionCanvas>({ ...defaultCanvas, id: Date.now().toString(), created: new Date().toISOString() })
  const [savedCanvases, setSavedCanvases] = useState<ValuePropositionCanvas[]>([])
  const [fitScore, setFitScore] = useState<number | null>(null)

  const tabs = [
    { id: 'customer', label: 'Customer Profile', icon: User },
    { id: 'value', label: 'Value Map', icon: Gift },
    { id: 'fit', label: 'Fit Analysis', icon: Target },
    { id: 'saved', label: 'Saved Canvases', icon: Save },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('valuePropositionCanvases')
    if (saved) setSavedCanvases(JSON.parse(saved))
  }, [])

  const saveCanvas = () => {
    if (!canvas.name) {
      showToast('Please enter a canvas name', 'error')
      return
    }
    const updated = canvas.modified 
      ? savedCanvases.map(c => c.id === canvas.id ? { ...canvas, modified: new Date().toISOString() } : c)
      : [...savedCanvases, { ...canvas, modified: new Date().toISOString() }]
    setSavedCanvases(updated)
    localStorage.setItem('valuePropositionCanvases', JSON.stringify(updated))
    showToast('Canvas saved!', 'success')
  }

  const loadCanvas = (c: ValuePropositionCanvas) => {
    setCanvas(c)
    setActiveTab('customer')
    showToast('Canvas loaded!', 'success')
  }

  const deleteCanvas = (id: string) => {
    const updated = savedCanvases.filter(c => c.id !== id)
    setSavedCanvases(updated)
    localStorage.setItem('valuePropositionCanvases', JSON.stringify(updated))
    showToast('Canvas deleted', 'info')
  }

  const newCanvas = () => {
    setCanvas({ ...defaultCanvas, id: Date.now().toString(), created: new Date().toISOString() })
    setFitScore(null)
  }

  // Customer Profile Functions
  const addJob = () => {
    const job: CustomerJob = { id: Date.now().toString(), description: '', type: 'functional', importance: 'medium' }
    setCanvas({ ...canvas, customerJobs: [...canvas.customerJobs, job] })
  }

  const updateJob = (id: string, updates: Partial<CustomerJob>) => {
    setCanvas({ ...canvas, customerJobs: canvas.customerJobs.map(j => j.id === id ? { ...j, ...updates } : j) })
  }

  const deleteJob = (id: string) => {
    setCanvas({ ...canvas, customerJobs: canvas.customerJobs.filter(j => j.id !== id) })
  }

  const addPain = () => {
    const pain: CustomerPain = { id: Date.now().toString(), description: '', severity: 'moderate', frequency: 'sometimes' }
    setCanvas({ ...canvas, customerPains: [...canvas.customerPains, pain] })
  }

  const updatePain = (id: string, updates: Partial<CustomerPain>) => {
    setCanvas({ ...canvas, customerPains: canvas.customerPains.map(p => p.id === id ? { ...p, ...updates } : p) })
  }

  const deletePain = (id: string) => {
    setCanvas({ ...canvas, customerPains: canvas.customerPains.filter(p => p.id !== id) })
  }

  const addGain = () => {
    const gain: CustomerGain = { id: Date.now().toString(), description: '', type: 'desired', importance: 'medium' }
    setCanvas({ ...canvas, customerGains: [...canvas.customerGains, gain] })
  }

  const updateGain = (id: string, updates: Partial<CustomerGain>) => {
    setCanvas({ ...canvas, customerGains: canvas.customerGains.map(g => g.id === id ? { ...g, ...updates } : g) })
  }

  const deleteGain = (id: string) => {
    setCanvas({ ...canvas, customerGains: canvas.customerGains.filter(g => g.id !== id) })
  }

  // Value Map Functions
  const addProduct = () => {
    const product: Product = { id: Date.now().toString(), name: '', description: '', type: 'digital' }
    setCanvas({ ...canvas, products: [...canvas.products, product] })
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setCanvas({ ...canvas, products: canvas.products.map(p => p.id === id ? { ...p, ...updates } : p) })
  }

  const deleteProduct = (id: string) => {
    setCanvas({ ...canvas, products: canvas.products.filter(p => p.id !== id) })
  }

  const addPainReliever = () => {
    const reliever: PainReliever = { id: Date.now().toString(), description: '', effectiveness: 'medium' }
    setCanvas({ ...canvas, painRelievers: [...canvas.painRelievers, reliever] })
  }

  const updatePainReliever = (id: string, updates: Partial<PainReliever>) => {
    setCanvas({ ...canvas, painRelievers: canvas.painRelievers.map(r => r.id === id ? { ...r, ...updates } : r) })
  }

  const deletePainReliever = (id: string) => {
    setCanvas({ ...canvas, painRelievers: canvas.painRelievers.filter(r => r.id !== id) })
  }

  const addGainCreator = () => {
    const creator: GainCreator = { id: Date.now().toString(), description: '', impact: 'medium' }
    setCanvas({ ...canvas, gainCreators: [...canvas.gainCreators, creator] })
  }

  const updateGainCreator = (id: string, updates: Partial<GainCreator>) => {
    setCanvas({ ...canvas, gainCreators: canvas.gainCreators.map(c => c.id === id ? { ...c, ...updates } : c) })
  }

  const deleteGainCreator = (id: string) => {
    setCanvas({ ...canvas, gainCreators: canvas.gainCreators.filter(c => c.id !== id) })
  }

  const calculateFit = () => {
    let score = 0
    let maxScore = 0

    // Check if pains are addressed
    const highPains = canvas.customerPains.filter(p => p.severity === 'extreme' || p.severity === 'high')
    const addressedHighPains = highPains.filter(p => canvas.painRelievers.some(r => r.painId === p.id || r.description.toLowerCase().includes(p.description.toLowerCase().substring(0, 10))))
    score += (addressedHighPains.length / Math.max(highPains.length, 1)) * 40
    maxScore += 40

    // Check if gains are created
    const importantGains = canvas.customerGains.filter(g => g.importance === 'high' || g.type === 'required')
    const createdGains = importantGains.filter(g => canvas.gainCreators.some(c => c.gainId === g.id || c.description.toLowerCase().includes(g.description.toLowerCase().substring(0, 10))))
    score += (createdGains.length / Math.max(importantGains.length, 1)) * 30
    maxScore += 30

    // Check completeness
    const hasJobs = canvas.customerJobs.length >= 3
    const hasPains = canvas.customerPains.length >= 3
    const hasGains = canvas.customerGains.length >= 3
    const hasProducts = canvas.products.length >= 1
    const hasRelievers = canvas.painRelievers.length >= 2
    const hasCreators = canvas.gainCreators.length >= 2

    if (hasJobs) score += 5
    if (hasPains) score += 5
    if (hasGains) score += 5
    if (hasProducts) score += 5
    if (hasRelievers) score += 5
    if (hasCreators) score += 5
    maxScore += 30

    setFitScore(Math.round((score / maxScore) * 100))
    setActiveTab('fit')
    showToast('Fit analysis complete!', 'success')
  }

  const exportCanvas = () => {
    const data = JSON.stringify(canvas, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `value-proposition-${canvas.name || 'canvas'}.json`
    a.click()
    showToast('Canvas exported!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/startup/validation" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Validation Hub
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-10 w-10 text-pink-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                Value Proposition Canvas
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Design compelling value propositions by mapping customer needs to your product benefits
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Input 
            value={canvas.name} 
            onChange={(e) => setCanvas({ ...canvas, name: e.target.value })}
            placeholder="Canvas name..."
            className="w-64"
          />
          <Input 
            value={canvas.customerSegment} 
            onChange={(e) => setCanvas({ ...canvas, customerSegment: e.target.value })}
            placeholder="Customer segment..."
            className="w-64"
          />
          <Button onClick={saveCanvas}><Save className="h-4 w-4 mr-2" /> Save</Button>
          <Button variant="outline" onClick={newCanvas}><RefreshCw className="h-4 w-4 mr-2" /> New</Button>
          <Button variant="outline" onClick={exportCanvas}><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button onClick={calculateFit}><Target className="h-4 w-4 mr-2" /> Analyze Fit</Button>
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'customer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Jobs */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" /> Customer Jobs
                </h3>
                <Button size="sm" onClick={addJob}><Plus className="h-4 w-4" /></Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">What tasks are customers trying to get done?</p>
              <div className="space-y-3">
                {canvas.customerJobs.map(job => (
                  <div key={job.id} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <Input 
                        value={job.description}
                        onChange={(e) => updateJob(job.id, { description: e.target.value })}
                        placeholder="Describe the job..."
                        className="flex-1"
                      />
                      <Button size="sm" variant="ghost" onClick={() => deleteJob(job.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={job.type}
                        onChange={(e) => updateJob(job.id, { type: e.target.value as CustomerJob['type'] })}
                        className="text-xs p-1 rounded border"
                      >
                        {jobTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <select 
                        value={job.importance}
                        onChange={(e) => updateJob(job.id, { importance: e.target.value as CustomerJob['importance'] })}
                        className="text-xs p-1 rounded border"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                ))}
                {canvas.customerJobs.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    <Zap className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Add customer jobs</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Customer Pains */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" /> Customer Pains
                </h3>
                <Button size="sm" onClick={addPain}><Plus className="h-4 w-4" /></Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">What frustrates customers about current solutions?</p>
              <div className="space-y-3">
                {canvas.customerPains.map(pain => (
                  <div key={pain.id} className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <Input 
                        value={pain.description}
                        onChange={(e) => updatePain(pain.id, { description: e.target.value })}
                        placeholder="Describe the pain..."
                        className="flex-1"
                      />
                      <Button size="sm" variant="ghost" onClick={() => deletePain(pain.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={pain.severity}
                        onChange={(e) => updatePain(pain.id, { severity: e.target.value as CustomerPain['severity'] })}
                        className="text-xs p-1 rounded border"
                      >
                        {painSeverities.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      <select 
                        value={pain.frequency}
                        onChange={(e) => updatePain(pain.id, { frequency: e.target.value as CustomerPain['frequency'] })}
                        className="text-xs p-1 rounded border"
                      >
                        <option value="always">Always</option>
                        <option value="often">Often</option>
                        <option value="sometimes">Sometimes</option>
                        <option value="rarely">Rarely</option>
                      </select>
                    </div>
                  </div>
                ))}
                {canvas.customerPains.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Add customer pains</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Customer Gains */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" /> Customer Gains
                </h3>
                <Button size="sm" onClick={addGain}><Plus className="h-4 w-4" /></Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">What outcomes do customers want to achieve?</p>
              <div className="space-y-3">
                {canvas.customerGains.map(gain => (
                  <div key={gain.id} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <Input 
                        value={gain.description}
                        onChange={(e) => updateGain(gain.id, { description: e.target.value })}
                        placeholder="Describe the gain..."
                        className="flex-1"
                      />
                      <Button size="sm" variant="ghost" onClick={() => deleteGain(gain.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={gain.type}
                        onChange={(e) => updateGain(gain.id, { type: e.target.value as CustomerGain['type'] })}
                        className="text-xs p-1 rounded border"
                      >
                        {gainTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <select 
                        value={gain.importance}
                        onChange={(e) => updateGain(gain.id, { importance: e.target.value as CustomerGain['importance'] })}
                        className="text-xs p-1 rounded border"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                ))}
                {canvas.customerGains.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Add customer gains</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'value' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products & Services */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-500" /> Products & Services
                </h3>
                <Button size="sm" onClick={addProduct}><Plus className="h-4 w-4" /></Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">What are you offering?</p>
              <div className="space-y-3">
                {canvas.products.map(product => (
                  <div key={product.id} className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <Input 
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                        placeholder="Product name..."
                        className="flex-1"
                      />
                      <Button size="sm" variant="ghost" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input 
                      value={product.description}
                      onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                      placeholder="Description..."
                      className="mb-2"
                    />
                    <select 
                      value={product.type}
                      onChange={(e) => updateProduct(product.id, { type: e.target.value as Product['type'] })}
                      className="text-xs p-1 rounded border w-full"
                    >
                      <option value="physical">Physical</option>
                      <option value="digital">Digital</option>
                      <option value="service">Service</option>
                      <option value="financial">Financial</option>
                    </select>
                  </div>
                ))}
                {canvas.products.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    <Gift className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Add products or services</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Pain Relievers */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-500" /> Pain Relievers
                </h3>
                <Button size="sm" onClick={addPainReliever}><Plus className="h-4 w-4" /></Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">How do you relieve customer pains?</p>
              <div className="space-y-3">
                {canvas.painRelievers.map(reliever => (
                  <div key={reliever.id} className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <Input 
                        value={reliever.description}
                        onChange={(e) => updatePainReliever(reliever.id, { description: e.target.value })}
                        placeholder="How do you relieve this pain..."
                        className="flex-1"
                      />
                      <Button size="sm" variant="ghost" onClick={() => deletePainReliever(reliever.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={reliever.painId || ''}
                        onChange={(e) => updatePainReliever(reliever.id, { painId: e.target.value || undefined })}
                        className="text-xs p-1 rounded border flex-1"
                      >
                        <option value="">Link to pain...</option>
                        {canvas.customerPains.map(p => (
                          <option key={p.id} value={p.id}>{p.description.substring(0, 30)}...</option>
                        ))}
                      </select>
                      <select 
                        value={reliever.effectiveness}
                        onChange={(e) => updatePainReliever(reliever.id, { effectiveness: e.target.value as PainReliever['effectiveness'] })}
                        className="text-xs p-1 rounded border"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                ))}
                {canvas.painRelievers.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Add pain relievers</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Gain Creators */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" /> Gain Creators
                </h3>
                <Button size="sm" onClick={addGainCreator}><Plus className="h-4 w-4" /></Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">How do you create customer gains?</p>
              <div className="space-y-3">
                {canvas.gainCreators.map(creator => (
                  <div key={creator.id} className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <Input 
                        value={creator.description}
                        onChange={(e) => updateGainCreator(creator.id, { description: e.target.value })}
                        placeholder="How do you create this gain..."
                        className="flex-1"
                      />
                      <Button size="sm" variant="ghost" onClick={() => deleteGainCreator(creator.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        value={creator.gainId || ''}
                        onChange={(e) => updateGainCreator(creator.id, { gainId: e.target.value || undefined })}
                        className="text-xs p-1 rounded border flex-1"
                      >
                        <option value="">Link to gain...</option>
                        {canvas.customerGains.map(g => (
                          <option key={g.id} value={g.id}>{g.description.substring(0, 30)}...</option>
                        ))}
                      </select>
                      <select 
                        value={creator.impact}
                        onChange={(e) => updateGainCreator(creator.id, { impact: e.target.value as GainCreator['impact'] })}
                        className="text-xs p-1 rounded border"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                ))}
                {canvas.gainCreators.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    <Star className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Add gain creators</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'fit' && (
          <div className="space-y-6">
            <Card className="text-center">
              <h2 className="text-2xl font-bold mb-4">Value Proposition Fit Score</h2>
              {fitScore !== null ? (
                <>
                  <div className={`text-6xl font-bold mb-4 ${fitScore >= 70 ? 'text-green-600' : fitScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {fitScore}%
                  </div>
                  <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className={`h-4 rounded-full transition-all ${fitScore >= 70 ? 'bg-green-500' : fitScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${fitScore}%` }}
                    />
                  </div>
                  <p className="text-gray-600 mb-6">
                    {fitScore >= 70 
                      ? 'Strong fit! Your value proposition addresses key customer needs.'
                      : fitScore >= 40 
                      ? 'Moderate fit. Consider strengthening your pain relievers and gain creators.'
                      : 'Weak fit. Focus on better understanding customer pains and gains.'}
                  </p>
                </>
              ) : (
                <div className="py-8 text-gray-400">
                  <Target className="h-16 w-16 mx-auto mb-4" />
                  <p>Complete your canvas and click "Analyze Fit" to see your score</p>
                </div>
              )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-bold mb-4">Canvas Completeness</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Customer Jobs', count: canvas.customerJobs.length, min: 3 },
                    { name: 'Customer Pains', count: canvas.customerPains.length, min: 3 },
                    { name: 'Customer Gains', count: canvas.customerGains.length, min: 3 },
                    { name: 'Products/Services', count: canvas.products.length, min: 1 },
                    { name: 'Pain Relievers', count: canvas.painRelievers.length, min: 2 },
                    { name: 'Gain Creators', count: canvas.gainCreators.length, min: 2 }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.count}/{item.min}+</span>
                        {item.count >= item.min ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-bold mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {canvas.customerPains.filter(p => p.severity === 'extreme' || p.severity === 'high').length > canvas.painRelievers.length && (
                    <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                      <p className="text-sm">Add more pain relievers to address high-severity pains</p>
                    </div>
                  )}
                  {canvas.customerGains.filter(g => g.importance === 'high').length > canvas.gainCreators.length && (
                    <div className="p-3 bg-yellow-50 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                      <p className="text-sm">Add more gain creators to deliver high-importance gains</p>
                    </div>
                  )}
                  {canvas.products.length === 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg flex items-start gap-2">
                      <Gift className="h-5 w-5 text-purple-500 shrink-0" />
                      <p className="text-sm">Define your products or services</p>
                    </div>
                  )}
                  {fitScore !== null && fitScore >= 70 && (
                    <div className="p-3 bg-green-50 rounded-lg flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <p className="text-sm">Your value proposition is well-aligned with customer needs!</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-6">
            {savedCanvases.length === 0 ? (
              <Card className="text-center py-12">
                <Save className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Saved Canvases</h3>
                <p className="text-gray-600">Create and save your first value proposition canvas</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCanvases.map(c => (
                  <Card key={c.id} className="p-4 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{c.name}</h4>
                        <p className="text-sm text-gray-600">{c.customerSegment}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => deleteCanvas(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                      <div>{c.customerJobs.length} jobs</div>
                      <div>{c.customerPains.length} pains</div>
                      <div>{c.customerGains.length} gains</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => loadCanvas(c)}>Load</Button>
                      <Button size="sm" variant="outline" onClick={() => { setCanvas({ ...c, id: Date.now().toString() }); newCanvas() }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

