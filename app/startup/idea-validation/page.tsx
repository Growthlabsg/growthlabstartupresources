'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Lightbulb, 
  Target, 
  Globe, 
  Rocket,
  Sparkles,
  Download,
  Save,
  CheckCircle,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  AlertCircle,
  Zap,
  Award,
  Activity,
  Calculator,
  Search as SearchIcon,
  Star,
  MessageSquare,
  Building2,
  DollarSign,
  PieChart as PieChartIcon,
  LineChart
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart as RechartsLineChart, Line } from 'recharts'

interface ProblemQuestion {
  id: string
  question: string
  answer: string
  score: number
  weight: number
}

interface SolutionTest {
  id: string
  name: string
  description: string
  feedback: string[]
  rating: number
  date: string
}

interface MVPFeature {
  id: string
  name: string
  description: string
  priority: 'must-have' | 'should-have' | 'nice-to-have'
  effort: 'low' | 'medium' | 'high'
  value: 'low' | 'medium' | 'high'
  completed: boolean
}

interface Competitor {
  id: string
  name: string
  strengths: string[]
  weaknesses: string[]
  pricing: string
  marketShare: number
}

interface LandingPage {
  id: string
  title: string
  headline: string
  description: string
  cta: string
  visitors: number
  conversions: number
  variant?: 'A' | 'B'
  testGroup?: string
  createdAt?: string
}

interface ABTest {
  id: string
  name: string
  variantA: LandingPage
  variantB: LandingPage
  status: 'draft' | 'running' | 'completed'
  startDate?: string
  endDate?: string
  trafficSplit: number // Percentage for variant A (0-100)
}

interface CustomerInterview {
  id: string
  name: string
  email: string
  date: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes: string
  insights: string[]
  rating: number
}

interface Survey {
  id: string
  title: string
  description: string
  questions: SurveyQuestion[]
  responses: number
  createdAt: string
}

interface SurveyQuestion {
  id: string
  question: string
  type: 'text' | 'multiple-choice' | 'rating' | 'yes-no'
  options?: string[]
  required: boolean
}

