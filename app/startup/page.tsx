'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import {
  BookOpen,
  Calculator,
  FileText,
  Target,
  DollarSign,
  Users,
  Rocket,
  Lightbulb,
  BarChart3,
  TrendingUp,
  Shield,
  Code,
  Globe,
  Zap,
  Settings,
  Award,
  Briefcase,
  Heart,
  Building2,
  ShoppingCart,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

const categories = [
  {
    id: 'guides',
    title: 'Startup Guides Hub',
    description: 'Comprehensive guides for every stage of your startup journey',
    icon: BookOpen,
    href: '/startup/guides',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    count: '35+ Guides',
  },
  {
    id: 'financial',
    title: 'Financial Tools',
    description: 'Calculators and projections for financial planning',
    icon: DollarSign,
    href: '/startup/financial-projections',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    count: '10+ Tools',
    tools: [
      { name: 'Financial Projections', href: '/startup/financial-projections' },
      { name: 'Burn Rate Calculator', href: '/startup/burn-rate-calculator' },
      { name: 'Runway Calculator', href: '/startup/runway-calculator' },
      { name: 'CAC Calculator', href: '/startup/cac-calculator' },
      { name: 'LTV Calculator', href: '/startup/ltv-calculator' },
      { name: 'Break-Even Calculator', href: '/startup/break-even-calculator' },
      { name: 'ROI Calculator', href: '/startup/roi-calculator' },
      { name: 'Pricing Calculator', href: '/startup/pricing-calculator' },
      { name: 'Growth Rate Calculator', href: '/startup/growth-rate-calculator' },
      { name: 'Valuation Calculator', href: '/startup/valuation-calculator' },
    ],
  },
  {
    id: 'validation',
    title: 'Idea & Validation',
    description: 'Validate your startup ideas and conduct market research',
    icon: Lightbulb,
    href: '/startup/idea-validation',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    tools: [
      { name: 'Idea Validation', href: '/startup/idea-validation' },
      { name: 'Customer Discovery', href: '/startup/customer-discovery' },
      { name: 'Market Research', href: '/startup/market-research' },
      { name: 'Competitive Analysis', href: '/startup/competitive-analysis' },
      { name: 'SWOT Analysis', href: '/startup/swot-analysis' },
    ],
  },
  {
    id: 'funding',
    title: 'Funding & Investment',
    description: 'Navigate funding rounds and investor relations',
    icon: TrendingUp,
    href: '/startup/funding-navigator',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    tools: [
      { name: 'Funding Navigator', href: '/startup/funding-navigator' },
      { name: 'Pitch Deck Builder', href: '/startup/pitch-deck-builder' },
      { name: 'Cap Table', href: '/startup/cap-table' },
      { name: 'Term Sheet', href: '/startup/term-sheet' },
      { name: 'SAFE Generator', href: '/startup/safe-generator' },
      { name: 'Convertible Note Calculator', href: '/startup/convertible-note-calculator' },
      { name: 'ESOP Calculator', href: '/startup/esop-calculator' },
      { name: 'Equity Calculator', href: '/startup/equity-calculator' },
    ],
  },
  {
    id: 'business',
    title: 'Business Planning',
    description: 'Build your business model and plan',
    icon: Briefcase,
    href: '/startup/business-plan',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    tools: [
      { name: 'Business Plan', href: '/startup/business-plan' },
      { name: 'Business Model Canvas', href: '/startup/business-model-canvas' },
      { name: 'Checklist', href: '/startup/checklist' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal & Compliance',
    description: 'Legal documents and compliance resources',
    icon: Shield,
    href: '/startup/legal-documents',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    tools: [
      { name: 'Legal Documents', href: '/startup/legal-documents' },
      { name: 'NDA Generator', href: '/startup/nda-generator' },
      { name: 'Partnership Agreement', href: '/startup/partnership-agreement' },
      { name: 'Legal Structure', href: '/startup/legal/structure' },
      { name: 'IP Protection', href: '/startup/legal/ip-protection' },
      { name: 'Privacy & Compliance', href: '/startup/legal/privacy' },
      { name: 'Employment Law', href: '/startup/legal/employment' },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing & Sales',
    description: 'Grow your customer base and revenue',
    icon: ShoppingCart,
    href: '/startup/marketing/strategy',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    tools: [
      { name: 'Marketing Strategy', href: '/startup/marketing/strategy' },
      { name: 'Marketing Analytics', href: '/startup/marketing/analytics' },
      { name: 'Sales Process', href: '/startup/sales/process' },
      { name: 'Conversion Rate Calculator', href: '/startup/conversion-rate-calculator' },
      { name: 'A/B Test Calculator', href: '/startup/ab-test-calculator' },
    ],
  },
  {
    id: 'productivity',
    title: 'Productivity Tools',
    description: 'Tools to help you stay organized and productive',
    icon: Zap,
    href: '/startup/goal-tracker',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    tools: [
      { name: 'Goal Tracker', href: '/startup/goal-tracker' },
      { name: 'Operations Dashboard', href: '/startup/operations-dashboard' },
      { name: 'Team Management', href: '/startup/team-management' },
    ],
  },
  {
    id: 'stages',
    title: 'Startup Stages',
    description: 'Resources organized by your startup stage',
    icon: Rocket,
    href: '/startup/stage/idea',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    tools: [
      { name: 'Idea Stage', href: '/startup/stage/idea' },
      { name: 'Launch Stage', href: '/startup/stage/launch' },
      { name: 'Growth Stage', href: '/startup/stage/growth' },
      { name: 'Scale Stage', href: '/startup/stage/scale' },
    ],
  },
]

export default function StartupHubPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Startup Resources Hub
              </span>
            </h1>
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
          </div>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Everything you need to build, launch, and grow your startup globally. 
            Access comprehensive guides, powerful tools, and expert resources for founders worldwide.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          <Card className="text-center p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">35+</div>
            <div className="text-xs sm:text-sm text-gray-600">Guides</div>
          </Card>
          <Card className="text-center p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">50+</div>
            <div className="text-xs sm:text-sm text-gray-600">Tools</div>
          </Card>
          <Card className="text-center p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">100+</div>
            <div className="text-xs sm:text-sm text-gray-600">Resources</div>
          </Card>
          <Card className="text-center p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2">24/7</div>
            <div className="text-xs sm:text-sm text-gray-600">Access</div>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Link href={category.href}>
                  <div className="p-6">
                    <div className={`${category.bgColor} ${category.color} p-4 rounded-lg w-fit mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                    {category.count && (
                      <Badge variant="new" className="mb-4">
                        {category.count}
                      </Badge>
                    )}
                    {category.tools && category.tools.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-medium text-gray-500 mb-2">Popular Tools:</p>
                        {category.tools.slice(0, 3).map((tool, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            {tool.name}
                          </div>
                        ))}
                        {category.tools.length > 3 && (
                          <div className="text-xs text-primary-600 font-medium">
                            +{category.tools.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      Explore
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Link>
              </Card>
            )
          })}
        </div>

        {/* Featured Resources */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
            Featured Resources
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link href="/startup/guides">
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer">
                <BookOpen className="h-5 w-5 text-primary-500 mb-2" />
                <h4 className="font-semibold text-sm mb-1">Startup Guides</h4>
                <p className="text-xs text-gray-600">35+ comprehensive guides</p>
              </Card>
            </Link>
            <Link href="/startup/financial-projections">
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer">
                <BarChart3 className="h-5 w-5 text-green-500 mb-2" />
                <h4 className="font-semibold text-sm mb-1">Financial Projections</h4>
                <p className="text-xs text-gray-600">Plan your finances</p>
              </Card>
            </Link>
            <Link href="/startup/pitch-deck-builder">
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer">
                <FileText className="h-5 w-5 text-purple-500 mb-2" />
                <h4 className="font-semibold text-sm mb-1">Pitch Deck Builder</h4>
                <p className="text-xs text-gray-600">Create winning pitches</p>
              </Card>
            </Link>
            <Link href="/startup/business-plan">
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer">
                <Briefcase className="h-5 w-5 text-indigo-500 mb-2" />
                <h4 className="font-semibold text-sm mb-1">Business Plan</h4>
                <p className="text-xs text-gray-600">Build your strategy</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-5 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to Build Your Startup?</h2>
          <p className="text-primary-100 text-sm sm:text-base mb-4 sm:mb-6 max-w-2xl mx-auto">
            Access all the tools, guides, and resources you need to turn your idea into a successful business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/startup/guides">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Browse Guides
              </Button>
            </Link>
            <Link href="/startup/financial-projections">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Start Planning
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}

