'use client'

import { type FormEvent, useEffect, useRef, useState } from 'react'
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MoroccanPattern, GoldDivider } from '@/components/ui/moroccan-pattern'
import { useLanguageStore, translations } from '@/lib/store'

type AccountMode = 'login' | 'register'

export default function AccountPage() {
  const { language } = useLanguageStore()
  const t = translations[language]

  const [mode, setMode] = useState<AccountMode>('login')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    password: '',
  })

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  const switchMode = (nextMode: AccountMode) => {
    if (nextMode === mode || isTransitioning) {
      return
    }

    setIsTransitioning(true)
    transitionTimeoutRef.current = setTimeout(() => {
      setMode(nextMode)
      setShowPassword(false)
      setIsTransitioning(false)
    }, 170)
  }

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 px-4 bg-primary text-primary-foreground overflow-hidden">
          <MoroccanPattern className="absolute inset-0 opacity-10" variant="light" />
          <div className="container mx-auto relative z-10 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{t.account.title}</h1>
            <GoldDivider className="mx-auto max-w-xs" />
          </div>
        </section>

        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="mx-auto max-w-2xl rounded-2xl border border-[#e9decd] bg-card p-6 md:p-8 shadow-[0_10px_30px_rgba(48,25,16,0.08)]">
              <div
                className={`transition-all duration-300 ease-out ${
                  isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
                }`}
              >
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f5e8dd] text-[#b65f2d]">
                    {mode === 'login' ? <Lock className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
                  </div>
                  <h2 className="font-serif text-4xl font-bold text-foreground">
                    {mode === 'login' ? t.account.login : t.account.createAccount}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {mode === 'login'
                      ? t.account.loginDescription
                      : t.account.registerDescription}
                  </p>
                </div>

                {mode === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">{t.account.email}</Label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          required
                          placeholder={t.account.emailPlaceholder}
                          className="h-11 pl-10"
                          value={loginForm.email}
                          onChange={(event) =>
                            setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">{t.account.password}</Label>
                      <div className="relative">
                        <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder={t.account.passwordPlaceholder}
                          className="h-11 pl-10 pr-10"
                          value={loginForm.password}
                          onChange={(event) =>
                            setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={showPassword ? t.account.hidePassword : t.account.showPassword}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={loginForm.rememberMe}
                          onChange={(event) =>
                            setLoginForm((prev) => ({ ...prev, rememberMe: event.target.checked }))
                          }
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        {t.account.rememberMe}
                      </label>
                      <button
                        type="button"
                        className="text-sm font-medium text-[#b65f2d] transition-colors hover:text-[#a35427]"
                      >
                        {t.account.forgotPassword}
                      </button>
                    </div>

                    <Button type="submit" className="h-12 w-full bg-[#b65f2d] text-white hover:bg-[#a35427]">
                      {t.account.login}
                    </Button>

                    <div className="flex items-center gap-3 pt-3">
                      <span className="h-px flex-1 bg-border" />
                      <p className="text-sm text-muted-foreground">
                        {t.account.noAccount}{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('register')}
                          className="font-semibold text-[#b65f2d] transition-colors hover:text-[#a35427]"
                        >
                          {t.account.createAccount}
                        </button>
                      </p>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="register-last-name">{t.account.lastName}</Label>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="register-last-name"
                            required
                            placeholder={t.account.lastNamePlaceholder}
                            className="h-11 pl-10"
                            value={registerForm.lastName}
                            onChange={(event) =>
                              setRegisterForm((prev) => ({ ...prev, lastName: event.target.value }))
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-first-name">{t.account.firstName}</Label>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="register-first-name"
                            required
                            placeholder={t.account.firstNamePlaceholder}
                            className="h-11 pl-10"
                            value={registerForm.firstName}
                            onChange={(event) =>
                              setRegisterForm((prev) => ({ ...prev, firstName: event.target.value }))
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-phone">{t.account.phone}</Label>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="register-phone"
                            type="tel"
                            required
                            placeholder={t.account.phonePlaceholder}
                            className="h-11 pl-10"
                            value={registerForm.phone}
                            onChange={(event) =>
                              setRegisterForm((prev) => ({ ...prev, phone: event.target.value }))
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">{t.account.email}</Label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="register-email"
                            type="email"
                            required
                            placeholder={t.account.emailPlaceholder}
                            className="h-11 pl-10"
                            value={registerForm.email}
                            onChange={(event) =>
                              setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-city">{t.account.city}</Label>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="register-city"
                            required
                            placeholder={t.account.cityPlaceholder}
                            className="h-11 pl-10"
                            value={registerForm.city}
                            onChange={(event) =>
                              setRegisterForm((prev) => ({ ...prev, city: event.target.value }))
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-address">{t.account.address}</Label>
                        <div className="relative">
                          <MapPinned className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="register-address"
                            required
                            placeholder={t.account.addressPlaceholder}
                            className="h-11 pl-10"
                            value={registerForm.address}
                            onChange={(event) =>
                              setRegisterForm((prev) => ({ ...prev, address: event.target.value }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">{t.account.password}</Label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder={t.account.createPasswordPlaceholder}
                          className="h-11 pl-10 pr-10"
                          value={registerForm.password}
                          onChange={(event) =>
                            setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={showPassword ? t.account.hidePassword : t.account.showPassword}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="h-12 w-full bg-[#b65f2d] text-white hover:bg-[#a35427]">
                      {t.account.createMyAccount}
                    </Button>

                    <div className="flex items-center gap-3 pt-3">
                      <span className="h-px flex-1 bg-border" />
                      <p className="text-sm text-muted-foreground">
                        {t.account.alreadyHaveAccount}{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('login')}
                          className="font-semibold text-[#b65f2d] transition-colors hover:text-[#a35427]"
                        >
                          {t.account.login}
                        </button>
                      </p>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                  </form>
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
