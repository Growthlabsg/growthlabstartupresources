'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  Rocket, ArrowRight, Sparkles, Play, Search, 
  TrendingUp, Users, FileText, Award, Zap,
  ChevronDown, Star, CheckCircle
} from 'lucide-react'

const quickLinks = [
  { label: 'Pitch Deck Builder', href: '/startup/pitch-deck-builder', icon: FileText },
  { label: 'Financial Projections', href: '/startup/financial-projections', icon: TrendingUp },
  { label: 'Legal Documents', href: '/startup/legal-documents', icon: Award },
  { label: 'Funding Navigator', href: '/startup/funding-navigator', icon: Rocket },
]

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/startup/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <section className="relative mb-12 lg:mb-16">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative">
        {/* Top Badge */}
        <div className="flex justify-center lg:justify-start mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-200 px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-700">Powered by GrowthLab Platform</span>
            <Badge variant="new" className="ml-1">New</Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-primary-800 to-primary-600 bg-clip-text text-transparent">
              Startup Resources Hub
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto lg:mx-0 mb-6 sm:mb-8">
            Everything you need to build, launch, and grow your startup globally. Access 500+ tools, guides, 
            and resources designed to help founders worldwide at every stage of their journey.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-8">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources, tools, templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 sm:pr-32 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="sm:absolute sm:right-2 px-6 py-3 sm:py-2.5 bg-primary-500 text-white font-medium rounded-xl sm:rounded-lg hover:bg-primary-600 transition-colors"
              >
                Search
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 justify-center lg:justify-start">
              <span className="text-sm text-gray-500">Popular:</span>
              {['Pitch Deck', 'Financial Model', 'Legal Templates', 'Fundraising'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {term}
                </button>
              ))}
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 sm:mb-10">
            <Link href="/startup/validation">
              <Button size="lg" className="w-full sm:w-auto group">
                <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/startup/guides">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start mb-8 sm:mb-10">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.href} href={link.href}>
                  <div className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all group">
                    <Icon className="h-4 w-4 text-gray-500 group-hover:text-primary-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-primary-600 truncate">{link.label}</span>
                  </div>
                </Link>
              )
            })}
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className={`flex justify-center mt-8 sm:mt-10 transition-opacity ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' })}
            className="flex flex-col items-center text-gray-400 hover:text-primary-500 transition-colors"
          >
            <span className="text-sm mb-1">Explore Resources</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  )
}
