'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { Home, Building2, Search, Star, ExternalLink, CheckCircle, Key, MapPin, DollarSign, FileText, BarChart, Shield, Smartphone, Globe, Zap, Users, Calculator, Network, BookOpen, TrendingUp, Lock } from 'lucide-react'
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
  { id: 'all', name: 'All Categories', icon: Home },
  { id: 'platform', name: 'Platform Setup', icon: Globe },
  { id: 'listings', name: 'Property Listings', icon: Building2 },
  { id: 'transactions', name: 'Transactions & Payments', icon: DollarSign },
  { id: 'analytics', name: 'Market Analytics', icon: BarChart },
  { id: 'legal', name: 'Legal & Compliance', icon: Shield },
  { id: 'iot', name: 'Smart Home & IoT', icon: Zap },
  { id: 'integration', name: 'API Integration', icon: Network },
]

const resources: Resource[] = [
  // Platform Setup
  {
    id: '1',
    title: 'Real Estate Platform Builder',
    description: 'Build comprehensive real estate platforms for listings, transactions, and property management.',
    category: 'platform',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Globe,
    tags: ['Platform', 'Real Estate', 'Listings', 'Management'],
    rating: 4.8
  },
  {
    id: '2',
    title: 'Property Management System',
    description: 'Set up property management systems for landlords, tenants, and maintenance.',
    category: 'platform',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: Building2,
    tags: ['Property Management', 'Landlords', 'Tenants', 'Maintenance']
  },
  
  // Property Listings
  {
    id: '3',
    title: 'MLS Integration Guide',
    description: 'Integrate with Multiple Listing Services (MLS) to access property data.',
    category: 'listings',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Network,
    tags: ['MLS', 'Integration', 'Property Data', 'Listings'],
    rating: 4.7
  },
  {
    id: '4',
    title: 'Virtual Tour Platform',
    description: 'Build platforms for 360° virtual tours and augmented reality property viewing.',
    category: 'listings',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: Smartphone,
    tags: ['Virtual Tours', 'AR', 'VR', 'Property Viewing']
  },
  {
    id: '5',
    title: 'Property Search & Filters',
    description: 'Implement advanced search and filtering for property listings.',
    category: 'listings',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Search,
    tags: ['Search', 'Filters', 'Listings', 'UX']
  },
  
  // Transactions & Payments
  {
    id: '6',
    title: 'Real Estate Payment Processing',
    description: 'Set up payment processing for rent, deposits, and property transactions.',
    category: 'transactions',
    type: 'tool',
    link: '/startup/fintech-resources',
    featured: true,
    icon: DollarSign,
    tags: ['Payments', 'Rent', 'Transactions', 'Processing'],
    rating: 4.6
  },
  {
    id: '7',
    title: 'Escrow Services Integration',
    description: 'Integrate escrow services for secure real estate transactions.',
    category: 'transactions',
    type: 'guide',
    link: '/startup/fintech-resources',
    icon: Lock,
    tags: ['Escrow', 'Transactions', 'Security', 'Payments']
  },
  
  // Market Analytics
  {
    id: '8',
    title: 'Real Estate Analytics Dashboard',
    description: 'Track market trends, property values, and investment metrics.',
    category: 'analytics',
    type: 'tool',
    link: '/startup/marketing/analytics',
    featured: true,
    popular: true,
    icon: BarChart,
    tags: ['Analytics', 'Market Trends', 'Property Values', 'Dashboard'],
    rating: 4.7
  },
  {
    id: '9',
    title: 'Property Valuation Tools',
    description: 'Build tools for automated property valuation and price estimation.',
    category: 'analytics',
    type: 'tool',
    link: '/startup/valuation-calculator',
    icon: Calculator,
    tags: ['Valuation', 'Pricing', 'Estimation', 'Tools']
  },
  
  // Legal & Compliance
  {
    id: '10',
    title: 'Real Estate Compliance Guide',
    description: 'Navigate real estate regulations, licensing, and compliance requirements.',
    category: 'legal',
    type: 'guide',
    link: '/startup/legal/structure',
    featured: true,
    icon: Shield,
    tags: ['Compliance', 'Regulations', 'Licensing', 'Real Estate'],
    rating: 4.5
  },
  {
    id: '11',
    title: 'Lease Agreement Generator',
    description: 'Create and manage lease agreements and rental contracts.',
    category: 'legal',
    type: 'template',
    link: '/startup/legal-documents',
    icon: FileText,
    tags: ['Lease Agreements', 'Contracts', 'Templates', 'Legal']
  },
  
  // Smart Home & IoT
  {
    id: '12',
    title: 'Smart Home Integration',
    description: 'Integrate IoT devices and smart home technology into property platforms.',
    category: 'iot',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    icon: Zap,
    tags: ['IoT', 'Smart Home', 'Integration', 'Devices']
  },
  {
    id: '13',
    title: 'Property Monitoring Systems',
    description: 'Implement systems for monitoring property conditions, security, and maintenance.',
    category: 'iot',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Building2,
    tags: ['Monitoring', 'Security', 'Maintenance', 'IoT']
  },
  
  // API Integration
  {
    id: '14',
    title: 'Real Estate API Integration',
    description: 'Integrate with Zillow, Redfin, and other real estate data APIs.',
    category: 'integration',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Network,
    tags: ['API', 'Zillow', 'Redfin', 'Integration'],
    rating: 4.6
  },
  {
    id: '15',
    title: 'Mapping & Location Services',
    description: 'Integrate mapping services and location-based features for properties.',
    category: 'integration',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: MapPin,
    tags: ['Maps', 'Location', 'Geolocation', 'Integration']
  },
]

export default function PropTechResourcesPage() {
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
            <Home className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              PropTech Resources
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Specialized resources for real estate technology startups. From property listings to smart homes, find everything you need to build and scale your PropTech platform.
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
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </main>
  )
}

