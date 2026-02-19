'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Users, 
  Search as SearchIcon,
  Download,
  Save,
  Share2,
  Calculator,
  PieChart,
  MapPin,
  Globe,
  CheckCircle,
  Circle,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Printer,
  Upload,
  Filter,
  Award,
  Target,
  BarChart3,
  Calendar,
  Clock,
  Mail,
  Phone,
  Link as LinkIcon,
  Star,
  TrendingDown,
  AlertCircle,
  CheckSquare,
  BookOpen,
  Sparkles,
  Zap,
  Gauge,
  Network,
  Building2,
  Briefcase,
  Rocket,
  Lightbulb,
  Shield,
  Activity,
  LineChart as LineChartIcon,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'

interface Investor {
  id: string
  name: string
  type: 'VC' | 'Angel' | 'Corporate' | 'Accelerator' | 'Government'
  focus: string[]
  stage: string[]
  location: string
  portfolio: number
  avgCheckSize: string
  website?: string
  email?: string
  rating: number
  industries: string[]
  description: string
}

interface Grant {
  id: string
  title: string
  provider: string
  amount: string
  deadline: string
  type: 'Government' | 'Corporate' | 'Foundation' | 'University'
  eligibility: string[]
  requirements: string[]
  link?: string
  status: 'open' | 'upcoming' | 'closed'
}

interface FundingStage {
  id: string
  name: string
  amount: string
  timeline: string
  requirements: string[]
  completed: boolean
}

interface PitchDeckSection {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

interface TermSheetTerm {
  id: string
  term: string
  value: string
  description: string
  category: 'valuation' | 'equity' | 'control' | 'liquidity' | 'other'
}

interface Outreach {
  id: string
  investorName: string
  date: string
  status: 'pending' | 'sent' | 'responded' | 'meeting' | 'rejected'
  notes: string
  followUpDate?: string
}

export default function FundingNavigatorPage() {
  const [activeTab, setActiveTab] = useState('readiness')
  const [readinessScore, setReadinessScore] = useState(0)
  const [investorSearchQuery, setInvestorSearchQuery] = useState('')
  const [grantSearchQuery, setGrantSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStage, setFilterStage] = useState('all')
  const [filterLocation, setFilterLocation] = useState('all')
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null)
  const [fundingAmount, setFundingAmount] = useState('')
  const [currentValuation, setCurrentValuation] = useState('')
  const [equityOffered, setEquityOffered] = useState('')
  const [dilutionResult, setDilutionResult] = useState<number | null>(null)
  const [revenue, setRevenue] = useState('')
  const [revenueMultiple, setRevenueMultiple] = useState('')
  const [valuationResult, setValuationResult] = useState<number | null>(null)
  const [outreachList, setOutreachList] = useState<Outreach[]>([])
  const [editingOutreach, setEditingOutreach] = useState<Outreach | null>(null)

  const tabs = [
    { id: 'readiness', label: 'Readiness Assessment', icon: Gauge },
    { id: 'investors', label: 'Investor Matching', icon: Users },
    { id: 'grants', label: 'Grant Finder', icon: Award },
    { id: 'strategy', label: 'Funding Strategy', icon: Target },
    { id: 'pitch', label: 'Pitch Deck Checker', icon: FileText },
    { id: 'termsheet', label: 'Term Sheet Analyzer', icon: Shield },
    { id: 'timeline', label: 'Funding Timeline', icon: Calendar },
    { id: 'outreach', label: 'Outreach Tracker', icon: Mail },
    { id: 'calculator', label: 'Funding Calculators', icon: Calculator },
  ]

