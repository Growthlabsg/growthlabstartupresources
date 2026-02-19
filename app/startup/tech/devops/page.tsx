'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Link from 'next/link'
import { Eye, CheckCircle, BarChart, GitBranch, Circle, Star, ArrowRight, Download, Zap, Server, Shield, Activity, Package, RefreshCw, Terminal, Clock, AlertCircle, Settings, ExternalLink, Layers, Box, Code, Play, FileText, BookOpen } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface DevOpsTool {
  id: string
  name: string
  category: string
  description: string
  features: string[]
  pricing: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  popularity: number
  link: string
  openSource: boolean
}

interface Pipeline {
  id: string
  name: string
  description: string
  stages: string[]
  tools: string[]
  complexity: 'simple' | 'moderate' | 'complex'
  recommended: boolean
}

interface BestPractice {
  id: string
  title: string
  description: string
  category: string
  impact: 'high' | 'medium' | 'low'
}

const categories = [
  { id: 'cicd', name: 'CI/CD', icon: RefreshCw, description: 'Continuous Integration & Deployment' },
  { id: 'containers', name: 'Containers', icon: Box, description: 'Container orchestration & management' },
  { id: 'monitoring', name: 'Monitoring', icon: Activity, description: 'Observability & alerting' },
  { id: 'logging', name: 'Logging', icon: FileText, description: 'Log management & analysis' },
  { id: 'security', name: 'Security', icon: Shield, description: 'DevSecOps & vulnerability scanning' },
  { id: 'infrastructure', name: 'Infrastructure as Code', icon: Code, description: 'IaC & configuration management' },
  { id: 'testing', name: 'Testing', icon: Play, description: 'Automated testing frameworks' },
]

