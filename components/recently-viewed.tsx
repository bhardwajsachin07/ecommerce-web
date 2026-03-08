"use client"

import { useStore } from "@/lib/store"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function RecentlyViewed() {
    const { recentlyViewed, addToRecentlyViewed } = useStore()

    if (recentlyViewed.length === 0) return null

    return (
        <section className="py-16 px-4 bg-gradient-to-b from-muted/10 to-background">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div className="animate-fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">Recently Viewed</h2>
                        <p className="text-muted-foreground text-base">
                            Pick up where you left off
                        </p>
                    </div>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    {recentlyViewed.map((product, index) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-[260px] snap-start animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.08}s` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
