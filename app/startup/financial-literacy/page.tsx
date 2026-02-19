'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { DollarSign, TrendingUp, Shield, Search, Star, Clock, PlayCircle, Award, CheckCircle, BookOpen, Video, FileText, BarChart, Calculator, PieChart, CreditCard, Receipt, PiggyBank, Target, AlertTriangle, TrendingDown, Wallet, Banknote } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface Course {
  id: string
  title: string
  description: string
  category: string
  duration: string
  lessons: number
  level: 'beginner' | 'intermediate' | 'advanced'
  instructor: string
  rating: number
  students: number
  price: number
  free: boolean
  featured?: boolean
  popular?: boolean
  icon: any
  skills: string[]
  format: 'video' | 'workshop' | 'bootcamp'
}

const categories = [
  { id: 'all', name: 'All Categories', icon: DollarSign },
  { id: 'accounting', name: 'Accounting', icon: Receipt },
  { id: 'investment', name: 'Investment', icon: TrendingUp },
  { id: 'risk', name: 'Risk Management', icon: Shield },
  { id: 'planning', name: 'Financial Planning', icon: Target },
  { id: 'tax', name: 'Tax & Compliance', icon: Calculator },
  { id: 'valuation', name: 'Valuation', icon: PieChart },
  { id: 'funding', name: 'Funding & Finance', icon: Banknote },
]

