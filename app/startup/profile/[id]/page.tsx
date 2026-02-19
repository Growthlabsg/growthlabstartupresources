'use client'

import { use } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { ArrowLeft, Building2, MapPin, DollarSign, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const startups: Record<string, any> = {
  '1': {
    id: '1',
    name: 'TechFlow',
    industry: 'SaaS',
    stage: 'Series A',
    location: 'San Francisco, CA',
    description: 'AI-powered workflow automation platform',
    funding: '$10M',
    employees: 45,
    founded: '2020',
  },
  '2': {
    id: '2',
    name: 'DataViz',
    industry: 'Analytics',
    stage: 'Seed',
    location: 'New York, NY',
    description: 'Data visualization and business intelligence tools',
    funding: '$2.5M',
    employees: 12,
    founded: '2021',
  },
  '3': {
    id: '3',
    name: 'EcoTech',
    industry: 'CleanTech',
    stage: 'Series B',
    location: 'Austin, TX',
    description: 'Sustainable energy solutions for businesses',
    funding: '$25M',
    employees: 120,
    founded: '2019',
  },
}

export default function StartupProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const startup = startups[id]

  if (!startup) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Startup Not Found</h2>
              <p className="text-gray-600 mb-6">The startup profile you're looking for doesn't exist.</p>
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
            Back to Directory
          </Button>
        </Link>

        <Card>
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 gradient-text">{startup.name}</h1>
                <Badge className="mt-2">{startup.stage}</Badge>
              </div>
              <div className="bg-primary-500/10 p-4 rounded-lg">
                <Building2 className="h-8 w-8 text-primary-500" />
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-6">{startup.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">Industry</p>
              <p className="font-semibold">{startup.industry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <p className="font-semibold">{startup.location}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Funding</p>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <p className="font-semibold">{startup.funding}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Team Size</p>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-400" />
                <p className="font-semibold">{startup.employees}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => window.open(`mailto:contact@${startup.name.toLowerCase()}.com`, '_blank')}>
              Contact
            </Button>
            <Button variant="outline" onClick={() => window.open(`https://${startup.name.toLowerCase()}.com`, '_blank')}>
              Visit Website
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}

