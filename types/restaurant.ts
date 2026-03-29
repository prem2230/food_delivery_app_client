export interface Restaurant {
    _id: string
    name: string
    description?: string
    address: string
    cuisine: string
    contactNumber?: string
    owner?: string
    rating?: number
    deliveryTime?: number
    deliveryFee?: number
    image?: string
    isActive: boolean
}
