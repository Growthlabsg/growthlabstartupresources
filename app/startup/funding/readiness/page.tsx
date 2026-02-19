'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Link from 'next/link'
import { CheckCircle, Circle, DollarSign, Target, Users, FileText, TrendingUp, BarChart, Lightbulb, Rocket, Award, ArrowRight, Download, AlertCircle, Star, Zap, BookOpen, Clock, PieChart, ChevronDown, ChevronUp } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface ChecklistItem {
  id: string
  text: string
  description: string
  completed: boolean
  category: string
  weight: number
  resources?: { title: string; link: string }[]
}

interface Category {
  id: string
  name: string
  icon: any
  description: string
  color: string
}

interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
  action: string
  link?: string
}

const categories: Category[] = [
  { id: 'business', name: 'Business Fundamentals', icon: Lightbulb, description: 'Core business documents and plans', color: 'yellow' },
  { id: 'financial', name: 'Financial Readiness', icon: DollarSign, description: 'Financial projections and models', color: 'green' },
  { id: 'team', name: 'Team & Operations', icon: Users, description: 'Team structure and capabilities', color: 'blue' },
  { id: 'traction', name: 'Traction & Metrics', icon: TrendingUp, description: 'Growth metrics and validation', color: 'purple' },
  { id: 'materials', name: 'Pitch Materials', icon: FileText, description: 'Investor-ready documents', color: 'orange' },
  { id: 'legal', name: 'Legal & Compliance', icon: Award, description: 'Legal structure and IP', color: 'red' },
]

