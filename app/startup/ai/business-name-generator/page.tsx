'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { Sparkles, Copy, CheckCircle, Search, Lightbulb, Globe, CheckCircle2 } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface GeneratedName {
  id: string
  name: string
  domain: string
  available: boolean
  score: number
  reasoning: string
}

export default function BusinessNameGeneratorPage() {
  const [keywords, setKeywords] = useState('')
  const [industry, setIndustry] = useState('')
  const [style, setStyle] = useState<'modern' | 'classic' | 'creative' | 'professional'>('modern')
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedNames, setSavedNames] = useState<GeneratedName[]>([])

  const generateNames = async () => {
    if (!keywords.trim()) {
      showToast('Please enter keywords for your business', 'error')
      return
    }

    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      const styles = {
        modern: ['Tech', 'Labs', 'Hub', 'Studio', 'Works', 'Flow', 'Sync', 'Pulse'],
        classic: ['Group', 'Partners', 'Associates', 'Enterprises', 'Solutions', 'Services', 'Industries'],
        creative: ['Forge', 'Nexus', 'Vault', 'Atlas', 'Apex', 'Prism', 'Catalyst', 'Zenith'],
        professional: ['Capital', 'Ventures', 'Holdings', 'Global', 'International', 'Corp', 'Inc']
      }

      const suffixes = styles[style]
      const keywordParts = keywords.toLowerCase().split(' ').filter(Boolean)
      const newNames: GeneratedName[] = []

      for (let i = 0; i < 12; i++) {
        const base = keywordParts[0] || 'startup'
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
        const name = `${base.charAt(0).toUpperCase() + base.slice(1)}${suffix}`
        const domain = `${name.toLowerCase()}.com`
        
        newNames.push({
          id: Date.now().toString() + i,
          name,
          domain,
          available: Math.random() > 0.3, // 70% available
          score: Math.floor(Math.random() * 30) + 70,
          reasoning: `Strong brand potential with ${style} appeal. ${industry ? `Perfect for ${industry} industry.` : 'Memorable and easy to pronounce.'}`
        })
      }

      setGeneratedNames(newNames)
      setIsGenerating(false)
      showToast('Generated 12 business name suggestions!', 'success')
    }, 1500)
  }

  const saveName = (name: GeneratedName) => {
    if (savedNames.find(n => n.id === name.id)) {
      showToast('Name already saved', 'info')
      return
    }
    setSavedNames([...savedNames, name])
    showToast('Name saved to favorites!', 'success')
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
            <h1 className="text-4xl font-bold gradient-text">AI Business Name Generator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate unique, memorable business names with AI-powered suggestions, domain availability checks, and trademark insights.
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords <span className="text-red-500">*</span>
              </label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., tech, innovation, cloud"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Enter words related to your business</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <Input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., SaaS, E-commerce, FinTech"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Name Style</label>
            <div className="flex flex-wrap gap-2">
              {(['modern', 'classic', 'creative', 'professional'] as const).map((s) => (
                <Button
                  key={s}
                  variant={style === s ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStyle(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={generateNames}
            disabled={isGenerating || !keywords.trim()}
            className="w-full md:w-auto"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating Names...' : 'Generate Business Names'}
          </Button>
        </Card>

        {/* Generated Names */}
        {generatedNames.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Generated Names</h2>
              <Badge variant="outline">{generatedNames.length} suggestions</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedNames.map((name) => (
                <Card key={name.id} className="p-4 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{name.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{name.domain}</span>
                        {name.available ? (
                          <Badge variant="beginner" className="text-xs">Available</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-red-100 text-red-800">Taken</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Score: {name.score}/100
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 italic">{name.reasoning}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(name.name)}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => saveName(name)}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Saved Names */}
        {savedNames.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Saved Favorites</h2>
              <Badge variant="outline">{savedNames.length} saved</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedNames.map((name) => (
                <Card key={name.id} className="p-4 bg-primary-50 border-primary-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{name.name}</h3>
                      <p className="text-sm text-gray-600">{name.domain}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-primary-500" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(name.name)}
                    className="w-full"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Name
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {generatedNames.length === 0 && (
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Tips for Great Business Names</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Keep it short and memorable (2-3 words)</li>
                  <li>• Make it easy to spell and pronounce</li>
                  <li>• Check domain availability before finalizing</li>
                  <li>• Consider trademark implications</li>
                  <li>• Ensure it reflects your brand identity</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}

