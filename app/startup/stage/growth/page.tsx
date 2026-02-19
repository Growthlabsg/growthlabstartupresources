'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { TrendingUp, CheckCircle, Circle, Users, FileText, DollarSign, Target, BarChart, BookOpen, Zap, ArrowRight, ArrowLeft, Star, Clock, Award, Lightbulb, Rocket, Megaphone, Globe, Settings, PieChart } from 'lucide-react'
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
  { id: '1', title: 'Product-Market Fit Achieved', description: 'Validated strong demand for your product', completed: false },
  { id: '2', title: 'Revenue Growth', description: 'Consistent month-over-month revenue growth', completed: false },
  { id: '3', title: 'Team Scaled to 10+', description: 'Grown your team to support growth', completed: false },
  { id: '4', title: 'Series A Ready', description: 'Prepared for Series A funding', completed: false },
  { id: '5', title: 'Processes Documented', description: 'Created scalable processes and documentation', completed: false },
  { id: '6', title: 'Market Expansion Initiated', description: 'Started expanding to new markets or segments', completed: false },
]

const checklist: ChecklistItem[] = [
  { id: '1', title: 'Optimize Conversion Funnel', description: 'Improve conversion rates across the funnel', completed: false, link: '/startup/conversion-rate-calculator' },
  { id: '2', title: 'Scale Customer Acquisition', description: 'Build repeatable customer acquisition channels', completed: false, link: '/startup/marketing/strategy' },
  { id: '3', title: 'Implement Growth Analytics', description: 'Track key growth metrics and KPIs', completed: false, link: '/startup/marketing/analytics' },
  { id: '4', title: 'Hire Key Roles', description: 'Recruit for sales, marketing, and engineering', completed: false, link: '/startup/team-management' },
  { id: '5', title: 'Build Sales Process', description: 'Create a scalable sales process', completed: false, link: '/startup/sales/process' },
  { id: '6', title: 'Develop Customer Success', description: 'Build customer success and retention programs', completed: false, link: '/startup/customer-discovery' },
  { id: '7', title: 'Optimize Unit Economics', description: 'Improve CAC, LTV, and other unit economics', completed: false, link: '/startup/cac-calculator' },
  { id: '8', title: 'Prepare for Series A', description: 'Get ready for Series A fundraising', completed: false, link: '/startup/funding/readiness' },
  { id: '9', title: 'Document Processes', description: 'Create SOPs and documentation for key processes', completed: false, link: '/startup/operations-dashboard' },
  { id: '10', title: 'Build Data Infrastructure', description: 'Set up data warehouse and analytics infrastructure', completed: false, link: '/startup/tech/stack-builder' },
  { id: '11', title: 'Expand Product Features', description: 'Add features based on customer feedback', completed: false, link: '/startup/checklist' },
  { id: '12', title: 'Explore New Markets', description: 'Research and plan market expansion', completed: false, link: '/startup/international-expansion' },
]

const resources: Resource[] = [
  {
    id: '1',
    title: 'Growth Analytics Dashboard',
    description: 'Track key growth metrics, cohorts, and revenue analytics.',
    icon: BarChart,
    link: '/startup/marketing/analytics',
    type: 'tool',
    featured: true
  },
  {
    id: '2',
    title: 'Sales Process Builder',
    description: 'Build and optimize your sales pipeline and process.',
    icon: Target,
    link: '/startup/sales/process',
    type: 'tool',
    featured: true
  },
  {
    id: '3',
    title: 'Team Management Hub',
    description: 'Scale your team with effective management tools.',
    icon: Users,
    link: '/startup/team-management',
    type: 'tool',
    featured: true
  },
  {
    id: '4',
    title: 'CAC Calculator',
    description: 'Calculate and optimize customer acquisition cost.',
    icon: DollarSign,
    link: '/startup/cac-calculator',
    type: 'tool'
  },
  {
    id: '5',
    title: 'LTV Calculator',
    description: 'Calculate customer lifetime value and unit economics.',
    icon: PieChart,
    link: '/startup/ltv-calculator',
    type: 'tool'
  },
  {
    id: '6',
    title: 'Conversion Rate Calculator',
    description: 'Analyze and optimize conversion rates.',
    icon: TrendingUp,
    link: '/startup/conversion-rate-calculator',
    type: 'tool'
  },
  {
    id: '7',
    title: 'Operations Dashboard',
    description: 'Manage operations and processes at scale.',
    icon: Settings,
    link: '/startup/operations-dashboard',
    type: 'tool'
  },
  {
    id: '8',
    title: 'Funding Readiness',
    description: 'Assess your readiness for Series A funding.',
    icon: DollarSign,
    link: '/startup/funding/readiness',
    type: 'tool'
  },
]

