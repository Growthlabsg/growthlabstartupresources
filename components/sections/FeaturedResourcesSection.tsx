'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import FeaturedResources from './FeaturedResources'

export default function FeaturedResourcesSection() {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Featured Resources</h2>
      <Tabs defaultValue="guides">
        <TabsList className="mb-6">
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="guides">
          <FeaturedResources />
        </TabsContent>
        <TabsContent value="templates">
          <FeaturedResources />
        </TabsContent>
        <TabsContent value="events">
          <FeaturedResources />
        </TabsContent>
      </Tabs>
    </section>
  )
}

