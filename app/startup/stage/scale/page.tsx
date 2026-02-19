'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { Star, CheckCircle, Circle, Users, FileText, DollarSign, Target, TrendingUp, BookOpen, Zap, ArrowRight, ArrowLeft, Clock, Award, Lightbulb, Rocket, Globe, Building2, BarChart, Shield, Settings, PieChart, Briefcase } from 'lucide-react'
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
  { id: '1', title: 'Series B+ Raised', description: 'Secured growth-stage funding', completed: false },
  { id: '2', title: 'International Presence', description: 'Expanded to multiple countries or regions', completed: false },
  { id: '3', title: 'Team Scaled to 50+', description: 'Grown organization with multiple departments', completed: false },
  { id: '4', title: 'Revenue $10M+ ARR', description: 'Achieved significant annual recurring revenue', completed: false },
  { id: '5', title: 'Enterprise Customers', description: 'Signed major enterprise accounts', completed: false },
  { id: '6', title: 'Exit Path Defined', description: 'Clear path to IPO or acquisition', completed: false },
]

const checklist: ChecklistItem[] = [
  { id: '1', title: 'International Expansion', description: 'Expand to new markets and regions', completed: false, link: '/startup/international-expansion' },
  { id: '2', title: 'Build Enterprise Sales', description: 'Develop enterprise sales capabilities', completed: false, link: '/startup/sales/process' },
  { id: '3', title: 'Establish Board Governance', description: 'Set up board meetings and governance', completed: false, link: '/startup/board-meeting-planner' },
  { id: '4', title: 'Build Advisory Board', description: 'Recruit strategic advisors', completed: false, link: '/startup/advisory-board-builder' },
  { id: '5', title: 'Series B Fundraising', description: 'Prepare and execute Series B round', completed: false, link: '/startup/funding/readiness' },
  { id: '6', title: 'Scale Operations', description: 'Build scalable operational infrastructure', completed: false, link: '/startup/operations-dashboard' },
  { id: '7', title: 'Implement Advanced Analytics', description: 'Build data-driven decision making', completed: false, link: '/startup/marketing/analytics' },
  { id: '8', title: 'Executive Hiring', description: 'Build C-suite and executive team', completed: false, link: '/startup/team-management' },
  { id: '9', title: 'M&A Strategy', description: 'Evaluate acquisition opportunities', completed: false, link: '/startup/due-diligence' },
  { id: '10', title: 'IPO Preparation', description: 'Prepare for potential public offering', completed: false, link: '/startup/legal/structure' },
  { id: '11', title: 'Compliance at Scale', description: 'Ensure regulatory compliance globally', completed: false, link: '/startup/legal/privacy' },
  { id: '12', title: 'Brand Building', description: 'Build global brand recognition', completed: false, link: '/startup/marketing/strategy' },
]

const resources: Resource[] = [
  {
    id: '1',
    title: 'International Expansion Hub',
    description: 'Resources and guides for global expansion.',
    icon: Globe,
    link: '/startup/international-expansion',
    type: 'tool',
    featured: true
  },
  {
    id: '2',
    title: 'Board Meeting Planner',
    description: 'Plan and manage board meetings effectively.',
    icon: Briefcase,
    link: '/startup/board-meeting-planner',
    type: 'tool',
    featured: true
  },
  {
    id: '3',
    title: 'Advisory Board Builder',
    description: 'Build and manage your advisory board.',
    icon: Users,
    link: '/startup/advisory-board-builder',
    type: 'tool',
    featured: true
  },
  {
    id: '4',
    title: 'Enterprise Sales Process',
    description: 'Build and scale enterprise sales operations.',
    icon: Building2,
    link: '/startup/sales/process',
    type: 'tool'
  },
  {
    id: '5',
    title: 'Operations Dashboard',
    description: 'Manage operations at enterprise scale.',
    icon: Settings,
    link: '/startup/operations-dashboard',
    type: 'tool'
  },
  {
    id: '6',
    title: 'Due Diligence Checklist',
    description: 'Prepare for M&A and investment due diligence.',
    icon: Shield,
    link: '/startup/due-diligence',
    type: 'template'
  },
  {
    id: '7',
    title: 'Investor Pitch Tracker',
    description: 'Track investor relationships and fundraising.',
    icon: DollarSign,
    link: '/startup/investor-pitch-tracker',
    type: 'tool'
  },
  {
    id: '8',
    title: 'Financial Projections',
    description: 'Advanced financial modeling and projections.',
    icon: PieChart,
    link: '/startup/financial-projections/enhanced',
    type: 'tool'
  },
]

