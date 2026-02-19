'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Calendar, ArrowRight } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const stories = [
  {
    id: '1',
    title: 'From Idea to $10M Series A',
    description: 'How TechFlow raised their Series A funding in just 18 months using our platform tools.',
    date: 'Dec 2023',
    badge: 'Featured',
    badgeColor: 'bg-green-500',
    link: '/startup/success-stories/techflow',
  },
  {
    id: '2',
    title: 'Bootstrapping to Profitability',
    description: 'Learn how DataViz achieved profitability without external funding using our financial planning tools.',
    date: 'Nov 2023',
    badge: 'Case Study',
    badgeColor: 'bg-blue-500',
    link: '/startup/success-stories/dataviz',
  },
  {
    id: '3',
    title: 'International Expansion Success',
    description: 'How EcoTech expanded to 5 countries using our international expansion tools and mentorship program.',
    date: 'Oct 2023',
    badge: 'Interview',
    badgeColor: 'bg-purple-500',
    link: '/startup/success-stories/ecotech',
  },
]

export default function SuccessStoriesSection() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Success Stories & Case Studies</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Learn from real startup journeys and discover what it takes to build a successful company.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stories.map((story) => (
          <Card key={story.id} className="border-2 border-primary-500/20 hover:border-primary-500 transition-all">
            <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 p-8 text-center mb-4 rounded-lg">
              <div className="text-4xl">🚀</div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <Badge className={story.badgeColor}>{story.badge}</Badge>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {story.date}
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{story.description}</p>
            <Button 
              variant="outline" 
              className="w-full border-primary-500 text-primary-500 hover:bg-primary-500/10" 
              size="sm"
              onClick={() => {
                showToast(`Loading ${story.title}...`, 'info')
                window.location.href = story.link
              }}
            >
              Read Story
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

