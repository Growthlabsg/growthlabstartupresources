'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Link from 'next/link'
import { Sparkles, Database, Settings, CheckCircle, Circle, Star, ArrowRight, Download, Zap, Brain, MessageSquare, Image, FileText, Code, BarChart, BookOpen, ExternalLink, Cpu, Layers, Activity, Eye, Mic, Globe, Target, DollarSign, AlertCircle } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

interface AITool {
  id: string
  name: string
  category: string
  description: string
  capabilities: string[]
  useCases: string[]
  pricing: string
  apiAvailable: boolean
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  popularity: number
  link: string
}

interface UseCase {
  id: string
  title: string
  description: string
  category: string
  tools: string[]
  complexity: 'simple' | 'moderate' | 'complex'
  timeToImplement: string
}

interface AIStack {
  id: string
  name: string
  description: string
  type: string
  components: string[]
  estimatedCost: string
  recommended: boolean
}

const categories = [
  { id: 'llm', name: 'Large Language Models', icon: MessageSquare, description: 'Text generation and understanding' },
  { id: 'image', name: 'Image & Vision', icon: Image, description: 'Image generation and analysis' },
  { id: 'audio', name: 'Audio & Speech', icon: Mic, description: 'Speech recognition and synthesis' },
  { id: 'ml-platform', name: 'ML Platforms', icon: Cpu, description: 'End-to-end ML development' },
  { id: 'vector-db', name: 'Vector Databases', icon: Database, description: 'Semantic search and embeddings' },
  { id: 'framework', name: 'AI Frameworks', icon: Code, description: 'Development libraries and tools' },
  { id: 'mlops', name: 'MLOps', icon: Settings, description: 'Model deployment and monitoring' },
]

