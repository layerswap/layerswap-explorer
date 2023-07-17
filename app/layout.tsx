import Header from '@/components/Header'
import './globals.css'
import Footer from '@/components/Footer'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Layerswap Explorer',
  description: 'Explore your swaps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Script defer data-domain="layerswap.io" src="https://plausible.io/js/script.js" />
      <body className='flex min-h-screen flex-col items-center max-w-6xl mx-auto'>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
