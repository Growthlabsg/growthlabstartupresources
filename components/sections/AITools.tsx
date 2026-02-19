'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Sparkles, Quote } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const aiTools = [
  {
    id: '1',
    title: 'AI Pitch Deck Assistant',
    description: 'Let AI help you create compelling pitch deck content that resonates with investors.',
    link: '/startup/pitch-deck-builder',
    testimonial: {
      text: 'The AI suggestions helped me refine my pitch deck in minutes!',
      author: 'Sarah Chen, Founder',
    },
  },
  {
    id: '2',
    title: 'AI Financial Projections',
    description: 'Generate realistic financial projections based on your industry and business model.',
    link: '/startup/financial-projections/enhanced',
    testimonial: {
      text: 'Accurate projections that investors actually trust.',
      author: 'Mike Johnson, CEO',
    },
  },
  {
    id: '3',
    title: 'AI Market Intelligence',
    description: 'Get AI-powered market insights and competitive analysis for your startup.',
    link: '/startup/market-research/enhanced',
    testimonial: {
      text: 'Saved weeks of research with AI-powered insights.',
      author: 'Emily Davis, Co-founder',
    },
  },
  {
    id: '4',
    title: 'AI Business Name Generator',
    description: 'Generate unique, memorable business names with domain availability checks and trademark insights.',
    link: '/startup/ai/business-name-generator',
    testimonial: {
      text: 'Found the perfect name in seconds!',
      author: 'Alex Rodriguez, Founder',
    },
  },
  {
    id: '5',
    title: 'AI Content Writer',
    description: 'Create blog posts, articles, and marketing copy that engages your audience and drives conversions.',
    link: '/startup/ai/content-writer',
    testimonial: {
      text: '10x faster content creation with AI assistance.',
      author: 'Jessica Park, Marketing Lead',
    },
  },
  {
    id: '6',
    title: 'AI Email Campaign Writer',
    description: 'Craft compelling email campaigns that convert with AI-powered subject lines and body copy.',
    link: '/startup/ai/email-writer',
    testimonial: {
      text: 'Our open rates increased by 40% with AI-generated emails.',
      author: 'David Kim, Growth Manager',
    },
  },
  {
    id: '7',
    title: 'AI Social Media Post Generator',
    description: 'Create engaging social media content across all platforms with AI-powered post suggestions.',
    link: '/startup/ai/social-media-generator',
    testimonial: {
      text: 'Never run out of content ideas again!',
      author: 'Maria Garcia, Social Media Manager',
    },
  },
  {
    id: '8',
    title: 'AI Product Description Writer',
    description: 'Write compelling product descriptions that highlight features and drive sales.',
    link: '/startup/ai/product-descriptions',
    testimonial: {
      text: 'Product descriptions that actually sell.',
      author: 'Tom Wilson, E-commerce Founder',
    },
  },
  {
    id: '9',
    title: 'AI SEO Optimizer',
    description: 'Optimize your content for search engines with AI-powered keyword suggestions and optimization tips.',
    link: '/startup/ai/seo-optimizer',
    testimonial: {
      text: 'Ranked #1 on Google in just 2 months!',
      author: 'Lisa Chen, Content Strategist',
    },
  },
  {
    id: '10',
    title: 'AI Grant Writer',
    description: 'Generate professional grant proposals and funding applications with AI assistance.',
    link: '/startup/ai/grant-writer',
    testimonial: {
      text: 'Won our first grant thanks to AI-powered proposal.',
      author: 'Robert Brown, Non-profit Founder',
    },
  },
  {
    id: '11',
    title: 'AI Investor Email Writer',
    description: 'Craft personalized investor outreach emails that get responses and secure meetings.',
    link: '/startup/ai/investor-emails',
    testimonial: {
      text: '3x higher response rate with AI-crafted emails.',
      author: 'Sophie Anderson, Startup Founder',
    },
  },
  {
    id: '12',
    title: 'AI Job Description Generator',
    description: 'Create clear, compelling job descriptions that attract top talent and reduce time-to-hire.',
    link: '/startup/ai/job-descriptions',
    testimonial: {
      text: 'Found the perfect candidate faster than ever.',
      author: 'James Taylor, HR Director',
    },
  },
  {
    id: '13',
    title: 'AI Customer Support Bot Builder',
    description: 'Build intelligent chatbots that handle customer inquiries 24/7 and reduce support costs.',
    link: '/startup/ai/chatbot-builder',
    testimonial: {
      text: 'Reduced support tickets by 60% with our AI bot.',
      author: 'Rachel Green, Customer Success Lead',
    },
  },
  {
    id: '14',
    title: 'AI Competitor Analysis',
    description: 'Get comprehensive competitor insights with AI-powered analysis of their strategies and positioning.',
    link: '/startup/competitive-analysis',
    testimonial: {
      text: 'Uncovered competitor strategies we never knew about.',
      author: 'Michael Chang, Product Manager',
    },
  },
  {
    id: '15',
    title: 'AI Logo & Branding Assistant',
    description: 'Generate logo concepts, color palettes, and brand guidelines with AI-powered design suggestions.',
    link: '/startup/ai/branding-assistant',
    testimonial: {
      text: 'Created our entire brand identity in one day!',
      author: 'Emma White, Creative Director',
    },
  },
]

export default function AITools() {

  return (
    <section className="section-spacing bg-gray-50">
      <div className="section-container">
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h2 className="section-title">AI-Powered Startup Tools</h2>
          <p className="section-subtitle">
            Leverage artificial intelligence to accelerate your startup journey
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {aiTools.map((tool) => (
            <Card
              key={tool.id}
              className="bg-gradient-to-br from-primary-500/10 to-primary-500/5 flex flex-col"
            >
              <div className="bg-primary-500/20 p-3 rounded-lg text-primary-500 w-fit mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow">{tool.description}</p>
              <div className="bg-white/50 p-3 rounded-lg mb-4">
                <Quote className="h-4 w-4 text-primary-500 mb-1" />
                <p className="text-xs text-gray-700 italic mb-1">"{tool.testimonial.text}"</p>
                <p className="text-xs text-gray-500">— {tool.testimonial.author}</p>
              </div>
              <Link href={tool.link}>
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => showToast(`Opening ${tool.title}...`, 'info')}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Try AI Tool
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

