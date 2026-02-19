'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Link from 'next/link'
import { Cloud, Shield, DollarSign, Server, Database, Globe, Zap, CheckCircle, Circle, Star, ArrowRight, Download, Lock, Cpu, BarChart, BookOpen, ExternalLink, Settings, Code, Layers, Activity, HardDrive, Network, AlertCircle } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface CloudService {
  id: string
  name: string
  provider: 'aws' | 'gcp' | 'azure' | 'other'
  category: string
  description: string
  useCases: string[]
  pricing: string
  freeTriere: boolean
  link: string
  alternatives: string[]
}

interface CostEstimate {
  service: string
  monthlyCost: number
  notes: string
}

interface ArchitectureTemplate {
  id: string
  name: string
  description: string
  type: string
  services: string[]
  estimatedCost: string
  complexity: 'simple' | 'moderate' | 'complex'
  recommended: boolean
}

const providers = [
  { id: 'aws', name: 'Amazon Web Services', color: 'orange', description: 'Most comprehensive cloud platform' },
  { id: 'gcp', name: 'Google Cloud Platform', color: 'blue', description: 'Strong in AI/ML and data analytics' },
  { id: 'azure', name: 'Microsoft Azure', color: 'cyan', description: 'Best for enterprise and .NET' },
  { id: 'other', name: 'Other Providers', color: 'gray', description: 'Vercel, Railway, Fly.io, etc.' },
]

const categories = [
  { id: 'compute', name: 'Compute', icon: Cpu },
  { id: 'storage', name: 'Storage', icon: HardDrive },
  { id: 'database', name: 'Database', icon: Database },
  { id: 'networking', name: 'Networking', icon: Network },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'serverless', name: 'Serverless', icon: Zap },
  { id: 'containers', name: 'Containers', icon: Layers },
  { id: 'monitoring', name: 'Monitoring', icon: Activity },
]

