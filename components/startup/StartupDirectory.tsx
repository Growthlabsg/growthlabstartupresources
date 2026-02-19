'use client'

import { useState, useMemo } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Search, Building2, TrendingUp, MapPin } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

const startups = [
  {
    id: '1',
    name: 'TechFlow',
    industry: 'SaaS',
    stage: 'Series A',
    location: 'San Francisco, CA',
    description: 'AI-powered workflow automation platform',
    funding: '$10M',
    employees: 45,
  },
  {
    id: '2',
    name: 'DataViz',
    industry: 'Analytics',
    stage: 'Seed',
    location: 'New York, NY',
    description: 'Data visualization and business intelligence tools',
    funding: '$2.5M',
    employees: 12,
  },
  {
    id: '3',
    name: 'EcoTech',
    industry: 'CleanTech',
    stage: 'Series B',
    location: 'Austin, TX',
    description: 'Sustainable energy solutions for businesses',
    funding: '$25M',
    employees: 120,
  },
  {
    id: '4',
    name: 'HealthSync',
    industry: 'HealthTech',
    stage: 'Seed',
    location: 'Boston, MA',
    description: 'Healthcare data synchronization platform',
    funding: '$5M',
    employees: 28,
  },
  {
    id: '5',
    name: 'FinanceHub',
    industry: 'FinTech',
    stage: 'Series A',
    location: 'Chicago, IL',
    description: 'Financial planning and investment tools',
    funding: '$15M',
    employees: 65,
  },
  {
    id: '6',
    name: 'EduLearn',
    industry: 'EdTech',
    stage: 'Pre-Seed',
    location: 'Seattle, WA',
    description: 'Online learning platform for professionals',
    funding: '$1M',
    employees: 8,
  },
]

export default function StartupDirectory() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStartups = useMemo(() => {
    if (!searchQuery.trim()) return startups
    
    const query = searchQuery.toLowerCase()
    return startups.filter((startup) =>
      startup.name.toLowerCase().includes(query) ||
      startup.description.toLowerCase().includes(query) ||
      startup.industry.toLowerCase().includes(query) ||
      startup.location.toLowerCase().includes(query)
    )
  }, [searchQuery])

  return (
    <section className="section-spacing bg-white">
      <div className="section-container">
        <div className="mb-12 lg:mb-16">
          <h2 className="section-title">Startup Directory</h2>
          <p className="section-subtitle">
            Discover and connect with innovative startups in our ecosystem.
          </p>
        </div>

      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search startups by name, industry, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
          />
        </div>
      </div>

      {filteredStartups.length === 0 ? (
        <EmptyState
          icon={<Search className="h-12 w-12 mx-auto text-gray-400" />}
          title="No startups found"
          description="Try a different search term"
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-6 font-medium">
            Showing {filteredStartups.length} startup{filteredStartups.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredStartups.map((startup) => (
          <Card key={startup.id} className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-primary-500/10 p-3 rounded-lg">
                <Building2 className="h-6 w-6 text-primary-500" />
              </div>
              <Badge>{startup.stage}</Badge>
            </div>
            <h3 className="text-lg font-semibold mb-2">{startup.name}</h3>
            <p className="text-sm text-gray-600 mb-4 flex-grow">{startup.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-xs text-gray-500">
                <span className="font-medium mr-2">Industry:</span>
                <Badge variant="outline" className="text-xs">{startup.industry}</Badge>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                {startup.location}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Funding: <span className="font-medium text-gray-900">{startup.funding}</span></span>
                <span className="text-gray-500">Team: <span className="font-medium text-gray-900">{startup.employees}</span></span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = `/startup/profile/${startup.id}`
                }
              }}
            >
              View Profile
            </Button>
          </Card>
        ))}
          </div>
        </>
      )}
      </div>
    </section>
  )
}

