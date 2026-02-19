'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { Sparkles, Mail, Copy, Save, TrendingUp, Lightbulb, User, Building2 } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface InvestorEmail {
  id: string
  subject: string
  body: string
  investorName: string
  createdAt: string
}

export default function InvestorEmailsPage() {
  const [investorName, setInvestorName] = useState('')
  const [investorFirm, setInvestorFirm] = useState('')
  const [emailType, setEmailType] = useState<'cold-outreach' | 'follow-up' | 'pitch-request' | 'update'>('cold-outreach')
  const [startupName, setStartupName] = useState('')
  const [stage, setStage] = useState('')
  const [traction, setTraction] = useState('')
  const [fundingAmount, setFundingAmount] = useState('')
  const [keyHighlights, setKeyHighlights] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null)
  const [savedEmails, setSavedEmails] = useState<InvestorEmail[]>([])

  const generateEmail = async () => {
    if (!startupName.trim()) {
      showToast('Please enter your startup name', 'error')
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      const investor = investorName || 'there'
      const firm = investorFirm || 'your firm'
      
      const templates = {
        'cold-outreach': {
          subject: `Quick question about ${startupName} - ${stage || 'Seed'} stage opportunity`,
          body: `Hi ${investor},\n\nI hope this email finds you well. I'm reaching out because ${startupName} is ${stage ? `at the ${stage} stage` : 'raising our seed round'} and I believe our mission aligns with ${firm}'s investment focus.\n\n${traction ? `Here's what we've achieved:\n${traction}\n\n` : ''}${keyHighlights ? `Key highlights:\n${keyHighlights.split(',').map(h => `• ${h.trim()}`).join('\n')}\n\n` : ''}We're raising $${fundingAmount || '500K'} to ${stage === 'Seed' ? 'scale our product and grow our team' : 'accelerate growth and expand into new markets'}.\n\nWould you be open to a brief 15-minute call to discuss this opportunity? I'd love to share more about our vision and how ${startupName} is positioned for significant growth.\n\nBest regards,\n[Your Name]\nFounder, ${startupName}`
        },
        'follow-up': {
          subject: `Following up: ${startupName} - ${stage || 'Funding'} Update`,
          body: `Hi ${investor},\n\nI wanted to follow up on our previous conversation about ${startupName}.\n\n${traction ? `Since we last spoke, we've made significant progress:\n${traction}\n\n` : ''}${keyHighlights ? `Recent milestones:\n${keyHighlights.split(',').map(h => `• ${h.trim()}`).join('\n')}\n\n` : ''}We're still actively raising $${fundingAmount || '500K'} and would love to continue the conversation with ${firm}.\n\nWould you be available for a call this week to discuss next steps?\n\nBest regards,\n[Your Name]\nFounder, ${startupName}`
        },
        'pitch-request': {
          subject: `Pitch Opportunity: ${startupName} - ${stage || 'Seed'} Round`,
          body: `Hi ${investor},\n\nI hope you're doing well. I'm reaching out to request an opportunity to pitch ${startupName} to ${firm}.\n\n${startupName} is ${stage ? `at the ${stage} stage` : 'a seed-stage startup'} ${traction ? `with strong traction:\n${traction}\n\n` : ''}${keyHighlights ? `What makes us unique:\n${keyHighlights.split(',').map(h => `• ${h.trim()}`).join('\n')}\n\n` : ''}We're raising $${fundingAmount || '500K'} and believe ${firm} would be an ideal partner for our growth journey.\n\nI'd be grateful for the opportunity to present our vision and discuss how we can work together. Would you be available for a 30-minute pitch meeting?\n\nThank you for your consideration.\n\nBest regards,\n[Your Name]\nFounder, ${startupName}`
        },
        'update': {
          subject: `${startupName} Update: ${keyHighlights ? keyHighlights.split(',')[0] : 'Exciting Milestones'}`,
          body: `Hi ${investor},\n\nI wanted to share an exciting update about ${startupName}.\n\n${traction ? `Recent achievements:\n${traction}\n\n` : ''}${keyHighlights ? `Key developments:\n${keyHighlights.split(',').map((h: string) => `• ${h.trim()}`).join('\n')}\n\n` : ''}We're continuing to ${stage === 'Seed' ? 'build and validate' : 'scale and grow'}, and I thought you'd be interested in our progress.\n\n${fundingAmount ? `We're also in the process of raising $${fundingAmount} and would welcome the opportunity to discuss how ${firm} might be involved.` : 'I\'d love to catch up and share more about our journey.'}\n\nBest regards,\n[Your Name]\nFounder, ${startupName}`
        }
      }

      const email = templates[emailType]
      setGeneratedEmail(email)
      setIsGenerating(false)
      showToast('Investor email generated!', 'success')
    }, 1500)
  }

  const saveEmail = () => {
    if (!generatedEmail) {
      showToast('No email to save', 'error')
      return
    }

    const newEmail: InvestorEmail = {
      id: Date.now().toString(),
      subject: generatedEmail.subject,
      body: generatedEmail.body,
      investorName: investorName || 'Investor',
      createdAt: new Date().toISOString()
    }

    setSavedEmails([...savedEmails, newEmail])
    showToast('Email saved!', 'success')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showToast('Copied to clipboard!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl font-bold gradient-text">AI Investor Email Writer</h1>
          </div>
          <p className="text-lg text-gray-600">Craft personalized investor outreach emails that get responses and secure meetings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Type</label>
                  <Select
                    value={emailType}
                    onChange={(e) => setEmailType(e.target.value as any)}
                    className="w-full"
                  >
                    <option value="cold-outreach">Cold Outreach</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="pitch-request">Pitch Request</option>
                    <option value="update">Progress Update</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investor Name</label>
                  <Input
                    value={investorName}
                    onChange={(e) => setInvestorName(e.target.value)}
                    placeholder="e.g., John Smith"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investor Firm</label>
                  <Input
                    value={investorFirm}
                    onChange={(e) => setInvestorFirm(e.target.value)}
                    placeholder="e.g., Tech Ventures"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Startup Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="e.g., TechStart Inc"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Stage</label>
                  <Select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full"
                  >
                    <option value="">Select stage</option>
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Amount</label>
                  <Input
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    placeholder="e.g., 500K"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Traction/Metrics</label>
                  <textarea
                    value={traction}
                    onChange={(e) => setTraction(e.target.value)}
                    placeholder="e.g., 10K users, $50K MRR, 3x growth"
                    className="w-full h-20 p-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Highlights</label>
                  <Input
                    value={keyHighlights}
                    onChange={(e) => setKeyHighlights(e.target.value)}
                    placeholder="Comma-separated: Feature 1, Feature 2"
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={generateEmail}
                  disabled={isGenerating || !startupName.trim()}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Email'}
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Investor Email Best Practices</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Keep it concise (under 200 words)</li>
                    <li>• Personalize with research</li>
                    <li>• Lead with traction/metrics</li>
                    <li>• Clear call-to-action</li>
                    <li>• Follow up within 1 week</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Generated Email</h2>
                {generatedEmail && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={saveEmail}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {isGenerating ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-600">AI is crafting your investor email...</p>
                </div>
              ) : generatedEmail ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedEmail.subject}
                        readOnly
                        className="flex-1 bg-gray-50"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generatedEmail.subject)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Length: {generatedEmail.subject.length} characters (optimal: 30-50)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <pre className="whitespace-pre-wrap text-sm font-sans">
                        {generatedEmail.body}
                      </pre>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generatedEmail.body)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Body
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`${generatedEmail.subject}\n\n${generatedEmail.body}`)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy All
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">Optimization Tips</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Personalize with specific details about the investor</li>
                          <li>• Include concrete metrics and traction</li>
                          <li>• Make the ask clear and specific</li>
                          <li>• Keep follow-ups timely and relevant</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the form and click "Generate Email" to create your investor outreach</p>
                </div>
              )}
            </Card>

            {savedEmails.length > 0 && (
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Saved Emails ({savedEmails.length})</h2>
                <div className="space-y-3">
                  {savedEmails.slice().reverse().map((email) => (
                    <div key={email.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{email.subject}</h3>
                          <p className="text-sm text-gray-600 mt-1">To: {email.investorName}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(email.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setGeneratedEmail({ subject: email.subject, body: email.body })
                            setInvestorName(email.investorName)
                            showToast('Email loaded!', 'success')
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
