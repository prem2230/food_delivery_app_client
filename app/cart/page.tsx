'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus, Minus, X, MapPin } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { Header } from '@/components/layout/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { orderAPI } from '@/lib/api'

function CartContent() {
    const [deliveryAddress, setDeliveryAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const { items, updateQuantity, removeItem, clearCart, total } = useCartStore()
    const router = useRouter()

    const handlePlaceOrder = async () => {
        if (!deliveryAddress.trim()) {
            alert('Please enter delivery address')
            return
        }

        setLoading(true)
        try {
            const orderData = {
                items: items.map(item => ({
                    foodItemId: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: total,
                deliveryAddress: deliveryAddress.trim()
            }

            await orderAPI.placeOrder(orderData)
            clearCart()
            router.push('/orders')
        } catch (error: any) {
            console.error('Error placing order:', error)
            alert(error.response?.data?.message || 'Failed to place order')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <Header />

            <main className="relative z-10 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Shopping <span className="gradient-text">Cart</span>
                    </h1>
                    <p className="text-white/70">Review your items and place order</p>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-glass rounded-3xl p-12 shadow-glass max-w-md mx-auto">
                            <ShoppingCart className="w-16 h-16 text-white/50 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">Your cart is empty</h3>
                            <p className="text-white/70 mb-6">Add some delicious items to get started!</p>
                            <Button
                                onClick={() => router.push('/restaurants')}
                                className="gradient-primary hover:shadow-glow"
                            >
                                Browse Restaurants
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <Card key={item._id} className="bg-glass border-white/20 shadow-glass">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                                                <p className="text-white/70 text-sm mb-3">{item.description}</p>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="gradient-primary text-white text-xs">
                                                        {item.category}
                                                    </Badge>
                                                    <span className="text-lg font-bold gradient-text">${item.price}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 ml-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="border-white/20 text-white bg-glass hover:bg-white/15"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <span className="font-bold text-white px-3">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="border-white/20 text-white bg-glass hover:bg-white/15"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => removeItem(item._id)}
                                                    className="border-red-400/20 text-red-400 bg-red-500/10 hover:bg-red-500/20 ml-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-4">
                                            <span className="text-lg font-bold gradient-text">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="bg-glass border-white/20 shadow-glass sticky top-24">
                                <CardHeader>
                                    <CardTitle className="text-white">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-white/70">
                                            <span>Subtotal ({items.length} items)</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-white/70">
                                            <span>Delivery Fee</span>
                                            <span>Free</span>
                                        </div>
                                        <div className="border-t border-white/20 pt-3">
                                            <div className="flex justify-between text-lg font-bold text-white">
                                                <span>Total</span>
                                                <span className="gradient-text">${total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-white/90 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Delivery Address
                                        </Label>
                                        <Input
                                            value={deliveryAddress}
                                            onChange={(e) => setDeliveryAddress(e.target.value)}
                                            placeholder="Enter your delivery address"
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400"
                                        />
                                    </div>

                                    <Button
                                        onClick={handlePlaceOrder}
                                        disabled={loading || !deliveryAddress.trim()}
                                        className="w-full gradient-primary hover:shadow-glow transition-all duration-300"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Placing Order...
                                            </div>
                                        ) : (
                                            'Place Order'
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default function CartPage() {
    return (
        <ProtectedRoute>
            <CartContent />
        </ProtectedRoute>
    )
}
