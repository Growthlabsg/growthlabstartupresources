'use client'

import { useState, useEffect, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  FileText, 
  CheckCircle, 
  Circle, 
  Save, 
  Download,
  Edit,
  Eye,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Target,
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  BarChart,
  Lightbulb,
  Shield,
  Globe,
  Zap,
  BookOpen,
  X,
  Check,
  Copy,
  Share2,
  Play,
  FileCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { handleDownload } from '@/lib/utils/actions'

interface Section {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  content: string
  completed: boolean
  required: boolean
  order: number
  tips?: string[]
  questions?: string[]
}

interface IndustryTemplate {
  id: string
  name: string
  description: string
  industry: string
}

const industryTemplates: IndustryTemplate[] = [
  { id: 'tech', name: 'Tech/SaaS', description: 'Software and technology startups', industry: 'Technology' },
  { id: 'ecommerce', name: 'E-commerce', description: 'Online retail and marketplace businesses', industry: 'E-commerce' },
  { id: 'fintech', name: 'FinTech', description: 'Financial technology companies', industry: 'Financial Services' },
  { id: 'healthcare', name: 'Healthcare', description: 'Healthcare and medical technology', industry: 'Healthcare' },
  { id: 'education', name: 'EdTech', description: 'Educational technology platforms', industry: 'Education' },
  { id: 'food', name: 'Food & Beverage', description: 'Restaurant and food service businesses', industry: 'Food & Beverage' },
  { id: 'manufacturing', name: 'Manufacturing', description: 'Product manufacturing companies', industry: 'Manufacturing' },
  { id: 'services', name: 'Professional Services', description: 'Consulting and service businesses', industry: 'Services' },
]

const defaultSections: Section[] = [
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    description: 'A concise overview of your entire business plan',
    icon: FileText,
    content: '',
    completed: false,
    required: true,
    order: 1,
    tips: [
      'Keep it to 1-2 pages maximum',
      'Include your mission, vision, and key objectives',
      'Highlight your unique value proposition',
      'Mention key financial highlights',
      'Write this section last, after completing all other sections'
    ],
    questions: [
      'What is your company\'s mission?',
      'What problem are you solving?',
      'What is your solution?',
      'Who is your target market?',
      'What are your key financial projections?',
      'What funding are you seeking?'
    ]
  },
  {
    id: 'company-description',
    title: 'Company Description',
    description: 'Detailed information about your company',
    icon: Building2,
    content: '',
    completed: false,
    required: true,
    order: 2,
    tips: [
      'Describe your company\'s legal structure',
      'Explain your company\'s history and background',
      'Define your company\'s mission and vision',
      'List your products or services',
      'Identify your competitive advantages'
    ],
    questions: [
      'What is your company\'s legal structure? (LLC, Corporation, etc.)',
      'When was your company founded?',
      'What is your company\'s mission statement?',
      'What products or services do you offer?',
      'What makes your company unique?'
    ]
  },
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    description: 'Research and analysis of your target market',
    icon: BarChart,
    content: '',
    completed: false,
    required: true,
    order: 3,
    tips: [
      'Define your target market clearly',
      'Include market size (TAM, SAM, SOM)',
      'Analyze market trends and growth',
      'Identify your target customer segments',
      'Include competitive analysis'
    ],
    questions: [
      'What is your total addressable market (TAM)?',
      'What is your serviceable addressable market (SAM)?',
      'What is your serviceable obtainable market (SOM)?',
      'Who are your target customers?',
      'What are the key market trends?',
      'Who are your main competitors?'
    ]
  },
  {
    id: 'organization-management',
    title: 'Organization & Management',
    description: 'Your company structure and team',
    icon: Users,
    content: '',
    completed: false,
    required: true,
    order: 4,
    tips: [
      'Describe your organizational structure',
      'Introduce key team members and their roles',
      'Highlight relevant experience and expertise',
      'Include advisory board members if applicable',
      'Explain your hiring plan'
    ],
    questions: [
      'What is your organizational structure?',
      'Who are the key team members?',
      'What are their roles and responsibilities?',
      'What relevant experience do they have?',
      'Do you have an advisory board?',
      'What are your hiring plans?'
    ]
  },
  {
    id: 'product-service',
    title: 'Product or Service Line',
    description: 'Detailed description of your offerings',
    icon: Target,
    content: '',
    completed: false,
    required: true,
    order: 5,
    tips: [
      'Describe your products or services in detail',
      'Explain how they solve customer problems',
      'Highlight unique features and benefits',
      'Include product development roadmap',
      'Mention any intellectual property or patents'
    ],
    questions: [
      'What products or services do you offer?',
      'How do they solve customer problems?',
      'What are the key features and benefits?',
      'What is your product development roadmap?',
      'Do you have any patents or IP?',
      'What is your pricing strategy?'
    ]
  },
  {
    id: 'marketing-sales',
    title: 'Marketing & Sales Strategy',
    description: 'How you will reach and acquire customers',
    icon: TrendingUp,
    content: '',
    completed: false,
    required: true,
    order: 6,
    tips: [
      'Define your marketing channels',
      'Explain your sales process',
      'Include customer acquisition strategy',
      'Detail your pricing strategy',
      'Include marketing budget and timeline'
    ],
    questions: [
      'What marketing channels will you use?',
      'What is your customer acquisition strategy?',
      'What is your sales process?',
      'What is your pricing model?',
      'What is your marketing budget?',
      'What are your key marketing milestones?'
    ]
  },
  {
    id: 'financial-projections',
    title: 'Financial Projections',
    description: 'Financial forecasts and projections',
    icon: DollarSign,
    content: '',
    completed: false,
    required: true,
    order: 7,
    tips: [
      'Include 3-5 year financial projections',
      'Show revenue forecasts',
      'Detail expense projections',
      'Include cash flow statements',
      'Explain key assumptions',
      'Link to your Financial Projections tool for detailed calculations'
    ],
    questions: [
      'What are your revenue projections for the next 3-5 years?',
      'What are your major expense categories?',
      'What are your key financial assumptions?',
      'When do you expect to break even?',
      'What is your funding requirement?',
      'How will you use the funds?'
    ]
  },
  {
    id: 'funding-request',
    title: 'Funding Request',
    description: 'Details about your funding needs',
    icon: Zap,
    content: '',
    completed: false,
    required: false,
    order: 8,
    tips: [
      'Specify the exact amount you need',
      'Explain how you will use the funds',
      'Include a timeline for fund usage',
      'Detail your expected milestones',
      'Mention your valuation expectations'
    ],
    questions: [
      'How much funding are you seeking?',
      'How will you use the funds?',
      'What is your timeline for using the funds?',
      'What milestones will you achieve with this funding?',
      'What is your expected valuation?',
      'What type of funding are you seeking? (Equity, Debt, etc.)'
    ]
  },
  {
    id: 'appendix',
    title: 'Appendix',
    description: 'Supporting documents and additional information',
    icon: FileCheck,
    content: '',
    completed: false,
    required: false,
    order: 9,
    tips: [
      'Include resumes of key team members',
      'Add market research data',
      'Include product photos or demos',
      'Add letters of intent or contracts',
      'Include any relevant legal documents'
    ],
    questions: [
      'What supporting documents do you have?',
      'Do you have customer testimonials?',
      'Do you have letters of intent?',
      'What market research data can you include?',
      'What legal documents are relevant?'
    ]
  },
]

