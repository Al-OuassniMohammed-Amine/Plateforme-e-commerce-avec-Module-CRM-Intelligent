'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MoroccanPattern, GoldDivider } from '@/components/ui/moroccan-pattern'
import { apiClient, ApiClientError } from '@/lib/api'
import type { ApiCategory, ApiSuccessResponse } from '@/lib/api-types'
import { resolveProductImageUrl } from '@/lib/product-mapper'
import { useLanguageStore, translations } from '@/lib/store'

export default function HomePage() {
  const { language } = useLanguageStore()
  const t = translations[language]

  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        const categoriesResponse =
          await apiClient.get<ApiSuccessResponse<ApiCategory[]>>('/categories')

        setCategories(categoriesResponse.data)
      } catch (error) {
        if (error instanceof ApiClientError) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('Unable to load products. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    void fetchHomeData()
  }, [])

  const handleScrollToCollections = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    const collectionsSection = document.getElementById('collections')
    if (!collectionsSection) {
      window.location.href = '/#collections'
      return
    }

    // Offset for the sticky header.
    const top = collectionsSection.getBoundingClientRect().top + window.scrollY - 88
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })

    if (window.location.hash !== '#collections') {
      window.history.replaceState(null, '', '#collections')
    }
  }

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />

      <main className="flex-1">
        <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&q=80"
              alt="Moroccan crafts"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-foreground/40" />
          </div>

          <MoroccanPattern className="absolute inset-0 opacity-10" variant="light" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-background mb-6 leading-tight text-balance">
              {t.hero.tagline}
            </h1>
            <p className="text-background/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Discover handcrafted treasures from the ancient medina of Fes
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg">
                {t.hero.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        <section id="collections" className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t.categories.title}
              </h2>
              <GoldDivider className="mx-auto max-w-xs" />
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading categories...</p>
            ) : errorMessage ? (
              <p className="text-center text-destructive">{errorMessage}</p>
            ) : categories.length === 0 ? (
              <p className="text-center text-muted-foreground">No categories available.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {categories.map((category) => {
                  const hasCategoryImage =
                    typeof category.imageUrl === 'string' && category.imageUrl.trim().length > 0

                  return (
                    <Link
                      key={category.id}
                      href={`/products?categoryId=${category.id}`}
                      className="group relative aspect-square rounded-lg overflow-hidden"
                    >
                      {hasCategoryImage ? (
                        <Image
                          src={resolveProductImageUrl(category.imageUrl)}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, 20vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-border" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                      <div className="absolute inset-0 flex items-end p-4">
                        <h3 className="font-serif text-lg md:text-xl font-semibold text-background group-hover:text-accent transition-colors">
                          {category.name}
                        </h3>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-10 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {t.bestSellers.title}
                </h2>
                <div className="h-1 w-24 bg-accent" />
              </div>
              <Link href="/products">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  {t.bestSellers.viewAll}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="rounded-lg border border-border/50 bg-card px-6 py-10 text-center">
              <p className="text-muted-foreground text-lg">
                Best sellers will be available after sales analysis.
              </p>
            </div>
          </div>
        </section>

        <section className="pt-4 pb-16 md:pt-6 md:pb-20 px-4 bg-[#f7f2e9]">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 overflow-hidden border border-[#e9decd]/70 bg-[#f9f5ee]">
              <div className="px-8 py-10 md:px-14 md:py-14 lg:py-16">
                <p className="mb-4 text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-[#b58a45]">
                  {t.craftSection.subtitle}
                </p>

                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-[#2e1f1a] mb-6">
                  {t.craftSection.titleLine1}
                  <br />
                  {t.craftSection.titleLine2}
                </h2>

                <GoldDivider className="mb-8 max-w-[240px]" />

                <p className="max-w-xl text-base md:text-lg leading-relaxed text-[#4b4039]">
                  {t.craftSection.paragraph1}
                  <br />
                  {t.craftSection.paragraph2}
                  <br />
                  {t.craftSection.paragraph3}
                </p>

                <Link
                  href="#collections"
                  className="inline-block mt-10"
                  onClick={handleScrollToCollections}
                >
                  <Button className="bg-[#b65f2d] hover:bg-[#a35427] text-white px-8 py-6 text-lg">
                    {t.craftSection.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="relative min-h-[320px] lg:min-h-full">
                <Image
                  src="/artisanat-splendeur.png"
                  alt="Creations artisanales d'exception"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>


        <section className="py-20 px-4 bg-primary text-primary-foreground relative overflow-hidden">
          <MoroccanPattern className="absolute inset-0 opacity-10" variant="light" />
          <div className="container mx-auto relative z-10 text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              {t.newsletter.title}
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              {t.newsletter.description}
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t.newsletter.placeholder}
                className="flex-1 bg-background text-foreground border-0"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {t.newsletter.button}
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

