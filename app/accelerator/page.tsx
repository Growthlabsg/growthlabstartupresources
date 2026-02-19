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
  Rocket, Check, ArrowRight, Users, DollarSign, Calendar, Target,
  Trophy, Star, BookOpen, Clock, Building2, Sparkles, TrendingUp, 
  Award, Briefcase, Globe, Heart, CheckCircle, Search, BarChart3, 
  Zap, Play, ChevronRight, FileText
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AcceleratorProgram {
  id: string
  name: string
  stage: string
  tagline: string
  description: string
  funding: string
  equityRange: string
  duration: string
  cohortSize: number
  nextCohort: string
  applicationDeadline: string
  benefits: string[]
  requirements: string[]
  mentors: number
  alumni: number
  successRate: number
  avgValuation: string
  href: string
  color: string
  bgColor: string
}

const programs: AcceleratorProgram[] = [
  {
    id: 'pre-seed', name: 'Pre-Seed Accelerator', stage: 'pre-seed',
    tagline: 'From Idea to MVP in 12 Weeks',
    description: 'Our flagship pre-seed program helps first-time founders validate their ideas, build MVPs, and secure initial funding.',
    funding: '$50K - $150K', equityRange: '5-7%', duration: '12 weeks', cohortSize: 15,
    nextCohort: 'Spring 2025', applicationDeadline: 'January 15, 2025',
    benefits: ['$50K-$150K seed funding', '12-week intensive program', 'Weekly mentorship', 'Access to 100+ experts', 'Co-working space', 'Legal & accounting support', 'Demo Day access', 'Lifetime alumni network'],
    requirements: ['Innovative product idea', 'Full-time founder(s)', 'Technical capability', 'Clear problem-solution fit', 'Coachable mindset'],
    mentors: 50, alumni: 200, successRate: 78, avgValuation: '$2.5M',
    href: '/accelerator/pre-seed', color: 'text-emerald-600', bgColor: 'bg-emerald-50'
  },
  {
    id: 'seed', name: 'Seed Accelerator', stage: 'seed',
    tagline: 'Scale from MVP to Product-Market Fit',
    description: 'For seed-stage startups with initial traction looking to accelerate growth and prepare for Series A funding.',
    funding: '$250K - $500K', equityRange: '6-8%', duration: '16 weeks', cohortSize: 12,
    nextCohort: 'Summer 2025', applicationDeadline: 'March 30, 2025',
    benefits: ['$250K-$500K funding', '16-week growth program', 'Series A preparation', 'Growth marketing support', 'Technical reviews', 'Investor introductions', 'Executive coaching', 'Enterprise sales'],
    requirements: ['Live product with users', 'Some revenue or engagement', 'Full-time team', 'Clear growth strategy', 'Scalable model'],
    mentors: 75, alumni: 150, successRate: 85, avgValuation: '$8M',
    href: '/accelerator/seed', color: 'text-blue-600', bgColor: 'bg-blue-50'
  },
  {
    id: 'scale', name: 'Scale Accelerator', stage: 'scale',
    tagline: 'Go Global, Go Big',
    description: 'Elite program for high-growth startups ready to scale internationally with $1M+ funding opportunities.',
    funding: '$1M - $5M', equityRange: '4-6%', duration: '24 weeks', cohortSize: 8,
    nextCohort: 'Fall 2025', applicationDeadline: 'June 15, 2025',
    benefits: ['$1M-$5M funding', '24-week elite program', 'C-level mentorship', 'Global expansion', 'Enterprise training', 'Board advisory', 'Series B/C prep', 'International access'],
    requirements: ['$1M+ ARR', 'Product-market fit', 'Strong team', 'Path to profitability', 'International potential'],
    mentors: 40, alumni: 60, successRate: 92, avgValuation: '$50M',
    href: '/accelerator/scale', color: 'text-purple-600', bgColor: 'bg-purple-50'
  }
]