const initialChecklist: ChecklistItem[] = [
  // Business Fundamentals
  { id: '1', text: 'Business plan completed', description: 'Comprehensive business plan with market analysis, competitive positioning, and growth strategy', completed: false, category: 'business', weight: 8, resources: [{ title: 'Business Plan Guide', link: '/startup/business-plan' }] },
  { id: '2', text: 'Problem-solution fit validated', description: 'Clear evidence that your solution solves a real problem', completed: false, category: 'business', weight: 10, resources: [{ title: 'Idea Validation', link: '/startup/idea-validation' }] },
  { id: '3', text: 'Target market defined', description: 'Well-defined TAM, SAM, and SOM with supporting data', completed: false, category: 'business', weight: 7, resources: [{ title: 'Market Research', link: '/startup/market-research' }] },
  { id: '4', text: 'Business model canvas', description: 'Visual representation of your business model', completed: false, category: 'business', weight: 6, resources: [{ title: 'Business Model Canvas', link: '/startup/business-model-canvas' }] },
  { id: '5', text: 'Competitive analysis complete', description: 'Understanding of competitive landscape and differentiation', completed: false, category: 'business', weight: 5, resources: [{ title: 'Competitive Analysis', link: '/startup/competitive-analysis' }] },
  
  // Financial Readiness
  { id: '6', text: 'Financial projections (3-5 years)', description: 'Revenue forecasts, expense projections, and cash flow analysis', completed: false, category: 'financial', weight: 10, resources: [{ title: 'Financial Projections', link: '/startup/financial-projections' }] },
  { id: '7', text: 'Unit economics calculated', description: 'Clear understanding of CAC, LTV, and contribution margins', completed: false, category: 'financial', weight: 9, resources: [{ title: 'CAC Calculator', link: '/startup/cac-calculator' }, { title: 'LTV Calculator', link: '/startup/ltv-calculator' }] },
  { id: '8', text: 'Runway calculated', description: 'Understanding of burn rate and runway with current funds', completed: false, category: 'financial', weight: 8, resources: [{ title: 'Runway Calculator', link: '/startup/runway-calculator' }] },
  { id: '9', text: 'Use of funds plan', description: 'Detailed breakdown of how funding will be allocated', completed: false, category: 'financial', weight: 7 },
  { id: '10', text: 'Financial model created', description: 'Detailed financial model with assumptions and scenarios', completed: false, category: 'financial', weight: 8 },
  
  // Team & Operations
  { id: '11', text: 'Founding team assembled', description: 'Core team with complementary skills in place', completed: false, category: 'team', weight: 10, resources: [{ title: 'Team Management', link: '/startup/team-management' }] },
  { id: '12', text: 'Key roles identified', description: 'Understanding of immediate hiring needs', completed: false, category: 'team', weight: 5 },
  { id: '13', text: 'Advisor network established', description: 'Industry advisors and mentors in place', completed: false, category: 'team', weight: 4, resources: [{ title: 'Advisory Board Builder', link: '/startup/advisory-board-builder' }] },
  { id: '14', text: 'Equity split documented', description: 'Clear founder equity distribution and vesting', completed: false, category: 'team', weight: 6, resources: [{ title: 'Cap Table', link: '/startup/cap-table' }] },
  
  // Traction & Metrics
  { id: '15', text: 'Product/MVP launched', description: 'Working product or MVP in market', completed: false, category: 'traction', weight: 10, resources: [{ title: 'Startup Checklist', link: '/startup/checklist' }] },
  { id: '16', text: 'User metrics tracked', description: 'Key metrics like MAU, DAU, retention being measured', completed: false, category: 'traction', weight: 8 },
  { id: '17', text: 'Revenue generated', description: 'Proof of paying customers (even if small)', completed: false, category: 'traction', weight: 9 },
  { id: '18', text: 'Growth rate documented', description: 'MoM or WoW growth metrics established', completed: false, category: 'traction', weight: 7, resources: [{ title: 'Growth Rate Calculator', link: '/startup/growth-rate-calculator' }] },
  { id: '19', text: 'Customer testimonials collected', description: 'Social proof from early customers', completed: false, category: 'traction', weight: 5 },
  
  // Pitch Materials
  { id: '20', text: 'Pitch deck prepared', description: '10-15 slide investor pitch deck', completed: false, category: 'materials', weight: 10, resources: [{ title: 'Pitch Deck Builder', link: '/startup/pitch-deck-builder' }] },
  { id: '21', text: 'Executive summary written', description: '1-2 page executive summary', completed: false, category: 'materials', weight: 6 },
  { id: '22', text: 'One-pager created', description: 'Quick overview document for investors', completed: false, category: 'materials', weight: 5 },
  { id: '23', text: 'Demo/prototype ready', description: 'Working demo or clickable prototype', completed: false, category: 'materials', weight: 7 },
  { id: '24', text: 'Data room organized', description: 'All due diligence documents organized', completed: false, category: 'materials', weight: 6, resources: [{ title: 'Due Diligence', link: '/startup/due-diligence' }] },
  
  // Legal & Compliance
  { id: '25', text: 'Company incorporated', description: 'Legal entity established (C-Corp, LLC, etc.)', completed: false, category: 'legal', weight: 10, resources: [{ title: 'Legal Structure', link: '/startup/legal/structure' }] },
  { id: '26', text: 'IP protected', description: 'Patents, trademarks, or copyrights filed as needed', completed: false, category: 'legal', weight: 7 },
  { id: '27', text: 'Founder agreements signed', description: 'Operating agreements, vesting schedules in place', completed: false, category: 'legal', weight: 8 },
  { id: '28', text: 'Cap table clean', description: 'Clear cap table with no issues', completed: false, category: 'legal', weight: 9, resources: [{ title: 'Cap Table', link: '/startup/cap-table' }] },
]

const fundingStages = [
  { id: 'pre-seed', name: 'Pre-Seed', amount: '$50K - $500K', minScore: 40, description: 'Idea stage, MVP development' },
  { id: 'seed', name: 'Seed', amount: '$500K - $2M', minScore: 60, description: 'Product-market fit, early traction' },
  { id: 'series-a', name: 'Series A', amount: '$2M - $15M', minScore: 75, description: 'Scaling, proven business model' },
  { id: 'series-b', name: 'Series B', amount: '$15M - $50M', minScore: 85, description: 'Rapid expansion, market leadership' },
]