const devOpsTools: DevOpsTool[] = [
  // CI/CD
  { id: 'github-actions', name: 'GitHub Actions', category: 'cicd', description: 'Native CI/CD for GitHub repositories with YAML workflows', features: ['Native GitHub integration', 'Marketplace actions', 'Matrix builds', 'Secrets management'], pricing: 'Free for public repos, 2000 min/month free', difficulty: 'beginner', popularity: 95, link: 'https://github.com/features/actions', openSource: false },
  { id: 'gitlab-ci', name: 'GitLab CI/CD', category: 'cicd', description: 'Built-in CI/CD with powerful pipeline features', features: ['Auto DevOps', 'Container registry', 'Environments', 'Review apps'], pricing: 'Free tier available', difficulty: 'intermediate', popularity: 85, link: 'https://docs.gitlab.com/ee/ci/', openSource: true },
  { id: 'jenkins', name: 'Jenkins', category: 'cicd', description: 'Most popular open-source automation server', features: ['Highly customizable', 'Plugin ecosystem', 'Pipeline as code', 'Self-hosted'], pricing: 'Free (self-hosted)', difficulty: 'advanced', popularity: 80, link: 'https://www.jenkins.io/', openSource: true },
  { id: 'circleci', name: 'CircleCI', category: 'cicd', description: 'Cloud-native CI/CD with fast builds', features: ['Orbs marketplace', 'Docker layer caching', 'Parallelism', 'Insights'], pricing: 'Free tier + pay per credit', difficulty: 'intermediate', popularity: 75, link: 'https://circleci.com/', openSource: false },
  { id: 'vercel-ci', name: 'Vercel', category: 'cicd', description: 'Zero-config deployment for frontend projects', features: ['Preview deployments', 'Edge functions', 'Analytics', 'Automatic HTTPS'], pricing: 'Free for hobby', difficulty: 'beginner', popularity: 90, link: 'https://vercel.com/', openSource: false },
  
  // Containers
  { id: 'docker', name: 'Docker', category: 'containers', description: 'Industry-standard containerization platform', features: ['Dockerfile', 'Docker Compose', 'Multi-stage builds', 'Networking'], pricing: 'Free for personal', difficulty: 'intermediate', popularity: 98, link: 'https://www.docker.com/', openSource: true },
  { id: 'kubernetes', name: 'Kubernetes', category: 'containers', description: 'Container orchestration at scale', features: ['Auto-scaling', 'Self-healing', 'Load balancing', 'Rolling updates'], pricing: 'Free (managed services vary)', difficulty: 'advanced', popularity: 90, link: 'https://kubernetes.io/', openSource: true },
  { id: 'docker-compose', name: 'Docker Compose', category: 'containers', description: 'Multi-container Docker applications', features: ['YAML config', 'Service dependencies', 'Volume management', 'Networking'], pricing: 'Free', difficulty: 'beginner', popularity: 92, link: 'https://docs.docker.com/compose/', openSource: true },
  { id: 'podman', name: 'Podman', category: 'containers', description: 'Daemonless container engine', features: ['Rootless containers', 'Pod support', 'Docker compatible', 'No daemon'], pricing: 'Free', difficulty: 'intermediate', popularity: 60, link: 'https://podman.io/', openSource: true },
  
  // Monitoring
  { id: 'datadog', name: 'Datadog', category: 'monitoring', description: 'Unified monitoring and security platform', features: ['APM', 'Infrastructure', 'Logs', 'Synthetics'], pricing: 'Free tier + pay per host', difficulty: 'intermediate', popularity: 90, link: 'https://www.datadoghq.com/', openSource: false },
  { id: 'grafana', name: 'Grafana', category: 'monitoring', description: 'Open-source analytics and visualization', features: ['Dashboards', 'Alerting', 'Data sources', 'Plugins'], pricing: 'Free (self-hosted)', difficulty: 'intermediate', popularity: 92, link: 'https://grafana.com/', openSource: true },
  { id: 'prometheus', name: 'Prometheus', category: 'monitoring', description: 'Open-source monitoring and alerting toolkit', features: ['Time-series DB', 'PromQL', 'Pull-based', 'Service discovery'], pricing: 'Free', difficulty: 'intermediate', popularity: 88, link: 'https://prometheus.io/', openSource: true },
  { id: 'newrelic', name: 'New Relic', category: 'monitoring', description: 'Full-stack observability platform', features: ['APM', 'Browser', 'Mobile', 'Synthetics'], pricing: 'Free tier (100GB/month)', difficulty: 'intermediate', popularity: 78, link: 'https://newrelic.com/', openSource: false },
  { id: 'sentry', name: 'Sentry', category: 'monitoring', description: 'Error tracking and performance monitoring', features: ['Error tracking', 'Performance', 'Releases', 'Tracing'], pricing: 'Free tier available', difficulty: 'beginner', popularity: 88, link: 'https://sentry.io/', openSource: true },
  
  // Logging
  { id: 'elk', name: 'ELK Stack', category: 'logging', description: 'Elasticsearch, Logstash, Kibana for log management', features: ['Full-text search', 'Visualization', 'Log parsing', 'Scalable'], pricing: 'Free (self-hosted)', difficulty: 'advanced', popularity: 85, link: 'https://www.elastic.co/elastic-stack', openSource: true },
  { id: 'loki', name: 'Grafana Loki', category: 'logging', description: 'Like Prometheus, but for logs', features: ['Label-based', 'Cost-effective', 'Grafana native', 'LogQL'], pricing: 'Free', difficulty: 'intermediate', popularity: 75, link: 'https://grafana.com/oss/loki/', openSource: true },
  { id: 'papertrail', name: 'Papertrail', category: 'logging', description: 'Cloud-hosted log management', features: ['Real-time tail', 'Search', 'Alerts', 'Easy setup'], pricing: 'Free tier available', difficulty: 'beginner', popularity: 70, link: 'https://www.papertrail.com/', openSource: false },
  
  // Security
  { id: 'snyk', name: 'Snyk', category: 'security', description: 'Developer-first security platform', features: ['Dependency scanning', 'Container security', 'IaC scanning', 'Code analysis'], pricing: 'Free for open source', difficulty: 'beginner', popularity: 88, link: 'https://snyk.io/', openSource: false },
  { id: 'trivy', name: 'Trivy', category: 'security', description: 'Comprehensive vulnerability scanner', features: ['Container images', 'Filesystems', 'Git repos', 'Kubernetes'], pricing: 'Free', difficulty: 'intermediate', popularity: 80, link: 'https://trivy.dev/', openSource: true },
  { id: 'vault', name: 'HashiCorp Vault', category: 'security', description: 'Secrets management and data protection', features: ['Secrets engine', 'Dynamic secrets', 'Encryption', 'Access control'], pricing: 'Free (self-hosted)', difficulty: 'advanced', popularity: 85, link: 'https://www.vaultproject.io/', openSource: true },
  
  // Infrastructure as Code
  { id: 'terraform', name: 'Terraform', category: 'infrastructure', description: 'Infrastructure as Code for any cloud', features: ['Multi-cloud', 'State management', 'Modules', 'Providers'], pricing: 'Free (self-hosted)', difficulty: 'intermediate', popularity: 92, link: 'https://www.terraform.io/', openSource: true },
  { id: 'pulumi', name: 'Pulumi', category: 'infrastructure', description: 'IaC using real programming languages', features: ['TypeScript/Python/Go', 'Multi-cloud', 'State management', 'Testing'], pricing: 'Free for individuals', difficulty: 'intermediate', popularity: 70, link: 'https://www.pulumi.com/', openSource: true },
  { id: 'ansible', name: 'Ansible', category: 'infrastructure', description: 'Agentless automation and configuration', features: ['Playbooks', 'Inventory', 'Roles', 'Galaxy'], pricing: 'Free', difficulty: 'intermediate', popularity: 88, link: 'https://www.ansible.com/', openSource: true },
  
  // Testing
  { id: 'jest', name: 'Jest', category: 'testing', description: 'JavaScript testing framework', features: ['Zero config', 'Snapshots', 'Mocking', 'Coverage'], pricing: 'Free', difficulty: 'beginner', popularity: 95, link: 'https://jestjs.io/', openSource: true },
  { id: 'cypress', name: 'Cypress', category: 'testing', description: 'Modern E2E testing framework', features: ['Time travel', 'Real-time reloads', 'Automatic waiting', 'Screenshots'], pricing: 'Free + paid cloud', difficulty: 'beginner', popularity: 88, link: 'https://www.cypress.io/', openSource: true },
  { id: 'playwright', name: 'Playwright', category: 'testing', description: 'Cross-browser E2E testing by Microsoft', features: ['Multi-browser', 'Auto-wait', 'Tracing', 'Mobile'], pricing: 'Free', difficulty: 'intermediate', popularity: 82, link: 'https://playwright.dev/', openSource: true },
  { id: 'k6', name: 'k6', category: 'testing', description: 'Modern load testing tool', features: ['JavaScript', 'CLI', 'Cloud', 'Metrics'], pricing: 'Free + paid cloud', difficulty: 'intermediate', popularity: 75, link: 'https://k6.io/', openSource: true },
]