const aiTools: AITool[] = [
  // LLMs
  { id: 'openai', name: 'OpenAI API', category: 'llm', description: 'GPT-4, GPT-3.5, and other models for text generation, chat, and more', capabilities: ['Text generation', 'Chat completion', 'Embeddings', 'Function calling'], useCases: ['Chatbots', 'Content generation', 'Code assistance', 'Analysis'], pricing: 'Pay per token', apiAvailable: true, difficulty: 'beginner', popularity: 98, link: 'https://platform.openai.com' },
  { id: 'anthropic', name: 'Anthropic Claude', category: 'llm', description: 'Claude 3 family of models with strong reasoning and safety', capabilities: ['Long context', 'Vision', 'Reasoning', 'Coding'], useCases: ['Analysis', 'Writing', 'Coding', 'Research'], pricing: 'Pay per token', apiAvailable: true, difficulty: 'beginner', popularity: 90, link: 'https://www.anthropic.com' },
  { id: 'google-ai', name: 'Google AI (Gemini)', category: 'llm', description: 'Multimodal AI models from Google', capabilities: ['Text', 'Images', 'Audio', 'Video'], useCases: ['Multimodal apps', 'Search', 'Assistants'], pricing: 'Pay per token', apiAvailable: true, difficulty: 'intermediate', popularity: 85, link: 'https://ai.google.dev' },
  { id: 'mistral', name: 'Mistral AI', category: 'llm', description: 'Open-weight models with strong performance', capabilities: ['Text generation', 'Code', 'Function calling'], useCases: ['Open-source LLM apps', 'Self-hosting'], pricing: 'Free (open) + API pricing', apiAvailable: true, difficulty: 'intermediate', popularity: 75, link: 'https://mistral.ai' },
  { id: 'llama', name: 'Meta Llama', category: 'llm', description: 'Open-source LLMs from Meta for self-hosting', capabilities: ['Text generation', 'Code', 'Reasoning'], useCases: ['Self-hosted apps', 'Fine-tuning', 'Research'], pricing: 'Free (self-hosted)', apiAvailable: false, difficulty: 'advanced', popularity: 85, link: 'https://llama.meta.com' },
  { id: 'cohere', name: 'Cohere', category: 'llm', description: 'Enterprise-focused NLP with RAG capabilities', capabilities: ['Generate', 'Embed', 'Rerank', 'Classify'], useCases: ['Enterprise search', 'RAG', 'Classification'], pricing: 'Pay per API call', apiAvailable: true, difficulty: 'intermediate', popularity: 70, link: 'https://cohere.com' },
  
  // Image
  { id: 'dalle', name: 'DALL-E 3', category: 'image', description: 'OpenAI\'s text-to-image generation model', capabilities: ['Text-to-image', 'Inpainting', 'Variations'], useCases: ['Marketing', 'Design', 'Content creation'], pricing: 'Pay per image', apiAvailable: true, difficulty: 'beginner', popularity: 92, link: 'https://platform.openai.com/docs/guides/images' },
  { id: 'midjourney', name: 'Midjourney', category: 'image', description: 'High-quality artistic image generation', capabilities: ['Text-to-image', 'Stylization', 'Upscaling'], useCases: ['Art', 'Design', 'Marketing'], pricing: 'Subscription', apiAvailable: false, difficulty: 'beginner', popularity: 95, link: 'https://www.midjourney.com' },
  { id: 'stability', name: 'Stability AI', category: 'image', description: 'Stable Diffusion and other open models', capabilities: ['Text-to-image', 'Inpainting', 'ControlNet'], useCases: ['Self-hosted generation', 'Fine-tuning'], pricing: 'Free (open) + API', apiAvailable: true, difficulty: 'intermediate', popularity: 88, link: 'https://stability.ai' },
  { id: 'replicate', name: 'Replicate', category: 'image', description: 'Run open-source ML models in the cloud', capabilities: ['Image generation', 'Video', 'Audio'], useCases: ['Model hosting', 'Quick prototyping'], pricing: 'Pay per prediction', apiAvailable: true, difficulty: 'beginner', popularity: 80, link: 'https://replicate.com' },
  
  // Audio
  { id: 'whisper', name: 'OpenAI Whisper', category: 'audio', description: 'State-of-the-art speech recognition', capabilities: ['Speech-to-text', 'Translation', 'Timestamps'], useCases: ['Transcription', 'Subtitles', 'Voice apps'], pricing: 'Pay per minute', apiAvailable: true, difficulty: 'beginner', popularity: 90, link: 'https://platform.openai.com/docs/guides/speech-to-text' },
  { id: 'elevenlabs', name: 'ElevenLabs', category: 'audio', description: 'AI voice generation and cloning', capabilities: ['Text-to-speech', 'Voice cloning', 'Dubbing'], useCases: ['Voiceovers', 'Audiobooks', 'Podcasts'], pricing: 'Subscription + usage', apiAvailable: true, difficulty: 'beginner', popularity: 88, link: 'https://elevenlabs.io' },
  { id: 'assemblyai', name: 'AssemblyAI', category: 'audio', description: 'Speech recognition and audio intelligence', capabilities: ['Transcription', 'Speaker diarization', 'Summarization'], useCases: ['Meetings', 'Podcasts', 'Call centers'], pricing: 'Pay per hour', apiAvailable: true, difficulty: 'beginner', popularity: 78, link: 'https://www.assemblyai.com' },
  
  // ML Platforms
  { id: 'huggingface', name: 'Hugging Face', category: 'ml-platform', description: 'Open-source ML platform with model hub', capabilities: ['Model hosting', 'Transformers', 'Datasets', 'Spaces'], useCases: ['ML development', 'Model sharing', 'Fine-tuning'], pricing: 'Free + paid tiers', apiAvailable: true, difficulty: 'intermediate', popularity: 95, link: 'https://huggingface.co' },
  { id: 'aws-sagemaker', name: 'AWS SageMaker', category: 'ml-platform', description: 'End-to-end ML platform on AWS', capabilities: ['Training', 'Hosting', 'MLOps', 'JumpStart'], useCases: ['Enterprise ML', 'Production models'], pricing: 'Pay per usage', apiAvailable: true, difficulty: 'advanced', popularity: 85, link: 'https://aws.amazon.com/sagemaker' },
  { id: 'vertex-ai', name: 'Google Vertex AI', category: 'ml-platform', description: 'Unified ML platform on Google Cloud', capabilities: ['AutoML', 'Custom training', 'Pipelines', 'Model Garden'], useCases: ['Enterprise ML', 'AutoML', 'LLM apps'], pricing: 'Pay per usage', apiAvailable: true, difficulty: 'advanced', popularity: 80, link: 'https://cloud.google.com/vertex-ai' },
  
  // Vector Databases
  { id: 'pinecone', name: 'Pinecone', category: 'vector-db', description: 'Managed vector database for AI apps', capabilities: ['Vector search', 'Filtering', 'Namespaces', 'Serverless'], useCases: ['RAG', 'Semantic search', 'Recommendations'], pricing: 'Free tier + pay per usage', apiAvailable: true, difficulty: 'beginner', popularity: 90, link: 'https://www.pinecone.io' },
  { id: 'weaviate', name: 'Weaviate', category: 'vector-db', description: 'Open-source vector database', capabilities: ['Vector search', 'Hybrid search', 'ML modules'], useCases: ['RAG', 'Semantic search', 'Self-hosted'], pricing: 'Free (self-hosted)', apiAvailable: true, difficulty: 'intermediate', popularity: 78, link: 'https://weaviate.io' },
  { id: 'chroma', name: 'Chroma', category: 'vector-db', description: 'Lightweight embedding database', capabilities: ['Embeddings', 'Metadata filtering', 'Local-first'], useCases: ['Prototyping', 'Local RAG', 'Development'], pricing: 'Free', apiAvailable: true, difficulty: 'beginner', popularity: 75, link: 'https://www.trychroma.com' },
  { id: 'qdrant', name: 'Qdrant', category: 'vector-db', description: 'High-performance vector search engine', capabilities: ['Vector search', 'Filtering', 'Quantization'], useCases: ['Production search', 'Self-hosted'], pricing: 'Free (self-hosted)', apiAvailable: true, difficulty: 'intermediate', popularity: 72, link: 'https://qdrant.tech' },
  
  // Frameworks
  { id: 'langchain', name: 'LangChain', category: 'framework', description: 'Framework for LLM-powered applications', capabilities: ['Chains', 'Agents', 'Memory', 'Tools'], useCases: ['Chatbots', 'RAG', 'Agents'], pricing: 'Free (open source)', apiAvailable: false, difficulty: 'intermediate', popularity: 92, link: 'https://langchain.com' },
  { id: 'llamaindex', name: 'LlamaIndex', category: 'framework', description: 'Data framework for LLM applications', capabilities: ['Data ingestion', 'Indexing', 'Query engines'], useCases: ['RAG', 'Document QA', 'Knowledge bases'], pricing: 'Free (open source)', apiAvailable: false, difficulty: 'intermediate', popularity: 85, link: 'https://www.llamaindex.ai' },
  { id: 'pytorch', name: 'PyTorch', category: 'framework', description: 'Deep learning framework by Meta', capabilities: ['Neural networks', 'Training', 'Inference', 'Research'], useCases: ['Custom models', 'Research', 'Fine-tuning'], pricing: 'Free', apiAvailable: false, difficulty: 'advanced', popularity: 95, link: 'https://pytorch.org' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'framework', description: 'End-to-end ML platform by Google', capabilities: ['Training', 'Serving', 'Mobile', 'Web'], useCases: ['Production ML', 'Edge AI', 'Research'], pricing: 'Free', apiAvailable: false, difficulty: 'advanced', popularity: 88, link: 'https://www.tensorflow.org' },
  
  // MLOps
  { id: 'mlflow', name: 'MLflow', category: 'mlops', description: 'Open-source MLOps platform', capabilities: ['Tracking', 'Projects', 'Models', 'Registry'], useCases: ['Experiment tracking', 'Model management'], pricing: 'Free (open source)', apiAvailable: false, difficulty: 'intermediate', popularity: 85, link: 'https://mlflow.org' },
  { id: 'weights-biases', name: 'Weights & Biases', category: 'mlops', description: 'ML experiment tracking and visualization', capabilities: ['Tracking', 'Sweeps', 'Artifacts', 'Reports'], useCases: ['Experiment tracking', 'Hyperparameter tuning'], pricing: 'Free tier available', apiAvailable: true, difficulty: 'beginner', popularity: 88, link: 'https://wandb.ai' },
  { id: 'modal', name: 'Modal', category: 'mlops', description: 'Cloud platform for AI/ML code', capabilities: ['Serverless GPU', 'Deployment', 'Scheduling'], useCases: ['Model serving', 'Batch inference'], pricing: 'Pay per usage', apiAvailable: true, difficulty: 'intermediate', popularity: 75, link: 'https://modal.com' },
]

