'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Settings, BarChart, Target, DollarSign, Check } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const toolCategories = [
  {
    id: 'productivity',
    title: 'Productivity Tools',
    description: 'Essential tools for team collaboration and productivity.',
    icon: <Settings className="h-6 w-6" />,
    link: '/startup/tools/productivity',
    examples: ['Slack, Notion, Asana', 'Google Workspace', 'Zoom, Calendly'],
  },
  {
    id: 'analytics',
    title: 'Analytics & Data',
    description: 'Tools for tracking performance and making data-driven decisions.',
    icon: <BarChart className="h-6 w-6" />,
    link: '/startup/tools/analytics',
    examples: ['Google Analytics', 'Mixpanel, Amplitude', 'Tableau, Looker'],
  },
  {
    id: 'marketing',
    title: 'Marketing Tools',
    description: 'Comprehensive marketing and growth tools for customer acquisition.',
    icon: <Target className="h-6 w-6" />,
    link: '/startup/tools/marketing',
    examples: ['HubSpot, Mailchimp', 'Hootsuite, Buffer', 'Canva, Figma'],
  },
  {
    id: 'financial',
    title: 'Financial Tools',
    description: 'Essential financial management and accounting tools.',
    icon: <DollarSign className="h-6 w-6" />,
    link: '/startup/tools/financial',
    examples: ['QuickBooks, Xero', 'Stripe, PayPal', 'Expensify, Receipt Bank'],
  },
]

export default function ToolsSoftwareSection() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Recommended Tools & Software</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Curated list of essential tools and software that successful startups use to build, grow, and scale their businesses.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {toolCategories.map((category) => (
          <Card key={category.id} className="border-2 border-primary-500/20 hover:border-primary-500 transition-all">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-primary-500/10 p-2 rounded-md">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold">{category.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            <div className="space-y-2 text-sm mb-4">
              {category.examples.map((example, idx) => (
                <div key={idx} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>{example}</span>
                </div>
              ))}
            </div>
            <Button 
              className="w-full bg-primary-500 hover:bg-primary-500/90" 
              size="sm"
              onClick={() => {
                showToast(`Opening ${category.title} tools...`, 'info')
                window.location.href = category.link
              }}
            >
              View Tools
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