const pipelineTemplates: Pipeline[] = [
  {
    id: 'simple-web',
    name: 'Simple Web App Pipeline',
    description: 'Basic CI/CD for web applications with testing and deployment',
    stages: ['Lint', 'Test', 'Build', 'Deploy'],
    tools: ['GitHub Actions', 'Jest', 'Vercel'],
    complexity: 'simple',
    recommended: true
  },
  {
    id: 'docker-k8s',
    name: 'Docker + Kubernetes Pipeline',
    description: 'Containerized deployment with Kubernetes orchestration',
    stages: ['Test', 'Build Image', 'Push Registry', 'Deploy to K8s'],
    tools: ['GitHub Actions', 'Docker', 'Kubernetes', 'Trivy'],
    complexity: 'complex',
    recommended: false
  },
  {
    id: 'full-stack',
    name: 'Full-Stack Pipeline',
    description: 'Complete pipeline for full-stack applications',
    stages: ['Lint', 'Unit Tests', 'Build', 'E2E Tests', 'Deploy Staging', 'Deploy Prod'],
    tools: ['GitHub Actions', 'Jest', 'Cypress', 'Docker', 'AWS'],
    complexity: 'moderate',
    recommended: true
  },
  {
    id: 'microservices',
    name: 'Microservices Pipeline',
    description: 'Multi-service deployment with independent pipelines',
    stages: ['Test', 'Build', 'Security Scan', 'Deploy', 'Smoke Tests'],
    tools: ['GitLab CI', 'Docker', 'Kubernetes', 'Snyk', 'Prometheus'],
    complexity: 'complex',
    recommended: false
  },
]

const bestPractices: BestPractice[] = [
  { id: '1', title: 'Automate Everything', description: 'Automate testing, building, and deployment to reduce human error', category: 'cicd', impact: 'high' },
  { id: '2', title: 'Use Infrastructure as Code', description: 'Version control your infrastructure for reproducibility', category: 'infrastructure', impact: 'high' },
  { id: '3', title: 'Implement Blue-Green Deployments', description: 'Zero-downtime deployments with easy rollback', category: 'cicd', impact: 'medium' },
  { id: '4', title: 'Monitor Everything', description: 'Set up comprehensive monitoring and alerting', category: 'monitoring', impact: 'high' },
  { id: '5', title: 'Shift Security Left', description: 'Integrate security scanning early in the pipeline', category: 'security', impact: 'high' },
  { id: '6', title: 'Use Feature Flags', description: 'Deploy code without releasing features', category: 'cicd', impact: 'medium' },
  { id: '7', title: 'Implement Proper Logging', description: 'Structured logging with correlation IDs', category: 'logging', impact: 'medium' },
  { id: '8', title: 'Run Tests in Parallel', description: 'Speed up CI by parallelizing test suites', category: 'testing', impact: 'medium' },
  { id: '9', title: 'Use Immutable Infrastructure', description: 'Replace servers instead of updating them', category: 'infrastructure', impact: 'high' },
  { id: '10', title: 'Implement GitOps', description: 'Use Git as single source of truth for deployments', category: 'cicd', impact: 'high' },
]

