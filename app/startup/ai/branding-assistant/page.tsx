'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { Sparkles, Palette, Save, Copy, Lightbulb, Eye, Type, Droplet } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface BrandGuideline {
  id: string
  name: string
  colors: string[]
  fonts: string[]
  style: string
  createdAt: string
}

export default function BrandingAssistantPage() {
  const [brandName, setBrandName] = useState('')
  const [industry, setIndustry] = useState('')
  const [brandStyle, setBrandStyle] = useState<'modern' | 'classic' | 'bold' | 'minimal' | 'playful'>('modern')
  const [targetAudience, setTargetAudience] = useState('')
  const [keyValues, setKeyValues] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedGuidelines, setGeneratedGuidelines] = useState<any>(null)
  const [savedBrands, setSavedBrands] = useState<BrandGuideline[]>([])

  const colorPalettes = {
    modern: ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'],
    classic: ['#1F2937', '#6B7280', '#D97706', '#059669', '#DC2626'],
    bold: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'],
    minimal: ['#000000', '#FFFFFF', '#6B7280', '#E5E7EB', '#F3F4F6'],
    playful: ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']
  }

  const fontSuggestions = {
    modern: ['Inter', 'Poppins', 'Roboto', 'Open Sans'],
    classic: ['Georgia', 'Times New Roman', 'Merriweather', 'Playfair Display'],
    bold: ['Montserrat', 'Bebas Neue', 'Oswald', 'Raleway'],
    minimal: ['Helvetica', 'Arial', 'Lato', 'Source Sans Pro'],
    playful: ['Comic Sans MS', 'Nunito', 'Quicksand', 'Fredoka One']
  }

  const generateGuidelines = async () => {
    if (!brandName.trim()) {
      showToast('Please enter a brand name', 'error')
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      const colors = colorPalettes[brandStyle]
      const fonts = fontSuggestions[brandStyle]

      const guidelines = {
        brandName,
        industry: industry || 'General',
        style: brandStyle,
        colors: {
          primary: colors[0],
          secondary: colors[1],
          accent: colors[2],
          neutral: colors[3],
          highlight: colors[4]
        },
        fonts: {
          heading: fonts[0],
          body: fonts[1],
          accent: fonts[2]
        },
        logoConcepts: [
          `${brandName} - Minimalist wordmark with ${brandStyle} styling`,
          `${brandName} - Icon-based logo with ${colors[0]} accent`,
          `${brandName} - Combination mark with modern typography`
        ],
        brandVoice: brandStyle === 'modern' ? 'Innovative, forward-thinking, and approachable' :
                    brandStyle === 'classic' ? 'Trustworthy, established, and professional' :
                    brandStyle === 'bold' ? 'Confident, energetic, and memorable' :
                    brandStyle === 'minimal' ? 'Clean, simple, and focused' :
                    'Fun, friendly, and engaging',
        taglineSuggestions: [
          `${brandName}: ${keyValues || 'Innovation meets excellence'}`,
          `Empowering ${targetAudience || 'your success'}`,
          `${brandName} - ${industry ? `Leading ${industry} solutions` : 'Your trusted partner'}`
        ],
        usageGuidelines: [
          'Use primary color for main brand elements',
          'Maintain consistent typography hierarchy',
          'Ensure sufficient contrast for accessibility',
          'Apply brand voice consistently across all communications'
        ]
      }

      setGeneratedGuidelines(guidelines)
      setIsGenerating(false)
      showToast('Brand guidelines generated!', 'success')
    }, 2000)
  }

  const saveBrand = () => {
    if (!generatedGuidelines) {
      showToast('No guidelines to save', 'error')
      return
    }

    const newBrand: BrandGuideline = {
      id: Date.now().toString(),
      name: brandName,
      colors: Object.values(generatedGuidelines.colors),
      fonts: Object.values(generatedGuidelines.fonts),
      style: brandStyle,
      createdAt: new Date().toISOString()
    }

    setSavedBrands([...savedBrands, newBrand])
    showToast('Brand guidelines saved!', 'success')
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    showToast('Color copied to clipboard!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl font-bold gradient-text">AI Logo & Branding Assistant</h1>
          </div>
          <p className="text-lg text-gray-600">Generate logo concepts, color palettes, and brand guidelines with AI-powered design suggestions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Brand Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., TechStart"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <Input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Technology, Healthcare"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Style</label>
                  <Select
                    value={brandStyle}
                    onChange={(e) => setBrandStyle(e.target.value as any)}
                    className="w-full"
                    options={[
                      { value: 'modern', label: 'Modern' },
                      { value: 'classic', label: 'Classic' },
                      { value: 'bold', label: 'Bold' },
                      { value: 'minimal', label: 'Minimal' },
                      { value: 'playful', label: 'Playful' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Young professionals, Small businesses"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Values</label>
                  <Input
                    value={keyValues}
                    onChange={(e) => setKeyValues(e.target.value)}
                    placeholder="e.g., Innovation, Trust, Quality"
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={generateGuidelines}
                  disabled={isGenerating || !brandName.trim()}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Brand Guidelines'}
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Branding Tips</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Keep colors consistent</li>
                    <li>• Use 2-3 fonts maximum</li>
                    <li>• Ensure logo scalability</li>
                    <li>• Test across platforms</li>
                    <li>• Document guidelines clearly</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {isGenerating ? (
              <Card className="p-6">
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-600">AI is creating your brand guidelines...</p>
                </div>
              </Card>
            ) : generatedGuidelines ? (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Color Palette</h2>
                    <Button size="sm" variant="outline" onClick={saveBrand}>
                      <Save className="h-4 w-4 mr-1" />
                      Save Brand
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(generatedGuidelines.colors).map(([name, color]) => (
                      <div key={name} className="text-center">
                        <div
                          className="w-full h-24 rounded-lg mb-2 cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: color as string }}
                          onClick={() => copyColor(color as string)}
                        />
                        <p className="text-xs font-medium text-gray-700 capitalize">{name}</p>
                        <p className="text-xs text-gray-500 font-mono">{String(color)}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Typography</h2>
                  <div className="space-y-4">
                    {Object.entries(generatedGuidelines.fonts).map(([type, font]) => (
                      <div key={type} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 capitalize mb-2">{type} Font</p>
                        <p className="text-2xl" style={{ fontFamily: font as string }}>
                          {String(font)} - The quick brown fox jumps over the lazy dog
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Logo Concepts</h2>
                  <ul className="space-y-2">
                    {generatedGuidelines.logoConcepts.map((concept: string, index: number) => (
                      <li key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{concept}</p>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Brand Voice</h2>
                  <p className="text-gray-700">{generatedGuidelines.brandVoice}</p>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Tagline Suggestions</h2>
                  <div className="space-y-2">
                    {generatedGuidelines.taglineSuggestions.map((tagline: string, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium">{tagline}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Usage Guidelines</h2>
                  <ul className="space-y-2">
                    {generatedGuidelines.usageGuidelines.map((guideline: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-primary-500 mt-1">•</span>
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ) : (
              <Card className="p-6">
                <div className="text-center py-12 text-gray-500">
                  <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the form and click "Generate Brand Guidelines" to create your brand identity</p>
                </div>
              </Card>
            )}

            {savedBrands.length > 0 && (
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Saved Brands ({savedBrands.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedBrands.slice().reverse().map((brand) => (
                    <div key={brand.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-semibold mb-2">{brand.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{brand.style}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(brand.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {brand.colors.slice(0, 5).map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
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