  const investors: Investor[] = [
    {
      id: '1',
      name: 'TechVentures Capital',
      type: 'VC',
      focus: ['SaaS', 'B2B', 'Enterprise Software'],
      stage: ['Seed', 'Series A'],
      location: 'San Francisco, CA',
      portfolio: 50,
      avgCheckSize: '$500K - $2M',
      website: 'https://techventures.com',
      email: 'info@techventures.com',
      rating: 4.8,
      industries: ['SaaS', 'Enterprise', 'B2B'],
      description: 'Leading early-stage VC focused on B2B SaaS companies with strong product-market fit.'
    },
    {
      id: '2',
      name: 'Innovation Fund',
      type: 'VC',
      focus: ['FinTech', 'HealthTech', 'AI/ML'],
      stage: ['Series A', 'Series B'],
      location: 'New York, NY',
      portfolio: 75,
      avgCheckSize: '$2M - $10M',
      website: 'https://innovationfund.com',
      email: 'contact@innovationfund.com',
      rating: 4.6,
      industries: ['FinTech', 'HealthTech', 'AI'],
      description: 'Growth-stage fund investing in innovative technology companies.'
    },
    {
      id: '3',
      name: 'Growth Partners',
      type: 'VC',
      focus: ['E-commerce', 'Consumer', 'Marketplace'],
      stage: ['Seed', 'Series A'],
      location: 'Austin, TX',
      portfolio: 40,
      avgCheckSize: '$250K - $1M',
      website: 'https://growthpartners.com',
      email: 'hello@growthpartners.com',
      rating: 4.7,
      industries: ['E-commerce', 'Consumer', 'Marketplace'],
      description: 'Early-stage fund backing consumer and marketplace startups.'
    },
    {
      id: '4',
      name: 'Angel Network',
      type: 'Angel',
      focus: ['All Industries'],
      stage: ['Pre-Seed', 'Seed'],
      location: 'Remote',
      portfolio: 200,
      avgCheckSize: '$25K - $250K',
      website: 'https://angelnetwork.com',
      email: 'apply@angelnetwork.com',
      rating: 4.5,
      industries: ['All'],
      description: 'Large angel network supporting early-stage startups across all industries.'
    },
    {
      id: '5',
      name: 'Corporate Ventures',
      type: 'Corporate',
      focus: ['Enterprise', 'B2B', 'SaaS'],
      stage: ['Series A', 'Series B', 'Series C'],
      location: 'Boston, MA',
      portfolio: 30,
      avgCheckSize: '$1M - $5M',
      website: 'https://corporateventures.com',
      email: 'ventures@corporate.com',
      rating: 4.4,
      industries: ['Enterprise', 'B2B', 'SaaS'],
      description: 'Corporate venture arm focused on strategic investments in enterprise software.'
    },
    {
      id: '6',
      name: 'Y Combinator',
      type: 'Accelerator',
      focus: ['All Industries'],
      stage: ['Pre-Seed', 'Seed'],
      location: 'San Francisco, CA',
      portfolio: 3000,
      avgCheckSize: '$500K',
      website: 'https://ycombinator.com',
      email: 'apply@ycombinator.com',
      rating: 4.9,
      industries: ['All'],
      description: 'World\'s most successful startup accelerator program.'
    },
  ]

  const grants: Grant[] = [
    {
      id: '1',
      title: 'Small Business Innovation Research (SBIR)',
      provider: 'National Science Foundation',
      amount: 'Up to $2M',
      deadline: '2024-04-15',
      type: 'Government',
      eligibility: ['US-based companies', 'Early-stage R&D', 'Technology focus'],
      requirements: ['Business plan', 'Technical proposal', 'Budget breakdown'],
      link: 'https://www.nsf.gov/sbir',
      status: 'open'
    },
    {
      id: '2',
      title: 'Startup Innovation Grant',
      provider: 'TechCorp Innovation',
      amount: 'Up to $500K',
      deadline: '2024-05-01',
      type: 'Corporate',
      eligibility: ['Tech startups', 'Under 5 years old', 'Innovation focus'],
      requirements: ['Pitch deck', 'Financial projections', 'Team bios'],
      link: 'https://techcorp.com/grants',
      status: 'open'
    },
    {
      id: '3',
      title: 'Tech Startup Fund',
      provider: 'Innovation Foundation',
      amount: 'Up to $1M',
      deadline: '2024-06-10',
      type: 'Foundation',
      eligibility: ['Technology startups', 'Social impact', 'Scalable business model'],
      requirements: ['Business plan', 'Impact statement', 'Financials'],
      link: 'https://innovationfoundation.org',
      status: 'open'
    },
    {
      id: '4',
      title: 'Women in Tech Grant',
      provider: 'Diversity Fund',
      amount: 'Up to $250K',
      deadline: '2024-07-20',
      type: 'Foundation',
      eligibility: ['Women-led startups', 'Tech industry', 'Early stage'],
      requirements: ['Founder profile', 'Business plan', 'Diversity statement'],
      status: 'upcoming'
    },
    {
      id: '5',
      title: 'Climate Tech Grant',
      provider: 'Green Ventures',
      amount: 'Up to $750K',
      deadline: '2024-08-15',
      type: 'Corporate',
      eligibility: ['Climate tech', 'Sustainability focus', 'Scalable solution'],
      requirements: ['Environmental impact report', 'Business plan', 'Technical proposal'],
      status: 'upcoming'
    },
  ]

