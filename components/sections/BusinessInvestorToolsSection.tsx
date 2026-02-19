'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import {
  TrendingUp,
  FileText,
  Calculator,
  Users,
  Target,
  BarChart,
  DollarSign,
  Briefcase,
  ClipboardCheck,
  PieChart,
  Calendar,
  Shield,
  Users2,
  FileCheck,
  Percent,
  ArrowRight,
  Sparkles,
  Search,
  Star,
  Clock,
  CheckCircle,
  Zap,
  Building2,
  Rocket,
  LineChart,
  Wallet,
  Scale,
  Award,
  Filter,
  ChevronRight,
  Play,
  BookOpen,
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface Tool {
  id: string
  title: string
  description: string
  iconName: string
  link: string
  badge?: 'new' | 'pro' | 'popular' | 'essential'
  features: string[]
  category: 'business' | 'investor' | 'financial'
  usageCount?: number
  rating?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: string
}

const tools: Tool[] = [
  {
    id: 'cap-table',
    title: 'Cap Table Manager',
    description: 'Manage your startup\'s capitalization table and track equity ownership with real-time updates.',
    iconName: 'PieChart',
    link: '/startup/cap-table',
    badge: 'essential',
    category: 'investor',
    features: ['Equity Tracking', 'Dilution Analysis', 'Option Pool Management', 'Investor Updates'],
    usageCount: 12500,
    rating: 4.9,
    difficulty: 'intermediate',
    estimatedTime: '15 min',
  },
  {
    id: 'term-sheet',
    title: 'Term Sheet Generator',
    description: 'Create professional term sheets for funding rounds with customizable templates and legal compliance.',
    iconName: 'FileText',
    link: '/startup/term-sheet',
    badge: 'new',
    category: 'investor',
    features: ['Standard Templates', 'Custom Terms', 'Valuation Fields', 'Legal Compliance'],
    usageCount: 8900,
    rating: 4.8,
    difficulty: 'advanced',
    estimatedTime: '20 min',
  },
  {
    id: 'due-diligence',
    title: 'Due Diligence Checklist',
    description: 'Comprehensive checklist to prepare for investor due diligence with progress tracking.',
    iconName: 'ClipboardCheck',
    link: '/startup/due-diligence',
    category: 'investor',
    features: ['Legal Documents', 'Financial Records', 'IP Documentation', 'Team Information'],
    usageCount: 15200,
    rating: 4.9,
    difficulty: 'beginner',
    estimatedTime: '30 min',
  },
  {
    id: 'business-model',
    title: 'Business Model Canvas',
    description: 'Visualize and design your business model with an interactive canvas tool and AI suggestions.',
    iconName: 'Target',
    link: '/startup/business-model-canvas',
    badge: 'popular',
    category: 'business',
    features: ['9 Building Blocks', 'Visual Design', 'Export Options', 'Collaboration'],
    usageCount: 28500,
    rating: 4.9,
    difficulty: 'beginner',
    estimatedTime: '25 min',
  },
  {
    id: 'swot-analysis',
    title: 'SWOT Analysis Tool',
    description: 'Analyze your startup\'s strengths, weaknesses, opportunities, and threats with AI insights.',
    iconName: 'BarChart',
    link: '/startup/swot-analysis',
    category: 'business',
    features: ['Structured Analysis', 'Visual Reports', 'Action Planning', 'Team Collaboration'],
    usageCount: 19800,
    rating: 4.7,
    difficulty: 'beginner',
    estimatedTime: '20 min',
  },
  {
    id: 'competitive-analysis',
    title: 'Competitive Analysis',
    description: 'Analyze competitors and identify your competitive advantages with market intelligence.',
    iconName: 'TrendingUp',
    link: '/startup/competitive-analysis',
    category: 'business',
    features: ['Competitor Mapping', 'Feature Comparison', 'Market Positioning', 'Strategy Insights'],
    usageCount: 14300,
    rating: 4.8,
    difficulty: 'intermediate',
    estimatedTime: '30 min',
  },
  {
    id: 'cac-calculator',
    title: 'CAC Calculator',
    description: 'Calculate Customer Acquisition Cost and optimize your marketing spend with benchmarks.',
    iconName: 'Calculator',
    link: '/startup/cac-calculator',
    category: 'financial',
    features: ['CAC Calculation', 'LTV Comparison', 'Payback Period', 'Optimization Tips'],
    usageCount: 22100,
    rating: 4.8,
    difficulty: 'beginner',
    estimatedTime: '10 min',
  },
  {
    id: 'ltv-calculator',
    title: 'LTV Calculator',
    description: 'Calculate Customer Lifetime Value to understand long-term revenue potential.',
    iconName: 'DollarSign',
    link: '/startup/ltv-calculator',
    category: 'financial',
    features: ['LTV Calculation', 'CAC Ratio', 'Retention Analysis', 'Revenue Projections'],
    usageCount: 18700,
    rating: 4.7,
    difficulty: 'beginner',
    estimatedTime: '10 min',
  },
  {
    id: 'burn-rate',
    title: 'Burn Rate Calculator',
    description: 'Track your startup\'s burn rate and calculate runway to plan funding needs.',
    iconName: 'TrendingUp',
    link: '/startup/burn-rate-calculator',
    badge: 'popular',
    category: 'financial',
    features: ['Monthly Burn', 'Runway Calculation', 'Cash Flow Tracking', 'Funding Planning'],
    usageCount: 31200,
    rating: 4.9,
    difficulty: 'beginner',
    estimatedTime: '15 min',
  },
  {
    id: 'runway-calculator',
    title: 'Runway Calculator',
    description: 'Calculate how long your startup can operate with current funding and scenario planning.',
    iconName: 'Calendar',
    link: '/startup/runway-calculator',
    category: 'financial',
    features: ['Runway Estimation', 'Funding Timeline', 'Expense Planning', 'Milestone Tracking'],
    usageCount: 25600,
    rating: 4.8,
    difficulty: 'beginner',
    estimatedTime: '10 min',
  },
  {
    id: 'equity-calculator',
    title: 'Equity Calculator',
    description: 'Calculate equity distribution for founders, employees, and investors with scenarios.',
    iconName: 'Percent',
    link: '/startup/equity-calculator',
    category: 'investor',
    features: ['Equity Splits', 'Dilution Scenarios', 'Option Pool Planning', 'Vesting Schedules'],
    usageCount: 16800,
    rating: 4.8,
    difficulty: 'intermediate',
    estimatedTime: '20 min',
  },
  {
    id: 'convertible-note',
    title: 'Convertible Note Calculator',
    description: 'Calculate conversion terms for convertible notes and SAFE agreements.',
    iconName: 'FileCheck',
    link: '/startup/convertible-note-calculator',
    category: 'investor',
    features: ['Conversion Terms', 'Valuation Caps', 'Discount Rates', 'Interest Calculations'],
    usageCount: 11400,
    rating: 4.7,
    difficulty: 'advanced',
    estimatedTime: '15 min',
  },
  {
    id: 'safe-generator',
    title: 'SAFE Agreement Generator',
    description: 'Generate Simple Agreement for Future Equity (SAFE) documents with legal templates.',
    iconName: 'FileText',
    link: '/startup/safe-generator',
    badge: 'new',
    category: 'investor',
    features: ['Standard SAFE', 'Custom Terms', 'Legal Templates', 'E-signature Ready'],
    usageCount: 9200,
    rating: 4.9,
    difficulty: 'intermediate',
    estimatedTime: '25 min',
  },
  {
    id: 'investor-pitch-tracker',
    title: 'Investor Pitch Tracker',
    description: 'Track your investor meetings, follow-ups, and funding progress in one place.',
    iconName: 'Briefcase',
    link: '/startup/investor-pitch-tracker',
    badge: 'essential',
    category: 'investor',
    features: ['Meeting Logs', 'Follow-up Reminders', 'Deal Pipeline', 'Investor Database'],
    usageCount: 21300,
    rating: 4.9,
    difficulty: 'beginner',
    estimatedTime: '10 min',
  },
  {
    id: 'board-meeting',
    title: 'Board Meeting Planner',
    description: 'Plan and organize board meetings with agenda templates and minutes.',
    iconName: 'Calendar',
    link: '/startup/board-meeting-planner',
    category: 'business',
    features: ['Agenda Builder', 'Meeting Minutes', 'Action Items', 'Document Management'],
    usageCount: 8700,
    rating: 4.6,
    difficulty: 'intermediate',
    estimatedTime: '20 min',
  },
  {
    id: 'advisory-board',
    title: 'Advisory Board Builder',
    description: 'Build and manage your advisory board with role definitions and compensation.',
    iconName: 'Users',
    link: '/startup/advisory-board-builder',
    category: 'business',
    features: ['Role Definition', 'Compensation Planning', 'Onboarding Process', 'Performance Tracking'],
    usageCount: 6500,
    rating: 4.5,
    difficulty: 'intermediate',
    estimatedTime: '30 min',
  },
  {
    id: 'partnership-agreement',
    title: 'Partnership Agreement Generator',
    description: 'Create partnership agreements for strategic alliances and joint ventures.',
    iconName: 'Users2',
    link: '/startup/partnership-agreement',
    category: 'business',
    features: ['Agreement Templates', 'Custom Terms', 'Legal Review', 'E-signature'],
    usageCount: 7800,
    rating: 4.7,
    difficulty: 'advanced',
    estimatedTime: '25 min',
  },
  {
    id: 'nda-generator',
    title: 'NDA Generator',
    description: 'Generate Non-Disclosure Agreements for employees, partners, and investors.',
    iconName: 'Shield',
    link: '/startup/nda-generator',
    category: 'business',
    features: ['Mutual NDAs', 'Unilateral NDAs', 'Custom Terms', 'Legal Compliance'],
    usageCount: 18900,
    rating: 4.8,
    difficulty: 'beginner',
    estimatedTime: '10 min',
  },
  {
    id: 'esop-calculator',
    title: 'ESOP Calculator',
    description: 'Calculate Employee Stock Option Plans and equity compensation strategies.',
    iconName: 'PieChart',
    link: '/startup/esop-calculator',
    category: 'investor',
    features: ['Option Pool Sizing', 'Vesting Schedules', 'Exercise Calculations', 'Tax Implications'],
    usageCount: 12100,
    rating: 4.7,
    difficulty: 'advanced',
    estimatedTime: '20 min',
  },
]

