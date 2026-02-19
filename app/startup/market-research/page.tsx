'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Search as SearchIcon,
  Download,
  Save,
  Share2,
  Calculator,
  FileText,
  PieChart,
  MapPin,
  Globe,
  Zap,
  CheckCircle,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Printer,
  Upload,
  Grid3x3,
  Layers,
  DollarSign,
  TrendingDown,
  Award,
  Filter,
  Table,
  Activity,
  AlertTriangle,
  Lightbulb,
  Shield,
  Rocket,
  RefreshCw,
  Gauge,
  Map,
  Star,
  LineChart as LineChartIcon,
  FileSpreadsheet,
  BookOpen,
  Brain,
  Network,
  BarChart2,
  Sparkles,
  ShoppingCart,
  Code
} from 'lucide-react'
import Link from 'next/link'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'

interface Competitor {
  id: string
  name: string
  marketShare: number
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  pricing: string
  features: string[]
  revenue?: number
  funding?: number
  employees?: number
  website?: string
  rating?: number
}

interface CustomerPersona {
  id: string
  name: string
  age: string
  occupation: string
  goals: string[]
  painPoints: string[]
  behaviors: string[]
}

interface SurveyQuestion {
  id: string
  type: 'multiple-choice' | 'text' | 'rating' | 'yes-no'
  question: string
  options?: string[]
}

interface MarketTrend {
  period: string
  value: number
  growth: number
}

interface MarketSegment {
  id: string
  name: string
  size: number
  growthRate: number
  characteristics: string[]
}

interface PricingTier {
  id: string
  name: string
  price: number
  features: string[]
  targetSegment: string
}

interface SWOTAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

interface Benchmark {
  id: string
  metric: string
  yourValue: number
  industryAverage: number
  topPerformer: number
  unit: string
}

interface JourneyStage {
  id: string
  name: string
  touchpoints: string[]
  emotions: string[]
  painPoints: string[]
}

interface Opportunity {
  id: string
  name: string
  marketSize: number
  growthRate: number
  competition: number // 1-10 scale
  feasibility: number // 1-10 scale
  score: number
}

interface Positioning {
  competitorId: string
  price: number
  quality: number
  innovation: number
}