const aiSuggestions: Record<string, string[]> = {
  'executive-summary': [
    'Start with a compelling hook that captures attention',
    'Include your mission statement in the first paragraph',
    'Highlight your unique value proposition clearly',
    'Mention key financial metrics (revenue, growth rate)',
    'End with a clear call to action or funding request',
  ],
  'company-description': [
    'Clearly state your company\'s legal structure and location',
    'Explain the problem your company solves',
    'Describe your company\'s mission and vision',
    'List your core products or services',
    'Highlight what makes your company unique in the market',
  ],
  'market-analysis': [
    'Use credible sources for market size data (Gartner, McKinsey, etc.)',
    'Break down TAM, SAM, and SOM with clear explanations',
    'Identify and describe your target customer segments',
    'Analyze market trends and growth drivers',
    'Include competitive landscape analysis',
  ],
  'organization-management': [
    'Start with an organizational chart if applicable',
    'Highlight each team member\'s relevant experience',
    'Show how team skills complement each other',
    'Include advisors and their value-add',
    'Explain your hiring plan and organizational growth',
  ],
  'product-service': [
    'Describe your products/services in customer-focused language',
    'Explain how they solve specific customer problems',
    'Highlight unique features and competitive advantages',
    'Include product roadmap and development timeline',
    'Mention any intellectual property or proprietary technology',
  ],
  'marketing-sales': [
    'Detail your customer acquisition channels',
    'Explain your sales process and conversion funnel',
    'Include customer acquisition cost (CAC) and lifetime value (LTV)',
    'Describe your pricing strategy and revenue model',
    'Provide a marketing budget breakdown and timeline',
  ],
  'financial-projections': [
    'Include 3-5 year revenue and expense projections',
    'Show month-by-month projections for the first year',
    'Detail key assumptions behind your projections',
    'Include cash flow statements and break-even analysis',
    'Link financial projections to your business model and market size',
  ],
  'funding-request': [
    'Be specific about the funding amount needed',
    'Break down use of funds by category with percentages',
    'Set clear, measurable milestones for the funding round',
    'Explain how this funding gets you to profitability or next round',
    'Include your valuation expectations and terms',
  ],
}