const guides = [
  { id: '1', title: 'International Expansion Playbook', duration: '35 min read', link: '/startup/guides' },
  { id: '2', title: 'Building Enterprise Sales Teams', duration: '28 min read', link: '/startup/guides' },
  { id: '3', title: 'IPO Preparation Guide', duration: '40 min read', link: '/startup/guides' },
  { id: '4', title: 'M&A Strategy for Startups', duration: '32 min read', link: '/startup/guides' },
]

export default function ScaleStagePage() {
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
            <Link href="/startup/stage/growth">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                <ArrowLeft className="h-3 w-3 mr-1 inline" /> Growth Stage
              </Badge>
            </Link>
            <Badge className="text-sm bg-purple-500 text-white">Stage 4 of 4</Badge>
            <Badge variant="featured" className="text-sm">
              <Star className="h-3 w-3 mr-1 inline fill-current" /> Final Stage
            </Badge>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Star className="h-10 w-10 text-purple-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              Scale Stage
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Scale your startup to become a global enterprise. This stage focuses on international expansion, enterprise sales, and preparing for exit opportunities.
          </p>
          
          {/* Progress Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">{progress}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">{completedChecklist}/{checklistItems.length}</div>
              <div className="text-sm text-gray-600">Tasks Done</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">{completedMilestones}/{milestoneItems.length}</div>
              <div className="text-sm text-gray-600">Milestones</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">{resources.length}</div>
              <div className="text-sm text-gray-600">Resources</div>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div
              className="bg-purple-500 h-3 rounded-full transition-all duration-500"
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
                <Award className="h-5 w-5 text-purple-500" />
                Key Milestones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestoneItems.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      milestone.completed
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-purple-300'
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
                <CheckCircle className="h-5 w-5 text-purple-500" />
                Scale Stage Checklist
              </h2>
              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      item.completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 hover:border-purple-300'
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
                <Zap className="h-5 w-5 text-purple-500" />
                Essential Tools for Scale Stage
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource) => {
                  const Icon = resource.icon
                  return (
                    <Link href={resource.link} key={resource.id}>
                      <div className="p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer">
                        {resource.featured && (
                          <Badge variant="featured" className="mb-2 text-xs">Featured</Badge>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Icon className="h-5 w-5 text-purple-500" />
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
                <Link href="/startup/stage/launch">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary-300 transition-all">
                    <Rocket className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-semibold text-sm">Launch Stage</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>
                </Link>
                <Link href="/startup/stage/growth">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary-300 transition-all">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-semibold text-sm">Growth Stage</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border-2 border-purple-500">
                  <Star className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-semibold text-sm">Scale Stage</div>
                    <div className="text-xs text-gray-500">Current</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommended Guides */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                Recommended Guides
              </h3>
              <div className="space-y-3">
                {guides.map((guide) => (
                  <Link href={guide.link} key={guide.id}>
                    <div className="p-3 rounded-lg border hover:border-purple-300 transition-all">
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

            {/* Success Message */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-purple-500 fill-purple-500" />
                <h3 className="font-bold">Congratulations!</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                You've reached the Scale stage! Continue executing on your growth strategy and prepare for your exit event.
              </p>
              <div className="space-y-2">
                <Link href="/startup/funding/investors">
                  <Button variant="outline" className="w-full" size="sm">
                    Find Investors
                  </Button>
                </Link>
                <Link href="/mentorship">
                  <Button variant="outline" className="w-full" size="sm">
                    Connect with Mentors
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
