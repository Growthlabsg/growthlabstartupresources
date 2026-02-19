'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { Sparkles, Briefcase, Copy, Save, Users, Lightbulb, DollarSign, MapPin } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface JobDescription {
  id: string
  title: string
  content: string
  department: string
  createdAt: string
}

export default function JobDescriptionsPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [employmentType, setEmploymentType] = useState<'full-time' | 'part-time' | 'contract' | 'internship'>('full-time')
  const [location, setLocation] = useState('')
  const [salaryRange, setSalaryRange] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [preferredSkills, setPreferredSkills] = useState('')
  const [experience, setExperience] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyDescription, setCompanyDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [savedDescriptions, setSavedDescriptions] = useState<JobDescription[]>([])

  const generateDescription = async () => {
    if (!jobTitle.trim()) {
      showToast('Please enter a job title', 'error')
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      const description = `# ${jobTitle}

## About ${companyName || 'Our Company'}

${companyDescription || 'We are a fast-growing startup looking for talented individuals to join our team.'}

## Job Overview

We are seeking a ${jobTitle} to join our ${department || 'team'}. This is a ${employmentType} position${location ? ` based in ${location}` : ' (remote/hybrid options available)'}.

## Key Responsibilities

- Responsibility 1: [Primary duty related to the role]
- Responsibility 2: [Core function of the position]
- Responsibility 3: [Key area of focus]
- Responsibility 4: [Important task or project]
- Responsibility 5: [Additional responsibility]

## Required Qualifications

${requiredSkills ? requiredSkills.split(',').map(s => `- ${s.trim()}`).join('\n') : `- ${experience || '2+'} years of relevant experience\n- Strong communication skills\n- Ability to work in a fast-paced environment\n- Bachelor's degree or equivalent experience`}

## Preferred Qualifications

${preferredSkills ? preferredSkills.split(',').map(s => `- ${s.trim()}`).join('\n') : `- Advanced degree or certifications\n- Experience in startup environment\n- Additional relevant skills`}

## Experience Level

${experience || '2-5 years'} of experience in a similar role

## Compensation

${salaryRange ? `Salary Range: ${salaryRange}` : 'Competitive salary based on experience'}

## Benefits

- Health, dental, and vision insurance
- Flexible work arrangements
- Professional development opportunities
- Equity participation
- Generous PTO policy

## How to Apply

Please submit your resume and cover letter through our application portal. We look forward to hearing from you!

---

**Employment Type:** ${employmentType.charAt(0).toUpperCase() + employmentType.slice(1)}
**Location:** ${location || 'Remote/Hybrid'}
**Department:** ${department || 'General'}`

      setGeneratedDescription(description)
      setIsGenerating(false)
      showToast('Job description generated!', 'success')
    }, 1500)
  }

  const saveDescription = () => {
    if (!generatedDescription.trim()) {
      showToast('No description to save', 'error')
      return
    }

    const newDescription: JobDescription = {
      id: Date.now().toString(),
      title: jobTitle,
      content: generatedDescription,
      department: department || 'General',
      createdAt: new Date().toISOString()
    }

    setSavedDescriptions([...savedDescriptions, newDescription])
    showToast('Job description saved!', 'success')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDescription)
    showToast('Copied to clipboard!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl font-bold gradient-text">AI Job Description Generator</h1>
          </div>
          <p className="text-lg text-gray-600">Create clear, compelling job descriptions that attract top talent and reduce time-to-hire.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Job Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g., Engineering, Marketing"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                  <Select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full"
                    options={[
                      { value: 'full-time', label: 'Full-Time' },
                      { value: 'part-time', label: 'Part-Time' },
                      { value: 'contract', label: 'Contract' },
                      { value: 'internship', label: 'Internship' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., San Francisco, CA or Remote"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <Input
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    placeholder="e.g., $80K - $120K"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <Input
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g., 2-5 years"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                  <Input
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    placeholder="Comma-separated: JavaScript, React, Node.js"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Skills</label>
                  <Input
                    value={preferredSkills}
                    onChange={(e) => setPreferredSkills(e.target.value)}
                    placeholder="Comma-separated: TypeScript, AWS, Docker"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., TechStart Inc"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                  <textarea
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="Brief description of your company..."
                    className="w-full h-20 p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <Button
                  onClick={generateDescription}
                  disabled={isGenerating || !jobTitle.trim()}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Description'}
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Job Description Tips</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use clear, inclusive language</li>
                    <li>• Focus on outcomes, not tasks</li>
                    <li>• Include salary range when possible</li>
                    <li>• Highlight growth opportunities</li>
                    <li>• Make it ATS-friendly</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Generated Job Description</h2>
                {generatedDescription && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={saveDescription}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {isGenerating ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-600">AI is crafting your job description...</p>
                </div>
              ) : generatedDescription ? (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 font-sans max-h-[600px] overflow-y-auto">
                    {generatedDescription}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the form and click "Generate Description" to create your job posting</p>
                </div>
              )}
            </Card>

            {savedDescriptions.length > 0 && (
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Saved Descriptions ({savedDescriptions.length})</h2>
                <div className="space-y-3">
                  {savedDescriptions.slice().reverse().map((desc) => (
                    <div key={desc.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{desc.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{desc.department}</Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(desc.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setGeneratedDescription(desc.content)
                            setJobTitle(desc.title)
                            showToast('Description loaded!', 'success')
                          }}
                        >
                          Load
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
