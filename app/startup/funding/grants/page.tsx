'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Link from 'next/link'
import { FileText, DollarSign, Calendar, Search, Star, Award, Building2, Globe, ExternalLink, Heart, CheckCircle, X, Clock, Users, Target, ArrowRight, Download, Zap, AlertCircle, Bookmark, Filter } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface Grant {
  id: string
  title: string
  provider: string
  amount: string
  amountMin?: number
  amountMax?: number
  deadline: string
  type: 'Government' | 'Corporate' | 'Foundation' | 'University' | 'Non-Profit'
  eligibility: string[]
  requirements: string[]
  industries: string[]
  stages: string[]
  location?: string
  link?: string
  status: 'open' | 'upcoming' | 'closing-soon' | 'closed'
  description: string
  competitiveness: 'low' | 'medium' | 'high'
  featured?: boolean
  recurring?: boolean
}

const grants: Grant[] = [
  {
    id: '1',
    title: 'Small Business Innovation Research (SBIR) Phase I',
    provider: 'National Science Foundation',
    amount: 'Up to $275,000',
    amountMax: 275000,
    deadline: '2025-04-15',
    type: 'Government',
    eligibility: ['US-based small businesses', 'Fewer than 500 employees', 'Majority US-owned'],
    requirements: ['Technical proposal', 'Budget breakdown', 'Commercialization plan', 'Team qualifications'],
    industries: ['Technology', 'Healthcare', 'CleanTech', 'Manufacturing'],
    stages: ['Pre-Seed', 'Seed'],
    location: 'USA',
    link: 'https://www.nsf.gov/sbir',
    status: 'open',
    description: 'Federal program that provides funding to small businesses for R&D projects with commercial potential.',
    competitiveness: 'high',
    featured: true,
    recurring: true
  },
  {
    id: '2',
    title: 'SBIR Phase II',
    provider: 'National Science Foundation',
    amount: 'Up to $1,000,000',
    amountMax: 1000000,
    deadline: '2025-06-01',
    type: 'Government',
    eligibility: ['SBIR Phase I awardees', 'US-based small businesses'],
    requirements: ['Phase I completion', 'Technical proposal', 'Commercialization plan', 'Market analysis'],
    industries: ['Technology', 'Healthcare', 'CleanTech', 'Manufacturing'],
    stages: ['Seed', 'Series A'],
    location: 'USA',
    link: 'https://www.nsf.gov/sbir',
    status: 'open',
    description: 'Continuation funding for SBIR Phase I awardees to further develop their innovations.',
    competitiveness: 'high',
    recurring: true
  },
  {
    id: '3',
    title: 'AWS Activate',
    provider: 'Amazon Web Services',
    amount: 'Up to $100,000',
    amountMax: 100000,
    deadline: 'Rolling',
    type: 'Corporate',
    eligibility: ['Early-stage startups', 'New to AWS', 'Affiliated with eligible organizations'],
    requirements: ['Application form', 'Company description', 'Use case for AWS'],
    industries: ['All'],
    stages: ['Pre-Seed', 'Seed', 'Series A'],
    link: 'https://aws.amazon.com/activate',
    status: 'open',
    description: 'AWS credits, training, and support for startups building on AWS cloud.',
    competitiveness: 'low',
    featured: true
  },
  {
    id: '4',
    title: 'Google for Startups Cloud Program',
    provider: 'Google Cloud',
    amount: 'Up to $200,000',
    amountMax: 200000,
    deadline: 'Rolling',
    type: 'Corporate',
    eligibility: ['Early-stage startups', 'Series A or earlier', 'Less than $15M in funding'],
    requirements: ['Application form', 'Company pitch', 'Technical requirements'],
    industries: ['All'],
    stages: ['Pre-Seed', 'Seed', 'Series A'],
    link: 'https://cloud.google.com/startup',
    status: 'open',
    description: 'Google Cloud credits, mentorship, and technical support for startups.',
    competitiveness: 'low',
    featured: true
  },
  {
    id: '5',
    title: 'Microsoft for Startups Founders Hub',
    provider: 'Microsoft',
    amount: 'Up to $150,000',
    amountMax: 150000,
    deadline: 'Rolling',
    type: 'Corporate',
    eligibility: ['B2B software startups', 'Pre-revenue or Series A', 'Building on Azure'],
    requirements: ['Application form', 'Company description', 'Azure use case'],
    industries: ['SaaS', 'Enterprise', 'AI'],
    stages: ['Pre-Seed', 'Seed', 'Series A'],
    link: 'https://startups.microsoft.com',
    status: 'open',
    description: 'Azure credits, development tools, and access to Microsoft\'s partner network.',
    competitiveness: 'low'
  },
  {
    id: '6',
    title: 'Women in Tech Grant',
    provider: 'Cartier Women\'s Initiative',
    amount: 'Up to $100,000',
    amountMax: 100000,
    deadline: '2025-07-20',
    type: 'Foundation',
    eligibility: ['Women-led businesses', 'For-profit companies', '1-6 years in operation'],
    requirements: ['Business plan', 'Impact statement', 'Financial projections'],
    industries: ['All'],
    stages: ['Seed', 'Series A'],
    link: 'https://www.cartierwomensinitiative.com',
    status: 'upcoming',
    description: 'Supporting women entrepreneurs driving social and environmental impact.',
    competitiveness: 'high',
    featured: true
  },
  {
    id: '7',
    title: 'Climate Tech Grant',
    provider: 'Breakthrough Energy',
    amount: '$500,000 - $2,000,000',
    amountMin: 500000,
    amountMax: 2000000,
    deadline: '2025-08-15',
    type: 'Foundation',
    eligibility: ['Climate technology focus', 'Scalable solution', 'Demonstrated technical progress'],
    requirements: ['Technical proposal', 'Climate impact analysis', 'Team credentials'],
    industries: ['CleanTech', 'Energy', 'Sustainability'],
    stages: ['Seed', 'Series A'],
    link: 'https://www.breakthroughenergy.org',
    status: 'upcoming',
    description: 'Funding for breakthrough technologies addressing climate change.',
    competitiveness: 'high'
  },
  {
    id: '8',
    title: 'NIH Small Business Grant',
    provider: 'National Institutes of Health',
    amount: 'Up to $2,000,000',
    amountMax: 2000000,
    deadline: '2025-05-05',
    type: 'Government',
    eligibility: ['US-based small businesses', 'Healthcare/biotech focus', 'Research capability'],
    requirements: ['Research proposal', 'Budget', 'IRB approval if applicable', 'Team qualifications'],
    industries: ['HealthTech', 'Biotech', 'Medical Devices'],
    stages: ['Pre-Seed', 'Seed'],
    location: 'USA',
    link: 'https://www.nih.gov/grants-funding',
    status: 'open',
    description: 'Funding for small businesses conducting health-related R&D.',
    competitiveness: 'high',
    recurring: true
  },
  {
    id: '9',
    title: 'Stripe Atlas Grant',
    provider: 'Stripe',
    amount: '$20,000',
    amountMax: 20000,
    deadline: 'Rolling',
    type: 'Corporate',
    eligibility: ['Stripe Atlas companies', 'Early-stage startups'],
    requirements: ['Atlas membership', 'Application form'],
    industries: ['All'],
    stages: ['Pre-Seed', 'Seed'],
    link: 'https://stripe.com/atlas',
    status: 'open',
    description: 'Cash and credits for companies incorporated through Stripe Atlas.',
    competitiveness: 'low'
  },
  {
    id: '10',
    title: 'Echoing Green Fellowship',
    provider: 'Echoing Green',
    amount: '$80,000',
    amountMax: 80000,
    deadline: '2025-03-01',
    type: 'Non-Profit',
    eligibility: ['Social entrepreneurs', 'Early-stage ventures', 'Impact-driven'],
    requirements: ['Application essay', 'Impact plan', 'References'],
    industries: ['Social Enterprise', 'Non-Profit', 'Impact'],
    stages: ['Pre-Seed', 'Seed'],
    link: 'https://www.echoinggreen.org',
    status: 'closing-soon',
    description: 'Fellowship for social entrepreneurs creating systemic change.',
    competitiveness: 'high',
    featured: true
  },
  {
    id: '11',
    title: 'STTR (Small Business Technology Transfer)',
    provider: 'Department of Defense',
    amount: 'Up to $1,250,000',
    amountMax: 1250000,
    deadline: '2025-04-20',
    type: 'Government',
    eligibility: ['US-based small businesses', 'Partnership with research institution'],
    requirements: ['Joint proposal', 'Research plan', 'Collaboration agreement'],
    industries: ['Defense', 'Technology', 'Security'],
    stages: ['Pre-Seed', 'Seed'],
    location: 'USA',
    link: 'https://www.sbir.gov/about/about-sttr',
    status: 'open',
    description: 'Funding for R&D partnerships between small businesses and research institutions.',
    competitiveness: 'high',
    recurring: true
  },
  {
    id: '12',
    title: 'Thiel Fellowship',
    provider: 'Thiel Foundation',
    amount: '$100,000',
    amountMax: 100000,
    deadline: '2025-10-01',
    type: 'Foundation',
    eligibility: ['Age 22 or under', 'Working on innovative project', 'Drop out of school'],
    requirements: ['Application essays', 'Project description', 'Interview process'],
    industries: ['All'],
    stages: ['Pre-Seed'],
    link: 'https://thielfellowship.org',
    status: 'upcoming',
    description: 'Two-year grant for young entrepreneurs to pursue their ideas.',
    competitiveness: 'high'
  },
  {
    id: '13',
    title: 'Visa Everywhere Initiative',
    provider: 'Visa',
    amount: '$100,000',
    amountMax: 100000,
    deadline: '2025-05-30',
    type: 'Corporate',
    eligibility: ['FinTech startups', 'Payment innovation focus', 'Series A or earlier'],
    requirements: ['Application', 'Demo', 'Pitch presentation'],
    industries: ['FinTech', 'Payments'],
    stages: ['Seed', 'Series A'],
    link: 'https://usa.visa.com/run-your-business/small-business-tools/everywhere-initiative.html',
    status: 'open',
    description: 'Competition for startups transforming commerce and payments.',
    competitiveness: 'medium'
  },
  {
    id: '14',
    title: 'USDA SBIR',
    provider: 'US Department of Agriculture',
    amount: 'Up to $175,000',
    amountMax: 175000,
    deadline: '2025-06-15',
    type: 'Government',
    eligibility: ['US-based small businesses', 'Agriculture/food focus'],
    requirements: ['Technical proposal', 'Commercialization plan'],
    industries: ['AgTech', 'FoodTech', 'Sustainability'],
    stages: ['Pre-Seed', 'Seed'],
    location: 'USA',
    link: 'https://nifa.usda.gov/program/small-business-innovation-research-program-sbir',
    status: 'open',
    description: 'Funding for agricultural and food-related innovations.',
    competitiveness: 'medium',
    recurring: true
  },
  {
    id: '15',
    title: 'Halcyon Fellowship',
    provider: 'Halcyon',
    amount: '$10,000 + Resources',
    amountMax: 10000,
    deadline: '2025-04-01',
    type: 'Non-Profit',
    eligibility: ['Social impact focus', 'Early-stage ventures', 'Washington DC area preferred'],
    requirements: ['Application', 'Impact plan', 'Interview'],
    industries: ['Social Enterprise', 'Impact'],
    stages: ['Pre-Seed', 'Seed'],
    location: 'USA',
    link: 'https://halcyonhouse.org',
    status: 'open',
    description: 'Residency program and funding for social entrepreneurs.',
    competitiveness: 'medium'
  },
]

