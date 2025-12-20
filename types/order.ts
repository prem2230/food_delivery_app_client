export interface Order {
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