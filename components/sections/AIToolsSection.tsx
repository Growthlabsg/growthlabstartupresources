import AITools from './AITools'

export default function AIToolsSection() {
  return (
    <section className="mb-12 sm:mb-16">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">AI-Powered Startup Tools</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Leverage artificial intelligence to accelerate your startup journey with smart tools and insights.
      </p>
      <AITools />
    </section>
  )
}

