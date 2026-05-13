'use client'

import Link from 'next/link'
import { MapPin, Mail, Phone } from 'lucide-react'
import { useLanguageStore, translations } from '@/lib/store'
import { MoroccanPattern } from '@/components/ui/moroccan-pattern'

export function Footer() {
  const { language } = useLanguageStore()
  const t = translations[language]

  return (
    <footer className="relative bg-foreground text-background">
      <MoroccanPattern className="absolute inset-0 opacity-5" />
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-3xl font-bold text-accent mb-4">
              Dar Artisanat
            </h3>
            <p className="text-background/70 mb-6 max-w-md leading-relaxed">
              {t.about.description.slice(0, 200)}...
            </p>
            <div className="flex items-center gap-2 text-background/70">
              <MapPin className="h-4 w-4 text-accent" />
              <span>{t.footer.location}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-accent">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-background/70 hover:text-accent transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-background/70 hover:text-accent transition-colors">
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-background/70 hover:text-accent transition-colors">
                  {t.nav.cart}
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-background/70 hover:text-accent transition-colors">
                  {t.nav.account}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-accent">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70">
                <Mail className="h-4 w-4 text-accent" />
                <span>hello@darartisanat.ma</span>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Phone className="h-4 w-4 text-accent" />
                <span>+212 535 123 456</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Gold Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
          <p>© {new Date().getFullYear()} Dar Artisanat. {t.footer.rights}</p>
          <p className="font-serif text-accent/60">
            Crafted with love in Fès
          </p>
        </div>
      </div>
    </footer>
  )
}
