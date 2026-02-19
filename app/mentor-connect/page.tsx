'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MentorConnectPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/mentorship')
  }, [router])

  return null
}