const cloudServices: CloudService[] = [
  // AWS Compute
  { id: 'ec2', name: 'Amazon EC2', provider: 'aws', category: 'compute', description: 'Scalable virtual servers in the cloud', useCases: ['Web servers', 'Application hosting', 'Dev environments'], pricing: 'Pay per hour/second', freeTriere: true, link: 'https://aws.amazon.com/ec2', alternatives: ['GCP Compute Engine', 'Azure VMs'] },
  { id: 'lambda', name: 'AWS Lambda', provider: 'aws', category: 'serverless', description: 'Run code without provisioning servers', useCases: ['API backends', 'Event processing', 'Scheduled tasks'], pricing: 'Pay per request + duration', freeTriere: true, link: 'https://aws.amazon.com/lambda', alternatives: ['GCP Cloud Functions', 'Azure Functions'] },
  { id: 'ecs', name: 'Amazon ECS/EKS', provider: 'aws', category: 'containers', description: 'Container orchestration services', useCases: ['Microservices', 'Container apps', 'Kubernetes'], pricing: 'Pay for resources used', freeTriere: false, link: 'https://aws.amazon.com/ecs', alternatives: ['GCP GKE', 'Azure AKS'] },
  
  // AWS Storage
  { id: 's3', name: 'Amazon S3', provider: 'aws', category: 'storage', description: 'Scalable object storage for any data', useCases: ['File storage', 'Backups', 'Static hosting', 'Data lakes'], pricing: 'Pay per GB stored + requests', freeTriere: true, link: 'https://aws.amazon.com/s3', alternatives: ['GCP Cloud Storage', 'Azure Blob Storage'] },
  
  // AWS Database
  { id: 'rds', name: 'Amazon RDS', provider: 'aws', category: 'database', description: 'Managed relational database service', useCases: ['Production databases', 'MySQL/Postgres', 'SQL Server'], pricing: 'Pay per instance + storage', freeTriere: true, link: 'https://aws.amazon.com/rds', alternatives: ['GCP Cloud SQL', 'Azure SQL Database'] },
  { id: 'dynamodb', name: 'Amazon DynamoDB', provider: 'aws', category: 'database', description: 'Fast NoSQL database with seamless scaling', useCases: ['High-traffic apps', 'Real-time data', 'Serverless'], pricing: 'Pay per request or provisioned', freeTriere: true, link: 'https://aws.amazon.com/dynamodb', alternatives: ['GCP Firestore', 'Azure Cosmos DB'] },
  
  // AWS Security
  { id: 'cognito', name: 'Amazon Cognito', provider: 'aws', category: 'security', description: 'User authentication and authorization', useCases: ['User sign-up/sign-in', 'OAuth/OIDC', 'Social login'], pricing: 'Pay per MAU', freeTriere: true, link: 'https://aws.amazon.com/cognito', alternatives: ['GCP Identity Platform', 'Azure AD B2C'] },
  
  // AWS Networking
  { id: 'cloudfront', name: 'Amazon CloudFront', provider: 'aws', category: 'networking', description: 'Fast content delivery network (CDN)', useCases: ['Static content', 'API acceleration', 'Video streaming'], pricing: 'Pay per data transfer', freeTriere: true, link: 'https://aws.amazon.com/cloudfront', alternatives: ['GCP Cloud CDN', 'Azure CDN', 'Cloudflare'] },
  
  // AWS Monitoring
  { id: 'cloudwatch', name: 'Amazon CloudWatch', provider: 'aws', category: 'monitoring', description: 'Monitoring and observability service', useCases: ['Logging', 'Metrics', 'Alarms', 'Dashboards'], pricing: 'Pay per metrics/logs', freeTriere: true, link: 'https://aws.amazon.com/cloudwatch', alternatives: ['GCP Cloud Monitoring', 'Datadog'] },
  
  // GCP
  { id: 'gce', name: 'Compute Engine', provider: 'gcp', category: 'compute', description: 'Virtual machines on Google infrastructure', useCases: ['Web servers', 'Batch processing', 'ML training'], pricing: 'Pay per second', freeTriere: true, link: 'https://cloud.google.com/compute', alternatives: ['AWS EC2', 'Azure VMs'] },
  { id: 'gcf', name: 'Cloud Functions', provider: 'gcp', category: 'serverless', description: 'Event-driven serverless compute', useCases: ['Event processing', 'APIs', 'Webhooks'], pricing: 'Pay per invocation', freeTriere: true, link: 'https://cloud.google.com/functions', alternatives: ['AWS Lambda', 'Azure Functions'] },
  { id: 'gcs', name: 'Cloud Storage', provider: 'gcp', category: 'storage', description: 'Unified object storage for all data', useCases: ['File storage', 'ML data', 'Backups'], pricing: 'Pay per GB', freeTriere: true, link: 'https://cloud.google.com/storage', alternatives: ['AWS S3', 'Azure Blob'] },
  { id: 'cloudsql', name: 'Cloud SQL', provider: 'gcp', category: 'database', description: 'Fully managed relational databases', useCases: ['MySQL', 'PostgreSQL', 'SQL Server'], pricing: 'Pay per instance', freeTriere: false, link: 'https://cloud.google.com/sql', alternatives: ['AWS RDS', 'Azure SQL'] },
  { id: 'bigquery', name: 'BigQuery', provider: 'gcp', category: 'database', description: 'Serverless data warehouse for analytics', useCases: ['Analytics', 'Data warehouse', 'ML'], pricing: 'Pay per query', freeTriere: true, link: 'https://cloud.google.com/bigquery', alternatives: ['AWS Redshift', 'Snowflake'] },
  { id: 'gke', name: 'Google Kubernetes Engine', provider: 'gcp', category: 'containers', description: 'Managed Kubernetes service', useCases: ['Container orchestration', 'Microservices'], pricing: 'Pay for nodes', freeTriere: false, link: 'https://cloud.google.com/kubernetes-engine', alternatives: ['AWS EKS', 'Azure AKS'] },
  
  // Azure
  { id: 'azurevm', name: 'Azure Virtual Machines', provider: 'azure', category: 'compute', description: 'On-demand scalable computing', useCases: ['Windows workloads', 'Enterprise apps'], pricing: 'Pay per minute', freeTriere: true, link: 'https://azure.microsoft.com/en-us/services/virtual-machines', alternatives: ['AWS EC2', 'GCP Compute'] },
  { id: 'azurefunc', name: 'Azure Functions', provider: 'azure', category: 'serverless', description: 'Event-driven serverless compute', useCases: ['APIs', 'Event processing', 'Integrations'], pricing: 'Pay per execution', freeTriere: true, link: 'https://azure.microsoft.com/en-us/services/functions', alternatives: ['AWS Lambda', 'GCP Functions'] },
  { id: 'azureblob', name: 'Azure Blob Storage', provider: 'azure', category: 'storage', description: 'Massively scalable object storage', useCases: ['Unstructured data', 'Backups', 'Archives'], pricing: 'Pay per GB', freeTriere: true, link: 'https://azure.microsoft.com/en-us/services/storage/blobs', alternatives: ['AWS S3', 'GCP Storage'] },
  { id: 'cosmosdb', name: 'Azure Cosmos DB', provider: 'azure', category: 'database', description: 'Globally distributed NoSQL database', useCases: ['Global apps', 'Multi-model', 'Real-time'], pricing: 'Pay per RU', freeTriere: true, link: 'https://azure.microsoft.com/en-us/services/cosmos-db', alternatives: ['AWS DynamoDB', 'MongoDB Atlas'] },
  
  // Other
  { id: 'vercel', name: 'Vercel', provider: 'other', category: 'serverless', description: 'Frontend cloud for Next.js and React', useCases: ['Next.js apps', 'Static sites', 'Jamstack'], pricing: 'Free tier + pay for usage', freeTriere: true, link: 'https://vercel.com', alternatives: ['Netlify', 'Cloudflare Pages'] },
  { id: 'railway', name: 'Railway', provider: 'other', category: 'compute', description: 'Deploy any app with zero config', useCases: ['Full-stack apps', 'Databases', 'APIs'], pricing: '$5/month base + usage', freeTriere: true, link: 'https://railway.app', alternatives: ['Render', 'Fly.io'] },
  { id: 'planetscale', name: 'PlanetScale', provider: 'other', category: 'database', description: 'Serverless MySQL with branching', useCases: ['MySQL apps', 'Production DBs'], pricing: 'Free tier + pay per row', freeTriere: true, link: 'https://planetscale.com', alternatives: ['AWS RDS', 'Supabase'] },
  { id: 'supabase', name: 'Supabase', provider: 'other', category: 'database', description: 'Open source Firebase alternative', useCases: ['Auth', 'Database', 'Storage', 'Real-time'], pricing: 'Free tier + pay for usage', freeTriere: true, link: 'https://supabase.com', alternatives: ['Firebase', 'AWS Amplify'] },
]

