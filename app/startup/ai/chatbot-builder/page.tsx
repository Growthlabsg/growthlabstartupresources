'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { Sparkles, MessageSquare, Save, Play, Lightbulb, Bot, Plus, Trash2 } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface Chatbot {
  id: string
  name: string
  welcomeMessage: string
  responses: { question: string; answer: string }[]
  createdAt: string
}

export default function ChatbotBuilderPage() {
  const [botName, setBotName] = useState('')
  const [botPurpose, setBotPurpose] = useState('')
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [tone, setTone] = useState<'professional' | 'friendly' | 'casual' | 'supportive'>('friendly')
  const [responses, setResponses] = useState<{ question: string; answer: string }[]>([
    { question: '', answer: '' }
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedBots, setSavedBots] = useState<Chatbot[]>([])

  const addResponse = () => {
    setResponses([...responses, { question: '', answer: '' }])
  }

  const removeResponse = (index: number) => {
    setResponses(responses.filter((_, i) => i !== index))
  }

  const updateResponse = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...responses]
    updated[index][field] = value
    setResponses(updated)
  }

  const generateWelcomeMessage = () => {
    if (!botPurpose.trim()) {
      showToast('Please enter bot purpose', 'error')
      return
    }

    const tones = {
      professional: `Hello! I'm here to help you with ${botPurpose}. How can I assist you today?`,
      friendly: `Hi there! 👋 I'm here to help with ${botPurpose}. What can I do for you?`,
      casual: `Hey! I can help you with ${botPurpose}. What's up?`,
      supportive: `Hello! I'm here to support you with ${botPurpose}. How can I help you today?`
    }

    setWelcomeMessage(tones[tone])
    showToast('Welcome message generated!', 'success')
  }

  const generateResponse = (index: number) => {
    if (!responses[index].question.trim()) {
      showToast('Please enter a question', 'error')
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      const question = responses[index].question.toLowerCase()
      let answer = ''

      if (question.includes('hours') || question.includes('time') || question.includes('open')) {
        answer = 'Our business hours are Monday-Friday, 9 AM - 5 PM EST. We\'re here to help!'
      } else if (question.includes('contact') || question.includes('email') || question.includes('phone')) {
        answer = 'You can reach us at support@company.com or call us at (555) 123-4567. We typically respond within 24 hours.'
      } else if (question.includes('price') || question.includes('cost') || question.includes('pricing')) {
        answer = 'Our pricing varies based on your needs. Would you like to schedule a call to discuss pricing options?'
      } else if (question.includes('refund') || question.includes('return') || question.includes('cancel')) {
        answer = 'We offer a 30-day money-back guarantee. Please contact our support team for assistance with returns or cancellations.'
      } else {
        answer = `Thank you for your question about "${responses[index].question}". ${botPurpose ? `Regarding ${botPurpose}, ` : ''}I'd be happy to help. Could you provide a bit more detail so I can assist you better?`
      }

      updateResponse(index, 'answer', answer)
      setIsGenerating(false)
      showToast('Response generated!', 'success')
    }, 1000)
  }

  const saveBot = () => {
    if (!botName.trim() || !welcomeMessage.trim()) {
      showToast('Please fill in bot name and welcome message', 'error')
      return
    }

    const newBot: Chatbot = {
      id: Date.now().toString(),
      name: botName,
      welcomeMessage,
      responses: responses.filter(r => r.question.trim() && r.answer.trim()),
      createdAt: new Date().toISOString()
    }

    setSavedBots([...savedBots, newBot])
    showToast('Chatbot saved!', 'success')
  }

  const previewBot = () => {
    if (!welcomeMessage.trim()) {
      showToast('Please generate a welcome message first', 'error')
      return
    }
    showToast('Preview mode - Chatbot is ready!', 'info')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl font-bold gradient-text">AI Customer Support Bot Builder</h1>
          </div>
          <p className="text-lg text-gray-600">Build intelligent chatbots that handle customer inquiries 24/7 and reduce support costs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Bot Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bot Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="e.g., Support Assistant"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bot Purpose</label>
                  <Input
                    value={botPurpose}
                    onChange={(e) => setBotPurpose(e.target.value)}
                    placeholder="e.g., Customer support, Sales inquiries"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <Select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="w-full"
                    options={[
                      { value: 'professional', label: 'Professional' },
                      { value: 'friendly', label: 'Friendly' },
                      { value: 'casual', label: 'Casual' },
                      { value: 'supportive', label: 'Supportive' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                  <textarea
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    placeholder="Bot's greeting message..."
                    className="w-full h-20 p-3 border border-gray-300 rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generateWelcomeMessage}
                    className="mt-2 w-full"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Generate Welcome Message
                  </Button>
                </div>

                <Button
                  onClick={saveBot}
                  disabled={!botName.trim() || !welcomeMessage.trim()}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Chatbot
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Chatbot Best Practices</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Keep responses concise</li>
                    <li>• Use clear, simple language</li>
                    <li>• Provide escalation options</li>
                    <li>• Test with real questions</li>
                    <li>• Update regularly based on feedback</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Bot Responses</h2>
                <Button size="sm" variant="outline" onClick={addResponse}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Response
                </Button>
              </div>

              <div className="space-y-4">
                {responses.map((response, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Response {index + 1}</span>
                      {responses.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeResponse(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Question/Keyword</label>
                        <Input
                          value={response.question}
                          onChange={(e) => updateResponse(index, 'question', e.target.value)}
                          placeholder="e.g., What are your hours?"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Answer</label>
                        <textarea
                          value={response.answer}
                          onChange={(e) => updateResponse(index, 'answer', e.target.value)}
                          placeholder="Bot's response..."
                          className="w-full h-20 p-3 border border-gray-300 rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateResponse(index)}
                          disabled={isGenerating || !response.question.trim()}
                          className="mt-2"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Generate Answer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Chatbot Preview</h2>
              <div className="bg-gray-900 rounded-lg p-4 min-h-[300px]">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Bot className="h-5 w-5 text-green-400 mt-1" />
                    <div className="bg-gray-800 rounded-lg p-3 max-w-[80%]">
                      <p className="text-white text-sm">
                        {welcomeMessage || 'Welcome message will appear here...'}
                      </p>
                    </div>
                  </div>
                  {responses.filter(r => r.question && r.answer).map((response, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start gap-2 justify-end">
                        <div className="bg-blue-600 rounded-lg p-3 max-w-[80%]">
                          <p className="text-white text-sm">{response.question}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Bot className="h-5 w-5 text-green-400 mt-1" />
                        <div className="bg-gray-800 rounded-lg p-3 max-w-[80%]">
                          <p className="text-white text-sm">{response.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                onClick={previewBot}
                className="mt-4 w-full"
                variant="outline"
              >
                <Play className="h-4 w-4 mr-2" />
                Test Chatbot
              </Button>
            </Card>

            {savedBots.length > 0 && (
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Saved Chatbots ({savedBots.length})</h2>
                <div className="space-y-3">
                  {savedBots.slice().reverse().map((bot) => (
                    <div key={bot.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{bot.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{bot.responses.length} responses</p>
                          <span className="text-xs text-gray-500">
                            {new Date(bot.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setBotName(bot.name)
                            setWelcomeMessage(bot.welcomeMessage)
                            setResponses(bot.responses.length > 0 ? bot.responses : [{ question: '', answer: '' }])
                            showToast('Chatbot loaded!', 'success')
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
