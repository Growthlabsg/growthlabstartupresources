'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Link from 'next/link'
import { Settings, Code, Database, Server, Globe, Smartphone, Shield, Zap, CheckCircle, Circle, Star, ArrowRight, Download, Layers, Box, Cloud, GitBranch, Lock, Cpu, BarChart, BookOpen, ExternalLink } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface Technology {
  id: string
  name: string
  category: string
  description: string
  pros: string[]
  cons: string[]
  useCases: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  popularity: number
  cost: 'free' | 'freemium' | 'paid'
  scalability: 'low' | 'medium' | 'high'
  link?: string
}

interface StackTemplate {
  id: string
  name: string
  description: string
  type: string
  frontend: string[]
  backend: string[]
  database: string[]
  hosting: string[]
  extras: string[]
  recommended: boolean
}

const categories = [
  { id: 'frontend', name: 'Frontend', icon: Globe, color: 'blue' },
  { id: 'backend', name: 'Backend', icon: Server, color: 'green' },
  { id: 'database', name: 'Database', icon: Database, color: 'purple' },
  { id: 'hosting', name: 'Hosting & Cloud', icon: Cloud, color: 'orange' },
  { id: 'mobile', name: 'Mobile', icon: Smartphone, color: 'pink' },
  { id: 'devtools', name: 'Dev Tools', icon: GitBranch, color: 'gray' },
]

