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
  Trophy, Star, BookOpen, Clock, Building2, Sparkles, CheckCircle,
  Play, ChevronRight, FileText, MessageCircle, Award, Lightbulb,
  Zap, Heart, ArrowLeft, Globe, Mail
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const curriculum = [
  { week: '1-2', title: 'Foundation & Validation', topics: ['Problem Discovery', 'Customer Interviews', 'Market Research', 'Competitive Analysis'], color: 'bg-blue-500' },
  { week: '3-4', title: 'Product Strategy', topics: ['MVP Definition', 'Product Roadmap', 'User Stories', 'Technical Planning'], color: 'bg-green-500' },
  { week: '5-6', title: 'MVP Development', topics: ['Rapid Prototyping', 'Development Sprints', 'User Testing', 'Iteration'], color: 'bg-yellow-500' },
  { week: '7-8', title: 'Go-to-Market', topics: ['Marketing Strategy', 'Launch Planning', 'Early Traction', 'Growth Tactics'], color: 'bg-orange-500' },
  { week: '9-10', title: 'Fundraising Prep', topics: ['Pitch Deck Design', 'Financial Modeling', 'Valuation Basics', 'Investor Research'], color: 'bg-red-500' },
  { week: '11-12', title: 'Demo Day & Beyond', topics: ['Pitch Practice', 'Investor Meetings', 'Demo Day', 'Next Steps'], color: 'bg-purple-500' },
]

const mentors = [
  { name: 'Sarah Chen', role: 'Ex-Google Product Lead', expertise: 'Product Strategy', image: 'SC' },
  { name: 'Michael Torres', role: 'Serial Entrepreneur (3 exits)', expertise: 'Fundraising', image: 'MT' },
  { name: 'Emily Park', role: 'Partner at Sequoia', expertise: 'Investment', image: 'EP' },
  { name: 'David Kim', role: 'CTO, Stripe', expertise: 'Technical', image: 'DK' },
  { name: 'Lisa Johnson', role: 'CMO, Airbnb', expertise: 'Growth', image: 'LJ' },
  { name: 'James Wright', role: 'Founder, Y Combinator', expertise: 'Startups', image: 'JW' },
]

const alumni = [
  { name: 'DataFlow', raised: '$5M', status: 'Series A', industry: 'SaaS' },
  { name: 'HealthBot', raised: '$3M', status: 'Seed', industry: 'HealthTech' },
  { name: 'EduPath', raised: '$2M', status: 'Seed', industry: 'EdTech' },
  { name: 'FinTrack', raised: '$4M', status: 'Series A', industry: 'FinTech' },
]

const faqs = [
  { q: 'What stage should my startup be at?', a: 'We accept startups from idea stage to early prototype. You should have a clear problem you are solving and initial validation of the concept.' },
  { q: 'Do I need a technical co-founder?', a: 'Not required, but highly recommended. If you do not have one, you should demonstrate ability to build or have resources to hire developers.' },
  { q: 'How much equity do you take?', a: 'We take 5-7% equity in exchange for $50K-$150K funding, 12 weeks of intensive mentorship, and lifetime access to our network.' },
  { q: 'Is the program remote or in-person?', a: 'The program is hybrid. Key sessions and Demo Day are in-person in San Francisco, with weekly sessions available remotely.' },
  { q: 'What is the acceptance rate?', a: 'We accept approximately 3% of applicants. We review applications holistically, focusing on team, idea, and potential.' },
]

