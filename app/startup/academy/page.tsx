'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { BookOpen, PlayCircle, Award, Clock, Search, Filter, Star, Users, TrendingUp, CheckCircle, BarChart, Video, FileText, Target, DollarSign, Users2, Code, Lightbulb, Zap, Rocket } from 'lucide-react'
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
}

const categories = [
  { id: 'all', name: 'All Categories', icon: BookOpen },
  { id: 'fundamentals', name: 'Startup Fundamentals', icon: Target },
  { id: 'funding', name: 'Funding & Finance', icon: DollarSign },
  { id: 'leadership', name: 'Leadership & Team', icon: Users2 },
  { id: 'technical', name: 'Technical Skills', icon: Code },
  { id: 'marketing', name: 'Marketing & Growth', icon: TrendingUp },
  { id: 'product', name: 'Product Development', icon: Rocket },
  { id: 'strategy', name: 'Business Strategy', icon: Lightbulb },
]

const courses: Course[] = [
  // Startup Fundamentals
  {
    id: '1',
    title: 'Startup Fundamentals',
    description: 'Learn the essential basics of starting and running a startup from idea to launch.',
    category: 'fundamentals',
    duration: '4 weeks',
    lessons: 20,
    level: 'beginner',
    instructor: 'Sarah Chen',
    rating: 4.8,
    students: 1250,
    price: 0,
    free: true,
    featured: true,
    popular: true,
    icon: Target,
    skills: ['Idea Validation', 'Business Planning', 'MVP Development']
  },
  {
    id: '2',
    title: 'Idea Validation Masterclass',
    description: 'Validate your startup idea before investing time and resources.',
    category: 'fundamentals',
    duration: '2 weeks',
    lessons: 12,
    level: 'beginner',
    instructor: 'Mike Johnson',
    rating: 4.7,
    students: 890,
    price: 0,
    free: true,
    popular: true,
    icon: Lightbulb,
    skills: ['Market Research', 'Customer Discovery', 'Problem-Solution Fit']
  },
  {
    id: '3',
    title: 'Business Model Canvas Workshop',
    description: 'Design and refine your business model using the proven canvas framework.',
    category: 'fundamentals',
    duration: '1 week',
    lessons: 8,
    level: 'beginner',
    instructor: 'Emily Davis',
    rating: 4.9,
    students: 2100,
    price: 0,
    free: true,
    featured: true,
    icon: Target,
    skills: ['Business Modeling', 'Value Proposition', 'Revenue Streams']
  },
  
  // Funding & Finance
  {
    id: '4',
    title: 'Fundraising Mastery',
    description: 'Master the art of raising capital for your startup from seed to Series A.',
    category: 'funding',
    duration: '6 weeks',
    lessons: 30,
    level: 'intermediate',
    instructor: 'David Kim',
    rating: 4.9,
    students: 1850,
    price: 299,
    free: false,
    featured: true,
    popular: true,
    icon: DollarSign,
    skills: ['Pitch Deck Creation', 'Investor Relations', 'Term Sheet Negotiation']
  },
  {
    id: '5',
    title: 'Financial Modeling for Startups',
    description: 'Build comprehensive financial models and projections that investors trust.',
    category: 'funding',
    duration: '4 weeks',
    lessons: 18,
    level: 'intermediate',
    instructor: 'Lisa Wang',
    rating: 4.8,
    students: 1420,
    price: 199,
    free: false,
    popular: true,
    icon: DollarSign,
    skills: ['Financial Projections', 'Valuation', 'Cash Flow Management']
  },
  {
    id: '6',
    title: 'Venture Capital Deep Dive',
    description: 'Understand the VC landscape and how to navigate funding rounds.',
    category: 'funding',
    duration: '3 weeks',
    lessons: 15,
    level: 'advanced',
    instructor: 'Robert Brown',
    rating: 4.7,
    students: 650,
    price: 399,
    free: false,
    icon: DollarSign,
    skills: ['VC Strategy', 'Due Diligence', 'Series A Preparation']
  },
  
  // Leadership & Team
  {
    id: '7',
    title: 'Founder Leadership Program',
    description: 'Develop essential leadership skills for startup founders and CEOs.',
    category: 'leadership',
    duration: '5 weeks',
    lessons: 25,
    level: 'intermediate',
    instructor: 'James Taylor',
    rating: 4.8,
    students: 1100,
    price: 249,
    free: false,
    featured: true,
    icon: Users2,
    skills: ['Team Building', 'Decision Making', 'Communication']
  },
  {
    id: '8',
    title: 'Building High-Performance Teams',
    description: 'Learn how to recruit, manage, and retain top talent for your startup.',
    category: 'leadership',
    duration: '4 weeks',
    lessons: 20,
    level: 'intermediate',
    instructor: 'Sophie Anderson',
    rating: 4.6,
    students: 980,
    price: 199,
    free: false,
    icon: Users2,
    skills: ['Recruitment', 'Performance Management', 'Culture Building']
  },
  
  // Technical Skills
  {
    id: '9',
    title: 'Web Development for Founders',
    description: 'Learn the fundamentals of web development to build your MVP.',
    category: 'technical',
    duration: '8 weeks',
    lessons: 40,
    level: 'beginner',
    instructor: 'Alex Rodriguez',
    rating: 4.7,
    students: 2300,
    price: 0,
    free: true,
    popular: true,
    icon: Code,
    skills: ['HTML/CSS', 'JavaScript', 'React Basics']
  },
  {
    id: '10',
    title: 'No-Code MVP Development',
    description: 'Build your MVP without coding using modern no-code tools.',
    category: 'technical',
    duration: '3 weeks',
    lessons: 15,
    level: 'beginner',
    instructor: 'Maria Garcia',
    rating: 4.9,
    students: 3200,
    price: 0,
    free: true,
    featured: true,
    icon: Code,
    skills: ['Bubble.io', 'Webflow', 'Zapier']
  },
  
  // Marketing & Growth
  {
    id: '11',
    title: 'Growth & Scaling',
    description: 'Learn how to scale your startup effectively and sustainably.',
    category: 'marketing',
    duration: '8 weeks',
    lessons: 40,
    level: 'advanced',
    instructor: 'Tom Wilson',
    rating: 4.8,
    students: 1650,
    price: 349,
    free: false,
    featured: true,
    popular: true,
    icon: TrendingUp,
    skills: ['Growth Hacking', 'Scaling Operations', 'Market Expansion']
  },
  {
    id: '12',
    title: 'Digital Marketing Strategy',
    description: 'Build comprehensive digital marketing strategies for startup growth.',
    category: 'marketing',
    duration: '5 weeks',
    lessons: 25,
    level: 'intermediate',
    instructor: 'Jessica Park',
    rating: 4.7,
    students: 1450,
    price: 249,
    free: false,
    popular: true,
    icon: TrendingUp,
    skills: ['SEO', 'Content Marketing', 'Social Media']
  },
  {
    id: '13',
    title: 'Growth Hacking Techniques',
    description: 'Master growth hacking strategies to rapidly scale your user base.',
    category: 'marketing',
    duration: '4 weeks',
    lessons: 20,
    level: 'intermediate',
    instructor: 'Chris Lee',
    rating: 4.9,
    students: 2100,
    price: 299,
    free: false,
    featured: true,
    icon: Zap,
    skills: ['Viral Loops', 'Referral Programs', 'A/B Testing']
  },
  
  // Product Development
  {
    id: '14',
    title: 'Product Management Essentials',
    description: 'Learn product management fundamentals for startup success.',
    category: 'product',
    duration: '6 weeks',
    lessons: 30,
    level: 'intermediate',
    instructor: 'Rachel Green',
    rating: 4.8,
    students: 1280,
    price: 299,
    free: false,
    icon: Rocket,
    skills: ['Product Roadmap', 'User Research', 'Feature Prioritization']
  },
  {
    id: '15',
    title: 'UX/UI Design for Startups',
    description: 'Design user-friendly interfaces that drive engagement and conversions.',
    category: 'product',
    duration: '5 weeks',
    lessons: 25,
    level: 'beginner',
    instructor: 'Emma White',
    rating: 4.6,
    students: 1750,
    price: 199,
    free: false,
    icon: Rocket,
    skills: ['Figma', 'User Testing', 'Design Systems']
  },
  
  // Business Strategy
  {
    id: '16',
    title: 'Competitive Strategy',
    description: 'Develop winning strategies to outcompete in your market.',
    category: 'strategy',
    duration: '4 weeks',
    lessons: 20,
    level: 'intermediate',
    instructor: 'Michael Chang',
    rating: 4.7,
    students: 950,
    price: 249,
    free: false,
    icon: Lightbulb,
    skills: ['Market Analysis', 'Positioning', 'Competitive Advantage']
  },
  {
    id: '17',
    title: 'Go-to-Market Strategy',
    description: 'Plan and execute a successful product launch and market entry.',
    category: 'strategy',
    duration: '5 weeks',
    lessons: 25,
    level: 'intermediate',
    instructor: 'Sarah Chen',
    rating: 4.8,
    students: 1350,
    price: 299,
    free: false,
    featured: true,
    icon: Lightbulb,
    skills: ['Market Entry', 'Launch Planning', 'Customer Acquisition']
  },
]

export default function AcademyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
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

  const CategoryIcon = categories.find(c => c.id === selectedCategory)?.icon || BookOpen

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              Startup Academy
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Comprehensive courses covering all aspects of building and scaling a startup. Learn from industry experts and get certified.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">{courses.length}+</div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="flex flex-wrap gap-1">
                      {course.skills.slice(0, 2).map((skill, i) => (
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
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
                <Target className="h-8 w-8 text-primary-500" />
                <h3 className="text-xl font-semibold">Founder's Journey</h3>
              </div>
              <p className="text-gray-600 mb-4">From idea to Series A - A complete path for first-time founders</p>
              <div className="space-y-2 mb-4">
                {courses.filter(c => ['1', '2', '4', '11'].includes(c.id)).map(course => (
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
                <h3 className="text-xl font-semibold">Growth Mastery</h3>
              </div>
              <p className="text-gray-600 mb-4">Scale your startup from 0 to 10M users</p>
              <div className="space-y-2 mb-4">
                {courses.filter(c => ['11', '12', '13'].includes(c.id)).map(course => (
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
      </div>
    </main>
  )
}
