export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={`${sizes[size]} border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin`}></div>
  )
}

