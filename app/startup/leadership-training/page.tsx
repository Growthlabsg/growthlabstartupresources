'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { Users, Target, MessageSquare, Search, Star, Clock, PlayCircle, Award, CheckCircle, TrendingUp, Brain, Shield, Zap, BookOpen, Video, FileText, Users2, Briefcase, Lightbulb, BarChart, Heart } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface Program {
  id: string
  title: string
  description: string
  category: string
  duration: string
  modules: number
  level: 'beginner' | 'intermediate' | 'advanced'
  instructor: string
  rating: number
  participants: number
  price: number
  free: boolean
  featured?: boolean
  popular?: boolean
  icon: any
  skills: string[]
  format: 'self-paced' | 'cohort' | 'workshop'
}

const categories = [
  { id: 'all', name: 'All Programs', icon: Users },
  { id: 'team-building', name: 'Team Building', icon: Users2 },
  { id: 'decision-making', name: 'Decision Making', icon: Brain },
  { id: 'communication', name: 'Communication', icon: MessageSquare },
  { id: 'strategy', name: 'Strategic Leadership', icon: Target },
  { id: 'executive', name: 'Executive Skills', icon: Briefcase },
  { id: 'coaching', name: 'Coaching & Mentoring', icon: Heart },
]

const programs: Program[] = [
  // Team Building
  {
    id: '1',
    title: 'Building High-Performance Teams',
    description: 'Learn to recruit, build, and manage teams that drive startup success.',
    category: 'team-building',
    duration: '6 weeks',
    modules: 12,
    level: 'intermediate',
    instructor: 'Sarah Chen',
    rating: 4.9,
    participants: 1850,
    price: 299,
    free: false,
    featured: true,
    popular: true,
    icon: Users2,
    skills: ['Recruitment', 'Team Dynamics', 'Performance Management'],
    format: 'self-paced'
  },
  {
    id: '2',
    title: 'Remote Team Leadership',
    description: 'Master the art of leading distributed teams effectively.',
    category: 'team-building',
    duration: '4 weeks',
    modules: 8,
    level: 'intermediate',
    instructor: 'Mike Johnson',
    rating: 4.8,
    participants: 1420,
    price: 249,
    free: false,
    popular: true,
    icon: Users2,
    skills: ['Remote Management', 'Virtual Collaboration', 'Team Culture'],
    format: 'cohort'
  },
  {
    id: '3',
    title: 'Team Culture & Values',
    description: 'Create and maintain a strong organizational culture that attracts top talent.',
    category: 'team-building',
    duration: '3 weeks',
    modules: 6,
    level: 'beginner',
    instructor: 'Emily Davis',
    rating: 4.7,
    participants: 2100,
    price: 0,
    free: true,
    featured: true,
    icon: Heart,
    skills: ['Culture Design', 'Values Alignment', 'Employee Engagement'],
    format: 'self-paced'
  },
  
  // Decision Making
  {
    id: '4',
    title: 'Strategic Decision Making',
    description: 'Make better decisions under pressure with data-driven frameworks.',
    category: 'decision-making',
    duration: '5 weeks',
    modules: 10,
    level: 'intermediate',
    instructor: 'David Kim',
    rating: 4.9,
    participants: 1650,
    price: 299,
    free: false,
    featured: true,
    popular: true,
    icon: Brain,
    skills: ['Decision Frameworks', 'Risk Analysis', 'Data-Driven Decisions'],
    format: 'self-paced'
  },
  {
    id: '5',
    title: 'Crisis Leadership & Decision Making',
    description: 'Navigate crises and make critical decisions when stakes are high.',
    category: 'decision-making',
    duration: '4 weeks',
    modules: 8,
    level: 'advanced',
    instructor: 'Lisa Wang',
    rating: 4.8,
    participants: 980,
    price: 349,
    free: false,
    icon: Shield,
    skills: ['Crisis Management', 'Rapid Decision Making', 'Stakeholder Communication'],
    format: 'workshop'
  },
  {
    id: '6',
    title: 'Decision Making Fundamentals',
    description: 'Learn the basics of effective decision making for startup leaders.',
    category: 'decision-making',
    duration: '2 weeks',
    modules: 4,
    level: 'beginner',
    instructor: 'Robert Brown',
    rating: 4.6,
    participants: 3200,
    price: 0,
    free: true,
    popular: true,
    icon: Brain,
    skills: ['Problem Solving', 'Critical Thinking', 'Analysis'],
    format: 'self-paced'
  },
  
  // Communication
  {
    id: '7',
    title: 'Executive Communication',
    description: 'Master communication skills for board meetings, investor pitches, and team alignment.',
    category: 'communication',
    duration: '5 weeks',
    modules: 10,
    level: 'intermediate',
    instructor: 'James Taylor',
    rating: 4.8,
    participants: 1280,
    price: 299,
    free: false,
    featured: true,
    icon: MessageSquare,
    skills: ['Public Speaking', 'Board Presentations', 'Stakeholder Communication'],
    format: 'cohort'
  },
  {
    id: '8',
    title: 'Difficult Conversations',
    description: 'Handle challenging conversations with confidence and empathy.',
    category: 'communication',
    duration: '3 weeks',
    modules: 6,
    level: 'intermediate',
    instructor: 'Sophie Anderson',
    rating: 4.7,
    participants: 1750,
    price: 199,
    free: false,
    popular: true,
    icon: MessageSquare,
    skills: ['Conflict Resolution', 'Feedback Delivery', 'Empathy'],
    format: 'self-paced'
  },
  {
    id: '9',
    title: 'Communication Essentials',
    description: 'Build foundational communication skills for effective leadership.',
    category: 'communication',
    duration: '2 weeks',
    modules: 4,
    level: 'beginner',
    instructor: 'Alex Rodriguez',
    rating: 4.5,
    participants: 2800,
    price: 0,
    free: true,
    icon: MessageSquare,
    skills: ['Active Listening', 'Clear Messaging', 'Non-verbal Communication'],
    format: 'self-paced'
  },
  
  // Strategic Leadership
  {
    id: '10',
    title: 'Strategic Leadership Masterclass',
    description: 'Develop strategic thinking and execution capabilities for long-term success.',
    category: 'strategy',
    duration: '8 weeks',
    modules: 16,
    level: 'advanced',
    instructor: 'Tom Wilson',
    rating: 4.9,
    participants: 950,
    price: 499,
    free: false,
    featured: true,
    icon: Target,
    skills: ['Strategic Planning', 'Vision Setting', 'Execution'],
    format: 'cohort'
  },
  {
    id: '11',
    title: 'Vision & Mission Development',
    description: 'Create compelling vision and mission statements that inspire your team.',
    category: 'strategy',
    duration: '3 weeks',
    modules: 6,
    level: 'beginner',
    instructor: 'Jessica Park',
    rating: 4.6,
    participants: 1950,
    price: 0,
    free: true,
    icon: Target,
    skills: ['Vision Crafting', 'Mission Alignment', 'Purpose-Driven Leadership'],
    format: 'self-paced'
  },
  
  // Executive Skills
  {
    id: '12',
    title: 'Founder Leadership Program',
    description: 'Comprehensive leadership development program for startup founders.',
    category: 'executive',
    duration: '10 weeks',
    modules: 20,
    level: 'advanced',
    instructor: 'Chris Lee',
    rating: 4.9,
    participants: 1200,
    price: 599,
    free: false,
    featured: true,
    popular: true,
    icon: Briefcase,
    skills: ['Executive Presence', 'Board Relations', 'Strategic Thinking'],
    format: 'cohort'
  },
  {
    id: '13',
    title: 'Time Management for Leaders',
    description: 'Master time management and productivity as a startup leader.',
    category: 'executive',
    duration: '3 weeks',
    modules: 6,
    level: 'beginner',
    instructor: 'Maria Garcia',
    rating: 4.7,
    participants: 2400,
    price: 149,
    free: false,
    popular: true,
    icon: Zap,
    skills: ['Prioritization', 'Delegation', 'Productivity Systems'],
    format: 'self-paced'
  },
  {
    id: '14',
    title: 'Executive Presence',
    description: 'Develop the confidence and presence needed to lead effectively.',
    category: 'executive',
    duration: '4 weeks',
    modules: 8,
    level: 'intermediate',
    instructor: 'Rachel Green',
    rating: 4.8,
    participants: 1100,
    price: 299,
    free: false,
    icon: Briefcase,
    skills: ['Confidence Building', 'Personal Brand', 'Influence'],
    format: 'workshop'
  },
  
  // Coaching & Mentoring
  {
    id: '15',
    title: 'Coaching Skills for Leaders',
    description: 'Learn to coach and develop your team members effectively.',
    category: 'coaching',
    duration: '5 weeks',
    modules: 10,
    level: 'intermediate',
    instructor: 'Emma White',
    rating: 4.8,
    participants: 1350,
    price: 299,
    free: false,
    featured: true,
    icon: Heart,
    skills: ['Coaching Techniques', 'Performance Development', 'Feedback'],
    format: 'cohort'
  },
  {
    id: '16',
    title: 'Mentoring Best Practices',
    description: 'Become an effective mentor and develop future leaders.',
    category: 'coaching',
    duration: '3 weeks',
    modules: 6,
    level: 'beginner',
    instructor: 'Michael Chang',
    rating: 4.6,
    participants: 1650,
    price: 0,
    free: true,
    icon: Heart,
    skills: ['Mentorship', 'Leadership Development', 'Knowledge Transfer'],
    format: 'self-paced'
  },
]

