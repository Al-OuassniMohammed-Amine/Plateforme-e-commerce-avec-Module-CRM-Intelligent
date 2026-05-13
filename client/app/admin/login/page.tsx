'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiClient, ApiClientError } from '@/lib/api'
import { clearAuthToken, getAuthUserRole, hasRequiredRole, isAuthenticated, setAuthToken } from '@/lib/auth'
import type { LoginPayload, LoginResponse } from '@/lib/api-types'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated() && hasRequiredRole(['ADMIN'])) {
      router.replace('/admin')
    }
  }, [router])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage(null)

    const payload: LoginPayload = {
      email: email.trim(),
      password,
    }

    if (!payload.email || !payload.password) {
      setErrorMessage('Email and password are required.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await apiClient.post<LoginResponse>('/auth/login', payload)
      setAuthToken(response.token)

      const role = getAuthUserRole()
      if (role !== 'ADMIN') {
        clearAuthToken()
        setErrorMessage('Access denied. This dashboard is only for ADMIN users.')
        return
      }

      router.replace('/admin')
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to login. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border/50 p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm">Back to Store</span>
        </Link>

        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground mt-2">Login with an ADMIN account to manage products.</p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Lock className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
