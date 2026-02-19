'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { BookOpen, FileText, Wrench, Calculator, Video, CheckSquare, Share2, ExternalLink, TrendingUp, DollarSign, Lightbulb, Users, BarChart3, Shield } from 'lucide-react'
import { handleShare } from '@/lib/utils/actions'
import { showToast } from '@/components/ui/ToastContainer'

const popularResources = [
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
    views: 1250,
    href: '/startup/funding-navigator',
    icon: DollarSign,
  },
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
    views: 980,
    href: '/startup/idea-validation',
    icon: Lightbulb,
  },
  {
    id: 'valuation-calculator',
    title: 'Valuation Calculator',
    description: 'Calculate your startup valuation using multiple methodologies: Revenue Multiple, DCF, Scorecard, and more.',
    type: 'calculator',
    category: 'Finance & Accounting',
    difficulty: 'advanced',
    author: 'GrowthLab Team',
    readTime: '20 min',
    tags: ['valuation', 'finance', 'calculations'],
    views: 750,
    href: '/startup/valuation-calculator',
    icon: Calculator,
  },
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
    views: 680,
    href: '/startup/checklist',
    icon: CheckSquare,
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
    views: 620,
    href: '/startup/customer-discovery',
    icon: Users,
  },
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
    views: 580,
    href: '/startup/legal-documents',
    icon: Shield,
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
    views: 540,
    href: '/startup/business-plan',
    icon: FileText,
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
    views: 520,
    href: '/startup/pitch-deck-builder',
    icon: FileText,
  },
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
    views: 480,
    href: '/startup/financial-projections',
    icon: BarChart3,
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

export default function PopularResources() {
  const handleOpenResource = (href: string, title: string) => {
    showToast(`Opening ${title}...`, 'info')
    window.location.href = href
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {popularResources.map((resource) => {
        const IconComponent = resource.icon || typeIcons[resource.type as keyof typeof typeIcons]
        return (
          <Card key={resource.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="bg-primary-500/10 p-2 rounded-lg text-primary-500 shrink-0">
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <Badge variant="outline" className="text-xs shrink-0">Popular</Badge>
                <Badge variant={resource.difficulty as 'beginner' | 'intermediate' | 'advanced'} className="text-xs shrink-0">
                  {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                </Badge>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{resource.description}</p>
            <div className="text-xs text-gray-500 mb-4">
              By {resource.author} • {resource.readTime} read • {resource.views} views
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {resource.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{resource.tags.length - 2} more</span>
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
            </div>
          </Card>
        )
      })}
    </div>
  )
}
