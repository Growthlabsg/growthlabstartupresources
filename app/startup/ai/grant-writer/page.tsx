'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { Sparkles, FileText, Copy, Save, Download, Lightbulb, Calendar, DollarSign } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface GrantProposal {
  id: string
  title: string
  content: string
  grantType: string
  createdAt: string
}

export default function GrantWriterPage() {
  const [organizationName, setOrganizationName] = useState('')
  const [grantType, setGrantType] = useState<'government' | 'foundation' | 'corporate' | 'research'>('government')
  const [projectTitle, setProjectTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('')
  const [problemStatement, setProblemStatement] = useState('')
  const [solution, setSolution] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProposal, setGeneratedProposal] = useState('')
  const [savedProposals, setSavedProposals] = useState<GrantProposal[]>([])

  const generateProposal = async () => {
    if (!organizationName.trim() || !projectTitle.trim()) {
      showToast('Please fill in required fields', 'error')
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      const proposal = `# Grant Proposal: ${projectTitle}

## Executive Summary

${organizationName} seeks funding of $${amount || '50,000'} to support ${projectTitle}. This ${duration || '12'}-month project addresses ${problemStatement || 'a critical need in our community'} by ${solution || 'implementing innovative solutions'}.

## 1. Organization Background

${organizationName} is committed to ${targetAudience || 'serving our community'} through innovative programs and initiatives. Our organization has a proven track record of delivering impactful results.

## 2. Problem Statement

${problemStatement || 'There is a significant gap in services that needs to be addressed. This problem affects our target population and requires immediate attention.'}

## 3. Proposed Solution

${solution || 'Our proposed solution addresses the identified problem through a comprehensive approach that includes program development, community engagement, and measurable outcomes.'}

## 4. Project Goals and Objectives

### Primary Goals:
- Achieve measurable impact on ${targetAudience || 'target population'}
- Establish sustainable program model
- Create replicable framework for future initiatives

### Specific Objectives:
1. Objective 1: [Specific, measurable outcome]
2. Objective 2: [Specific, measurable outcome]
3. Objective 3: [Specific, measurable outcome]

## 5. Target Audience

${targetAudience || 'Our program will serve individuals and communities who will directly benefit from our services.'}

## 6. Project Activities and Timeline

### Month 1-3: Planning and Development
- Program design and refinement
- Stakeholder engagement
- Resource allocation

### Month 4-9: Implementation
- Program launch
- Service delivery
- Ongoing monitoring

### Month 10-12: Evaluation and Sustainability
- Impact assessment
- Program refinement
- Sustainability planning

## 7. Budget Summary

**Total Requested:** $${amount || '50,000'}

### Budget Breakdown:
- Personnel: $${Math.floor(parseInt(amount || '50000') * 0.5).toLocaleString()}
- Program Activities: $${Math.floor(parseInt(amount || '50000') * 0.3).toLocaleString()}
- Equipment/Supplies: $${Math.floor(parseInt(amount || '50000') * 0.1).toLocaleString()}
- Administrative: $${Math.floor(parseInt(amount || '50000') * 0.1).toLocaleString()}

## 8. Expected Outcomes and Impact

- Number of individuals served: [Target number]
- Key performance indicators: [List KPIs]
- Long-term community impact: [Describe impact]

## 9. Evaluation Plan

We will implement a comprehensive evaluation plan including:
- Quantitative metrics tracking
- Qualitative feedback collection
- Regular progress assessments
- Final impact evaluation

## 10. Sustainability

This project is designed to be sustainable through:
- Community partnerships
- Diversified funding sources
- Program revenue generation
- Long-term organizational commitment

## Conclusion

${organizationName} is uniquely positioned to deliver this project successfully. With your support, we can create lasting positive change for ${targetAudience || 'our community'}.

---

**Contact Information:**
Organization: ${organizationName}
Project: ${projectTitle}
Requested Amount: $${amount || '50,000'}
Duration: ${duration || '12'} months`
      
      setGeneratedProposal(proposal)
      setIsGenerating(false)
      showToast('Grant proposal generated!', 'success')
    }, 2000)
  }

  const saveProposal = () => {
    if (!generatedProposal.trim()) {
      showToast('No proposal to save', 'error')
      return
    }

    const newProposal: GrantProposal = {
      id: Date.now().toString(),
      title: projectTitle || 'Untitled Grant Proposal',
      content: generatedProposal,
      grantType,
      createdAt: new Date().toISOString()
    }

    setSavedProposals([...savedProposals, newProposal])
    showToast('Proposal saved!', 'success')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedProposal)
    showToast('Copied to clipboard!', 'success')
  }

  const downloadProposal = () => {
    const blob = new Blob([generatedProposal], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectTitle || 'grant-proposal'}-${grantType}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Proposal downloaded!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl font-bold gradient-text">AI Grant Writer</h1>
          </div>
          <p className="text-lg text-gray-600">Generate professional grant proposals and funding applications with AI assistance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Grant Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g., TechStart Foundation"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grant Type</label>
                  <Select
                    value={grantType}
                    onChange={(e) => setGrantType(e.target.value as any)}
                    className="w-full"
                  >
                    <option value="government">Government Grant</option>
                    <option value="foundation">Foundation Grant</option>
                    <option value="corporate">Corporate Grant</option>
                    <option value="research">Research Grant</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g., Community Tech Initiative"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requested Amount</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="50000"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Duration (months)</label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="12"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Problem Statement</label>
                  <textarea
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Describe the problem you're addressing..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Solution</label>
                  <textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Describe your solution..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Underserved youth, Small businesses"
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={generateProposal}
                  disabled={isGenerating || !organizationName.trim() || !projectTitle.trim()}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Proposal'}
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Grant Writing Tips</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Clearly define the problem</li>
                    <li>• Show measurable outcomes</li>
                    <li>• Align with funder priorities</li>
                    <li>• Include detailed budget</li>
                    <li>• Demonstrate sustainability</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Generated Proposal</h2>
                {generatedProposal && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={saveProposal}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadProposal}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>

              {isGenerating ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-600">AI is crafting your grant proposal...</p>
                </div>
              ) : generatedProposal ? (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 font-sans max-h-[600px] overflow-y-auto">
                    {generatedProposal}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the form and click "Generate Proposal" to create your grant application</p>
                </div>
              )}
            </Card>

            {savedProposals.length > 0 && (
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Saved Proposals ({savedProposals.length})</h2>
                <div className="space-y-3">
                  {savedProposals.slice().reverse().map((proposal) => (
                    <div key={proposal.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{proposal.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{proposal.grantType}</Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(proposal.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setGeneratedProposal(proposal.content)
                            setProjectTitle(proposal.title)
                            showToast('Proposal loaded!', 'success')
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
