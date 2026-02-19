import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/components/platform/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Startup Resources | GrowthLab',
  description: 'Everything you need to build, launch, and grow your startup globally. A global startup ecosystem serving founders worldwide.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}

