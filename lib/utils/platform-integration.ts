/**
 * Platform Integration Utilities
 * Handles communication with the main GrowthLab platform
 */

export interface PlatformMessage {
  type: string
  payload?: any
}

/**
 * Send message to parent platform (if embedded)
 */
export function sendToPlatform(type: string, payload?: any) {
  if (window.self !== window.top) {
    window.parent.postMessage(
      {
        type,
        payload,
        source: 'startup-resources',
      },
      '*' // In production, use specific origin
    )
  }
}

/**
 * Listen for messages from parent platform
 */
export function listenToPlatform(
  callback: (message: PlatformMessage) => void
): () => void {
  const handler = (event: MessageEvent) => {
    if (event.data.source === 'growthlab-platform') {
      callback(event.data)
    }
  }

  window.addEventListener('message', handler)
  return () => window.removeEventListener('message', handler)
}

/**
 * Request user token from parent platform
 */
export async function requestPlatformToken(): Promise<string | null> {
  return new Promise((resolve) => {
    if (window.self === window.top) {
      // Not embedded, check localStorage
      resolve(localStorage.getItem('growthlab_token'))
      return
    }

    const timeout = setTimeout(() => {
      window.removeEventListener('message', handler)
      resolve(null)
    }, 3000)

    const handler = (event: MessageEvent) => {
      if (event.data.type === 'TOKEN_RESPONSE') {
        clearTimeout(timeout)
        window.removeEventListener('message', handler)
        resolve(event.data.token)
      }
    }

    window.addEventListener('message', handler)
    window.parent.postMessage(
      { type: 'REQUEST_TOKEN', source: 'startup-resources' },
      '*'
    )
  })
}

/**
 * Notify platform of navigation
 */
export function notifyNavigation(path: string) {
  sendToPlatform('NAVIGATION', { path })
}

/**
 * Notify platform of resource view
 */
export function notifyResourceView(resourceId: string, resourceType: string) {
  sendToPlatform('RESOURCE_VIEW', { resourceId, resourceType })
}

/**
 * Notify platform of tool usage
 */
export function notifyToolUsage(toolId: string, action: string) {
  sendToPlatform('TOOL_USAGE', { toolId, action })
}

/**
 * Get platform theme (for embedded mode)
 */
export function getPlatformTheme(): 'light' | 'dark' {
  const theme = new URLSearchParams(window.location.search).get('theme')
  if (theme === 'dark' || theme === 'light') {
    return theme
  }
  return 'light'
}

/**
 * Check if running in embedded mode
 */
export function isEmbedded(): boolean {
  return window.self !== window.top || 
         new URLSearchParams(window.location.search).get('embedded') === 'true'
}

/**
 * Get container dimensions from platform (if embedded)
 */
export function getContainerDimensions(): { width: number; height: number } | null {
  if (window.self === window.top) {
    return null
  }

  // Try to get from URL params
  const width = new URLSearchParams(window.location.search).get('width')
  const height = new URLSearchParams(window.location.search).get('height')

  if (width && height) {
    return {
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    }
  }

  // Fallback to iframe dimensions
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

