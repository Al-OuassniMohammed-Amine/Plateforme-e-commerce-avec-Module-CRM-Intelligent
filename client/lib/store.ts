import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  name: string
  nameAr?: string
  nameFr?: string
  price: number
  image: string
  images?: string[]
  category: string
  description: string
  descriptionAr?: string
  descriptionFr?: string
  colors?: string[]
  inStock: boolean
  featured?: boolean
  bestSeller?: boolean
}

export interface CartItem extends Product {
  quantity: number
  selectedColor?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, color?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, color) => {
        const items = get().items
        const existingItem = items.find(
          (item) => item.id === product.id && item.selectedColor === color
        )
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.selectedColor === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({
            items: [...items, { ...product, quantity, selectedColor: color }],
          })
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          })
        }
      },
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      itemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'dar-artisanat-cart',
    }
  )
)

// Language store
type Language = 'en' | 'fr' | 'ar'

interface LanguageStore {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'dar-artisanat-language',
    }
  )
)

// Translations
export const translations = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      cart: 'Cart',
      account: 'Account',
      admin: 'Admin',
    },
    hero: {
      tagline: 'Authentic Moroccan Crafts, Delivered to Your Door',
      cta: 'Explore Collection',
    },
    categories: {
      title: 'Our Categories',
      pottery: 'Pottery & Ceramics',
      leather: 'Leather Goods',
      textiles: 'Traditional Textiles',
      lighting: 'Lighting',
      glassware: 'Glassware & Teapots',
    },
    bestSellers: {
      title: 'Best Sellers',
      viewAll: 'View All',
    },
    about: {
      title: 'The Heart of Fès',
      description: 'Nestled in the ancient medina of Fès, Dar Artisanat is more than a store—it is a bridge between centuries of Moroccan craftsmanship and the modern world. Our artisans, many of whom learned their craft from generations past, pour their souls into every piece. From the intricate zellige patterns of our ceramics to the supple leather of our bags, each item tells a story of dedication, tradition, and the timeless beauty of Moroccan artistry.',
    },
    newsletter: {
      title: 'Join Our Journey',
      description: 'Subscribe to receive exclusive offers and updates on new arrivals.',
      placeholder: 'Enter your email',
      button: 'Subscribe',
    },
    products: {
      filter: 'Filter',
      sort: 'Sort by',
      search: 'Search products...',
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
    },
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      continueShopping: 'Continue Shopping',
    },
    checkout: {
      title: 'Checkout',
      shipping: 'Shipping Information',
      payment: 'Payment',
      placeOrder: 'Place Order',
    },
    account: {
      title: 'My Account',
      orders: 'Order History',
      settings: 'Profile Settings',
    },
    footer: {
      rights: 'All rights reserved',
      location: 'Fès, Morocco',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      products: 'Produits',
      cart: 'Panier',
      account: 'Compte',
      admin: 'Admin',
    },
    hero: {
      tagline: 'Artisanat Marocain Authentique, Livré Chez Vous',
      cta: 'Explorer la Collection',
    },
    categories: {
      title: 'Nos Catégories',
      pottery: 'Poterie & Céramiques',
      leather: 'Maroquinerie',
      textiles: 'Textiles Traditionnels',
      lighting: 'Luminaires',
      glassware: 'Verrerie & Théières',
    },
    bestSellers: {
      title: 'Meilleures Ventes',
      viewAll: 'Voir Tout',
    },
    about: {
      title: 'Le Cœur de Fès',
      description: "Nichée dans l'ancienne médina de Fès, Dar Artisanat est plus qu'une boutique—c'est un pont entre des siècles d'artisanat marocain et le monde moderne. Nos artisans, dont beaucoup ont appris leur métier de générations passées, mettent leur âme dans chaque pièce. Des motifs zellige complexes de nos céramiques au cuir souple de nos sacs, chaque article raconte une histoire de dévouement, de tradition et de la beauté intemporelle de l'artisanat marocain.",
    },
    newsletter: {
      title: 'Rejoignez Notre Aventure',
      description: 'Abonnez-vous pour recevoir des offres exclusives et des mises à jour sur les nouveautés.',
      placeholder: 'Entrez votre email',
      button: "S'abonner",
    },
    products: {
      filter: 'Filtrer',
      sort: 'Trier par',
      search: 'Rechercher...',
      addToCart: 'Ajouter au Panier',
      outOfStock: 'Rupture de Stock',
    },
    cart: {
      title: 'Votre Panier',
      empty: 'Votre panier est vide',
      total: 'Total',
      checkout: 'Passer la Commande',
      continueShopping: 'Continuer vos Achats',
    },
    checkout: {
      title: 'Paiement',
      shipping: 'Informations de Livraison',
      payment: 'Paiement',
      placeOrder: 'Passer la Commande',
    },
    account: {
      title: 'Mon Compte',
      orders: 'Historique des Commandes',
      settings: 'Paramètres du Profil',
    },
    footer: {
      rights: 'Tous droits réservés',
      location: 'Fès, Maroc',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      products: 'المنتجات',
      cart: 'السلة',
      account: 'الحساب',
      admin: 'الإدارة',
    },
    hero: {
      tagline: 'حرف مغربية أصيلة، توصل إلى بابك',
      cta: 'استكشف المجموعة',
    },
    categories: {
      title: 'فئاتنا',
      pottery: 'الفخار والسيراميك',
      leather: 'المصنوعات الجلدية',
      textiles: 'المنسوجات التقليدية',
      lighting: 'الإضاءة',
      glassware: 'الزجاجيات وأباريق الشاي',
    },
    bestSellers: {
      title: 'الأكثر مبيعاً',
      viewAll: 'عرض الكل',
    },
    about: {
      title: 'قلب فاس',
      description: 'تقع دار الصناعة التقليدية في المدينة القديمة بفاس، وهي أكثر من مجرد متجر—إنها جسر بين قرون من الحرف المغربية والعالم الحديث. حرفيونا، الذين تعلم الكثير منهم حرفتهم من أجيال سابقة، يضعون أرواحهم في كل قطعة. من أنماط الزليج المعقدة في خزفياتنا إلى الجلد الناعم لحقائبنا، كل قطعة تروي قصة التفاني والتقاليد والجمال الخالد للفن المغربي.',
    },
    newsletter: {
      title: 'انضم إلى رحلتنا',
      description: 'اشترك للحصول على عروض حصرية وتحديثات عن المنتجات الجديدة.',
      placeholder: 'أدخل بريدك الإلكتروني',
      button: 'اشترك',
    },
    products: {
      filter: 'تصفية',
      sort: 'ترتيب حسب',
      search: 'البحث عن منتجات...',
      addToCart: 'أضف إلى السلة',
      outOfStock: 'نفذ من المخزون',
    },
    cart: {
      title: 'سلتك',
      empty: 'سلتك فارغة',
      total: 'المجموع',
      checkout: 'إتمام الشراء',
      continueShopping: 'متابعة التسوق',
    },
    checkout: {
      title: 'الدفع',
      shipping: 'معلومات الشحن',
      payment: 'الدفع',
      placeOrder: 'تأكيد الطلب',
    },
    account: {
      title: 'حسابي',
      orders: 'سجل الطلبات',
      settings: 'إعدادات الملف الشخصي',
    },
    footer: {
      rights: 'جميع الحقوق محفوظة',
      location: 'فاس، المغرب',
    },
  },
}

export type Translations = typeof translations.en