const aiStacks: AIStack[] = [
  {
    id: 'chatbot',
    name: 'AI Chatbot Stack',
    description: 'Build conversational AI applications with context and memory',
    type: 'Chatbot',
    components: ['OpenAI/Anthropic', 'LangChain', 'Pinecone', 'Vercel AI SDK'],
    estimatedCost: '$50-500/month',
    recommended: true
  },
  {
    id: 'rag',
    name: 'RAG Application Stack',
    description: 'Retrieval-Augmented Generation for document Q&A',
    type: 'RAG',
    components: ['OpenAI Embeddings', 'Pinecone/Chroma', 'LlamaIndex', 'Next.js'],
    estimatedCost: '$20-200/month',
    recommended: true
  },
  {
    id: 'image-gen',
    name: 'Image Generation Stack',
    description: 'Generate and edit images with AI',
    type: 'Image',
    components: ['DALL-E 3 / Stable Diffusion', 'Replicate', 'Cloudflare R2'],
    estimatedCost: '$30-300/month',
    recommended: false
  },
  {
    id: 'voice-ai',
    name: 'Voice AI Stack',
    description: 'Speech-to-text and text-to-speech applications',
    type: 'Voice',
    components: ['Whisper', 'ElevenLabs', 'AssemblyAI'],
    estimatedCost: '$50-500/month',
    recommended: false
  },
  {
    id: 'ml-pipeline',
    name: 'Custom ML Pipeline',
    description: 'Train and deploy custom machine learning models',
    type: 'Custom ML',
    components: ['PyTorch', 'Hugging Face', 'MLflow', 'AWS SageMaker'],
    estimatedCost: '$100-1000+/month',
    recommended: false
  },
]

