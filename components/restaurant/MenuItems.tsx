'use client'

import { useState, useEffect } from 'react'
import { MenuItem } from '@/types/restaurant'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { foodAPI } from '@/lib/api'

interface MenuItemsProps {
    restaurantId: string
}

export function MenuItems({ restaurantId }: MenuItemsProps) {
    const [items, setItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const { addItem } = useCart()

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await foodAPI.getByRestaurant(restaurantId)
                setItems(response.data.foodItems || [])
            } catch (error) {
                console.error('Failed to fetch menu items:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchItems()
    }, [restaurantId])

    if (loading) {
        return <div className="text-center p-8">Loading menu...</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
                <Card key={item._id}>
                    <CardHeader>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">${item.price}</span>
                            <Button onClick={() => addItem(item)}>Add to Cart</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
