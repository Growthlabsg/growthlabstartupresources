import Link from 'next/link'
import { Rocket, BookOpen, Users, Check } from 'lucide-react'

export default function MobileNavigation() {
  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 z-50 safe-area-inset-bottom">
        <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
          <Link href="/startup" className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-primary-500/10 active:scale-95 transition-transform">
            <Rocket className="w-5 h-5 text-primary-500 mb-0.5" />
            <span className="text-[10px] font-semibold text-primary-500">Hub</span>
          </Link>
          <Link href="/startup/guides" className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-gray-100 active:scale-95 transition-all">
            <BookOpen className="w-5 h-5 text-gray-600 mb-0.5" />
            <span className="text-[10px] font-medium text-gray-600">Guides</span>
          </Link>
          <Link href="/startup/profile" className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-gray-100 active:scale-95 transition-all">
            <Users className="w-5 h-5 text-gray-600 mb-0.5" />
            <span className="text-[10px] font-medium text-gray-600">Profile</span>
          </Link>
          <Link href="/startup/checklist" className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-gray-100 active:scale-95 transition-all">
            <Check className="w-5 h-5 text-gray-600 mb-0.5" />
            <span className="text-[10px] font-medium text-gray-600">Checklist</span>
          </Link>
        </div>
      </div>
      {/* Spacer to prevent content from being hidden behind bottom navigation */}
      <div className="lg:hidden h-[72px]"></div>
    </>
  )
}