export default function FundingReadinessPage() {
  const [items, setItems] = useState<ChecklistItem[]>(initialChecklist)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories.map(c => c.id))
  const [selectedStage, setSelectedStage] = useState('seed')
  const [showRecommendations, setShowRecommendations] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fundingReadinessChecklist')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          setItems(data)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const toggleItem = (id: string) => {
    const updated = items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    )
    setItems(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('fundingReadinessChecklist', JSON.stringify(updated))
    }
    showToast('Progress updated!', 'success')
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Calculate overall progress
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  const completedWeight = items.filter(item => item.completed).reduce((sum, item) => sum + item.weight, 0)
  const overallProgress = Math.round((completedWeight / totalWeight) * 100)

  // Calculate category progress
  const getCategoryProgress = (categoryId: string) => {
    const categoryItems = items.filter(item => item.category === categoryId)
    const categoryWeight = categoryItems.reduce((sum, item) => sum + item.weight, 0)
    const completedCategoryWeight = categoryItems.filter(item => item.completed).reduce((sum, item) => sum + item.weight, 0)
    return Math.round((completedCategoryWeight / categoryWeight) * 100)
  }

  // Generate recommendations
  const getRecommendations = (): Recommendation[] => {
    const incompleteItems = items.filter(item => !item.completed)
    const recommendations: Recommendation[] = []
    
    // Sort by weight (most important first)
    const sortedItems = [...incompleteItems].sort((a, b) => b.weight - a.weight)
    
    sortedItems.slice(0, 5).forEach(item => {
      recommendations.push({
        id: item.id,
        title: item.text,
        description: item.description,
        priority: item.weight >= 9 ? 'high' : item.weight >= 7 ? 'medium' : 'low',
        category: item.category,
        action: 'Complete this task to improve your readiness score',
        link: item.resources?.[0]?.link
      })
    })
    
    return recommendations
  }

  // Get recommended funding stage
  const getRecommendedStage = () => {
    for (let i = fundingStages.length - 1; i >= 0; i--) {
      if (overallProgress >= fundingStages[i].minScore) {
        return fundingStages[i]
      }
    }
    return fundingStages[0]
  }

  const exportProgress = () => {
    const data = {
      date: new Date().toISOString(),
      overallProgress,
      categoryProgress: categories.map(cat => ({
        category: cat.name,
        progress: getCategoryProgress(cat.id)
      })),
      completedItems: items.filter(i => i.completed).map(i => i.text),
      incompleteItems: items.filter(i => !i.completed).map(i => i.text),
      recommendedStage: getRecommendedStage().name
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `funding-readiness-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Progress exported!', 'success')
  }

  const recommendedStage = getRecommendedStage()
  const recommendations = getRecommendations()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="featured" className="text-sm">Funding Readiness</Badge>
            <Link href="/startup/funding-navigator">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                Funding Navigator <ArrowRight className="h-3 w-3 ml-1 inline" />
              </Badge>
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Funding Readiness Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Evaluate your startup's readiness for different types of funding rounds. Complete the checklist to identify gaps and get personalized recommendations.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{overallProgress}%</div>
            <div className="text-sm text-gray-600">Overall Readiness</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{items.filter(i => i.completed).length}/{items.length}</div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="text-xl font-bold text-green-600 mb-1">{recommendedStage.name}</div>
            <div className="text-sm text-gray-600">Recommended Stage</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xl font-bold text-primary-500 mb-1">{recommendedStage.amount}</div>
            <div className="text-sm text-gray-600">Target Raise</div>
          </Card>
              </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-primary-500" />
              <h2 className="text-xl font-bold">Overall Readiness Score</h2>
            </div>
            <Button variant="outline" size="sm" onClick={exportProgress}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                overallProgress >= 75 ? 'bg-green-500' :
                overallProgress >= 50 ? 'bg-yellow-500' :
                overallProgress >= 25 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Getting Started</span>
            <span>Pre-Seed Ready</span>
            <span>Seed Ready</span>
            <span>Series A Ready</span>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checklist */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Progress Overview */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Category Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map(category => {
                  const Icon = category.icon
                  const progress = getCategoryProgress(category.id)
                  return (
                    <div key={category.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`h-4 w-4 text-${category.color}-500`} />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-${category.color}-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{progress}% complete</div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Checklist by Category */}
            {categories.map(category => {
              const Icon = category.icon
              const categoryItems = items.filter(item => item.category === category.id)
              const isExpanded = expandedCategories.includes(category.id)
              const progress = getCategoryProgress(category.id)
              
              return (
                <Card key={category.id} className="overflow-hidden">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`bg-${category.color}-100 p-2 rounded-lg`}>
                        <Icon className={`h-5 w-5 text-${category.color}-500`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={progress === 100 ? 'new' : 'outline'}>{progress}%</Badge>
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="border-t p-4 space-y-3">
                      {categoryItems.map((item) => (
              <div
                key={item.id}
                          className={`p-4 border rounded-lg transition-all ${
                            item.completed 
                              ? 'border-green-200 bg-green-50' 
                              : 'hover:border-primary-300 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                onClick={() => toggleItem(item.id)}
                              className="mt-0.5 flex-shrink-0"
              >
                {item.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                                <Circle className="h-5 w-5 text-gray-400 hover:text-primary-500" />
                )}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                  {item.text}
                </span>
                                <Badge variant="outline" className="text-xs">Weight: {item.weight}</Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                              {item.resources && item.resources.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {item.resources.map((resource, idx) => (
                                    <Link href={resource.link} key={idx}>
                                      <Badge 
                                        variant="outline" 
                                        className="text-xs cursor-pointer hover:bg-primary-50"
                                      >
                                        {resource.title} →
                                      </Badge>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Funding Stage Matcher */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary-500" />
                Funding Stage Readiness
              </h3>
              <div className="space-y-3">
                {fundingStages.map(stage => {
                  const isReady = overallProgress >= stage.minScore
                  const isRecommended = stage.id === recommendedStage.id
                  
                  return (
                    <div 
                      key={stage.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isRecommended 
                          ? 'border-green-500 bg-green-50' 
                          : isReady 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {isReady ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="font-semibold text-sm">{stage.name}</span>
                        </div>
                        {isRecommended && (
                          <Badge variant="new" className="text-xs">Recommended</Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 ml-6">
                        {stage.amount} • Min {stage.minScore}% readiness
                      </div>
                      <div className="text-xs text-gray-500 ml-6 mt-1">
                        {stage.description}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Top Priorities
              </h3>
              <div className="space-y-3">
                {recommendations.slice(0, 5).map(rec => (
                  <div 
                    key={rec.id}
                    className="p-3 border rounded-lg hover:border-primary-300 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className={`h-4 w-4 mt-0.5 ${
                        rec.priority === 'high' ? 'text-red-500' :
                        rec.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{rec.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{rec.description}</div>
                        {rec.link && (
                          <Link href={rec.link}>
                            <Badge variant="outline" className="text-xs mt-2 cursor-pointer hover:bg-primary-50">
                              Get Started →
                            </Badge>
                          </Link>
                        )}
                      </div>
                    </div>
              </div>
            ))}
          </div>
        </Card>

            {/* Quick Links */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-500" />
                Related Resources
              </h3>
              <div className="space-y-2">
                <Link href="/startup/funding-navigator">
                  <div className="p-3 border rounded-lg hover:border-primary-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium">Funding Navigator</span>
                    </div>
                  </div>
                </Link>
                <Link href="/startup/funding/investors">
                  <div className="p-3 border rounded-lg hover:border-primary-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium">Investor Database</span>
                    </div>
                  </div>
                </Link>
                <Link href="/startup/funding/grants">
                  <div className="p-3 border rounded-lg hover:border-primary-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium">Grant Opportunities</span>
                    </div>
                  </div>
                </Link>
                <Link href="/startup/pitch-deck-builder">
                  <div className="p-3 border rounded-lg hover:border-primary-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium">Pitch Deck Builder</span>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="p-6 bg-gradient-to-br from-primary-50 to-blue-50">
              <h3 className="font-bold mb-3">Ready to Raise?</h3>
              <p className="text-sm text-gray-600 mb-4">
                {overallProgress >= 60 
                  ? "You're making great progress! Start connecting with investors."
                  : "Complete more tasks to improve your readiness score."}
              </p>
              <Link href="/startup/funding/investors">
                <Button className="w-full" disabled={overallProgress < 40}>
                  {overallProgress >= 40 ? 'Find Investors' : 'Complete More Tasks'}
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
