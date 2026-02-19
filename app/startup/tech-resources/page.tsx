'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { Code, Database, Cloud, Shield, Search, Star, ExternalLink, CheckCircle, Terminal, Server, GitBranch, Layers, Zap, Globe, Smartphone, Lock, BarChart, Settings, Cpu, Network, FileText, Video, BookOpen, TrendingUp } from 'lucide-react'
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
  { id: 'all', name: 'All Categories', icon: Code },
  { id: 'tech-stack', name: 'Tech Stack', icon: Layers },
  { id: 'cloud', name: 'Cloud & Infrastructure', icon: Cloud },
  { id: 'devops', name: 'DevOps', icon: GitBranch },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'apis', name: 'APIs & Integrations', icon: Network },
  { id: 'databases', name: 'Databases', icon: Database },
  { id: 'monitoring', name: 'Monitoring & Analytics', icon: BarChart },
]

const resources: Resource[] = [
  // Tech Stack
  {
    id: '1',
    title: 'Tech Stack Builder',
    description: 'Choose the right technology stack for your SaaS startup with interactive recommendations.',
    category: 'tech-stack',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Layers,
    tags: ['Frontend', 'Backend', 'Database', 'Framework'],
    rating: 4.9
  },
  {
    id: '2',
    title: 'Frontend Framework Comparison',
    description: 'Compare React, Vue, Angular, and Svelte to choose the best frontend framework.',
    category: 'tech-stack',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: Globe,
    tags: ['React', 'Vue', 'Angular', 'Comparison']
  },
  {
    id: '3',
    title: 'Backend Technology Guide',
    description: 'Comprehensive guide to choosing between Node.js, Python, Go, and other backend technologies.',
    category: 'tech-stack',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Server,
    tags: ['Node.js', 'Python', 'Go', 'Backend']
  },
  
  // Cloud & Infrastructure
  {
    id: '4',
    title: 'Cloud Infrastructure Setup',
    description: 'Set up scalable cloud infrastructure on AWS, Azure, or GCP with step-by-step guides.',
    category: 'cloud',
    type: 'tool',
    link: '/startup/tech/cloud',
    featured: true,
    popular: true,
    icon: Cloud,
    tags: ['AWS', 'Azure', 'GCP', 'Infrastructure'],
    rating: 4.8
  },
  {
    id: '5',
    title: 'Cloud Cost Optimization',
    description: 'Learn strategies to reduce cloud costs while maintaining performance and scalability.',
    category: 'cloud',
    type: 'guide',
    link: '/startup/tech/cloud',
    popular: true,
    icon: TrendingUp,
    tags: ['Cost Optimization', 'AWS', 'Azure', 'GCP']
  },
  {
    id: '6',
    title: 'Serverless Architecture Guide',
    description: 'Build scalable applications using serverless technologies like Lambda and Functions.',
    category: 'cloud',
    type: 'guide',
    link: '/startup/tech/cloud',
    icon: Zap,
    tags: ['Serverless', 'Lambda', 'Functions', 'Architecture']
  },
  
  // DevOps
  {
    id: '7',
    title: 'DevOps & Deployment',
    description: 'Implement CI/CD pipelines and deployment best practices for your startup.',
    category: 'devops',
    type: 'tool',
    link: '/startup/tech/devops',
    featured: true,
    popular: true,
    icon: GitBranch,
    tags: ['CI/CD', 'Docker', 'Kubernetes', 'Deployment'],
    rating: 4.8
  },
  {
    id: '8',
    title: 'Docker & Containerization',
    description: 'Master Docker and containerization for consistent deployments across environments.',
    category: 'devops',
    type: 'course',
    link: '/startup/technical-skills',
    popular: true,
    icon: Terminal,
    tags: ['Docker', 'Containers', 'DevOps', 'Deployment']
  },
  {
    id: '9',
    title: 'Kubernetes Orchestration',
    description: 'Learn to orchestrate containers at scale with Kubernetes.',
    category: 'devops',
    type: 'course',
    link: '/startup/technical-skills',
    icon: Settings,
    tags: ['Kubernetes', 'Orchestration', 'Scaling', 'DevOps']
  },
  
  // Security
  {
    id: '10',
    title: 'Security Fundamentals',
    description: 'Essential security practices and best practices for tech startups.',
    category: 'security',
    type: 'guide',
    link: '/startup/tech/ai-ml',
    featured: true,
    popular: true,
    icon: Shield,
    tags: ['Security', 'Best Practices', 'Compliance', 'OWASP'],
    rating: 4.7
  },
  {
    id: '11',
    title: 'API Security Guide',
    description: 'Secure your APIs against common vulnerabilities and attacks.',
    category: 'security',
    type: 'guide',
    link: '/startup/tech/ai-ml',
    icon: Lock,
    tags: ['API Security', 'Authentication', 'Authorization', 'OAuth']
  },
  {
    id: '12',
    title: 'Data Protection & Privacy',
    description: 'Implement GDPR, CCPA, and other data protection regulations.',
    category: 'security',
    type: 'guide',
    link: '/startup/legal/privacy',
    icon: Shield,
    tags: ['GDPR', 'CCPA', 'Data Protection', 'Privacy']
  },
  
  // APIs & Integrations
  {
    id: '13',
    title: 'API Design Best Practices',
    description: 'Design RESTful and GraphQL APIs that are scalable and developer-friendly.',
    category: 'apis',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    icon: Network,
    tags: ['REST', 'GraphQL', 'API Design', 'Documentation']
  },
  {
    id: '14',
    title: 'Third-Party Integration Guide',
    description: 'Integrate popular services like Stripe, Twilio, and SendGrid into your SaaS.',
    category: 'apis',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: Network,
    tags: ['Stripe', 'Twilio', 'SendGrid', 'Integrations']
  },
  {
    id: '15',
    title: 'Webhook Implementation',
    description: 'Build reliable webhook systems for real-time integrations.',
    category: 'apis',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Zap,
    tags: ['Webhooks', 'Real-time', 'Integrations', 'Events']
  },
  
  // Databases
  {
    id: '16',
    title: 'Database Best Practices',
    description: 'Learn database design, optimization, and scaling strategies.',
    category: 'databases',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Database,
    tags: ['SQL', 'NoSQL', 'Database Design', 'Optimization'],
    rating: 4.6
  },
  {
    id: '17',
    title: 'Database Selection Guide',
    description: 'Choose between PostgreSQL, MySQL, MongoDB, and other databases.',
    category: 'databases',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Database,
    tags: ['PostgreSQL', 'MySQL', 'MongoDB', 'Selection']
  },
  {
    id: '18',
    title: 'Database Migration Strategies',
    description: 'Plan and execute database migrations safely and efficiently.',
    category: 'databases',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Database,
    tags: ['Migration', 'Data Migration', 'Zero Downtime', 'Strategy']
  },
  
  // Monitoring & Analytics
  {
    id: '19',
    title: 'Application Monitoring Setup',
    description: 'Set up comprehensive monitoring and alerting for your SaaS application.',
    category: 'monitoring',
    type: 'tool',
    link: '/startup/tech/devops',
    featured: true,
    icon: BarChart,
    tags: ['Monitoring', 'Alerting', 'APM', 'Observability']
  },
  {
    id: '20',
    title: 'Error Tracking & Logging',
    description: 'Implement error tracking and centralized logging for better debugging.',
    category: 'monitoring',
    type: 'guide',
    link: '/startup/tech/devops',
    popular: true,
    icon: BarChart,
    tags: ['Error Tracking', 'Logging', 'Debugging', 'Sentry']
  },
  {
    id: '21',
    title: 'Performance Monitoring',
    description: 'Monitor application performance and identify bottlenecks.',
    category: 'monitoring',
    type: 'guide',
    link: '/startup/tech/devops',
    icon: TrendingUp,
    tags: ['Performance', 'APM', 'Metrics', 'Optimization']
  },
  
  // AI & ML
  {
    id: '22',
    title: 'AI & ML Integration',
    description: 'Integrate artificial intelligence and machine learning into your SaaS product.',
    category: 'tech-stack',
    type: 'tool',
    link: '/startup/tech/ai-ml',
    featured: true,
    popular: true,
    icon: Cpu,
    tags: ['AI', 'Machine Learning', 'Integration', 'APIs'],
    rating: 4.8
  },
  {
    id: '23',
    title: 'OpenAI API Integration',
    description: 'Add AI capabilities to your product using OpenAI and other AI APIs.',
    category: 'apis',
    type: 'guide',
    link: '/startup/tech/ai-ml',
    popular: true,
    icon: Cpu,
    tags: ['OpenAI', 'GPT', 'AI Integration', 'LLM']
  },
]

