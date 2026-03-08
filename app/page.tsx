import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoryGrid } from "@/components/category-grid"
import { RecentlyViewed } from "@/components/recently-viewed"
import { Footer } from "@/components/footer"
import { AIAssistantWidget } from "@/components/ai-assistant-widget"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <RecentlyViewed />
        <CategoryGrid />
      </main>
      <Footer />
      <AIAssistantWidget />
    </div>
  )
}
