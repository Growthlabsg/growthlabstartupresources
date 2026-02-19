'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  BookOpen, 
  ArrowRight, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Zap,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Eye,
  Download,
  Share2,
  Sparkles,
  BarChart3,
  FileText,
  Lightbulb,
  Shield,
  Rocket,
  Building2,
  Code,
  ShoppingCart,
  Heart,
  Globe,
  Settings,
  Award,
  GraduationCap,
  Briefcase,
  X,
  Grid,
  List as ListIcon,
  Flame,
  Trophy
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import SimpleTabs from '@/components/ui/SimpleTabs'
import Input from '@/components/ui/Input'

type GuideDifficulty = 'beginner' | 'intermediate' | 'advanced'
type GuideStage = 'idea' | 'validation' | 'launch' | 'growth' | 'scale'
type ViewMode = 'grid' | 'list'

interface LearningPath {
  id: string
  title: string
  description: string
  stage: GuideStage
  guides: string[]
  estimatedTime: string
  icon: any
  color: string
}

interface Guide {
  id: string
  title: string
  description: string
  category: string
  difficulty: GuideDifficulty
  stage: GuideStage[]
  readTime: string
  author: string
  date: string
  views: number
  rating: number
  icon: any
  tags: string[]
  featured?: boolean
  interactive?: boolean
  hasTools?: boolean
}

