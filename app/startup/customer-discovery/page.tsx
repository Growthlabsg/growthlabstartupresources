'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Users2, 
  MessageSquare, 
  BarChart, 
  User,
  Plus,
  Trash2,
  Edit,
  Save,
  Download,
  Share2,
  Copy,
  CheckCircle,
  X,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Target,
  TrendingUp,
  FileText,
  Sparkles,
  Search as SearchIcon,
  Filter,
  Eye,
  Printer,
  Upload,
  AlertCircle,
  Lightbulb,
  Heart,
  Smile,
  Frown,
  Meh,
  Star,
  PieChart as PieChartIcon,
  LineChart,
  Activity,
  Zap,
  Brain,
  BookOpen,
  Settings,
  Play,
  Pause,
  StopCircle
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart as RechartsLineChart, Line } from 'recharts'

interface SurveyQuestion {
  id: string
  type: 'text' | 'multiple-choice' | 'rating' | 'yes-no' | 'scale'
  question: string
  options?: string[]
  required: boolean
}

interface Survey {
  id: string
  title: string
  description: string
  questions: SurveyQuestion[]
  responses: number
  createdAt: string
}

interface Interview {
  id: string
  participantName: string
  email: string
  date: string
  time: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes: string
  template: string
  recording?: string
}

interface Feedback {
  id: string
  source: string
  text: string
  sentiment: 'positive' | 'neutral' | 'negative'
  category: string
  date: string
  rating?: number
}

interface Persona {
  id: string
  name: string
  role: string
  demographics: {
    age: string
    location: string
    income: string
    education: string
  }
  goals: string[]
  painPoints: string[]
  behaviors: string[]
  quotes: string[]
}

