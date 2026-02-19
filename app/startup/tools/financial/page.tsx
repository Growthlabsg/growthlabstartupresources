'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import Link from 'next/link'
import { 
  DollarSign, CreditCard, Building2, FileText, Calculator, TrendingUp,
  Star, Heart, ExternalLink, Check, Zap, ArrowLeft, Search, BarChart3,
  PieChart, Receipt, Wallet, Shield, Globe, Clock
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface FinancialTool {
  id: string
  name: string
  description: string
  subcategory: string
  pricing: string
  priceRange?: string
  rating: number
  reviews: number
  features: string[]
  bestFor: string[]
  website: string
  logo: string
  startupDiscount?: string
  integrations: string[]
  pros: string[]
  cons: string[]
}

const subcategories = [
  { id: 'accounting', label: 'Accounting', icon: Calculator },
  { id: 'banking', label: 'Banking', icon: Building2 },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'invoicing', label: 'Invoicing', icon: Receipt },
  { id: 'expense', label: 'Expense Management', icon: Wallet },
  { id: 'tax', label: 'Tax & Compliance', icon: FileText },
]

const tools: FinancialTool[] = [
  {
    id: 'quickbooks', name: 'QuickBooks Online', description: 'All-in-one accounting software for small businesses with invoicing, expense tracking, and payroll.',
    subcategory: 'accounting', pricing: 'paid', priceRange: '$25-$180/mo', rating: 4.5, reviews: 12500,
    features: ['Invoicing', 'Expense Tracking', 'Payroll', 'Tax Prep', 'Bank Sync', 'Financial Reports', 'Multi-Currency', '1099 Tracking'],
    bestFor: ['Small businesses', 'Freelancers', 'Accountants'], website: 'quickbooks.com', logo: 'QB',
    startupDiscount: '50% off first 3 months', integrations: ['Stripe', 'PayPal', 'Square', 'Shopify', 'Gusto'],
    pros: ['Industry standard', 'Extensive integrations', 'Mobile app', 'Payroll included'], cons: ['Can be expensive', 'Learning curve', 'Customer support varies']
  },
  {
    id: 'xero', name: 'Xero', description: 'Cloud accounting software with beautiful interface and powerful bank reconciliation features.',
    subcategory: 'accounting', pricing: 'paid', priceRange: '$13-$70/mo', rating: 4.4, reviews: 8900,
    features: ['Bank Reconciliation', 'Invoicing', 'Inventory', 'Projects', 'Payroll', 'Multi-Currency', 'Purchase Orders'],
    bestFor: ['Small businesses', 'Accountants', 'International companies'], website: 'xero.com', logo: 'XO',
    integrations: ['Stripe', 'HubSpot', 'Shopify', 'Gusto', 'Square'],
    pros: ['Great UI', 'Unlimited users', 'Bank feeds', 'Good for international'], cons: ['Payroll costs extra', 'Limited reports on basic plan']
  },
  {
    id: 'freshbooks', name: 'FreshBooks', description: 'Invoicing and accounting software built for service-based businesses and freelancers.',
    subcategory: 'invoicing', pricing: 'paid', priceRange: '$17-$55/mo', rating: 4.5, reviews: 6800,
    features: ['Invoicing', 'Time Tracking', 'Expense Tracking', 'Projects', 'Estimates', 'Client Portal', 'Payments'],
    bestFor: ['Freelancers', 'Consultants', 'Service businesses'], website: 'freshbooks.com', logo: 'FB',
    startupDiscount: '60% off for 6 months', integrations: ['Stripe', 'PayPal', 'Gusto', 'Mailchimp'],
    pros: ['Beautiful invoices', 'Easy to use', 'Client portal', 'Time tracking'], cons: ['Limited for inventory', 'Fewer integrations']
  },
  {
    id: 'stripe', name: 'Stripe', description: 'The gold standard for online payment processing with powerful APIs and global coverage.',
    subcategory: 'payments', pricing: 'paid', priceRange: '2.9% + 30¢', rating: 4.8, reviews: 25000,
    features: ['Payment Processing', 'Subscriptions', 'Invoicing', 'Fraud Prevention', 'Global Payments', 'Connect', 'Billing', 'Terminal'],
    bestFor: ['SaaS', 'E-commerce', 'Marketplaces', 'Tech startups'], website: 'stripe.com', logo: 'ST',
    integrations: ['Everything - 600+ integrations'],
    pros: ['Best-in-class API', 'Global reach', 'Excellent docs', 'Fraud protection'], cons: ['Higher rates for some', 'Account holds possible']
  },
  {
    id: 'mercury', name: 'Mercury', description: 'Modern banking for startups with no fees, virtual cards, and founder-friendly features.',
    subcategory: 'banking', pricing: 'free', rating: 4.7, reviews: 3500,
    features: ['No Fees', 'Virtual Cards', 'Team Cards', 'Treasury', 'API Access', 'International Wires', 'FDIC Insured', 'Bill Pay'],
    bestFor: ['Tech startups', 'VC-backed companies', 'Remote teams'], website: 'mercury.com', logo: 'MC',
    startupDiscount: 'Free for startups', integrations: ['QuickBooks', 'Xero', 'Ramp', 'Brex'],
    pros: ['No fees', 'Modern UI', 'Great for startups', 'Virtual cards'], cons: ['Newer company', 'No physical branches']
  },
  {
    id: 'brex', name: 'Brex', description: 'Corporate cards and spend management platform designed for startups and scale-ups.',
    subcategory: 'expense', pricing: 'freemium', priceRange: 'Free-$12/user', rating: 4.6, reviews: 4200,
    features: ['Corporate Cards', 'Expense Management', 'Rewards', 'Bill Pay', 'Travel', 'Budgets', 'Reimbursements', 'Integrations'],
    bestFor: ['Funded startups', 'Fast-growing companies'], website: 'brex.com', logo: 'BX',
    integrations: ['NetSuite', 'QuickBooks', 'Xero', 'Slack', 'Navan'],
    pros: ['No personal guarantee', 'High limits', 'Great rewards', 'Real-time tracking'], cons: ['Requires funding', 'Best for larger teams']
  },
  {
    id: 'ramp', name: 'Ramp', description: 'Corporate cards with built-in savings and spend management that automatically finds you savings.',
    subcategory: 'expense', pricing: 'free', rating: 4.8, reviews: 2800,
    features: ['Corporate Cards', 'Expense Management', 'Bill Pay', 'Vendor Negotiations', 'Budgets', 'Analytics', 'Integrations'],
    bestFor: ['Growing startups', 'Cost-conscious teams'], website: 'ramp.com', logo: 'RP',
    startupDiscount: 'Free forever', integrations: ['QuickBooks', 'Xero', 'NetSuite', 'Sage'],
    pros: ['Free forever', 'Finds savings automatically', 'Easy to use', 'Great support'], cons: ['Requires revenue', 'US only']
  },
  {
    id: 'bill', name: 'Bill.com', description: 'Accounts payable and receivable automation for streamlined business payments.',
    subcategory: 'invoicing', pricing: 'paid', priceRange: '$45-$79/mo', rating: 4.3, reviews: 5600,
    features: ['AP Automation', 'AR Automation', 'Approvals', 'Sync', 'International Payments', 'Virtual Cards', 'ACH'],
    bestFor: ['Growing businesses', 'Finance teams'], website: 'bill.com', logo: 'BL',
    integrations: ['QuickBooks', 'Xero', 'NetSuite', 'Sage'],
    pros: ['Great automation', 'Approval workflows', 'Saves time'], cons: ['Pricey for small teams', 'Per-user pricing']
  },
  {
    id: 'bench', name: 'Bench', description: 'Bookkeeping service with real human bookkeepers and easy-to-understand financial reports.',
    subcategory: 'accounting', pricing: 'paid', priceRange: '$249-$449/mo', rating: 4.6, reviews: 3200,
    features: ['Bookkeeping', 'Financial Statements', 'Tax-Ready Books', 'Dedicated Bookkeeper', 'Year-End Support', 'Catch-Up'],
    bestFor: ['Small businesses', 'Busy founders', 'Tax prep'], website: 'bench.co', logo: 'BN',
    integrations: ['Bank accounts', 'Credit cards'],
    pros: ['Human bookkeepers', 'Easy to use', 'Tax-ready books'], cons: ['More expensive', 'Less control']
  },
  {
    id: 'pilot', name: 'Pilot', description: 'Expert bookkeeping, tax, and CFO services for startups backed by world-class VCs.',
    subcategory: 'accounting', pricing: 'paid', priceRange: '$599+/mo', rating: 4.5, reviews: 1800,
    features: ['Bookkeeping', 'Tax Prep', 'CFO Services', 'R&D Tax Credits', 'Financial Modeling', 'Board Deck Prep'],
    bestFor: ['Funded startups', 'VC-backed companies'], website: 'pilot.com', logo: 'PT',
    startupDiscount: 'Discounts for early-stage', integrations: ['QuickBooks', 'Bill.com', 'Stripe', 'Brex'],
    pros: ['Startup-focused', 'Expert team', 'CFO services'], cons: ['Premium pricing', 'Better for funded companies']
  },
  {
    id: 'wise', name: 'Wise Business', description: 'International business account with multi-currency support and low-cost transfers.',
    subcategory: 'banking', pricing: 'freemium', priceRange: 'Free + transfer fees', rating: 4.7, reviews: 9500,
    features: ['Multi-Currency Account', 'Cheap Transfers', 'Business Debit Card', 'Batch Payments', 'API', 'Invoicing'],
    bestFor: ['International businesses', 'Remote teams', 'Freelancers'], website: 'wise.com', logo: 'WS',
    integrations: ['Xero', 'QuickBooks', 'Zapier'],
    pros: ['Best FX rates', 'Multi-currency', 'Transparent fees', 'Fast transfers'], cons: ['Not a full bank', 'Limited in some countries']
  },
  {
    id: 'gusto', name: 'Gusto', description: 'All-in-one payroll, benefits, and HR platform that makes running payroll easy.',
    subcategory: 'tax', pricing: 'paid', priceRange: '$40+/mo + $6/person', rating: 4.6, reviews: 8500,
    features: ['Payroll', 'Benefits', 'HR', 'Time Tracking', 'Hiring', 'Tax Filing', 'PTO Management', 'Compliance'],
    bestFor: ['Small businesses', 'Startups', 'Growing teams'], website: 'gusto.com', logo: 'GT',
    integrations: ['QuickBooks', 'Xero', 'Slack', 'Lattice'],
    pros: ['Easy payroll', 'Benefits included', 'Good support', 'Modern UI'], cons: ['Can get expensive', 'US only']
  },
]

