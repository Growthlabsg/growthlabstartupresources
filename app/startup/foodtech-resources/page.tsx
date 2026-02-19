'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { UtensilsCrossed, Truck, Search, Star, ExternalLink, CheckCircle, Package, MapPin, DollarSign, FileText, BarChart, Shield, Smartphone, Globe, Zap, Users, Calculator, Network, BookOpen, TrendingUp, Leaf, ShoppingCart } from 'lucide-react'
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
  { id: 'all', name: 'All Categories', icon: UtensilsCrossed },
  { id: 'delivery', name: 'Food Delivery', icon: Truck },
  { id: 'ordering', name: 'Ordering Systems', icon: ShoppingCart },
  { id: 'inventory', name: 'Inventory & Supply', icon: Package },
  { id: 'analytics', name: 'Analytics & Insights', icon: BarChart },
  { id: 'compliance', name: 'Compliance & Safety', icon: Shield },
  { id: 'sustainability', name: 'Sustainability', icon: Leaf },
  { id: 'integration', name: 'API Integration', icon: Network },
]

const resources: Resource[] = [
  // Food Delivery
  {
    id: '1',
    title: 'Food Delivery Platform',
    description: 'Build food delivery platforms connecting restaurants, drivers, and customers.',
    category: 'delivery',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Truck,
    tags: ['Delivery', 'Platform', 'Logistics', 'Food'],
    rating: 4.8
  },
  {
    id: '2',
    title: 'Delivery Route Optimization',
    description: 'Optimize delivery routes for faster service and lower costs.',
    category: 'delivery',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: MapPin,
    tags: ['Route Optimization', 'Logistics', 'Delivery', 'Efficiency']
  },
  {
    id: '3',
    title: 'Driver Management System',
    description: 'Manage delivery drivers, schedules, and performance tracking.',
    category: 'delivery',
    type: 'tool',
    link: '/startup/team-management',
    icon: Users,
    tags: ['Driver Management', 'Scheduling', 'Tracking', 'Performance']
  },
  
  // Ordering Systems
  {
    id: '4',
    title: 'Online Ordering System',
    description: 'Build online ordering systems for restaurants and food businesses.',
    category: 'ordering',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: ShoppingCart,
    tags: ['Ordering', 'Restaurants', 'E-commerce', 'Platform'],
    rating: 4.7
  },
  {
    id: '5',
    title: 'POS Integration Guide',
    description: 'Integrate with Point of Sale systems for seamless order management.',
    category: 'ordering',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Network,
    tags: ['POS', 'Integration', 'Orders', 'Management']
  },
  {
    id: '6',
    title: 'Menu Management System',
    description: 'Create and manage digital menus with real-time updates and pricing.',
    category: 'ordering',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    icon: FileText,
    tags: ['Menu', 'Management', 'Pricing', 'Updates']
  },
  
  // Inventory & Supply
  {
    id: '7',
    title: 'Restaurant Inventory Management',
    description: 'Track inventory, manage suppliers, and optimize food costs.',
    category: 'inventory',
    type: 'tool',
    link: '/startup/operations-dashboard',
    featured: true,
    icon: Package,
    tags: ['Inventory', 'Suppliers', 'Cost Management', 'Tracking'],
    rating: 4.6
  },
  {
    id: '8',
    title: 'Supply Chain Optimization',
    description: 'Optimize food supply chains for freshness, cost, and efficiency.',
    category: 'inventory',
    type: 'guide',
    link: '/startup/operations-dashboard',
    icon: TrendingUp,
    tags: ['Supply Chain', 'Optimization', 'Efficiency', 'Cost']
  },
  
  // Analytics & Insights
  {
    id: '9',
    title: 'Restaurant Analytics Dashboard',
    description: 'Track sales, customer behavior, and operational metrics for food businesses.',
    category: 'analytics',
    type: 'tool',
    link: '/startup/marketing/analytics',
    featured: true,
    popular: true,
    icon: BarChart,
    tags: ['Analytics', 'Sales', 'Customer Behavior', 'Metrics'],
    rating: 4.7
  },
  {
    id: '10',
    title: 'Food Waste Tracking',
    description: 'Track and reduce food waste to improve sustainability and profitability.',
    category: 'analytics',
    type: 'tool',
    link: '/startup/operations-dashboard',
    icon: Leaf,
    tags: ['Food Waste', 'Sustainability', 'Tracking', 'Reduction']
  },
  
  // Compliance & Safety
  {
    id: '11',
    title: 'Food Safety Compliance',
    description: 'Ensure compliance with FDA, HACCP, and local food safety regulations.',
    category: 'compliance',
    type: 'guide',
    link: '/startup/legal/structure',
    featured: true,
    popular: true,
    icon: Shield,
    tags: ['Food Safety', 'FDA', 'HACCP', 'Compliance'],
    rating: 4.5
  },
  {
    id: '12',
    title: 'Health Inspection Management',
    description: 'Manage health inspections, certifications, and compliance documentation.',
    category: 'compliance',
    type: 'tool',
    link: '/startup/legal/structure',
    icon: FileText,
    tags: ['Health Inspections', 'Certifications', 'Compliance', 'Documentation']
  },
  
  // Sustainability
  {
    id: '13',
    title: 'Sustainable Food Practices',
    description: 'Implement sustainable practices for sourcing, packaging, and waste management.',
    category: 'sustainability',
    type: 'guide',
    link: '/startup/operations-dashboard',
    featured: true,
    icon: Leaf,
    tags: ['Sustainability', 'Sourcing', 'Packaging', 'Eco-Friendly']
  },
  {
    id: '14',
    title: 'Carbon Footprint Tracking',
    description: 'Track and reduce carbon footprint of food operations and delivery.',
    category: 'sustainability',
    type: 'tool',
    link: '/startup/operations-dashboard',
    icon: Leaf,
    tags: ['Carbon Footprint', 'Sustainability', 'Tracking', 'Reduction']
  },
  
  // API Integration
  {
    id: '15',
    title: 'Food API Integration',
    description: 'Integrate with food delivery APIs like DoorDash, Uber Eats, and Grubhub.',
    category: 'integration',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Network,
    tags: ['API', 'DoorDash', 'Uber Eats', 'Grubhub'],
    rating: 4.6
  },
  {
    id: '16',
    title: 'Payment Gateway Integration',
    description: 'Integrate payment processing for food orders and delivery fees.',
    category: 'integration',
    type: 'guide',
    link: '/startup/fintech-resources',
    icon: DollarSign,
    tags: ['Payments', 'Integration', 'Orders', 'Processing']
  },
]

export default function FoodTechResourcesPage() {
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
            <UtensilsCrossed className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              FoodTech Resources
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Specialized resources for food technology startups. From delivery platforms to restaurant management, find everything you need to build and scale your FoodTech business.
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
            <UtensilsCrossed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </main>
  )
}

