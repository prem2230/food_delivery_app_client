export interface Restaurant {
    _id: string
    name: string
    description: string
    address: string
    cuisine: string
    rating: number
    deliveryTime: string
    deliveryFee: number
    image?: string
    isActive: boolean
}

export interface MenuItem {
    _id: string
    name: string
    description: string
    price: number
    category: string
    image?: string
    isAvailable: boolean
    restaurantId: string
}

export interface CartItem extends MenuItem {
    quantity: number
}