'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Search, BookOpen, FileText, Wrench, Calculator, Video, CheckSquare, Share2, Bookmark, ExternalLink, TrendingUp, DollarSign, Lightbulb, Shield, Rocket, Users, BarChart3, Target } from 'lucide-react'
import { handleShare, handleBookmark } from '@/lib/utils/actions'
import { showToast } from '@/components/ui/ToastContainer'
import EmptyState from '@/components/ui/EmptyState'

interface Resource {
  id: string
  title: string
  description: string
  type: 'guide' | 'template' | 'tool' | 'calculator' | 'video' | 'checklist'
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  author: string
  readTime: string
  tags: string[]
  featured?: boolean
  popular?: boolean
  href: string
  icon?: any
}

const resources: Resource[] = [
  // Startup Fundamentals
  {
    id: 'startup-checklist',
    title: 'Startup Checklist',
    description: 'Comprehensive checklist covering all stages from idea validation to scaling your startup.',
    type: 'checklist',
    category: 'Startup Fundamentals',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '5 min',
    tags: ['checklist', 'planning', 'fundamentals'],
    featured: true,
    popular: true,
    href: '/startup/checklist',
    icon: CheckSquare,
  },
  {
    id: 'business-plan',
    title: 'Business Plan Builder',
    description: 'Create a comprehensive business plan with interactive sections and progress tracking.',
    type: 'tool',
    category: 'Startup Fundamentals',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '30 min',
    tags: ['business-plan', 'planning', 'strategy'],
    featured: true,
    popular: true,
    href: '/startup/business-plan',
    icon: FileText,
  },
  {
    id: 'business-model-canvas',
    title: 'Business Model Canvas',
    description: 'Visualize and design your business model with the proven canvas framework.',
    type: 'template',
    category: 'Startup Fundamentals',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['business-model', 'canvas', 'strategy'],
    featured: false,
    popular: true,
    href: '/startup/business-model-canvas',
    icon: Target,
  },
  {
    id: 'startup-guides',
    title: 'Startup Guides Hub',
    description: 'Access 35+ comprehensive guides covering every aspect of your startup journey.',
    type: 'guide',
    category: 'Startup Fundamentals',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: 'Varies',
    tags: ['guides', 'learning', 'resources'],
    featured: true,
    popular: true,
    href: '/startup/guides',
    icon: BookOpen,
  },
  
  // Idea & Validation
  {
    id: 'idea-validation',
    title: 'Idea Validation Toolkit',
    description: 'Validate your startup idea with problem validation, solution testing, and MVP planning tools.',
    type: 'tool',
    category: 'Idea & Validation',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '20 min',
    tags: ['validation', 'idea', 'mvp'],
    featured: true,
    popular: true,
    href: '/startup/idea-validation',
    icon: Lightbulb,
  },
  {
    id: 'customer-discovery',
    title: 'Customer Discovery Tool',
    description: 'Build surveys, schedule interviews, analyze feedback, and create customer personas.',
    type: 'tool',
    category: 'Idea & Validation',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '25 min',
    tags: ['customer-discovery', 'surveys', 'interviews'],
    featured: true,
    popular: false,
    href: '/startup/customer-discovery',
    icon: Users,
  },
  {
    id: 'market-research',
    title: 'Market Research Tool',
    description: 'Conduct comprehensive market research and competitive analysis for your startup.',
    type: 'tool',
    category: 'Idea & Validation',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '30 min',
    tags: ['market-research', 'analysis', 'competition'],
    featured: false,
    popular: true,
    href: '/startup/market-research',
    icon: BarChart3,
  },
  {
    id: 'competitive-analysis',
    title: 'Competitive Analysis',
    description: 'Analyze your competitors and identify market opportunities.',
    type: 'tool',
    category: 'Idea & Validation',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '20 min',
    tags: ['competition', 'analysis', 'strategy'],
    featured: false,
    popular: false,
    href: '/startup/competitive-analysis',
    icon: TrendingUp,
  },
  {
    id: 'swot-analysis',
    title: 'SWOT Analysis',
    description: 'Identify your startup\'s strengths, weaknesses, opportunities, and threats.',
    type: 'tool',
    category: 'Idea & Validation',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['swot', 'analysis', 'strategy'],
    featured: false,
    popular: false,
    href: '/startup/swot-analysis',
    icon: Target,
  },
  
  // Funding & Investment
  {
    id: 'funding-navigator',
    title: 'Funding Navigator',
    description: 'Complete funding toolkit with readiness assessment, investor matching, grant finder, and more.',
    type: 'tool',
    category: 'Funding & Investment',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '30 min',
    tags: ['funding', 'investors', 'grants'],
    featured: true,
    popular: true,
    href: '/startup/funding-navigator',
    icon: DollarSign,
  },
  {
    id: 'pitch-deck-builder',
    title: 'Pitch Deck Builder',
    description: 'Create professional pitch decks with templates and slide management.',
    type: 'tool',
    category: 'Funding & Investment',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '45 min',
    tags: ['pitch-deck', 'fundraising', 'presentation'],
    featured: true,
    popular: true,
    href: '/startup/pitch-deck-builder',
    icon: FileText,
  },
  {
    id: 'valuation-calculator',
    title: 'Valuation Calculator',
    description: 'Calculate your startup valuation using multiple methodologies: Revenue Multiple, DCF, Scorecard, and more.',
    type: 'calculator',
    category: 'Funding & Investment',
    difficulty: 'advanced',
    author: 'GrowthLab Team',
    readTime: '20 min',
    tags: ['valuation', 'finance', 'calculations'],
    featured: true,
    popular: true,
    href: '/startup/valuation-calculator',
    icon: Calculator,
  },
  {
    id: 'cap-table',
    title: 'Cap Table Manager',
    description: 'Track equity ownership and manage your capitalization table.',
    type: 'tool',
    category: 'Funding & Investment',
    difficulty: 'advanced',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['cap-table', 'equity', 'ownership'],
    featured: false,
    popular: false,
    href: '/startup/cap-table',
    icon: BarChart3,
  },
  {
    id: 'term-sheet',
    title: 'Term Sheet Analyzer',
    description: 'Analyze and understand investment term sheets.',
    type: 'tool',
    category: 'Funding & Investment',
    difficulty: 'advanced',
    author: 'GrowthLab Team',
    readTime: '20 min',
    tags: ['term-sheet', 'investment', 'legal'],
    featured: false,
    popular: false,
    href: '/startup/term-sheet',
    icon: FileText,
  },
  {
    id: 'safe-generator',
    title: 'SAFE Generator',
    description: 'Generate Simple Agreement for Future Equity documents.',
    type: 'template',
    category: 'Funding & Investment',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['safe', 'fundraising', 'legal'],
    featured: false,
    popular: false,
    href: '/startup/safe-generator',
    icon: FileText,
  },
  {
    id: 'equity-calculator',
    title: 'Equity Calculator',
    description: 'Calculate equity dilution and ownership percentages.',
    type: 'calculator',
    category: 'Funding & Investment',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '10 min',
    tags: ['equity', 'dilution', 'calculations'],
    featured: false,
    popular: false,
    href: '/startup/equity-calculator',
    icon: Calculator,
  },
  {
    id: 'esop-calculator',
    title: 'ESOP Calculator',
    description: 'Calculate employee stock option pool allocations.',
    type: 'calculator',
    category: 'Funding & Investment',
    difficulty: 'advanced',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['esop', 'equity', 'options'],
    featured: false,
    popular: false,
    href: '/startup/esop-calculator',
    icon: Calculator,
  },
  {
    id: 'convertible-note-calculator',
    title: 'Convertible Note Calculator',
    description: 'Calculate conversion rates and equity for convertible notes.',
    type: 'calculator',
    category: 'Funding & Investment',
    difficulty: 'advanced',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['convertible-note', 'fundraising', 'calculations'],
    featured: false,
    popular: false,
    href: '/startup/convertible-note-calculator',
    icon: Calculator,
  },
  
  // Financial Tools
  {
    id: 'financial-projections',
    title: 'Financial Projections',
    description: 'Create detailed financial projections and forecasts for your startup.',
    type: 'tool',
    category: 'Finance & Accounting',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '30 min',
    tags: ['financial', 'projections', 'forecasting'],
    featured: true,
    popular: true,
    href: '/startup/financial-projections',
    icon: BarChart3,
  },
  {
    id: 'burn-rate-calculator',
    title: 'Burn Rate Calculator',
    description: 'Calculate your monthly burn rate and runway.',
    type: 'calculator',
    category: 'Finance & Accounting',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '5 min',
    tags: ['burn-rate', 'finance', 'runway'],
    featured: false,
    popular: true,
    href: '/startup/burn-rate-calculator',
    icon: Calculator,
  },
  {
    id: 'runway-calculator',
    title: 'Runway Calculator',
    description: 'Calculate how long your startup can operate with current cash.',
    type: 'calculator',
    category: 'Finance & Accounting',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '5 min',
    tags: ['runway', 'finance', 'cash'],
    featured: false,
    popular: true,
    href: '/startup/runway-calculator',
    icon: Calculator,
  },
  {
    id: 'cac-calculator',
    title: 'CAC Calculator',
    description: 'Calculate Customer Acquisition Cost and optimize marketing spend.',
    type: 'calculator',
    category: 'Finance & Accounting',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '10 min',
    tags: ['cac', 'marketing', 'metrics'],
    featured: false,
    popular: true,
    href: '/startup/cac-calculator',
    icon: Calculator,
  },
  {
    id: 'ltv-calculator',
    title: 'LTV Calculator',
    description: 'Calculate Customer Lifetime Value to understand revenue potential.',
    type: 'calculator',
    category: 'Finance & Accounting',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '10 min',
    tags: ['ltv', 'revenue', 'metrics'],
    featured: false,
    popular: true,
    href: '/startup/ltv-calculator',
    icon: Calculator,
  },
  {
    id: 'break-even-calculator',
    title: 'Break-Even Calculator',
    description: 'Calculate when your startup will break even.',
    type: 'calculator',
    category: 'Finance & Accounting',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '10 min',
    tags: ['break-even', 'finance', 'profitability'],
    featured: false,
    popular: false,
    href: '/startup/break-even-calculator',
    icon: Calculator,
  },
  {
    id: 'roi-calculator',
    title: 'ROI Calculator',
    description: 'Calculate Return on Investment for marketing and growth initiatives.',
    type: 'calculator',
    category: 'Finance & Accounting',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '5 min',
    tags: ['roi', 'metrics', 'analysis'],
    featured: false,
    popular: false,
    href: '/startup/roi-calculator',
    icon: Calculator,
  },
  {
    id: 'pricing-calculator',
    title: 'Pricing Calculator',
    description: 'Calculate optimal pricing for your products and services.',
    type: 'calculator',
    category: 'Finance & Accounting',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['pricing', 'strategy', 'revenue'],
    featured: false,
    popular: false,
    href: '/startup/pricing-calculator',
    icon: Calculator,
  },
  {
    id: 'growth-rate-calculator',
    title: 'Growth Rate Calculator',
    description: 'Calculate month-over-month and year-over-year growth rates.',
    type: 'calculator',
    category: 'Finance & Accounting',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '5 min',
    tags: ['growth', 'metrics', 'analytics'],
    featured: false,
    popular: false,
    href: '/startup/growth-rate-calculator',
    icon: Calculator,
  },
  
  // Legal & Compliance
  {
    id: 'legal-documents',
    title: 'Legal Document Generator',
    description: 'Generate 54+ legal documents including NDAs, contracts, agreements, and more.',
    type: 'tool',
    category: 'Legal & Compliance',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '20 min',
    tags: ['legal', 'documents', 'compliance'],
    featured: true,
    popular: true,
    href: '/startup/legal-documents',
    icon: Shield,
  },
  {
    id: 'nda-generator',
    title: 'NDA Generator',
    description: 'Generate Non-Disclosure Agreements quickly and easily.',
    type: 'template',
    category: 'Legal & Compliance',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '10 min',
    tags: ['nda', 'legal', 'confidentiality'],
    featured: false,
    popular: true,
    href: '/startup/nda-generator',
    icon: FileText,
  },
  {
    id: 'partnership-agreement',
    title: 'Partnership Agreement',
    description: 'Create partnership agreements for business collaborations.',
    type: 'template',
    category: 'Legal & Compliance',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['partnership', 'legal', 'agreement'],
    featured: false,
    popular: false,
    href: '/startup/partnership-agreement',
    icon: FileText,
  },
  {
    id: 'legal-structure',
    title: 'Legal Structure Guide',
    description: 'Learn about different business entity types and legal structures.',
    type: 'guide',
    category: 'Legal & Compliance',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['legal', 'structure', 'entity'],
    featured: false,
    popular: false,
    href: '/startup/legal/structure',
    icon: Shield,
  },
  {
    id: 'ip-protection',
    title: 'IP Protection Resources',
    description: 'Resources for protecting your intellectual property.',
    type: 'guide',
    category: 'Legal & Compliance',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '20 min',
    tags: ['ip', 'patents', 'trademarks'],
    featured: false,
    popular: false,
    href: '/startup/legal/ip-protection',
    icon: Shield,
  },
  
  // Marketing & Sales
  {
    id: 'marketing-strategy',
    title: 'Marketing Strategy Builder',
    description: 'Build comprehensive digital marketing strategies for your startup.',
    type: 'tool',
    category: 'Marketing & Sales',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '25 min',
    tags: ['marketing', 'strategy', 'growth'],
    featured: false,
    popular: true,
    href: '/startup/marketing/strategy',
    icon: TrendingUp,
  },
  {
    id: 'marketing-analytics',
    title: 'Marketing Analytics',
    description: 'Track and analyze your marketing performance and growth metrics.',
    type: 'tool',
    category: 'Marketing & Sales',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '20 min',
    tags: ['analytics', 'marketing', 'metrics'],
    featured: false,
    popular: false,
    href: '/startup/marketing/analytics',
    icon: BarChart3,
  },
  {
    id: 'sales-process',
    title: 'Sales Process Builder',
    description: 'Design and optimize your sales process and pipeline.',
    type: 'tool',
    category: 'Marketing & Sales',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '20 min',
    tags: ['sales', 'process', 'pipeline'],
    featured: false,
    popular: false,
    href: '/startup/sales/process',
    icon: Target,
  },
  {
    id: 'conversion-rate-calculator',
    title: 'Conversion Rate Calculator',
    description: 'Calculate and optimize conversion rates for your marketing campaigns.',
    type: 'calculator',
    category: 'Marketing & Sales',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '5 min',
    tags: ['conversion', 'marketing', 'metrics'],
    featured: false,
    popular: false,
    href: '/startup/conversion-rate-calculator',
    icon: Calculator,
  },
  {
    id: 'ab-test-calculator',
    title: 'A/B Test Calculator',
    description: 'Calculate statistical significance for A/B tests.',
    type: 'calculator',
    category: 'Marketing & Sales',
    difficulty: 'advanced',
    author: 'GrowthLab Team',
    readTime: '10 min',
    tags: ['ab-testing', 'analytics', 'optimization'],
    featured: false,
    popular: false,
    href: '/startup/ab-test-calculator',
    icon: Calculator,
  },
  
  // Productivity & Operations
  {
    id: 'goal-tracker',
    title: 'Goal Tracker',
    description: 'Track and manage your startup goals and milestones.',
    type: 'tool',
    category: 'Productivity & Operations',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '10 min',
    tags: ['goals', 'tracking', 'productivity'],
    featured: false,
    popular: false,
    href: '/startup/goal-tracker',
    icon: Target,
  },
  {
    id: 'operations-dashboard',
    title: 'Operations Dashboard',
    description: 'Monitor and manage your startup operations in one place.',
    type: 'tool',
    category: 'Productivity & Operations',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['operations', 'dashboard', 'management'],
    featured: false,
    popular: false,
    href: '/startup/operations-dashboard',
    icon: BarChart3,
  },
  {
    id: 'team-management',
    title: 'Team Management Hub',
    description: 'Manage your team, roles, and organizational structure.',
    type: 'tool',
    category: 'Productivity & Operations',
    difficulty: 'beginner',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['team', 'management', 'organization'],
    featured: false,
    popular: false,
    href: '/startup/team-management',
    icon: Users,
  },
  {
    id: 'due-diligence',
    title: 'Due Diligence Checklist',
    description: 'Comprehensive checklist for investor due diligence preparation.',
    type: 'checklist',
    category: 'Productivity & Operations',
    difficulty: 'advanced',
    author: 'GrowthLab Team',
    readTime: '20 min',
    tags: ['due-diligence', 'fundraising', 'preparation'],
    featured: false,
    popular: false,
    href: '/startup/due-diligence',
    icon: CheckSquare,
  },
  {
    id: 'investor-pitch-tracker',
    title: 'Investor Pitch Tracker',
    description: 'Track your investor pitches and follow-ups.',
    type: 'tool',
    category: 'Productivity & Operations',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '10 min',
    tags: ['investors', 'tracking', 'fundraising'],
    featured: false,
    popular: false,
    href: '/startup/investor-pitch-tracker',
    icon: Target,
  },
  {
    id: 'board-meeting-planner',
    title: 'Board Meeting Planner',
    description: 'Plan and organize board meetings with agendas and minutes.',
    type: 'tool',
    category: 'Productivity & Operations',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '15 min',
    tags: ['board', 'meetings', 'governance'],
    featured: false,
    popular: false,
    href: '/startup/board-meeting-planner',
    icon: FileText,
  },
  {
    id: 'advisory-board-builder',
    title: 'Advisory Board Builder',
    description: 'Build and manage your advisory board.',
    type: 'tool',
    category: 'Productivity & Operations',
    difficulty: 'intermediate',
    author: 'GrowthLab Team',
    readTime: '20 min',
    tags: ['advisory', 'board', 'mentorship'],
    featured: false,
    popular: false,
    href: '/startup/advisory-board-builder',
    icon: Users,
  },
]

