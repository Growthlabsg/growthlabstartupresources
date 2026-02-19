'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Rocket, Check } from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'

export default function ScaleAcceleratorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="h-6 w-6 text-primary-500" />
            <Badge variant="popular">Scale</Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text">
            Scale Accelerator Program
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Advanced accelerator program for scaling startups
          </p>
        </div>

        <Card className="mb-8">
          <h3 className="font-semibold mb-4">Program Benefits</h3>
          <ul className="space-y-2">
            {['$1M+ funding opportunities', '24-week program', 'C-level mentorship', 'Global expansion support'].map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Button
          className="w-full md:w-auto"
          onClick={() => showToast('Application opened!', 'info')}
        >
          Apply Now
        </Button>
      </div>
    </main>
  )
}