const alumniCompanies = [
  { id: '1', name: 'TechFlow', industry: 'SaaS', program: 'Seed', funding: '$15M Series A', valuation: '$75M', employees: 85 },
  { id: '2', name: 'HealthSync', industry: 'HealthTech', program: 'Pre-Seed', funding: '$8M Series A', valuation: '$40M', employees: 45 },
  { id: '3', name: 'FinEdge', industry: 'FinTech', program: 'Scale', funding: '$50M Series B', valuation: '$250M', employees: 200 },
  { id: '4', name: 'EduLearn', industry: 'EdTech', program: 'Seed', funding: '$5M Seed', valuation: '$25M', employees: 30 },
  { id: '5', name: 'GreenTech', industry: 'CleanTech', program: 'Scale', funding: '$30M Series B', valuation: '$120M', employees: 150 },
  { id: '6', name: 'DataPulse', industry: 'Enterprise', program: 'Pre-Seed', funding: '$2M Seed', valuation: '$10M', employees: 15 },
]

export default function AcceleratorHubPage() {
  const [activeTab, setActiveTab] = useState('programs')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedPrograms, setSavedPrograms] = useState<string[]>([])

  const tabs = [
    { id: 'programs', label: 'Programs', icon: Rocket },
    { id: 'alumni', label: 'Alumni', icon: Trophy },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
    { id: 'apply', label: 'Apply', icon: Play },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('acceleratorSaved')
    if (saved) setSavedPrograms(JSON.parse(saved))
  }, [])

  const toggleSave = (id: string) => {
    const updated = savedPrograms.includes(id) ? savedPrograms.filter(p => p !== id) : [...savedPrograms, id]
    setSavedPrograms(updated)
    localStorage.setItem('acceleratorSaved', JSON.stringify(updated))
    showToast(savedPrograms.includes(id) ? 'Removed' : 'Saved!', 'success')
  }

  const filteredAlumni = alumniCompanies.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const comparisonData = programs.map(p => ({ name: p.stage, successRate: p.successRate, avgVal: parseInt(p.avgValuation.replace(/\D/g, '')) }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
                Accelerator Programs
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your startup with world-class accelerator programs. From idea to IPO.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[{ label: 'Total Funding', value: '$500M+', icon: DollarSign }, { label: 'Alumni', value: '400+', icon: Building2 }, { label: 'Success Rate', value: '85%', icon: Trophy }, { label: 'Mentors', value: '165+', icon: Users }].map((s, i) => (
              <div key={i} className="p-4 bg-white rounded-xl shadow-sm border">
                <s.icon className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-sm text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === 'programs' && (
          <div className="space-y-8">
            {programs.map((p) => (
              <Card key={p.id} className={`overflow-hidden ${savedPrograms.includes(p.id) ? 'border-2 border-primary-300' : ''}`}>
                <div className={`${p.bgColor} p-6`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={p.stage === 'pre-seed' ? 'new' : p.stage === 'seed' ? 'featured' : 'popular'}>{p.stage}</Badge>
                        <h2 className="text-2xl font-bold">{p.name}</h2>
                      </div>
                      <p className={`text-lg ${p.color} font-medium`}>{p.tagline}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleSave(p.id)}>
                        <Heart className={`h-4 w-4 ${savedPrograms.includes(p.id) ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                      <Link href={p.href}><Button size="sm">Learn More <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{p.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[{ l: 'Funding', v: p.funding }, { l: 'Duration', v: p.duration }, { l: 'Equity', v: p.equityRange }, { l: 'Cohort', v: `${p.cohortSize} startups` }].map((h, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg text-center">
                        <div className="text-sm text-gray-500">{h.l}</div>
                        <div className="font-bold">{h.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" />Benefits</h4>
                      <ul className="space-y-2">{p.benefits.slice(0, 4).map((b, i) => <li key={i} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-green-600 mt-0.5" />{b}</li>)}</ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2"><Target className="h-5 w-5 text-blue-600" />Requirements</h4>
                      <ul className="space-y-2">{p.requirements.slice(0, 4).map((r, i) => <li key={i} className="flex items-start gap-2 text-sm"><ChevronRight className="h-4 w-4 text-blue-600 mt-0.5" />{r}</li>)}</ul>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-6 text-sm text-gray-600">
                      <span><Users className="h-4 w-4 inline" /> {p.mentors} Mentors</span>
                      <span><Building2 className="h-4 w-4 inline" /> {p.alumni} Alumni</span>
                      <span><Trophy className="h-4 w-4 inline" /> {p.successRate}% Success</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Next:</span> <span className="font-semibold">{p.nextCohort}</span>
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="text-orange-600">Deadline: {p.applicationDeadline}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'alumni' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Alumni Companies</h2>
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAlumni.map(c => (
                <Card key={c.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">{c.name.charAt(0)}</div>
                    <Badge variant="outline">{c.industry}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{c.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Program</span><span className="font-medium">{c.program}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Funding</span><span className="font-medium text-green-600">{c.funding}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Valuation</span><span className="font-medium">{c.valuation}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Team</span><span className="font-medium">{c.employees}</span></div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'compare' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Program Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left p-3">Feature</th>{programs.map(p => <th key={p.id} className="text-left p-3">{p.name}</th>)}</tr></thead>
                  <tbody>
                    <tr className="border-b"><td className="p-3 font-medium">Funding</td>{programs.map(p => <td key={p.id} className="p-3">{p.funding}</td>)}</tr>
                    <tr className="border-b"><td className="p-3 font-medium">Equity</td>{programs.map(p => <td key={p.id} className="p-3">{p.equityRange}</td>)}</tr>
                    <tr className="border-b"><td className="p-3 font-medium">Duration</td>{programs.map(p => <td key={p.id} className="p-3">{p.duration}</td>)}</tr>
                    <tr className="border-b"><td className="p-3 font-medium">Cohort Size</td>{programs.map(p => <td key={p.id} className="p-3">{p.cohortSize}</td>)}</tr>
                    <tr className="border-b"><td className="p-3 font-medium">Success Rate</td>{programs.map(p => <td key={p.id} className="p-3 text-green-600 font-medium">{p.successRate}%</td>)}</tr>
                    <tr><td className="p-3 font-medium">Avg Valuation</td>{programs.map(p => <td key={p.id} className="p-3">{p.avgValuation}</td>)}</tr>
                  </tbody>
                </table>
              </div>
            </Card>
            <Card>
              <h3 className="font-semibold mb-4">Success Rate Comparison</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={comparisonData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis domain={[0, 100]} /><Tooltip /><Bar dataKey="successRate" fill="#10b981" name="Success %" /></BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {activeTab === 'apply' && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Application Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[{ step: 1, title: 'Submit Application', desc: 'Online application with pitch deck' }, { step: 2, title: 'Initial Review', desc: '2-week review period' }, { step: 3, title: 'Interview', desc: 'Video interview with directors' }, { step: 4, title: 'Decision', desc: 'Final decision in 1 week' }].map(s => (
                  <div key={s.step} className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">{s.step}</div>
                    <h4 className="font-semibold mb-1">{s.title}</h4>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programs.map(p => (
                <Card key={p.id} className={`${p.bgColor}`}>
                  <div className="flex items-center gap-3 mb-4"><Rocket className={`h-6 w-6 ${p.color}`} /><h3 className="font-semibold">{p.name}</h3></div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Deadline</span><span className="font-medium text-orange-600">{p.applicationDeadline}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Next Cohort</span><span className="font-medium">{p.nextCohort}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Spots</span><span className="font-medium">{p.cohortSize}</span></div>
                  </div>
                  <Link href={p.href}><Button className="w-full">Apply Now <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

