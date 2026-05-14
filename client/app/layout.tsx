import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'Dar Artisanat | Authentic Moroccan Crafts from Fès',
  description: 'Discover exquisite handcrafted Moroccan artisanal goods. Pottery, leather goods, textiles, lighting, and glassware delivered worldwide from the heart of Fès.',
  keywords: ['Moroccan crafts', 'artisan', 'handmade', 'pottery', 'leather', 'Fès', 'Morocco'],
  icons: {
    icon: '/icone_dar_artisanat_ongl.png',
    shortcut: '/icone_dar_artisanat_ongl.png',
    apple: '/icone_dar_artisanat.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