  const initialPitchDeckSections: PitchDeckSection[] = [
    { id: '1', title: 'Problem Statement', description: 'Clearly define the problem you\'re solving', completed: false, priority: 'high' },
    { id: '2', title: 'Solution', description: 'Explain your unique solution', completed: false, priority: 'high' },
    { id: '3', title: 'Market Opportunity', description: 'Show market size and potential', completed: false, priority: 'high' },
    { id: '4', title: 'Business Model', description: 'How you make money', completed: false, priority: 'high' },
    { id: '5', title: 'Traction', description: 'Show progress and metrics', completed: false, priority: 'high' },
    { id: '6', title: 'Competitive Analysis', description: 'Position against competitors', completed: false, priority: 'medium' },
    { id: '7', title: 'Team', description: 'Introduce your team', completed: false, priority: 'high' },
    { id: '8', title: 'Financial Projections', description: 'Revenue and growth forecasts', completed: false, priority: 'high' },
    { id: '9', title: 'Ask', description: 'Funding amount and use of funds', completed: false, priority: 'high' },
    { id: '10', title: 'Vision', description: 'Long-term vision and roadmap', completed: false, priority: 'medium' },
  ]

  const initialTermSheetTerms: TermSheetTerm[] = [
    { id: '1', term: 'Pre-Money Valuation', value: '', description: 'Company valuation before investment', category: 'valuation' },
    { id: '2', term: 'Post-Money Valuation', value: '', description: 'Company valuation after investment', category: 'valuation' },
    { id: '3', term: 'Investment Amount', value: '', description: 'Total investment being raised', category: 'equity' },
    { id: '4', term: 'Equity Percentage', value: '', description: 'Percentage of company being sold', category: 'equity' },
    { id: '5', term: 'Liquidation Preference', value: '', description: 'Investor payout priority', category: 'liquidity' },
    { id: '6', term: 'Board Seats', value: '', description: 'Number of board seats for investors', category: 'control' },
    { id: '7', term: 'Anti-Dilution', value: '', description: 'Protection against future dilution', category: 'equity' },
    { id: '8', term: 'Vesting Schedule', value: '', description: 'Founder equity vesting terms', category: 'equity' },
  ]

