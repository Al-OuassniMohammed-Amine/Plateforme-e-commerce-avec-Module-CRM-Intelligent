'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Edit, Plus, Save, Search, Trash2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { apiClient, ApiClientError } from '@/lib/api'
import { clearAuthToken, hasRequiredRole, isAuthenticated } from '@/lib/auth'
import { resolveProductImageUrl } from '@/lib/product-mapper'
import type {
  ApiCategory,
  ApiProductWithCategory,
  ApiSuccessResponse,
} from '@/lib/api-types'

type ProductFormState = {
  name: string
  description: string
  price: string
  stock: string
  categoryId: string
}

type FeedbackState = {
  type: 'success' | 'error'
  message: string
} | null

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
])

const initialFormState: ProductFormState = {
  name: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
}

const parseApiError = (error: unknown): string => {
  if (error instanceof ApiClientError) {
    return error.message
  }

  return 'Unexpected error. Please try again.'
}

const validateForm = (formState: ProductFormState): string | null => {
  if (!formState.name.trim()) {
    return 'Product name is required.'
  }

  const parsedPrice = Number(formState.price)
  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    return 'Price must be greater than 0.'
  }

  const parsedStock = Number(formState.stock)
  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    return 'Stock must be an integer greater than or equal to 0.'
  }

  const parsedCategoryId = Number(formState.categoryId)
  if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
    return 'Please select a valid category.'
  }

  return null
}

const buildProductFormData = (formState: ProductFormState, file: File | null): FormData => {
  const formData = new FormData()

  formData.append('name', formState.name.trim())
  formData.append('description', formState.description.trim())
  formData.append('price', String(Number(formState.price)))
  formData.append('stock', String(Number(formState.stock)))
  formData.append('categoryId', formState.categoryId)

  if (file) {
    formData.append('image', file)
  }

  return formData
}