export default function IdeaValidationPage() {
  const [activeTab, setActiveTab] = useState('problem')
  
  // Problem Validation
  const [problemQuestions, setProblemQuestions] = useState<ProblemQuestion[]>([])
  const [problemScore, setProblemScore] = useState<number | null>(null)
  
  // Solution Testing
  const [solutionTests, setSolutionTests] = useState<SolutionTest[]>([])
  const [editingTest, setEditingTest] = useState<SolutionTest | null>(null)
  
  // MVP Planning
  const [mvpFeatures, setMvpFeatures] = useState<MVPFeature[]>([])
  const [editingFeature, setEditingFeature] = useState<MVPFeature | null>(null)
  
  // Competitive Analysis
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null)
  
  // Landing Pages
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const [editingPage, setEditingPage] = useState<LandingPage | null>(null)
  
  // A/B Tests
  const [abTests, setAbTests] = useState<ABTest[]>([])
  const [editingABTest, setEditingABTest] = useState<ABTest | null>(null)
  
  // Market Size
  const [marketSize, setMarketSize] = useState({
    tam: '',
    sam: '',
    som: ''
  })
  const [marketSizeResult, setMarketSizeResult] = useState<{tam: number, sam: number, som: number} | null>(null)

  // Customer Interviews
  const [interviews, setInterviews] = useState<CustomerInterview[]>([])
  const [editingInterview, setEditingInterview] = useState<CustomerInterview | null>(null)

  // Surveys
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null)

  const tabs = [
    { id: 'problem', label: 'Problem Validation', icon: Target },
    { id: 'solution', label: 'Solution Testing', icon: Lightbulb },
    { id: 'interviews', label: 'Customer Interviews', icon: Users },
    { id: 'surveys', label: 'Surveys', icon: MessageSquare },
    { id: 'landing', label: 'Landing Page Builder', icon: Globe },
    { id: 'mvp', label: 'MVP Planning', icon: Rocket },
    { id: 'market', label: 'Market Size', icon: Calculator },
    { id: 'competitive', label: 'Competitive Analysis', icon: Building2 },
    { id: 'dashboard', label: 'Validation Dashboard', icon: Activity },
  ]

  const defaultProblemQuestions: ProblemQuestion[] = [
    { id: '1', question: 'How frequently do people experience this problem?', answer: '', score: 0, weight: 20 },
    { id: '2', question: 'How painful is this problem for your target users?', answer: '', score: 0, weight: 25 },
    { id: '3', question: 'Are people currently paying to solve this problem?', answer: '', score: 0, weight: 20 },
    { id: '4', question: 'How many people are affected by this problem?', answer: '', score: 0, weight: 15 },
    { id: '5', question: 'Is this problem growing or shrinking?', answer: '', score: 0, weight: 10 },
    { id: '6', question: 'How much time/money do people spend on current solutions?', answer: '', score: 0, weight: 10 },
  ]

  const landingPageTemplates = [
    {
      id: 'saas',
      name: 'SaaS Product',
      headline: 'Transform Your Workflow',
      description: 'The all-in-one solution for modern teams',
      cta: 'Start Free Trial'
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      headline: 'Connect Buyers and Sellers',
      description: 'The platform that brings your community together',
      cta: 'Join Now'
    },
    {
      id: 'consumer',
      name: 'Consumer App',
      headline: 'Your Life, Simplified',
      description: 'The app that makes everyday tasks effortless',
      cta: 'Download Now'
    }
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ideaValidationData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.problemQuestions) setProblemQuestions(data.problemQuestions)
          if (data.solutionTests) setSolutionTests(data.solutionTests)
          if (data.mvpFeatures) setMvpFeatures(data.mvpFeatures)
          if (data.competitors) setCompetitors(data.competitors)
          if (data.landingPages) setLandingPages(data.landingPages)
          if (data.interviews) setInterviews(data.interviews)
          if (data.surveys) setSurveys(data.surveys)
          if (data.abTests) setAbTests(data.abTests)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      } else {
        setProblemQuestions(defaultProblemQuestions)
      }
    }
  }, [])

  const saveToLocalStorage = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('ideaValidationData') || '{}')
      data[key] = value
      localStorage.setItem('ideaValidationData', JSON.stringify(data))
    }
  }

  const updateProblemAnswer = (id: string, answer: string, score: number) => {
    const updated = problemQuestions.map(q => 
      q.id === id ? { ...q, answer, score } : q
    )
    setProblemQuestions(updated)
    saveToLocalStorage('problemQuestions', updated)
    
    // Calculate total score
    const totalScore = updated.reduce((sum, q) => sum + (q.score * q.weight / 100), 0)
    setProblemScore(totalScore)
  }

  const addSolutionTest = () => {
    const newTest: SolutionTest = {
      id: Date.now().toString(),
      name: '',
      description: '',
      feedback: [],
      rating: 0,
      date: new Date().toISOString().split('T')[0]
    }
    setEditingTest(newTest)
  }

  const saveSolutionTest = () => {
    if (!editingTest) return
    if (!editingTest.name) {
      showToast('Please enter a test name', 'error')
      return
    }

    const updated = solutionTests.find(t => t.id === editingTest.id)
      ? solutionTests.map(t => t.id === editingTest.id ? editingTest : t)
      : [...solutionTests, editingTest]

    setSolutionTests(updated)
    saveToLocalStorage('solutionTests', updated)
    setEditingTest(null)
    showToast('Solution test saved!', 'success')
  }

  const addMVPFeature = () => {
    const newFeature: MVPFeature = {
      id: Date.now().toString(),
      name: '',
      description: '',
      priority: 'should-have',
      effort: 'medium',
      value: 'medium',
      completed: false
    }
    setEditingFeature(newFeature)
  }

  const saveMVPFeature = () => {
    if (!editingFeature) return
    if (!editingFeature.name) {
      showToast('Please enter a feature name', 'error')
      return
    }

    const updated = mvpFeatures.find(f => f.id === editingFeature.id)
      ? mvpFeatures.map(f => f.id === editingFeature.id ? editingFeature : f)
      : [...mvpFeatures, editingFeature]

    setMvpFeatures(updated)
    saveToLocalStorage('mvpFeatures', updated)
    setEditingFeature(null)
    showToast('Feature saved!', 'success')
  }

  const toggleFeatureComplete = (id: string) => {
    const updated = mvpFeatures.map(f => 
      f.id === id ? { ...f, completed: !f.completed } : f
    )
    setMvpFeatures(updated)
    saveToLocalStorage('mvpFeatures', updated)
  }

  const addCompetitor = () => {
    const newCompetitor: Competitor = {
      id: Date.now().toString(),
      name: '',
      strengths: [],
      weaknesses: [],
      pricing: '',
      marketShare: 0
    }
    setEditingCompetitor(newCompetitor)
  }

  const saveCompetitor = () => {
    if (!editingCompetitor) return
    if (!editingCompetitor.name) {
      showToast('Please enter a competitor name', 'error')
      return
    }

    const updated = competitors.find(c => c.id === editingCompetitor.id)
      ? competitors.map(c => c.id === editingCompetitor.id ? editingCompetitor : c)
      : [...competitors, editingCompetitor]

    setCompetitors(updated)
    saveToLocalStorage('competitors', updated)
    setEditingCompetitor(null)
    showToast('Competitor saved!', 'success')
  }

  const createLandingPage = () => {
    const newPage: LandingPage = {
      id: Date.now().toString(),
      title: '',
      headline: '',
      description: '',
      cta: '',
      visitors: 0,
      conversions: 0,
      createdAt: new Date().toISOString()
    }
    setEditingPage(newPage)
  }

  const createABTest = () => {
    const variantA: LandingPage = {
      id: `A-${Date.now()}`,
      title: 'Variant A',
      headline: '',
      description: '',
      cta: '',
      visitors: 0,
      conversions: 0,
      variant: 'A',
      createdAt: new Date().toISOString()
    }
    const variantB: LandingPage = {
      id: `B-${Date.now()}`,
      title: 'Variant B',
      headline: '',
      description: '',
      cta: '',
      visitors: 0,
      conversions: 0,
      variant: 'B',
      createdAt: new Date().toISOString()
    }
    const newTest: ABTest = {
      id: Date.now().toString(),
      name: '',
      variantA,
      variantB,
      status: 'draft',
      trafficSplit: 50
    }
    setEditingABTest(newTest)
  }

  const saveABTest = () => {
    if (!editingABTest) return
    if (!editingABTest.name) {
      showToast('Please enter a test name', 'error')
      return
    }

    const updated = abTests.find(t => t.id === editingABTest.id)
      ? abTests.map(t => t.id === editingABTest.id ? editingABTest : t)
      : [...abTests, editingABTest]

    setAbTests(updated)
    saveToLocalStorage('abTests', updated)
    setEditingABTest(null)
    showToast('A/B test saved!', 'success')
  }

  const deleteABTest = (id: string) => {
    const updated = abTests.filter(t => t.id !== id)
    setAbTests(updated)
    saveToLocalStorage('abTests', updated)
    showToast('A/B test deleted', 'info')
  }

  const getConversionRate = (page: LandingPage) => {
    return page.visitors > 0 ? ((page.conversions / page.visitors) * 100).toFixed(2) : '0.00'
  }

  const getTestWinner = (test: ABTest) => {
    const rateA = parseFloat(getConversionRate(test.variantA))
    const rateB = parseFloat(getConversionRate(test.variantB))
    if (rateA > rateB) return 'A'
    if (rateB > rateA) return 'B'
    return 'tie'
  }

  const saveLandingPage = () => {
    if (!editingPage) return
    if (!editingPage.title) {
      showToast('Please enter a page title', 'error')
      return
    }

    const updated = landingPages.find(p => p.id === editingPage.id)
      ? landingPages.map(p => p.id === editingPage.id ? editingPage : p)
      : [...landingPages, editingPage]

    setLandingPages(updated)
    saveToLocalStorage('landingPages', updated)
    setEditingPage(null)
    showToast('Landing page saved!', 'success')
  }

  const calculateMarketSize = () => {
    const tam = parseFloat(marketSize.tam)
    const sam = parseFloat(marketSize.sam)
    const som = parseFloat(marketSize.som)

    if (!tam || !sam || !som) {
      showToast('Please fill in all market size fields', 'error')
      return
    }

    setMarketSizeResult({ tam, sam, som })
    showToast('Market size calculated!', 'success')
  }

  const exportData = () => {
    const data = {
      problemQuestions,
      problemScore,
      solutionTests,
      mvpFeatures,
      competitors,
      landingPages,
      marketSize: marketSizeResult,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `idea-validation-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  const validationScore = () => {
    let score = 0
    let maxScore = 0

    // Problem validation (40%)
    if (problemScore !== null) {
      score += problemScore * 0.4
      maxScore += 100 * 0.4
    }

    // Solution tests (30%)
    if (solutionTests.length > 0) {
      const avgRating = solutionTests.reduce((sum, t) => sum + t.rating, 0) / solutionTests.length
      score += (avgRating / 5) * 100 * 0.3
      maxScore += 100 * 0.3
    }

    // MVP progress (20%)
    if (mvpFeatures.length > 0) {
      const completed = mvpFeatures.filter(f => f.completed).length
      score += (completed / mvpFeatures.length) * 100 * 0.2
      maxScore += 100 * 0.2
    }

    // Competitive analysis (10%)
    if (competitors.length > 0) {
      score += Math.min(competitors.length * 10, 100) * 0.1
      maxScore += 100 * 0.1
    }

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  }

  const addInterview = () => {
    const newInterview: CustomerInterview = {
      id: Date.now().toString(),
      name: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      status: 'scheduled',
      notes: '',
      insights: [],
      rating: 0
    }
    setEditingInterview(newInterview)
  }

  const saveInterview = () => {
    if (!editingInterview) return
    if (!editingInterview.name || !editingInterview.email) {
      showToast('Please enter name and email', 'error')
      return
    }

    const updated = interviews.find(i => i.id === editingInterview.id)
      ? interviews.map(i => i.id === editingInterview.id ? editingInterview : i)
      : [...interviews, editingInterview]

    setInterviews(updated)
    saveToLocalStorage('interviews', updated)
    setEditingInterview(null)
    showToast('Interview saved!', 'success')
  }

  const deleteInterview = (id: string) => {
    const updated = interviews.filter(i => i.id !== id)
    setInterviews(updated)
    saveToLocalStorage('interviews', updated)
    showToast('Interview deleted', 'info')
  }

  const addSurvey = () => {
    const newSurvey: Survey = {
      id: Date.now().toString(),
      title: '',
      description: '',
      questions: [],
      responses: 0,
      createdAt: new Date().toISOString()
    }
    setEditingSurvey(newSurvey)
  }

  const saveSurvey = () => {
    if (!editingSurvey) return
    if (!editingSurvey.title) {
      showToast('Please enter a survey title', 'error')
      return
    }

    const updated = surveys.find(s => s.id === editingSurvey.id)
      ? surveys.map(s => s.id === editingSurvey.id ? editingSurvey : s)
      : [...surveys, editingSurvey]

    setSurveys(updated)
    saveToLocalStorage('surveys', updated)
    setEditingSurvey(null)
    showToast('Survey saved!', 'success')
  }

  const deleteSurvey = (id: string) => {
    const updated = surveys.filter(s => s.id !== id)
    setSurveys(updated)
    saveToLocalStorage('surveys', updated)
    showToast('Survey deleted', 'info')
  }

  const addSurveyQuestion = (surveyId: string) => {
    if (!editingSurvey || editingSurvey.id !== surveyId) return
    
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'text',
      required: false
    }
    setEditingSurvey({
      ...editingSurvey,
      questions: [...editingSurvey.questions, newQuestion]
    })
  }

  const updateSurveyQuestion = (surveyId: string, questionId: string, updates: Partial<SurveyQuestion>) => {
    if (!editingSurvey || editingSurvey.id !== surveyId) return
    
    setEditingSurvey({
      ...editingSurvey,
      questions: editingSurvey.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    })
  }

  const deleteSurveyQuestion = (surveyId: string, questionId: string) => {
    if (!editingSurvey || editingSurvey.id !== surveyId) return
    
    setEditingSurvey({
      ...editingSurvey,
      questions: editingSurvey.questions.filter(q => q.id !== questionId)
    })
  }

  const scoreData = [
    { name: 'Problem Validation', value: problemScore || 0, max: 100 },
    { name: 'Solution Testing', value: solutionTests.length > 0 ? (solutionTests.reduce((sum, t) => sum + t.rating, 0) / solutionTests.length / 5 * 100) : 0, max: 100 },
    { name: 'MVP Progress', value: mvpFeatures.length > 0 ? (mvpFeatures.filter(f => f.completed).length / mvpFeatures.length * 100) : 0, max: 100 },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
              Idea Validation Toolkit
            </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Validate your startup idea with comprehensive tools for problem validation, solution testing, MVP planning, and market analysis.
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

        {/* Problem Validation Tab */}
        {activeTab === 'problem' && (
          <div className="space-y-6">
          <Card>
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Problem Validation</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Validate that the problem you're solving is real, painful, and worth solving.
              </p>

              {problemScore !== null && (
                <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Problem Validation Score</p>
                    <p className="text-4xl font-bold text-primary-600 mb-2">
                      {problemScore.toFixed(0)}/100
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${problemScore}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      {problemScore >= 70 ? 'Strong problem validation! ✅' :
                       problemScore >= 50 ? 'Moderate validation - consider refining' :
                       'Weak validation - problem may need redefinition'}
                    </p>
                  </div>
                </Card>
              )}

              <div className="space-y-4">
                {problemQuestions.map((question) => (
                  <Card key={question.id} className="p-4">
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-semibold">{question.question}</label>
                        <Badge variant="outline" className="text-xs">{question.weight}% weight</Badge>
                      </div>
                      <Input
                        value={question.answer}
                        onChange={(e) => {
                          const answer = e.target.value
                          // Simple scoring based on answer length and keywords
                          let score = 0
                          if (answer.length > 50) score += 30
                          if (answer.toLowerCase().includes('daily') || answer.toLowerCase().includes('often')) score += 30
                          if (answer.toLowerCase().includes('painful') || answer.toLowerCase().includes('frustrating')) score += 20
                          if (answer.toLowerCase().includes('pay') || answer.toLowerCase().includes('money')) score += 20
                          updateProblemAnswer(question.id, answer, Math.min(score, 100))
                        }}
                        placeholder="Enter your answer..."
                      />
                    </div>
                    {question.answer && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Score:</span>
                        <span className="font-medium">{question.score}/100</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${question.score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Solution Testing Tab */}
        {activeTab === 'solution' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Solution Testing</h2>
                </div>
                <Button onClick={addSolutionTest} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Test
                </Button>
              </div>

              {solutionTests.length === 0 && !editingTest ? (
                <div className="text-center py-12">
                  <Lightbulb className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Solution Tests Yet</h3>
                  <p className="text-gray-600 mb-6">Start testing your solution with real users</p>
                  <Button onClick={addSolutionTest}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Test
                  </Button>
                </div>
              ) : (
                <>
                  {solutionTests.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {solutionTests.map((test) => (
                        <Card key={test.id} className="p-4 hover:shadow-lg transition-all">
                          <div className="flex items-start justify-between mb-2 cursor-pointer" onClick={() => setEditingTest(test)}>
                            <h4 className="font-semibold flex-1">{test.name}</h4>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">{test.rating}/5</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{test.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{test.feedback.length} feedback items</span>
                            <span>{new Date(test.date).toLocaleDateString()}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {editingTest && (
          <Card>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold flex-1">Solution Test Details</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingTest(null)} className="shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                          <Input
                            value={editingTest.name}
                            onChange={(e) => setEditingTest({ ...editingTest, name: e.target.value })}
                            placeholder="e.g., Prototype Testing Round 1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                            rows={3}
                            value={editingTest.description}
                            onChange={(e) => setEditingTest({ ...editingTest, description: e.target.value })}
                            placeholder="Describe what you're testing..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => setEditingTest({ ...editingTest, rating })}
                                className={`p-2 rounded-lg ${
                                  editingTest.rating >= rating
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                <Star className="h-5 w-5" fill={editingTest.rating >= rating ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                          </div>
                        </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={saveSolutionTest} className="flex-1 min-w-[120px]">
                        Save Test
                      </Button>
                      <Button variant="outline" onClick={() => setEditingTest(null)} className="shrink-0">
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

        {/* Customer Interviews Tab */}
        {activeTab === 'interviews' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Customer Interviews</h2>
                </div>
                <Button onClick={addInterview} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>

              {interviews.length === 0 && !editingInterview ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Interviews Scheduled</h3>
                  <p className="text-gray-600 mb-6">Start conducting customer interviews to validate your idea</p>
                  <Button onClick={addInterview}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule First Interview
                  </Button>
                </div>
              ) : (
                <>
                  {interviews.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {interviews.map((interview) => (
                        <Card key={interview.id} className="p-4 hover:shadow-lg transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{interview.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{interview.email}</p>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge 
                                  variant={interview.status === 'completed' ? 'beginner' : interview.status === 'scheduled' ? 'outline' : 'featured'}
                                >
                                  {interview.status}
                                </Badge>
                                <span className="text-xs text-gray-500">{interview.date}</span>
                              </div>
                              {interview.rating > 0 && (
                                <div className="flex items-center gap-1 mb-2">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span className="text-sm">{interview.rating}/5</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingInterview(interview)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteInterview(interview.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {interview.insights.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="text-xs font-semibold text-gray-600 mb-1">Key Insights:</div>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {interview.insights.slice(0, 2).map((insight, idx) => (
                                  <li key={idx}>• {insight}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}

                  {editingInterview && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {editingInterview.id && interviews.find(i => i.id === editingInterview.id) ? 'Edit Interview' : 'New Interview'}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingInterview(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                            <Input
                              value={editingInterview.name}
                              onChange={(e) => setEditingInterview({ ...editingInterview, name: e.target.value })}
                              placeholder="Customer name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <Input
                              type="email"
                              value={editingInterview.email}
                              onChange={(e) => setEditingInterview({ ...editingInterview, email: e.target.value })}
                              placeholder="customer@example.com"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <Input
                              type="date"
                              value={editingInterview.date}
                              onChange={(e) => setEditingInterview({ ...editingInterview, date: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <Select
                              value={editingInterview.status}
                              onChange={(e) => setEditingInterview({ ...editingInterview, status: e.target.value as any })}
                              options={[
                                { value: 'scheduled', label: 'Scheduled' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' }
                              ]}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                          <textarea
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                            rows={4}
                            value={editingInterview.notes}
                            onChange={(e) => setEditingInterview({ ...editingInterview, notes: e.target.value })}
                            placeholder="Interview notes and observations..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setEditingInterview({ ...editingInterview, rating })}
                                className={`p-2 rounded ${
                                  editingInterview.rating >= rating
                                    ? 'text-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              >
                                <Star className={`h-5 w-5 ${editingInterview.rating >= rating ? 'fill-current' : ''}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Key Insights</label>
                          <div className="space-y-2">
                            {editingInterview.insights.map((insight, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Input
                                  value={insight}
                                  onChange={(e) => {
                                    const updated = [...editingInterview.insights]
                                    updated[idx] = e.target.value
                                    setEditingInterview({ ...editingInterview, insights: updated })
                                  }}
                                  placeholder="Key insight..."
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updated = editingInterview.insights.filter((_, i) => i !== idx)
                                    setEditingInterview({ ...editingInterview, insights: updated })
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
            <Button 
              variant="outline" 
              size="sm" 
                              onClick={() => setEditingInterview({ ...editingInterview, insights: [...editingInterview.insights, ''] })}
            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Insight
            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveInterview} className="flex-1">
                            Save Interview
                          </Button>
                          <Button variant="outline" onClick={() => setEditingInterview(null)}>
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

        {/* Surveys Tab */}
        {activeTab === 'surveys' && (
          <div className="space-y-6">
          <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Surveys</h2>
                </div>
                <Button onClick={addSurvey} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Survey
                </Button>
              </div>

              {surveys.length === 0 && !editingSurvey ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Surveys Yet</h3>
                  <p className="text-gray-600 mb-6">Create surveys to gather quantitative feedback</p>
                  <Button onClick={addSurvey}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Survey
                  </Button>
                </div>
              ) : (
                <>
                  {surveys.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {surveys.map((survey) => (
                        <Card key={survey.id} className="p-4 hover:shadow-lg transition-all">
                          <div className="flex items-start justify-between mb-3 cursor-pointer" onClick={() => setEditingSurvey(survey)}>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{survey.title}</h4>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{survey.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{survey.questions.length} questions</span>
                                <span>{survey.responses} responses</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteSurvey(survey.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {editingSurvey && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {editingSurvey.id && surveys.find(s => s.id === editingSurvey.id) ? 'Edit Survey' : 'New Survey'}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingSurvey(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Survey Title *</label>
                          <Input
                            value={editingSurvey.title}
                            onChange={(e) => setEditingSurvey({ ...editingSurvey, title: e.target.value })}
                            placeholder="e.g., Customer Problem Validation Survey"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                            rows={3}
                            value={editingSurvey.description}
                            onChange={(e) => setEditingSurvey({ ...editingSurvey, description: e.target.value })}
                            placeholder="Survey description..."
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">Questions</label>
            <Button 
              variant="outline" 
              size="sm" 
                              onClick={() => addSurveyQuestion(editingSurvey.id)}
            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Question
            </Button>
                          </div>
                          <div className="space-y-3">
                            {editingSurvey.questions.map((question, idx) => (
                              <Card key={question.id} className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <span className="text-sm font-medium text-gray-600">Question {idx + 1}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteSurveyQuestion(editingSurvey.id, question.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="space-y-3">
                                  <Input
                                    value={question.question}
                                    onChange={(e) => updateSurveyQuestion(editingSurvey.id, question.id, { question: e.target.value })}
                                    placeholder="Enter question..."
                                  />
                                  <Select
                                    value={question.type}
                                    onChange={(e) => updateSurveyQuestion(editingSurvey.id, question.id, { type: e.target.value as any })}
                                    options={[
                                      { value: 'text', label: 'Text' },
                                      { value: 'multiple-choice', label: 'Multiple Choice' },
                                      { value: 'rating', label: 'Rating' },
                                      { value: 'yes-no', label: 'Yes/No' }
                                    ]}
                                  />
                                  {question.type === 'multiple-choice' && (
                                    <div className="space-y-2">
                                      <label className="text-xs text-gray-600">Options (one per line)</label>
                                      <textarea
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                                        rows={3}
                                        value={question.options?.join('\n') || ''}
                                        onChange={(e) => updateSurveyQuestion(editingSurvey.id, question.id, { 
                                          options: e.target.value.split('\n').filter(o => o.trim()) 
                                        })}
                                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                                      />
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={question.required}
                                      onChange={(e) => updateSurveyQuestion(editingSurvey.id, question.id, { required: e.target.checked })}
                                      className="rounded"
                                    />
                                    <label className="text-sm text-gray-600">Required</label>
                                  </div>
                                </div>
          </Card>
                            ))}
                            {editingSurvey.questions.length === 0 && (
                              <div className="text-center py-8 text-gray-400">
                                <p>No questions yet. Add your first question above.</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveSurvey} className="flex-1">
                            Save Survey
                          </Button>
                          <Button variant="outline" onClick={() => setEditingSurvey(null)}>
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

        {/* Landing Page Builder Tab */}
        {activeTab === 'landing' && (
          <div className="space-y-6">
          <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Landing Page Builder</h2>
                </div>
                <Button onClick={createLandingPage} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Page
            </Button>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-4">Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {landingPageTemplates.map((template) => (
                    <Card key={template.id} className="p-4 hover:shadow-lg transition-all">
                      <div className="cursor-pointer" onClick={() => {
                        const newPage: LandingPage = {
                          id: Date.now().toString(),
                          title: template.name,
                          headline: template.headline,
                          description: template.description,
                          cta: template.cta,
                          visitors: 0,
                          conversions: 0
                        }
                        setEditingPage(newPage)
                      }}>
                        <h4 className="font-semibold mb-2">{template.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{template.headline}</p>
                        <Badge variant="outline" className="text-xs">Use Template</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {editingPage && (
          <Card>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold flex-1">Landing Page Editor</h3>
                      <Button variant="ghost" size="sm" onClick={() => setEditingPage(null)} className="shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                      <Input
                        value={editingPage.title}
                        onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                        placeholder="e.g., Product Launch Page"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                      <Input
                        value={editingPage.headline}
                        onChange={(e) => setEditingPage({ ...editingPage, headline: e.target.value })}
                        placeholder="e.g., Transform Your Workflow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                        rows={4}
                        value={editingPage.description}
                        onChange={(e) => setEditingPage({ ...editingPage, description: e.target.value })}
                        placeholder="Describe your product or service..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action Button</label>
                      <Input
                        value={editingPage.cta}
                        onChange={(e) => setEditingPage({ ...editingPage, cta: e.target.value })}
                        placeholder="e.g., Start Free Trial"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Visitors</label>
                        <Input
                          type="number"
                          value={editingPage.visitors}
                          onChange={(e) => setEditingPage({ ...editingPage, visitors: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Conversions</label>
                        <Input
                          type="number"
                          value={editingPage.conversions}
                          onChange={(e) => setEditingPage({ ...editingPage, conversions: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    {editingPage.visitors > 0 && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
                        <div className="text-2xl font-bold text-primary-600">
                          {((editingPage.conversions / editingPage.visitors) * 100).toFixed(2)}%
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={saveLandingPage} className="flex-1 min-w-[140px]">
                        Save Landing Page
                      </Button>
                      <Button variant="outline" onClick={() => setEditingPage(null)} className="shrink-0">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {landingPages.length > 0 && (
                <Card className="mt-6">
                  <h3 className="font-semibold mb-4">Your Landing Pages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {landingPages.map((page) => (
                      <Card key={page.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{page.title}</h4>
            <Button 
                            variant="ghost"
              size="sm" 
                            onClick={() => {
                              const updated = landingPages.filter(p => p.id !== page.id)
                              setLandingPages(updated)
                              saveToLocalStorage('landingPages', updated)
                              showToast('Page deleted', 'success')
                            }}
            >
                            <Trash2 className="h-4 w-4" />
            </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{page.headline}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{page.visitors} visitors</span>
                          <span>{page.conversions} conversions</span>
                          {page.visitors > 0 && (
                            <span className="font-medium">
                              {((page.conversions / page.visitors) * 100).toFixed(1)}% rate
                            </span>
                          )}
                        </div>
          </Card>
                    ))}
                  </div>
                </Card>
              )}

              {/* A/B Testing Section */}
              <Card className="mt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-primary-500 shrink-0" />
                    <h3 className="text-xl font-bold">A/B Testing</h3>
                  </div>
                  <Button onClick={createABTest} size="sm" className="shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    New A/B Test
                  </Button>
                </div>

                {abTests.length === 0 && !editingABTest ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No A/B tests yet. Create one to compare landing page variants.</p>
                  </div>
                ) : (
                  <>
                    {abTests.length > 0 && (
                      <div className="space-y-4 mb-6">
                        {abTests.map((test) => {
                          const winner = getTestWinner(test)
                          const rateA = getConversionRate(test.variantA)
                          const rateB = getConversionRate(test.variantB)
                          return (
                            <Card key={test.id} className="p-4 hover:shadow-lg transition-all">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{test.name}</h4>
                                    <Badge variant={test.status === 'running' ? 'beginner' : test.status === 'completed' ? 'outline' : 'featured'}>
                                      {test.status}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                      <div className="text-xs text-gray-600 mb-1">Variant A</div>
                                      <div className="text-lg font-bold">{rateA}%</div>
                                      <div className="text-xs text-gray-500">
                                        {test.variantA.visitors} visitors, {test.variantA.conversions} conversions
                                      </div>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                      <div className="text-xs text-gray-600 mb-1">Variant B</div>
                                      <div className="text-lg font-bold">{rateB}%</div>
                                      <div className="text-xs text-gray-500">
                                        {test.variantB.visitors} visitors, {test.variantB.conversions} conversions
                                      </div>
                                    </div>
                                  </div>
                                  {test.status === 'completed' && winner !== 'tie' && (
                                    <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                                      <div className="text-sm font-semibold text-yellow-800">
                                        Winner: Variant {winner} ({winner === 'A' ? rateA : rateB}% conversion rate)
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingABTest(test)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteABTest(test.id)}
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

                    {editingABTest && (
                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">
                            {editingABTest.id && abTests.find(t => t.id === editingABTest.id) ? 'Edit A/B Test' : 'New A/B Test'}
                          </h3>
                          <Button variant="ghost" size="sm" onClick={() => setEditingABTest(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Test Name *</label>
                            <Input
                              value={editingABTest.name}
                              onChange={(e) => setEditingABTest({ ...editingABTest, name: e.target.value })}
                              placeholder="e.g., Headline A/B Test"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Traffic Split (Variant A %)</label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={editingABTest.trafficSplit}
                              onChange={(e) => setEditingABTest({ ...editingABTest, trafficSplit: parseInt(e.target.value) || 50 })}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Variant A: {editingABTest.trafficSplit}% | Variant B: {100 - editingABTest.trafficSplit}%
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <Select
                              value={editingABTest.status}
                              onChange={(e) => setEditingABTest({ ...editingABTest, status: e.target.value as any })}
                              options={[
                                { value: 'draft', label: 'Draft' },
                                { value: 'running', label: 'Running' },
                                { value: 'completed', label: 'Completed' }
                              ]}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3">Variant A</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Headline</label>
                                  <Input
                                    value={editingABTest.variantA.headline}
                                    onChange={(e) => setEditingABTest({
                                      ...editingABTest,
                                      variantA: { ...editingABTest.variantA, headline: e.target.value }
                                    })}
                                    placeholder="Headline for variant A"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">CTA Button</label>
                                  <Input
                                    value={editingABTest.variantA.cta}
                                    onChange={(e) => setEditingABTest({
                                      ...editingABTest,
                                      variantA: { ...editingABTest.variantA, cta: e.target.value }
                                    })}
                                    placeholder="Call to action text"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Visitors</label>
                                    <Input
                                      type="number"
                                      value={editingABTest.variantA.visitors}
                                      onChange={(e) => setEditingABTest({
                                        ...editingABTest,
                                        variantA: { ...editingABTest.variantA, visitors: parseInt(e.target.value) || 0 }
                                      })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Conversions</label>
                                    <Input
                                      type="number"
                                      value={editingABTest.variantA.conversions}
                                      onChange={(e) => setEditingABTest({
                                        ...editingABTest,
                                        variantA: { ...editingABTest.variantA, conversions: parseInt(e.target.value) || 0 }
                                      })}
                                    />
                                  </div>
                                </div>
                                {editingABTest.variantA.visitors > 0 && (
                                  <div className="p-2 bg-blue-50 rounded text-sm">
                                    Conversion Rate: {getConversionRate(editingABTest.variantA)}%
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3">Variant B</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Headline</label>
                                  <Input
                                    value={editingABTest.variantB.headline}
                                    onChange={(e) => setEditingABTest({
                                      ...editingABTest,
                                      variantB: { ...editingABTest.variantB, headline: e.target.value }
                                    })}
                                    placeholder="Headline for variant B"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">CTA Button</label>
                                  <Input
                                    value={editingABTest.variantB.cta}
                                    onChange={(e) => setEditingABTest({
                                      ...editingABTest,
                                      variantB: { ...editingABTest.variantB, cta: e.target.value }
                                    })}
                                    placeholder="Call to action text"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Visitors</label>
                                    <Input
                                      type="number"
                                      value={editingABTest.variantB.visitors}
                                      onChange={(e) => setEditingABTest({
                                        ...editingABTest,
                                        variantB: { ...editingABTest.variantB, visitors: parseInt(e.target.value) || 0 }
                                      })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 mb-1">Conversions</label>
                                    <Input
                                      type="number"
                                      value={editingABTest.variantB.conversions}
                                      onChange={(e) => setEditingABTest({
                                        ...editingABTest,
                                        variantB: { ...editingABTest.variantB, conversions: parseInt(e.target.value) || 0 }
                                      })}
                                    />
                                  </div>
                                </div>
                                {editingABTest.variantB.visitors > 0 && (
                                  <div className="p-2 bg-green-50 rounded text-sm">
                                    Conversion Rate: {getConversionRate(editingABTest.variantB)}%
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={saveABTest} className="flex-1">
                              Save A/B Test
                            </Button>
                            <Button variant="outline" onClick={() => setEditingABTest(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </>
                )}
              </Card>
            </Card>
          </div>
        )}

        {/* MVP Planning Tab */}
        {activeTab === 'mvp' && (
          <div className="space-y-6">
          <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Rocket className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">MVP Planning</h2>
                </div>
                <Button onClick={addMVPFeature} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              {mvpFeatures.length === 0 && !editingFeature ? (
                <div className="text-center py-12">
                  <Rocket className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Features Yet</h3>
                  <p className="text-gray-600 mb-6">Start planning your MVP features</p>
                  <Button onClick={addMVPFeature}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Feature
                  </Button>
                </div>
              ) : (
                <>
                  {mvpFeatures.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">MVP Progress</span>
                        <span className="text-sm font-medium">
                          {mvpFeatures.filter(f => f.completed).length} / {mvpFeatures.length} completed
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(mvpFeatures.filter(f => f.completed).length / mvpFeatures.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 mb-6">
                    {mvpFeatures.map((feature) => (
                      <Card key={feature.id} className="p-4">
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => toggleFeatureComplete(feature.id)}
                            className="mt-1 shrink-0"
                          >
                            {feature.completed ? (
                              <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-semibold">{feature.name}</h4>
                              <Badge variant={
                                feature.priority === 'must-have' ? 'new' :
                                feature.priority === 'should-have' ? 'outline' : 'outline'
                              } className="text-xs">
                                {feature.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Effort: {feature.effort}</span>
                              <span>Value: {feature.value}</span>
                            </div>
                          </div>
            <Button 
                            variant="ghost"
              size="sm" 
                            onClick={() => setEditingFeature(feature)}
                            className="shrink-0"
            >
                            <Edit className="h-4 w-4" />
            </Button>
                        </div>
          </Card>
                    ))}
        </div>

                  {editingFeature && (
                    <Card>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold flex-1">Feature Details</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingFeature(null)} className="shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Feature Name</label>
                          <Input
                            value={editingFeature.name}
                            onChange={(e) => setEditingFeature({ ...editingFeature, name: e.target.value })}
                            placeholder="e.g., User Authentication"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                            rows={3}
                            value={editingFeature.description}
                            onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                            placeholder="Describe the feature..."
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <Select
                              value={editingFeature.priority}
                              onChange={(e) => setEditingFeature({ ...editingFeature, priority: e.target.value as MVPFeature['priority'] })}
                              options={[
                                { value: 'must-have', label: 'Must Have' },
                                { value: 'should-have', label: 'Should Have' },
                                { value: 'nice-to-have', label: 'Nice to Have' },
                              ]}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Effort</label>
                            <Select
                              value={editingFeature.effort}
                              onChange={(e) => setEditingFeature({ ...editingFeature, effort: e.target.value as MVPFeature['effort'] })}
                              options={[
                                { value: 'low', label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high', label: 'High' },
                              ]}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                            <Select
                              value={editingFeature.value}
                              onChange={(e) => setEditingFeature({ ...editingFeature, value: e.target.value as MVPFeature['value'] })}
                              options={[
                                { value: 'low', label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high', label: 'High' },
                              ]}
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={saveMVPFeature} className="flex-1 min-w-[120px]">
                            Save Feature
                          </Button>
                          <Button variant="outline" onClick={() => setEditingFeature(null)} className="shrink-0">
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

        {/* Market Size Tab */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Market Size Calculator</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Calculate TAM (Total Addressable Market), SAM (Serviceable Addressable Market), and SOM (Serviceable Obtainable Market).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">TAM - Total Addressable Market ($)</label>
                    <Input
                      type="number"
                      value={marketSize.tam}
                      onChange={(e) => setMarketSize({ ...marketSize, tam: e.target.value })}
                      placeholder="e.g., 1000000000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total market demand for your product/service</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SAM - Serviceable Addressable Market ($)</label>
                    <Input
                      type="number"
                      value={marketSize.sam}
                      onChange={(e) => setMarketSize({ ...marketSize, sam: e.target.value })}
                      placeholder="e.g., 500000000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Segment of TAM you can actually serve</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SOM - Serviceable Obtainable Market ($)</label>
                    <Input
                      type="number"
                      value={marketSize.som}
                      onChange={(e) => setMarketSize({ ...marketSize, som: e.target.value })}
                      placeholder="e.g., 50000000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Realistic market share you can capture</p>
                  </div>
                  <Button onClick={calculateMarketSize} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Market Size
            </Button>
                </div>

                {marketSizeResult && (
                  <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50">
                    <h3 className="font-semibold mb-4">Market Size Analysis</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">TAM</div>
                        <div className="text-2xl font-bold text-primary-600">
                          ${marketSizeResult.tam.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">SAM</div>
                        <div className="text-2xl font-bold text-primary-600">
                          ${marketSizeResult.sam.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {(marketSizeResult.sam / marketSizeResult.tam * 100).toFixed(1)}% of TAM
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">SOM</div>
                        <div className="text-2xl font-bold text-primary-600">
                          ${marketSizeResult.som.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {(marketSizeResult.som / marketSizeResult.sam * 100).toFixed(1)}% of SAM
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
          </Card>
          </div>
        )}

        {/* Competitive Analysis Tab */}
        {activeTab === 'competitive' && (
          <div className="space-y-6">
          <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Competitive Analysis</h2>
                </div>
                <Button onClick={addCompetitor} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competitor
                </Button>
              </div>

              {competitors.length === 0 && !editingCompetitor ? (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Competitors Added</h3>
                  <p className="text-gray-600 mb-6">Start analyzing your competition</p>
                  <Button onClick={addCompetitor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Competitor
                  </Button>
                </div>
              ) : (
                <>
                  {competitors.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {competitors.map((competitor) => (
                        <Card key={competitor.id} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{competitor.name}</h4>
            <Button 
                              variant="ghost"
              size="sm" 
                              onClick={() => {
                                const updated = competitors.filter(c => c.id !== competitor.id)
                                setCompetitors(updated)
                                saveToLocalStorage('competitors', updated)
                                showToast('Competitor deleted', 'success')
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Pricing: {competitor.pricing}</div>
                            <div>Market Share: {competitor.marketShare}%</div>
                            <div className="mt-2">
                              <div className="font-medium text-xs mb-1">Strengths:</div>
                              <ul className="text-xs space-y-0.5">
                                {competitor.strengths.slice(0, 2).map((s, i) => (
                                  <li key={i}>• {s}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {editingCompetitor && (
                    <Card>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold flex-1">Competitor Details</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingCompetitor(null)} className="shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Competitor Name</label>
                          <Input
                            value={editingCompetitor.name}
                            onChange={(e) => setEditingCompetitor({ ...editingCompetitor, name: e.target.value })}
                            placeholder="e.g., Competitor Inc."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
                          <Input
                            value={editingCompetitor.pricing}
                            onChange={(e) => setEditingCompetitor({ ...editingCompetitor, pricing: e.target.value })}
                            placeholder="e.g., $99/month"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Market Share (%)</label>
                          <Input
                            type="number"
                            value={editingCompetitor.marketShare}
                            onChange={(e) => setEditingCompetitor({ ...editingCompetitor, marketShare: parseFloat(e.target.value) || 0 })}
                            placeholder="e.g., 15"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={saveCompetitor} className="flex-1">
                            Save Competitor
                          </Button>
                          <Button variant="outline" onClick={() => setEditingCompetitor(null)}>
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

        {/* Validation Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Activity className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Validation Dashboard</h2>
              </div>

              <div className="mb-6">
                <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Overall Validation Score</p>
                    <p className="text-5xl font-bold text-primary-600 mb-4">
                      {validationScore()}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-primary-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${validationScore()}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      {validationScore() >= 70 ? 'Strong validation! Ready to proceed ✅' :
                       validationScore() >= 50 ? 'Moderate validation - continue refining' :
                       'Early stage - focus on problem validation'}
                    </p>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Problem Score</div>
                  <div className="text-2xl font-bold">{problemScore || 0}/100</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Solution Tests</div>
                  <div className="text-2xl font-bold">{solutionTests.length}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">MVP Features</div>
                  <div className="text-2xl font-bold">
                    {mvpFeatures.filter(f => f.completed).length}/{mvpFeatures.length}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Competitors</div>
                  <div className="text-2xl font-bold">{competitors.length}</div>
                </Card>
              </div>

              {scoreData.some(s => s.value > 0) && (
                <Card>
                  <h3 className="font-semibold mb-4">Validation Progress</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={scoreData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Card>
              )}
          </Card>
        </div>
        )}
      </div>
    </main>
  )
}
