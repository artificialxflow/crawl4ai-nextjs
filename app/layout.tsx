import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Universal Web Scraper',
  description: 'A web scraper built with Next.js and crawl4ai',
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
