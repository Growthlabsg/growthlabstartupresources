'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { 
  ArrowLeft, ArrowRight, Check, Briefcase, Star, Users,
  DollarSign, Clock, Globe, Shield, Award, Zap, Heart,
  CheckCircle, Upload, Plus, X, Calendar, Video, MessageCircle,
  TrendingUp, Scale, Code, Megaphone, Palette, GraduationCap,
  Building2, FileText, Sparkles
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface ExpertiseArea {
  id: string
  name: string
  icon: any
  subcategories: string[]
}

const expertiseAreas: ExpertiseArea[] = [
  {
    id: 'legal',
    name: 'Legal Services',
    icon: Scale,
    subcategories: ['Corporate Law', 'IP Protection', 'Contracts', 'Employment Law', 'Compliance', 'Fundraising Legal'],
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    icon: TrendingUp,
    subcategories: ['Financial Planning', 'Tax Strategy', 'Bookkeeping', 'Fundraising', 'Valuation', 'Financial Modeling'],
  },
  {
    id: 'marketing',
    name: 'Marketing & Growth',
    icon: Megaphone,
    subcategories: ['Growth Hacking', 'Content Marketing', 'SEO', 'Paid Ads', 'Brand Strategy', 'Social Media'],
  },
  {
    id: 'tech',
    name: 'Technology',
    icon: Code,
    subcategories: ['Architecture', 'AI/ML', 'Cloud Infrastructure', 'Security', 'Product Development', 'DevOps'],
  },
  {
    id: 'design',
    name: 'Design & UX',
    icon: Palette,
    subcategories: ['Product Design', 'UX Research', 'Brand Design', 'Design Systems', 'Prototyping', 'User Testing'],
  },
  {
    id: 'hr',
    name: 'HR & Recruiting',
    icon: Users,
    subcategories: ['Hiring', 'Culture Building', 'Compensation', 'Performance Management', 'Training', 'Employee Relations'],
  },
  {
    id: 'strategy',
    name: 'Business Strategy',
    icon: Building2,
    subcategories: ['Business Planning', 'Market Entry', 'Competitive Analysis', 'Pivoting', 'Scaling', 'Exit Strategy'],
  },
  {
    id: 'mentorship',
    name: 'Founder Mentorship',
    icon: Heart,
    subcategories: ['First-time Founders', 'Leadership', 'Fundraising', 'Team Building', 'Work-Life Balance', 'Networking'],
  },
]

const benefits = [
  { icon: DollarSign, title: 'Set Your Own Rates', description: 'You decide your hourly rate and project pricing' },
  { icon: Clock, title: 'Flexible Schedule', description: 'Work when you want, from wherever you want' },
  { icon: Users, title: 'Quality Clients', description: 'Connect with vetted, funded startups' },
  { icon: Shield, title: 'Secure Payments', description: 'Get paid on time, every time through our platform' },
  { icon: Star, title: 'Build Your Reputation', description: 'Collect reviews and grow your expert profile' },
  { icon: Zap, title: 'Zero Platform Fee', description: 'No fees for your first 3 months' },
]

const steps = [
  { number: 1, title: 'Apply', description: 'Submit your application with your expertise and experience' },
  { number: 2, title: 'Verification', description: 'Our team reviews your credentials and background' },
  { number: 3, title: 'Onboarding', description: 'Complete your profile and set your availability' },
  { number: 4, title: 'Start Helping', description: 'Connect with startups and start making an impact' },
]

