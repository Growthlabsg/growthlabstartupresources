'use client'

import { useState, useEffect } from 'react'
import { 
  Rocket, Wrench, BookOpen, Users, TrendingUp, 
  DollarSign, Code, Shield, Award, FileText,
  GraduationCap, Briefcase, Menu, X, ChevronUp
} from 'lucide-react'

interface Section {
  id: string
  label: string
  icon: any
}

const sections: Section[] = [
  { id: 'hero', label: 'Home', icon: Rocket },
  { id: 'essential-tools', label: 'Tools', icon: Wrench },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'funding', label: 'Funding', icon: DollarSign },
  { id: 'technology', label: 'Tech', icon: Code },
  { id: 'legal', label: 'Legal', icon: Shield },
  { id: 'accelerators', label: 'Programs', icon: Award },
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'learning', label: 'Learning', icon: GraduationCap },
]

export default function SectionNavigation() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show navigation after scrolling past hero
      setIsVisible(window.scrollY > 400)

      // Determine active section
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id)
      })).filter(s => s.element)

      const viewportMiddle = window.scrollY + window.innerHeight / 3

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, element } = sectionElements[i]
        if (element && element.offsetTop <= viewportMiddle) {
          setActiveSection(id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsMobileMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) return null

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md shadow-lg rounded-full px-2 py-1.5 border border-gray-200">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className={isActive ? '' : 'hidden xl:inline'}>{section.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-[88px] right-4 z-50">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors touch-target"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute bottom-16 right-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in">
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {section.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 left-4 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors z-50 touch-target"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </>
  )
}
