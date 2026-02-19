'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { 
  FileCheck, BarChart, Users, Award, Check, Download, 
  FileText, Sparkles, ArrowRight, Star, Eye, Clock,
  Shield, DollarSign, Briefcase, PenTool, Copy,
  CheckCircle, TrendingUp, Building2, Scale, Zap,
  BookOpen, Rocket, Target, Search
} from 'lucide-react'
import { handleDownload } from '@/lib/utils/actions'
import { showToast } from '@/components/ui/ToastContainer'

interface Template {
  name: string
  description: string
  downloads: number
  rating: number
  new?: boolean
  popular?: boolean
  href?: string
}

interface TemplateCategory {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  templates: Template[]
  totalTemplates: number
  href: string
}

const templateCategories: TemplateCategory[] = [
  {
    id: 'legal',
    title: 'Legal Documents',
    description: 'Essential legal templates for your startup including NDAs, contracts, and agreements.',
    icon: <Shield className="h-6 w-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    href: '/startup/legal-documents',
    totalTemplates: 54,
    templates: [
      { name: 'Founder Agreement', description: 'Define roles and equity splits', downloads: 12500, rating: 4.9, popular: true },
      { name: 'NDA Template', description: 'Protect confidential information', downloads: 18200, rating: 4.8, popular: true },
      { name: 'Employment Contract', description: 'Standard employment terms', downloads: 9800, rating: 4.7 },
      { name: 'Privacy Policy', description: 'GDPR & CCPA compliant', downloads: 15600, rating: 4.8, new: true },
      { name: 'Terms of Service', description: 'Website & app terms', downloads: 14200, rating: 4.7 },
      { name: 'SAFE Agreement', description: 'Simple Agreement for Future Equity', downloads: 8900, rating: 4.9, popular: true },
    ],
  },
  {
    id: 'financial',
    title: 'Financial Templates',
    description: 'Professional financial models, projections, and reporting templates.',
    icon: <DollarSign className="h-6 w-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    href: '/startup/financial-projections',
    totalTemplates: 28,
    templates: [
      { name: 'Financial Projections', description: '5-year forecast model', downloads: 22100, rating: 4.9, popular: true },
      { name: 'P&L Statement', description: 'Profit & loss tracking', downloads: 16800, rating: 4.8 },
      { name: 'Cash Flow Model', description: 'Monthly cash flow analysis', downloads: 14500, rating: 4.8, popular: true },
      { name: 'Valuation Model', description: 'Multiple valuation methods', downloads: 11200, rating: 4.9, new: true },
      { name: 'Cap Table Template', description: 'Equity ownership tracker', downloads: 9800, rating: 4.7 },
      { name: 'Budget Template', description: 'Annual budget planning', downloads: 13400, rating: 4.6 },
    ],
  },
  {
    id: 'hr',
    title: 'HR & Team Templates',
    description: 'Human resources documents for hiring, onboarding, and team management.',
    icon: <Users className="h-6 w-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    href: '/startup/team-management',
    totalTemplates: 32,
    templates: [
      { name: 'Job Description', description: 'Role-specific templates', downloads: 19500, rating: 4.8, popular: true },
      { name: 'Employee Handbook', description: 'Company policies & culture', downloads: 8700, rating: 4.7 },
      { name: 'Performance Review', description: 'Quarterly review forms', downloads: 12300, rating: 4.6 },
      { name: 'Equity Agreement', description: 'Stock option grants', downloads: 7800, rating: 4.8, new: true },
      { name: 'Onboarding Checklist', description: 'New hire setup guide', downloads: 15200, rating: 4.9, popular: true },
      { name: 'Offer Letter', description: 'Professional offer templates', downloads: 11400, rating: 4.7 },
    ],
  },
  {
    id: 'pitch',
    title: 'Pitch & Presentation',
    description: 'Professional pitch decks and presentation templates for investors.',
    icon: <Award className="h-6 w-6" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    href: '/startup/pitch-deck-builder',
    totalTemplates: 18,
    templates: [
      { name: 'Investor Pitch Deck', description: '12-slide standard format', downloads: 28500, rating: 4.9, popular: true },
      { name: 'Demo Day Deck', description: '5-minute pitch format', downloads: 16200, rating: 4.8, popular: true },
      { name: 'Sales Presentation', description: 'B2B sales deck', downloads: 12800, rating: 4.7 },
      { name: 'Product Demo', description: 'Feature showcase template', downloads: 9400, rating: 4.6 },
      { name: 'Board Meeting Deck', description: 'Quarterly updates format', downloads: 7600, rating: 4.8, new: true },
      { name: 'Conference Talk', description: 'Speaker presentation', downloads: 5200, rating: 4.5 },
    ],
  },
  {
    id: 'operations',
    title: 'Operations & Strategy',
    description: 'Business planning, strategy, and operational excellence templates.',
    icon: <Target className="h-6 w-6" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    href: '/startup/business-plan',
    totalTemplates: 24,
    templates: [
      { name: 'Business Plan', description: 'Comprehensive planning', downloads: 21300, rating: 4.9, popular: true },
      { name: 'OKR Template', description: 'Objectives & key results', downloads: 14700, rating: 4.8, popular: true },
      { name: 'SWOT Analysis', description: 'Strategic analysis tool', downloads: 11200, rating: 4.7 },
      { name: 'Competitive Analysis', description: 'Market positioning', downloads: 9800, rating: 4.6 },
      { name: 'Go-to-Market Plan', description: 'Launch strategy template', downloads: 13500, rating: 4.8, new: true },
      { name: 'KPI Dashboard', description: 'Metrics tracking sheet', downloads: 10200, rating: 4.7 },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing & Sales',
    description: 'Marketing plans, content calendars, and sales enablement materials.',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    href: '/startup/marketing/strategy',
    totalTemplates: 36,
    templates: [
      { name: 'Marketing Plan', description: 'Annual marketing strategy', downloads: 17800, rating: 4.8, popular: true },
      { name: 'Content Calendar', description: 'Social media planning', downloads: 22400, rating: 4.9, popular: true },
      { name: 'Email Sequences', description: 'Drip campaign templates', downloads: 15600, rating: 4.7 },
      { name: 'Sales Playbook', description: 'Sales process guide', downloads: 11200, rating: 4.8, new: true },
      { name: 'Buyer Personas', description: 'Customer profile templates', downloads: 13800, rating: 4.6 },
      { name: 'Case Study Template', description: 'Customer success stories', downloads: 8900, rating: 4.7 },
    ],
  },
]

const featuredTemplates = [
  {
    title: 'Complete Startup Kit',
    description: 'Everything you need to launch: legal docs, financials, pitch deck, and more.',
    templates: 25,
    downloads: 45000,
    rating: 4.9,
    badge: 'Most Popular',
    color: 'from-primary-500 to-indigo-500',
  },
  {
    title: 'Fundraising Bundle',
    description: 'Pitch deck, financial model, cap table, and investor updates.',
    templates: 12,
    downloads: 32000,
    rating: 4.8,
    badge: 'Best for Funding',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Legal Essentials Pack',
    description: 'All essential legal documents: NDAs, contracts, policies.',
    templates: 18,
    downloads: 28000,
    rating: 4.9,
    badge: 'Legal Ready',
    color: 'from-blue-500 to-cyan-500',
  },
]

export default function TemplatesDocumentsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const filteredCategories = selectedCategory 
    ? templateCategories.filter(c => c.id === selectedCategory)
    : templateCategories

  const handleCopyTemplate = (templateName: string) => {
    showToast(`${templateName} copied to clipboard!`, 'success')
  }

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full mb-4">
          <FileText className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-medium text-primary-600">Professional Templates</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Startup Templates & Documents</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          192+ professionally designed templates to accelerate your startup journey. 
          From legal documents to pitch decks - all free to download and customize.
        </p>
      </div>

      {/* Featured Bundles */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Featured Template Bundles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredTemplates.map((bundle, i) => (
            <div 
              key={i}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${bundle.color} p-6 text-white hover:shadow-xl transition-all cursor-pointer group`}
              onClick={() => handleDownload(`${bundle.title}.zip`)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <Badge variant="new" className="mb-3 bg-white/20 text-white border-0">
                {bundle.badge}
              </Badge>
              <h4 className="text-xl font-bold mb-2">{bundle.title}</h4>
              <p className="text-white/80 text-sm mb-4">{bundle.description}</p>
              <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {bundle.templates} templates
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {(bundle.downloads / 1000).toFixed(0)}K
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  {bundle.rating}
                </span>
              </div>
              <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all group-hover:bg-white/30">
                <Download className="h-4 w-4" />
                Download Bundle
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        {templateCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.id 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.title}
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              {cat.totalTemplates}
            </span>
          </button>
        ))}
      </div>

      {/* Template Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card 
            key={category.id} 
            className="border-2 border-gray-100 hover:border-primary-300 hover:shadow-lg transition-all overflow-hidden"
          >
            <div className={`h-1.5 ${category.bgColor.replace('bg-', 'bg-').replace('-50', '-500')}`} />
            <div className="p-5">
              {/* Category Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${category.bgColor} ${category.color} p-3 rounded-xl`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{category.title}</h3>
                    <span className="text-sm text-gray-500">{category.totalTemplates} templates</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              
              {/* Template List */}
              <div className="space-y-2 mb-4">
                {category.templates.slice(0, expandedCategory === category.id ? 6 : 4).map((template, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{template.name}</span>
                          {template.new && <Badge variant="new" className="text-xs py-0 px-1.5">New</Badge>}
                          {template.popular && <Badge variant="popular" className="text-xs py-0 px-1.5">Popular</Badge>}
                        </div>
                        <span className="text-xs text-gray-500 hidden group-hover:block">{template.description}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyTemplate(template.name)
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Copy className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(`${template.name}.docx`)
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Download className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {category.templates.length > 4 && (
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-4"
                >
                  {expandedCategory === category.id ? 'Show less' : `+${category.templates.length - 4} more templates`}
                </button>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  size="sm"
                  onClick={() => handleDownload(`${category.title} Templates.zip`)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
                <Link href={category.href}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Premium Templates</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Need Custom Templates?</h3>
            <p className="text-gray-400 max-w-lg">
              Get professionally designed, customized templates tailored to your specific industry and business needs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/startup/legal-documents">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all">
                <FileText className="h-5 w-5 mr-2" />
                Browse All Templates
              </button>
            </Link>
            <Link href="/startup/guides">
              <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
                <BookOpen className="h-5 w-5 mr-2" />
                View Guides
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
