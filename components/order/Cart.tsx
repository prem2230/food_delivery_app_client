'use client'

import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Minus, Plus, X } from 'lucide-react'
import Link from 'next/link'

export function Cart() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart()

    if (items.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Your cart is empty</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    Cart ({items.length})
                    <Button variant="ghost" size="sm" onClick={clearCart}>
                        Clear
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                        <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeItem(item._id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                        <span>Total: ${total.toFixed(2)}</span>
                    </div>
                    <Link href="/checkout">
                        <Button className="w-full mt-2">Checkout</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
