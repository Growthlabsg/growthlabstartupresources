'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  Search, ArrowLeft, FileText, BookOpen, Wrench, 
  Calculator, Video, CheckSquare, Filter, X
} from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'tool' | 'guide' | 'template' | 'calculator' | 'video' | 'checklist'
  category: string
  href: string
  tags: string[]
}

// Mock search results - in production this would come from the platform API
const allResources: SearchResult[] = [
  { id: '1', title: 'Pitch Deck Builder', description: 'Create professional pitch decks that impress investors', type: 'tool', category: 'Funding', href: '/startup/pitch-deck-builder', tags: ['pitch', 'deck', 'investor', 'presentation'] },
  { id: '2', title: 'Enhanced Pitch Deck Builder', description: 'AI-powered pitch deck creation with templates', type: 'tool', category: 'Funding', href: '/startup/pitch-deck-builder/enhanced-page', tags: ['pitch', 'deck', 'ai', 'templates'] },
  { id: '3', title: 'Financial Projections', description: 'Build realistic financial models for your startup', type: 'tool', category: 'Finance', href: '/startup/financial-projections', tags: ['financial', 'projections', 'model', 'forecast'] },
  { id: '4', title: 'Business Plan Generator', description: 'Create comprehensive business plans', type: 'tool', category: 'Planning', href: '/startup/business-plan', tags: ['business', 'plan', 'strategy'] },
  { id: '5', title: 'Legal Document Generator', description: 'Generate 54+ legal documents', type: 'tool', category: 'Legal', href: '/startup/legal-documents', tags: ['legal', 'documents', 'contracts', 'nda'] },
  { id: '6', title: 'Funding Navigator', description: 'Find the right funding for your startup', type: 'tool', category: 'Funding', href: '/startup/funding-navigator', tags: ['funding', 'investors', 'grants', 'fundraising'] },
  { id: '7', title: 'Valuation Calculator', description: 'Calculate your startup valuation', type: 'calculator', category: 'Finance', href: '/startup/valuation-calculator', tags: ['valuation', 'calculator', 'startup'] },
  { id: '8', title: 'Burn Rate Calculator', description: 'Track your monthly burn rate', type: 'calculator', category: 'Finance', href: '/startup/burn-rate-calculator', tags: ['burn', 'rate', 'runway', 'cash'] },
  { id: '9', title: 'Customer Discovery Tool', description: 'Conduct user research and validation', type: 'tool', category: 'Validation', href: '/startup/customer-discovery', tags: ['customer', 'discovery', 'research', 'validation'] },
  { id: '10', title: 'Startup Guides Hub', description: 'Comprehensive guides for founders', type: 'guide', category: 'Learning', href: '/startup/guides', tags: ['guides', 'learning', 'startup'] },
  { id: '11', title: 'Idea Validation Toolkit', description: 'Validate your startup idea', type: 'tool', category: 'Validation', href: '/startup/idea-validation', tags: ['idea', 'validation', 'mvp'] },
  { id: '12', title: 'Business Model Canvas', description: 'Design your business model', type: 'template', category: 'Planning', href: '/startup/business-model-canvas', tags: ['business', 'model', 'canvas'] },
  { id: '13', title: 'Marketing Strategy Builder', description: 'Build your marketing strategy', type: 'tool', category: 'Marketing', href: '/startup/marketing/strategy', tags: ['marketing', 'strategy', 'growth'] },
  { id: '14', title: 'Startup Checklist', description: 'Track your startup progress', type: 'checklist', category: 'Planning', href: '/startup/checklist', tags: ['checklist', 'startup', 'progress'] },
  { id: '15', title: 'Cap Table Manager', description: 'Manage equity and ownership', type: 'tool', category: 'Finance', href: '/startup/cap-table', tags: ['cap', 'table', 'equity', 'ownership'] },
]

const typeIcons: Record<string, any> = {
  tool: Wrench,
  guide: BookOpen,
  template: FileText,
  calculator: Calculator,
  video: Video,
  checklist: CheckSquare,
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    if (query) {
      const searchTerms = query.toLowerCase().split(' ')
      const filtered = allResources.filter(resource => {
        const matchesSearch = searchTerms.some(term => 
          resource.title.toLowerCase().includes(term) ||
          resource.description.toLowerCase().includes(term) ||
          resource.tags.some(tag => tag.includes(term))
        )
        const matchesType = !selectedType || resource.type === selectedType
        const matchesCategory = !selectedCategory || resource.category === selectedCategory
        return matchesSearch && matchesType && matchesCategory
      })
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query, selectedType, selectedCategory])

  const categories = [...new Set(allResources.map(r => r.category))]
  const types = [...new Set(allResources.map(r => r.type))]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/startup/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Link>
          <h1 className="text-3xl font-bold mb-4">Search Results</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources, tools, templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-6 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Filter:</span>
          </div>
          
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                !selectedType ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Types
            </button>
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                  selectedType === type ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}s
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                !selectedCategory ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {(selectedType || selectedCategory) && (
            <button
              onClick={() => { setSelectedType(null); setSelectedCategory(null); }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </p>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(result => {
              const Icon = typeIcons[result.type] || FileText
              return (
                <Link key={result.id} href={result.href}>
                  <Card className="h-full hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {result.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="category" className="text-xs">{result.category}</Badge>
                          <Badge variant="outline" className="text-xs capitalize">{result.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{result.description}</p>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : query ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search terms or filters</p>
            <Link href="/">
              <Button>Browse All Resources</Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Enter a search term</h3>
            <p className="text-gray-500">Search for tools, guides, templates, and more</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}

