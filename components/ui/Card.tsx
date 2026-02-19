import { ReactNode, MouseEventHandler } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode
  className?: string
  hover?: boolean
  elevated?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  onMouseEnter?: MouseEventHandler<HTMLDivElement>
  onMouseLeave?: MouseEventHandler<HTMLDivElement>
}

export default function Card({ children, className, hover = true, elevated = false, onClick, onMouseEnter, onMouseLeave, ...rest }: CardProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click() } : undefined}
      className={cn(
        'bg-white rounded-xl border border-gray-200/60 transition-all duration-300',
        elevated 
          ? 'p-4 sm:p-6 lg:p-8 shadow-md hover:shadow-xl hover:border-primary-500/40' 
          : 'p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg hover:border-primary-500/30',
        hover && 'hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rest}
    >
      {children}
    </div>
  )
}

