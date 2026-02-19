'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import {
  FileText,
  BarChart,
  BookOpen,
  Users,
  Target,
  Scale,
  DollarSign,
  Users2,
  Lightbulb,
  FileSearch,
  Sparkles,
  Check,
} from 'lucide-react'

interface Tool {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  link: string
  badge?: 'new'
  features: string[]
  hasEnhanced?: boolean
  enhancedLink?: string
}

const tools: Tool[] = [
  {
    id: 'pitch-deck',
    title: 'Pitch Deck Builder',
    description: 'Create professional pitch decks that impress investors and communicate your vision effectively.',
    icon: <FileText className="h-6 w-6" />,
    link: '/startup/pitch-deck-builder',
    features: ['10+ Templates', 'AI Assistance', 'Multiple Export Formats', 'Easy Sharing'],
    hasEnhanced: true,
    enhancedLink: '/startup/pitch-deck-builder/enhanced-page',
  },
  {
    id: 'business-plan',
    title: 'Business Plan Generator',
    description: 'Create comprehensive business plans to guide your startup\'s strategy and secure funding.',
    icon: <FileText className="h-6 w-6" />,
    link: '/startup/business-plan',
    features: ['Step-by-step Guide', 'Industry Templates', 'Financial Projections', 'Expert Tips'],
  },
  {
    id: 'financial-projections',
    title: 'Financial Projections',
    description: 'Build realistic financial models with AI-driven insights, scenario analysis, and market intelligence.',
    icon: <BarChart className="h-6 w-6" />,
    link: '/startup/financial-projections',
    features: ['Revenue Forecasting', 'Expense Planning', 'Cash Flow Analysis', 'Break-even Calculator'],
    hasEnhanced: true,
    enhancedLink: '/startup/financial-projections/enhanced',
  },
  {
    id: 'guides',
    title: 'Startup Guides Hub',
    description: 'Comprehensive guides covering all aspects of launching and managing a startup with real-world examples.',
    icon: <BookOpen className="h-6 w-6" />,
    link: '/startup/guides',
    badge: 'new',
    features: ['Market Research', 'Business Planning', 'Funding Strategies', 'Marketing & Scaling'],
  },
  {
    id: 'mentor',
    title: 'Mentor Connect',
    description: 'Connect with experienced mentors and advisors who can guide your startup journey.',
    icon: <Users className="h-6 w-6" />,
    link: '/mentorship',
    features: ['1-on-1 Sessions', 'Industry Experts', 'Feedback Sessions', 'Networking Events'],
  },
  {
    id: 'market-research',
    title: 'Market Research Tools',
    description: 'Research your market with AI-powered competitive intelligence, market sizing, and strategic insights.',
    icon: <Target className="h-6 w-6" />,
    link: '/startup/market-research',
    features: ['Competitor Analysis', 'Market Sizing', 'Customer Surveys', 'Trend Analysis'],
    hasEnhanced: true,
    enhancedLink: '/startup/market-research/enhanced',
  },
  {
    id: 'legal',
    title: 'Legal Document Generator',
    description: 'Create essential legal documents for your startup with customizable templates.',
    icon: <Scale className="h-6 w-6" />,
    link: '/startup/legal-documents',
    badge: 'new',
    features: ['Founder Agreements', 'Employment Contracts', 'Privacy Policies', 'Terms of Service'],
  },
  {
    id: 'funding',
    title: 'Funding Navigator',
    description: 'Explore funding options and connect with investors that match your startup\'s needs.',
    icon: <DollarSign className="h-6 w-6" />,
    link: '/startup/funding-navigator',
    badge: 'new',
    features: ['Funding Readiness', 'Investor Matching', 'Grant Opportunities', 'Pitch Preparation'],
  },
  {
    id: 'customer-discovery',
    title: 'Customer Discovery Tool',
    description: 'Conduct user research, collect feedback, and validate your product with real users.',
    icon: <Users2 className="h-6 w-6" />,
    link: '/startup/customer-discovery',
    badge: 'new',
    features: ['Survey Builder', 'User Interviews', 'Feedback Analysis', 'Persona Creation'],
  },
  {
    id: 'valuation',
    title: 'Valuation Calculator',
    description: 'Estimate your startup\'s valuation using multiple methodologies and industry benchmarks.',
    icon: <BarChart className="h-6 w-6" />,
    link: '/startup/valuation-calculator',
    badge: 'new',
    features: ['Multiple Methods', 'Industry Benchmarks', 'Investor Perspective', 'Scenario Analysis'],
  },
  {
    id: 'idea-validation',
    title: 'Idea Validation Toolkit',
    description: 'Test and validate your startup idea before investing significant time and resources.',
    icon: <Lightbulb className="h-6 w-6" />,
    link: '/startup/idea-validation',
    badge: 'new',
    features: ['Problem Validation', 'Solution Testing', 'Landing Page Builder', 'MVP Planning'],
  },
  {
    id: 'checklist',
    title: 'Startup Checklist',
    description: 'Track your progress with comprehensive checklists for each stage of your startup journey.',
    icon: <FileSearch className="h-6 w-6" />,
    link: '/startup/checklist',
    badge: 'new',
    features: ['Idea Stage', 'Launch Preparation', 'Growth Milestones', 'Funding Readiness'],
  },
]

export default function EssentialTools() {
  return (
    <section className="section-spacing bg-white">
      <div className="section-container">
        <div className="mb-12 lg:mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Essential Startup Tools</h2>
            <div className="hidden lg:flex items-center space-x-2">
              <Badge variant="outline" className="bg-primary-500/10 text-primary-500 border-primary-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <Check className="w-3 h-3 mr-1" />
                Free to Use
              </Badge>
            </div>
          </div>
          <p className="section-subtitle">
            Core tools every startup needs to build, launch, and grow
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {tools.map((tool) => (
          <Card key={tool.id} className="border-2 border-primary-500/20 hover:border-primary-500 transition-all flex flex-col">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-primary-500/10 p-2 rounded-md">
                {tool.icon}
              </div>
              <div className="flex items-center flex-1">
                <h3 className="text-lg font-semibold">{tool.title}</h3>
                {tool.badge && <Badge className="ml-2 bg-green-500">New</Badge>}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 flex-grow">{tool.description}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {tool.features.map((feature, idx) => (
                <div key={idx} className="bg-gray-100 rounded-md p-2 text-center text-sm">
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-auto">
              <Link href={tool.link} className="flex-1">
                <Button className="w-full bg-primary-500 hover:bg-primary-500/90 text-white font-semibold shadow-lg" size="sm">
                  {tool.hasEnhanced ? 'Standard Builder' : 'Open Tool'}
                </Button>
              </Link>
              {tool.hasEnhanced && tool.enhancedLink && (
                <Link href={tool.enhancedLink} className="flex-1">
                  <Button variant="outline" className="w-full border-primary-500 text-primary-500 hover:bg-primary-500/10 font-semibold" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Enhanced
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
        </div>
      </div>
    </section>
  )
}