const useCases: UseCase[] = [
  { id: '1', title: 'Customer Support Chatbot', description: 'AI-powered support with knowledge base integration', category: 'Chatbot', tools: ['OpenAI', 'LangChain', 'Pinecone'], complexity: 'moderate', timeToImplement: '2-4 weeks' },
  { id: '2', title: 'Document Q&A System', description: 'Answer questions from company documents', category: 'RAG', tools: ['OpenAI', 'LlamaIndex', 'Chroma'], complexity: 'simple', timeToImplement: '1-2 weeks' },
  { id: '3', title: 'Content Generation', description: 'Generate blog posts, marketing copy, and more', category: 'Content', tools: ['OpenAI', 'Anthropic'], complexity: 'simple', timeToImplement: '1 week' },
  { id: '4', title: 'Image Generation Pipeline', description: 'Generate product images and marketing visuals', category: 'Image', tools: ['DALL-E', 'Stable Diffusion'], complexity: 'moderate', timeToImplement: '2-3 weeks' },
  { id: '5', title: 'Voice Transcription Service', description: 'Transcribe meetings and calls automatically', category: 'Audio', tools: ['Whisper', 'AssemblyAI'], complexity: 'simple', timeToImplement: '1 week' },
  { id: '6', title: 'Semantic Search', description: 'AI-powered search across your content', category: 'Search', tools: ['OpenAI Embeddings', 'Pinecone'], complexity: 'moderate', timeToImplement: '2-3 weeks' },
]

