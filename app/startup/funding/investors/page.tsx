'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Link from 'next/link'
import { Users, DollarSign, MapPin, Search, Star, Target, Rocket, Building2, Globe, Mail, ExternalLink, Heart, Filter, X, BarChart, Briefcase, TrendingUp, Award, ArrowRight, Download, Zap, CheckCircle } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface Investor {
  id: string
  name: string
  type: 'VC' | 'Angel' | 'Corporate' | 'Accelerator' | 'Family Office' | 'Micro VC'
  focus: string[]
  stages: string[]
  location: string
  portfolio: number
  avgCheckSize: string
  website?: string
  email?: string
  rating: number
  industries: string[]
  description: string
  founded?: number
  totalFunding?: string
  notablePortfolio?: string[]
  leadInvestor?: boolean
  activelyInvesting?: boolean
}

const investors: Investor[] = [
  {
    id: '1',
    name: 'Sequoia Capital',
    type: 'VC',
    focus: ['Technology', 'Enterprise', 'Consumer'],
    stages: ['Seed', 'Series A', 'Series B', 'Growth'],
    location: 'Menlo Park, CA',
    portfolio: 500,
    avgCheckSize: '$1M - $100M',
    website: 'https://sequoiacap.com',
    rating: 4.9,
    industries: ['SaaS', 'FinTech', 'Consumer', 'HealthTech'],
    description: 'One of the most successful venture capital firms in the world, backing companies like Apple, Google, and Airbnb.',
    founded: 1972,
    totalFunding: '$85B+ AUM',
    notablePortfolio: ['Apple', 'Google', 'Airbnb', 'Stripe'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '2',
    name: 'Andreessen Horowitz (a16z)',
    type: 'VC',
    focus: ['Technology', 'Crypto', 'Bio'],
    stages: ['Seed', 'Series A', 'Series B', 'Growth'],
    location: 'Menlo Park, CA',
    portfolio: 400,
    avgCheckSize: '$500K - $150M',
    website: 'https://a16z.com',
    rating: 4.8,
    industries: ['Crypto', 'AI', 'Enterprise', 'Consumer'],
    description: 'Tech-focused VC known for strong founder support and platform approach.',
    founded: 2009,
    totalFunding: '$35B+ AUM',
    notablePortfolio: ['Facebook', 'Coinbase', 'Slack', 'GitHub'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '3',
    name: 'Y Combinator',
    type: 'Accelerator',
    focus: ['All Industries'],
    stages: ['Pre-Seed', 'Seed'],
    location: 'San Francisco, CA',
    portfolio: 4000,
    avgCheckSize: '$500K',
    website: 'https://ycombinator.com',
    rating: 4.9,
    industries: ['All'],
    description: 'World\'s most successful startup accelerator with unmatched network and resources.',
    founded: 2005,
    notablePortfolio: ['Airbnb', 'Dropbox', 'Stripe', 'Reddit'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '4',
    name: 'First Round Capital',
    type: 'VC',
    focus: ['Technology', 'Consumer', 'Enterprise'],
    stages: ['Pre-Seed', 'Seed'],
    location: 'San Francisco, CA',
    portfolio: 300,
    avgCheckSize: '$500K - $3M',
    website: 'https://firstround.com',
    rating: 4.7,
    industries: ['SaaS', 'Marketplace', 'Consumer'],
    description: 'Seed-stage VC known for being the first check into transformative companies.',
    founded: 2004,
    notablePortfolio: ['Uber', 'Square', 'Notion', 'Roblox'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '5',
    name: 'Accel Partners',
    type: 'VC',
    focus: ['Technology', 'Enterprise', 'Consumer'],
    stages: ['Seed', 'Series A', 'Series B'],
    location: 'Palo Alto, CA',
    portfolio: 350,
    avgCheckSize: '$1M - $50M',
    website: 'https://accel.com',
    rating: 4.8,
    industries: ['SaaS', 'Security', 'Consumer', 'FinTech'],
    description: 'Global VC firm with a strong track record in enterprise and consumer tech.',
    founded: 1983,
    notablePortfolio: ['Facebook', 'Slack', 'Dropbox', 'Spotify'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '6',
    name: 'Benchmark',
    type: 'VC',
    focus: ['Technology', 'Marketplace', 'Consumer'],
    stages: ['Seed', 'Series A', 'Series B'],
    location: 'San Francisco, CA',
    portfolio: 150,
    avgCheckSize: '$5M - $20M',
    website: 'https://benchmark.com',
    rating: 4.9,
    industries: ['Marketplace', 'Consumer', 'Enterprise'],
    description: 'Elite VC firm known for equal partnership model and hands-on involvement.',
    founded: 1995,
    notablePortfolio: ['eBay', 'Twitter', 'Uber', 'Snapchat'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '7',
    name: 'Greylock Partners',
    type: 'VC',
    focus: ['Enterprise', 'Consumer', 'AI'],
    stages: ['Seed', 'Series A', 'Series B'],
    location: 'Menlo Park, CA',
    portfolio: 200,
    avgCheckSize: '$1M - $50M',
    website: 'https://greylock.com',
    rating: 4.7,
    industries: ['Enterprise', 'Consumer', 'AI', 'Data'],
    description: 'Storied VC firm with deep expertise in enterprise software.',
    founded: 1965,
    notablePortfolio: ['LinkedIn', 'Airbnb', 'Discord', 'Figma'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '8',
    name: 'Lightspeed Venture Partners',
    type: 'VC',
    focus: ['Technology', 'Consumer', 'Enterprise'],
    stages: ['Seed', 'Series A', 'Series B', 'Growth'],
    location: 'Menlo Park, CA',
    portfolio: 400,
    avgCheckSize: '$1M - $100M',
    website: 'https://lsvp.com',
    rating: 4.6,
    industries: ['SaaS', 'Consumer', 'Crypto', 'Gaming'],
    description: 'Global VC with strong presence in US, Europe, India, and Israel.',
    founded: 2000,
    notablePortfolio: ['Snap', 'Affirm', 'Nutanix', 'AppDynamics'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '9',
    name: 'Kleiner Perkins',
    type: 'VC',
    focus: ['Technology', 'CleanTech', 'Healthcare'],
    stages: ['Seed', 'Series A', 'Series B', 'Growth'],
    location: 'Menlo Park, CA',
    portfolio: 300,
    avgCheckSize: '$1M - $75M',
    website: 'https://kleinerperkins.com',
    rating: 4.7,
    industries: ['Enterprise', 'Consumer', 'Healthcare', 'CleanTech'],
    description: 'Legendary VC firm that backed some of the most transformative companies.',
    founded: 1972,
    notablePortfolio: ['Amazon', 'Google', 'Genentech', 'Twitter'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '10',
    name: 'General Catalyst',
    type: 'VC',
    focus: ['Technology', 'Healthcare', 'FinTech'],
    stages: ['Seed', 'Series A', 'Series B', 'Growth'],
    location: 'Cambridge, MA',
    portfolio: 250,
    avgCheckSize: '$1M - $100M',
    website: 'https://generalcatalyst.com',
    rating: 4.6,
    industries: ['FinTech', 'Healthcare', 'Enterprise', 'Consumer'],
    description: 'Multi-stage VC focused on transformative technology companies.',
    founded: 2000,
    notablePortfolio: ['Stripe', 'Snap', 'Airbnb', 'Warby Parker'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '11',
    name: 'SV Angel',
    type: 'Angel',
    focus: ['Technology', 'Consumer', 'Enterprise'],
    stages: ['Pre-Seed', 'Seed'],
    location: 'San Francisco, CA',
    portfolio: 500,
    avgCheckSize: '$25K - $250K',
    website: 'https://svangel.com',
    rating: 4.5,
    industries: ['All'],
    description: 'One of the most prolific angel investment firms in Silicon Valley.',
    founded: 2009,
    notablePortfolio: ['Airbnb', 'Pinterest', 'Dropbox', 'Twitter'],
    leadInvestor: false,
    activelyInvesting: true
  },
  {
    id: '12',
    name: 'Initialized Capital',
    type: 'Micro VC',
    focus: ['Technology', 'Crypto', 'AI'],
    stages: ['Pre-Seed', 'Seed'],
    location: 'San Francisco, CA',
    portfolio: 200,
    avgCheckSize: '$250K - $2M',
    website: 'https://initialized.com',
    rating: 4.6,
    industries: ['Crypto', 'AI', 'SaaS', 'Consumer'],
    description: 'Early-stage fund founded by Alexis Ohanian and Garry Tan.',
    founded: 2012,
    notablePortfolio: ['Coinbase', 'Instacart', 'Flexport'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '13',
    name: 'Techstars',
    type: 'Accelerator',
    focus: ['All Industries'],
    stages: ['Pre-Seed', 'Seed'],
    location: 'Boulder, CO',
    portfolio: 3000,
    avgCheckSize: '$120K',
    website: 'https://techstars.com',
    rating: 4.4,
    industries: ['All'],
    description: 'Global accelerator network with programs in multiple cities worldwide.',
    founded: 2006,
    notablePortfolio: ['SendGrid', 'DigitalOcean', 'ClassPass'],
    leadInvestor: false,
    activelyInvesting: true
  },
  {
    id: '14',
    name: '500 Global',
    type: 'Accelerator',
    focus: ['All Industries'],
    stages: ['Pre-Seed', 'Seed'],
    location: 'San Francisco, CA',
    portfolio: 2500,
    avgCheckSize: '$150K',
    website: 'https://500.co',
    rating: 4.3,
    industries: ['All'],
    description: 'Global accelerator and seed fund with presence in 80+ countries.',
    founded: 2010,
    notablePortfolio: ['Canva', 'Credit Karma', 'Udemy'],
    leadInvestor: false,
    activelyInvesting: true
  },
  {
    id: '15',
    name: 'Intel Capital',
    type: 'Corporate',
    focus: ['Technology', 'AI', 'Cloud'],
    stages: ['Seed', 'Series A', 'Series B'],
    location: 'Santa Clara, CA',
    portfolio: 1600,
    avgCheckSize: '$2M - $20M',
    website: 'https://intelcapital.com',
    rating: 4.4,
    industries: ['AI', 'Cloud', 'Security', 'Semiconductor'],
    description: 'One of the largest and most active corporate venture arms globally.',
    founded: 1991,
    notablePortfolio: ['Cloudera', 'MongoDB', 'DocuSign'],
    leadInvestor: true,
    activelyInvesting: true
  },
  {
    id: '16',
    name: 'Google Ventures (GV)',
    type: 'Corporate',
    focus: ['Technology', 'Healthcare', 'Consumer'],
    stages: ['Seed', 'Series A', 'Series B', 'Growth'],
    location: 'Mountain View, CA',
    portfolio: 500,
    avgCheckSize: '$1M - $50M',
    website: 'https://gv.com',
    rating: 4.7,
    industries: ['AI', 'Healthcare', 'Enterprise', 'Consumer'],
    description: 'Alphabet\'s venture capital arm with access to Google\'s resources.',
    founded: 2009,
    notablePortfolio: ['Uber', 'Slack', 'Stripe', 'Nest'],
    leadInvestor: true,
    activelyInvesting: true
  },
]

const investorTypes = ['All', 'VC', 'Angel', 'Corporate', 'Accelerator', 'Family Office', 'Micro VC']
const stages = ['All', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth']
const locations = ['All', 'San Francisco, CA', 'Menlo Park, CA', 'Palo Alto, CA', 'New York, NY', 'Boston, MA', 'Remote']
const industries = ['All', 'SaaS', 'FinTech', 'HealthTech', 'Consumer', 'Enterprise', 'AI', 'Crypto', 'Marketplace']

export default function InvestorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedStage, setSelectedStage] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [selectedIndustry, setSelectedIndustry] = useState('All')
  const [savedInvestors, setSavedInvestors] = useState<string[]>([])
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [showOnlyActive, setShowOnlyActive] = useState(false)
  const [showOnlyLead, setShowOnlyLead] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedInvestors')
      if (saved) {
        setSavedInvestors(JSON.parse(saved))
      }
    }
  }, [])

  const toggleSaveInvestor = (investorId: string) => {
    const updated = savedInvestors.includes(investorId)
      ? savedInvestors.filter(id => id !== investorId)
      : [...savedInvestors, investorId]
    setSavedInvestors(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedInvestors', JSON.stringify(updated))
    }
    showToast(
      savedInvestors.includes(investorId) ? 'Investor removed from list' : 'Investor saved to list',
      'success'
    )
  }

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = 
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.focus.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      investor.industries.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === 'All' || investor.type === selectedType
    const matchesStage = selectedStage === 'All' || investor.stages.includes(selectedStage)
    const matchesLocation = selectedLocation === 'All' || investor.location.includes(selectedLocation.replace(', CA', '').replace(', NY', '').replace(', MA', ''))
    const matchesIndustry = selectedIndustry === 'All' || investor.industries.includes(selectedIndustry)
    const matchesActive = !showOnlyActive || investor.activelyInvesting
    const matchesLead = !showOnlyLead || investor.leadInvestor
    
    return matchesSearch && matchesType && matchesStage && matchesLocation && matchesIndustry && matchesActive && matchesLead
  })

  const exportSavedInvestors = () => {
    const savedInvestorData = investors.filter(i => savedInvestors.includes(i.id))
    const data = {
      exportDate: new Date().toISOString(),
      count: savedInvestorData.length,
      investors: savedInvestorData.map(i => ({
        name: i.name,
        type: i.type,
        website: i.website,
        email: i.email,
        checkSize: i.avgCheckSize,
        stages: i.stages,
        industries: i.industries
      }))
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `investor-list-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Investor list exported!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="featured" className="text-sm">Investor Database</Badge>
            <Link href="/startup/funding-navigator">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                Funding Navigator <ArrowRight className="h-3 w-3 ml-1 inline" />
              </Badge>
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Investor Database
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Discover investors who match your startup's stage, industry, and funding needs. Save investors to build your outreach list.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{investors.length}</div>
            <div className="text-sm text-gray-600">Total Investors</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{filteredInvestors.length}</div>
            <div className="text-sm text-gray-600">Matching Results</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{savedInvestors.length}</div>
            <div className="text-sm text-gray-600">Saved Investors</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{investors.filter(i => i.activelyInvesting).length}</div>
            <div className="text-sm text-gray-600">Actively Investing</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search investors by name, focus, or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={investorTypes.map(t => ({ value: t, label: t === 'All' ? 'All Types' : t }))}
              />
              <Select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                options={stages.map(s => ({ value: s, label: s === 'All' ? 'All Stages' : s }))}
              />
              <Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                options={locations.map(l => ({ value: l, label: l === 'All' ? 'All Locations' : l }))}
              />
              <Select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                options={industries.map(i => ({ value: i, label: i === 'All' ? 'All Industries' : i }))}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyActive}
                  onChange={(e) => setShowOnlyActive(e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Actively Investing</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyLead}
                  onChange={(e) => setShowOnlyLead(e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Lead Investors Only</span>
              </label>
              {savedInvestors.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportSavedInvestors}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Saved ({savedInvestors.length})
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Investor List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInvestors.map((investor) => (
                <Card 
                  key={investor.id} 
                  className={`flex flex-col hover:shadow-lg transition-all ${
                    savedInvestors.includes(investor.id) ? 'border-primary-300 bg-primary-50/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{investor.name}</h3>
                        {investor.activelyInvesting && (
                          <Badge variant="new" className="text-xs">Active</Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">{investor.type}</Badge>
                    </div>
                <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{investor.rating}</span>
                      </div>
                      <button
                        onClick={() => toggleSaveInvestor(investor.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Heart 
                          className={`h-5 w-5 ${
                            savedInvestors.includes(investor.id) 
                              ? 'text-red-500 fill-red-500' 
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{investor.description}</p>

                  <div className="space-y-2 mb-4 text-sm flex-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-4 w-4 flex-shrink-0" />
                      <span>{investor.avgCheckSize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Rocket className="h-4 w-4 flex-shrink-0" />
                      <span>{investor.stages.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{investor.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="h-4 w-4 flex-shrink-0" />
                      <span>{investor.portfolio} portfolio companies</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {investor.industries.slice(0, 4).map((industry, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{industry}</Badge>
                    ))}
                    {investor.industries.length > 4 && (
                      <Badge variant="outline" className="text-xs">+{investor.industries.length - 4}</Badge>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedInvestor(investor)}
                    >
                      View Details
                    </Button>
                    {investor.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(investor.website, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {filteredInvestors.length === 0 && (
              <Card className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Investors Found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investor Details Modal */}
            {selectedInvestor && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold">{selectedInvestor.name}</h3>
                  <button onClick={() => setSelectedInvestor(null)}>
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>

                <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedInvestor.type}</Badge>
                    {selectedInvestor.leadInvestor && (
                      <Badge variant="new" className="text-xs">Lead Investor</Badge>
                    )}
                    {selectedInvestor.activelyInvesting && (
                      <Badge variant="featured" className="text-xs">Actively Investing</Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600">{selectedInvestor.description}</p>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y">
                    <div>
                      <div className="text-xs text-gray-500">Check Size</div>
                      <div className="font-semibold">{selectedInvestor.avgCheckSize}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Portfolio</div>
                      <div className="font-semibold">{selectedInvestor.portfolio} companies</div>
                    </div>
                    {selectedInvestor.founded && (
                      <div>
                        <div className="text-xs text-gray-500">Founded</div>
                        <div className="font-semibold">{selectedInvestor.founded}</div>
                      </div>
                    )}
                    {selectedInvestor.totalFunding && (
                      <div>
                        <div className="text-xs text-gray-500">AUM</div>
                        <div className="font-semibold">{selectedInvestor.totalFunding}</div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Investment Stages</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedInvestor.stages.map((stage, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{stage}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Industries</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedInvestor.industries.map((industry, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{industry}</Badge>
                      ))}
                    </div>
                  </div>

                  {selectedInvestor.notablePortfolio && (
                    <div>
                      <div className="text-sm font-medium mb-2">Notable Portfolio</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedInvestor.notablePortfolio.map((company, idx) => (
                          <Badge key={idx} className="text-xs bg-gray-100 text-gray-700">{company}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant={savedInvestors.includes(selectedInvestor.id) ? 'primary' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleSaveInvestor(selectedInvestor.id)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${savedInvestors.includes(selectedInvestor.id) ? 'fill-white' : ''}`} />
                      {savedInvestors.includes(selectedInvestor.id) ? 'Saved' : 'Save'}
                    </Button>
                    {selectedInvestor.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(selectedInvestor.website, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Website
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Saved Investors */}
            {savedInvestors.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Saved Investors ({savedInvestors.length})
                </h3>
                <div className="space-y-2 mb-4">
                  {investors.filter(i => savedInvestors.includes(i.id)).slice(0, 5).map(investor => (
                    <div 
                      key={investor.id}
                      className="p-2 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedInvestor(investor)}
                    >
                      <div>
                        <div className="font-medium text-sm">{investor.name}</div>
                        <div className="text-xs text-gray-500">{investor.type}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSaveInvestor(investor.id)
                        }}
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={exportSavedInvestors}>
                  <Download className="h-4 w-4 mr-2" />
                  Export List
                </Button>
              </Card>
            )}

            {/* Quick Links */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Related Resources</h3>
              <div className="space-y-2">
                <Link href="/startup/funding/readiness">
                  <div className="p-3 border rounded-lg hover:border-primary-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium">Funding Readiness</span>
                    </div>
                  </div>
                </Link>
                <Link href="/startup/funding/grants">
                  <div className="p-3 border rounded-lg hover:border-primary-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium">Grant Opportunities</span>
                    </div>
                  </div>
                </Link>
                <Link href="/startup/pitch-deck-builder">
                  <div className="p-3 border rounded-lg hover:border-primary-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium">Pitch Deck Builder</span>
                    </div>
                  </div>
                </Link>
                <Link href="/startup/investor-pitch-tracker">
                  <div className="p-3 border rounded-lg hover:border-primary-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium">Pitch Tracker</span>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-gradient-to-br from-primary-50 to-blue-50">
              <h3 className="font-bold mb-3">Tips for Investor Outreach</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Research each investor's portfolio before reaching out</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Personalize your pitch to their investment thesis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Warm intros through mutual connections are most effective</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Follow up professionally but persistently</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
