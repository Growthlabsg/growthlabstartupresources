'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { BookOpenCheck, TrendingUp, Globe2 } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const learningOptions = [
  {
    id: 'courses',
    title: 'Startup Courses',
    description: 'Comprehensive courses covering all aspects of startup building.',
    icon: <BookOpenCheck className="h-6 w-6" />,
    options: [
      { name: 'Startup Fundamentals', price: 'Free' },
      { name: 'Advanced Growth', price: '$299' },
      { name: 'Fundraising Mastery', price: '$499' },
      { name: 'Leadership & Management', price: '$399' },
    ],
  },
  {
    id: 'webinars',
    title: 'Webinars & Workshops',
    description: 'Live sessions with industry experts and successful entrepreneurs.',
    icon: <TrendingUp className="h-6 w-6" />,
    options: [
      { name: 'Weekly Webinars', price: 'Free' },
      { name: 'Masterclass Series', price: '$99' },
      { name: 'Industry Workshops', price: '$199' },
      { name: '1-on-1 Mentoring', price: '$299/hr' },
    ],
  },
  {
    id: 'network',
    title: 'Global Network',
    description: 'Connect with entrepreneurs and experts worldwide.',
    icon: <Globe2 className="h-6 w-6" />,
    options: [
      { name: 'Founder Network', price: 'Free' },
      { name: 'Investor Network', price: '$99/mo' },
      { name: 'Mentor Matching', price: '$199/mo' },
      { name: 'Co-founder Matching', price: '$299/mo' },
    ],
  },
]

export default function LearningEducationSection() {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Learning & Education</h2>
      <p className="text-lg text-gray-600 mb-8">
        Comprehensive learning resources to develop your entrepreneurial skills and knowledge.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningOptions.map((option) => (
          <Card key={option.id} className="border-2 border-primary-500/20 hover:border-primary-500 transition-all">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-primary-500/10 p-2 rounded-md">
                {option.icon}
              </div>
              <h3 className="text-lg font-semibold">{option.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{option.description}</p>
            <div className="space-y-3 mb-4">
              {option.options.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <Badge variant="outline">{item.price}</Badge>
                </div>
              ))}
            </div>
            <Button 
              className="w-full bg-primary-500 hover:bg-primary-500/90" 
              size="sm"
              onClick={() => {
                const action = option.id === 'courses' ? 'Browse Courses' : option.id === 'webinars' ? 'View Schedule' : 'Join Network'
                showToast(`Opening ${option.title}...`, 'info')
              }}
            >
              {option.id === 'courses' ? 'Browse Courses' : option.id === 'webinars' ? 'View Schedule' : 'Join Network'}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