const allGuides: Guide[] = [
  // Idea & Validation Stage
  {
    id: 'idea-validation',
    title: 'Idea Validation Masterclass',
    description: 'Learn how to validate your startup idea before investing time and money. Includes frameworks, tools, and real-world examples.',
    category: 'Validation',
    difficulty: 'beginner',
    stage: ['idea', 'validation'],
    readTime: '25 min',
    author: 'GrowthLab Team',
    date: '2024-01-15',
    views: 1250,
    rating: 4.8,
    icon: Lightbulb,
    tags: ['validation', 'idea', 'market-research', 'customer-interviews'],
    featured: true,
    interactive: true,
    hasTools: true,
  },
  {
    id: 'customer-discovery',
    title: 'Customer Discovery Framework',
    description: 'Master the art of understanding your customers through interviews, surveys, and data analysis.',
    category: 'Validation',
    difficulty: 'intermediate',
    stage: ['validation'],
    readTime: '30 min',
    author: 'GrowthLab Team',
    date: '2024-01-20',
    views: 980,
    rating: 4.7,
    icon: Users,
    tags: ['customers', 'interviews', 'surveys', 'personas'],
    interactive: true,
  },
  {
    id: 'market-research',
    title: 'Comprehensive Market Research Guide',
    description: 'Conduct thorough market research to understand your industry, competitors, and target market.',
    category: 'Market Research',
    difficulty: 'beginner',
    stage: ['idea', 'validation'],
    readTime: '35 min',
    author: 'GrowthLab Team',
    date: '2024-01-10',
    views: 2100,
    rating: 4.9,
    icon: BarChart3,
    tags: ['market-research', 'competitors', 'industry-analysis'],
    featured: true,
    hasTools: true,
  },
  {
    id: 'competitive-analysis',
    title: 'Competitive Analysis Toolkit',
    description: 'Analyze your competitors effectively and identify opportunities for differentiation.',
    category: 'Strategy',
    difficulty: 'intermediate',
    stage: ['validation', 'launch'],
    readTime: '20 min',
    author: 'GrowthLab Team',
    date: '2024-02-01',
    views: 1450,
    rating: 4.6,
    icon: Target,
    tags: ['competitors', 'strategy', 'positioning'],
    hasTools: true,
  },
  
  // Business Planning
  {
    id: 'business-plan',
    title: 'Business Plan Essentials',
    description: 'Create a comprehensive business plan that investors and stakeholders will love.',
    category: 'Business Planning',
    difficulty: 'intermediate',
    stage: ['validation', 'launch'],
    readTime: '40 min',
    author: 'GrowthLab Team',
    date: '2024-01-25',
    views: 3200,
    rating: 4.8,
    icon: FileText,
    tags: ['business-plan', 'strategy', 'planning'],
    featured: true,
    interactive: true,
    hasTools: true,
  },
  {
    id: 'business-model-canvas',
    title: 'Business Model Canvas Guide',
    description: 'Use the Business Model Canvas to design and refine your business model.',
    category: 'Business Planning',
    difficulty: 'beginner',
    stage: ['idea', 'validation'],
    readTime: '15 min',
    author: 'GrowthLab Team',
    date: '2024-02-05',
    views: 1800,
    rating: 4.7,
    icon: Grid,
    tags: ['business-model', 'canvas', 'strategy'],
    interactive: true,
    hasTools: true,
  },
  {
    id: 'swot-analysis',
    title: 'SWOT Analysis Framework',
    description: 'Conduct a comprehensive SWOT analysis to identify strengths, weaknesses, opportunities, and threats.',
    category: 'Strategy',
    difficulty: 'beginner',
    stage: ['validation', 'launch'],
    readTime: '18 min',
    author: 'GrowthLab Team',
    date: '2024-02-10',
    views: 1100,
    rating: 4.5,
    icon: BarChart3,
    tags: ['swot', 'analysis', 'strategy'],
    hasTools: true,
  },
  
  // Funding & Finance
  {
    id: 'funding-strategies',
    title: 'Complete Funding Strategy Guide',
    description: 'Navigate the funding landscape from bootstrapping to Series A and beyond.',
    category: 'Fundraising',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    readTime: '45 min',
    author: 'GrowthLab Team',
    date: '2024-01-30',
    views: 2800,
    rating: 4.9,
    icon: DollarSign,
    tags: ['funding', 'investors', 'venture-capital', 'grants'],
    featured: true,
    interactive: true,
  },
  {
    id: 'pitch-deck',
    title: 'Pitch Deck Creation Guide',
    description: 'Create a compelling pitch deck that gets investors excited about your startup.',
    category: 'Fundraising',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    readTime: '30 min',
    author: 'GrowthLab Team',
    date: '2024-02-15',
    views: 3500,
    rating: 4.8,
    icon: Rocket,
    tags: ['pitch-deck', 'presentation', 'investors'],
    featured: true,
    hasTools: true,
  },
  {
    id: 'term-sheet',
    title: 'Understanding Term Sheets',
    description: 'Decode term sheets and understand what investors are really offering.',
    category: 'Fundraising',
    difficulty: 'advanced',
    stage: ['growth'],
    readTime: '25 min',
    author: 'GrowthLab Team',
    date: '2024-02-20',
    views: 1200,
    rating: 4.7,
    icon: FileText,
    tags: ['term-sheet', 'legal', 'investors'],
  },
  {
    id: 'valuation',
    title: 'Startup Valuation Methods',
    description: 'Learn how to value your startup using multiple proven methodologies.',
    category: 'Finance',
    difficulty: 'advanced',
    stage: ['growth', 'scale'],
    readTime: '35 min',
    author: 'GrowthLab Team',
    date: '2024-02-25',
    views: 1900,
    rating: 4.6,
    icon: DollarSign,
    tags: ['valuation', 'finance', 'investors'],
    hasTools: true,
  },
  {
    id: 'financial-projections',
    title: 'Financial Projections Guide',
    description: 'Build accurate financial projections that investors trust and you can execute.',
    category: 'Finance',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    readTime: '40 min',
    author: 'GrowthLab Team',
    date: '2024-03-01',
    views: 2400,
    rating: 4.8,
    icon: BarChart3,
    tags: ['finance', 'projections', 'modeling'],
    featured: true,
    hasTools: true,
  },
  {
    id: 'burn-rate',
    title: 'Managing Burn Rate',
    description: 'Understand and optimize your burn rate to extend runway and improve efficiency.',
    category: 'Finance',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    readTime: '20 min',
    author: 'GrowthLab Team',
    date: '2024-03-05',
    views: 1600,
    rating: 4.7,
    icon: TrendingUp,
    tags: ['burn-rate', 'cash-flow', 'runway'],
    hasTools: true,
  },
  
  // Legal & Compliance
  {
    id: 'legal-structure',
    title: 'Choosing Your Legal Structure',
    description: 'Select the right legal structure (LLC, C-Corp, etc.) for your startup.',
    category: 'Legal',
    difficulty: 'beginner',
    stage: ['validation', 'launch'],
    readTime: '22 min',
    author: 'GrowthLab Team',
    date: '2024-03-10',
    views: 1400,
    rating: 4.6,
    icon: Shield,
    tags: ['legal', 'incorporation', 'structure'],
  },
  {
    id: 'ip-protection',
    title: 'Intellectual Property Protection',
    description: 'Protect your ideas, trademarks, and innovations with proper IP strategy.',
    category: 'Legal',
    difficulty: 'intermediate',
    stage: ['validation', 'launch'],
    readTime: '28 min',
    author: 'GrowthLab Team',
    date: '2024-03-15',
    views: 1100,
    rating: 4.5,
    icon: Shield,
    tags: ['ip', 'patents', 'trademarks', 'legal'],
  },
  {
    id: 'employment-law',
    title: 'Employment Law Basics',
    description: 'Navigate employment law, contracts, and hiring best practices.',
    category: 'Legal',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    readTime: '25 min',
    author: 'GrowthLab Team',
    date: '2024-03-20',
    views: 900,
    rating: 4.4,
    icon: Users,
    tags: ['employment', 'hiring', 'legal'],
  },
  
  // Marketing & Growth
  {
    id: 'marketing-strategy',
    title: 'Digital Marketing Strategy',
    description: 'Build a comprehensive digital marketing strategy that drives growth.',
    category: 'Marketing',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    readTime: '35 min',
    author: 'GrowthLab Team',
    date: '2024-03-25',
    views: 2700,
    rating: 4.8,
    icon: TrendingUp,
    tags: ['marketing', 'growth', 'digital'],
    featured: true,
    hasTools: true,
  },
  {
    id: 'content-marketing',
    title: 'Content Marketing Playbook',
    description: 'Create content that attracts, engages, and converts your target audience.',
    category: 'Marketing',
    difficulty: 'intermediate',
    stage: ['growth'],
    readTime: '30 min',
    author: 'GrowthLab Team',
    date: '2024-04-01',
    views: 2000,
    rating: 4.7,
    icon: FileText,
    tags: ['content', 'marketing', 'seo'],
  },
  {
    id: 'growth-hacking',
    title: 'Growth Hacking Techniques',
    description: 'Learn proven growth hacking strategies to scale your startup quickly.',
    category: 'Growth',
    difficulty: 'advanced',
    stage: ['growth', 'scale'],
    readTime: '38 min',
    author: 'GrowthLab Team',
    date: '2024-04-05',
    views: 3200,
    rating: 4.9,
    icon: Zap,
    tags: ['growth', 'hacking', 'scaling'],
    featured: true,
  },
  {
    id: 'customer-acquisition',
    title: 'Customer Acquisition Strategies',
    description: 'Master multiple channels for acquiring customers cost-effectively.',
    category: 'Marketing',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    readTime: '32 min',
    author: 'GrowthLab Team',
    date: '2024-04-10',
    views: 1800,
    rating: 4.6,
    icon: Users,
    tags: ['acquisition', 'customers', 'cac'],
    hasTools: true,
  },
  
  // Product & Development
  {
    id: 'product-development',
    title: 'Product Development Lifecycle',
    description: 'Navigate the complete product development process from concept to launch.',
    category: 'Product',
    difficulty: 'intermediate',
    stage: ['validation', 'launch'],
    readTime: '40 min',
    author: 'GrowthLab Team',
    date: '2024-04-15',
    views: 2200,
    rating: 4.7,
    icon: Code,
    tags: ['product', 'development', 'mvp'],
  },
  {
    id: 'mvp-guide',
    title: 'Building Your MVP',
    description: 'Create a Minimum Viable Product that validates your idea without overbuilding.',
    category: 'Product',
    difficulty: 'beginner',
    stage: ['validation'],
    readTime: '25 min',
    author: 'GrowthLab Team',
    date: '2024-04-20',
    views: 2900,
    rating: 4.8,
    icon: Rocket,
    tags: ['mvp', 'product', 'validation'],
    featured: true,
  },
  {
    id: 'tech-stack',
    title: 'Choosing Your Tech Stack',
    description: 'Select the right technologies for your startup based on your needs and budget.',
    category: 'Technology',
    difficulty: 'intermediate',
    stage: ['validation', 'launch'],
    readTime: '30 min',
    author: 'GrowthLab Team',
    date: '2024-04-25',
    views: 1600,
    rating: 4.6,
    icon: Code,
    tags: ['technology', 'stack', 'development'],
    hasTools: true,
  },
  
  // Sales & Operations
  {
    id: 'sales-process',
    title: 'Building Your Sales Process',
    description: 'Design and implement a scalable sales process that converts leads to customers.',
    category: 'Sales',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    readTime: '35 min',
    author: 'GrowthLab Team',
    date: '2024-05-01',
    views: 2100,
    rating: 4.7,
    icon: Target,
    tags: ['sales', 'process', 'revenue'],
    hasTools: true,
  },
  {
    id: 'customer-success',
    title: 'Customer Success Framework',
    description: 'Build a customer success program that reduces churn and increases lifetime value.',
    category: 'Operations',
    difficulty: 'intermediate',
    stage: ['growth'],
    readTime: '28 min',
    author: 'GrowthLab Team',
    date: '2024-05-05',
    views: 1300,
    rating: 4.6,
    icon: CheckCircle,
    tags: ['customers', 'success', 'retention'],
  },
  {
    id: 'operations',
    title: 'Operations Excellence',
    description: 'Build efficient operations that scale with your startup.',
    category: 'Operations',
    difficulty: 'advanced',
    stage: ['growth', 'scale'],
    readTime: '42 min',
    author: 'GrowthLab Team',
    date: '2024-05-10',
    views: 1000,
    rating: 4.5,
    icon: Settings,
    tags: ['operations', 'efficiency', 'scaling'],
  },
  
  // Team & Leadership
  {
    id: 'hiring',
    title: 'Hiring Your First Team',
    description: 'Build a world-class team from your first hire to scaling the organization.',
    category: 'Team',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    readTime: '32 min',
    author: 'GrowthLab Team',
    date: '2024-05-15',
    views: 2400,
    rating: 4.8,
    icon: Users,
    tags: ['hiring', 'team', 'recruitment'],
    featured: true,
  },
  {
    id: 'leadership',
    title: 'Startup Leadership Guide',
    description: 'Develop leadership skills essential for scaling your startup.',
    category: 'Leadership',
    difficulty: 'advanced',
    stage: ['growth', 'scale'],
    readTime: '38 min',
    author: 'GrowthLab Team',
    date: '2024-05-20',
    views: 1500,
    rating: 4.7,
    icon: Award,
    tags: ['leadership', 'management', 'culture'],
  },
  {
    id: 'remote-team',
    title: 'Managing Remote Teams',
    description: 'Build and manage high-performing remote teams effectively.',
    category: 'Team',
    difficulty: 'intermediate',
    stage: ['growth'],
    readTime: '25 min',
    author: 'GrowthLab Team',
    date: '2024-05-25',
    views: 1200,
    rating: 4.6,
    icon: Globe,
    tags: ['remote', 'team', 'management'],
  },
  
  // Scaling & Growth
  {
    id: 'scaling',
    title: 'Scaling Your Startup',
    description: 'Navigate the challenges of scaling from startup to scale-up.',
    category: 'Growth',
    difficulty: 'advanced',
    stage: ['scale'],
    readTime: '45 min',
    author: 'GrowthLab Team',
    date: '2024-06-01',
    views: 1800,
    rating: 4.8,
    icon: TrendingUp,
    tags: ['scaling', 'growth', 'scale-up'],
    featured: true,
  },
  {
    id: 'international',
    title: 'International Expansion',
    description: 'Expand your startup to new markets and countries successfully.',
    category: 'Growth',
    difficulty: 'advanced',
    stage: ['scale'],
    readTime: '40 min',
    author: 'GrowthLab Team',
    date: '2024-06-05',
    views: 1100,
    rating: 4.6,
    icon: Globe,
    tags: ['international', 'expansion', 'global'],
  },
  
  // Industry-Specific
  {
    id: 'saas-guide',
    title: 'SaaS Startup Guide',
    description: 'Everything you need to know about building and scaling a SaaS business.',
    category: 'Industry',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    readTime: '50 min',
    author: 'GrowthLab Team',
    date: '2024-06-10',
    views: 2600,
    rating: 4.9,
    icon: Code,
    tags: ['saas', 'software', 'subscription'],
    featured: true,
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Startup Guide',
    description: 'Launch and grow a successful e-commerce business from scratch.',
    category: 'Industry',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    readTime: '38 min',
    author: 'GrowthLab Team',
    date: '2024-06-15',
    views: 1900,
    rating: 4.7,
    icon: ShoppingCart,
    tags: ['ecommerce', 'retail', 'online'],
  },
  {
    id: 'fintech',
    title: 'FinTech Startup Guide',
    description: 'Navigate the unique challenges of building a financial technology startup.',
    category: 'Industry',
    difficulty: 'advanced',
    stage: ['launch', 'growth'],
    readTime: '42 min',
    author: 'GrowthLab Team',
    date: '2024-06-20',
    views: 1400,
    rating: 4.6,
    icon: DollarSign,
    tags: ['fintech', 'finance', 'regulations'],
  },
  {
    id: 'healthtech',
    title: 'HealthTech Startup Guide',
    description: 'Build a healthcare technology startup while navigating regulations and compliance.',
    category: 'Industry',
    difficulty: 'advanced',
    stage: ['launch', 'growth'],
    readTime: '45 min',
    author: 'GrowthLab Team',
    date: '2024-06-25',
    views: 1000,
    rating: 4.5,
    icon: Heart,
    tags: ['healthtech', 'healthcare', 'compliance'],
  },
]

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedStage, setSelectedStage] = useState<string>('all')
  const [bookmarkedGuides, setBookmarkedGuides] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [completedGuides, setCompletedGuides] = useState<Set<string>>(new Set())
  const [readingStreak, setReadingStreak] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [totalReadingTime, setTotalReadingTime] = useState(0)
  const [activeMainTab, setActiveMainTab] = useState('browse')
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [guideNotes, setGuideNotes] = useState<Record<string, string>>({})
  const [guideHighlights, setGuideHighlights] = useState<Record<string, string[]>>({})

  const learningPaths: LearningPath[] = [
    {
      id: 'idea-to-validation',
      title: 'From Idea to Validation',
      description: 'Validate your startup idea and understand your market before building',
      stage: 'idea',
      guides: ['idea-validation', 'customer-discovery', 'market-research', 'competitive-analysis'],
      estimatedTime: '2 hours',
      icon: Lightbulb,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'business-planning',
      title: 'Business Planning Mastery',
      description: 'Create comprehensive business plans and models',
      stage: 'validation',
      guides: ['business-plan', 'business-model-canvas', 'swot-analysis', 'financial-projections'],
      estimatedTime: '3 hours',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'funding-journey',
      title: 'Complete Funding Journey',
      description: 'Navigate from bootstrapping to Series A and beyond',
      stage: 'launch',
      guides: ['funding-strategies', 'pitch-deck', 'term-sheet', 'valuation', 'burn-rate'],
      estimatedTime: '4 hours',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'launch-prep',
      title: 'Launch Preparation',
      description: 'Everything you need to launch your startup successfully',
      stage: 'launch',
      guides: ['legal-structure', 'mvp-guide', 'marketing-strategy', 'sales-process', 'hiring'],
      estimatedTime: '5 hours',
      icon: Rocket,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'growth-scaling',
      title: 'Growth & Scaling',
      description: 'Scale your startup from launch to market leader',
      stage: 'growth',
      guides: ['growth-hacking', 'customer-acquisition', 'scaling', 'operations', 'leadership'],
      estimatedTime: '4 hours',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'saas-mastery',
      title: 'SaaS Startup Mastery',
      description: 'Complete guide to building and scaling a SaaS business',
      stage: 'launch',
      guides: ['saas-guide', 'product-development', 'customer-success', 'tech-stack', 'financial-projections'],
      estimatedTime: '6 hours',
      icon: Code,
      color: 'from-teal-500 to-cyan-500',
    },
  ]

  // Load saved data from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const savedBookmarks = localStorage.getItem('guideBookmarks')
      if (savedBookmarks) {
        setBookmarkedGuides(new Set(JSON.parse(savedBookmarks)))
      }
      
      const savedRecent = localStorage.getItem('recentlyViewedGuides')
      if (savedRecent) {
        setRecentlyViewed(JSON.parse(savedRecent))
      }
      
      const savedCompleted = localStorage.getItem('completedGuides')
      if (savedCompleted) {
        setCompletedGuides(new Set(JSON.parse(savedCompleted)))
      }
      
      const streak = localStorage.getItem('readingStreak')
      if (streak) {
        setReadingStreak(parseInt(streak))
      }
      
      const savedAchievements = localStorage.getItem('achievements')
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements))
      }
      
      const savedNotes = localStorage.getItem('guideNotes')
      if (savedNotes) {
        setGuideNotes(JSON.parse(savedNotes))
      }
      
      const savedHighlights = localStorage.getItem('guideHighlights')
      if (savedHighlights) {
        setGuideHighlights(JSON.parse(savedHighlights))
      }
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
  }, [])

  const saveNotes = (guideId: string, notes: string) => {
    const updated = { ...guideNotes, [guideId]: notes }
    setGuideNotes(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('guideNotes', JSON.stringify(updated))
    }
  }

  const addHighlight = (guideId: string, highlight: string) => {
    const updated = { ...guideHighlights, [guideId]: [...(guideHighlights[guideId] || []), highlight] }
    setGuideHighlights(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('guideHighlights', JSON.stringify(updated))
    }
  }

  const removeHighlight = (guideId: string, index: number) => {
    const updated = { ...guideHighlights, [guideId]: guideHighlights[guideId]?.filter((_, i) => i !== index) || [] }
    setGuideHighlights(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('guideHighlights', JSON.stringify(updated))
    }
  }

  const getPathProgress = (path: LearningPath) => {
    const completed = path.guides.filter(id => completedGuides.has(id)).length
    return Math.round((completed / path.guides.length) * 100)
  }

  const getRelatedGuides = (guideId: string, limit: number = 3): Guide[] => {
    const guide = allGuides.find(g => g.id === guideId)
    if (!guide) return []
    
    return allGuides
      .filter(g => 
        g.id !== guideId &&
        (g.category === guide.category || 
         g.stage.some(s => guide.stage.includes(s)) ||
         g.tags.some(tag => guide.tags.includes(tag)))
      )
      .sort((a, b) => {
        // Prioritize by category match, then stage match, then rating
        const aCategoryMatch = a.category === guide.category ? 3 : 0
        const aStageMatch = a.stage.some(s => guide.stage.includes(s)) ? 2 : 0
        const aTagMatch = a.tags.filter(t => guide.tags.includes(t)).length
        const aScore = aCategoryMatch + aStageMatch + aTagMatch + a.rating
        
        const bCategoryMatch = b.category === guide.category ? 3 : 0
        const bStageMatch = b.stage.some(s => guide.stage.includes(s)) ? 2 : 0
        const bTagMatch = b.tags.filter(t => guide.tags.includes(t)).length
        const bScore = bCategoryMatch + bStageMatch + bTagMatch + b.rating
        
        return bScore - aScore
      })
      .slice(0, limit)
  }

  const exportGuideData = () => {
    const data = {
      bookmarks: Array.from(bookmarkedGuides),
      completed: Array.from(completedGuides),
      notes: guideNotes,
      highlights: guideHighlights,
      recentlyViewed,
      readingStreak,
      achievements,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `guides-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allGuides.map(g => g.category))
    return Array.from(cats).sort()
  }, [])

  // Filter guides
  const filteredGuides = useMemo(() => {
    return allGuides.filter(guide => {
      const matchesSearch = searchQuery === '' || 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty
      const matchesStage = selectedStage === 'all' || guide.stage.includes(selectedStage as GuideStage)
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesStage
    })
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedStage])

  // Get featured guides
  const featuredGuides = useMemo(() => {
    return allGuides.filter(g => g.featured).slice(0, 6)
  }, [])

  // Get recently viewed guides
  const recentGuides = useMemo(() => {
    return recentlyViewed
      .map(id => allGuides.find(g => g.id === id))
      .filter(Boolean) as Guide[]
  }, [recentlyViewed])

  // Get recommended guides (based on bookmarks and views)
  const recommendedGuides = useMemo(() => {
    return allGuides
      .filter(g => !recentlyViewed.includes(g.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }, [recentlyViewed])

  const toggleBookmark = (guideId: string) => {
    const newBookmarks = new Set(bookmarkedGuides)
    if (newBookmarks.has(guideId)) {
      newBookmarks.delete(guideId)
      showToast('Removed from bookmarks', 'info')
    } else {
      newBookmarks.add(guideId)
      showToast('Added to bookmarks', 'success')
    }
    setBookmarkedGuides(newBookmarks)
    if (typeof window !== 'undefined') {
      localStorage.setItem('guideBookmarks', JSON.stringify(Array.from(newBookmarks)))
    }
  }

  const handleGuideClick = (guideId: string) => {
    if (typeof window === 'undefined') return
    
    const newRecent = [guideId, ...recentlyViewed.filter(id => id !== guideId)].slice(0, 10)
    setRecentlyViewed(newRecent)
    localStorage.setItem('recentlyViewedGuides', JSON.stringify(newRecent))
  }

  const handleShare = (guide: Guide) => {
    if (typeof window === 'undefined') return
    
    const url = `${window.location.origin}/startup/guides/${guide.id}`
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.description,
        url,
      }).catch(() => {})
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      showToast('Link copied to clipboard!', 'success')
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedDifficulty('all')
    setSelectedStage('all')
  }

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedDifficulty !== 'all',
    selectedStage !== 'all',
    searchQuery !== '',
  ].filter(Boolean).length

  const mainTabs = [
    { id: 'browse', label: 'Browse Guides', icon: BookOpen },
    { id: 'paths', label: 'Learning Paths', icon: Target },
    { id: 'progress', label: 'My Progress', icon: BarChart3 },
    { id: 'notes', label: 'My Notes', icon: FileText },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
              Startup Guides Hub
            </span>
          </h1>
          <p className="text-lg text-gray-600">
                {allGuides.length} comprehensive guides for every stage of your startup journey
          </p>
            </div>
          </div>

          {/* Main Tabs */}
          <div className="mb-6">
            <SimpleTabs tabs={mainTabs} activeTab={activeMainTab} onTabChange={setActiveMainTab} />
          </div>
        </div>

        {/* Browse Guides Tab */}
        {activeMainTab === 'browse' && (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div className="flex-1">
                  <p className="text-lg text-gray-600">
                    Browse and discover guides tailored to your startup stage
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="shrink-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="shrink-0"
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search guides by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
              >
                <option value="all">All Stages</option>
                <option value="idea">Idea</option>
                <option value="validation">Validation</option>
                <option value="launch">Launch</option>
                <option value="growth">Growth</option>
                <option value="scale">Scale</option>
              </select>

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear All ({activeFiltersCount})
                </Button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredGuides.length} of {allGuides.length} guides
            </div>
          </div>
        </div>

        {/* Featured Guides */}
        {searchQuery === '' && selectedCategory === 'all' && selectedDifficulty === 'all' && selectedStage === 'all' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary-500" />
                Featured Guides
              </h2>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGuides.map((guide) => {
                const Icon = guide.icon
                return (
                  <Card key={guide.id} className="flex flex-col hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary-500/10 p-3 rounded-lg text-primary-500">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(guide.id)
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {bookmarkedGuides.has(guide.id) ? (
                            <BookmarkCheck className="h-5 w-5 text-primary-500" />
                          ) : (
                            <Bookmark className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <Badge variant={guide.difficulty}>
                          {guide.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-grow">{guide.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {guide.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {guide.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {guide.rating}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        href={`/startup/guides/${guide.id}`}
                        onClick={() => handleGuideClick(guide.id)}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          Read Guide
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(guide)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                </div>
                    {guide.interactive && (
                      <Badge variant="featured" className="mt-2 w-fit">
                        <Zap className="h-3 w-3 mr-1" />
                        Interactive
                      </Badge>
                    )}
                    {guide.hasTools && (
                      <Badge variant="new" className="mt-2 w-fit">
                        <Settings className="h-3 w-3 mr-1" />
                        Includes Tools
                      </Badge>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentGuides.length > 0 && searchQuery === '' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary-500" />
              Recently Viewed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentGuides.slice(0, 4).map((guide) => {
                const Icon = guide.icon
                return (
                  <Link
                    key={guide.id}
                    href={`/startup/guides/${guide.id}`}
                    onClick={() => handleGuideClick(guide.id)}
                  >
                    <Card className="hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary-500/10 p-2 rounded-lg">
                          <Icon className="h-4 w-4 text-primary-500" />
                        </div>
                        <h3 className="font-semibold text-sm flex-1 line-clamp-1">{guide.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {guide.readTime}
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* All Guides */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedStage !== 'all'
                ? 'Search Results'
                : 'All Guides'}
            </h2>
            <div className="text-sm text-gray-600">
              {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''}
            </div>
          </div>

          {filteredGuides.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No guides found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {filteredGuides.map((guide) => {
                const Icon = guide.icon
                const isBookmarked = bookmarkedGuides.has(guide.id)
                const isCompleted = completedGuides.has(guide.id)
                
                if (viewMode === 'list') {
                  return (
                    <Card key={guide.id} className="hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-500/10 p-3 rounded-lg text-primary-500 flex-shrink-0">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold">{guide.title}</h3>
                                {isCompleted && (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                )}
                                {guide.interactive && (
                                  <Badge variant="featured" className="text-xs">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Interactive
                                  </Badge>
                                )}
                                {guide.hasTools && (
                                  <Badge variant="new" className="text-xs">
                                    <Settings className="h-3 w-3 mr-1" />
                                    Tools
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => toggleBookmark(guide.id)}
                                className="p-2 hover:bg-gray-100 rounded"
                              >
                                {isBookmarked ? (
                                  <BookmarkCheck className="h-5 w-5 text-primary-500" />
                                ) : (
                                  <Bookmark className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                              <button
                                onClick={() => handleShare(guide)}
                                className="p-2 hover:bg-gray-100 rounded"
                              >
                                <Share2 className="h-5 w-5 text-gray-400" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span className="px-2 py-1 bg-gray-100 rounded">{guide.category}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {guide.readTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {guide.views.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {guide.rating}
                            </div>
                            <Badge variant={guide.difficulty}>{guide.difficulty}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Link 
                              href={`/startup/guides/${guide.id}`}
                              onClick={() => handleGuideClick(guide.id)}
                              className="flex-1"
                            >
                              <Button variant="outline" size="sm" className="w-full">
                                Read Guide
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                }

                return (
                  <Card key={guide.id} className="flex flex-col hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary-500/10 p-3 rounded-lg text-primary-500">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleBookmark(guide.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="h-5 w-5 text-primary-500" />
                          ) : (
                            <Bookmark className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <Badge variant={guide.difficulty}>
                          {guide.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-grow">{guide.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {guide.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {guide.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {guide.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {guide.rating}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        href={`/startup/guides/${guide.id}`}
                        onClick={() => handleGuideClick(guide.id)}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          Read Guide
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(guide)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Related Guides */}
                    {getRelatedGuides(guide.id, 2).length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-xs font-semibold text-gray-600 mb-2">Related Guides:</div>
                        <div className="space-y-1">
                          {getRelatedGuides(guide.id, 2).map(related => (
                            <Link 
                              key={related.id}
                              href={`/startup/guides/${related.id}`}
                              onClick={() => handleGuideClick(related.id)}
                              className="block text-xs text-primary-600 hover:underline"
                            >
                              → {related.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      {guide.interactive && (
                        <Badge variant="featured" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Interactive
                        </Badge>
                      )}
                      {guide.hasTools && (
                        <Badge variant="new" className="text-xs">
                          <Settings className="h-3 w-3 mr-1" />
                          Includes Tools
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="beginner" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Recommended Guides */}
        {searchQuery === '' && selectedCategory === 'all' && selectedDifficulty === 'all' && selectedStage === 'all' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary-500" />
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedGuides.map((guide) => {
                const Icon = guide.icon
                return (
                  <Card key={guide.id} className="flex flex-col hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary-500/10 p-3 rounded-lg text-primary-500">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant={guide.difficulty}>
                        {guide.difficulty}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow">{guide.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {guide.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {guide.readTime}
                      </div>
                    </div>
                    <Link 
                      href={`/startup/guides/${guide.id}`}
                      onClick={() => handleGuideClick(guide.id)}
                    >
                <Button variant="outline" size="sm" className="w-full">
                  Read Guide
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <Card className="mt-8 bg-gradient-to-br from-primary-500/10 to-primary-500/5">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">{allGuides.length}</div>
              <div className="text-sm text-gray-600">Total Guides</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">{bookmarkedGuides.size}</div>
              <div className="text-sm text-gray-600">Bookmarked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">{completedGuides.size}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">{recentlyViewed.length}</div>
              <div className="text-sm text-gray-600">Recently Viewed</div>
            </div>
            {readingStreak > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1 flex items-center justify-center gap-1">
                  <Flame className="h-6 w-6" />
                  {readingStreak}
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            )}
            {achievements.length > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-1 flex items-center justify-center gap-1">
                  <Award className="h-6 w-6" />
                  {achievements.length}
                </div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
            )}
          </div>
        </Card>

            {/* Achievements Display */}
            {achievements.length > 0 && (
              <Card className="mt-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Your Achievements
                </h3>
                <div className="flex flex-wrap gap-3">
                  {achievements.map((achievement, idx) => (
                    <Badge key={idx} variant="featured" className="text-sm py-2 px-4">
                      <Trophy className="h-4 w-4 mr-2" />
                      {achievement === '3-day-streak' && '3 Day Reading Streak'}
                      {achievement === '7-day-streak' && '7 Day Reading Streak'}
                      {achievement === '30-day-streak' && '30 Day Reading Streak'}
                    </Badge>
          ))}
        </div>
              </Card>
            )}
          </>
        )}
      </div>
    </main>
  )
}
