'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import ResourceLibrary from './ResourceLibrary'
import FeaturedResources from './FeaturedResources'
import PopularResources from './PopularResources'

export default function ResourceLibrarySection() {
  return (
    <section className="section-spacing bg-white">
      <div className="section-container">
        <div className="mb-12 lg:mb-16">
          <h2 className="section-title">Comprehensive Resource Library</h2>
          <p className="section-subtitle">
            Access our complete collection of startup resources, guides, templates, and tools designed to support your startup journey. All resources are connected to working tools and pages.
          </p>
        </div>
      
        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2">
            <TabsTrigger value="all" className="w-full">All Resources</TabsTrigger>
            <TabsTrigger value="featured" className="w-full">Featured</TabsTrigger>
            <TabsTrigger value="popular" className="w-full">Popular</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            <ResourceLibrary />
          </TabsContent>

          <TabsContent value="featured" className="space-y-8">
            <FeaturedResources />
          </TabsContent>

          <TabsContent value="popular" className="space-y-8">
            <PopularResources />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

