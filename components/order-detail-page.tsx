"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { format, addDays } from "date-fns"
import { ArrowLeft, Printer, Download, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { Order } from "@/lib/store"

// Default mock order in case the real order is not found
const defaultOrder = {
  id: "ORD123456",
  date: new Date("2023-11-15"),
  status: "Delivered",
  paymentMethod: "Visa ending in 4242",
  items: [
    {
      id: 1,
      name: "Classic White T-Shirt",
      quantity: 2,
      price: 29.99,
      image: "/placeholder.svg",
      selectedSize: "M",
      selectedColor: "White",
    },
    {
      id: 2,
      name: "Slim Fit Jeans",
      quantity: 1,
      price: 69.99,
      image: "/placeholder.svg",
      selectedSize: "32",
      selectedColor: "Blue",
    },
  ],
  subtotal: 129.97,
  shipping: 0,
  tax: 10.40,
  total: 140.37,
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "555-123-4567",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },
}

// Order tracking steps
const trackingSteps = [
  { key: "Processing", label: "Order Placed", icon: Package, description: "Your order has been confirmed" },
  { key: "Confirmed", label: "Processing", icon: Clock, description: "We're preparing your items" },
  { key: "Shipped", label: "Shipped", icon: Truck, description: "Your order is on its way" },
  { key: "Out for Delivery", label: "Out for Delivery", icon: MapPin, description: "Almost there!" },
  { key: "Delivered", label: "Delivered", icon: CheckCircle, description: "Order delivered successfully" },
]

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    "Processing": 1,
    "Confirmed": 2,
    "Shipped": 3,
    "Out for Delivery": 4,
    "Delivered": 5,
  }
  return map[status] || 1
}

function OrderTrackingTimeline({ status, orderDate }: { status: string; orderDate: Date }) {
  const completedSteps = getStepIndex(status)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Order Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {trackingSteps.map((step, index) => {
            const isCompleted = index < completedSteps
            const isCurrent = index === completedSteps - 1
            const StepIcon = step.icon
            const stepDate = addDays(orderDate, index * 2)

            return (
              <div key={step.key} className="flex gap-4 relative">
                {/* Vertical Line */}
                {index < trackingSteps.length - 1 && (
                  <div
                    className={`absolute left-[19px] top-[40px] w-0.5 h-[calc(100%-8px)] ${isCompleted && index < completedSteps - 1 ? "bg-primary" : "bg-border"
                      }`}
                  />
                )}

                {/* Icon */}
                <div
                  className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted
                      ? isCurrent
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                        : "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  <StepIcon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className={`pb-8 flex-1 ${!isCompleted ? "opacity-50" : ""}`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium text-sm ${isCurrent ? "text-primary" : ""}`}>
                      {step.label}
                    </h4>
                    {isCompleted && (
                      <span className="text-xs text-muted-foreground">
                        {format(stepDate, "MMM d, h:mm a")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  {isCurrent && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Current Status
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | typeof defaultOrder>(defaultOrder)

  useEffect(() => {
    const { getOrder } = useStore.getState()
    const foundOrder = getOrder(orderId)
    if (foundOrder) {
      setOrder(foundOrder)
    }
  }, [orderId])

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <p className="text-muted-foreground mb-8">The order you are looking for does not exist</p>
        <Button asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Order {order.id}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="mb-2" variant={order.status === "Delivered" ? "outline" : "secondary"}>
              {order.status}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Placed on {format(order.date, "MMMM d, yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{order.paymentMethod}</p>
            <p className="text-sm text-muted-foreground mt-1">{order.shippingAddress.email}</p>
            <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Tracking Timeline */}
      <OrderTrackingTimeline status={order.status} orderDate={order.date} />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium">{item.name}</h5>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <p>Qty: {item.quantity}</p>
                    {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                    {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">Need Help?</Link>
        </Button>
      </div>
    </div>
  )
}