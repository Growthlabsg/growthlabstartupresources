'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { DollarSign, Shield, FileText, TrendingUp, Search, Star, ExternalLink, CheckCircle, CreditCard, Banknote, Lock, BarChart, Receipt, Wallet, PiggyBank, Coins, Building2, Scale, AlertTriangle, BookOpen, Video, Calculator, Network, Zap } from 'lucide-react'
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
  { id: 'all', name: 'All Categories', icon: DollarSign },
  { id: 'compliance', name: 'Compliance & Regulation', icon: Shield },
  { id: 'payments', name: 'Payment Processing', icon: CreditCard },
  { id: 'banking', name: 'Banking & Lending', icon: Building2 },
  { id: 'crypto', name: 'Cryptocurrency', icon: Coins },
  { id: 'security', name: 'Security & Fraud', icon: Lock },
  { id: 'analytics', name: 'Financial Analytics', icon: BarChart },
  { id: 'api', name: 'APIs & Integrations', icon: Network },
]

const resources: Resource[] = [
  // Compliance & Regulation
  {
    id: '1',
    title: 'Regulatory Compliance Guide',
    description: 'Navigate financial regulations including KYC, AML, and licensing requirements for FinTech startups.',
    category: 'compliance',
    type: 'guide',
    link: '/startup/legal/structure',
    featured: true,
    popular: true,
    icon: Shield,
    tags: ['KYC', 'AML', 'Licensing', 'Regulation'],
    rating: 4.9
  },
  {
    id: '2',
    title: 'FinTech Licensing Guide',
    description: 'Understand licensing requirements for different FinTech business models and jurisdictions.',
    category: 'compliance',
    type: 'guide',
    link: '/startup/legal/structure',
    popular: true,
    icon: Scale,
    tags: ['Licensing', 'Regulation', 'Jurisdiction', 'Compliance']
  },
  {
    id: '3',
    title: 'GDPR & Data Privacy for FinTech',
    description: 'Ensure compliance with GDPR and other data protection regulations in financial services.',
    category: 'compliance',
    type: 'guide',
    link: '/startup/legal/privacy',
    icon: Lock,
    tags: ['GDPR', 'Data Privacy', 'Compliance', 'Security']
  },
  {
    id: '4',
    title: 'Regulatory Compliance Checklist',
    description: 'Comprehensive checklist to ensure your FinTech startup meets all regulatory requirements.',
    category: 'compliance',
    type: 'template',
    link: '/startup/checklist',
    icon: FileText,
    tags: ['Checklist', 'Compliance', 'Regulation', 'Template']
  },
  
  // Payment Processing
  {
    id: '5',
    title: 'Payment Processing Setup',
    description: 'Integrate payment systems like Stripe, PayPal, and Square to accept payments securely.',
    category: 'payments',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: CreditCard,
    tags: ['Stripe', 'PayPal', 'Payment Gateway', 'Integration'],
    rating: 4.8
  },
  {
    id: '6',
    title: 'Stripe Integration Guide',
    description: 'Step-by-step guide to integrating Stripe for payments, subscriptions, and invoicing.',
    category: 'payments',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: CreditCard,
    tags: ['Stripe', 'API', 'Integration', 'Payments']
  },
  {
    id: '7',
    title: 'Payment Gateway Comparison',
    description: 'Compare payment gateways to choose the best solution for your FinTech startup.',
    category: 'payments',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: CreditCard,
    tags: ['Payment Gateway', 'Comparison', 'Stripe', 'PayPal']
  },
  {
    id: '8',
    title: 'Subscription Billing Setup',
    description: 'Implement recurring billing and subscription management for SaaS FinTech products.',
    category: 'payments',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Receipt,
    tags: ['Subscriptions', 'Recurring Billing', 'SaaS', 'Payments']
  },
  
  // Banking & Lending
  {
    id: '9',
    title: 'Banking API Integration',
    description: 'Integrate with banking APIs like Plaid, Yodlee, and TrueLayer for account aggregation.',
    category: 'banking',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    icon: Building2,
    tags: ['Plaid', 'Banking API', 'Account Aggregation', 'Open Banking'],
    rating: 4.7
  },
  {
    id: '10',
    title: 'Lending Platform Setup',
    description: 'Build and launch a peer-to-peer or marketplace lending platform.',
    category: 'banking',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: PiggyBank,
    tags: ['Lending', 'P2P', 'Marketplace', 'Loans']
  },
  {
    id: '11',
    title: 'Credit Scoring Models',
    description: 'Understand and implement credit scoring models for lending decisions.',
    category: 'banking',
    type: 'course',
    link: '/startup/financial-literacy',
    icon: BarChart,
    tags: ['Credit Scoring', 'Risk Assessment', 'Lending', 'Analytics']
  },
  {
    id: '12',
    title: 'Banking Infrastructure Guide',
    description: 'Learn about core banking systems and infrastructure for FinTech startups.',
    category: 'banking',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Building2,
    tags: ['Core Banking', 'Infrastructure', 'Banking Systems', 'FinTech']
  },
  
  // Cryptocurrency
  {
    id: '13',
    title: 'Cryptocurrency Integration',
    description: 'Add cryptocurrency payment and wallet functionality to your FinTech product.',
    category: 'crypto',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Coins,
    tags: ['Cryptocurrency', 'Blockchain', 'Bitcoin', 'Ethereum'],
    rating: 4.6
  },
  {
    id: '14',
    title: 'Blockchain Development Guide',
    description: 'Learn to build decentralized applications and smart contracts for FinTech.',
    category: 'crypto',
    type: 'course',
    link: '/startup/technical-skills',
    icon: Coins,
    tags: ['Blockchain', 'Smart Contracts', 'DeFi', 'Web3']
  },
  {
    id: '15',
    title: 'Crypto Exchange Integration',
    description: 'Integrate with cryptocurrency exchanges for trading and portfolio management.',
    category: 'crypto',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Coins,
    tags: ['Crypto Exchange', 'Trading', 'API', 'Integration']
  },
  
  // Security & Fraud
  {
    id: '16',
    title: 'Financial Security Best Practices',
    description: 'Essential security practices to protect financial data and prevent fraud.',
    category: 'security',
    type: 'guide',
    link: '/startup/tech/ai-ml',
    featured: true,
    popular: true,
    icon: Lock,
    tags: ['Security', 'Fraud Prevention', 'Data Protection', 'Encryption'],
    rating: 4.9
  },
  {
    id: '17',
    title: 'Fraud Detection Systems',
    description: 'Implement fraud detection and prevention systems using AI and machine learning.',
    category: 'security',
    type: 'guide',
    link: '/startup/tech/ai-ml',
    popular: true,
    icon: AlertTriangle,
    tags: ['Fraud Detection', 'AI', 'Machine Learning', 'Security']
  },
  {
    id: '18',
    title: 'PCI DSS Compliance Guide',
    description: 'Achieve PCI DSS compliance for handling credit card data securely.',
    category: 'security',
    type: 'guide',
    link: '/startup/legal/privacy',
    icon: Shield,
    tags: ['PCI DSS', 'Compliance', 'Credit Cards', 'Security']
  },
  {
    id: '19',
    title: 'Identity Verification Solutions',
    description: 'Implement KYC and identity verification using services like Onfido and Jumio.',
    category: 'security',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Lock,
    tags: ['KYC', 'Identity Verification', 'Onfido', 'Jumio']
  },
  
  // Financial Analytics
  {
    id: '20',
    title: 'Financial Analytics Dashboard',
    description: 'Build dashboards to track financial metrics, transactions, and business performance.',
    category: 'analytics',
    type: 'tool',
    link: '/startup/marketing/analytics',
    featured: true,
    icon: BarChart,
    tags: ['Analytics', 'Dashboard', 'Metrics', 'Reporting'],
    rating: 4.7
  },
  {
    id: '21',
    title: 'Transaction Analytics',
    description: 'Analyze transaction patterns, detect anomalies, and generate insights.',
    category: 'analytics',
    type: 'guide',
    link: '/startup/marketing/analytics',
    icon: TrendingUp,
    tags: ['Transaction Analytics', 'Pattern Detection', 'Insights', 'Data']
  },
  {
    id: '22',
    title: 'Financial Reporting Tools',
    description: 'Generate financial reports, statements, and regulatory filings automatically.',
    category: 'analytics',
    type: 'tool',
    link: '/startup/financial-projections',
    icon: FileText,
    tags: ['Financial Reports', 'Statements', 'Regulatory', 'Automation']
  },
  
  // APIs & Integrations
  {
    id: '23',
    title: 'FinTech API Integration Guide',
    description: 'Comprehensive guide to integrating with major FinTech APIs and services.',
    category: 'api',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Network,
    tags: ['API Integration', 'FinTech APIs', 'Plaid', 'Stripe'],
    rating: 4.8
  },
  {
    id: '24',
    title: 'Plaid Integration Tutorial',
    description: 'Step-by-step tutorial for integrating Plaid for bank account connections.',
    category: 'api',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: Network,
    tags: ['Plaid', 'Banking API', 'Integration', 'Tutorial']
  },
  {
    id: '25',
    title: 'Open Banking API Guide',
    description: 'Leverage Open Banking APIs to access financial data and initiate payments.',
    category: 'api',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Zap,
    tags: ['Open Banking', 'PSD2', 'API', 'Banking']
  },
]

