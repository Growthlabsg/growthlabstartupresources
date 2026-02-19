'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  Star, Briefcase, Search, Filter, MapPin, Clock,
  CheckCircle, MessageCircle, Calendar, Video, Award,
  ArrowRight, Users, Globe, Shield, Zap, Heart,
  Scale, TrendingUp, Code, Megaphone, Palette, Building2,
  GraduationCap, ChevronRight, ExternalLink, Verified
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface Professional {
  id: string
  name: string
  title: string
  company: string
  rating: number
  reviewCount: number
  specializations: string[]
  avatar: string
  verified: boolean
  hourlyRate: string
  availability: 'available' | 'busy' | 'unavailable'
  responseTime: string
  projectsCompleted: number
  location: string
  bio: string
}

interface ServiceCategory {
  id: string
  name: string
  icon: any
  color: string
  bgColor: string
  description: string
  professionals: Professional[]
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'legal',
    name: 'Legal Services',
    icon: Scale,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Startup lawyers and legal advisors',
    professionals: [
      {
        id: 'l1',
        name: 'John Smith',
        title: 'Startup Lawyer',
        company: 'TechLegal Partners',
        rating: 4.9,
        reviewCount: 127,
        specializations: ['Corporate Law', 'IP Protection', 'Fundraising'],
        avatar: '👨‍💼',
        verified: true,
        hourlyRate: '$350',
        availability: 'available',
        responseTime: '< 2 hours',
        projectsCompleted: 245,
        location: 'San Francisco, CA',
        bio: '15+ years helping startups with legal matters from incorporation to IPO.',
      },
      {
        id: 'l2',
        name: 'Sarah Chen',
        title: 'IP Attorney',
        company: 'Innovation Law Group',
        rating: 4.8,
        reviewCount: 89,
        specializations: ['Patents', 'Trademarks', 'Trade Secrets'],
        avatar: '👩‍💼',
        verified: true,
        hourlyRate: '$400',
        availability: 'busy',
        responseTime: '< 4 hours',
        projectsCompleted: 178,
        location: 'New York, NY',
        bio: 'Former Google IP counsel. Specialized in tech patents and trademark strategy.',
      },
      {
        id: 'l3',
        name: 'Michael Rodriguez',
        title: 'Contract Specialist',
        company: 'Startup Legal Co.',
        rating: 4.7,
        reviewCount: 156,
        specializations: ['Contracts', 'Employment', 'Compliance'],
        avatar: '👨‍⚖️',
        verified: true,
        hourlyRate: '$275',
        availability: 'available',
        responseTime: '< 1 hour',
        projectsCompleted: 312,
        location: 'Austin, TX',
        bio: 'Helping startups navigate contracts and employment law for 10+ years.',
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'CFOs, accountants, and financial advisors',
    professionals: [
      {
        id: 'f1',
        name: 'Emily Watson',
        title: 'Fractional CFO',
        company: 'Startup Finance Partners',
        rating: 5.0,
        reviewCount: 94,
        specializations: ['Financial Planning', 'Fundraising', 'Board Reporting'],
        avatar: '👩‍💼',
        verified: true,
        hourlyRate: '$450',
        availability: 'available',
        responseTime: '< 2 hours',
        projectsCompleted: 156,
        location: 'Boston, MA',
        bio: 'Ex-Goldman Sachs. Helped 50+ startups raise $500M+ in funding.',
      },
      {
        id: 'f2',
        name: 'Robert Lee',
        title: 'Startup CPA',
        company: 'Financial Advisors Inc.',
        rating: 4.9,
        reviewCount: 203,
        specializations: ['Tax Planning', 'Bookkeeping', 'Audit Prep'],
        avatar: '👨‍💼',
        verified: true,
        hourlyRate: '$200',
        availability: 'available',
        responseTime: '< 3 hours',
        projectsCompleted: 423,
        location: 'Chicago, IL',
        bio: 'Specialized in startup accounting and R&D tax credits.',
      },
      {
        id: 'f3',
        name: 'Jennifer Park',
        title: 'Financial Modeler',
        company: 'Model Experts',
        rating: 4.8,
        reviewCount: 67,
        specializations: ['Financial Modeling', 'Valuation', 'Due Diligence'],
        avatar: '👩‍💻',
        verified: true,
        hourlyRate: '$300',
        availability: 'busy',
        responseTime: '< 4 hours',
        projectsCompleted: 189,
        location: 'Seattle, WA',
        bio: 'Built 200+ financial models for Series A-C startups.',
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing & Growth',
    icon: Megaphone,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Growth hackers and marketing experts',
    professionals: [
      {
        id: 'm1',
        name: 'Lisa Wang',
        title: 'Growth Lead',
        company: 'Growth Marketing Pro',
        rating: 4.9,
        reviewCount: 145,
        specializations: ['Growth Hacking', 'User Acquisition', 'Analytics'],
        avatar: '👩‍💼',
        verified: true,
        hourlyRate: '$250',
        availability: 'available',
        responseTime: '< 1 hour',
        projectsCompleted: 278,
        location: 'Los Angeles, CA',
        bio: 'Scaled 3 startups from 0 to 1M users. Ex-Uber growth team.',
      },
      {
        id: 'm2',
        name: 'David Kim',
        title: 'Content Strategist',
        company: 'Content First Agency',
        rating: 4.8,
        reviewCount: 112,
        specializations: ['Content Marketing', 'SEO', 'Brand Strategy'],
        avatar: '👨‍💼',
        verified: true,
        hourlyRate: '$175',
        availability: 'available',
        responseTime: '< 2 hours',
        projectsCompleted: 234,
        location: 'Denver, CO',
        bio: 'Built content engines that drive 10M+ organic visits/month.',
      },
    ],
  },
  {
    id: 'tech',
    name: 'Technology & Development',
    icon: Code,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'CTOs, architects, and developers',
    professionals: [
      {
        id: 't1',
        name: 'Alex Thompson',
        title: 'Fractional CTO',
        company: 'Tech Advisory Group',
        rating: 5.0,
        reviewCount: 78,
        specializations: ['Architecture', 'Team Building', 'Tech Strategy'],
        avatar: '👨‍💻',
        verified: true,
        hourlyRate: '$500',
        availability: 'busy',
        responseTime: '< 4 hours',
        projectsCompleted: 89,
        location: 'San Francisco, CA',
        bio: 'Ex-Stripe engineering lead. Built teams from 5 to 100+ engineers.',
      },
      {
        id: 't2',
        name: 'Priya Sharma',
        title: 'AI/ML Consultant',
        company: 'AI Solutions Lab',
        rating: 4.9,
        reviewCount: 56,
        specializations: ['Machine Learning', 'Data Science', 'AI Strategy'],
        avatar: '👩‍💻',
        verified: true,
        hourlyRate: '$400',
        availability: 'available',
        responseTime: '< 2 hours',
        projectsCompleted: 67,
        location: 'Remote',
        bio: 'PhD in ML from Stanford. Helped 30+ startups implement AI solutions.',
      },
    ],
  },
  {
    id: 'design',
    name: 'Design & UX',
    icon: Palette,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Product designers and UX experts',
    professionals: [
      {
        id: 'd1',
        name: 'Emma White',
        title: 'Product Designer',
        company: 'Design Studio X',
        rating: 4.9,
        reviewCount: 134,
        specializations: ['Product Design', 'UX Research', 'Design Systems'],
        avatar: '👩‍🎨',
        verified: true,
        hourlyRate: '$225',
        availability: 'available',
        responseTime: '< 1 hour',
        projectsCompleted: 198,
        location: 'Brooklyn, NY',
        bio: 'Ex-Airbnb designer. Passionate about creating delightful user experiences.',
      },
    ],
  },
  {
    id: 'hr',
    name: 'HR & Recruiting',
    icon: Users,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    description: 'HR consultants and talent acquisition',
    professionals: [
      {
        id: 'h1',
        name: 'James Taylor',
        title: 'Startup HR Advisor',
        company: 'People First Consulting',
        rating: 4.8,
        reviewCount: 89,
        specializations: ['Hiring', 'Culture Building', 'Compensation'],
        avatar: '👨‍💼',
        verified: true,
        hourlyRate: '$200',
        availability: 'available',
        responseTime: '< 2 hours',
        projectsCompleted: 145,
        location: 'Miami, FL',
        bio: 'Built HR from scratch at 5 startups. Expert in early-stage hiring.',
      },
    ],
  },
]

const availabilityColors = {
  available: 'bg-green-100 text-green-700',
  busy: 'bg-yellow-100 text-yellow-700',
  unavailable: 'bg-red-100 text-red-700',
}

const availabilityLabels = {
  available: 'Available Now',
  busy: 'Limited Availability',
  unavailable: 'Unavailable',
}

export default function ProfessionalServices() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllProfessionals, setShowAllProfessionals] = useState<Record<string, boolean>>({})

  const filteredCategories = selectedCategory 
    ? serviceCategories.filter(c => c.id === selectedCategory)
    : serviceCategories

  const handleContact = (professional: Professional) => {
    showToast(`Opening chat with ${professional.name}...`, 'success')
  }

  const handleViewProfile = (professional: Professional) => {
    showToast(`Viewing ${professional.name}'s full profile...`, 'info')
  }

  const handleBookSession = (professional: Professional) => {
    showToast(`Opening calendar to book with ${professional.name}...`, 'success')
  }

  const toggleShowAll = (categoryId: string) => {
    setShowAllProfessionals(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  return (
    <section id="professional-services" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-6 w-6 text-primary-500" />
              <Badge variant="category" className="bg-primary-50 text-primary-700">
                Verified Professionals
              </Badge>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">Professional Services</h2>
            <p className="text-gray-600 max-w-2xl">
              Connect with verified startup professionals across legal, finance, marketing, and more. 
              All experts are vetted and reviewed by the GrowthLab community.
            </p>
          </div>
          <Link href="/experts/register" className="mt-4 lg:mt-0">
            <Button className="group">
              <Briefcase className="h-4 w-4 mr-2" />
              Join as Expert
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search experts by name, skill, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  !selectedCategory
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {serviceCategories.map(cat => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Categories and Professionals */}
        <div className="space-y-10">
          {filteredCategories.map((category) => {
            const Icon = category.icon
            const showAll = showAllProfessionals[category.id]
            const displayedProfessionals = showAll 
              ? category.professionals 
              : category.professionals.slice(0, 3)

            return (
              <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Category Header */}
                <div className={`${category.bgColor} px-6 py-4 border-b border-gray-100`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                        <Icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      {category.professionals.length} experts
                    </Badge>
                  </div>
                </div>

                {/* Professionals Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedProfessionals.map((professional) => (
                      <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="relative">
                            <span className="text-5xl">{professional.avatar}</span>
                            {professional.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold truncate">{professional.name}</h4>
                              {professional.verified && (
                                <Badge variant="category" className="bg-blue-50 text-blue-700 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{professional.title}</p>
                            <p className="text-xs text-gray-500">{professional.company}</p>
                          </div>
                        </div>

                        {/* Rating & Stats */}
                        <div className="flex items-center gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{professional.rating}</span>
                            <span className="text-gray-400">({professional.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <CheckCircle className="h-4 w-4" />
                            <span>{professional.projectsCompleted} projects</span>
                          </div>
                        </div>

                        {/* Bio */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{professional.bio}</p>

                        {/* Specializations */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {professional.specializations.map((spec, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        {/* Info Row */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{professional.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{professional.responseTime}</span>
                          </div>
                        </div>

                        {/* Price & Availability */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                          <div>
                            <span className="text-xl font-bold">{professional.hourlyRate}</span>
                            <span className="text-sm text-gray-500">/hour</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${availabilityColors[professional.availability]}`}>
                            {availabilityLabels[professional.availability]}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleViewProfile(professional)}
                          >
                            View Profile
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleBookSession(professional)}
                            disabled={professional.availability === 'unavailable'}
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Book
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContact(professional)}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Show More Button */}
                  {category.professionals.length > 3 && (
                    <div className="mt-6 text-center">
                      <Button 
                        variant="outline" 
                        onClick={() => toggleShowAll(category.id)}
                      >
                        {showAll ? 'Show Less' : `View All ${category.professionals.length} ${category.name} Experts`}
                        <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${showAll ? 'rotate-90' : ''}`} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Become an Expert CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-6 w-6" />
                <span className="text-indigo-200 font-medium">Expert Network</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Share Your Expertise</h3>
              <p className="text-indigo-100 max-w-xl">
                Join our network of verified professionals. Set your own rates, work with innovative startups, 
                and help build the next generation of successful companies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/experts/register">
                <button 
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-white text-indigo-600 hover:bg-gray-100 transition-colors shadow-lg w-full sm:w-auto"
                >
                  <Briefcase className="h-5 w-5 mr-2" />
                  Apply Now
                </button>
              </Link>
              <Link href="/experts">
                <button 
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors w-full sm:w-auto"
                >
                  Learn More
                </button>
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold">$150+</div>
              <div className="text-sm text-indigo-200">Avg Hourly Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Flexible</div>
              <div className="text-sm text-indigo-200">Work Schedule</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">12K+</div>
              <div className="text-sm text-indigo-200">Startup Network</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0%</div>
              <div className="text-sm text-indigo-200">Platform Fee (First 3 Mo)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
