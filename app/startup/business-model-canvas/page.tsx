'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Target, 
  Save, 
  Download,
  Edit,
  X,
  Plus,
  FileText,
  Lightbulb,
  Sparkles,
  Printer,
  RefreshCw,
  HelpCircle
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface CanvasBlock {
  id: string
  title: string
  description: string
  items: string[]
  color: string
  icon: any
  guidance: string
}

const defaultCanvasBlocks: CanvasBlock[] = [
  {
    id: 'partners',
    title: 'Key Partners',
    description: 'Who are your key partners and suppliers?',
    items: [],
    color: 'bg-blue-100 border-blue-300',
    icon: '🤝',
    guidance: 'List strategic alliances, joint ventures, key suppliers, and partners that help you create value.',
  },
  {
    id: 'activities',
    title: 'Key Activities',
    description: 'What key activities does your value proposition require?',
    items: [],
    color: 'bg-green-100 border-green-300',
    icon: '⚙️',
    guidance: 'Identify the most important activities in executing your value proposition (e.g., production, problem solving, platform/network).',
  },
  {
    id: 'resources',
    title: 'Key Resources',
    description: 'What key resources does your value proposition require?',
    items: [],
    color: 'bg-yellow-100 border-yellow-300',
    icon: '💎',
    guidance: 'List the most important strategic assets required to make your business model work (physical, intellectual, human, financial).',
  },
  {
    id: 'proposition',
    title: 'Value Proposition',
    description: 'What value do you deliver to customers?',
    items: [],
    color: 'bg-purple-100 border-purple-300',
    icon: '✨',
    guidance: 'Describe the unique value you provide to customers. What problems do you solve? What needs do you satisfy?',
  },
  {
    id: 'relationships',
    title: 'Customer Relationships',
    description: 'What type of relationship do you establish with customers?',
    items: [],
    color: 'bg-pink-100 border-pink-300',
    icon: '💬',
    guidance: 'Define how you interact with customers (personal assistance, self-service, communities, co-creation).',
  },
  {
    id: 'channels',
    title: 'Channels',
    description: 'How do you reach and deliver value to customers?',
    items: [],
    color: 'bg-orange-100 border-orange-300',
    icon: '📡',
    guidance: 'List how you communicate with and reach your customer segments to deliver your value proposition.',
  },
  {
    id: 'segments',
    title: 'Customer Segments',
    description: 'Who are your most important customers?',
    items: [],
    color: 'bg-red-100 border-red-300',
    icon: '👥',
    guidance: 'Identify the different groups of people or organizations you aim to reach and serve.',
  },
  {
    id: 'costs',
    title: 'Cost Structure',
    description: 'What are the most important costs in your business model?',
    items: [],
    color: 'bg-gray-100 border-gray-300',
    icon: '💰',
    guidance: 'List all costs incurred to operate your business model (fixed costs, variable costs, economies of scale).',
  },
  {
    id: 'revenue',
    title: 'Revenue Streams',
    description: 'How does your business generate revenue?',
    items: [],
    color: 'bg-emerald-100 border-emerald-300',
    icon: '💵',
    guidance: 'Identify how your business generates revenue (asset sale, usage fee, subscription, licensing, etc.).',
  },
]

