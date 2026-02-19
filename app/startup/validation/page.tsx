'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import SimpleTabs from '@/components/ui/SimpleTabs'
import Link from 'next/link'
import { 
  Lightbulb, Target, Users, BarChart3, CheckCircle, TrendingUp, Rocket,
  ArrowRight, Zap, Star, Award, Activity, Search, Globe, FileText,
  MessageSquare, PieChart, Compass, Layers, Heart, Brain, Building2,
  Calculator, Settings, DollarSign, Sparkles
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface ValidationProgress {
  ideaValidation: number
  marketResearch: number
  customerDiscovery: number
  competitiveAnalysis: number
  mvpPlanning: number
}

interface ValidationMilestone {
  id: string
  name: string
  description: string
  completed: boolean
  category: 'idea' | 'market' | 'customer' | 'competitive' | 'mvp'
}

const validationTools = [
  {
    id: 'idea-validation',
    title: 'Idea Validation Toolkit',
    description: 'Validate your startup idea with problem validation, solution testing, and MVP planning tools.',
    icon: Lightbulb,
    href: '/startup/idea-validation',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    features: ['Problem Validation', 'Solution Testing', 'Customer Interviews', 'A/B Testing', 'MVP Planning'],
    badge: 'Comprehensive'
  },
  {
    id: 'market-research',
    title: 'Market Research Tools',
    description: 'Comprehensive market analysis with TAM/SAM/SOM calculator, competitor tracking, and SWOT analysis.',
    icon: BarChart3,
    href: '/startup/market-research',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    features: ['Market Sizing', 'Competitor Analysis', 'SWOT Analysis', 'Segmentation', 'Pricing Analysis'],
    badge: 'Advanced'
  },
  {
    id: 'customer-discovery',
    title: 'Customer Discovery',
    description: 'Build surveys, conduct interviews, analyze feedback, and create detailed customer personas.',
    icon: Users,
    href: '/startup/customer-discovery',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    features: ['Survey Builder', 'User Interviews', 'Feedback Analysis', 'Customer Personas', 'Analytics'],
    badge: 'Essential'
  },
  {
    id: 'competitive-analysis',
    title: 'Competitive Analysis',
    description: 'Track competitors, compare features, analyze positioning, and identify market opportunities.',
    icon: Target,
    href: '/startup/competitive-analysis',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    features: ['Competitor Tracking', 'Feature Comparison', 'Positioning Map', 'Market Gaps', 'Benchmarking'],
    badge: 'Strategic'
  },
  {
    id: 'value-proposition',
    title: 'Value Proposition Canvas',
    description: 'Design compelling value propositions that resonate with your target customers.',
    icon: Heart,
    href: '/startup/validation/value-proposition',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    features: ['Customer Profile', 'Value Map', 'Fit Analysis', 'Pain Relievers', 'Gain Creators'],
    badge: 'New'
  },
  {
    id: 'problem-solution',
    title: 'Problem-Solution Fit',
    description: 'Validate that your solution truly solves a real customer problem worth solving.',
    icon: Compass,
    href: '/startup/validation/problem-solution',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    features: ['Problem Definition', 'Solution Hypothesis', 'Fit Score', 'Validation Tests', 'Pivot Analysis'],
    badge: 'Core'
  }
]

const defaultMilestones: ValidationMilestone[] = [
  { id: '1', name: 'Problem Identified', description: 'Clearly defined the problem you are solving', completed: false, category: 'idea' },
  { id: '2', name: 'Target Customer Defined', description: 'Identified your ideal customer profile', completed: false, category: 'customer' },
  { id: '3', name: 'Market Size Calculated', description: 'Completed TAM/SAM/SOM analysis', completed: false, category: 'market' },
  { id: '4', name: 'Competitors Mapped', description: 'Identified and analyzed key competitors', completed: false, category: 'competitive' },
  { id: '5', name: '10+ Customer Interviews', description: 'Conducted at least 10 customer discovery interviews', completed: false, category: 'customer' },
  { id: '6', name: 'Value Proposition Created', description: 'Developed clear value proposition canvas', completed: false, category: 'idea' },
  { id: '7', name: 'Solution Validated', description: 'Tested solution concept with real users', completed: false, category: 'idea' },
  { id: '8', name: 'MVP Features Defined', description: 'Prioritized features for minimum viable product', completed: false, category: 'mvp' },
  { id: '9', name: 'Landing Page Tested', description: 'Created and tested landing page with real traffic', completed: false, category: 'mvp' },
  { id: '10', name: 'Problem-Solution Fit Achieved', description: 'Demonstrated clear problem-solution fit', completed: false, category: 'idea' }
]

const validationFrameworks = [
  {
    name: 'Lean Startup',
    description: 'Build-Measure-Learn cycle for rapid iteration',
    steps: ['Build MVP', 'Measure Results', 'Learn & Pivot', 'Repeat']
  },
  {
    name: 'Customer Development',
    description: 'Steve Blank\'s framework for startup validation',
    steps: ['Customer Discovery', 'Customer Validation', 'Customer Creation', 'Company Building']
  },
  {
    name: 'Design Thinking',
    description: 'Human-centered approach to problem solving',
    steps: ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test']
  },
  {
    name: 'Jobs To Be Done',
    description: 'Focus on the job customers are trying to accomplish',
    steps: ['Identify Job', 'Map Customer Journey', 'Find Gaps', 'Create Solution']
  }
]

export default function ValidationHubPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [milestones, setMilestones] = useState<ValidationMilestone[]>(defaultMilestones)
  const [progress, setProgress] = useState<ValidationProgress>({
    ideaValidation: 0,
    marketResearch: 0,
    customerDiscovery: 0,
    competitiveAnalysis: 0,
    mvpPlanning: 0
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'tools', label: 'Validation Tools', icon: Settings },
    { id: 'milestones', label: 'Milestones', icon: Target },
    { id: 'frameworks', label: 'Frameworks', icon: Layers },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('validationMilestones')
    if (saved) setMilestones(JSON.parse(saved))
  }, [])

  const toggleMilestone = (id: string) => {
    const updated = milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m)
    setMilestones(updated)
    localStorage.setItem('validationMilestones', JSON.stringify(updated))
    showToast('Milestone updated!', 'success')
  }

  const completedMilestones = milestones.filter(m => m.completed).length
  const overallProgress = Math.round((completedMilestones / milestones.length) * 100)

  const getReadinessLevel = () => {
    if (overallProgress >= 80) return { level: 'High', color: 'text-green-600', bg: 'bg-green-100' }
    if (overallProgress >= 50) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (overallProgress >= 25) return { level: 'Low', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { level: 'Early Stage', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const readiness = getReadinessLevel()

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lightbulb className="h-10 w-10 text-yellow-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Idea Validation Hub
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools and frameworks to validate your startup idea before building
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{overallProgress}%</div>
            <div className="text-sm text-gray-600">Validation Progress</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{completedMilestones}/{milestones.length}</div>
            <div className="text-sm text-gray-600">Milestones Complete</div>
          </Card>
          <Card className="p-4 text-center">
            <div className={`text-2xl font-bold ${readiness.color}`}>{readiness.level}</div>
            <div className="text-sm text-gray-600">Readiness Level</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{validationTools.length}</div>
            <div className="text-sm text-gray-600">Tools Available</div>
          </Card>
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-4">Validation Readiness Score</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Overall Progress</span>
                  <span className={`font-bold ${readiness.color}`}>{overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-500 ${overallProgress >= 80 ? 'bg-green-500' : overallProgress >= 50 ? 'bg-yellow-500' : overallProgress >= 25 ? 'bg-orange-500' : 'bg-red-500'}`}
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
              <div className={`p-4 rounded-lg ${readiness.bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className={`h-5 w-5 ${readiness.color}`} />
                  <span className={`font-semibold ${readiness.color}`}>{readiness.level} Validation Readiness</span>
                </div>
                <p className="text-sm text-gray-700">
                  {overallProgress >= 80 
                    ? 'Excellent! Your idea is well-validated. Consider moving forward with building.'
                    : overallProgress >= 50 
                    ? 'Good progress! Continue validating key assumptions before heavy investment.'
                    : overallProgress >= 25 
                    ? 'Early validation in progress. Focus on customer discovery and problem validation.'
                    : 'Just getting started! Begin with problem validation and market research.'}
                </p>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-bold mb-4">Quick Start Validation Path</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { step: 1, name: 'Problem', icon: Target, description: 'Validate the problem exists', href: '/startup/idea-validation' },
                  { step: 2, name: 'Market', icon: BarChart3, description: 'Size your market opportunity', href: '/startup/market-research' },
                  { step: 3, name: 'Customers', icon: Users, description: 'Understand your users', href: '/startup/customer-discovery' },
                  { step: 4, name: 'Solution', icon: Lightbulb, description: 'Test your solution', href: '/startup/idea-validation' },
                  { step: 5, name: 'MVP', icon: Rocket, description: 'Build and validate MVP', href: '/startup/idea-validation' }
                ].map((item) => (
                  <Link key={item.step} href={item.href}>
                    <div className="text-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all cursor-pointer">
                      <div className="bg-yellow-100 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold">{item.step}</span>
                      </div>
                      <item.icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {validationTools.slice(0, 3).map((tool) => {
                const Icon = tool.icon
                return (
                  <Link key={tool.id} href={tool.href}>
                    <Card className="p-4 h-full hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`${tool.bgColor} ${tool.color} p-3 rounded-lg`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="featured">{tool.badge}</Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{tool.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                      <div className="flex items-center text-primary-600 text-sm font-medium">
                        Explore <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validationTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.id} href={tool.href}>
                  <Card className="p-6 h-full hover:shadow-lg transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${tool.bgColor} ${tool.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant={tool.badge === 'New' ? 'new' : 'featured'}>{tool.badge}</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tool.features.slice(0, 3).map((feature, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{feature}</Badge>
                      ))}
                      {tool.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{tool.features.length - 3}</Badge>
                      )}
                    </div>
                    <Button className="w-full" variant="outline">
                      Open Tool <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Validation Milestones</h2>
                <Badge variant={overallProgress >= 80 ? 'new' : 'outline'}>{completedMilestones}/{milestones.length} Complete</Badge>
              </div>
              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <div 
                    key={milestone.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      milestone.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => toggleMilestone(milestone.id)}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      milestone.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {milestone.completed && <CheckCircle className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${milestone.completed ? 'text-green-700' : ''}`}>{milestone.name}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 capitalize">{milestone.category}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold mb-4">Milestone Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['idea', 'market', 'customer', 'competitive', 'mvp'].map(cat => {
                  const catMilestones = milestones.filter(m => m.category === cat)
                  const catComplete = catMilestones.filter(m => m.completed).length
                  return (
                    <div key={cat} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">{catComplete}/{catMilestones.length}</div>
                      <div className="text-xs text-gray-600 capitalize">{cat}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${catMilestones.length > 0 ? (catComplete / catMilestones.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'frameworks' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-6">Validation Frameworks</h2>
              <p className="text-gray-600 mb-6">
                Choose the right framework for your validation journey. Each offers a unique approach to testing and validating your startup idea.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {validationFrameworks.map((framework, idx) => (
                  <Card key={idx} className="p-6 border-2 border-gray-100">
                    <h3 className="text-lg font-bold mb-2">{framework.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{framework.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {framework.steps.map((step, i) => (
                        <React.Fragment key={i}>
                          <Badge variant="outline">{step}</Badge>
                          {i < framework.steps.length - 1 && <ArrowRight className="h-4 w-4 text-gray-400" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold mb-4">Recommended Reading</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'The Lean Startup', author: 'Eric Ries', focus: 'Build-Measure-Learn' },
                  { title: 'The Mom Test', author: 'Rob Fitzpatrick', focus: 'Customer Interviews' },
                  { title: 'Running Lean', author: 'Ash Maurya', focus: 'Lean Canvas' }
                ].map((book, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">{book.title}</h4>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <Badge variant="outline" className="mt-2">{book.focus}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}

