import { supabase } from "./supabase"

export interface SupabaseProduct {
    id: number
    name: string
    price: number
    original_price: number | null
    image: string
    category: string
    is_on_sale: boolean
    rating: number
    reviews: number
    description: string | null
    sizes: string[] | null
    colors: string[] | null
    brand: string | null
    created_at: string
}

// Convert Supabase row to app's Product shape
export function toProduct(row: SupabaseProduct) {
    return {
        id: row.id,
        name: row.name,
        price: Number(row.price),
        originalPrice: row.original_price ? Number(row.original_price) : undefined,
        image: row.image || "/placeholder.svg",
        category: row.category,
        isOnSale: row.is_on_sale,
        rating: Number(row.rating),
        reviews: row.reviews,
        description: row.description || undefined,
        sizes: row.sizes || undefined,
        colors: row.colors || undefined,
        brand: row.brand || undefined,
    }
}

// ---------- READ ----------

export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Failed to fetch products:", error)
        return []
    }
    return (data as SupabaseProduct[]).map(toProduct)
}

export async function getFeaturedProducts(limit = 4) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("rating", { ascending: false })
        .limit(limit)

    if (error) {
        console.error("Failed to fetch featured products:", error)
        return []
    }
    return (data as SupabaseProduct[]).map(toProduct)
}

export async function getProductsByCategory(category: string) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("category", `%${category}%`)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Failed to fetch products by category:", error)
        return []
    }
    return (data as SupabaseProduct[]).map(toProduct)
}

// ---------- CREATE ----------

export async function createProduct(product: {
    name: string
    price: number
    original_price?: number | null
    image?: string
    category: string
    is_on_sale?: boolean
    description?: string
    sizes?: string[]
    colors?: string[]
    brand?: string
}) {
    const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single()

    if (error) {
        console.error("Failed to create product:", error)
        return null
    }
    return toProduct(data as SupabaseProduct)
}

// ---------- UPDATE ----------

export async function updateProduct(
    id: number,
    updates: Partial<{
        name: string
        price: number
        original_price: number | null
        image: string
        category: string
        is_on_sale: boolean
        description: string
        sizes: string[]
        colors: string[]
        brand: string
        rating: number
        reviews: number
    }>
) {
    const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

    if (error) {
        console.error("Failed to update product:", error)
        return null
    }
    return toProduct(data as SupabaseProduct)
}

// ---------- DELETE ----------

export async function deleteProduct(id: number) {
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Failed to delete product:", error)
        return false
    }
    return true
}
