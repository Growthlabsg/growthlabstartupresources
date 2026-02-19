'use client'

import type { ReactNode } from 'react'
import { PlatformProvider } from '@/lib/hooks/usePlatformUser'
import EmbeddedWrapper from '@/components/platform/EmbeddedWrapper'
import ToastContainer from '@/components/ui/ToastContainer'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <PlatformProvider>
      <EmbeddedWrapper>
        {children}
      </EmbeddedWrapper>
      <ToastContainer />
    </PlatformProvider>
  )
}