export default function DevOpsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [showOpenSourceOnly, setShowOpenSourceOnly] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedDevOpsTools')
      if (saved) {
        setSelectedTools(JSON.parse(saved))
      }
    }
  }, [])

  const toggleTool = (toolId: string) => {
    const updated = selectedTools.includes(toolId)
      ? selectedTools.filter(id => id !== toolId)
      : [...selectedTools, toolId]
    setSelectedTools(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedDevOpsTools', JSON.stringify(updated))
    }
    showToast(
      selectedTools.includes(toolId) ? 'Tool removed' : 'Tool added',
      'success'
    )
  }

  const filteredTools = devOpsTools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = difficultyFilter === 'all' || tool.difficulty === difficultyFilter
    const matchesOpenSource = !showOpenSourceOnly || tool.openSource
    return matchesCategory && matchesSearch && matchesDifficulty && matchesOpenSource
  })

  const exportToolchain = () => {
    const tools = devOpsTools.filter(t => selectedTools.includes(t.id))
    const data = {
      exportDate: new Date().toISOString(),
      tools: tools.map(t => ({
        name: t.name,
        category: t.category,
        link: t.link
      }))
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `devops-toolchain-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Toolchain exported!', 'success')
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
            <Badge variant="featured" className="text-sm">DevOps</Badge>
            <Link href="/startup/tech/ai-ml">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                AI & ML Integration <ArrowRight className="h-3 w-3 ml-1 inline" />
              </Badge>
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            DevOps & Deployment
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Implement CI/CD, monitoring, and deployment best practices. Build reliable and scalable infrastructure.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{devOpsTools.length}</div>
            <div className="text-sm text-gray-600">Tools</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{pipelineTemplates.length}</div>
            <div className="text-sm text-gray-600">Pipelines</div>
          </Card>
          <Card className="p-4 text-center bg-primary-50">
            <div className="text-3xl font-bold text-primary-500 mb-1">{selectedTools.length}</div>
            <div className="text-sm text-gray-600">Selected</div>
          </Card>
        </div>

        {/* Pipeline Templates */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary-500" />
            Pipeline Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pipelineTemplates.map(pipeline => (
              <Card 
                key={pipeline.id}
                className={`p-4 hover:shadow-lg transition-all ${pipeline.recommended ? 'border-primary-300' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-sm">{pipeline.name}</h3>
                  {pipeline.recommended && (
                    <Badge variant="new" className="text-xs">Recommended</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-3">{pipeline.description}</p>
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">Stages:</div>
                  <div className="flex flex-wrap gap-1">
                    {pipeline.stages.map((stage, idx) => (
                      <span key={idx} className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant="outline" className="text-xs capitalize">{pipeline.complexity}</Badge>
                  <span className="text-xs text-gray-500">{pipeline.tools.length} tools</span>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
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
                  <span className="text-sm font-medium">All Tools</span>
                </button>
                {categories.map(cat => {
                  const Icon = cat.icon
                  const count = devOpsTools.filter(t => t.category === cat.id).length
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
                          <Icon className="h-4 w-4" />
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
                    placeholder="Search tools..."
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOpenSourceOnly}
                    onChange={(e) => setShowOpenSourceOnly(e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">Open Source Only</span>
                </label>
              </div>
            </Card>

            {selectedTools.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Toolchain ({selectedTools.length})
                </h3>
                <div className="space-y-2 mb-4">
                  {devOpsTools.filter(t => selectedTools.includes(t.id)).map(tool => (
                    <div 
                      key={tool.id}
                      className="flex items-center justify-between p-2 bg-primary-50 rounded-lg"
                    >
                      <span className="text-sm font-medium">{tool.name}</span>
                      <button onClick={() => toggleTool(tool.id)}>
                        <span className="text-xs text-red-500 hover:underline">Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={exportToolchain}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
              </Button>
              </Card>
            )}

            {/* Best Practices */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary-500" />
                Best Practices
              </h3>
              <div className="space-y-3">
                {bestPractices.slice(0, 5).map(practice => (
                  <div key={practice.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="font-medium">{practice.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-5">{practice.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Tool Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTools.map(tool => {
                const isSelected = selectedTools.includes(tool.id)
                return (
                  <Card 
                    key={tool.id}
                    className={`p-4 hover:shadow-lg transition-all ${isSelected ? 'border-primary-500 bg-primary-50/50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{tool.name}</h3>
                          {tool.popularity >= 90 && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                          {tool.openSource && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800">OSS</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.id === tool.category)?.name}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(tool.difficulty)}`}>
                            {tool.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleTool(tool.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{tool.description}</p>

                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-500 mb-1">Features</div>
                      <div className="flex flex-wrap gap-1">
                        {tool.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {feature}
                          </span>
                        ))}
                        {tool.features.length > 3 && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            +{tool.features.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <BarChart className="h-3 w-3" />
                          {tool.popularity}%
                        </span>
                        <span>{tool.pricing}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(tool.link, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            {filteredTools.length === 0 && (
              <Card className="p-12 text-center">
                <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Tools Found</h3>
                <p className="text-gray-600">Try adjusting your filters.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