export default function CustomerDiscoveryPage() {
  const [activeTab, setActiveTab] = useState('survey')
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null)
  const [surveyTitle, setSurveyTitle] = useState('')
  const [surveyDescription, setSurveyDescription] = useState('')
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'survey', label: 'Survey Builder', icon: MessageSquare },
    { id: 'interviews', label: 'User Interviews', icon: Users2 },
    { id: 'feedback', label: 'Feedback Analysis', icon: BarChart },
    { id: 'personas', label: 'Customer Personas', icon: User },
    { id: 'analytics', label: 'Analytics Dashboard', icon: Activity },
  ]

  const questionTypes = [
    { value: 'text', label: 'Text Answer' },
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'rating', label: 'Rating (1-5)' },
    { value: 'yes-no', label: 'Yes/No' },
    { value: 'scale', label: 'Scale (1-10)' },
  ]

  const interviewTemplates = [
    {
      id: 'problem-discovery',
      name: 'Problem Discovery',
      questions: [
        'What problem are you trying to solve?',
        'How are you currently solving this problem?',
        'What frustrates you about current solutions?',
        'How much would you pay for a better solution?'
      ]
    },
    {
      id: 'product-feedback',
      name: 'Product Feedback',
      questions: [
        'What do you like most about the product?',
        'What would you change?',
        'How does this compare to alternatives?',
        'Would you recommend this to others?'
      ]
    },
    {
      id: 'user-journey',
      name: 'User Journey',
      questions: [
        'Walk me through how you use this product',
        'What was your first impression?',
        'What obstacles did you encounter?',
        'What would make this easier to use?'
      ]
    }
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customerDiscoveryData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.surveys) setSurveys(data.surveys)
          if (data.interviews) setInterviews(data.interviews)
          if (data.feedbacks) setFeedbacks(data.feedbacks)
          if (data.personas) setPersonas(data.personas)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('customerDiscoveryData') || '{}')
      data[key] = value
      localStorage.setItem('customerDiscoveryData', JSON.stringify(data))
    }
  }

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      type: 'text',
      question: '',
      required: false
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<SurveyQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
    showToast('Question deleted', 'success')
  }

  const saveSurvey = () => {
    if (!surveyTitle.trim()) {
      showToast('Please enter a survey title', 'error')
      return
    }
    if (questions.length === 0) {
      showToast('Please add at least one question', 'error')
      return
    }

    const newSurvey: Survey = {
      id: currentSurvey?.id || Date.now().toString(),
      title: surveyTitle,
      description: surveyDescription,
      questions: questions,
      responses: currentSurvey?.responses || 0,
      createdAt: currentSurvey?.createdAt || new Date().toISOString()
    }

    const updated = currentSurvey 
      ? surveys.map(s => s.id === currentSurvey.id ? newSurvey : s)
      : [...surveys, newSurvey]

    setSurveys(updated)
    saveToLocalStorage('surveys', updated)
    setCurrentSurvey(null)
    setSurveyTitle('')
    setSurveyDescription('')
    setQuestions([])
    showToast('Survey saved successfully!', 'success')
  }

  const createNewSurvey = () => {
    setCurrentSurvey(null)
    setSurveyTitle('')
    setSurveyDescription('')
    setQuestions([])
  }

  const loadSurvey = (survey: Survey) => {
    setCurrentSurvey(survey)
    setSurveyTitle(survey.title)
    setSurveyDescription(survey.description)
    setQuestions(survey.questions)
  }

  const addInterview = () => {
    const newInterview: Interview = {
      id: Date.now().toString(),
      participantName: '',
      email: '',
      date: '',
      time: '',
      status: 'scheduled',
      notes: '',
      template: interviewTemplates[0].id
    }
    setEditingInterview(newInterview)
  }

  const saveInterview = () => {
    if (!editingInterview) return
    if (!editingInterview.participantName || !editingInterview.date) {
      showToast('Please fill in required fields', 'error')
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
    showToast('Interview deleted', 'success')
  }

  const addFeedback = () => {
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      source: '',
      text: '',
      sentiment: 'neutral',
      category: 'general',
      date: new Date().toISOString().split('T')[0],
      rating: 3
    }
    setFeedbacks([...feedbacks, newFeedback])
  }

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['love', 'great', 'excellent', 'amazing', 'perfect', 'good', 'happy', 'satisfied']
    const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'disappointed', 'frustrated', 'poor', 'worst']
    
    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length

    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  const createPersona = () => {
    const newPersona: Persona = {
      id: Date.now().toString(),
      name: '',
      role: '',
      demographics: {
        age: '',
        location: '',
        income: '',
        education: ''
      },
      goals: [],
      painPoints: [],
      behaviors: [],
      quotes: []
    }
    setEditingPersona(newPersona)
  }

  const savePersona = () => {
    if (!editingPersona) return
    if (!editingPersona.name || !editingPersona.role) {
      showToast('Please fill in name and role', 'error')
      return
    }

    const updated = personas.find(p => p.id === editingPersona.id)
      ? personas.map(p => p.id === editingPersona.id ? editingPersona : p)
      : [...personas, editingPersona]

    setPersonas(updated)
    saveToLocalStorage('personas', updated)
    setEditingPersona(null)
    showToast('Persona saved!', 'success')
  }

  const exportData = () => {
    const data = {
      surveys,
      interviews,
      feedbacks,
      personas,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customer-discovery-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  const sentimentData = [
    { name: 'Positive', value: feedbacks.filter(f => f.sentiment === 'positive').length, color: '#10b981' },
    { name: 'Neutral', value: feedbacks.filter(f => f.sentiment === 'neutral').length, color: '#6b7280' },
    { name: 'Negative', value: feedbacks.filter(f => f.sentiment === 'negative').length, color: '#ef4444' },
  ]

  const filteredSurveys = surveys.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredInterviews = interviews.filter(i =>
    i.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
              Customer Discovery Tool
            </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Validate your ideas with comprehensive customer research tools - surveys, interviews, feedback analysis, and persona creation.
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

        {/* Survey Builder Tab */}
        {activeTab === 'survey' && (
          <div className="space-y-6">
          <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Survey Builder</h2>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={createNewSurvey} className="shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    New Survey
                  </Button>
                  <Button variant="outline" size="sm" onClick={saveSurvey} className="shrink-0">
                    <Save className="h-4 w-4 mr-2" />
                    Save Survey
                  </Button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Survey Title</label>
                  <Input
                    value={surveyTitle}
                    onChange={(e) => setSurveyTitle(e.target.value)}
                    placeholder="e.g., Product Feedback Survey"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    rows={3}
                    value={surveyDescription}
                    onChange={(e) => setSurveyDescription(e.target.value)}
                    placeholder="Brief description of your survey"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Questions</h3>
                  <Button variant="outline" size="sm" onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">No questions yet. Add your first question!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, idx) => (
                      <Card key={question.id} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary-500/10 px-3 py-1 rounded-lg text-sm font-semibold text-primary-600 shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                                <Select
                                  value={question.type}
                                  onChange={(e) => updateQuestion(question.id, { type: e.target.value as SurveyQuestion['type'] })}
                                  options={questionTypes}
                                />
                              </div>
                              <div className="flex items-center gap-2 pt-6">
                                <input
                                  type="checkbox"
                                  checked={question.required}
                                  onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                                  className="h-4 w-4"
                                />
                                <label className="text-sm text-gray-700">Required</label>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                              <Input
                                value={question.question}
                                onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                                placeholder="Enter your question..."
                              />
                            </div>
                            {(question.type === 'multiple-choice' || question.type === 'rating') && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Options (comma-separated)</label>
                                <Input
                                  value={question.options?.join(', ') || ''}
                                  onChange={(e) => updateQuestion(question.id, { 
                                    options: e.target.value.split(',').map(o => o.trim()).filter(o => o)
                                  })}
                                  placeholder="Option 1, Option 2, Option 3"
                                />
                              </div>
                            )}
                          </div>
            <Button 
                            variant="ghost"
              size="sm" 
                            onClick={() => deleteQuestion(question.id)}
                            className="shrink-0"
            >
                            <Trash2 className="h-4 w-4" />
            </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {surveys.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4">Saved Surveys</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSurveys.map((survey) => (
                    <Card key={survey.id} className="p-4 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-2 cursor-pointer" onClick={() => loadSurvey(survey)}>
                        <h4 className="font-semibold flex-1">{survey.title}</h4>
                        <Badge variant="outline">{survey.questions.length} Q</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{survey.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{survey.responses} responses</span>
                        <span>{new Date(survey.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  ))}
                </div>
          </Card>
            )}
          </div>
        )}

        {/* User Interviews Tab */}
        {activeTab === 'interviews' && (
          <div className="space-y-6">
          <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users2 className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">User Interviews</h2>
                </div>
                <Button onClick={addInterview} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>

              {interviews.length === 0 ? (
                <div className="text-center py-12">
                  <Users2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Interviews Scheduled</h3>
                  <p className="text-gray-600 mb-6">Start scheduling user interviews to gather insights</p>
                  <Button onClick={addInterview}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule First Interview
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <Card key={interview.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="font-semibold">{interview.participantName}</h4>
                            <Badge variant={
                              interview.status === 'completed' ? 'new' :
                              interview.status === 'cancelled' ? 'outline' : 'outline'
                            }>
                              {interview.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{interview.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(interview.date).toLocaleDateString()} at {interview.time}</span>
                            </div>
                            {interview.notes && (
                              <p className="mt-2 text-gray-700">{interview.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0 ml-2">
            <Button 
                            variant="ghost"
              size="sm" 
                            onClick={() => setEditingInterview(interview)}
                            className="shrink-0"
            >
                            <Edit className="h-4 w-4" />
            </Button>
            <Button 
                            variant="ghost"
              size="sm" 
                            onClick={() => deleteInterview(interview.id)}
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

              {editingInterview && (
                <Card className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex-1">Interview Details</h3>
                    <Button variant="ghost" size="sm" onClick={() => setEditingInterview(null)} className="shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Participant Name</label>
                        <Input
                          value={editingInterview.participantName}
                          onChange={(e) => setEditingInterview({ ...editingInterview, participantName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <Input
                          type="email"
                          value={editingInterview.email}
                          onChange={(e) => setEditingInterview({ ...editingInterview, email: e.target.value })}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <Input
                          type="time"
                          value={editingInterview.time}
                          onChange={(e) => setEditingInterview({ ...editingInterview, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interview Template</label>
                      <Select
                        value={editingInterview.template}
                        onChange={(e) => setEditingInterview({ ...editingInterview, template: e.target.value })}
                        options={interviewTemplates.map(t => ({ value: t.id, label: t.name }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                        rows={4}
                        value={editingInterview.notes}
                        onChange={(e) => setEditingInterview({ ...editingInterview, notes: e.target.value })}
                        placeholder="Interview notes and insights..."
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={saveInterview} className="flex-1 min-w-[120px]">
                        Save Interview
                      </Button>
                      <Button variant="outline" onClick={() => setEditingInterview(null)} className="shrink-0">
                        Cancel
            </Button>
                    </div>
                  </div>
                </Card>
              )}
            </Card>

            <Card>
              <h3 className="font-semibold mb-4">Interview Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {interviewTemplates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <h4 className="font-semibold mb-3">{template.name}</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {template.questions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary-500 mt-1">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
          </Card>
          </div>
        )}

        {/* Feedback Analysis Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
          <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <BarChart className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Feedback Analysis</h2>
                </div>
                <Button onClick={addFeedback} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feedback
                </Button>
              </div>

              {feedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Feedback Yet</h3>
                  <p className="text-gray-600 mb-6">Start collecting and analyzing customer feedback</p>
                  <Button onClick={addFeedback}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Feedback
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4 bg-green-50">
                      <div className="flex items-center gap-3 mb-2">
                        <Smile className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">Positive</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {feedbacks.filter(f => f.sentiment === 'positive').length}
                      </div>
                    </Card>
                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-2">
                        <Meh className="h-5 w-5 text-gray-600" />
                        <span className="font-semibold">Neutral</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-600">
                        {feedbacks.filter(f => f.sentiment === 'neutral').length}
                      </div>
                    </Card>
                    <Card className="p-4 bg-red-50">
                      <div className="flex items-center gap-3 mb-2">
                        <Frown className="h-5 w-5 text-red-600" />
                        <span className="font-semibold">Negative</span>
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        {feedbacks.filter(f => f.sentiment === 'negative').length}
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                      <Card key={feedback.id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h4 className="font-semibold">{feedback.source}</h4>
                              <Badge variant={
                                feedback.sentiment === 'positive' ? 'new' :
                                feedback.sentiment === 'negative' ? 'outline' : 'outline'
                              }>
                                {feedback.sentiment}
                              </Badge>
                              {feedback.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span className="text-sm">{feedback.rating}/5</span>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2">{feedback.text}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{feedback.category}</span>
                              <span>{new Date(feedback.date).toLocaleDateString()}</span>
                            </div>
                          </div>
            <Button 
                            variant="ghost"
              size="sm" 
                            onClick={() => {
                              const updated = feedbacks.filter(f => f.id !== feedback.id)
                              setFeedbacks(updated)
                              saveToLocalStorage('feedbacks', updated)
                              showToast('Feedback deleted', 'success')
                            }}
                            className="shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        )}

        {/* Customer Personas Tab */}
        {activeTab === 'personas' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Customer Personas</h2>
                </div>
                <Button onClick={createPersona} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
              Create Persona
            </Button>
              </div>

              {personas.length === 0 && !editingPersona ? (
                <div className="text-center py-12">
                  <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Personas Created</h3>
                  <p className="text-gray-600 mb-6">Create customer personas to better understand your target audience</p>
                  <Button onClick={createPersona}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Persona
                  </Button>
                </div>
              ) : (
                <>
                  {personas.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {personas.map((persona) => (
                        <Card key={persona.id} className="p-4 hover:shadow-lg transition-all">
                          <div className="flex items-start justify-between mb-2 cursor-pointer" onClick={() => setEditingPersona(persona)}>
                            <div>
                              <h4 className="font-semibold text-lg">{persona.name}</h4>
                              <p className="text-sm text-gray-600">{persona.role}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                const updated = personas.filter(p => p.id !== persona.id)
                                setPersonas(updated)
                                saveToLocalStorage('personas', updated)
                                showToast('Persona deleted', 'success')
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 space-y-1 mt-3">
                            <div>{persona.demographics.age} • {persona.demographics.location}</div>
                            <div>{persona.goals.length} goals • {persona.painPoints.length} pain points</div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {editingPersona && (
                    <Card>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex-1">Persona Details</h3>
                        <Button variant="ghost" size="sm" onClick={() => setEditingPersona(null)} className="shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <Input
                              value={editingPersona.name}
                              onChange={(e) => setEditingPersona({ ...editingPersona, name: e.target.value })}
                              placeholder="e.g., Tech-Savvy Professional"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <Input
                              value={editingPersona.role}
                              onChange={(e) => setEditingPersona({ ...editingPersona, role: e.target.value })}
                              placeholder="e.g., Marketing Manager"
                            />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Demographics</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                              <Input
                                value={editingPersona.demographics.age}
                                onChange={(e) => setEditingPersona({
                                  ...editingPersona,
                                  demographics: { ...editingPersona.demographics, age: e.target.value }
                                })}
                                placeholder="25-35"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                              <Input
                                value={editingPersona.demographics.location}
                                onChange={(e) => setEditingPersona({
                                  ...editingPersona,
                                  demographics: { ...editingPersona.demographics, location: e.target.value }
                                })}
                                placeholder="Urban"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Income</label>
                              <Input
                                value={editingPersona.demographics.income}
                                onChange={(e) => setEditingPersona({
                                  ...editingPersona,
                                  demographics: { ...editingPersona.demographics, income: e.target.value }
                                })}
                                placeholder="$50K-$100K"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                              <Input
                                value={editingPersona.demographics.education}
                                onChange={(e) => setEditingPersona({
                                  ...editingPersona,
                                  demographics: { ...editingPersona.demographics, education: e.target.value }
                                })}
                                placeholder="Bachelor's"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={savePersona} className="flex-1 min-w-[120px]">
                            Save Persona
                          </Button>
                          <Button variant="outline" onClick={() => setEditingPersona(null)} className="shrink-0">
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

        {/* Analytics Dashboard Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Activity className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Surveys</div>
                  <div className="text-2xl font-bold">{surveys.length}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Interviews</div>
                  <div className="text-2xl font-bold">{interviews.length}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Feedback Items</div>
                  <div className="text-2xl font-bold">{feedbacks.length}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Personas</div>
                  <div className="text-2xl font-bold">{personas.length}</div>
                </Card>
              </div>

              {feedbacks.length > 0 && (
                <Card className="mb-6">
                  <h3 className="font-semibold mb-4">Sentiment Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => percent ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="font-semibold mb-4">Survey Response Rates</h3>
                  {surveys.length > 0 ? (
                    <div className="space-y-2">
                      {surveys.map((survey) => (
                        <div key={survey.id} className="flex items-center justify-between">
                          <span className="text-sm">{survey.title}</span>
                          <Badge variant="outline">{survey.responses} responses</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No surveys yet</p>
                  )}
                </Card>
                <Card>
                  <h3 className="font-semibold mb-4">Interview Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scheduled</span>
                      <Badge variant="outline">
                        {interviews.filter(i => i.status === 'scheduled').length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed</span>
                      <Badge variant="new">
                        {interviews.filter(i => i.status === 'completed').length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cancelled</span>
                      <Badge variant="outline">
                        {interviews.filter(i => i.status === 'cancelled').length}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
          </Card>
        </div>
        )}
      </div>
    </main>
  )
}
