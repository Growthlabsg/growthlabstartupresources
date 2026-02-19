'use client'

import { showToast } from '@/components/ui/ToastContainer'

export function handleShare(url: string, title: string) {
  if (typeof window === 'undefined') return
  
  if (navigator.share) {
    navigator.share({
      title,
      url,
    })
      .then(() => showToast('Shared successfully!', 'success'))
      .catch(() => showToast('Share cancelled', 'info'))
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url)
      .then(() => showToast('Link copied to clipboard!', 'success'))
      .catch(() => showToast('Failed to copy link', 'error'))
  } else {
    showToast('Share not available in this browser', 'error')
  }
}

export function handleDownload(filename: string) {
  showToast(`Downloading ${filename}...`, 'info')
  // Simulate download
  setTimeout(() => {
    showToast(`${filename} downloaded successfully!`, 'success')
  }, 1000)
}

// Re-export showToast for convenience
export { showToast } from '@/components/ui/ToastContainer'

export function handleBookmark(resourceId: string, isBookmarked: boolean) {
  if (isBookmarked) {
    showToast('Removed from bookmarks', 'info')
  } else {
    showToast('Added to bookmarks', 'success')
  }
}

export function handleRegister(eventId: string, eventTitle: string) {
  showToast(`Registered for ${eventTitle}!`, 'success')
}

export function handleOpenResource(resourceId: string, resourceTitle: string) {
  if (typeof window === 'undefined') return
  showToast(`Opening ${resourceTitle}...`, 'info')
  // Navigate to resource page - resourceId can be a path or ID
  if (resourceId.startsWith('/')) {
    window.location.href = resourceId
  } else {
    window.location.href = `/startup/resources/${resourceId}`
  }
}

