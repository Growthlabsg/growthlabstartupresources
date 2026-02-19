'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { BookOpen, GraduationCap, Users, Search, Star, ExternalLink, CheckCircle, Video, FileText, BarChart, Shield, Smartphone, Globe, Zap, Brain, Award, Calculator, Network, BookOpen as BookIcon, Video as VideoIcon, TrendingUp } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: 'tool' | 'guide' | 'template' | 'course'
  link: string
  featured?: boolean
  popular?: boolean
  icon: any
  tags: string[]
  rating?: number
}

const categories = [
  { id: 'all', name: 'All Categories', icon: BookOpen },
  { id: 'platform', name: 'Platform Setup', icon: Globe },
  { id: 'content', name: 'Content & Curriculum', icon: BookIcon },
  { id: 'assessment', name: 'Assessment & Testing', icon: Award },
  { id: 'analytics', name: 'Learning Analytics', icon: BarChart },
  { id: 'compliance', name: 'Compliance & Privacy', icon: Shield },
  { id: 'engagement', name: 'Student Engagement', icon: Users },
  { id: 'integration', name: 'LMS Integration', icon: Network },
]

const resources: Resource[] = [
  // Platform Setup
  {
    id: '1',
    title: 'Learning Management System Setup',
    description: 'Choose and set up the right LMS platform: Moodle, Canvas, Blackboard, or custom solutions.',
    category: 'platform',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Globe,
    tags: ['LMS', 'Moodle', 'Canvas', 'Platform'],
    rating: 4.9
  },
  {
    id: '2',
    title: 'EdTech Platform Architecture',
    description: 'Design scalable architecture for educational technology platforms.',
    category: 'platform',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: Globe,
    tags: ['Architecture', 'Scalability', 'Platform', 'Design']
  },
  {
    id: '3',
    title: 'Mobile Learning App Development',
    description: 'Build mobile learning applications for iOS and Android platforms.',
    category: 'platform',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Smartphone,
    tags: ['Mobile Apps', 'iOS', 'Android', 'Learning']
  },
  
  // Content & Curriculum
  {
    id: '4',
    title: 'Content Management System',
    description: 'Set up systems for creating, organizing, and delivering educational content.',
    category: 'content',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: BookIcon,
    tags: ['CMS', 'Content', 'Curriculum', 'Management'],
    rating: 4.7
  },
  {
    id: '5',
    title: 'Video Learning Platform',
    description: 'Build platforms for video-based learning and live streaming classes.',
    category: 'content',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: Video,
    tags: ['Video', 'Streaming', 'Live Classes', 'Platform']
  },
  {
    id: '6',
    title: 'Interactive Content Creation',
    description: 'Create interactive educational content with quizzes, simulations, and gamification.',
    category: 'content',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Zap,
    tags: ['Interactive', 'Gamification', 'Quizzes', 'Content']
  },
  
  // Assessment & Testing
  {
    id: '7',
    title: 'Online Assessment Platform',
    description: 'Build platforms for creating, delivering, and grading online assessments.',
    category: 'assessment',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    featured: true,
    icon: Award,
    tags: ['Assessment', 'Testing', 'Grading', 'Platform'],
    rating: 4.6
  },
  {
    id: '8',
    title: 'Proctoring Solutions',
    description: 'Implement online proctoring and anti-cheating measures for assessments.',
    category: 'assessment',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Shield,
    tags: ['Proctoring', 'Anti-Cheating', 'Security', 'Assessment']
  },
  
  // Learning Analytics
  {
    id: '9',
    title: 'Learning Analytics Dashboard',
    description: 'Track student progress, engagement, and learning outcomes with analytics.',
    category: 'analytics',
    type: 'tool',
    link: '/startup/marketing/analytics',
    featured: true,
    popular: true,
    icon: BarChart,
    tags: ['Analytics', 'Student Progress', 'Engagement', 'Dashboard'],
    rating: 4.8
  },
  {
    id: '10',
    title: 'Adaptive Learning Systems',
    description: 'Implement AI-powered adaptive learning that personalizes content for each student.',
    category: 'analytics',
    type: 'guide',
    link: '/startup/tech/ai-ml',
    popular: true,
    icon: Brain,
    tags: ['Adaptive Learning', 'AI', 'Personalization', 'Machine Learning']
  },
  
  // Compliance & Privacy
  {
    id: '11',
    title: 'FERPA Compliance Guide',
    description: 'Ensure compliance with FERPA regulations for student data privacy.',
    category: 'compliance',
    type: 'guide',
    link: '/startup/legal/privacy',
    featured: true,
    popular: true,
    icon: Shield,
    tags: ['FERPA', 'Compliance', 'Student Privacy', 'Data Protection'],
    rating: 4.7
  },
  {
    id: '12',
    title: 'COPPA Compliance for EdTech',
    description: 'Navigate COPPA requirements for educational platforms serving children under 13.',
    category: 'compliance',
    type: 'guide',
    link: '/startup/legal/privacy',
    icon: Shield,
    tags: ['COPPA', 'Children Privacy', 'Compliance', 'Regulation']
  },
  
  // Student Engagement
  {
    id: '13',
    title: 'Gamification in Education',
    description: 'Implement gamification elements to increase student engagement and motivation.',
    category: 'engagement',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    icon: Zap,
    tags: ['Gamification', 'Engagement', 'Motivation', 'Learning']
  },
  {
    id: '14',
    title: 'Social Learning Features',
    description: 'Add social learning features like forums, peer collaboration, and group projects.',
    category: 'engagement',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Users,
    tags: ['Social Learning', 'Collaboration', 'Forums', 'Community']
  },
  
  // LMS Integration
  {
    id: '15',
    title: 'LMS Integration Guide',
    description: 'Integrate with major Learning Management Systems like Canvas, Moodle, and Blackboard.',
    category: 'integration',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Network,
    tags: ['LMS', 'Integration', 'Canvas', 'Moodle'],
    rating: 4.6
  },
  {
    id: '16',
    title: 'SCORM Compliance',
    description: 'Ensure your content is SCORM-compliant for LMS compatibility.',
    category: 'integration',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Network,
    tags: ['SCORM', 'LMS', 'Compatibility', 'Standards']
  },
]

