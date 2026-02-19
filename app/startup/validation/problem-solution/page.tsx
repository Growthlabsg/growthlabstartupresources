'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import Link from 'next/link'
import { 
  Compass, Target, Lightbulb, CheckCircle, XCircle, ArrowLeft, Plus, Trash2,
  Download, Save, TrendingUp, AlertTriangle, Users, DollarSign, Clock,
  Star, Award, BarChart3, RefreshCw, Zap, Activity, ThumbsUp, ThumbsDown
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface Problem {
  id: string
  statement: string
  severity: number // 1-10
  frequency: number // 1-10
  willingness: number // 1-10 (willingness to pay)
  alternatives: string[]
  evidence: string[]
}

interface Solution {
  id: string
  name: string
  description: string
  howItSolves: string
  uniqueness: string
  feasibility: number // 1-10
  timeToMarket: number // months
}

interface Assumption {
  id: string
  statement: string
  category: 'problem' | 'solution' | 'market' | 'customer'
  risk: 'high' | 'medium' | 'low'
  validated: boolean
  evidence: string
}

interface Experiment {
  id: string
  name: string
  hypothesis: string
  method: string
  metric: string
  target: string
  status: 'planned' | 'running' | 'completed'
  result?: 'passed' | 'failed' | 'inconclusive'
  learnings: string
  created: string
}

interface PivotOption {
  id: string
  type: 'zoom-in' | 'zoom-out' | 'customer' | 'platform' | 'business' | 'technology' | 'channel'
  description: string
  rationale: string
  effort: 'low' | 'medium' | 'high'
  potential: 'low' | 'medium' | 'high'
}

const pivotTypes = [
  { value: 'zoom-in', label: 'Zoom-In', description: 'One feature becomes the whole product' },
  { value: 'zoom-out', label: 'Zoom-Out', description: 'Product becomes a feature of something larger' },
  { value: 'customer', label: 'Customer Segment', description: 'Target a different customer segment' },
  { value: 'platform', label: 'Platform', description: 'Change from product to platform or vice versa' },
  { value: 'business', label: 'Business Model', description: 'Change revenue or pricing model' },
  { value: 'technology', label: 'Technology', description: 'Use different technology to solve the same problem' },
  { value: 'channel', label: 'Channel', description: 'Change how you reach customers' }
]

export default function ProblemSolutionFitPage() {
  const [activeTab, setActiveTab] = useState('problem')
  const [problem, setProblem] = useState<Problem>({
    id: '1',
    statement: '',
    severity: 5,
    frequency: 5,
    willingness: 5,
    alternatives: [],
    evidence: []
  })
  const [solution, setSolution] = useState<Solution>({
    id: '1',
    name: '',
    description: '',
    howItSolves: '',
    uniqueness: '',
    feasibility: 5,
    timeToMarket: 3
  })
  const [assumptions, setAssumptions] = useState<Assumption[]>([])
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [pivotOptions, setPivotOptions] = useState<PivotOption[]>([])
  const [fitScore, setFitScore] = useState<number | null>(null)

  const tabs = [
    { id: 'problem', label: 'Problem Definition', icon: Target },
    { id: 'solution', label: 'Solution Hypothesis', icon: Lightbulb },
    { id: 'assumptions', label: 'Assumptions', icon: AlertTriangle },
    { id: 'experiments', label: 'Experiments', icon: Activity },
    { id: 'fit', label: 'Fit Analysis', icon: Compass },
    { id: 'pivot', label: 'Pivot Options', icon: RefreshCw }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('problemSolutionFit')
    if (saved) {
      const data = JSON.parse(saved)
      if (data.problem) setProblem(data.problem)
      if (data.solution) setSolution(data.solution)
      if (data.assumptions) setAssumptions(data.assumptions)
      if (data.experiments) setExperiments(data.experiments)
      if (data.pivotOptions) setPivotOptions(data.pivotOptions)
    }
  }, [])

  const saveData = () => {
    localStorage.setItem('problemSolutionFit', JSON.stringify({ problem, solution, assumptions, experiments, pivotOptions }))
    showToast('Data saved!', 'success')
  }

  // Problem functions
  const addAlternative = (alt: string) => {
    if (alt.trim()) {
      setProblem({ ...problem, alternatives: [...problem.alternatives, alt.trim()] })
    }
  }

  const addEvidence = (ev: string) => {
    if (ev.trim()) {
      setProblem({ ...problem, evidence: [...problem.evidence, ev.trim()] })
    }
  }

  // Assumptions functions
  const addAssumption = () => {
    const newAssumption: Assumption = {
      id: Date.now().toString(),
      statement: '',
      category: 'problem',
      risk: 'medium',
      validated: false,
      evidence: ''
    }
    setAssumptions([...assumptions, newAssumption])
  }

  const updateAssumption = (id: string, updates: Partial<Assumption>) => {
    setAssumptions(assumptions.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  const deleteAssumption = (id: string) => {
    setAssumptions(assumptions.filter(a => a.id !== id))
  }

  // Experiments functions
  const addExperiment = () => {
    const newExperiment: Experiment = {
      id: Date.now().toString(),
      name: '',
      hypothesis: '',
      method: '',
      metric: '',
      target: '',
      status: 'planned',
      learnings: '',
      created: new Date().toISOString()
    }
    setExperiments([...experiments, newExperiment])
  }

  const updateExperiment = (id: string, updates: Partial<Experiment>) => {
    setExperiments(experiments.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const deleteExperiment = (id: string) => {
    setExperiments(experiments.filter(e => e.id !== id))
  }

  // Pivot functions
  const addPivotOption = () => {
    const newPivot: PivotOption = {
      id: Date.now().toString(),
      type: 'customer',
      description: '',
      rationale: '',
      effort: 'medium',
      potential: 'medium'
    }
    setPivotOptions([...pivotOptions, newPivot])
  }

  const updatePivotOption = (id: string, updates: Partial<PivotOption>) => {
    setPivotOptions(pivotOptions.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deletePivotOption = (id: string) => {
    setPivotOptions(pivotOptions.filter(p => p.id !== id))
  }

  // Calculate fit score
  const calculateFit = () => {
    let score = 0
    let maxScore = 100

    // Problem quality (30%)
    const problemScore = ((problem.severity + problem.frequency + problem.willingness) / 30) * 100
    score += problemScore * 0.3

    // Evidence strength (20%)
    const evidenceScore = Math.min((problem.evidence.length * 20), 100)
    score += evidenceScore * 0.2

    // Solution clarity (20%)
    const solutionScore = problem.statement && solution.description && solution.howItSolves ? 100 : 
      (problem.statement ? 33 : 0) + (solution.description ? 33 : 0) + (solution.howItSolves ? 34 : 0)
    score += solutionScore * 0.2

    // Validated assumptions (15%)
    const validatedAssumptions = assumptions.filter(a => a.validated).length
    const assumptionScore = assumptions.length > 0 ? (validatedAssumptions / assumptions.length) * 100 : 0
    score += assumptionScore * 0.15

    // Successful experiments (15%)
    const passedExperiments = experiments.filter(e => e.result === 'passed').length
    const experimentScore = experiments.length > 0 ? (passedExperiments / experiments.length) * 100 : 0
    score += experimentScore * 0.15

    setFitScore(Math.round(score))
    showToast('Fit score calculated!', 'success')
  }

  const radarData = [
    { subject: 'Severity', A: problem.severity * 10 },
    { subject: 'Frequency', A: problem.frequency * 10 },
    { subject: 'Willingness', A: problem.willingness * 10 },
    { subject: 'Feasibility', A: solution.feasibility * 10 },
    { subject: 'Evidence', A: Math.min(problem.evidence.length * 20, 100) },
    { subject: 'Validation', A: assumptions.length > 0 ? (assumptions.filter(a => a.validated).length / assumptions.length) * 100 : 0 }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/startup/validation" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Validation Hub
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Compass className="h-10 w-10 text-green-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                Problem-Solution Fit
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Validate that your solution truly solves a real problem worth solving
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button onClick={saveData}><Save className="h-4 w-4 mr-2" /> Save Progress</Button>
          <Button variant="outline" onClick={calculateFit}><Target className="h-4 w-4 mr-2" /> Calculate Fit</Button>
          {fitScore !== null && (
            <Badge variant={fitScore >= 70 ? 'new' : fitScore >= 40 ? 'featured' : 'outline'} className="text-lg px-4">
              Fit Score: {fitScore}%
            </Badge>
          )}
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'problem' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="h-6 w-6 text-red-500" /> Problem Definition
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Problem Statement</label>
                  <textarea 
                    className="w-full p-3 border-2 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={4}
                    value={problem.statement}
                    onChange={(e) => setProblem({ ...problem, statement: e.target.value })}
                    placeholder="Describe the problem you're solving in detail. Who has this problem? What pain does it cause?"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Severity (1-10)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={problem.severity}
                        onChange={(e) => setProblem({ ...problem, severity: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="font-bold text-lg">{problem.severity}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">How painful is this problem?</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency (1-10)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={problem.frequency}
                        onChange={(e) => setProblem({ ...problem, frequency: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="font-bold text-lg">{problem.frequency}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">How often does this occur?</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Willingness to Pay (1-10)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={problem.willingness}
                        onChange={(e) => setProblem({ ...problem, willingness: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="font-bold text-lg">{problem.willingness}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">How much would they pay?</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-bold mb-4">Current Alternatives</h3>
                <p className="text-sm text-gray-600 mb-4">What are people doing now to solve this problem?</p>
                <div className="space-y-2 mb-4">
                  {problem.alternatives.map((alt, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{alt}</span>
                      <Button size="sm" variant="ghost" onClick={() => setProblem({ ...problem, alternatives: problem.alternatives.filter((_, idx) => idx !== i) })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add alternative..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addAlternative((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                  <Button size="sm" onClick={() => {
                    const input = document.querySelector('input[placeholder="Add alternative..."]') as HTMLInputElement
                    if (input) {
                      addAlternative(input.value)
                      input.value = ''
                    }
                  }}><Plus className="h-4 w-4" /></Button>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold mb-4">Evidence Collected</h3>
                <p className="text-sm text-gray-600 mb-4">What evidence do you have that this problem exists?</p>
                <div className="space-y-2 mb-4">
                  {problem.evidence.map((ev, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      <span className="flex-1">{ev}</span>
                      <Button size="sm" variant="ghost" onClick={() => setProblem({ ...problem, evidence: problem.evidence.filter((_, idx) => idx !== i) })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add evidence..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addEvidence((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                  <Button size="sm" onClick={() => {
                    const input = document.querySelector('input[placeholder="Add evidence..."]') as HTMLInputElement
                    if (input) {
                      addEvidence(input.value)
                      input.value = ''
                    }
                  }}><Plus className="h-4 w-4" /></Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'solution' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" /> Solution Hypothesis
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Solution Name</label>
                  <Input 
                    value={solution.name}
                    onChange={(e) => setSolution({ ...solution, name: e.target.value })}
                    placeholder="What's your solution called?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Solution Description</label>
                  <textarea 
                    className="w-full p-3 border-2 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={solution.description}
                    onChange={(e) => setSolution({ ...solution, description: e.target.value })}
                    placeholder="Describe your solution in detail..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">How It Solves the Problem</label>
                  <textarea 
                    className="w-full p-3 border-2 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={3}
                    value={solution.howItSolves}
                    onChange={(e) => setSolution({ ...solution, howItSolves: e.target.value })}
                    placeholder="Explain exactly how your solution addresses the problem..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Unique Value Proposition</label>
                  <textarea 
                    className="w-full p-3 border-2 rounded-lg focus:border-primary-500 focus:outline-none"
                    rows={2}
                    value={solution.uniqueness}
                    onChange={(e) => setSolution({ ...solution, uniqueness: e.target.value })}
                    placeholder="What makes your solution different/better than alternatives?"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Feasibility (1-10)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={solution.feasibility}
                        onChange={(e) => setSolution({ ...solution, feasibility: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="font-bold text-lg">{solution.feasibility}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time to Market (months)</label>
                    <Input 
                      type="number"
                      value={solution.timeToMarket}
                      onChange={(e) => setSolution({ ...solution, timeToMarket: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'assumptions' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-orange-500" /> Key Assumptions
                </h2>
                <Button onClick={addAssumption}><Plus className="h-4 w-4 mr-2" /> Add Assumption</Button>
              </div>
              <p className="text-gray-600 mb-6">Identify and track assumptions that must be true for your solution to work.</p>

              {assumptions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                  <p>No assumptions added yet. Start by identifying your riskiest assumptions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assumptions.map(assumption => (
                    <div key={assumption.id} className={`p-4 rounded-lg border-2 ${assumption.validated ? 'border-green-300 bg-green-50' : assumption.risk === 'high' ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                      <div className="flex items-start gap-4">
                        <button 
                          className={`w-6 h-6 rounded-full border-2 shrink-0 ${assumption.validated ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                          onClick={() => updateAssumption(assumption.id, { validated: !assumption.validated })}
                        >
                          {assumption.validated && <CheckCircle className="h-4 w-4 text-white m-auto" />}
                        </button>
                        <div className="flex-1 space-y-3">
                          <Input 
                            value={assumption.statement}
                            onChange={(e) => updateAssumption(assumption.id, { statement: e.target.value })}
                            placeholder="Assumption statement..."
                          />
                          <div className="flex gap-2 flex-wrap">
                            <select 
                              value={assumption.category}
                              onChange={(e) => updateAssumption(assumption.id, { category: e.target.value as Assumption['category'] })}
                              className="text-sm p-2 rounded border"
                            >
                              <option value="problem">Problem</option>
                              <option value="solution">Solution</option>
                              <option value="market">Market</option>
                              <option value="customer">Customer</option>
                            </select>
                            <select 
                              value={assumption.risk}
                              onChange={(e) => updateAssumption(assumption.id, { risk: e.target.value as Assumption['risk'] })}
                              className="text-sm p-2 rounded border"
                            >
                              <option value="high">High Risk</option>
                              <option value="medium">Medium Risk</option>
                              <option value="low">Low Risk</option>
                            </select>
                          </div>
                          {assumption.validated && (
                            <Input 
                              value={assumption.evidence}
                              onChange={(e) => updateAssumption(assumption.id, { evidence: e.target.value })}
                              placeholder="Evidence that validates this assumption..."
                            />
                          )}
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => deleteAssumption(assumption.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h3 className="font-bold mb-4">Assumption Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold">{assumptions.length}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{assumptions.filter(a => a.validated).length}</div>
                  <div className="text-sm text-gray-600">Validated</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{assumptions.filter(a => a.risk === 'high' && !a.validated).length}</div>
                  <div className="text-sm text-gray-600">High Risk</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{assumptions.filter(a => !a.validated).length}</div>
                  <div className="text-sm text-gray-600">To Validate</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'experiments' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="h-6 w-6 text-purple-500" /> Validation Experiments
                </h2>
                <Button onClick={addExperiment}><Plus className="h-4 w-4 mr-2" /> Add Experiment</Button>
              </div>

              {experiments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>No experiments yet. Design experiments to test your assumptions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {experiments.map(exp => (
                    <Card key={exp.id} className={`p-4 ${exp.result === 'passed' ? 'border-green-300' : exp.result === 'failed' ? 'border-red-300' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Input 
                            value={exp.name}
                            onChange={(e) => updateExperiment(exp.id, { name: e.target.value })}
                            placeholder="Experiment name..."
                            className="font-semibold"
                          />
                          <Badge variant={exp.status === 'completed' ? 'new' : exp.status === 'running' ? 'featured' : 'outline'}>
                            {exp.status}
                          </Badge>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => deleteExperiment(exp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500">Hypothesis</label>
                          <Input 
                            value={exp.hypothesis}
                            onChange={(e) => updateExperiment(exp.id, { hypothesis: e.target.value })}
                            placeholder="If we do X, then Y will happen..."
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Method</label>
                          <Input 
                            value={exp.method}
                            onChange={(e) => updateExperiment(exp.id, { method: e.target.value })}
                            placeholder="Interview, Survey, Landing Page..."
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Success Metric</label>
                          <Input 
                            value={exp.metric}
                            onChange={(e) => updateExperiment(exp.id, { metric: e.target.value })}
                            placeholder="Conversion rate, sign-ups..."
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">Target</label>
                          <Input 
                            value={exp.target}
                            onChange={(e) => updateExperiment(exp.id, { target: e.target.value })}
                            placeholder="5%, 100 sign-ups..."
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <select 
                          value={exp.status}
                          onChange={(e) => updateExperiment(exp.id, { status: e.target.value as Experiment['status'] })}
                          className="text-sm p-2 rounded border"
                        >
                          <option value="planned">Planned</option>
                          <option value="running">Running</option>
                          <option value="completed">Completed</option>
                        </select>
                        {exp.status === 'completed' && (
                          <select 
                            value={exp.result || ''}
                            onChange={(e) => updateExperiment(exp.id, { result: e.target.value as Experiment['result'] })}
                            className="text-sm p-2 rounded border"
                          >
                            <option value="">Select result...</option>
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                            <option value="inconclusive">Inconclusive</option>
                          </select>
                        )}
                      </div>
                      {exp.status === 'completed' && (
                        <div className="mt-3">
                          <label className="text-xs font-medium text-gray-500">Learnings</label>
                          <textarea 
                            className="w-full p-2 border rounded text-sm"
                            value={exp.learnings}
                            onChange={(e) => updateExperiment(exp.id, { learnings: e.target.value })}
                            placeholder="What did you learn from this experiment?"
                            rows={2}
                          />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'fit' && (
          <div className="space-y-6">
            <Card className="text-center">
              <h2 className="text-2xl font-bold mb-4">Problem-Solution Fit Score</h2>
              {fitScore !== null ? (
                <>
                  <div className={`text-6xl font-bold mb-4 ${fitScore >= 70 ? 'text-green-600' : fitScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {fitScore}%
                  </div>
                  <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                      className={`h-4 rounded-full ${fitScore >= 70 ? 'bg-green-500' : fitScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${fitScore}%` }}
                    />
                  </div>
                  <p className="text-gray-600 mb-6">
                    {fitScore >= 70 
                      ? 'Strong problem-solution fit! Consider moving to MVP development.'
                      : fitScore >= 40 
                      ? 'Moderate fit. Continue validating key assumptions.'
                      : 'Weak fit. Focus on problem discovery and validation.'}
                  </p>
                </>
              ) : (
                <div className="py-8 text-gray-400">
                  <Compass className="h-16 w-16 mx-auto mb-4" />
                  <p>Click "Calculate Fit" to see your score</p>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="font-bold mb-4">Fit Analysis</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'pivot' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <RefreshCw className="h-6 w-6 text-blue-500" /> Pivot Options
                </h2>
                <Button onClick={addPivotOption}><Plus className="h-4 w-4 mr-2" /> Add Option</Button>
              </div>
              <p className="text-gray-600 mb-6">If your current approach isn't working, consider these pivot options.</p>

              {pivotOptions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4" />
                  <p>No pivot options defined. Consider alternative directions.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pivotOptions.map(pivot => (
                    <Card key={pivot.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <select 
                          value={pivot.type}
                          onChange={(e) => updatePivotOption(pivot.id, { type: e.target.value as PivotOption['type'] })}
                          className="font-semibold p-2 rounded border"
                        >
                          {pivotTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        <Button size="sm" variant="ghost" onClick={() => deletePivotOption(pivot.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Input 
                          value={pivot.description}
                          onChange={(e) => updatePivotOption(pivot.id, { description: e.target.value })}
                          placeholder="Describe this pivot option..."
                        />
                        <Input 
                          value={pivot.rationale}
                          onChange={(e) => updatePivotOption(pivot.id, { rationale: e.target.value })}
                          placeholder="Why might this work?"
                        />
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs text-gray-500">Effort</label>
                            <select 
                              value={pivot.effort}
                              onChange={(e) => updatePivotOption(pivot.id, { effort: e.target.value as PivotOption['effort'] })}
                              className="w-full p-2 rounded border text-sm"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-gray-500">Potential</label>
                            <select 
                              value={pivot.potential}
                              onChange={(e) => updatePivotOption(pivot.id, { potential: e.target.value as PivotOption['potential'] })}
                              className="w-full p-2 rounded border text-sm"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h3 className="font-bold mb-4">Pivot Types Reference</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {pivotTypes.map(type => (
                  <div key={type.value} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm">{type.label}</h4>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}

