"use client"

import { useState } from "react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tag, X, CheckCircle } from "lucide-react"
import { useStore } from "@/lib/store"

// Hardcoded coupon codes
const COUPONS: Record<string, { type: "percent" | "flat" | "freeship"; value: number; label: string }> = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  FLAT20: { type: "flat", value: 20, label: "$20 off" },
  FREESHIP: { type: "freeship", value: 0, label: "Free shipping" },
}

export function CheckoutSummary() {
  const { cartItems, getCartTotal } = useStore()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState("")

  const cartTotal = getCartTotal()
  const baseShipping = cartTotal > 100 ? 0 : 9.99

  // Calculate coupon discount
  let couponDiscount = 0
  let shipping = baseShipping
  if (appliedCoupon && COUPONS[appliedCoupon]) {
    const coupon = COUPONS[appliedCoupon]
    if (coupon.type === "percent") {
      couponDiscount = cartTotal * (coupon.value / 100)
    } else if (coupon.type === "flat") {
      couponDiscount = Math.min(coupon.value, cartTotal)
    } else if (coupon.type === "freeship") {
      shipping = 0
    }
  }

  const tax = (cartTotal - couponDiscount) * 0.08
  const finalTotal = cartTotal - couponDiscount + shipping + tax

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase()
    if (!code) return

    if (COUPONS[code]) {
      setAppliedCoupon(code)
      setCouponError("")
      setCouponCode("")
    } else {
      setCouponError("Invalid coupon code")
      setAppliedCoupon(null)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponError("")
  }

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="max-h-80 overflow-y-auto mb-4 pr-2">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3 mb-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <div className="flex text-xs text-muted-foreground">
                  <p>Qty: {item.quantity}</p>
                  {item.selectedSize && <p className="ml-2">Size: {item.selectedSize}</p>}
                  {item.selectedColor && <p className="ml-2">Color: {item.selectedColor}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                {item.originalPrice && (
                  <p className="text-xs text-muted-foreground line-through">
                    ${(item.originalPrice * item.quantity).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Coupon Code */}
        <div className="mb-4">
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{appliedCoupon}</span>
                <Badge variant="secondary" className="text-xs">{COUPONS[appliedCoupon].label}</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemoveCoupon}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value); setCouponError("") }}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  className="pl-9 text-sm"
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleApplyCoupon} className="shrink-0">
                Apply
              </Button>
            </div>
          )}
          {couponError && <p className="text-xs text-destructive mt-1">{couponError}</p>}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm text-primary">
              <span>Discount ({COUPONS[appliedCoupon!].label})</span>
              <span>-${couponDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {cartTotal < 100 && !appliedCoupon && (
          <p className="text-sm text-muted-foreground mt-4">
            Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
          </p>
        )}

        {!appliedCoupon && (
          <p className="text-xs text-muted-foreground mt-3 italic">
            Try codes: SAVE10, FLAT20, FREESHIP
          </p>
        )}
      </CardContent>
    </Card>
  )
}