const architectureTemplates: ArchitectureTemplate[] = [
  {
    id: 'serverless-api',
    name: 'Serverless API',
    description: 'Cost-effective, auto-scaling API backend',
    type: 'API',
    services: ['API Gateway', 'Lambda/Functions', 'DynamoDB/Firestore', 'CloudWatch'],
    estimatedCost: '$0-50/month',
    complexity: 'simple',
    recommended: true
  },
  {
    id: 'modern-web-app',
    name: 'Modern Web Application',
    description: 'Full-stack web app with CDN and database',
    type: 'Web App',
    services: ['Vercel/CloudFront', 'Lambda/Cloud Functions', 'RDS/Cloud SQL', 'S3/Cloud Storage'],
    estimatedCost: '$20-100/month',
    complexity: 'moderate',
    recommended: true
  },
  {
    id: 'microservices',
    name: 'Microservices Architecture',
    description: 'Container-based microservices with orchestration',
    type: 'Microservices',
    services: ['ECS/GKE/AKS', 'Load Balancer', 'RDS', 'ElastiCache/Redis', 'CloudWatch'],
    estimatedCost: '$200-1000/month',
    complexity: 'complex',
    recommended: false
  },
  {
    id: 'data-pipeline',
    name: 'Data Pipeline',
    description: 'ETL and analytics infrastructure',
    type: 'Data',
    services: ['S3/Cloud Storage', 'Glue/Dataflow', 'Redshift/BigQuery', 'QuickSight/Looker'],
    estimatedCost: '$100-500/month',
    complexity: 'moderate',
    recommended: false
  },
  {
    id: 'startup-mvp',
    name: 'Startup MVP Stack',
    description: 'Minimal infrastructure for rapid development',
    type: 'MVP',
    services: ['Vercel/Railway', 'Supabase/PlanetScale', 'Cloudflare CDN'],
    estimatedCost: '$0-20/month',
    complexity: 'simple',
    recommended: true
  },
]

const costOptimizationTips = [
  { id: '1', title: 'Use Reserved Instances', description: 'Save up to 72% by committing to 1-3 year terms', impact: 'high' },
  { id: '2', title: 'Enable Auto-Scaling', description: 'Scale down during low-traffic periods', impact: 'high' },
  { id: '3', title: 'Use Spot Instances', description: 'Save up to 90% for fault-tolerant workloads', impact: 'high' },
  { id: '4', title: 'Right-Size Instances', description: 'Monitor and adjust instance sizes based on usage', impact: 'medium' },
  { id: '5', title: 'Use S3 Intelligent-Tiering', description: 'Automatically move data to cheaper storage tiers', impact: 'medium' },
  { id: '6', title: 'Set Up Cost Alerts', description: 'Get notified when costs exceed thresholds', impact: 'low' },
  { id: '7', title: 'Delete Unused Resources', description: 'Remove orphaned EBS volumes, old snapshots', impact: 'medium' },
  { id: '8', title: 'Use Free Tier Services', description: 'Stay within free tier limits for development', impact: 'high' },
]