export default function PreSeedAcceleratorPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [applicationData, setApplicationData] = useState({
    founderName: '', email: '', company: '', problem: '', solution: '', stage: '', fundingNeeded: ''
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
    localStorage.setItem('preSeedApplication', JSON.stringify({ ...applicationData, submitted: new Date().toISOString() }))
    showToast('Application submitted successfully!', 'success')
    setApplicationData({ founderName: '', email: '', company: '', problem: '', solution: '', stage: '', fundingNeeded: '' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/accelerator" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Programs
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500 p-3 rounded-xl text-white"><Rocket className="h-8 w-8" /></div>
            <div>
              <Badge variant="new" className="mb-1">Pre-Seed</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold gradient-text">Pre-Seed Accelerator</h1>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            From Idea to MVP in 12 Weeks. Join our flagship program designed for first-time founders ready to validate ideas and secure initial funding.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ label: 'Funding', value: '$50K-$150K', icon: DollarSign }, { label: 'Duration', value: '12 Weeks', icon: Clock }, { label: 'Equity', value: '5-7%', icon: Target }, { label: 'Cohort Size', value: '15 Startups', icon: Users }].map((s, i) => (
            <Card key={i} className="p-4 text-center bg-emerald-50">
              <s.icon className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
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
                  {['$50K-$150K seed funding', '12-week intensive program', 'Weekly 1:1 mentorship', 'Access to 50+ industry experts', 'San Francisco co-working space', 'Legal & accounting support ($25K value)', 'Demo Day with 100+ investors', 'Lifetime alumni network'].map((b, i) => (
                    <li key={i} className="flex items-start gap-2"><Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" /><span>{b}</span></li>
                  ))}
                </ul>
              </Card>

              <Card>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="h-6 w-6 text-blue-600" />Requirements</h3>
                <ul className="space-y-3">
                  {['Innovative product or service idea', 'Committed full-time founder(s)', 'Technical capability or tech co-founder', 'Clear problem-solution fit', 'Coachable mindset', 'Available for 12-week program', 'Open to relocating to SF (hybrid)', 'Ready to commit 100%'].map((r, i) => (
                    <li key={i} className="flex items-start gap-2"><ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" /><span>{r}</span></li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to Build Something Great?</h3>
                  <p className="opacity-90">Applications for Spring 2025 cohort close January 15, 2025</p>
                </div>
                <Button variant="outline" className="bg-white text-emerald-600 hover:bg-gray-100" onClick={() => setActiveTab('apply')}>
                  Apply Now <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold mb-4">Success Stories</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {alumni.map((a, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold mx-auto mb-3">{a.name.charAt(0)}</div>
                    <h4 className="font-semibold">{a.name}</h4>
                    <p className="text-sm text-gray-600">{a.industry}</p>
                    <p className="text-sm font-medium text-green-600">{a.raised}</p>
                    <Badge variant="outline" className="text-xs mt-1">{a.status}</Badge>
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
              <h3 className="text-xl font-bold mb-6">12-Week Curriculum</h3>
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

            <Card className="bg-emerald-50">
              <h4 className="font-semibold mb-3">Program Format</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg"><h5 className="font-medium mb-1">Weekly Sessions</h5><p className="text-sm text-gray-600">2-hour workshops every Tuesday and Thursday</p></div>
                <div className="p-4 bg-white rounded-lg"><h5 className="font-medium mb-1">1:1 Mentorship</h5><p className="text-sm text-gray-600">Weekly 1-hour sessions with your lead mentor</p></div>
                <div className="p-4 bg-white rounded-lg"><h5 className="font-medium mb-1">Office Hours</h5><p className="text-sm text-gray-600">Drop-in sessions with expert advisors</p></div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'mentors' && (
          <Card>
            <h3 className="text-xl font-bold mb-6">Meet Your Mentors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((m, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">{m.image}</div>
                    <div>
                      <h4 className="font-semibold">{m.name}</h4>
                      <p className="text-sm text-gray-600">{m.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{m.expertise}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg text-center">
              <p className="text-gray-600">Plus <strong>44+ additional mentors</strong> from Google, Meta, Stripe, and top VC firms</p>
            </div>
          </Card>
        )}

        {activeTab === 'apply' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold mb-2">Apply to Pre-Seed Accelerator</h3>
              <p className="text-gray-600 mb-6">Spring 2025 Cohort • Application deadline: January 15, 2025</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-2">Founder Name *</label><Input value={applicationData.founderName} onChange={(e) => setApplicationData({ ...applicationData, founderName: e.target.value })} placeholder="Your full name" /></div>
                  <div><label className="block text-sm font-medium mb-2">Email *</label><Input type="email" value={applicationData.email} onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })} placeholder="you@email.com" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-2">Company Name *</label><Input value={applicationData.company} onChange={(e) => setApplicationData({ ...applicationData, company: e.target.value })} placeholder="Your startup name" /></div>
                <div><label className="block text-sm font-medium mb-2">Problem You Are Solving</label><textarea className="w-full p-3 border-2 border-gray-300 rounded-lg" rows={3} value={applicationData.problem} onChange={(e) => setApplicationData({ ...applicationData, problem: e.target.value })} placeholder="Describe the problem..." /></div>
                <div><label className="block text-sm font-medium mb-2">Your Solution</label><textarea className="w-full p-3 border-2 border-gray-300 rounded-lg" rows={3} value={applicationData.solution} onChange={(e) => setApplicationData({ ...applicationData, solution: e.target.value })} placeholder="Describe your solution..." /></div>
                <Button onClick={handleApply} className="w-full" size="lg">Submit Application <ArrowRight className="h-4 w-4 ml-2" /></Button>
              </div>
            </Card>

            <Card className="bg-gray-50">
              <h4 className="font-semibold mb-3">What Happens Next?</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[{ step: 1, title: 'Submit', desc: 'Complete application' }, { step: 2, title: 'Review', desc: '2-week review period' }, { step: 3, title: 'Interview', desc: 'Video call with team' }, { step: 4, title: 'Decision', desc: 'Final answer in 1 week' }].map(s => (
                  <div key={s.step} className="text-center">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">{s.step}</div>
                    <h5 className="font-medium">{s.title}</h5>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