const grantTypes = ['All', 'Government', 'Corporate', 'Foundation', 'University', 'Non-Profit']
const grantStatuses = ['All', 'open', 'upcoming', 'closing-soon']
const grantStages = ['All', 'Pre-Seed', 'Seed', 'Series A']
const grantIndustries = ['All', 'Technology', 'HealthTech', 'FinTech', 'CleanTech', 'AgTech', 'Social Enterprise', 'All Industries']

export default function GrantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedStage, setSelectedStage] = useState('All')
  const [selectedIndustry, setSelectedIndustry] = useState('All')
  const [savedGrants, setSavedGrants] = useState<string[]>([])
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null)
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedGrants')
      if (saved) {
        setSavedGrants(JSON.parse(saved))
      }
    }
  }, [])

  const toggleSaveGrant = (grantId: string) => {
    const updated = savedGrants.includes(grantId)
      ? savedGrants.filter(id => id !== grantId)
      : [...savedGrants, grantId]
    setSavedGrants(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedGrants', JSON.stringify(updated))
    }
    showToast(
      savedGrants.includes(grantId) ? 'Grant removed from list' : 'Grant saved to list',
      'success'
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'closing-soon': return 'bg-orange-100 text-orange-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompetitivenessColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = 
      grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.industries.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === 'All' || grant.type === selectedType
    const matchesStatus = selectedStatus === 'All' || grant.status === selectedStatus
    const matchesStage = selectedStage === 'All' || grant.stages.includes(selectedStage)
    const matchesIndustry = selectedIndustry === 'All' || grant.industries.includes(selectedIndustry) || grant.industries.includes('All')
    const matchesFeatured = !showFeaturedOnly || grant.featured
    
    return matchesSearch && matchesType && matchesStatus && matchesStage && matchesIndustry && matchesFeatured
  }).sort((a, b) => {
    // Sort by status priority
    const statusOrder: { [key: string]: number } = { 'closing-soon': 0, 'open': 1, 'upcoming': 2, 'closed': 3 }
    return (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3)
  })

  const totalFunding = grants.reduce((sum, g) => sum + (g.amountMax || 0), 0)
  const openGrants = grants.filter(g => g.status === 'open').length
  const upcomingGrants = grants.filter(g => g.status === 'upcoming').length

  const exportSavedGrants = () => {
    const savedGrantData = grants.filter(g => savedGrants.includes(g.id))
    const data = {
      exportDate: new Date().toISOString(),
      count: savedGrantData.length,
      grants: savedGrantData.map(g => ({
        title: g.title,
        provider: g.provider,
        amount: g.amount,
        deadline: g.deadline,
        link: g.link,
        type: g.type
      }))
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grant-list-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Grant list exported!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="featured" className="text-sm">Grant Opportunities</Badge>
            <Link href="/startup/funding-navigator">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                Funding Navigator <ArrowRight className="h-3 w-3 ml-1 inline" />
              </Badge>
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Grant Opportunities
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Discover non-dilutive funding opportunities including government grants, corporate programs, and foundation funding.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{grants.length}</div>
            <div className="text-sm text-gray-600">Total Grants</div>
          </Card>
          <Card className="p-4 text-center bg-green-50">
            <div className="text-3xl font-bold text-green-600 mb-1">{openGrants}</div>
            <div className="text-sm text-gray-600">Open Now</div>
          </Card>
          <Card className="p-4 text-center bg-blue-50">
            <div className="text-3xl font-bold text-blue-600 mb-1">{upcomingGrants}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">${(totalFunding / 1000000).toFixed(1)}M+</div>
            <div className="text-sm text-gray-600">Total Available</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search grants by name, provider, or industry..."
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
                options={grantTypes.map(t => ({ value: t, label: t === 'All' ? 'All Types' : t }))}
              />
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={grantStatuses.map(s => ({ 
                  value: s, 
                  label: s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ') 
                }))}
              />
              <Select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                options={grantStages.map(s => ({ value: s, label: s === 'All' ? 'All Stages' : s }))}
              />
              <Select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                options={grantIndustries.map(i => ({ value: i, label: i === 'All' ? 'All Industries' : i }))}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Featured Only</span>
              </label>
              {savedGrants.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportSavedGrants}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Saved ({savedGrants.length})
                </Button>
              )}
            </div>
                </div>
        </Card>

        {/* Closing Soon Alert */}
        {grants.filter(g => g.status === 'closing-soon').length > 0 && (
          <Card className="p-4 mb-6 bg-orange-50 border-orange-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-orange-800">Deadline Alert:</span>
                <span className="text-orange-700 ml-2">
                  {grants.filter(g => g.status === 'closing-soon').length} grant(s) closing soon!
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grant List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredGrants.map((grant) => (
                <Card 
                  key={grant.id} 
                  className={`hover:shadow-lg transition-all ${
                    savedGrants.includes(grant.id) ? 'border-primary-300 bg-primary-50/30' : ''
                  } ${grant.status === 'closing-soon' ? 'border-orange-300' : ''}`}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Left side */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-lg">{grant.title}</h3>
                            {grant.featured && (
                              <Badge variant="featured" className="text-xs">Featured</Badge>
                            )}
                            {grant.recurring && (
                              <Badge variant="outline" className="text-xs">Recurring</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{grant.provider}</p>
                        </div>
                        <button
                          onClick={() => toggleSaveGrant(grant.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Bookmark 
                            className={`h-5 w-5 ${
                              savedGrants.includes(grant.id) 
                                ? 'text-primary-500 fill-primary-500' 
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{grant.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="font-semibold">{grant.amount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>{grant.deadline === 'Rolling' ? 'Rolling' : new Date(grant.deadline).toLocaleDateString()}</span>
                </div>
                        <div className="flex items-center gap-1">
                          <Target className={`h-4 w-4 ${getCompetitivenessColor(grant.competitiveness)}`} />
                          <span className={getCompetitivenessColor(grant.competitiveness)}>
                            {grant.competitiveness.charAt(0).toUpperCase() + grant.competitiveness.slice(1)} Competition
                          </span>
                </div>
              </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className={getStatusColor(grant.status)}>
                          {grant.status.charAt(0).toUpperCase() + grant.status.slice(1).replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline">{grant.type}</Badge>
                        {grant.stages.slice(0, 2).map((stage, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{stage}</Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {grant.industries.slice(0, 4).map((industry, idx) => (
                          <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {industry}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                          onClick={() => setSelectedGrant(grant)}
                        >
                          View Details
                        </Button>
                        {grant.link && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => window.open(grant.link, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                Apply Now
              </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredGrants.length === 0 && (
              <Card className="p-12 text-center">
                <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Grants Found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Grant Details Modal */}
            {selectedGrant && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold pr-4">{selectedGrant.title}</h3>
                  <button onClick={() => setSelectedGrant(null)}>
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Provider</div>
                    <div className="font-medium">{selectedGrant.provider}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Amount</div>
                      <div className="font-semibold text-green-600">{selectedGrant.amount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Deadline</div>
                      <div className="font-medium">
                        {selectedGrant.deadline === 'Rolling' 
                          ? 'Rolling' 
                          : new Date(selectedGrant.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-2">Eligibility</div>
                    <ul className="space-y-1">
                      {selectedGrant.eligibility.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-2">Requirements</div>
                    <ul className="space-y-1">
                      {selectedGrant.requirements.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <FileText className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant={savedGrants.includes(selectedGrant.id) ? 'primary' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleSaveGrant(selectedGrant.id)}
                    >
                      <Bookmark className={`h-4 w-4 mr-2 ${savedGrants.includes(selectedGrant.id) ? 'fill-white' : ''}`} />
                      {savedGrants.includes(selectedGrant.id) ? 'Saved' : 'Save'}
                    </Button>
                    {selectedGrant.link && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(selectedGrant.link, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Saved Grants */}
            {savedGrants.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-primary-500" />
                  Saved Grants ({savedGrants.length})
                </h3>
                <div className="space-y-2 mb-4">
                  {grants.filter(g => savedGrants.includes(g.id)).slice(0, 5).map(grant => (
                    <div 
                      key={grant.id}
                      className="p-2 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedGrant(grant)}
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{grant.title}</div>
                        <div className="text-xs text-gray-500">{grant.amount}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSaveGrant(grant.id)
                        }}
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={exportSavedGrants}>
                  <Download className="h-4 w-4 mr-2" />
                  Export List
                </Button>
              </Card>
            )}

            {/* Grant Types */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Grant Types</h3>
              <div className="space-y-3">
                {['Government', 'Corporate', 'Foundation', 'Non-Profit'].map(type => {
                  const count = grants.filter(g => g.type === type).length
                  return (
                    <div 
                      key={type}
                      className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedType(type)}
                    >
                      <div className="flex items-center gap-2">
                        {type === 'Government' && <Building2 className="h-4 w-4 text-blue-500" />}
                        {type === 'Corporate' && <Globe className="h-4 w-4 text-purple-500" />}
                        {type === 'Foundation' && <Award className="h-4 w-4 text-yellow-500" />}
                        {type === 'Non-Profit' && <Users className="h-4 w-4 text-green-500" />}
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{count}</Badge>
                    </div>
                  )
                })}
              </div>
            </Card>

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
                <Link href="/startup/funding/investors">
                  <div className="p-3 border rounded-lg hover:border-primary-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium">Investor Database</span>
                    </div>
                  </div>
                </Link>
                <Link href="/startup/ai/grant-writer">
                  <div className="p-3 border rounded-lg hover:border-primary-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium">AI Grant Writer</span>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-gradient-to-br from-primary-50 to-blue-50">
              <h3 className="font-bold mb-3">Grant Application Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Start applications well before deadlines</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Carefully review all eligibility requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Prepare all required documents in advance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Tailor your application to each grant's goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Follow up after submission</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
