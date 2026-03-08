"use client"

import Image from "next/image"
import { Star, ShoppingBag, Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useStore, type Product } from "@/lib/store"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

interface ProductQuickViewProps {
    product: Product
    isOpen: boolean
    onClose: () => void
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
    const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useStore()
    const [selectedSize, setSelectedSize] = useState<string>("")
    const [selectedColor, setSelectedColor] = useState<string>("")
    const [quantity, setQuantity] = useState(1)

    const wishlisted = isInWishlist(product.id)
    const sizes = product.sizes || ["XS", "S", "M", "L", "XL"]
    const colors = product.colors || ["Black", "White", "Navy"]

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedSize || sizes[0], selectedColor || colors[0])
        toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
        })
        onClose()
    }

    const handleWishlistToggle = () => {
        if (wishlisted) {
            removeFromWishlist(product.id)
            toast({ title: "Removed from wishlist", description: `${product.name} removed.` })
        } else {
            addToWishlist(product)
            toast({ title: "Added to wishlist", description: `${product.name} added to your wishlist.` })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[500px] bg-muted">
                        <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                        {product.isOnSale && (
                            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground shadow-lg">
                                Sale
                            </Badge>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">{product.category}</p>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-serif font-bold">{product.name}</DialogTitle>
                            </DialogHeader>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-accent fill-current" : "text-muted-foreground"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3 mt-4">
                                <span className="text-3xl font-bold text-primary">${product.price}</span>
                                {product.originalPrice && (
                                    <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                                )}
                                {product.originalPrice && (
                                    <Badge variant="secondary">
                                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                    </Badge>
                                )}
                            </div>

                            {product.description && (
                                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{product.description}</p>
                            )}

                            <Separator className="my-5" />

                            {/* Size Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Size</label>
                                <Select value={selectedSize} onValueChange={setSelectedSize}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sizes.map((size) => (
                                            <SelectItem key={size} value={size}>{size}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Color Selector */}
                            <div className="space-y-2 mt-4">
                                <label className="text-sm font-medium">Color</label>
                                <Select value={selectedColor} onValueChange={setSelectedColor}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colors.map((color) => (
                                            <SelectItem key={color} value={color}>{color}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2 mt-4">
                                <label className="text-sm font-medium">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        -
                                    </Button>
                                    <span className="font-semibold w-8 text-center">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <Button onClick={handleAddToCart} className="flex-1" size="lg">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Add to Cart
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleWishlistToggle}
                                className={wishlisted ? "text-accent" : ""}
                            >
                                <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
