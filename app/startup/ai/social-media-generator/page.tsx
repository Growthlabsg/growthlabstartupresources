'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { Sparkles, Share2, Copy, Save, Instagram, Twitter, Facebook, Linkedin, Lightbulb } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface SocialPost {
  id: string
  content: string
  platform: string
  createdAt: string
}

export default function SocialMediaGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState<'twitter' | 'linkedin' | 'instagram' | 'facebook'>('twitter')
  const [tone, setTone] = useState<'professional' | 'casual' | 'fun' | 'inspirational'>('professional')
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([])
  const [savedPosts, setSavedPosts] = useState<SocialPost[]>([])

  const platformIcons = {
    twitter: Twitter,
    linkedin: Linkedin,
    instagram: Instagram,
    facebook: Facebook
  }

  const generatePosts = async () => {
    if (!topic.trim()) {
      showToast('Please enter a topic', 'error')
      return
    }

    setIsGenerating(true)
    
    setTimeout(() => {
      const templates = {
        twitter: [
          `🚀 Exciting news about ${topic}! Here's what you need to know:\n\n✨ Key insights\n💡 Actionable tips\n🎯 Real results\n\n#${topic.replace(/\s+/g, '')} #Startup #Innovation`,
          `Just discovered something game-changing about ${topic}:\n\n• Insight 1\n• Insight 2\n• Insight 3\n\nWhat are your thoughts? 👇\n\n#${topic.replace(/\s+/g, '')} #Business`,
          `🔥 Hot take: ${topic} is transforming how we work.\n\nHere's why it matters:\n\n💼 For businesses\n👥 For teams\n📈 For growth\n\n#${topic.replace(/\s+/g, '')} #Tech #Growth`
        ],
        linkedin: [
          `Excited to share insights on ${topic}.\n\nIn my experience, here are the key factors that drive success:\n\n1. Strategic planning\n2. Consistent execution\n3. Continuous improvement\n\nWhat strategies have worked for you?\n\n#${topic.replace(/\s+/g, '')} #Leadership #Business`,
          `Thoughts on ${topic}:\n\nAfter working with numerous companies, I've noticed a pattern in what makes ${topic} successful.\n\nKey takeaways:\n• Focus on value\n• Build relationships\n• Stay adaptable\n\nWould love to hear your perspective.\n\n#${topic.replace(/\s+/g, '')} #Professional #Innovation`,
          `The future of ${topic} looks promising.\n\nHere's what I'm seeing:\n\n📊 Market trends\n💡 Innovation opportunities\n🎯 Growth potential\n\nLet's discuss in the comments.\n\n#${topic.replace(/\s+/g, '')} #Business #Strategy`
        ],
        instagram: [
          `✨ ${topic} ✨\n\nHere's what you need to know:\n\n💫 Key point 1\n🌟 Key point 2\n⚡ Key point 3\n\nSwipe for more 👉\n\n#${topic.replace(/\s+/g, '')} #Startup #Entrepreneur #Business`,
          `🎯 ${topic}\n\nLet's talk about it:\n\n✅ Benefit 1\n✅ Benefit 2\n✅ Benefit 3\n\nWhat do you think? Drop a comment! 💬\n\n#${topic.replace(/\s+/g, '')} #Growth #Success`,
          `🔥 ${topic} 🔥\n\nThis is a game-changer:\n\n💡 Innovation\n🚀 Growth\n📈 Results\n\nTag someone who needs to see this!\n\n#${topic.replace(/\s+/g, '')} #Motivation #Business`
        ],
        facebook: [
          `Excited to share some thoughts on ${topic}!\n\nHere's what I've learned:\n\n• Important point 1\n• Important point 2\n• Important point 3\n\nWhat are your experiences with ${topic}? Share in the comments!\n\n#${topic.replace(/\s+/g, '')}`,
          `Just had a breakthrough moment about ${topic}.\n\nHere's what I discovered:\n\n💡 Insight 1\n💡 Insight 2\n💡 Insight 3\n\nWould love to hear your thoughts!\n\n#${topic.replace(/\s+/g, '')}`,
          `Let's talk about ${topic}.\n\nThis topic is more important than ever:\n\n📌 Point 1\n📌 Point 2\n📌 Point 3\n\nWhat do you think? Comment below!\n\n#${topic.replace(/\s+/g, '')}`
        ]
      }

      const posts = templates[platform]
      const filteredPosts = includeHashtags ? posts : posts.map(p => p.replace(/#\w+/g, '').trim())
      setGeneratedPosts(filteredPosts)
      setIsGenerating(false)
      showToast('Generated 3 social media posts!', 'success')
    }, 1500)
  }

  const savePost = (content: string) => {
    const newPost: SocialPost = {
      id: Date.now().toString(),
      content,
      platform,
      createdAt: new Date().toISOString()
    }

    setSavedPosts([...savedPosts, newPost])
    showToast('Post saved!', 'success')
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
            <h1 className="text-4xl font-bold gradient-text">AI Social Media Post Generator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create engaging social media content across all platforms with AI-powered post suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Post Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Startup funding tips"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <Select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full"
                    options={[
                      { value: 'twitter', label: 'Twitter / X' },
                      { value: 'linkedin', label: 'LinkedIn' },
                      { value: 'instagram', label: 'Instagram' },
                      { value: 'facebook', label: 'Facebook' },
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
                      { value: 'fun', label: 'Fun' },
                      { value: 'inspirational', label: 'Inspirational' },
                    ]}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hashtags"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="hashtags" className="text-sm text-gray-700">
                    Include hashtags
                  </label>
                </div>

                <Button
                  onClick={generatePosts}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Posts'}
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Platform Best Practices</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Twitter: Keep under 280 characters</li>
                    <li>• LinkedIn: Professional, value-driven</li>
                    <li>• Instagram: Visual, engaging</li>
                    <li>• Facebook: Conversational, community-focused</li>
                    <li>• Post at optimal times for engagement</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Generated Posts */}
          <div className="lg:col-span-2">
            {isGenerating ? (
              <Card className="p-6">
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-600">AI is crafting your posts...</p>
                </div>
              </Card>
            ) : generatedPosts.length > 0 ? (
              <div className="space-y-4">
                {generatedPosts.map((post, index) => {
                  const Icon = platformIcons[platform]
                  return (
                    <Card key={index} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary-500" />
                          <h3 className="font-semibold">Post {index + 1}</h3>
                          <Badge variant="outline" className="text-xs">
                            {post.length} characters
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(post)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => savePost(post)}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <pre className="whitespace-pre-wrap text-sm font-sans">{post}</pre>
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="p-6">
                <div className="text-center py-12 text-gray-500">
                  <Share2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the form and click "Generate Posts" to create your content</p>
                </div>
              </Card>
            )}

            {/* Saved Posts */}
            {savedPosts.length > 0 && (
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Saved Posts ({savedPosts.length})</h2>
                <div className="space-y-3">
                  {savedPosts.slice().reverse().map((post) => {
                    const Icon = platformIcons[post.platform as keyof typeof platformIcons]
                    return (
                      <div key={post.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4 text-primary-500" />}
                            <Badge variant="outline" className="text-xs">{post.platform}</Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(post.content)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