export default function AdminDashboardPage() {
  const router = useRouter()

  const [accessChecked, setAccessChecked] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<ApiProductWithCategory[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [formState, setFormState] = useState<ProductFormState>(initialFormState)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState>(null)

  const isEditing = editingProductId !== null

  useEffect(() => {
    if (!selectedImageFile) {
      setSelectedImagePreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(selectedImageFile)
    setSelectedImagePreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedImageFile])

  const loadData = useCallback(async () => {
    try {
      setIsLoadingData(true)

      const [categoriesResponse, productsResponse] = await Promise.all([
        apiClient.get<ApiSuccessResponse<ApiCategory[]>>('/categories'),
        apiClient.get<ApiSuccessResponse<ApiProductWithCategory[]>>('/products', {
          page: 1,
          limit: 100,
        }),
      ])

      setCategories(categoriesResponse.data)
      setProducts(productsResponse.data)
    } catch (error) {
      if (error instanceof ApiClientError && (error.statusCode === 401 || error.statusCode === 403)) {
        clearAuthToken()
        router.replace('/admin/login')
        return
      }

      setFeedback({
        type: 'error',
        message: parseApiError(error),
      })
    } finally {
      setIsLoadingData(false)
    }
  }, [router])

  useEffect(() => {
    if (!isAuthenticated() || !hasRequiredRole(['ADMIN'])) {
      clearAuthToken()
      router.replace('/admin/login')
      return
    }

    setAccessChecked(true)
    void loadData()
  }, [loadData, router])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return products
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(normalizedSearch) ||
        (product.description || '').toLowerCase().includes(normalizedSearch) ||
        product.category.name.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [products, searchTerm])

  const previewImageUrl = useMemo(() => {
    if (selectedImagePreviewUrl) {
      return selectedImagePreviewUrl
    }

    if (existingImageUrl) {
      return resolveProductImageUrl(existingImageUrl)
    }

    return null
  }, [existingImageUrl, selectedImagePreviewUrl])

  const resetForm = () => {
    setFormState(initialFormState)
    setEditingProductId(null)
    setSelectedImageFile(null)
    setExistingImageUrl(null)
  }

  const handleLogout = () => {
    clearAuthToken()
    router.replace('/admin/login')
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setSelectedImageFile(null)
      return
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setSelectedImageFile(null)
      setFeedback({
        type: 'error',
        message: 'Only jpg, jpeg, png and webp images are allowed.',
      })
      event.target.value = ''
      return
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setSelectedImageFile(null)
      setFeedback({
        type: 'error',
        message: 'Image size must be 2MB or less.',
      })
      event.target.value = ''
      return
    }

    setFeedback(null)
    setSelectedImageFile(file)
  }

  const handleEditProduct = (product: ApiProductWithCategory) => {
    setFeedback(null)
    setEditingProductId(product.id)
    setFormState({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      categoryId: String(product.categoryId),
    })
    setExistingImageUrl(product.imageUrl)
    setSelectedImageFile(null)
  }

  const handleDeleteProduct = async (product: ApiProductWithCategory) => {
    const shouldDelete = window.confirm(`Delete "${product.name}"?`)

    if (!shouldDelete) {
      return
    }

    try {
      setFeedback(null)
      await apiClient.delete<ApiSuccessResponse<ApiProductWithCategory>>(`/products/${product.id}`)
      setFeedback({
        type: 'success',
        message: 'Product deleted successfully.',
      })
      await loadData()
    } catch (error) {
      setFeedback({
        type: 'error',
        message: parseApiError(error),
      })
    }
  }

  const handleSubmitProduct = async (event: React.FormEvent) => {
    event.preventDefault()
    setFeedback(null)

    const validationError = validateForm(formState)
    if (validationError) {
      setFeedback({
        type: 'error',
        message: validationError,
      })
      return
    }

    const formData = buildProductFormData(formState, selectedImageFile)

    try {
      setIsSubmitting(true)

      if (isEditing && editingProductId !== null) {
        await apiClient.patch<ApiSuccessResponse<ApiProductWithCategory>>(
          `/products/${editingProductId}`,
          formData
        )
        setFeedback({
          type: 'success',
          message: 'Product updated successfully.',
        })
      } else {
        await apiClient.post<ApiSuccessResponse<ApiProductWithCategory>>('/products', formData)
        setFeedback({
          type: 'success',
          message: 'Product created successfully.',
        })
      }

      resetForm()
      await loadData()
    } catch (error) {
      setFeedback({
        type: 'error',
        message: parseApiError(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!accessChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Checking admin access...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-3">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm">Back to Store</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-foreground">Admin Product Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage products directly from backend API.</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {feedback && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-red-300 bg-red-50 text-red-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <section className="bg-card rounded-lg border border-border/50 p-6 mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h2>

          <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Name"
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            />
            <Input
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              value={formState.price}
              onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
            />
            <Input
              placeholder="Stock"
              type="number"
              min="0"
              step="1"
              value={formState.stock}
              onChange={(event) => setFormState((prev) => ({ ...prev, stock: event.target.value }))}
            />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={formState.categoryId}
              onChange={(event) => setFormState((prev) => ({ ...prev, categoryId: event.target.value }))}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="md:col-span-2">
              <Input
                placeholder="Description"
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-medium text-foreground">Product image</label>
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">Accepted: jpg, jpeg, png, webp | Max: 2MB</p>
              </div>

              {previewImageUrl && (
                <div className="relative w-36 h-36 rounded-md overflow-hidden border border-border">
                  <Image
                    src={previewImageUrl}
                    alt="Product preview"
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Update Product'}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Create Product'}
                  </>
                )}
              </Button>
              {(isEditing || selectedImageFile || existingImageUrl) && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-card rounded-lg border border-border/50 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">Products</h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          {isLoadingData ? (
            <p className="text-muted-foreground">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-muted-foreground">No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const productImage = resolveProductImageUrl(product.imageUrl)

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-[240px]">
                            <div className="relative w-12 h-12 rounded overflow-hidden">
                              <Image
                                src={productImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {product.description || 'No description'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category.name}</TableCell>
                        <TableCell>{Number(product.price).toFixed(2)} DH</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
