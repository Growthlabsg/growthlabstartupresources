'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { Code, Database, Sparkles, Search, Star, Clock, PlayCircle, Award, CheckCircle, TrendingUp, Cloud, Terminal, Smartphone, Server, GitBranch, Shield, Zap, BookOpen, Video, FileText, BarChart, Globe, Layers } from 'lucide-react'
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
  format: 'video' | 'hands-on' | 'bootcamp'
}

const categories = [
  { id: 'all', name: 'All Categories', icon: Code },
  { id: 'web-dev', name: 'Web Development', icon: Globe },
  { id: 'data', name: 'Data & Analytics', icon: Database },
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: Sparkles },
  { id: 'mobile', name: 'Mobile Development', icon: Smartphone },
  { id: 'devops', name: 'DevOps & Cloud', icon: Cloud },
  { id: 'no-code', name: 'No-Code Tools', icon: Layers },
  { id: 'security', name: 'Cybersecurity', icon: Shield },
]

const courses: Course[] = [
  // Web Development
  {
    id: '1',
    title: 'Web Development for Founders',
    description: 'Learn the fundamentals of web development to build your MVP from scratch.',
    category: 'web-dev',
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
    skills: ['HTML/CSS', 'JavaScript', 'React Basics'],
    format: 'video'
  },
  {
    id: '2',
    title: 'Full-Stack Development Bootcamp',
    description: 'Master full-stack development with modern frameworks and tools.',
    category: 'web-dev',
    duration: '12 weeks',
    lessons: 60,
    level: 'intermediate',
    instructor: 'Sarah Chen',
    rating: 4.9,
    students: 1850,
    price: 499,
    free: false,
    featured: true,
    popular: true,
    icon: Code,
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    format: 'bootcamp'
  },
  {
    id: '3',
    title: 'Frontend Development Essentials',
    description: 'Build beautiful, responsive user interfaces with modern frontend technologies.',
    category: 'web-dev',
    duration: '6 weeks',
    lessons: 30,
    level: 'beginner',
    instructor: 'Mike Johnson',
    rating: 4.8,
    students: 2100,
    price: 199,
    free: false,
    popular: true,
    icon: Globe,
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    format: 'hands-on'
  },
  {
    id: '4',
    title: 'Backend Development Mastery',
    description: 'Learn to build scalable APIs and server-side applications.',
    category: 'web-dev',
    duration: '8 weeks',
    lessons: 35,
    level: 'intermediate',
    instructor: 'David Kim',
    rating: 4.7,
    students: 1450,
    price: 299,
    free: false,
    icon: Server,
    skills: ['Node.js', 'Python', 'REST APIs', 'GraphQL'],
    format: 'hands-on'
  },
  
  // Data & Analytics
  {
    id: '5',
    title: 'Data Analysis for Startups',
    description: 'Master data analysis and visualization to make data-driven decisions.',
    category: 'data',
    duration: '6 weeks',
    lessons: 28,
    level: 'beginner',
    instructor: 'Lisa Wang',
    rating: 4.8,
    students: 1950,
    price: 0,
    free: true,
    featured: true,
    popular: true,
    icon: Database,
    skills: ['Excel', 'SQL', 'Python', 'Data Visualization'],
    format: 'video'
  },
  {
    id: '6',
    title: 'Advanced Data Science',
    description: 'Deep dive into data science, machine learning, and predictive analytics.',
    category: 'data',
    duration: '10 weeks',
    lessons: 50,
    level: 'advanced',
    instructor: 'Robert Brown',
    rating: 4.9,
    students: 980,
    price: 599,
    free: false,
    featured: true,
    icon: BarChart,
    skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow'],
    format: 'bootcamp'
  },
  {
    id: '7',
    title: 'Business Intelligence & Analytics',
    description: 'Build dashboards and reports to track key business metrics.',
    category: 'data',
    duration: '4 weeks',
    lessons: 20,
    level: 'intermediate',
    instructor: 'Emily Davis',
    rating: 4.6,
    students: 1650,
    price: 249,
    free: false,
    icon: BarChart,
    skills: ['Tableau', 'Power BI', 'SQL', 'Dashboard Design'],
    format: 'hands-on'
  },
  
  // AI & Machine Learning
  {
    id: '8',
    title: 'AI & ML for Startups',
    description: 'Introduction to artificial intelligence and machine learning for non-technical founders.',
    category: 'ai-ml',
    duration: '4 weeks',
    lessons: 20,
    level: 'beginner',
    instructor: 'James Taylor',
    rating: 4.7,
    students: 3200,
    price: 0,
    free: true,
    featured: true,
    popular: true,
    icon: Sparkles,
    skills: ['AI Concepts', 'ML Basics', 'Use Cases', 'Implementation'],
    format: 'video'
  },
  {
    id: '9',
    title: 'Machine Learning Bootcamp',
    description: 'Comprehensive machine learning course from fundamentals to production.',
    category: 'ai-ml',
    duration: '12 weeks',
    lessons: 60,
    level: 'advanced',
    instructor: 'Sophie Anderson',
    rating: 4.9,
    students: 1200,
    price: 699,
    free: false,
    featured: true,
    icon: Sparkles,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
    format: 'bootcamp'
  },
  {
    id: '10',
    title: 'AI Integration for Products',
    description: 'Learn to integrate AI capabilities into your products and services.',
    category: 'ai-ml',
    duration: '6 weeks',
    lessons: 30,
    level: 'intermediate',
    instructor: 'Tom Wilson',
    rating: 4.8,
    students: 1750,
    price: 399,
    free: false,
    popular: true,
    icon: Zap,
    skills: ['API Integration', 'OpenAI', 'LangChain', 'Prompt Engineering'],
    format: 'hands-on'
  },
  
  // Mobile Development
  {
    id: '11',
    title: 'Mobile App Development',
    description: 'Build native and cross-platform mobile applications.',
    category: 'mobile',
    duration: '8 weeks',
    lessons: 35,
    level: 'intermediate',
    instructor: 'Jessica Park',
    rating: 4.7,
    students: 1500,
    price: 349,
    free: false,
    icon: Smartphone,
    skills: ['React Native', 'Flutter', 'iOS', 'Android'],
    format: 'hands-on'
  },
  {
    id: '12',
    title: 'React Native Fundamentals',
    description: 'Learn to build cross-platform mobile apps with React Native.',
    category: 'mobile',
    duration: '6 weeks',
    lessons: 28,
    level: 'beginner',
    instructor: 'Chris Lee',
    rating: 4.6,
    students: 2100,
    price: 0,
    free: true,
    popular: true,
    icon: Smartphone,
    skills: ['React Native', 'JavaScript', 'Mobile UI/UX'],
    format: 'video'
  },
  
  // DevOps & Cloud
  {
    id: '13',
    title: 'Cloud Infrastructure for Startups',
    description: 'Set up and manage scalable cloud infrastructure on AWS, Azure, or GCP.',
    category: 'devops',
    duration: '6 weeks',
    lessons: 30,
    level: 'intermediate',
    instructor: 'Maria Garcia',
    rating: 4.8,
    students: 1650,
    price: 299,
    free: false,
    featured: true,
    icon: Cloud,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    format: 'hands-on'
  },
  {
    id: '14',
    title: 'DevOps Essentials',
    description: 'Master DevOps practices for faster deployment and better reliability.',
    category: 'devops',
    duration: '5 weeks',
    lessons: 25,
    level: 'intermediate',
    instructor: 'Rachel Green',
    rating: 4.7,
    students: 1280,
    price: 249,
    free: false,
    icon: Terminal,
    skills: ['Docker', 'Git', 'CI/CD', 'Monitoring'],
    format: 'hands-on'
  },
  {
    id: '15',
    title: 'Introduction to Cloud Computing',
    description: 'Learn the basics of cloud computing and get started with AWS.',
    category: 'devops',
    duration: '3 weeks',
    lessons: 15,
    level: 'beginner',
    instructor: 'Emma White',
    rating: 4.5,
    students: 2800,
    price: 0,
    free: true,
    popular: true,
    icon: Cloud,
    skills: ['AWS Basics', 'Cloud Concepts', 'EC2', 'S3'],
    format: 'video'
  },
  
  // No-Code Tools
  {
    id: '16',
    title: 'No-Code MVP Development',
    description: 'Build your MVP without coding using modern no-code tools.',
    category: 'no-code',
    duration: '3 weeks',
    lessons: 15,
    level: 'beginner',
    instructor: 'Michael Chang',
    rating: 4.9,
    students: 4200,
    price: 0,
    free: true,
    featured: true,
    popular: true,
    icon: Layers,
    skills: ['Bubble.io', 'Webflow', 'Zapier', 'Airtable'],
    format: 'hands-on'
  },
  {
    id: '17',
    title: 'Advanced No-Code Development',
    description: 'Build complex applications using advanced no-code techniques.',
    category: 'no-code',
    duration: '5 weeks',
    lessons: 25,
    level: 'intermediate',
    instructor: 'Sarah Chen',
    rating: 4.8,
    students: 1950,
    price: 199,
    free: false,
    icon: Layers,
    skills: ['Bubble Advanced', 'API Integration', 'Database Design'],
    format: 'hands-on'
  },
  
  // Cybersecurity
  {
    id: '18',
    title: 'Cybersecurity for Startups',
    description: 'Learn essential cybersecurity practices to protect your startup.',
    category: 'security',
    duration: '4 weeks',
    lessons: 20,
    level: 'beginner',
    instructor: 'David Kim',
    rating: 4.7,
    students: 1750,
    price: 0,
    free: true,
    featured: true,
    icon: Shield,
    skills: ['Security Basics', 'Data Protection', 'Best Practices'],
    format: 'video'
  },
  {
    id: '19',
    title: 'Application Security',
    description: 'Secure your applications against common vulnerabilities and attacks.',
    category: 'security',
    duration: '6 weeks',
    lessons: 30,
    level: 'intermediate',
    instructor: 'Lisa Wang',
    rating: 4.8,
    students: 1100,
    price: 349,
    free: false,
    icon: Shield,
    skills: ['OWASP', 'Penetration Testing', 'Secure Coding'],
    format: 'hands-on'
  },
]

