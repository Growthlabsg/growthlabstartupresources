'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { BookOpen, Users2, Target, DollarSign, Check } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const learningResources = [
  {
    id: 'academy',
    title: 'Startup Academy',
    description: 'Comprehensive courses covering all aspects of building and scaling a startup.',
    icon: <BookOpen className="h-6 w-6" />,
    link: '/startup/academy',
    features: ['50+ Video Courses', 'Expert Instructors', 'Certificates'],
  },
  {
    id: 'leadership',
    title: 'Leadership Training',
    description: 'Develop essential leadership skills for startup founders and team leaders.',
    icon: <Users2 className="h-6 w-6" />,
    link: '/startup/leadership-training',
    features: ['Team Building', 'Decision Making', 'Communication'],
  },
  {
    id: 'technical',
    title: 'Technical Skills',
    description: 'Learn essential technical skills for modern startups and digital businesses.',
    icon: <Target className="h-6 w-6" />,
    link: '/startup/technical-skills',
    features: ['Web Development', 'Data Analysis', 'AI & ML'],
  },
  {
    id: 'financial',
    title: 'Financial Literacy',
    description: 'Master financial concepts essential for startup success and growth.',
    icon: <DollarSign className="h-6 w-6" />,
    link: '/startup/financial-literacy',
    features: ['Accounting Basics', 'Investment Strategies', 'Risk Management'],
  },
]

export default function LearningDevelopmentSection() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Learning & Development</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Continuous learning resources to help you and your team grow and stay ahead of the competition.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {learningResources.map((resource) => (
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
                const action = resource.id === 'academy' ? 'Start Learning' : resource.id === 'leadership' ? 'Enroll Now' : resource.id === 'technical' ? 'Learn Tech' : 'Learn Finance'
                showToast(`Opening ${resource.title}...`, 'info')
                window.location.href = resource.link
              }}
            >
              {resource.id === 'academy' ? 'Start Learning' : resource.id === 'leadership' ? 'Enroll Now' : resource.id === 'technical' ? 'Learn Tech' : 'Learn Finance'}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

