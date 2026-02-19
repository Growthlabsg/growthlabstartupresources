'use client'

import { useState, useEffect } from 'react'
import Toast from './Toast'

interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

let toastListeners: ((toasts: ToastItem[]) => void)[] = []
let toasts: ToastItem[] = []

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = Math.random().toString(36).substr(2, 9)
  toasts = [...toasts, { id, message, type }]
  toastListeners.forEach((listener) => listener([...toasts]))

  setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id)
    toastListeners.forEach((listener) => listener([...toasts]))
  }, 3000)
}

export default function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const listener = (newToasts: ToastItem[]) => {
      setCurrentToasts(newToasts)
    }
    toastListeners.push(listener)
    setCurrentToasts(toasts)

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  const handleClose = (id: string) => {
    toasts = toasts.filter((toast) => toast.id !== id)
    toastListeners.forEach((listener) => listener([...toasts]))
  }

  if (currentToasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {currentToasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={handleClose}
        />
      ))}
    </div>
  )
}

