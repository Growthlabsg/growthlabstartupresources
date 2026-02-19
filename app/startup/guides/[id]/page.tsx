'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  User, 
  Star,
  Eye,
  Bookmark,
  BookmarkCheck,
  Share2,
  CheckCircle,
  Download,
  Zap,
  Settings,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Lightbulb,
  Shield,
  Rocket,
  Building2,
  Code,
  ShoppingCart,
  Heart,
  Globe,
  Award,
  BarChart3,
  Grid,
  Printer,
  Trophy,
  Flame,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { showToast } from '@/components/ui/ToastContainer'

// Import the guides data structure
const allGuides: Record<string, any> = {
  'idea-validation': {
    id: 'idea-validation',
    title: 'Idea Validation Masterclass',
    content: `
# Idea Validation Masterclass

## Introduction

Validating your startup idea is the most critical step before investing significant time and money. This comprehensive guide will walk you through proven frameworks and methodologies to validate your idea effectively.

## Why Idea Validation Matters

Many startups fail not because they execute poorly, but because they build something nobody wants. Idea validation helps you:
- Save time and resources
- Understand your market before building
- Identify potential customers early
- Refine your value proposition
- Reduce risk of failure

## The Validation Framework

### Step 1: Problem Validation
Before validating your solution, validate that the problem exists:
- Interview potential customers
- Research market pain points
- Analyze competitor solutions
- Identify problem frequency and intensity

### Step 2: Solution Validation
Once you've confirmed the problem:
- Create a simple MVP or prototype
- Test with real users
- Gather feedback and iterate
- Measure engagement and usage

### Step 3: Market Validation
Ensure there's a viable market:
- Calculate Total Addressable Market (TAM)
- Identify your target segment
- Analyze market trends
- Assess competition

## Tools and Resources

- Customer Interview Templates
- Problem-Solution Fit Canvas
- MVP Testing Framework
- Market Research Tools

## Action Items

1. Conduct 10 customer interviews
2. Create a problem statement
3. Build a simple prototype
4. Test with 5-10 users
5. Analyze feedback and iterate

## Next Steps

After validation, move on to:
- Business Model Canvas
- Customer Discovery
- MVP Development
    `,
    author: 'GrowthLab Team',
    readTime: '25 min',
    date: '2024-01-15',
    views: 1250,
    rating: 4.8,
    category: 'Validation',
    difficulty: 'beginner',
    stage: ['idea', 'validation'],
    tags: ['validation', 'idea', 'market-research', 'customer-interviews'],
    featured: true,
    interactive: true,
    hasTools: true,
    icon: Lightbulb,
  },
  'customer-discovery': {
    id: 'customer-discovery',
    title: 'Customer Discovery Framework',
    content: `
# Customer Discovery Framework

## Understanding Your Customers

Customer discovery is the foundation of building a successful startup. This guide provides a comprehensive framework for understanding your customers deeply.

## The Discovery Process

### Phase 1: Hypotheses Formation
- Define your customer segments
- Create customer personas
- Formulate hypotheses about customer needs
- Identify assumptions to test

### Phase 2: Customer Interviews
- Prepare interview questions
- Conduct 20-30 interviews
- Document insights
- Identify patterns

### Phase 3: Analysis and Synthesis
- Analyze interview data
- Identify common themes
- Validate or invalidate hypotheses
- Refine customer personas

## Key Techniques

- Jobs-to-be-Done Framework
- Customer Journey Mapping
- Empathy Mapping
- Value Proposition Design

## Common Mistakes to Avoid

- Leading questions in interviews
- Confirmation bias
- Insufficient sample size
- Not following up on insights
    `,
    author: 'GrowthLab Team',
    readTime: '30 min',
    date: '2024-01-20',
    views: 980,
    rating: 4.7,
    category: 'Validation',
    difficulty: 'intermediate',
    stage: ['validation'],
    tags: ['customers', 'interviews', 'surveys', 'personas'],
    interactive: true,
    icon: Users,
  },
  'market-research': {
    id: 'market-research',
    title: 'Comprehensive Market Research Guide',
    content: `
# Comprehensive Market Research Guide

## Introduction to Market Research

Market research is essential for understanding your industry, competitors, and target market. This guide covers everything you need to conduct thorough market research.

## Research Methods

### Primary Research
- Customer surveys
- Interviews
- Focus groups
- Field observations

### Secondary Research
- Industry reports
- Government data
- Competitor analysis
- Academic research

## Market Analysis Framework

1. Industry Overview
2. Market Size and Growth
3. Competitive Landscape
4. Customer Analysis
5. Trends and Opportunities

## Tools and Resources

- Market research databases
- Survey platforms
- Analytics tools
- Industry reports
    `,
    author: 'GrowthLab Team',
    readTime: '35 min',
    date: '2024-01-10',
    views: 2100,
    rating: 4.9,
    category: 'Market Research',
    difficulty: 'beginner',
    stage: ['idea', 'validation'],
    tags: ['market-research', 'competitors', 'industry-analysis'],
    featured: true,
    hasTools: true,
    icon: BarChart3,
  },
  'business-plan': {
    id: 'business-plan',
    title: 'Business Plan Essentials',
    content: `
# Business Plan Essentials

## Creating a Winning Business Plan

A well-crafted business plan is crucial for securing funding, attracting partners, and guiding your startup's growth.

## Key Sections

### Executive Summary
- Company overview
- Mission and vision
- Key highlights
- Financial summary

### Market Analysis
- Industry overview
- Target market
- Competitive analysis
- Market opportunity

### Organization and Management
- Company structure
- Team overview
- Advisory board
- Organizational chart

### Products and Services
- Product description
- Technology
- Competitive advantages
- Roadmap

### Marketing and Sales
- Marketing strategy
- Sales process
- Customer acquisition
- Growth plan

### Financial Projections
- Revenue model
- Financial forecasts
- Funding requirements
- Use of funds

## Best Practices

- Keep it concise (20-30 pages)
- Use data and evidence
- Be realistic with projections
- Update regularly
    `,
    author: 'GrowthLab Team',
    readTime: '40 min',
    date: '2024-01-25',
    views: 3200,
    rating: 4.8,
    category: 'Business Planning',
    difficulty: 'intermediate',
    stage: ['validation', 'launch'],
    tags: ['business-plan', 'strategy', 'planning'],
    featured: true,
    interactive: true,
    hasTools: true,
    icon: FileText,
  },
  'funding-strategies': {
    id: 'funding-strategies',
    title: 'Complete Funding Strategy Guide',
    content: `
# Complete Funding Strategy Guide

## Navigating the Funding Landscape

This comprehensive guide covers all aspects of startup funding, from bootstrapping to Series A and beyond.

## Funding Options

### Bootstrapping
- Self-funding
- Revenue-based financing
- Customer pre-sales
- Pros and cons

### Angel Investors
- Finding angels
- What they look for
- Typical terms
- How to approach

### Venture Capital
- VC landscape
- When to raise VC
- Term sheet basics
- Due diligence

### Alternative Funding
- Grants
- Crowdfunding
- Debt financing
- Revenue-based financing

## Fundraising Process

1. Preparation
2. Investor outreach
3. Pitch meetings
4. Due diligence
5. Closing

## Key Metrics Investors Care About

- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate
- Growth rate
    `,
    author: 'GrowthLab Team',
    readTime: '45 min',
    date: '2024-01-30',
    views: 2800,
    rating: 4.9,
    category: 'Fundraising',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    tags: ['funding', 'investors', 'venture-capital', 'grants'],
    featured: true,
    interactive: true,
    icon: DollarSign,
  },
  'pitch-deck': {
    id: 'pitch-deck',
    title: 'Pitch Deck Creation Guide',
    content: `
# Pitch Deck Creation Guide

## Creating a Compelling Pitch Deck

Your pitch deck is often the first impression investors get of your startup. Make it count.

## Essential Slides

1. Problem
2. Solution
3. Market Opportunity
4. Business Model
5. Traction
6. Competition
7. Team
8. Financials
9. Ask

## Design Principles

- Keep it simple
- Use visuals
- Tell a story
- Focus on key metrics
- Practice delivery

## Common Mistakes

- Too much text
- Unclear value proposition
- Weak financial projections
- Missing team slide
- No clear ask
    `,
    author: 'GrowthLab Team',
    readTime: '30 min',
    date: '2024-02-15',
    views: 3500,
    rating: 4.8,
    category: 'Fundraising',
    difficulty: 'intermediate',
    stage: ['launch', 'growth'],
    tags: ['pitch-deck', 'presentation', 'investors'],
    featured: true,
    hasTools: true,
    icon: Rocket,
  },
}