export default function EdTechResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [savedResources, setSavedResources] = useState<string[]>([])

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesType = selectedType === 'all' || resource.type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const handleSave = (resourceId: string) => {
    if (savedResources.includes(resourceId)) {
      setSavedResources(savedResources.filter(id => id !== resourceId))
      showToast('Resource removed from saved', 'info')
    } else {
      setSavedResources([...savedResources, resourceId])
      showToast('Resource saved!', 'success')
    }
  }

  const typeLabels = {
    'tool': 'Tool',
    'guide': 'Guide',
    'template': 'Template',
    'course': 'Course'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              EdTech Resources
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Specialized resources for educational technology startups. From LMS setup to compliance, find everything you need to build and scale your EdTech platform.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">{resources.length}</div>
              <div className="text-sm text-gray-600">Resources</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {resources.filter(r => r.type === 'tool').length}
              </div>
              <div className="text-sm text-gray-600">Tools</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {resources.filter(r => r.type === 'guide').length}
              </div>
              <div className="text-sm text-gray-600">Guides</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {categories.length - 1}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </Card>
          </div>
        </div>

        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full"
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'tool', label: 'Tools' },
                { value: 'guide', label: 'Guides' },
                { value: 'template', label: 'Templates' },
                { value: 'course', label: 'Courses' }
              ]}
            />
          </div>
        </Card>

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

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredResources.map((resource) => {
              const Icon = resource.icon
              const isSaved = savedResources.includes(resource.id)
              
              return (
                <Card key={resource.id} className="flex flex-col hover:shadow-lg transition-all">
                  <div className="relative">
                    {resource.featured && (
                      <Badge variant="featured" className="absolute top-2 right-2 z-10">
                        Featured
                      </Badge>
                    )}
                    {resource.popular && (
                      <Badge variant="popular" className="absolute top-2 left-2 z-10">
                        Popular
                      </Badge>
                    )}
                    <div className="bg-primary-500/10 p-4 rounded-lg text-primary-500 mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold flex-1">{resource.title}</h3>
                    <Badge variant="outline" className="text-xs capitalize">
                      {typeLabels[resource.type]}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{resource.description}</p>
                  
                  <div className="mb-4">
                    {resource.rating && (
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{resource.rating}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={resource.link} className="flex-1">
                      <Button className="w-full" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Resource
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave(resource.id)}
                    >
                      {isSaved ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <BookOpen className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </main>
  )
}

