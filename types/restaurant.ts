export interface Restaurant {
    _id: string
    name: string
    description: string
    address: string
    cuisine: string
    rating?: number
    deliveryTime?: string
    deliveryFee?: number
    image?: string
    isActive: boolean
}