  const [pitchDeckSectionsState, setPitchDeckSectionsState] = useState<PitchDeckSection[]>(initialPitchDeckSections)
  const [termSheetTermsState, setTermSheetTermsState] = useState<TermSheetTerm[]>(initialTermSheetTerms)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fundingNavigatorData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.readinessScore) setReadinessScore(data.readinessScore)
          if (data.outreachList) setOutreachList(data.outreachList)
          if (data.pitchDeckSections) setPitchDeckSectionsState(data.pitchDeckSections)
          if (data.termSheetTerms) setTermSheetTermsState(data.termSheetTerms)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('fundingNavigatorData') || '{}')
      data[key] = value
      localStorage.setItem('fundingNavigatorData', JSON.stringify(data))
    }
  }

  const calculateReadiness = () => {
    // Enhanced readiness calculation based on user inputs
    // In a real app, this would be based on actual user responses
    const baseScore = 50
    const randomFactor = Math.floor(Math.random() * 30) // 0-30
    const score = Math.min(baseScore + randomFactor, 100)
    setReadinessScore(score)
    saveToLocalStorage('readinessScore', score)
    showToast(`Readiness score calculated: ${score}%`, 'success')
  }

  const calculateDilution = () => {
    const amount = parseFloat(fundingAmount)
    const valuation = parseFloat(currentValuation)
    const equity = parseFloat(equityOffered)

    if (!amount || !valuation || !equity) {
      showToast('Please fill in all fields', 'error')
      return
    }

    const postMoney = valuation + amount
    const investorEquity = (amount / postMoney) * 100
    const totalDilution = investorEquity + equity
    setDilutionResult(totalDilution)
    showToast('Dilution calculated!', 'success')
  }

  const calculateValuation = () => {
    const rev = parseFloat(revenue)
    const multiple = parseFloat(revenueMultiple)

    if (!rev || !multiple) {
      showToast('Please fill in all fields', 'error')
      return
    }

    const valuation = rev * multiple
    setValuationResult(valuation)
    showToast('Valuation calculated!', 'success')
  }

  const togglePitchDeckSection = (id: string) => {
    setPitchDeckSectionsState(prev => {
      const updated = prev.map(section => 
        section.id === id ? { ...section, completed: !section.completed } : section
      )
      saveToLocalStorage('pitchDeckSections', updated)
      return updated
    })
    const section = pitchDeckSectionsState.find(s => s.id === id)
    showToast(`${section?.title} marked as ${section?.completed ? 'incomplete' : 'complete'}`, 'info')
  }

  const updateTermSheetTerm = (id: string, value: string) => {
    setTermSheetTermsState(prev => {
      const updated = prev.map(term => 
        term.id === id ? { ...term, value } : term
      )
      saveToLocalStorage('termSheetTerms', updated)
      return updated
    })
  }

  const deleteOutreach = (id: string) => {
    const updated = outreachList.filter(o => o.id !== id)
    setOutreachList(updated)
    saveToLocalStorage('outreachList', updated)
    showToast('Outreach deleted', 'success')
  }

  const updateOutreach = (updatedOutreach: Outreach) => {
    setOutreachList(prev => {
      const updated = prev.map(o => o.id === updatedOutreach.id ? updatedOutreach : o)
      saveToLocalStorage('outreachList', updated)
      return updated
    })
    setEditingOutreach(null)
    showToast('Outreach updated', 'success')
  }

  const exportData = () => {
    const data = {
      readinessScore,
      outreachList,
      pitchDeckSections: pitchDeckSectionsState,
      termSheetTerms: termSheetTermsState,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `funding-navigator-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Data exported successfully', 'success')
  }

  const calculateInvestorMatchScore = (investor: Investor): number => {
    let score = 0
    // Simple matching algorithm - can be enhanced
    if (investor.type === 'VC') score += 20
    if (investor.rating >= 4.5) score += 20
    if (investor.portfolio > 50) score += 15
    if (investor.stage.includes('Seed')) score += 15
    score += Math.min(investor.industries.length * 5, 30)
    return Math.min(score, 100)
  }

  const addOutreach = () => {
    if (!selectedInvestor) {
      showToast('Please select an investor first', 'error')
      return
    }
    const newOutreach: Outreach = {
      id: Date.now().toString(),
      investorName: selectedInvestor.name,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    }
    const updated = [...outreachList, newOutreach]
    setOutreachList(updated)
    saveToLocalStorage('outreachList', updated)
    showToast('Outreach added!', 'success')
  }

  const filteredInvestors = investors.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(investorSearchQuery.toLowerCase()) ||
                         inv.focus.some(f => f.toLowerCase().includes(investorSearchQuery.toLowerCase()))
    const matchesType = filterType === 'all' || inv.type === filterType
    const matchesStage = filterStage === 'all' || inv.stage.includes(filterStage)
    const matchesLocation = filterLocation === 'all' || inv.location.toLowerCase().includes(filterLocation.toLowerCase())
    return matchesSearch && matchesType && matchesStage && matchesLocation
  }).sort((a, b) => calculateInvestorMatchScore(b) - calculateInvestorMatchScore(a))

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(grantSearchQuery.toLowerCase()) ||
                         grant.provider.toLowerCase().includes(grantSearchQuery.toLowerCase())
    const matchesType = filterType === 'all' || grant.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
              Funding Navigator
            </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate the funding landscape with comprehensive tools for readiness assessment, investor matching, grant discovery, and more.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportData} className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Readiness Assessment Tab */}
        {activeTab === 'readiness' && (
          <div className="space-y-6">
          <Card>
              <div className="flex items-center gap-3 mb-6">
                <Gauge className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Funding Readiness Assessment</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Evaluate your startup's readiness for different types of funding rounds.
              </p>
              
              {readinessScore > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Readiness Score</span>
                    <span className="text-2xl font-bold text-primary-600">{readinessScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${readinessScore}%` }}
                    />
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {readinessScore >= 80 ? 'Excellent! You\'re well-prepared for funding.' :
                       readinessScore >= 60 ? 'Good progress. Focus on improving weak areas.' :
                       'Continue building before seeking funding.'}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4">Business Fundamentals</h3>
                  {[
                    { text: 'Business plan completed', weight: 15 },
                    { text: 'Financial projections ready', weight: 15 },
                    { text: 'Market research done', weight: 10 },
                    { text: 'Team assembled', weight: 15 },
                    { text: 'Traction demonstrated', weight: 20 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <CheckSquare className="h-5 w-5 text-gray-400 shrink-0" />
                      <span className="text-sm flex-1 min-w-0">{item.text}</span>
                      <Badge variant="outline" className="text-xs shrink-0">{item.weight}%</Badge>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4">Funding Materials</h3>
                  {[
                    { text: 'Pitch deck ready', weight: 20 },
                    { text: 'Executive summary', weight: 10 },
                    { text: 'Financial model', weight: 15 },
                    { text: 'Cap table', weight: 10 },
                    { text: 'Term sheet template', weight: 5 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <CheckSquare className="h-5 w-5 text-gray-400 shrink-0" />
                      <span className="text-sm flex-1 min-w-0">{item.text}</span>
                      <Badge variant="outline" className="text-xs shrink-0">{item.weight}%</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={calculateReadiness} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Readiness Score
            </Button>
          </Card>

            <Link href="/startup/funding/readiness">
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="bg-primary-500/10 p-4 rounded-lg shrink-0">
                    <Target className="h-6 w-6 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">Detailed Readiness Assessment</h3>
                    <p className="text-sm text-gray-600">Complete a comprehensive assessment with detailed recommendations</p>
                  </div>
                  <Button variant="outline" className="shrink-0">View Details →</Button>
                </div>
              </Card>
            </Link>
          </div>
        )}

        {/* Investor Matching Tab */}
        {activeTab === 'investors' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Investor Matching</h2>
                </div>
                <Badge className="shrink-0">{filteredInvestors.length} Investors</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search investors..."
                    value={investorSearchQuery}
                    onChange={(e) => setInvestorSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'VC', label: 'VC' },
                    { value: 'Angel', label: 'Angel' },
                    { value: 'Corporate', label: 'Corporate' },
                    { value: 'Accelerator', label: 'Accelerator' },
                  ]}
                />
                <Select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Stages' },
                    { value: 'Pre-Seed', label: 'Pre-Seed' },
                    { value: 'Seed', label: 'Seed' },
                    { value: 'Series A', label: 'Series A' },
                    { value: 'Series B', label: 'Series B' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInvestors.map((investor) => (
                  <Card key={investor.id} className="hover:shadow-lg transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2 truncate">{investor.name}</h3>
                        <Badge variant="outline" className="text-xs">{investor.type}</Badge>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 ml-3 shrink-0">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 shrink-0" />
                          <span className="text-sm font-medium whitespace-nowrap">{investor.rating}</span>
                        </div>
                        <Badge variant="new" className="text-xs whitespace-nowrap">
                          {calculateInvestorMatchScore(investor)}% Match
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{investor.description}</p>
                    <div className="space-y-2 mb-4 text-sm flex-1">
                      <div className="flex items-start gap-2 text-gray-600">
                        <Target className="h-4 w-4 mt-0.5 shrink-0" />
                        <span className="break-words">{investor.focus.join(', ')}</span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <Rocket className="h-4 w-4 mt-0.5 shrink-0" />
                        <span className="break-words">{investor.stage.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="break-words">{investor.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4 shrink-0" />
                        <span className="break-words">{investor.avgCheckSize}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedInvestor(investor)
                          showToast(`Selected ${investor.name}`, 'success')
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => {
                          const newOutreach: Outreach = {
                            id: Date.now().toString(),
                            investorName: investor.name,
                            date: new Date().toISOString().split('T')[0],
                            status: 'pending',
                            notes: ''
                          }
                          setOutreachList([...outreachList, newOutreach])
                          showToast('Added to outreach tracker', 'success')
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {selectedInvestor && (
              <Card>
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-xl font-bold flex-1">Investor Details: {selectedInvestor.name}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedInvestor(null)} className="shrink-0 ml-4">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      {selectedInvestor.website && (
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 shrink-0 text-gray-400" />
                          <a href={selectedInvestor.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline break-all">
                            {selectedInvestor.website}
                          </a>
                        </div>
                      )}
                      {selectedInvestor.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                          <span className="break-all">{selectedInvestor.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Investment Focus</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedInvestor.industries.map((ind, idx) => (
                        <Badge key={idx} variant="outline">{ind}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Grant Finder Tab */}
        {activeTab === 'grants' && (
          <div className="space-y-6">
          <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Grant Opportunities</h2>
                </div>
                <Badge className="shrink-0">{filteredGrants.length} Grants</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search grants..."
                    value={grantSearchQuery}
                    onChange={(e) => setGrantSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'Government', label: 'Government' },
                    { value: 'Corporate', label: 'Corporate' },
                    { value: 'Foundation', label: 'Foundation' },
                    { value: 'University', label: 'University' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGrants.map((grant) => (
                  <Card key={grant.id} className="hover:shadow-lg transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary-500/10 p-3 rounded-lg shrink-0">
                        <Award className="h-6 w-6 text-primary-500" />
                      </div>
                      <Badge 
                        variant={grant.status === 'open' ? 'new' : grant.status === 'upcoming' ? 'outline' : 'outline'}
                        className="ml-auto shrink-0"
                      >
                        {grant.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{grant.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{grant.provider}</p>
                    <div className="space-y-2 mb-4 text-sm flex-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="font-medium">{grant.amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                        <span>Deadline: {new Date(grant.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{grant.type}</Badge>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">Eligibility:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {grant.eligibility.slice(0, 2).map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-auto"
                      onClick={() => {
                        setSelectedGrant(grant)
                        showToast(`Viewing ${grant.title}`, 'info')
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
            </Button>
          </Card>
                ))}
              </div>
            </Card>

            {selectedGrant && (
              <Card>
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-xl font-bold flex-1 pr-4">{selectedGrant.title}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedGrant(null)} className="shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-5">
                  <div>
                    <h4 className="font-semibold mb-2">Provider</h4>
                    <p className="text-gray-600">{selectedGrant.provider}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Amount</h4>
                      <p className="text-gray-600">{selectedGrant.amount}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Deadline</h4>
                      <p className="text-gray-600">{new Date(selectedGrant.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Eligibility Requirements</h4>
                    <ul className="list-disc list-inside space-y-1.5 text-gray-600">
                      {selectedGrant.eligibility.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Application Requirements</h4>
                    <ul className="list-disc list-inside space-y-1.5 text-gray-600">
                      {selectedGrant.requirements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {selectedGrant.link && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(selectedGrant.link, '_blank')}
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Funding Strategy Tab */}
        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Funding Strategy Builder</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Build a comprehensive funding strategy tailored to your startup's stage and needs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4">Funding Stages</h3>
                  {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C'].map((stage, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <h4 className="font-semibold">{stage}</h4>
                        <Badge variant="outline" className="shrink-0">${['50K-250K', '250K-2M', '2M-10M', '10M-50M', '50M+'][idx]}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {['Validate idea and build MVP', 'Product-market fit and early traction', 'Scale and grow revenue', 'Expand to new markets', 'Prepare for exit'][idx]}
                      </p>
                    </Card>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4">Funding Sources</h3>
                  {['Bootstrapping', 'Friends & Family', 'Angel Investors', 'VC Funding', 'Grants', 'Crowdfunding'].map((source, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary-500/10 p-2 rounded-lg shrink-0">
                          <DollarSign className="h-5 w-5 text-primary-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-1">{source}</h4>
                          <p className="text-xs text-gray-600">
                            {['Use personal savings', 'Raise from close network', 'Individual investors', 'Institutional capital', 'Non-dilutive funding', 'Community funding'][idx]}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Pitch Deck Checker Tab */}
        {activeTab === 'pitch' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Pitch Deck Readiness Checker</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Ensure your pitch deck includes all essential sections before meeting with investors.
              </p>

              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {pitchDeckSectionsState.filter(s => s.completed).length} of {pitchDeckSectionsState.length} sections completed
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={exportData} className="shrink-0">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="space-y-4">
                {pitchDeckSectionsState.map((section) => (
                  <Card key={section.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => togglePitchDeckSection(section.id)}
                        className="mt-0.5 cursor-pointer shrink-0"
                      >
                        {section.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-300 hover:text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold">{section.title}</h4>
                          <Badge variant={section.priority === 'high' ? 'new' : 'outline'} className="text-xs shrink-0">
                            {section.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">Tips for a Great Pitch Deck</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1 ml-7">
                  <li>• Keep it concise - aim for 10-15 slides</li>
                  <li>• Tell a compelling story</li>
                  <li>• Use data to support your claims</li>
                  <li>• Practice your delivery</li>
                  <li>• Be prepared for questions</li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {/* Term Sheet Analyzer Tab */}
        {activeTab === 'termsheet' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Term Sheet Analyzer</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Analyze and understand key terms in your investment term sheet.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {termSheetTermsState.map((term) => (
                  <Card key={term.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{term.term}</h4>
                      <Badge variant="outline" className="text-xs">{term.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{term.description}</p>
                    <Input
                      placeholder="Enter value..."
                      value={term.value}
                      onChange={(e) => updateTermSheetTerm(term.id, e.target.value)}
                    />
                  </Card>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button variant="outline" onClick={exportData} className="shrink-0">
                  <Download className="h-4 w-4 mr-2" />
                  Export Term Sheet
                </Button>
                <Button variant="outline" onClick={() => window.print()} className="shrink-0">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold">Important Considerations</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1 ml-7">
                  <li>• Review all terms with legal counsel</li>
                  <li>• Understand dilution implications</li>
                  <li>• Negotiate board control carefully</li>
                  <li>• Consider liquidation preferences</li>
                  <li>• Plan for future funding rounds</li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {/* Funding Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Funding Timeline Planner</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Plan your funding journey with key milestones and deadlines.
              </p>

              <div className="mb-6">
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>
                  <div className="space-y-8">
                    {['Pre-Seed', 'Seed', 'Series A', 'Series B'].map((stage, idx) => (
                      <div key={idx} className="relative flex items-start gap-6">
                        <div className="relative z-10 bg-white border-4 border-primary-500 rounded-full p-2 shrink-0">
                          <div className="bg-primary-500 rounded-full w-4 h-4"></div>
                        </div>
                        <Card className="flex-1 p-6 min-w-0">
                          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <h4 className="font-semibold text-lg">{stage} Round</h4>
                            <Badge variant="outline" className="shrink-0">Q{idx + 1} 2024</Badge>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                              <DollarSign className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              <span className="font-medium">Target Amount: ${['250K', '1M', '5M', '15M'][idx]}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Clock className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                              <span>Timeline: {['3 months', '4 months', '6 months', '6 months'][idx]}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Target className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                              <span className="break-words">Key Milestones: {['MVP Launch', 'First Customers', 'Product-Market Fit', 'Revenue Growth'][idx]}</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50">
                <h4 className="font-semibold mb-4">Funding Roadmap Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-bold text-primary-600 mb-1">$21.25M</div>
                    <div className="text-xs text-gray-600">Total Funding Goal</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-bold text-primary-600 mb-1">19 months</div>
                    <div className="text-xs text-gray-600">Estimated Timeline</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-bold text-primary-600 mb-1">4</div>
                    <div className="text-xs text-gray-600">Funding Rounds</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-bold text-primary-600 mb-1">Q4 2025</div>
                    <div className="text-xs text-gray-600">Target Completion</div>
                  </div>
                </div>
              </Card>
            </Card>
          </div>
        )}

        {/* Outreach Tracker Tab */}
        {activeTab === 'outreach' && (
          <div className="space-y-6">
          <Card>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary-500 shrink-0" />
                  <h2 className="text-2xl font-bold">Investor Outreach Tracker</h2>
                </div>
                <Button onClick={addOutreach} size="sm" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Outreach
                </Button>
              </div>

              {outreachList.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Outreach Yet</h3>
                  <p className="text-gray-600 mb-6">Start tracking your investor outreach</p>
                  <Button onClick={addOutreach}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Outreach
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {outreachList.map((outreach) => (
                    <Card key={outreach.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="font-semibold">{outreach.investorName}</h4>
                            <Badge variant={
                              outreach.status === 'meeting' ? 'new' :
                              outreach.status === 'responded' ? 'outline' :
                              outreach.status === 'rejected' ? 'outline' : 'outline'
                            } className="shrink-0">
                              {outreach.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Date: {new Date(outreach.date).toLocaleDateString()}</div>
                            {outreach.followUpDate && (
                              <div>Follow-up: {new Date(outreach.followUpDate).toLocaleDateString()}</div>
                            )}
                            {outreach.notes && <div className="break-words">Notes: {outreach.notes}</div>}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingOutreach(outreach)}
                            className="shrink-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteOutreach(outreach.id)}
                            className="shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {editingOutreach && (
                <Card className="mt-6">
                  <h3 className="text-lg font-bold mb-4">Edit Outreach</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Investor Name</label>
                      <Input
                        value={editingOutreach.investorName}
                        onChange={(e) => setEditingOutreach({ ...editingOutreach, investorName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <Input
                        type="date"
                        value={editingOutreach.date}
                        onChange={(e) => setEditingOutreach({ ...editingOutreach, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <Select
                        value={editingOutreach.status}
                        onChange={(e) => setEditingOutreach({ ...editingOutreach, status: e.target.value as Outreach['status'] })}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'sent', label: 'Sent' },
                          { value: 'responded', label: 'Responded' },
                          { value: 'meeting', label: 'Meeting Scheduled' },
                          { value: 'rejected', label: 'Rejected' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                        rows={4}
                        value={editingOutreach.notes}
                        onChange={(e) => setEditingOutreach({ ...editingOutreach, notes: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date (Optional)</label>
                      <Input
                        type="date"
                        value={editingOutreach.followUpDate || ''}
                        onChange={(e) => setEditingOutreach({ ...editingOutreach, followUpDate: e.target.value || undefined })}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => updateOutreach(editingOutreach)} className="flex-1 min-w-[120px]">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditingOutreach(null)} className="shrink-0">
                        Cancel
            </Button>
                    </div>
                  </div>
                </Card>
              )}
          </Card>
          </div>
        )}

        {/* Funding Calculators Tab */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
          <Card>
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Funding Calculators</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 flex flex-col">
                  <h3 className="font-semibold mb-4">Equity Dilution Calculator</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Funding Amount ($)</label>
                      <Input
                        type="number"
                        value={fundingAmount}
                        onChange={(e) => setFundingAmount(e.target.value)}
                        placeholder="e.g., 1000000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Valuation ($)</label>
                      <Input
                        type="number"
                        value={currentValuation}
                        onChange={(e) => setCurrentValuation(e.target.value)}
                        placeholder="e.g., 5000000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Equity Offered (%)</label>
                      <Input
                        type="number"
                        value={equityOffered}
                        onChange={(e) => setEquityOffered(e.target.value)}
                        placeholder="e.g., 20"
                      />
                    </div>
                    <Button onClick={calculateDilution} className="w-full">
                      Calculate Dilution
                    </Button>
                    {dilutionResult !== null && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Total Dilution</div>
                        <div className="text-2xl font-bold text-primary-600">{dilutionResult.toFixed(2)}%</div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6 flex flex-col">
                  <h3 className="font-semibold mb-4">Valuation Calculator</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Revenue (Annual)</label>
                      <Input 
                        type="number"
                        placeholder="e.g., 1000000"
                        value={revenue}
                        onChange={(e) => setRevenue(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Multiple</label>
                      <Input 
                        type="number"
                        placeholder="e.g., 5"
                        value={revenueMultiple}
                        onChange={(e) => setRevenueMultiple(e.target.value)}
                      />
                    </div>
                    <Button onClick={calculateValuation} className="w-full">
                      Calculate Valuation
            </Button>
                    {valuationResult !== null && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Estimated Valuation</div>
                        <div className="text-2xl font-bold text-primary-600">
                          ${valuationResult.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/startup/convertible-note-calculator">
                  <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
                    <Calculator className="h-6 w-6 text-primary-500 mb-2" />
                    <h4 className="font-semibold mb-1">Convertible Note</h4>
                    <p className="text-xs text-gray-600">Calculate conversion terms</p>
                  </Card>
                </Link>
                <Link href="/startup/safe-generator">
                  <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
                    <FileText className="h-6 w-6 text-primary-500 mb-2" />
                    <h4 className="font-semibold mb-1">SAFE Generator</h4>
                    <p className="text-xs text-gray-600">Generate SAFE agreements</p>
                  </Card>
                </Link>
                <Link href="/startup/valuation-calculator">
                  <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
                    <BarChart3 className="h-6 w-6 text-primary-500 mb-2" />
                    <h4 className="font-semibold mb-1">Valuation Calculator</h4>
                    <p className="text-xs text-gray-600">Multiple valuation methods</p>
                  </Card>
                </Link>
              </div>
          </Card>
        </div>
        )}
      </div>
    </main>
  )
}