export default function FinancialToolsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubcategory, setFilterSubcategory] = useState<string>('all')
  const [filterPricing, setFilterPricing] = useState<string>('all')
  const [savedTools, setSavedTools] = useState<string[]>([])
  const [selectedTool, setSelectedTool] = useState<FinancialTool | null>(null)

  const tabs = [
    { id: 'all', label: 'All Tools', icon: DollarSign },
    { id: 'saved', label: 'Saved', icon: Heart },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('savedFinancialTools')
    if (saved) setSavedTools(JSON.parse(saved))
  }, [])

  const toggleSave = (id: string) => {
    const updated = savedTools.includes(id) ? savedTools.filter(t => t !== id) : [...savedTools, id]
    setSavedTools(updated)
    localStorage.setItem('savedFinancialTools', JSON.stringify(updated))
    showToast(savedTools.includes(id) ? 'Removed' : 'Saved!', 'success')
  }

  const filteredTools = tools.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubcategory = filterSubcategory === 'all' || t.subcategory === filterSubcategory
    const matchesPricing = filterPricing === 'all' || t.pricing === filterPricing
    const matchesTab = activeTab === 'all' || (activeTab === 'saved' && savedTools.includes(t.id))
    return matchesSearch && matchesSubcategory && matchesPricing && matchesTab
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/startup/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Tools
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-3 rounded-xl text-white"><DollarSign className="h-8 w-8" /></div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text">Financial Tools</h1>
              <p className="text-gray-600">Accounting, banking, payments, and expense management</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {subcategories.map(sub => {
            const Icon = sub.icon
            const count = tools.filter(t => t.subcategory === sub.id).length
            return (
              <button key={sub.id} onClick={() => setFilterSubcategory(filterSubcategory === sub.id ? 'all' : sub.id)}
                className={`p-3 rounded-lg text-center transition-all ${filterSubcategory === sub.id ? 'bg-green-500 text-white' : 'bg-white border hover:border-green-300'}`}>
                <Icon className={`h-5 w-5 mx-auto mb-1 ${filterSubcategory === sub.id ? 'text-white' : 'text-green-600'}`} />
                <div className="text-xs font-medium">{sub.label}</div>
                <div className="text-xs opacity-70">{count} tools</div>
              </button>
            )
          })}
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tools..." className="w-64" />
          <Select value={filterPricing} onChange={(e) => setFilterPricing(e.target.value)}
            options={[{ value: 'all', label: 'All Pricing' }, { value: 'free', label: 'Free' }, { value: 'freemium', label: 'Freemium' }, { value: 'paid', label: 'Paid' }]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => (
            <Card key={tool.id} className="p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedTool(tool)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center font-bold text-green-700">{tool.logo}</div>
                  <div>
                    <h3 className="font-semibold">{tool.name}</h3>
                    <span className="text-sm text-gray-500">{subcategories.find(s => s.id === tool.subcategory)?.label}</span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleSave(tool.id) }} className="text-gray-400 hover:text-red-500">
                  {savedTools.includes(tool.id) ? <Heart className="h-5 w-5 fill-current text-red-500" /> : <Heart className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tool.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={tool.pricing === 'free' ? 'new' : tool.pricing === 'freemium' ? 'featured' : 'outline'}>{tool.pricing}</Badge>
                {tool.priceRange && <span className="text-sm text-gray-500">{tool.priceRange}</span>}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-medium">{tool.rating}</span>
                <span className="text-gray-400">({tool.reviews.toLocaleString()})</span>
              </div>
              {tool.startupDiscount && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg text-sm text-green-700">
                  <Zap className="h-4 w-4 inline mr-1" />{tool.startupDiscount}
                </div>
              )}
            </Card>
          ))}
        </div>

        {selectedTool && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedTool(null)}>
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center font-bold text-green-700 text-xl">{selectedTool.logo}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTool.name}</h2>
                    <Badge variant="outline">{subcategories.find(s => s.id === selectedTool.subcategory)?.label}</Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedTool(null)}>✕</Button>
              </div>
              <p className="text-gray-600 mb-4">{selectedTool.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Pricing</div>
                  <div className="font-semibold">{selectedTool.priceRange || selectedTool.pricing}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Rating</div>
                  <div className="font-semibold">⭐ {selectedTool.rating}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Reviews</div>
                  <div className="font-semibold">{selectedTool.reviews.toLocaleString()}</div>
                </div>
              </div>

              {selectedTool.startupDiscount && (
                <div className="p-3 bg-green-50 rounded-lg mb-4">
                  <Zap className="h-4 w-4 inline text-green-600 mr-2" />
                  <span className="text-green-700 font-medium">Startup Discount: {selectedTool.startupDiscount}</span>
                </div>
              )}

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTool.features.map((f, i) => <Badge key={i} variant="outline">{f}</Badge>)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">Pros</h4>
                  <ul className="space-y-1">{selectedTool.pros.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-green-600 mt-0.5" />{p}</li>)}</ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600">Cons</h4>
                  <ul className="space-y-1">{selectedTool.cons.map((c, i) => <li key={i} className="flex items-start gap-2 text-sm"><span className="text-orange-600">•</span>{c}</li>)}</ul>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Best For</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTool.bestFor.map((b, i) => <Badge key={i} className="bg-blue-100 text-blue-700">{b}</Badge>)}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Integrations</h4>
                <p className="text-sm text-gray-600">{selectedTool.integrations.join(', ')}</p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => window.open(`https://${selectedTool.website}`, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" /> Visit Website
                </Button>
                <Button variant="outline" onClick={() => toggleSave(selectedTool.id)}>
                  <Heart className={`h-4 w-4 mr-2 ${savedTools.includes(selectedTool.id) ? 'fill-current text-red-500' : ''}`} />
                  {savedTools.includes(selectedTool.id) ? 'Saved' : 'Save'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
