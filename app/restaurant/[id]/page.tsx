'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, Clock, MapPin, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { restaurantAPI, foodAPI } from '@/lib/api'

interface Restaurant {
    _id: string
    name: string
    description: string
    address: string
    cuisine: string
    rating?: number
    deliveryTime?: string
    deliveryFee?: number
}

interface FoodItem {
    _id: string
    name: string
    description: string
    price: number
    category: string
    image?: string
    isAvailable: boolean
    restaurantId: string
}

export default function RestaurantPage({ params }: { params: { id: string } }) {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
    const [foodItems, setFoodItems] = useState<FoodItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const { isAuthenticated } = useAuthStore()
    const { items, addItem, updateQuantity } = useCartStore()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }
        fetchData()
    }, [isAuthenticated, router, params.id])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [restaurantRes, foodRes] = await Promise.all([
                restaurantAPI.getById(params.id),
                foodAPI.getByRestaurant(params.id)
            ])

            setRestaurant(restaurantRes.data.restaurant)
            setFoodItems(foodRes.data.foodItems || [])
        } catch (error: any) {
            console.error('Error fetching data:', error)
            setError(error.response?.data?.message || 'Failed to load restaurant data')
        } finally {
            setLoading(false)
        }
    }

    const getItemQuantity = (itemId: string) => {
        const cartItem = items.find(item => item._id === itemId)
        return cartItem?.quantity || 0
    }

    const handleAddToCart = (item: FoodItem) => {
        addItem(item)
    }

    const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
        updateQuantity(itemId, newQuantity)
    }

    if (!isAuthenticated) {
        return <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent mx-auto mb-4"></div>
                <p className="text-white/70">Redirecting to login...</p>
            </div>
        </div>
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="bg-glass rounded-2xl p-8 shadow-glass">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-400 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white/70">Loading restaurant menu...</p>
                </div>
            </div>
        )
    }

    if (error || !restaurant) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="bg-glass rounded-2xl p-8 shadow-glass text-center">
                    <p className="text-red-400 mb-4">{error || 'Restaurant not found'}</p>
                    <Button onClick={() => router.back()} className="gradient-primary">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    // Group items by category
    const groupedItems = foodItems.reduce((acc, item) => {
        const category = item.category || 'Other'
        if (!acc[category]) acc[category] = []
        acc[category].push(item)
        return acc
    }, {} as Record<string, FoodItem[]>)

    const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Header */}
            <header className="relative z-10 bg-glass border-b border-white/10 sticky top-0">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-6">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="border-white/20 text-white bg-glass hover:bg-white/15 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Restaurants
                        </Button>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-glass rounded-full">
                                <ShoppingCart className="w-5 h-5 text-white" />
                                <span className="text-white font-medium">{items.length} items</span>
                                {items.length > 0 && (
                                    <Badge className="gradient-primary animate-glow">
                                        ${cartTotal.toFixed(2)}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 container mx-auto px-4 py-8">
                {/* Restaurant Info */}
                <div className="bg-glass rounded-3xl p-8 shadow-glass mb-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
                                    <p className="text-white/70">{restaurant.description}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm">
                                <Badge className="gradient-primary text-white">{restaurant.cuisine}</Badge>

                                {restaurant.rating && (
                                    <div className="flex items-center gap-1 bg-glass px-3 py-1 rounded-full">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-white font-medium">{restaurant.rating}</span>
                                    </div>
                                )}

                                {restaurant.deliveryTime && (
                                    <div className="flex items-center gap-1 text-white/70 bg-glass px-3 py-1 rounded-full">
                                        <Clock className="w-4 h-4" />
                                        <span>{restaurant.deliveryTime}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-1 text-white/70 bg-glass px-3 py-1 rounded-full">
                                    <MapPin className="w-4 h-4" />
                                    <span>{restaurant.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                {Object.keys(groupedItems).length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-glass rounded-3xl p-12 shadow-glass max-w-md mx-auto">
                            <div className="text-6xl mb-6">🍽️</div>
                            <h3 className="text-2xl font-bold text-white mb-4">No menu items available</h3>
                            <p className="text-white/70">This restaurant hasn't added any items yet.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedItems).map(([category, items]) => (
                            <div key={category}>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm">🍴</span>
                                    </div>
                                    {category}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {items.map((item) => {
                                        const quantity = getItemQuantity(item._id)
                                        return (
                                            <div key={item._id} className="bg-glass rounded-2xl p-6 shadow-glass hover:shadow-glow transition-all duration-300 group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-white text-lg mb-2 group-hover:gradient-text transition-all">{item.name}</h3>
                                                        <p className="text-white/70 text-sm mb-3">{item.description}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl font-bold gradient-text">${item.price}</span>
                                                            {!item.isAvailable && (
                                                                <Badge variant="destructive" className="bg-red-500/80 text-white text-xs">Out of Stock</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    {quantity === 0 ? (
                                                        <Button
                                                            onClick={() => handleAddToCart(item)}
                                                            disabled={!item.isAvailable}
                                                            className="w-full gradient-primary hover:shadow-glow transition-all duration-300"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Add to Cart
                                                        </Button>
                                                    ) : (
                                                        <div className="flex items-center gap-3 w-full">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleUpdateQuantity(item._id, quantity - 1)}
                                                                className="border-white/20 text-white bg-glass hover:bg-white/15"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </Button>
                                                            <span className="font-bold text-white px-4 py-2 bg-glass rounded-lg">{quantity}</span>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleUpdateQuantity(item._id, quantity + 1)}
                                                                className="border-white/20 text-white bg-glass hover:bg-white/15"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </Button>
                                                            <div className="ml-auto">
                                                                <span className="text-lg font-bold gradient-text">
                                                                    ${(item.price * quantity).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
