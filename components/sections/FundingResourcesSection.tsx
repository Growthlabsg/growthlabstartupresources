'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { DollarSign, Users, FileText, Check } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const fundingResources = [
  {
    id: 'readiness',
    title: 'Funding Readiness Assessment',
    description: 'Evaluate your startup\'s readiness for different types of funding.',
    icon: <DollarSign className="h-6 w-6" />,
    link: '/startup/funding/readiness',
    features: ['Financial Health Check', 'Investor Readiness Score', 'Funding Strategy Recommendations'],
  },
  {
    id: 'investors',
    title: 'Investor Database',
    description: 'Connect with investors who match your startup\'s profile and stage.',
    icon: <Users className="h-6 w-6" />,
    link: '/startup/funding/investors',
    features: ['500+ Active Investors', 'Industry & Stage Filtering', 'Direct Contact Information'],
  },
  {
    id: 'grants',
    title: 'Grant Opportunities',
    description: 'Discover government grants and non-dilutive funding opportunities.',
    icon: <FileText className="h-6 w-6" />,
    link: '/startup/funding/grants',
    features: ['Government Grants', 'Corporate Innovation Programs', 'Application Assistance'],
  },
]

export default function FundingResourcesSection() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Funding & Investment Resources</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Comprehensive funding resources to help you secure the capital you need to grow your startup.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {fundingResources.map((resource) => (
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
                const action = resource.id === 'readiness' ? 'Assess Readiness' : resource.id === 'investors' ? 'Find Investors' : 'Find Grants'
                showToast(`Opening ${resource.title}...`, 'info')
                window.location.href = resource.link
              }}
            >
              {resource.id === 'readiness' ? 'Assess Readiness' : resource.id === 'investors' ? 'Find Investors' : 'Find Grants'}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