const technologies: Technology[] = [
  // Frontend
  { id: 'react', name: 'React', category: 'frontend', description: 'Popular JavaScript library for building user interfaces', pros: ['Large ecosystem', 'Virtual DOM', 'Component-based'], cons: ['Learning curve', 'Frequent updates'], useCases: ['SPAs', 'Complex UIs', 'Enterprise apps'], difficulty: 'intermediate', popularity: 95, cost: 'free', scalability: 'high', link: 'https://react.dev' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', description: 'React framework with SSR, SSG, and API routes', pros: ['SEO-friendly', 'Great DX', 'Full-stack capable'], cons: ['Vercel-centric', 'Can be complex'], useCases: ['Web apps', 'E-commerce', 'Marketing sites'], difficulty: 'intermediate', popularity: 90, cost: 'free', scalability: 'high', link: 'https://nextjs.org' },
  { id: 'vue', name: 'Vue.js', category: 'frontend', description: 'Progressive JavaScript framework for building UIs', pros: ['Easy to learn', 'Flexible', 'Great docs'], cons: ['Smaller ecosystem', 'Less jobs'], useCases: ['SPAs', 'Widgets', 'Prototypes'], difficulty: 'beginner', popularity: 75, cost: 'free', scalability: 'high', link: 'https://vuejs.org' },
  { id: 'angular', name: 'Angular', category: 'frontend', description: 'Full-featured framework by Google', pros: ['Complete solution', 'TypeScript', 'Enterprise-ready'], cons: ['Steep learning curve', 'Verbose'], useCases: ['Enterprise apps', 'Complex SPAs'], difficulty: 'advanced', popularity: 65, cost: 'free', scalability: 'high', link: 'https://angular.io' },
  { id: 'svelte', name: 'Svelte', category: 'frontend', description: 'Compiler-based framework with no virtual DOM', pros: ['Fast performance', 'Small bundle', 'Simple syntax'], cons: ['Smaller community', 'Less tooling'], useCases: ['Performance-critical apps', 'Small projects'], difficulty: 'beginner', popularity: 55, cost: 'free', scalability: 'medium', link: 'https://svelte.dev' },
  
  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'backend', description: 'JavaScript runtime for server-side development', pros: ['Same language as frontend', 'Fast I/O', 'Large npm ecosystem'], cons: ['Single-threaded', 'Callback complexity'], useCases: ['APIs', 'Real-time apps', 'Microservices'], difficulty: 'intermediate', popularity: 90, cost: 'free', scalability: 'high', link: 'https://nodejs.org' },
  { id: 'python', name: 'Python/Django/FastAPI', category: 'backend', description: 'Versatile language with powerful frameworks', pros: ['Easy to learn', 'Great for AI/ML', 'Clean syntax'], cons: ['Slower than compiled', 'GIL limitations'], useCases: ['APIs', 'Data processing', 'AI/ML apps'], difficulty: 'beginner', popularity: 88, cost: 'free', scalability: 'high', link: 'https://www.python.org' },
  { id: 'go', name: 'Go (Golang)', category: 'backend', description: 'Fast, compiled language by Google', pros: ['Very fast', 'Great concurrency', 'Simple syntax'], cons: ['Less libraries', 'Verbose error handling'], useCases: ['High-performance APIs', 'Microservices', 'CLIs'], difficulty: 'intermediate', popularity: 70, cost: 'free', scalability: 'high', link: 'https://go.dev' },
  { id: 'rust', name: 'Rust', category: 'backend', description: 'Systems programming language with memory safety', pros: ['Extremely fast', 'Memory safe', 'Growing ecosystem'], cons: ['Steep learning curve', 'Longer dev time'], useCases: ['Systems programming', 'Performance-critical'], difficulty: 'advanced', popularity: 55, cost: 'free', scalability: 'high', link: 'https://www.rust-lang.org' },
  { id: 'java', name: 'Java/Spring Boot', category: 'backend', description: 'Enterprise-grade language and framework', pros: ['Mature ecosystem', 'Enterprise support', 'Strong typing'], cons: ['Verbose', 'Heavy memory usage'], useCases: ['Enterprise apps', 'Android', 'Big data'], difficulty: 'intermediate', popularity: 75, cost: 'free', scalability: 'high', link: 'https://spring.io/projects/spring-boot' },
  
  // Database
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', description: 'Advanced open-source relational database', pros: ['Feature-rich', 'ACID compliant', 'Great for complex queries'], cons: ['Can be complex', 'Slower writes'], useCases: ['Complex data', 'Financial apps', 'Analytics'], difficulty: 'intermediate', popularity: 90, cost: 'free', scalability: 'high', link: 'https://www.postgresql.org' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', description: 'Popular NoSQL document database', pros: ['Flexible schema', 'Easy scaling', 'JSON-like docs'], cons: ['No joins', 'Eventual consistency'], useCases: ['Content apps', 'Real-time', 'Prototypes'], difficulty: 'beginner', popularity: 85, cost: 'freemium', scalability: 'high', link: 'https://www.mongodb.com' },
  { id: 'mysql', name: 'MySQL', category: 'database', description: 'Most popular open-source relational database', pros: ['Well-documented', 'Wide support', 'Fast reads'], cons: ['Less features than Postgres', 'Scaling challenges'], useCases: ['Web apps', 'CMS', 'E-commerce'], difficulty: 'beginner', popularity: 80, cost: 'free', scalability: 'medium', link: 'https://www.mysql.com' },
  { id: 'redis', name: 'Redis', category: 'database', description: 'In-memory data store for caching and messaging', pros: ['Extremely fast', 'Versatile', 'Pub/Sub support'], cons: ['Memory-limited', 'Persistence options'], useCases: ['Caching', 'Sessions', 'Real-time'], difficulty: 'beginner', popularity: 88, cost: 'freemium', scalability: 'high', link: 'https://redis.io' },
  { id: 'supabase', name: 'Supabase', category: 'database', description: 'Open-source Firebase alternative with Postgres', pros: ['Easy setup', 'Real-time', 'Auth included'], cons: ['Newer platform', 'Vendor lock-in'], useCases: ['MVPs', 'Real-time apps', 'Auth-heavy apps'], difficulty: 'beginner', popularity: 75, cost: 'freemium', scalability: 'high', link: 'https://supabase.com' },
  
  // Hosting
  { id: 'vercel', name: 'Vercel', category: 'hosting', description: 'Platform optimized for Next.js and frontend', pros: ['Zero config', 'Great DX', 'Edge network'], cons: ['Can get expensive', 'Best for Next.js'], useCases: ['Next.js apps', 'Static sites', 'Serverless'], difficulty: 'beginner', popularity: 90, cost: 'freemium', scalability: 'high', link: 'https://vercel.com' },
  { id: 'aws', name: 'AWS', category: 'hosting', description: 'Comprehensive cloud platform by Amazon', pros: ['Full-featured', 'Enterprise-ready', 'Global reach'], cons: ['Complex pricing', 'Steep learning curve'], useCases: ['Enterprise', 'Complex infra', 'Any scale'], difficulty: 'advanced', popularity: 95, cost: 'paid', scalability: 'high', link: 'https://aws.amazon.com' },
  { id: 'gcp', name: 'Google Cloud', category: 'hosting', description: 'Cloud platform with strong AI/ML and data services', pros: ['Great for AI/ML', 'Good pricing', 'Strong data tools'], cons: ['Less services than AWS', 'UI can be confusing'], useCases: ['AI/ML apps', 'Data processing', 'Kubernetes'], difficulty: 'advanced', popularity: 80, cost: 'paid', scalability: 'high', link: 'https://cloud.google.com' },
  { id: 'railway', name: 'Railway', category: 'hosting', description: 'Simple deployment platform for full-stack apps', pros: ['Easy setup', 'Great DX', 'Affordable'], cons: ['Newer platform', 'Less features'], useCases: ['Full-stack apps', 'Side projects', 'MVPs'], difficulty: 'beginner', popularity: 70, cost: 'freemium', scalability: 'medium', link: 'https://railway.app' },
  { id: 'fly', name: 'Fly.io', category: 'hosting', description: 'Edge-first deployment platform', pros: ['Global edge', 'Docker-based', 'Good pricing'], cons: ['Learning curve', 'CLI-focused'], useCases: ['Global apps', 'Containers', 'APIs'], difficulty: 'intermediate', popularity: 65, cost: 'freemium', scalability: 'high', link: 'https://fly.io' },
  
  // Mobile
  { id: 'reactnative', name: 'React Native', category: 'mobile', description: 'Cross-platform mobile development with React', pros: ['Code sharing', 'Large community', 'Hot reload'], cons: ['Performance overhead', 'Native bridges'], useCases: ['Cross-platform apps', 'MVPs'], difficulty: 'intermediate', popularity: 85, cost: 'free', scalability: 'high', link: 'https://reactnative.dev' },
  { id: 'flutter', name: 'Flutter', category: 'mobile', description: 'Google\'s UI toolkit for cross-platform apps', pros: ['Great UI', 'Fast development', 'Single codebase'], cons: ['Dart language', 'Larger app size'], useCases: ['Beautiful apps', 'Cross-platform'], difficulty: 'intermediate', popularity: 80, cost: 'free', scalability: 'high', link: 'https://flutter.dev' },
  { id: 'expo', name: 'Expo', category: 'mobile', description: 'Platform for universal React applications', pros: ['Easy setup', 'OTA updates', 'Great DX'], cons: ['Limited native modules', 'Expo Go limitations'], useCases: ['React Native apps', 'Prototypes'], difficulty: 'beginner', popularity: 75, cost: 'freemium', scalability: 'medium', link: 'https://expo.dev' },
  
  // Dev Tools
  { id: 'github', name: 'GitHub', category: 'devtools', description: 'Code hosting and collaboration platform', pros: ['Industry standard', 'Great CI/CD', 'Large community'], cons: ['Microsoft-owned', 'Pricing for private'], useCases: ['All projects', 'Open source', 'Teams'], difficulty: 'beginner', popularity: 98, cost: 'freemium', scalability: 'high', link: 'https://github.com' },
  { id: 'docker', name: 'Docker', category: 'devtools', description: 'Container platform for consistent environments', pros: ['Reproducible builds', 'Easy deployment', 'Isolation'], cons: ['Resource overhead', 'Learning curve'], useCases: ['Microservices', 'CI/CD', 'Local dev'], difficulty: 'intermediate', popularity: 90, cost: 'freemium', scalability: 'high', link: 'https://www.docker.com' },
  { id: 'vscode', name: 'VS Code', category: 'devtools', description: 'Popular code editor by Microsoft', pros: ['Free', 'Extensible', 'Great for all languages'], cons: ['Can be resource-heavy', 'Microsoft telemetry'], useCases: ['All development', 'Any language'], difficulty: 'beginner', popularity: 95, cost: 'free', scalability: 'high', link: 'https://code.visualstudio.com' },
]

