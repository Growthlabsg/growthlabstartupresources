'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { Heart, Shield, FileText, Users, Search, Star, ExternalLink, CheckCircle, Stethoscope, Activity, Pill, Microscope, Lock, BarChart, Clipboard, Building2, AlertTriangle, BookOpen, Video, Calculator, Network, Zap, Brain, Smartphone } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: 'tool' | 'guide' | 'template' | 'course'
  link: string
  featured?: boolean
  popular?: boolean
  icon: any
  tags: string[]
  rating?: number
}

const categories = [
  { id: 'all', name: 'All Categories', icon: Heart },
  { id: 'compliance', name: 'Compliance & Regulation', icon: Shield },
  { id: 'clinical', name: 'Clinical Trials', icon: Microscope },
  { id: 'telemedicine', name: 'Telemedicine', icon: Smartphone },
  { id: 'devices', name: 'Medical Devices', icon: Activity },
  { id: 'data', name: 'Health Data & EHR', icon: BarChart },
  { id: 'security', name: 'Security & Privacy', icon: Lock },
  { id: 'integration', name: 'Healthcare APIs', icon: Network },
]

const resources: Resource[] = [
  // Compliance & Regulation
  {
    id: '1',
    title: 'HIPAA Compliance Guide',
    description: 'Navigate HIPAA regulations and ensure compliance for HealthTech startups handling protected health information.',
    category: 'compliance',
    type: 'guide',
    link: '/startup/legal/privacy',
    featured: true,
    popular: true,
    icon: Shield,
    tags: ['HIPAA', 'Compliance', 'PHI', 'Regulation'],
    rating: 4.9
  },
  {
    id: '2',
    title: 'FDA Regulatory Guide',
    description: 'Understand FDA regulations for medical devices, software, and digital health products.',
    category: 'compliance',
    type: 'guide',
    link: '/startup/legal/structure',
    popular: true,
    icon: Shield,
    tags: ['FDA', 'Medical Devices', 'Regulation', '510(k)']
  },
  {
    id: '3',
    title: 'GDPR & Health Data Privacy',
    description: 'Ensure compliance with GDPR and other data protection regulations for health data.',
    category: 'compliance',
    type: 'guide',
    link: '/startup/legal/privacy',
    icon: Lock,
    tags: ['GDPR', 'Data Privacy', 'Health Data', 'Compliance']
  },
  {
    id: '4',
    title: 'Healthcare Licensing Guide',
    description: 'Navigate state and federal licensing requirements for healthcare technology companies.',
    category: 'compliance',
    type: 'guide',
    link: '/startup/legal/structure',
    icon: Building2,
    tags: ['Licensing', 'State Regulations', 'Federal', 'Compliance']
  },
  {
    id: '5',
    title: 'HIPAA Compliance Checklist',
    description: 'Comprehensive checklist to ensure your HealthTech startup meets all HIPAA requirements.',
    category: 'compliance',
    type: 'template',
    link: '/startup/checklist',
    icon: Clipboard,
    tags: ['HIPAA', 'Checklist', 'Compliance', 'Template']
  },
  
  // Clinical Trials
  {
    id: '6',
    title: 'Clinical Trial Resources',
    description: 'Resources for planning, conducting, and managing clinical trials for health technologies.',
    category: 'clinical',
    type: 'guide',
    link: '/startup/legal/structure',
    featured: true,
    popular: true,
    icon: Microscope,
    tags: ['Clinical Trials', 'Research', 'FDA', 'Protocol'],
    rating: 4.7
  },
  {
    id: '7',
    title: 'IRB Submission Guide',
    description: 'Navigate Institutional Review Board (IRB) submission process for clinical research.',
    category: 'clinical',
    type: 'guide',
    link: '/startup/legal/structure',
    icon: Clipboard,
    tags: ['IRB', 'Research Ethics', 'Clinical Research', 'Submission']
  },
  {
    id: '8',
    title: 'Clinical Data Management',
    description: 'Best practices for collecting, storing, and analyzing clinical trial data.',
    category: 'clinical',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: BarChart,
    tags: ['Data Management', 'Clinical Data', 'CDISC', 'Standards']
  },
  
  // Telemedicine
  {
    id: '9',
    title: 'Telemedicine Platform Setup',
    description: 'Build and launch telemedicine platforms for remote patient care and consultations.',
    category: 'telemedicine',
    type: 'tool',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Smartphone,
    tags: ['Telemedicine', 'Telehealth', 'Video Consultations', 'Platform'],
    rating: 4.8
  },
  {
    id: '10',
    title: 'Telemedicine Compliance Guide',
    description: 'Ensure telemedicine platforms comply with state and federal regulations.',
    category: 'telemedicine',
    type: 'guide',
    link: '/startup/legal/privacy',
    popular: true,
    icon: Shield,
    tags: ['Telemedicine', 'Compliance', 'State Regulations', 'Licensing']
  },
  {
    id: '11',
    title: 'Remote Patient Monitoring',
    description: 'Implement remote patient monitoring systems for chronic disease management.',
    category: 'telemedicine',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Activity,
    tags: ['Remote Monitoring', 'IoT', 'Wearables', 'Chronic Care']
  },
  {
    id: '12',
    title: 'Telemedicine Integration Guide',
    description: 'Integrate telemedicine capabilities into existing healthcare systems and EHRs.',
    category: 'telemedicine',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Network,
    tags: ['Integration', 'EHR', 'API', 'Telemedicine']
  },
  
  // Medical Devices
  {
    id: '13',
    title: 'Medical Device Development',
    description: 'Guide to developing FDA-regulated medical devices and software as medical devices (SaMD).',
    category: 'devices',
    type: 'guide',
    link: '/startup/legal/structure',
    featured: true,
    icon: Activity,
    tags: ['Medical Devices', 'FDA', 'SaMD', 'Development'],
    rating: 4.6
  },
  {
    id: '14',
    title: '510(k) Submission Guide',
    description: 'Navigate the FDA 510(k) premarket notification process for medical devices.',
    category: 'devices',
    type: 'guide',
    link: '/startup/legal/structure',
    icon: FileText,
    tags: ['510(k)', 'FDA', 'Medical Devices', 'Submission']
  },
  {
    id: '15',
    title: 'Quality Management System',
    description: 'Implement ISO 13485 quality management systems for medical device companies.',
    category: 'devices',
    type: 'guide',
    link: '/startup/operations-dashboard',
    icon: Shield,
    tags: ['ISO 13485', 'Quality Management', 'Medical Devices', 'QMS']
  },
  
  // Health Data & EHR
  {
    id: '16',
    title: 'EHR Integration Guide',
    description: 'Integrate with Electronic Health Records (EHR) systems like Epic, Cerner, and Allscripts.',
    category: 'data',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: BarChart,
    tags: ['EHR', 'Epic', 'Cerner', 'Integration'],
    rating: 4.7
  },
  {
    id: '17',
    title: 'HL7 & FHIR Standards',
    description: 'Understand and implement HL7 and FHIR standards for healthcare data exchange.',
    category: 'data',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: Network,
    tags: ['HL7', 'FHIR', 'Interoperability', 'Standards']
  },
  {
    id: '18',
    title: 'Health Data Analytics',
    description: 'Build analytics platforms to derive insights from health data while maintaining privacy.',
    category: 'data',
    type: 'tool',
    link: '/startup/marketing/analytics',
    icon: BarChart,
    tags: ['Analytics', 'Health Data', 'Insights', 'Privacy']
  },
  {
    id: '19',
    title: 'Patient Data Management',
    description: 'Design systems for secure patient data collection, storage, and access.',
    category: 'data',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: FileText,
    tags: ['Patient Data', 'Data Management', 'Storage', 'Access']
  },
  
  // Security & Privacy
  {
    id: '20',
    title: 'Patient Privacy & Security',
    description: 'Protect patient data and ensure privacy with comprehensive security measures.',
    category: 'security',
    type: 'guide',
    link: '/startup/legal/privacy',
    featured: true,
    popular: true,
    icon: Lock,
    tags: ['Security', 'Privacy', 'Patient Data', 'Encryption'],
    rating: 4.9
  },
  {
    id: '21',
    title: 'Healthcare Security Best Practices',
    description: 'Implement security best practices specific to healthcare technology environments.',
    category: 'security',
    type: 'guide',
    link: '/startup/legal/privacy',
    popular: true,
    icon: Shield,
    tags: ['Security', 'Best Practices', 'Healthcare', 'Cybersecurity']
  },
  {
    id: '22',
    title: 'Breach Response Plan',
    description: 'Create and implement data breach response plans for healthcare data incidents.',
    category: 'security',
    type: 'template',
    link: '/startup/legal-documents',
    icon: AlertTriangle,
    tags: ['Breach Response', 'Incident Response', 'HIPAA', 'Plan']
  },
  {
    id: '23',
    title: 'Access Control & Authentication',
    description: 'Implement robust access control and authentication for healthcare systems.',
    category: 'security',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Lock,
    tags: ['Access Control', 'Authentication', 'Authorization', 'Security']
  },
  
  // Healthcare APIs
  {
    id: '24',
    title: 'Healthcare API Integration',
    description: 'Integrate with major healthcare APIs including Epic, Cerner, and Apple HealthKit.',
    category: 'integration',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    featured: true,
    popular: true,
    icon: Network,
    tags: ['Healthcare APIs', 'Epic', 'Cerner', 'HealthKit'],
    rating: 4.8
  },
  {
    id: '25',
    title: 'FHIR API Implementation',
    description: 'Implement Fast Healthcare Interoperability Resources (FHIR) APIs for data exchange.',
    category: 'integration',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    popular: true,
    icon: Network,
    tags: ['FHIR', 'API', 'Interoperability', 'Integration']
  },
  {
    id: '26',
    title: 'Apple HealthKit Integration',
    description: 'Integrate Apple HealthKit to access and share health data from iOS devices.',
    category: 'integration',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Smartphone,
    tags: ['HealthKit', 'Apple', 'iOS', 'Health Data']
  },
  {
    id: '27',
    title: 'Google Fit API Guide',
    description: 'Integrate Google Fit API for accessing fitness and health data from Android devices.',
    category: 'integration',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Smartphone,
    tags: ['Google Fit', 'Android', 'Health Data', 'API']
  },
  
  // Additional Resources
  {
    id: '28',
    title: 'Digital Therapeutics Guide',
    description: 'Develop and commercialize digital therapeutics (DTx) for disease treatment.',
    category: 'clinical',
    type: 'guide',
    link: '/startup/legal/structure',
    icon: Pill,
    tags: ['Digital Therapeutics', 'DTx', 'Treatment', 'FDA']
  },
  {
    id: '29',
    title: 'Wearable Health Devices',
    description: 'Build and integrate wearable health monitoring devices and applications.',
    category: 'devices',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Activity,
    tags: ['Wearables', 'IoT', 'Health Monitoring', 'Devices']
  },
  {
    id: '30',
    title: 'Mental Health Tech Resources',
    description: 'Resources for building mental health and wellness technology platforms.',
    category: 'telemedicine',
    type: 'guide',
    link: '/startup/tech/stack-builder',
    icon: Brain,
    tags: ['Mental Health', 'Wellness', 'Therapy', 'Platform']
  },
]

