'use client'

import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Scale, 
  FileText, 
  CheckCircle,
  X,
  AlertCircle,
  Info,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Shield,
  Target,
  BarChart3,
  HelpCircle,
  Sparkles,
  Calculator,
  BookOpen,
  Download,
  Share2,
  ArrowRight,
  Check,
  XCircle
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

type StructureType = 'llc' | 'c-corp' | 's-corp' | 'partnership' | 'sole-proprietorship' | 'b-corp' | 'nonprofit'

interface Structure {
  id: StructureType
  title: string
  shortName: string
  description: string
  pros: string[]
  cons: string[]
  bestFor: string[]
  setupCost: string
  annualCost: string
  taxTreatment: string
  liability: string
  fundraising: string
  ownership: string
  management: string
  requirements: string[]
  setupSteps: string[]
  icon: typeof Scale
}

const structures: Structure[] = [
  {
    id: 'llc',
    title: 'Limited Liability Company (LLC)',
    shortName: 'LLC',
    description: 'Flexible business structure that combines the liability protection of a corporation with the tax benefits of a partnership',
    pros: [
      'Limited liability protection',
      'Pass-through taxation',
      'Flexible management structure',
      'Fewer formalities than corporations',
      'Can have unlimited members',
      'Easy to set up and maintain'
    ],
    cons: [
      'Self-employment taxes on all income',
      'May need to dissolve if member leaves',
      'Not ideal for raising VC funding',
      'Some states have franchise taxes',
      'Less credibility than corporations'
    ],
    bestFor: [
      'Small to medium businesses',
      'Solo entrepreneurs',
      'Service-based businesses',
      'Real estate investments',
      'Businesses not seeking VC funding'
    ],
    setupCost: '$100 - $500',
    annualCost: '$50 - $800',
    taxTreatment: 'Pass-through (taxed on personal return)',
    liability: 'Limited personal liability',
    fundraising: 'Difficult to raise VC funding',
    ownership: 'Flexible ownership structure',
    management: 'Member-managed or manager-managed',
    requirements: [
      'Articles of Organization',
      'Operating Agreement',
      'EIN (Employer Identification Number)',
      'Business license (varies by state)',
      'Registered agent'
    ],
    setupSteps: [
      'Choose a business name',
      'File Articles of Organization with state',
      'Create Operating Agreement',
      'Obtain EIN from IRS',
      'Register for state taxes',
      'Obtain necessary business licenses',
      'Open business bank account'
    ],
    icon: Building2
  },
  {
    id: 'c-corp',
    title: 'C-Corporation',
    shortName: 'C-Corp',
    description: 'Separate legal entity that offers the strongest liability protection and is preferred by venture capital investors',
    pros: [
      'Strongest liability protection',
      'Preferred by VCs and investors',
      'Can issue multiple classes of stock',
      'No limit on number of shareholders',
      'Can deduct employee benefits',
      'Easier to transfer ownership',
      'Can go public (IPO)'
    ],
    cons: [
      'Double taxation (corporate + personal)',
      'More complex and expensive to set up',
      'More regulatory requirements',
      'Annual meetings required',
      'Must maintain corporate records',
      'Higher ongoing costs'
    ],
    bestFor: [
      'Startups seeking VC funding',
      'High-growth companies',
      'Companies planning to go public',
      'Companies with multiple investors',
      'Tech startups'
    ],
    setupCost: '$500 - $2,000',
    annualCost: '$500 - $2,000',
    taxTreatment: 'Double taxation (corporate tax + shareholder dividends)',
    liability: 'Complete liability protection',
    fundraising: 'Ideal for VC and institutional investors',
    ownership: 'Stock-based ownership',
    management: 'Board of directors + officers',
    requirements: [
      'Articles of Incorporation',
      'Corporate bylaws',
      'EIN',
      'Board of directors',
      'Stock issuance',
      'Registered agent',
      'Initial report (varies by state)'
    ],
    setupSteps: [
      'Choose a business name',
      'File Articles of Incorporation',
      'Create corporate bylaws',
      'Appoint board of directors',
      'Issue stock certificates',
      'Obtain EIN',
      'Register for state taxes',
      'Hold initial board meeting',
      'Open corporate bank account',
      'File initial report (if required)'
    ],
    icon: TrendingUp
  },
  {
    id: 's-corp',
    title: 'S-Corporation',
    shortName: 'S-Corp',
    description: 'Tax election that allows corporations to pass income through to shareholders, avoiding double taxation',
    pros: [
      'Pass-through taxation',
      'Limited liability protection',
      'Avoids double taxation',
      'Can save on self-employment taxes',
      'Professional credibility',
      'Easier to transfer ownership than LLC'
    ],
    cons: [
      'Strict eligibility requirements',
      'Limited to 100 shareholders',
      'Only one class of stock allowed',
      'Shareholders must be US citizens/residents',
      'Cannot have corporate shareholders',
      'More formalities than LLC'
    ],
    bestFor: [
      'Profitable businesses',
      'Businesses with consistent income',
      'Owners who want to save on self-employment tax',
      'Businesses that meet S-Corp requirements',
      'Small to medium businesses'
    ],
    setupCost: '$500 - $2,000',
    annualCost: '$500 - $2,000',
    taxTreatment: 'Pass-through (avoid double taxation)',
    liability: 'Complete liability protection',
    fundraising: 'Limited (100 shareholder limit)',
    ownership: 'Stock-based (one class only)',
    management: 'Board of directors + officers',
    requirements: [
      'Must first form C-Corp or LLC',
      'File Form 2553 with IRS',
      'Meet S-Corp eligibility requirements',
      'All shareholders must consent',
      'Must maintain corporate formalities'
    ],
    setupSteps: [
      'Form C-Corp or LLC first',
      'Ensure eligibility requirements are met',
      'File Form 2553 with IRS',
      'Get all shareholder consents',
      'Maintain corporate records',
      'File annual tax returns',
      'Hold annual meetings'
    ],
    icon: DollarSign
  },
  {
    id: 'partnership',
    title: 'Partnership',
    shortName: 'Partnership',
    description: 'Business owned by two or more people who share profits and losses',
    pros: [
      'Easy and inexpensive to form',
      'Pass-through taxation',
      'Shared decision-making',
      'Combined resources and expertise',
      'Flexible partnership agreements'
    ],
    cons: [
      'Unlimited personal liability',
      'Partners are liable for each other\'s actions',
      'Partnership dissolves if partner leaves',
      'Difficult to raise capital',
      'Potential for disputes'
    ],
    bestFor: [
      'Professional services',
      'Small businesses with partners',
      'Short-term projects',
      'Businesses with low liability risk',
      'Partnerships with strong trust'
    ],
    setupCost: '$0 - $200',
    annualCost: '$0 - $100',
    taxTreatment: 'Pass-through (partners report on personal returns)',
    liability: 'Unlimited personal liability',
    fundraising: 'Very difficult',
    ownership: 'Shared ownership',
    management: 'Partners manage together',
    requirements: [
      'Partnership agreement (recommended)',
      'EIN (if hiring employees)',
      'Business license (varies)',
      'DBA (if using different name)'
    ],
    setupSteps: [
      'Choose business name',
      'Create partnership agreement',
      'Obtain EIN (if needed)',
      'Register for state taxes',
      'Obtain business licenses',
      'Open business bank account'
    ],
    icon: Users
  },
  {
    id: 'sole-proprietorship',
    title: 'Sole Proprietorship',
    shortName: 'Sole Prop',
    description: 'Simplest business structure owned and operated by one person',
    pros: [
      'Easiest and cheapest to form',
      'Complete control',
      'Simple tax filing',
      'No separate business tax return',
      'Minimal paperwork'
    ],
    cons: [
      'Unlimited personal liability',
      'Difficult to raise capital',
      'Hard to sell business',
      'No separation between business and personal',
      'Limited credibility'
    ],
    bestFor: [
      'Solo entrepreneurs',
      'Low-risk businesses',
      'Testing business ideas',
      'Part-time businesses',
      'Home-based businesses'
    ],
    setupCost: '$0 - $100',
    annualCost: '$0 - $50',
    taxTreatment: 'Taxed on personal return (Schedule C)',
    liability: 'Unlimited personal liability',
    fundraising: 'Very difficult',
    ownership: 'Single owner',
    management: 'Owner manages',
    requirements: [
      'Business license (varies)',
      'DBA (if using different name)',
      'EIN (if hiring employees)'
    ],
    setupSteps: [
      'Choose business name',
      'Check name availability',
      'Register DBA (if needed)',
      'Obtain business license',
      'Get EIN (if hiring)',
      'Open business bank account'
    ],
    icon: FileText
  },
  {
    id: 'b-corp',
    title: 'Benefit Corporation (B-Corp)',
    shortName: 'B-Corp',
    description: 'For-profit corporation that balances purpose and profit, legally required to consider social and environmental impact',
    pros: [
      'Legal protection for mission',
      'Attracts mission-driven investors',
      'Employee and customer loyalty',
      'Positive brand reputation',
      'Can still raise capital',
      'Tax benefits for certain activities'
    ],
    cons: [
      'More complex reporting',
      'Must balance profit and purpose',
      'Higher setup and maintenance costs',
      'Limited to certain states',
      'Annual benefit reports required'
    ],
    bestFor: [
      'Social enterprises',
      'Mission-driven companies',
      'Companies with strong values',
      'B2C companies',
      'Companies seeking impact investors'
    ],
    setupCost: '$1,000 - $3,000',
    annualCost: '$1,000 - $3,000',
    taxTreatment: 'Same as C-Corp (double taxation)',
    liability: 'Complete liability protection',
    fundraising: 'Good for impact investors',
    ownership: 'Stock-based ownership',
    management: 'Board must consider stakeholders',
    requirements: [
      'Form as C-Corp first',
      'Amend articles to include benefit purpose',
      'Annual benefit report',
      'Meet B-Corp certification standards',
      'Consider impact in decisions'
    ],
    setupSteps: [
      'Form C-Corporation',
      'Amend Articles of Incorporation',
      'Include benefit purpose in bylaws',
      'Obtain B-Corp certification',
      'File annual benefit reports',
      'Maintain B-Corp standards'
    ],
    icon: Target
  },
  {
    id: 'nonprofit',
    title: 'Nonprofit Corporation',
    shortName: 'Nonprofit',
    description: 'Organization formed for charitable, religious, educational, or other tax-exempt purposes',
    pros: [
      'Tax-exempt status',
      'Eligible for grants',
      'Donations are tax-deductible',
      'Limited liability protection',
      'Mission-driven structure',
      'Can receive government funding'
    ],
    cons: [
      'Cannot distribute profits',
      'Complex compliance requirements',
      'Public disclosure requirements',
      'Limited business activities',
      'Strict governance rules',
      'Cannot be sold'
    ],
    bestFor: [
      'Charitable organizations',
      'Educational institutions',
      'Religious organizations',
      'Social causes',
      'Community organizations'
    ],
    setupCost: '$500 - $2,500',
    annualCost: '$500 - $2,000',
    taxTreatment: 'Tax-exempt (501(c)(3) status)',
    liability: 'Limited liability protection',
    fundraising: 'Grants and donations',
    ownership: 'No owners (board of directors)',
    management: 'Board of directors',
    requirements: [
      'Articles of Incorporation',
      'Bylaws',
      '501(c)(3) application',
      'Board of directors',
      'EIN',
      'Annual Form 990 filing'
    ],
    setupSteps: [
      'Form nonprofit corporation',
      'Create bylaws',
      'Apply for 501(c)(3) status',
      'Appoint board of directors',
      'Obtain EIN',
      'Register for state tax exemption',
      'File annual Form 990'
    ],
    icon: Shield
  }
]

