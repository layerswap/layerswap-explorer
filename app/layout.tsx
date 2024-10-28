import Header from '@/components/Header'
import './globals.css'
import Footer from '@/components/Footer'
import Script from 'next/script'
import Head from 'next/head'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <title>Layerswap Explorer</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="canonical" href="https://layerswap.io/explorer" />
        <meta name="description" content="Layerswap Explorer provides a detailed view of all transactions going through Layerswap. Search by address or transaction hash to get the information you need." />
      </Head>
      <Script defer data-domain="layerswap.io" src="https://plausible.io/js/script.js" />
      <body className='flex min-h-screen flex-col items-center max-w-6xl mx-auto'>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
