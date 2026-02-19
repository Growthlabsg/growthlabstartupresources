'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Code, Database, Palette, Heart, BookOpen, Home, UtensilsCrossed } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

const industries = [
  { id: 'tech', title: 'Tech & SaaS', icon: <Code className="h-6 w-6" />, link: '/startup/tech-resources' },
  { id: 'fintech', title: 'FinTech', icon: <Database className="h-6 w-6" />, link: '/startup/fintech-resources' },
  { id: 'ecommerce', title: 'E-commerce', icon: <Palette className="h-6 w-6" />, link: '/startup/ecommerce-resources' },
  { id: 'healthtech', title: 'HealthTech', icon: <Heart className="h-6 w-6" />, link: '/startup/healthtech-resources' },
  { id: 'edtech', title: 'EdTech', icon: <BookOpen className="h-6 w-6" />, link: '/startup/edtech-resources' },
  { id: 'proptech', title: 'PropTech', icon: <Home className="h-6 w-6" />, link: '/startup/proptech-resources' },
  { id: 'foodtech', title: 'FoodTech', icon: <UtensilsCrossed className="h-6 w-6" />, link: '/startup/foodtech-resources' },
]

export default function IndustryResourcesSection() {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Industry-Specific Resources</h2>
      <p className="text-lg text-gray-600 mb-8">
        Tailored resources and tools for startups in specific industries.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {industries.map((industry) => (
          <Card key={industry.id} className="border-2 border-primary-500/20 hover:border-primary-500 transition-all">
            <div className="bg-primary-500/10 p-3 rounded-lg text-primary-500 w-fit mb-4">
              {industry.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{industry.title}</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                showToast(`Opening ${industry.title} resources...`, 'info')
                window.location.href = industry.link
              }}
            >
              Explore {industry.title}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  )
}

