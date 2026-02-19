'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Rocket, Target, Building2, Check } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const programs = [
  {
    id: 'pre-seed',
    title: 'Pre-Seed Accelerator',
    description: 'Perfect for early-stage startups looking to validate their idea and build an MVP.',
    icon: <Rocket className="h-6 w-6" />,
    link: '/accelerator/pre-seed',
    badge: '3 Months',
    badgeColor: 'bg-green-500',
    funding: '$25K',
    equity: '5%',
    features: ['$25K Funding', 'Mentorship Program', 'Workshop Series', 'Demo Day Access'],
  },
  {
    id: 'seed',
    title: 'Seed Accelerator',
    description: 'For startups with validated products ready to scale and raise Series A funding.',
    icon: <Target className="h-6 w-6" />,
    link: '/accelerator/seed',
    badge: '6 Months',
    badgeColor: 'bg-blue-500',
    funding: '$100K',
    equity: '7%',
    features: ['$100K Funding', '1-on-1 Mentorship', 'Investor Network', 'Co-working Space'],
  },
  {
    id: 'scale',
    title: 'Scale Accelerator',
    description: 'For growth-stage startups looking to expand internationally and prepare for Series B+.',
    icon: <Building2 className="h-6 w-6" />,
    link: '/accelerator/scale',
    badge: '12 Months',
    badgeColor: 'bg-purple-500',
    funding: '$500K',
    equity: '10%',
    features: ['$500K Funding', 'Executive Coaching', 'Global Expansion', 'IPO Preparation'],
  },
]

export default function AcceleratorProgramsSection() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Startup Accelerator Programs</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Join our comprehensive accelerator programs designed to fast-track your startup's growth and success.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="border-2 border-primary-500/20 hover:border-primary-500 transition-all">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-primary-500/10 p-2 rounded-md">
                {program.icon}
              </div>
              <div className="flex items-center flex-1">
                <h3 className="text-lg font-semibold">{program.title}</h3>
                <Badge className={`ml-2 ${program.badgeColor}`}>{program.badge}</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{program.description}</p>
            <div className="space-y-2 text-sm mb-4">
              {program.features.map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="mb-4 text-center">
              <span className="text-2xl font-bold">{program.equity}</span>
              <span className="text-sm text-gray-500"> equity</span>
            </div>
            <Button 
              className="w-full bg-primary-500 hover:bg-primary-500/90" 
              size="sm"
              onClick={() => {
                showToast(`Opening application for ${program.title}...`, 'info')
                window.location.href = program.link
              }}
            >
              Apply Now
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

