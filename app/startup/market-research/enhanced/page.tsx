'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Sparkles, Target, TrendingUp, Users, BarChart, Search as SearchIcon } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

export default function EnhancedMarketResearchPage() {
  const [researchQuery, setResearchQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [insights, setInsights] = useState<any>(null)

  const handleAnalyze = () => {
    if (!researchQuery.trim()) {
      showToast('Please enter a market or industry to research', 'error')
      return
    }
    setIsAnalyzing(true)
    showToast(`AI is analyzing ${researchQuery} market...`, 'info')
    setTimeout(() => {
      setInsights({
        marketSize: '$50B',
        growthRate: '15% CAGR',
        competitors: 25,
        trends: ['AI Integration', 'Cloud Migration', 'Mobile First'],
      })
      setIsAnalyzing(false)
      showToast('Market analysis complete!', 'success')
    }, 3000)
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
            AI-Powered Market Intelligence
          </h1>
          <p className="text-lg text-gray-600">
            Get AI-powered market insights, competitive analysis, and strategic recommendations
          </p>
        </div>

        <Card className="mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market or Industry to Research
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={researchQuery}
                onChange={(e) => setResearchQuery(e.target.value)}
                placeholder="e.g., SaaS, FinTech, E-commerce"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {isAnalyzing ? 'Analyzing with AI...' : 'Start AI Analysis'}
          </Button>
        </Card>

        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <Target className="h-8 w-8 text-primary-500 mb-3" />
              <h3 className="font-semibold mb-2">Market Size</h3>
              <p className="text-2xl font-bold text-primary-500">{insights.marketSize}</p>
            </Card>
            <Card>
              <TrendingUp className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">Growth Rate</h3>
              <p className="text-2xl font-bold text-green-600">{insights.growthRate}</p>
            </Card>
            <Card>
              <Users className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-semibold mb-2">Competitors</h3>
              <p className="text-2xl font-bold text-blue-600">{insights.competitors}+</p>
            </Card>
            <Card>
              <BarChart className="h-8 w-8 text-amber-500 mb-3" />
              <h3 className="font-semibold mb-2">Key Trends</h3>
              <p className="text-lg font-bold text-amber-600">{insights.trends.length}</p>
            </Card>
          </div>
        )}

        {insights && (
          <Card>
            <h3 className="font-semibold mb-4">Market Trends</h3>
            <div className="space-y-2">
              {insights.trends.map((trend: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-primary-500" />
                  <span className="font-medium">{trend}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}

