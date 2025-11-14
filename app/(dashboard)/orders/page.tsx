'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useOrders } from '@/hooks/useOrders'

export default function OrdersPage() {
    const { orders, loading } = useOrders()

    if (loading) {
        return <div className="container mx-auto p-4 text-center">Loading orders...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No orders found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order._id}>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">Order #{order._id.slice(-6)}</CardTitle>
                                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                        {order.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {order.items.map((item) => (
                                        <div key={item._id} className="flex justify-between">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-2 font-semibold">
                                        Total: ${order.totalAmount.toFixed(2)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Delivery to: {order.deliveryAddress}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
