import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Smartling API Proxy',
  description: 'A simple proxy server for Smartling API requests',
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