const categoryInfo = {
  business: {
    title: 'Business Operations',
    description: 'Strategic planning and operational management tools',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    gradient: 'from-blue-500 to-indigo-600',
  },
  investor: {
    title: 'Investor Relations',
    description: 'Fundraising, equity management, and investor tools',
    icon: Wallet,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    gradient: 'from-green-500 to-emerald-600',
  },
  financial: {
    title: 'Financial Analytics',
    description: 'Metrics, calculations, and financial planning',
    icon: LineChart,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    gradient: 'from-purple-500 to-pink-600',
  },
}

const featuredBundles = [
  {
    id: 'fundraising',
    title: 'Fundraising Toolkit',
    description: 'Everything you need to raise your next round',
    tools: ['Cap Table Manager', 'Term Sheet Generator', 'SAFE Generator', 'Investor Pitch Tracker'],
    icon: Rocket,
    color: 'from-green-500 to-emerald-600',
    usageCount: 45000,
  },
  {
    id: 'financial',
    title: 'Financial Health Kit',
    description: 'Track and optimize your startup finances',
    tools: ['Burn Rate Calculator', 'Runway Calculator', 'CAC Calculator', 'LTV Calculator'],
    icon: LineChart,
    color: 'from-purple-500 to-pink-600',
    usageCount: 52000,
  },
  {
    id: 'strategy',
    title: 'Strategy Planning Suite',
    description: 'Plan and execute your business strategy',
    tools: ['Business Model Canvas', 'SWOT Analysis', 'Competitive Analysis', 'Board Meeting Planner'],
    icon: Target,
    color: 'from-blue-500 to-indigo-600',
    usageCount: 38000,
  },
]

