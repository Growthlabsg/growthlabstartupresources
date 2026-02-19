'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { Lightbulb, Target, Rocket, CheckCircle, Circle, Search, Users, FileText, BarChart, DollarSign, MessageSquare, TrendingUp, BookOpen, Zap, ArrowRight, Star, Clock, Award } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
  link?: string
}

interface Resource {
  id: string
  title: string
  description: string
  icon: any
  link: string
  type: 'tool' | 'guide' | 'template'
  featured?: boolean
}

const milestones = [
  { id: '1', title: 'Problem Identified', description: 'Clearly defined the problem you\'re solving', completed: false },
  { id: '2', title: 'Target Audience Defined', description: 'Identified your ideal customer profile', completed: false },
  { id: '3', title: 'Solution Validated', description: 'Confirmed your solution solves the problem', completed: false },
  { id: '4', title: 'Market Size Estimated', description: 'Calculated TAM, SAM, and SOM', completed: false },
  { id: '5', title: 'Business Model Drafted', description: 'Created initial business model canvas', completed: false },
  { id: '6', title: 'MVP Scope Defined', description: 'Outlined minimum viable product features', completed: false },
]

const checklist: ChecklistItem[] = [
  { id: '1', title: 'Define the Problem', description: 'Clearly articulate the problem you\'re solving', completed: false, link: '/startup/idea-validation' },
  { id: '2', title: 'Identify Target Customers', description: 'Create detailed customer personas', completed: false, link: '/startup/customer-discovery' },
  { id: '3', title: 'Research Competitors', description: 'Analyze existing solutions and competitors', completed: false, link: '/startup/competitive-analysis' },
  { id: '4', title: 'Validate the Idea', description: 'Test your idea with potential customers', completed: false, link: '/startup/idea-validation' },
  { id: '5', title: 'Calculate Market Size', description: 'Estimate your total addressable market', completed: false, link: '/startup/market-research' },
  { id: '6', title: 'Create Business Model Canvas', description: 'Map out your business model', completed: false, link: '/startup/business-model-canvas' },
  { id: '7', title: 'Define Value Proposition', description: 'Articulate your unique value proposition', completed: false, link: '/startup/business-plan' },
  { id: '8', title: 'Plan Your MVP', description: 'Define core features for your MVP', completed: false, link: '/startup/checklist' },
  { id: '9', title: 'Estimate Initial Costs', description: 'Create a basic financial projection', completed: false, link: '/startup/financial-projections' },
  { id: '10', title: 'Draft Pitch Concept', description: 'Create an initial pitch for your idea', completed: false, link: '/startup/pitch-deck-builder' },
]

const resources: Resource[] = [
  {
    id: '1',
    title: 'Idea Validation Toolkit',
    description: 'Comprehensive toolkit to validate your startup idea with proven frameworks.',
    icon: Target,
    link: '/startup/idea-validation',
    type: 'tool',
    featured: true
  },
  {
    id: '2',
    title: 'Customer Discovery Tool',
    description: 'Discover and validate your target customers with interviews and surveys.',
    icon: Users,
    link: '/startup/customer-discovery',
    type: 'tool',
    featured: true
  },
  {
    id: '3',
    title: 'Market Research Hub',
    description: 'Research your market, competitors, and industry trends.',
    icon: Search,
    link: '/startup/market-research',
    type: 'tool',
    featured: true
  },
  {
    id: '4',
    title: 'Business Model Canvas',
    description: 'Design and iterate on your business model using the canvas framework.',
    icon: FileText,
    link: '/startup/business-model-canvas',
    type: 'tool'
  },
  {
    id: '5',
    title: 'Competitive Analysis',
    description: 'Analyze your competition and identify your competitive advantage.',
    icon: BarChart,
    link: '/startup/competitive-analysis',
    type: 'tool'
  },
  {
    id: '6',
    title: 'SWOT Analysis Tool',
    description: 'Evaluate strengths, weaknesses, opportunities, and threats.',
    icon: Target,
    link: '/startup/swot-analysis',
    type: 'tool'
  },
  {
    id: '7',
    title: 'Financial Projections',
    description: 'Create initial financial projections and cost estimates.',
    icon: DollarSign,
    link: '/startup/financial-projections',
    type: 'tool'
  },
  {
    id: '8',
    title: 'Startup Checklist',
    description: 'Complete checklist to track your startup progress.',
    icon: CheckCircle,
    link: '/startup/checklist',
    type: 'template'
  },
]

