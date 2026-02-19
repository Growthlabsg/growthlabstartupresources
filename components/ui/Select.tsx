import React from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  className?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className = '', ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all bg-white ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }
)

Select.displayName = 'Select'

export default Select

