import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'John Doe - Portfolio',
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
