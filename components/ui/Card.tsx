import { ReactNode, MouseEventHandler } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  elevated?: boolean
  onMouseEnter?: MouseEventHandler<HTMLDivElement>
  onMouseLeave?: MouseEventHandler<HTMLDivElement>
}

export default function Card({ children, className, hover = true, elevated = false, onMouseEnter, onMouseLeave }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200/60 transition-all duration-300',
        elevated 
          ? 'p-4 sm:p-6 lg:p-8 shadow-md hover:shadow-xl hover:border-primary-500/40' 
          : 'p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg hover:border-primary-500/30',
        hover && 'hover:-translate-y-0.5',
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}

