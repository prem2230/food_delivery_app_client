import { CartItem } from './restaurant'

export interface Order {
    _id: string
    userId: string
    restaurantId: string
    items: CartItem[]
    totalAmount: number
    status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
    deliveryAddress: string
    createdAt: string
}