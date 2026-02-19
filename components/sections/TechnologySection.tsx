'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Settings, Globe, Eye, Sparkles, Check } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const techResources = [
  {
    id: 'stack',
    title: 'Tech Stack Builder',
    description: 'Choose the right technology stack for your startup.',
    icon: <Settings className="h-6 w-6" />,
    link: '/startup/tech/stack-builder',
    features: ['Frontend Frameworks', 'Backend Technologies', 'Database Solutions'],
  },
  {
    id: 'cloud',
    title: 'Cloud Infrastructure',
    description: 'Set up scalable cloud infrastructure for your startup.',
    icon: <Globe className="h-6 w-6" />,
    link: '/startup/tech/cloud',
    features: ['AWS/Azure/GCP Setup', 'Cost Optimization', 'Security Best Practices'],
  },
  {
    id: 'devops',
    title: 'DevOps & Deployment',
    description: 'Implement CI/CD and deployment best practices.',
    icon: <Eye className="h-6 w-6" />,
    link: '/startup/tech/devops',
    features: ['CI/CD Pipelines', 'Monitoring & Logging', 'Automated Testing'],
  },
  {
    id: 'ai-ml',
    title: 'AI & ML Integration',
    description: 'Integrate artificial intelligence into your startup.',
    icon: <Sparkles className="h-6 w-6" />,
    link: '/startup/tech/ai-ml',
    features: ['AI Model Selection', 'Data Pipeline Setup', 'MLOps Implementation'],
  },
]

export default function TechnologySection() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Technology & Development</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Technical resources and tools to help you build, deploy, and scale your startup's technology.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {techResources.map((resource) => (
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
                const action = resource.id === 'stack' ? 'Build Stack' : resource.id === 'cloud' ? 'Setup Cloud' : resource.id === 'devops' ? 'Setup DevOps' : 'Integrate AI'
                showToast(`Opening ${resource.title}...`, 'info')
                window.location.href = resource.link
              }}
            >
              {resource.id === 'stack' ? 'Build Stack' : resource.id === 'cloud' ? 'Setup Cloud' : resource.id === 'devops' ? 'Setup DevOps' : 'Integrate AI'}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