export default function AIMLPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [showApiOnly, setShowApiOnly] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedAITools')
      if (saved) {
        setSelectedTools(JSON.parse(saved))
      }
    }
  }, [])

  const toggleTool = (toolId: string) => {
    const updated = selectedTools.includes(toolId)
      ? selectedTools.filter(id => id !== toolId)
      : [...selectedTools, toolId]
    setSelectedTools(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedAITools', JSON.stringify(updated))
    }
    showToast(
      selectedTools.includes(toolId) ? 'Tool removed' : 'Tool added',
      'success'
    )
  }

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = difficultyFilter === 'all' || tool.difficulty === difficultyFilter
    const matchesApi = !showApiOnly || tool.apiAvailable
    return matchesCategory && matchesSearch && matchesDifficulty && matchesApi
  })

  const exportStack = () => {
    const tools = aiTools.filter(t => selectedTools.includes(t.id))
    const data = {
      exportDate: new Date().toISOString(),
      tools: tools.map(t => ({
        name: t.name,
        category: t.category,
        link: t.link
      }))
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-stack-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('AI stack exported!', 'success')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="featured" className="text-sm">AI & ML</Badge>
            <Link href="/startup/tech/stack-builder">
              <Badge variant="outline" className="text-sm cursor-pointer hover:bg-gray-100">
                Tech Stack Builder <ArrowRight className="h-3 w-3 ml-1 inline" />
              </Badge>
            </Link>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            AI & ML Integration
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Integrate artificial intelligence into your startup. Explore LLMs, image generation, and ML platforms.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{aiTools.length}</div>
            <div className="text-sm text-gray-600">AI Tools</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-500 mb-1">{useCases.length}</div>
            <div className="text-sm text-gray-600">Use Cases</div>
          </Card>
          <Card className="p-4 text-center bg-primary-50">
            <div className="text-3xl font-bold text-primary-500 mb-1">{selectedTools.length}</div>
            <div className="text-sm text-gray-600">Selected</div>
          </Card>
        </div>

        {/* AI Stacks */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-500" />
            AI Stack Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiStacks.map(stack => (
              <Card 
                key={stack.id}
                className={`p-4 hover:shadow-lg transition-all ${stack.recommended ? 'border-primary-300' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold">{stack.name}</h3>
                    <Badge variant="outline" className="text-xs mt-1">{stack.type}</Badge>
                  </div>
                  {stack.recommended && (
                    <Badge variant="new" className="text-xs">Recommended</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{stack.description}</p>
                <div className="text-xs text-gray-500 mb-2">
                  <strong>Components:</strong> {stack.components.join(', ')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-600">{stack.estimatedCost}</span>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Use Cases */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary-500" />
            Common Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map(useCase => (
              <Card key={useCase.id} className="p-4">
                <h3 className="font-bold mb-1">{useCase.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{useCase.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {useCase.tools.map((tool, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{tool}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{useCase.complexity}</span>
                  <span>{useCase.timeToImplement}</span>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    selectedCategory === 'all' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm font-medium">All Tools</span>
                </button>
                {categories.map(cat => {
                  const Icon = cat.icon
                  const count = aiTools.filter(t => t.category === cat.id).length
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        selectedCategory === cat.id ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{cat.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{count}</Badge>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                  <Input
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
                  <Select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Levels' },
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' },
                    ]}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showApiOnly}
                    onChange={(e) => setShowApiOnly(e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">API Available Only</span>
                </label>
              </div>
            </Card>

            {selectedTools.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  AI Stack ({selectedTools.length})
                </h3>
                <div className="space-y-2 mb-4">
                  {aiTools.filter(t => selectedTools.includes(t.id)).map(tool => (
                    <div 
                      key={tool.id}
                      className="flex items-center justify-between p-2 bg-primary-50 rounded-lg"
                    >
                      <span className="text-sm font-medium">{tool.name}</span>
                      <button onClick={() => toggleTool(tool.id)}>
                        <span className="text-xs text-red-500 hover:underline">Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={exportStack}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
              </Button>
              </Card>
            )}

            {/* Tips */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-purple-500" />
                AI Integration Tips
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Start with hosted APIs before self-hosting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Monitor costs and set usage limits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Implement caching for repeated queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use streaming for better UX</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Tool Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTools.map(tool => {
                const isSelected = selectedTools.includes(tool.id)
                return (
                  <Card 
                    key={tool.id}
                    className={`p-4 hover:shadow-lg transition-all ${isSelected ? 'border-primary-500 bg-primary-50/50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{tool.name}</h3>
                          {tool.popularity >= 90 && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                          {tool.apiAvailable && (
                            <Badge variant="new" className="text-xs">API</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.id === tool.category)?.name}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(tool.difficulty)}`}>
                            {tool.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleTool(tool.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{tool.description}</p>

                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-500 mb-1">Capabilities</div>
                      <div className="flex flex-wrap gap-1">
                        {tool.capabilities.slice(0, 3).map((cap, idx) => (
                          <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            {cap}
                          </span>
                        ))}
                        {tool.capabilities.length > 3 && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            +{tool.capabilities.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <BarChart className="h-3 w-3" />
                          {tool.popularity}%
                        </span>
                        <span>{tool.pricing}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(tool.link, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            {filteredTools.length === 0 && (
              <Card className="p-12 text-center">
                <Sparkles className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Tools Found</h3>
                <p className="text-gray-600">Try adjusting your filters.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