export default function HealthTechResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [savedResources, setSavedResources] = useState<string[]>([])

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesType = selectedType === 'all' || resource.type === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const handleSave = (resourceId: string) => {
    if (savedResources.includes(resourceId)) {
      setSavedResources(savedResources.filter(id => id !== resourceId))
      showToast('Resource removed from saved', 'info')
    } else {
      setSavedResources([...savedResources, resourceId])
      showToast('Resource saved!', 'success')
    }
  }

  const CategoryIcon = categories.find(c => c.id === selectedCategory)?.icon || Heart

  const typeLabels = {
    'tool': 'Tool',
    'guide': 'Guide',
    'template': 'Template',
    'course': 'Course'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              HealthTech Resources
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Specialized resources for healthcare technology startups. From HIPAA compliance to telemedicine, find everything you need to build and scale your HealthTech startup.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">{resources.length}</div>
              <div className="text-sm text-gray-600">Resources</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {resources.filter(r => r.type === 'tool').length}
              </div>
              <div className="text-sm text-gray-600">Tools</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {resources.filter(r => r.type === 'guide').length}
              </div>
              <div className="text-sm text-gray-600">Guides</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {categories.length - 1}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full"
              options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            />
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full"
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'tool', label: 'Tools' },
                { value: 'guide', label: 'Guides' },
                { value: 'template', label: 'Templates' },
                { value: 'course', label: 'Courses' }
              ]}
            />
          </div>
        </Card>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredResources.map((resource) => {
              const Icon = resource.icon
              const isSaved = savedResources.includes(resource.id)
              
              return (
                <Card key={resource.id} className="flex flex-col hover:shadow-lg transition-all">
                  <div className="relative">
                    {resource.featured && (
                      <Badge variant="featured" className="absolute top-2 right-2 z-10">
                        Featured
                      </Badge>
                    )}
                    {resource.popular && (
                      <Badge variant="popular" className="absolute top-2 left-2 z-10">
                        Popular
                      </Badge>
                    )}
                    <div className="bg-primary-500/10 p-4 rounded-lg text-primary-500 mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold flex-1">{resource.title}</h3>
                    <Badge variant="outline" className="text-xs capitalize">
                      {typeLabels[resource.type]}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{resource.description}</p>
                  
                  <div className="mb-4">
                    {resource.rating && (
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{resource.rating}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={resource.link} className="flex-1">
                      <Button className="w-full" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Resource
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave(resource.id)}
                    >
                      {isSaved ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <BookOpen className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        )}

        {/* Saved Resources */}
        {savedResources.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">Saved Resources ({savedResources.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.filter(r => savedResources.includes(r.id)).map((resource) => {
                const Icon = resource.icon
                return (
                  <Card key={resource.id} className="p-4 bg-primary-50 border-primary-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary-500" />
                        <h3 className="font-semibold">{resource.title}</h3>
                      </div>
                      <CheckCircle className="h-5 w-5 text-primary-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <Link href={resource.link}>
                      <Button size="sm" variant="outline" className="w-full">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open Resource
                      </Button>
                    </Link>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick Links Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/startup/legal/privacy">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <Shield className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Compliance Tools</h3>
                <p className="text-sm text-gray-600">HIPAA & regulations</p>
              </Card>
            </Link>
            
            <Link href="/startup/legal/structure">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <FileText className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Legal Resources</h3>
                <p className="text-sm text-gray-600">FDA & licensing</p>
              </Card>
            </Link>
            
            <Link href="/startup/tech/stack-builder">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <Network className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Tech Integration</h3>
                <p className="text-sm text-gray-600">EHR & APIs</p>
              </Card>
            </Link>
            
            <Link href="/startup/marketing/analytics">
              <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
                <BarChart className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Health Analytics</h3>
                <p className="text-sm text-gray-600">Data & insights</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Additional Resources Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <Video className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">HealthTech Video Tutorials</h3>
              <p className="text-sm text-gray-600 mb-4">Watch step-by-step tutorials for HIPAA compliance, EHR integration, and more</p>
              <Link href="/startup/technical-skills">
                <Button variant="outline" size="sm" className="w-full">
                  Watch Videos
                </Button>
              </Link>
            </Card>
            
            <Card className="p-6">
              <FileText className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Healthcare Templates</h3>
              <p className="text-sm text-gray-600 mb-4">Download compliance checklists, policy templates, and regulatory documents</p>
              <Link href="/startup/legal-documents">
                <Button variant="outline" size="sm" className="w-full">
                  Browse Templates
                </Button>
              </Link>
            </Card>
            
            <Card className="p-6">
              <Calculator className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Healthcare Calculators</h3>
              <p className="text-sm text-gray-600 mb-4">Calculate ROI, patient acquisition costs, and regulatory compliance metrics</p>
              <Link href="/startup/financial-projections">
                <Button variant="outline" size="sm" className="w-full">
                  Use Calculators
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
