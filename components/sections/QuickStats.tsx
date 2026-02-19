export default function QuickStats() {
  const stats = [
    { label: 'Tools & Resources', value: '50+', icon: '📊' },
    { label: 'Active Users', value: '1000+', icon: '👥' },
    { label: 'Support', value: '24/7', icon: '🔄' },
    { label: 'Cost', value: 'Free to Start', icon: '💰' },
  ]

  return (
    <section className="mb-12 lg:mb-16">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200/60 p-6 lg:p-8 text-center hover:border-primary-500/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm lg:text-base text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