const courses: Course[] = [
  // Accounting
  {
    id: '1',
    title: 'Accounting Basics for Startups',
    description: 'Learn fundamental accounting principles and practices essential for startup founders.',
    category: 'accounting',
    duration: '4 weeks',
    lessons: 20,
    level: 'beginner',
    instructor: 'Sarah Chen',
    rating: 4.8,
    students: 2850,
    price: 0,
    free: true,
    featured: true,
    popular: true,
    icon: Receipt,
    skills: ['Bookkeeping', 'Financial Statements', 'GAAP'],
    format: 'video'
  },
  {
    id: '2',
    title: 'Financial Statement Analysis',
    description: 'Master reading and analyzing financial statements to make informed decisions.',
    category: 'accounting',
    duration: '5 weeks',
    lessons: 25,
    level: 'intermediate',
    instructor: 'Mike Johnson',
    rating: 4.7,
    students: 1650,
    price: 199,
    free: false,
    popular: true,
    icon: BarChart,
    skills: ['Balance Sheet', 'Income Statement', 'Cash Flow'],
    format: 'workshop'
  },
  {
    id: '3',
    title: 'Startup Bookkeeping Essentials',
    description: 'Set up and maintain proper bookkeeping systems for your startup.',
    category: 'accounting',
    duration: '3 weeks',
    lessons: 15,
    level: 'beginner',
    instructor: 'Emily Davis',
    rating: 4.6,
    students: 2200,
    price: 0,
    free: true,
    icon: Receipt,
    skills: ['QuickBooks', 'Expense Tracking', 'Reconciliation'],
    format: 'video'
  },
  
  // Investment
  {
    id: '4',
    title: 'Investment Strategies for Founders',
    description: 'Understand investment strategies and portfolio management for startup founders.',
    category: 'investment',
    duration: '6 weeks',
    lessons: 30,
    level: 'intermediate',
    instructor: 'David Kim',
    rating: 4.9,
    students: 1450,
    price: 299,
    free: false,
    featured: true,
    popular: true,
    icon: TrendingUp,
    skills: ['Portfolio Management', 'Asset Allocation', 'Risk-Return'],
    format: 'bootcamp'
  },
  {
    id: '5',
    title: 'Angel Investing Fundamentals',
    description: 'Learn how to become an angel investor and evaluate startup opportunities.',
    category: 'investment',
    duration: '4 weeks',
    lessons: 20,
    level: 'intermediate',
    instructor: 'Lisa Wang',
    rating: 4.7,
    students: 980,
    price: 249,
    free: false,
    icon: TrendingUp,
    skills: ['Deal Evaluation', 'Due Diligence', 'Portfolio Strategy'],
    format: 'workshop'
  },
  {
    id: '6',
    title: 'Personal Finance for Entrepreneurs',
    description: 'Manage your personal finances while building your startup.',
    category: 'investment',
    duration: '3 weeks',
    lessons: 15,
    level: 'beginner',
    instructor: 'Robert Brown',
    rating: 4.5,
    students: 3200,
    price: 0,
    free: true,
    popular: true,
    icon: Wallet,
    skills: ['Budgeting', 'Emergency Fund', 'Retirement Planning'],
    format: 'video'
  },
  
  // Risk Management
  {
    id: '7',
    title: 'Financial Risk Management',
    description: 'Learn how to identify, assess, and manage financial risks in your startup.',
    category: 'risk',
    duration: '5 weeks',
    lessons: 25,
    level: 'intermediate',
    instructor: 'James Taylor',
    rating: 4.8,
    students: 1280,
    price: 249,
    free: false,
    featured: true,
    icon: Shield,
    skills: ['Risk Assessment', 'Mitigation Strategies', 'Insurance'],
    format: 'workshop'
  },
  {
    id: '8',
    title: 'Cash Flow Risk Management',
    description: 'Master cash flow management to avoid running out of money.',
    category: 'risk',
    duration: '4 weeks',
    lessons: 20,
    level: 'intermediate',
    instructor: 'Sophie Anderson',
    rating: 4.7,
    students: 1750,
    price: 199,
    free: false,
    popular: true,
    icon: TrendingDown,
    skills: ['Cash Flow Forecasting', 'Working Capital', 'Liquidity'],
    format: 'video'
  },
  {
    id: '9',
    title: 'Risk Management Fundamentals',
    description: 'Introduction to identifying and managing business risks.',
    category: 'risk',
    duration: '2 weeks',
    lessons: 10,
    level: 'beginner',
    instructor: 'Alex Rodriguez',
    rating: 4.6,
    students: 2400,
    price: 0,
    free: true,
    icon: AlertTriangle,
    skills: ['Risk Identification', 'Risk Analysis', 'Basic Controls'],
    format: 'video'
  },
  
  // Financial Planning
  {
    id: '10',
    title: 'Startup Financial Planning',
    description: 'Create comprehensive financial plans and budgets for your startup.',
    category: 'planning',
    duration: '6 weeks',
    lessons: 30,
    level: 'intermediate',
    instructor: 'Tom Wilson',
    rating: 4.9,
    students: 1650,
    price: 299,
    free: false,
    featured: true,
    popular: true,
    icon: Target,
    skills: ['Budgeting', 'Forecasting', 'Scenario Planning'],
    format: 'bootcamp'
  },
  {
    id: '11',
    title: 'Financial Modeling Masterclass',
    description: 'Build sophisticated financial models for startups and fundraising.',
    category: 'planning',
    duration: '8 weeks',
    lessons: 40,
    level: 'advanced',
    instructor: 'Jessica Park',
    rating: 4.9,
    students: 1100,
    price: 499,
    free: false,
    featured: true,
    icon: Calculator,
    skills: ['Excel Modeling', 'DCF Analysis', 'Sensitivity Analysis'],
    format: 'bootcamp'
  },
  {
    id: '12',
    title: 'Budgeting for Startups',
    description: 'Learn to create and manage budgets effectively.',
    category: 'planning',
    duration: '3 weeks',
    lessons: 15,
    level: 'beginner',
    instructor: 'Chris Lee',
    rating: 4.5,
    students: 2800,
    price: 0,
    free: true,
    icon: Target,
    skills: ['Budget Creation', 'Variance Analysis', 'Cost Control'],
    format: 'video'
  },
  
  // Tax & Compliance
  {
    id: '13',
    title: 'Tax Planning for Startups',
    description: 'Understand tax strategies and compliance requirements for startups.',
    category: 'tax',
    duration: '4 weeks',
    lessons: 20,
    level: 'intermediate',
    instructor: 'Maria Garcia',
    rating: 4.7,
    students: 1950,
    price: 199,
    free: false,
    popular: true,
    icon: Calculator,
    skills: ['Tax Deductions', 'Entity Structure', 'Compliance'],
    format: 'workshop'
  },
  {
    id: '14',
    title: 'Startup Tax Essentials',
    description: 'Learn the basics of startup taxation and common deductions.',
    category: 'tax',
    duration: '2 weeks',
    lessons: 10,
    level: 'beginner',
    instructor: 'Rachel Green',
    rating: 4.6,
    students: 3100,
    price: 0,
    free: true,
    featured: true,
    icon: Calculator,
    skills: ['Tax Basics', 'Deductions', 'Filing Requirements'],
    format: 'video'
  },
  
  // Valuation
  {
    id: '15',
    title: 'Startup Valuation Methods',
    description: 'Learn how to value your startup using multiple methodologies.',
    category: 'valuation',
    duration: '5 weeks',
    lessons: 25,
    level: 'intermediate',
    instructor: 'Emma White',
    rating: 4.8,
    students: 1350,
    price: 299,
    free: false,
    featured: true,
    icon: PieChart,
    skills: ['DCF', 'Comparable Companies', 'Scorecard Method'],
    format: 'workshop'
  },
  {
    id: '16',
    title: 'Valuation for Fundraising',
    description: 'Master valuation techniques for different funding stages.',
    category: 'valuation',
    duration: '4 weeks',
    lessons: 20,
    level: 'advanced',
    instructor: 'Michael Chang',
    rating: 4.9,
    students: 950,
    price: 349,
    free: false,
    icon: PieChart,
    skills: ['Pre-money Valuation', 'Post-money Valuation', 'Dilution'],
    format: 'bootcamp'
  },
  
  // Funding & Finance
  {
    id: '17',
    title: 'Fundraising Finance Fundamentals',
    description: 'Understand the financial aspects of raising capital for your startup.',
    category: 'funding',
    duration: '5 weeks',
    lessons: 25,
    level: 'intermediate',
    instructor: 'Sarah Chen',
    rating: 4.8,
    students: 1850,
    price: 249,
    free: false,
    popular: true,
    icon: Banknote,
    skills: ['Cap Tables', 'Equity Dilution', 'Term Sheets'],
    format: 'workshop'
  },
  {
    id: '18',
    title: 'Burn Rate & Runway Management',
    description: 'Master cash management and runway planning for startups.',
    category: 'funding',
    duration: '3 weeks',
    lessons: 15,
    level: 'beginner',
    instructor: 'David Kim',
    rating: 4.7,
    students: 2200,
    price: 0,
    free: true,
    featured: true,
    popular: true,
    icon: PiggyBank,
    skills: ['Burn Rate Calculation', 'Runway Planning', 'Cash Management'],
    format: 'video'
  },
  {
    id: '19',
    title: 'Financial Metrics for Startups',
    description: 'Learn key financial metrics every startup founder should track.',
    category: 'funding',
    duration: '4 weeks',
    lessons: 20,
    level: 'intermediate',
    instructor: 'Lisa Wang',
    rating: 4.8,
    students: 1650,
    price: 199,
    free: false,
    icon: BarChart,
    skills: ['CAC', 'LTV', 'MRR', 'ARR', 'Gross Margin'],
    format: 'video'
  },
]

