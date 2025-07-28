import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | TrueFlow Blog',
    default: 'Blog | TrueFlow - AI-Powered Business Automation',
  },
  description: 'Discover insights, strategies, and tips to transform your business with AI-powered automation and content creation.',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}