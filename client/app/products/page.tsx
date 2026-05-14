'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MoroccanPattern, GoldDivider } from '@/components/ui/moroccan-pattern'
import { ProductCard } from '@/components/product-card'
import { apiClient, ApiClientError } from '@/lib/api'
import type { ApiCategory, ApiProductWithCategory, ApiSuccessResponse } from '@/lib/api-types'
import { mapApiProductsToStoreProducts } from '@/lib/product-mapper'
import { useLanguageStore, translations, type Product } from '@/lib/store'

function ProductsContent() {
  const searchParams = useSearchParams()
  const initialCategoryId = searchParams.get('categoryId') || 'all'

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId)
  const [sortBy, setSortBy] = useState('featured')

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const { language } = useLanguageStore()
  const t = translations[language]

  useEffect(() => {
    setSelectedCategory(initialCategoryId)
  }, [initialCategoryId])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const response = await apiClient.get<ApiSuccessResponse<ApiCategory[]>>('/categories')
        setCategories(response.data)
      } catch {
        setCategories([])
      } finally {
        setIsLoadingCategories(false)
      }
    }

    void fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true)
        setProductsError(null)

        const query: Record<string, string | number> = {
          page: 1,
          limit: 100,
        }

        const trimmedSearch = search.trim()
        if (trimmedSearch) {
          query.search = trimmedSearch
        }

        if (selectedCategory !== 'all') {
          query.categoryId = Number(selectedCategory)
        }

        const response = await apiClient.get<ApiSuccessResponse<ApiProductWithCategory[]>>(
          '/products',
          query
        )

        setProducts(mapApiProductsToStoreProducts(response.data))
      } catch (error) {
        if (error instanceof ApiClientError) {
          setProductsError(error.message)
        } else {
          setProductsError('Unable to load products. Please try again.')
        }
        setProducts([])
      } finally {
        setIsLoadingProducts(false)
      }
    }

    void fetchProducts()
  }, [search, selectedCategory])

  const sortedProducts = useMemo(() => {
    const result = [...products]

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'featured':
      default:
        break
    }

    return result
  }, [products, sortBy])

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('all')
    setSortBy('featured')
  }

  const hasActiveFilters = search || selectedCategory !== 'all' || sortBy !== 'featured'

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />

      <main className="flex-1">
        <section className="relative py-16 px-4 bg-primary text-primary-foreground overflow-hidden">
          <MoroccanPattern className="absolute inset-0 opacity-10" variant="light" />
          <div className="container mx-auto relative z-10 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              {t.nav.products}
            </h1>
            <GoldDivider className="mx-auto max-w-xs" />
          </div>
        </section>

        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.products.search}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue placeholder={t.products.filter} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t.products.sort} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {isLoadingProducts ? (
              <p className="text-muted-foreground mb-6">Loading products...</p>
            ) : productsError ? (
              <p className="text-destructive mb-6">{productsError}</p>
            ) : (
              <p className="text-muted-foreground mb-6">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} found
              </p>
            )}

            {isLoadingProducts ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Please wait...</p>
              </div>
            ) : productsError ? (
              <div className="text-center py-16">
                <p className="text-destructive text-lg mb-4">{productsError}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Retry
                </Button>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">
                  No products found matching your criteria.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear filters
                </Button>
              </div>
            )}

            {!isLoadingCategories && categories.length === 0 && (
              <p className="text-muted-foreground text-sm mt-6">
                Categories are not available yet.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductsContent />
    </Suspense>
  )
}
