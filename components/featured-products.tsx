"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { getFeaturedProducts } from "@/lib/supabase-products"
import type { Product } from "@/lib/store"

const fallbackProducts: Product[] = [
  { id: 1, name: "Premium Cotton T-Shirt", price: 49.99, originalPrice: 69.99, image: "/premium-white-cotton-t-shirt-on-model.jpg", category: "Men's Tops", isOnSale: true, rating: 4.8, reviews: 124 },
  { id: 2, name: "Elegant Midi Dress", price: 129.99, image: "/elegant-black-midi-dress-on-model.jpg", category: "Women's Dresses", isOnSale: false, rating: 4.9, reviews: 89 },
  { id: 3, name: "Classic Denim Jacket", price: 89.99, image: "/classic-blue-denim-jacket-on-model.jpg", category: "Men's Tops", isOnSale: false, rating: 4.7, reviews: 156 },
  { id: 4, name: "Silk Blouse", price: 79.99, originalPrice: 99.99, image: "/elegant-silk-blouse-on-model.jpg", category: "Women's Tops", isOnSale: true, rating: 4.6, reviews: 73 },
]

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await getFeaturedProducts(4)
        setProducts(data.length > 0 ? data : fallbackProducts)
      } catch {
        setProducts(fallbackProducts)
      }
      setLoading(false)
    }
    fetchFeatured()
  }, [])

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/10 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-balance">Featured Products</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Handpicked selections from our latest collection, curated for style and quality.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {products.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <Button
            asChild
            size="lg"
            className="bg-black text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-3"
          >
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
