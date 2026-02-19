'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface ToastProps {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  onClose: (id: string) => void
}

export default function Toast({ id, message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 3000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }

  return (
    <div
      className={`${bgColors[type]} border-2 rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slide-up`}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium text-gray-900">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

