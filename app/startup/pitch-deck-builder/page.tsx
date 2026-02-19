'use client'

import { useState, useEffect, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  FileText, 
  Sparkles, 
  Download, 
  Share2, 
  Plus, 
  Save, 
  Edit, 
  Eye, 
  Trash2, 
  MoveUp, 
  MoveDown,
  X,
  Check,
  Type,
  BarChart,
  Users,
  Target,
  DollarSign,
  Lightbulb,
  TrendingUp,
  Award,
  Image as ImageIcon,
  Presentation,
  Palette,
  Settings,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Copy,
  Zap,
  Globe,
  Shield,
  Briefcase,
  PieChart,
  LineChart,
  Building2,
  Rocket
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { handleDownload } from '@/lib/utils/actions'

interface Slide {
  id: string
  type: string
  title: string
  content: string
  notes?: string
  order: number
  theme?: 'default' | 'minimal' | 'bold' | 'professional'
  imageUrl?: string
}

interface DeckTheme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

interface Template {
  id: string
  name: string
  description: string
  slides: Omit<Slide, 'id' | 'order'>[]
  category: 'seed' | 'series-a' | 'demo-day' | 'custom'
}

const investorTemplates: Template[] = [
  {
    id: 'seed-round',
    name: 'Seed Round Template',
    description: 'Perfect for early-stage fundraising (10-12 slides)',
    category: 'seed',
    slides: [
      { type: 'title', title: 'Company Name', content: 'Your Company Name\nTagline: [Your compelling tagline]\nFounder: [Your Name]\nDate: [Current Date]' },
      { type: 'problem', title: 'The Problem', content: '• [Problem statement]\n• [Market pain point]\n• [Current solutions are inadequate]\n• [Size of the problem]' },
      { type: 'solution', title: 'Our Solution', content: '• [Your unique solution]\n• [Key features]\n• [Why it works]\n• [Proof of concept/MVP status]' },
      { type: 'market', title: 'Market Opportunity', content: 'TAM: $[X]B\nSAM: $[X]M\nSOM: $[X]M\n\nTarget Market:\n• [Primary segment]\n• [Secondary segment]\n• [Growth rate]' },
      { type: 'business', title: 'Business Model', content: 'Revenue Streams:\n• [Primary revenue source]\n• [Secondary revenue source]\n\nUnit Economics:\n• CAC: $[X]\n• LTV: $[X]\n• LTV:CAC Ratio: [X]:1' },
      { type: 'traction', title: 'Traction & Milestones', content: '• [Key metrics]\n• [User growth]\n• [Revenue growth]\n• [Partnerships]\n• [Awards/Recognition]' },
      { type: 'competition', title: 'Competitive Landscape', content: 'Competitors:\n• [Competitor 1] - [Their weakness]\n• [Competitor 2] - [Their weakness]\n\nOur Advantage:\n• [Unique differentiator 1]\n• [Unique differentiator 2]' },
      { type: 'go-to-market', title: 'Go-to-Market Strategy', content: 'Channels:\n• [Channel 1]\n• [Channel 2]\n• [Channel 3]\n\nTimeline:\n• Q1: [Milestone]\n• Q2: [Milestone]\n• Q3: [Milestone]' },
      { type: 'team', title: 'The Team', content: '[Name] - [Role]\n[Background/Experience]\n\n[Name] - [Role]\n[Background/Experience]\n\n[Name] - [Role]\n[Background/Experience]' },
      { type: 'financials', title: 'Financial Projections', content: 'Year 1: $[X]M revenue\nYear 2: $[X]M revenue\nYear 3: $[X]M revenue\n\nKey Assumptions:\n• [Assumption 1]\n• [Assumption 2]' },
      { type: 'ask', title: 'The Ask', content: 'Funding Request: $[X]M\n\nUse of Funds:\n• [Category 1]: [%]\n• [Category 2]: [%]\n• [Category 3]: [%]\n\nMilestones:\n• [Milestone 1]\n• [Milestone 2]' },
    ],
  },
  {
    id: 'series-a',
    name: 'Series A Template',
    description: 'For growth-stage fundraising (12-15 slides)',
    category: 'series-a',
    slides: [
      { type: 'title', title: 'Company Name', content: 'Your Company Name\nSeries A Fundraising\n[Date]' },
      { type: 'problem', title: 'Problem Statement', content: '• [Detailed problem analysis]\n• [Market gap]\n• [Customer pain points]\n• [Market size and urgency]' },
      { type: 'solution', title: 'Our Solution', content: '• [Product/service overview]\n• [Key features and benefits]\n• [Technology/IP advantages]\n• [Customer validation]' },
      { type: 'market', title: 'Market Analysis', content: 'TAM: $[X]B\nSAM: $[X]M\nSOM: $[X]M\n\nMarket Trends:\n• [Trend 1]\n• [Trend 2]\n• [Growth drivers]' },
      { type: 'traction', title: 'Traction & Growth', content: 'Metrics:\n• Revenue: $[X]M (growing [X]% MoM)\n• Users: [X]K (growing [X]% MoM)\n• Customers: [X]\n• Retention: [X]%\n• NPS: [X]' },
      { type: 'business', title: 'Business Model & Unit Economics', content: 'Revenue Model:\n• [Model description]\n\nUnit Economics:\n• CAC: $[X]\n• LTV: $[X]\n• Payback Period: [X] months\n• Gross Margin: [X]%' },
      { type: 'competition', title: 'Competitive Analysis', content: 'Competitive Matrix:\n[Feature] | [Us] | [Competitor 1] | [Competitor 2]\n\nOur Advantages:\n• [Advantage 1]\n• [Advantage 2]\n• [Barriers to entry]' },
      { type: 'go-to-market', title: 'Go-to-Market Strategy', content: 'Channels:\n• [Channel 1]: [Strategy]\n• [Channel 2]: [Strategy]\n• [Channel 3]: [Strategy]\n\nSales Process:\n• [Step 1]\n• [Step 2]\n• [Step 3]' },
      { type: 'team', title: 'Management Team', content: '[Name] - CEO/Founder\n[Background]\n[Previous achievements]\n\n[Name] - CTO/Co-Founder\n[Background]\n[Previous achievements]\n\n[Name] - [Role]\n[Background]' },
      { type: 'advisors', title: 'Advisors & Board', content: '[Name] - [Role]\n[Company/Background]\n\n[Name] - [Role]\n[Company/Background]' },
      { type: 'financials', title: 'Financial Projections', content: '3-Year Projections:\nYear 1: $[X]M revenue, [X]% margin\nYear 2: $[X]M revenue, [X]% margin\nYear 3: $[X]M revenue, [X]% margin\n\nKey Metrics:\n• ARR Growth: [X]%\n• Customer Growth: [X]%\n• Market Share: [X]%' },
      { type: 'funding', title: 'Funding History', content: 'Previous Rounds:\n• Seed: $[X]M @ $[X]M valuation ([Date])\n• Pre-Seed: $[X]K @ $[X]M valuation ([Date])\n\nCurrent Investors:\n• [Investor 1]\n• [Investor 2]' },
      { type: 'ask', title: 'Series A Ask', content: 'Funding Request: $[X]M\nValuation: $[X]M (pre-money)\n\nUse of Funds:\n• Product Development: [X]%\n• Sales & Marketing: [X]%\n• Operations: [X]%\n• Team: [X]%\n\n18-Month Milestones:\n• [Milestone 1]\n• [Milestone 2]\n• [Milestone 3]' },
    ],
  },
  {
    id: 'demo-day',
    name: 'Demo Day Template',
    description: 'Quick pitch for demo days (8-10 slides)',
    category: 'demo-day',
    slides: [
      { type: 'title', title: 'Company Name', content: 'Your Company Name\n[Tagline]\n[Demo Day Name]' },
      { type: 'problem', title: 'The Problem', content: '[Problem statement]\n\n[Why it matters]\n[Market size]' },
      { type: 'solution', title: 'Our Solution', content: '[Solution description]\n\nKey Features:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]' },
      { type: 'traction', title: 'Traction', content: '• [Metric 1]: [Value]\n• [Metric 2]: [Value]\n• [Metric 3]: [Value]\n• [Key achievement]' },
      { type: 'market', title: 'Market Opportunity', content: 'TAM: $[X]B\n\nTarget Market:\n• [Segment 1]\n• [Segment 2]' },
      { type: 'business', title: 'Business Model', content: '[Revenue model]\n\nUnit Economics:\n• CAC: $[X]\n• LTV: $[X]' },
      { type: 'team', title: 'Team', content: '[Name] - [Role]\n[Name] - [Role]\n[Name] - [Role]' },
      { type: 'ask', title: 'The Ask', content: 'Seeking: $[X]M\n\nUse of Funds:\n• [Purpose 1]\n• [Purpose 2]\n• [Purpose 3]' },
    ],
  },
]

const slideTypes = [
  { id: 'title', name: 'Title Slide', icon: FileText, color: 'bg-blue-100 text-blue-700', description: 'Company name and tagline' },
  { id: 'problem', name: 'Problem', icon: Target, color: 'bg-red-100 text-red-700', description: 'The problem you solve' },
  { id: 'solution', name: 'Solution', icon: Lightbulb, color: 'bg-green-100 text-green-700', description: 'Your unique solution' },
  { id: 'market', name: 'Market Opportunity', icon: TrendingUp, color: 'bg-purple-100 text-purple-700', description: 'TAM, SAM, SOM analysis' },
  { id: 'business', name: 'Business Model', icon: DollarSign, color: 'bg-yellow-100 text-yellow-700', description: 'Revenue model and unit economics' },
  { id: 'traction', name: 'Traction', icon: BarChart, color: 'bg-indigo-100 text-indigo-700', description: 'Key metrics and milestones' },
  { id: 'competition', name: 'Competition', icon: Shield, color: 'bg-orange-100 text-orange-700', description: 'Competitive landscape' },
  { id: 'go-to-market', name: 'Go-to-Market', icon: Rocket, color: 'bg-pink-100 text-pink-700', description: 'Sales and marketing strategy' },
  { id: 'team', name: 'Team', icon: Users, color: 'bg-cyan-100 text-cyan-700', description: 'Founders and key team members' },
  { id: 'financials', name: 'Financials', icon: PieChart, color: 'bg-emerald-100 text-emerald-700', description: 'Financial projections' },
  { id: 'ask', name: 'The Ask', icon: Award, color: 'bg-amber-100 text-amber-700', description: 'Funding request and use of funds' },
  { id: 'advisors', name: 'Advisors', icon: Briefcase, color: 'bg-violet-100 text-violet-700', description: 'Advisory board' },
  { id: 'funding', name: 'Funding History', icon: LineChart, color: 'bg-teal-100 text-teal-700', description: 'Previous funding rounds' },
]

const aiSuggestions: Record<string, string[]> = {
  problem: [
    'Quantify the problem with specific numbers and statistics',
    'Use real customer quotes or testimonials to illustrate pain points',
    'Highlight the cost of inaction - what happens if the problem isn\'t solved?',
    'Show market trends that make this problem more urgent',
  ],
  solution: [
    'Lead with your unique value proposition - what makes you different?',
    'Include visual demonstrations or proof of concept results',
    'Show how your solution directly addresses each pain point mentioned',
    'Highlight any proprietary technology or IP advantages',
  ],
  market: [
    'Use credible sources for market size data (Gartner, McKinsey, etc.)',
    'Break down TAM, SAM, and SOM clearly with explanations',
    'Show market growth trends and timing',
    'Identify your specific target customer segments',
  ],
  traction: [
    'Focus on metrics that matter most to investors (revenue, users, retention)',
    'Show month-over-month or year-over-year growth rates',
    'Include customer testimonials or case studies',
    'Highlight any major partnerships, awards, or press coverage',
  ],
  business: [
    'Clearly explain your revenue model and pricing strategy',
    'Show healthy unit economics (LTV > 3x CAC)',
    'Demonstrate path to profitability',
    'Include key assumptions behind your financial model',
  ],
  competition: [
    'Be honest about competitors but highlight your unique advantages',
    'Use a competitive matrix to show differentiation visually',
    'Explain barriers to entry that protect your position',
    'Show how you\'re positioned to win in the market',
  ],
  'go-to-market': [
    'Detail your customer acquisition strategy and channels',
    'Show your sales process and conversion funnel',
    'Include customer acquisition cost (CAC) and payback period',
    'Demonstrate repeatability and scalability of your approach',
  ],
  team: [
    'Highlight relevant experience and achievements',
    'Show complementary skills across the founding team',
    'Include advisors or board members with strong credentials',
    'Demonstrate commitment and passion for the problem',
  ],
  financials: [
    'Show realistic 3-5 year projections with clear assumptions',
    'Include key metrics: revenue, margins, growth rates',
    'Demonstrate path to profitability',
    'Show sensitivity analysis for key variables',
  ],
  ask: [
    'Be specific about funding amount and valuation',
    'Break down use of funds by category with percentages',
    'Set clear, measurable milestones for the funding round',
    'Show how this funding gets you to the next milestone',
  ],
}

export default function PitchDeckBuilderPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [editingSlide, setEditingSlide] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [editingNotes, setEditingNotes] = useState('')
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'presentation'>('edit')
  const [aiEnabled, setAiEnabled] = useState(false)
  const [deckName, setDeckName] = useState('My Pitch Deck')
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [deckTheme, setDeckTheme] = useState<DeckTheme>({
    id: 'default',
    name: 'Default',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    fontFamily: 'Inter'
  })
  const [savedDecks, setSavedDecks] = useState<Array<{id: string, name: string, slides: Slide[], createdAt: string}>>([])
  const [showDeckManager, setShowDeckManager] = useState(false)
  const [presentationTimer, setPresentationTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Initialize slides on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setSlides(investorTemplates[0].slides.map((s, i) => ({ ...s, id: `slide-${i}`, order: i + 1 })))
      setIsLoaded(true)
      return
    }
    
    try {
      const saved = localStorage.getItem('pitchDeck')
      if (saved) {
        const deckData = JSON.parse(saved)
        setDeckName(deckData.name || 'My Pitch Deck')
        setSlides(deckData.slides && deckData.slides.length > 0 ? deckData.slides : investorTemplates[0].slides.map((s, i) => ({ ...s, id: `slide-${i}`, order: i + 1 })))
      } else {
        setSlides(investorTemplates[0].slides.map((s, i) => ({ ...s, id: `slide-${i}`, order: i + 1 })))
      }
    } catch (error) {
      console.error('Error loading pitch deck:', error)
      setSlides(investorTemplates[0].slides.map((s, i) => ({ ...s, id: `slide-${i}`, order: i + 1 })))
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const handleTemplateSelect = useCallback((templateId: string) => {
    const template = investorTemplates.find(t => t.id === templateId)
    if (template) {
      const newSlides = template.slides.map((s, i) => ({
        ...s,
        id: `slide-${Date.now()}-${i}`,
        order: i + 1,
        notes: s.notes || '',
      }))
      setSlides(newSlides)
      setSelectedTemplate(templateId)
      setDeckName(template.name)
      showToast(`Loaded ${template.name} template`, 'success')
    }
  }, [])

  const handleAddSlide = (type: string) => {
    const slideType = slideTypes.find(st => st.id === type)
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      type,
      title: slideType?.name || 'New Slide',
      content: `Add content for ${slideType?.name || 'this slide'}...\n\n• Point 1\n• Point 2\n• Point 3`,
      notes: '',
      order: slides.length + 1,
    }
    setSlides([...slides, newSlide])
    showToast(`Added ${slideType?.name} slide`, 'success')
  }

  const handleEditSlide = (slideId: string) => {
    const slide = slides.find(s => s.id === slideId)
    if (slide) {
      setEditingSlide(slideId)
      setEditingContent(slide.content)
      setEditingNotes(slide.notes || '')
    }
  }

  const handleSaveEdit = () => {
    if (editingSlide) {
      setSlides(slides.map(slide => 
        slide.id === editingSlide 
          ? { ...slide, content: editingContent, notes: editingNotes }
          : slide
      ))
      setEditingSlide(null)
      setEditingContent('')
      setEditingNotes('')
      showToast('Slide updated!', 'success')
    }
  }

  const handleDeleteSlide = (slideId: string) => {
    if (slides.length <= 1) {
      showToast('You need at least one slide', 'error')
      return
    }
    setSlides(slides.filter(s => s.id !== slideId).map((slide, index) => ({
      ...slide,
      order: index + 1
    })))
    if (editingSlide === slideId) {
      setEditingSlide(null)
      setEditingContent('')
      setEditingNotes('')
    }
    showToast('Slide deleted', 'info')
  }

  const handleMoveSlide = (slideId: string, direction: 'up' | 'down') => {
    const index = slides.findIndex(s => s.id === slideId)
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === slides.length - 1) return

    const newSlides = [...slides]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]]
    
    const reorderedSlides = newSlides.map((slide, idx) => ({
      ...slide,
      order: idx + 1
    }))
    
    setSlides(reorderedSlides)
    showToast(`Slide moved ${direction}`, 'success')
  }

  const handleAISuggest = (slideId: string) => {
    if (!aiEnabled) {
      showToast('Please enable AI Assistant first', 'info')
      return
    }
    const slide = slides.find(s => s.id === slideId)
    if (!slide) return

    const suggestions = aiSuggestions[slide.type] || [
      'Focus on clear, concise messaging',
      'Use data and metrics to support your points',
      'Tell a compelling story',
      'Highlight what makes you unique',
    ]

    showToast('Generating AI suggestions...', 'info')
    setTimeout(() => {
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      const currentContent = slide.content
      const enhancedContent = `${currentContent}\n\n💡 AI Suggestion: ${randomSuggestion}`
      setSlides(slides.map(s => 
        s.id === slideId ? { ...s, content: enhancedContent } : s
      ))
      showToast('AI suggestion added to slide!', 'success')
    }, 1500)
  }

  const handleExport = (format: 'pdf' | 'pptx') => {
    showToast(`Exporting to ${format.toUpperCase()}...`, 'info')
    setTimeout(() => {
      const deckData = {
        name: deckName,
        slides,
        exportedAt: new Date().toISOString(),
      }
      const blob = new Blob([JSON.stringify(deckData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${deckName.replace(/\s/g, '-')}.${format === 'pdf' ? 'pdf' : 'pptx'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast(`Pitch deck exported as ${format.toUpperCase()}!`, 'success')
    }, 2000)
  }

  const handleSave = () => {
    if (typeof window === 'undefined') return
    try {
      const deckData = {
        name: deckName,
        slides,
        template: selectedTemplate,
        theme: deckTheme,
        savedDecks,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('pitchDeck', JSON.stringify(deckData))
      showToast('Pitch deck saved locally!', 'success')
    } catch (error) {
      showToast('Error saving pitch deck', 'error')
    }
  }

  const handleSaveAsNew = () => {
    if (!deckName.trim()) {
      showToast('Please enter a deck name', 'error')
      return
    }
    const newDeck = {
      id: Date.now().toString(),
      name: deckName,
      slides: [...slides],
      createdAt: new Date().toISOString()
    }
    const updated = [...savedDecks, newDeck]
    setSavedDecks(updated)
    const deckData = {
      name: deckName,
      slides,
      template: selectedTemplate,
      theme: deckTheme,
      savedDecks: updated,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('pitchDeck', JSON.stringify(deckData))
    showToast('Deck saved as new!', 'success')
  }

  const handleLoadDeck = (deckId: string) => {
    const deck = savedDecks.find(d => d.id === deckId)
    if (deck) {
      setSlides(deck.slides)
      setDeckName(deck.name)
      setShowDeckManager(false)
      showToast(`Loaded ${deck.name}`, 'success')
    }
  }

  const handleDeleteDeck = (deckId: string) => {
    if (confirm('Are you sure you want to delete this deck?')) {
      const updated = savedDecks.filter(d => d.id !== deckId)
      setSavedDecks(updated)
      const deckData = {
        name: deckName,
        slides,
        template: selectedTemplate,
        theme: deckTheme,
        savedDecks: updated,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('pitchDeck', JSON.stringify(deckData))
      showToast('Deck deleted', 'info')
    }
  }

  // Presentation timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isTimerRunning && viewMode === 'presentation') {
      interval = setInterval(() => {
        setPresentationTimer(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, viewMode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleLoad = () => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem('pitchDeck')
      if (saved) {
        const deckData = JSON.parse(saved)
        setDeckName(deckData.name || 'My Pitch Deck')
        setSlides(deckData.slides || investorTemplates[0].slides.map((s, i) => ({ ...s, id: `slide-${i}`, order: i + 1 })))
        setSelectedTemplate(deckData.template || null)
        if (deckData.theme) setDeckTheme(deckData.theme)
        if (deckData.savedDecks) setSavedDecks(deckData.savedDecks)
        showToast('Pitch deck loaded!', 'success')
      } else {
        showToast('No saved pitch deck found', 'info')
      }
    } catch (error) {
      showToast('Error loading pitch deck', 'error')
    }
  }

  const handleShare = () => {
    if (typeof window === 'undefined') return
    
    if (navigator.share) {
      navigator.share({
        title: deckName,
        text: 'Check out my pitch deck',
        url: window.location.href,
      })
        .then(() => showToast('Shared successfully!', 'success'))
        .catch(() => showToast('Share cancelled', 'info'))
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => showToast('Link copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy link', 'error'))
    }
  }

  const handleDuplicateSlide = (slideId: string) => {
    const slide = slides.find(s => s.id === slideId)
    if (slide) {
      const newSlide: Slide = {
        ...slide,
        id: `slide-${Date.now()}`,
        title: `${slide.title} (Copy)`,
        order: slides.length + 1,
      }
      setSlides([...slides, newSlide])
      showToast('Slide duplicated!', 'success')
    }
  }

  const handleNextSlide = () => {
    if (currentSlideIndex < sortedSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const currentSlide = slides.find(s => s.id === editingSlide)
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order)
  const currentPresentationSlide = sortedSlides[currentSlideIndex]

  // Keyboard shortcuts for presentation mode
  useEffect(() => {
    if (viewMode !== 'presentation') return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrevSlide()
      } else if (e.key === 'Escape') {
        setViewMode('edit')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [viewMode, currentSlideIndex, sortedSlides.length])

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Pitch Deck Builder...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Presentation Mode (Full Screen)
  if (viewMode === 'presentation') {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-5xl w-full bg-white rounded-lg shadow-2xl p-4 sm:p-8 lg:p-12 min-h-[300px] sm:min-h-[500px] lg:min-h-[600px] flex flex-col">
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-4 sm:mb-6">
                {currentPresentationSlide && (() => {
                  const slideType = slideTypes.find(st => st.id === currentPresentationSlide.type)
                  const IconComponent = slideType?.icon || FileText
                  return (
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className={`${slideType?.color || 'bg-gray-100'} p-1.5 sm:p-2 rounded-lg`}>
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{currentPresentationSlide.title}</h2>
                    </div>
                  )
                })()}
              </div>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm sm:text-lg lg:text-xl leading-relaxed">
                  {currentPresentationSlide?.content || 'No content'}
                </pre>
              </div>
            </div>
            {showNotes && currentPresentationSlide?.notes && (
              <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">Speaker Notes:</p>
                <p className="text-xs sm:text-sm text-gray-600">{currentPresentationSlide.notes}</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-800 text-white px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <Button variant="ghost" size="sm" onClick={() => {
              setViewMode('edit')
              setIsTimerRunning(false)
              setPresentationTimer(0)
            }} className="text-white hover:bg-gray-700 shrink-0 text-xs sm:text-sm">
              <X className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Exit</span>
            </Button>
            <span className="text-xs sm:text-sm">
              {currentSlideIndex + 1}/{sortedSlides.length}
            </span>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <span>{formatTime(presentationTimer)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-white hover:bg-gray-700 p-1 sm:p-2"
              >
                {isTimerRunning ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handlePrevSlide} disabled={currentSlideIndex === 0} className="text-white hover:bg-gray-700 shrink-0 p-2">
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNextSlide} disabled={currentSlideIndex === sortedSlides.length - 1} className="text-white hover:bg-gray-700 shrink-0 p-2">
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowNotes(!showNotes)} className="text-white hover:bg-gray-700 shrink-0 text-xs sm:text-sm">
              <FileText className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{showNotes ? 'Hide' : 'Show'} Notes</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                  Pitch Deck Builder
                </span>
              </h1>
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="text-base sm:text-lg text-gray-600 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 w-full"
                placeholder="Enter deck name..."
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setShowDeckManager(true)} className="shrink-0">
                <FileText className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">My Decks</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave} className="shrink-0">
                <Save className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="shrink-0">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'preview' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                className="shrink-0"
              >
                <Eye className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{viewMode === 'edit' ? 'Preview' : 'Edit'}</span>
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => {
                  setViewMode('presentation')
                  setCurrentSlideIndex(0)
                }}
                className="shrink-0"
              >
                <Play className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Present</span>
              </Button>
              <Button size="sm" onClick={() => handleExport('pdf')} className="shrink-0">
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
          <p className="text-sm sm:text-lg text-gray-600">
            Create investor-ready pitch decks with professional templates and AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Templates Section */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Professional Templates</h3>
                <Badge variant="new">Investor-Ready</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {investorTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedTemplate === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 bg-white'
                    }`}
                  >
                    <div className="font-semibold mb-1">{template.name}</div>
                    <div className="text-xs text-gray-600">{template.description}</div>
                  </button>
                ))}
              </div>
            </Card>

            {viewMode === 'edit' ? (
              <>
                {/* Slides List */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Slides ({slides.length})</h2>
                    <Badge variant="outline">{slides.length} slides</Badge>
                  </div>
                  <div className="space-y-3">
                    {sortedSlides.map((slide, index) => {
                      const slideType = slideTypes.find(st => st.id === slide.type)
                      const IconComponent = slideType?.icon || FileText
                      return (
                        <div
                          key={slide.id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            editingSlide === slide.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`${slideType?.color || 'bg-gray-100'} p-2 rounded-lg`}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{slide.title}</span>
                                  <span className="text-xs text-gray-500">#{slide.order}</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {slide.content.split('\n')[0] || 'Empty slide'}
                                </p>
                                {slide.notes && (
                                  <p className="text-xs text-gray-500 mt-1">📝 Has notes</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveSlide(slide.id, 'up')}
                                disabled={index === 0}
                                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <MoveUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleMoveSlide(slide.id, 'down')}
                                disabled={index === sortedSlides.length - 1}
                                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <MoveDown className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDuplicateSlide(slide.id)}
                                className="p-1 rounded hover:bg-gray-100"
                                title="Duplicate"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEditSlide(slide.id)}
                                className="p-1 rounded hover:bg-gray-100"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {aiEnabled && (
                                <button
                                  onClick={() => handleAISuggest(slide.id)}
                                  className="p-1 rounded hover:bg-primary-100"
                                  title="AI Suggestions"
                                >
                                  <Sparkles className="h-4 w-4 text-primary-500" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteSlide(slide.id)}
                                className="p-1 rounded hover:bg-red-100 text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                {/* Slide Editor */}
                {editingSlide && currentSlide && (
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Editing: {currentSlide.title}</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setEditingSlide(null)
                          setEditingContent('')
                          setEditingNotes('')
                        }}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slide Content
                        </label>
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none font-mono text-sm"
                          placeholder="Enter slide content... Use bullet points (•) for lists"
                        />
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <Type className="h-4 w-4" />
                          <span>Tip: Use • for bullet points, line breaks for paragraphs</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Speaker Notes (Optional)
                        </label>
                        <textarea
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none text-sm"
                          placeholder="Add speaker notes for this slide..."
                        />
                        <div className="mt-2 text-xs text-gray-500">
                          These notes will be visible during presentation mode
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              /* Preview Mode */
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Preview Mode</h2>
                  <p className="text-sm text-gray-600">Scroll through your pitch deck</p>
                </div>
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {sortedSlides.map((slide, index) => {
                    const slideType = slideTypes.find(st => st.id === slide.type)
                    const IconComponent = slideType?.icon || FileText
                    return (
                      <div
                        key={slide.id}
                        className="bg-white border-2 border-gray-200 rounded-lg p-8 min-h-[400px] shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`${slideType?.color || 'bg-gray-100'} p-2 rounded-lg`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{slide.title}</h3>
                            <p className="text-sm text-gray-500">Slide {index + 1} of {sortedSlides.length}</p>
                          </div>
                        </div>
                        <div className="prose max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-gray-700 text-lg leading-relaxed">
                            {slide.content}
                          </pre>
                        </div>
                        {slide.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 mb-1">Speaker Notes:</p>
                            <p className="text-xs text-gray-600">{slide.notes}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary-500" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Get investor-focused AI suggestions for your pitch deck
              </p>
              <Button 
                variant={aiEnabled ? 'primary' : 'outline'} 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setAiEnabled(!aiEnabled)
                  showToast(`AI Assistant ${!aiEnabled ? 'enabled' : 'disabled'}`, 'success')
                }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {aiEnabled ? 'AI Enabled' : 'Enable AI'}
              </Button>
            </Card>

            {/* Add Slides */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Plus className="h-5 w-5 text-primary-500" />
                <h3 className="font-semibold">Add Slide</h3>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {slideTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleAddSlide(type.id)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2"
                      title={type.description}
                    >
                      <div className={type.color + ' p-1 rounded'}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{type.name}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Export Options */}
            <Card>
              <h3 className="font-semibold mb-4">Export Options</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleExport('pdf')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleExport('pptx')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as PPTX
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Deck Manager Modal */}
        {showDeckManager && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
                <h3 className="text-2xl font-bold">My Pitch Decks</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowDeckManager(false)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {savedDecks.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <FileText className="h-16 w-16 mx-auto mb-4" />
                    <p>No saved decks yet. Save your current deck to see it here.</p>
                  </div>
                ) : (
                  savedDecks.map((deck) => (
                    <Card key={deck.id} className="p-4 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{deck.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span>{deck.slides.length} slides</span>
                            <span>Created: {new Date(deck.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLoadDeck(deck.id)}
                          >
                            Load
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDeck(deck.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Theme Selector */}
        <Card className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-primary-500 shrink-0" />
              <h3 className="font-semibold">Deck Theme</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'default', name: 'Default', primary: '#3b82f6', secondary: '#1e40af' },
              { id: 'professional', name: 'Professional', primary: '#1f2937', secondary: '#111827' },
              { id: 'bold', name: 'Bold', primary: '#ef4444', secondary: '#dc2626' },
              { id: 'minimal', name: 'Minimal', primary: '#6b7280', secondary: '#4b5563' },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => setDeckTheme({
                  id: theme.id,
                  name: theme.name,
                  primaryColor: theme.primary,
                  secondaryColor: theme.secondary,
                  fontFamily: 'Inter'
                })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  deckTheme.id === theme.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.primary }} />
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.secondary }} />
                </div>
                <div className="text-sm font-medium">{theme.name}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