export default function BusinessPlanPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [aiEnabled, setAiEnabled] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [planName, setPlanName] = useState('My Business Plan')
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize sections on mount
  useEffect(() => {
    const initialize = () => {
      try {
        const saved = localStorage.getItem('businessPlan')
        if (saved) {
          const planData = JSON.parse(saved)
          setPlanName(planData.name || 'My Business Plan')
          setSections(planData.sections && planData.sections.length > 0 ? planData.sections : defaultSections)
          setSelectedIndustry(planData.industry || null)
        } else {
          setSections(defaultSections)
        }
      } catch (error) {
        console.error('Error loading business plan:', error)
        setSections(defaultSections)
      } finally {
        setIsLoaded(true)
      }
    }

    if (typeof window !== 'undefined') {
      initialize()
    } else {
      setSections(defaultSections)
      setIsLoaded(true)
    }
  }, [])

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId)
    const section = sections.find(s => s.id === sectionId)
    if (section) {
      setEditingContent(section.content)
    }
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const handleSaveSection = () => {
    if (selectedSection) {
      const hasContent = editingContent.trim().length > 0
      setSections(sections.map(section => 
        section.id === selectedSection 
          ? { ...section, content: editingContent, completed: hasContent }
          : section
      ))
      showToast('Section saved!', 'success')
    }
  }

  const handleAISuggest = (sectionId: string) => {
    if (!aiEnabled) {
      showToast('Please enable AI Assistant first', 'info')
      return
    }
    const section = sections.find(s => s.id === sectionId)
    if (!section) return

    const suggestions = aiSuggestions[sectionId] || [
      'Be clear and concise',
      'Use data to support your points',
      'Focus on the value proposition',
      'Address potential concerns',
    ]

    showToast('Generating AI suggestions...', 'info')
    setTimeout(() => {
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
      const currentContent = section.content
      const enhancedContent = `${currentContent}\n\n💡 AI Tip: ${randomSuggestion}`
      setSections(sections.map(s => 
        s.id === sectionId ? { ...s, content: enhancedContent } : s
      ))
      if (selectedSection === sectionId) {
        setEditingContent(enhancedContent)
      }
      showToast('AI suggestion added!', 'success')
    }, 1500)
  }

  const handleIndustrySelect = (templateId: string) => {
    setSelectedIndustry(templateId)
    showToast(`Selected ${industryTemplates.find(t => t.id === templateId)?.name} template`, 'success')
  }

  const handleSave = () => {
    if (typeof window === 'undefined') return
    try {
      const planData = {
        name: planName,
        sections,
        industry: selectedIndustry,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('businessPlan', JSON.stringify(planData))
      showToast('Business plan saved locally!', 'success')
    } catch (error) {
      showToast('Error saving business plan', 'error')
    }
  }

  const handleLoad = () => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem('businessPlan')
      if (saved) {
        const planData = JSON.parse(saved)
        setPlanName(planData.name || 'My Business Plan')
        setSections(planData.sections || defaultSections)
        setSelectedIndustry(planData.industry || null)
        showToast('Business plan loaded!', 'success')
      } else {
        showToast('No saved business plan found', 'info')
      }
    } catch (error) {
      showToast('Error loading business plan', 'error')
    }
  }

  const handleExport = async (format: 'pdf' | 'docx') => {
    showToast(`Exporting business plan as ${format.toUpperCase()}...`, 'info')
    
    try {
      const planData = {
        name: planName,
        sections: sections.map(s => ({ title: s.title, content: s.content })),
        industry: selectedIndustry,
      }

      // Dynamic import to avoid SSR issues
      if (format === 'pdf') {
        const { exportToPDF } = await import('@/lib/utils/export')
        await exportToPDF(planData)
      } else {
        const { exportToDOCX } = await import('@/lib/utils/export')
        await exportToDOCX(planData)
      }
      
      showToast(`Business plan exported as ${format.toUpperCase()}!`, 'success')
    } catch (error) {
      console.error('Export error:', error)
      showToast(`Error exporting ${format.toUpperCase()}. Please try again.`, 'error')
    }
  }

  const handleShare = () => {
    if (typeof window === 'undefined') return
    
    if (navigator.share) {
      navigator.share({
        title: planName,
        text: 'Check out my business plan',
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

  const completedCount = sections.filter(s => s.completed).length
  const requiredCompleted = sections.filter(s => s.required && s.completed).length
  const requiredCount = sections.filter(s => s.required).length
  const progress = requiredCount > 0 ? (requiredCompleted / requiredCount) * 100 : 0

  const sortedSections = [...sections].sort((a, b) => a.order - b.order)
  const currentSection = selectedSection ? sections.find(s => s.id === selectedSection) : null

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Business Plan Generator...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                  Business Plan Generator
                </span>
              </h1>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="text-lg text-gray-600 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 w-full"
                placeholder="Enter plan name..."
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleLoad}>
                <FileText className="h-4 w-4 mr-2" />
                Load
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant={viewMode === 'preview' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
              >
                <Eye className="h-4 w-4 mr-2" />
                {viewMode === 'edit' ? 'Preview' : 'Edit'}
              </Button>
              <Button size="sm" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            Create a comprehensive business plan step-by-step with AI assistance and industry templates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Industry Templates */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Industry Templates</h3>
                <Badge variant="new">Choose Your Industry</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {industryTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleIndustrySelect(template.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedIndustry === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 bg-white'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">{template.name}</div>
                    <div className="text-xs text-gray-600">{template.description}</div>
                  </button>
                ))}
              </div>
            </Card>

            {viewMode === 'edit' ? (
              <>
                {/* Sections List */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Business Plan Sections</h2>
                    <Badge variant="outline">{completedCount} of {sections.length} completed</Badge>
                  </div>
                  <div className="space-y-3">
                    {sortedSections.map((section) => {
                      const IconComponent = section.icon
                      const isExpanded = expandedSections.has(section.id)
                      const isSelected = selectedSection === section.id
                      return (
                        <div
                          key={section.id}
                          className={`border-2 rounded-lg transition-all ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50'
                              : section.completed
                              ? 'border-green-200 bg-green-50'
                              : 'border-gray-200 hover:border-primary-300 bg-white'
                          }`}
                        >
                          <div
                            onClick={() => handleSectionClick(section.id)}
                            className="p-4 cursor-pointer"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                <div className={`p-2 rounded-lg ${
                                  section.completed ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'
                                }`}>
                                  {section.completed ? (
                                    <CheckCircle className="h-5 w-5" />
                                  ) : (
                                    <IconComponent className="h-5 w-5" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`font-semibold ${section.completed ? 'text-green-700' : ''}`}>
                                      {section.title}
                                    </h3>
                                    {section.required && (
                                      <Badge variant="outline" className="text-xs">Required</Badge>
                                    )}
                                    {section.completed && (
                                      <Badge variant="new" className="text-xs">Complete</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                                  {section.content && (
                                    <p className="text-xs text-gray-500 line-clamp-1">
                                      {section.content.substring(0, 100)}...
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isExpanded ? (
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                              {section.tips && section.tips.length > 0 && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm font-semibold">Tips</span>
                                  </div>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {section.tips.map((tip, idx) => (
                                      <li key={idx}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {section.questions && section.questions.length > 0 && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <HelpCircle className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-semibold">Key Questions to Answer</span>
                                  </div>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {section.questions.map((question, idx) => (
                                      <li key={idx}>{question}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {isSelected && (
                                <div className="mt-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAISuggest(section.id)
                                    }}
                                    disabled={!aiEnabled}
                                    className="w-full mb-2"
                                  >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Get AI Suggestions
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedSection(section.id)
                                      const sec = sections.find(s => s.id === section.id)
                                      if (sec) setEditingContent(sec.content)
                                    }}
                                    className="w-full"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Section
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </Card>

                {/* Section Editor */}
                {selectedSection && currentSection && (
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Editing: {currentSection.title}</h3>
                        <p className="text-sm text-gray-600">{currentSection.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedSection(null)
                          setEditingContent('')
                        }}>
                          <X className="h-4 w-4 mr-2" />
                          Close
                        </Button>
                        <Button size="sm" onClick={handleSaveSection}>
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Content
                        </label>
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none font-sans text-sm leading-relaxed"
                          placeholder={`Start writing your ${currentSection.title.toLowerCase()}...\n\nUse bullet points (•) for lists, line breaks for paragraphs.`}
                        />
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>Tip: Use • for bullet points, line breaks for paragraphs</span>
                        </div>
                      </div>
                      {currentSection.questions && currentSection.questions.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <HelpCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-900">Questions to Address</span>
                          </div>
                          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                            {currentSection.questions.map((question, idx) => (
                              <li key={idx}>{question}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </>
            ) : (
              /* Preview Mode */
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Business Plan Preview</h2>
                  <p className="text-sm text-gray-600">Review your complete business plan</p>
                </div>
                <div className="space-y-8 max-h-[800px] overflow-y-auto">
                  {sortedSections.map((section, index) => {
                    const IconComponent = section.icon
                    return (
                      <div
                        key={section.id}
                        className="bg-white border-2 border-gray-200 rounded-lg p-8 shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{section.title}</h3>
                            <p className="text-sm text-gray-500">Section {index + 1} of {sortedSections.length}</p>
                          </div>
                        </div>
                        <div className="prose max-w-none">
                          {section.content ? (
                            <pre className="whitespace-pre-wrap font-sans text-gray-700 text-base leading-relaxed">
                              {section.content}
                            </pre>
                          ) : (
                            <div className="text-gray-400 italic text-center py-8">
                              This section has not been completed yet.
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <h3 className="font-semibold mb-4">Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Required Sections</span>
                  <span className="font-semibold">{requiredCompleted} / {requiredCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-primary-500 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">All Sections</span>
                  <span className="font-semibold">{completedCount} / {sections.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(completedCount / sections.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              {requiredCompleted === requiredCount && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    All required sections completed!
                  </p>
                </div>
              )}
              {requiredCompleted < requiredCount && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {requiredCount - requiredCompleted} required section(s) remaining
                  </p>
                </div>
              )}
            </Card>

            {/* AI Assistant */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary-500" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Get AI-powered suggestions for each section
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

            {/* Quick Actions */}
            <Card>
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    const financialSection = sections.find(s => s.id === 'financial-projections')
                    if (financialSection) {
                      setSelectedSection('financial-projections')
                      setEditingContent(financialSection.content)
                      showToast('Opened Financial Projections section', 'info')
                    }
                  }}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financial Projections
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    window.location.href = '/startup/financial-projections'
                  }}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Use Financial Tool
                </Button>
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
                  onClick={() => handleExport('docx')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as DOCX
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
