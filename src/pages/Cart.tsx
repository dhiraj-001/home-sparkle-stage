"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface CartItem {
  id: string
  customer_id: string
  provider_id: string | null
  service_id: string
  category_id: string
  sub_category_id: string
  variant_key: string
  service_cost: number
  quantity: number
  discount_amount: number
  coupon_code: string | null
  coupon_discount: number
  campaign_discount: number
  tax_amount: number
  total_cost: number
  created_at: string
  updated_at: string
  is_guest: number
  coupon_id: string
  service: {
    id: string
    name: string
    short_description: string
    description: string
    thumbnail_full_path: string
    cover_image_full_path: string
  }
  category: {
    id: string
    name: string
    image_full_path: string
  }
}

interface CartResponse {
  response_code: string
  message: string
  content: {
    total_cost: number
    referral_amount: number
    wallet_balance: number
    cart: {
      current_page: number
      data: CartItem[]
      first_page_url: string
      from: number
      last_page: number
      last_page_url: string
      links: Array<{
        url: string | null
        label: string
        active: boolean
      }>
      next_page_url: string | null
      path: string
      per_page: number
      prev_page_url: string | null
      to: number
      total: number
    }
  }
  errors: string[]
}

const CartPage: React.FC = () => {
  const [cartData, setCartData] = useState<CartResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  const fetchCartData = async () => {
    const token = localStorage.getItem("demand_token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        "https://admin.sarvoclub.com/api/v1/customer/cart/list?limit=100&offset=1",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-localization": "en",
            zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
            guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
            "Accept-Charset": "UTF-8",
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: CartResponse = await response.json()
      
      if (data.response_code === "default_200") {
        setCartData(data)
      } else {
        throw new Error(data.message || "Failed to fetch cart data")
      }
    } catch (err: any) {
      console.error("Failed to fetch cart data:", err)
      setError(err.message || "An error occurred while fetching cart data")
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const token = localStorage.getItem("demand_token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      setUpdatingItems(prev => new Set(prev).add(itemId))

      const response = await fetch(
        `https://admin.sarvoclub.com/api/v1/customer/cart/update-quantity/${itemId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-localization": "en",
            zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
            guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
            "Accept-Charset": "UTF-8",
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.response_code === "default_update_200") {
        await fetchCartData() // Refresh cart data
      } else {
        throw new Error(data.message || "Failed to update quantity")
      }
    } catch (err: any) {
      console.error("Failed to update quantity:", err)
      setError(err.message || "An error occurred while updating quantity")
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const removeItem = async (itemId: string) => {
    const token = localStorage.getItem("demand_token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      setDeletingItems(prev => new Set(prev).add(itemId))

      const response = await fetch(
        `https://admin.sarvoclub.com/api/v1/customer/cart/remove/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-localization": "en",
            zoneId: "a02c55ff-cb84-4bbb-bf91-5300d1766a29",
            guest_id: "7e223db0-9f62-11f0-bba0-779e4e64bbc8",
            "Accept-Charset": "UTF-8",
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.response_code === "default_delete_200") {
        await fetchCartData() // Refresh cart data
      } else {
        throw new Error(data.message || "Failed to remove item")
      }
    } catch (err: any) {
      console.error("Failed to remove item:", err)
      setError(err.message || "An error occurred while removing item")
    } finally {
      setDeletingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  useEffect(() => {
    fetchCartData()
  }, [])

  const cartItems = cartData?.content.cart.data || []
  const totalCost = cartData?.content.total_cost || 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading your cart...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
          </div>
          
          {cartItems.length > 0 && (
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">₹{totalCost}</p>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Your cart is empty</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Looks like you haven't added any services to your cart yet.
              </p>
              <Button onClick={() => navigate("/")} className="mt-4">
                Browse Services
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Service Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.service.thumbnail_full_path || "/placeholder.svg"}
                          alt={item.service.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
                        />
                      </div>

                      {/* Service Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-lg truncate">
                              {item.service.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {item.service.short_description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.category.name}
                              </span>
                              {item.variant_key && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {item.variant_key}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={deletingItems.has(item.id)}
                            className="flex-shrink-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          >
                            {deletingItems.has(item.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Price and Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                                className="h-8 w-8"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <span className="w-8 text-center font-medium">
                                {updatingItems.has(item.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={updatingItems.has(item.id)}
                                className="h-8 w-8"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Price Display */}
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                {item.campaign_discount > 0 && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{item.service_cost}
                                  </span>
                                )}
                                <span className="text-lg font-bold text-gray-900">
                                  ₹{item.total_cost}
                                </span>
                              </div>
                              {item.campaign_discount > 0 && (
                                <span className="text-xs text-green-600 font-medium">
                                  Save ₹{item.campaign_discount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{totalCost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600">
                        -₹{cartItems.reduce((sum, item) => sum + item.campaign_discount, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span>₹{cartItems.reduce((sum, item) => sum + item.tax_amount, 0)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-lg">₹{totalCost}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Continue Shopping
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default CartPage