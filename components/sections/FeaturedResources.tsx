'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Calendar, MapPin, ArrowRight, Download, BookOpen, FileText, Wrench, Calculator, CheckSquare, TrendingUp, DollarSign, Lightbulb } from 'lucide-react'
import { handleDownload, handleRegister } from '@/lib/utils/actions'
import { showToast } from '@/components/ui/ToastContainer'

export default function FeaturedResources() {
  const [activeTab, setActiveTab] = useState<'guides' | 'templates' | 'tools'>('tools')

  const featuredTools = [
    {
      id: 'funding-navigator',
      title: 'Funding Navigator',
      description: 'Complete funding toolkit with readiness assessment, investor matching, grant finder, and more.',
      href: '/startup/funding-navigator',
      icon: DollarSign,
      category: 'Funding',
    },
    {
      id: 'idea-validation',
      title: 'Idea Validation Toolkit',
      description: 'Validate your startup idea with problem validation, solution testing, and MVP planning.',
      href: '/startup/idea-validation',
      icon: Lightbulb,
      category: 'Validation',
    },
    {
      id: 'customer-discovery',
      title: 'Customer Discovery Tool',
      description: 'Build surveys, schedule interviews, analyze feedback, and create customer personas.',
      href: '/startup/customer-discovery',
      icon: TrendingUp,
      category: 'Discovery',
    },
    {
      id: 'valuation-calculator',
      title: 'Valuation Calculator',
      description: 'Calculate your startup valuation using multiple methodologies.',
      href: '/startup/valuation-calculator',
      icon: Calculator,
      category: 'Finance',
    },
    {
      id: 'startup-checklist',
      title: 'Startup Checklist',
      description: 'Comprehensive checklist covering all stages from idea validation to scaling.',
      href: '/startup/checklist',
      icon: CheckSquare,
      category: 'Planning',
    },
    {
      id: 'legal-documents',
      title: 'Legal Document Generator',
      description: 'Generate 54+ legal documents including NDAs, contracts, and agreements.',
      href: '/startup/legal-documents',
      icon: FileText,
      category: 'Legal',
    },
  ]

  const guides = [
    {
      id: 'startup-guides',
      title: 'Startup Guides Hub',
      description: 'Access 35+ comprehensive guides covering every aspect of your startup journey.',
      date: 'Updated Weekly',
      href: '/startup/guides',
      icon: BookOpen,
    },
    {
      id: 'funding-guide',
      title: 'Complete Fundraising Guide',
      description: 'Learn how to raise capital from investors and secure funding for your startup.',
      date: 'Jan 15, 2024',
      href: '/startup/funding-navigator',
      icon: DollarSign,
    },
    {
      id: 'validation-guide',
      title: 'Idea Validation Guide',
      description: 'Step-by-step guide to validating your startup idea before building.',
      date: 'Feb 1, 2024',
      href: '/startup/idea-validation',
      icon: Lightbulb,
    },
  ]

  const templates = [
    {
      id: 'business-plan',
      title: 'Business Plan Template',
      description: 'Create a comprehensive business plan with interactive sections.',
      type: 'Interactive Tool',
      free: true,
      href: '/startup/business-plan',
      icon: FileText,
    },
    {
      id: 'pitch-deck',
      title: 'Pitch Deck Builder',
      description: 'Create professional pitch decks with templates and slide management.',
      type: 'Interactive Tool',
      free: true,
      href: '/startup/pitch-deck-builder',
      icon: FileText,
    },
    {
      id: 'legal-docs',
      title: 'Legal Document Templates',
      description: '54+ legal document templates ready to customize.',
      type: 'Document Generator',
      free: true,
      href: '/startup/legal-documents',
      icon: FileText,
    },
  ]

  const handleOpenResource = (href: string, title: string) => {
    showToast(`Opening ${title}...`, 'info')
    window.location.href = href
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-md font-medium transition-all shrink-0 ${
            activeTab === 'tools'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Featured Tools
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`px-4 py-2 rounded-md font-medium transition-all shrink-0 ${
            activeTab === 'guides'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Guides
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-md font-medium transition-all shrink-0 ${
            activeTab === 'templates'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Templates
        </button>
      </div>

      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredTools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-primary-500/10 to-blue-500/10 p-8 text-center mb-4">
                <tool.icon className="h-12 w-12 mx-auto text-primary-500" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="new">Featured</Badge>
                <span className="text-xs text-gray-500">{tool.category}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tool.description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleOpenResource(tool.href, tool.title)}
              >
                Open Tool
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {guides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-primary-500/10 p-8 text-center mb-4">
                <guide.icon className="h-12 w-12 mx-auto text-primary-500" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="new">Featured</Badge>
                <span className="text-xs text-gray-500">{guide.date}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{guide.description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleOpenResource(guide.href, guide.title)}
              >
                Read Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-lg mb-4 text-center">
                <template.icon className="h-8 w-8 mx-auto text-primary-500" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="new">Free</Badge>
                <span className="text-xs text-gray-500">{template.type}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => handleOpenResource(template.href, template.title)}
              >
                Open Template
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
