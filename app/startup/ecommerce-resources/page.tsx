'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { ShoppingCart, Package, Truck, CreditCard, Search, Star, ExternalLink, CheckCircle, Store, Box, Globe, TrendingUp, BarChart, Users, Tag, Image, Mail, Smartphone, FileText, Video, BookOpen, Calculator, Zap, Heart, Shield } from 'lucide-react'
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
  { id: 'all', name: 'All Categories', icon: ShoppingCart },
  { id: 'platform', name: 'Platform Setup', icon: Store },
  { id: 'inventory', name: 'Inventory Management', icon: Package },
  { id: 'shipping', name: 'Shipping & Fulfillment', icon: Truck },
  { id: 'payments', name: 'Payments', icon: CreditCard },
  { id: 'marketing', name: 'Marketing & SEO', icon: TrendingUp },
  { id: 'analytics', name: 'Analytics & Reporting', icon: BarChart },
  { id: 'customer', name: 'Customer Experience', icon: Users },
]

const resources: Resource[] = [
  // Platform Setup
  {
    id: '1',
    title: 'E-commerce Platform Setup',
    description: 'Choose and set up the right e-commerce platform: Shopify, WooCommerce, BigCommerce, or custom solutions.',
    category: 'platform',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Store,
    tags: ['Shopify', 'WooCommerce', 'BigCommerce', 'Platform'],
    rating: 4.9
  },
  {
    id: '2',
    title: 'Shopify Store Setup Guide',
    description: 'Complete guide to setting up and customizing your Shopify store from scratch.',
    category: 'platform',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: Store,
    tags: ['Shopify', 'Setup', 'Customization', 'Tutorial']
  },
  {
    id: '3',
    title: 'WooCommerce Configuration',
    description: 'Configure WooCommerce on WordPress for a powerful, customizable e-commerce solution.',
    category: 'platform',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Store,
    tags: ['WooCommerce', 'WordPress', 'Configuration', 'Setup']
  },
  {
    id: '4',
    title: 'Platform Comparison Tool',
    description: 'Compare e-commerce platforms to find the best fit for your business needs.',
    category: 'platform',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    icon: Store,
    tags: ['Comparison', 'Platform Selection', 'Features', 'Pricing']
  },
  
  // Inventory Management
  {
    id: '5',
    title: 'Inventory Management System',
    description: 'Set up inventory tracking, stock alerts, and automated reordering systems.',
    category: 'inventory',
    type: 'tool',
    link: '/startup/operations-dashboard',
    featured: true,
    popular: true,
    icon: Package,
    tags: ['Inventory', 'Stock Management', 'Automation', 'Tracking'],
    rating: 4.8
  },
  {
    id: '6',
    title: 'Multi-Channel Inventory Sync',
    description: 'Synchronize inventory across multiple sales channels and marketplaces.',
    category: 'inventory',
    type: 'guide',
    link: '/startup/operations-dashboard',
    popular: true,
    icon: Package,
    tags: ['Multi-Channel', 'Sync', 'Marketplace', 'Inventory']
  },
  {
    id: '7',
    title: 'Supply Chain Optimization',
    description: 'Optimize your supply chain for cost efficiency and faster delivery.',
    category: 'inventory',
    type: 'guide',
    link: '/startup/operations-dashboard',
    icon: Box,
    tags: ['Supply Chain', 'Optimization', 'Logistics', 'Cost']
  },
  {
    id: '8',
    title: 'Inventory Forecasting',
    description: 'Predict demand and optimize inventory levels using data analytics.',
    category: 'inventory',
    type: 'tool',
    link: '/startup/operations-dashboard',
    icon: BarChart,
    tags: ['Forecasting', 'Demand Planning', 'Analytics', 'Inventory']
  },
  
  // Shipping & Fulfillment
  {
    id: '9',
    title: 'Shipping & Logistics Setup',
    description: 'Set up shipping rates, carriers, and fulfillment processes for your store.',
    category: 'shipping',
    type: 'tool',
    link: '/startup/operations-dashboard',
    featured: true,
    popular: true,
    icon: Truck,
    tags: ['Shipping', 'Fulfillment', 'Carriers', 'Logistics'],
    rating: 4.7
  },
  {
    id: '10',
    title: 'Fulfillment Center Guide',
    description: 'Choose between in-house fulfillment, 3PL, or dropshipping models.',
    category: 'shipping',
    type: 'guide',
    link: '/startup/operations-dashboard',
    popular: true,
    icon: Truck,
    tags: ['Fulfillment', '3PL', 'Dropshipping', 'Warehouse']
  },
  {
    id: '11',
    title: 'Shipping Rate Calculator',
    description: 'Calculate shipping costs and optimize rates for different zones and products.',
    category: 'shipping',
    type: 'tool',
    link: '/startup/pricing-calculator',
    icon: Calculator,
    tags: ['Shipping Rates', 'Calculator', 'Zones', 'Cost']
  },
  {
    id: '12',
    title: 'International Shipping Guide',
    description: 'Navigate international shipping, customs, and cross-border e-commerce.',
    category: 'shipping',
    type: 'guide',
    link: '/startup/international-expansion',
    icon: Globe,
    tags: ['International', 'Customs', 'Cross-Border', 'Shipping']
  },
  
  // Payments
  {
    id: '13',
    title: 'Payment Gateway Integration',
    description: 'Integrate payment processing with Stripe, PayPal, Square, and other gateways.',
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
    id: '14',
    title: 'Payment Method Optimization',
    description: 'Offer multiple payment options to increase conversion rates.',
    category: 'payments',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: CreditCard,
    tags: ['Payment Methods', 'Conversion', 'Optimization', 'Checkout']
  },
  {
    id: '15',
    title: 'Subscription Payment Setup',
    description: 'Implement recurring payments and subscription billing for your products.',
    category: 'payments',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: CreditCard,
    tags: ['Subscriptions', 'Recurring Payments', 'Billing', 'SaaS']
  },
  
  // Marketing & SEO
  {
    id: '16',
    title: 'E-commerce SEO Guide',
    description: 'Optimize your store for search engines to drive organic traffic and sales.',
    category: 'marketing',
    type: 'guide',
    link: '/startup/marketing/strategy',
    featured: true,
    popular: true,
    icon: TrendingUp,
    tags: ['SEO', 'Search Optimization', 'Keywords', 'Traffic'],
    rating: 4.7
  },
  {
    id: '17',
    title: 'Product Listing Optimization',
    description: 'Create compelling product listings that convert visitors into customers.',
    category: 'marketing',
    type: 'guide',
    link: '/startup/marketing/strategy',
    popular: true,
    icon: Tag,
    tags: ['Product Listings', 'Copywriting', 'Images', 'Conversion']
  },
  {
    id: '18',
    title: 'Email Marketing for E-commerce',
    description: 'Build email campaigns that drive repeat purchases and customer loyalty.',
    category: 'marketing',
    type: 'guide',
    link: '/startup/marketing/strategy',
    icon: Mail,
    tags: ['Email Marketing', 'Campaigns', 'Automation', 'Retention']
  },
  {
    id: '19',
    title: 'Social Media E-commerce',
    description: 'Sell on social media platforms like Instagram, Facebook, and TikTok.',
    category: 'marketing',
    type: 'guide',
    link: '/startup/marketing/strategy',
    icon: Smartphone,
    tags: ['Social Commerce', 'Instagram', 'Facebook', 'TikTok']
  },
  
  // Analytics & Reporting
  {
    id: '20',
    title: 'E-commerce Analytics Dashboard',
    description: 'Track sales, conversion rates, customer behavior, and key e-commerce metrics.',
    category: 'analytics',
    type: 'tool',
    link: '/startup/marketing/analytics',
    featured: true,
    popular: true,
    icon: BarChart,
    tags: ['Analytics', 'Dashboard', 'Metrics', 'Reporting'],
    rating: 4.8
  },
  {
    id: '21',
    title: 'Conversion Rate Optimization',
    description: 'Analyze and improve your store\'s conversion rate with data-driven insights.',
    category: 'analytics',
    type: 'guide',
    link: '/startup/conversion-rate-calculator',
    popular: true,
    icon: TrendingUp,
    tags: ['CRO', 'Conversion', 'Optimization', 'A/B Testing']
  },
  {
    id: '22',
    title: 'Sales Reporting & Forecasting',
    description: 'Generate sales reports and forecast future revenue trends.',
    category: 'analytics',
    type: 'tool',
    link: '/startup/financial-projections',
    icon: BarChart,
    tags: ['Sales Reports', 'Forecasting', 'Revenue', 'Trends']
  },
  
  // Customer Experience
  {
    id: '23',
    title: 'Customer Experience Optimization',
    description: 'Improve customer experience from browsing to checkout and beyond.',
    category: 'customer',
    type: 'guide',
    link: '/startup/customer-discovery',
    featured: true,
    icon: Users,
    tags: ['Customer Experience', 'UX', 'Checkout', 'Retention'],
    rating: 4.6
  },
  {
    id: '24',
    title: 'Customer Reviews & Ratings',
    description: 'Implement review systems to build trust and increase conversions.',
    category: 'customer',
    type: 'guide',
    link: '/startup/customer-discovery',
    popular: true,
    icon: Heart,
    tags: ['Reviews', 'Ratings', 'Trust', 'Social Proof']
  },
  {
    id: '25',
    title: 'Customer Support Setup',
    description: 'Set up customer support systems including live chat, help desk, and FAQs.',
    category: 'customer',
    type: 'guide',
    link: '/startup/operations-dashboard',
    icon: Users,
    tags: ['Support', 'Live Chat', 'Help Desk', 'Customer Service']
  },
  {
    id: '26',
    title: 'Loyalty Program Builder',
    description: 'Create and manage customer loyalty programs to increase retention.',
    category: 'customer',
    type: 'tool',
    link: '/startup/operations-dashboard',
    icon: Heart,
    tags: ['Loyalty Programs', 'Rewards', 'Retention', 'Points']
  },
  
  // Security & Compliance
  {
    id: '27',
    title: 'E-commerce Security Best Practices',
    description: 'Protect your store and customer data with essential security measures.',
    category: 'platform',
    type: 'guide',
    link: '/startup/legal/privacy',
    featured: true,
    icon: Shield,
    tags: ['Security', 'PCI DSS', 'Data Protection', 'SSL'],
    rating: 4.7
  },
  {
    id: '28',
    title: 'GDPR Compliance for E-commerce',
    description: 'Ensure your store complies with GDPR and other data protection regulations.',
    category: 'platform',
    type: 'guide',
    link: '/startup/legal/privacy',
    icon: Shield,
    tags: ['GDPR', 'Compliance', 'Data Privacy', 'Regulation']
  },
]

