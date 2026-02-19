'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Sparkles, Download, Share2, Save, Wand2, Lightbulb } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { showToast } from '@/components/ui/ToastContainer'

export default function EnhancedPitchDeckPage() {
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateSuggestions = () => {
    setIsGenerating(true)
    showToast('AI is analyzing your pitch deck...', 'info')
    setTimeout(() => {
      setAiSuggestions([
        'Strengthen your value proposition with specific metrics',
        'Add a competitive analysis slide to highlight differentiation',
        'Include customer testimonials to build credibility',
        'Enhance financial projections with growth assumptions',
      ])
      setIsGenerating(false)
      showToast('AI suggestions generated!', 'success')
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary-500" />
            <Badge variant="featured">AI Enhanced</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            AI-Powered Pitch Deck Builder
          </h1>
          <p className="text-lg text-gray-600">
            Create compelling pitch decks with AI assistance and intelligent suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Pitch Deck</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => showToast('Saved!', 'success')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => showToast('Sharing...', 'info')}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm" onClick={() => showToast('Exporting...', 'info')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <div className="border-2 border-dashed border-primary-500/20 rounded-lg p-12 text-center">
              <Wand2 className="h-16 w-16 mx-auto text-primary-500 mb-4" />
              <p className="text-gray-600 mb-4">Start building with AI assistance</p>
              <Button onClick={handleGenerateSuggestions} disabled={isGenerating}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate AI Suggestions'}
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary-500/10 to-primary-500/5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-primary-500" />
                <h3 className="font-semibold">AI Suggestions</h3>
              </div>
              {aiSuggestions.length > 0 ? (
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, idx) => (
                    <div key={idx} className="bg-white/60 p-3 rounded-lg border border-primary-500/20">
                      <p className="text-sm text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Click "Generate AI Suggestions" to get personalized recommendations for your pitch deck.
                </p>
              )}
            </Card>

            <Card>
              <h3 className="font-semibold mb-4">AI Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <Sparkles className="h-4 w-4 text-primary-500 mr-2 mt-0.5" />
                  Content optimization suggestions
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-4 w-4 text-primary-500 mr-2 mt-0.5" />
                  Investor-focused messaging
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-4 w-4 text-primary-500 mr-2 mt-0.5" />
                  Visual design recommendations
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-4 w-4 text-primary-500 mr-2 mt-0.5" />
                  Slide flow optimization
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