export default function BusinessInvestorToolsSection() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'business' | 'investor' | 'financial'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)

  const businessTools = tools.filter(t => t.category === 'business')
  const investorTools = tools.filter(t => t.category === 'investor')
  const financialTools = tools.filter(t => t.category === 'financial')

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(t => t.category === activeCategory)

  const searchedTools = searchQuery 
    ? filteredTools.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredTools

  const getIcon = (iconName: string, className?: string) => {
    const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
      PieChart,
      FileText,
      ClipboardCheck,
      Target,
      BarChart,
      TrendingUp,
      Calculator,
      DollarSign,
      Calendar,
      Percent,
      FileCheck,
      Briefcase,
      Users,
      Users2,
      Shield,
    }
    const IconComponent = iconComponents[iconName]
    if (!IconComponent) return null
    return <IconComponent className={className || "h-6 w-6"} />
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'new': return 'new'
      case 'popular': return 'popular'
      case 'essential': return 'featured'
      default: return 'category'
    }
  }

  if (businessTools.length === 0 && investorTools.length === 0 && financialTools.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="business-investor-tools">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-6 w-6 text-primary-500" />
              <Badge variant="category" className="bg-primary-50 text-primary-700">
                Professional Tools
              </Badge>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">Business & Investor Tools</h2>
            <p className="text-gray-600 max-w-2xl">
              Comprehensive suite of 19 professional tools for business operations, investor relations, 
              and financial management. All tools are free and designed for founders.
            </p>
          </div>
          <Link href="/startup/tools" className="mt-4 lg:mt-0">
            <Button variant="outline" className="group">
              <BookOpen className="h-4 w-4 mr-2" />
              View All Tools
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>


        {/* Featured Bundles */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Popular Tool Bundles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBundles.map(bundle => {
              const Icon = bundle.icon
              return (
                <div 
                  key={bundle.id}
                  className={`bg-gradient-to-br ${bundle.color} rounded-2xl p-6 text-white hover:shadow-xl transition-all cursor-pointer group`}
                  onClick={() => showToast(`Opening ${bundle.title}...`, 'info')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {bundle.usageCount.toLocaleString()}+ uses
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-2">{bundle.title}</h4>
                  <p className="text-white/80 text-sm mb-4">{bundle.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {bundle.tools.map((tool, idx) => (
                      <span key={idx} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Open Bundle <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools by name, feature, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="h-4 w-4" />
                All Tools ({tools.length})
              </button>
              {Object.entries(categoryInfo).map(([key, info]) => {
                const Icon = info.icon
                const count = tools.filter(t => t.category === key).length
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === key
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {info.title} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {activeCategory === 'all' ? (
          <div className="space-y-12">
            {Object.entries(categoryInfo).map(([categoryKey, info]) => {
              const Icon = info.icon
              const categoryTools = searchedTools.filter(t => t.category === categoryKey)
              if (categoryTools.length === 0) return null
              
              return (
                <div key={categoryKey}>
                  <div className={`flex items-center gap-3 mb-6 pb-4 border-b ${info.borderColor}`}>
                    <div className={`p-2 rounded-lg ${info.bgColor}`}>
                      <Icon className={`h-6 w-6 ${info.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{info.title}</h3>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {categoryTools.length} tools
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTools.map((tool) => (
                      <ToolCard 
                        key={tool.id} 
                        tool={tool} 
                        getIcon={getIcon}
                        getDifficultyColor={getDifficultyColor}
                        getBadgeVariant={getBadgeVariant}
                        isHovered={hoveredTool === tool.id}
                        onHover={() => setHoveredTool(tool.id)}
                        onLeave={() => setHoveredTool(null)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                getIcon={getIcon}
                getDifficultyColor={getDifficultyColor}
                getBadgeVariant={getBadgeVariant}
                isHovered={hoveredTool === tool.id}
                onHover={() => setHoveredTool(tool.id)}
                onLeave={() => setHoveredTool(null)}
              />
            ))}
          </div>
        )}

        {searchedTools.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-primary-500 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-6 w-6" />
                <span className="text-primary-100 font-medium">Pro Tip</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Need Help Choosing the Right Tools?</h3>
              <p className="text-primary-100 max-w-xl">
                Take our quick assessment to get personalized tool recommendations based on your startup stage and goals.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-colors shadow-lg"
                onClick={() => showToast('Starting tool assessment...', 'info')}
              >
                <Target className="h-5 w-5 mr-2" />
                Take Assessment
              </button>
              <Link href="/startup/guides">
                <button className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Tutorials
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Separate ToolCard component for better organization
interface ToolCardProps {
  tool: Tool
  getIcon: (iconName: string, className?: string) => React.ReactNode
  getDifficultyColor: (difficulty: string) => string
  getBadgeVariant: (badge: string) => 'new' | 'popular' | 'featured' | 'category'
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function ToolCard({ tool, getIcon, getDifficultyColor, getBadgeVariant, isHovered, onHover, onLeave }: ToolCardProps) {
  return (
    <Card 
      className={`flex flex-col transition-all duration-300 ${isHovered ? 'shadow-xl scale-[1.02]' : 'hover:shadow-lg'}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary-50 p-2.5 rounded-xl">
            {getIcon(tool.iconName, 'h-5 w-5 text-primary-600')}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{tool.title}</h4>
            {tool.badge && (
              <Badge variant={getBadgeVariant(tool.badge)} className="text-xs mt-1">
                {tool.badge}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 flex-grow">{tool.description}</p>

      {/* Meta Info */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
        {tool.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span>{tool.rating}</span>
          </div>
        )}
        {tool.usageCount && (
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{(tool.usageCount / 1000).toFixed(1)}K uses</span>
          </div>
        )}
        {tool.estimatedTime && (
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{tool.estimatedTime}</span>
          </div>
        )}
        {tool.difficulty && (
          <span className={`px-2 py-0.5 rounded-full ${getDifficultyColor(tool.difficulty)}`}>
            {tool.difficulty}
          </span>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {tool.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600">
            <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
            <span className="truncate">{feature}</span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <Link href={tool.link}>
        <Button className="w-full group">
          Open Tool
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </Card>
  )
}
