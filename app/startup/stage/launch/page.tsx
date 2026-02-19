'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { Rocket, CheckCircle, Circle, Users, FileText, DollarSign, Target, TrendingUp, BookOpen, Zap, ArrowRight, ArrowLeft, Star, Clock, Award, Lightbulb, Code, MessageSquare, Megaphone, Shield } from 'lucide-react'
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
  { id: '1', title: 'MVP Built', description: 'Developed your minimum viable product', completed: false },
  { id: '2', title: 'First Users Acquired', description: 'Onboarded your first beta users', completed: false },
  { id: '3', title: 'Product-Market Fit Signal', description: 'Received positive feedback from users', completed: false },
  { id: '4', title: 'Core Team Assembled', description: 'Built your founding team', completed: false },
  { id: '5', title: 'Legal Structure Set', description: 'Incorporated and set up legal structure', completed: false },
  { id: '6', title: 'Go-to-Market Executed', description: 'Launched your product to the market', completed: false },
]

const checklist: ChecklistItem[] = [
  { id: '1', title: 'Build MVP', description: 'Develop your minimum viable product', completed: false, link: '/startup/tech/stack-builder' },
  { id: '2', title: 'Set Up Tech Stack', description: 'Choose and implement your technology stack', completed: false, link: '/startup/tech/stack-builder' },
  { id: '3', title: 'Create Landing Page', description: 'Build a compelling landing page', completed: false, link: '/startup/marketing/strategy' },
  { id: '4', title: 'Incorporate Business', description: 'Set up legal structure and incorporate', completed: false, link: '/startup/legal/structure' },
  { id: '5', title: 'Build Founding Team', description: 'Recruit co-founders and early team members', completed: false, link: '/startup/team-management' },
  { id: '6', title: 'Create Pitch Deck', description: 'Build your investor pitch deck', completed: false, link: '/startup/pitch-deck-builder' },
  { id: '7', title: 'Set Up Analytics', description: 'Implement tracking and analytics', completed: false, link: '/startup/marketing/analytics' },
  { id: '8', title: 'Plan Go-to-Market Strategy', description: 'Define your launch and marketing strategy', completed: false, link: '/startup/marketing/strategy' },
  { id: '9', title: 'Acquire First Users', description: 'Get your first beta testers and customers', completed: false, link: '/startup/customer-discovery' },
  { id: '10', title: 'Collect User Feedback', description: 'Gather and analyze user feedback', completed: false, link: '/startup/customer-discovery' },
  { id: '11', title: 'Iterate on Product', description: 'Improve product based on feedback', completed: false, link: '/startup/checklist' },
  { id: '12', title: 'Prepare for Funding', description: 'Get ready for pre-seed or seed funding', completed: false, link: '/startup/funding/readiness' },
]

const resources: Resource[] = [
  {
    id: '1',
    title: 'Pitch Deck Builder',
    description: 'Create a compelling pitch deck to attract investors and partners.',
    icon: FileText,
    link: '/startup/pitch-deck-builder',
    type: 'tool',
    featured: true
  },
  {
    id: '2',
    title: 'Tech Stack Builder',
    description: 'Choose the right technology stack for your MVP.',
    icon: Code,
    link: '/startup/tech/stack-builder',
    type: 'tool',
    featured: true
  },
  {
    id: '3',
    title: 'Team Management Hub',
    description: 'Build and manage your founding team effectively.',
    icon: Users,
    link: '/startup/team-management',
    type: 'tool',
    featured: true
  },
  {
    id: '4',
    title: 'Legal Structure Guide',
    description: 'Set up the right legal structure for your startup.',
    icon: Shield,
    link: '/startup/legal/structure',
    type: 'guide'
  },
  {
    id: '5',
    title: 'Marketing Strategy',
    description: 'Plan and execute your go-to-market strategy.',
    icon: Megaphone,
    link: '/startup/marketing/strategy',
    type: 'tool'
  },
  {
    id: '6',
    title: 'Funding Readiness',
    description: 'Assess your readiness for fundraising.',
    icon: DollarSign,
    link: '/startup/funding/readiness',
    type: 'tool'
  },
  {
    id: '7',
    title: 'Growth Analytics',
    description: 'Track key metrics and analyze growth.',
    icon: TrendingUp,
    link: '/startup/marketing/analytics',
    type: 'tool'
  },
  {
    id: '8',
    title: 'Startup Checklist',
    description: 'Complete checklist to track your launch progress.',
    icon: CheckCircle,
    link: '/startup/checklist',
    type: 'template'
  },
]

const guides = [
  { id: '1', title: 'How to Build Your MVP Fast', duration: '18 min read', link: '/startup/guides' },
  { id: '2', title: 'Hiring Your First Employees', duration: '15 min read', link: '/startup/guides' },
  { id: '3', title: 'Go-to-Market Strategy Guide', duration: '22 min read', link: '/startup/guides' },
  { id: '4', title: 'Pre-Seed Fundraising 101', duration: '20 min read', link: '/startup/guides' },
]

export default function LaunchStagePage() {
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
            <Link href="/startup/stage/idea">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                <ArrowLeft className="h-3 w-3 mr-1 inline" /> Idea Stage
              </Badge>
            </Link>
            <Badge variant="intermediate" className="text-sm">Stage 2 of 4</Badge>
            <Link href="/startup/stage/growth">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                Next: Growth Stage <ArrowRight className="h-3 w-3 ml-1 inline" />
              </Badge>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="h-10 w-10 text-blue-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              Launch Stage
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Build your MVP, assemble your team, and launch your startup. This stage focuses on product development, team building, and market entry.
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
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
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
                <Award className="h-5 w-5 text-blue-500" />
                Key Milestones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestoneItems.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      milestone.completed
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
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
                <CheckCircle className="h-5 w-5 text-blue-500" />
                Launch Stage Checklist
              </h2>
              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      item.completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
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
                <Zap className="h-5 w-5 text-blue-500" />
                Essential Tools for Launch Stage
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource) => {
                  const Icon = resource.icon
                  return (
                    <Link href={resource.link} key={resource.id}>
                      <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                        {resource.featured && (
                          <Badge variant="featured" className="mb-2 text-xs">Featured</Badge>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Icon className="h-5 w-5 text-blue-500" />
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
                <Link href="/startup/stage/idea">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary-300 transition-all">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-semibold text-sm">Idea Stage</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border-2 border-blue-500">
                  <Rocket className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-semibold text-sm">Launch Stage</div>
                    <div className="text-xs text-gray-500">Current</div>
                  </div>
                </div>
                <Link href="/startup/stage/growth">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary-300 transition-all">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-semibold text-sm">Growth Stage</div>
                      <div className="text-xs text-gray-500">Next</div>
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
                <BookOpen className="h-5 w-5 text-blue-500" />
                Recommended Guides
              </h3>
              <div className="space-y-3">
                {guides.map((guide) => (
                  <Link href={guide.link} key={guide.id}>
                    <div className="p-3 rounded-lg border hover:border-blue-300 transition-all">
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
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50">
              <h3 className="font-bold mb-3">Ready for Growth Stage?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete at least 80% of the launch stage checklist before moving to the growth stage.
              </p>
              <Link href="/startup/stage/growth">
                <Button className="w-full" disabled={progress < 80}>
                  {progress >= 80 ? 'Go to Growth Stage' : `${80 - progress}% more to unlock`}
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
