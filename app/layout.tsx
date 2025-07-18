import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrueFlow AI - Transform Your Voice Into Powerful Content',
  description: 'The most intelligent content creation system available. Transform your voice into powerful email campaigns and blogs with AI-powered automation.',
  keywords: 'AI content creation, voice to text, email campaigns, blog generation, content automation, TrueFlow',
  authors: [{ name: 'TrueFlow AI' }],
  openGraph: {
    title: 'TrueFlow AI - Transform Your Voice Into Powerful Content',
    description: 'The most intelligent content creation system available. Transform your voice into powerful email campaigns and blogs.',
    type: 'website',
    siteName: 'TrueFlow AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrueFlow AI - Transform Your Voice Into Powerful Content',
    description: 'The most intelligent content creation system available. Transform your voice into powerful email campaigns and blogs.',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/true-flow-icon.png" type="image/png" />
        <link rel="shortcut icon" href="/true-flow-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/true-flow-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/true-flow-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/true-flow-icon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/true-flow-icon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body 
        className={inter.className} 
        style={{ 
          background: '#000000', 
          margin: 0, 
          padding: 0,
          backgroundImage: 'none',
          animation: 'none'
        }}
        suppressHydrationWarning={true}
      >
        <div suppressHydrationWarning={true}>
          {children}
        </div>
      </body>
    </html>
  )
}