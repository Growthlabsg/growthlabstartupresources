'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Lightbulb, Target, BarChart, Building2, Check } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const stages = [
  {
    id: 'idea',
    title: 'Idea Stage',
    description: 'Validate your idea and build a solid foundation.',
    icon: <Lightbulb className="h-6 w-6" />,
    badge: 'Stage 1',
    badgeColor: 'bg-yellow-500',
    link: '/startup/stage/idea',
    features: ['Idea Validation', 'Market Research', 'MVP Planning', 'Team Formation'],
  },
  {
    id: 'launch',
    title: 'Launch Stage',
    description: 'Build and launch your product to market.',
    icon: <Target className="h-6 w-6" />,
    badge: 'Stage 2',
    badgeColor: 'bg-blue-500',
    link: '/startup/stage/launch',
    features: ['Product Development', 'Go-to-Market Strategy', 'Customer Acquisition', 'Legal Setup'],
  },
  {
    id: 'growth',
    title: 'Growth Stage',
    description: 'Scale your business and expand operations.',
    icon: <BarChart className="h-6 w-6" />,
    badge: 'Stage 3',
    badgeColor: 'bg-green-500',
    link: '/startup/stage/growth',
    features: ['Scaling Operations', 'Team Expansion', 'Market Expansion', 'Series A Funding'],
  },
  {
    id: 'scale',
    title: 'Scale Stage',
    description: 'Build a sustainable, profitable business.',
    icon: <Building2 className="h-6 w-6" />,
    badge: 'Stage 4',
    badgeColor: 'bg-purple-500',
    link: '/startup/stage/scale',
    features: ['International Expansion', 'Advanced Funding', 'Exit Strategy', 'IPO Preparation'],
  },
]

export default function StartupJourneySection() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Startup Journey by Stage</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Navigate your startup journey with stage-specific resources and guidance tailored to where you are in your entrepreneurial path.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stages.map((stage) => (
          <Card key={stage.id} className="border-2 border-primary-500/20 hover:border-primary-500 transition-all">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-primary-500/10 p-2 rounded-md">
                {stage.icon}
              </div>
              <div className="flex items-center flex-1">
                <h3 className="text-lg font-semibold">{stage.title}</h3>
                <Badge className={`ml-2 ${stage.badgeColor}`}>{stage.badge}</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{stage.description}</p>
            <div className="space-y-2 text-sm mb-4">
              {stage.features.map((feature, idx) => (
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
                showToast(`Loading ${stage.title} resources...`, 'info')
                window.location.href = stage.link
              }}
            >
              {stage.id === 'idea' ? 'Start Here' : stage.id === 'launch' ? 'Launch Now' : stage.id === 'growth' ? 'Scale Up' : 'Scale Global'}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

