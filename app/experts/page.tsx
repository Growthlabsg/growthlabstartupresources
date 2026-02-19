'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  ArrowRight, Briefcase, Star, Users, DollarSign, Clock,
  Globe, Shield, Award, Zap, Heart, CheckCircle, Search,
  TrendingUp, Scale, Code, Megaphone, Palette, GraduationCap,
  Building2, Calendar, Video, MessageCircle, MapPin, Filter,
  ChevronRight, Play, Sparkles, ArrowLeft
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const expertCategories = [
  { id: 'all', name: 'All Experts', count: 150 },
  { id: 'legal', name: 'Legal', icon: Scale, count: 28 },
  { id: 'finance', name: 'Finance', icon: TrendingUp, count: 35 },
  { id: 'marketing', name: 'Marketing', icon: Megaphone, count: 32 },
  { id: 'tech', name: 'Technology', icon: Code, count: 25 },
  { id: 'design', name: 'Design', icon: Palette, count: 18 },
  { id: 'hr', name: 'HR', icon: Users, count: 12 },
]

const featuredExperts = [
  {
    id: '1',
    name: 'Emily Watson',
    title: 'Fractional CFO',
    company: 'Startup Finance Partners',
    avatar: '👩‍💼',
    rating: 5.0,
    reviews: 94,
    hourlyRate: '$450',
    specializations: ['Financial Planning', 'Fundraising', 'Board Reporting'],
    bio: 'Ex-Goldman Sachs. Helped 50+ startups raise $500M+ in funding.',
    availability: 'available',
    verified: true,
    featured: true,
  },
  {
    id: '2',
    name: 'John Smith',
    title: 'Startup Lawyer',
    company: 'TechLegal Partners',
    avatar: '👨‍💼',
    rating: 4.9,
    reviews: 127,
    hourlyRate: '$350',
    specializations: ['Corporate Law', 'IP Protection', 'Fundraising'],
    bio: '15+ years helping startups with legal matters from incorporation to IPO.',
    availability: 'available',
    verified: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Lisa Wang',
    title: 'Growth Lead',
    company: 'Growth Marketing Pro',
    avatar: '👩‍💻',
    rating: 4.9,
    reviews: 145,
    hourlyRate: '$250',
    specializations: ['Growth Hacking', 'User Acquisition', 'Analytics'],
    bio: 'Scaled 3 startups from 0 to 1M users. Ex-Uber growth team.',
    availability: 'available',
    verified: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Alex Thompson',
    title: 'Fractional CTO',
    company: 'Tech Advisory Group',
    avatar: '👨‍💻',
    rating: 5.0,
    reviews: 78,
    hourlyRate: '$500',
    specializations: ['Architecture', 'Team Building', 'Tech Strategy'],
    bio: 'Ex-Stripe engineering lead. Built teams from 5 to 100+ engineers.',
    availability: 'busy',
    verified: true,
    featured: true,
  },
]

const testimonials = [
  {
    quote: "The CFO I found through GrowthLab helped us close our Series A. Her financial model and investor prep were invaluable.",
    author: "Sarah Chen",
    role: "CEO, TechFlow",
    avatar: "👩‍💼",
    company: "Raised $8M Series A",
  },
  {
    quote: "Having a fractional CTO review our architecture saved us months of technical debt. Best investment we made.",
    author: "Marcus Johnson",
    role: "Founder, DataSync",
    avatar: "👨‍💼",
    company: "Scaled to 1M users",
  },
  {
    quote: "The legal expert helped us navigate our acquisition smoothly. Professional, responsive, and worth every penny.",
    author: "Emily Rodriguez",
    role: "Co-founder, HealthAI",
    avatar: "👩‍💻",
    company: "Acquired for $25M",
  },
]

const stats = [
  { value: '150+', label: 'Verified Experts', icon: Users },
  { value: '2,500+', label: 'Projects Completed', icon: CheckCircle },
  { value: '4.9', label: 'Average Rating', icon: Star },
  { value: '$2M+', label: 'Paid to Experts', icon: DollarSign },
]

