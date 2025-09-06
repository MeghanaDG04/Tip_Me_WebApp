import './globals.css'
import type { Metadata } from 'next/metadata'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TipMe - Turn Your Passion Into Tips',
  description: 'Create beautiful tip buttons for your content. Accept tips from supporters worldwide with secure payments.',
  keywords: 'tips, creator, payments, razorpay, support, monetize',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}