export default function BusinessModelCanvasPage() {
  const [canvasBlocks, setCanvasBlocks] = useState<CanvasBlock[]>(defaultCanvasBlocks)
  const [editingBlock, setEditingBlock] = useState<CanvasBlock | null>(null)
  const [newItem, setNewItem] = useState('')
  const [activeTab, setActiveTab] = useState('canvas')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const tabs = [
    { id: 'canvas', label: 'Canvas', icon: Target },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'guidance', label: 'Guidance', icon: Lightbulb },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('businessModelCanvasData')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (data.blocks) setCanvasBlocks(data.blocks)
        } catch (e) {
          console.error('Error loading saved data:', e)
        }
      }
    }
  }, [])

  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const data = {
        blocks: canvasBlocks,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('businessModelCanvasData', JSON.stringify(data))
      showToast('Canvas saved!', 'success')
    }
  }

  const exportData = () => {
    const data = {
      blocks: canvasBlocks,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `business-model-canvas-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Canvas exported successfully', 'success')
  }

  const exportPDF = () => {
    window.print()
    showToast('Opening print dialog...', 'info')
  }

  const resetCanvas = () => {
    if (confirm('Are you sure you want to reset the canvas? This will clear all your data.')) {
      setCanvasBlocks(defaultCanvasBlocks.map(block => ({ ...block, items: [] })))
      saveToLocalStorage()
      showToast('Canvas reset', 'success')
    }
  }

  const addItem = (blockId: string) => {
    if (!newItem.trim()) {
      showToast('Please enter an item', 'error')
      return
    }
    setCanvasBlocks(canvasBlocks.map(block => 
      block.id === blockId 
        ? { ...block, items: [...block.items, newItem.trim()] }
        : block
    ))
    setNewItem('')
    saveToLocalStorage()
  }

  const deleteItem = (blockId: string, itemIndex: number) => {
    setCanvasBlocks(canvasBlocks.map(block => 
      block.id === blockId 
        ? { ...block, items: block.items.filter((_, idx) => idx !== itemIndex) }
        : block
    ))
    saveToLocalStorage()
  }

  const updateItem = (blockId: string, itemIndex: number, newValue: string) => {
    setCanvasBlocks(canvasBlocks.map(block => 
      block.id === blockId 
        ? { 
            ...block, 
            items: block.items.map((item, idx) => idx === itemIndex ? newValue : item)
          }
        : block
    ))
    saveToLocalStorage()
  }

  const templates = {
    'saas': {
      name: 'SaaS Business Model',
      description: 'Template for Software-as-a-Service businesses',
      blocks: {
        partners: ['Cloud providers (AWS, Azure)', 'Payment processors (Stripe)', 'Marketing agencies', 'Integration partners'],
        activities: ['Software development', 'Customer support', 'Marketing & sales', 'Platform maintenance'],
        resources: ['Development team', 'Cloud infrastructure', 'Customer data', 'Brand & IP'],
        proposition: ['Affordable subscription pricing', 'Easy to use interface', 'Regular feature updates', '24/7 customer support'],
        relationships: ['Self-service onboarding', 'Email support', 'Community forums', 'Account management'],
        channels: ['Website', 'App stores', 'Content marketing', 'Partner referrals'],
        segments: ['Small businesses', 'Mid-market companies', 'Enterprise clients', 'Individual professionals'],
        costs: ['Development salaries', 'Cloud hosting', 'Marketing & advertising', 'Customer support'],
        revenue: ['Monthly subscriptions', 'Annual subscriptions', 'Usage-based pricing', 'Enterprise licenses'],
      }
    },
    'marketplace': {
      name: 'Marketplace Business Model',
      description: 'Template for two-sided marketplace platforms',
      blocks: {
        partners: ['Payment processors', 'Logistics providers', 'Trust & safety services', 'Marketing partners'],
        activities: ['Platform development', 'User acquisition', 'Trust & safety', 'Dispute resolution'],
        resources: ['Platform technology', 'User base', 'Brand reputation', 'Network effects'],
        proposition: ['Connect buyers and sellers', 'Secure transactions', 'Wide selection', 'Competitive pricing'],
        relationships: ['Community building', 'Trust & safety', 'Support services', 'Loyalty programs'],
        channels: ['Mobile app', 'Website', 'Social media', 'Referral programs'],
        segments: ['Buyers', 'Sellers', 'Service providers', 'Enterprise clients'],
        costs: ['Platform development', 'Marketing & acquisition', 'Trust & safety', 'Customer support'],
        revenue: ['Transaction fees', 'Listing fees', 'Premium memberships', 'Advertising revenue'],
      }
    },
    'ecommerce': {
      name: 'E-commerce Business Model',
      description: 'Template for online retail businesses',
      blocks: {
        partners: ['Suppliers & manufacturers', 'Shipping carriers', 'Payment processors', 'Warehouse partners'],
        activities: ['Product sourcing', 'Inventory management', 'Order fulfillment', 'Customer service'],
        resources: ['Product inventory', 'E-commerce platform', 'Warehouse facilities', 'Brand & marketing'],
        proposition: ['Wide product selection', 'Competitive prices', 'Fast shipping', 'Easy returns'],
        relationships: ['Email marketing', 'Loyalty programs', 'Customer reviews', 'Personalized recommendations'],
        channels: ['Online store', 'Mobile app', 'Social media', 'Marketplace platforms'],
        segments: ['Price-conscious shoppers', 'Convenience seekers', 'Brand loyalists', 'Bulk buyers'],
        costs: ['Product costs', 'Shipping & fulfillment', 'Marketing', 'Platform fees'],
        revenue: ['Product sales', 'Shipping fees', 'Membership subscriptions', 'Affiliate commissions'],
      }
    },
    'consulting': {
      name: 'Consulting Business Model',
      description: 'Template for professional services and consulting',
      blocks: {
        partners: ['Industry experts', 'Technology partners', 'Referral networks', 'Training providers'],
        activities: ['Client consulting', 'Project delivery', 'Business development', 'Knowledge management'],
        resources: ['Expert team', 'Methodology & frameworks', 'Client relationships', 'Industry expertise'],
        proposition: ['Expert advice', 'Proven methodologies', 'Industry experience', 'Customized solutions'],
        relationships: ['Long-term partnerships', 'Regular check-ins', 'Training & workshops', 'Ongoing support'],
        channels: ['Direct sales', 'Referrals', 'Industry events', 'Content marketing'],
        segments: ['Enterprise clients', 'Mid-market companies', 'Startups', 'Government agencies'],
        costs: ['Consultant salaries', 'Travel & expenses', 'Marketing', 'Office & tools'],
        revenue: ['Project fees', 'Retainer contracts', 'Hourly billing', 'Training workshops'],
      }
    },
  }

  const applyTemplate = (templateKey: string) => {
    const template = templates[templateKey as keyof typeof templates]
    if (!template) return

    const updatedBlocks = canvasBlocks.map(block => ({
      ...block,
      items: template.blocks[block.id as keyof typeof template.blocks] || []
    }))
    setCanvasBlocks(updatedBlocks)
    setSelectedTemplate(templateKey)
    saveToLocalStorage()
    showToast(`${template.name} template applied!`, 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary-500" />
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
            Business Model Canvas
              </span>
          </h1>
            <Sparkles className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Design and refine your business model using the proven 9-block Business Model Canvas framework.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="w-full overflow-x-auto">
              <SimpleTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={saveToLocalStorage} className="shrink-0">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={exportData} className="shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="outline" size="sm" onClick={exportPDF} className="shrink-0">
                <Printer className="h-4 w-4 mr-2" />
                Print/PDF
              </Button>
              <Button variant="outline" size="sm" onClick={resetCanvas} className="shrink-0">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Tab */}
        {activeTab === 'canvas' && (
          <Card className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Click on any block to add or edit content. The Business Model Canvas helps you visualize and design your business model.
              </p>
            </div>
            
            {/* Business Model Canvas Grid - Classic Layout */}
            <div className="grid grid-cols-9 gap-2">
              {/* Top Row - Infrastructure */}
              <div className="col-span-4">
                <div 
                  onClick={() => setEditingBlock(canvasBlocks.find(b => b.id === 'partners')!)}
                  className={`${canvasBlocks.find(b => b.id === 'partners')?.color} p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all min-h-[150px]`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{canvasBlocks.find(b => b.id === 'partners')?.icon}</span>
                    <h3 className="font-bold text-sm">{canvasBlocks.find(b => b.id === 'partners')?.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{canvasBlocks.find(b => b.id === 'partners')?.description}</p>
                  <div className="space-y-1">
                    {canvasBlocks.find(b => b.id === 'partners')?.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs bg-white/50 p-1 rounded">{item}</div>
                    ))}
                    {canvasBlocks.find(b => b.id === 'partners')!.items.length > 3 && (
                      <div className="text-xs text-gray-500">+{canvasBlocks.find(b => b.id === 'partners')!.items.length - 3} more</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-span-2">
                <div 
                  onClick={() => setEditingBlock(canvasBlocks.find(b => b.id === 'activities')!)}
                  className={`${canvasBlocks.find(b => b.id === 'activities')?.color} p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all min-h-[150px]`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{canvasBlocks.find(b => b.id === 'activities')?.icon}</span>
                    <h3 className="font-bold text-sm">{canvasBlocks.find(b => b.id === 'activities')?.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{canvasBlocks.find(b => b.id === 'activities')?.description}</p>
                  <div className="space-y-1">
                    {canvasBlocks.find(b => b.id === 'activities')?.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs bg-white/50 p-1 rounded">{item}</div>
                    ))}
                    {canvasBlocks.find(b => b.id === 'activities')!.items.length > 3 && (
                      <div className="text-xs text-gray-500">+{canvasBlocks.find(b => b.id === 'activities')!.items.length - 3} more</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-span-3">
                <div 
                  onClick={() => setEditingBlock(canvasBlocks.find(b => b.id === 'resources')!)}
                  className={`${canvasBlocks.find(b => b.id === 'resources')?.color} p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all min-h-[150px]`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{canvasBlocks.find(b => b.id === 'resources')?.icon}</span>
                    <h3 className="font-bold text-sm">{canvasBlocks.find(b => b.id === 'resources')?.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{canvasBlocks.find(b => b.id === 'resources')?.description}</p>
                  <div className="space-y-1">
                    {canvasBlocks.find(b => b.id === 'resources')?.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs bg-white/50 p-1 rounded">{item}</div>
                    ))}
                    {canvasBlocks.find(b => b.id === 'resources')!.items.length > 3 && (
                      <div className="text-xs text-gray-500">+{canvasBlocks.find(b => b.id === 'resources')!.items.length - 3} more</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Row - Value Proposition */}
              <div className="col-span-4">
                <div 
                  onClick={() => setEditingBlock(canvasBlocks.find(b => b.id === 'proposition')!)}
                  className={`${canvasBlocks.find(b => b.id === 'proposition')?.color} p-6 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all min-h-[200px]`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{canvasBlocks.find(b => b.id === 'proposition')?.icon}</span>
                    <h3 className="font-bold text-lg">{canvasBlocks.find(b => b.id === 'proposition')?.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{canvasBlocks.find(b => b.id === 'proposition')?.description}</p>
                  <div className="space-y-2">
                    {canvasBlocks.find(b => b.id === 'proposition')?.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="text-sm bg-white/50 p-2 rounded font-medium">{item}</div>
                    ))}
                    {canvasBlocks.find(b => b.id === 'proposition')!.items.length > 4 && (
                      <div className="text-xs text-gray-500">+{canvasBlocks.find(b => b.id === 'proposition')!.items.length - 4} more</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-span-2">
                <div 
                  onClick={() => setEditingBlock(canvasBlocks.find(b => b.id === 'relationships')!)}
                  className={`${canvasBlocks.find(b => b.id === 'relationships')?.color} p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all min-h-[200px]`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{canvasBlocks.find(b => b.id === 'relationships')?.icon}</span>
                    <h3 className="font-bold text-sm">{canvasBlocks.find(b => b.id === 'relationships')?.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{canvasBlocks.find(b => b.id === 'relationships')?.description}</p>
                  <div className="space-y-1">
                    {canvasBlocks.find(b => b.id === 'relationships')?.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs bg-white/50 p-1 rounded">{item}</div>
                    ))}
                    {canvasBlocks.find(b => b.id === 'relationships')!.items.length > 3 && (
                      <div className="text-xs text-gray-500">+{canvasBlocks.find(b => b.id === 'relationships')!.items.length - 3} more</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-span-3">
                <div 
                  onClick={() => setEditingBlock(canvasBlocks.find(b => b.id === 'channels')!)}
                  className={`${canvasBlocks.find(b => b.id === 'channels')?.color} p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all min-h-[200px]`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{canvasBlocks.find(b => b.id === 'channels')?.icon}</span>
                    <h3 className="font-bold text-sm">{canvasBlocks.find(b => b.id === 'channels')?.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{canvasBlocks.find(b => b.id === 'channels')?.description}</p>
                  <div className="space-y-1">
                    {canvasBlocks.find(b => b.id === 'channels')?.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs bg-white/50 p-1 rounded">{item}</div>
                    ))}
                    {canvasBlocks.find(b => b.id === 'channels')!.items.length > 3 && (
                      <div className="text-xs text-gray-500">+{canvasBlocks.find(b => b.id === 'channels')!.items.length - 3} more</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Row - Customers & Finance */}
              <div className="col-span-4">
                <div 
                  onClick={() => setEditingBlock(canvasBlocks.find(b => b.id === 'segments')!)}
                  className={`${canvasBlocks.find(b => b.id === 'segments')?.color} p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all min-h-[150px]`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{canvasBlocks.find(b => b.id === 'segments')?.icon}</span>
                    <h3 className="font-bold text-sm">{canvasBlocks.find(b => b.id === 'segments')?.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{canvasBlocks.find(b => b.id === 'segments')?.description}</p>
                  <div className="space-y-1">
                    {canvasBlocks.find(b => b.id === 'segments')?.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs bg-white/50 p-1 rounded">{item}</div>
                    ))}
                    {canvasBlocks.find(b => b.id === 'segments')!.items.length > 3 && (
                      <div className="text-xs text-gray-500">+{canvasBlocks.find(b => b.id === 'segments')!.items.length - 3} more</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-span-5 grid grid-cols-2 gap-2">
                <div 
                  onClick={() => setEditingBlock(canvasBlocks.find(b => b.id === 'costs')!)}
                  className={`${canvasBlocks.find(b => b.id === 'costs')?.color} p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all min-h-[150px]`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{canvasBlocks.find(b => b.id === 'costs')?.icon}</span>
                    <h3 className="font-bold text-sm">{canvasBlocks.find(b => b.id === 'costs')?.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{canvasBlocks.find(b => b.id === 'costs')?.description}</p>
                  <div className="space-y-1">
                    {canvasBlocks.find(b => b.id === 'costs')?.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs bg-white/50 p-1 rounded">{item}</div>
                    ))}
                    {canvasBlocks.find(b => b.id === 'costs')!.items.length > 3 && (
                      <div className="text-xs text-gray-500">+{canvasBlocks.find(b => b.id === 'costs')!.items.length - 3} more</div>
                    )}
                  </div>
                </div>
                
                <div 
                  onClick={() => setEditingBlock(canvasBlocks.find(b => b.id === 'revenue')!)}
                  className={`${canvasBlocks.find(b => b.id === 'revenue')?.color} p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all min-h-[150px]`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{canvasBlocks.find(b => b.id === 'revenue')?.icon}</span>
                    <h3 className="font-bold text-sm">{canvasBlocks.find(b => b.id === 'revenue')?.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{canvasBlocks.find(b => b.id === 'revenue')?.description}</p>
                  <div className="space-y-1">
                    {canvasBlocks.find(b => b.id === 'revenue')?.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs bg-white/50 p-1 rounded">{item}</div>
                    ))}
                    {canvasBlocks.find(b => b.id === 'revenue')!.items.length > 3 && (
                      <div className="text-xs text-gray-500">+{canvasBlocks.find(b => b.id === 'revenue')!.items.length - 3} more</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Edit Block Modal */}
        {editingBlock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <Card className="max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 border-b">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{editingBlock.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold">{editingBlock.title}</h3>
                    <p className="text-sm text-gray-600">{editingBlock.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditingBlock(null)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto pr-2">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-800">{editingBlock.guidance}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add New Item</label>
                  <div className="flex gap-2">
                    <Input
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addItem(editingBlock.id)
                        }
                      }}
                      placeholder="Enter item..."
                    />
                    <Button onClick={() => addItem(editingBlock.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items ({editingBlock.items.length})
                  </label>
                  {editingBlock.items.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p>No items yet. Add your first item above.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {editingBlock.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Input
                            value={item}
                            onChange={(e) => updateItem(editingBlock.id, idx, e.target.value)}
                            onBlur={() => saveToLocalStorage()}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(editingBlock.id, idx)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t sticky bottom-0 bg-white mt-4">
                <Button onClick={() => setEditingBlock(null)} className="flex-1 min-w-[120px]">
                  Done
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Business Model Templates</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Choose a template to quickly populate your Business Model Canvas with industry-specific examples.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(templates).map(([key, template]) => (
                  <Card key={key} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {Object.values(template.blocks).reduce((sum, items) => sum + items.length, 0)} items
                          </Badge>
                          {selectedTemplate === key && (
                            <Badge variant="new" className="text-xs">Applied</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => applyTemplate(key)}>
                      Apply Template
                    </Button>
                  </Card>
            ))}
          </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">About Templates</h4>
                    <p className="text-sm text-blue-800">
                      Templates provide a starting point with example content for each block. You can modify or remove any items after applying a template.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Guidance Tab */}
        {activeTab === 'guidance' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="h-6 w-6 text-primary-500 shrink-0" />
                <h2 className="text-2xl font-bold">Canvas Guidance</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {canvasBlocks.map((block) => (
                  <Card key={block.id} className={`p-4 ${block.color} border-2`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{block.icon}</span>
                      <h3 className="font-bold">{block.title}</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{block.description}</p>
                    <div className="p-3 bg-white/50 rounded-lg">
                      <p className="text-xs text-gray-600">{block.guidance}</p>
                    </div>
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        {block.items.length} items
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50">
                  <h3 className="font-bold text-lg mb-3">How to Use the Business Model Canvas</h3>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary-600">1.</span>
                      <span>Start with the Value Proposition - this is the core of your business model</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary-600">2.</span>
                      <span>Define your Customer Segments - who are you creating value for?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary-600">3.</span>
                      <span>Identify Channels - how will you reach your customers?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary-600">4.</span>
                      <span>Establish Customer Relationships - how will you interact with customers?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary-600">5.</span>
                      <span>Map Revenue Streams - how will you make money?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary-600">6.</span>
                      <span>List Key Resources - what do you need to deliver value?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary-600">7.</span>
                      <span>Define Key Activities - what must you do to deliver value?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary-600">8.</span>
                      <span>Identify Key Partners - who can help you create value?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary-600">9.</span>
                      <span>Calculate Cost Structure - what are your major costs?</span>
                    </li>
                  </ol>
                </Card>

                <Card className="p-6 bg-yellow-50 border-2 border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Best Practices</h4>
                      <ul className="space-y-1 text-sm text-yellow-800">
                        <li>• Be specific and concrete - avoid vague statements</li>
                        <li>• Focus on what makes your business model unique</li>
                        <li>• Regularly update your canvas as your business evolves</li>
                        <li>• Use the canvas to identify gaps and opportunities</li>
                        <li>• Share with your team for alignment and feedback</li>
                        <li>• Test different business model variations</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
        </Card>
          </div>
        )}
      </div>
    </main>
  )
}
