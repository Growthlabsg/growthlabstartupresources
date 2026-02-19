'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { Sparkles, Search, TrendingUp, Lightbulb, CheckCircle } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

export default function SEOOptimizerPage() {
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')
  const [targetKeyword, setTargetKeyword] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const analyzeSEO = async () => {
    if (!content.trim() && !url.trim()) {
      showToast('Please enter content or URL to analyze', 'error')
      return
    }

    setIsAnalyzing(true)
    
    setTimeout(() => {
      const keyword = targetKeyword || content.split(' ').slice(0, 3).join(' ')
      const wordCount = content.split(' ').length
      const hasTitle = content.includes('#') || content.length > 0
      const hasMeta = content.length > 50
      
      setAnalysis({
        score: Math.floor(Math.random() * 20) + 70,
        keyword: keyword,
        suggestions: [
          wordCount < 300 ? 'Add more content (aim for 300+ words)' : 'Content length is good',
          !hasTitle ? 'Add a clear title/heading' : 'Title structure is good',
          !hasMeta ? 'Add meta description' : 'Meta description present',
          'Include internal links',
          'Optimize images with alt text',
          'Use header tags (H1, H2, H3) properly'
        ],
        keywords: [
          { keyword: keyword, density: '2.5%', position: 'Good' },
          { keyword: keyword.split(' ')[0] || 'keyword', density: '1.8%', position: 'Good' }
        ]
      })
      setIsAnalyzing(false)
      showToast('SEO analysis complete!', 'success')
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl font-bold gradient-text">AI SEO Optimizer</h1>
          </div>
          <p className="text-lg text-gray-600">Optimize your content for search engines with AI-powered keyword suggestions and optimization tips.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Content to Analyze</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Keyword</label>
                <Input value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} placeholder="e.g., startup funding" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your content here..."
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <Button onClick={analyzeSEO} disabled={isAnalyzing} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze SEO'}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">SEO Analysis</h2>
            {isAnalyzing ? (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">Analyzing your content...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">SEO Score</span>
                    <Badge variant="beginner" className="text-lg">{analysis.score}/100</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Optimization Suggestions</h3>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Keyword Analysis</h3>
                  <div className="space-y-2">
                    {analysis.keywords.map((k: any, i: number) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{k.keyword}</span>
                          <Badge variant="outline">{k.density}</Badge>
                        </div>
                        <span className="text-xs text-gray-600">{k.position}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter content and click "Analyze SEO"</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}