export default function CloudPage() {
  const [selectedProvider, setSelectedProvider] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [monthlyBudget, setMonthlyBudget] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedCloudServices')
      if (saved) {
        setSelectedServices(JSON.parse(saved))
      }
    }
  }, [])

  const toggleService = (serviceId: string) => {
    const updated = selectedServices.includes(serviceId)
      ? selectedServices.filter(id => id !== serviceId)
      : [...selectedServices, serviceId]
    setSelectedServices(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCloudServices', JSON.stringify(updated))
    }
    showToast(
      selectedServices.includes(serviceId) ? 'Service removed' : 'Service added',
      'success'
    )
  }

  const filteredServices = cloudServices.filter(service => {
    const matchesProvider = selectedProvider === 'all' || service.provider === selectedProvider
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesProvider && matchesCategory && matchesSearch
  })

  const exportArchitecture = () => {
    const services = cloudServices.filter(s => selectedServices.includes(s.id))
    const data = {
      exportDate: new Date().toISOString(),
      services: services.map(s => ({
        name: s.name,
        provider: s.provider,
        category: s.category,
        link: s.link
      }))
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cloud-architecture-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Architecture exported!', 'success')
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'aws': return 'bg-orange-100 text-orange-800'
      case 'gcp': return 'bg-blue-100 text-blue-800'
      case 'azure': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="featured" className="text-sm">Cloud</Badge>
            <Link href="/startup/tech/devops">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                DevOps & Deployment <ArrowRight className="h-3 w-3 ml-1 inline" />
              </Badge>
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Cloud Infrastructure
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Set up scalable cloud infrastructure for your startup. Compare providers, estimate costs, and choose the right architecture.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{cloudServices.length}</div>
            <div className="text-sm text-gray-600">Cloud Services</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{providers.length}</div>
            <div className="text-sm text-gray-600">Providers</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{architectureTemplates.length}</div>
            <div className="text-sm text-gray-600">Templates</div>
          </Card>
          <Card className="p-4 text-center bg-primary-50">
            <div className="text-3xl font-bold text-primary-500 mb-1">{selectedServices.length}</div>
            <div className="text-sm text-gray-600">Selected</div>
          </Card>
        </div>

        {/* Provider Selection */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Cloud Providers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {providers.map(provider => (
              <div
                key={provider.id}
                onClick={() => setSelectedProvider(selectedProvider === provider.id ? 'all' : provider.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedProvider === provider.id 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className={`h-5 w-5 text-${provider.color}-500`} />
                  <span className="font-semibold text-sm">{provider.name}</span>
                </div>
                <p className="text-xs text-gray-600">{provider.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Architecture Templates */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary-500" />
            Architecture Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {architectureTemplates.map(template => (
              <Card 
                key={template.id}
                className={`p-4 hover:shadow-lg transition-all ${template.recommended ? 'border-primary-300' : ''}`}
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
                <div className="text-xs text-gray-500 mb-2">
                  <strong>Services:</strong> {template.services.join(', ')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-600">{template.estimatedCost}</span>
                  <Badge variant="outline" className="text-xs capitalize">{template.complexity}</Badge>
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
                  <span className="text-sm font-medium">All Services</span>
                </button>
                {categories.map(cat => {
                  const Icon = cat.icon
                  const count = cloudServices.filter(s => s.category === cat.id).length
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
              <h3 className="font-bold mb-4">Search</h3>
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Card>

            {selectedServices.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Selected ({selectedServices.length})
                </h3>
                <div className="space-y-2 mb-4">
                  {cloudServices.filter(s => selectedServices.includes(s.id)).map(service => (
                    <div 
                      key={service.id}
                      className="flex items-center justify-between p-2 bg-primary-50 rounded-lg"
                    >
                      <span className="text-sm font-medium">{service.name}</span>
                      <button onClick={() => toggleService(service.id)}>
                        <span className="text-xs text-red-500 hover:underline">Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={exportArchitecture}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
              </Button>
              </Card>
            )}

            {/* Cost Optimization Tips */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Cost Tips
              </h3>
              <div className="space-y-3">
                {costOptimizationTips.slice(0, 4).map(tip => (
                  <div key={tip.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="font-medium">{tip.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-5">{tip.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Service Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map(service => {
                const isSelected = selectedServices.includes(service.id)
                return (
                  <Card 
                    key={service.id}
                    className={`p-4 hover:shadow-lg transition-all ${isSelected ? 'border-primary-500 bg-primary-50/50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{service.name}</h3>
                          {service.freeTriere && (
                            <Badge variant="new" className="text-xs">Free Tier</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${getProviderColor(service.provider)}`}>
                            {service.provider.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.id === service.category)?.name}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleService(service.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-500 mb-1">Use Cases</div>
                      <div className="flex flex-wrap gap-1">
                        {service.useCases.map((useCase, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs text-gray-500">{service.pricing}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(service.link, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            {filteredServices.length === 0 && (
              <Card className="p-12 text-center">
                <Cloud className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
                <p className="text-gray-600">Try adjusting your filters.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