export default function MarketResearchPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [researchQuery, setResearchQuery] = useState('')
  const [savedProjects, setSavedProjects] = useState<any[]>([])
  const [currentProject, setCurrentProject] = useState<any>(null)

  // Market Sizing
  const [tam, setTam] = useState('')
  const [sam, setSam] = useState('')
  const [som, setSom] = useState('')
  const [marketSizeResults, setMarketSizeResults] = useState<any>(null)

  // Competitor Analysis
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [newCompetitor, setNewCompetitor] = useState({ name: '', marketShare: '', pricing: '' })

  // Customer Personas
  const [personas, setPersonas] = useState<CustomerPersona[]>([])
  const [showPersonaForm, setShowPersonaForm] = useState(false)
  const [newPersona, setNewPersona] = useState({ name: '', age: '', occupation: '' })

  // Survey Builder
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([])
  const [newQuestion, setNewQuestion] = useState({ type: 'multiple-choice', question: '', options: [''] })

  // Market Trends
  const [trends, setTrends] = useState<MarketTrend[]>([])

  // Market Segmentation
  const [segments, setSegments] = useState<MarketSegment[]>([])
  const [newSegment, setNewSegment] = useState({ name: '', size: '', growthRate: '' })

  // Pricing Analysis
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([])
  const [newPricingTier, setNewPricingTier] = useState({ name: '', price: '', targetSegment: '' })

  // SWOT Analysis
  const [swotAnalysis, setSwotAnalysis] = useState<SWOTAnalysis>({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  })
  const [swotInput, setSwotInput] = useState({ category: 'strengths' as keyof SWOTAnalysis, value: '' })

  // Feature Comparison
  const [featureComparison, setFeatureComparison] = useState<Record<string, Record<string, boolean>>>({})
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [editingCompetitor, setEditingCompetitor] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('marketResearchProjects')
      if (saved) {
        setSavedProjects(JSON.parse(saved))
      }
    }
  }, [])

  const calculateMarketSize = () => {
    const tamValue = parseFloat(tam) || 0
    const samValue = parseFloat(sam) || 0
    const somValue = parseFloat(som) || 0

    if (tamValue === 0 || samValue === 0 || somValue === 0) {
      showToast('Please enter all market size values', 'error')
      return
    }

    const penetrationRate = (somValue / tamValue) * 100
    const samPenetration = (somValue / samValue) * 100

    setMarketSizeResults({
      tam: tamValue,
      sam: samValue,
      som: somValue,
      penetrationRate: penetrationRate.toFixed(2),
      samPenetration: samPenetration.toFixed(2),
      opportunity: tamValue - somValue,
    })

    showToast('Market size calculated!', 'success')
  }

  const addCompetitor = () => {
    if (!newCompetitor.name.trim()) {
      showToast('Please enter competitor name', 'error')
      return
    }

    const competitor: Competitor = {
      id: Date.now().toString(),
      name: newCompetitor.name,
      marketShare: parseFloat(newCompetitor.marketShare) || 0,
      strengths: [],
      weaknesses: [],
      pricing: newCompetitor.pricing,
      features: [],
    }

    setCompetitors([...competitors, competitor])
    setNewCompetitor({ name: '', marketShare: '', pricing: '' })
    showToast('Competitor added!', 'success')
  }

  const deleteCompetitor = (id: string) => {
    setCompetitors(competitors.filter(c => c.id !== id))
    showToast('Competitor removed', 'info')
  }

  const toggleFeature = (competitorId: string, feature: string) => {
    setFeatureComparison({
      ...featureComparison,
      [competitorId]: {
        ...featureComparison[competitorId],
        [feature]: !featureComparison[competitorId]?.[feature],
      },
    })
  }

  const addFeatureToComparison = () => {
    const feature = prompt('Enter feature name:')
    if (feature && feature.trim()) {
      setSelectedFeatures([...selectedFeatures, feature.trim()])
      // Initialize for all competitors
      const newComparison = { ...featureComparison }
      competitors.forEach(comp => {
        if (!newComparison[comp.id]) {
          newComparison[comp.id] = {}
        }
        newComparison[comp.id][feature.trim()] = false
      })
      setFeatureComparison(newComparison)
      showToast('Feature added to comparison!', 'success')
    }
  }

  const addSWOTItem = () => {
    if (!swotInput.value.trim()) {
      showToast('Please enter a value', 'error')
      return
    }

    setSwotAnalysis({
      ...swotAnalysis,
      [swotInput.category]: [...swotAnalysis[swotInput.category], swotInput.value],
    })
    setSwotInput({ ...swotInput, value: '' })
    showToast('Item added!', 'success')
  }

  const removeSWOTItem = (category: keyof SWOTAnalysis, index: number) => {
    setSwotAnalysis({
      ...swotAnalysis,
      [category]: swotAnalysis[category].filter((_, i) => i !== index),
    })
    showToast('Item removed', 'info')
  }

  const addSegment = () => {
    if (!newSegment.name.trim()) {
      showToast('Please enter segment name', 'error')
      return
    }

    const segment: MarketSegment = {
      id: Date.now().toString(),
      name: newSegment.name,
      size: parseFloat(newSegment.size) || 0,
      growthRate: parseFloat(newSegment.growthRate) || 0,
      characteristics: [],
    }

    setSegments([...segments, segment])
    setNewSegment({ name: '', size: '', growthRate: '' })
    showToast('Segment added!', 'success')
  }

  const addPricingTier = () => {
    if (!newPricingTier.name.trim()) {
      showToast('Please enter pricing tier name', 'error')
      return
    }

    const tier: PricingTier = {
      id: Date.now().toString(),
      name: newPricingTier.name,
      price: parseFloat(newPricingTier.price) || 0,
      features: [],
      targetSegment: newPricingTier.targetSegment,
    }

    setPricingTiers([...pricingTiers, tier])
    setNewPricingTier({ name: '', price: '', targetSegment: '' })
    showToast('Pricing tier added!', 'success')
  }

  const addPersona = () => {
    if (!newPersona.name.trim()) {
      showToast('Please enter persona name', 'error')
      return
    }

    const persona: CustomerPersona = {
      id: Date.now().toString(),
      name: newPersona.name,
      age: newPersona.age,
      occupation: newPersona.occupation,
      goals: [],
      painPoints: [],
      behaviors: [],
    }

    setPersonas([...personas, persona])
    setNewPersona({ name: '', age: '', occupation: '' })
    setShowPersonaForm(false)
    showToast('Persona added!', 'success')
  }

  const addSurveyQuestion = () => {
    if (!newQuestion.question.trim()) {
      showToast('Please enter a question', 'error')
      return
    }

    if (newQuestion.type === 'multiple-choice' && (!newQuestion.options || newQuestion.options.filter(o => o.trim()).length < 2)) {
      showToast('Please add at least 2 options for multiple choice questions', 'error')
      return
    }

    const question: SurveyQuestion = {
      id: Date.now().toString(),
      type: newQuestion.type as any,
      question: newQuestion.question,
      options: newQuestion.type === 'multiple-choice' ? newQuestion.options?.filter(o => o.trim()) : undefined,
    }

    setSurveyQuestions([...surveyQuestions, question])
    setNewQuestion({ type: 'multiple-choice', question: '', options: [''] })
    showToast('Question added!', 'success')
  }

  const exportSurvey = () => {
    if (surveyQuestions.length === 0) {
      showToast('No questions to export', 'error')
      return
    }

    const surveyText = surveyQuestions.map((q, idx) => {
      let text = `Q${idx + 1}: ${q.question} (${q.type})\n`
      if (q.options && q.options.length > 0) {
        q.options.forEach((opt, optIdx) => {
          text += `  ${String.fromCharCode(65 + optIdx)}. ${opt}\n`
        })
      }
      return text
    }).join('\n')

    const blob = new Blob([surveyText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `survey-${researchQuery || 'questions'}.txt`
    a.click()
    showToast('Survey exported!', 'success')
  }

  const saveProject = () => {
    if (!researchQuery.trim()) {
      showToast('Please enter a project name', 'error')
      return
    }

    const project = {
      id: Date.now().toString(),
      name: researchQuery,
      date: new Date().toISOString(),
      competitors,
      personas,
      surveyQuestions,
      marketSize: marketSizeResults,
      trends,
      segments,
      pricingTiers,
      swotAnalysis,
      featureComparison,
      selectedFeatures,
    }

    const updated = [...savedProjects, project]
    setSavedProjects(updated)
    localStorage.setItem('marketResearchProjects', JSON.stringify(updated))
    showToast('Project saved!', 'success')
  }

  const loadProject = (project: any) => {
    setCurrentProject(project)
    setResearchQuery(project.name)
    setCompetitors(project.competitors || [])
    setPersonas(project.personas || [])
    setSurveyQuestions(project.surveyQuestions || [])
    setMarketSizeResults(project.marketSize || null)
    setTrends(project.trends || [])
    setSegments(project.segments || [])
    setPricingTiers(project.pricingTiers || [])
    setSwotAnalysis(project.swotAnalysis || { strengths: [], weaknesses: [], opportunities: [], threats: [] })
    setFeatureComparison(project.featureComparison || {})
    setSelectedFeatures(project.selectedFeatures || [])
    showToast('Project loaded!', 'success')
  }

  const exportData = () => {
    const data = {
      project: researchQuery,
      date: new Date().toISOString(),
      marketSize: marketSizeResults,
      competitors,
      personas,
      surveyQuestions,
      trends,
      segments,
      pricingTiers,
      swotAnalysis,
      featureComparison,
      selectedFeatures,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `market-research-${researchQuery.replace(/\s+/g, '-')}.json`
    a.click()
    showToast('Data exported!', 'success')
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.competitors) setCompetitors(data.competitors)
        if (data.personas) setPersonas(data.personas)
        if (data.surveyQuestions) setSurveyQuestions(data.surveyQuestions)
        if (data.marketSize) setMarketSizeResults(data.marketSize)
        if (data.segments) setSegments(data.segments)
        if (data.pricingTiers) setPricingTiers(data.pricingTiers)
        if (data.swotAnalysis) setSwotAnalysis(data.swotAnalysis)
        if (data.featureComparison) setFeatureComparison(data.featureComparison)
        if (data.selectedFeatures) setSelectedFeatures(data.selectedFeatures)
        if (data.name || data.project) setResearchQuery(data.name || data.project || '')
        showToast('Data imported successfully!', 'success')
      } catch (error) {
        showToast('Error importing data. Please check file format.', 'error')
      }
    }
    reader.readAsText(file)
    // Reset the input so the same file can be imported again
    event.target.value = ''
  }

  const exportToCSV = () => {
    let csv = 'Type,Name,Value\n'
    
    // Export competitors
    competitors.forEach(c => {
      csv += `Competitor,${c.name},${c.marketShare}%\n`
    })
    
    // Export segments
    segments.forEach(s => {
      csv += `Segment,${s.name},$${s.size}M\n`
    })
    
    // Export opportunities
    opportunities.forEach(o => {
      csv += `Opportunity,${o.name},Score: ${o.score}\n`
    })

    // Export pricing tiers
    pricingTiers.forEach(t => {
      csv += `Pricing Tier,${t.name},$${t.price}\n`
    })

    // Export personas
    personas.forEach(p => {
      csv += `Persona,${p.name},${p.age} - ${p.occupation}\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `market-research-${researchQuery || 'data'}.csv`
    a.click()
    showToast('Data exported to CSV!', 'success')
  }

  const generateReport = () => {
    const report = `
MARKET RESEARCH REPORT
${'='.repeat(50)}

Project: ${researchQuery || 'Untitled Project'}
Date: ${new Date().toLocaleDateString()}

MARKET SIZE ANALYSIS
${'-'.repeat(50)}
${marketSizeResults ? `
Total Addressable Market (TAM): $${marketSizeResults.tam.toLocaleString()}B
Serviceable Available Market (SAM): $${marketSizeResults.sam.toLocaleString()}B
Serviceable Obtainable Market (SOM): $${marketSizeResults.som.toLocaleString()}B
Market Penetration Rate: ${marketSizeResults.penetrationRate}%
Market Opportunity: $${marketSizeResults.opportunity.toLocaleString()}B
` : 'No market size data available'}

COMPETITOR ANALYSIS
${'-'.repeat(50)}
${competitors.length > 0 ? competitors.map(c => `
${c.name}
  Market Share: ${c.marketShare}%
  Pricing: ${c.pricing}
  Strengths: ${c.strengths.join(', ') || 'None'}
  Weaknesses: ${c.weaknesses.join(', ') || 'None'}
`).join('\n') : 'No competitors added'}

SWOT ANALYSIS
${'-'.repeat(50)}
Strengths:
${swotAnalysis.strengths.map(s => `  - ${s}`).join('\n') || '  None'}

Weaknesses:
${swotAnalysis.weaknesses.map(w => `  - ${w}`).join('\n') || '  None'}

Opportunities:
${swotAnalysis.opportunities.map(o => `  - ${o}`).join('\n') || '  None'}

Threats:
${swotAnalysis.threats.map(t => `  - ${t}`).join('\n') || '  None'}

MARKET SEGMENTS
${'-'.repeat(50)}
${segments.length > 0 ? segments.map(s => `
${s.name}
  Size: $${s.size.toLocaleString()}M
  Growth Rate: ${s.growthRate}%
`).join('\n') : 'No segments defined'}

PRICING ANALYSIS
${'-'.repeat(50)}
${pricingTiers.length > 0 ? pricingTiers.map(t => `
${t.name}
  Price: $${t.price.toLocaleString()}
  Target Segment: ${t.targetSegment}
`).join('\n') : 'No pricing tiers defined'}

CUSTOMER PERSONAS
${'-'.repeat(50)}
${personas.length > 0 ? personas.map(p => `
${p.name}
  Age: ${p.age}
  Occupation: ${p.occupation}
  Goals: ${p.goals.join(', ') || 'None'}
  Pain Points: ${p.painPoints.join(', ') || 'None'}
`).join('\n') : 'No personas created'}

SURVEY QUESTIONS
${'-'.repeat(50)}
${surveyQuestions.length > 0 ? surveyQuestions.map((q, idx) => `
Q${idx + 1}: ${q.question} (${q.type})
${q.options ? q.options.map((opt, optIdx) => `  ${String.fromCharCode(65 + optIdx)}. ${opt}`).join('\n') : ''}
`).join('\n') : 'No survey questions'}

${'='.repeat(50)}
Generated by GrowthLab Startup Resources
    `.trim()

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `market-research-report-${researchQuery || 'report'}.txt`
    a.click()
    showToast('Report generated!', 'success')
  }

  const competitorChartData = competitors.map(c => ({
    name: c.name,
    marketShare: c.marketShare,
  }))

  const marketSizeChartData = marketSizeResults ? [
    { name: 'TAM', value: marketSizeResults.tam },
    { name: 'SAM', value: marketSizeResults.sam },
    { name: 'SOM', value: marketSizeResults.som },
  ] : []

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
              Market Research Tools
            </span>
          </h1>
          <p className="text-lg text-gray-600">
                Comprehensive market analysis, competitor research, and customer insights
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={saveProject}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
                <Button variant="outline" size="sm" as="span">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </label>
              <Button variant="outline" size="sm" onClick={generateReport}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Market Research: ${researchQuery}`,
                    text: `Check out my market research project: ${researchQuery}`,
                    url: window.location.href,
                  }).catch(() => {})
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  showToast('Link copied to clipboard!', 'success')
                }
              }}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Link href="/startup/market-research/enhanced">
                <Button size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  AI Enhanced
                </Button>
              </Link>
            </div>
        </div>

          {/* Project Name */}
          <div className="mb-6">
            <Input
              value={researchQuery}
              onChange={(e) => setResearchQuery(e.target.value)}
              placeholder="Enter market or industry name (e.g., SaaS, FinTech)"
              className="max-w-md"
            />
          </div>
        </div>

        {/* Tabs */}
        <SimpleTabs
          tabs={[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'market-size', label: 'Market Sizing', icon: Calculator },
            { id: 'competitors', label: 'Competitors', icon: Target },
            { id: 'swot', label: 'SWOT Analysis', icon: Grid3x3 },
            { id: 'features', label: 'Feature Comparison', icon: Table },
            { id: 'segmentation', label: 'Segmentation', icon: Layers },
            { id: 'pricing', label: 'Pricing Analysis', icon: DollarSign },
            { id: 'personas', label: 'Customer Personas', icon: Users },
            { id: 'survey', label: 'Survey Builder', icon: FileText },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'reports', label: 'Reports', icon: FileText },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Market Size</span>
                  <Calculator className="h-5 w-5 text-primary-500" />
                </div>
                <div className="text-2xl font-bold">
                  {marketSizeResults ? `$${marketSizeResults.tam.toLocaleString()}B` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">TAM</div>
          </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Competitors</span>
                  <Target className="h-5 w-5 text-primary-500" />
                </div>
                <div className="text-2xl font-bold">{competitors.length}</div>
                <div className="text-xs text-gray-500 mt-1">Tracked</div>
          </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Personas</span>
                  <Users className="h-5 w-5 text-primary-500" />
                </div>
                <div className="text-2xl font-bold">{personas.length}</div>
                <div className="text-xs text-gray-500 mt-1">Created</div>
          </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Survey Questions</span>
                  <FileText className="h-5 w-5 text-primary-500" />
                </div>
                <div className="text-2xl font-bold">{surveyQuestions.length}</div>
                <div className="text-xs text-gray-500 mt-1">Questions</div>
          </Card>
        </div>

            {marketSizeResults && (
          <Card>
                <h3 className="text-lg font-semibold mb-4">Market Size Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketSizeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `$${value.toLocaleString()}B`} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
          </Card>
            )}

            {competitors.length > 0 && (
          <Card>
                <h3 className="text-lg font-semibold mb-4">Competitor Market Share</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={competitorChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="marketShare"
                    >
                      {competitorChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
          </Card>
            )}
        </div>
        )}

        {/* Market Sizing Tab */}
        {activeTab === 'market-size' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Market Size Calculator (TAM/SAM/SOM)</h3>
              <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Addressable Market (TAM) - $B
                </label>
                  <Input
                    type="number"
                    value={tam}
                    onChange={(e) => setTam(e.target.value)}
                    placeholder="e.g., 100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Total market demand for your product/service</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serviceable Available Market (SAM) - $B
                  </label>
                  <Input
                    type="number"
                    value={sam}
                    onChange={(e) => setSam(e.target.value)}
                    placeholder="e.g., 20"
                  />
                  <p className="text-xs text-gray-500 mt-1">Segment of TAM you can serve</p>
              </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serviceable Obtainable Market (SOM) - $B
                </label>
                  <Input
                    type="number"
                    value={som}
                    onChange={(e) => setSom(e.target.value)}
                    placeholder="e.g., 2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Realistic market share you can capture</p>
                </div>
                <Button onClick={calculateMarketSize} className="w-full">
                  Calculate Market Size
                </Button>
              </div>
            </Card>

            {marketSizeResults && (
              <Card className="bg-gradient-to-br from-primary-50 to-primary-100">
                <h3 className="text-lg font-semibold mb-4">Market Size Analysis</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">TAM</div>
                    <div className="text-2xl font-bold">${marketSizeResults.tam.toLocaleString()}B</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">SAM</div>
                    <div className="text-2xl font-bold">${marketSizeResults.sam.toLocaleString()}B</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">SOM</div>
                    <div className="text-2xl font-bold">${marketSizeResults.som.toLocaleString()}B</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Penetration</div>
                    <div className="text-2xl font-bold">{marketSizeResults.penetrationRate}%</div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <div className="text-sm font-medium mb-2">Market Opportunity</div>
                  <div className="text-xl font-bold text-primary-600">
                    ${marketSizeResults.opportunity.toLocaleString()}B remaining
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Add Competitor</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={newCompetitor.name}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                  placeholder="Competitor name"
                />
                <Input
                  type="number"
                  value={newCompetitor.marketShare}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, marketShare: e.target.value })}
                  placeholder="Market share %"
                />
                <Input
                  value={newCompetitor.pricing}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, pricing: e.target.value })}
                  placeholder="Pricing model"
                />
              </div>
              <Button onClick={addCompetitor} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Competitor
              </Button>
            </Card>

            {competitors.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitors.map((competitor) => (
                  <Card key={competitor.id}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{competitor.name}</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          Market Share: {competitor.marketShare}%
                        </div>
                        <div className="text-sm text-gray-600">Pricing: {competitor.pricing}</div>
                      </div>
                <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCompetitor(competitor.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Strengths</div>
                        <div className="text-sm text-gray-700">
                          {competitor.strengths.length > 0 ? competitor.strengths.join(', ') : 'Not specified'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Weaknesses</div>
                        <div className="text-sm text-gray-700">
                          {competitor.weaknesses.length > 0 ? competitor.weaknesses.join(', ') : 'Not specified'}
                        </div>
                      </div>
                    </div>
                    {editingCompetitor === competitor.id && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
                        <Input
                          placeholder="Add strength"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              const updated = competitors.map(c =>
                                c.id === competitor.id
                                  ? { ...c, strengths: [...c.strengths, e.currentTarget.value] }
                                  : c
                              )
                              setCompetitors(updated)
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                        <Input
                          placeholder="Add weakness"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              const updated = competitors.map(c =>
                                c.id === competitor.id
                                  ? { ...c, weaknesses: [...c.weaknesses, e.currentTarget.value] }
                                  : c
                              )
                              setCompetitors(updated)
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SWOT Analysis Tab */}
        {activeTab === 'swot' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">SWOT Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Select
                  value={swotInput.category}
                  onChange={(e) => setSwotInput({ ...swotInput, category: e.target.value as keyof SWOTAnalysis })}
                  options={[
                    { value: 'strengths', label: 'Strengths' },
                    { value: 'weaknesses', label: 'Weaknesses' },
                    { value: 'opportunities', label: 'Opportunities' },
                    { value: 'threats', label: 'Threats' },
                  ]}
                />
              <div className="flex gap-2">
                  <Input
                    value={swotInput.value}
                    onChange={(e) => setSwotInput({ ...swotInput, value: e.target.value })}
                    placeholder="Enter item"
                    onKeyPress={(e) => e.key === 'Enter' && addSWOTItem()}
                  />
                  <Button onClick={addSWOTItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Strengths</h4>
                </div>
                <div className="space-y-2">
                  {swotAnalysis.strengths.length > 0 ? (
                    swotAnalysis.strengths.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">{item}</span>
                <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSWOTItem('strengths', idx)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No strengths added</p>
                  )}
                </div>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-semibold text-red-900">Weaknesses</h4>
                </div>
                <div className="space-y-2">
                  {swotAnalysis.weaknesses.length > 0 ? (
                    swotAnalysis.weaknesses.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSWOTItem('weaknesses', idx)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No weaknesses added</p>
                  )}
                </div>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Opportunities</h4>
                </div>
                <div className="space-y-2">
                  {swotAnalysis.opportunities.length > 0 ? (
                    swotAnalysis.opportunities.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSWOTItem('opportunities', idx)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No opportunities added</p>
                  )}
                </div>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold text-orange-900">Threats</h4>
                </div>
                <div className="space-y-2">
                  {swotAnalysis.threats.length > 0 ? (
                    swotAnalysis.threats.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSWOTItem('threats', idx)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No threats added</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Feature Comparison Tab */}
        {activeTab === 'features' && (
          <div className="mt-6 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Feature Comparison Matrix</h3>
                <Button onClick={addFeatureToComparison} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              {competitors.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Add competitors first to compare features</p>
              ) : selectedFeatures.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Add features to start comparing</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 font-semibold">Feature</th>
                        {competitors.map(comp => (
                          <th key={comp.id} className="text-center p-3 font-semibold">{comp.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFeatures.map(feature => (
                        <tr key={feature} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-medium">{feature}</td>
                          {competitors.map(comp => (
                            <td key={comp.id} className="text-center p-3">
                              <button
                                onClick={() => toggleFeature(comp.id, feature)}
                                className={`w-6 h-6 rounded border-2 transition-all ${
                                  featureComparison[comp.id]?.[feature]
                                    ? 'bg-green-500 border-green-500'
                                    : 'bg-white border-gray-300'
                                }`}
                              >
                                {featureComparison[comp.id]?.[feature] && (
                                  <CheckCircle className="h-4 w-4 mx-auto text-white" />
                                )}
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Market Segmentation Tab */}
        {activeTab === 'segmentation' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Market Segmentation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  value={newSegment.name}
                  onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                  placeholder="Segment name"
                />
                <Input
                  type="number"
                  value={newSegment.size}
                  onChange={(e) => setNewSegment({ ...newSegment, size: e.target.value })}
                  placeholder="Market size ($M)"
                />
                <Input
                  type="number"
                  value={newSegment.growthRate}
                  onChange={(e) => setNewSegment({ ...newSegment, growthRate: e.target.value })}
                  placeholder="Growth rate %"
                />
              </div>
              <Button onClick={addSegment} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Segment
              </Button>
            </Card>

            {segments.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {segments.map((segment) => (
                    <Card key={segment.id}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{segment.name}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            Size: ${segment.size.toLocaleString()}M
                          </div>
                          <div className="text-sm text-gray-600">
                            Growth: {segment.growthRate}%
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSegments(segments.filter(s => s.id !== segment.id))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Segment Size Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={segments.map(s => ({ name: s.name, size: s.size }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `$${value}M`} />
                      <Bar dataKey="size" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Pricing Analysis Tab */}
        {activeTab === 'pricing' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Pricing Tiers Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  value={newPricingTier.name}
                  onChange={(e) => setNewPricingTier({ ...newPricingTier, name: e.target.value })}
                  placeholder="Tier name (e.g., Basic, Pro)"
                />
                <Input
                  type="number"
                  value={newPricingTier.price}
                  onChange={(e) => setNewPricingTier({ ...newPricingTier, price: e.target.value })}
                  placeholder="Price ($)"
                />
                <Input
                  value={newPricingTier.targetSegment}
                  onChange={(e) => setNewPricingTier({ ...newPricingTier, targetSegment: e.target.value })}
                  placeholder="Target segment"
                />
              </div>
              <Button onClick={addPricingTier} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Pricing Tier
              </Button>
            </Card>

            {pricingTiers.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pricingTiers.map((tier) => (
                    <Card key={tier.id} className="border-2 border-primary-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{tier.name}</h4>
                          <div className="text-2xl font-bold text-primary-600 mt-2">
                            ${tier.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Target: {tier.targetSegment}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPricingTiers(pricingTiers.filter(t => t.id !== tier.id))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Pricing Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pricingTiers.map(t => ({ name: t.name, price: t.price }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                      <Bar dataKey="price" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Competitive Positioning Matrix Tab */}
        {activeTab === 'positioning' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Competitive Positioning Matrix</h3>
              <p className="text-sm text-gray-600 mb-4">
                Map competitors on price, quality, and innovation axes
              </p>
              {competitors.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Add competitors first to create positioning matrix</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {competitors.map(comp => (
                    <Card key={comp.id}>
                      <h4 className="font-semibold mb-4">{comp.name}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Price (1-10)</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={positioning[comp.id]?.price || 5}
                            onChange={(e) => updatePositioning(comp.id, 'price', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-500">{positioning[comp.id]?.price || 5}/10</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Quality (1-10)</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={positioning[comp.id]?.quality || 5}
                            onChange={(e) => updatePositioning(comp.id, 'quality', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-500">{positioning[comp.id]?.quality || 5}/10</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Innovation (1-10)</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={positioning[comp.id]?.innovation || 5}
                            onChange={(e) => updatePositioning(comp.id, 'innovation', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-500">{positioning[comp.id]?.innovation || 5}/10</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Industry Benchmarking Tab */}
        {activeTab === 'benchmarking' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Industry Benchmarking</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <Input
                  value={newBenchmark.metric}
                  onChange={(e) => setNewBenchmark({ ...newBenchmark, metric: e.target.value })}
                  placeholder="Metric name"
                />
                <Input
                  type="number"
                  value={newBenchmark.yourValue}
                  onChange={(e) => setNewBenchmark({ ...newBenchmark, yourValue: e.target.value })}
                  placeholder="Your value"
                />
                <Input
                  type="number"
                  value={newBenchmark.industryAverage}
                  onChange={(e) => setNewBenchmark({ ...newBenchmark, industryAverage: e.target.value })}
                  placeholder="Industry avg"
                />
                <Input
                  type="number"
                  value={newBenchmark.topPerformer}
                  onChange={(e) => setNewBenchmark({ ...newBenchmark, topPerformer: e.target.value })}
                  placeholder="Top performer"
                />
                <Input
                  value={newBenchmark.unit}
                  onChange={(e) => setNewBenchmark({ ...newBenchmark, unit: e.target.value })}
                  placeholder="Unit (%, $, etc.)"
                />
              </div>
              <Button onClick={addBenchmark} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Benchmark
              </Button>
            </Card>

            {benchmarks.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">Benchmark Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Metric</th>
                        <th className="text-right p-3">Your Value</th>
                        <th className="text-right p-3">Industry Avg</th>
                        <th className="text-right p-3">Top Performer</th>
                        <th className="text-center p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarks.map(b => {
                        const diff = ((b.yourValue - b.industryAverage) / b.industryAverage) * 100
                        const status = diff > 20 ? 'excellent' : diff > 0 ? 'good' : diff > -20 ? 'average' : 'below'
                        return (
                          <tr key={b.id} className="border-b">
                            <td className="p-3 font-medium">{b.metric}</td>
                            <td className="text-right p-3">{b.yourValue}{b.unit}</td>
                            <td className="text-right p-3">{b.industryAverage}{b.unit}</td>
                            <td className="text-right p-3">{b.topPerformer}{b.unit}</td>
                            <td className="text-center p-3">
                              <Badge variant={status === 'excellent' ? 'new' : status === 'good' ? 'featured' : 'outline'}>
                                {status}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Customer Journey Tab */}
        {activeTab === 'journey' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Customer Journey Mapping</h3>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newStage.name}
                  onChange={(e) => setNewStage({ name: e.target.value })}
                  placeholder="Stage name (e.g., Awareness, Consideration)"
                  className="flex-1"
                />
                <Button onClick={addJourneyStage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stage
                </Button>
              </div>
            </Card>

            {journeyStages.length > 0 && (
              <div className="space-y-4">
                {journeyStages.map((stage, idx) => (
                  <Card key={stage.id}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <h4 className="font-semibold text-lg">{stage.name}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setJourneyStages(journeyStages.filter(s => s.id !== stage.id))}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-2">Touchpoints</div>
                        <div className="text-sm text-gray-700">
                          {stage.touchpoints.length > 0 ? stage.touchpoints.join(', ') : 'None'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-2">Emotions</div>
                        <div className="text-sm text-gray-700">
                          {stage.emotions.length > 0 ? stage.emotions.join(', ') : 'None'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-2">Pain Points</div>
                        <div className="text-sm text-gray-700">
                          {stage.painPoints.length > 0 ? stage.painPoints.join(', ') : 'None'}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Market Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Market Opportunity Scoring</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <Input
                  value={newOpportunity.name}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, name: e.target.value })}
                  placeholder="Opportunity name"
                />
                <Input
                  type="number"
                  value={newOpportunity.marketSize}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, marketSize: e.target.value })}
                  placeholder="Market size ($M)"
                />
                <Input
                  type="number"
                  value={newOpportunity.growthRate}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, growthRate: e.target.value })}
                  placeholder="Growth rate %"
                />
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={newOpportunity.competition}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, competition: e.target.value })}
                  placeholder="Competition (1-10)"
                />
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={newOpportunity.feasibility}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, feasibility: e.target.value })}
                  placeholder="Feasibility (1-10)"
                />
              </div>
              <Button onClick={addOpportunity} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Opportunity
              </Button>
            </Card>

            {opportunities.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunities.sort((a, b) => b.score - a.score).map(opp => (
                  <Card key={opp.id} className={opp.score >= 70 ? 'border-2 border-green-500' : opp.score >= 50 ? 'border-2 border-yellow-500' : ''}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{opp.name}</h4>
                        <div className="text-3xl font-bold mt-2" style={{ color: opp.score >= 70 ? '#10b981' : opp.score >= 50 ? '#f59e0b' : '#ef4444' }}>
                          {opp.score}
                        </div>
                        <div className="text-xs text-gray-500">Opportunity Score</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpportunities(opportunities.filter(o => o.id !== opp.id))}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>Market Size: ${opp.marketSize}M</div>
                      <div>Growth Rate: {opp.growthRate}%</div>
                      <div>Competition: {opp.competition}/10</div>
                      <div>Feasibility: {opp.feasibility}/10</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Dashboard Tab */}
        {activeTab === 'analytics' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="text-sm text-gray-600 mb-2">Total Competitors</div>
                <div className="text-3xl font-bold">{competitors.length}</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-gray-600 mb-2">Market Segments</div>
                <div className="text-3xl font-bold">{segments.length}</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-gray-600 mb-2">Opportunities</div>
                <div className="text-3xl font-bold">{opportunities.length}</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-gray-600 mb-2">Avg Opportunity Score</div>
                <div className="text-3xl font-bold">
                  {opportunities.length > 0
                    ? Math.round(opportunities.reduce((sum, o) => sum + o.score, 0) / opportunities.length)
                    : 0}
                </div>
              </Card>
            </div>

            {segments.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">Segment Growth Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={segments.map(s => ({ name: s.name, growth: s.growthRate }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="growth" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {opportunities.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">Opportunity Score Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={opportunities.map(o => ({ name: o.name, score: o.score }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Research Templates</h3>
              <p className="text-sm text-gray-600 mb-6">
                Start with pre-configured templates for common industries
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:border-primary-500 transition-all">
                  <div className="cursor-pointer" onClick={() => loadTemplate('saas')}>
                    <div className="bg-blue-50 text-blue-600 p-4 rounded-lg w-fit mb-4">
                    <Code className="h-6 w-6" />
                  </div>
                    <h4 className="font-semibold mb-2">SaaS Template</h4>
                    <p className="text-sm text-gray-600 mb-4">Pre-configured for SaaS market research</p>
                    <Badge variant="outline">SMB, Enterprise</Badge>
                  </div>
                </Card>
                <Card className="hover:border-primary-500 transition-all">
                  <div className="cursor-pointer" onClick={() => loadTemplate('ecommerce')}>
                    <div className="bg-green-50 text-green-600 p-4 rounded-lg w-fit mb-4">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-2">E-commerce Template</h4>
                    <p className="text-sm text-gray-600 mb-4">Pre-configured for e-commerce research</p>
                    <Badge variant="outline">B2C, B2B</Badge>
                  </div>
                </Card>
                <Card className="hover:border-primary-500 transition-all">
                  <div className="cursor-pointer" onClick={() => loadTemplate('fintech')}>
                    <div className="bg-purple-50 text-purple-600 p-4 rounded-lg w-fit mb-4">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-2">FinTech Template</h4>
                    <p className="text-sm text-gray-600 mb-4">Pre-configured for FinTech research</p>
                    <Badge variant="outline">Consumer, Business</Badge>
                  </div>
                </Card>
              </div>
            </Card>
          </div>
        )}

        {/* Customer Personas Tab */}
        {activeTab === 'personas' && (
          <div className="mt-6 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Customer Personas</h3>
                <Button onClick={() => setShowPersonaForm(!showPersonaForm)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Persona
                </Button>
              </div>

              {showPersonaForm && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4 mb-4">
                  <Input
                    value={newPersona.name}
                    onChange={(e) => setNewPersona({ ...newPersona, name: e.target.value })}
                    placeholder="Persona name (e.g., Tech-Savvy Manager)"
                  />
                  <Input
                    value={newPersona.age}
                    onChange={(e) => setNewPersona({ ...newPersona, age: e.target.value })}
                    placeholder="Age range (e.g., 30-45)"
                  />
                  <Input
                    value={newPersona.occupation}
                    onChange={(e) => setNewPersona({ ...newPersona, occupation: e.target.value })}
                    placeholder="Occupation"
                  />
                  <div className="flex gap-2">
                    <Button onClick={addPersona} size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save
                </Button>
                <Button 
                  variant="outline"
                      size="sm"
                      onClick={() => setShowPersonaForm(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {personas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No personas created yet. Click "Add Persona" to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personas.map((persona) => (
                    <Card key={persona.id}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{persona.name}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            Age: {persona.age} | {persona.occupation}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPersonas(personas.filter(p => p.id !== persona.id))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">Goals</div>
                          <div className="text-sm text-gray-700">
                            {persona.goals.length > 0 ? persona.goals.join(', ') : 'Not specified'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">Pain Points</div>
                          <div className="text-sm text-gray-700">
                            {persona.painPoints.length > 0 ? persona.painPoints.join(', ') : 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Survey Builder Tab */}
        {activeTab === 'survey' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Survey Question Builder</h3>
              <div className="space-y-4 mb-4">
                <Select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as any, options: e.target.value === 'multiple-choice' ? [''] : undefined })}
                  options={[
                    { value: 'multiple-choice', label: 'Multiple Choice' },
                    { value: 'text', label: 'Text' },
                    { value: 'rating', label: 'Rating' },
                    { value: 'yes-no', label: 'Yes/No' },
                  ]}
                />
                <Input
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="Enter your question"
                />
                {newQuestion.type === 'multiple-choice' && (
                  <div className="space-y-2">
                    {newQuestion.options?.map((option, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(newQuestion.options || [])]
                            newOptions[idx] = e.target.value
                            setNewQuestion({ ...newQuestion, options: newOptions })
                          }}
                          placeholder={`Option ${idx + 1}`}
                        />
                        {idx === (newQuestion.options?.length || 0) - 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setNewQuestion({ ...newQuestion, options: [...(newQuestion.options || []), ''] })}
                          >
                            <Plus className="h-4 w-4" />
                </Button>
                        )}
              </div>
                    ))}
                  </div>
                )}
                <Button onClick={addSurveyQuestion} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </Card>

            {surveyQuestions.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">Survey Questions ({surveyQuestions.length})</h3>
                <div className="space-y-4">
                  {surveyQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-500">Q{idx + 1}</span>
                            <Badge variant="outline">{q.type}</Badge>
                          </div>
                          <div className="font-medium">{q.question}</div>
                          {q.options && q.options.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {q.options.map((opt, optIdx) => (
                                <div key={optIdx} className="text-sm text-gray-600 flex items-center gap-2">
                                  <span className="w-4 h-4 border border-gray-300 rounded"></span>
                                  {opt}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSurveyQuestions(surveyQuestions.filter(sq => sq.id !== q.id))}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full" onClick={exportSurvey}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Survey
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Market Trends Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track market trends and growth patterns over time
              </p>
              {trends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No trend data available yet.</p>
                  <p className="text-sm mt-2">Trend analysis data will appear here when available.</p>
                </div>
              )}
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold mb-4">Key Market Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900 mb-1">Market Growth Potential</div>
                      <div className="text-sm text-blue-700">
                        Analyze historical data and industry reports to identify growth trends
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900 mb-1">Competitive Positioning</div>
                      <div className="text-sm text-green-700">
                        Understand your position relative to competitors in the market
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-purple-900 mb-1">Customer Insights</div>
                      <div className="text-sm text-purple-700">
                        Use personas and surveys to understand customer needs and behaviors
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </Card>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="mt-6 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Generate Research Report</h3>
            <p className="text-sm text-gray-600 mb-4">
                Create a comprehensive market research report with all your data and analysis
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={generateReport} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Text Report
              </Button>
                <Button variant="outline" onClick={() => {
                  const html = document.documentElement.outerHTML
                  const blob = new Blob([html], { type: 'text/html' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `market-research-${researchQuery || 'report'}.html`
                  a.click()
                  showToast('HTML report exported!', 'success')
                }} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export HTML Report
                </Button>
              </div>
          </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Report Sections</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Executive Summary</span>
        </div>
                  <Badge variant="new">Included</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Market Size Analysis</span>
                  </div>
                  <Badge variant={marketSizeResults ? 'new' : 'outline'}>
                    {marketSizeResults ? 'Included' : 'No Data'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Competitor Analysis</span>
                  </div>
                  <Badge variant={competitors.length > 0 ? 'new' : 'outline'}>
                    {competitors.length > 0 ? `${competitors.length} Competitors` : 'No Data'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Grid3x3 className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">SWOT Analysis</span>
                  </div>
                  <Badge variant={
                    swotAnalysis.strengths.length > 0 ||
                    swotAnalysis.weaknesses.length > 0 ||
                    swotAnalysis.opportunities.length > 0 ||
                    swotAnalysis.threats.length > 0
                      ? 'new' : 'outline'
                  }>
                    {swotAnalysis.strengths.length + swotAnalysis.weaknesses.length +
                     swotAnalysis.opportunities.length + swotAnalysis.threats.length} Items
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-pink-500" />
                    <span className="font-medium">Customer Personas</span>
                  </div>
                  <Badge variant={personas.length > 0 ? 'new' : 'outline'}>
                    {personas.length > 0 ? `${personas.length} Personas` : 'No Data'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Layers className="h-5 w-5 text-cyan-500" />
                    <span className="font-medium">Market Segmentation</span>
                  </div>
                  <Badge variant={segments.length > 0 ? 'new' : 'outline'}>
                    {segments.length > 0 ? `${segments.length} Segments` : 'No Data'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Saved Projects */}
        {savedProjects.length > 0 && (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Saved Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 cursor-pointer transition-all"
                  onClick={() => loadProject(project)}
                >
                  <div className="font-semibold mb-1">{project.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(project.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                    {project.competitors?.length > 0 && (
                      <span>{project.competitors.length} competitors</span>
                    )}
                    {project.personas?.length > 0 && (
                      <span>• {project.personas.length} personas</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
