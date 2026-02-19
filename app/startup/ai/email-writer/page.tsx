'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { Sparkles, Mail, Copy, Save, Send, TrendingUp, Lightbulb } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface EmailCampaign {
  id: string
  subject: string
  body: string
  type: string
  createdAt: string
}

export default function EmailWriterPage() {
  const [campaignType, setCampaignType] = useState<'welcome' | 'promotional' | 'newsletter' | 'follow-up' | 'cold-outreach'>('welcome')
  const [goal, setGoal] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [keyPoints, setKeyPoints] = useState('')
  const [cta, setCta] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null)
  const [savedCampaigns, setSavedCampaigns] = useState<EmailCampaign[]>([])

  const generateEmail = async () => {
    if (!goal.trim()) {
      showToast('Please enter your campaign goal', 'error')
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      const templates = {
        welcome: {
          subject: `Welcome to ${goal}! Let's Get Started`,
          body: `Hi there!\n\nWelcome to ${goal}! We're thrilled to have you on board.\n\n${keyPoints ? `Here's what you can expect:\n${keyPoints.split(',').map(k => `• ${k.trim()}`).join('\n')}\n\n` : ''}We're here to help you succeed. If you have any questions, just reply to this email.\n\n${cta || 'Get started today!'}\n\nBest regards,\nThe Team`
        },
        promotional: {
          subject: `🎉 Special Offer: ${goal}`,
          body: `Hi!\n\nWe have exciting news! ${goal}\n\n${keyPoints ? `Here's what makes this special:\n${keyPoints.split(',').map(k => `• ${k.trim()}`).join('\n')}\n\n` : ''}This offer won't last long. ${cta || 'Claim your offer now!'}\n\nBest,\nThe Team`
        },
        newsletter: {
          subject: `${goal} - Your Monthly Update`,
          body: `Hello!\n\nHere's what's been happening:\n\n${keyPoints || 'Updates and insights from our team'}\n\n${cta || 'Read more on our blog'}\n\nThanks for being part of our community!\n\nThe Team`
        },
        'follow-up': {
          subject: `Following up on ${goal}`,
          body: `Hi,\n\nI wanted to follow up on ${goal}.\n\n${keyPoints || 'I wanted to check in and see if you had any questions.'}\n\n${cta || 'Would you like to schedule a call?'}\n\nLooking forward to hearing from you!\n\nBest regards`
        },
        'cold-outreach': {
          subject: `Quick question about ${goal}`,
          body: `Hi ${targetAudience || 'there'},\n\nI noticed ${goal} and thought you might be interested in learning more.\n\n${keyPoints || 'We help companies like yours achieve their goals.'}\n\n${cta || 'Would you be open to a quick 15-minute call?'}\n\nBest,\n[Your Name]`
        }
      }

      const email = templates[campaignType]
      setGeneratedEmail(email)
      setIsGenerating(false)
      showToast('Email generated successfully!', 'success')
    }, 1500)
  }

  const saveCampaign = () => {
    if (!generatedEmail) {
      showToast('No email to save', 'error')
      return
    }

    const newCampaign: EmailCampaign = {
      id: Date.now().toString(),
      subject: generatedEmail.subject,
      body: generatedEmail.body,
      type: campaignType,
      createdAt: new Date().toISOString()
    }

    setSavedCampaigns([...savedCampaigns, newCampaign])
    showToast('Email saved!', 'success')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showToast('Copied to clipboard!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl font-bold gradient-text">AI Email Campaign Writer</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Craft compelling email campaigns that convert with AI-powered subject lines and body copy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Campaign Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                  <Select
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value as any)}
                    className="w-full"
                  >
                    <option value="welcome">Welcome Email</option>
                    <option value="promotional">Promotional</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="cold-outreach">Cold Outreach</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Goal <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., Onboard new users"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Startup founders"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Points</label>
                  <Input
                    value={keyPoints}
                    onChange={(e) => setKeyPoints(e.target.value)}
                    placeholder="e.g., Feature 1, Feature 2, Benefit 3"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action</label>
                  <Input
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="e.g., Sign up now"
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={generateEmail}
                  disabled={isGenerating || !goal.trim()}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Email'}
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Email Best Practices</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Keep subject lines under 50 characters</li>
                    <li>• Personalize when possible</li>
                    <li>• Clear, single call-to-action</li>
                    <li>• Mobile-friendly formatting</li>
                    <li>• Test before sending</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Generated Email */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Generated Email</h2>
                {generatedEmail && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={saveCampaign}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {isGenerating ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-600">AI is crafting your email...</p>
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
                          <li>• Subject line length: {generatedEmail.subject.length} characters (optimal: 30-50)</li>
                          <li>• Body length: {generatedEmail.body.length} characters</li>
                          <li>• Personalize with recipient name if possible</li>
                          <li>• A/B test different subject lines</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the form and click "Generate Email" to create your campaign</p>
                </div>
              )}
            </Card>

            {/* Saved Campaigns */}
            {savedCampaigns.length > 0 && (
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Saved Campaigns ({savedCampaigns.length})</h2>
                <div className="space-y-3">
                  {savedCampaigns.slice().reverse().map((campaign) => (
                    <div key={campaign.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{campaign.subject}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{campaign.type}</Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(campaign.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setGeneratedEmail({ subject: campaign.subject, body: campaign.body })
                            setCampaignType(campaign.type as any)
                            showToast('Campaign loaded!', 'success')
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

