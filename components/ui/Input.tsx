import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export default Input