export default function FinancialLiteracyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedFormat, setSelectedFormat] = useState('all')
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    const matchesFormat = selectedFormat === 'all' || course.format === selectedFormat
    
    return matchesSearch && matchesCategory && matchesLevel && matchesFormat
  })

  const handleEnroll = (courseId: string) => {
    if (enrolledCourses.includes(courseId)) {
      showToast('You are already enrolled in this course', 'info')
      return
    }
    setEnrolledCourses([...enrolledCourses, courseId])
    const course = courses.find(c => c.id === courseId)
    showToast(`Successfully enrolled in ${course?.title}!`, 'success')
  }

  const CategoryIcon = categories.find(c => c.id === selectedCategory)?.icon || DollarSign

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
            Financial Literacy
          </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Master financial concepts essential for startup success and growth. Learn accounting, investment, risk management, and more from industry experts.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">{courses.length}</div>
              <div className="text-sm text-gray-600">Courses</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {courses.reduce((sum, c) => sum + c.lessons, 0)}+
              </div>
              <div className="text-sm text-gray-600">Lessons</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {courses.reduce((sum, c) => sum + c.students, 0).toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">Students</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {courses.filter(c => c.free).length}
              </div>
              <div className="text-sm text-gray-600">Free Courses</div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full"
              options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            />
            <Select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full"
              options={[
                { value: 'all', label: 'All Levels' },
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' }
              ]}
            />
            <Select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full"
              options={[
                { value: 'all', label: 'All Formats' },
                { value: 'video', label: 'Video Courses' },
                { value: 'workshop', label: 'Workshops' },
                { value: 'bootcamp', label: 'Bootcamps' }
              ]}
            />
              </div>
        </Card>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredCourses.map((course) => {
              const Icon = course.icon
              const isEnrolled = enrolledCourses.includes(course.id)
              
              return (
                <Card key={course.id} className="flex flex-col hover:shadow-lg transition-all">
                  <div className="relative">
                    {course.featured && (
                      <Badge variant="featured" className="absolute top-2 right-2 z-10">
                        Featured
                      </Badge>
                    )}
                    {course.popular && (
                      <Badge variant="popular" className="absolute top-2 left-2 z-10">
                        Popular
                      </Badge>
                    )}
                    <div className="bg-primary-500/10 p-4 rounded-lg text-primary-500 mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold flex-1">{course.title}</h3>
                    <Badge variant={course.level as any}>{course.level}</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{course.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-xs text-gray-500">({course.students.toLocaleString()} students)</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Instructor: {course.instructor}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {course.format}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {course.skills.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" />
                      {course.lessons} lessons
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold">
                      {course.free ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        <span>${course.price}</span>
                      )}
                    </div>
                    {isEnrolled && (
                      <Badge variant="beginner" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enrolled
                      </Badge>
                    )}
                  </div>
                  
                  <Button
                    className="w-full"
                    variant={isEnrolled ? 'outline' : 'primary'}
                    onClick={() => handleEnroll(course.id)}
                  >
                    {isEnrolled ? (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        {course.free ? 'Enroll Free' : 'Enroll Now'}
                      </>
                    )}
                  </Button>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        )}

        {/* Learning Paths Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Recommended Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="h-8 w-8 text-primary-500" />
                <h3 className="text-xl font-semibold">Founder's Finance Path</h3>
              </div>
              <p className="text-gray-600 mb-4">From accounting basics to fundraising - Master all financial aspects of running a startup</p>
              <div className="space-y-2 mb-4">
                {courses.filter(c => ['1', '12', '10', '18', '4'].includes(c.id)).map(course => (
                  <div key={course.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{course.title}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                Start Learning Path
              </Button>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-primary-500" />
                <h3 className="text-xl font-semibold">Financial Planning Mastery</h3>
              </div>
              <p className="text-gray-600 mb-4">Build comprehensive financial planning and modeling skills</p>
              <div className="space-y-2 mb-4">
                {courses.filter(c => ['12', '10', '11', '19'].includes(c.id)).map(course => (
                  <div key={course.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{course.title}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                Start Learning Path
              </Button>
            </Card>
          </div>
        </div>

        {/* Resources Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <Video className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Financial Templates</h3>
              <p className="text-sm text-gray-600 mb-4">Download ready-to-use financial models, budgets, and templates</p>
              <Button variant="outline" size="sm" className="w-full">
                Browse Templates
              </Button>
            </Card>
            
            <Card className="p-6">
              <FileText className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Financial Calculators</h3>
              <p className="text-sm text-gray-600 mb-4">Access interactive calculators for valuation, burn rate, and more</p>
              <Button variant="outline" size="sm" className="w-full">
                Use Calculators
              </Button>
            </Card>
            
            <Card className="p-6">
              <BarChart className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Financial Assessment</h3>
              <p className="text-sm text-gray-600 mb-4">Evaluate your financial knowledge and get personalized recommendations</p>
              <Button variant="outline" size="sm" className="w-full">
                Take Assessment
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
