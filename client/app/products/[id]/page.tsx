'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GoldDivider } from '@/components/ui/moroccan-pattern'
import { ProductCard } from '@/components/product-card'
import { apiClient, ApiClientError } from '@/lib/api'
import type { ApiProductWithCategory, ApiSuccessResponse } from '@/lib/api-types'
import { mapApiProductToStoreProduct, mapApiProductsToStoreProducts } from '@/lib/product-mapper'
import { useCartStore, useLanguageStore, translations, type Product } from '@/lib/store'
import { cn } from '@/lib/utils'

type LoadState = 'idle' | 'loading' | 'loaded' | 'error' | 'not_found'

export default function ProductDetailPage() {
  const params = useParams()
  const productIdParam = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loadState, setLoadState] = useState<LoadState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const addItem = useCartStore((state) => state.addItem)
  const { language } = useLanguageStore()
  const t = translations[language]

  useEffect(() => {
    const fetchProduct = async () => {
      const parsedId = Number(productIdParam)

      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        setLoadState('not_found')
        setProduct(null)
        setRelatedProducts([])
        return
      }

      try {
        setLoadState('loading')
        setErrorMessage(null)

        const productResponse = await apiClient.get<ApiSuccessResponse<ApiProductWithCategory>>(
          `/products/${parsedId}`
        )

        const currentProduct = mapApiProductToStoreProduct(productResponse.data)
        setProduct(currentProduct)

        const relatedResponse = await apiClient.get<ApiSuccessResponse<ApiProductWithCategory[]>>(
          '/products',
          {
            page: 1,
            limit: 8,
            categoryId: productResponse.data.categoryId,
          }
        )

        const mappedRelatedProducts = mapApiProductsToStoreProducts(relatedResponse.data)
          .filter((relatedProduct) => relatedProduct.id !== currentProduct.id)
          .slice(0, 4)

        setRelatedProducts(mappedRelatedProducts)
        setLoadState('loaded')
      } catch (error) {
        if (error instanceof ApiClientError) {
          if (error.statusCode === 404) {
            setLoadState('not_found')
            setProduct(null)
            setRelatedProducts([])
            return
          }

          setErrorMessage(error.message)
        } else {
          setErrorMessage('Unable to load this product. Please try again.')
        }

        setLoadState('error')
      }
    }

    void fetchProduct()
  }, [productIdParam])

  const name = useMemo(() => {
    if (!product) {
      return ''
    }

    return language === 'ar'
      ? product.nameAr || product.name
      : language === 'fr'
        ? product.nameFr || product.name
        : product.name
  }, [language, product])

  const description = useMemo(() => {
    if (!product) {
      return ''
    }

    return language === 'ar'
      ? product.descriptionAr || product.description
      : language === 'fr'
        ? product.descriptionFr || product.description
        : product.description
  }, [language, product])

  const handleAddToCart = () => {
    if (!product) {
      return
    }

    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loadState === 'loading' || loadState === 'idle') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Loading product...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (loadState === 'not_found') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl mb-4">Product not found</h1>
            <Link href="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (loadState === 'error' || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl mb-4">Unable to load product</h1>
            <p className="text-muted-foreground mb-4">{errorMessage || 'Unexpected error'}</p>
            <Link href="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const productImage = product.image || '/placeholder.jpg'

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />

      <main className="flex-1 py-8 px-4 bg-background">
        <div className="container mx-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={productImage}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                    <span className="text-background font-medium px-6 py-3 bg-foreground/80 rounded-lg text-lg">
                      {t.products.outOfStock}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {name}
              </h1>

              <p className="text-3xl font-bold text-accent">{product.price} DH</p>

              <GoldDivider className="max-w-xs" />

              <p className="text-muted-foreground leading-relaxed text-lg">
                {description || 'No description available for this product.'}
              </p>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Quantity</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  'w-full py-6 text-lg transition-all',
                  addedToCart
                    ? 'bg-secondary hover:bg-secondary text-secondary-foreground'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                )}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {t.products.addToCart}
                  </>
                )}
              </Button>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-20">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