const guides = [
  { id: '1', title: 'How to Validate Your Startup Idea', duration: '15 min read', link: '/startup/guides' },
  { id: '2', title: 'Customer Discovery Best Practices', duration: '12 min read', link: '/startup/guides' },
  { id: '3', title: 'Market Research for Startups', duration: '20 min read', link: '/startup/guides' },
  { id: '4', title: 'Building Your First MVP', duration: '18 min read', link: '/startup/guides' },
]

export default function IdeaStagePage() {
  const [checklistItems, setChecklistItems] = useState(checklist)
  const [milestoneItems, setMilestoneItems] = useState(milestones)

  const toggleChecklist = (id: string) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
    showToast('Progress updated!', 'success')
  }

  const toggleMilestone = (id: string) => {
    setMilestoneItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
    showToast('Milestone updated!', 'success')
  }

  const completedChecklist = checklistItems.filter(item => item.completed).length
  const completedMilestones = milestoneItems.filter(item => item.completed).length
  const progress = Math.round((completedChecklist / checklistItems.length) * 100)

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="beginner" className="text-sm">Stage 1 of 4</Badge>
            <Link href="/startup/stage/launch">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                Next: Launch Stage <ArrowRight className="h-3 w-3 ml-1 inline" />
              </Badge>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="h-10 w-10 text-yellow-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              Idea Stage
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Transform your idea into a validated business concept. This stage focuses on problem discovery, customer validation, and market research.
          </p>
          
          {/* Progress Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">{progress}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">{completedChecklist}/{checklistItems.length}</div>
              <div className="text-sm text-gray-600">Tasks Done</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">{completedMilestones}/{milestoneItems.length}</div>
              <div className="text-sm text-gray-600">Milestones</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">{resources.length}</div>
              <div className="text-sm text-gray-600">Resources</div>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div
              className="bg-primary-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checklist */}
          <div className="lg:col-span-2">
            {/* Milestones */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Key Milestones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestoneItems.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      milestone.completed
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => toggleMilestone(milestone.id)}
                  >
                    <div className="flex items-start gap-3">
                      {milestone.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                      )}
                      <div>
                        <h3 className="font-semibold text-sm">{milestone.title}</h3>
                        <p className="text-xs text-gray-500">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Checklist */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-500" />
                Idea Stage Checklist
              </h2>
              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      item.completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => toggleChecklist(item.id)}
                  >
                    <div className="flex items-start gap-3">
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h3 className={`font-semibold ${item.completed ? 'line-through text-gray-500' : ''}`}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      {item.link && (
                        <Link href={item.link} onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Featured Resources */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Essential Tools for Idea Stage
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource) => {
                  const Icon = resource.icon
                  return (
                    <Link href={resource.link} key={resource.id}>
                      <div className="p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer">
                        {resource.featured && (
                          <Badge variant="featured" className="mb-2 text-xs">Featured</Badge>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="bg-primary-100 p-2 rounded-lg">
                            <Icon className="h-5 w-5 text-primary-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{resource.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{resource.description}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Stage Navigation */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Startup Journey</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 border-2 border-primary-500">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="font-semibold text-sm">Idea Stage</div>
                    <div className="text-xs text-gray-500">Current</div>
                  </div>
                </div>
                <Link href="/startup/stage/launch">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary-300 transition-all">
                    <Rocket className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-semibold text-sm">Launch Stage</div>
                      <div className="text-xs text-gray-500">Next</div>
                    </div>
                  </div>
                </Link>
                <Link href="/startup/stage/growth">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary-300 transition-all">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-semibold text-sm">Growth Stage</div>
                      <div className="text-xs text-gray-500">Upcoming</div>
                    </div>
                  </div>
                </Link>
                <Link href="/startup/stage/scale">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary-300 transition-all">
                    <Star className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-semibold text-sm">Scale Stage</div>
                      <div className="text-xs text-gray-500">Upcoming</div>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Recommended Guides */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-500" />
                Recommended Guides
              </h3>
              <div className="space-y-3">
                {guides.map((guide) => (
                  <Link href={guide.link} key={guide.id}>
                    <div className="p-3 rounded-lg border hover:border-primary-300 transition-all">
                      <div className="font-semibold text-sm">{guide.title}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3" />
                        {guide.duration}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="p-6 bg-gradient-to-br from-primary-50 to-blue-50">
              <h3 className="font-bold mb-3">Ready for Launch Stage?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete at least 80% of the idea stage checklist before moving to the launch stage.
              </p>
              <Link href="/startup/stage/launch">
                <Button className="w-full" disabled={progress < 80}>
                  {progress >= 80 ? 'Go to Launch Stage' : `${80 - progress}% more to unlock`}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
