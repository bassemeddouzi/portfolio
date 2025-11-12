import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Providers } from './providers'
import LayoutWrapper from '@/components/LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio - Développeur Fullstack JavaScript',
  description: 'Portfolio d\'un développeur fullstack JavaScript spécialisé en React, Node.js, Next.js et bien plus.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <LayoutWrapper>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}