const typeIcons = {
  guide: BookOpen,
  template: FileText,
  tool: Wrench,
  calculator: Calculator,
  video: Video,
  checklist: CheckSquare,
}

const categories = [
  'All Categories',
  'Startup Fundamentals',
  'Idea & Validation',
  'Funding & Investment',
  'Finance & Accounting',
  'Legal & Compliance',
  'Marketing & Sales',
  'Productivity & Operations',
]

const difficulties = ['All Levels', 'beginner', 'intermediate', 'advanced']
const types = ['All Types', 'guide', 'template', 'tool', 'calculator', 'video', 'checklist']

export default function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels')
  const [selectedType, setSelectedType] = useState('All Types')
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'popular'>('all')
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All Categories' || resource.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All Levels' || resource.difficulty === selectedDifficulty
    const matchesType = selectedType === 'All Types' || resource.type === selectedType
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'featured' && resource.featured) ||
      (activeTab === 'popular' && resource.popular)

    return matchesSearch && matchesCategory && matchesDifficulty && matchesType && matchesTab
  })

  const handleOpenResource = (href: string, title: string) => {
    showToast(`Opening ${title}...`, 'info')
    window.location.href = href
  }

  const toggleBookmark = (resourceId: string) => {
    const newBookmarked = new Set(bookmarked)
    if (newBookmarked.has(resourceId)) {
      newBookmarked.delete(resourceId)
      handleBookmark(resourceId, true)
    } else {
      newBookmarked.add(resourceId)
      handleBookmark(resourceId, false)
    }
    setBookmarked(newBookmarked)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-gray-600">
          Browse {resources.length} resources across all categories. All resources link directly to working tools and pages.
        </p>
      </div>
      <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all shrink-0 ${
            activeTab === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('featured')}
          className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all shrink-0 ${
            activeTab === 'featured'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Featured
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all shrink-0 ${
            activeTab === 'popular'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Popular
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 z-10" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categories.map(cat => ({ value: cat, label: cat }))}
          />
          <Select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            options={difficulties.map(diff => ({ 
              value: diff, 
              label: diff === 'All Levels' ? diff : diff.charAt(0).toUpperCase() + diff.slice(1)
            }))}
          />
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={types.map(type => ({ 
              value: type, 
              label: type === 'All Types' ? type : type.charAt(0).toUpperCase() + type.slice(1)
            }))}
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} of {resources.length} total
      </div>

      {filteredResources.length === 0 ? (
        <div className="py-12 sm:py-16">
          <EmptyState
            icon={<Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400" />}
            title="No resources found"
            description="Try adjusting your search or filters"
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery('')
              setSelectedCategory('All Categories')
              setSelectedDifficulty('All Levels')
              setSelectedType('All Types')
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredResources.map((resource) => {
            const IconComponent = resource.icon || typeIcons[resource.type]
            return (
              <Card key={resource.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-primary-500/10 p-2 rounded-lg text-primary-500 shrink-0">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {resource.featured && <Badge variant="new" className="text-xs shrink-0">Featured</Badge>}
                    {resource.popular && <Badge variant="outline" className="text-xs shrink-0">Popular</Badge>}
                    <Badge variant={resource.difficulty} className="text-xs shrink-0">
                      {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                    </Badge>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{resource.description}</p>
                <div className="text-xs text-gray-500 mb-4">
                  By {resource.author} • {resource.readTime} read
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{resource.tags.length - 3} more</span>
                  )}
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button 
                    className="flex-1 min-w-[120px]" 
                    size="sm"
                    onClick={() => handleOpenResource(resource.href, resource.title)}
                  >
                    Open Resource
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-3 shrink-0"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        handleShare(window.location.origin + resource.href, resource.title)
                      }
                    }}
                    title="Share resource"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="px-3 shrink-0"
                    onClick={() => toggleBookmark(resource.id)}
                    title={bookmarked.has(resource.id) ? 'Remove bookmark' : 'Bookmark'}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarked.has(resource.id) ? 'fill-primary-500 text-primary-500' : ''}`} />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