const stackTemplates: StackTemplate[] = [
  {
    id: 'modern-saas',
    name: 'Modern SaaS Stack',
    description: 'Production-ready stack for SaaS applications with great DX and scalability',
    type: 'SaaS',
    frontend: ['Next.js', 'Tailwind CSS', 'TypeScript'],
    backend: ['Node.js', 'tRPC or REST API'],
    database: ['PostgreSQL', 'Prisma ORM', 'Redis'],
    hosting: ['Vercel', 'PlanetScale or Supabase'],
    extras: ['Stripe', 'Auth.js', 'Resend'],
    recommended: true
  },
  {
    id: 'startup-mvp',
    name: 'Rapid MVP Stack',
    description: 'Get to market fast with minimal setup and maximum productivity',
    type: 'MVP',
    frontend: ['Next.js', 'Tailwind CSS'],
    backend: ['Next.js API Routes'],
    database: ['Supabase or Firebase'],
    hosting: ['Vercel'],
    extras: ['Clerk Auth', 'Shadcn UI'],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Stack',
    description: 'Battle-tested technologies for large-scale enterprise applications',
    type: 'Enterprise',
    frontend: ['React', 'TypeScript', 'Material UI'],
    backend: ['Java Spring Boot or .NET'],
    database: ['PostgreSQL', 'Redis', 'Elasticsearch'],
    hosting: ['AWS or Azure', 'Kubernetes'],
    extras: ['Keycloak', 'Kong API Gateway'],
    recommended: false
  },
  {
    id: 'ai-startup',
    name: 'AI/ML Startup Stack',
    description: 'Optimized for AI-powered applications with ML capabilities',
    type: 'AI/ML',
    frontend: ['Next.js', 'React'],
    backend: ['Python FastAPI', 'Node.js'],
    database: ['PostgreSQL', 'Pinecone Vector DB'],
    hosting: ['Railway', 'Modal or Replicate'],
    extras: ['OpenAI API', 'LangChain', 'Hugging Face'],
    recommended: true
  },
  {
    id: 'mobile-first',
    name: 'Mobile-First Stack',
    description: 'Cross-platform mobile development with shared backend',
    type: 'Mobile',
    frontend: ['React Native + Expo'],
    backend: ['Node.js', 'GraphQL'],
    database: ['Supabase', 'AsyncStorage'],
    hosting: ['Railway', 'Expo EAS'],
    extras: ['RevenueCat', 'Sentry', 'Analytics'],
    recommended: false
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Stack',
    description: 'Complete stack for online stores and marketplaces',
    type: 'E-Commerce',
    frontend: ['Next.js', 'Shopify Hydrogen'],
    backend: ['Node.js', 'Medusa or Saleor'],
    database: ['PostgreSQL', 'Redis'],
    hosting: ['Vercel', 'AWS S3'],
    extras: ['Stripe', 'Algolia', 'Sanity CMS'],
    recommended: false
  },
]