export default function FinTechResourcesPage() {
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

  const CategoryIcon = categories.find(c => c.id === selectedCategory)?.icon || DollarSign

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
            <DollarSign className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
            FinTech Resources
          </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Specialized resources for financial technology startups. From regulatory compliance to payment processing, find everything you need to build and scale your FinTech startup.
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
            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
            <Link href="/startup/legal/structure">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <Shield className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Compliance Tools</h3>
                <p className="text-sm text-gray-600">Regulatory compliance</p>
              </Card>
            </Link>
            
            <Link href="/startup/financial-projections">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <BarChart className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Financial Tools</h3>
                <p className="text-sm text-gray-600">Projections & analytics</p>
              </Card>
            </Link>
            
            <Link href="/startup/legal/privacy">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <Lock className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Security & Privacy</h3>
                <p className="text-sm text-gray-600">Data protection</p>
              </Card>
            </Link>
            
            <Link href="/startup/financial-literacy">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <BookOpen className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Financial Education</h3>
                <p className="text-sm text-gray-600">Learn finance basics</p>
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
              <h3 className="text-lg font-semibold mb-2">FinTech Video Tutorials</h3>
              <p className="text-sm text-gray-600 mb-4">Watch step-by-step tutorials for payment integration, compliance, and more</p>
              <Link href="/startup/technical-skills">
                <Button variant="outline" size="sm" className="w-full">
                  Watch Videos
                </Button>
              </Link>
            </Card>
            
            <Card className="p-6">
              <FileText className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Regulatory Templates</h3>
              <p className="text-sm text-gray-600 mb-4">Download compliance checklists, policy templates, and regulatory documents</p>
              <Link href="/startup/legal-documents">
                <Button variant="outline" size="sm" className="w-full">
                  Browse Templates
                </Button>
              </Link>
            </Card>
            
            <Card className="p-6">
              <Calculator className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Financial Calculators</h3>
              <p className="text-sm text-gray-600 mb-4">Access calculators for loan payments, interest rates, and financial metrics</p>
              <Link href="/startup/financial-projections">
                <Button variant="outline" size="sm" className="w-full">
                  Use Calculators
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
