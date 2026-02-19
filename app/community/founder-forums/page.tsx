'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Users, MessageSquare, TrendingUp } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const forums = [
  {
    id: '1',
    title: 'Early Stage Founders',
    description: 'Connect with other early-stage startup founders',
    members: 1200,
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: '2',
    title: 'Fundraising Discussions',
    description: 'Share experiences and advice about fundraising',
    members: 800,
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    id: '3',
    title: 'Growth & Scaling',
    description: 'Discuss strategies for growing and scaling your startup',
    members: 950,
    icon: <TrendingUp className="h-6 w-6" />,
  },
]

export default function FounderForumsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text">
            Founder Forums
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Join discussions with fellow founders and share experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {forums.map((forum) => (
            <Card key={forum.id} className="flex flex-col">
              <div className="bg-primary-500/10 p-3 rounded-lg text-primary-500 w-fit mb-4">
                {forum.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{forum.title}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow">{forum.description}</p>
              <div className="text-xs text-gray-500 mb-4">{forum.members} members</div>
              <Button
                className="w-full"
                onClick={() => showToast(`Joining ${forum.title}...`, 'info')}
              >
                Join Forum
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

