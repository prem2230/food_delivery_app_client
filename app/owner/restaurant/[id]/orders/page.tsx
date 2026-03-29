'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { RESTAURANT_OWNER_ONLY } from '@/lib/route-access'
import { orderAPI } from '@/lib/api'
import { Order, OrderItem } from '@/types/order'
import { ArrowLeft, Package, Clock, MapPin } from 'lucide-react'

const STATUS_OPTIONS = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'] as const

function formatItemLabel(item: OrderItem) {
    if (item.name) return item.name
    const id = typeof item.foodItemId === 'string' ? item.foodItemId : String(item.foodItemId)
    return `Item ·${id.slice(-6)}`
}

function OwnerOrdersContent() {
    const params = useParams()
    const router = useRouter()
    const restaurantId = typeof params?.id === 'string' ? params.id : ''
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [updating, setUpdating] = useState<string | null>(null)

    const load = useCallback(async () => {
        if (!restaurantId) return
        try {
            setLoading(true)
            setError('')
            const res = await orderAPI.getByRestaurant(restaurantId)
            setOrders(res.data.orders || [])
        } catch (e: any) {
            setError(e.response?.data?.message || 'Failed to load orders')
            setOrders([])
        } finally {
            setLoading(false)
        }
    }, [restaurantId])

    useEffect(() => {
        load()
    }, [load])

    const handleStatus = async (orderId: string, status: string) => {
        setUpdating(orderId)
        try {
            await orderAPI.updateStatus(orderId, status)
            await load()
        } catch (e: any) {
            alert(e.response?.data?.message || 'Could not update status')
        } finally {
            setUpdating(null)
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            <Header />

            <main className="relative z-10 container mx-auto px-4 py-8">
                <Button
                    variant="outline"
                    onClick={() => router.push('/owner')}
                    className="border-white/20 text-white bg-glass mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                </Button>

                <h1 className="text-3xl font-bold text-white mb-2">
                    Kitchen <span className="gradient-text">orders</span>
                </h1>
                <p className="text-white/70 mb-8">Update order status as you prepare and deliver</p>

                {loading && <p className="text-white/60">Loading...</p>}
                {error && <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 text-red-300 mb-6">{error}</div>}

                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order._id} className="bg-glass border-white/20">
                            <CardHeader>
                                <div className="flex flex-wrap justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Package className="w-5 h-5" />#{order._id.slice(-6)}
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/70">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {new Date(order.createdAt).toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1 max-w-md">
                                                <MapPin className="w-4 h-4 shrink-0" />
                                                {order.deliveryAddress}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge className="bg-purple-600/80 text-white h-fit">{order.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 mb-4">
                                    {order.items.map((item, idx) => (
                                        <div key={`${order._id}-${idx}`} className="flex justify-between text-white/90">
                                            <span>
                                                {formatItemLabel(item)} × {item.quantity}
                                            </span>
                                            <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-bold text-white pt-2 border-t border-white/10">
                                        <span>Total</span>
                                        <span className="gradient-text">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                {order.status !== 'Delivered' && order.status !== 'Cancelled' && order.status !== 'Failed' && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-white/70 text-sm mr-2">Set status:</span>
                                        {STATUS_OPTIONS.map((s) => (
                                            <Button
                                                key={s}
                                                size="default"
                                                variant="outline"
                                                disabled={updating === order._id}
                                                className="border-white/20 text-white text-xs"
                                                onClick={() => handleStatus(order._id, s)}
                                            >
                                                {s}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {!loading && orders.length === 0 && !error && (
                    <p className="text-center text-white/60 py-16">No orders for this restaurant yet.</p>
                )}

                <p className="text-center mt-10">
                    <Link href={`/owner/restaurant/${restaurantId}/menu`} className="text-purple-300 hover:underline">
                        Back to menu
                    </Link>
                </p>
            </main>
        </div>
    )
}

export default function OwnerOrdersPage() {
    return (
        <ProtectedRoute allowedRoles={RESTAURANT_OWNER_ONLY}>
            <OwnerOrdersContent />
        </ProtectedRoute>
    )
}
