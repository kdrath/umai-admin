import './globals.css'
import type { Metadata } from 'next'
import { IBM_Plex_Mono, Crimson_Pro } from 'next/font/google'

const mono = IBM_Plex_Mono({ 
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
})

const serif = Crimson_Pro({ 
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'UMAI Archive System',
  description: 'Preservation and curation interface for unconventional media',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${mono.variable} ${serif.variable}`}>
      <body className="bg-stone-50 text-stone-900 font-mono antialiased">
        {children}
      </body>
    </html>
  )
}