export default function TechStackBuilderPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [showTemplates, setShowTemplates] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedTechStack')
      if (saved) {
        setSelectedTechs(JSON.parse(saved))
      }
    }
  }, [])

  const toggleTech = (techId: string) => {
    const updated = selectedTechs.includes(techId)
      ? selectedTechs.filter(id => id !== techId)
      : [...selectedTechs, techId]
    setSelectedTechs(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTechStack', JSON.stringify(updated))
    }
    showToast(
      selectedTechs.includes(techId) ? 'Technology removed' : 'Technology added to stack',
      'success'
    )
  }

  const applyTemplate = (template: StackTemplate) => {
    const allTechs = [...template.frontend, ...template.backend, ...template.database, ...template.hosting, ...template.extras]
    const techIds = technologies
      .filter(t => allTechs.some(name => t.name.toLowerCase().includes(name.toLowerCase())))
      .map(t => t.id)
    setSelectedTechs(techIds)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTechStack', JSON.stringify(techIds))
    }
    showToast(`Applied ${template.name} template`, 'success')
  }

  const filteredTechs = technologies.filter(tech => {
    const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = difficultyFilter === 'all' || tech.difficulty === difficultyFilter
    return matchesCategory && matchesSearch && matchesDifficulty
  })

  const exportStack = () => {
    const stack = technologies.filter(t => selectedTechs.includes(t.id))
    const data = {
      exportDate: new Date().toISOString(),
      stack: stack.map(t => ({
        name: t.name,
        category: t.category,
        description: t.description,
        link: t.link
      }))
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tech-stack-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Tech stack exported!', 'success')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="featured" className="text-sm">Technology</Badge>
            <Link href="/startup/tech/cloud">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                Cloud Infrastructure <ArrowRight className="h-3 w-3 ml-1 inline" />
              </Badge>
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Tech Stack Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Build your perfect technology stack. Compare technologies, get recommendations, and export your choices.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{technologies.length}</div>
            <div className="text-sm text-gray-600">Technologies</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{stackTemplates.length}</div>
            <div className="text-sm text-gray-600">Templates</div>
          </Card>
          <Card className="p-4 text-center bg-primary-50">
            <div className="text-3xl font-bold text-primary-500 mb-1">{selectedTechs.length}</div>
            <div className="text-sm text-gray-600">Selected</div>
          </Card>
        </div>

        {/* Stack Templates */}
        {showTemplates && (
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary-500" />
                Quick Start Templates
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowTemplates(false)}>
                Hide
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stackTemplates.map(template => (
                <Card 
                  key={template.id}
                  className={`p-4 cursor-pointer hover:shadow-lg transition-all ${template.recommended ? 'border-primary-300' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold">{template.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">{template.type}</Badge>
                    </div>
                    {template.recommended && (
                      <Badge variant="new" className="text-xs">Recommended</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="space-y-2 text-xs mb-3">
                    <div><span className="font-medium">Frontend:</span> {template.frontend.join(', ')}</div>
                    <div><span className="font-medium">Backend:</span> {template.backend.join(', ')}</div>
                    <div><span className="font-medium">Database:</span> {template.database.join(', ')}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                    onClick={() => applyTemplate(template)}
              >
                    Use This Template
              </Button>
            </Card>
          ))}
            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories & Filters */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    selectedCategory === 'all' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    <span className="text-sm font-medium">All Technologies</span>
                  </div>
                </button>
                {categories.map(cat => {
                  const Icon = cat.icon
                  const count = technologies.filter(t => t.category === cat.id).length
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        selectedCategory === cat.id ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 text-${cat.color}-500`} />
                          <span className="text-sm font-medium">{cat.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{count}</Badge>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                  <Input
                    placeholder="Search technologies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
                  <Select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Levels' },
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' },
                    ]}
                  />
                </div>
              </div>
            </Card>

            {/* Selected Stack */}
            {selectedTechs.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Your Stack ({selectedTechs.length})
                </h3>
                <div className="space-y-2 mb-4">
                  {technologies.filter(t => selectedTechs.includes(t.id)).map(tech => (
                    <div 
                      key={tech.id}
                      className="flex items-center justify-between p-2 bg-primary-50 rounded-lg"
                    >
                      <span className="text-sm font-medium">{tech.name}</span>
                      <button onClick={() => toggleTech(tech.id)}>
                        <span className="text-xs text-red-500 hover:underline">Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={exportStack}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Stack
                </Button>
              </Card>
            )}
          </div>

          {/* Technology Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTechs.map(tech => {
                const isSelected = selectedTechs.includes(tech.id)
                return (
                  <Card 
                    key={tech.id}
                    className={`p-4 hover:shadow-lg transition-all ${isSelected ? 'border-primary-500 bg-primary-50/50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{tech.name}</h3>
                          {tech.popularity >= 85 && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{categories.find(c => c.id === tech.category)?.name}</Badge>
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(tech.difficulty)}`}>
                            {tech.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleTech(tech.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{tech.description}</p>

                    <div className="space-y-2 mb-3">
                      <div>
                        <div className="text-xs font-medium text-green-600 mb-1">Pros</div>
                        <div className="flex flex-wrap gap-1">
                          {tech.pros.map((pro, idx) => (
                            <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              {pro}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-red-600 mb-1">Cons</div>
                        <div className="flex flex-wrap gap-1">
                          {tech.cons.map((con, idx) => (
                            <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                              {con}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <BarChart className="h-3 w-3" />
                          {tech.popularity}% popular
                        </span>
                        <span className="capitalize">{tech.cost}</span>
                      </div>
                      {tech.link && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(tech.link, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>

            {filteredTechs.length === 0 && (
              <Card className="p-12 text-center">
                <Code className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Technologies Found</h3>
                <p className="text-gray-600">Try adjusting your search or filters.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
