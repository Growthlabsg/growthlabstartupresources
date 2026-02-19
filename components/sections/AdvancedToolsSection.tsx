import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Building2, Globe, Settings } from 'lucide-react'

const advancedTools = [
  {
    id: 'team-management',
    title: 'Team Management Hub',
    description: 'Manage your startup team with advanced HR tools, performance tracking, and collaboration features.',
    icon: <Building2 className="h-6 w-6" />,
    link: '/startup/team-management',
    badge: 'Pro',
    badgeColor: 'bg-blue-500',
    features: ['Employee Onboarding', 'Performance Reviews', 'Goal Tracking', 'Team Analytics'],
  },
  {
    id: 'international',
    title: 'International Expansion',
    description: 'Plan and execute your global expansion with market entry strategies and compliance tools.',
    icon: <Globe className="h-6 w-6" />,
    link: '/startup/international-expansion',
    badge: 'Global',
    badgeColor: 'bg-purple-500',
    features: ['Market Entry', 'Legal Compliance', 'Currency Management', 'Local Partnerships'],
  },
  {
    id: 'operations',
    title: 'Operations Dashboard',
    description: 'Monitor and optimize your startup\'s operations with real-time analytics and automation tools.',
    icon: <Settings className="h-6 w-6" />,
    link: '/startup/operations-dashboard',
    badge: 'New',
    badgeColor: 'bg-green-500',
    features: ['Process Automation', 'KPI Tracking', 'Resource Planning', 'Quality Control'],
  },
]

export default function AdvancedToolsSection() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Advanced Startup Tools</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Professional-grade tools for scaling startups and managing complex operations.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {advancedTools.map((tool) => (
          <Card key={tool.id} className="border-2 border-primary-500/20 hover:border-primary-500 transition-all">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-primary-500/10 p-2 rounded-md">
                {tool.icon}
              </div>
              <div className="flex items-center flex-1">
                <h3 className="text-lg font-semibold">{tool.title}</h3>
                <Badge className={`ml-2 ${tool.badgeColor}`}>{tool.badge}</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {tool.features.map((feature, idx) => (
                <div key={idx} className="bg-gray-100 rounded-md p-2 text-center text-sm">
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <Link href={tool.link}>
              <Button className="w-full bg-primary-500 hover:bg-primary-500/90" size="sm">
                {tool.id === 'team-management' ? 'Manage Team' : tool.id === 'international' ? 'Go Global' : 'View Dashboard'}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}

