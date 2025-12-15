'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Clock, MapPin, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { Header } from '@/components/layout/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { orderAPI } from '@/lib/api'

interface Order {
    _id: string
    items: Array<{
        _id: string
        name: string
        price: number
        quantity: number
    }>
    totalAmount: number
    status: string
    deliveryAddress: string
    createdAt: string
    restaurantId: string
}

function OrdersContent() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await orderAPI.getMyOrders()
            setOrders(response.data.orders || [])
        } catch (error: any) {
            console.error('Error fetching orders:', error)
            setError(error.response?.data?.message || 'Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    const handleCancelOrder = async (orderId: string) => {
        try {
            await orderAPI.cancelOrder(orderId)
            fetchOrders() // Refresh orders
        } catch (error: any) {
            console.error('Error cancelling order:', error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-500/80'
            case 'confirmed': return 'bg-blue-500/80'
            case 'preparing': return 'bg-orange-500/80'
            case 'out_for_delivery': return 'bg-purple-500/80'
            case 'delivered': return 'bg-green-500/80'
            case 'cancelled': return 'bg-red-500/80'
            default: return 'bg-gray-500/80'
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
                        My <span className="gradient-text">Orders</span>
                    </h1>
                    <p className="text-white/70">Track your food delivery orders</p>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="bg-glass rounded-2xl p-8 shadow-glass">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent mx-auto mb-4"></div>
                            <span className="text-white/70">Loading orders...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-glass border border-red-400/20 rounded-2xl p-6 mb-8 shadow-glass">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button
                            onClick={fetchOrders}
                            className="gradient-primary hover:shadow-glow transition-all"
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-glass rounded-3xl p-12 shadow-glass max-w-md mx-auto">
                            <Package className="w-16 h-16 text-white/50 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">No orders yet</h3>
                            <p className="text-white/70 mb-6">Start ordering from your favorite restaurants!</p>
                            <Button className="gradient-primary hover:shadow-glow">
                                Browse Restaurants
                            </Button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order._id} className="bg-glass border-white/20 shadow-glass hover:shadow-glow transition-all">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-white flex items-center gap-3">
                                            <Package className="w-5 h-5" />
                                            Order #{order._id.slice(-6)}
                                        </CardTitle>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {order.deliveryAddress}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                                            {order.status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                        {order.status === 'pending' && (
                                            <Button
                                                onClick={() => handleCancelOrder(order._id)}
                                                variant="outline"
                                                className="border-red-400/20 text-red-400 bg-red-500/10 hover:bg-red-500/20"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item._id} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                                            <div>
                                                <span className="text-white font-medium">{item.name}</span>
                                                <span className="text-white/60 ml-2">x{item.quantity}</span>
                                            </div>
                                            <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}

                                    <div className="flex justify-between items-center pt-3 border-t border-white/20">
                                        <span className="text-lg font-bold text-white">Total</span>
                                        <span className="text-lg font-bold gradient-text">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default function OrdersPage() {
    return (
        <ProtectedRoute>
            <OrdersContent />
        </ProtectedRoute>
    )
}
