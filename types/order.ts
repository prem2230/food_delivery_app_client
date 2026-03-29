export interface OrderItem {
    foodItemId: string
    price: number | string
    quantity: number
    name?: string
}

export interface Order {
    _id: string
    items: OrderItem[]
    totalAmount: number
    status: string
    deliveryAddress: string
    createdAt: string
    restaurantId: string
    restaurantOwnerId?: string
    failureReason?: string
}