export default function LegalStructurePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedStructure, setSelectedStructure] = useState<StructureType | null>(null)
  const [quizAnswers, setQuizAnswers] = useState({
    funding: '',
    teamSize: '',
    liability: '',
    tax: '',
    growth: '',
    mission: ''
  })
  const [recommendations, setRecommendations] = useState<StructureType[]>([])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
    { id: 'quiz', label: 'Decision Tool', icon: HelpCircle },
    { id: 'checklist', label: 'Setup Checklist', icon: CheckCircle },
  ]

  const calculateRecommendations = () => {
    const scores: Record<StructureType, number> = {
      'llc': 0,
      'c-corp': 0,
      's-corp': 0,
      'partnership': 0,
      'sole-proprietorship': 0,
      'b-corp': 0,
      'nonprofit': 0
    }

    // Funding preference
    if (quizAnswers.funding === 'vc') {
      scores['c-corp'] += 10
      scores['b-corp'] += 5
    } else if (quizAnswers.funding === 'none') {
      scores['llc'] += 5
      scores['sole-proprietorship'] += 3
    }

    // Team size
    if (quizAnswers.teamSize === 'solo') {
      scores['sole-proprietorship'] += 5
      scores['llc'] += 3
    } else if (quizAnswers.teamSize === 'small') {
      scores['llc'] += 5
      scores['partnership'] += 3
    } else if (quizAnswers.teamSize === 'large') {
      scores['c-corp'] += 5
      scores['s-corp'] += 3
    }

    // Liability concern
    if (quizAnswers.liability === 'high') {
      scores['c-corp'] += 8
      scores['llc'] += 6
      scores['s-corp'] += 6
    } else if (quizAnswers.liability === 'low') {
      scores['sole-proprietorship'] += 5
      scores['partnership'] += 3
    }

    // Tax preference
    if (quizAnswers.tax === 'pass-through') {
      scores['llc'] += 8
      scores['s-corp'] += 6
      scores['partnership'] += 5
    } else if (quizAnswers.tax === 'corporate') {
      scores['c-corp'] += 8
    }

    // Growth plans
    if (quizAnswers.growth === 'high') {
      scores['c-corp'] += 8
      scores['b-corp'] += 5
    } else if (quizAnswers.growth === 'moderate') {
      scores['llc'] += 5
      scores['s-corp'] += 4
    }

    // Mission-driven
    if (quizAnswers.mission === 'yes') {
      scores['b-corp'] += 10
      scores['nonprofit'] += 8
    }

    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, score]) => score > 0)
      .slice(0, 3)
      .map(([type]) => type as StructureType)

    setRecommendations(sorted)
    showToast('Recommendations calculated!', 'success')
  }

  const currentStructure = selectedStructure ? structures.find(s => s.id === selectedStructure) : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Legal Structure Guide
              </span>
          </h1>
            <Scale className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the right legal structure for your startup with detailed comparisons, decision tools, and setup guides
          </p>
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {structures.map((structure) => {
                const IconComponent = structure.icon
                return (
                  <Card
                    key={structure.id}
                    className="hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedStructure(structure.id)}
                  >
                    <div className="bg-primary-500/10 p-3 rounded-lg text-primary-500 w-fit mb-4">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{structure.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{structure.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {structure.setupCost} setup
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Learn More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            {currentStructure && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary-500/10 p-3 rounded-lg text-primary-500">
                    {React.createElement(currentStructure.icon, { className: "h-6 w-6" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{currentStructure.title}</h2>
                    <p className="text-gray-600">{currentStructure.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Advantages
                    </h3>
                    <ul className="space-y-2">
                      {currentStructure.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      Disadvantages
                    </h3>
                    <ul className="space-y-2">
                      {currentStructure.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Key Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Setup Cost</div>
                      <div className="font-semibold">{currentStructure.setupCost}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Annual Cost</div>
                      <div className="font-semibold">{currentStructure.annualCost}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Tax Treatment</div>
                      <div className="font-semibold text-sm">{currentStructure.taxTreatment}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Liability Protection</div>
                      <div className="font-semibold text-sm">{currentStructure.liability}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Fundraising</div>
                      <div className="font-semibold text-sm">{currentStructure.fundraising}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Best For</div>
                      <div className="text-sm">{currentStructure.bestFor.join(', ')}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Setup Requirements</h3>
                  <ul className="space-y-2">
                    {currentStructure.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary-600 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Structure Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Structure</th>
                      <th className="text-left p-3">Setup Cost</th>
                      <th className="text-left p-3">Tax Treatment</th>
                      <th className="text-left p-3">Liability</th>
                      <th className="text-left p-3">Fundraising</th>
                      <th className="text-left p-3">Complexity</th>
                    </tr>
                  </thead>
                  <tbody>
          {structures.map((structure) => (
                      <tr key={structure.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">{structure.shortName}</td>
                        <td className="p-3">{structure.setupCost}</td>
                        <td className="p-3">{structure.taxTreatment.substring(0, 30)}...</td>
                        <td className="p-3">{structure.liability}</td>
                        <td className="p-3">{structure.fundraising}</td>
                        <td className="p-3">
                          {structure.id === 'sole-proprietorship' ? 'Low' :
                           structure.id === 'llc' ? 'Low-Medium' :
                           structure.id === 'partnership' ? 'Low' :
                           structure.id === 's-corp' ? 'Medium' :
                           structure.id === 'c-corp' ? 'High' :
                           structure.id === 'b-corp' ? 'High' : 'High'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Decision Tool Tab */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Decision Tool</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Answer a few questions to get personalized recommendations for the best legal structure for your startup.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. What are your fundraising plans?
                  </label>
                  <Select
                    value={quizAnswers.funding}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, funding: e.target.value })}
                    options={[
                      { value: '', label: 'Select an option...' },
                      { value: 'vc', label: 'Venture capital / Institutional investors' },
                      { value: 'angel', label: 'Angel investors / Seed funding' },
                      { value: 'none', label: 'No external funding planned' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. What is your team size?
                  </label>
                  <Select
                    value={quizAnswers.teamSize}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, teamSize: e.target.value })}
                    options={[
                      { value: '', label: 'Select an option...' },
                      { value: 'solo', label: 'Just me (solo founder)' },
                      { value: 'small', label: '2-5 people' },
                      { value: 'large', label: '6+ people' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    3. How concerned are you about personal liability?
                  </label>
                  <Select
                    value={quizAnswers.liability}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, liability: e.target.value })}
                    options={[
                      { value: '', label: 'Select an option...' },
                      { value: 'high', label: 'Very concerned (high-risk business)' },
                      { value: 'medium', label: 'Somewhat concerned' },
                      { value: 'low', label: 'Not very concerned (low-risk)' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    4. What tax treatment do you prefer?
                  </label>
                  <Select
                    value={quizAnswers.tax}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, tax: e.target.value })}
                    options={[
                      { value: '', label: 'Select an option...' },
                      { value: 'pass-through', label: 'Pass-through (taxed on personal return)' },
                      { value: 'corporate', label: 'Corporate taxation' },
                      { value: 'no-preference', label: 'No preference' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    5. What are your growth plans?
                  </label>
                  <Select
                    value={quizAnswers.growth}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, growth: e.target.value })}
                    options={[
                      { value: '', label: 'Select an option...' },
                      { value: 'high', label: 'High growth / IPO potential' },
                      { value: 'moderate', label: 'Moderate growth' },
                      { value: 'stable', label: 'Stable, sustainable business' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    6. Is your business mission-driven or social impact focused?
                  </label>
                  <Select
                    value={quizAnswers.mission}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, mission: e.target.value })}
                    options={[
                      { value: '', label: 'Select an option...' },
                      { value: 'yes', label: 'Yes, social/environmental impact is important' },
                      { value: 'no', label: 'No, primarily profit-focused' }
                    ]}
                  />
                </div>

                <Button onClick={calculateRecommendations} className="w-full" size="lg">
                  <Calculator className="h-4 w-4 mr-2" />
                  Get Recommendations
                </Button>

                {recommendations.length > 0 && (
                  <Card className="p-6 bg-primary-50 border-2 border-primary-200">
                    <h3 className="text-lg font-semibold mb-4">Recommended Structures</h3>
                    <div className="space-y-3">
                      {recommendations.map((type, idx) => {
                        const structure = structures.find(s => s.id === type)
                        if (!structure) return null
                        return (
                          <div key={type} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                            <Badge variant="new" className="text-lg px-3 py-1">
                              #{idx + 1}
                            </Badge>
                            <div className="flex-1">
                              <h4 className="font-semibold">{structure.title}</h4>
                              <p className="text-sm text-gray-600">{structure.description}</p>
                            </div>
              <Button
                variant="outline"
                size="sm"
                              onClick={() => {
                                setSelectedStructure(type)
                                setActiveTab('overview')
                              }}
              >
                Learn More
              </Button>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Setup Checklist Tab */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Setup Checklist</h2>
              </div>
              {!selectedStructure ? (
                <div className="text-center py-12 text-gray-400">
                  <Info className="h-16 w-16 mx-auto mb-4" />
                  <p>Select a structure from the Overview tab to see its setup checklist.</p>
                </div>
              ) : currentStructure ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary-500/10 p-2 rounded-lg text-primary-500">
                      {React.createElement(currentStructure.icon, { className: "h-5 w-5" })}
                    </div>
                    <h3 className="text-xl font-semibold">{currentStructure.title} Setup Steps</h3>
                  </div>
                  <div className="space-y-3">
                    {currentStructure.setupSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{step}</p>
                        </div>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
                        />
                      </div>
          ))}
        </div>
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Checklist
                      </Button>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