export default function ExpertRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedIn: '',
    website: '',
    
    // Step 2: Expertise
    primaryExpertise: '',
    subcategories: [] as string[],
    yearsExperience: '',
    headline: '',
    bio: '',
    
    // Step 3: Experience
    currentRole: '',
    company: '',
    previousCompanies: '',
    education: '',
    certifications: '',
    
    // Step 4: Services
    hourlyRate: '',
    projectRate: '',
    availability: '',
    preferredContact: '',
    languages: [] as string[],
    timezone: '',
    
    // Step 5: Portfolio
    portfolioLinks: [] as string[],
    testimonials: '',
    
    // Agreement
    agreeTerms: false,
    agreeBackground: false,
  })

  const [newPortfolioLink, setNewPortfolioLink] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubcategoryToggle = (subcategory: string) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.includes(subcategory)
        ? prev.subcategories.filter(s => s !== subcategory)
        : [...prev.subcategories, subcategory]
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }))
  }

  const addPortfolioLink = () => {
    if (newPortfolioLink.trim()) {
      setFormData(prev => ({
        ...prev,
        portfolioLinks: [...prev.portfolioLinks, newPortfolioLink.trim()]
      }))
      setNewPortfolioLink('')
    }
  }

  const removePortfolioLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = () => {
    showToast('Application submitted successfully! We\'ll review and get back to you within 48 hours.', 'success')
    // In production, this would submit to the platform API
  }

  const selectedExpertise = expertiseAreas.find(e => e.id === formData.primaryExpertise)

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Basic Information</h3>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="Smith"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile *</label>
              <input
                type="url"
                value={formData.linkedIn}
                onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Your Expertise</h3>
              <p className="text-gray-600">Select your primary area of expertise and specializations</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Primary Expertise Area *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {expertiseAreas.map(area => {
                  const Icon = area.icon
                  const isSelected = formData.primaryExpertise === area.id
                  return (
                    <button
                      key={area.id}
                      onClick={() => handleInputChange('primaryExpertise', area.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-primary-500' : 'text-gray-500'}`} />
                      <div className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                        {area.name}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {selectedExpertise && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Specializations (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {selectedExpertise.subcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => handleSubcategoryToggle(sub)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.subcategories.includes(sub)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formData.subcategories.includes(sub) && <Check className="h-4 w-4 inline mr-1" />}
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
              <select
                value={formData.yearsExperience}
                onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              >
                <option value="">Select experience level</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10-15">10-15 years</option>
                <option value="15+">15+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline *</label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => handleInputChange('headline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                placeholder="e.g., Startup Lawyer | 15+ Years Helping Founders"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.headline.length}/100 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio *</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                placeholder="Tell startups about your background, expertise, and how you can help them..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Professional Experience</h3>
              <p className="text-gray-600">Share your work history and credentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Role *</label>
                <input
                  type="text"
                  value={formData.currentRole}
                  onChange={(e) => handleInputChange('currentRole', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="e.g., Partner, Fractional CFO, Consultant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company/Firm *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="e.g., Smith & Associates, Independent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous Notable Companies</label>
              <textarea
                value={formData.previousCompanies}
                onChange={(e) => handleInputChange('previousCompanies', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                placeholder="e.g., Google, Goldman Sachs, YC-backed startups..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <textarea
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                placeholder="e.g., MBA from Harvard Business School, JD from Stanford Law..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certifications & Licenses</label>
              <textarea
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                placeholder="e.g., CPA, Bar Admission (CA, NY), PMP..."
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Services & Availability</h3>
              <p className="text-gray-600">Set your rates and working preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                    placeholder="200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Rate (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.projectRate}
                    onChange={(e) => handleInputChange('projectRate', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                    placeholder="Starting from..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Availability *</label>
              <select
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              >
                <option value="">Select availability</option>
                <option value="5-10">5-10 hours/week</option>
                <option value="10-20">10-20 hours/week</option>
                <option value="20-30">20-30 hours/week</option>
                <option value="30+">30+ hours/week (Full-time)</option>
                <option value="project">Project-based only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone *</label>
              <select
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              >
                <option value="">Select timezone</option>
                <option value="PST">Pacific Time (PST/PDT)</option>
                <option value="MST">Mountain Time (MST/MDT)</option>
                <option value="CST">Central Time (CST/CDT)</option>
                <option value="EST">Eastern Time (EST/EDT)</option>
                <option value="GMT">GMT/UTC</option>
                <option value="CET">Central European Time (CET)</option>
                <option value="IST">India Standard Time (IST)</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Languages</label>
              <div className="flex flex-wrap gap-2">
                {['English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi', 'Portuguese', 'Japanese'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.languages.includes(lang)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formData.languages.includes(lang) && <Check className="h-4 w-4 inline mr-1" />}
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
              <select
                value={formData.preferredContact}
                onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              >
                <option value="">Select preference</option>
                <option value="platform">Platform Messages</option>
                <option value="email">Email</option>
                <option value="video">Video Call</option>
                <option value="phone">Phone</option>
              </select>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Portfolio & Testimonials</h3>
              <p className="text-gray-600">Share your work and client feedback</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Links</label>
              <div className="space-y-2 mb-3">
                {formData.portfolioLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="flex-1 text-sm truncate">{link}</span>
                    <button onClick={() => removePortfolioLink(idx)} className="text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newPortfolioLink}
                  onChange={(e) => setNewPortfolioLink(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="https://example.com/case-study"
                />
                <Button variant="outline" onClick={addPortfolioLink}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Add links to case studies, articles, or portfolio pieces</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Testimonials</label>
              <textarea
                value={formData.testimonials}
                onChange={(e) => handleInputChange('testimonials', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                placeholder="Paste any testimonials or recommendations from past clients..."
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium mb-4">Agreements</h4>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link> *
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeBackground}
                    onChange={(e) => handleInputChange('agreeBackground', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    I consent to a background verification check to become a verified expert *
                  </span>
                </label>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center text-primary-100 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="h-8 w-8" />
            <Badge className="bg-white/20 text-white border-0">Expert Network</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Become a GrowthLab Expert</h1>
          <p className="text-primary-100 max-w-2xl text-lg">
            Join our network of verified professionals and help startups succeed. 
            Set your own rates, work flexibly, and make a real impact.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 md:p-8">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <button
                      onClick={() => setCurrentStep(step)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                        currentStep === step
                          ? 'bg-primary-500 text-white'
                          : currentStep > step
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {currentStep > step ? <Check className="h-5 w-5" /> : step}
                    </button>
                    {step < 5 && (
                      <div className={`hidden sm:block w-16 md:w-24 h-1 ${
                        currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Labels */}
              <div className="hidden sm:flex justify-between mb-8 text-xs text-gray-500">
                <span>Basic Info</span>
                <span>Expertise</span>
                <span>Experience</span>
                <span>Services</span>
                <span>Portfolio</span>
              </div>

              {/* Form Content */}
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                {currentStep < 5 ? (
                  <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={!formData.agreeTerms || !formData.agreeBackground}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Application
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits Card */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-500" />
                Expert Benefits
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon
                  return (
                    <div key={idx} className="flex gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg h-fit">
                        <Icon className="h-4 w-4 text-primary-500" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{benefit.title}</div>
                        <div className="text-xs text-gray-500">{benefit.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* How It Works */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">How It Works</h3>
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                      {step.number}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6 bg-gradient-to-br from-primary-500 to-indigo-600 text-white">
              <h3 className="font-bold mb-4">Expert Network Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">150+</div>
                  <div className="text-sm text-primary-100">Active Experts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">$2M+</div>
                  <div className="text-sm text-primary-100">Paid to Experts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">12K+</div>
                  <div className="text-sm text-primary-100">Startups Helped</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">4.9</div>
                  <div className="text-sm text-primary-100">Avg Rating</div>
                </div>
              </div>
            </Card>

            {/* Need Help */}
            <Card className="p-6">
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about becoming an expert? We're here to help.
              </p>
              <Button variant="outline" className="w-full" onClick={() => showToast('Opening support chat...', 'info')}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