export default function EcommerceResourcesPage() {
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

  const CategoryIcon = categories.find(c => c.id === selectedCategory)?.icon || ShoppingCart

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
            <ShoppingCart className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
            E-commerce Resources
          </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Resources to help you build and scale your e-commerce business. From platform setup to marketing, find everything you need to succeed online.
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
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
            <Link href="/startup/marketing/strategy">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <TrendingUp className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Marketing Tools</h3>
                <p className="text-sm text-gray-600">E-commerce marketing</p>
              </Card>
            </Link>
            
            <Link href="/startup/conversion-rate-calculator">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <BarChart className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Conversion Tools</h3>
                <p className="text-sm text-gray-600">Optimize conversions</p>
              </Card>
            </Link>
            
            <Link href="/startup/pricing-calculator">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <Calculator className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Pricing Calculator</h3>
                <p className="text-sm text-gray-600">Price optimization</p>
              </Card>
            </Link>
            
            <Link href="/startup/operations-dashboard">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <Package className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Operations Dashboard</h3>
                <p className="text-sm text-gray-600">Manage operations</p>
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
              <h3 className="text-lg font-semibold mb-2">E-commerce Video Tutorials</h3>
              <p className="text-sm text-gray-600 mb-4">Watch step-by-step tutorials for store setup, marketing, and optimization</p>
              <Link href="/startup/technical-skills">
                <Button variant="outline" size="sm" className="w-full">
                  Watch Videos
                </Button>
              </Link>
            </Card>
            
            <Card className="p-6">
              <FileText className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">E-commerce Templates</h3>
              <p className="text-sm text-gray-600 mb-4">Download product descriptions, email templates, and store policies</p>
              <Link href="/startup/legal-documents">
                <Button variant="outline" size="sm" className="w-full">
                  Browse Templates
                </Button>
              </Link>
            </Card>
            
            <Card className="p-6">
              <Calculator className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">E-commerce Calculators</h3>
              <p className="text-sm text-gray-600 mb-4">Calculate profit margins, shipping costs, and pricing strategies</p>
              <Link href="/startup/pricing-calculator">
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
