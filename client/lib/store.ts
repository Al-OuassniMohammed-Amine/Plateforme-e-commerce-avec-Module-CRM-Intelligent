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
      title: 'The Heart of FÃ¨s',
      description: 'Nestled in the ancient medina of FÃ¨s, Dar Artisanat is more than a storeâ€”it is a bridge between centuries of Moroccan craftsmanship and the modern world. Our artisans, many of whom learned their craft from generations past, pour their souls into every piece. From the intricate zellige patterns of our ceramics to the supple leather of our bags, each item tells a story of dedication, tradition, and the timeless beauty of Moroccan artistry.',
    },
    craftSection: {
      subtitle: 'CRAFTSMANSHIP IN',
      titleLine1: 'All its',
      titleLine2: 'splendor',
      paragraph1:
        'For centuries, craftsmanship has embodied ingenuity, passion, and know-how passed down from generation to generation.',
      paragraph2:
        'Each piece tells a unique story, carefully handcrafted with authenticity.',
      paragraph3:
        'Discover a world where tradition and creativity meet to bring exceptional creations to life.',
      cta: 'See our collection',
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
      login: 'Sign in',
      loginDescription: 'Sign in to your account to continue.',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      createAccount: 'Create an account',
      registerDescription: 'Fill in the information below to create your account.',
      lastName: 'Last name',
      firstName: 'First name',
      phone: 'Phone',
      city: 'City',
      address: 'Address',
      lastNamePlaceholder: 'Enter your last name',
      firstNamePlaceholder: 'Enter your first name',
      phonePlaceholder: 'Enter your phone',
      cityPlaceholder: 'Enter your city',
      addressPlaceholder: 'Enter your address',
      createPasswordPlaceholder: 'Create a password',
      createMyAccount: 'Create my account',
      alreadyHaveAccount: 'Already have an account?',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
    },
    footer: {
      rights: 'All rights reserved',
      location: 'FÃ¨s, Morocco',
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
      description: "Nichée dans l'ancienne médina de Fès, Dar Artisanat est plus qu'une boutique, c'est un pont entre des siècles d'artisanat marocain et le monde moderne. Nos artisans, dont beaucoup ont appris leur métier de générations passées, mettent leur âme dans chaque pièce. Des motifs zellige complexes de nos céramiques au cuir souple de nos sacs, chaque article raconte une histoire de dévouement, de tradition et de beauté intemporelle de l'artisanat.",
    },
    craftSection: {
      subtitle: "L’ARTISANAT DANS",
      titleLine1: 'Toute sa',
      titleLine2: 'splendeur',
      paragraph1:
        'Depuis des siècles, l’artisanat incarne l’ingéniosité, la passion et le savoir-faire transmis de génération en génération.',
      paragraph2:
        'Chaque pièce raconte une histoire unique, façonnée à la main avec soin et authenticité.',
      paragraph3:
        'Découvrez un univers où tradition et créativité se rencontrent pour donner vie à des créations d’exception.',
      cta: 'Voir notre collection',
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
      login: 'Se connecter',
      loginDescription: 'Connectez-vous à votre compte pour continuer.',
      email: 'Email',
      password: 'Mot de passe',
      emailPlaceholder: 'Entrez votre email',
      passwordPlaceholder: 'Entrez votre mot de passe',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      noAccount: 'Pas encore de compte ?',
      createAccount: 'Créer un compte',
      registerDescription: 'Remplissez les informations ci-dessous pour créer votre compte.',
      lastName: 'Nom',
      firstName: 'Prénom',
      phone: 'Téléphone',
      city: 'Ville',
      address: 'Adresse',
      lastNamePlaceholder: 'Entrez votre nom',
      firstNamePlaceholder: 'Entrez votre prénom',
      phonePlaceholder: 'Entrez votre téléphone',
      cityPlaceholder: 'Entrez votre ville',
      addressPlaceholder: 'Entrez votre adresse',
      createPasswordPlaceholder: 'Créez un mot de passe',
      createMyAccount: 'Créer mon compte',
      alreadyHaveAccount: 'Vous avez déjà un compte ?',
      showPassword: 'Afficher le mot de passe',
      hidePassword: 'Masquer le mot de passe',
    },
    footer: {
      rights: 'Tous droits réservés',
      location: 'Fès, Maroc',
    },
  },
  ar: {
    nav: {
      home: 'Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©',
      products: 'Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª',
      cart: 'Ø§Ù„Ø³Ù„Ø©',
      account: 'Ø§Ù„Ø­Ø³Ø§Ø¨',
      admin: 'Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©',
    },
    hero: {
      tagline: 'Ø­Ø±Ù Ù…ØºØ±Ø¨ÙŠØ© Ø£ØµÙŠÙ„Ø©ØŒ ØªÙˆØµÙ„ Ø¥Ù„Ù‰ Ø¨Ø§Ø¨Ùƒ',
      cta: 'Ø§Ø³ØªÙƒØ´Ù Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹Ø©',
    },
    categories: {
      title: 'ÙØ¦Ø§ØªÙ†Ø§',
      pottery: 'Ø§Ù„ÙØ®Ø§Ø± ÙˆØ§Ù„Ø³ÙŠØ±Ø§Ù…ÙŠÙƒ',
      leather: 'Ø§Ù„Ù…ØµÙ†ÙˆØ¹Ø§Øª Ø§Ù„Ø¬Ù„Ø¯ÙŠØ©',
      textiles: 'Ø§Ù„Ù…Ù†Ø³ÙˆØ¬Ø§Øª Ø§Ù„ØªÙ‚Ù„ÙŠØ¯ÙŠØ©',
      lighting: 'Ø§Ù„Ø¥Ø¶Ø§Ø¡Ø©',
      glassware: 'Ø§Ù„Ø²Ø¬Ø§Ø¬ÙŠØ§Øª ÙˆØ£Ø¨Ø§Ø±ÙŠÙ‚ Ø§Ù„Ø´Ø§ÙŠ',
    },
    bestSellers: {
      title: 'Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø¨ÙŠØ¹Ø§Ù‹',
      viewAll: 'Ø¹Ø±Ø¶ Ø§Ù„ÙƒÙ„',
    },
    about: {
      title: 'Ù‚Ù„Ø¨ ÙØ§Ø³',
      description: 'ØªÙ‚Ø¹ Ø¯Ø§Ø± Ø§Ù„ØµÙ†Ø§Ø¹Ø© Ø§Ù„ØªÙ‚Ù„ÙŠØ¯ÙŠØ© ÙÙŠ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ù‚Ø¯ÙŠÙ…Ø© Ø¨ÙØ§Ø³ØŒ ÙˆÙ‡ÙŠ Ø£ÙƒØ«Ø± Ù…Ù† Ù…Ø¬Ø±Ø¯ Ù…ØªØ¬Ø±â€”Ø¥Ù†Ù‡Ø§ Ø¬Ø³Ø± Ø¨ÙŠÙ† Ù‚Ø±ÙˆÙ† Ù…Ù† Ø§Ù„Ø­Ø±Ù Ø§Ù„Ù…ØºØ±Ø¨ÙŠØ© ÙˆØ§Ù„Ø¹Ø§Ù„Ù… Ø§Ù„Ø­Ø¯ÙŠØ«. Ø­Ø±ÙÙŠÙˆÙ†Ø§ØŒ Ø§Ù„Ø°ÙŠÙ† ØªØ¹Ù„Ù… Ø§Ù„ÙƒØ«ÙŠØ± Ù…Ù†Ù‡Ù… Ø­Ø±ÙØªÙ‡Ù… Ù…Ù† Ø£Ø¬ÙŠØ§Ù„ Ø³Ø§Ø¨Ù‚Ø©ØŒ ÙŠØ¶Ø¹ÙˆÙ† Ø£Ø±ÙˆØ§Ø­Ù‡Ù… ÙÙŠ ÙƒÙ„ Ù‚Ø·Ø¹Ø©. Ù…Ù† Ø£Ù†Ù…Ø§Ø· Ø§Ù„Ø²Ù„ÙŠØ¬ Ø§Ù„Ù…Ø¹Ù‚Ø¯Ø© ÙÙŠ Ø®Ø²ÙÙŠØ§ØªÙ†Ø§ Ø¥Ù„Ù‰ Ø§Ù„Ø¬Ù„Ø¯ Ø§Ù„Ù†Ø§Ø¹Ù… Ù„Ø­Ù‚Ø§Ø¦Ø¨Ù†Ø§ØŒ ÙƒÙ„ Ù‚Ø·Ø¹Ø© ØªØ±ÙˆÙŠ Ù‚ØµØ© Ø§Ù„ØªÙØ§Ù†ÙŠ ÙˆØ§Ù„ØªÙ‚Ø§Ù„ÙŠØ¯ ÙˆØ§Ù„Ø¬Ù…Ø§Ù„ Ø§Ù„Ø®Ø§Ù„Ø¯ Ù„Ù„ÙÙ† Ø§Ù„Ù…ØºØ±Ø¨ÙŠ.',
    },
    craftSection: {
      subtitle: 'الحرفية في',
      titleLine1: 'كامل',
      titleLine2: 'رونقها',
      paragraph1:
        'منذ قرون، تجسد الحرفية روح الإبداع والشغف والخبرة المتوارثة جيلاً بعد جيل.',
      paragraph2:
        'كل قطعة تحكي قصة فريدة، صُنعت يدويًا بعناية وأصالة.',
      paragraph3:
        'اكتشف عالمًا تلتقي فيه التقاليد مع الإبداع لتولد إبداعات استثنائية.',
      cta: 'شاهد مجموعتنا',
    },
    newsletter: {
      title: 'Ø§Ù†Ø¶Ù… Ø¥Ù„Ù‰ Ø±Ø­Ù„ØªÙ†Ø§',
      description: 'Ø§Ø´ØªØ±Ùƒ Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø¹Ø±ÙˆØ¶ Ø­ØµØ±ÙŠØ© ÙˆØªØ­Ø¯ÙŠØ«Ø§Øª Ø¹Ù† Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©.',
      placeholder: 'Ø£Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ',
      button: 'Ø§Ø´ØªØ±Ùƒ',
    },
    products: {
      filter: 'ØªØµÙÙŠØ©',
      sort: 'ØªØ±ØªÙŠØ¨ Ø­Ø³Ø¨',
      search: 'Ø§Ù„Ø¨Ø­Ø« Ø¹Ù† Ù…Ù†ØªØ¬Ø§Øª...',
      addToCart: 'Ø£Ø¶Ù Ø¥Ù„Ù‰ Ø§Ù„Ø³Ù„Ø©',
      outOfStock: 'Ù†ÙØ° Ù…Ù† Ø§Ù„Ù…Ø®Ø²ÙˆÙ†',
    },
    cart: {
      title: 'Ø³Ù„ØªÙƒ',
      empty: 'Ø³Ù„ØªÙƒ ÙØ§Ø±ØºØ©',
      total: 'Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹',
      checkout: 'Ø¥ØªÙ…Ø§Ù… Ø§Ù„Ø´Ø±Ø§Ø¡',
      continueShopping: 'Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ØªØ³ÙˆÙ‚',
    },
    checkout: {
      title: 'Ø§Ù„Ø¯ÙØ¹',
      shipping: 'Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ø´Ø­Ù†',
      payment: 'Ø§Ù„Ø¯ÙØ¹',
      placeOrder: 'ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨',
    },
    account: {
      title: 'حسابي',
      orders: 'سجل الطلبات',
      settings: 'إعدادات الملف الشخصي',
      login: 'تسجيل الدخول',
      loginDescription: 'سجل الدخول إلى حسابك للمتابعة.',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      passwordPlaceholder: 'أدخل كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'هل نسيت كلمة المرور؟',
      noAccount: 'ليس لديك حساب بعد؟',
      createAccount: 'إنشاء حساب',
      registerDescription: 'املأ المعلومات أدناه لإنشاء حسابك.',
      lastName: 'الاسم العائلي',
      firstName: 'الاسم الشخصي',
      phone: 'الهاتف',
      city: 'المدينة',
      address: 'العنوان',
      lastNamePlaceholder: 'أدخل اسمك العائلي',
      firstNamePlaceholder: 'أدخل اسمك الشخصي',
      phonePlaceholder: 'أدخل هاتفك',
      cityPlaceholder: 'أدخل مدينتك',
      addressPlaceholder: 'أدخل عنوانك',
      createPasswordPlaceholder: 'أنشئ كلمة مرور',
      createMyAccount: 'إنشاء حسابي',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      showPassword: 'إظهار كلمة المرور',
      hidePassword: 'إخفاء كلمة المرور',
    },
    footer: {
      rights: 'Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ‚ Ù…Ø­ÙÙˆØ¸Ø©',
      location: 'ÙØ§Ø³ØŒ Ø§Ù„Ù…ØºØ±Ø¨',
    },
  },
}

export type Translations = typeof translations.en


