"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/supabase-products"
import { getAllUsers } from "@/lib/supabase-users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Users, TrendingUp, Package, Plus, Edit, Trash2, Loader2, RefreshCw } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { toast } from "@/hooks/use-toast"
import type { Product } from "@/lib/store"

const CATEGORIES = [
  "Men's Tops",
  "Men's Bottoms",
  "Women's Tops",
  "Women's Bottoms",
  "Women's Dresses",
  "Accessories",
]

interface ProductFormData {
  name: string
  price: string
  original_price: string
  image: string
  category: string
  is_on_sale: boolean
  description: string
  sizes: string
  colors: string
  brand: string
}

const emptyForm: ProductFormData = {
  name: "",
  price: "",
  original_price: "",
  image: "",
  category: "",
  is_on_sale: false,
  description: "",
  sizes: "",
  colors: "",
  brand: "",
}

function ProductFormDialog({
  title,
  initial = emptyForm,
  onSubmit,
  trigger,
}: {
  title: string
  initial?: ProductFormData
  onSubmit: (data: ProductFormData) => Promise<void>
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setForm(initial)
  }, [open, initial])

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      toast({ title: "Missing fields", description: "Name, price, and category are required.", variant: "destructive" })
      return
    }
    setSaving(true)
    await onSubmit(form)
    setSaving(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Product Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Classic Oxford Shirt" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Price ($) *</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="49.99" />
            </div>
            <div className="grid gap-2">
              <Label>Original Price ($)</Label>
              <Input type="number" step="0.01" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} placeholder="69.99" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Image URL</Label>
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/my-image.jpg or https://..." />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description..." rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Sizes (comma-separated)</Label>
              <Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="XS, S, M, L, XL" />
            </div>
            <div className="grid gap-2">
              <Label>Colors (comma-separated)</Label>
              <Input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Black, White, Navy" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Brand</Label>
            <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Brand name" />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.is_on_sale} onCheckedChange={(v) => setForm({ ...form, is_on_sale: v })} />
            <Label>On Sale</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    const data = await getProducts()
    setProducts(data)
    setLoading(false)
  }

  const fetchUsers = async () => {
    const data = await getAllUsers()
    setUsers(data)
  }

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchProducts()
      fetchUsers()
    }
  }, [isAuthenticated, user])

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                Login with <strong>admin@example.com</strong> (password: 6+ chars) to access the admin dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const handleCreate = async (form: ProductFormData) => {
    const result = await createProduct({
      name: form.name,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      image: form.image || "/placeholder.svg",
      category: form.category,
      is_on_sale: form.is_on_sale,
      description: form.description || undefined,
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()) : undefined,
      colors: form.colors ? form.colors.split(",").map((s) => s.trim()) : undefined,
      brand: form.brand || undefined,
    })
    if (result) {
      toast({ title: "Product created!", description: `${result.name} has been added.` })
      fetchProducts()
    } else {
      toast({ title: "Error", description: "Failed to create product.", variant: "destructive" })
    }
  }

  const handleUpdate = async (id: number, form: ProductFormData) => {
    const result = await updateProduct(id, {
      name: form.name,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      image: form.image || "/placeholder.svg",
      category: form.category,
      is_on_sale: form.is_on_sale,
      description: form.description || undefined,
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()) : undefined,
      colors: form.colors ? form.colors.split(",").map((s) => s.trim()) : undefined,
      brand: form.brand || undefined,
    })
    if (result) {
      toast({ title: "Product updated!", description: `${result.name} has been updated.` })
      fetchProducts()
    } else {
      toast({ title: "Error", description: "Failed to update product.", variant: "destructive" })
    }
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return
    const success = await deleteProduct(product.id)
    if (success) {
      toast({ title: "Product deleted", description: `${product.name} has been removed.` })
      fetchProducts()
    } else {
      toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" })
    }
  }

  const stats = [
    { title: "Total Products", value: products.length.toString(), icon: Package, color: "text-blue-600" },
    { title: "On Sale", value: products.filter((p) => p.isOnSale).length.toString(), icon: ShoppingBag, color: "text-green-600" },
    { title: "Registered Users", value: users.length.toString(), icon: Users, color: "text-purple-600" },
    { title: "Avg Price", value: products.length > 0 ? `$${(products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(0)}` : "$0", icon: TrendingUp, color: "text-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage products — powered by Supabase</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchProducts} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <ProductFormDialog
              title="Add New Product"
              onSubmit={handleCreate}
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              }
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>
                  {loading ? "Loading from Supabase..." : `${products.length} products in database`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No products yet. Add your first product!</p>
                    <ProductFormDialog
                      title="Add New Product"
                      onSubmit={handleCreate}
                      trigger={<Button><Plus className="h-4 w-4 mr-2" />Add Product</Button>}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{product.category}</span>
                              {product.brand && <><span>·</span><span>{product.brand}</span></>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold">${product.price}</p>
                            {product.originalPrice && (
                              <p className="text-xs text-muted-foreground line-through">${product.originalPrice}</p>
                            )}
                          </div>
                          {product.isOnSale && <Badge className="bg-accent text-accent-foreground">Sale</Badge>}
                          <div className="flex gap-1">
                            <ProductFormDialog
                              title={`Edit: ${product.name}`}
                              initial={{
                                name: product.name,
                                price: product.price.toString(),
                                original_price: product.originalPrice?.toString() || "",
                                image: product.image,
                                category: product.category,
                                is_on_sale: product.isOnSale,
                                description: product.description || "",
                                sizes: product.sizes?.join(", ") || "",
                                colors: product.colors?.join(", ") || "",
                                brand: product.brand || "",
                              }}
                              onSubmit={(form) => handleUpdate(product.id, form)}
                              trigger={
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              }
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>{users.length} users in database</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No registered users yet.</p>
                ) : (
                  <div className="space-y-3">
                    {users.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-semibold">{u.name}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
