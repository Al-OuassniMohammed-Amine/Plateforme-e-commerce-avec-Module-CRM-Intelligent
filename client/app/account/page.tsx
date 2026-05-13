'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Package, User, Settings, ChevronRight, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MoroccanPattern, GoldDivider } from '@/components/ui/moroccan-pattern'
import { useLanguageStore, translations } from '@/lib/store'
import { cn } from '@/lib/utils'

// Mock order data
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'Delivered',
    total: 285,
    items: [
      { name: 'Fès Blue Ceramic Bowl', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=100&q=80', quantity: 2 },
      { name: 'Traditional Tagine Pot', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=100&q=80', quantity: 1 },
    ],
  },
  {
    id: 'ORD-002',
    date: '2024-01-20',
    status: 'In Transit',
    total: 180,
    items: [
      { name: 'Artisan Leather Tote Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&q=80', quantity: 1 },
    ],
  },
  {
    id: 'ORD-003',
    date: '2024-02-01',
    status: 'Processing',
    total: 450,
    items: [
      { name: 'Berber Wool Rug', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=100&q=80', quantity: 1 },
    ],
  },
]

type TabType = 'orders' | 'settings'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabType>('orders')
  const { language } = useLanguageStore()
  const t = translations[language]

  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 555 123 4567',
    address: '123 Main Street',
    city: 'New York',
    country: 'United States',
    postalCode: '10001',
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-secondary text-secondary-foreground'
      case 'In Transit':
        return 'bg-accent text-accent-foreground'
      case 'Processing':
        return 'bg-primary/20 text-primary'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 px-4 bg-primary text-primary-foreground overflow-hidden">
          <MoroccanPattern className="absolute inset-0 opacity-10" variant="light" />
          <div className="container mx-auto relative z-10 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              {t.account.title}
            </h1>
            <GoldDivider className="mx-auto max-w-xs" />
          </div>
        </section>

        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-card rounded-lg border border-border/50 p-4">
                  <div className="flex items-center gap-3 mb-6 p-2">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {profile.firstName} {profile.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>

                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        activeTab === 'orders'
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      <Package className="h-5 w-5" />
                      <span>{t.account.orders}</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        activeTab === 'settings'
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted'
                      )}
                    >
                      <Settings className="h-5 w-5" />
                      <span>{t.account.settings}</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </button>
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-3">
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                      {t.account.orders}
                    </h2>

                    {mockOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-card rounded-lg border border-border/50 p-6"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="font-medium text-foreground">{order.id}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(order.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getStatusColor(order.status))}>
                              {order.status}
                            </span>
                            <span className="font-bold text-accent">${order.total}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="relative w-16 h-16 rounded overflow-hidden">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {mockOrders.length === 0 && (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No orders yet</p>
                        <Link href="/products" className="inline-block mt-4">
                          <Button>Start Shopping</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                      {t.account.settings}
                    </h2>

                    <div className="bg-card rounded-lg border border-border/50 p-6">
                      <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-card rounded-lg border border-border/50 p-6">
                      <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Address
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={profile.city}
                            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={profile.country}
                            onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={profile.postalCode}
                            onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
