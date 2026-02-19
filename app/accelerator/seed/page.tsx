'use client'

import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import SimpleTabs from '@/components/ui/SimpleTabs'
import Link from 'next/link'
import { 
  Rocket, Check, ArrowRight, Users, DollarSign, Calendar, Target,
  Trophy, BookOpen, Clock, Building2, CheckCircle, ChevronRight, 
  FileText, ArrowLeft, TrendingUp, BarChart3, Briefcase, Globe, Zap
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const curriculum = [
  { week: '1-2', title: 'Growth Foundation', topics: ['Metrics Deep Dive', 'Unit Economics', 'Growth Frameworks', 'Customer Segmentation'], color: 'bg-blue-500' },
  { week: '3-4', title: 'Product-Market Fit', topics: ['PMF Assessment', 'User Research', 'Product Optimization', 'Retention Strategies'], color: 'bg-indigo-500' },
  { week: '5-6', title: 'Go-to-Market Strategy', topics: ['Channel Strategy', 'Sales Process', 'Marketing Automation', 'Partnership Development'], color: 'bg-purple-500' },
  { week: '7-8', title: 'Scaling Operations', topics: ['Team Building', 'Process Design', 'Tool Stack', 'Culture Development'], color: 'bg-pink-500' },
  { week: '9-10', title: 'Advanced Growth', topics: ['International Expansion', 'Enterprise Sales', 'Strategic Partnerships', 'M&A Prep'], color: 'bg-red-500' },
  { week: '11-12', title: 'Series A Prep', topics: ['Investor Targeting', 'Due Diligence Prep', 'Pitch Refinement', 'Term Sheet Negotiation'], color: 'bg-orange-500' },
  { week: '13-14', title: 'Investor Relations', topics: ['VC Meetings', 'Data Room Prep', 'Legal Review', 'Reference Building'], color: 'bg-yellow-500' },
  { week: '15-16', title: 'Close & Scale', topics: ['Deal Closing', 'Post-Funding Planning', 'Board Formation', 'Next Stage Roadmap'], color: 'bg-green-500' },
]

const mentors = [
  { name: 'Alex Rivera', role: 'Ex-VP Growth, Uber', expertise: 'Growth Strategy', image: 'AR' },
  { name: 'Jennifer Wu', role: 'Partner, a16z', expertise: 'Series A Investment', image: 'JW' },
  { name: 'Robert Chen', role: 'COO, Notion', expertise: 'Operations', image: 'RC' },
  { name: 'Maria Santos', role: 'CMO, Figma', expertise: 'Marketing', image: 'MS' },
  { name: 'Kevin Park', role: 'CRO, Datadog', expertise: 'Enterprise Sales', image: 'KP' },
  { name: 'Amanda Foster', role: 'CFO, Stripe', expertise: 'Finance & Fundraising', image: 'AF' },
]

const alumni = [
  { name: 'CloudScale', raised: '$25M', status: 'Series A', industry: 'Enterprise SaaS', growth: '10x ARR' },
  { name: 'PayFlow', raised: '$18M', status: 'Series A', industry: 'FinTech', growth: '15x users' },
  { name: 'HealthAI', raised: '$22M', status: 'Series A', industry: 'HealthTech', growth: '8x revenue' },
  { name: 'LearnPath', raised: '$12M', status: 'Series A', industry: 'EdTech', growth: '20x DAU' },
]

const faqs = [
  { q: 'What traction do I need?', a: 'We look for startups with live products and meaningful traction - typically $10K+ MRR, 1000+ active users, or strong engagement metrics.' },
  { q: 'How is this different from Pre-Seed?', a: 'The Seed program focuses on scaling existing traction, preparing for Series A, and building sustainable growth engines rather than initial validation.' },
  { q: 'What does the funding include?', a: 'We invest $250K-$500K for 6-8% equity. This includes direct investment plus extensive services and network access.' },
  { q: 'Can international startups apply?', a: 'Yes! We welcome international startups. About 30% of our cohort is international. Some in-person attendance in SF is required.' },
]

export default function SeedAcceleratorPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [applicationData, setApplicationData] = useState({
    founderName: '', email: '', company: '', website: '', mrr: '', users: '', raised: '', seeking: ''
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum', icon: Calendar },
    { id: 'mentors', label: 'Mentors', icon: Users },
    { id: 'apply', label: 'Apply', icon: FileText },
  ]

  const handleApply = () => {
    if (!applicationData.founderName || !applicationData.email || !applicationData.company) {
      showToast('Please fill in all required fields', 'error')
      return
    }
    localStorage.setItem('seedApplication', JSON.stringify({ ...applicationData, submitted: new Date().toISOString() }))
    showToast('Application submitted successfully!', 'success')
    setApplicationData({ founderName: '', email: '', company: '', website: '', mrr: '', users: '', raised: '', seeking: '' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/accelerator" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Programs
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-xl text-white"><TrendingUp className="h-8 w-8" /></div>
            <div>
              <Badge variant="featured" className="mb-1">Seed</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text">Seed Accelerator</h1>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Scale from MVP to Product-Market Fit. 16-week intensive program for seed-stage startups ready for Series A.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ label: 'Funding', value: '$250K-$500K', icon: DollarSign }, { label: 'Duration', value: '16 Weeks', icon: Clock }, { label: 'Equity', value: '6-8%', icon: Target }, { label: 'Cohort Size', value: '12 Startups', icon: Users }].map((s, i) => (
            <Card key={i} className="p-4 text-center bg-blue-50">
              <s.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm text-gray-600">{s.label}</div>
            </Card>
          ))}
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="h-6 w-6 text-green-600" />What You Get</h3>
                <ul className="space-y-3">
                  {['$250K-$500K direct investment', '16-week growth-focused program', 'Series A preparation package', 'Executive 1:1 coaching', 'Growth marketing support ($50K value)', 'Technical architecture review', 'Introductions to 50+ top VCs', 'Board advisor placement'].map((b, i) => (
                    <li key={i} className="flex items-start gap-2"><Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" /><span>{b}</span></li>
                  ))}
                </ul>
              </Card>

              <Card>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="h-6 w-6 text-blue-600" />Requirements</h3>
                <ul className="space-y-3">
                  {['Live product with paying customers', '$10K+ MRR or 1000+ active users', 'Full-time founding team (2+ people)', 'Clear growth strategy', 'Scalable business model', 'Ready for Series A in 12-18 months', 'Committed to 16-week program', 'Some travel to SF required'].map((r, i) => (
                    <li key={i} className="flex items-start gap-2"><ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" /><span>{r}</span></li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card>
              <h3 className="text-xl font-bold mb-4">Program Outcomes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{ label: 'Avg Series A Raised', value: '$15M' }, { label: 'Success Rate', value: '85%' }, { label: 'Avg Time to Series A', value: '8 months' }, { label: 'Total Alumni Raised', value: '$350M+' }].map((o, i) => (
                  <div key={i} className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{o.value}</div>
                    <div className="text-sm text-gray-600">{o.label}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to Scale?</h3>
                  <p className="opacity-90">Applications for Summer 2025 cohort close March 30, 2025</p>
                </div>
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => setActiveTab('apply')}>
                  Apply Now <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold mb-4">Recent Alumni Success</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {alumni.map((a, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold mb-3">{a.name.charAt(0)}</div>
                    <h4 className="font-semibold">{a.name}</h4>
                    <p className="text-sm text-gray-600">{a.industry}</p>
                    <p className="text-sm font-medium text-green-600">{a.raised}</p>
                    <p className="text-xs text-blue-600">{a.growth}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="border rounded-lg">
                    <button className="w-full p-4 text-left flex items-center justify-between" onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}>
                      <span className="font-medium">{faq.q}</span>
                      <ChevronRight className={`h-5 w-5 transition-transform ${expandedFaq === i ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedFaq === i && <div className="px-4 pb-4 text-gray-600">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold mb-6">16-Week Curriculum</h3>
              <div className="space-y-4">
                {curriculum.map((week, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`${week.color} text-white rounded-lg p-4 w-24 text-center shrink-0`}>
                      <div className="text-xs opacity-80">Week</div>
                      <div className="text-xl font-bold">{week.week}</div>
                    </div>
                    <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">{week.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        {week.topics.map((topic, j) => <Badge key={j} variant="outline">{topic}</Badge>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'mentors' && (
          <Card>
            <h3 className="text-xl font-bold mb-6">Expert Mentors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((m, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">{m.image}</div>
                    <div>
                      <h4 className="font-semibold">{m.name}</h4>
                      <p className="text-sm text-gray-600">{m.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{m.expertise}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'apply' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold mb-2">Apply to Seed Accelerator</h3>
              <p className="text-gray-600 mb-6">Summer 2025 Cohort • Application deadline: March 30, 2025</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-2">Founder Name *</label><Input value={applicationData.founderName} onChange={(e) => setApplicationData({ ...applicationData, founderName: e.target.value })} placeholder="Your full name" /></div>
                  <div><label className="block text-sm font-medium mb-2">Email *</label><Input type="email" value={applicationData.email} onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })} placeholder="you@email.com" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-2">Company Name *</label><Input value={applicationData.company} onChange={(e) => setApplicationData({ ...applicationData, company: e.target.value })} placeholder="Your startup name" /></div>
                  <div><label className="block text-sm font-medium mb-2">Website</label><Input value={applicationData.website} onChange={(e) => setApplicationData({ ...applicationData, website: e.target.value })} placeholder="https://..." /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-2">Current MRR</label><Input value={applicationData.mrr} onChange={(e) => setApplicationData({ ...applicationData, mrr: e.target.value })} placeholder="$10,000" /></div>
                  <div><label className="block text-sm font-medium mb-2">Active Users</label><Input value={applicationData.users} onChange={(e) => setApplicationData({ ...applicationData, users: e.target.value })} placeholder="1,000" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-2">Previously Raised</label><Input value={applicationData.raised} onChange={(e) => setApplicationData({ ...applicationData, raised: e.target.value })} placeholder="$500,000" /></div>
                  <div><label className="block text-sm font-medium mb-2">Amount Seeking</label><Input value={applicationData.seeking} onChange={(e) => setApplicationData({ ...applicationData, seeking: e.target.value })} placeholder="$300,000" /></div>
                </div>
                <Button onClick={handleApply} className="w-full" size="lg">Submit Application <ArrowRight className="h-4 w-4 ml-2" /></Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