// Default guide content for guides not in the detailed list
const getDefaultGuideContent = (id: string, title: string) => `
# ${title}

## Introduction

This comprehensive guide provides detailed information and actionable insights to help you succeed.

## Key Topics Covered

- Essential concepts and frameworks
- Step-by-step processes
- Best practices and strategies
- Common pitfalls to avoid
- Tools and resources

## What You'll Learn

- Core principles and methodologies
- Practical implementation strategies
- Real-world examples and case studies
- Actionable next steps

## Getting Started

1. Review the key concepts
2. Follow the step-by-step process
3. Apply the frameworks to your situation
4. Track your progress
5. Iterate and improve

## Additional Resources

- Related guides
- Tools and calculators
- Templates and checklists
- Community support
`

export default function GuideDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [notes, setNotes] = useState('')
  const [userRating, setUserRating] = useState<number | null>(null)
  const [userReview, setUserReview] = useState('')
  const [showQuiz, setShowQuiz] = useState(false)
  const [readingStreak, setReadingStreak] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [timeSpent, setTimeSpent] = useState(0)
  
  const guide = allGuides[id] || {
    id,
    title: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    content: getDefaultGuideContent(id, id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')),
    author: 'GrowthLab Team',
    readTime: '20 min',
    date: new Date().toLocaleDateString(),
    views: 0,
    rating: 4.5,
    category: 'General',
    difficulty: 'intermediate',
    stage: ['launch'],
    tags: [],
    icon: BookOpen,
}

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Load bookmark status
    const bookmarks = localStorage.getItem('guideBookmarks')
    if (bookmarks) {
      const bookmarkedIds = JSON.parse(bookmarks)
      setIsBookmarked(bookmarkedIds.includes(id))
    }
    
    // Load completion status
    const completed = localStorage.getItem('completedGuides')
    if (completed) {
      const completedIds = JSON.parse(completed)
      setIsCompleted(completedIds.includes(id))
    }
    
    // Load notes
    const savedNotes = localStorage.getItem(`guideNotes_${id}`)
    if (savedNotes) {
      setNotes(savedNotes)
    }
    
    // Load saved progress
    const savedProgress = localStorage.getItem(`guideProgress_${id}`)
    if (savedProgress) {
      setReadingProgress(parseFloat(savedProgress))
    }
    
    // Load user rating
    const savedRating = localStorage.getItem(`guideRating_${id}`)
    if (savedRating) {
      setUserRating(parseFloat(savedRating))
    }
    
    // Load reading streak
    const streak = localStorage.getItem('readingStreak')
    if (streak) {
      setReadingStreak(parseInt(streak))
    }
    
    // Load achievements
    const savedAchievements = localStorage.getItem('achievements')
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    }
    
    // Track reading progress
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      const newProgress = Math.min(100, Math.max(0, progress))
      setReadingProgress(newProgress)
      
      // Save progress
      localStorage.setItem(`guideProgress_${id}`, newProgress.toString())
      
      // Check if completed
      if (newProgress >= 100 && !isCompleted) {
        updateReadingStreak()
      }
    }
    
    // Track time spent
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setTimeSpent(elapsed)
    }, 1000)
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [id, isCompleted])

  const toggleBookmark = () => {
    if (typeof window === 'undefined') return
    
    const bookmarks = localStorage.getItem('guideBookmarks')
    const bookmarkedIds = bookmarks ? JSON.parse(bookmarks) : []
    
    if (isBookmarked) {
      const newBookmarks = bookmarkedIds.filter((bid: string) => bid !== id)
      localStorage.setItem('guideBookmarks', JSON.stringify(newBookmarks))
      setIsBookmarked(false)
      showToast('Removed from bookmarks', 'info')
    } else {
      bookmarkedIds.push(id)
      localStorage.setItem('guideBookmarks', JSON.stringify(bookmarkedIds))
      setIsBookmarked(true)
      showToast('Added to bookmarks', 'success')
    }
  }

  const markAsCompleted = () => {
    if (typeof window === 'undefined') return
    
    const completed = localStorage.getItem('completedGuides')
    const completedIds = completed ? JSON.parse(completed) : []
    
    if (isCompleted) {
      const newCompleted = completedIds.filter((cid: string) => cid !== id)
      localStorage.setItem('completedGuides', JSON.stringify(newCompleted))
      setIsCompleted(false)
      showToast('Marked as incomplete', 'info')
    } else {
      completedIds.push(id)
      localStorage.setItem('completedGuides', JSON.stringify(completedIds))
      setIsCompleted(true)
      showToast('Marked as completed!', 'success')
    }
  }

  const handleShare = () => {
    if (typeof window === 'undefined') return
    
    const url = window.location.href
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.content.substring(0, 200),
        url,
      }).catch(() => {})
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      showToast('Link copied to clipboard!', 'success')
    }
  }

  const saveNotes = () => {
    if (typeof window === 'undefined') return
    localStorage.setItem(`guideNotes_${id}`, notes)
    showToast('Notes saved!', 'success')
  }

  const handleRating = (rating: number) => {
    setUserRating(rating)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`guideRating_${id}`, rating.toString())
    }
    showToast('Rating saved!', 'success')
  }

  const saveReview = () => {
    if (!userReview.trim()) {
      showToast('Please write a review', 'error')
      return
    }
    if (typeof window !== 'undefined') {
      const reviews = JSON.parse(localStorage.getItem(`guideReviews_${id}`) || '[]')
      reviews.push({
        rating: userRating,
        review: userReview,
        date: new Date().toISOString(),
      })
      localStorage.setItem(`guideReviews_${id}`, JSON.stringify(reviews))
      setUserReview('')
      showToast('Review saved!', 'success')
    }
  }

  const downloadPDF = () => {
    if (typeof window === 'undefined') return
    const content = document.querySelector('.prose')?.textContent || ''
    const blob = new Blob([`${guide.title}\n\n${content}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${guide.title.replace(/\s+/g, '-')}.txt`
    a.click()
    showToast('Guide downloaded!', 'success')
  }

  const printGuide = () => {
    if (typeof window === 'undefined') return
    window.print()
  }

  const updateReadingStreak = () => {
    if (typeof window === 'undefined') return
    
    const lastReadDate = localStorage.getItem('lastReadDate')
    const today = new Date().toDateString()
    
    if (lastReadDate === today) {
      return // Already read today
    }
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    let streak = parseInt(localStorage.getItem('readingStreak') || '0')
    
    if (lastReadDate === yesterdayStr) {
      streak += 1
    } else if (lastReadDate !== today) {
      streak = 1
    }
    
    setReadingStreak(streak)
    localStorage.setItem('readingStreak', streak.toString())
    localStorage.setItem('lastReadDate', today)
    
    // Check for achievements
    const newAchievements: string[] = []
    if (streak === 3 && !achievements.includes('3-day-streak')) {
      newAchievements.push('3-day-streak')
      showToast('🏆 Achievement: 3 Day Reading Streak!', 'success')
    }
    if (streak === 7 && !achievements.includes('7-day-streak')) {
      newAchievements.push('7-day-streak')
      showToast('🏆 Achievement: 7 Day Reading Streak!', 'success')
    }
    if (streak === 30 && !achievements.includes('30-day-streak')) {
      newAchievements.push('30-day-streak')
      showToast('🏆 Achievement: 30 Day Reading Streak!', 'success')
    }
    
    if (newAchievements.length > 0) {
      const allAchievements = [...achievements, ...newAchievements]
      setAchievements(allAchievements)
      localStorage.setItem('achievements', JSON.stringify(allAchievements))
    }
  }

  useEffect(() => {
    if (readingProgress >= 100 && !isCompleted) {
      updateReadingStreak()
  }
  }, [readingProgress])

  const Icon = guide.icon || BookOpen

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/startup/guides">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guides
          </Button>
        </Link>

        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
          <div 
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        <Card className="mb-8">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary-500/10 p-3 rounded-lg text-primary-500">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2 gradient-text">{guide.title}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant={guide.difficulty}>{guide.difficulty}</Badge>
                    <span className="text-sm text-gray-600">{guide.category}</span>
                    {guide.interactive && (
                      <Badge variant="featured">
                        <Zap className="h-3 w-3 mr-1" />
                        Interactive
                      </Badge>
                    )}
                    {guide.hasTools && (
                      <Badge variant="new">
                        <Settings className="h-3 w-3 mr-1" />
                        Includes Tools
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="beginner">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleBookmark}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5 text-primary-500" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAsCompleted}
                >
                  <CheckCircle className={`h-5 w-5 ${isCompleted ? 'text-green-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadPDF}
                >
                  <Download className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={printGuide}
                >
                  <Printer className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Reading Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
              {readingStreak > 0 && (
                <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
                  <Flame className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold text-orange-600">{readingStreak} day streak</span>
                </div>
              )}
              {timeSpent > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.floor(timeSpent / 60)}m {timeSpent % 60}s reading
                </div>
              )}
              {achievements.length > 0 && (
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  {achievements.length} achievement{achievements.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {guide.author}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {guide.readTime}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {guide.views.toLocaleString()} views
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {guide.rating}
              </div>
              <div>{new Date(guide.date).toLocaleDateString()}</div>
            </div>

            {guide.tags && guide.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {guide.tags.map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {guide.content}
            </div>
          </div>
        </Card>

        {/* Rating and Review */}
        <Card className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary-500" />
            Rate This Guide
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRating(rating)}
                  className={`p-2 rounded-lg transition-all ${
                    userRating && userRating >= rating
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <Star className={`h-6 w-6 ${userRating && userRating >= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
              {userRating && (
                <span className="ml-2 text-sm text-gray-600">
                  You rated this {userRating} out of 5
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write a Review
              </label>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Share your thoughts about this guide..."
                className="w-full min-h-[100px] px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              />
              <Button onClick={saveReview} className="mt-2" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Submit Review
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Quiz */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary-500" />
              Quick Knowledge Check
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuiz(!showQuiz)}
            >
              {showQuiz ? 'Hide Quiz' : 'Take Quiz'}
            </Button>
          </div>
          {showQuiz && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium mb-2">Question 1: What is the first step in idea validation?</p>
                <div className="space-y-2">
                  {['Problem Validation', 'Solution Validation', 'Market Validation', 'Customer Interviews'].map((option, idx) => (
                    <label key={idx} className="flex items-center gap-2 p-2 bg-white rounded cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="quiz1" value={option} />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button size="sm" onClick={() => showToast('Quiz submitted! Check your answers.', 'success')}>
                Submit Answers
              </Button>
            </div>
          )}
        </Card>

        {/* Notes Section */}
        <Card className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Your Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes, insights, or action items here..."
            className="w-full min-h-[200px] px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
          <div className="flex justify-end mt-4">
            <Button size="sm" onClick={saveNotes}>
              Save Notes
            </Button>
          </div>
        </Card>

        {/* Related Tools */}
        {guide.hasTools && (
          <Card className="mb-8 bg-gradient-to-br from-primary-500/10 to-primary-500/5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary-500" />
              Related Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.category === 'Validation' && (
                <>
                  <Link href="/startup/idea-validation">
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      Idea Validation Tool
                    </Button>
                  </Link>
                  <Link href="/startup/customer-discovery">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Customer Discovery
                    </Button>
                  </Link>
                </>
              )}
              {guide.category === 'Fundraising' && (
                <>
                  <Link href="/startup/pitch-deck-builder">
                    <Button variant="outline" className="w-full justify-start">
                      <Rocket className="h-4 w-4 mr-2" />
                      Pitch Deck Builder
                    </Button>
                  </Link>
                  <Link href="/startup/valuation-calculator">
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Valuation Calculator
                    </Button>
                  </Link>
                </>
              )}
              {guide.category === 'Finance' && (
                <Link href="/startup/financial-projections">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Financial Projections
                  </Button>
                </Link>
              )}
              {guide.category === 'Business Planning' && (
                <Link href="/startup/business-plan">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Business Plan Builder
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        )}

        {/* Action Items */}
        <Card className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Action Items</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium">Review key concepts</p>
                <p className="text-sm text-gray-600">Make sure you understand the core principles</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium">Apply to your startup</p>
                <p className="text-sm text-gray-600">Use the frameworks in your specific context</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium">Share with your team</p>
                <p className="text-sm text-gray-600">Discuss key insights with co-founders</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Completion Certificate */}
        {isCompleted && (
          <Card className="mb-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
              <p className="text-gray-700 mb-4">
                You've completed "{guide.title}"
              </p>
              <Button onClick={() => {
                const cert = `Certificate of Completion\n\nThis certifies that you have successfully completed:\n\n${guide.title}\n\nDate: ${new Date().toLocaleDateString()}\n\nGrowthLab Startup Resources`
                const blob = new Blob([cert], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `certificate-${guide.title.replace(/\s+/g, '-')}.txt`
                a.click()
                showToast('Certificate downloaded!', 'success')
              }}>
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            </div>
          </Card>
        )}

        {/* Related Guides */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Related Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(allGuides)
              .filter((g: any) => 
                g.id !== id && 
                (g.category === guide.category || 
                 g.stage?.some((s: string) => guide.stage?.includes(s)) ||
                 g.tags?.some((t: string) => guide.tags?.includes(t)))
              )
              .slice(0, 4)
              .map((relatedGuide: any) => {
                const RelatedIcon = relatedGuide.icon || BookOpen
                return (
                  <Link key={relatedGuide.id} href={`/startup/guides/${relatedGuide.id}`}>
                    <Card className="hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-500/10 p-2 rounded-lg">
                          <RelatedIcon className="h-5 w-5 text-primary-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{relatedGuide.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {relatedGuide.readTime}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
          </div>
        </Card>
      </div>
    </main>
  )
}
