'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Sparkles, Copy, Save, Package, Lightbulb } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

export default function ProductDescriptionsPage() {
  const [productName, setProductName] = useState('')
  const [features, setFeatures] = useState('')
  const [benefits, setBenefits] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDescription, setGeneratedDescription] = useState('')

  const generateDescription = async () => {
    if (!productName.trim()) {
      showToast('Please enter a product name', 'error')
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      const description = `# ${productName}\n\n## Product Overview\n\n${productName} is designed to meet your needs with exceptional quality and performance. ${targetAudience ? `Perfect for ${targetAudience}.` : ''}\n\n### Key Features\n\n${features ? features.split(',').map(f => `- ${f.trim()}`).join('\n') : '- High-quality materials and construction\n- User-friendly design\n- Excellent value for money\n- Reliable performance'}\n\n### Benefits\n\n${benefits || `Experience the difference with ${productName}. Perfect for those who demand quality and reliability.`}\n\n### Why Choose ${productName}?\n\n- Premium quality\n- Professional grade\n- Long-lasting durability\n- Exceptional customer support\n\nOrder now and experience the ${productName} difference!`
      
      setGeneratedDescription(description)
      setIsGenerating(false)
      showToast('Product description generated!', 'success')
    }, 1500)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDescription)
    showToast('Copied to clipboard!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl font-bold gradient-text">AI Product Description Writer</h1>
          </div>
          <p className="text-lg text-gray-600">Write compelling product descriptions that highlight features and drive sales.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Product Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Smart Widget Pro" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <Input value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Comma-separated: Feature 1, Feature 2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                <Input value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="What problems does it solve?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g., Small business owners" />
              </div>
              <Button onClick={generateDescription} disabled={isGenerating || !productName.trim()} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Description'}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Generated Description</h2>
              {generatedDescription && (
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              )}
            </div>
            {isGenerating ? (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">Generating...</p>
              </div>
            ) : generatedDescription ? (
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 font-sans">
                {generatedDescription}
              </pre>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fill in the form and generate your description</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}

