import type { Metadata } from 'next'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const siteName = process.env.NEXT_PUBLIC_PORTFOLIO_NAME || 'Portfolio'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: `${siteName} - Portfolio`,
  description: 'Modern, interactive portfolio showcase built with Next.js',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - Portfolio`,
    description: 'Modern, interactive portfolio showcase built with Next.js',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Portfolio`,
    description: 'Modern, interactive portfolio showcase',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
