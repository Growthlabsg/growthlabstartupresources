'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Target, Users2, BarChart, Check } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const marketingResources = [
  {
    id: 'strategy',
    title: 'Digital Marketing Strategy',
    description: 'Build a comprehensive digital marketing strategy for your startup.',
    icon: <Target className="h-6 w-6" />,
    link: '/startup/marketing/strategy',
    features: ['SEO & Content Marketing', 'Social Media Strategy', 'Paid Advertising'],
  },
  {
    id: 'sales',
    title: 'Sales Process Builder',
    description: 'Create and optimize your sales process and pipeline.',
    icon: <Users2 className="h-6 w-6" />,
    link: '/startup/sales/process',
    features: ['Lead Generation', 'Sales Funnel Design', 'CRM Setup'],
  },
  {
    id: 'analytics',
    title: 'Growth Analytics',
    description: 'Track and analyze your marketing and sales performance.',
    icon: <BarChart className="h-6 w-6" />,
    link: '/startup/marketing/analytics',
    features: ['KPI Dashboard', 'Conversion Tracking', 'ROI Analysis'],
  },
]

export default function MarketingSalesSection() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Marketing & Sales</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Comprehensive marketing and sales resources to help you acquire customers and grow your revenue.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {marketingResources.map((resource) => (
          <Card key={resource.id} className="border-2 border-primary-500/20 hover:border-primary-500 transition-all">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-primary-500/10 p-2 rounded-md">
                {resource.icon}
              </div>
              <h3 className="text-lg font-semibold">{resource.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
            <div className="space-y-2 text-sm mb-4">
              {resource.features.map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Button 
              className="w-full bg-primary-500 hover:bg-primary-500/90" 
              size="sm"
              onClick={() => {
                const action = resource.id === 'strategy' ? 'Build Strategy' : resource.id === 'sales' ? 'Build Process' : 'Track Growth'
                showToast(`Opening ${resource.title}...`, 'info')
                window.location.href = resource.link
              }}
            >
              {resource.id === 'strategy' ? 'Build Strategy' : resource.id === 'sales' ? 'Build Process' : 'Track Growth'}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

