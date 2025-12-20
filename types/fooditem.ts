export interface FoodItem {
    _id: string
    name: string
    description: string
    price: number
    category: string
    image?: string
    isAvailable: boolean
    restaurantId: string
}