const howItWorks = [
  {
    step: 1,
    title: 'Browse Experts',
    description: 'Search our network of verified professionals by expertise, industry, or availability.',
    icon: Search,
  },
  {
    step: 2,
    title: 'Review Profiles',
    description: 'Check ratings, reviews, and portfolios to find the perfect match for your needs.',
    icon: Star,
  },
  {
    step: 3,
    title: 'Book a Session',
    description: 'Schedule a call or project directly through our platform with secure payments.',
    icon: Calendar,
  },
  {
    step: 4,
    title: 'Get Results',
    description: 'Work with your expert and achieve your startup goals faster.',
    icon: TrendingUp,
  },
]

export default function ExpertsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
          <Link href="/" className="inline-flex items-center text-primary-100 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Briefcase className="h-8 w-8" />
            </div>
            <Badge className="bg-white/20 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Expert Network
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl">
            Connect with Startup Experts
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl">
            Access 150+ verified professionals in legal, finance, marketing, technology, and more. 
            Get the expert help you need to build and scale your startup.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative flex items-center bg-white rounded-xl shadow-lg">
              <Search className="absolute left-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search experts by name, skill, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-4 rounded-xl text-gray-900 outline-none"
              />
              <Button className="absolute right-2" onClick={() => showToast('Searching experts...', 'info')}>
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-primary-200" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-primary-200">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-gray-500 flex-shrink-0">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            {expertCategories.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {cat.name}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Experts */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Featured Experts</h2>
              <p className="text-gray-600">Top-rated professionals ready to help your startup</p>
            </div>
            <Button variant="outline" onClick={() => showToast('Viewing all experts...', 'info')}>
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredExperts.map(expert => (
              <Card key={expert.id} className="hover:shadow-lg transition-shadow">
                {expert.featured && (
                  <Badge className="absolute top-3 right-3 bg-yellow-100 text-yellow-700">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                    Featured
                  </Badge>
                )}
                
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <span className="text-6xl">{expert.avatar}</span>
                    {expert.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold mt-3">{expert.name}</h3>
                  <p className="text-sm text-gray-600">{expert.title}</p>
                  <p className="text-xs text-gray-500">{expert.company}</p>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{expert.rating}</span>
                  <span className="text-gray-400">({expert.reviews} reviews)</span>
                </div>

                <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">{expert.bio}</p>

                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {expert.specializations.slice(0, 2).map((spec, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {spec}
                    </span>
                  ))}
                  {expert.specializations.length > 2 && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      +{expert.specializations.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="font-bold text-lg">{expert.hourlyRate}<span className="text-gray-500 font-normal">/hr</span></span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    expert.availability === 'available' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {expert.availability === 'available' ? 'Available' : 'Limited'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => showToast(`Viewing ${expert.name}'s profile...`, 'info')}>
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => showToast(`Booking with ${expert.name}...`, 'success')}>
                    Book Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">How It Works</h2>
            <p className="text-gray-600">Get expert help in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="text-center relative">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-10 hidden md:block" 
                       style={{ display: idx === howItWorks.length - 1 ? 'none' : undefined }} />
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Success Stories</h2>
            <p className="text-gray-600">See how startups have benefited from our expert network</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{testimonial.avatar}</span>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <div className="text-xs text-primary-600 font-medium">{testimonial.company}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Startups */}
          <Card className="p-8 bg-gradient-to-br from-primary-500 to-indigo-600 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6" />
              <span className="text-primary-100 font-medium">For Startups</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Need Expert Help?</h3>
            <p className="text-primary-100 mb-6">
              Browse our network of verified professionals and find the perfect expert 
              for your startup needs. From legal to finance to marketing.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-primary-600 hover:bg-gray-100">
                <Search className="h-4 w-4 mr-2" />
                Find Experts
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </div>
          </Card>

          {/* For Experts */}
          <Card className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-6 w-6" />
              <span className="text-gray-300 font-medium">For Experts</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Share Your Expertise</h3>
            <p className="text-gray-300 mb-6">
              Join our network of verified professionals. Set your own rates, 
              work flexibly, and help build the next generation of startups.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/experts/register">
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
              </Link>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

