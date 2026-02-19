'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  Check, Star, Clock, Users, Award, ArrowRight, 
  Sparkles, Calendar, Video, MessageCircle, FileText,
  TrendingUp, Shield, Briefcase, Lightbulb, Target,
  DollarSign, Scale, Code, Megaphone, Heart, ChevronRight,
  CheckCircle, Zap, Globe, BookOpen
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface ExpertService {
  id: string
  title: string
  description: string
  price: string
  period: string
  icon: any
  color: string
  bgColor: string
  features: string[]
  popular?: boolean
  deliveryTime: string
  sessionsIncluded?: number
  satisfaction: string
}

const expertServices: ExpertService[] = [
  {
    id: 'pitch-review',
    title: 'Pitch Deck Review',
    description: 'Get professional feedback on your pitch deck from experienced investors and pitch experts.',
    price: '$199',
    period: '/ review',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    features: [
      'Detailed slide-by-slide feedback',
      'Content and design recommendations',
      'Investor perspective insights',
      'Storytelling improvement tips',
      '48-hour turnaround',
    ],
    deliveryTime: '48 hours',
    satisfaction: '98%',
  },
  {
    id: 'business-consultation',
    title: 'Business Strategy Session',
    description: 'Work with a seasoned business advisor to refine your strategy and growth plan.',
    price: '$299',
    period: '/ session',
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    features: [
      '90-minute consultation session',
      'Business model validation',
      'Strategic recommendations',
      'Action plan development',
      'Follow-up summary report',
    ],
    popular: true,
    deliveryTime: '1-2 days',
    sessionsIncluded: 1,
    satisfaction: '97%',
  },
  {
    id: 'financial-modeling',
    title: 'Financial Modeling',
    description: 'Get expert assistance with your financial projections and fundraising strategy.',
    price: '$399',
    period: '/ model',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    features: [
      'Custom financial model creation',
      'Revenue forecasting',
      'Fundraising amount guidance',
      'Valuation methodology',
      'Investor-ready formatting',
    ],
    deliveryTime: '3-5 days',
    satisfaction: '99%',
  },
  {
    id: 'legal-review',
    title: 'Legal Document Review',
    description: 'Have a startup lawyer review your contracts, agreements, and legal documents.',
    price: '$349',
    period: '/ document',
    icon: Scale,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    features: [
      'Contract review & markup',
      'Risk identification',
      'Negotiation recommendations',
      'Compliance check',
      'Attorney-client privilege',
    ],
    deliveryTime: '2-3 days',
    satisfaction: '96%',
  },
  {
    id: 'market-research',
    title: 'Market Research Report',
    description: 'Get a comprehensive market analysis report for your industry and target market.',
    price: '$499',
    period: '/ report',
    icon: Globe,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    features: [
      'Industry analysis',
      'Competitor landscape',
      'Market size estimation',
      'Customer segments',
      'Growth opportunities',
    ],
    deliveryTime: '5-7 days',
    satisfaction: '95%',
  },
  {
    id: 'mentorship-package',
    title: 'Monthly Mentorship',
    description: 'Ongoing mentorship from an experienced founder or industry expert.',
    price: '$599',
    period: '/ month',
    icon: Heart,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    features: [
      '4 one-hour sessions/month',
      'Unlimited async support',
      'Goal setting & tracking',
      'Network introductions',
      'Priority response time',
    ],
    sessionsIncluded: 4,
    deliveryTime: 'Ongoing',
    satisfaction: '99%',
  },
]

const serviceCategories = [
  { id: 'all', label: 'All Services', count: expertServices.length },
  { id: 'strategy', label: 'Strategy', count: 2 },
  { id: 'finance', label: 'Finance', count: 2 },
  { id: 'legal', label: 'Legal', count: 1 },
  { id: 'mentorship', label: 'Mentorship', count: 1 },
]

const testimonials = [
  {
    quote: "The pitch deck review completely transformed our presentation. We closed our seed round 2 weeks later!",
    author: "Sarah Chen",
    role: "CEO, TechFlow",
    avatar: "👩‍💼",
    rating: 5,
  },
  {
    quote: "The financial model helped us understand our unit economics and gave investors confidence in our projections.",
    author: "Marcus Johnson",
    role: "Founder, DataSync",
    avatar: "👨‍💼",
    rating: 5,
  },
  {
    quote: "Monthly mentorship has been invaluable. Having a seasoned founder guide us through challenges is priceless.",
    author: "Emily Rodriguez",
    role: "Co-founder, HealthAI",
    avatar: "👩‍💻",
    rating: 5,
  },
]

export default function ExpertHelpSection() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  const filteredServices = selectedCategory === 'all' 
    ? expertServices 
    : expertServices.filter(s => {
        if (selectedCategory === 'strategy') return ['business-consultation', 'market-research'].includes(s.id)
        if (selectedCategory === 'finance') return ['financial-modeling', 'pitch-review'].includes(s.id)
        if (selectedCategory === 'legal') return s.id === 'legal-review'
        if (selectedCategory === 'mentorship') return s.id === 'mentorship-package'
        return true
      })

  const handleBookService = (service: ExpertService) => {
    showToast(`Booking ${service.title}... Opening calendar.`, 'success')
  }

  return (
    <section id="expert-help" className="mb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-6 w-6 text-primary-500" />
            <Badge variant="category" className="bg-primary-50 text-primary-700">
              Expert Services
            </Badge>
          </div>
          <h2 className="text-3xl font-bold mb-3">Get Expert Help</h2>
          <p className="text-gray-600 max-w-2xl">
            Connect with verified startup experts for personalized guidance. From pitch deck reviews to ongoing mentorship, 
            get the support you need to accelerate your startup journey.
          </p>
        </div>
        <Link href="/experts/register" className="mt-4 lg:mt-0">
          <Button variant="outline" className="group">
            <Briefcase className="h-4 w-4 mr-2" />
            Become an Expert
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {serviceCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredServices.map((service) => {
          const Icon = service.icon
          const isHovered = hoveredService === service.id
          
          return (
            <Card 
              key={service.id}
              className={`relative overflow-hidden transition-all duration-300 ${
                isHovered ? 'shadow-xl scale-[1.02]' : 'hover:shadow-lg'
              } ${service.popular ? 'ring-2 ring-primary-500' : ''}`}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl ${service.bgColor}`}>
                  <Icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{service.deliveryTime}</span>
                    <span className="text-gray-300">•</span>
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span>{service.satisfaction} satisfaction</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{service.description}</p>

              <ul className="space-y-2 text-sm mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">{service.price}</span>
                    <span className="text-sm text-gray-500">{service.period}</span>
                  </div>
                  {service.sessionsIncluded && (
                    <Badge variant="outline" className="text-xs">
                      {service.sessionsIncluded} session{service.sessionsIncluded > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <Button 
                  className="w-full group"
                  onClick={() => handleBookService(service)}
                >
                  Book Now
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-8">
        <h3 className="text-xl font-bold mb-6 text-center">What Founders Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{testimonial.avatar}</span>
                <div>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-xs text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-indigo-600 rounded-2xl p-8 text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className="h-6 w-6" />
          <span className="text-primary-100 font-medium">Expert Network</span>
        </div>
        <h3 className="text-2xl font-bold mb-3">Are You a Startup Expert?</h3>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          Join our network of verified experts and help founders build successful startups. 
          Set your own rates, work flexibly, and make a real impact.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/experts/register">
            <button 
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Apply to Join
            </button>
          </Link>
          <Link href="/experts">
            <button 
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