export default function TechResourcesPage() {
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

  const CategoryIcon = categories.find(c => c.id === selectedCategory)?.icon || Code

  const typeLabels = {
    'tool': 'Tool',
    'guide': 'Guide',
    'template': 'Template',
    'course': 'Course'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
            Tech & SaaS Resources
          </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Comprehensive resources and tools specifically designed for tech and SaaS startups. From tech stack selection to deployment, find everything you need.
          </p>
          
          {/* Stats */}
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

        {/* Filters */}
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

        {/* Resources Grid */}
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
            <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        )}

        {/* Saved Resources */}
        {savedResources.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">Saved Resources ({savedResources.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.filter(r => savedResources.includes(r.id)).map((resource) => {
                const Icon = resource.icon
                return (
                  <Card key={resource.id} className="p-4 bg-primary-50 border-primary-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary-500" />
                        <h3 className="font-semibold">{resource.title}</h3>
                      </div>
                      <CheckCircle className="h-5 w-5 text-primary-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <Link href={resource.link}>
                      <Button size="sm" variant="outline" className="w-full">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open Resource
                      </Button>
                    </Link>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick Links Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/startup/tech/stack-builder">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <Layers className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Tech Stack Builder</h3>
                <p className="text-sm text-gray-600">Build your tech stack</p>
              </Card>
            </Link>
            
            <Link href="/startup/tech/cloud">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <Cloud className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Cloud Setup</h3>
                <p className="text-sm text-gray-600">Infrastructure setup</p>
              </Card>
            </Link>
            
            <Link href="/startup/tech/devops">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <GitBranch className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">DevOps Tools</h3>
                <p className="text-sm text-gray-600">CI/CD & deployment</p>
              </Card>
            </Link>
            
            <Link href="/startup/tech/ai-ml">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <Cpu className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">AI & ML</h3>
                <p className="text-sm text-gray-600">AI integration</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Additional Resources Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <Video className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Video Tutorials</h3>
              <p className="text-sm text-gray-600 mb-4">Watch step-by-step video tutorials for common tech tasks</p>
              <Link href="/startup/technical-skills">
                <Button variant="outline" size="sm" className="w-full">
                  Watch Videos
                </Button>
              </Link>
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
              <BookOpen className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Best Practices Library</h3>
              <p className="text-sm text-gray-600 mb-4">Access industry best practices and coding standards</p>
              <Button variant="outline" size="sm" className="w-full">
                Browse Library
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
