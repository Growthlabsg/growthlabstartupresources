'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Scale, FileText, Users, Shield, Check } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const legalResources = [
  {
    id: 'structure',
    title: 'Legal Structure Setup',
    description: 'Choose and set up the right legal structure for your startup.',
    icon: <Scale className="h-6 w-6" />,
    link: '/startup/legal/structure',
    features: ['Entity Formation', 'Tax Registration', 'Business Licenses'],
  },
  {
    id: 'ip',
    title: 'IP Protection',
    description: 'Protect your intellectual property and innovations.',
    icon: <FileText className="h-6 w-6" />,
    link: '/startup/legal/ip-protection',
    features: ['Patent Applications', 'Trademark Registration', 'Copyright Protection'],
  },
  {
    id: 'employment',
    title: 'Employment Law',
    description: 'Navigate employment law and HR compliance.',
    icon: <Users className="h-6 w-6" />,
    link: '/startup/legal/employment',
    features: ['Employment Contracts', 'Labor Law Compliance', 'Equity Distribution'],
  },
  {
    id: 'privacy',
    title: 'Data Privacy & Security',
    description: 'Ensure compliance with data protection regulations.',
    icon: <Shield className="h-6 w-6" />,
    link: '/startup/legal/privacy',
    features: ['GDPR Compliance', 'Privacy Policies', 'Security Audits'],
  },
]

export default function LegalComplianceSection() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Legal & Compliance</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Essential legal resources to ensure your startup is compliant and protected.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {legalResources.map((resource) => (
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
                const action = resource.id === 'structure' ? 'Setup Legal' : resource.id === 'ip' ? 'Protect IP' : resource.id === 'employment' ? 'HR Compliance' : 'Ensure Privacy'
                showToast(`Opening ${resource.title}...`, 'info')
                window.location.href = resource.link
              }}
            >
              {resource.id === 'structure' ? 'Setup Legal' : resource.id === 'ip' ? 'Protect IP' : resource.id === 'employment' ? 'HR Compliance' : 'Ensure Privacy'}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

