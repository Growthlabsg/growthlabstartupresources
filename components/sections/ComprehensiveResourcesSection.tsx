'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { 
  Lightbulb, Target, Code, Palette, Megaphone, CreditCard, 
  ArrowRight, Sparkles, CheckCircle, BookOpen, Users, BarChart3,
  Rocket, Shield, DollarSign, TrendingUp, FileText, Settings,
  Globe, Zap, Award, Heart, Compass, Calculator, Building2
} from 'lucide-react'

interface Resource {
  name: string
  price: string
  href: string
  new?: boolean
}

interface ComprehensiveResource {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  resources: Resource[]
  mainHref: string
  badge?: string
}

const comprehensiveResources: ComprehensiveResource[] = [
  {
    id: 'validation',
    title: 'Idea Validation & Market Research',
    description: 'Validate your startup idea with comprehensive research tools and frameworks.',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    mainHref: '/startup/validation',
    badge: 'Enhanced',
    resources: [
      { name: 'Validation Hub', price: 'Free', href: '/startup/validation', new: true },
      { name: 'Value Proposition Canvas', price: 'Free', href: '/startup/validation/value-proposition', new: true },
      { name: 'Problem-Solution Fit', price: 'Free', href: '/startup/validation/problem-solution', new: true },
      { name: 'Customer Discovery', price: 'Free', href: '/startup/customer-discovery' },
      { name: 'Market Research', price: 'Free', href: '/startup/market-research' },
      { name: 'Idea Validation Toolkit', price: 'Free', href: '/startup/idea-validation' },
    ],
  },
  {
    id: 'business-model',
    title: 'Business Model & Strategy',
    description: 'Design and refine your business model with interactive tools and templates.',
    icon: <Target className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    mainHref: '/startup/business-model-canvas',
    resources: [
      { name: 'Business Model Canvas', price: 'Free', href: '/startup/business-model-canvas' },
      { name: 'Business Plan Generator', price: 'Free', href: '/startup/business-plan' },
      { name: 'Competitive Analysis', price: 'Free', href: '/startup/competitive-analysis' },
      { name: 'SWOT Analysis', price: 'Free', href: '/startup/swot-analysis' },
      { name: 'Startup Checklist', price: 'Free', href: '/startup/checklist' },
    ],
  },
  {
    id: 'mvp',
    title: 'MVP Development & Tech',
    description: 'Build your minimum viable product with guided development resources.',
    icon: <Code className="h-6 w-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    mainHref: '/startup/technology/tech-stack',
    badge: 'Popular',
    resources: [
      { name: 'Tech Stack Builder', price: 'Free', href: '/startup/technology/tech-stack' },
      { name: 'Cloud Infrastructure', price: 'Free', href: '/startup/technology/cloud' },
      { name: 'DevOps & Deployment', price: 'Free', href: '/startup/technology/devops' },
      { name: 'AI & ML Integration', price: 'Free', href: '/startup/technology/ai-ml' },
    ],
  },
  {
    id: 'funding',
    title: 'Funding & Investment',
    description: 'Navigate funding rounds with pitch tools and investor resources.',
    icon: <DollarSign className="h-6 w-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    mainHref: '/startup/funding-navigator',
    badge: 'Essential',
    resources: [
      { name: 'Funding Readiness', price: 'Free', href: '/startup/funding/readiness' },
      { name: 'Investor Database', price: 'Free', href: '/startup/funding/investors' },
      { name: 'Grant Opportunities', price: 'Free', href: '/startup/funding/grants' },
      { name: 'Pitch Deck Builder', price: 'Free', href: '/startup/pitch-deck-builder' },
      { name: 'Cap Table Manager', price: 'Free', href: '/startup/cap-table' },
      { name: 'Valuation Calculator', price: 'Free', href: '/startup/valuation-calculator' },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing & Sales',
    description: 'Launch effective marketing campaigns and build your sales pipeline.',
    icon: <Megaphone className="h-6 w-6" />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    mainHref: '/startup/marketing/strategy',
    resources: [
      { name: 'Marketing Strategy', price: 'Free', href: '/startup/marketing/strategy' },
      { name: 'Marketing Analytics', price: 'Free', href: '/startup/marketing/analytics' },
      { name: 'Customer Journey', price: 'Free', href: '/startup/marketing/journey', new: true },
      { name: 'Email Marketing Hub', price: 'Free', href: '/startup/marketing/email', new: true },
      { name: 'Social Media Planner', price: 'Free', href: '/startup/marketing/social', new: true },
      { name: 'Sales Process', price: 'Free', href: '/startup/sales/process' },
    ],
  },
  {
    id: 'financial',
    title: 'Financial Tools & Calculators',
    description: 'Manage your startup finances with powerful calculators and projections.',
    icon: <Calculator className="h-6 w-6" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    mainHref: '/startup/financial-projections',
    resources: [
      { name: 'Financial Projections', price: 'Free', href: '/startup/financial-projections' },
      { name: 'Burn Rate Calculator', price: 'Free', href: '/startup/burn-rate-calculator' },
      { name: 'Runway Calculator', price: 'Free', href: '/startup/runway-calculator' },
      { name: 'CAC Calculator', price: 'Free', href: '/startup/cac-calculator' },
      { name: 'LTV Calculator', price: 'Free', href: '/startup/ltv-calculator' },
      { name: 'ROI Calculator', price: 'Free', href: '/startup/roi-calculator' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal & Compliance',
    description: 'Navigate legal requirements with guides, templates, and compliance tools.',
    icon: <Shield className="h-6 w-6" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    mainHref: '/startup/legal-documents',
    resources: [
      { name: 'Legal Structure Guide', price: 'Free', href: '/startup/legal/structure' },
      { name: 'IP Protection', price: 'Free', href: '/startup/legal/ip-protection' },
      { name: 'Employment Law', price: 'Free', href: '/startup/legal/employment', new: true },
      { name: 'Privacy & Compliance', price: 'Free', href: '/startup/legal/privacy', new: true },
      { name: 'Contract Templates', price: 'Free', href: '/startup/legal/contracts', new: true },
      { name: 'Compliance Hub', price: 'Free', href: '/startup/legal/compliance', new: true },
    ],
  },
  {
    id: 'resources',
    title: 'Learning & Resources',
    description: 'Access curated learning materials, books, videos, and expert content.',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    mainHref: '/startup/resources',
    badge: 'New',
    resources: [
      { name: 'Resources Library', price: 'Free', href: '/startup/resources', new: true },
      { name: 'Startup Books', price: 'Free', href: '/startup/resources/books', new: true },
      { name: 'Learning Hub', price: 'Free', href: '/startup/resources/learning', new: true },
      { name: 'Startup Academy', price: 'Free', href: '/startup/academy' },
      { name: 'Startup Guides', price: 'Free', href: '/startup/guides' },
    ],
  },
  {
    id: 'tools',
    title: 'Recommended Tools & Software',
    description: 'Discover the best tools and software to power your startup growth.',
    icon: <Settings className="h-6 w-6" />,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    mainHref: '/startup/tools',
    resources: [
      { name: 'Tools Hub', price: 'Free', href: '/startup/tools' },
      { name: 'Financial Tools', price: 'Free', href: '/startup/tools/financial' },
      { name: 'Marketing Tools', price: 'Free', href: '/startup/tools/marketing' },
      { name: 'Productivity Tools', price: 'Free', href: '/startup/tools/productivity' },
      { name: 'Analytics Tools', price: 'Free', href: '/startup/tools/analytics' },
    ],
  },
]

const quickStats = [
  { label: 'Tools & Calculators', value: '50+', icon: Calculator },
  { label: 'Templates', value: '100+', icon: FileText },
  { label: 'Guides', value: '35+', icon: BookOpen },
  { label: 'AI Features', value: '15+', icon: Sparkles },
]

export default function ComprehensiveResourcesSection() {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-primary-500" />
          <h2 className="text-3xl font-bold">Comprehensive Startup Resources</h2>
          <Sparkles className="h-6 w-6 text-primary-500" />
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Everything you need to build, launch, and scale your startup successfully. 
          From idea validation to growth - all tools are free to use.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-gradient-to-br from-primary-50 to-white p-4 rounded-xl border border-primary-100 text-center">
              <Icon className="h-6 w-6 text-primary-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comprehensiveResources.map((resource) => (
          <Card key={resource.id} className="border-2 border-gray-100 hover:border-primary-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className={`h-1 ${resource.bgColor.replace('bg-', 'bg-').replace('-50', '-500')}`} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`${resource.bgColor} ${resource.color} p-2.5 rounded-lg`}>
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-tight">{resource.title}</h3>
                    {resource.badge && (
                      <Badge variant={resource.badge === 'New' ? 'new' : resource.badge === 'Enhanced' ? 'featured' : 'popular'} className="mt-1">
                        {resource.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
              
              <div className="space-y-2 mb-4">
                {resource.resources.slice(0, 4).map((item, idx) => (
                  <Link key={idx} href={item.href} className="group">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium group-hover:text-primary-600 transition-colors">
                          {item.name}
                        </span>
                        {item.new && (
                          <Badge variant="new" className="text-xs py-0 px-1.5">New</Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">{item.price}</Badge>
                    </div>
                  </Link>
                ))}
                {resource.resources.length > 4 && (
                  <div className="text-xs text-gray-500 pl-8">
                    +{resource.resources.length - 4} more resources
                  </div>
                )}
              </div>
              
              <Link href={resource.mainHref}>
                <Button className="w-full group" size="sm">
                  Explore {resource.title.split(' ')[0]}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Enhanced CTA Banner */}
      <div className="mt-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-600 rounded-3xl" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white rounded-full translate-y-1/2" />
        </div>
        
        <div className="relative p-8 md:p-12 text-white">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Rocket className="h-5 w-5 text-yellow-300 animate-bounce" />
              <span className="text-sm font-medium">Start Your Journey Today</span>
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Your Startup?
            </h3>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              Join thousands of founders who have used our free tools to validate ideas, 
              secure funding, and scale their businesses.
            </p>
          </div>

          {/* Journey Path */}
          <div className="hidden md:flex items-center justify-center gap-2 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Lightbulb className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">Idea</span>
            </div>
            <ArrowRight className="h-5 w-5 text-primary-200" />
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Target className="h-5 w-5 text-green-300" />
              <span className="text-sm font-medium">Validate</span>
            </div>
            <ArrowRight className="h-5 w-5 text-primary-200" />
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Code className="h-5 w-5 text-blue-300" />
              <span className="text-sm font-medium">Build MVP</span>
            </div>
            <ArrowRight className="h-5 w-5 text-primary-200" />
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-300" />
              <span className="text-sm font-medium">Raise Funding</span>
            </div>
            <ArrowRight className="h-5 w-5 text-primary-200" />
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-pink-300" />
              <span className="text-sm font-medium">Scale</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/startup/validation">
              <button className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold bg-white text-primary-600 hover:bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-all group">
                <Rocket className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/startup/guides">
              <button className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold border-2 border-white text-white hover:bg-white/10 rounded-lg transition-all">
                <BookOpen className="h-5 w-5 mr-2" />
                Browse All Guides
              </button>
            </Link>
            <Link href="/startup/academy">
              <button className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold border-2 border-white text-white hover:bg-white/10 rounded-lg transition-all">
                <Award className="h-5 w-5 mr-2" />
                Learn at Academy
              </button>
            </Link>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <Link href="/startup/pitch-deck-builder" className="group">
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-3 transition-all flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary-200 group-hover:text-white" />
                <span className="text-sm text-primary-100 group-hover:text-white">Pitch Deck Builder</span>
              </div>
            </Link>
            <Link href="/startup/financial-projections" className="group">
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-3 transition-all flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary-200 group-hover:text-white" />
                <span className="text-sm text-primary-100 group-hover:text-white">Financial Models</span>
              </div>
            </Link>
            <Link href="/startup/funding/investors" className="group">
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-3 transition-all flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-200 group-hover:text-white" />
                <span className="text-sm text-primary-100 group-hover:text-white">Find Investors</span>
              </div>
            </Link>
            <Link href="/startup/legal-documents" className="group">
              <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-3 transition-all flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary-200 group-hover:text-white" />
                <span className="text-sm text-primary-100 group-hover:text-white">Legal Documents</span>
              </div>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-white/20">
            <div className="flex items-center gap-2 text-primary-200">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span className="text-sm">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2 text-primary-200">
              <Shield className="h-5 w-5 text-blue-300" />
              <span className="text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 text-primary-200">
              <Zap className="h-5 w-5 text-yellow-300" />
              <span className="text-sm">AI-Powered Tools</span>
            </div>
            <div className="flex items-center gap-2 text-primary-200">
              <Heart className="h-5 w-5 text-pink-300" />
              <span className="text-sm">Built for Founders</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