export default function LeadershipTrainingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedFormat, setSelectedFormat] = useState('all')
  const [enrolledPrograms, setEnrolledPrograms] = useState<string[]>([])

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel
    const matchesFormat = selectedFormat === 'all' || program.format === selectedFormat
    
    return matchesSearch && matchesCategory && matchesLevel && matchesFormat
  })

  const handleEnroll = (programId: string) => {
    if (enrolledPrograms.includes(programId)) {
      showToast('You are already enrolled in this program', 'info')
      return
    }
    setEnrolledPrograms([...enrolledPrograms, programId])
    const program = programs.find(p => p.id === programId)
    showToast(`Successfully enrolled in ${program?.title}!`, 'success')
  }

  const CategoryIcon = categories.find(c => c.id === selectedCategory)?.icon || Users

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
            Leadership Training
          </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mb-6">
            Develop essential leadership skills for startup founders and team leaders. Learn from industry experts and transform your leadership capabilities.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">{programs.length}</div>
              <div className="text-sm text-gray-600">Programs</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {programs.reduce((sum, p) => sum + p.modules, 0)}+
              </div>
              <div className="text-sm text-gray-600">Modules</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {programs.reduce((sum, p) => sum + p.participants, 0).toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">Participants</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {programs.filter(p => p.free).length}
              </div>
              <div className="text-sm text-gray-600">Free Programs</div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programs..."
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
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full"
              options={[
                { value: 'all', label: 'All Levels' },
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' }
              ]}
            />
            <Select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full"
              options={[
                { value: 'all', label: 'All Formats' },
                { value: 'self-paced', label: 'Self-Paced' },
                { value: 'cohort', label: 'Cohort-Based' },
                { value: 'workshop', label: 'Workshop' }
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

        {/* Programs Grid */}
        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPrograms.map((program) => {
              const Icon = program.icon
              const isEnrolled = enrolledPrograms.includes(program.id)
              
              return (
                <Card key={program.id} className="flex flex-col hover:shadow-lg transition-all">
                  <div className="relative">
                    {program.featured && (
                      <Badge variant="featured" className="absolute top-2 right-2 z-10">
                        Featured
                      </Badge>
                    )}
                    {program.popular && (
                      <Badge variant="popular" className="absolute top-2 left-2 z-10">
                        Popular
                      </Badge>
                    )}
                    <div className="bg-primary-500/10 p-4 rounded-lg text-primary-500 mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold flex-1">{program.title}</h3>
                    <Badge variant={program.level as any}>{program.level}</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{program.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{program.rating}</span>
                      <span className="text-xs text-gray-500">({program.participants.toLocaleString()} participants)</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">Instructor: {program.instructor}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {program.format.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {program.skills.slice(0, 2).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {program.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {program.modules} modules
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold">
                      {program.free ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        <span>${program.price}</span>
                      )}
                    </div>
                    {isEnrolled && (
                      <Badge variant="beginner" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enrolled
                      </Badge>
                    )}
                  </div>
                  
                  <Button
                    className="w-full"
                    variant={isEnrolled ? 'outline' : 'primary'}
                    onClick={() => handleEnroll(program.id)}
                  >
                    {isEnrolled ? (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        {program.free ? 'Enroll Free' : 'Enroll Now'}
                      </>
                    )}
                  </Button>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No programs found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        )}

        {/* Leadership Paths Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Recommended Leadership Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-8 w-8 text-primary-500" />
                <h3 className="text-xl font-semibold">Founder Leadership Path</h3>
              </div>
              <p className="text-gray-600 mb-4">From first-time founder to confident CEO - A complete leadership journey</p>
              <div className="space-y-2 mb-4">
                {programs.filter(p => ['6', '9', '4', '7', '12'].includes(p.id)).map(program => (
                  <div key={program.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{program.title}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                Start Leadership Path
              </Button>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-primary-500" />
                <h3 className="text-xl font-semibold">Team Leadership Mastery</h3>
              </div>
              <p className="text-gray-600 mb-4">Build and lead high-performing teams that drive results</p>
              <div className="space-y-2 mb-4">
                {programs.filter(p => ['1', '2', '3', '15'].includes(p.id)).map(program => (
                  <div key={program.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{program.title}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                Start Leadership Path
              </Button>
            </Card>
          </div>
        </div>

        {/* Resources Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <Video className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Video Library</h3>
              <p className="text-sm text-gray-600 mb-4">Access 100+ leadership videos and case studies</p>
              <Button variant="outline" size="sm" className="w-full">
                Browse Videos
              </Button>
            </Card>
            
            <Card className="p-6">
              <FileText className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Leadership Templates</h3>
              <p className="text-sm text-gray-600 mb-4">Download ready-to-use leadership frameworks and tools</p>
              <Button variant="outline" size="sm" className="w-full">
                View Templates
              </Button>
            </Card>
            
            <Card className="p-6">
              <BarChart className="h-8 w-8 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Leadership Assessment</h3>
              <p className="text-sm text-gray-600 mb-4">Evaluate your leadership skills and get personalized recommendations</p>
              <Button variant="outline" size="sm" className="w-full">
                Take Assessment
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
