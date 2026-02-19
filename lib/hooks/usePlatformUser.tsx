/**
 * React Hook for accessing platform user context
 * Works in both standalone and embedded (iframe) modes
 */

'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { PlatformUser } from '@/lib/middleware/auth'

interface PlatformContextType {
  user: PlatformUser | null
  loading: boolean
  error: Error | null
  isEmbedded: boolean
  refresh: () => Promise<void>
}

const PlatformContext = createContext<PlatformContextType | null>(null)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PlatformUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isEmbedded, setIsEmbedded] = useState(false)

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if we're in embedded mode
      const embedded = window.self !== window.top || 
                       new URLSearchParams(window.location.search).get('embedded') === 'true'
      setIsEmbedded(embedded)

      // Try to get token from various sources
      let token: string | null = null

      // Check localStorage
      token = localStorage.getItem('growthlab_token')

      // Check iframe parent (if embedded)
      if (embedded && !token) {
        try {
          const parentMessage = await new Promise<string | null>((resolve) => {
            const timeout = setTimeout(() => resolve(null), 1000)
            window.parent.postMessage({ type: 'REQUEST_TOKEN' }, '*')
            
            const handler = (event: MessageEvent) => {
              if (event.data.type === 'TOKEN_RESPONSE') {
                clearTimeout(timeout)
                window.removeEventListener('message', handler)
                resolve(event.data.token)
              }
            }
            window.addEventListener('message', handler)
          })
          token = parentMessage
        } catch (e) {
          console.warn('Could not get token from parent:', e)
        }
      }

      if (!token) {
        setLoading(false)
        return
      }

      // Fetch user from our API
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else if (response.status === 401) {
        // Token invalid, clear it
        localStorage.removeItem('growthlab_token')
        setUser(null)
      }
    } catch (err) {
      setError(err as Error)
      console.error('Error fetching user:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()

    // Listen for auth updates from parent (if embedded)
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'AUTH_UPDATE') {
        if (event.data.token) {
          localStorage.setItem('growthlab_token', event.data.token)
          fetchUser()
        } else {
          localStorage.removeItem('growthlab_token')
          setUser(null)
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <PlatformContext.Provider
      value={{
        user,
        loading,
        error,
        isEmbedded,
        refresh: fetchUser,
      }}
    >
      {children}
    </PlatformContext.Provider>
  )
}

export function usePlatformUser() {
  const context = useContext(PlatformContext)
  if (!context) {
    throw new Error('usePlatformUser must be used within PlatformProvider')
  }
  return context
}

