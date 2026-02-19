import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'new' | 'featured' | 'popular' | 'beginner' | 'intermediate' | 'advanced' | 'outline' | 'category' | 'success' | 'info' | 'warning' | 'error'
  className?: string
}

export default function Badge({ children, variant, className, ...rest }: BadgeProps) {
  const variants = {
    new: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    featured: 'bg-amber-100 text-amber-700 border border-amber-200',
    popular: 'bg-blue-100 text-blue-700 border border-blue-200',
    beginner: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    intermediate: 'bg-amber-50 text-amber-700 border border-amber-200',
    advanced: 'bg-rose-50 text-rose-700 border border-rose-200',
    outline: 'bg-gray-50 text-gray-700 border border-gray-300',
    category: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    success: 'bg-green-100 text-green-700 border border-green-200',
    info: 'bg-sky-100 text-sky-700 border border-sky-200',
    warning: 'bg-amber-100 text-amber-700 border border-amber-200',
    error: 'bg-red-100 text-red-700 border border-red-200',
  }
  
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium inline-flex items-center',
        variant && variants[variant],
        !variant && 'bg-gray-100 text-gray-700 border border-gray-200',
        className
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

