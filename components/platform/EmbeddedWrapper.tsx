'use client'

import { useEffect, useState, ReactNode } from 'react'
import { isEmbedded, getPlatformTheme, listenToPlatform } from '@/lib/utils/platform-integration'

interface EmbeddedWrapperProps {
  children: ReactNode
}

export default function EmbeddedWrapper({ children }: EmbeddedWrapperProps) {
  const [embedded, setEmbedded] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const embeddedMode = isEmbedded()
    setEmbedded(embeddedMode)
    setTheme(getPlatformTheme())

    if (embeddedMode) {
      // Listen for theme changes from parent
      const cleanup = listenToPlatform((message) => {
        if (message.type === 'THEME_CHANGE') {
          setTheme(message.payload.theme)
        }
      })

      // Notify parent that we're ready
      window.parent.postMessage(
        {
          type: 'EMBEDDED_READY',
          source: 'startup-resources',
        },
        '*'
      )

      return cleanup
    }
  }, [])

  if (!embedded) {
    return <>{children}</>
  }

  return (
    <div
      className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  )
}

