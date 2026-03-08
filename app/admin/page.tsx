"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Users, TrendingUp, Package, Plus, Edit, Trash2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// Sample product data for admin view
const adminProducts = [
  { id: 1, name: "Premium Cotton T-Shirt", category: "Men's Tops", price: 49.99, image: "/premium-white-cotton-t-shirt-on-model.jpg", inStock: true },
  { id: 2, name: "Elegant Midi Dress", category: "Women's Dresses", price: 129.99, image: "/elegant-black-midi-dress-on-model.jpg", inStock: true },
  { id: 3, name: "Classic Denim Jacket", category: "Men's Tops", price: 89.99, image: "/classic-blue-denim-jacket-on-model.jpg", inStock: true },
  { id: 4, name: "Silk Blouse", category: "Women's Tops", price: 79.99, image: "/elegant-silk-blouse-on-model.jpg", inStock: true },
  { id: 5, name: "Cozy Wool Sweater", category: "Men's Tops", price: 99.99, image: "/cozy-wool-sweater-on-model.jpg", inStock: false },
  { id: 6, name: "Luxury Leather Handbag", category: "Accessories", price: 199.99, image: "/luxury-leather-handbag.jpg", inStock: true },
]

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You need admin privileges to access this page. Login with admin@example.com to access.</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  const stats = [
    { title: "Total Products", value: adminProducts.length.toString(), icon: Package, color: "text-blue-600" },
    { title: "Total Orders", value: "1,234", icon: ShoppingBag, color: "text-green-600" },
    { title: "Active Users", value: "5,678", icon: Users, color: "text-purple-600" },
    { title: "Revenue", value: "$89,012", icon: TrendingUp, color: "text-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your fashion store</p>
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

        {/* Admin Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid gap-4">
              {adminProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <p className="text-lg font-bold">${product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={product.inStock ? "default" : "destructive"}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold">Order Management</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Order management functionality would be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">User management functionality would be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Store Settings</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Store settings would be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