export default function TechnicalSkillsPage() {
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

  const CategoryIcon = categories.find(c => c.id === selectedCategory)?.icon || Code

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
            Technical Skills
          </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Learn essential technical skills for modern startups and digital businesses. From coding to no-code, master the tools you need to build and scale.
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
                { value: 'hands-on', label: 'Hands-On' },
                { value: 'bootcamp', label: 'Bootcamp' }
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
                        {course.format.replace('-', ' ')}
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
            <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
                <Code className="h-8 w-8 text-primary-500" />
                <h3 className="text-xl font-semibold">Founder's Tech Path</h3>
              </div>
              <p className="text-gray-600 mb-4">From zero to MVP - Learn to build your product without being a full-time developer</p>
              <div className="space-y-2 mb-4">
                {courses.filter(c => ['16', '1', '8', '15'].includes(c.id)).map(course => (
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
                <h3 className="text-xl font-semibold">Full-Stack Developer</h3>
              </div>
              <p className="text-gray-600 mb-4">Master both frontend and backend development to build complete applications</p>
              <div className="space-y-2 mb-4">
                {courses.filter(c => ['1', '3', '4', '2'].includes(c.id)).map(course => (
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
              <h3 className="text-lg font-semibold mb-2">Code Examples</h3>
              <p className="text-sm text-gray-600 mb-4">Access 500+ code examples and templates for quick reference</p>
              <Button variant="outline" size="sm" className="w-full">
                Browse Examples
              </Button>
            </Card>
            
            <Card className="p-6">
              <FileText className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Technical Documentation</h3>
              <p className="text-sm text-gray-600 mb-4">Comprehensive guides and documentation for all technologies</p>
              <Button variant="outline" size="sm" className="w-full">
                View Docs
              </Button>
            </Card>
            
            <Card className="p-6">
              <GitBranch className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Project Templates</h3>
              <p className="text-sm text-gray-600 mb-4">Get started quickly with pre-built project templates</p>
              <Button variant="outline" size="sm" className="w-full">
                Browse Templates
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
