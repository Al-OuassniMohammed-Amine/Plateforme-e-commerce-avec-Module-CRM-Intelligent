'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MoroccanPattern, GoldDivider } from '@/components/ui/moroccan-pattern'
import { useCartStore, useLanguageStore, translations } from '@/lib/store'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const { language } = useLanguageStore()
  const t = translations[language]

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 px-4 bg-primary text-primary-foreground overflow-hidden">
          <MoroccanPattern className="absolute inset-0 opacity-10" variant="light" />
          <div className="container mx-auto relative z-10 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              {t.cart.title}
            </h1>
            <GoldDivider className="mx-auto max-w-xs" />
          </div>
        </section>

        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="font-serif text-2xl mb-4 text-foreground">{t.cart.empty}</h2>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {t.cart.continueShopping}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => {
                    const name = language === 'ar' ? item.nameAr || item.name : 
                                 language === 'fr' ? item.nameFr || item.name : 
                                 item.name

                    return (
                      <div
                        key={`${item.id}-${item.selectedColor}`}
                        className="flex gap-4 p-4 bg-card rounded-lg border border-border/50"
                      >
                        {/* Image */}
                        <Link href={`/products/${item.id}`} className="shrink-0">
                          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={name}
                              fill
                              className="object-cover"
                              sizes="128px"
                            />
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.id}`}>
                            <h3 className="font-serif text-lg font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                              {name}
                            </h3>
                          </Link>
                          {item.selectedColor && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Color: {item.selectedColor}
                            </p>
                          )}
                          <p className="text-accent font-semibold mt-2">
                            ${item.price}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-card rounded-lg border border-border/50 p-6 sticky top-24">
                    <h2 className="font-serif text-xl font-bold text-foreground mb-4">
                      Order Summary
                    </h2>
                    <GoldDivider className="mb-4" />

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${total().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 mb-6">
                      <div className="flex justify-between text-lg font-bold text-foreground">
                        <span>{t.cart.total}</span>
                        <span className="text-accent">${total().toFixed(2)}</span>
                      </div>
                    </div>

                    <Link href="/checkout" className="block">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg">
                        {t.cart.checkout}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>

                    <Link href="/products" className="block mt-4">
                      <Button variant="outline" className="w-full">
                        {t.cart.continueShopping}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
