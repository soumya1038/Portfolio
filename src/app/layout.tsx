import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_PORTFOLIO_NAME || 'Your Name'} - Portfolio`,
  description: 'Modern, interactive portfolio showcase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
