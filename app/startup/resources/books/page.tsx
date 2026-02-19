'use client'

import React, { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import Link from 'next/link'
import { 
  Book, Star, Heart, ExternalLink, Search, BookOpen, Users, TrendingUp,
  Lightbulb, DollarSign, Target, Award, ArrowLeft, Check, Quote
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

type BookCategory = 'strategy' | 'product' | 'marketing' | 'leadership' | 'growth' | 'fundraising' | 'psychology' | 'biography'

interface StartupBook {
  id: string
  title: string
  author: string
  category: BookCategory
  description: string
  keyTakeaways: string[]
  rating: number
  reviews: number
  pages: number
  year: number
  amazonUrl?: string
  coverColor: string
  quote?: string
  recommended: boolean
}

const categoryInfo: Record<BookCategory, { label: string; color: string }> = {
  'strategy': { label: 'Strategy', color: 'bg-blue-500' },
  'product': { label: 'Product', color: 'bg-green-500' },
  'marketing': { label: 'Marketing', color: 'bg-pink-500' },
  'leadership': { label: 'Leadership', color: 'bg-purple-500' },
  'growth': { label: 'Growth', color: 'bg-orange-500' },
  'fundraising': { label: 'Fundraising', color: 'bg-cyan-500' },
  'psychology': { label: 'Psychology', color: 'bg-amber-500' },
  'biography': { label: 'Biography', color: 'bg-red-500' },
}

const books: StartupBook[] = [
  { id: '1', title: 'Zero to One', author: 'Peter Thiel', category: 'strategy', description: 'Notes on startups, or how to build the future. Thiel argues that creating something truly new is more valuable than iterating on existing ideas.', keyTakeaways: ['Competition destroys profits', 'Aim for monopoly through differentiation', 'Think about secrets others don\'t know', 'Start small and monopolize'], rating: 4.8, reviews: 125000, pages: 224, year: 2014, coverColor: 'from-blue-600 to-indigo-800', quote: 'The best entrepreneurs know this: every great business is built around a secret that\'s hidden from the outside.', recommended: true },
  { id: '2', title: 'The Lean Startup', author: 'Eric Ries', category: 'product', description: 'How today\'s entrepreneurs use continuous innovation to create radically successful businesses through the Build-Measure-Learn loop.', keyTakeaways: ['Build-Measure-Learn cycle', 'Minimum Viable Product (MVP)', 'Validated learning', 'Pivot or persevere decisions'], rating: 4.6, reviews: 98000, pages: 336, year: 2011, coverColor: 'from-green-600 to-emerald-800', quote: 'The only way to win is to learn faster than anyone else.', recommended: true },
  { id: '3', title: 'The Hard Thing About Hard Things', author: 'Ben Horowitz', category: 'leadership', description: 'Practical wisdom for managing the toughest problems business school doesn\'t cover, from a legendary Silicon Valley entrepreneur.', keyTakeaways: ['Embrace the struggle', 'Fire fast and hire slowly', 'Be direct with bad news', 'Build company culture deliberately'], rating: 4.7, reviews: 75000, pages: 304, year: 2014, coverColor: 'from-gray-700 to-gray-900', quote: 'There\'s no recipe for really complicated, dynamic situations.', recommended: true },
  { id: '4', title: 'Crossing the Chasm', author: 'Geoffrey Moore', category: 'marketing', description: 'Marketing and selling high-tech products to mainstream customers. The definitive guide to technology adoption lifecycles.', keyTakeaways: ['Technology adoption lifecycle', 'The chasm between early adopters and majority', 'Bowling alley strategy', 'Whole product concept'], rating: 4.5, reviews: 45000, pages: 288, year: 1991, coverColor: 'from-pink-600 to-rose-800', quote: 'The chasm is where many technology companies fail.', recommended: true },
  { id: '5', title: 'Hooked', author: 'Nir Eyal', category: 'product', description: 'How to build habit-forming products. A practical guide to creating products users can\'t put down.', keyTakeaways: ['Hook Model: Trigger, Action, Variable Reward, Investment', 'Internal vs external triggers', 'Creating user habits', 'Ethical considerations'], rating: 4.4, reviews: 52000, pages: 256, year: 2014, coverColor: 'from-purple-600 to-violet-800', quote: 'Products that create habits enjoy several competitive advantages.', recommended: false },
  { id: '6', title: 'Blitzscaling', author: 'Reid Hoffman', category: 'growth', description: 'The lightning-fast path to building massively valuable companies. Strategies for growing at breakneck speed.', keyTakeaways: ['Prioritize speed over efficiency', 'Embrace chaos and uncertainty', 'Counterintuitive rules for hypergrowth', 'When to blitzscale'], rating: 4.3, reviews: 28000, pages: 336, year: 2018, coverColor: 'from-orange-600 to-red-700', quote: 'Speed is the defining characteristic of blitzscaling.', recommended: false },
  { id: '7', title: 'Venture Deals', author: 'Brad Feld & Jason Mendelson', category: 'fundraising', description: 'Be smarter than your lawyer and venture capitalist. The definitive guide to understanding VC term sheets.', keyTakeaways: ['Understanding term sheets', 'Negotiation strategies', 'VC economics', 'Board dynamics'], rating: 4.7, reviews: 18000, pages: 304, year: 2011, coverColor: 'from-cyan-600 to-teal-800', quote: 'Never negotiate a term sheet without understanding it.', recommended: true },
  { id: '8', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'psychology', description: 'A groundbreaking exploration of the two systems that drive the way we think and make decisions.', keyTakeaways: ['System 1 (fast) vs System 2 (slow) thinking', 'Cognitive biases', 'Prospect theory', 'Heuristics and their limitations'], rating: 4.6, reviews: 185000, pages: 499, year: 2011, coverColor: 'from-amber-600 to-orange-800', quote: 'A reliable way to make people believe in falsehoods is frequent repetition.', recommended: true },
  { id: '9', title: 'Shoe Dog', author: 'Phil Knight', category: 'biography', description: 'A memoir by the creator of Nike. An honest and inspiring story of entrepreneurship, risk, and determination.', keyTakeaways: ['Persistence through failure', 'Importance of team', 'Taking calculated risks', 'Building a global brand'], rating: 4.8, reviews: 142000, pages: 400, year: 2016, coverColor: 'from-red-600 to-rose-800', quote: 'Don\'t tell people how to do things, tell them what to do and let them surprise you.', recommended: true },
  { id: '10', title: 'Good to Great', author: 'Jim Collins', category: 'strategy', description: 'Why some companies make the leap and others don\'t. Based on a five-year research study.', keyTakeaways: ['Level 5 leadership', 'First who, then what', 'Hedgehog concept', 'Flywheel effect'], rating: 4.5, reviews: 95000, pages: 320, year: 2001, coverColor: 'from-blue-700 to-blue-900', quote: 'Good is the enemy of great.', recommended: false },
  { id: '11', title: 'The Mom Test', author: 'Rob Fitzpatrick', category: 'product', description: 'How to talk to customers and learn if your business is a good idea when everyone is lying to you.', keyTakeaways: ['Ask about their life, not your idea', 'Talk about specifics in the past', 'Focus on problems, not solutions', 'Commitment and advancement'], rating: 4.7, reviews: 12000, pages: 130, year: 2013, coverColor: 'from-emerald-600 to-green-800', quote: 'Opinions are worthless.', recommended: true },
  { id: '12', title: 'Measure What Matters', author: 'John Doerr', category: 'leadership', description: 'How Google, Bono, and the Gates Foundation rock the world with OKRs (Objectives and Key Results).', keyTakeaways: ['OKR framework', 'Transparency and alignment', 'Stretch goals', 'Continuous performance management'], rating: 4.4, reviews: 35000, pages: 320, year: 2018, coverColor: 'from-violet-600 to-purple-800', quote: 'Ideas are easy. Execution is everything.', recommended: false },
]

const readingLists = [
  { id: 'first-time', name: 'First-Time Founders', description: 'Essential reads for those just starting out', books: ['1', '2', '11', '3'] },
  { id: 'fundraising', name: 'Fundraising Prep', description: 'Get ready to pitch investors', books: ['7', '1', '2'] },
  { id: 'product', name: 'Product Mastery', description: 'Build products users love', books: ['2', '5', '11'] },
  { id: 'leadership', name: 'Startup Leadership', description: 'Lead your team to success', books: ['3', '12', '10'] },
]

export default function BooksPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [savedBooks, setSavedBooks] = useState<string[]>([])
  const [readBooks, setReadBooks] = useState<string[]>([])
  const [selectedBook, setSelectedBook] = useState<StartupBook | null>(null)

  const tabs = [
    { id: 'all', label: 'All Books', icon: Book },
    { id: 'recommended', label: 'Recommended', icon: Award },
    { id: 'lists', label: 'Reading Lists', icon: BookOpen },
    { id: 'saved', label: 'My List', icon: Heart },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('savedBooks')
    const read = localStorage.getItem('readBooks')
    if (saved) setSavedBooks(JSON.parse(saved))
    if (read) setReadBooks(JSON.parse(read))
  }, [])

  const toggleSave = (id: string) => {
    const updated = savedBooks.includes(id) ? savedBooks.filter(b => b !== id) : [...savedBooks, id]
    setSavedBooks(updated)
    localStorage.setItem('savedBooks', JSON.stringify(updated))
    showToast(savedBooks.includes(id) ? 'Removed from list' : 'Added to reading list!', 'success')
  }

  const toggleRead = (id: string) => {
    const updated = readBooks.includes(id) ? readBooks.filter(b => b !== id) : [...readBooks, id]
    setReadBooks(updated)
    localStorage.setItem('readBooks', JSON.stringify(updated))
    showToast(readBooks.includes(id) ? 'Marked as unread' : 'Marked as read!', 'success')
  }

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || b.category === filterCategory
    const matchesTab = activeTab === 'all' || (activeTab === 'recommended' && b.recommended) || (activeTab === 'saved' && savedBooks.includes(b.id))
    return matchesSearch && matchesCategory && matchesTab
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/startup/resources" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Resources
        </Link>

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="h-10 w-10 text-amber-600" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Startup Book Library
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Curated must-read books for founders, recommended by successful entrepreneurs and investors
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{books.length}</div>
            <div className="text-sm text-gray-600">Total Books</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{readBooks.length}</div>
            <div className="text-sm text-gray-600">Books Read</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{savedBooks.length}</div>
            <div className="text-sm text-gray-600">In Your List</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{readingLists.length}</div>
            <div className="text-sm text-gray-600">Reading Lists</div>
          </Card>
        </div>

        <div className="mb-6">
          <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab !== 'lists' && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search books..." className="w-64" />
            <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              options={[{ value: 'all', label: 'All Categories' }, ...Object.entries(categoryInfo).map(([k, v]) => ({ value: k, label: v.label }))]} />
          </div>
        )}

        {activeTab === 'lists' ? (
          <div className="space-y-6">
            {readingLists.map(list => (
              <Card key={list.id}>
                <h3 className="text-xl font-bold mb-2">{list.name}</h3>
                <p className="text-gray-600 mb-4">{list.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {list.books.map(bookId => {
                    const book = books.find(b => b.id === bookId)
                    if (!book) return null
                    return (
                      <div key={book.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setSelectedBook(book)}>
                        <div className={`w-12 h-16 bg-gradient-to-br ${book.coverColor} rounded flex items-center justify-center text-white font-bold shrink-0`}>
                          {book.title.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{book.title}</h4>
                          <p className="text-xs text-gray-500">{book.author}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedBook(book)}>
                <div className={`h-3 bg-gradient-to-r ${book.coverColor}`} />
                <div className="p-4">
                  <div className="flex gap-4 mb-4">
                    <div className={`w-20 h-28 bg-gradient-to-br ${book.coverColor} rounded-lg flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-lg`}>
                      {book.title.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{book.title}</h3>
                          <p className="text-sm text-gray-600">{book.author}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleSave(book.id) }} className="text-gray-400 hover:text-red-500">
                          {savedBooks.includes(book.id) ? <Heart className="h-5 w-5 fill-current text-red-500" /> : <Heart className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={categoryInfo[book.category].color + ' text-white'}>{categoryInfo[book.category].label}</Badge>
                        {book.recommended && <Badge variant="featured">Must Read</Badge>}
                        {readBooks.includes(book.id) && <Badge variant="new"><Check className="h-3 w-3" /></Badge>}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{book.description}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500 fill-current" /> {book.rating}</span>
                    <span>{book.pages} pages</span>
                    <span>{book.year}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBook(null)}>
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className={`h-4 bg-gradient-to-r ${selectedBook.coverColor}`} />
              <div className="p-6">
                <div className="flex gap-6 mb-6">
                  <div className={`w-32 h-44 bg-gradient-to-br ${selectedBook.coverColor} rounded-lg flex items-center justify-center text-white font-bold text-4xl shrink-0 shadow-xl`}>
                    {selectedBook.title.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{selectedBook.title}</h2>
                    <p className="text-gray-600 mb-2">by {selectedBook.author}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={categoryInfo[selectedBook.category].color + ' text-white'}>{categoryInfo[selectedBook.category].label}</Badge>
                      {selectedBook.recommended && <Badge variant="featured">Must Read</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span><Star className="h-4 w-4 text-yellow-500 fill-current inline" /> {selectedBook.rating} ({(selectedBook.reviews / 1000).toFixed(0)}K reviews)</span>
                      <span>{selectedBook.pages} pages</span>
                      <span>Published {selectedBook.year}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{selectedBook.description}</p>

                {selectedBook.quote && (
                  <div className="p-4 bg-amber-50 rounded-lg mb-4 border-l-4 border-amber-500">
                    <Quote className="h-5 w-5 text-amber-600 mb-2" />
                    <p className="italic text-gray-700">"{selectedBook.quote}"</p>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Key Takeaways</h4>
                  <ul className="space-y-2">
                    {selectedBook.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => toggleSave(selectedBook.id)}>
                    <Heart className={`h-4 w-4 mr-2 ${savedBooks.includes(selectedBook.id) ? 'fill-current' : ''}`} />
                    {savedBooks.includes(selectedBook.id) ? 'In Reading List' : 'Add to List'}
                  </Button>
                  <Button variant="outline" onClick={() => toggleRead(selectedBook.id)}>
                    <Check className={`h-4 w-4 mr-2 ${readBooks.includes(selectedBook.id) ? 'text-green-600' : ''}`} />
                    {readBooks.includes(selectedBook.id) ? 'Read' : 'Mark Read'}
                  </Button>
                  <Button variant="ghost" onClick={() => setSelectedBook(null)}>Close</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}

