'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { Sparkles, FileText, Copy, Download, Save, Lightbulb, TrendingUp } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface ContentPiece {
  id: string
  title: string
  content: string
  type: string
  createdAt: string
}

export default function ContentWriterPage() {
  const [topic, setTopic] = useState('')
  const [contentType, setContentType] = useState<'blog' | 'article' | 'landing-page' | 'product-description' | 'social-post'>('blog')
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'persuasive'>('professional')
  const [targetAudience, setTargetAudience] = useState('')
  const [wordCount, setWordCount] = useState('800')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [savedContent, setSavedContent] = useState<ContentPiece[]>([])

  const generateContent = async () => {
    if (!topic.trim()) {
      showToast('Please enter a topic', 'error')
      return
    }

    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      const templates = {
        blog: `# ${topic}\n\n## Introduction\n\nIn today's fast-paced world, ${topic} has become increasingly important for businesses and individuals alike. This comprehensive guide will explore the key aspects and provide actionable insights.\n\n## Key Points\n\n1. **Understanding the Fundamentals**: ${topic} requires a deep understanding of core principles and best practices.\n\n2. **Practical Applications**: Real-world examples demonstrate how ${topic} can be effectively implemented.\n\n3. **Future Trends**: The landscape of ${topic} is evolving rapidly, with new opportunities emerging.\n\n## Conclusion\n\n${topic} represents a significant opportunity for growth and innovation. By following the strategies outlined in this article, you can position yourself for success.`,
        article: `# The Complete Guide to ${topic}\n\n## Overview\n\n${topic} is a critical component of modern business strategy. This article delves into the essential elements that make ${topic} successful.\n\n## Main Content\n\n### Section 1: Understanding ${topic}\n\n${topic} encompasses various aspects that require careful consideration. The key is to understand the fundamental principles.\n\n### Section 2: Best Practices\n\nWhen implementing ${topic}, it's important to follow industry best practices and learn from successful examples.\n\n### Section 3: Common Pitfalls\n\nAvoid these common mistakes when working with ${topic}:\n- Lack of proper planning\n- Insufficient research\n- Ignoring feedback\n\n## Final Thoughts\n\n${topic} offers tremendous potential when approached with the right mindset and tools.`,
        'landing-page': `# Welcome to ${topic}\n\n## Transform Your Business Today\n\nDiscover how ${topic} can revolutionize your approach and deliver exceptional results.\n\n### Why Choose ${topic}?\n\n- **Proven Results**: Thousands of businesses trust ${topic}\n- **Expert Support**: Our team is here to help you succeed\n- **Innovative Solutions**: Cutting-edge technology and strategies\n\n### Get Started Now\n\nJoin thousands of satisfied customers who have transformed their business with ${topic}. Start your journey today!`,
        'product-description': `# ${topic}\n\n## Product Overview\n\n${topic} is designed to meet your needs with exceptional quality and performance.\n\n### Key Features\n\n- High-quality materials and construction\n- User-friendly design\n- Excellent value for money\n- Reliable performance\n\n### Benefits\n\nExperience the difference with ${topic}. Perfect for those who demand quality and reliability.\n\n### Specifications\n\n- Premium quality\n- Professional grade\n- Long-lasting durability\n\nOrder now and experience the ${topic} difference!`,
        'social-post': `🚀 Excited to share insights about ${topic}!\n\n✨ Key highlights:\n• Innovation and growth\n• Real-world applications\n• Future opportunities\n\n💡 What are your thoughts on ${topic}? Share in the comments!\n\n#${topic.replace(/\s+/g, '')} #Innovation #Business`
      }

      const content = templates[contentType]
      setGeneratedContent(content)
      setIsGenerating(false)
      showToast('Content generated successfully!', 'success')
    }, 2000)
  }

  const saveContent = () => {
    if (!generatedContent.trim()) {
      showToast('No content to save', 'error')
      return
    }

    const newContent: ContentPiece = {
      id: Date.now().toString(),
      title: topic || 'Untitled',
      content: generatedContent,
      type: contentType,
      createdAt: new Date().toISOString()
    }

    setSavedContent([...savedContent, newContent])
    showToast('Content saved!', 'success')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
    showToast('Copied to clipboard!', 'success')
  }

  const downloadContent = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${topic || 'content'}-${contentType}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Content downloaded!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl font-bold gradient-text">AI Content Writer</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create engaging blog posts, articles, and marketing copy that resonates with your audience and drives conversions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Content Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic/Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Startup Funding Strategies"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <Select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as any)}
                    className="w-full"
                    options={[
                      { value: 'blog', label: 'Blog Post' },
                      { value: 'article', label: 'Article' },
                      { value: 'landing-page', label: 'Landing Page' },
                      { value: 'product-description', label: 'Product Description' },
                      { value: 'social-post', label: 'Social Media Post' },
                    ]}
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
                      { value: 'casual', label: 'Casual' },
                      { value: 'friendly', label: 'Friendly' },
                      { value: 'persuasive', label: 'Persuasive' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Startup founders, Entrepreneurs"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Word Count</label>
                  <Input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    placeholder="800"
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={generateContent}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Writing Tips</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Be specific with your topic</li>
                    <li>• Define your target audience clearly</li>
                    <li>• Choose the right tone for your brand</li>
                    <li>• Review and edit generated content</li>
                    <li>• Add your unique perspective</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Generated Content */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Generated Content</h2>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={saveContent}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadContent}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>

              {isGenerating ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-600">AI is crafting your content...</p>
                </div>
              ) : generatedContent ? (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 font-sans">
                    {generatedContent}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the form and click "Generate Content" to create your content</p>
                </div>
              )}
            </Card>

            {/* Saved Content */}
            {savedContent.length > 0 && (
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Saved Content ({savedContent.length})</h2>
                <div className="space-y-3">
                  {savedContent.slice().reverse().map((content) => (
                    <div key={content.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{content.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{content.type}</Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(content.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setGeneratedContent(content.content)
                            setTopic(content.title)
                            showToast('Content loaded!', 'success')
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

