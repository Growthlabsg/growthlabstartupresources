'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon?: LucideIcon
}

interface SimpleTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function SimpleTabs({ tabs, activeTab, onTabChange }: SimpleTabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
                ${isActive
                  ? 'border-primary-500 text-primary-600 bg-primary-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {Icon && typeof Icon !== 'undefined' && React.createElement(Icon, { className: "h-4 w-4" })}
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

