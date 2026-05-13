'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product, useCartStore, useLanguageStore, translations } from '@/lib/store'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const { language } = useLanguageStore()
  const t = translations[language]
  const productImage = product.image || '/placeholder.jpg'

  const name = language === 'ar' ? product.nameAr || product.name : 
               language === 'fr' ? product.nameFr || product.name : 
               product.name

  return (
    <div
      className={cn(
        'group relative bg-card rounded-lg overflow-hidden border border-border/50 transition-all duration-300 hover:shadow-lg hover:border-accent/30',
        className
      )}
    >
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={productImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <span className="text-background font-medium px-4 py-2 bg-foreground/80 rounded">
                {t.products.outOfStock}
              </span>
            </div>
          )}
          {product.bestSeller && product.inStock && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
              Best Seller
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif text-lg font-medium text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-accent font-semibold mb-3">${product.price}</p>
        
        <Button
          onClick={() => addItem(product)}
          disabled={!product.inStock}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          {t.products.addToCart}
        </Button>
      </div>
    </div>
  )
}
