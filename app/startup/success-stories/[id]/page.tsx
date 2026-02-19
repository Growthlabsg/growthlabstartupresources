'use client'

import { use } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ArrowLeft, TrendingUp, DollarSign, Users } from 'lucide-react'
import Link from 'next/link'

const stories: Record<string, any> = {
  'techflow': {
    id: 'techflow',
    title: 'TechFlow: From Idea to $10M Series A',
    company: 'TechFlow',
    industry: 'SaaS',
    funding: '$10M',
    employees: 45,
    story: 'TechFlow started as a simple idea to automate workflow processes. Through strategic planning and execution, they raised $10M in Series A funding...',
  },
  'dataviz': {
    id: 'dataviz',
    title: 'DataViz: Scaling Analytics Platform',
    company: 'DataViz',
    industry: 'Analytics',
    funding: '$2.5M',
    employees: 12,
    story: 'DataViz built a powerful analytics platform that helps businesses visualize their data. They successfully raised seed funding and are growing rapidly...',
  },
  'ecotech': {
    id: 'ecotech',
    title: 'EcoTech: Sustainable Energy Solutions',
    company: 'EcoTech',
    industry: 'CleanTech',
    funding: '$25M',
    employees: 120,
    story: 'EcoTech is revolutionizing sustainable energy solutions for businesses. They raised $25M in Series B and are making a significant impact...',
  },
}

export default function SuccessStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const story = stories[id]

  if (!story) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Story Not Found</h2>
              <p className="text-gray-600 mb-6">The success story you're looking for doesn't exist.</p>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <h1 className="text-4xl font-bold mb-6 gradient-text">{story.title}</h1>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">Industry</p>
              <p className="font-semibold">{story.industry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Funding</p>
              <p className="font-semibold">{story.funding}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Team Size</p>
              <p className="font-semibold">{story.employees} employees</p>
            </div>
          </div>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">{story.story}</p>
          </div>
        </Card>
      </div>
    </main>
  )
}