const guides = [
  { id: '1', title: 'Achieving Product-Market Fit', duration: '25 min read', link: '/startup/guides' },
  { id: '2', title: 'Scaling Your Sales Team', duration: '20 min read', link: '/startup/guides' },
  { id: '3', title: 'Growth Marketing Strategies', duration: '22 min read', link: '/startup/guides' },
  { id: '4', title: 'Series A Fundraising Guide', duration: '30 min read', link: '/startup/guides' },
]

export default function GrowthStagePage() {
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
            <Link href="/startup/stage/launch">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                <ArrowLeft className="h-3 w-3 mr-1 inline" /> Launch Stage
              </Badge>
            </Link>
            <Badge variant="advanced" className="text-sm">Stage 3 of 4</Badge>
            <Link href="/startup/stage/scale">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                Next: Scale Stage <ArrowRight className="h-3 w-3 ml-1 inline" />
              </Badge>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-10 w-10 text-green-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              Growth Stage
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Scale your startup with proven growth strategies. This stage focuses on customer acquisition, team scaling, and preparing for larger funding rounds.
          </p>
          
          {/* Progress Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">{progress}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">{completedChecklist}/{checklistItems.length}</div>
              <div className="text-sm text-gray-600">Tasks Done</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">{completedMilestones}/{milestoneItems.length}</div>
              <div className="text-sm text-gray-600">Milestones</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">{resources.length}</div>
              <div className="text-sm text-gray-600">Resources</div>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
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
                <Award className="h-5 w-5 text-green-500" />
                Key Milestones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestoneItems.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      milestone.completed
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
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
                <CheckCircle className="h-5 w-5 text-green-500" />
                Growth Stage Checklist
              </h2>
              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      item.completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
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
                <Zap className="h-5 w-5 text-green-500" />
                Essential Tools for Growth Stage
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource) => {
                  const Icon = resource.icon
                  return (
                    <Link href={resource.link} key={resource.id}>
                      <div className="p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                        {resource.featured && (
                          <Badge variant="featured" className="mb-2 text-xs">Featured</Badge>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Icon className="h-5 w-5 text-green-500" />
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
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border-2 border-green-500">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-semibold text-sm">Growth Stage</div>
                    <div className="text-xs text-gray-500">Current</div>
                  </div>
                </div>
                <Link href="/startup/stage/scale">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary-300 transition-all">
                    <Star className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-semibold text-sm">Scale Stage</div>
                      <div className="text-xs text-gray-500">Next</div>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Recommended Guides */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-500" />
                Recommended Guides
              </h3>
              <div className="space-y-3">
                {guides.map((guide) => (
                  <Link href={guide.link} key={guide.id}>
                    <div className="p-3 rounded-lg border hover:border-green-300 transition-all">
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
            <Card className="p-6 bg-gradient-to-br from-green-50 to-purple-50">
              <h3 className="font-bold mb-3">Ready for Scale Stage?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete at least 80% of the growth stage checklist before moving to the scale stage.
              </p>
              <Link href="/startup/stage/scale">
                <Button className="w-full" disabled={progress < 80}>
                  {progress >= 80 ? 'Go to Scale Stage' : `${80 - progress}% more to unlock`}
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
