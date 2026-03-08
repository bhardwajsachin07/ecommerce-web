"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { getProducts } from "@/lib/supabase-products"
import type { Product } from "@/lib/store"

// Fallback data in case Supabase is unreachable
const fallbackProducts: Product[] = [
  { id: 1, name: "Premium Cotton T-Shirt", price: 49.99, originalPrice: 69.99, image: "/premium-white-cotton-t-shirt-on-model.jpg", category: "Men's Tops", isOnSale: true, rating: 4.8, reviews: 124 },
  { id: 2, name: "Elegant Midi Dress", price: 129.99, image: "/elegant-black-midi-dress-on-model.jpg", category: "Women's Dresses", isOnSale: false, rating: 4.9, reviews: 89 },
  { id: 3, name: "Classic Denim Jacket", price: 89.99, image: "/classic-blue-denim-jacket-on-model.jpg", category: "Men's Tops", isOnSale: false, rating: 4.7, reviews: 156 },
  { id: 4, name: "Silk Blouse", price: 79.99, originalPrice: 99.99, image: "/elegant-silk-blouse-on-model.jpg", category: "Women's Tops", isOnSale: true, rating: 4.6, reviews: 73 },
  { id: 5, name: "Leather Handbag", price: 199.99, image: "/luxury-leather-handbag.jpg", category: "Accessories", isOnSale: false, rating: 4.8, reviews: 92 },
  { id: 6, name: "Wool Sweater", price: 89.99, image: "/cozy-wool-sweater-on-model.jpg", category: "Women's Tops", isOnSale: false, rating: 4.5, reviews: 67 },
]

interface ProductGridProps {
  category?: string
  filterByGender?: boolean
}

export function ProductGrid({ category, filterByGender = false }: ProductGridProps) {
  const [sortBy, setSortBy] = useState("featured")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const data = await getProducts()
        setProducts(data.length > 0 ? data : fallbackProducts)
      } catch {
        setProducts(fallbackProducts)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  // Filter products by category
  let filteredProducts = products
  if (category) {
    filteredProducts = filteredProducts.filter((product) => {
      if (category === "men") return product.category.toLowerCase().includes("men")
      if (category === "women") return product.category.toLowerCase().includes("women")
      if (category === "accessories") return product.category.toLowerCase().includes("accessories")
      return true
    })
  }

  if (filterByGender && category) {
    if (category === "men") {
      filteredProducts = filteredProducts.filter(product => !product.category.toLowerCase().includes("women"))
    } else if (category === "women") {
      filteredProducts = filteredProducts.filter(product => {
        const lc = product.category.toLowerCase()
        return lc.includes("women") || !lc.includes("men")
      })
    }
  }

  // Sort
  const sorted = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price
      case "price-high": return b.price - a.price
      case "rating": return b.rating - a.rating
      default: return 0
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading products...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 p-4 glass rounded-xl backdrop-blur-xl">
        <p className="text-muted-foreground font-medium">Showing {sorted.length} products</p>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 glass border-white/20">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="glass backdrop-blur-xl">
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sorted.map((product, index) => (
          <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
